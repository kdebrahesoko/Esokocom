import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { getTableConfig } from "drizzle-orm/pg-core";

// Any accidental live client/migrator import aborts this suite before tests run.
vi.mock("pg", () => { throw new Error("PostgreSQL import forbidden"); });
vi.mock("@workspace/db", () => { throw new Error("Live database import forbidden"); });
vi.mock("drizzle-orm/node-postgres", () => { throw new Error("Database adapter forbidden"); });
vi.mock("drizzle-orm/node-postgres/migrator", () => { throw new Error("Migrator forbidden"); });

import {
  proposedAccountActionTokens, proposedPublicProfiles, proposedUserRoleEnum,
} from "../../../../lib/db/src/proposals/publicAccounts";
import { userRoleEnum, usersTable } from "../../../../lib/db/src/schema/auth";

const profile = getTableConfig(proposedPublicProfiles);
const tokens = getTableConfig(proposedAccountActionTokens);
const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
const proposal = read("../../../../lib/db/proposals/public-accounts.sql.proposed");

describe("inactive public-account declarations", () => {
  it("preserves all current staff enum labels and appends only public access", () => {
    expect(userRoleEnum.enumValues).toEqual([
      "SUPER_ADMIN", "HR_ADMIN", "CONTENT_EDITOR", "CONTENT_AUTHOR",
    ]);
    expect(proposedUserRoleEnum.enumValues).toEqual([...userRoleEnum.enumValues, "PUBLIC_USER"]);
    expect(usersTable.role.default).toBe("CONTENT_AUTHOR");
  });

  it.each([
    ["public_profiles", profile, ["user_id", "account_type", "email_verified_at"]],
    ["account_action_tokens", tokens, [
      "id", "user_id", "token_hash", "purpose", "expires_at", "consumed_at", "created_at",
    ]],
  ] as const)("defines only the minimal columns for %s", (name, config, columns) => {
    expect(config.name).toBe(name);
    expect(config.columns.map((column) => column.name)).toEqual(columns);
    expect(config.indexes).toHaveLength(0);
    expect(config.policies).toHaveLength(0);
  });

  it.each([profile, tokens])("links new rows to existing users with explicit actions", (config) => {
    expect(config.foreignKeys).toHaveLength(1);
    const fk = config.foreignKeys[0];
    expect(fk.reference().foreignTable).toBe(usersTable);
    expect(fk.reference().columns.map((column) => column.name)).toEqual(["user_id"]);
    expect(fk.reference().foreignColumns.map((column) => column.name)).toEqual(["id"]);
    expect(fk.onDelete).toBe("cascade");
    expect(fk.onUpdate).toBe("no action");
    expect(config.columns.find((column) => column.name === "user_id")?.notNull).toBe(true);
  });

  it("enforces one profile per user and restricted classification", () => {
    expect(profile.primaryKeys[0].getName()).toBe("public_profiles_pkey");
    expect(profile.primaryKeys[0].columns.map((column) => column.name)).toEqual(["user_id"]);
    expect(proposedPublicProfiles.accountType.enumValues).toEqual(["customer", "farmer"]);
    expect(proposedPublicProfiles.emailVerifiedAt.notNull).toBe(false);
  });

  it("proposes unique hashed tokens and timestamps without raw bearer fields", () => {
    expect(tokens.uniqueConstraints[0].name).toBe("account_action_tokens_token_hash_unique");
    expect(tokens.uniqueConstraints[0].columns.map((column) => column.name)).toEqual(["token_hash"]);
    expect(proposedAccountActionTokens.purpose.enumValues).toEqual([
      "email_verification", "password_recovery", "staff_invitation",
    ]);
    expect(proposedAccountActionTokens.consumedAt.notNull).toBe(false);
    expect(proposedAccountActionTokens.expiresAt.notNull).toBe(true);
    expect(tokens.columns.some((column) => /password|raw_token|cookie/.test(column.name))).toBe(false);
  });

  it.each([...profile.checks, ...tokens.checks])("retains reviewable constraint $name in SQL", (check) => {
    expect(proposal).toContain(`CONSTRAINT ${check.name}`);
  });

  it("keeps declarations out of live schema generation and runtime exports", () => {
    const barrel = read("../../../../lib/db/src/schema/index.ts");
    const runtime = read("../../../../lib/db/src/index.ts");
    const config = read("../../../../lib/db/drizzle.config.ts");
    expect(barrel).not.toMatch(/proposals|publicAccounts/);
    expect(runtime).not.toMatch(/proposals|publicAccounts/);
    expect(config).toContain('./src/schema/index.ts');
    expect(config).not.toMatch(/proposals|publicAccounts/);
  });

  it("does not create or alter historical migration files or journal entries", () => {
    expect(proposal).not.toMatch(/\b(DROP|TRUNCATE|DELETE FROM|INSERT INTO|UPDATE public\.)\b/i);
    expect(proposal).not.toContain("__drizzle_migrations");
    expect(proposal).not.toContain("applications");
    expect(proposal.match(/CREATE TABLE/g)).toHaveLength(2);
    expect(proposal).not.toContain("CREATE INDEX");
  });

  it("commits the enum addition separately before proposing use of its new value", () => {
    expect(proposal).toMatch(
      /ALTER TYPE public\.user_role ADD VALUE 'PUBLIC_USER';\s*COMMIT;[\s\S]*BEGIN;\s*ALTER TABLE public\.users ALTER COLUMN role SET DEFAULT 'PUBLIC_USER';/,
    );
  });
});
