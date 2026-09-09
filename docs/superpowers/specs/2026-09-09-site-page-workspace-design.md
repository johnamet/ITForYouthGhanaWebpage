# Site-page workspace — design

Date: 2026-09-09
Status: approved (design direction and remaining judgement calls delegated)
Routes: `/admin/who-we-are-pages/[slug]`, `/admin/what-we-do-pages/[slug]`
Predecessor: `docs/superpowers/specs/2026-09-08-homepage-cms-live-preview-design.md`

## Problem

Custom Who We Are and What We Do pages are edited through `SitePageForm`, a
single 893-line form covering hero copy, statistics, an authored sections
array, calls to action, related-page cards, publishing settings, and a further
group of fields the renderer never reads. Editors cannot see where any field
lands on the public page, and there is no relationship on screen between the
record, the region being edited, and the result.

This applies the section-aware workspace and live preview built for the
homepage to this family, reusing the parts that are genuinely the same and
deliberately not reusing the parts that are not.

## Approved decisions

1. **The rail lists fixed regions**, not the variable-length authored
   `sections` array. The array is edited inside its own region with the
   add/reorder controls the form already has, so the rail stays a stable map
   of the page while typing.
2. **`SitePageForm` is split into one component per region.** The workspace
   mounts one at a time; the two `new` routes compose all of them in a single
   scroll exactly as today. The field markup is written once.
3. **Whole-record save, with per-region error attribution.** Per-region save
   is impossible here: `sitePageSchema` requires `eyebrow` and `title`
   (`min(2)` each) and the endpoint validates the entire object, so a save
   carrying only one region's fields would fail on another region's.
4. **Approach B — share the infrastructure, keep the state model per family.**

### Why approach B rather than a shared kit

Having built the homepage workspace, four things are genuinely identical
between the two and one thing genuinely is not.

Identical: the `postMessage` protocol, the preview frame's geometry, the
per-section error boundary, and the three-pane shell.

Different: the homepage keeps a draft map keyed by seven section names and
saves one key at a time; a site page is one record saved whole. Dirty state is
per-section there and per-record-with-region-attribution here.

A single provider parameterised over both would have to straddle per-key and
whole-record saving, which is exactly where an abstraction stops paying. So the
four identical pieces move into a shared kit and the state model does not. The
homepage's modules are touched only to import from the new locations.

## Facts established against the code

Every claim below was read out of the source, not assumed.

- `ContentPage` (`components/shared/content-page.tsx`) is the single renderer
  for dynamic pages in **both** families. `who-we-are/[slug]` renders it
  directly; `what-we-do/[slug]` branches to `InitiativePageTemplate` only for
  initiatives, a different collection, and otherwise renders `ContentPage`.
  One preview canvas therefore serves both families.
- `ContentPage` is props-driven, synchronous, and imports nothing server-only,
  so it can render inside a client component unchanged.
- Its render order is: `EditorialImageHero` → `StatsSection` → authored
  sections → related cards.
- **Calls to action render inside the hero**, passed to `EditorialImageHero`
  as `ctas`, not as a separate block lower down.
- `ContentPage` reads `exploreEyebrow`, `exploreTitle`, `exploreDescription`
  and `highlightsEyebrow` — they are the related and stats headings.
- `ContentPage` does **not** read `heroVideoUrl`, `heroVideoThumbnail`,
  `overviewVideoUrl`, `overviewVideoTitle`, `overviewTitle`,
  `overviewDescription`, `operatingTitle`, `principlesTitle`, `nextStepTitle`,
  `processTitle`, `cohorts`, or `process` — yet `SitePageForm` exposes them.
- `lib/utils/validators.ts` imports only `zod` and is fully client-safe.
- The save endpoints return `errors: parsed.error.flatten()` on a 400, so
  `fieldErrors` is keyed by top-level `SitePage` field name.
- `getCmsWhoWeAreDynamicPages` and its What We Do twin return `[]` when
  Firestore is absent, with **no seed fallback**.

## Region registry

Seven regions. Each owns a disjoint set of `SitePage` fields; every field the
form exposes today belongs to exactly one region, so no editing capability is
lost.

| # | Region | Fields | Preview target |
|---|---|---|---|
| 1 | Hero | `eyebrow`, `title`, `description`, `heroImage`, `intro` | the hero |
| 2 | Calls to action | `ctas` | the hero (they render inside it) |
| 3 | Statistics | `stats`, `highlightsEyebrow` | the stats block |
| 4 | Body sections | `sections` | the sections block |
| 5 | Related pages | `related`, `exploreEyebrow`, `exploreTitle`, `exploreDescription` | the related block |
| 6 | Page settings | `slug`, `status`, `order` | nothing — affects the URL |

| 7 | Not shown on this page | 22 fields, listed below | nothing |

Region 7 in full, verified field by field against what `SitePageForm` exposes
today: `heroVideoUrl`, `heroVideoThumbnail`, `overviewTitle`,
`overviewDescription`, `operatingEyebrow`, `operatingTitle`,
`operatingDescription`, `principlesEyebrow`, `principlesTitle`,
`principlesDescription`, `principlesHeroEyebrow`, `principlesHeroTitle`,
`principlesImage`, `principlesImageAlt`, `processEyebrow`, `processTitle`,
`processDescription`, `nextStepEyebrow`, `nextStepTitle`,
`nextStepDescription`, `cohorts`, `process`.

Within the region these are grouped under their own subheadings — hero video,
overview copy, operating copy, principles copy, process copy, next-step copy,
and the two training blocks — because 22 fields in one flat pane would just
recreate the problem the workspace exists to solve, at smaller scale.

`overviewVideoUrl`, `overviewVideoTitle` and `courses` exist on the `SitePage`
type but `SitePageForm` does **not** expose them, so they are not in any region
and this work does not add editors for them. Adding them would be new
capability rather than the relocation this design describes.

Region 2 sharing region 1's preview target is a fact about the renderer, not a
modelling compromise: the rail must tell the truth about where content appears,
and CTAs appear in the hero.

Region 7 exists because those fields are editable today and removing that would
be a capability regression, but `ContentPage` ignores every one of them, so
presenting them as if they affected the page would be a lie. The rail marks the
region "Not shown on this page", reusing the homepage rail's existing
hidden-state treatment.

A region is marked **empty** when every field it owns is blank or an empty
array, mirroring `ContentPage`'s own filters (`stats`, `sections`, `ctas` and
`related` are each filtered before rendering, so an all-blank region renders
nothing).

## Architecture

### Shared kit — new

`components/admin/workspace-kit/`

- `preview-protocol.ts` — message types, `isTrustedPreviewEvent`, the origin
  and source guards, `previewSectionDomId`. This is today's
  `preview-messages.ts` minus `PreviewBaseline`, which is homepage-specific and
  stays behind.
- `preview-frame.tsx` — the iframe host: viewport presets, the
  ResizeObserver scale-to-fit geometry, the readiness timeout, refresh, and the
  failure fallback. Parameterised by preview route and a payload builder.
- `section-boundary.tsx` — the per-section error boundary with its
  `resetKey` reset.
- `workspace-shell.tsx` — the three-pane grid, the `h-full` pane roots, and
  the responsive Edit/Preview tabs.

**`preview-frame.tsx` must keep the homepage's geometry exactly.** Viewport
presets are fixed pixel widths (`1280`, `820`, `390`) with a scale-to-fit
transform applied *after* the width, and the wrapper carrying the scaled
footprint is sized to the post-transform dimensions. A percentage width or a
transform without a width silently destroys the breakpoint fidelity the iframe
exists to provide; the homepage shipped that bug once and it took a whole-branch
review to catch.

### Site-page workspace — new

- `lib/cms/site-page-regions.ts` — the registry above, plus
  `regionForField(field)` and `isRegionEmpty(region, page)`. Client-safe and
  standalone; it must not import `lib/cms/admin-config.ts`, which reads the
  service-account private key.
- `components/admin/site-page-workspace/record-provider.tsx` — the draft
  record, the published baseline, whole-record save, client-side validation,
  per-region errors, and the leave guard.
- `components/admin/site-page-workspace/region-rail.tsx` — regions with
  active / unsaved / error / empty / not-shown states.
- `components/admin/site-page-workspace/region-editor.tsx` — mounts the
  active region's component and shows its errors.
- `components/admin/site-page-workspace/workspace-bar.tsx` — breadcrumb,
  record title, dirty badge, "Save page", "Open public page".
- `components/admin/site-page-workspace/preview-canvas.tsx` — renders
  `ContentPage` against the draft and positions an outline, a label and a
  click target over each region's block.

  **It cannot wrap those blocks.** `ContentPage` renders them internally and is
  not to be modified, so the canvas pairs its element children positionally
  against the targets it expects to have rendered — `hero` always, then
  `stats`, `body` and `related` for each non-empty region, using the very
  filters `ContentPage` itself applies. If the child count and the expected
  count disagree, `ContentPage`'s structure has changed and any pairing would
  put outlines on the wrong blocks, so outlining is disabled with a visible
  notice instead. The preview still renders; outlining is the enhancement, not
  the substance.

  This also forces one error boundary around the whole page rather than one per
  block, which is a real loss of isolation against the homepage: a throw sends
  the entire preview to the placeholder rather than one section. It still
  recovers on the next payload, which is what matters for half-typed values.
- `app/(admin-preview)/admin/site-pages/[family]/[slug]/preview/page.tsx` —
  the iframe document. `family` is `who-we-are` or `what-we-do`.

### Region components — extracted, not rewritten

`components/admin/site-page/`: `hero-region.tsx`, `ctas-region.tsx`,
`stats-region.tsx`, `body-sections-region.tsx`, `related-region.tsx`,
`settings-region.tsx`, `other-fields-region.tsx`.

Each takes `value: EditableSitePage` and `onChange: (next: EditableSitePage) => void`
and renders only its own fields. `SitePageForm` becomes a thin composition of
all seven, keeping its existing props and save behaviour so the two `new`
routes are unchanged in behaviour.

### Modified

- `components/admin/site-page-form.tsx` — becomes the composition described
  above.
- `components/admin/homepage-workspace/*` — re-import the four kit modules
  from their new locations. No restructuring.
- `components/admin/admin-shell.tsx` — the full-bleed variant currently
  matches an exact route list; it needs a predicate, because these routes carry
  a dynamic `[slug]` segment.
- `app/(admin)/admin/who-we-are-pages/[slug]/page.tsx` and the What We Do
  twin — become thin server pages rendering the workspace.

## Sequencing

This is larger than the homepage work, so it is built as three phases, each of
which leaves the repository working and independently verifiable.

1. **Extract the shared kit** and re-point the homepage workspace at it. A pure
   refactor: no behaviour changes, and the existing homepage verification still
   applies unchanged. If this phase breaks anything, it breaks something already
   reviewed, so it is worth landing first and alone.
2. **Split `SitePageForm` into the seven region components** and rebuild it as
   their composition. Also a pure refactor, and verifiable without Firestore
   through the two `new` routes, which compose all seven and need no record.
3. **Build the workspace, the preview route and the canvas**, and convert the
   two `[slug]` edit routes to use them. Only this phase needs a real record.

The order matters: phase 3 consumes both earlier phases, and phases 1 and 2
each carry their own risk to code that already works. Landing them separately
keeps a failure attributable.

## Family plumbing

The workspace serves two families that differ in four values only: the label
shown in the breadcrumb, the save endpoint, the public URL prefix, and the
preview route's `family` segment. These travel as one `SitePageFamily` object,
resolved by the server page from its own route and passed to the provider —
never inferred inside a client component from `usePathname`, which would put
the same fact in two places.

```ts
type SitePageFamily = {
  id: "who-we-are" | "what-we-do";
  label: string;              // "Who We Are"
  endpointBase: string;       // "/api/admin/who-we-are-pages"
  publicBase: string;         // "/who-we-are"
};
```

## Data flow

### State

The provider holds `published` (the record as read from the server) and
`draft` (the whole record being edited). Dirty is a structural comparison of
the two rather than a per-field flag, and a region is dirty when any field it
owns differs.

### Validation and error attribution

The provider validates the draft **client-side** with the very same
`dynamicSitePageSchema` the endpoint uses, which is possible because
`validators.ts` imports only zod. Errors come back as
`flatten().fieldErrors`, keyed by field name, and `regionForField` maps each to
its region, so the rail marks the offending region the moment the field goes
invalid — no round trip.

This does not replace server validation, which still runs and is still
authoritative; the client copy is for attribution and immediacy. When a save is
rejected anyway, the response's `fieldErrors` are attributed the same way, and
a message-only rejection (a reserved slug, a missing record) surfaces in the
sticky bar unattributed, because guessing a region from an error string would
be worse than admitting the error is page-level.

### Saving

One action sends the complete record to the family's existing endpoint by
`PUT`, unchanged. On success the draft becomes the new baseline and
`router.refresh()` runs. On failure the draft is kept and the errors are
attributed. Saving is blocked while client-side validation fails, and the
sticky bar names how many regions need attention rather than repeating a field
message.

### Preview

Identical to the homepage: the parent posts a debounced payload — here the
whole draft record — into the iframe once it reports ready; the canvas merges
it over its server-fetched baseline and renders. Clicking an outlined region
selects it; selecting a region scrolls the preview to it. Both directions check
origin and the parent also checks `event.source`.

Two regions render nothing, so they have no preview target. Selecting Page
settings or Not-shown scrolls the preview nowhere and the canvas outlines
nothing — the rail says so rather than leaving the editor wondering.

### URLs

The existing edit routes are kept and gain `?region=<id>`, updated with
`window.history.replaceState` so switching regions never re-renders the server
page. Keeping the routes matters: `verify:cms` checks 118 hardcoded admin links
against 45 routes, and the admin registry points at these paths.

## Failure modes

- **Half-typed values reach `ContentPage` on every keystroke.** Each outlined
  region is wrapped in the shared boundary, keyed on the payload version so a
  section recovers by itself once the value becomes valid.
- **Duplicate section titles.** `ContentPage` uses `section.title` as its React
  key, so two blank or identical titles collide and React drops one. This is
  pre-existing and visible in the preview the moment a section is added. The
  canvas uses an index-based key of its own so the preview stays stable; the
  underlying renderer is left alone, and the body-sections region warns when
  two titles match.
- **No record exists.** Without Firestore the family getters return `[]`, so
  `[slug]` 404s and the workspace cannot be opened at all. Nothing in the
  design can fix that; it is recorded under verification.
- Save failure keeps the draft. An expired session redirects the iframe to the
  login page, which the readiness timeout already detects. Unsaved changes on
  exit prompt via `beforeunload` and an in-app confirm.

## Verification

No test runner, by decision. `npm run type-check`, `npm run lint`,
`npm run build`, `npm run verify:cms`, plus visual checks.

The honest limitation, worse than the homepage's: the homepage getters all fall
back to seed content, so that workspace was fully exercisable with no
credentials. These getters return `[]` instead, so the workspace needs **both**
an `itfy-admin-session` cookie and real Firestore data. Two consequences:

- The seven region components stay locally verifiable through the two `new`
  routes, which compose all of them and need no record. That covers the bulk of
  the extracted markup.
- The workspace shell, rail, preview and save path can only be verified against
  a real record. The existing `scripts/shoot-homepage-workspace.mjs` is
  generalised to take a route so it can screenshot this workspace at the three
  viewport widths too.

## Out of scope

- No change to `sitePageSchema`, `dynamicSitePageSchema`, or either family's
  endpoints.
- No partial or `PATCH` save path.
- No change to `ContentPage`, `EditorialImageHero`, or any other public
  renderer.
- No new admin URLs, and no change to the admin registry or the existing
  section-index pages.
- `InitiativePageTemplate` and the initiatives collection are a different
  content type and are not covered.
- `cohorts` and `process` stay editable, in region 7, but are not given
  rendering support here. `courses` is not editable today and stays that way.
- No restructuring of the homepage workspace beyond re-importing the kit.
