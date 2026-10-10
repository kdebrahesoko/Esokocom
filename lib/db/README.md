# Esoko database workflow

Esoko uses Replit-managed PostgreSQL through the existing `DATABASE_URL`.
Do not replace managed database variables, use the external database, or print
credentials. Development and production are separate approval boundaries.

## Dependency setup

Post-merge setup installs the frozen lockfile with lifecycle scripts disabled.
It does not apply schemas or migrations. If a fresh dependency installation needs
a package build hook, review that specific hook and obtain approval before
running it. Do not re-enable general lifecycle scripts or unattended rebuilds.

The platform may reconcile and restart workflows after a merge independently of
the setup script. Do not trigger post-merge setup under a no-restart restriction.

## Application startup

The API checks database connectivity and the presence of tables exported by the
Drizzle schema using read-only queries. Missing tables cause a clear startup
failure, not automatic creation or repair.

These checks do not validate every column, constraint, enum, or migration.
They do not require a production Drizzle ledger. After readiness succeeds, the
existing administrator bootstrap and Resources scheduler still run; these can
write application data. API startup is therefore not a read-only test.

## Reviewed development preparation

1. Propose schema changes without modifying existing records.
2. Confirm a recovery point and record schema/data baselines with approval.
3. Reconcile migration snapshots under separate Stage 2 approval.
4. Generate proposed SQL, review its effects, and preserve historical migration
   files, journal entries, and recorded hashes.
5. Obtain explicit approval for the exact SQL before applying it to development.
6. Verify data preservation and approved application behavior.

Stage 1 does not authorize generation or execution of migrations. The current
snapshot history is incomplete, and the migration runner's source-mode folder
resolution needs review before documenting an executable manual migration
command. Do not replay or rewrite historical migrations.

The `push` and `push-force` package scripts and `runMigrations` compatibility
export remain available, but are not approved for this task and must not be
invoked by startup, post-merge automation, or deployment hooks.

Fresh development databases require separately approved preparation before the
API can start. No unreviewed schema push, DROP, TRUNCATE, new constraint/index,
or change to `applications.job_id` is authorized.

## Restricted Stage 1 verification

Use the isolated `databaseReadiness.test.ts` test with fake query clients,
targeted type checks, API compilation without execution, shell syntax validation,
and static diff/automation inspection. Building can regenerate ignored output;
inspect and report it without editing unrelated source files.

Do not run API `dev`/`start`, workflow reconciliation, migrations, schema pushes,
or data-mutating integration tests under Stage 1 approval.

## Production

Replit Publish manages development-to-production schema changes. Production
inspection and publication require separate approval. Do not add startup DDL,
production migration scripts, or schema-changing build hooks. Review the Publish
schema diff and do not overwrite production data as part of schema preparation.

## Recovery

Before approved database writes, verify available recovery points and the
appropriate development checkpoint or production restore process. Stage 1 makes
no database changes and requires no database rollback.

For development code rollback, restore only approved files to their pre-change
versions and remove only this stage's newly created files. Preserve unrelated
changes. Restoring old startup/post-merge code reintroduces automatic schema
mutation, so do not restart or merge that restored code without review.
