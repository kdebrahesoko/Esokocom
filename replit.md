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

## Database verification limitations

- Source inspection confirms the API entry point calls read-only database readiness checks, not migrations or schema pushes. The API build copies migration files but does not execute them.
- Restarting the API is not a read-only operation: administrator bootstrap can insert a user, and the Resources scheduler runs immediately and can update resources and write audit records. Do not restart under a no-data-modification authorization.
- The operator reports a separate empty project, “Esoko Recovery Verification,” with its own database. Its destination identity, emptiness, permissions, and isolation have not been independently verified here.
- An archive validation or a restore command proposal is not a demonstrated recovery. Successful isolated restoration, schema/ledger/record comparisons, and controlled API runtime verification remain required before database setup can be certified complete.
- This verification pass did not restart the API, connect to a database, execute SQL or migrations, change environment variables, or access production. Live readiness and error-free startup were not tested.
- Production readiness, ownership/grant recovery, and recovery of uploaded files or other non-database assets remain uncertified. No publishing or production operation is authorized by development verification.

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
