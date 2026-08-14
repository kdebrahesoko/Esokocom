---
name: Resources CMS architecture
description: Schema design, CONTENT_AUTHOR policy, tag atomicity, scheduler, Express 5 quirks, and admin UI routing decisions
---

## Backend (Task #59)
- Schema in `lib/db/src/schema/resources.ts` — enums + 4 extension tables (events/podcasts/webinars/reports)
- Migration `lib/db/migrations/0002_resources_cms.sql` — idempotent DDL + seed data
- Admin CRUD at `/api/admin/resources`, `/api/admin/resource-categories`, `/api/admin/resource-tags`
- Public API at `/api/resources`, `/api/resource-categories`, `/api/resource-tags`
- Scheduled publisher in `artifacts/api-server/src/lib/scheduler.ts` (60s interval, Scheduled→Published)
- Stats endpoint: `GET /api/admin/stats` in `artifacts/api-server/src/routes/adminStats.ts`

## CONTENT_AUTHOR policy (strict)
- Create → always forced to Draft (API enforces)
- Edit → only if `existing.status === "Draft"` (API enforces)
- Status via PUT → only "Draft" or "In Review" allowed
- Publish/schedule/unpublish endpoints gated by `requireEditor` middleware
- Author stats filtered by `createdBy = user.id` in the stats endpoint

**Why:** Task #57 RBAC design requires authors to never bypass editorial review.

## Tag atomicity
- `validateTagIds()` runs before any DB mutation
- Entire resource + extension + tags wrapped in `db.transaction()`
- `upsertExtension(tx, ...)` and `syncTags(tx, ...)` accept `any`-typed tx param (drizzle transaction type is incompatible with `typeof db` in TypeScript but identical at runtime)

## Admin UI routing (Task #60)
Frontend route order in `App.tsx` (order matters for wouter):
```
/admin/login → AdminLoginPage
/admin/audit-logs → AdminAuditLogsPage
/admin/careers → AdminCareersPage
/admin/users → AdminUsersPage
/admin/resources/new → AdminResourceFormPage (create; ?type=blog param)
/admin/resources/:id/edit → AdminResourceFormPage (edit; numeric ID param)
/admin/resources/:type → AdminResourceListPage (blog/events/podcasts/webinars/reports/customer-stories)
/admin/resources → AdminResourcesPage (all types)
/admin → AdminDashboardPage
```
**Why:** More specific routes must come before parameterized ones in wouter Switch.

## Admin URL ↔ DB type mapping
Admin URL segment → DB type:
- blog → Blog, events → Event, podcasts → Podcast, webinars → Webinar, reports → Research Report, customer-stories → Customer Story

DB type → API slug (for POST body `type` field):
- Blog → blog, Event → event, Podcast → podcast, Webinar → webinar, Research Report → research-report, Customer Story → customer-story

## AdminLayout auth pattern
- `AdminLayout.tsx` calls `GET /api/auth/me` on mount, redirects to `/admin/login` on 401/403
- Exposes user via `AdminUserContext` — child pages call `useAdminUser()` hook
- AdminCareersPage and AdminAuditLogsPage NOT yet wrapped (still use own header — see task #65)

## Storage upload roles
- `POST /api/storage/uploads/request-url` updated to allow CONTENT_EDITOR and CONTENT_AUTHOR (previously only SUPER_ADMIN/HR_ADMIN)
- Private object download (`GET /storage/objects/*`) remains HR-only
- Content authors upload to public paths; returned `objectPath` displayed via `${BASE}/storage/public-objects/${objectPath}`

## Express 5 req.params typing
Always use `String(req.params.xxx)` — Express 5's `@types/express` types params as `string | string[]`.

## Drizzle eq() with nullable user.id
`eq(resourcesTable.createdBy, user.id)` fails if user.id is `number | null`. Always null-guard: `user.id != null ? db.select()...where(eq(col, user.id)) : []`.
