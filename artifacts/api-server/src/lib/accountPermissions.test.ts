import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";

// These factories fail immediately if either module imports live DB plumbing.
vi.mock("pg", () => { throw new Error("Database import forbidden in account foundation tests"); });
vi.mock("@workspace/db", () => { throw new Error("Database package import forbidden"); });
vi.mock("drizzle-orm/node-postgres", () => { throw new Error("Database adapter import forbidden"); });

import {
  accountActorSchema,
  accountEmailInputSchema,
  accountLoginInputSchema,
  accountVerificationInputSchema,
  passwordRecoveryInputSchema,
  publicAccountViewSchema,
  publicProfileUpdateInputSchema,
  publicRegistrationInputSchema,
  staffInvitationAcceptanceInputSchema,
  staffInvitationInputSchema,
  STAFF_ROLES,
  type AccountActor,
  type PublicAccountType,
} from "./accountContracts";
import { ACCOUNT_ACTIONS, decideAccountPermission } from "./accountPermissions";

const anonymous = { kind: "anonymous" } as const;
const makePublic = (
  accountType: PublicAccountType = "customer",
  emailVerified = true,
): Extract<AccountActor, { kind: "public" }> => ({
  kind: "public", userId: 41, role: "PUBLIC_USER", accountType,
  isActive: true, emailVerified,
});
const staffExpected = [
  ["hr.access", ["SUPER_ADMIN", "HR_ADMIN"]],
  ["cms.access", ["SUPER_ADMIN", "CONTENT_EDITOR", "CONTENT_AUTHOR"]],
  ["cms.publish", ["SUPER_ADMIN", "CONTENT_EDITOR"]],
  ["farmData.manage", ["SUPER_ADMIN", "CONTENT_EDITOR"]],
  ["staff.upload", ["SUPER_ADMIN", "HR_ADMIN", "CONTENT_EDITOR", "CONTENT_AUTHOR"]],
  ["staff.privateFiles", ["SUPER_ADMIN", "HR_ADMIN"]],
  ["stats.read", ["SUPER_ADMIN", "HR_ADMIN", "CONTENT_EDITOR", "CONTENT_AUTHOR"]],
  ["users.manage", ["SUPER_ADMIN"]],
  ["audit.read", ["SUPER_ADMIN"]],
  ["staff.invite", ["SUPER_ADMIN"]],
] as const;

describe("inactive account permission proposal", () => {
  describe.each(STAFF_ROLES)("existing staff role %s", (role) => {
    const actor = { kind: "staff", userId: 7, role, isActive: true };
    it.each(staffExpected)("restricts %s to existing eligible roles", (action, allowed) => {
      expect(decideAccountPermission(actor, action).allowed)
        .toBe((allowed as readonly string[]).includes(role));
    });
    it("allows session inspection without imposing public email verification", () => {
      expect(decideAccountPermission(actor, "account.session")).toEqual({ allowed: true });
    });
    it("does not interpret staff membership as public-profile access", () => {
      expect(decideAccountPermission(actor, "publicProfile.update", { ownerUserId: 7 }))
        .toEqual({ allowed: false, reason: "forbidden_role" });
    });
  });

  describe.each(["customer", "farmer"] as const)("%s public account", (accountType) => {
    describe.each([true, false])("emailVerified=%s", (verified) => {
      it.each(staffExpected)("never grants staff capability %s", (action) => {
        expect(decideAccountPermission(makePublic(accountType, verified), action))
          .toEqual({ allowed: false, reason: "forbidden_role" });
      });
    });
    it.each(["publicProfile.read", "publicProfile.update"])("limits %s to the owner", (action) => {
      expect(decideAccountPermission(makePublic(accountType), action, { ownerUserId: 41 }))
        .toEqual({ allowed: true });
      expect(decideAccountPermission(makePublic(accountType), action, { ownerUserId: 42 }))
        .toEqual({ allowed: false, reason: "not_owner" });
    });
    it.each(["publicProfile.read", "publicProfile.update"])("blocks unverified %s", (action) => {
      expect(decideAccountPermission(makePublic(accountType, false), action, { ownerUserId: 41 }))
        .toEqual({ allowed: false, reason: "verification_required" });
    });
    it.each(["account.verify", "account.resendVerification"])("permits pending %s only", (action) => {
      expect(decideAccountPermission(makePublic(accountType, false), action))
        .toEqual({ allowed: true });
      expect(decideAccountPermission(makePublic(accountType), action))
        .toEqual({ allowed: false, reason: "already_verified" });
    });
    it("allows only session-state inspection before verification", () => {
      expect(decideAccountPermission(makePublic(accountType, false), "account.session"))
        .toEqual({ allowed: true });
    });
    it("does not allow an authenticated account to register another identity", () => {
      expect(decideAccountPermission(makePublic(accountType), "account.register").allowed).toBe(false);
    });
  });

  it.each(["public.read", "public.submit", "account.requestRecovery", "account.logout"])(
    "keeps anonymous %s available without granting account access", (action) => {
      expect(decideAccountPermission(anonymous, action)).toEqual({ allowed: true });
    },
  );
  it("admits anonymous registration without granting staff privileges", () => {
    expect(decideAccountPermission(anonymous, "account.register")).toEqual({ allowed: true });
  });
  it.each(ACCOUNT_ACTIONS.filter((action) => ![
    "public.read", "public.submit", "account.requestRecovery", "account.logout", "account.register",
  ].includes(action)))("rejects anonymous protected action %s", (action) => {
    expect(decideAccountPermission(anonymous, action))
      .toEqual({ allowed: false, reason: "authentication_required" });
  });

  describe.each([
    { ...makePublic(), isActive: false },
    { kind: "staff", userId: 7, role: "SUPER_ADMIN", isActive: false },
  ])("inactive identity $kind", (actor) => {
    it.each(ACCOUNT_ACTIONS.filter((action) => ![
      "public.read", "public.submit", "account.requestRecovery", "account.logout", "account.register",
    ].includes(action)))("blocks private action %s", (action) => {
      expect(decideAccountPermission(actor, action, { ownerUserId: 41 }))
        .toEqual({ allowed: false, reason: "inactive_account" });
    });
    it("retains idempotent sign-out and non-enumerating recovery requests", () => {
      expect(decideAccountPermission(actor, "account.logout").allowed).toBe(true);
      expect(decideAccountPermission(actor, "account.requestRecovery").allowed).toBe(true);
    });
  });

  it("recognizes legacy null-ID super-admin without changing active middleware", () => {
    const legacy = { kind: "staff", userId: null, role: "SUPER_ADMIN", isActive: true };
    expect(decideAccountPermission(legacy, "users.manage")).toEqual({ allowed: true });
    expect(decideAccountPermission({ ...legacy, role: "HR_ADMIN" }, "hr.access"))
      .toEqual({ allowed: false, reason: "invalid_actor" });
  });
  it.each([
    undefined, null, [], {}, { kind: "staff" },
    { ...makePublic(), role: "CONTENT_AUTHOR" },
    { ...makePublic(), role: "SUPER_ADMIN" },
    { ...makePublic(), kind: "staff" },
    { ...makePublic(), accountType: "staff" },
    { ...makePublic(), userId: "41" },
    { ...makePublic(), userId: 0 },
    { ...makePublic(), userId: -1 },
    { ...makePublic(), userId: 1.5 },
    { ...makePublic(), userId: Number.MAX_SAFE_INTEGER + 1 },
    { ...makePublic(), userId: Number.NaN },
    { ...makePublic(), isActive: "true" },
    { ...makePublic(), emailVerified: "true" },
    { ...makePublic(), canAdmin: true },
  ])("fails closed on malformed or escalated identity %#", (actor) => {
    expect(decideAccountPermission(actor, "publicProfile.read", { ownerUserId: 41 }))
      .toEqual({ allowed: false, reason: "invalid_actor" });
  });
  it.each(["constructor", "__proto__", "cms.delete", "", null, 1])(
    "denies unknown action %# without fallback", (action) => {
      expect(decideAccountPermission(makePublic(), action))
        .toEqual({ allowed: false, reason: "unknown_action" });
    },
  );
  it.each([
    undefined, null, {}, { ownerUserId: "41" }, { ownerUserId: 0 },
    { ownerUserId: 41.5 }, { ownerUserId: Number.MAX_SAFE_INTEGER + 1 },
    { ownerUserId: 41, bypass: true },
  ])("requires a valid server-loaded ownership target %#", (target) => {
    expect(decideAccountPermission(makePublic(), "publicProfile.read", target))
      .toEqual({ allowed: false, reason: "invalid_target" });
  });
  it("does not mutate caller identity or ownership context", () => {
    const actor = Object.freeze(makePublic());
    const target = Object.freeze({ ownerUserId: 41 });
    expect(decideAccountPermission(actor, "publicProfile.update", target).allowed).toBe(true);
    expect(actor).toEqual(makePublic());
    expect(target).toEqual({ ownerUserId: 41 });
  });
});

describe("standalone contract drafts", () => {
  const registration = {
    email: " PERSON@EXAMPLE.TEST ", password: "example password",
    name: " Example Person ", accountType: "customer",
  };
  it("normalizes registration identity fields without selecting a staff role", () => {
    expect(publicRegistrationInputSchema.parse(registration)).toEqual({
      ...registration, email: "person@example.test", name: "Example Person",
    });
  });
  it.each(["role", "userId", "isActive", "emailVerified", "emailVerifiedAt", "passwordHash"])(
    "rejects server-owned registration field %s", (field) => {
      expect(publicRegistrationInputSchema.safeParse({ ...registration, [field]: "forged" }).success)
        .toBe(false);
    },
  );
  it.each(["staff", "SUPER_ADMIN", "", null])("rejects invalid public classification %#", (value) => {
    expect(publicRegistrationInputSchema.safeParse({ ...registration, accountType: value }).success)
      .toBe(false);
  });
  it.each(["", "short", "é".repeat(37), "a".repeat(73)])(
    "rejects short or bcrypt-truncated new passwords %#", (password) => {
      expect(publicRegistrationInputSchema.safeParse({ ...registration, password }).success)
        .toBe(false);
    },
  );
  it("accepts the exact bcrypt UTF-8 byte boundary without trimming passwords", () => {
    expect(publicRegistrationInputSchema.safeParse({ ...registration, password: "é".repeat(36) }).success)
      .toBe(true);
    expect(publicRegistrationInputSchema.parse({ ...registration, password: "   example password   " }).password)
      .toBe("   example password   ");
  });
  it.each([
    {}, { name: "" }, { name: undefined }, { accountType: "staff" },
    { role: "SUPER_ADMIN" }, { userId: 42 }, { email: "other@example.test" },
    { emailVerified: true }, { isActive: true },
  ])("rejects empty or privilege-bearing profile patch %#", (patch) => {
    expect(publicProfileUpdateInputSchema.safeParse(patch).success).toBe(false);
  });
  it("allows only nonempty approved profile fields", () => {
    expect(publicProfileUpdateInputSchema.parse({ name: " New Name ", accountType: "farmer" }))
      .toEqual({ name: "New Name", accountType: "farmer" });
  });
  it("keeps staff invitations administrator-controlled and rejects public-role invitations", () => {
    expect(staffInvitationInputSchema.safeParse({
      email: "staff@example.test", name: "Staff", role: "PUBLIC_USER",
    }).success).toBe(false);
    expect(staffInvitationInputSchema.safeParse({
      email: "staff@example.test", name: "Staff", role: "HR_ADMIN",
    }).success).toBe(true);
    expect(decideAccountPermission(makePublic(), "staff.invite").allowed).toBe(false);
  });
  it("validates credential/token draft shapes without issuing or consuming anything", () => {
    expect(accountLoginInputSchema.safeParse({ email: "person@example.test", password: "x" }).success)
      .toBe(true);
    expect(accountLoginInputSchema.safeParse({ email: "person@example.test", password: "" }).success)
      .toBe(false);
    expect(accountEmailInputSchema.safeParse({ email: "invalid" }).success).toBe(false);
    expect(accountVerificationInputSchema.safeParse({ token: "" }).success).toBe(false);
    expect(accountVerificationInputSchema.safeParse({ token: "draft-token", userId: 41 }).success)
      .toBe(false);
    expect(passwordRecoveryInputSchema.safeParse({
      token: "draft-token", newPassword: "example password",
    }).success).toBe(true);
    expect(staffInvitationAcceptanceInputSchema.safeParse({
      token: "draft-token", password: "example password", role: "SUPER_ADMIN",
    }).success).toBe(false);
  });
  it("excludes password hashes and session tokens from public-account response drafts", () => {
    const view = {
      userId: 41, email: "person@example.test", name: "Person",
      role: "PUBLIC_USER", accountType: "farmer", emailVerified: true,
    };
    expect(publicAccountViewSchema.safeParse(view).success).toBe(true);
    for (const field of ["passwordHash", "tokenHash", "sessionToken"]) {
      expect(publicAccountViewSchema.safeParse({ ...view, [field]: "do-not-expose" }).success).toBe(false);
    }
  });
  it("treats well-shaped actors as trusted claims, not proof of authentication", () => {
    expect(accountActorSchema.safeParse({
      kind: "staff", userId: 1, role: "SUPER_ADMIN", isActive: true,
    }).success).toBe(true);
    // Future adapters MUST obtain these claims from server-side authentication.
    expect(publicRegistrationInputSchema.safeParse({
      ...registration, kind: "staff", role: "SUPER_ADMIN",
    }).success).toBe(false);
  });
  it("keeps the two foundation modules free of DB, network and environment dependencies", () => {
    for (const [file, allowedImports] of [
      ["accountContracts.ts", ["zod/v4"]],
      ["accountPermissions.ts", ["./accountContracts"]],
    ] as const) {
      const source = readFileSync(new URL(file, import.meta.url), "utf8");
      const imports = [...source.matchAll(/\bfrom\s+["']([^"']+)["']/g)].map((match) => match[1]);
      expect(imports.length).toBeGreaterThan(0);
      for (const imported of imports) expect(allowedImports as readonly string[]).toContain(imported);
      expect(source).not.toMatch(/\b(?:import|require)\s*\(|\bprocess\.env\b|\bfetch\s*\(|\bnew\s+Pool\b/);
    }
  });
});
