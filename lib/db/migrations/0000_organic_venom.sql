-- Idempotent migration: safe to run on fresh databases and on existing ones
-- that were previously provisioned via drizzle-kit push.

-- ── Enums (DO blocks suppress "already exists" errors) ───────────────
DO $$ BEGIN
  CREATE TYPE "public"."application_stage" AS ENUM('Applied', 'Review', 'Assessment', 'Interview', 'Leadership', 'Offer', 'Hired', 'Rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."job_department" AS ENUM('Engineering', 'Product', 'Agriculture', 'Operations', 'Marketing', 'Finance', 'HR');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."job_experience" AS ENUM('Entry Level', 'Mid Level', 'Senior', 'Leadership');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."job_status" AS ENUM('Draft', 'Published', 'Closed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."job_type" AS ENUM('Full Time', 'Contract', 'Internship', 'Graduate');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."user_role" AS ENUM('SUPER_ADMIN', 'HR_ADMIN', 'CONTENT_EDITOR', 'CONTENT_AUTHOR');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint

-- ── Tables ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "contact_submissions" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "email" text NOT NULL,
  "subject" text NOT NULL,
  "message" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "demo_requests" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "email" text NOT NULL,
  "organization" text NOT NULL,
  "country" text NOT NULL,
  "use_case" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "advisories" (
  "id" serial PRIMARY KEY NOT NULL,
  "category" text NOT NULL,
  "title" text NOT NULL,
  "body" text NOT NULL,
  "date" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "market_prices" (
  "id" serial PRIMARY KEY NOT NULL,
  "commodity" text NOT NULL,
  "price" real NOT NULL,
  "unit" text NOT NULL,
  "currency" text DEFAULT 'GH₵' NOT NULL,
  "trend" text DEFAULT 'stable' NOT NULL,
  "change_percent" real DEFAULT 0 NOT NULL,
  "market" text NOT NULL,
  "updated_at" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sms_alerts" (
  "id" serial PRIMARY KEY NOT NULL,
  "message" text NOT NULL,
  "type" text NOT NULL,
  "alert_timestamp" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "jobs" (
  "id" serial PRIMARY KEY NOT NULL,
  "slug" text NOT NULL,
  "title" text NOT NULL,
  "department" "job_department" NOT NULL,
  "location" text NOT NULL,
  "type" "job_type" NOT NULL,
  "experience" "job_experience" NOT NULL,
  "about" text DEFAULT '' NOT NULL,
  "responsibilities" text DEFAULT '[]' NOT NULL,
  "requirements" text DEFAULT '[]' NOT NULL,
  "nice_to_have" text DEFAULT '[]' NOT NULL,
  "skills" text DEFAULT '[]' NOT NULL,
  "benefits" text DEFAULT '[]' NOT NULL,
  "salary_range" text,
  "deadline" text DEFAULT '' NOT NULL,
  "application_questions" text DEFAULT '[]' NOT NULL,
  "status" "job_status" DEFAULT 'Draft' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "jobs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "applications" (
  "id" serial PRIMARY KEY NOT NULL,
  "job_id" serial NOT NULL,
  "name" text NOT NULL,
  "email" text NOT NULL,
  "phone" text,
  "cover_letter" text,
  "cv_file_url" text,
  "answers" text DEFAULT '[]',
  "stage" "application_stage" DEFAULT 'Applied' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
  "id" serial PRIMARY KEY NOT NULL,
  "email" text NOT NULL,
  "password_hash" text NOT NULL,
  "name" text NOT NULL,
  "role" "user_role" DEFAULT 'CONTENT_AUTHOR' NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" integer NOT NULL,
  "token_hash" text NOT NULL,
  "expires_at" timestamp NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "sessions_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audit_logs" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" integer,
  "action" text NOT NULL,
  "entity_type" text,
  "entity_id" text,
  "metadata" text DEFAULT '{}',
  "ip" text,
  "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- ── Foreign keys (DO blocks suppress "already exists" errors) ─────────
DO $$ BEGIN
  ALTER TABLE "applications" ADD CONSTRAINT "applications_job_id_jobs_id_fk"
    FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk"
    FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk"
    FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
