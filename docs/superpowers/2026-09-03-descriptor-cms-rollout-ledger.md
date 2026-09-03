# SDD ledger — plan: docs/superpowers/plans/2026-09-02-descriptor-cms-rollout.md

Branch: `incircles`. Commits local, nothing pushed. 12 commits.

## Measured outcome

| | Before | After |
|---|---|---|
| Bespoke admin form components | 28 | **25** |
| Lines across them | 9,078 | **6,550** |
| Descriptor-driven editors | 0 | **30** |
| Generated editable fields | 0 | **881** |
| Admin write routes recording an audit entry | 20 of 42 | **29 of 29** (2 documented exemptions) |

The line count is the least interesting number here — five of the twelve
commits are defect fixes that came out of doing the migration, and those matter
more than the forms deleted.

## Tasks 1–4, as planned

**Task 1 — the kit extracted** (`f8dc25e`). `lib/cms/descriptors/{types,registry,crud,page-overrides}.ts`
plus `components/admin/record-form.tsx`. Behaviour-neutral, and checkably so:
`verify:laptop-bank` already covers 28 behaviours of that exact code and still
exits 0, and the seed-walk still produced the same 202 fields across the same
ten page editors. That existing verifier is what made the move safe to attempt.
Also deleted `components/admin/json-editor.tsx`, which nothing imported.

**Task 2 — the audit gap closed** (`3ccc0bd`). This was the headline defect and
it needed no form migrations. 22 routes wrote without recording anything, which
made `/admin/audit` quietly incomplete. Now 29/29, with two exemptions that
state their reason in their own source and are cross-checked by the verifier:
`session` (sign-in belongs in an auth log, not the content change history) and
`revalidate` (writes no data, so there is nothing to attribute).

Two things fell out of wrapping them. TypeScript discards narrowing of a
property access inside a callback, so three routes needed their narrowed slug
hoisted to a `const` — otherwise the guard above the call stopped applying
inside it. And a create does not know its document id until the write returns,
so `resourceId` accepts a resolver function.

**Task 3 — generic routes** (`d955c44`). `/admin/cms/[type]` and
`/api/admin/cms/[type]` serve any registered descriptor; registry nodes are
generated from the descriptor map using each descriptor's own `hub`. Old paths
redirect (temporary, not permanent — internal admin URLs, not the public URL
map).

**Task 4 — Tier B** (`7d25b79`). Team, jobs, partners and testimonials.
Round-tripped against live Firestore before deleting anything: public readers
see the records, `order` coerces to a number, a negative sort order is
rejected, and record counts came back to exactly where they started.

## Five defects found by doing the work

**1. CMS edits never reached the public pages** (`edadb09`). Mine, from the
Laptop Bank work. Those pages are statically prerendered, so their CMS reads
happen at build time, and the generic write route never called
`revalidatePath`. An editor would save, see a success message, and the page
would keep showing the old copy until the next deploy — the worst kind of bug,
because nothing appears to be wrong. Descriptors now declare
`revalidatePaths`, and `verify:cms` fails any descriptor without them.

**2. Migrating would have destroyed stored content** (`b2c4f56`). The shared
merger only understood flat-path keys, but documents written by the old forms
store a whole value under its top-level key — and there is real content in that
shape: 28 keys on `siteContent/apply-for-training`, 21 on
`impactPages/overview`, 32 on `partnerships/educational`. A naive migration
would have ignored every one and reverted those pages to seed, silently. Both
shapes are now honoured.

**3. A second Timestamp leak, and my earlier scan was wrong** (`b897a89`,
`a44fe13`). `getCmsImpactPage` merged with a raw spread and carried a
Timestamp into the React tree. It survived the earlier sweep because that sweep
only covered readers taking **no arguments**, and this one takes a slug. So
`verify:cms` now checks the *pattern* statically instead — which immediately
caught a third file my patch script had silently failed to modify. 30 CMS
modules checked, all clean.

**4. Defaults would have hidden new records** (`7d25b79`). `partnerSchema` and
`testimonialSchema` both defaulted `active` to true, and a generic form
initialising every boolean to false would have saved new partners and
testimonials invisible. Descriptors now carry `defaultValue`, applied only to
NEW records — an existing record shows exactly what is stored, so an editor who
turned something off does not find it back on. Consent fields deliberately get
no default.

**5. One edited partnership track hid the other four** (`91e08ba`).
Pre-existing and live. `getCmsPartnershipTracks` returned only stored
documents, so once `educational` was edited the hub listed one track instead of
five. Individual URLs kept working because the per-slug reader falls back,
which is what made it easy to miss. The seed is the authoritative set for that
collection — five tracks are the programme, not placeholder content.

## Task 5 — Tier C, partially done, and why it stopped where it did

Migrated: **contact** (`a3f3a1e`, 83 fields replacing a 356-line form), the
**four impact pages** (`b897a89`, 357 fields replacing a 655-line form), the
**Partner With Us overview** and the **news hub** (`91e08ba`).

Each was verified against its stored content *before* anything was deleted: 20
of 20 keys still applying on `impactPages/overview`, 20 of 20 on
`partnerships/_overview`, 30 of 30 on `partnerships/educational`.

**Not migrated: departments, initiatives, dynamic site pages, partnership
tracks-as-a-collection.** Two structural findings stopped this, and neither is
a matter of effort:

1. **They normalise field-by-field, not by seed-merge.** `normalizeDepartment`,
   `normalizeInitiative` and `normalizeDynamicSitePage` map each field
   explicitly, coercing types and rejecting unknown keys. Seed-merge does
   neither. Migrating them would trade runtime type safety for editability, on
   the largest content types in the codebase — `initiatives` generates 149
   fields per record, `partnershipTracks` 105.

2. **They are seed-backed collections, which the kit does not yet support.**
   `listRecords` returns stored documents only, so a seeded-but-never-edited
   department or initiative would not appear in the editor at all. The kit
   needs a "seed defines the set, CMS overrides members" shape first — which is
   the same insight that produced defect 5.

The plan already flagged `site-page-form.tsx` as the highest-risk migration and
put it last; these findings say the same thing about three of its neighbours,
for a concrete reason rather than a feeling. **The right next step is to add
seed-backed-collection support to the kit, then migrate those four behind it —
not to convert their normalisers in place.**

## Verification

`type-check`, `lint`, `verify:cms`, `verify:media-pages`, `verify:laptop-bank`
all exit 0. `verify:tokens` exits 1 with 26 Phase 1 tokens outstanding, which
is the honest state and also the production deploy gate.

`verify:cms` now asserts three invariants, all static and needing no Firestore:
audit coverage (29/29), reader hygiene (30 modules, no raw Firestore spreads),
and descriptor reachability plus revalidation coverage (30/30).

Live checks on a production server: every public route touched still returns
200, all five partnership track links are back on the hub, the impact overview
still shows its stored wording, contact still renders its seed copy, and every
new editor gates to `/admin-login` while the generic API returns 401.

## Two notes for John

**Two junk partner documents.** `partners/p1` and `partners/p3` hold only
`order` and `updatedAt` — no name, no logo. They are artifacts of the reorder
control this rollout deleted, which wrote `order` against seed ids and created
empty documents. They are content-free and safe to delete; they will show as
nameless rows in the new Partners editor until they are. Not deleted here
because it is your data.

**The partner permission flag records but does not gate.** Draft 1 §12 asks
that a logo not display until written permission is recorded. The flag now
exists and is prominent, but switching the gate on would immediately hide logos
that are already live — a decision to take deliberately, not as a side effect
of an admin refactor.
