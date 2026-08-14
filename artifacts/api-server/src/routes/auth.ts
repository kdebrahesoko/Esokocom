/**
 * auth.ts — Named-user authentication routes
 *
 * POST /api/auth/login   — email + password, rate-limited
 * POST /api/auth/logout  — clears DB session
 * GET  /api/auth/me      — returns current user info
 * GET  /api/users        — list users (SUPER_ADMIN only)
 * POST /api/users        — create user (SUPER_ADMIN only)
 * PUT  /api/users/:id    — update user (SUPER_ADMIN only)
 * DELETE /api/users/:id  — deactivate user (SUPER_ADMIN only)
 */
import { Router, type IRouter, type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";
import {
  createSession, deleteSession, validateSession, verifyPassword, hashPassword,
  setSessionCookie, clearSessionCookie, requireRole, audit,
  SESSION_COOKIE,
} from "../lib/auth";
// Backward compat — keep old login shim working
import {
  ADMIN_COOKIE, SESSION_TTL_MS as LEGACY_TTL, activeSessions, createSession as legacyCreateSession,
} from "../lib/adminAuth";

const router: IRouter = Router();

/* ── Rate limiter: max 10 login attempts per 15 min per IP ──────────── */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Please try again in 15 minutes." },
  skip: () => process.env.NODE_ENV === "test",
});

/* ── Zod schemas ─────────────────────────────────────────────────────── */
const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(1),
});

const createUserSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1).max(100),
  role: z.enum(["SUPER_ADMIN", "HR_ADMIN", "CONTENT_EDITOR", "CONTENT_AUTHOR"]),
});

const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  role: z.enum(["SUPER_ADMIN", "HR_ADMIN", "CONTENT_EDITOR", "CONTENT_AUTHOR"]).optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(8).optional(),
});

/* ── POST /api/auth/login ────────────────────────────────────────────── */
router.post("/auth/login", loginLimiter, async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const { email, password } = parsed.data;
  const ip = req.ip ?? req.socket?.remoteAddress ?? "unknown";

  try {
    const rows = await db.select().from(usersTable)
      .where(eq(usersTable.email, email)).limit(1);

    if (rows.length === 0) {
      audit({ action: "login_failed", metadata: { reason: "user_not_found", email }, ip });
      // Return same error as wrong password to avoid email enumeration
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const user = rows[0];

    if (!user.isActive) {
      audit({ userId: user.id, action: "login_failed", metadata: { reason: "account_inactive" }, ip });
      res.status(401).json({ error: "Account is inactive. Contact your administrator." });
      return;
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      audit({ userId: user.id, action: "login_failed", metadata: { reason: "wrong_password" }, ip });
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = await createSession(user.id);
    setSessionCookie(res, token);
    audit({ userId: user.id, action: "login", ip });

    res.json({
      ok: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    logger.error({ err }, "POST /auth/login failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ── POST /api/auth/logout ───────────────────────────────────────────── */
router.post("/auth/logout", async (req: Request, res: Response) => {
  const cookies = req.cookies as Record<string, string>;

  // New session: resolve user BEFORE deleting so we can audit correctly
  const token = cookies[SESSION_COOKIE];
  if (token) {
    try {
      // validateSession returns the user; use it for audit, then delete
      const user = await validateSession(token);
      await deleteSession(token);
      if (user) {
        audit({ userId: user.id, action: "logout", ip: req.ip });
      }
    } catch { /* best effort */ }
    clearSessionCookie(res);
  }

  // Also clear legacy cookie
  const legacyToken = cookies[ADMIN_COOKIE];
  if (legacyToken) {
    activeSessions.delete(legacyToken);
    res.clearCookie(ADMIN_COOKIE);
  }

  res.json({ ok: true });
});

/* ── GET /api/auth/me ────────────────────────────────────────────────── */
router.get("/auth/me", requireRole(), async (req: Request, res: Response) => {
  if (req.user) {
    res.json({
      authenticated: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
      },
    });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

/* ──────────────────────────────────────────────────────────────────────
   Legacy shim: POST /api/admin/login
   Accepts ADMIN_API_KEY password — kept for backward compat.
   New code should use POST /api/auth/login with email + password.
   ────────────────────────────────────────────────────────────────────── */
router.post("/admin/login", loginLimiter, (req: Request, res: Response) => {
  const { password } = req.body as { password?: string };
  const expected = process.env.ADMIN_API_KEY;
  if (!expected) {
    res.status(503).json({ error: "ADMIN_API_KEY not configured" });
    return;
  }
  if (!password || password !== expected) {
    res.status(401).json({ error: "Incorrect password" });
    return;
  }
  const token = legacyCreateSession();
  res.cookie(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: LEGACY_TTL,
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ ok: true });
});

/* ── Legacy GET /api/admin/me — backward compat ─────────────────────── */
router.get("/admin/me", requireRole(), (_req, res) => {
  res.json({ authenticated: true, user: _req.user });
});

/* ── Legacy POST /api/admin/logout — backward compat ───────────────── */
router.post("/admin/logout", async (req: Request, res: Response) => {
  const cookies = req.cookies as Record<string, string>;
  const legacyToken = cookies[ADMIN_COOKIE];
  if (legacyToken) {
    activeSessions.delete(legacyToken);
    res.clearCookie(ADMIN_COOKIE);
  }
  const newToken = cookies[SESSION_COOKIE];
  if (newToken) {
    try { await deleteSession(newToken); } catch { /* best effort */ }
    clearSessionCookie(res);
  }
  res.json({ ok: true });
});

/* ──────────────────────────────────────────────────────────────────────
   Users management (SUPER_ADMIN only)
   ────────────────────────────────────────────────────────────────────── */

/* GET /api/users ────────────────────────────────────────────────────── */
router.get("/users", requireRole("SUPER_ADMIN"), async (_req, res) => {
  try {
    const users = await db.select({
      id: usersTable.id,
      email: usersTable.email,
      name: usersTable.name,
      role: usersTable.role,
      isActive: usersTable.isActive,
      createdAt: usersTable.createdAt,
      updatedAt: usersTable.updatedAt,
    }).from(usersTable).orderBy(usersTable.createdAt);
    res.json({ users });
  } catch (err) {
    logger.error({ err }, "GET /users failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

/* POST /api/users ───────────────────────────────────────────────────── */
router.post("/users", requireRole("SUPER_ADMIN"), async (req: Request, res: Response) => {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    return;
  }
  try {
    const { email, password, name, role } = parsed.data;
    const existing = await db.select({ id: usersTable.id }).from(usersTable)
      .where(eq(usersTable.email, email)).limit(1);
    if (existing.length > 0) {
      res.status(409).json({ error: "A user with this email already exists" });
      return;
    }
    const passwordHash = await hashPassword(password);
    const [user] = await db.insert(usersTable).values({
      email, passwordHash, name, role, isActive: true,
    }).returning({
      id: usersTable.id, email: usersTable.email, name: usersTable.name,
      role: usersTable.role, isActive: usersTable.isActive, createdAt: usersTable.createdAt,
    });
    audit({
      userId: req.user?.id ?? null,
      action: "user_created",
      entityType: "user",
      entityId: user.id,
      metadata: { email, role },
      ip: req.ip,
    });
    res.status(201).json({ user });
  } catch (err) {
    logger.error({ err }, "POST /users failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

/* PUT /api/users/:id ────────────────────────────────────────────────── */
router.put("/users/:id", requireRole("SUPER_ADMIN"), async (req: Request, res: Response) => {
  const parsed = updateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    return;
  }
  try {
    const userId = parseInt(req.params['id'] as string);
    if (isNaN(userId)) { res.status(400).json({ error: "Invalid user id" }); return; }

    const { password, ...rest } = parsed.data;
    const updates: Partial<typeof usersTable.$inferInsert> = {
      ...rest,
      updatedAt: new Date(),
    };
    if (password) {
      updates.passwordHash = await hashPassword(password);
    }

    const [user] = await db.update(usersTable).set(updates)
      .where(eq(usersTable.id, userId))
      .returning({
        id: usersTable.id, email: usersTable.email, name: usersTable.name,
        role: usersTable.role, isActive: usersTable.isActive,
      });

    if (!user) { res.status(404).json({ error: "User not found" }); return; }

    audit({
      userId: req.user?.id ?? null,
      action: "user_updated",
      entityType: "user",
      entityId: userId,
      metadata: { changes: Object.keys(rest) },
      ip: req.ip,
    });
    res.json({ user });
  } catch (err) {
    logger.error({ err }, "PUT /users/:id failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

/* DELETE /api/users/:id — deactivates, never hard-deletes ───────────── */
router.delete("/users/:id", requireRole("SUPER_ADMIN"), async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params['id'] as string);
    if (isNaN(userId)) { res.status(400).json({ error: "Invalid user id" }); return; }

    // Prevent self-deactivation
    if (req.user?.id === userId) {
      res.status(400).json({ error: "You cannot deactivate your own account" });
      return;
    }

    const [user] = await db.update(usersTable)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(usersTable.id, userId))
      .returning({ id: usersTable.id, email: usersTable.email });

    if (!user) { res.status(404).json({ error: "User not found" }); return; }

    audit({
      userId: req.user?.id ?? null,
      action: "user_deactivated",
      entityType: "user",
      entityId: userId,
      ip: req.ip,
    });
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "DELETE /users/:id failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ── GET /api/audit-logs (SUPER_ADMIN only) ─────────────────────────── */
router.get("/audit-logs", requireRole("SUPER_ADMIN"), async (req: Request, res: Response) => {
  try {
    const page  = Math.max(1, parseInt(String(req.query['page']  ?? "1")));
    const limit = Math.min(100, Math.max(1, parseInt(String(req.query['limit'] ?? "50"))));
    const offset = (page - 1) * limit;

    const rows = await db.execute<{
      id: number; action: string; entity_type: string | null; entity_id: string | null;
      metadata: string | null; ip: string | null; created_at: Date;
      user_email: string | null; user_name: string | null;
    }>(
      `SELECT al.id, al.action, al.entity_type, al.entity_id, al.metadata, al.ip, al.created_at,
              u.email AS user_email, u.name AS user_name
       FROM audit_logs al
       LEFT JOIN users u ON u.id = al.user_id
       ORDER BY al.created_at DESC
       LIMIT ${limit} OFFSET ${offset}`
    );

    const countRows = await db.execute<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM audit_logs`
    );
    const total = parseInt(countRows.rows[0]?.count ?? "0");

    res.json({
      logs: rows.rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    logger.error({ err }, "GET /audit-logs failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
