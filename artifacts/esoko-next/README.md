# Esoko Next.js foundation

This is a separate App Router artifact, not an in-place conversion.

- Preview: `/esoko-next/`
- Existing website: `/` (unchanged)
- Existing Express API: `/api` (unchanged)
- Artifact ID: `artifacts/esoko-next`; assigned port: `22619`
- No database, authentication, shared-library or API integration in this foundation.

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

The foundation page makes no API requests and does not import any `lib/` package.
Resources migration comes next, then Careers, remaining public pages, and admin
CMS last. API URLs must remain `/api/...`, not `/esoko-next/api/...`.
Session handling and server fetch adapters need separate implementation review.
No test forms or fake login have been added.

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
