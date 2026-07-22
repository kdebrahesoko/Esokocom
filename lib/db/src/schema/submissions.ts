import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";

export const demoRequestsTable = pgTable("demo_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  organization: text("organization").notNull(),
  country: text("country").notNull(),
  useCase: text("use_case").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contactSubmissionsTable = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type DemoRequest = typeof demoRequestsTable.$inferSelect;
export type ContactSubmission = typeof contactSubmissionsTable.$inferSelect;
