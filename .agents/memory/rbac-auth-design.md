---
name: RBAC auth design
description: Key decisions for the named-user RBAC system replacing ADMIN_API_KEY — cookie names, session storage, backward compat, bootstrap
---

## Auth system design

**Cookie names**
- New sessions: `esoko_sess` (DB-backed, SHA-256 hashed token stored in `sessions` table)
- Legacy compat: `esoko_admin_sess` (in-memory Map in `adminAuth.ts`) — kept alive during migration

**requireRole() middleware** (in `auth.ts`) checks BOTH cookies:
1. `esoko_sess` → validates against DB sessions table, reads role from users table
2. `esoko_admin_sess` → validates against in-memory activeSessions, grants SUPER_ADMIN (backward compat)

**SUPER_ADMIN bootstrap**
- Set `SUPER_ADMIN_EMAIL` + `SUPER_ADMIN_PASSWORD` Replit secrets
- `bootstrapSuperAdmin()` runs on server start (idempotent — skips if email already exists)
- Bootstrap is the only way to create the first user; subsequent users created via `POST /api/users`

**Role enum** (DB + TS): `SUPER_ADMIN` | `HR_ADMIN` | `CONTENT_EDITOR` | `CONTENT_AUTHOR`

## Immediate farm-data publishing

Only `SUPER_ADMIN` and `CONTENT_EDITOR` may create, update, or delete advisories, market prices, and SMS alerts.

**Why:** These records become farmer-facing immediately on the mobile app's next refresh; unlike draft resources, there is no editorial review state that would make author-level writes safe.

**How to apply:** Keep both API middleware and admin navigation/page access aligned with this restriction whenever farm-data management is extended.

**Why:** The `declare global { namespace Express { interface Request { user? } } }` augmentation pattern is required (not `declare module "express-serve-static-core"`) because the api-server tsconfig sets `"types": ["node"]` only.

**Audit logs**: fire-and-forget via `audit()` helper — never blocks request. Logs: login, logout, login_failed, user_created, user_updated, user_deactivated, application_stage_changed.

**Rate limit**: 10 attempts / 15 min per IP on `POST /api/auth/login` AND legacy `POST /api/admin/login`. Skipped when `NODE_ENV === "test"`.

**New routes**
- `POST /api/auth/login` — email + password, rate-limited
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET/POST/PUT/DELETE /api/users` — SUPER_ADMIN only
- `GET /api/audit-logs` — SUPER_ADMIN only, paginated

**Legacy shims** (kept in `auth.ts`)
- `POST /api/admin/login` — ADMIN_API_KEY password → old cookie
- `GET /api/admin/me` — works with both cookies
- `POST /api/admin/logout` — clears both cookies
