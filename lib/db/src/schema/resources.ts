import {
  pgTable, text, serial, integer, boolean, timestamp, pgEnum, primaryKey, index,
} from "drizzle-orm/pg-core";
import { usersTable } from "./auth";

/* ── Enums ──────────────────────────────────────────────────────────── */
export const resourceContentTypeEnum = pgEnum("resource_content_type", [
  "Blog", "Event", "Podcast", "Webinar", "Research Report", "Customer Story",
]);

export const resourceStatusEnum = pgEnum("resource_status", [
  "Draft", "In Review", "Scheduled", "Published", "Unpublished", "Archived",
]);

/* ── Categories ─────────────────────────────────────────────────────── */
export const resourceCategoriesTable = pgTable("resource_categories", {
  id:          serial("id").primaryKey(),
  name:        text("name").notNull().unique(),
  slug:        text("slug").notNull().unique(),
  description: text("description"),
  color:       text("color"),
  createdAt:   timestamp("created_at").defaultNow().notNull(),
});

/* ── Tags ───────────────────────────────────────────────────────────── */
export const resourceTagsTable = pgTable("resource_tags", {
  id:        serial("id").primaryKey(),
  name:      text("name").notNull().unique(),
  slug:      text("slug").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ── Main resources table ───────────────────────────────────────────── */
export const resourcesTable = pgTable("resources", {
  id:               serial("id").primaryKey(),
  contentType:      resourceContentTypeEnum("content_type").notNull(),
  title:            text("title").notNull(),
  slug:             text("slug").notNull().unique(),
  shortDescription: text("short_description").notNull().default(""),
  body:             text("body").notNull().default(""),
  featuredImageUrl: text("featured_image_url"),
  authorId:         integer("author_id").references(() => usersTable.id, { onDelete: "set null" }),
  categoryId:       integer("category_id").references(() => resourceCategoriesTable.id, { onDelete: "set null" }),
  status:           resourceStatusEnum("status").notNull().default("Draft"),
  featured:         boolean("featured").notNull().default(false),
  seoTitle:         text("seo_title"),
  seoDescription:   text("seo_description"),
  publishedAt:      timestamp("published_at"),
  scheduledFor:     timestamp("scheduled_for"),
  createdBy:        integer("created_by").references(() => usersTable.id, { onDelete: "set null" }),
  updatedBy:        integer("updated_by").references(() => usersTable.id, { onDelete: "set null" }),
  createdAt:        timestamp("created_at").defaultNow().notNull(),
  updatedAt:        timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
  index("resources_content_type_idx").on(t.contentType),
  index("resources_status_idx").on(t.status),
  index("resources_category_idx").on(t.categoryId),
  index("resources_scheduled_idx").on(t.scheduledFor),
]);

/* ── Tag relationships (many-to-many) ───────────────────────────────── */
export const resourceTagRelationshipsTable = pgTable("resource_tag_relationships", {
  resourceId: integer("resource_id").notNull().references(() => resourcesTable.id, { onDelete: "cascade" }),
  tagId:      integer("tag_id").notNull().references(() => resourceTagsTable.id, { onDelete: "cascade" }),
}, (t) => [primaryKey({ columns: [t.resourceId, t.tagId] })]);

/* ── Extension: Events ──────────────────────────────────────────────── */
export const resourceEventsTable = pgTable("resource_events", {
  id:              serial("id").primaryKey(),
  resourceId:      integer("resource_id").notNull().unique().references(() => resourcesTable.id, { onDelete: "cascade" }),
  startDatetime:   timestamp("start_datetime"),
  endDatetime:     timestamp("end_datetime"),
  timezone:        text("timezone"),
  venue:           text("venue"),
  isOnline:        boolean("is_online").notNull().default(false),
  registrationUrl: text("registration_url"),
  speakers:        text("speakers").notNull().default("[]"),  // JSON array
});

/* ── Extension: Podcasts ────────────────────────────────────────────── */
export const resourcePodcastsTable = pgTable("resource_podcasts", {
  id:            serial("id").primaryKey(),
  resourceId:    integer("resource_id").notNull().unique().references(() => resourcesTable.id, { onDelete: "cascade" }),
  episodeNumber: integer("episode_number"),
  season:        integer("season"),
  host:          text("host"),
  guests:        text("guests").notNull().default("[]"),         // JSON array
  audioUrl:      text("audio_url"),
  externalUrls:  text("external_urls").notNull().default("{}"),  // JSON object {spotify, apple, ...}
  transcript:    text("transcript"),
});

/* ── Extension: Webinars ────────────────────────────────────────────── */
export const resourceWebinarsTable = pgTable("resource_webinars", {
  id:              serial("id").primaryKey(),
  resourceId:      integer("resource_id").notNull().unique().references(() => resourcesTable.id, { onDelete: "cascade" }),
  speakers:        text("speakers").notNull().default("[]"),  // JSON array
  registrationUrl: text("registration_url"),
  meetingUrl:      text("meeting_url"),
  recordingUrl:    text("recording_url"),
  transcript:      text("transcript"),
});

/* ── Extension: Research Reports ────────────────────────────────────── */
export const resourceReportsTable = pgTable("resource_reports", {
  id:              serial("id").primaryKey(),
  resourceId:      integer("resource_id").notNull().unique().references(() => resourcesTable.id, { onDelete: "cascade" }),
  fileUrl:         text("file_url"),
  fileSize:        integer("file_size"),  // bytes
  fileType:        text("file_type"),
  downloadCount:   integer("download_count").notNull().default(0),
  organisation:    text("organisation"),
  publicationYear: integer("publication_year"),
});

/* ── Types ──────────────────────────────────────────────────────────── */
export type Resource             = typeof resourcesTable.$inferSelect;
export type NewResource          = typeof resourcesTable.$inferInsert;
export type ResourceCategory     = typeof resourceCategoriesTable.$inferSelect;
export type NewResourceCategory  = typeof resourceCategoriesTable.$inferInsert;
export type ResourceTag          = typeof resourceTagsTable.$inferSelect;
export type NewResourceTag       = typeof resourceTagsTable.$inferInsert;
export type ResourceEvent        = typeof resourceEventsTable.$inferSelect;
export type ResourcePodcast      = typeof resourcePodcastsTable.$inferSelect;
export type ResourceWebinar      = typeof resourceWebinarsTable.$inferSelect;
export type ResourceReport       = typeof resourceReportsTable.$inferSelect;
export type ResourceContentType  = "Blog" | "Event" | "Podcast" | "Webinar" | "Research Report" | "Customer Story";
export type ResourceStatus       = "Draft" | "In Review" | "Scheduled" | "Published" | "Unpublished" | "Archived";
