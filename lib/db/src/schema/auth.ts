import {
  pgTable, text, serial, integer, boolean, timestamp, pgEnum,
} from "drizzle-orm/pg-core";

/* ── Role enum ───────────────────────────────────────────────────────── */
export const userRoleEnum = pgEnum("user_role", [
  "SUPER_ADMIN", "HR_ADMIN", "CONTENT_EDITOR", "CONTENT_AUTHOR",
]);

/* ── Users ───────────────────────────────────────────────────────────── */
export const usersTable = pgTable("users", {
  id:           serial("id").primaryKey(),
  email:        text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name:         text("name").notNull(),
  role:         userRoleEnum("role").notNull().default("CONTENT_AUTHOR"),
  isActive:     boolean("is_active").notNull().default(true),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
  updatedAt:    timestamp("updated_at").defaultNow().notNull(),
});

/* ── Sessions (DB-persisted, survives restarts) ───────────────────────── */
export const sessionsTable = pgTable("sessions", {
  id:        serial("id").primaryKey(),
  userId:    integer("user_id").references(() => usersTable.id, { onDelete: "cascade" }).notNull(),
  tokenHash: text("token_hash").notNull().unique(),  // SHA-256 of the raw cookie token
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ── Audit logs ──────────────────────────────────────────────────────── */
export const auditLogsTable = pgTable("audit_logs", {
  id:         serial("id").primaryKey(),
  userId:     integer("user_id").references(() => usersTable.id, { onDelete: "set null" }),
  action:     text("action").notNull(),       // e.g. "login", "logout", "login_failed", "user_created"
  entityType: text("entity_type"),            // e.g. "job", "application", "user"
  entityId:   text("entity_id"),              // string form of the entity's id
  metadata:   text("metadata").default("{}"), // JSON blob — no sensitive data
  ip:         text("ip"),
  createdAt:  timestamp("created_at").defaultNow().notNull(),
});

/* ── Types ──────────────────────────────────────────────────────────── */
export type User    = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
export type Session = typeof sessionsTable.$inferSelect;
export type AuditLog = typeof auditLogsTable.$inferSelect;
export type UserRole = "SUPER_ADMIN" | "HR_ADMIN" | "CONTENT_EDITOR" | "CONTENT_AUTHOR";
