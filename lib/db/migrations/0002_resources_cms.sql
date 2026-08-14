-- Migration: Resources CMS
-- Creates all tables for the blog/events/podcasts/webinars/reports/stories CMS.
-- All operations are idempotent (IF NOT EXISTS / ON CONFLICT DO NOTHING).

-- ── Enums ─────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE "public"."resource_content_type" AS ENUM (
    'Blog', 'Event', 'Podcast', 'Webinar', 'Research Report', 'Customer Story'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint

DO $$ BEGIN
  CREATE TYPE "public"."resource_status" AS ENUM (
    'Draft', 'In Review', 'Scheduled', 'Published', 'Unpublished', 'Archived'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
--> statement-breakpoint

-- ── resource_categories ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "resource_categories" (
  "id"          serial PRIMARY KEY NOT NULL,
  "name"        text NOT NULL,
  "slug"        text NOT NULL,
  "description" text,
  "color"       text,
  "created_at"  timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "resource_categories_name_unique" UNIQUE ("name"),
  CONSTRAINT "resource_categories_slug_unique" UNIQUE ("slug")
);
--> statement-breakpoint

-- ── resource_tags ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "resource_tags" (
  "id"         serial PRIMARY KEY NOT NULL,
  "name"       text NOT NULL,
  "slug"       text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "resource_tags_name_unique" UNIQUE ("name"),
  CONSTRAINT "resource_tags_slug_unique" UNIQUE ("slug")
);
--> statement-breakpoint

-- ── resources ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "resources" (
  "id"                serial PRIMARY KEY NOT NULL,
  "content_type"      "resource_content_type" NOT NULL,
  "title"             text NOT NULL,
  "slug"              text NOT NULL,
  "short_description" text NOT NULL DEFAULT '',
  "body"              text NOT NULL DEFAULT '',
  "featured_image_url" text,
  "author_id"         integer REFERENCES "users"("id") ON DELETE set null,
  "category_id"       integer REFERENCES "resource_categories"("id") ON DELETE set null,
  "status"            "resource_status" NOT NULL DEFAULT 'Draft',
  "featured"          boolean NOT NULL DEFAULT false,
  "seo_title"         text,
  "seo_description"   text,
  "published_at"      timestamp,
  "scheduled_for"     timestamp,
  "created_by"        integer REFERENCES "users"("id") ON DELETE set null,
  "updated_by"        integer REFERENCES "users"("id") ON DELETE set null,
  "created_at"        timestamp DEFAULT now() NOT NULL,
  "updated_at"        timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "resources_slug_unique" UNIQUE ("slug")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "resources_content_type_idx" ON "resources" ("content_type");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "resources_status_idx" ON "resources" ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "resources_category_idx" ON "resources" ("category_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "resources_scheduled_idx" ON "resources" ("scheduled_for");
--> statement-breakpoint

-- ── resource_tag_relationships ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "resource_tag_relationships" (
  "resource_id" integer NOT NULL REFERENCES "resources"("id") ON DELETE cascade,
  "tag_id"      integer NOT NULL REFERENCES "resource_tags"("id") ON DELETE cascade,
  CONSTRAINT "resource_tag_relationships_pkey" PRIMARY KEY ("resource_id", "tag_id")
);
--> statement-breakpoint

-- ── resource_events ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "resource_events" (
  "id"               serial PRIMARY KEY NOT NULL,
  "resource_id"      integer NOT NULL UNIQUE REFERENCES "resources"("id") ON DELETE cascade,
  "start_datetime"   timestamp,
  "end_datetime"     timestamp,
  "timezone"         text,
  "venue"            text,
  "is_online"        boolean NOT NULL DEFAULT false,
  "registration_url" text,
  "speakers"         text NOT NULL DEFAULT '[]'
);
--> statement-breakpoint

-- ── resource_podcasts ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "resource_podcasts" (
  "id"             serial PRIMARY KEY NOT NULL,
  "resource_id"    integer NOT NULL UNIQUE REFERENCES "resources"("id") ON DELETE cascade,
  "episode_number" integer,
  "season"         integer,
  "host"           text,
  "guests"         text NOT NULL DEFAULT '[]',
  "audio_url"      text,
  "external_urls"  text NOT NULL DEFAULT '{}',
  "transcript"     text
);
--> statement-breakpoint

-- ── resource_webinars ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "resource_webinars" (
  "id"               serial PRIMARY KEY NOT NULL,
  "resource_id"      integer NOT NULL UNIQUE REFERENCES "resources"("id") ON DELETE cascade,
  "speakers"         text NOT NULL DEFAULT '[]',
  "registration_url" text,
  "meeting_url"      text,
  "recording_url"    text,
  "transcript"       text
);
--> statement-breakpoint

-- ── resource_reports ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "resource_reports" (
  "id"               serial PRIMARY KEY NOT NULL,
  "resource_id"      integer NOT NULL UNIQUE REFERENCES "resources"("id") ON DELETE cascade,
  "file_url"         text,
  "file_size"        integer,
  "file_type"        text,
  "download_count"   integer NOT NULL DEFAULT 0,
  "organisation"     text,
  "publication_year" integer
);
--> statement-breakpoint

-- ── Seed categories ────────────────────────────────────────────────────
INSERT INTO "resource_categories" ("name", "slug", "description", "color") VALUES
  ('Agriculture', 'agriculture', 'Farming, agri-markets, and food systems', '#22c55e'),
  ('Technology', 'technology', 'Digital tools and platforms for agriculture', '#3b82f6'),
  ('Policy & Research', 'policy-research', 'Reports, whitepapers, and policy analysis', '#8b5cf6'),
  ('Success Stories', 'success-stories', 'Real stories from farmers and agribusinesses', '#f59e0b')
ON CONFLICT DO NOTHING;
--> statement-breakpoint

-- ── Seed tags ─────────────────────────────────────────────────────────
INSERT INTO "resource_tags" ("name", "slug") VALUES
  ('Market Data', 'market-data'),
  ('Farmers', 'farmers'),
  ('Mobile', 'mobile'),
  ('Ghana', 'ghana'),
  ('Africa', 'africa'),
  ('Advisory', 'advisory'),
  ('Price Alerts', 'price-alerts'),
  ('Agribusiness', 'agribusiness')
ON CONFLICT DO NOTHING;
--> statement-breakpoint

-- ── Seed resources (one per type, published) ──────────────────────────
-- Blog
INSERT INTO "resources" ("content_type", "title", "slug", "short_description", "body",
  "status", "featured", "published_at", "created_at", "updated_at")
SELECT
  'Blog',
  'How Esoko Empowers Farmers with Real-Time Market Data',
  'esoko-empowers-farmers-real-time-market-data',
  'Discover how Esoko''s market information platform helps smallholder farmers get fair prices and make better decisions.',
  '<p>Access to timely, accurate market information is one of the biggest challenges facing smallholder farmers across Africa. When farmers don''t know the going price for their crops, they are vulnerable to exploitation by middlemen and miss opportunities to maximise their income.</p><p>Esoko''s platform addresses this challenge head-on by delivering real-time price alerts, agronomy advice, and market linkages directly to farmers'' mobile phones — even on basic feature phones via SMS.</p><p>Since 2005, Esoko has helped millions of farmers across Ghana, Burkina Faso, Mozambique, and beyond take control of their livelihoods with data-driven insights.</p>',
  'Published',
  true,
  NOW(),
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM "resources" WHERE slug = 'esoko-empowers-farmers-real-time-market-data');
--> statement-breakpoint

-- Event
INSERT INTO "resources" ("content_type", "title", "slug", "short_description", "body",
  "status", "featured", "published_at", "created_at", "updated_at")
SELECT
  'Event',
  'Esoko Annual Agri-Tech Summit 2026',
  'esoko-agri-tech-summit-2026',
  'Join industry leaders, farmers, and technology innovators at Esoko''s flagship annual summit in Accra.',
  '<p>The Esoko Annual Agri-Tech Summit brings together agricultural technology pioneers, policy makers, financial institutions, and farmer cooperatives for two days of insights, networking, and product showcases.</p><p>This year''s theme: <strong>Digital Inclusion for Smallholder Farmers — Closing the Data Gap</strong>. Attendees will hear from leading researchers, development organisations, and Esoko customers across Africa.</p>',
  'Published',
  true,
  NOW(),
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM "resources" WHERE slug = 'esoko-agri-tech-summit-2026');
--> statement-breakpoint

-- Podcast
INSERT INTO "resources" ("content_type", "title", "slug", "short_description", "body",
  "status", "featured", "published_at", "created_at", "updated_at")
SELECT
  'Podcast',
  'The Digital Agriculture Revolution with Esoko',
  'digital-agriculture-revolution-esoko-podcast',
  'In this episode we explore how digital tools are transforming agriculture across sub-Saharan Africa.',
  '<p>Host Emmanuel Asante sits down with Esoko''s CEO to discuss the journey from SMS-based price alerts to a full agricultural intelligence platform serving over 2 million users.</p><p>Topics covered: building for low-bandwidth environments, the role of AI in smallholder agriculture, and why farmer trust is the most important metric.</p>',
  'Published',
  false,
  NOW(),
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM "resources" WHERE slug = 'digital-agriculture-revolution-esoko-podcast');
--> statement-breakpoint

-- Webinar
INSERT INTO "resources" ("content_type", "title", "slug", "short_description", "body",
  "status", "featured", "published_at", "created_at", "updated_at")
SELECT
  'Webinar',
  'Getting Started with Esoko Market Price Alerts',
  'getting-started-esoko-market-price-alerts-webinar',
  'A practical walkthrough of setting up market price subscriptions for your cooperative or agribusiness.',
  '<p>This recorded webinar covers everything you need to know to get your team using Esoko''s market price alert service. From account setup to configuring commodity subscriptions and regional filters, our onboarding team walks through each step with live demonstrations.</p>',
  'Published',
  false,
  NOW(),
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM "resources" WHERE slug = 'getting-started-esoko-market-price-alerts-webinar');
--> statement-breakpoint

-- Research Report
INSERT INTO "resources" ("content_type", "title", "slug", "short_description", "body",
  "status", "featured", "published_at", "created_at", "updated_at")
SELECT
  'Research Report',
  'Agricultural Market Data Impact Report 2026',
  'agricultural-market-data-impact-report-2026',
  'An independent study measuring the economic impact of real-time market data on smallholder farmer income across Ghana and Burkina Faso.',
  '<p>This study, commissioned by Esoko and conducted by independent researchers, surveyed 4,200 smallholder farmers across three growing seasons to measure the income effect of access to real-time price data.</p><p><strong>Key findings:</strong></p><ul><li>Farmers with access to Esoko price alerts earned 18% more per harvest on average</li><li>Post-harvest losses decreased by 12% due to better timing of market sales</li><li>Female farmers saw a disproportionately positive impact — 23% income increase vs 14% for male farmers</li></ul>',
  'Published',
  true,
  NOW(),
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM "resources" WHERE slug = 'agricultural-market-data-impact-report-2026');
--> statement-breakpoint

-- Customer Story
INSERT INTO "resources" ("content_type", "title", "slug", "short_description", "body",
  "status", "featured", "published_at", "created_at", "updated_at")
SELECT
  'Customer Story',
  'How Farmcorp Ghana Increased Procurement Efficiency by 35% with Esoko',
  'farmcorp-ghana-procurement-efficiency-esoko',
  'Farmcorp Ghana shares how integrating Esoko market data into their procurement operations cut costs and improved farmer relationships.',
  '<p>Farmcorp Ghana, one of West Africa''s largest agri-commodity processors, faced a chronic challenge: volatile cocoa and maize prices meant their procurement team was constantly negotiating in the dark. Relationships with smallholder supplier cooperatives were strained by mistrust around pricing.</p><p>After integrating Esoko''s real-time market data into their procurement dashboard in 2024, Farmcorp saw immediate improvements. Procurement managers could cite publicly available data when negotiating with cooperatives, reducing disputes and shortening contract cycles from 3 weeks to under 5 days.</p><p>"Esoko gave us a common language for price discussions. Our cooperative partners trust the data because it''s not coming from us — it''s independent," said Sarah Antwi, Head of Procurement at Farmcorp Ghana.</p>',
  'Published',
  true,
  NOW(),
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM "resources" WHERE slug = 'farmcorp-ghana-procurement-efficiency-esoko');
--> statement-breakpoint

-- Seed extension data for Event
INSERT INTO "resource_events" ("resource_id", "start_datetime", "end_datetime", "timezone", "venue", "is_online", "registration_url", "speakers")
SELECT
  r.id,
  '2026-10-14 09:00:00'::timestamp,
  '2026-10-15 17:00:00'::timestamp,
  'Africa/Accra',
  'Accra International Conference Centre, Accra, Ghana',
  false,
  'https://esoko.com/events/summit-2026/register',
  '[{"name":"Dr. Ama Donkor","title":"Director of Digital Agriculture, FAO West Africa"},{"name":"Kofi Mensah","title":"CEO, Esoko"}]'
FROM "resources" r
WHERE r.slug = 'esoko-agri-tech-summit-2026'
ON CONFLICT DO NOTHING;
--> statement-breakpoint

-- Seed extension data for Podcast
INSERT INTO "resource_podcasts" ("resource_id", "episode_number", "season", "host", "guests", "audio_url", "external_urls")
SELECT
  r.id,
  1,
  1,
  'Emmanuel Asante',
  '[{"name":"Kofi Mensah","title":"CEO, Esoko"}]',
  NULL,
  '{"spotify":"https://open.spotify.com/show/esoko-podcast","apple":"https://podcasts.apple.com/esoko"}'
FROM "resources" r
WHERE r.slug = 'digital-agriculture-revolution-esoko-podcast'
ON CONFLICT DO NOTHING;
--> statement-breakpoint

-- Seed extension data for Webinar
INSERT INTO "resource_webinars" ("resource_id", "speakers", "recording_url")
SELECT
  r.id,
  '[{"name":"Grace Osei","title":"Esoko Customer Success"}]',
  NULL
FROM "resources" r
WHERE r.slug = 'getting-started-esoko-market-price-alerts-webinar'
ON CONFLICT DO NOTHING;
--> statement-breakpoint

-- Seed extension data for Research Report
INSERT INTO "resource_reports" ("resource_id", "file_type", "download_count", "organisation", "publication_year")
SELECT
  r.id,
  'PDF',
  0,
  'Esoko / Independent Research Group',
  2026
FROM "resources" r
WHERE r.slug = 'agricultural-market-data-impact-report-2026'
ON CONFLICT DO NOTHING;
