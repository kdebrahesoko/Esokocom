# Proposed account foundation — inactive

The permission matrix and minimal model have been approved for database-free
preparation. Review-only Drizzle declarations and exact SQL proposals now exist
outside the live schema barrel and migration history; no deployed API or database
schema has changed. The policy/contracts remain unused by running routes/startup.
Live recovery is deferred to the isolated restore follow-up before first
production publish, not misrepresented as completed or required again before
this approved preparation. SQL execution, real email configuration and runtime
verification still need separate scoped approval.

## Permission matrix

| Capability | Anonymous | Unverified public | Verified customer/farmer | Existing staff |
| --- | --- | --- | --- | --- |
| Published content and existing public submissions | Allow | Allow | Allow | Allow |
| Public registration | Allow | Deny | Deny | Deny |
| Recovery request / idempotent logout | Allow | Allow | Allow | Allow |
| Session-state inspection | Deny | Active account only | Active account only | Active identity only |
| Verify/resend verification | Deny without resolved identity/token proof | Active own account | Already verified: deny | Not a public-account operation |
| Read/update public profile | Deny | Deny | Active, verified owner only | No implicit public-profile access |
| HR entry point | Deny | Deny | Deny | SUPER_ADMIN, HR_ADMIN |
| CMS entry point | Deny | Deny | Deny | SUPER_ADMIN, CONTENT_EDITOR, CONTENT_AUTHOR |
| Publish content / manage immediate farm data | Deny | Deny | Deny | SUPER_ADMIN, CONTENT_EDITOR |
| Staff upload entry point | Deny | Deny | Deny | All four existing staff roles |
| Private staff-file entry point | Deny | Deny | Deny | SUPER_ADMIN, HR_ADMIN |
| Staff statistics entry point | Deny | Deny | Deny | All four existing staff roles; keep existing result filtering |
| Manage users, view audit logs, invite staff | Deny | Deny | Deny | SUPER_ADMIN only |

Inactive identities cannot perform protected operations. Public browsing,
existing public submissions, generic recovery requests and logout remain public;
these admissions do not reactivate accounts or bypass token validation.
An authenticated identity cannot use registration to alter its role.

These are coarse entry-point decisions, not replacements for existing record
ownership, author-draft restrictions, publishing state rules, upload permissions
or statistics-result filtering. No current middleware or legacy behavior changed.
Legacy super-admin identities may have a null user ID, matching current behavior;
other staff and all public identities require positive safe-integer user IDs.

## Trust boundary

Policy identities must be constructed from authenticated server-side state, never
copied from request bodies. Structural validation cannot distinguish a forged,
well-shaped staff identity from a genuine one. A public registration body accepts
only email, password, display name and customer/farmer classification.

Profile ownership must be resolved from the server's resource record, not a
client-supplied owner ID. The pure policy compares IDs but does not load records.
Customer/farmer classification is never a staff authorization capability.

Verification links can be opened without a pre-existing browser session. Future
adapters must first validate the token hash, purpose, expiry, consumption state
and bound user, then obtain that user's current trusted identity before policy
checks and atomic consumption. Email input alone never identifies an authorized
verification target. The same principle applies to recovery and invitations.

## Minimal additive model proposal

### Existing users and sessions

Reuse users, password hashes and database-backed hashed sessions. Preserve current
staff roles, row IDs, active flags, hashes, cookies, expirations and legacy
compatibility. No user conversion, reset, backfill or role change is proposed here.

PUBLIC_USER remains inactive. The review-only proposal appends it to the existing
role enum and changes the future-insert role default to PUBLIC_USER in a separate
transaction after the enum addition commits. Existing rows are not rewritten.
Never let registration inherit CONTENT_AUTHOR or accept a role from the client;
it must assign PUBLIC_USER explicitly even after the default changes. This stage
does not apply that enum/default change. Both current staff-creation call sites
explicitly provide their role.

### Public profile

Propose a one-to-one profile with:
- User reference as primary key.
- Account classification: customer or farmer.
- Nullable email-verification timestamp, written only by verified token flow.

Keep display name in the existing users record, not duplicated in the profile.
A future own-profile update can change display name/classification atomically;
it cannot change role, user ID, activation, email or verification status.
Email changes would need a separate reverification design.

No farm geometry, payment, tenant, phone or mobile-synchronization fields are
needed for this foundation. Proposed names, types, checks, primary/unique keys,
and referential actions are now reviewable in the isolated declarations and SQL
proposal. No extra search indexes are proposed. Their execution requires exact
SQL review and approval; no database constraints have been created.

### Account-action tokens

Propose a token record with user reference, unique token hash, purpose,
expiration and nullable consumption timestamp. Purposes are email verification,
password recovery and staff invitation. Never persist raw bearer tokens.

Future consumption must claim a nonexpired, unused, purpose-bound token
atomically with the protected operation. Password recovery must revoke affected
sessions; invitations must bind the approved staff role server-side and require
administrator authorization. Define lifetimes, resend limits, revocation,
password/email race handling and recovery eligibility before implementation.

The declaration uses timezone-aware expiry/consumption/creation instants, an
explicit purpose check, unique lowercase SHA-256 token hash and cascading user
reference. These constraints alone do not enforce single-use consumption,
verification, staff-only invitation binding or cross-table role/profile rules;
those require future transactional server logic.

Staff invitations are proposed to reference a newly created inactive staff user
with the administrator-approved role/email and an unusable randomly generated
password hash. Never invite by converting an existing public/active account.
Pending identity/role changes must revoke outstanding invitations atomically;
acceptance must lock/recheck the bound user and token before activation and
password assignment. This lifecycle needs review before implementing handlers.
No token generation, persistence, delivery or session revocation runs here.

## Draft operation contracts

Standalone contracts describe registration, login, profile read/update,
verification/resend, recovery and administrator invitation/acceptance.
No HTTP paths, handlers or OpenAPI-generated output were changed.

Before integration, move approved endpoint contracts into the existing OpenAPI
source and regenerate through the normal workflow under separate approval.
Do not maintain these drafts as a competing production specification.

Strict inputs reject client-supplied identity, role, activation and verification
fields. Public views exclude passwords, password hashes and session/token hashes.
Proposed new-password validation requires at least 12 characters and at most
72 UTF-8 bytes to prevent bcrypt truncation; password whitespace is not trimmed.
Existing login continues to accept its existing credentials unchanged.
Final password policy and bcrypt work factors still require security review.

A generic accepted acknowledgement neither proves that an account exists nor
claims email was delivered. Future handlers need actual configured email delivery,
safe operational errors, rate limits and no fake success on delivery failure.

## Integration gates and limits

1. Matrix/model approval is recorded; review the authorization audit and HTTP
   contract proposal before integration.
2. Development database setup is closed with limitations. Demonstrate isolated
   recovery under its separate follow-up before first production publish.
3. Approve exact additive SQL and its rollback/preservation plan separately;
   then approve activation edits to the live schema and journaled migrations.
4. Implement trusted identity/resource adapters, atomic tokens and real email
   delivery with cookie/CSRF, anti-enumeration and session-lifecycle controls.
5. Add website screens only after backend contracts and permissions are ready.
6. Run separately approved complete positive/negative account journeys.

Current tests exercise in-memory policy and draft validation only. They do not
prove live authorization, token single-use, delivery, database constraints,
restoration, account creation, CSRF protection or production readiness.
No application activation or production operation is authorized by this document.

## Review files

- `lib/db/src/proposals/publicAccounts.ts` — inactive declarations, not exported.
- `lib/db/proposals/public-accounts.sql.proposed` — review only, not a migration.
- `lib/db/proposals/account-access-review.md` — route audit, contract proposal,
  lifecycle requirements and next approval gates.
