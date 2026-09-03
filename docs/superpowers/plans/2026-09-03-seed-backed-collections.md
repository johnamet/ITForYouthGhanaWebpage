# Seed-backed collections, and retiring the last four hand-written editors

Follow-on to `plans/2026-09-02-descriptor-cms-rollout.md`, whose Task 5 stopped
at four content types with a stated structural reason. This plan removes that
reason rather than working around it.

## What stopped last time, and why it was right to stop

Departments, initiatives, the nine seed-backed site pages and the partnership
tracks were left on hand-written forms because of two properties the descriptor
kit did not have:

1. **They are seed-backed collections.** The records ship in
   `lib/content/site-config.ts`; Firestore holds only the documents somebody has
   edited. `listRecords` returns stored documents, so a seeded-but-never-edited
   department would not have appeared in the editor at all. Live Firestore
   confirms how sharp that is: `departments` and `initiatives` hold **zero**
   documents, so a generic list would have shown eight departments as none.

2. **Their hand-written forms add and remove array items.** `site-page-form.tsx`
   can add a stat, a section, a CTA, a related card, a cohort and a process
   step; `department-form.tsx` does the same for services, workflows, stats and
   resources. The generated editor walks a seed and produces one field per leaf
   string — it can reword an existing section but cannot add a sixth one.
   Deleting those forms while the kit lacked that would have removed a real
   capability, which is not a refactor.

So the kit gains both properties first. Retiring a form is only safe once the
generated editor is a superset of it.

## Evidence gathered before designing

Live Firestore, the four collections in question:

```
departments    0 docs
initiatives    0 docs
partnerships   2 docs   _overview (21 keys), educational (32 keys)
siteContent    2 docs   apply-for-training (28 keys), apply-for-training-who-can-apply (20 keys)
forOrganisations 0 docs
```

Every stored key is a **whole-value legacy key** — `flatPath=0` across all four
documents. Nothing in production yet uses the flat-path shape the generated
editor writes, which is what makes the merge change below safe to make.

Array shapes across all 29 seed records and every already-migrated page seed
(235 array leaves in total) reduce to three cases:

- `string[]` — `responsibilities`, `priorities`, `bullets`, `objectives`, …
- array of objects — `sections`, `stats`, `services`, `focusCards`, `goals`, …
- one array of objects nested inside an array item — `goals[].linkedRoutes`
- one empty array with no inferable item shape — `teamMemberIds`

That is a small enough space to support properly rather than approximately.

## Task 1 — Repeatable lists in the kit

Two new field kinds in `lib/cms/descriptors/types.ts`:

- **`stringList`** — a `string[]`, edited as one line per item in a textarea.
  This is how the hand-written forms already treat `responsibilities`. An empty
  array in the seed (`teamMemberIds`) becomes a `stringList` too, since a string
  is the only shape an id list can hold.
- **`list`** — a repeatable group. `itemFields` describes one row and is
  generated from the first seed item, so a row's controls are typed the same way
  a top-level field is. `itemFields` may itself contain `list` and `stringList`,
  which is what keeps `goals[].linkedRoutes` editable.

Three rules that matter more than the controls:

- **A list field is stored as a whole value under its plain key** (`sections`),
  not as indexed paths (`sections__0__title`). That is the shape the live
  documents already hold and the shape `applyOverrides` already merges, so a
  page edited by the old form and then by the new editor stays coherent.
- **Editing a row starts from the row that is there.** Unknown keys on an item
  are carried through untouched, so `href`, `anchor`, `mediaKey` and any nested
  structure the editor does not show survive a save. Without this, saving a
  section list would quietly strip every link destination in it.
- **An empty list still means "not overridden".** Same rule as every other
  field: clearing all rows falls back to the shipped content rather than
  publishing a page with no sections. Removing a section entirely stays a
  developer job, as it has been since the first page editor.

Supporting changes:

- `buildSeedFields` emits a `list`/`stringList` field for an array instead of
  indexed leaves, and skips `NON_EDITABLE_KEYS` inside item shapes as it already
  does at the top level.
- `applyOverrides` becomes deterministic: legacy whole-value keys are applied
  first, then flat paths, so the newer shape wins a conflict rather than
  whichever key `Object.entries` happened to return second.
- `applyLegacyOverride` gains a **shape guard**: a stored value must match the
  shape of the value it replaces (array for array, string for string). This is
  the runtime type safety the old normalisers provided, kept rather than traded
  away — and it is checked against all four live documents before anything is
  migrated.
- `saveRecord` clears stale flat-path keys under a list's prefix, so a page that
  was once edited field-by-field cannot end up with both shapes applying.

## Task 2 — Seed-backed collections in the kit

`shape: "seed-collection"` in the descriptor, plus `seedRecords` — the records
the site ships, in display order, each `{ id, title, seed }`.

- **The list is the seed's list.** Rows come from `seedRecords`, annotated with
  whether a stored document exists, so the editor shows eight departments
  against an empty collection. Stored documents whose id is not in the seed are
  appended.
- **Delete means revert.** For a seeded record, deleting the stored document
  restores the shipped content; the renderer says that in those words rather
  than offering "Delete permanently", which for a seeded record is not what
  happens.
- **Create starts from a template.** A new record stores `baseId` — the seed
  record whose structure it inherits — and its own slug. `resolveFields` reads
  `baseId` back, so the editor for a created record has the same controls as the
  record it was based on. Fields marked `createOnly` (the slug) appear only on
  create, since a document id cannot be edited afterwards.
- **Structural fields stay hand-declared.** `status`, `order` and `featured` are
  a select, a number and a checkbox rather than free text walked out of the
  seed, and the walk skips any key the descriptor declares itself.

## Task 3 — The nine seed-backed site pages

`who-we-are`, `apply-for-training`, its three sub-pages, `team`, `partners`,
`careers`, `testimonials`. Each has a fixed document id and a seed, so each is a
**page singleton** — the pattern already carrying contact, the four impact pages
and the news hub. No kit change needed; these are `PAGE_SEEDS` entries.

`getCmsSitePage` moves from `mergeSitePage` to `applyOverrides` + `toPlainData`.
Verified by diffing old merge against new merge for both live documents before
anything is deleted.

Retires `site-page-form.tsx` (893 lines), its five admin routes and the
`site-content` API routes.

## Task 4 — Departments

Eight seeded records, 48 fields each before lists collapse them. A
`seed-collection` with hand-declared `status`, `order`, `featured` and `slug`.
Retires `department-form.tsx` (497 lines), three admin routes, two API routes.

## Task 5 — Initiatives

Eight seeded records, 149 fields each. A `seed-collection` with create switched
off: an initiative is a programme with its own imagery and routing, so adding one
is a code change that then becomes editable, not a form submission. The What We
Do overview becomes a page singleton alongside. Retires `what-we-do-forms.tsx`
(670 lines) and its routes.

## Task 6 — Partnership tracks

Five seeded records, 105 fields each. A `seed-collection`; `_overview` is already
a page singleton, so the descriptor must exclude that document id from its rows.
Retires `partnership-track-form.tsx` (304 lines) and its routes.

## Task 7 — What is deliberately NOT migrated

The **dynamic Who We Are and What We Do pages**. These are not seed-backed and
not copy editing: they create a page — its slug, its route, its sections from
nothing. `dynamicSitePageSchema` is `sitePageSchema` plus a slug and a status,
and the job the form does is authoring structure, which is the one thing the
generated editor deliberately does not do. They keep their forms, and this
paragraph is the reason, so the next person does not read the gap as an
oversight.

## Verification

No test runner in this repo, so: `type-check`, `lint`, `verify:cms`,
`verify:media-pages`, `verify:laptop-bank`, `build`, plus for each migration a
one-off script that diffs the old merge against the new one for every live
document. `verify:cms` gains two assertions: a `seed-collection` descriptor must
declare `seedRecords`, and a `list` field must declare `itemFields` — both are
mistakes that would otherwise present as an empty editor rather than an error.
