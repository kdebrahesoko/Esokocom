/**
 * INACTIVE account-contract draft. Not imported by application routes/startup.
 * These are not generated HTTP contracts. Move approved endpoint definitions
 * into OpenAPI/codegen before integration; do not create a parallel API spec.
 */
import { z } from "zod/v4";

export const STAFF_ROLES = [
  "SUPER_ADMIN", "HR_ADMIN", "CONTENT_EDITOR", "CONTENT_AUTHOR",
] as const;
export const PUBLIC_ACCOUNT_TYPES = ["customer", "farmer"] as const;
/** Policy-only identity tag: NOT a declaration of a live database enum. */
export const PROPOSED_PUBLIC_ROLE = "PUBLIC_USER" as const;

export type StaffRole = typeof STAFF_ROLES[number];
export type PublicAccountType = typeof PUBLIC_ACCOUNT_TYPES[number];

const userIdSchema = z.number().int().positive().max(Number.MAX_SAFE_INTEGER);
const emailSchema = z.string().trim().toLowerCase().email().max(254);
const nameSchema = z.string().trim().min(1).max(100);
// Proposed new-account policy, not a change to legacy staff login/passwords.
// bcrypt truncates after 72 UTF-8 bytes; do not silently accept equivalent inputs.
const newPasswordSchema = z.string().min(12).refine(
  (value) => new TextEncoder().encode(value).length <= 72,
  "Password must not exceed 72 UTF-8 bytes",
);
const tokenSchema = z.string().min(1).max(512);

/**
 * Trusted server-derived identity only. Structural validation cannot establish
 * authentication or detect a forged but well-shaped staff identity.
 */
export const accountActorSchema = z.discriminatedUnion("kind", [
  z.strictObject({ kind: z.literal("anonymous") }),
  z.strictObject({
    kind: z.literal("public"),
    userId: userIdSchema,
    role: z.literal(PROPOSED_PUBLIC_ROLE),
    accountType: z.enum(PUBLIC_ACCOUNT_TYPES),
    isActive: z.boolean(),
    emailVerified: z.boolean(),
  }),
  z.strictObject({
    kind: z.literal("staff"),
    userId: userIdSchema.nullable(),
    role: z.enum(STAFF_ROLES),
    isActive: z.boolean(),
  }).refine(
    (actor) => actor.userId !== null || actor.role === "SUPER_ADMIN",
    "Only the existing legacy super-admin identity may lack a user ID",
  ),
]);
export type AccountActor = z.infer<typeof accountActorSchema>;

export const publicRegistrationInputSchema = z.strictObject({
  email: emailSchema,
  password: newPasswordSchema,
  name: nameSchema,
  accountType: z.enum(PUBLIC_ACCOUNT_TYPES),
});
export type PublicRegistrationInput = z.infer<typeof publicRegistrationInputSchema>;

export const accountLoginInputSchema = z.strictObject({
  email: emailSchema,
  password: z.string().min(1),
});
export const accountEmailInputSchema = z.strictObject({ email: emailSchema });
export const accountVerificationInputSchema = z.strictObject({ token: tokenSchema });
export const passwordRecoveryInputSchema = z.strictObject({
  token: tokenSchema,
  newPassword: newPasswordSchema,
});
export const publicProfileUpdateInputSchema = z.strictObject({
  name: nameSchema.optional(),
  accountType: z.enum(PUBLIC_ACCOUNT_TYPES).optional(),
}).refine(
  (value) => value.name !== undefined || value.accountType !== undefined,
  "At least one profile field is required",
);
export const staffInvitationInputSchema = z.strictObject({
  email: emailSchema,
  name: nameSchema,
  role: z.enum(STAFF_ROLES),
});
export const staffInvitationAcceptanceInputSchema = z.strictObject({
  token: tokenSchema,
  password: newPasswordSchema,
});

/** Resource ownership must be loaded server-side, never trusted from a body. */
export const publicProfileTargetSchema = z.strictObject({ ownerUserId: userIdSchema });

export const publicAccountViewSchema = z.strictObject({
  userId: userIdSchema,
  email: emailSchema,
  name: nameSchema,
  role: z.literal(PROPOSED_PUBLIC_ROLE),
  accountType: z.enum(PUBLIC_ACCOUNT_TYPES),
  emailVerified: z.boolean(),
});
export type PublicAccountView = z.infer<typeof publicAccountViewSchema>;
export interface StaffSessionView {
  readonly userId: number | null;
  readonly email: string;
  readonly name: string;
  readonly role: StaffRole;
}

export type AccountTokenPurpose =
  | "email_verification"
  | "password_recovery"
  | "staff_invitation";

/** Persistence proposal only: no raw token, password or session cookie field. */
export interface ProposedAccountTokenRecord {
  readonly userId: number;
  readonly tokenHash: string;
  readonly purpose: AccountTokenPurpose;
  readonly expiresAt: string;
  readonly consumedAt: string | null;
}

/**
 * A generic acknowledgement must not reveal whether an email exists or claim
 * delivery occurred. Later adapters must report operational delivery failures.
 */
export interface AccountRequestAcknowledgement {
  readonly status: "accepted";
}
export interface AccountCompletion {
  readonly status: "completed";
}
type Contract<Input, Output> = Readonly<{ input: Input; output: Output }>;

/** Descriptive operation contracts only: no handlers, paths or live adapters. */
export interface AccountContractDraft {
  register: Contract<PublicRegistrationInput, AccountRequestAcknowledgement>;
  login: Contract<z.infer<typeof accountLoginInputSchema>, PublicAccountView | StaffSessionView>;
  readProfile: Contract<void, PublicAccountView>;
  updateProfile: Contract<z.infer<typeof publicProfileUpdateInputSchema>, PublicAccountView>;
  resendVerification: Contract<z.infer<typeof accountEmailInputSchema>, AccountRequestAcknowledgement>;
  verifyEmail: Contract<z.infer<typeof accountVerificationInputSchema>, AccountCompletion>;
  requestRecovery: Contract<z.infer<typeof accountEmailInputSchema>, AccountRequestAcknowledgement>;
  completeRecovery: Contract<z.infer<typeof passwordRecoveryInputSchema>, AccountCompletion>;
  inviteStaff: Contract<z.infer<typeof staffInvitationInputSchema>, AccountRequestAcknowledgement>;
  acceptStaffInvitation: Contract<z.infer<typeof staffInvitationAcceptanceInputSchema>, AccountCompletion>;
}
