import {
  pgTable, text, serial, timestamp, pgEnum,
} from "drizzle-orm/pg-core";

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
  "Applied", "Review", "Assessment", "Interview",
  "Leadership", "Offer", "Hired", "Rejected",
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
  about:          text("about").notNull().default(""),
  responsibilities: text("responsibilities").notNull().default("[]"),  // JSON array
  requirements:   text("requirements").notNull().default("[]"),         // JSON array
  niceToHave:     text("nice_to_have").notNull().default("[]"),         // JSON array
  skills:         text("skills").notNull().default("[]"),               // JSON array
  benefits:       text("benefits").notNull().default("[]"),             // JSON array
  salaryRange:    text("salary_range"),
  deadline:       text("deadline").notNull().default(""),
  applicationQuestions: text("application_questions").notNull().default("[]"), // JSON array
  status:         jobStatusEnum("status").notNull().default("Draft"),
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

/* ── Types ──────────────────────────────────────────────────────────── */
export type Job = typeof jobsTable.$inferSelect;
export type NewJob = typeof jobsTable.$inferInsert;
export type Application = typeof applicationsTable.$inferSelect;
export type NewApplication = typeof applicationsTable.$inferInsert;
