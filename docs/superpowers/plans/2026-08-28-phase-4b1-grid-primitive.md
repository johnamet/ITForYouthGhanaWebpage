# Phase 4b-1: Grid Primitive and Media Fit — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give `ProseMediaCard` the two capabilities the rollout needs — control over how media is fitted — and add a `ProseMediaCardGrid` that resolves a whole group's photographs in one call, so sibling cards structurally cannot repeat.

**Architecture:** Phase 4a proved the risk this addresses. It created two card grids and both forgot to call `resolveMediaSet`, so four of five partnership tracks shipped repeated photographs — one showing the same image three times in a four-card grid. `resolveMediaSet` had zero call sites in the whole repo. The remaining rollout adds roughly fifteen more grids; relying on fifteen callers to remember is not a plan. Moving the call into a grid component makes correctness structural instead of remembered.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript 5.7, Tailwind 3.4. No dependency changes.

**Spec:** `docs/superpowers/specs/2026-08-26-public-page-prose-and-media-foundations-design.md` (programme row 4).

## Why this is 4b-1

Phase 4b is "adopt `ProseMediaCard` across the eleven card families that have no media slot, hub by hub" — about fifteen grids. 4b-1 is the API work that must land first so those callers target a finished component. 4b-2 onward is the hub rollout itself.

## Global Constraints

- **No test framework.** Do not add Vitest, Jest, `node --test`, or Playwright, and do not write test files. Verification is `npm run type-check`, `npm run lint`, `npm run build`, and the dev server.
- **No dependency changes.** `package.json` untouched.
- **`types/content.ts`, `types/course.ts` and `lib/utils/validators.ts` are OUT OF SCOPE.** Presentation-only, as in every phase of this programme.
- **`components/admin/` and `app/(admin)/` are OUT OF SCOPE.**
- **No page may change appearance in this phase.** The grid is created but adopted by nobody until 4b-2; the new card props are additive with defaults matching today's behaviour. The two live consumers from 4a — `partnership-track-page.tsx` and `initiative-page.tsx` — must render exactly as they do now.
- **Do not regress 4a's fixes.** In particular `resolveMediaSet` must stay wired at both existing consumers, the restored `chrome="bare"` / `mediaFrame` treatment must keep working, and `safeImageSrc` must guard every `next/image` path.
- **Keep `ProseMediaCard` a server component:** no `"use client"`, no hooks, no event handlers, no `Math.random`/`Date.now`/`new Date`.
- **`npm run build` leaves a production `.next` that breaks `next dev`** with an unrelated `MODULE_NOT_FOUND` on `@opentelemetry`. Run `rm -rf .next` between a build and a dev-server check.
- **Branch:** `incircles`. Commit locally; do not push, merge, or touch `main`.

---

### Task 1: Add media-fit control to ProseMediaCard

**Files:**
- Modify: `components/shared/prose-media-card.tsx`
- Modify: `components/media/content-image.tsx` (by exception — see Step 3)

**Interfaces:**
- Consumes: nothing new.
- Produces: `ProseMediaCardProps` gains `aspectRatio?: "landscape" | "portrait" | "square" | "wide"` and `mediaFit?: "cover" | "contain"`. Task 2 passes neither, but the rollout needs both.

**Why:** the card currently hard-codes its aspect ratio — `wide` for `layout="stacked"`, `landscape` for `layout="side"` — and always uses `object-cover`. Two of the families in the rollout are icon-shaped artwork rather than photography (SDG goals and process steps), and where an editor has uploaded an `iconImage` for those, `object-cover` at 16:9 will crop it badly. This makes both choices callable.

- [ ] **Step 1: Add the two props**

Extend `ProseMediaCardProps`:

```tsx
  /**
   * Overrides the aspect ratio the layout would otherwise pick — `wide` for
   * stacked, `landscape` for side. Needed by card families whose media is
   * icon-shaped artwork rather than photography.
   */
  aspectRatio?: "landscape" | "portrait" | "square" | "wide";
  /**
   * `cover` (default) crops to fill, which is right for photographs. `contain`
   * fits the whole image inside the box without cropping, which is right for
   * uploaded logos, SDG tiles and other icon artwork.
   */
  mediaFit?: "cover" | "contain";
```

Destructure `mediaFit = "cover"` and leave `aspectRatio` undefined by default.

- [ ] **Step 2: Use `aspectRatio` where the ratio is currently derived**

Find where the component passes `aspectRatio` to `ContentImage` — today it is a conditional on `layout`. Change it so an explicitly supplied `aspectRatio` wins, and the existing layout-derived value remains the fallback. The expression should read as: use the prop when given, otherwise `layout === "side" ? "landscape" : "wide"`.

Do not change the default outcome for any current caller.

- [ ] **Step 3: Apply `mediaFit`**

**I have already investigated this and it does NOT work the naive way — do not layer classes.**

`ContentImage` composes its image class as `cn("object-cover transition duration-700", imageClassName)`
(`components/media/content-image.tsx:45`), and `lib/utils/cn.ts` is plain `clsx`, not
`tailwind-merge`. So passing `object-contain` yields an element carrying BOTH classes, and
precedence falls to CSS source order. I checked the generated stylesheet: `object-fit:contain`
is emitted at offset 35020 and `object-fit:cover` at 35075 — **`object-cover` is declared later
and therefore wins**. The override would silently do nothing.

So change the choice at its source instead of layering on top of it:

1. Add an optional `fit?: "cover" | "contain"` prop to `components/media/content-image.tsx`,
   defaulting to `"cover"`, and have it select exactly one object-fit class:
   `cn(fit === "contain" ? "object-contain" : "object-cover", "transition duration-700", imageClassName)`.
   This is additive and leaves every existing caller unchanged.
2. Have `ProseMediaCard` pass `fit={mediaFit}` through to `ContentImage`.

`components/media/content-image.tsx` is therefore in scope for this task, by exception — it is the
only place the fix can correctly live.

The `mediaFrame` image path and the spotlight path each render their own `next/image` rather than
going through `ContentImage`, and each sets its own object-fit class directly. Apply `mediaFit`
there by selecting the class rather than appending one, so the prop means the same thing in all
three places.

- [ ] **Step 4: Verify**

```bash
npm run type-check && npm run lint && npm run build
```

- [ ] **Step 5: Confirm nothing changed for existing callers**

```bash
grep -rn "aspectRatio\|mediaFit" --include="*.tsx" components | grep -v components/admin | grep -v "components/media/content-image.tsx"
```

Expected: hits only inside `prose-media-card.tsx` itself. Neither `partnership-track-page.tsx` nor `initiative-page.tsx` should pass either prop yet.

Then `rm -rf .next && npm run dev` and confirm `/partner-with-us/educational` and `/what-we-do/girls-in-tech` both still render exactly as they do now — spotlight cards with their accent bar and pink CTA, how-it-works rows bare with a framed mist image. Report the HTTP status of each.

- [ ] **Step 6: Commit** (only once John has approved committing)

```bash
git add components/shared/prose-media-card.tsx components/media/content-image.tsx
git commit -m "feat: let callers control ProseMediaCard's aspect ratio and object fit"
```

---

### Task 2: Build ProseMediaCardGrid

**Files:**
- Create: `components/shared/prose-media-card-grid.tsx`

**Interfaces:**
- Consumes: `ProseMediaCard` and `ProseMediaCardProps` from `@/components/shared/prose-media-card`; `resolveMediaSet` and `MediaTheme` from `@/lib/content/media-pool`.
- Produces: `ProseMediaCardGrid` and `ProseMediaCardGridProps`. Every grid in the rollout uses this instead of a bare `<div className="grid …">`.

- [ ] **Step 1: Create the component**

Create `components/shared/prose-media-card-grid.tsx`:

```tsx
import {
  ProseMediaCard,
  type ProseMediaCardProps,
} from "@/components/shared/prose-media-card";
import { resolveMediaSet, type MediaTheme } from "@/lib/content/media-pool";
import { cn } from "@/lib/utils/cn";

/** Each card supplies its own content and `mediaKey`; the grid injects the rest. */
export type ProseMediaCardGridItem = Omit<
  ProseMediaCardProps,
  "resolved" | "theme" | "columns"
>;

export type ProseMediaCardGridProps = {
  cards: ProseMediaCardGridItem[];
  theme: MediaTheme;
  /** Column count once past `breakpoint`. Also shapes each card's `sizes`. */
  columns?: 1 | 2 | 3 | 4;
  /** Breakpoint at which the columns kick in. Below it the grid is one column. */
  breakpoint?: "sm" | "md" | "lg";
  gap?: "5" | "6";
  className?: string;
};

const columnClasses: Record<
  "sm" | "md" | "lg",
  Record<1 | 2 | 3 | 4, string>
> = {
  sm: { 1: "", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4" },
  md: { 1: "", 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-4" },
  lg: { 1: "", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" },
};

/**
 * A grid of ProseMediaCards that resolves the whole group's photographs in one
 * call, so sibling cards cannot land on the same image.
 *
 * This exists because relying on each caller to remember `resolveMediaSet` did
 * not work: the first two grids built on ProseMediaCard both forgot it, and
 * shipped visibly repeated photographs. Prefer this over a bare grid div
 * wherever more than one card is rendered together.
 */
export function ProseMediaCardGrid({
  cards,
  theme,
  columns = 3,
  breakpoint = "lg",
  gap = "5",
  className,
}: ProseMediaCardGridProps) {
  if (!cards.length) return null;

  // Resolved once, positionally, so `resolved[index]` always belongs to
  // `cards[index]` — the ordering the whole component depends on.
  const resolved = resolveMediaSet(
    cards.map((card) => card.mediaKey),
    theme,
  );

  return (
    <div
      className={cn(
        "grid",
        gap === "6" ? "gap-6" : "gap-5",
        columnClasses[breakpoint][columns],
        className,
      )}
    >
      {cards.map((card, index) => (
        <ProseMediaCard
          key={card.mediaKey}
          {...card}
          theme={theme}
          columns={columns}
          resolved={resolved[index]}
        />
      ))}
    </div>
  );
}
```

Note three deliberate choices, and keep them:
- `card.mediaKey` is the React key as well as the pool key. It is already required to be a stable content identifier, so it is the right key — and it makes a duplicate key a visible React warning rather than a silent collision.
- `columns` drives both the grid classes and each card's `sizes` descriptor, so those two can no longer drift apart.
- `resolved` is passed positionally. Do not reorder, filter or sort `cards` inside this component — the caller must hand them over already filtered, in render order.

- [ ] **Step 2: Verify it compiles and is adopted by nobody**

```bash
npm run type-check && npm run lint && npm run build
```

Then:

```bash
grep -rn "ProseMediaCardGrid" --include="*.tsx" components app | grep -v "components/shared/prose-media-card-grid.tsx"
```

Expected: no output. Adoption is 4b-2.

- [ ] **Step 3: Prove the ordering and de-duplication contract**

The grid's whole purpose is that siblings never repeat, so demonstrate it rather than assuming it. Run a throwaway check against real content:

```bash
npx tsx -e "
import { partnershipTracks } from './lib/content/partnership-config';
import { resolveMedia, resolveMediaSet } from './lib/content/media-pool';
for (const t of partnershipTracks as any[]) {
  const cards = (t.focusCards ?? []).filter((c:any)=>c.title?.trim()||c.description?.trim());
  if (!cards.length) continue;
  const keys = cards.map((c:any)=>\`partner-with-us:\${t.slug}:\${c.title}\`);
  const perCard = keys.map((k:string)=>resolveMedia(k,'partnership').url);
  const asGroup = resolveMediaSet(keys,'partnership').map(e=>e.url);
  console.log(t.slug, 'per-card uniq', new Set(perCard).size, '/ group uniq', new Set(asGroup).size, 'of', cards.length);
}
"
```

Expected: every track's group figure equals its card count, while several per-card figures are lower. Paste the output into your report. Do not commit this snippet.

- [ ] **Step 4: Commit** (only once John has approved committing)

```bash
git add components/shared/prose-media-card-grid.tsx
git commit -m "feat: add ProseMediaCardGrid so sibling cards cannot repeat photographs"
```

---

## Definition of done for phase 4b-1

- `npm run type-check`, `npm run lint` and `npm run build` all pass.
- `ProseMediaCard` accepts `aspectRatio` and `mediaFit`, with defaults that leave every current caller unchanged.
- `ProseMediaCardGrid` exists, resolves each group's media in one call, and is imported by nobody.
- `/partner-with-us/<track>` and `/what-we-do/<initiative>` render exactly as they did before this phase.
- `types/content.ts`, `lib/utils/validators.ts`, `package.json`, `components/admin/` and `app/(admin)/` are unchanged.

## What 4b-2 onward will do

Roll the grid out hub by hub across the eleven media-less families — `overviewCards`, `howItWorks` and `packages` (for-organisations); `howItWorks` (partner-with-us); `measurementCards`, `reportResources`, `evidenceCards` and SDG `goals` (our-impact); `ecosystemCards` and `pathwayCards` (what-we-do); `audienceSections` (apply-for-training); `responseSteps` (contact); `editorialPillars` (news); department `services`; and the training process strip. Each hub gets a deliberate theme assignment, uses `ProseMediaCardGrid` rather than a bare grid div, and gets a Lighthouse check before the next begins.
