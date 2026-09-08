# Homepage CMS live-preview workspace — design

Date: 2026-09-08
Status: approved, ready for implementation planning
Route: `/admin/content/homepage`

## Problem

`/admin/content/homepage` is a single server page stacking seven independent
section forms. Each form owns its own `useState(() => initial)`, its own
`fetch("/api/admin/homepage", { method: "PUT" })`, and its own busy/notice
state. Editors cannot see where any field lands on the public homepage, and
the seven forms duplicate identical save plumbing seven times.

The approved design brief lives in `.superdesign/design-system.md` under
"Active target — CMS live preview editor", and the approved visual mockup is
`.superdesign/tmp/homepage-cms-live-preview.html`. This document turns that
mockup into an implementable design.

## Approved decisions

These were settled during brainstorming and are not open for
re-interpretation during implementation.

1. **Per-section save only.** Each save writes exactly one `homepageSchema`
   key, matching today's behaviour. There is no "save all" action. A
   validation failure in one section cannot affect another.
2. **Active section addressed by shallow query parameter.**
   `/admin/content/homepage?section=<id>`. One workspace component stays
   mounted so the draft store never remounts and edits survive section
   switching. The six registry entries already pointing at
   `/admin/content/homepage` keep working unchanged, and become seven once
   the missing `overview` entry is added.
3. **Drafts are in-memory, with a leave warning.** No `sessionStorage`
   persistence, so a restored draft can never be silently built on top of
   data another admin has since changed. A `beforeunload` prompt and an
   in-app confirm fire whenever unsaved drafts exist.
4. **The preview is a same-origin iframe under `/admin`, fed by
   `postMessage`.**

### Why an iframe rather than an in-place render

Every homepage component styles itself with standard Tailwind breakpoints
(`md:`, `lg:`, `2xl:`). Those resolve against the actual viewport, not against
a container. A preview rendered into a 390px-wide `div` in the admin page
would therefore still match `lg:`, showing a desktop grid crushed into
phone width. The desktop/tablet/mobile viewport controls are an explicit
requirement of the approved brief, so an implementation that cannot honour
them truthfully was rejected.

An iframe is a real nested browsing context, so media queries resolve against
the iframe's own width and the viewport controls become genuinely accurate.
Pointing that iframe at an `/admin` route rather than at the public homepage
keeps it behind the existing admin auth redirect and adds no draft-rendering
mode to any public URL.

## Preconditions verified against the codebase

- Every homepage section component is a pure props-driven presentational
  component. None is `async`; none imports `next/headers`, `firebase-admin`,
  or anything under `lib/cms`. All can therefore be rendered inside a client
  component unchanged. This was checked for the seven editable renderers,
  their nested `StorySection` / `StatsSection` / `NewsletterSignupForm`, and
  all eight context renderers.
- `AdminShell` (`app/(admin)/layout.tsx`) already renders the navy sidebar the
  mockup shows, so only the inner three columns are new work. It wraps
  children in `px-4 py-8 sm:px-6 lg:px-10`, which a full-height workspace
  must opt out of.
- `PUT /api/admin/homepage` merge-sets any subset of `homepageSchema` keys,
  validates loosely (`z.unknown()` for the seven relevant keys), writes an
  audit entry, and revalidates public paths. No API change is required.
- Every `lib/cms/homepage.ts` getter falls back to seed content when Firebase
  Admin is absent and swallows read errors. The workspace and preview are
  therefore fully usable locally with no credentials; only saving returns 503.

## Section inventory

`HomepageSections` renders thirteen component slots holding fifteen
sections: seven the workspace edits, eight edited elsewhere. Slot 3
(`LegacyHomepageSections`) holds three of the seven editable sections.

The seven editable sections, in public page order, with their
`homepageSchema` keys:

| Order | Section            | Schema key           | Renderer                  |
|-------|--------------------|----------------------|---------------------------|
| 2     | Marquee ticker     | `ticker`             | `MarqueeTicker`           |
| 3a    | Overview section   | `overviewSection`    | `LegacyHomepageSections`  |
| 3b    | Challenge section  | `challengeSection`   | `LegacyHomepageSections`  |
| 3c    | Mission section    | `missionSection`     | `LegacyHomepageSections`  |
| 5     | Programme showcase | `programmeShowcase`  | `InitiativesTree`         |
| 12    | Join CTA cards     | `joinCtaCards`       | `JoinCtaBlock`            |
| 13    | Newsletter signup  | `newsletterSignup`   | `NewsletterSignupSection` |

The eight context sections are hero slideshow, impact counter, donation
campaign, featured story, latest news, testimonials, team, and partners.

### Client-safety constraint

`lib/cms/admin-config.ts` imports `getAdminSdkStatus` from
`@/lib/firebase/admin`, which calls `loadServiceAccount()` and reads the
service-account private key from the environment. Any client component that
imports `admin-config.ts` therefore pulls service-account-reading code into
the browser bundle.

The section rail is a client component. So `lib/cms/homepage-sections.ts`
must **not** import `homepageSectionConfigs`; it declares the seven
sections' id, schema key, label, description, and page order itself.
`admin-config.ts` then imports those labels and descriptions when building
its own seven homepage-owned entries, so there is still one source of truth
for them and the dependency only ever points server-ward.

**Rule for implementation: no client component may import
`lib/cms/admin-config.ts`, directly or transitively.**

### Registry gap to fix

`homepageSectionConfigs` in `lib/cms/admin-config.ts` holds fifteen entries
but has no `overview` entry, even though the page renders
`OverviewSectionForm`. Implementation must add one there — in
`admin-config.ts` itself, sourcing its label and description from
`homepage-sections.ts` per the constraint above — with
`route: "/admin/content/homepage"` and `collection: FIREBASE_COLLECTIONS.homepage`,
bringing that list to sixteen. A `team` entry is also missing; that is noted
but not required by this work.

## Architecture

Nine new files, nine modified. The provider is the only stateful module;
the rail, bar, and canvas only read.

### New

- `lib/cms/homepage-sections.ts` — the workspace section registry. Maps each
  of the seven editors to its schema key, label, description, and public page
  order. Feeds the rail, the editor header, and the preview outline labels so
  the three cannot drift.

  This module is **standalone and client-safe**, and the dependency runs
  *from* `admin-config.ts` *to* it, not the other way around. See the
  client-safety constraint below for why the obvious direction is unsafe.
- `components/admin/homepage-workspace/workspace-provider.tsx` — published
  baseline, draft map, active section, per-section save, leave guard.
- `components/admin/homepage-workspace/section-rail.tsx` — 176px rail with
  active / saved / unsaved / hidden-from-page states. "Hidden" is derived
  from the section's own value carrying `active === false`, which is how the
  public renderers already decide not to render; it is not separate state.
- `components/admin/homepage-workspace/section-editor.tsx` — maps the active
  section to its controlled form; renders the per-section save footer.
- `components/admin/homepage-workspace/workspace-bar.tsx` — sticky header:
  breadcrumb, dirty badge, `Save <section>`, and a separate "Open public
  page" action. The bar's save and the editor footer's save are the *same*
  per-section action rendered in two places, as the mockup shows. Neither is
  a "save all".
- `components/admin/homepage-workspace/preview-pane.tsx` — iframe host:
  viewport buttons, fit, refresh, debounced downward posts, upward listener.
- `components/admin/homepage-workspace/preview-canvas.tsx` — client; merges
  incoming drafts over its baseline and renders the real thirteen slots in
  public order, each wrapped in an outline, label, click target, and error
  boundary. Context sections are dimmed and non-interactive.
- `app/(admin)/admin/content/homepage/preview/page.tsx` — the iframe
  document. Server-fetches all thirteen slots exactly as `HomepageSections`
  does and hands them to the canvas as baseline.
- A Playwright screenshot script, in the shape of the existing
  `.claude-shot.mjs`, capturing the workspace at the three preview widths.

### Modified

- The seven forms (`homepage-narrative-forms.tsx` ×3, `ticker-form.tsx`,
  `programme-showcase-form.tsx`, `join-cta-cards-form.tsx`,
  `newsletter-form.tsx`) become controlled: they take `value` / `onChange`
  in place of `initial`, and lose their own save, busy, and notice state.
  Seven copies of save plumbing collapse into one in the provider.
- `components/admin/admin-shell.tsx` gains an opt-in full-bleed variant that
  drops the `main` padding. Growing the existing shell with a variant is
  preferred over a negative-margin hack or a parallel shell component.

  The variant is selected from `usePathname()` inside the shell, against an
  exported route list — not from a prop. A prop cannot work here: the page is
  a *child* of `AdminShell`, so it cannot set its parent's props, and a
  nested layout cannot change a parent layout's padding either. `AdminShell`
  is already a client component that switches on `usePathname()` for nav
  active states, so this follows the pattern already there.
- `app/(admin)/admin/content/homepage/page.tsx` becomes a thin server page:
  fetch the seven published values, render the workspace.
- `app/(admin)/admin/content/homepage/sections/[section]/page.tsx` — the
  seven homepage-owned rows gain `?section=<id>` so "Edit" lands on the right
  section rather than the top of the page.
- `lib/cms/admin-config.ts` — add the missing `overview` entry described
  above.

## Data flow

### State shape

The provider holds `published` (seven values from the server page) and
`drafts`, a partial map containing only edited sections. A section's current
value is `drafts[key] ?? published[key]`, and dirty is `key in drafts`.
Dirtiness is derived, never stored as a second flag that could desync from
the values it describes.

### Parent to iframe

On every edit the provider builds a payload containing **all seven resolved
values**, not only the dirty ones, debounced ~120ms, posted with an explicit
target origin.

Sending all seven is load-bearing, not incidental. Saving a section removes
it from `drafts`; if the payload carried only drafts, the canvas would fall
back to its own baseline, which was fetched before that save, and the preview
would visibly revert to the old copy at the moment of saving. Sending all
seven makes the parent unconditionally authoritative for everything the
workspace owns, and reduces the canvas's own fetch to backing the eight
context sections plus the first paint.

### Iframe to parent

- `ready` on mount, so the first payload does not race the iframe load.
- `select` when an outlined section is clicked, which sets the active section
  and rewrites `?section=`.

### Parent to iframe, second channel

- `scrollTo` when the active section changes, so selecting in the rail
  scrolls and focuses the matching preview section.

Both directions compare `event.origin` against `window.location.origin`, and
the parent additionally confirms the message came from its own frame.

### First paint

The preview route fetches all thirteen slots, so the iframe renders correctly
standalone and can be opened directly in a tab for debugging. The payload
takes over the seven editable sections once it arrives. There is no flash of
empty sections.

### Saving

`save(key)` PUTs `{ [key]: value }`. On success it deletes the key from
`drafts` and folds the value into the local `published`, so the preview does
not flicker and the rail's dot clears. On failure the draft is retained and
the error surfaces in the editor footer. `router.refresh()` then hands the
provider new `published` props, reconciled by an effect that replaces the
baseline only and never touches `drafts` — so saving one section cannot
discard unsaved work in another.

## Layout

- Desktop grid inside the bleed shell:
  `[176px rail][392px fields][preview]`, widening to
  `[196px][430px][preview]` at `2xl`, per the mockup.
- Below `xl`, the rail collapses and the editor switches to Edit / Preview
  tabs rather than shrinking both panes past usability.
- Viewport controls set width on the iframe itself: `100%`, `760px`, `390px`.
  This is what makes the breakpoints real.
- "Fit" is a separate CSS `transform: scale()` on the iframe wrapper.
  Transforms do not alter the layout viewport, so fitting cannot corrupt the
  breakpoints it is displaying.
- The mockup's `<iconify-icon>` tags become `lucide-react`, matching the rest
  of the admin surface.
- Existing admin visual language is retained: navy sidebar, white/slate
  surfaces, Georgia/Cambria headings, Inter body, brand palette, 6–12px
  control radii, restrained shadows, visible keyboard focus.

## Failure modes

**Half-typed data is the primary hazard.** Draft values reach real components
on every keystroke, so the preview renders states the public site never sees:
an image URL mid-typing (`/imag`), a momentarily emptied stat array, a
cleared required heading. `next/image` and `safeImageSrc` can throw on those.

Each of the thirteen slots therefore gets its own error boundary rendering a
labelled "this section can't render with the current values" card, leaving
the rest of the preview working. **The boundary must be keyed on the payload
version**: React error boundaries do not self-heal, so without that key a
section would stay broken after the user finished typing a valid URL, which
would read as an editor bug rather than a transient state.

Other cases:

- Save failure — draft retained, error in the editor footer.
- Missing Firebase Admin — the API's existing 503 wording surfaces in the
  footer; the rest of the workspace stays usable on seed content.
- Iframe fails to load — the pane shows a message plus the "Open public
  page" action, not an empty grey rectangle.
- Unsaved drafts on exit — `beforeunload` plus an in-app confirm on admin
  navigation.

## Verification

This repo has no test runner by decision, so verification is type-check,
lint, build, and visual diffing. All of it stays in separate npm scripts and
nothing the build depends on, so verification cannot block a local build.

- `npm run type-check` — the real gate. Making seven forms controlled changes
  their props, and TypeScript will find every call site.
- `npm run lint`
- `npm run build`
- `npm run verify:cms`
- The Playwright screenshot script at the three preview widths, confirming
  the iframe's breakpoints genuinely differ between them. This is the one
  claim in the design that cannot be verified by reading code.

## Out of scope

- No "save all" action.
- No analytics, collaborators, approval workflows, or content fields not
  already present in the CMS.
- No draft persistence across refreshes.
- No changes to `PUT /api/admin/homepage` or to `homepageSchema`.
- No restyling of public homepage components.
- No draft preview mode on any public route.
- No unrelated refactoring of the other admin content routes.
