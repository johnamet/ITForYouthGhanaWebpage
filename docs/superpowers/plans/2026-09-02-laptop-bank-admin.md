# Laptop Bank Admin Implementation Plan (phase 2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the two Laptop Bank form submissions readable by staff, and make all six CMS content types editable without a developer — closing build spec §4 and the dead-end link that phase 1 shipped.

**Architecture:** Follow the admin conventions already in this repo — `app/(admin)/admin/<area>/page.tsx` list on `AdminPageHeader` + `AdminDataTable`, a `[id]` detail page delegating to a `"use client"` form in `components/admin/`, a `/api/admin/...` route gated by `requireAdminApiSession()` that validates with zod and calls `writeAuditLog`, and a reader/writer in `lib/cms/`. The six content types are served by **one descriptor-driven editor**, not six near-identical forms.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript 5.7, Tailwind 3.4, zod 3.24, firebase-admin 13. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-09-01-laptop-bank-spec.md`
**Phase 1 ledger:** `docs/superpowers/2026-09-01-laptop-bank-execution-ledger.md`

## Why this phase exists

Two things phase 1 left open:

1. **A live defect.** `lib/email/laptop-bank-notification.ts` points staff at
   `/admin/messages` and `/admin/applications`. Those pages read the
   `contactMessages` and `applications` collections; Laptop Bank submissions go
   to `laptopBankOffers` and `laptopBankApplications`. So the link resolves to a
   page that will never show the record. Because spec §7 forbids putting any
   personal data in the notification email body, that link is the **only** route
   staff have to a submission — which makes both public forms a dead end today.
2. **Spec §4:** "All six are editable without a developer." Phase 1 delivered
   the types, the collections and Firestore-first readers. The editing screens
   are this phase.

## Global Constraints

Every task's requirements implicitly include this section.

**Admin pages may use icons.** The no-icon rule in this repo applies to public
pages. `components/admin/*` already imports `lucide-react` throughout; match
that, do not invent a second convention.

**Every admin API route is gated and audited.** Copy the shape in
`app/api/admin/messages/[id]/route.ts` exactly: `requireAdminApiSession()`
first, zod parse second, `{ configured: false }` → 503, then `writeAuditLog`
with the actor from `getCurrentAdminUser()`. A route that writes without an
audit entry is a bug.

**Consent fields are never casual.** `Donor.display_consent` and
`Story.publication_consent` decide whether a real organisation's logo or a real
young woman's name and photograph appear on the public internet. In the editor
they must be explicitly labelled with what publishing actually does, must never
default to the publishing value, and must carry a visible warning. Spec §4 DATA
and 5.14 DATA put the enforcement in the query — this phase must not weaken
that, and must not add a second, contradictory gate.

**Do not invent content.** Same rule as phase 1. The editors let IT for Youth
enter real records; nothing in this phase seeds a Donor, a Story or a
Dashboard Metrics record, and no default value stands in for a figure.

**Applicant data is sensitive.** Spec §7: applicant data goes to the named
system only, no spreadsheet export as the working copy. The application detail
screen is a review surface, not an export tool. Its file link must go through
the existing authenticated route, never a signed or public URL.

**No test runner in this repo.** Verification is:

```bash
npm run type-check && npm run lint && npm run build
```

plus live route checks against `npm run start` or `npm run dev`. A task is not
done until those have actually been run and their output read.

---

## File Structure

**Create:**

| File | Responsibility |
|---|---|
| `lib/cms/laptop-bank-submissions.ts` | Read/update/delete over `laptopBankOffers` and `laptopBankApplications` |
| `lib/content/laptop-bank-admin-schema.ts` | Field descriptors for the six content types — the single source the generic editor renders from |
| `lib/cms/laptop-bank-admin.ts` | Generic create/update/delete over the six Laptop Bank content collections |
| `components/admin/laptop-bank-submission-form.tsx` | Status + internal notes on one submission |
| `components/admin/laptop-bank-record-form.tsx` | The one descriptor-driven record editor |
| `app/(admin)/admin/laptop-bank/page.tsx` | Laptop Bank admin index — the six types plus the two inboxes |
| `app/(admin)/admin/laptop-bank/offers/page.tsx` | Equipment offer inbox |
| `app/(admin)/admin/laptop-bank/offers/[reference]/page.tsx` | One offer |
| `app/(admin)/admin/laptop-bank/applications/page.tsx` | Application inbox |
| `app/(admin)/admin/laptop-bank/applications/[reference]/page.tsx` | One application |
| `app/(admin)/admin/laptop-bank/records/[type]/page.tsx` | List, for any of the six types |
| `app/(admin)/admin/laptop-bank/records/[type]/new/page.tsx` | Create |
| `app/(admin)/admin/laptop-bank/records/[type]/[id]/page.tsx` | Edit |
| `app/api/admin/laptop-bank/offers/[reference]/route.ts` | Offer PUT/DELETE |
| `app/api/admin/laptop-bank/applications/[reference]/route.ts` | Application PUT/DELETE |
| `app/api/admin/laptop-bank/records/[type]/route.ts` | Record POST |
| `app/api/admin/laptop-bank/records/[type]/[id]/route.ts` | Record PUT/DELETE |

**Modify:**

| File | Change |
|---|---|
| `lib/email/laptop-bank-notification.ts` | Point `adminLinkFor` at the new inbox routes, including the reference |
| `lib/content/site-config.ts` | Add the Laptop Bank admin nav entry |
| `lib/utils/validators.ts` | Add the submission-update and record schemas |
| `lib/cms/laptop-bank.ts` | Add the by-id reads the editors need |

---

### Task 1: Submission readers and the fixed notification link

**Files:**
- Create: `lib/cms/laptop-bank-submissions.ts`
- Modify: `lib/utils/validators.ts`
- Modify: `lib/email/laptop-bank-notification.ts`

**Interfaces:**
- Produces: `CmsEquipmentOffer`, `CmsStudentApplication`, `getEquipmentOffers()`, `getEquipmentOffer(reference)`, `getStudentApplications()`, `getStudentApplication(reference)`, `updateSubmission(kind, reference, update)`, `deleteSubmission(kind, reference)`; `equipmentOfferAdminUpdateSchema`, `studentApplicationAdminUpdateSchema`.

- [ ] **Step 1: Write the readers**

Model on `lib/cms/contact-messages.ts`, including its `normalize*` and
`toIsoDate` helpers — Firestore timestamps must not reach a React tree as
class instances. Both collections are keyed by the reference, so
`doc(reference)` is the by-id read.

Sort newest-first: staff work an inbox from the top.

- [ ] **Step 2: Add the two admin update schemas**

Offer statuses, following the spec's own vocabulary in 5.2 stage 1 ("accepted
in full, accepted in part, or declined"):

```ts
export const equipmentOfferAdminUpdateSchema = z.object({
  status: z.enum(["new", "reviewing", "accepted-in-full", "accepted-in-part", "declined", "collected", "archived"]),
  notes: optionalTrimmedString,
});
```

Application statuses reuse the vocabulary already in `AdminRecordStatus`, plus
the waiting list Draft 1 §9 §7 describes:

```ts
export const studentApplicationAdminUpdateSchema = z.object({
  status: z.enum(["new", "reviewed", "shortlisted", "waiting-list", "offered", "rejected", "enrolled"]),
  notes: optionalTrimmedString,
});
```

- [ ] **Step 3: Fix `adminLinkFor`**

It currently returns `/admin/messages` and `/admin/applications`. Point it at
the new inbox routes and include the reference, so the link lands on the
record rather than a list the reader then has to search:

```ts
function adminLinkFor(kind: LaptopBankFormKind, reference: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://itforyouthghana.org";
  return kind === "equipment-offer"
    ? `${base}/admin/laptop-bank/offers/${reference}`
    : `${base}/admin/laptop-bank/applications/${reference}`;
}
```

Add a comment recording why this must stay pointed at a real route: spec §7
keeps all personal data out of the email body, so this link is the only route
staff have to the submission.

- [ ] **Step 4: Verify**

```bash
npm run type-check && npm run lint
grep -n "admin/laptop-bank" lib/email/laptop-bank-notification.ts
```

- [ ] **Step 5: Commit**

```bash
git add lib/cms/laptop-bank-submissions.ts lib/utils/validators.ts lib/email/laptop-bank-notification.ts
git commit -m "fix(laptop-bank): point staff notifications at a route that shows the submission"
```

---

### Task 2: The two submission inboxes

**Files:**
- Create: `components/admin/laptop-bank-submission-form.tsx`
- Create: `app/(admin)/admin/laptop-bank/offers/page.tsx`
- Create: `app/(admin)/admin/laptop-bank/offers/[reference]/page.tsx`
- Create: `app/(admin)/admin/laptop-bank/applications/page.tsx`
- Create: `app/(admin)/admin/laptop-bank/applications/[reference]/page.tsx`
- Create: `app/api/admin/laptop-bank/offers/[reference]/route.ts`
- Create: `app/api/admin/laptop-bank/applications/[reference]/route.ts`

**Interfaces:**
- Consumes: Task 1's readers and schemas.
- Produces: `<LaptopBankSubmissionForm kind={...} reference={...} status={...} />`

- [ ] **Step 1: One form for both inboxes**

Status select plus internal notes, one `kind` prop choosing the status option
list and the endpoint. Model the shape on
`components/admin/message-form.tsx`, including its notice block and its delete
confirmation.

- [ ] **Step 2: Offer list**

Columns: reference, organisation, country + import flag, quantity band,
equipment types, received, status, review link. Show the import flag and
`needs_storage` visibly — both are operational signals the spec asks the form
to capture, and they are useless if the inbox hides them.

- [ ] **Step 3: Offer detail**

Show every submitted field, grouped by the form's own three steps so a
reviewer reads it in the order it was written. Render the consent record
plainly: which consents were given, and when.

Surface `assetListStorageFailed` as a warning when true — phase 1 records it
precisely so a reviewer can see an offer arrived without its asset list.

If an `assetListUploadId` is present, link to
`/api/laptop-bank/uploads/<id>` — the existing authenticated route. Never mint
a signed URL.

- [ ] **Step 4: Application list**

Columns: reference, preferred name (falling back to full name), institution,
region, current computer access, received, status, review link.

- [ ] **Step 5: Application detail**

Same treatment. Two things this screen must get right:

- **The proof-of-enrolment link** goes to `/api/laptop-bank/uploads/<id>`, and
  the page says in words that opening it is logged. Draft 1 §14.2 asks that
  access to applicant records be logged; telling the reviewer so is what makes
  the log a deterrent rather than just a record.
- **`proofOfEnrolmentStorageFailed`** renders as a warning when true.

Show the seven consents with their timestamps. Show `storyAndPhotoConsent`
distinctly, and state on the page that its absence must not affect the
selection decision — spec §6.2 promises the applicant exactly that, and the
promise is only kept if the reviewer sees it.

- [ ] **Step 6: The two API routes**

`PUT` and `DELETE`, in the shape of
`app/api/admin/messages/[id]/route.ts`. `resourceType` in the audit entry is
`"laptop-bank-offers"` / `"laptop-bank-applications"`.

- [ ] **Step 7: Verify**

```bash
npm run type-check && npm run lint && npm run build
# with no admin session, every admin route must redirect to the login
for r in /admin/laptop-bank/offers /admin/laptop-bank/applications; do
  curl -s -o /dev/null -w "%{http_code} %{redirect_url} $r\n" "http://localhost:3000$r"
done
# and the write endpoints must refuse
curl -s -o /dev/null -w '%{http_code} PUT offer\n' -X PUT -H 'Content-Type: application/json' \
  -d '{"status":"declined"}' http://localhost:3000/api/admin/laptop-bank/offers/LB-000000-TEST
```

Expected: `307` to `/admin-login` for the pages (the existing middleware), and
`401` from the API route.

- [ ] **Step 8: Commit**

---

### Task 3: The descriptor-driven record editor

**Files:**
- Create: `lib/content/laptop-bank-admin-schema.ts`
- Create: `lib/cms/laptop-bank-admin.ts`
- Create: `components/admin/laptop-bank-record-form.tsx`
- Modify: `lib/cms/laptop-bank.ts`
- Modify: `lib/utils/validators.ts`

**Interfaces:**
- Produces: `LAPTOP_BANK_CONTENT_TYPES`, `LaptopBankContentTypeKey`, `getContentTypeDescriptor(key)`, `listRecords(key)`, `getRecord(key, id)`, `saveRecord(key, id, data)`, `deleteRecord(key, id)`, `<LaptopBankRecordForm descriptor={...} record={...} />`

**Why one editor and not six.** The six types differ only in their field
lists. Six forms would be six places to fix the same bug and six chances for
the consent treatment to drift — and the consent treatment is the part that
must not drift. This repo has already chosen consolidation once (phase 4a card
consolidation, phase 5 slot growth), so a descriptor plus one renderer is the
consistent choice.

- [ ] **Step 1: Write the descriptors**

One entry per content type, carrying everything both the routes and the form
need:

```ts
export type FieldKind = "text" | "textarea" | "number" | "boolean" | "select" | "url";

export type FieldDescriptor = {
  key: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
  help?: string;
  options?: { value: string; label: string }[];
  /**
   * Marks a field that decides whether something appears publicly. The form
   * gives these a warning treatment and never pre-selects the publishing
   * value.
   */
  consent?: boolean;
  /** Long-form fields get a wider control. */
  wide?: boolean;
};

export type ContentTypeDescriptor = {
  key: LaptopBankContentTypeKey;
  collection: string;
  label: string;
  plural: string;
  description: string;
  /** "collection" lists many records; "singleton" edits one fixed document. */
  shape: "collection" | "singleton";
  /** Firestore document id for a singleton. */
  singletonId?: string;
  /** Which field is the row title in a list. */
  titleField: string;
  /** Field used to sort a collection. */
  sortField?: string;
  fields: FieldDescriptor[];
  /** Rendered above the form — the spec rule that governs this type. */
  guidance?: string;
};
```

Six entries: `process-stage`, `intake-item`, `document`, `donor`, `story`,
`dashboard-metrics` (the singleton, `singletonId: "current"`).

Field lists come straight from spec §4's table. `Donor.display_consent` and
`Story.publication_consent` carry `consent: true`. `Story.consent_record_ref`
also carries `consent: true`, because spec 5.14 makes it the thing that gates
name + institution + photo appearing together.

`guidance` carries the spec rule in plain words, e.g. for `story`:

> A story is published only when publication consent is true. Name,
> institution and photograph appear together only when a consent record
> reference is filled in — without it, the public page shows the quote and
> preferred name alone. Never enter a composite or a story written on
> someone's behalf.

- [ ] **Step 2: Write the generic CRUD**

`lib/cms/laptop-bank-admin.ts`, keyed by descriptor. Coerce values on write
according to `FieldDescriptor.kind` — a number field must be stored as a
number, not the string a form control produces, or `MetricCardGrid`'s
`toLocaleString` breaks and `StatBand`'s null check silently passes on `""`.

A `number` field left empty stores `null`, never `0`. That distinction is the
whole reason `DashboardMetrics` fields are nullable.

- [ ] **Step 3: Add the by-id reads**

`lib/cms/laptop-bank.ts` gains the unfiltered reads the editor needs.
**Important:** the editor must see records the public readers filter out — an
anonymous donor and an unconsented story still need editing. So these are
separate functions with a comment saying they are admin-only and must never be
called from a public page.

- [ ] **Step 4: Write the record schema**

A permissive `z.record(z.unknown())` at the boundary plus per-descriptor
validation, so a new field in a descriptor does not require a schema edit.
Required fields are checked against the descriptor, and unknown keys are
dropped rather than stored — a form cannot smuggle a field the descriptor does
not declare.

- [ ] **Step 5: Write the form**

Renders from `descriptor.fields`. Reuses the admin form conventions
(`inputClassName` etc. as in `message-form.tsx`). A `consent` field renders
inside an amber panel that states in words what turning it on publishes, and
a `select` consent field never defaults to the publishing option.

- [ ] **Step 6: Verify**

```bash
npm run type-check && npm run lint
```

- [ ] **Step 7: Commit**

---

### Task 4: The record routes and the Laptop Bank admin index

**Files:**
- Create: `app/(admin)/admin/laptop-bank/page.tsx`
- Create: `app/(admin)/admin/laptop-bank/records/[type]/page.tsx`
- Create: `app/(admin)/admin/laptop-bank/records/[type]/new/page.tsx`
- Create: `app/(admin)/admin/laptop-bank/records/[type]/[id]/page.tsx`
- Create: `app/api/admin/laptop-bank/records/[type]/route.ts`
- Create: `app/api/admin/laptop-bank/records/[type]/[id]/route.ts`
- Modify: `lib/content/site-config.ts`

- [ ] **Step 1: The index**

One screen listing the six content types and the two inboxes, each with a
record count and a link. This is what makes "editable without a developer"
discoverable — a content type nobody can find is not editable.

- [ ] **Step 2: List, new and edit routes**

`generateStaticParams` is wrong here (admin is dynamic and session-gated), so
these are plain dynamic routes. A `[type]` that is not one of the six calls
`notFound()`.

A singleton type has no list and no `new` — `/records/dashboard-metrics`
redirects straight to its editor.

- [ ] **Step 3: The API routes**

`POST` to create, `PUT`/`DELETE` on `[id]`. Gated, validated, audited. An
unknown `[type]` is a 404, and the audit `resourceType` is
`laptop-bank-<type>`.

- [ ] **Step 4: Nav entry**

Add to `adminNavigation` in `lib/content/site-config.ts`:

```ts
{
  label: "Laptop Bank",
  href: "/admin/laptop-bank",
  description: "Process stages, intake specification, documents, donors, stories, metrics, and both submission inboxes.",
},
```

- [ ] **Step 5: Verify**

```bash
npm run type-check && npm run lint && npm run build
for t in process-stage intake-item document donor story dashboard-metrics; do
  curl -s -o /dev/null -w "%{http_code} $t\n" "http://localhost:3000/admin/laptop-bank/records/$t"
done
curl -s -o /dev/null -w '%{http_code} bogus type\n' "http://localhost:3000/admin/laptop-bank/records/not-a-type"
curl -s -o /dev/null -w '%{http_code} unauthenticated POST\n' -X POST -H 'Content-Type: application/json' \
  -d '{}' http://localhost:3000/api/admin/laptop-bank/records/donor
```

Expected: `307` to the login for every admin page (middleware), `401` from the
API, and — once signed in — `404` for a bogus type.

- [ ] **Step 6: Commit**

---

### Task 5: Verification and ledger

- [ ] **Step 1: Re-walk the two §10 items phase 1 could not verify**

Firestore may still be unconfigured here. If it is, say so rather than
claiming otherwise. If it is configured, write a non-consenting Donor and an
unconsented Story through the new editor, confirm neither renders on
`/laptop-bank` or `/her-first-laptop/stories`, then delete them — that closes
the last open checklist item from phase 1.

- [ ] **Step 2: Confirm the round trip**

The point of this phase is that a submission is reachable. With Firestore
configured: submit the public form, take the reference from the response, and
confirm the record appears in the inbox at the URL the notification email
would have sent. If Firestore is not configured, state that the round trip is
unverified and exactly which link in the chain is untested.

- [ ] **Step 3: Full clean verification**

```bash
npm run type-check && npm run lint && npm run build && npm run verify:media-pages && npm run verify:tokens
```

`verify:tokens` still exits 1 while Phase 1 tokens are outstanding; that is
expected, not a regression.

- [ ] **Step 4: Write the ledger** to
`docs/superpowers/2026-09-02-laptop-bank-admin-execution-ledger.md`, including
every item that could not be verified and why.

- [ ] **Step 5: Commit**

---

## Self-Review

**Spec coverage.** §4 "all six editable without a developer" → Tasks 3–4, one
editor covering all six. §7 "applicant data written to the named system only"
→ Task 2, a review surface with no export. §7 "no personal data in the email
body" → preserved; Task 1 fixes only the link. Draft 1 §14.2 "log who views
applicant records" → the existing upload route logs the actor (phase 1
`9e29fbf`); Task 2 tells the reviewer so.

**Deliberately still out of scope, and why:**

- **Token editing.** Spec 5.1 BEHAVIOUR wants `{{SLA_REPLY}}` to have a
  "single source in the CMS". It has a single source, but in code
  (`lib/content/laptop-bank-tokens.ts`), not the CMS. Moving it needs
  `token()` to resolve per request, and `token()` is currently called at module
  scope to build the page content objects — so this is a real refactor of how
  Laptop Bank content is assembled, not a screen. It is the right next phase
  and should not be bolted onto this one. **Flag to John.**
- **SMS**, **retention deletion job**, **payment provider**, **analytics** —
  unchanged from the phase 1 ledger, all blocked on things outside the code.

**Type consistency.** `LaptopBankContentTypeKey` is the union used by the
descriptor map, the `[type]` route params and the audit `resourceType` suffix.
`getRecord(key, id)` / `saveRecord(key, id, data)` / `deleteRecord(key, id)`
keep that argument order throughout. Submission readers take a `reference`,
never an `id`, because the Firestore document id *is* the reference.
