/**
 * adminAuth.ts
 *
 * Server-side session-cookie authentication for the HR admin dashboard.
 * The ADMIN_API_KEY secret is read from environment only — it is never
 * sent to the browser.
 */
import { randomBytes } from "crypto";
import type { Request, Response, NextFunction } from "express";

export const ADMIN_COOKIE = "esoko_admin_sess";
export const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

/** In-memory session store: token → expiry timestamp */
export const activeSessions = new Map<string, number>();

function pruneExpired() {
  const now = Date.now();
  for (const [token, expiry] of activeSessions) {
    if (expiry < now) activeSessions.delete(token);
  }
}

/** Create a new session token and register it */
export function createSession(): string {
  pruneExpired();
  const token = randomBytes(32).toString("hex");
  activeSessions.set(token, Date.now() + SESSION_TTL_MS);
  return token;
}

/** Express middleware — rejects requests without a valid admin session cookie */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  pruneExpired();
  const token = (req.cookies as Record<string, string>)[ADMIN_COOKIE];
  const expiry = token ? activeSessions.get(token) : undefined;
  if (!token || expiry === undefined || expiry < Date.now()) {
    res.status(401).json({ error: "Not authenticated — please log in at /admin/login" });
    return;
  }
  next();
}
