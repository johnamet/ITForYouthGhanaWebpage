# Live preview for descriptor-driven page editors — design

Date: 2026-09-10
Status: approved (approach agreed; remaining judgement calls delegated)
Editor route: `/admin/cms/[type]/[id]`
Predecessors: the homepage workspace (2026-09-08) and the site-page workspace
(2026-09-09), whose shared kit this reuses.

## Problem

Sixteen public pages are edited through one generated editor and none of them
has a live preview. An editor fills in fields and has no way to see where the
copy lands short of saving and opening the public site in another tab.

This was mis-diagnosed once during discovery and the correction matters. A
first pass grepped admin routes for each landing page's getter — `grep -rl
getCmsWhoWeArePage "app/(admin)"` — found nothing, and concluded those pages
had no editor at all. They do. The descriptor CMS edits the same Firestore
documents without importing those getters, so the editors were invisible to
that search. **Every hub landing page already has an editor; what none has is a
preview.** The work is therefore only to add the preview.

## Approved decisions

1. **All sixteen page descriptors in one build.** The marginal cost per page is
   small once the integration exists, and one review surface is cheaper than
   several.
2. **Two panes, not three: fields and preview, with no rail.**
   `ContentTypeDescriptor` carries a flat `fields: FieldDescriptor[]` with no
   groups or sections, and `RecordForm` renders them flat, so a rail would have
   nothing to enumerate. Adding grouping metadata to sixteen descriptors is a
   separate, larger, editorial job and is out of scope.
3. **`RecordForm` gains an observation callback; it does not become
   controlled.**

### Why observation rather than lifting state

The two previous workspaces lifted form state into a provider. That was right
there and is wrong here, and the difference is worth stating because the
symmetry is tempting.

In those cases the provider took over **saving** — per-section keys in one,
whole-record validation with per-region error attribution in the other — so it
had to own the values. Here saving is already correct and unchanged. The
preview only needs to **observe** the values as they change.

`RecordForm` is shared by all twenty-four descriptors, collections included,
across both the edit and create routes. Making it controlled to gain something
we do not need would put every CMS screen in the application at risk. So it
keeps its state, its save, its delete and its revert, and gains one optional
prop:

```ts
onValuesChange?: (values: FormValues) => void;
```

The mirrored copy in the wrapper is read-only and never drives the form, so the
usual objection to two sources of truth does not apply — there is one writer and
one observer.

## Facts established against the code

- Sixteen descriptors in `lib/content/cms-descriptors/pages.ts` are
  single-document (each has a `docId`) and **each already declares the public
  route it feeds** via `route`. That is precisely what a preview needs, and it
  means no new mapping metadata is required to know *what* to preview.
- All sixteen public routes exist, including the nine subpages.
- **All sixteen renderers are props-driven and import nothing server-only** —
  no `lib/cms`, no `next/headers`, no `firebase`. Every one can render inside a
  client component unchanged. This was checked per file, not assumed.
- `RecordForm` (559 lines) owns `values` via `useState`, and saves to
  `/api/admin/cms/<key>` (POST) or `/api/admin/cms/<key>/<id>` (PUT). It also
  owns delete and revert-to-seed.
- `getCmsSitePage` returns its seed fallback when Firestore is absent, and the
  descriptor-backed page getters route through it. **These previews therefore
  work locally with no credentials**, unlike the site-page workspace.
- Eight of the sixteen pages render more than the descriptor's own document and
  need context the descriptor does not hold.
- Two suspected mismatches were checked and are not real: `/who-we-are/team`
  renders `ContentPage` with the `team` document *and* `TeamDirectory`, so the
  descriptor's doc does reach the page; and the impact subpages read
  `getCmsImpactPage("reports" | "testimonials" | "sdgs")`, which match their
  descriptor keys exactly.

## The sixteen descriptors

Doc-only — the preview renders the descriptor's document and nothing else:

| Descriptor | Route |
|---|---|
| `who-we-are` | `/who-we-are` |
| `apply-for-training` | `/apply-for-training` |
| `apply-who-can-apply` | `/apply-for-training/who-can-apply` |
| `apply-how-it-works` | `/apply-for-training/how-it-works` |
| `impact-reports` | `/our-impact/reports` |
| `impact-testimonials` | `/our-impact/testimonials` |
| `impact-sdgs` | `/our-impact/sdgs` |
| `contact` | `/contact` |

Needs context, fetched server-side in the preview route:

| Descriptor | Route | Context |
|---|---|---|
| `team` | `/who-we-are/team` | team members |
| `partners` | `/who-we-are/partners` | partners |
| `careers` | `/who-we-are/careers` | jobs |
| `what-we-do` | `/what-we-do` | initiatives |
| `impact-overview` | `/our-impact` | partners |
| `partner-with-us` | `/partner-with-us` | partnership tracks |
| `news-hub` | `/news-and-updates` | published articles |

One descriptor needs both context and a transform:

| Descriptor | Route | Treatment |
|---|---|---|
| `apply-courses` | `/apply-for-training/courses` | see below |

`/apply-for-training/courses` does not simply receive a context list. It calls
`getTrainingCatalogMixed(page.courses)`, which awaits an external course
catalogue and then merges the document's own `courses` over it, CMS entries
winning on slug collision. So the course list depends on the draft and cannot
be a static server-side read — edit a course in the editor and a context-only
preview would show nothing change.

Everything after that `await` is pure, and `types/course.ts` imports nothing,
so the fix is a small split in `lib/api/training.ts`:

```ts
export function mergeCourseCatalog(base: Course[], cmsCourses?: unknown[]): Course[]
```

`getTrainingCatalogMixed` keeps its signature and calls it after its await, so
the public route is unchanged. The preview route fetches the external catalogue
as context, and this descriptor's composition calls `mergeCourseCatalog` on the
client against the live draft. That keeps the preview honest for the one page
where the naive treatment would quietly lie.

`lib/api/training.ts` is not a public renderer, so this split is inside the
constraints; `getCourseCatalog` reads `process.env` and fetches, so it stays
server-side.

Only the descriptor's own document updates live, with `apply-courses` the
documented exception above. Context is read once when the preview document
loads, exactly as the homepage preview treats the eight
sections edited elsewhere. Editing partners does not live-update the Our Impact
preview, and should not: partners are a different screen's concern.

## Architecture

### Reused unchanged

`components/admin/workspace-kit/` — the `postMessage` protocol, `PreviewFrame`
with its viewport geometry, and `PreviewSectionBoundary`. The frame's fixed
pixel widths and scale-after-width transform are load-bearing and must not be
touched; that was established twice already, once by shipping the bug.

### New

- `components/admin/cms-preview/preview-registry.tsx` — maps a descriptor key
  to a small composition mirroring what its public route renders, given the
  draft document and the context bundle. Client-safe and standalone; it must
  not import `lib/cms/admin-config.ts`.
- `components/admin/cms-preview/preview-canvas.tsx` — receives the baseline
  document plus context, merges incoming draft messages over the document, and
  renders the registry's composition inside one error boundary.
- `components/admin/cms-preview/editor-with-preview.tsx` — the client wrapper:
  holds the observed values, renders `RecordForm` in the left pane and
  `PreviewFrame` in the right.
- `app/(admin-preview)/admin/cms-preview/[type]/[id]/preview/page.tsx` — the
  iframe document. Resolves the descriptor, 404s on an unknown key or a
  descriptor with no `route`, fetches the document and its context, and hands
  both to the canvas.

### Modified

- `components/admin/record-form.tsx` — one optional `onValuesChange` prop,
  fired whenever values change. No other behaviour changes.
- `app/(admin)/admin/cms/[type]/[id]/page.tsx` — when the descriptor has a
  `route`, render the two-pane wrapper; otherwise render `RecordForm` exactly as
  today. **Collections and route-less descriptors must be visually and
  behaviourally untouched.**
- `components/admin/workspace-kit/workspace-shell.tsx` — the `rail` slot
  becomes optional and its grid track collapses when absent, so a two-pane
  consumer can reuse the shell rather than a parallel layout.
- `components/admin/admin-shell.tsx` — the full-bleed predicate gains the
  two-pane editor route, since it now manages its own full height.

## Data flow

The wrapper holds the last values `RecordForm` reported and a version counter,
and feeds both to `PreviewFrame`, which debounces and posts them to the iframe.
The canvas merges the document over its server-fetched baseline and re-renders.
Saving, deleting and reverting stay entirely inside `RecordForm`; after a save
its own `router.refresh()` re-reads the document and the observation callback
fires again with the stored values.

`FormValues` is `RecordForm`'s internal shape, not the stored document shape.
The registry therefore receives what the form holds, and each composition is
responsible for reading the fields it needs — the same tolerance the public
renderers already have for partially-filled seed content.

## Failure modes

- **Half-typed values reach real renderers on every keystroke**, as in both
  previous workspaces. One boundary wraps the composition, keyed on the payload
  version so it recovers by itself once a value becomes valid. Per-block
  isolation is not available here, because the compositions are opaque from
  outside.
- **A descriptor with no `route`** — every collection — must fall through to
  today's editor untouched. This is the main regression risk in the work, since
  that editor is shared by twenty-four descriptors.
- **A registry entry missing for a routed descriptor** fails the build: the
  registry is exhaustive over the sixteen keys with an explicit return type, so
  a missing entry is `TS2366` rather than a silently blank preview. That
  mechanism was established the hard way — without the return-type annotation
  the omission compiles clean, because the inferred return widens to include
  `undefined`, and this project does not set `noImplicitReturns`.
- An expired session redirects the iframe to the login page; the frame's
  readiness timeout already detects that and shows its fallback.

## Verification

No test runner, by decision: `npm run type-check`, `npm run lint`,
`npm run build`, `npm run verify:cms`, plus visual checks.

**Unlike the two previous plans, this one is verifiable locally.** The
descriptor-backed getters fall back to seed content, so every one of the sixteen
previews renders with no Firebase credentials — only an admin session cookie is
needed. `scripts/shoot-workspace.mjs` already takes a route, so it can assert
breakpoint fidelity here too.

That removes the excuse that produced the largest gap in both previous plans,
where browser verification was deferred and then never happened. The browser
pass is part of this work, not after it.

## Out of scope

- Field grouping metadata, and therefore a rail.
- Any change to `RecordForm`'s saving, deleting or reverting.
- Any change to a public renderer.
- Collections and route-less descriptors, beyond leaving them untouched.
- `for-organisations`, which has **no page descriptor at all** — verified, zero
  occurrences in `pages.ts`. It is edited through a hand-written route at
  `/admin/programmes/for-organisations/overview` and would need its own work.
- Live-updating context data — partners, initiatives, tracks, articles, team
  members, jobs and courses stay a server-side read.
