import {
  pgTable, text, serial, integer, boolean, timestamp, pgEnum,
} from "drizzle-orm/pg-core";
import { usersTable } from "./auth";

/* ── Enums ──────────────────────────────────────────────────────────── */
export const jobDepartmentEnum = pgEnum("job_department", [
  "Engineering", "Product", "Agriculture", "Operations",
  "Marketing", "Finance", "HR",
]);

export const jobTypeEnum = pgEnum("job_type", [
  "Full Time", "Contract", "Internship", "Graduate",
]);

export const jobExperienceEnum = pgEnum("job_experience", [
  "Entry Level", "Mid Level", "Senior", "Leadership",
]);

export const jobStatusEnum = pgEnum("job_status", [
  "Draft", "Published", "Closed",
]);

export const applicationStageEnum = pgEnum("application_stage", [
  // Legacy values (kept for backward compat — PostgreSQL enums are append-only)
  "Applied", "Review", "Leadership",
  // Full pipeline
  "New", "Screening", "Shortlisted", "Interview", "Assessment",
  "Offer", "Hired", "Rejected", "Withdrawn",
]);

/* ── Jobs ───────────────────────────────────────────────────────────── */
export const jobsTable = pgTable("jobs", {
  id:             serial("id").primaryKey(),
  slug:           text("slug").notNull().unique(),
  title:          text("title").notNull(),
  department:     jobDepartmentEnum("department").notNull(),
  location:       text("location").notNull(),
  type:           jobTypeEnum("type").notNull(),
  experience:     jobExperienceEnum("experience").notNull(),
  featured:       boolean("featured").notNull().default(false),
  about:          text("about").notNull().default(""),
  responsibilities: text("responsibilities").notNull().default("[]"),  // JSON array
  requirements:   text("requirements").notNull().default("[]"),         // JSON array
  niceToHave:     text("nice_to_have").notNull().default("[]"),         // JSON array
  skills:         text("skills").notNull().default("[]"),               // JSON array
  benefits:       text("benefits").notNull().default("[]"),             // JSON array
  salaryRange:    text("salary_range"),
  deadline:       text("deadline").notNull().default(""),
  applicationQuestions: text("application_questions").notNull().default("[]"), // JSON array
  seoTitle:       text("seo_title"),
  seoDescription: text("seo_description"),
  status:         jobStatusEnum("status").notNull().default("Draft"),
  publishedAt:    timestamp("published_at"),
  publishedBy:    integer("published_by").references(() => usersTable.id, { onDelete: "set null" }),
  updatedBy:      integer("updated_by").references(() => usersTable.id, { onDelete: "set null" }),
  createdAt:      timestamp("created_at").defaultNow().notNull(),
  updatedAt:      timestamp("updated_at").defaultNow().notNull(),
});

/* ── Applications ───────────────────────────────────────────────────── */
export const applicationsTable = pgTable("applications", {
  id:           serial("id").primaryKey(),
  jobId:        serial("job_id").references(() => jobsTable.id).notNull(),
  name:         text("name").notNull(),
  email:        text("email").notNull(),
  phone:        text("phone"),
  coverLetter:  text("cover_letter"),
  cvFileUrl:    text("cv_file_url"),
  answers:      text("answers").default("[]"),  // JSON: [{question, answer}]
  stage:        applicationStageEnum("stage").notNull().default("Applied"),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
});

/* ── Application notes (HR-internal — never exposed publicly) ────────── */
export const applicationNotesTable = pgTable("application_notes", {
  id:            serial("id").primaryKey(),
  applicationId: integer("application_id").notNull().references(() => applicationsTable.id, { onDelete: "cascade" }),
  authorId:      integer("author_id").references(() => usersTable.id, { onDelete: "set null" }),
  body:          text("body").notNull(),
  createdAt:     timestamp("created_at").defaultNow().notNull(),
});

/* ── Types ──────────────────────────────────────────────────────────── */
export type Job = typeof jobsTable.$inferSelect;
export type NewJob = typeof jobsTable.$inferInsert;
export type Application = typeof applicationsTable.$inferSelect;
export type NewApplication = typeof applicationsTable.$inferInsert;
export type ApplicationNote = typeof applicationNotesTable.$inferSelect;
export type NewApplicationNote = typeof applicationNotesTable.$inferInsert;
