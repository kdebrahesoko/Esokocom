# Esoko Next.js migration preview

This is a separate App Router artifact, not an in-place conversion.

- Preview: `/esoko-next/`
- Existing website: `/` (unchanged)
- Existing Express API: `/api` (unchanged)
- Artifact ID: `artifacts/esoko-next`; assigned port: `22619`
- Public Resources pages now read the existing Express API server-side.
- No database imports, authentication changes, shared-library changes or API changes.

## Commands

```sh
pnpm --filter @workspace/esoko-next run typecheck
pnpm --filter @workspace/esoko-next run build
```

Run the registered `artifacts/esoko-next: web` workflow for development.
It supplies `PORT` and `BASE_PATH`. Development invokes `next dev`; production
configuration builds with `next build` and runs `next start`. Both servers bind
to `0.0.0.0` and use the workflow-supplied port. Do not start duplicate services.
Production commands are configuration only: this artifact has not been published.

## Registration

With explicit user approval, the supported `react-vite` creation type registered
the artifact and allocated its ID/port. Its generated template was removed.
The configuration validation tool accepted replacement of static serving and
SPA rewrites with a Node-backed Next.js build/run service.

## Security version selection — 2026-11-07

Pinned Next.js **16.4.5**, npm publication **2026-11-03T18:01:54.667Z**.
Pinned React and React DOM **19.3.1**, published October 14, 2026. Registry
metadata confirms compatibility with Next.js's React peer range and Node 24.
The user explicitly approved a newer-security-patch exception to the original
October 24 cutoff. Existing workspace React catalog versions are unchanged.

Checked official sources:

- https://nextjs.org/blog/november-2026-security-release
- https://github.com/vercel/next.js/security/advisories/GHSA-7qx7-33qx-rqx2
- https://github.com/vercel/next.js/security/advisories/GHSA-pc58-hwjq-p385
- https://react.dev/blog/2025/12/11/denial-of-service-and-source-code-exposure-in-react-server-components

The November Next.js release identifies 16.4.5 as patched, including fixes for
image optimization and response disclosure. The React advisory includes the
January 26, 2026 follow-up RSC fixes and warns earlier patches were incomplete.
This is a dated advisory review, not a guarantee against undiscovered issues.
Recheck advisories before expanding features or publishing.

## Boundaries and next stages

The foundation root makes no API requests. Public Resources have migrated to
`/esoko-next/resources/`, all eight existing type segments and their detail
routes, including the `reports`/`guides` aliases. Public Careers has also migrated;
remaining public pages come next and admin CMS last. API URLs remain `/api/...`, not
`/esoko-next/api/...`. Session handling needs separate implementation review.
No account forms or fake login have been added.

The preview is marked noindex in metadata and response headers; that is not
access control. Build output stays in ignored `.next/`. The old website remains
the working reference. Do not publish before the existing recovery gate is met.

## Foundation verification — 2026-11-07

- Package-local `typecheck`: passed before build and after development type generation.
- `next build`: passed, including Next.js TypeScript checks and prerendering.
- Only this artifact's workflow was explicitly started/restarted for verification.
- Proxied `/esoko-next/`: HTTP 200; all 17 referenced CSS/JavaScript/favicon
  asset URLs returned HTTP 200.
- Desktop screenshot: foundation rendered correctly. The screenshot browser
  recorded HMR WebSocket 502 errors; separate WebSocket connection checks through
  both the development domain and local shared proxy subsequently succeeded.
  Hot-update behavior was not browser-tested.
- Validated Node service metadata remained intact after install/build/start.
- Existing lockfile importer entries are unchanged; only this artifact adds an
  importer. Existing protected application and shared-library files are unchanged.
- `git diff --check`: passed.

Next generated `AGENTS.md`, updated `next-env.d.ts`, and wrote ignored `.next/`
and TypeScript incremental metadata. No API requests, database operations,
migrations, production start, or deployment were part of foundation verification.

## Phase 2: public Resources

### Server environment and routing

`ESOKO_INTERNAL_API_BASE_URL` is server-only and includes the API prefix.
This artifact's validated service configuration supplies
`http://127.0.0.1:80/api/`: requests go through this project's shared proxy to
the existing Express service. This is a configured internal address, not a
host embedded in application source or a `NEXT_PUBLIC_` variable. No browser
API base or backend credentials are injected into HTML.

Development and production service configurations use the same project-internal
proxy arrangement. A different supported hosting topology can set this variable
to its reachable API base without changing the server adapter. Do not point it
at an admin endpoint, another database/project, or an untrusted origin.

`ESOKO_PUBLIC_SITE_URL` is a separate public HTTP(S) origin used for absolute
canonical, OG/Twitter image and JSON-LD URLs. Development can use the
workflow-provided `REPLIT_DEV_DOMAIN` when the explicit variable is absent.
**Production requires the actual published origin set explicitly before
switchover.** Do not use a development domain or the internal API address as a
production canonical origin. No production variable was set in this work.
It is read at request time; this origin is not needed to prerender the root.

### Rendering, freshness and publication safety

- Landing, type listings, detail content, forms, cards and media panels are
  Server Components. Only clipboard feedback and the error retry boundary
  are client components.
- Public API list/detail calls always use the existing public endpoints and
  never forward cookies or credentials. Source review confirmed these endpoints
  require database status `Published`; the adapter checks response status again.
- Cached content and taxonomy use `next: { revalidate: 60 }`. Next's timed
  revalidation is request-driven, not a background scheduler or a strict
  60-second freshness SLA. CMS edits require no rebuild.
- Each request also checks uncached list membership or detail availability.
  A cached resource is omitted/404 when it is no longer public. A failed live
  check fails closed instead of serving the cached content. No full-page cache
  is used for these dynamic routes. List counts come from the live response.
  New/reordered entries can temporarily be absent while the content cache refreshes.
- Development HMR fetch caching is disabled so it does not bypass live checks.
- HTML content is sanitized server-side with an allowlist adapted from the
  existing site's DOMPurify policy. Script/event-handler URLs are not permitted.
- Query filters, categories, tags, pagination, webinar filter values and type
  mappings use the existing API semantics. The backend's webinar Live status
  remains URL-based; this migration does not make it time-accurate.

### Sharing and preview restrictions

`generateMetadata` returns resource SEO title/description, absolute OG image,
Twitter large-image card and canonical URL. Metadata streaming is disabled so
these tags are in the initial HTML for WhatsApp, LinkedIn and other consumers.
Detail pages include escaped Article JSON-LD. Resource `featuredImageUrl` is used
when available; the six current published resources have none, so an existing
Esoko field photo copied from the old website is used as a JPEG fallback.

Noindex is retained in both metadata and response headers. This is not access
control, and social providers may cache or choose not to show a preview. Actual
WhatsApp/LinkedIn previews have not been certified in this private development
environment. Their image fetchers need a publicly accessible image.

### Phase 2 checks — 2026-11-07

- Explicit `allowedDevOrigins`: exact Replit development hostname plus local
  screenshot hostname; no global wildcard.
- HMR handshakes including each Origin: HTTP 101. Desktop and mobile screenshot
  browser logs confirmed `[HMR] connected`, without the previous 502 errors.
- Foundation production build plus `next start` on assigned port 22619:
  root HTTP 200; returned to the managed development workflow.
- Completed Resources TypeScript check and production build: passed. Routes
  are reported as dynamic server-rendered pages. Build did not fetch API data.
- 19 database-write-free HTTP page checks passed: six detail pages, landing,
  eight type listings, three unavailable/unknown routes (404), and empty search.
  All six detail responses had metadata in `<head>`, absolute OG/Twitter images,
  Article JSON-LD, body content and noindex without JavaScript execution.
- Desktop landing and mobile article screenshots rendered correctly.
- Protected existing application/library source remained unchanged.

Verification used only public GET endpoints; no CMS edits, unpublish tests,
database writes/queries through database tools, downloads, account actions or
deployment occurred. Revalidation/withdrawal behavior is implemented but has
not been demonstrated by modifying a live resource. Pagination beyond the
current six published records and external media/playback providers were not
exercised. The completed Resources pages have not been run in production mode
against a published production origin; the `next start` test covered the
foundation root before Resources implementation.

## Phase 3: public Careers — 2026-11-07

- `/esoko-next/careers/` and `/esoko-next/careers/[id]/` are dynamic Server
  Components. Original API slug IDs and numeric-ID lookup support are preserved.
  GET forms provide search, department, location and job-type filtering without
  browser JavaScript. Filter options come from actual published jobs.
- Server reads use the same `ESOKO_INTERNAL_API_BASE_URL` as Resources, with
  `cache: "no-store"` and no forwarded cookies. The existing public API and
  adapter both require `Published`; 404/closed results never use static fallback
  vacancies. API outages show an error boundary, not stale static seed data.
- ApplicationForm is a client component. Its shared pure helper sends the
  existing multipart contract to `/api/jobs/{id}/apply`: name/email, optional
  phone/cover letter, optional PDF/DOC/DOCX CV up to 5 MiB and custom answers.
  Custom answers are optional, at most 20, with a 2,000-character UI limit
  matching the backend's storage truncation. Client validation is not a substitute
  for the existing server validation. No new API or storage endpoint was added.
- The form prevents concurrent submits, preserves input on failure, requires
  HTTP 201 with the API's numeric ID/message before confirming success, and
  clears candidate fields/file after success. Its state is keyed by vacancy ID.
  It requires JavaScript for submission; the server-rendered button is disabled
  until hydration. The explicit multipart POST action prevents a default GET
  exposing candidate fields in the URL. No candidate data is stored locally.
- Detail metadata includes title, description, canonical, OG and Twitter image.
  Preview noindex remains unchanged. JobPosting JSON-LD uses supplied facts,
  without inventing salary currency, postal address or remote eligibility.
  Expired known deadlines suppress JobPosting markup. Strict date-only or
  full-month dates are supported; ambiguous text such as `Dec 2026` remains
  displayed verbatim and is not turned into a fabricated exact deadline.
- Existing backend behavior accepts applications based on Published status,
  not the displayed deadline. Past dated vacancies remain visible with a
  notice. Changing deadline enforcement requires a separate API change.
- Free-text job locations cannot establish Google's required structured postal
  address or remote-country eligibility; JobPosting markup alone is not a
  certification for Google Jobs. The preview is intentionally noindex.

### Verification

Commands:

```sh
node --test artifacts/esoko-next/tests/careers.test.mjs
pnpm --filter @workspace/esoko-next run typecheck
pnpm --filter @workspace/esoko-next run build
git diff --check
git diff --exit-code -- artifacts/esoko-website artifacts/api-server artifacts/esoko-mobile lib pnpm-lock.yaml
```

The test command uses native TypeScript stripping (Node 22.18+; Node 24 in this
workspace). All 22 tests passed. Every submission test injects a mock fetch;
none submits an application or uploads a file. Coverage includes multipart
fields, optional/custom answers, CV MIME/size boundaries, 201 confirmation,
closed-job errors, malformed/error responses and strict deadline handling.

TypeScript, production build, whitespace and protected-source checks passed.
Only this Next.js artifact was restarted. Fifteen public GET page checks passed:
nine details, landing, search-empty state, department filter, missing-job 404,
Resources landing and preview root. Detail checks confirmed metadata in initial
HTML, noindex, multipart POST action and no staff-ID fields. Eight expired
dated jobs omitted JobPosting; one job with an ambiguous deadline emitted
markup without inventing `validThrough`. Desktop landing and mobile detail
screenshots rendered correctly; browser logs reported HMR connected.

No application POST, CV upload, database connection through database tools,
database write, API restart, environment change, dependency installation,
production operation or deployment was performed. Real application creation,
object-storage persistence, HR visibility, browser submission feedback and
download permissions have **not** been verified end to end; obtain separate
approval before a test that creates records/uploads. Production runtime and
social-provider previews remain unverified.

Content to review before switchover: the public API currently publishes eight
past-dated vacancies and one role named `Test Featured Job`. No records were
changed or hidden based on those names/dates. This public Careers migration
does not complete the separate secure-account/sign-up/login work.
