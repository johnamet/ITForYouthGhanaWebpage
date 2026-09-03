# Execution ledger — seed-backed collections and repeatable lists

Plan: `plans/2026-09-03-seed-backed-collections.md`.
Commits: `3cdde21` … `d1d5b11` (5 commits).

## What this closed

The descriptor rollout's Task 5 stopped at four content types with a stated
structural reason: the kit could not list records that live in code, and its
generated editor could not add or remove an array item the way the four
remaining hand-written forms could. Both are now in the kit, and all four are
migrated.

## Measured state

| | Before this phase | After |
|---|---|---|
| Descriptors | 30 | **42** |
| Generated editor screens | 30 | **60** (a seed-backed collection is one screen per record) |
| Generated fields | 881 | **1,391** |
| Repeatable list controls | 0 | **288** |
| Bespoke admin form components | 25 (6,550 lines) | **21 (5,092)** |
| Admin write routes | 29 | **20**, all audited |
| Net | | 2,162 insertions, 4,142 deletions |

All gates green: `type-check`, `lint`, `verify:cms`, `verify:media-pages`,
`verify:laptop-bank`, `build`. `verify:tokens` still exits 1 on the 26
outstanding Phase 1 tokens, which is the honest state and the production gate.

## The two kit capabilities

**Repeatable lists.** An array now generates one control rather than a field
per leaf: a `list` (rows, with the row's controls generated from the shape
merged across every row) or a `stringList` (one line per item). Stored WHOLE
under its own key, which is the shape every live document already held. Three
rules carry the weight — unknown keys on a row are preserved, so a section's
link destination survives an edit it never appears in; a row whose editable
fields are all blank is dropped rather than published as an empty card; and an
empty list still means "not overridden". Rows can be reordered, which none of
the forms this replaced could do.

**Seed-backed collections.** `shape: "seed-collection"` lists the records the
site ships and stores only the edits. Firestore held no department and no
initiative document at all, so the plain collection editor would have shown
eight departments as none — worse than no editor, because it reads as data loss
and the obvious next move is to recreate what already exists. Delete on a
shipped record means revert, and the control says so.

## Five defects found, four of them live

1. **`/apply-for-training` has been publishing with no introduction.**
   `siteContent/apply-for-training` holds `intro: ""` — written by a form that
   submitted every field whether or not it had been touched — and the old
   field-by-field merge let an empty stored value win. **This is a visible
   change: the shipped paragraph is back.**
2. **Four arrays were being blanked the same way.** `stats: []` on
   `partnerships/_overview` and on the edited `educational` track,
   `courses: []` on two site pages. Five stats reappear on `/partner-with-us`
   and five on the educational track page.
3. **Opening a shipped department and saving would have rewritten it** — status
   to blank, featured to false. A checkbox, a select and a number cannot express
   "not overridden" the way an empty text field can, so where shipped content
   sits behind them those kinds now show the current effective value. Caught by
   the new no-op-save invariant, not by review.
4. **Saving any initiative would have added `bullets: []` to every section that
   had none**, because row controls are generated from the shape merged across
   all rows. Also caught by the invariant.
5. **Fifteen dead admin links**, nine created by this phase's deletions and six
   already dead from the last one — including "Departments" in the sidebar.

## Two invariants added to `verify:cms`

- **A no-op save is a no-op.** It runs the form's own value builder, the write
  path's coercion and the read path's merge, and asserts the seed comes back
  byte-identical. This is the one invariant that makes a generated editor safe
  to hand over, and it found defects 3 and 4 before either could ship. 47
  editors round-trip clean. `initialValues` was moved out of the React
  component into `lib/cms/descriptors/form-values.ts` specifically so the check
  exercises the same function the form does rather than a copy of it.
- **Every hardcoded admin link points at a route that exists.** Routes are
  derived from the filesystem; 116 links across the sidebar, both registries
  and the documentation page are checked against them. This is the fourth
  navigation list in this repo to rot silently.

Plus two smaller ones: a `seed-collection` must declare `seedRecords`, and a
`list` field must declare `itemFields` — both mistakes present as an empty
editor rather than an error. And no descriptor key may be defined in two source
maps, since the merge silently drops one editor while still listing it.

## The claim that a merge trades away type safety — withdrawn, with a fix

The rollout ledger recorded that migrating these four would "trade runtime type
coercion for editability", because `normalizeDepartment` and its six helpers
rebuilt every field with an explicit type check. That was right about the old
merge and wrong as a conclusion. The merge now **refuses a value whose shape
does not match the seed's**, so a string cannot land where the page renders an
array. Same guarantee, one place, every content type — and `lib/cms/departments.ts`
goes from 279 lines to 51.

The merge is also deterministic now: whole values first, flat paths second. It
used to be whatever `Object.entries` returned, so a document holding both shapes
for one string merged differently depending on key insertion order.

## Checked against live data before anything was deleted

Every stored document was merged both ways and diffed, twice — once for the
existing page descriptors and once for the site pages — before any form or
route was removed. Then the migrated readers were exercised against real
Firestore: 8 departments, 8 initiatives, all 5 tracks, the edited track keeping
its stored title and hero image, and `_overview` correctly absent from the
tracks list.

## What is deliberately NOT migrated

**The dynamic Who We Are and What We Do pages.** They are not seed-backed and
not copy editing: they author a page — its slug, its route, its sections — from
nothing. That is the one thing the generated editor deliberately does not do,
so `site-page-form.tsx` stays for them and the reason is written into
`lib/content/admin-registry.ts` where the next person will look.

`mergeSitePage` is kept for those pages alone, for a related reason: they have
no shipped copy behind them, so an empty stored value there is a real answer
from whoever authored the page rather than a fallback.

**`testimonialsHub`** is in `pageFallbacks` but no public page reads it, so it
gets no editor. An editor for content that renders nowhere is worse than none.

## Still open

- A field a seed object does not declare cannot be edited — `courses` on the
  training pages, `heroImage` on Who We Are and the testimonials page. The fix
  is a one-line seed addition where the page actually needs it, not a change
  to the merge: accepting an absent key was tried and immediately let
  `updatedAt` through, since `toPlainData` turns its Timestamp into a string.
- Adding a department or a partnership track through the admin starts from a
  template record's structure, so an unedited field shows the template's
  wording. The create screen says so in an amber panel and a new department
  starts as a draft, but a track has no draft state and appears on the hub as
  soon as it is saved.
- The admin screens have not been exercised inside a real session — the build
  compiles them and the data paths are verified against live Firestore, but
  nobody has clicked "add a row" in a browser yet.
