import {
  pgTable, text, serial, integer, boolean, timestamp, pgEnum, primaryKey, index, foreignKey,
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
  authorId:         integer("author_id"),
  categoryId:       integer("category_id"),
  status:           resourceStatusEnum("status").notNull().default("Draft"),
  featured:         boolean("featured").notNull().default(false),
  seoTitle:         text("seo_title"),
  seoDescription:   text("seo_description"),
  publishedAt:      timestamp("published_at"),
  scheduledFor:     timestamp("scheduled_for"),
  createdBy:        integer("created_by"),
  updatedBy:        integer("updated_by"),
  createdAt:        timestamp("created_at").defaultNow().notNull(),
  updatedAt:        timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
  foreignKey({ name: "resources_author_id_fkey", columns: [t.authorId], foreignColumns: [usersTable.id] }).onDelete("set null"),
  foreignKey({ name: "resources_category_id_fkey", columns: [t.categoryId], foreignColumns: [resourceCategoriesTable.id] }).onDelete("set null"),
  foreignKey({ name: "resources_created_by_fkey", columns: [t.createdBy], foreignColumns: [usersTable.id] }).onDelete("set null"),
  foreignKey({ name: "resources_updated_by_fkey", columns: [t.updatedBy], foreignColumns: [usersTable.id] }).onDelete("set null"),
  index("resources_content_type_idx").on(t.contentType),
  index("resources_status_idx").on(t.status),
  index("resources_category_idx").on(t.categoryId),
  index("resources_scheduled_idx").on(t.scheduledFor),
]);

/* ── Tag relationships (many-to-many) ───────────────────────────────── */
export const resourceTagRelationshipsTable = pgTable("resource_tag_relationships", {
  resourceId: integer("resource_id").notNull(),
  tagId:      integer("tag_id").notNull(),
}, (t) => [
  primaryKey({ name: "resource_tag_relationships_pkey", columns: [t.resourceId, t.tagId] }),
  foreignKey({ name: "resource_tag_relationships_resource_id_fkey", columns: [t.resourceId], foreignColumns: [resourcesTable.id] }).onDelete("cascade"),
  foreignKey({ name: "resource_tag_relationships_tag_id_fkey", columns: [t.tagId], foreignColumns: [resourceTagsTable.id] }).onDelete("cascade"),
]);

/* ── Extension: Events ──────────────────────────────────────────────── */
export const resourceEventsTable = pgTable("resource_events", {
  id:              serial("id").primaryKey(),
  resourceId:      integer("resource_id").notNull().unique("resource_events_resource_id_key"),
  startDatetime:   timestamp("start_datetime"),
  endDatetime:     timestamp("end_datetime"),
  timezone:        text("timezone"),
  venue:           text("venue"),
  isOnline:        boolean("is_online").notNull().default(false),
  registrationUrl: text("registration_url"),
  speakers:        text("speakers").notNull().default("[]"),  // JSON array
}, (t) => [
  foreignKey({ name: "resource_events_resource_id_fkey", columns: [t.resourceId], foreignColumns: [resourcesTable.id] }).onDelete("cascade"),
]);

/* ── Extension: Podcasts ────────────────────────────────────────────── */
export const resourcePodcastsTable = pgTable("resource_podcasts", {
  id:            serial("id").primaryKey(),
  resourceId:    integer("resource_id").notNull().unique("resource_podcasts_resource_id_key"),
  episodeNumber: integer("episode_number"),
  season:        integer("season"),
  host:          text("host"),
  guests:        text("guests").notNull().default("[]"),         // JSON array
  audioUrl:      text("audio_url"),
  externalUrls:  text("external_urls").notNull().default("{}"),  // JSON object {spotify, apple, ...}
  transcript:    text("transcript"),
}, (t) => [
  foreignKey({ name: "resource_podcasts_resource_id_fkey", columns: [t.resourceId], foreignColumns: [resourcesTable.id] }).onDelete("cascade"),
]);

/* ── Extension: Webinars ────────────────────────────────────────────── */
export const resourceWebinarsTable = pgTable("resource_webinars", {
  id:              serial("id").primaryKey(),
  resourceId:      integer("resource_id").notNull().unique("resource_webinars_resource_id_key"),
  speakers:        text("speakers").notNull().default("[]"),  // JSON array
  registrationUrl: text("registration_url"),
  meetingUrl:      text("meeting_url"),
  recordingUrl:    text("recording_url"),
  transcript:      text("transcript"),
}, (t) => [
  foreignKey({ name: "resource_webinars_resource_id_fkey", columns: [t.resourceId], foreignColumns: [resourcesTable.id] }).onDelete("cascade"),
]);

/* ── Extension: Research Reports ────────────────────────────────────── */
export const resourceReportsTable = pgTable("resource_reports", {
  id:              serial("id").primaryKey(),
  resourceId:      integer("resource_id").notNull().unique("resource_reports_resource_id_key"),
  fileUrl:         text("file_url"),
  fileSize:        integer("file_size"),  // bytes
  fileType:        text("file_type"),
  downloadCount:   integer("download_count").notNull().default(0),
  organisation:    text("organisation"),
  publicationYear: integer("publication_year"),
}, (t) => [
  foreignKey({ name: "resource_reports_resource_id_fkey", columns: [t.resourceId], foreignColumns: [resourcesTable.id] }).onDelete("cascade"),
]);

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
