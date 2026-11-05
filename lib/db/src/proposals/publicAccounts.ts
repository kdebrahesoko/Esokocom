/**
 * REVIEW-ONLY declarations. Deliberately absent from the schema barrel and
 * drizzle.config.ts: neither running code nor migration generation imports this.
 * PUBLIC_USER and the users.role default require separate reviewed SQL approval.
 */
import { sql } from "drizzle-orm";
import {
  check, foreignKey, integer, pgEnum, pgTable, primaryKey,
  serial, text, timestamp, unique,
} from "drizzle-orm/pg-core";
import { userRoleEnum, usersTable } from "../schema/auth";

export const proposedUserRoleEnum = pgEnum("user_role", [
  ...userRoleEnum.enumValues, "PUBLIC_USER",
]);

export const proposedPublicProfiles = pgTable("public_profiles", {
  userId: integer("user_id").notNull(),
  accountType: text("account_type", { enum: ["customer", "farmer"] }).notNull(),
  emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
}, (table) => [
  primaryKey({ name: "public_profiles_pkey", columns: [table.userId] }),
  foreignKey({
    name: "public_profiles_user_id_users_id_fk",
    columns: [table.userId], foreignColumns: [usersTable.id],
  }).onDelete("cascade").onUpdate("no action"),
  check("public_profiles_account_type_check",
    sql`${table.accountType} IN ('customer', 'farmer')`),
]);

export const proposedAccountActionTokens = pgTable("account_action_tokens", {
  id: serial("id").notNull(),
  userId: integer("user_id").notNull(),
  tokenHash: text("token_hash").notNull(),
  purpose: text("purpose", {
    enum: ["email_verification", "password_recovery", "staff_invitation"],
  }).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  consumedAt: timestamp("consumed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  primaryKey({ name: "account_action_tokens_pkey", columns: [table.id] }),
  unique("account_action_tokens_token_hash_unique").on(table.tokenHash),
  foreignKey({
    name: "account_action_tokens_user_id_users_id_fk",
    columns: [table.userId], foreignColumns: [usersTable.id],
  }).onDelete("cascade").onUpdate("no action"),
  check("account_action_tokens_purpose_check",
    sql`${table.purpose} IN ('email_verification', 'password_recovery', 'staff_invitation')`),
  check("account_action_tokens_hash_check", sql`${table.tokenHash} ~ '^[0-9a-f]{64}$'`),
  check("account_action_tokens_expiry_check", sql`${table.expiresAt} > ${table.createdAt}`),
  check("account_action_tokens_consumed_check",
    sql`${table.consumedAt} IS NULL OR ${table.consumedAt} >= ${table.createdAt}`),
]);

export type ProposedPublicProfile = typeof proposedPublicProfiles.$inferSelect;
export type ProposedAccountActionToken = typeof proposedAccountActionTokens.$inferSelect;
