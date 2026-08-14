---
name: Resources CMS architecture
description: Durable lessons from building the Resources CMS backend — schema, role policy, tag atomicity, scheduler, and Express 5 typing quirks.
---

# Resources CMS Architecture

## CONTENT_AUTHOR policy (strictly enforced)
- CREATE: status is **always forced to "Draft"** regardless of what the author sends.
- EDIT: only allowed when `existing.status === "Draft"` (not "In Review"). Once submitted for review, the resource is locked from author edits.
- Status transitions via PUT: authors can only set status to "Draft" or "In Review" (submit for review). Attempting Published/Unpublished/Archived returns 403 explicitly.
- Publish/unpublish/schedule endpoints use `requireEditor` middleware (CONTENT_EDITOR + SUPER_ADMIN only).

**Why:** The original implementation accepted "In Review" for both create and edit; the code reviewer rejected this as an access-control mismatch.

**How to apply:** Any new route that modifies a resource must apply the same guard. Check `user.role === "CONTENT_AUTHOR"` and verify both ownership (`createdBy === user.id`) and status (`=== "Draft"`) before allowing mutations.

## Tag atomicity
- `validateTagIds(tagIds)` must be called **before** any DB write when tagIds is non-empty. Returns `null` on success or an array of missing IDs.
- Resource + extension + tag writes are wrapped in a single `db.transaction(async (tx) => {...})`.
- `upsertExtension(tx, ...)` and `syncTags(tx, ...)` both accept a `tx` parameter typed as `any` (drizzle transaction vs db have incompatible TypeScript types; using `any` is intentional and safe at runtime).

**Why:** Without pre-validation, an invalid tag ID causes a FK error after the resource was already persisted, leaving partial state. Without transactions, a tag sync failure would leave the resource saved but without its tags.

**How to apply:** Any endpoint that writes resources + related data (tags, extension tables) must validate IDs first and then wrap in `db.transaction`.

## Express 5 + @types/express@5 quirk
- `req.params.xxx` is typed as `string | string[]` (not plain `string`) in Express 5's type definitions. Always use `String(req.params.xxx)` when accessing URL params to satisfy TypeScript.
- `req.query.xxx` is `string | string[] | ParsedQs | ParsedQs[] | undefined` — always use `String(req.query.xxx)` after a truthiness check.

## Scheduler
- `startResourceScheduler()` in `lib/scheduler.ts` runs every 60 seconds.
- Checks `status = 'Scheduled' AND scheduled_for <= now()`, flips to Published, logs each auto-publish to audit_logs.
- Started after `app.listen()` in `src/index.ts`.

## Drizzle migration journal
- Every `.sql` migration file must have a matching entry in `lib/db/migrations/meta/_journal.json` (idx, version, when, tag, breakpoints).
- Missing journal entry → migration silently skipped by the Drizzle migrator.
- Timestamp (when) should be real `Date.now()` from the shell at the time of writing.

## Schema layout
- `lib/db/src/schema/resources.ts` — enums, categories, tags, resources, tag junction, 4 extension tables.
- Extension tables (events, podcasts, webinars, reports) have a 1:1 unique FK to resources with ON DELETE CASCADE.
- Blog and Customer Story have no extension table (base fields are sufficient).
- JSON fields (speakers, guests, external_urls) stored as `text` with default `'[]'` or `'{}'` — consistent with existing careers schema pattern.

## Vitest integration test setup
- Config: `artifacts/api-server/vitest.config.ts` — node environment, 20s timeout, alias `@workspace/db` → `lib/db/src/index.ts`.
- Test file: `src/routes/resources.test.ts` — creates real DB users/sessions in beforeAll, cleans up in afterAll.
- Run: `pnpm test` in `artifacts/api-server/`.
- Pool option `poolOptions.forks.singleFork` was removed in Vitest 4 (becomes top-level `singleFork: true` if needed).
