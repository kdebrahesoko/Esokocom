# Proposed account foundation — inactive

This is a design proposal, not a Drizzle schema, migration or deployed API.
The accompanying permission/contracts modules are deliberately unused by running
routes and startup. Database recovery remains unfinished; full account activation
remains gated by recovery, reviewed SQL, email and runtime approvals.

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

PUBLIC_USER is only a policy identity tag in these files. A later separately
reviewed schema proposal must establish explicit public access while preserving
the four staff roles. Never let registration inherit the existing CONTENT_AUTHOR
default or accept a role from the client. This stage makes no enum/default change.

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
needed for this foundation. Final column types, physical constraint names,
indexes, enum strategy and referential actions require a later exact SQL review.

### Account-action tokens

Propose a token record with user reference, unique token hash, purpose,
expiration and nullable consumption timestamp. Purposes are email verification,
password recovery and staff invitation. Never persist raw bearer tokens.

Future consumption must claim a nonexpired, unused, purpose-bound token
atomically with the protected operation. Password recovery must revoke affected
sessions; invitations must bind the approved staff role server-side and require
administrator authorization. Define lifetimes, resend limits, revocation,
password/email race handling and recovery eligibility before implementation.

No token generation, storage, delivery, consumption or session revocation is
implemented here.

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

1. Approve this matrix/model and review public/staff authorization boundaries.
2. Demonstrate isolated recovery and complete the existing database verification.
3. Approve exact additive SQL and its rollback/preservation plan separately.
4. Implement trusted identity/resource adapters, atomic tokens and real email
   delivery with cookie/CSRF, anti-enumeration and session-lifecycle controls.
5. Add website screens only after backend contracts and permissions are ready.
6. Run separately approved complete positive/negative account journeys.

Current tests exercise in-memory policy and draft validation only. They do not
prove live authorization, token single-use, delivery, database constraints,
restoration, account creation, CSRF protection or production readiness.
No application activation or production operation is authorized by this document.
