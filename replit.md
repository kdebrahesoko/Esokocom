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

## Next.js migration status

The existing website remains at `/`; the parallel preview is `/esoko-next/`.
No public switchover or publication is authorized. The inventory below comes
from the existing Wouter router and public content, audited on 2026-11-07.
There are 22 registered patterns and one catch-all. “Migrated” refers to
matching Next preview paths, not replacing the existing website.

| Existing route | Classification | Status after Phase 6 |
| --- | --- | --- |
| `/` | Public content; embedded contact/demo handoff | Migrated |
| `/company` | Public content and leadership | Migrated |
| `/products-services` | Public content | Migrated in Phase 6 |
| `/sectors` | Interactive public content | Migrated in Phase 6 |
| `/sectors/:slug` | Eight public sector details | Migrated in Phase 6 |
| `/solutions/:slug` | Eight public solution details | Migrated in Phase 6 |
| `/pricing` | Public enterprise-quote content; sales handoff | Migrated in Phase 6 |
| `/careers` | Public vacancy listing | Migrated |
| `/careers/:id` | Public vacancy detail; application entry | Content migrated; application submission hands off to existing site |
| `/resources` | Public content landing | Migrated |
| `/resources/:type` | Public content listings | Migrated |
| `/resources/:type/:slug` | Published public content detail | Migrated |
| `/admin/login` | Staff authentication form | Existing site only |
| `/admin` | Authenticated staff dashboard | Existing site only |
| `/admin/audit-logs` | Authenticated audit administration | Existing site only |
| `/admin/careers` | Authenticated HR management/forms | Existing site only |
| `/admin/users` | Authenticated user administration/forms | Existing site only |
| `/admin/resources` | Authenticated CMS dashboard | Existing site only |
| `/admin/resources/new` | Authenticated CMS create form | Existing site only |
| `/admin/resources/:id/edit` | Authenticated CMS edit form | Existing site only |
| `/admin/resources/:type` | Authenticated CMS listing | Existing site only |
| `/admin/farm-data` | Authenticated farm-data administration/forms | Existing site only |
| Any unmatched path | Not-found/catch-all | Next has its own not-found; unknown content slugs must return 404 |

Concrete source-defined public route expansions:
- `/sectors/`: `agriculture`, `government`, `ngos-development`, `education`,
  `sustainability`, `financial-inclusion`, `renewable-energy`, `supply-chain`.
- `/solutions/`: `insyt`, `survey`, `messaging`, `content`, `deployments`,
  `marketplace`, `mobile-platform`, `ai-analytics`.
- `/resources/` listing types: `blog`, `events`, `podcasts`, `webinars`,
  `research`, `customer-stories`, `reports`, `guides`. Reports and Guides retain
  their existing Research/Blog aliases; detail patterns support those aliases.

Published dynamic route snapshot from public GET endpoints (not a permanent
catalogue; CMS publication and availability can change):
- `/careers/`: `senior-software-engineer`, `ai-ml-engineer`,
  `product-manager-data`, `field-operations-manager`, `agronomy-specialist`,
  `frontend-engineer`, `marketing-manager`, `data-scientist`, `test-featured-job`.
- `/resources/blog/esoko-empowers-farmers-real-time-market-data`
- `/resources/events/esoko-agri-tech-summit-2026`
- `/resources/podcasts/digital-agriculture-revolution-esoko-podcast`
- `/resources/webinars/getting-started-esoko-market-price-alerts-webinar`
- `/resources/research/agricultural-market-data-impact-report-2026`
- `/resources/customer-stories/farmcorp-ghana-procurement-efficiency-esoko`

Forms that are not independent frontend routes:
- The original homepage contact form is at `/#contact`.
- Book a Demo is a global original-site modal, not `/book-demo`; Next actions
  continue to the existing site's contact section.
- Pricing Contact Sales uses that existing enquiry flow, not a checkout.
- Job applications are embedded at `/careers/:id#apply`. A prior phase added a
  Next form; Phase 6 retains that implementation without mounting it and routes
  public Apply actions to the original form instead.
- HR/CMS/user/farm-data create/edit forms are within authenticated routes above.
  Private record-specific IDs were not enumerated or accessed.
- The existing router registers no public `/signup`, `/login`, password-reset
  or customer/farmer dashboard route. Task #109 is unfinished; do not infer
  account readiness from the staff login or public-page migration.
- The platform mockups and GET filter controls are demonstrations/search,
  not application data-submission endpoints.

Link routing is controlled by `artifacts/esoko-next/src/lib/site-links.ts`.
Public API prefixes remain `/api`; they must not be rewritten as legacy-page
links. Protected areas and forms remain on the original site in this phase.

Phase 6 verification (2026-11-07):
- 71 database-free tests passed, including complete catalog comparisons, static
  JSX/inline-array copy, section identity/order and heading-order comparisons,
  all registered route documentation, routing boundaries and application handoff.
- TypeScript and production build passed. Local `next start` on port 22619
  served all 19 new public pages and seven earlier pages with HTTP 200,
  initial-HTML metadata, canonical URLs and noindex. Unknown sector/solution
  slugs returned 404 with source error copy.
- Both sector tabs, all eight selections/detail links and operating-context
  map/chip state passed a GET/HEAD-only browser check without JavaScript errors.
- Sectors/customer stories are server-rendered using the existing API, with
  cached content plus a live publication-membership check; no draft is exposed.
  Root-API CMS images use unoptimized next/image to preserve shared proxy routing.
- Image exception: the original Products hero Unsplash URL returned 404
  upstream. Only the Next preview uses an existing Esoko agricultural field
  photograph instead, including OG/Twitter images. The original URL remains in
  its copied data module for traceability. The corrected production page and
  optimized hero were separately checked as HTTP 200. Original site untouched.
- Production-mode tests used a process-scoped preview public origin, not a real
  production URL or persistent environment change. Original artifact config was
  restored and Next returned to its development workflow. No API restart,
  dependency changes, data writes, migrations or publishing were performed.

## Launch checklist

No checkbox below is authorization to publish, mutate a database or alter
production settings. Each operational step requires its own approval.

- [ ] Task #119: demonstrate the isolated backup restore in a separately
  identified empty test database; retain dated checksum, schema, migration
  ledger and record-count evidence. Do not restore into the application project.
- [ ] Task #109: finish and verify secure staff and customer/farmer accounts,
  permissions, sessions and account flows. Public-content migration does not
  complete this task.
- [ ] Supply the real `ESOKO_PUBLIC_SITE_URL` at build **and** runtime, rebuild
  static metadata/JSON-LD, and verify canonical/OG/Twitter origins. Temporary
  preview-origin production-mode testing is not production configuration.
- [ ] Review all content/forms, stale vacancy deadlines, test content, image and
  media availability, route parity, unknown-slug 404s and legacy handoffs.
  This includes source claims retained verbatim such as Products' “18 yrs /
  Trusted Since 2006”; content parity is not independent factual verification.
- [ ] Approve and verify the base-path move from `/esoko-next` to `/`, including
  supported artifact registration/proxy configuration, Next basePath, asset/API
  paths, route-map switches and redirects. Link centralization alone does not
  change platform routing. Preserve a rollback path to the original website.
- [ ] Remove preview `noindex` only after explicit launch approval, from both
  metadata and response headers; audit robots/canonical behavior afterward.
- [ ] Configure production `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD`
  securely before the first API start, and confirm required session/security
  configuration. Bootstrap is keyed to the configured admin email, not merely
  the presence of any admin. Never copy development credentials or log values.
- [ ] Verify production database separation, migrations/recovery readiness,
  application startup, health/readiness, persistent uploads, permissions and
  deployed internal API networking under separately approved procedures.
- [ ] Run the final production build/runtime and responsive/accessibility
  checks, review deployment/redirect rollback procedures, and obtain explicit
  publication approval. Nothing in Phase 6 publishes the project.
