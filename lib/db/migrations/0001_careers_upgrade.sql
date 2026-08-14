-- Migration: HR Careers upgrade
-- Adds new stages to application_stage enum, new columns to jobs,
-- and the application_notes table.
-- All operations are idempotent.

-- ── Extend application_stage enum with new pipeline values ────────────
DO $$ BEGIN
  ALTER TYPE "public"."application_stage" ADD VALUE IF NOT EXISTS 'New';
EXCEPTION WHEN others THEN NULL; END $$;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TYPE "public"."application_stage" ADD VALUE IF NOT EXISTS 'Screening';
EXCEPTION WHEN others THEN NULL; END $$;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TYPE "public"."application_stage" ADD VALUE IF NOT EXISTS 'Shortlisted';
EXCEPTION WHEN others THEN NULL; END $$;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TYPE "public"."application_stage" ADD VALUE IF NOT EXISTS 'Withdrawn';
EXCEPTION WHEN others THEN NULL; END $$;
--> statement-breakpoint

-- ── New columns on jobs ───────────────────────────────────────────────
ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "featured" boolean NOT NULL DEFAULT false;
--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "seo_title" text;
--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "seo_description" text;
--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "published_at" timestamp;
--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "published_by" integer;
--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "updated_by" integer;
--> statement-breakpoint

-- FK constraints for new columns (safe to run multiple times)
DO $$ BEGIN
  ALTER TABLE "jobs" ADD CONSTRAINT "jobs_published_by_users_id_fk"
    FOREIGN KEY ("published_by") REFERENCES "public"."users"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "jobs" ADD CONSTRAINT "jobs_updated_by_users_id_fk"
    FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint

-- ── application_notes table ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "application_notes" (
  "id" serial PRIMARY KEY NOT NULL,
  "application_id" integer NOT NULL,
  "author_id" integer,
  "body" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "application_notes" ADD CONSTRAINT "application_notes_application_id_applications_id_fk"
    FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "application_notes" ADD CONSTRAINT "application_notes_author_id_users_id_fk"
    FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
