# Account access and contract review

## Status and scope

The user approved the permission matrix/minimal model and database-free contracts,
tests and schema/SQL proposals. Nothing here exposes a registration endpoint or
changes live roles, sessions, routes, database defaults or production. Existing
inactive foundations are reused rather than implementing a parallel auth provider.
This document proposes contracts for later incorporation into the existing
OpenAPI single source of truth; it is not another authoritative API specification.

## Read-only source audit

| Area | Observed boundary | Required before public accounts |
| --- | --- | --- |
| `auth.ts` routes: `/auth/me` | Generic `requireRole()` | Keep generic for limited public session identity; return no staff-only data. |
| `auth.ts` routes: `/admin/me` | Generic `requireRole()` | Explicitly allow only the four staff roles before public sessions are enabled. |
| Staff user CRUD and audit logs | SUPER_ADMIN only | Preserve; prevent staff creation/conversion through public endpoints. |
| Admin statistics | Explicit four-role allowlist, filtered content/HR results | Preserve current filtering; deny PUBLIC_USER. |
| Careers admin/applicant data, notes, CVs and stage changes | SUPER_ADMIN / HR_ADMIN | Preserve; public applicants remain anonymous and gain no access to applicant records. |
| CMS drafts and mutations | Content role allowlists plus author ownership/editorial rules | Preserve author ownership and editor-only publishing/scheduling/deletion. |
| Farm-data mutations | SUPER_ADMIN / CONTENT_EDITOR | Preserve; public reads remain public. |
| Storage upload URL issuance | Four staff roles | Deny public accounts; no generic authenticated upload guard. |
| Private storage downloads | SUPER_ADMIN / HR_ADMIN | Preserve; public assets remain anonymously readable. |
| Legacy admin login/logout/cookie | ADMIN_API_KEY compatibility, server-trusted SUPER_ADMIN identity | Preserve; never derive legacy/admin identity from a public body or token. |
| Anonymous submissions and published Resources | Existing public endpoints | Preserve their current validation and behavior. |

Only two generic role-guard calls were found in current route sources, listed
above. This is source evidence, not runtime penetration testing. The unused legacy
`requireAdmin` helper was found but no route imports/calls were found.
Existing staff user creation and bootstrap both explicitly assign a role.

Additional integration risks: the staff login UI currently sends roles other
than content roles to Careers; it needs an explicit public redirect rather than
letting PUBLIC_USER enter staff UI. Public profile/recovery/invitation adapters
must not call bootstrap or use its email check as an authorization rule.
Farm-data GET endpoints can seed missing data, so they are not suitable for
no-write verification; no HTTP requests were made during this audit.

## Proposed HTTP contracts — not implemented

All paths below are relative to the existing `/api` base. Mutation bodies reject
unknown fields, especially role, owner ID, activation and verification claims.
Existing `/auth/login` request and staff response envelope stay compatible.

| Method/path | Request | Success | Server boundary |
| --- | --- | --- | --- |
| POST `/auth/register` | email, password, name, accountType | 202 `{status:"accepted"}` | Anonymous registration; always PUBLIC_USER, pending verification; duplicate-safe generic response. |
| POST `/auth/login` | Existing email/password | Existing `{ok:true,user:{id,email,name,role}}`; public users additionally receive accountType/emailVerified | Existing staff unaffected; public session stays verification-limited until verified. |
| POST `/auth/logout` | No identity/body required | Existing `{ok:true}` | Revoke caller session, clear cookie; preserve legacy logout. |
| GET `/auth/me` | Session cookie | Existing `{authenticated:true,user:{id,email,name,role}}`; public users additionally receive accountType/emailVerified | Current trusted session only, no passwords/hashes/tokens. |
| POST `/auth/verify-email` | token | 200 `{status:"completed"}` | Purpose-bound single-use proof, not an email/body identity claim. |
| POST `/auth/resend-verification` | email | 202 `{status:"accepted"}` | Non-enumerating admission, rate limits, no account changes without server-resolved target. |
| POST `/auth/recovery` | email | 202 `{status:"accepted"}` | Proposed public-account recovery only; no change to staff recovery policy. |
| POST `/auth/recovery/complete` | token, newPassword | 200 `{status:"completed"}` | Atomic password update, token consumption and all affected sessions revoked. |
| GET `/account/profile` | Session cookie | 200 public account view | Active, verified PUBLIC_USER; owner derived from session. |
| PATCH `/account/profile` | name and/or accountType | 200 public account view | Same owner, no email/role/verification/activation changes. |
| POST `/users/invitations` | email, name, one existing staff role | 202 `{status:"accepted"}` | SUPER_ADMIN only; no existing-account conversion. |
| POST `/auth/invitations/accept` | token, password | 200 `{status:"completed"}` | Pending inactive staff identity, approved bound role/email, atomic acceptance. |

Public account view: userId, email, name, role PUBLIC_USER, accountType, and
emailVerified only. A staff session response must keep the existing `id` field;
the inactive descriptive `StaffSessionView.userId` type is not a drop-in HTTP
response. Canonical generated contracts must settle that mapping at integration.

Proposed errors: 400 validation or invalid/expired/reused proof; 401 no valid
session; 403 wrong role/unverified profile access; 429 throttled; 503 delivery
service unavailable. Unknown and existing addresses must receive indistinguishable
recovery/resend acknowledgements. Acknowledgement is not a claim of delivery.
If the email service fails, return a safe operational failure; avoid leaking
account existence through per-recipient error differences. Use a transactional
outbox or equivalent reviewed delivery/retry design before enabling endpoints;
an outbox table is not included in this minimal schema proposal.

Token links carry bearer proof, never credentials; no raw tokens in logs,
analytics or audit metadata. Prefer fragment-to-POST handling to avoid access
logs and referrers; do not issue side-effectful GET token-consumption endpoints.
Set explicit same-origin/CSRF protections for cookie-authenticated mutations,
including login/logout, and strict origin handling before adding screens.

## Transactional lifecycle requirements

- Proposed lifetimes for separate review: verification 24 hours, recovery 30
  minutes, invitation 72 hours. Resend revokes prior outstanding same-purpose
  proof. Lifetime/rate-limit configuration is not activated by this proposal.
- Use at least 32 random bytes of bearer entropy and SHA-256 at rest. Claim an
  unconsumed, unexpired, purpose-bound token and the protected action in one
  transaction. Lock the affected user consistently to serialize reset/resend,
  concurrent token reuse and invitation/user changes; failure rolls back all.
- Public registration creates users/profile/verification proof atomically,
  assigns PUBLIC_USER explicitly and never converts an existing staff user.
  Decide duplicate-email race handling without changing existing email
  uniqueness or backfilling addresses under this stage's approval.
- Password recovery applies only to public accounts in this proposal; token
  consumption, password hashing update, sibling-proof invalidation and session
  revocation must commit together. Existing staff password resets need their own
  reviewed session-revocation policy.
- Staff invitation creates a new inactive staff identity with an undisclosed
  random password hash, never a usable temporary password or conversion. Token
  user reference binds the approved email/role; revoke pending invites atomically
  on identity/role changes and recheck role, inactivity and recipient on acceptance.
  Preserve current direct SUPER_ADMIN onboarding until replacement is approved.
- Roles/profile linkage and public verification restrictions are cross-table
  application invariants; the proposed SQL does not enforce them by itself.
- A real mail service and confirmed sender/application origin are prerequisites.
  Do not invent a sender, published URL, email delivery or successful registration.

## Exact SQL proposal and preservation

The adjacent `.sql.proposed` file is NOT in the migration directory or journal.
The inactive declarations are NOT exported from the live schema. No generator,
schema push or SQL executor was invoked.

Phase A appends PUBLIC_USER to the existing enum and commits. PostgreSQL cannot
use a newly added enum value in a default before that transaction commits.
Phase B changes only the future-insert users.role default and creates the two
new tables, their sequence, primary/unique keys and checks/FKs. Existing users,
sessions, hashes, historical objects and migration records are not rewritten.
No search index, grants, seed data, enum relabel/removal or application job change
is proposed. The role default change and each new constraint still need exact
SQL approval. Test constraints cannot certify the SQL against a live server.

Before execution: review current catalog/ownership and applied history under
separate permission, reconcile new proposals with canonical declarations, generate
and review version-controlled migrations without altering historical snapshots,
and agree lock impact and a confirmed recovery strategy. Do not feed this file
to the existing runner: its single-transaction behavior is unsuitable for the
two-phase enum/default sequence. No runner changes are authorized here.

Rollback before activation: discard only these uncommitted proposal edits;
runtime/database behavior is unchanged. After hypothetical execution, prefer
forward repair: enum additions are not safely reversible, and Phase A can remain
committed if Phase B fails. Do not remove enum values, drop tables or delete
new records automatically. Stop and review partial state; database recovery
operations require explicit target-bound approval.

## Next approval

Review this audit, the HTTP contract mappings, invitation/delivery lifecycle and
the exact SQL proposal. Separately authorize any live schema/export/route
integration, email configuration, SQL execution, service restart or mutating
tests. First production publish additionally requires the isolated restore test.
None of the public account journey is claimed functional at this stage.
