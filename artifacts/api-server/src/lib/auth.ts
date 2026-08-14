/**
 * auth.ts
 *
 * Named-user authentication with role-based access control.
 * Replaces the single ADMIN_API_KEY model with proper named accounts,
 * bcrypt-hashed passwords, DB-persisted sessions, and role checks.
 *
 * Backward compat: requireRole() also accepts the old esoko_admin_sess cookie
 * so existing admin functionality keeps working during migration.
 */
import { createHash, randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import type { Request, Response, NextFunction } from "express";
import { db } from "@workspace/db";
import { usersTable, sessionsTable, auditLogsTable, type UserRole } from "@workspace/db";
import { eq, and, gt, sql } from "drizzle-orm";
import { logger } from "./logger";
import { activeSessions, ADMIN_COOKIE } from "./adminAuth"; // backward compat

/* ── Constants ───────────────────────────────────────────────────────── */
export const SESSION_COOKIE = "esoko_sess";
export const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours
export const BCRYPT_ROUNDS   = 12;

/* ── Type augmentation so handlers can read req.user ───────────────── */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: {
        id: number | null;
        email: string;
        name: string;
        role: UserRole;
      };
    }
  }
}

/* ── Token helpers ───────────────────────────────────────────────────── */
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/* ── Password helpers ────────────────────────────────────────────────── */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/* ── Session management ──────────────────────────────────────────────── */
export async function createSession(userId: number): Promise<string> {
  // Prune expired sessions for this user (best-effort housekeeping)
  db.delete(sessionsTable)
    .where(and(eq(sessionsTable.userId, userId), gt(sql`now()`, sessionsTable.expiresAt)))
    .catch(() => {/* non-blocking */});

  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await db.insert(sessionsTable).values({ userId, tokenHash, expiresAt });
  return token;
}

export async function validateSession(token: string): Promise<{
  id: number; email: string; name: string; role: UserRole; isActive: boolean;
} | null> {
  const tokenHash = hashToken(token);
  const rows = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      name: usersTable.name,
      role: usersTable.role,
      isActive: usersTable.isActive,
    })
    .from(sessionsTable)
    .innerJoin(usersTable, eq(sessionsTable.userId, usersTable.id))
    .where(
      and(
        eq(sessionsTable.tokenHash, tokenHash),
        gt(sessionsTable.expiresAt, sql`now()`),
      ),
    )
    .limit(1);

  if (rows.length === 0) return null;
  const user = rows[0];
  if (!user.isActive) return null;
  return user;
}

export async function deleteSession(token: string): Promise<void> {
  const tokenHash = hashToken(token);
  await db.delete(sessionsTable).where(eq(sessionsTable.tokenHash, tokenHash));
}

/* ── Cookie helpers ──────────────────────────────────────────────────── */
export function setSessionCookie(res: Response, token: string): void {
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: SESSION_TTL_MS,
    secure: process.env.NODE_ENV === "production",
  });
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(SESSION_COOKIE);
}

/* ── requireRole middleware ──────────────────────────────────────────── */
/**
 * Express middleware that checks authentication and role.
 *
 * Accepts:
 *   1. New DB-backed session cookie (esoko_sess) → role from DB
 *   2. Legacy ADMIN_API_KEY session cookie (esoko_admin_sess) → treated as SUPER_ADMIN
 *
 * Attaches req.user if authenticated. Pass no roles to allow any authenticated user.
 */
export function requireRole(...roles: UserRole[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const cookies = req.cookies as Record<string, string>;

    // 1. Try new session cookie
    const newToken = cookies[SESSION_COOKIE];
    if (newToken) {
      try {
        const user = await validateSession(newToken);
        if (user) {
          if (roles.length > 0 && !roles.includes(user.role)) {
            res.status(403).json({ error: "Insufficient permissions" });
            return;
          }
          req.user = { id: user.id, email: user.email, name: user.name, role: user.role };
          next();
          return;
        }
      } catch (err) {
        logger.error({ err }, "Session validation error");
      }
    }

    // 2. Backward compat: legacy ADMIN_API_KEY cookie → SUPER_ADMIN
    const legacyToken = cookies[ADMIN_COOKIE];
    if (legacyToken) {
      const expiry = activeSessions.get(legacyToken);
      if (expiry && expiry > Date.now()) {
        // All roles are allowed via the legacy admin key (it's a SUPER_ADMIN-level token)
        req.user = { id: null, email: "admin@esoko.com", name: "Admin", role: "SUPER_ADMIN" };
        next();
        return;
      }
    }

    res.status(401).json({ error: "Not authenticated — please log in at /admin/login" });
  };
}

/* ── Audit logging ───────────────────────────────────────────────────── */
export function audit(params: {
  userId?: number | null;
  action: string;
  entityType?: string;
  entityId?: string | number;
  metadata?: Record<string, unknown>;
  ip?: string;
}): void {
  // Fire-and-forget — never block a request for logging
  const safeMetadata = params.metadata
    ? JSON.stringify(params.metadata)
    : "{}";

  db.insert(auditLogsTable).values({
    userId: params.userId ?? null,
    action: params.action,
    entityType: params.entityType ?? null,
    entityId: params.entityId !== undefined ? String(params.entityId) : null,
    metadata: safeMetadata,
    ip: params.ip ?? null,
  }).catch(err => {
    logger.error({ err }, "audit log insert failed");
  });
}

/* ── SUPER_ADMIN bootstrap ───────────────────────────────────────────── */
export async function bootstrapSuperAdmin(): Promise<void> {
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!email || !password) {
    logger.info("SUPER_ADMIN_EMAIL / SUPER_ADMIN_PASSWORD not set — skipping bootstrap");
    return;
  }

  try {
    const existing = await db.select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase()))
      .limit(1);

    if (existing.length > 0) {
      logger.info("Super-admin already exists — skipping bootstrap");
      return;
    }

    const passwordHash = await hashPassword(password);
    await db.insert(usersTable).values({
      email: email.toLowerCase(),
      passwordHash,
      name: "Super Admin",
      role: "SUPER_ADMIN",
      isActive: true,
    });
    logger.info({ email }, "Super-admin account bootstrapped");
  } catch (err) {
    logger.error({ err }, "Failed to bootstrap super-admin");
  }
}
