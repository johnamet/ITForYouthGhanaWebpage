# Site-Page Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give Who We Are and What We Do custom pages the section-aware editing workspace and live preview the homepage now has, reusing the parts that are genuinely shared.

**Architecture:** Four pieces of the homepage workspace are extracted into a shared kit — the `postMessage` protocol, the preview frame's geometry, the section error boundary, and the three-pane shell. `SitePageForm`'s 893 lines are split into seven region components that both the workspace and the two `new` routes compose. The workspace itself keeps its own state model, because a site page is one record saved whole while the homepage is seven sections saved individually.

**Tech Stack:** Next.js 14.2 App Router, React 18.3, TypeScript 5.7 (`strict`, `noUncheckedIndexedAccess` off), Tailwind CSS, lucide-react, zod, Firebase Admin (server only), Playwright (screenshots only — not a test runner).

**Spec:** `docs/superpowers/specs/2026-09-09-site-page-workspace-design.md`

## Global Constraints

- **No test runner exists in this repo, by explicit decision. Never add one.** Verification for every task is `npm run type-check`, `npm run lint`, `npm run build`, `npm run verify:cms`, plus a browser check where stated.
- **Verification never gates the build.** Anything new goes in a separate npm script.
- **No client component may import `lib/cms/admin-config.ts`**, directly or transitively — it imports `getAdminSdkStatus`, which reads the service-account private key from the environment.
- **No changes to `sitePageSchema`, `dynamicSitePageSchema`, or either family's API routes.** The endpoints already validate the whole record and that is the contract this design is built on.
- **No changes to `ContentPage`, `EditorialImageHero`, or any other public renderer.**
- **No new admin URLs.** `verify:cms` checks 118 hardcoded admin links against 45 routes, and the admin registry points at the existing paths.
- **Region switching must not remount the workspace or re-render the server page.** Use `window.history.replaceState`, native since Next 14.1. `router.replace()` re-renders the server component.
- **Drafts are in-memory only.** No `sessionStorage`, no `localStorage`.
- **Icons are `lucide-react`.** Never `iconify-icon`.
- **Radius: the semantic `rounded-control` (0.375rem) and `rounded-media` (0.75rem) tokens**, never raw `rounded-md` / `rounded-xl` / `rounded-lg`.
- **Brand palette only** via `brand-*` tokens: navy `#142850`, primary `#1E72BA`, primary-dark `#0152BE`, mist `#E8F1FA`, accent `#D70B52`, accent-dark `#B00944`, warm `#FBE7EF`, ink `#1A1A1A`, muted `#5C6672`, border `#D8E5F2`, alt `#F7F9FC`, white. Two sanctioned exceptions inside admin chrome only: `slate-*` neutrals, and semantic status colour (`emerald-*` saved, `rose-*` errors).
- **Accessible keyboard focus is required** on the rail, the region outlines, and the viewport controls.

**The preview frame's geometry is load-bearing and must not be altered while extracting it.** Viewport presets are fixed pixel widths — `1280`, `820`, `390` — with a scale-to-fit transform applied *after* the width, and the wrapper carrying the scaled footprint sized to the post-transform dimensions. A percentage width, or a transform without a fixed width, silently destroys the breakpoint fidelity the iframe exists to provide. The homepage shipped exactly that bug once and only a whole-branch review caught it.

**The seven regions, fixed for the whole plan:**

```
hero  ctas  stats  body  related  settings  other
```

## File Structure

**Create — shared kit:**

| File | Responsibility |
|---|---|
| `components/admin/workspace-kit/preview-protocol.ts` | Message types, origin/source guards, DOM id helper. Family-agnostic. |
| `components/admin/workspace-kit/section-boundary.tsx` | Per-section error boundary with `resetKey` reset. |
| `components/admin/workspace-kit/preview-frame.tsx` | Iframe host: viewport presets, scale-to-fit geometry, readiness timeout, refresh, failure fallback. Prop-driven. |
| `components/admin/workspace-kit/workspace-shell.tsx` | Three-pane grid, `h-full` pane roots, responsive Edit/Preview tabs. Prop-driven. |

**Create — site pages:**

| File | Responsibility |
|---|---|
| `lib/cms/site-page-regions.ts` | Region registry; `regionForField`; `isRegionEmpty`. Client-safe, standalone. |
| `components/admin/site-page/hero-region.tsx` | eyebrow, title, description, intro, heroImage |
| `components/admin/site-page/ctas-region.tsx` | ctas |
| `components/admin/site-page/stats-region.tsx` | stats, highlightsEyebrow |
| `components/admin/site-page/body-sections-region.tsx` | sections |
| `components/admin/site-page/related-region.tsx` | related, exploreEyebrow, exploreTitle, exploreDescription |
| `components/admin/site-page/settings-region.tsx` | slug, status, order |
| `components/admin/site-page/other-fields-region.tsx` | the 22 fields `ContentPage` never reads |
| `components/admin/site-page/shared.ts` | `inputClass`, `panelClass`, `toLines`, `fromLines`, the `empty*` literals |
| `components/admin/site-page-workspace/record-provider.tsx` | Draft record, baseline, whole-record save, client validation, region errors, leave guard |
| `components/admin/site-page-workspace/region-rail.tsx` | Regions with active / unsaved / error / empty / not-shown states |
| `components/admin/site-page-workspace/region-editor.tsx` | Mounts the active region and shows its errors |
| `components/admin/site-page-workspace/workspace-bar.tsx` | Breadcrumb, record title, dirty badge, Save page, Open public page |
| `components/admin/site-page-workspace/preview-canvas.tsx` | Renders `ContentPage` against the draft, outlining each region's target |
| `components/admin/site-page-workspace/preview-pane-adapter.tsx` | Feeds the shared `PreviewFrame` from the record store |
| `app/(admin-preview)/admin/site-pages/[family]/[slug]/preview/page.tsx` | The iframe document |

**Modify:**

| File | Change |
|---|---|
| `components/admin/homepage-workspace/preview-messages.ts` | Keeps only `PreviewBaseline` / `PreviewContext`; re-exports the rest from the kit. |
| `components/admin/homepage-workspace/preview-canvas.tsx` | Import protocol and boundary from the kit; `values` → `data`. |
| `components/admin/homepage-workspace/preview-pane.tsx` | Becomes a thin adapter over `PreviewFrame`. |
| `components/admin/homepage-workspace/workspace-layout.tsx` | Becomes a thin wrapper over `WorkspaceShell`. |
| `components/admin/homepage-workspace/preview-section-boundary.tsx` | Deleted; the kit owns it. |
| `components/admin/site-page-form.tsx` | Becomes a composition of the seven region components. |
| `components/admin/admin-shell.tsx` | Full-bleed selection becomes a predicate, for dynamic `[slug]` routes. |
| `app/(admin)/admin/who-we-are-pages/[slug]/page.tsx` | Thin server page rendering the workspace. |
| `app/(admin)/admin/what-we-do-pages/[slug]/page.tsx` | Same, for the other family. |
| `scripts/shoot-homepage-workspace.mjs` | Generalised to take a route, and renamed. |
| `package.json` | The renamed script entry. |

---

# Phase 1 — Extract the shared kit

Pure refactor. No behaviour changes anywhere. The homepage workspace's own verification still applies unchanged, and if this phase breaks something it breaks code that was already reviewed, which is why it lands first and alone.

### Task 1: Move the protocol and the boundary

Two pure relocations, batched because neither needs its own judgement.

**Files:**
- Create: `components/admin/workspace-kit/preview-protocol.ts`
- Create: `components/admin/workspace-kit/section-boundary.tsx`
- Modify: `components/admin/homepage-workspace/preview-messages.ts`
- Modify: `components/admin/homepage-workspace/preview-canvas.tsx`
- Modify: `components/admin/homepage-workspace/preview-pane.tsx`
- Delete: `components/admin/homepage-workspace/preview-section-boundary.tsx`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces:

```ts
// preview-protocol.ts
export const PREVIEW_READY = "itfyg:preview-ready";
export const PREVIEW_SELECT = "itfyg:preview-select";
export const PREVIEW_DRAFT = "itfyg:preview-draft";
export const PREVIEW_SCROLL = "itfyg:preview-scroll";

export type PreviewReadyMessage = { type: typeof PREVIEW_READY };
export type PreviewSelectMessage = { type: typeof PREVIEW_SELECT; sectionId: string };
export type PreviewDraftMessage<TData> = {
  type: typeof PREVIEW_DRAFT;
  payloadVersion: number;
  activeSectionId: string;
  data: TData;
};
export type PreviewScrollMessage = { type: typeof PREVIEW_SCROLL; sectionId: string };

export type CanvasToParentMessage = PreviewReadyMessage | PreviewSelectMessage;
export type ParentToCanvasMessage<TData> =
  | PreviewDraftMessage<TData>
  | PreviewScrollMessage;

export function isTrustedPreviewEvent(event: MessageEvent): boolean;
export function previewSectionDomId(sectionId: string): string;
```

```tsx
// section-boundary.tsx
export class PreviewSectionBoundary extends Component<{
  label: string;
  resetKey: number;
  children: ReactNode;
}> {}
```

- [ ] **Step 1: Create the protocol module**

Move the contents of `components/admin/homepage-workspace/preview-messages.ts` into `components/admin/workspace-kit/preview-protocol.ts`, **except** `PreviewContext` and `PreviewBaseline`, which are homepage-specific and stay behind.

Three changes while moving, and only these three:

1. Extract the four message-type string literals into the exported constants shown above, and use them in the type definitions. Two consumers now depend on these strings matching exactly, so they should exist once.
2. `PreviewDraftMessage` becomes generic over its payload, and its `values` field is renamed `data`. A site page's payload is one record, not a set of section values, so the field needs a name that fits both.
3. `ParentToCanvasMessage` becomes generic in the same way.

`PREVIEW_ROUTE` does **not** move — it is the homepage's route. Leave it in `preview-messages.ts`.

- [ ] **Step 2: Create the boundary module**

Move `components/admin/homepage-workspace/preview-section-boundary.tsx` to `components/admin/workspace-kit/section-boundary.tsx` **verbatim** — every line, including the `componentDidUpdate` reset and its comment. Change nothing. Then delete the original file.

The `resetKey` reset is the whole point of that component: React error boundaries do not self-heal, so without it a section stays broken after the editor types a valid value. Do not "simplify" it while moving.

- [ ] **Step 3: Re-point `preview-messages.ts`**

`components/admin/homepage-workspace/preview-messages.ts` keeps `PREVIEW_ROUTE`, `PreviewContext` and `PreviewBaseline`, and re-exports the moved names so nothing else has to change in this step:

```ts
export {
  PREVIEW_READY,
  PREVIEW_SELECT,
  PREVIEW_DRAFT,
  PREVIEW_SCROLL,
  isTrustedPreviewEvent,
  previewSectionDomId,
} from "@/components/admin/workspace-kit/preview-protocol";
export type {
  CanvasToParentMessage,
  ParentToCanvasMessage,
  PreviewDraftMessage,
  PreviewReadyMessage,
  PreviewScrollMessage,
  PreviewSelectMessage,
} from "@/components/admin/workspace-kit/preview-protocol";
```

- [ ] **Step 4: Update the two homepage consumers**

In `components/admin/homepage-workspace/preview-canvas.tsx`:
- import `PreviewSectionBoundary` from `@/components/admin/workspace-kit/section-boundary`;
- the draft branch reads `message.data` where it read `message.values`;
- `ParentToCanvasMessage` is now generic, so annotate it with the homepage's payload type: `ParentToCanvasMessage<HomepageDraftValues>`.

In `components/admin/homepage-workspace/preview-pane.tsx`, the posted payload's `values:` key becomes `data:`.

Use the exported string constants in place of the inline `"itfyg:preview-*"` literals in both files.

- [ ] **Step 5: Verify**

Run: `npm run type-check && npm run lint && npm run build && npm run verify:cms`
Expected: all PASS. This is a pure move, so any type error means a name was dropped or a path is wrong.

Then confirm mechanically that no stale references remain:

Run: `grep -rn "preview-section-boundary\|message.values" components/ app/ | grep -v node_modules`
Expected: no output.

- [ ] **Step 6: Commit**

```bash
git add components/admin/workspace-kit/preview-protocol.ts components/admin/workspace-kit/section-boundary.tsx components/admin/homepage-workspace/preview-messages.ts components/admin/homepage-workspace/preview-canvas.tsx components/admin/homepage-workspace/preview-pane.tsx
git rm components/admin/homepage-workspace/preview-section-boundary.tsx
git commit -m "refactor(admin): extract the preview protocol and section boundary

A second workspace needs both unchanged, so they move to a shared kit.
The draft message becomes generic over its payload and its values field
becomes data, because a site page sends one record rather than a set of
section values. The message strings become constants now that two
consumers depend on them matching."
```

---

### Task 2: Extract the preview frame

`preview-pane.tsx` currently reads `useWorkspace()` directly, which is the only thing stopping it being shared. The kit version takes what it needs as props; the homepage's file becomes a five-line adapter.

**Files:**
- Create: `components/admin/workspace-kit/preview-frame.tsx`
- Modify: `components/admin/homepage-workspace/preview-pane.tsx` (full rewrite as an adapter)

**Interfaces:**
- Consumes: everything from `preview-protocol.ts` (Task 1).
- Produces:

```tsx
export type PreviewFrameProps<TData> = {
  /** Admin route the iframe loads. */
  previewRoute: string;
  /** Increments on every draft change; drives the debounced post and the
   *  boundary resets inside the canvas. */
  payloadVersion: number;
  /** The whole payload the canvas renders. */
  data: TData;
  /** Which section is active, sent with each payload so the canvas can
   *  outline it. */
  activeSectionId: string;
  /** Section to scroll the preview to, or null when the active section
   *  renders nothing on the page. */
  scrollTargetId: string | null;
  /** Called when someone clicks an outlined section inside the canvas. */
  onSelectSection: (sectionId: string) => void;
  /**
   * The whole trailing text in the frame's footer strip, composed by the
   * caller. It is not appended to a literal, because the frame is shared and
   * cannot know which page it is previewing.
   */
  footerLabel: string;
  /**
   * What is being previewed, as a noun phrase — "Homepage", or "Who We Are:
   * Our story". NOT a full label: the frame composes it differently for the
   * iframe's title and the wrapper's accessible name, so passing a phrase like
   * "Homepage preview" yields "Live preview of Homepage preview".
   *
   * It has to be a prop at all because a site page announcing itself as
   * "Homepage preview" would be false. The screenshot script keys off the
   * frame's constant `data-preview-frame` attribute rather than this text,
   * precisely so this can vary.
   */
  subject: string;
};

export function PreviewFrame<TData>(props: PreviewFrameProps<TData>): JSX.Element;
```

- [ ] **Step 1: Create the frame**

Move the whole body of `components/admin/homepage-workspace/preview-pane.tsx` into `components/admin/workspace-kit/preview-frame.tsx`, renaming the component `PreviewFrame` and replacing its `useWorkspace()` line with the props above. Everything else moves **verbatim**:

- `VIEWPORTS` with widths `1280`, `820`, `390` and the `aria-label` values `"Desktop preview"`, `"Tablet preview"`, `"Mobile preview"`;
- `DRAFT_DEBOUNCE_MS = 120` and `READY_TIMEOUT_MS = 8000`, with their comments;
- `stageRef` / `stage` state and the `ResizeObserver` effect, including its `[failed]` dependency;
- the `scale` computation with its `Math.min(1, …)` clamp;
- the two-layer sizing box — outer wrapper at `active.width * scale`, inner at `active.width` with `transform: scale(...)` and `transformOrigin: "top left"`;
- the `skipScrollFor` ref and its read-and-clear-unconditionally treatment;
- the readiness timeout, the `onError` handler, the failure fallback copy, and `refresh()` clearing both `ready` and `failed`;
- the origin check and the `event.source === frameRef.current?.contentWindow` check.

The iframe gains a constant `data-preview-frame=""` attribute, and both its
`title` and the wrapper's `aria-label` are composed from the single `subject`
prop. The names have to vary — a site page must not announce itself as
"Homepage preview" — while the screenshot script's selector must not, so the
two concerns are split: `subject` names the frame for assistive technology, the
attribute identifies it for automation.

`subject` is a noun phrase, not a label, so each slot can read naturally:
`"Homepage"` yields the iframe title "Homepage preview" and the wrapper name
"Live preview of Homepage".

**Do not change the geometry.** Fixed width, then transform. The outer wrapper must stay sized to the scaled footprint or the scroll extents go wrong.

Three substitutions where the old code read the workspace:

| Was | Becomes |
|---|---|
| `values` in the posted payload | `data` prop |
| `activeSection.id` | `activeSectionId` prop |
| `selectSection(message.sectionId)` | `onSelectSection(message.sectionId)` |
| `activeSection.label` in the footer | `footerLabel` prop |
| `aria-label="Live homepage preview"` on the wrapper section | `aria-label={\`Live preview of ${subject}\`}` |
| `title="Homepage preview"` on the iframe | `title={\`${subject} preview\`}` |
| the footer's hard-coded `· Homepage ·` segment | removed; `footerLabel` now carries it |

Those last two are the same defect as the hard-coded `title`: in a shared
component they are false for any workspace but the homepage, and the
`aria-label` one would announce a Who We Are preview as the homepage's to a
screen reader.

And the scroll effect now guards on the new prop:

```tsx
  useEffect(() => {
    if (!ready || scrollTargetId === null) {
      return;
    }
    const skip = skipScrollFor.current;
    skipScrollFor.current = null;

    if (skip === scrollTargetId) {
      return;
    }
    post({ type: PREVIEW_SCROLL, sectionId: scrollTargetId });
  }, [ready, post, scrollTargetId]);
```

`scrollTargetId === null` is how a caller says "the active section renders nothing, so there is nowhere to scroll" — the site-page workspace needs that for its settings and not-shown regions.

- [ ] **Step 2: Rewrite the homepage pane as an adapter**

Replace the whole of `components/admin/homepage-workspace/preview-pane.tsx` with:

```tsx
"use client";

import { PreviewFrame } from "@/components/admin/workspace-kit/preview-frame";

import { PREVIEW_ROUTE } from "./preview-messages";
import { useWorkspace } from "./workspace-provider";

export function PreviewPane() {
  const { values, activeSection, payloadVersion, selectSection } = useWorkspace();

  return (
    <PreviewFrame
      previewRoute={PREVIEW_ROUTE}
      payloadVersion={payloadVersion}
      data={values}
      activeSectionId={activeSection.id}
      // Every homepage section the workspace edits renders on the page, so
      // there is always somewhere to scroll.
      scrollTargetId={activeSection.id}
      onSelectSection={selectSection}
      footerLabel={`Homepage · ${activeSection.label}`}
      subject="Homepage"
    />
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run type-check && npm run lint && npm run build`
Expected: all PASS.

Then confirm the geometry survived the move:

Run: `grep -nE "width: 1280|width: 820|width: 390|transformOrigin|Math.min\(1,|data-preview-frame" components/admin/workspace-kit/preview-frame.tsx`
Expected: all six present.

Run: `grep -nE "width:[^;,]*100%" components/admin/workspace-kit/preview-frame.tsx`
Expected: no output. A percentage **width** is the bug this design exists to
avoid; the `height` fallback of `"100%"` is correct and pre-existing, so do not
grep for the bare string.

Run: `grep -ciE "homepage" components/admin/workspace-kit/preview-frame.tsx`
Expected: `1` — only the comment on the `title` prop explaining why the title
must not be hard-coded. Any other occurrence means a homepage-specific string
survived into the shared component.

- [ ] **Step 4: Commit**

```bash
git add components/admin/workspace-kit/preview-frame.tsx components/admin/homepage-workspace/preview-pane.tsx
git commit -m "refactor(admin): extract the preview frame behind props

The pane read the workspace context directly, which was the only thing
keeping it homepage-specific. It now takes its payload, active section
and select handler as props, and the homepage keeps a small adapter.

scrollTargetId is nullable so a caller can say the active section
renders nothing, which the site-page workspace needs for its settings
and not-shown regions.

The viewport geometry moved verbatim: fixed pixel width first, then a
scale-to-fit transform, with the outer wrapper sized to the scaled
footprint."
```

---

### Task 3: Extract the workspace shell

**Files:**
- Create: `components/admin/workspace-kit/workspace-shell.tsx`
- Modify: `components/admin/homepage-workspace/workspace-layout.tsx` (full rewrite as a wrapper)

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces:

```tsx
export type WorkspaceShellProps = {
  bar: React.ReactNode;
  rail: React.ReactNode;
  editor: React.ReactNode;
  preview?: React.ReactNode;
};

export function WorkspaceShell(props: WorkspaceShellProps): JSX.Element;
```

- [ ] **Step 1: Create the shell**

Move the body of `components/admin/homepage-workspace/workspace-layout.tsx` into `components/admin/workspace-kit/workspace-shell.tsx`, renaming the component and replacing the three imported components with the `bar` / `rail` / `editor` props. Keep verbatim:

- the `h-screen flex-col` root and the `shrink-0` bar slot;
- the below-`xl` Edit/Preview tab list, its local `view` state, and its `rounded-media` container;
- the grid line `xl:grid-cols-[176px_392px_minmax(0,1fr)] 2xl:grid-cols-[196px_430px_minmax(0,1fr)]` and the comment above it explaining where the definite height comes from;
- the rail's visibility treatment — it must stay reachable below `xl` in the Edit tab, because it is the only way to change section;
- `min-h-0` on all three pane wrappers.

- [ ] **Step 2: Rewrite the homepage layout as a wrapper**

Replace the whole of `components/admin/homepage-workspace/workspace-layout.tsx` with:

```tsx
"use client";

import { WorkspaceShell } from "@/components/admin/workspace-kit/workspace-shell";

import { SectionEditor } from "./section-editor";
import { SectionRail } from "./section-rail";
import { WorkspaceBar } from "./workspace-bar";

export function WorkspaceLayout({ preview }: { preview?: React.ReactNode }) {
  return (
    <WorkspaceShell
      bar={<WorkspaceBar />}
      rail={<SectionRail />}
      editor={<SectionEditor />}
      preview={preview}
    />
  );
}
```

Keeping the `WorkspaceLayout` name and its `preview` prop means `app/(admin)/admin/content/homepage/page.tsx` needs no change at all.

- [ ] **Step 3: Verify**

Run: `npm run type-check && npm run lint && npm run build && npm run verify:cms`
Expected: all PASS.

Run: `grep -c "h-full" components/admin/homepage-workspace/section-rail.tsx components/admin/homepage-workspace/section-editor.tsx`
Expected: `1` each. Those `h-full` roots are what give the panes a bounded box to scroll against; the shell extraction must not have disturbed them.

- [ ] **Step 4: Commit**

```bash
git add components/admin/workspace-kit/workspace-shell.tsx components/admin/homepage-workspace/workspace-layout.tsx
git commit -m "refactor(admin): extract the three-pane workspace shell

The layout hard-imported the homepage's own rail, bar and editor. It now
takes them as slots, and the homepage keeps a wrapper with the same name
and props so its route is untouched."
```

---

# Phase 2 — Split SitePageForm into region components

Also a pure refactor, and verifiable **without Firestore**: the two `new` routes compose all seven regions and need no record, so they exercise the whole of the relocated markup.

### Task 4: Region registry and family descriptors

**Files:**
- Modify: `types/content.ts` (add `EditableSitePage`)
- Create: `lib/cms/site-page-regions.ts`
- Create: `lib/cms/site-page-families.ts`

**Interfaces:**
- Consumes: `SitePage`, `DynamicSitePage` from `types/content.ts`.
- Produces: `EditableSitePage`, `SitePageRegionId`, `SitePageRegion`, `sitePageRegions`, `sitePageRegionsById`, `DEFAULT_SITE_PAGE_REGION_ID`, `findSitePageRegion`, `regionForField`, `doesTargetRender`, `isRegionEmpty`, `SitePageFamily`, `SITE_PAGE_FAMILIES`, `findSitePageFamily`.

- [ ] **Step 1: Promote `EditableSitePage` into the shared types**

`components/admin/site-page-form.tsx:37` declares it locally, but the registry and all seven region components need it. Add to `types/content.ts`, beside `DynamicSitePage`:

```ts
/**
 * A site page as the admin edits it: the public shape plus the dynamic-page
 * fields that only exist for records stored in Firestore.
 */
export type EditableSitePage = SitePage &
  Partial<Pick<DynamicSitePage, "id" | "parentSlug" | "status" | "order">>;
```

Then delete the local declaration in `site-page-form.tsx` and import it from `@/types/content`.

- [ ] **Step 2: Create the region registry**

Create `lib/cms/site-page-regions.ts`. This module is imported by client components, so it must **not** import `lib/cms/admin-config.ts` — that module reads the service-account private key.

```ts
import type { EditableSitePage } from "@/types/content";

export type SitePageRegionId =
  | "hero"
  | "ctas"
  | "stats"
  | "body"
  | "related"
  | "settings"
  | "other";

export type SitePageRegion = {
  id: SitePageRegionId;
  label: string;
  description: string;
  /**
   * The fields this region owns. Every field SitePageForm exposes belongs to
   * exactly one region, so splitting the form loses no editing capability.
   */
  fields: readonly (keyof EditableSitePage)[];
  /**
   * DOM id of the block this region renders as in the preview, or null when
   * ContentPage renders nothing for it.
   */
  previewTarget: string | null;
  /** Position in ContentPage's render order; regions that render nothing sort last. */
  order: number;
};

const REGIONS = {
  hero: {
    id: "hero",
    label: "Hero",
    description: "The banner at the top of the page: label, title, summary and image.",
    fields: ["eyebrow", "title", "description", "intro", "heroImage"],
    previewTarget: "hero",
    order: 1,
  },
  ctas: {
    id: "ctas",
    label: "Calls to action",
    description: "Buttons shown inside the hero. The first is styled as the primary action.",
    fields: ["ctas"],
    // Not a mistake: ContentPage passes these to EditorialImageHero, so they
    // render inside the hero rather than as a block of their own.
    previewTarget: "hero",
    order: 2,
  },
  stats: {
    id: "stats",
    label: "Statistics",
    description: "The numbers block, and the label above it.",
    fields: ["stats", "highlightsEyebrow"],
    previewTarget: "stats",
    order: 3,
  },
  body: {
    id: "body",
    label: "Body sections",
    description: "The page's written sections, in order. Add, reorder and remove them here.",
    fields: ["sections"],
    previewTarget: "body",
    order: 4,
  },
  related: {
    id: "related",
    label: "Related pages",
    description: "Cards linking onward, and the heading above them.",
    fields: ["related", "exploreEyebrow", "exploreTitle", "exploreDescription"],
    previewTarget: "related",
    order: 5,
  },
  settings: {
    id: "settings",
    label: "Page settings",
    description: "URL slug, publish status and ordering. Changes the address, not the content.",
    fields: ["slug", "status", "order"],
    previewTarget: null,
    order: 6,
  },
  other: {
    id: "other",
    label: "Not shown on this page",
    description:
      "Fields this page template does not read. Editable because other templates use them.",
    fields: [
      "heroVideoUrl",
      "heroVideoThumbnail",
      "overviewTitle",
      "overviewDescription",
      "operatingEyebrow",
      "operatingTitle",
      "operatingDescription",
      "principlesEyebrow",
      "principlesTitle",
      "principlesDescription",
      "principlesHeroEyebrow",
      "principlesHeroTitle",
      "principlesImage",
      "principlesImageAlt",
      "processEyebrow",
      "processTitle",
      "processDescription",
      "nextStepEyebrow",
      "nextStepTitle",
      "nextStepDescription",
      "cohorts",
      "process",
    ],
    previewTarget: null,
    order: 7,
  },
} satisfies Record<SitePageRegionId, SitePageRegion>;

export const sitePageRegionsById = REGIONS;

export const sitePageRegions: SitePageRegion[] = Object.values(REGIONS).sort(
  (left, right) => left.order - right.order,
);

export const DEFAULT_SITE_PAGE_REGION_ID = "hero" as const;

export function findSitePageRegion(
  id: string | null | undefined,
): SitePageRegion {
  return (
    sitePageRegions.find((region) => region.id === id) ??
    REGIONS[DEFAULT_SITE_PAGE_REGION_ID]
  );
}

/** Which region owns a field, for attributing a validation error to a region. */
export function regionForField(field: string): SitePageRegion | undefined {
  return sitePageRegions.find((region) =>
    (region.fields as readonly string[]).includes(field),
  );
}

function isBlank(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (typeof value === "number") return false;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

// ContentPage's own per-item filters, mirrored so this module agrees with what
// actually renders. An array-length test is NOT equivalent: ContentPage drops
// blank items first, so a single empty row — which every "Add" button creates —
// renders nothing while the array is length 1. Cited by line; if a filter in
// content-page.tsx changes, change its twin here.
const meaningfulStats = (page: EditableSitePage) =>
  // content-page.tsx:17
  page.stats.filter(
    (stat) => stat.value.trim() || stat.label.trim() || stat.description?.trim(),
  );

const meaningfulSections = (page: EditableSitePage) =>
  // content-page.tsx:18-20
  page.sections.filter(
    (section) =>
      section.title.trim() ||
      section.body.trim() ||
      section.bullets?.some((bullet) => bullet.trim()),
  );

const meaningfulCtas = (page: EditableSitePage) =>
  // content-page.tsx:21
  page.ctas.filter((cta) => cta.label.trim() && cta.href.trim());

const meaningfulRelated = (page: EditableSitePage) =>
  // content-page.tsx:22
  page.related.filter((card) => card.title.trim() && card.href.trim());

/**
 * Whether ContentPage renders the block a preview target names.
 *
 * This answers a different question from `isRegionEmpty` below, and conflating
 * the two is a bug: the hero block always renders even when every hero field is
 * blank, and CTAs have no block of their own at all. The preview canvas uses
 * THIS function to predict which children ContentPage produced, so it must
 * track the renderer exactly.
 */
export function doesTargetRender(
  target: string,
  page: EditableSitePage,
): boolean {
  switch (target) {
    // content-page.tsx:36-46 — EditorialImageHero is rendered unconditionally.
    case "hero":
      return true;
    // content-page.tsx:48
    case "stats":
      return meaningfulStats(page).length > 0;
    // content-page.tsx:50
    case "body":
      return meaningfulSections(page).length > 0;
    // content-page.tsx:80
    case "related":
      return meaningfulRelated(page).length > 0;
    default:
      return false;
  }
}

/**
 * Whether the editor has put anything meaningful in this region. Drives the
 * rail's "nothing added yet" state and nothing else — it deliberately does NOT
 * predict whether a block renders, which is `doesTargetRender`'s job.
 */
export function isRegionEmpty(
  region: SitePageRegion,
  page: EditableSitePage,
): boolean {
  switch (region.id) {
    case "ctas":
      return meaningfulCtas(page).length === 0;
    case "stats":
      return meaningfulStats(page).length === 0;
    case "body":
      return meaningfulSections(page).length === 0;
    case "related":
      return (
        meaningfulRelated(page).length === 0 &&
        isBlank(page.exploreEyebrow) &&
        isBlank(page.exploreTitle) &&
        isBlank(page.exploreDescription)
      );
    default:
      return region.fields.every((field) => isBlank(page[field]));
  }
}
```

- [ ] **Step 3: Create the family descriptors**

The workspace serves two families differing in four values only. Resolving them on the server and passing them down keeps the fact in one place, rather than re-deriving it from `usePathname` inside a client component.

Create `lib/cms/site-page-families.ts`:

```ts
export type SitePageFamilyId = "who-we-are" | "what-we-do";

export type SitePageFamily = {
  id: SitePageFamilyId;
  /** Shown in the workspace breadcrumb. */
  label: string;
  /** Save endpoint; the record's slug is appended. */
  endpointBase: string;
  /** Public URL prefix; the record's slug is appended. */
  publicBase: string;
  /** Admin index this family's records are listed on. */
  adminIndex: string;
};

const FAMILIES = {
  "who-we-are": {
    id: "who-we-are",
    label: "Who We Are",
    endpointBase: "/api/admin/who-we-are-pages",
    publicBase: "/who-we-are",
    adminIndex: "/admin/who-we-are-pages",
  },
  "what-we-do": {
    id: "what-we-do",
    label: "What We Do",
    endpointBase: "/api/admin/what-we-do-pages",
    publicBase: "/what-we-do",
    adminIndex: "/admin/what-we-do-pages",
  },
} satisfies Record<SitePageFamilyId, SitePageFamily>;

export const SITE_PAGE_FAMILIES = FAMILIES;

export function findSitePageFamily(id: string): SitePageFamily | undefined {
  return (FAMILIES as Record<string, SitePageFamily>)[id];
}
```

- [ ] **Step 4: Verify**

Run: `npm run type-check && npm run lint && npm run build`
Expected: all PASS. If `satisfies Record<SitePageRegionId, SitePageRegion>` errors, a region id is missing from `REGIONS` — that is the check earning its keep.

Confirm the registry stayed client-safe:

Run: `grep -c "admin-config" lib/cms/site-page-regions.ts lib/cms/site-page-families.ts`
Expected: `0` for both.

- [ ] **Step 5: Commit**

```bash
git add types/content.ts lib/cms/site-page-regions.ts lib/cms/site-page-families.ts components/admin/site-page-form.tsx
git commit -m "feat(cms): add the site-page region and family registries

Seven regions covering every field SitePageForm exposes, so splitting
the form loses no editing capability. Two of them render nothing and say
so: page settings changes the URL, and the other holds 22 fields
ContentPage never reads but which stay editable because other templates
use them.

The CTA region deliberately shares the hero's preview target, because
ContentPage passes CTAs to EditorialImageHero rather than rendering them
as their own block.

EditableSitePage moves from a local type in the form to types/content.ts,
since the registry and all seven regions need it."
```

---

### Task 5: Extract the shared helpers and the four list-shaped regions

These four regions each correspond to an existing panel in `site-page-form.tsx`, so this is relocation, not rewriting. Move the markup verbatim and change only how values flow in and out.

**Files:**
- Create: `components/admin/site-page/shared.ts`
- Create: `components/admin/site-page/stats-region.tsx`
- Create: `components/admin/site-page/body-sections-region.tsx`
- Create: `components/admin/site-page/ctas-region.tsx`
- Create: `components/admin/site-page/related-region.tsx`

**Interfaces:**
- Consumes: `EditableSitePage` from `@/types/content` (Task 4).
- Produces: each region component with the identical signature

```tsx
export type SitePageRegionProps = {
  value: EditableSitePage;
  onChange: (next: EditableSitePage) => void;
};
```

and `shared.ts` exporting `inputClass`, `panelClass`, `toLines`, `fromLines`, `emptyStat`, `emptySection`, `emptyCta`, `emptyRelatedCard`, `emptyCohort`, `emptyProcessStep`, plus the `SitePageRegionProps` type.

- [ ] **Step 1: Record the field baseline before touching anything**

This is the gate for the whole phase: the split must not drop a field.

```bash
mkdir -p .superpowers/sdd/2026-09-09-site-page-workspace
grep -oE 'update\("[a-zA-Z]+"' components/admin/site-page-form.tsx \
  | sed 's/update("//;s/"//' | sort -u \
  > .superpowers/sdd/2026-09-09-site-page-workspace/fields-before.txt
wc -l < .superpowers/sdd/2026-09-09-site-page-workspace/fields-before.txt
```

Expected: a count in the low thirties. Keep this file; Task 6 checks against it.

- [ ] **Step 2: Create `shared.ts`**

Move these out of `site-page-form.tsx` verbatim: the `inputClass` constant (line 51), `panelClass` (line 54), `emptyStat` (56), `emptySection` (63), `emptyCta` (69), `emptyRelatedCard` (74), `emptyCohort` (81), `emptyProcessStep` (82), `toLines` (84) and `fromLines` (88). Add the `SitePageRegionProps` type shown above. Import them back into `site-page-form.tsx` so it still compiles at the end of this step.

- [ ] **Step 3: Create the four regions**

Each follows the same shape. Using the stats region as the worked example:

```tsx
"use client";

import { Plus, Trash2 } from "lucide-react";

import type { HighlightStat } from "@/types/content";

import { emptyStat, inputClass, panelClass, type SitePageRegionProps } from "./shared";

export function StatsRegion({ value, onChange }: SitePageRegionProps) {
  // Same updater shape the form used, so the moved markup's call sites are
  // unchanged.
  const update = <Key extends keyof typeof value>(
    key: Key,
    next: (typeof value)[Key],
  ) => onChange({ ...value, [key]: next });

  const updateStat = <Key extends keyof HighlightStat>(
    index: number,
    key: Key,
    next: HighlightStat[Key],
  ) =>
    update(
      "stats",
      value.stats.map((stat, statIndex) =>
        statIndex === index ? { ...stat, [key]: next } : stat,
      ),
    );

  /* ...the markup from site-page-form.tsx's Stats panel, moved verbatim... */
}
```

Then, region by region:

| Region file | Panel to move | Extra fields to pull in |
|---|---|---|
| `stats-region.tsx` | "Stats", lines 608–686 | `highlightsEyebrow`, from the "Optional heading copy" panel |
| `body-sections-region.tsx` | "Content sections", lines 687–746 | none |
| `ctas-region.tsx` | "Hero CTAs", lines 747–798 | none |
| `related-region.tsx` | "Related route cards", lines 799–893 | `exploreEyebrow`, `exploreTitle`, `exploreDescription`, from "Optional heading copy" |

Take each panel's per-item helper with it — `updateStat`, `updateSection`, `updateCta`, `updateRelatedCard`, and the corresponding add/remove handlers. Each becomes local to its region.

Keep every field, label, order, placeholder and input type exactly as it is. This task changes where the markup lives and how values reach it, nothing about what an editor sees.

Note the panel headed "Hero CTAs" already names the truth the registry records: CTAs render inside the hero.

- [ ] **Step 4: Compose the four back into the form**

In `site-page-form.tsx`, replace those four panels with the four components, passing its own `values` and an `onChange` that writes the whole record:

```tsx
        <StatsRegion value={values} onChange={setValues} />
        <BodySectionsRegion value={values} onChange={setValues} />
        <CtasRegion value={values} onChange={setValues} />
        <RelatedRegion value={values} onChange={setValues} />
```

`setValues` is the form's existing state setter, so its save behaviour, its endpoint props and both `new` routes are untouched.

- [ ] **Step 5: Verify**

Run: `npm run type-check && npm run lint && npm run build`
Expected: all PASS.

Run: `grep -c "panelClass" components/admin/site-page/*.tsx`
Expected: each of the four regions uses it — the panels keep their existing chrome so the `new` routes look identical.

- [ ] **Step 6: Commit**

```bash
git add components/admin/site-page/ components/admin/site-page-form.tsx
git commit -m "refactor(admin): extract four site-page regions from the form

The stats, body-sections, CTA and related panels move into their own
components taking value/onChange, so a workspace can mount one at a
time while the create routes keep composing all of them.

Markup moved verbatim: no field, label, order or input type changes.
The stats region takes highlightsEyebrow and the related region takes
the three explore fields from the optional-copy panel, because those are
the headings those blocks render."
```

---

### Task 6: Split the hero panel three ways and rebuild the form

The first panel mixes three regions' worth of fields, so this is the one split that needs care rather than relocation.

**Files:**
- Create: `components/admin/site-page/hero-region.tsx`
- Create: `components/admin/site-page/settings-region.tsx`
- Create: `components/admin/site-page/other-fields-region.tsx`
- Modify: `components/admin/site-page-form.tsx` (becomes the composition)

**Interfaces:**
- Consumes: `SitePageRegionProps`, the helpers from `shared.ts` (Task 5), the registry (Task 4).
- Produces: `HeroRegion`, `SettingsRegion`, `OtherFieldsRegion`, all with `SitePageRegionProps`.

- [ ] **Step 1: Split the first panel**

Panel 1 (lines 247–392, headed "Hero and overview copy") holds ten fields that belong to three different regions. Divide them exactly like this:

| Field | Goes to |
|---|---|
| `eyebrow`, `title`, `description`, `intro`, `heroImage` | `hero-region.tsx` |
| `slug`, `status`, `order` | `settings-region.tsx` |
| `heroVideoUrl`, `heroVideoThumbnail` | `other-fields-region.tsx` |

`settings-region.tsx` must keep the form's existing `showSlugField` and `showPublishingFields` behaviour available, since the create routes pass those flags. Give it two optional props defaulting to `true`:

```tsx
export function SettingsRegion({
  value,
  onChange,
  showSlugField = true,
  showPublishingFields = true,
}: SitePageRegionProps & {
  showSlugField?: boolean;
  showPublishingFields?: boolean;
}) {
```

- [ ] **Step 2: Build the not-shown region**

`other-fields-region.tsx` collects 22 fields from three places: `heroVideoUrl` and `heroVideoThumbnail` from panel 1; the fifteen `overview*`, `operating*`, `principles*`, `process*` and `nextStep*` fields from the "Optional heading copy" panel (lines 416–607, everything except `highlightsEyebrow` and the three `explore*` fields, which Task 5 already took); and `cohorts` and `process` from the "Cohorts" and "Process steps" panels (lines 393–415).

Group them under subheadings inside the region — hero video, overview copy, operating copy, principles copy, process copy, next-step copy, and the two training blocks. Twenty-two fields in one flat pane would recreate, at smaller scale, the problem this workspace exists to solve.

Open the region with an explanatory note, because an editor landing here deserves to know why these fields do nothing:

```tsx
      <p className="rounded-media border border-brand-border bg-brand-alt p-4 text-sm leading-6 text-slate-600">
        This page template does not display these fields. They are kept
        editable because other page templates read them, so anything you enter
        here is saved but will not appear on this page.
      </p>
```

- [ ] **Step 3: Rebuild the form as a composition**

`site-page-form.tsx` keeps its props, its state, its `submit`, its notice and its save button, and its body becomes the seven regions in registry order:

```tsx
      <HeroRegion value={values} onChange={setValues} />
      <CtasRegion value={values} onChange={setValues} />
      <StatsRegion value={values} onChange={setValues} />
      <BodySectionsRegion value={values} onChange={setValues} />
      <RelatedRegion value={values} onChange={setValues} />
      <SettingsRegion
        value={values}
        onChange={setValues}
        showSlugField={showSlugField}
        showPublishingFields={showPublishingFields}
      />
      <OtherFieldsRegion value={values} onChange={setValues} />
```

Every per-field and per-item helper should now live in a region, so the form's own `update`, `updateStat`, `updateSection`, `updateCta`, `updateRelatedCard`, `updateCohort` and `updateProcessStep` become unused — delete them. Lint will confirm.

- [ ] **Step 4: Run the field-coverage gate**

This is the check that the split lost nothing.

```bash
node -e '
const fs = require("fs");
const before = fs
  .readFileSync(".superpowers/sdd/2026-09-09-site-page-workspace/fields-before.txt", "utf8")
  .trim().split("\n").filter(Boolean);
const registry = fs.readFileSync("lib/cms/site-page-regions.ts", "utf8");
const unassigned = before.filter((f) => !new RegExp("\"" + f + "\"").test(registry));
console.log(unassigned.length ? "UNASSIGNED: " + unassigned.join(", ") : "every field assigned to a region");
process.exit(unassigned.length ? 1 : 0);
'
```

Expected: `every field assigned to a region`, exit 0. A name listed here is a field the old form edited and the registry forgot, which means the workspace would silently lose the ability to edit it.

Then confirm the regions collectively still render every field:

```bash
for f in $(cat .superpowers/sdd/2026-09-09-site-page-workspace/fields-before.txt); do
  grep -qE "\"$f\"|value\.$f" components/admin/site-page/*.tsx || echo "NOT RENDERED: $f"
done
echo "field render check done"
```

Expected: no `NOT RENDERED` lines.

- [ ] **Step 5: Verify**

Run: `npm run type-check && npm run lint && npm run build && npm run verify:cms`
Expected: all PASS, with no unused-variable warnings in `site-page-form.tsx`.

Run: `wc -l components/admin/site-page-form.tsx`
Expected: well under 200 lines, down from 893. If it is still large, markup was copied rather than moved.

- [ ] **Step 6: Commit**

```bash
git add components/admin/site-page/ components/admin/site-page-form.tsx
git commit -m "refactor(admin): finish splitting the site-page form into regions

The first panel mixed hero copy, publishing settings and two hero-video
fields, so it divides three ways; the optional-copy panel divides four.
The form is now a composition of seven regions and keeps its props,
state and save behaviour, so both create routes are unchanged.

A field-coverage gate checks every field the old form edited against the
region registry, because a silently dropped field would remove editing
capability with nothing to notice it."
```

---

# Phase 3 — The workspace, the preview, and the routes

Only this phase needs a real record, because the family getters return `[]` without Firestore.

### Task 7: Record provider

The only stateful module. It differs from the homepage's provider in three ways: it holds one whole record rather than a draft map, it saves whole-record, and it attributes validation errors to regions.

**Files:**
- Create: `components/admin/site-page-workspace/record-provider.tsx`

**Interfaces:**
- Consumes: the registries (Task 4), `dynamicSitePageSchema` from `@/lib/utils/validators`, `EditableSitePage` from `@/types/content`.
- Produces: `SitePageWorkspaceProvider` (props `family`, `publishedRecord`, `initialRegionId`, `children`), `useSitePageWorkspace()`, and the type `SaveState`.

- [ ] **Step 1: Create the provider**

```tsx
"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { SitePageFamily } from "@/lib/cms/site-page-families";
import {
  findSitePageRegion,
  regionForField,
  sitePageRegions,
  type SitePageRegion,
  type SitePageRegionId,
} from "@/lib/cms/site-page-regions";
import { dynamicSitePageSchema } from "@/lib/utils/validators";
import type { EditableSitePage } from "@/types/content";

export type SaveState =
  | { status: "idle" }
  | { status: "saving" }
  | { status: "saved"; message: string }
  | { status: "error"; message: string };

type RegionErrors = Partial<Record<SitePageRegionId, string[]>>;

type SitePageWorkspaceValue = {
  family: SitePageFamily;
  /** The record as the server last returned it. */
  published: EditableSitePage;
  /** The record being edited. */
  draft: EditableSitePage;
  activeRegion: SitePageRegion;
  /** Increments on every edit; keys the preview's boundaries. */
  payloadVersion: number;
  isDirty: boolean;
  dirtyRegions: ReadonlySet<SitePageRegionId>;
  /** Validation messages, attributed to the region owning the field. */
  regionErrors: RegionErrors;
  /** Messages that belong to no single region. */
  formErrors: string[];
  canSave: boolean;
  saveState: SaveState;
  setDraft: (next: EditableSitePage) => void;
  selectRegion: (id: string) => void;
  save: () => Promise<void>;
};

const WorkspaceContext = createContext<SitePageWorkspaceValue | null>(null);

export function useSitePageWorkspace(): SitePageWorkspaceValue {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error(
      "useSitePageWorkspace must be used inside SitePageWorkspaceProvider",
    );
  }
  return context;
}

/** Structural comparison; these values are plain JSON by the time they arrive. */
function sameValue(left: unknown, right: unknown): boolean {
  return JSON.stringify(left ?? null) === JSON.stringify(right ?? null);
}

/**
 * Splits zod's `fieldErrors` into per-region buckets. A field no region owns
 * cannot be attributed, so its messages go to the page level rather than being
 * silently dropped. Shared by the client validation pass and the server's
 * rejection path, which need identical behaviour.
 */
function groupFieldErrorsByRegion(
  fieldErrors: Record<string, string[] | undefined>,
): { regions: RegionErrors; form: string[] } {
  const regions: RegionErrors = {};
  const form: string[] = [];

  for (const [field, messages] of Object.entries(fieldErrors)) {
    if (!messages?.length) {
      continue;
    }
    const region = regionForField(field);
    if (!region) {
      form.push(...messages);
      continue;
    }
    regions[region.id] = [...(regions[region.id] ?? []), ...messages];
  }
  return { regions, form };
}

export function SitePageWorkspaceProvider({
  family,
  publishedRecord,
  initialRegionId,
  children,
}: {
  family: SitePageFamily;
  publishedRecord: EditableSitePage;
  initialRegionId: string | null;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [published, setPublished] = useState(publishedRecord);
  const [draft, setDraft] = useState(publishedRecord);
  const [activeId, setActiveId] = useState(
    () => findSitePageRegion(initialRegionId).id,
  );
  const [payloadVersion, setPayloadVersion] = useState(0);
  const [saveState, setSaveState] = useState<SaveState>({ status: "idle" });
  // Errors the server rejected the last save with. Cleared on the next edit,
  // because they describe a payload that no longer exists.
  const [serverErrors, setServerErrors] = useState<{
    regions: RegionErrors;
    form: string[];
  }>({ regions: {}, form: [] });

  const saving = useRef(false);

  // A save calls router.refresh(), which hands this component a new published
  // record. Replace the baseline only — never the draft, or a refresh would
  // discard whatever the editor has typed since.
  useEffect(() => {
    setPublished(publishedRecord);
  }, [publishedRecord]);

  // Tracks the draft as it is RIGHT NOW, so a save that has already sent its
  // payload can tell whether the editor has typed since.
  const draftRef = useRef(draft);
  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);

  const applyDraft = useCallback((next: EditableSitePage) => {
    setDraft(next);
    setPayloadVersion((version) => version + 1);
    // Leave saveState and serverErrors alone while a request is outstanding.
    // Resetting them here would snap the UI back to "idle" mid-save, and the
    // in-flight response would then land on top of state it does not describe.
    if (!saving.current) {
      setSaveState({ status: "idle" });
      setServerErrors({ regions: {}, form: [] });
    }
  }, []);

  // Client-side validation with the SAME schema the endpoint uses, which is
  // possible because lib/utils/validators.ts imports only zod. This is for
  // attribution and immediacy; the server still validates and is still
  // authoritative.
  const clientErrors = useMemo(() => {
    const parsed = dynamicSitePageSchema.safeParse(draft);
    if (parsed.success) {
      return { regions: {} as RegionErrors, form: [] as string[] };
    }
    const flat = parsed.error.flatten();
    const grouped = groupFieldErrorsByRegion(flat.fieldErrors);
    return {
      regions: grouped.regions,
      form: [...flat.formErrors, ...grouped.form],
    };
  }, [draft]);

  const regionErrors = useMemo<RegionErrors>(() => {
    const merged: RegionErrors = { ...clientErrors.regions };
    for (const [id, messages] of Object.entries(serverErrors.regions)) {
      const key = id as SitePageRegionId;
      merged[key] = [...(merged[key] ?? []), ...(messages ?? [])];
    }
    return merged;
  }, [clientErrors.regions, serverErrors.regions]);

  const formErrors = useMemo(
    () => [...clientErrors.form, ...serverErrors.form],
    [clientErrors.form, serverErrors.form],
  );

  const dirtyRegions = useMemo(() => {
    const dirty = new Set<SitePageRegionId>();
    for (const region of sitePageRegions) {
      const changed = region.fields.some(
        (field) => !sameValue(draft[field], published[field]),
      );
      if (changed) {
        dirty.add(region.id);
      }
    }
    return dirty;
  }, [draft, published]);

  const isDirty = dirtyRegions.size > 0;
  const canSave =
    isDirty && Object.keys(clientErrors.regions).length === 0 && clientErrors.form.length === 0;

  const selectRegion = useCallback((id: string) => {
    const region = findSitePageRegion(id);
    setActiveId(region.id);
    // Shallow by design: window.history is native to the App Router since
    // 14.1 and does not re-render the server component, so switching regions
    // never re-reads the record.
    const url = new URL(window.location.href);
    url.searchParams.set("region", region.id);
    window.history.replaceState(null, "", url);
  }, []);

  const save = useCallback(async () => {
    if (!canSave) {
      return;
    }
    if (saving.current) {
      // Say so rather than no-op'ing: canSave is true, so the editor has every
      // reason to expect the click to do something.
      setSaveState({
        status: "error",
        message: "Still saving your previous change — try again in a moment.",
      });
      return;
    }
    // The exact payload this request sends. Compared against draftRef on
    // completion to tell whether the editor has typed since.
    const sent = draft;
    saving.current = true;
    setSaveState({ status: "saving" });

    try {
      // The record's ADDRESS is its published slug, not its draft slug. A
      // rename has to PUT to where the record currently lives; posting to the
      // new slug would 404 because nothing is there yet.
      const response = await fetch(
        `${family.endpointBase}/${encodeURIComponent(published.slug)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sent),
        },
      );
      const payload = (await response.json().catch(() => null)) as
        | {
            success?: boolean;
            message?: string;
            errors?: { formErrors?: string[]; fieldErrors?: Record<string, string[]> };
          }
        | null;

      if (!response.ok || !payload?.success) {
        // Only attribute these if the draft has not moved on. Errors describing
        // a payload the editor has already edited past are phantoms, and worse
        // than none — they point at fields that may now be valid.
        if (draftRef.current === sent) {
          const grouped = groupFieldErrorsByRegion(
            payload?.errors?.fieldErrors ?? {},
          );
          setServerErrors({
            regions: grouped.regions,
            form: [...(payload?.errors?.formErrors ?? []), ...grouped.form],
          });
        }
        throw new Error(payload?.message || "We couldn't save this page.");
      }

      // The server now holds `sent`, so that is the baseline regardless of what
      // the editor has typed since.
      setPublished(sent);
      setSaveState(
        draftRef.current === sent
          ? { status: "saved", message: payload.message || "Page updated." }
          : {
              status: "saved",
              message:
                "Saved. You have changed the page since — save again to publish those edits.",
            },
      );
      router.refresh();
    } catch (error) {
      setSaveState({
        status: "error",
        message: error instanceof Error ? error.message : "Save failed.",
      });
    } finally {
      saving.current = false;
    }
  }, [canSave, draft, family.endpointBase, published.slug, router]);

  useEffect(() => {
    if (!isDirty) {
      return;
    }
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (!isDirty) {
      return;
    }
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement) || anchor.target === "_blank") {
        return;
      }
      // A modified or non-primary click opens a new tab and leaves this tab's
      // draft intact, so there is nothing to warn about.
      if (
        event.button !== 0 ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const href = anchor.getAttribute("href") ?? "";
      if (!href.startsWith("/")) {
        return;
      }
      // Navigation within this record's own workspace is not leaving it.
      const here = window.location.pathname;
      if (href === here || href.startsWith(`${here}?`) || href.startsWith(`${here}#`)) {
        return;
      }
      if (
        !window.confirm("You have unsaved changes to this page. Leave and discard them?")
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [isDirty]);

  const value = useMemo<SitePageWorkspaceValue>(
    () => ({
      family,
      published,
      draft,
      activeRegion: findSitePageRegion(activeId),
      payloadVersion,
      isDirty,
      dirtyRegions,
      regionErrors,
      formErrors,
      canSave,
      saveState,
      setDraft: applyDraft,
      selectRegion,
      save,
    }),
    [
      family,
      published,
      draft,
      activeId,
      payloadVersion,
      isDirty,
      dirtyRegions,
      regionErrors,
      formErrors,
      canSave,
      saveState,
      applyDraft,
      selectRegion,
      save,
    ],
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run type-check && npm run lint`
Expected: both PASS. The provider is not rendered yet, so `build` will tree-shake it.

- [ ] **Step 3: Commit**

```bash
git add components/admin/site-page-workspace/record-provider.tsx
git commit -m "feat(cms): add the site-page workspace record store

Holds one whole record rather than a draft map, because the endpoint
validates the whole object and requires eyebrow and title — so a save
carrying one region's fields would fail on another's.

Validates with the same zod schema the endpoint uses, which is possible
because validators.ts imports only zod, and attributes each field error
to the region that owns the field. Errors no region owns surface at page
level rather than being dropped.

Saves to the PUBLISHED slug: a rename must PUT to where the record
currently lives, because nothing exists at the new slug yet."
```

---

### Task 8: Region rail, workspace bar, region editor

**Files:**
- Create: `components/admin/site-page-workspace/region-rail.tsx`
- Create: `components/admin/site-page-workspace/workspace-bar.tsx`
- Create: `components/admin/site-page-workspace/region-editor.tsx`

**Interfaces:**
- Consumes: `useSitePageWorkspace()` (Task 7), the region registry (Task 4), the seven region components (Tasks 5–6).
- Produces: `RegionRail`, `SitePageWorkspaceBar`, `RegionEditor` — all zero-prop, reading context.

- [ ] **Step 1: Create the rail**

The homepage's `components/admin/homepage-workspace/section-rail.tsx` is the pattern to follow for structure, spacing and focus treatment — read it first. Four differences, all deliberate:

1. It reads `useSitePageWorkspace()` and iterates `sitePageRegions`.
2. It has **five** states per entry, not three. In precedence order: **error** (the region has messages in `regionErrors`), **unsaved** (`dirtyRegions.has(region.id)`), **not shown** (`region.previewTarget === null`), **empty** (`isRegionEmpty(region, draft)`), **saved**. Error outranks unsaved, because a region you cannot save matters more than one you have not saved.
3. Icons: `AlertCircle` in `text-rose-600` for error, an accent dot for unsaved, `EyeOff` in `text-slate-300` for not-shown, `Minus` in `text-slate-300` for empty, `Check` in `text-emerald-600` for saved.
4. Each entry's status line reads "Needs attention" / "Unsaved changes" / "Not shown on this page" / "Nothing added yet" / "Saved".

Keep the homepage rail's `aria-current`, its `focus-visible:ring-2 focus-visible:ring-brand-accent`, and its pairing of every icon with a text label so no state is conveyed by colour alone. Keep `h-full min-h-0 overflow-y-auto` on the root — that is what gives it a bounded box to scroll against.

Include the status legend at the foot, listing all five states.

- [ ] **Step 2: Create the bar**

Follow `components/admin/homepage-workspace/workspace-bar.tsx`, with these differences:

- The breadcrumb reads `family.label` → the record's `published.title || published.slug` → `activeRegion.label`.
- The heading is the record's title, not a fixed string.
- "Open public page" links to `${family.publicBase}/${published.slug}` in a new tab.
- The save button is a single "Save page", `disabled={!canSave || saving}`. When `isDirty` is true but `canSave` is false, show a rose count beside it: `{errorRegionCount} region(s) need attention`. Deriving the count from `regionErrors` keeps the bar honest about *why* saving is blocked, which a disabled button alone does not communicate.
- Render `formErrors` here, not in the editor — they belong to no region, and putting them in a region's pane would be a lie about where the problem is.

- [ ] **Step 3: Create the region editor**

An exhaustive switch over `activeRegion.id`, so adding a region to the registry without an editor fails the build:

```tsx
function ActiveRegion() {
  const { activeRegion, draft, setDraft } = useSitePageWorkspace();
  const props = { value: draft, onChange: setDraft };

  switch (activeRegion.id) {
    case "hero":
      return <HeroRegion {...props} />;
    case "ctas":
      return <CtasRegion {...props} />;
    case "stats":
      return <StatsRegion {...props} />;
    case "body":
      return <BodySectionsRegion {...props} />;
    case "related":
      return <RelatedRegion {...props} />;
    case "settings":
      return <SettingsRegion {...props} />;
    case "other":
      return <OtherFieldsRegion {...props} />;
  }
}
```

No `default` branch. Above it render the region's label and description, and below it the region's own `regionErrors` entries in a rose card. Root gets `h-full min-h-0 overflow-y-auto` and `bg-brand-alt`.

- [ ] **Step 4: Verify**

Run: `npm run type-check && npm run lint`
Expected: both PASS. If the switch errors on exhaustiveness, a region id has no editor.

- [ ] **Step 5: Commit**

```bash
git add components/admin/site-page-workspace/
git commit -m "feat(cms): add the site-page rail, bar and region editor

The rail carries five states rather than the homepage's three, because a
region can also hold a validation error or render nothing at all. Error
outranks unsaved: a region you cannot save matters more than one you
have not saved yet.

The bar names how many regions need attention, since a disabled save
button says that something is wrong but not where. Page-level errors
render there rather than in a region's pane, because attributing them to
a region would be a lie."
```

---

### Task 9: Preview route and canvas

**Files:**
- Create: `components/admin/site-page-workspace/preview-canvas.tsx`
- Create: `app/(admin-preview)/admin/site-pages/[family]/[slug]/preview/page.tsx`

**Interfaces:**
- Consumes: the protocol and boundary from the kit (Task 1), the registries (Task 4).
- Produces: `SitePagePreviewCanvas` (prop `baseline: EditableSitePage`), and the route `/admin/site-pages/[family]/[slug]/preview`.

- [ ] **Step 1: Understand the outlining constraint before writing code**

Unlike the homepage canvas, which rendered fifteen separate components and could wrap each one, `ContentPage` renders its blocks **internally** and must not be modified. So the canvas cannot wrap them.

It pairs them positionally instead. `ContentPage` returns a single root `div` whose element children are, in order and each conditional except the first:

| Order | Block | Renders when |
|---|---|---|
| 1 | `EditorialImageHero` | always |
| 2 | `StatsSection` | any stat has a value, label or description |
| 3 | the sections container | any section has a title, body or bullet |
| 4 | the related block | any related card has a title and href |

Those conditions are exactly what `isRegionEmpty` mirrors, so the canvas can compute the expected list of rendered targets — `hero`, then `stats`, `body`, `related` for each non-empty region — and pair it against the root's element children by index.

**The pairing must fail visibly, never silently.** If the number of element children does not equal the number of expected targets, `ContentPage`'s structure has changed and any pairing would put outlines on the wrong blocks. In that case the canvas renders no outlines at all and shows a small notice saying outlining is unavailable. The preview itself still renders correctly, because outlining is an enhancement and the rendered page is the substance.

- [ ] **Step 2: Create the canvas**

```tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ContentPage } from "@/components/shared/content-page";
import { PreviewSectionBoundary } from "@/components/admin/workspace-kit/section-boundary";
import {
  isTrustedPreviewEvent,
  PREVIEW_DRAFT,
  PREVIEW_READY,
  PREVIEW_SCROLL,
  PREVIEW_SELECT,
  type ParentToCanvasMessage,
} from "@/components/admin/workspace-kit/preview-protocol";
import {
  doesTargetRender,
  sitePageRegions,
  sitePageRegionsById,
} from "@/lib/cms/site-page-regions";
import type { EditableSitePage } from "@/types/content";

/** Distinct preview targets, in the order ContentPage renders them. */
const TARGET_ORDER = ["hero", "stats", "body", "related"] as const;

type Overlay = { target: string; label: string; top: number; height: number };

export function SitePagePreviewCanvas({
  baseline,
}: {
  baseline: EditableSitePage;
}) {
  const [record, setRecord] = useState(baseline);
  const [activeRegionId, setActiveRegionId] = useState<string>("hero");
  const [payloadVersion, setPayloadVersion] = useState(0);
  const [overlays, setOverlays] = useState<Overlay[]>([]);
  const [pairingFailed, setPairingFailed] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!isTrustedPreviewEvent(event) || event.source !== window.parent) {
        return;
      }
      const message = event.data as ParentToCanvasMessage<EditableSitePage> | null;
      if (!message || typeof message !== "object") {
        return;
      }
      if (message.type === PREVIEW_DRAFT) {
        setRecord(message.data);
        setActiveRegionId(message.activeSectionId);
        setPayloadVersion(message.payloadVersion);
        return;
      }
      if (message.type === PREVIEW_SCROLL) {
        const node = rootRef.current?.querySelector<HTMLElement>(
          `[data-preview-target="${message.sectionId}"]`,
        );
        node?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    window.addEventListener("message", handleMessage);
    window.parent.postMessage({ type: PREVIEW_READY }, window.location.origin);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const onSelect = useCallback(
    (target: string) => {
      // The parent addresses regions, not targets, and hero and CTAs share the
      // hero target. If the active region already owns the clicked target,
      // keep it — clicking the hero should not yank the editor from the CTA
      // fields to the hero fields. Otherwise take the first region owning it.
      const active = sitePageRegionsById[
        activeRegionId as keyof typeof sitePageRegionsById
      ];
      const regionId =
        active?.previewTarget === target
          ? active.id
          : (sitePageRegions.find((candidate) => candidate.previewTarget === target)
              ?.id ?? "hero");

      window.parent.postMessage(
        { type: PREVIEW_SELECT, sectionId: regionId },
        window.location.origin,
      );
    },
    [activeRegionId],
  );

  // Pair ContentPage's element children against the targets we expect it to
  // have rendered. See Step 1: a mismatch means its structure changed, and
  // mispaired outlines would be worse than none.
  useEffect(() => {
    const root = rootRef.current?.firstElementChild;
    if (!root) {
      return;
    }
    // doesTargetRender, not isRegionEmpty: the two answer different questions,
    // and only this one tracks what ContentPage actually produced.
    const expected = TARGET_ORDER.filter((target) =>
      doesTargetRender(target, record),
    );
    const children = Array.from(root.children) as HTMLElement[];

    if (children.length !== expected.length) {
      setPairingFailed(true);
      setOverlays([]);
      return;
    }
    setPairingFailed(false);
    setOverlays(
      expected.map((target, index) => {
        const node = children[index];
        node.setAttribute("data-preview-target", target);
        const region = sitePageRegions.find(
          (candidate) => candidate.previewTarget === target,
        );
        return {
          target,
          label: region?.label ?? target,
          top: node.offsetTop,
          height: node.offsetHeight,
        };
      }),
    );
  }, [record, payloadVersion]);

  return (
    <div ref={rootRef} className="relative bg-white">
      <PreviewSectionBoundary label="Page" resetKey={payloadVersion}>
        <ContentPage page={record} />
      </PreviewSectionBoundary>

      {pairingFailed ? (
        <p className="sticky bottom-0 border-t border-brand-border bg-brand-alt px-4 py-2 text-xs text-slate-600">
          Section outlines are unavailable for this page. Editing and the
          preview still work; use the rail to change region.
        </p>
      ) : (
        overlays.map((overlay) => (
          <button
            key={overlay.target}
            type="button"
            onClick={() => onSelect(overlay.target)}
            style={{ top: overlay.top, height: overlay.height }}
            className={`absolute left-0 z-20 w-full border-2 transition focus:outline-none focus-visible:border-brand-accent ${
              sitePageRegionsById[activeRegionId as keyof typeof sitePageRegionsById]
                ?.previewTarget === overlay.target
                ? "border-brand-accent bg-brand-accent/[0.04]"
                : "border-transparent hover:border-brand-primary"
            }`}
          >
            <span className="sr-only">Edit {overlay.label}</span>
          </button>
        ))
      )}
    </div>
  );
}
```

One boundary wraps the whole page rather than one per block, because the blocks are inside `ContentPage` and cannot be wrapped individually. That is a real reduction in isolation compared with the homepage: a throw takes the whole preview to the placeholder, not one section. It still recovers on the next payload, which is what matters for half-typed values.

- [ ] **Step 3: Create the preview route**

Create `app/(admin-preview)/admin/site-pages/[family]/[slug]/preview/page.tsx`:

```tsx
import { notFound } from "next/navigation";

import { SitePagePreviewCanvas } from "@/components/admin/site-page-workspace/preview-canvas";
import { findSitePageFamily } from "@/lib/cms/site-page-families";
import {
  getCmsWhatWeDoDynamicPageBySlug,
  getCmsWhoWeAreDynamicPageBySlug,
} from "@/lib/cms/site-pages";
import type { EditableSitePage } from "@/types/content";

type PreviewPageProps = { params: { family: string; slug: string } };

export default async function SitePagePreviewPage({ params }: PreviewPageProps) {
  const family = findSitePageFamily(params.family);

  if (!family) {
    notFound();
  }

  const record =
    family.id === "who-we-are"
      ? await getCmsWhoWeAreDynamicPageBySlug(params.slug, true)
      : await getCmsWhatWeDoDynamicPageBySlug(params.slug, true);

  if (!record) {
    notFound();
  }

  // Firestore can return records whose prototypes are not plain objects, which
  // cannot cross the Server-to-Client boundary. Annotated before serialising so
  // the compiler checks the shape; JSON.stringify accepts `any`, so casting the
  // parse result instead would check nothing.
  const source: EditableSitePage = record;
  const baseline = JSON.parse(JSON.stringify(source)) as EditableSitePage;

  return <SitePagePreviewCanvas baseline={baseline} />;
}
```

The `(admin-preview)` group's bare layout already applies `requireAdminPage()`, and `middleware.ts` matches `/admin/:path*`, so this route is protected twice over without further work.

- [ ] **Step 4: Verify**

Run: `npm run type-check && npm run lint && npm run build`
Expected: all PASS, and the build's route list includes `/admin/site-pages/[family]/[slug]/preview`.

- [ ] **Step 5: Commit**

```bash
git add components/admin/site-page-workspace/preview-canvas.tsx "app/(admin-preview)/admin/site-pages"
git commit -m "feat(cms): add the site-page preview document

ContentPage renders its blocks internally and must not be modified, so
the canvas cannot wrap them. It pairs its element children positionally
against the targets it expects to have rendered, using the same
emptiness rules ContentPage filters by, and positions outlines over them.

A count mismatch means ContentPage's structure changed, so outlining is
disabled with a visible notice rather than pairing outlines to the wrong
blocks. The preview still renders; outlining is the enhancement."
```

---

### Task 10: Convert the two edit routes

**Files:**
- Modify: `components/admin/admin-shell.tsx` (bleed selection becomes a predicate)
- Modify: `app/(admin)/admin/who-we-are-pages/[slug]/page.tsx` (full rewrite)
- Modify: `app/(admin)/admin/what-we-do-pages/[slug]/page.tsx` (full rewrite)

**Interfaces:**
- Consumes: everything from Tasks 4, 7, 8, 9.
- Produces: `isBleedAdminRoute(pathname)` exported from `admin-shell.tsx`.

- [ ] **Step 1: Make the bleed selection a predicate**

`BLEED_ADMIN_ROUTES.includes(pathname)` is an exact match, which cannot express these routes' dynamic `[slug]` segment. Replace the constant and its use with:

```tsx
/**
 * Admin routes that manage their own full-height layout and must not receive
 * the shell's page padding. A predicate rather than a list, because the
 * site-page workspaces carry a dynamic slug segment.
 */
export function isBleedAdminRoute(pathname: string): boolean {
  if (pathname === "/admin/content/homepage") {
    return true;
  }
  // `(?!new$)` is load-bearing: without it this matches the create routes,
  // which are ordinary scrolling forms and would render flush against the
  // sidebar with no full-height layout to justify it.
  return /^\/admin\/(who-we-are|what-we-do)-pages\/(?!new$)[^/]+$/.test(pathname);
}
```

Then `const isBleed = isBleedAdminRoute(pathname);`.

Verify the predicate before moving on — this was wrong in an earlier draft of
the plan:

```bash
node -e '
const re = /^\/admin\/(who-we-are|what-we-do)-pages\/(?!new$)[^/]+$/;
const cases = [
  ["/admin/who-we-are-pages", false],
  ["/admin/who-we-are-pages/our-story", true],
  ["/admin/who-we-are-pages/new", false],
  ["/admin/what-we-do-pages/new", false],
  ["/admin/what-we-do-pages/girls-in-tech", true],
  ["/admin/who-we-are-pages/a/b", false],
];
let bad = 0;
for (const [path, want] of cases) {
  const got = re.test(path);
  if (got !== want) { bad++; console.log("WRONG", path, "got", got, "want", want); }
}
console.log(bad ? bad + " wrong" : "all six cases correct");
process.exit(bad ? 1 : 0);
'
```

Expected: `all six cases correct`.

- [ ] **Step 2: Create the preview pane adapter**

Create it before the routes that import it, or Step 3 will not compile.

`components/admin/site-page-workspace/preview-pane-adapter.tsx`:

```tsx
import { notFound } from "next/navigation";

import { SitePageWorkspaceBar } from "@/components/admin/site-page-workspace/workspace-bar";
import { RegionEditor } from "@/components/admin/site-page-workspace/region-editor";
import { RegionRail } from "@/components/admin/site-page-workspace/region-rail";
import { SitePageWorkspaceProvider } from "@/components/admin/site-page-workspace/record-provider";
import { SitePagePreviewPane } from "@/components/admin/site-page-workspace/preview-pane-adapter";
import { WorkspaceShell } from "@/components/admin/workspace-kit/workspace-shell";
import { SITE_PAGE_FAMILIES } from "@/lib/cms/site-page-families";
import { getCmsWhoWeAreDynamicPageBySlug } from "@/lib/cms/site-pages";
import type { EditableSitePage } from "@/types/content";

type PageProps = {
  params: { slug: string };
  searchParams: { region?: string };
};

export default async function AdminEditWhoWeAreDynamicPage({
  params,
  searchParams,
}: PageProps) {
  const record = await getCmsWhoWeAreDynamicPageBySlug(params.slug, true);

  if (!record) {
    notFound();
  }

  const source: EditableSitePage = record;
  const publishedRecord = JSON.parse(JSON.stringify(source)) as EditableSitePage;

  return (
    <SitePageWorkspaceProvider
      family={SITE_PAGE_FAMILIES["who-we-are"]}
      publishedRecord={publishedRecord}
      initialRegionId={searchParams.region ?? null}
    >
      <WorkspaceShell
        bar={<SitePageWorkspaceBar />}
        rail={<RegionRail />}
        editor={<RegionEditor />}
        preview={<SitePagePreviewPane />}
      />
    </SitePageWorkspaceProvider>
  );
}
```

```tsx
"use client";

import { PreviewFrame } from "@/components/admin/workspace-kit/preview-frame";

import { useSitePageWorkspace } from "./record-provider";

export function SitePagePreviewPane() {
  const { family, published, draft, activeRegion, payloadVersion, selectRegion } =
    useSitePageWorkspace();

  return (
    <PreviewFrame
      previewRoute={`/admin/site-pages/${family.id}/${encodeURIComponent(published.slug)}/preview`}
      payloadVersion={payloadVersion}
      data={draft}
      activeSectionId={activeRegion.id}
      // Page settings and the not-shown region render nothing, so there is
      // nowhere to scroll. This is what PreviewFrame's nullable prop is for.
      scrollTargetId={activeRegion.previewTarget}
      onSelectSection={selectRegion}
      footerLabel={`${family.label} · ${published.title || published.slug} · ${activeRegion.label}`}
      subject={`${family.label}: ${published.title || published.slug}`}
    />
  );
}
```

The preview route uses `published.slug`, matching the save path: the iframe must load the record from where it currently lives, not from a slug the editor is midway through typing.

- [ ] **Step 3: Rewrite the Who We Are edit route**

- [ ] **Step 4: Rewrite the What We Do edit route**

Identical to Step 2 with three substitutions: `getCmsWhatWeDoDynamicPageBySlug`, `SITE_PAGE_FAMILIES["what-we-do"]`, and the component name `AdminEditWhatWeDoDynamicPage`.

- [ ] **Step 5: Verify**

Run: `npm run type-check && npm run lint && npm run build && npm run verify:cms`
Expected: all PASS. `verify:cms` checks 118 hardcoded admin links against 45 routes, so a broken route path shows up here.

Run: `grep -rn "SitePageForm" app/ | grep -v node_modules`
Expected: only the two `new` routes. The `[slug]` routes no longer use it, and the create flow still does.

- [ ] **Step 6: Commit**

```bash
git add components/admin/admin-shell.tsx components/admin/site-page-workspace/preview-pane-adapter.tsx "app/(admin)/admin/who-we-are-pages/[slug]/page.tsx" "app/(admin)/admin/what-we-do-pages/[slug]/page.tsx"
git commit -m "feat(cms): put the site-page workspace on both edit routes

The shell's bleed selection becomes a predicate, because these routes
carry a dynamic slug segment an exact-match list cannot express. The
regex is anchored so the family index pages keep their normal padding.

Both the save and the preview address the record by its published slug,
not the draft's: a rename has to reach where the record currently lives."
```

---

### Task 11: Generalise the screenshot script and sweep

**Files:**
- Modify: `scripts/shoot-homepage-workspace.mjs` → renamed `scripts/shoot-workspace.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: a running dev server, an admin session cookie, and a real record.
- Produces: the `shoot:workspace` npm script.

- [ ] **Step 1: Generalise the script**

`git mv scripts/shoot-homepage-workspace.mjs scripts/shoot-workspace.mjs`, then take the route and an output name from argv instead of hard-coding the homepage:

```js
const route = process.argv[2] ?? "/admin/content/homepage";
const name = process.argv[3] ?? "homepage";
const outDir = process.argv[4] ?? ".superdesign/tmp";
```

Use `route` in the `page.goto` call and `name` in the screenshot filenames. Keep everything else exactly as it is — the guarded playwright import, the `ITFY_ADMIN_SESSION` handling, the three viewport assertions, the `try/finally` that closes the browser, and the frame lookup.

Two selector changes, because the frame is now shared:

- The frame lookup currently matches `/homepage/preview`. Both preview routes
  end in `/preview`, so match `"/preview"` instead.
- The iframe wait currently uses `iframe[title="Homepage preview"]`. That title
  is now a per-workspace prop, so it no longer identifies the frame. Select
  `iframe[data-preview-frame]` instead — an attribute that is constant across
  workspaces precisely so automation has something stable to key off.

Keep the existing check that a missing frame counts as a failure rather than a
skip.

- [ ] **Step 2: Update the script entry**

In `package.json`, replace the old entry with:

```json
    "shoot:workspace": "node scripts/shoot-workspace.mjs",
```

Nothing in `build` may depend on it.

- [ ] **Step 3: Verify**

Run: `node --check scripts/shoot-workspace.mjs`
Expected: no syntax error.

Run: `npm run type-check && npm run lint && npm run build && npm run verify:cms`
Expected: all PASS.

Do **not** run the script: it needs a dev server, a real session cookie, and a real Firestore record.

- [ ] **Step 4: Full sweep**

Confirm the public site is untouched. The only public-facing file this whole plan modifies is `types/content.ts`, which adds a type. Run:

```bash
git diff --stat <plan-base>..HEAD -- app/\(public\) components/home components/shared components/what-we-do components/who-we-are
```

Expected: no output, or `types`-only changes. Any change to a public renderer contradicts the plan's constraints.

- [ ] **Step 5: Commit**

```bash
git add scripts/shoot-workspace.mjs package.json
git commit -m "chore(cms): generalise the workspace screenshot script

Takes a route and an output name so it can assert breakpoint fidelity
for the site-page workspace as well as the homepage. The frame lookup
matches /preview, which both preview routes end with.

Still a separate script, so it cannot gate a local build."
```

---

## Done when

- `/admin/who-we-are-pages/<slug>` and `/admin/what-we-do-pages/<slug>` show the rail, a single-region editor, and a live preview.
- Typing updates the preview without saving; the rail marks which region has unsaved changes, which renders nothing, and which is blocking the save.
- Clicking an outlined block selects its region; selecting a region scrolls the preview, except for the two regions that render nothing.
- Both `new` routes still work and still show every field.
- The field-coverage gate reports every field assigned.
- `type-check`, `lint`, `build` and `verify:cms` all pass, and no public renderer changed.
