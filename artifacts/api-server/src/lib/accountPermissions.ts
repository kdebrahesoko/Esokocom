/**
 * INACTIVE, pure permission proposal. No middleware registration or DB access.
 * Authentication, resource lookup, token proof and business-state checks must
 * happen in future trusted adapters BEFORE a policy decision is used.
 */
import {
  accountActorSchema,
  publicProfileTargetSchema,
  type StaffRole,
} from "./accountContracts";

export const ACCOUNT_ACTIONS = [
  "public.read", "public.submit",
  "account.register", "account.requestRecovery", "account.logout",
  "account.session", "account.verify", "account.resendVerification",
  "publicProfile.read", "publicProfile.update",
  "hr.access", "cms.access", "cms.publish", "farmData.manage",
  "staff.upload", "staff.privateFiles", "stats.read",
  "users.manage", "audit.read", "staff.invite",
] as const;
export type AccountAction = typeof ACCOUNT_ACTIONS[number];
export type AccountDenialReason =
  | "unknown_action"
  | "invalid_actor"
  | "authentication_required"
  | "inactive_account"
  | "forbidden_role"
  | "verification_required"
  | "already_verified"
  | "invalid_target"
  | "not_owner";
export type AccountPermissionDecision =
  | Readonly<{ allowed: true }>
  | Readonly<{ allowed: false; reason: AccountDenialReason }>;

const ALLOW: AccountPermissionDecision = Object.freeze({ allowed: true });
const deny = (reason: AccountDenialReason): AccountPermissionDecision =>
  ({ allowed: false, reason });

// Entry-point eligibility only. Existing per-record/editorial checks must stay.
const staffAccess: Partial<Record<AccountAction, readonly StaffRole[]>> = {
  "hr.access": ["SUPER_ADMIN", "HR_ADMIN"],
  "cms.access": ["SUPER_ADMIN", "CONTENT_EDITOR", "CONTENT_AUTHOR"],
  "cms.publish": ["SUPER_ADMIN", "CONTENT_EDITOR"],
  "farmData.manage": ["SUPER_ADMIN", "CONTENT_EDITOR"],
  "staff.upload": ["SUPER_ADMIN", "HR_ADMIN", "CONTENT_EDITOR", "CONTENT_AUTHOR"],
  "staff.privateFiles": ["SUPER_ADMIN", "HR_ADMIN"],
  "stats.read": ["SUPER_ADMIN", "HR_ADMIN", "CONTENT_EDITOR", "CONTENT_AUTHOR"],
  "users.manage": ["SUPER_ADMIN"],
  "audit.read": ["SUPER_ADMIN"],
  "staff.invite": ["SUPER_ADMIN"],
};

/**
 * Fail closed on invalid input. This function never authenticates a caller:
 * actorInput must come from an established server-side identity (or a validated,
 * purpose-bound account token), not client claims. targetInput must be fetched
 * from the server's resource record. No universal super-admin override is used.
 */
export function decideAccountPermission(
  actorInput: unknown,
  actionInput: unknown,
  targetInput?: unknown,
): AccountPermissionDecision {
  if (
    typeof actionInput !== "string" ||
    !(ACCOUNT_ACTIONS as readonly string[]).includes(actionInput)
  ) return deny("unknown_action");
  const action = actionInput as AccountAction;
  const parsed = accountActorSchema.safeParse(actorInput);
  if (!parsed.success) return deny("invalid_actor");
  const actor = parsed.data;

  // Published browsing/submissions remain public. Recovery requests are only
  // non-enumerating endpoint admission, NOT permission to reset a password.
  // Idempotent logout stays possible even for inactive/anonymous identities.
  if (
    action === "public.read" || action === "public.submit" ||
    action === "account.requestRecovery" || action === "account.logout"
  ) return ALLOW;
  if (action === "account.register") {
    return actor.kind === "anonymous" ? ALLOW : deny("forbidden_role");
  }
  if (actor.kind === "anonymous") return deny("authentication_required");
  if (!actor.isActive) return deny("inactive_account");
  if (action === "account.session") return ALLOW;

  if (actor.kind === "public") {
    if (action === "account.verify" || action === "account.resendVerification") {
      return actor.emailVerified ? deny("already_verified") : ALLOW;
    }
    if (action === "publicProfile.read" || action === "publicProfile.update") {
      if (!actor.emailVerified) return deny("verification_required");
      const target = publicProfileTargetSchema.safeParse(targetInput);
      if (!target.success) return deny("invalid_target");
      return target.data.ownerUserId === actor.userId ? ALLOW : deny("not_owner");
    }
    return deny("forbidden_role");
  }

  const roles = staffAccess[action];
  return roles?.includes(actor.role) ? ALLOW : deny("forbidden_role");
}
