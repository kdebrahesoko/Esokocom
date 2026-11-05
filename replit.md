# [Project name]

_Replace the heading above with the project's name, and this line with one sentence describing what this app does for users._

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- Database preparation: follow the separately approved, reviewed workflow in `lib/db/README.md`; do not run unattended schema pushes.
- Required env: existing Replit-managed `DATABASE_URL` — never override it or print credentials.
- Use Replit-managed PostgreSQL only; do not connect to the external server.
- API startup checks connectivity/table presence read-only, then retains existing bootstrap and scheduling behavior.
- Keep development and production separate. Production schema updates use Replit Publish with separate approval; never startup migrations or schema-changing build hooks.

## Database verification evidence and limitations

- Scope: development database setup only. The user deferred live isolated restore verification to the separate “Isolated backup restore test” follow-up; it must pass before the first production publish. Closing development setup does not certify recoverability or production readiness.
- Recorded development audit: 19 public tables, 159 public columns, 48 public constraints, eight enums, and all three migration-ledger hashes/timestamps matched the historical SQL and migration journal. These are historical audit results, not database checks rerun during documentation closure.
- Backup evidence: the development archive exported on 2026-10-10 was validated offline, including its inventory and complete SQL rendering. It covers 19 public data tables and the Drizzle ledger; it does not cover uploaded files, environment secrets, or cluster-wide roles.
- The 72,227-byte archive's SHA-256 was reverified during the approved private download: `7182129e08817ff38790b67ad33345a6796547b2f0f733f666854a7a160c33e4`. A matching checksum and offline inspection do not demonstrate a successful live restore.
- On 2026-11-05, the approved development API restart logged “Database readiness verified,” “Server listening” on port 8080, and Resources scheduler startup. The development health endpoint returned HTTP 200 with `{"status":"ok"}`. No startup errors or scheduler publication events appeared in the captured logs; no independent row-difference audit was performed.
- Readiness verifies connectivity and expected table presence, not every column, constraint, enum, or application journey. Source inspection confirms startup does not invoke migrations or schema pushes; the build copies migration files without executing them.
- Administrator bootstrap is keyed to the configured admin email, not the existence of any administrator globally. It skips if that email already belongs to any user, without promoting that user. On the verified development restart it skipped because its credentials were unset.
- Before the first production start, securely configure `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD` for administrator bootstrap onboarding; never put their values in documentation or Git. Bootstrap is not guaranteed to create an administrator if the configured email already exists. No production secret changes are authorized by development closure.
- Startup is not read-only: bootstrap can insert a user, and the Resources scheduler runs immediately and can update resources and write audit records. Future restarts require approval that accounts for these normal operations.
- A separate project named “Esoko Recovery Verification” was reported, but its isolation and a successful restore have not been evidenced here. Complete the follow-up's target checks, restore, schema/ledger/record comparisons, and dated pass/fail report before publishing; do not restore into the Esoko application workspace.
- Production readiness, ownership/grant recovery, and uploaded-file recovery remain uncertified. This documentation closure performs no database operations, service restarts, environment changes, or publishing, and authorizes no production operations.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
