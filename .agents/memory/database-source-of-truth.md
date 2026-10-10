---
name: Database source of truth
description: User requires Replit-managed PostgreSQL only and staged approval for database work.
---

Use Replit-managed PostgreSQL only through the existing `DATABASE_URL`. Do not
use the external server or overwrite Replit-managed database variables.

**Why:** The user explicitly replaced the previous external-database choice with
a managed-database-only requirement.

**How to apply:** Preserve all existing data, authentication, sessions, roles,
and historical migrations. Follow staged approval: development code changes,
then migration preparation for review, then separately approved exact SQL.
No destructive operations, external database access, managed-variable changes,
or production operations are authorized by development approval.
