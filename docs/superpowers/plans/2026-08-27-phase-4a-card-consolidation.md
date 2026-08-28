# Phase 4a: Card Consolidation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `ProseMediaCard` the single card primitive by porting `SpotlightCard`'s and `AlternatingFeatureRow`'s designs into it as variants, migrating their two consumers, and deleting both components.

**Architecture:** Three components currently do overlapping work. `ProseMediaCard` (built in the foundations phase, adopted by nobody) is the survivor; `SpotlightCard` and `AlternatingFeatureRow` each have exactly one consumer, which makes consolidation tractable. This phase changes no page's *content* — only which component renders it — and it deliberately preserves both existing designs pixel-for-pixel so the two live pages do not visibly change.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript 5.7, Tailwind 3.4. No dependency changes.

**Spec:** `docs/superpowers/specs/2026-08-26-public-page-prose-and-media-foundations-design.md` (programme row 4, first half).

## Why this is 4a and not all of phase 4

Phase 4 as specced is "adopt `ProseMediaCard` hub by hub" across 15 card families. Splitting it:

- **4a (this plan)** — extend the primitive and retire the duplicates. Two pages touched, both must look identical afterwards. Small, verifiable, and it settles the component API before fifteen callers depend on it.
- **4b (next plan)** — roll the pool and the card out across the 11 families that have no media slot today, hub by hub.

Doing 4a first means 4b's callers all target a finished API instead of one that shifts under them.

## Global Constraints

- **No test framework.** Do not add Vitest, Jest, `node --test`, or Playwright, and do not write test files. Verification is `npm run type-check`, `npm run lint`, `npm run build`, and visual comparison in the dev server.
- **No dependency changes.** `package.json` untouched.
- **`types/content.ts`, `types/course.ts` and `lib/utils/validators.ts` are OUT OF SCOPE.** Presentation-only, as with every phase in this programme.
- **`components/admin/` and `app/(admin)/` are OUT OF SCOPE.**
- **The two migrated pages MUST look unchanged.** Unlike phases 2 and 3, this phase is a pure refactor: `/partner-with-us/<track>` and `/what-we-do/<initiative>` must render the same as before. Any visual difference is a defect.
- **Do not remove any icon.** Phase 3 finished that work; every surviving icon is functional.
- **`npm run build` leaves a production `.next` that breaks `next dev`** with an unrelated `MODULE_NOT_FOUND` on `@opentelemetry`. Run `rm -rf .next` between a build and a dev-server check.
- **Branch:** `incircles`. Commit locally; do not push, merge, or touch `main`.

---

### Task 1: Extend ProseMediaCard with the spotlight variant

**Files:**
- Modify: `components/shared/prose-media-card.tsx`

**Interfaces:**
- Consumes: `composeProse` from `@/lib/utils/prose`; `resolveMedia`, `MediaTheme`, `PoolEntry` from `@/lib/content/media-pool`; `safeImageSrc` from `@/lib/utils/image-src`; `ContentImage`, `VideoCard`, `cn`.
- Produces: `ProseMediaCardProps` gains `variant?: "panel" | "spotlight"`, `accentColor?: string`, and `cta?: { label: string; href: string }`. Task 2 depends on all three.

Read `components/shared/spotlight-card.tsx` in full first — it is the design being ported, and it is deleted in Task 2, so everything worth keeping must move now.

- [ ] **Step 1: Add the three new props**

Extend `ProseMediaCardProps` with:

```tsx
  /**
   * "panel" (default) is the padded card the media rollout uses.
   * "spotlight" reproduces the retired SpotlightCard: a 6px accent bar, an
   * edge-to-edge 16/9 image, a pill eyebrow, and an optional CTA button.
   */
  variant?: "panel" | "spotlight";
  /** Spotlight variant only — the accent bar colour. */
  accentColor?: string;
  /** Spotlight variant only — renders a Button below the prose. */
  cta?: { label: string; href: string };
```

Default `variant` to `"panel"` and `accentColor` to `"var(--color-accent)"` in the destructuring, matching `SpotlightCard`'s own default.

Add `import { Button } from "@/components/ui/button";`.

- [ ] **Step 2: Render the spotlight shell**

The panel shell today is `rounded-[30px] p-6 shadow-sm` with `border border-brand-border bg-white` for the light tone. The spotlight shell must instead be, copied exactly from `SpotlightCard`:

```
overflow-hidden rounded-[18px] border border-brand-border bg-white shadow-sm
```

with **no padding on the shell** — the spotlight variant puts its padding on an inner `p-6` wrapper instead, because its image is edge-to-edge.

Structure for `variant="spotlight"`:

```tsx
      <article className={shell}>
        <div aria-hidden="true" style={{ background: accentColor, height: 6 }} />
        {image ? (
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        ) : null}
        <div className="p-6">{text}</div>
      </article>
```

Note this variant uses `next/image` directly rather than `ContentImage`, because `SpotlightCard` did and because `ContentImage` imposes its own rounding and gradient placeholder. **Run the src through `safeImageSrc` before passing it to `next/image`** — `ContentImage` already does this, and bypassing it must not lose that protection. Import `safeImageSrc` from `@/lib/utils/image-src`. If `safeImageSrc` returns undefined, render no image block at all, matching `SpotlightCard`'s `image ? ... : null`.

- [ ] **Step 3: Render the pill eyebrow and the CTA for the spotlight variant**

In the text block, when `variant === "spotlight"`, the eyebrow renders as a pill rather than uppercase tracked text:

```tsx
        <span className="inline-flex rounded-full bg-brand-mist/70 px-3 py-1 text-xs font-semibold text-brand-navy">
          {eyebrow}
        </span>
```

and the heading takes `mt-4` only when an eyebrow is present — `SpotlightCard` did this with `cn("font-heading text-2xl font-bold text-brand-ink", categoryLabel && "mt-4")`. Preserve that conditional exactly; do not give it an unconditional margin.

Below the prose paragraph, when `cta` is set:

```tsx
        <div className="mt-5">
          <Button href={cta.href} variant="pink" size="lg">
            {cta.label}
          </Button>
        </div>
```

`SpotlightCard` used `variant="pink"` and `size="lg"`. Keep both.

The panel variant's eyebrow, heading and prose rendering must be left exactly as they are.

- [ ] **Step 4: Keep the existing behaviour intact for both variants**

These must still hold, for panel and spotlight alike:
- The empty guard: nothing renders when there is neither a title nor prose.
- Precedence: `media.image` → `media.iconImage` → `resolved` → `resolveMedia(mediaKey, theme)`.
- Pool-sourced images get `alt=""`; authored images (including `iconImage`) use `media.imageAlt` or the title.
- `videoUrl` suppresses the `href` wrap to avoid nested anchors.
- No `Math.random`, no `Date.now`, no `"use client"`.

The spotlight variant has no `layout`, `columns`, `mediaPosition` or `tone` behaviour — it is a single fixed design. If `variant="spotlight"` is combined with those props, ignore them rather than throwing, and say so in a comment.

- [ ] **Step 5: Verify**

```bash
npm run type-check && npm run lint && npm run build
```

Expected: all pass. The component still has no importers at this point, so no route output changes.

- [ ] **Step 6: Confirm nothing adopted it yet**

```bash
grep -rn "ProseMediaCard" --include="*.tsx" components app | grep -v "components/shared/prose-media-card.tsx"
```

Expected: no output. Adoption is Task 2.

- [ ] **Step 7: Commit** (only once John has approved committing)

```bash
git add components/shared/prose-media-card.tsx
git commit -m "feat: add spotlight variant to ProseMediaCard ahead of consolidation"
```

---

### Task 2: Migrate both consumers and delete the retired components

**Files:**
- Modify: `components/partnerships/partnership-track-page.tsx`
- Modify: `components/what-we-do/initiative-page.tsx`
- Delete: `components/shared/spotlight-card.tsx`
- Delete: `components/shared/alternating-feature-row.tsx`

**Interfaces:**
- Consumes: `ProseMediaCard` with `variant`, `accentColor`, `cta` from Task 1.
- Produces: `SpotlightCard` and `AlternatingFeatureRow` no longer exist.

**The two pages must look identical after this task.** That is the whole test.

- [ ] **Step 1: Migrate `partnership-track-page.tsx`'s focus cards**

The current call is:

```tsx
                  <SpotlightCard
                    key={card.title}
                    image={image}
                    imageAlt={card.title}
                    categoryLabel={page.overviewCardBadgeLabel ?? "Focus area"}
                    title={card.title}
                    excerpt={description}
                    ctaLabel={page.contactCta?.primary?.label ?? "Get in touch"}
                    ctaHref={page.contactCta?.primary?.href ?? "/contact"}
```

Read the surrounding lines to capture the full call including any `accentColor` and closing props, then replace it with:

```tsx
                  <ProseMediaCard
                    key={card.title}
                    variant="spotlight"
                    eyebrow={page.overviewCardBadgeLabel ?? "Focus area"}
                    title={card.title}
                    body={description}
                    media={{ image, imageAlt: card.title }}
                    mediaKey={`partner-with-us:${page.slug}:${card.title}`}
                    theme="partnership"
                    cta={{
                      label: page.contactCta?.primary?.label ?? "Get in touch",
                      href: page.contactCta?.primary?.href ?? "/contact",
                    }}
                  />
```

If the original passed an `accentColor`, carry it across unchanged. Note `description` is already computed by `composeProse` above the call — keep that line and pass it as `body`.

Swap the import from `SpotlightCard` to `ProseMediaCard`. **`mediaKey` must be a stable content identifier**, never an array index — the resolver hashes it, so an index would reshuffle every photo when cards are reordered.

- [ ] **Step 2: Migrate `initiative-page.tsx`'s how-it-works rows**

`AlternatingFeatureRow` takes an `items` array and alternates the media side per row. `ProseMediaCard` is a single card, so the alternation moves to the caller. Replace:

```tsx
              <AlternatingFeatureRow
                items={howItWorks.map((step) => ({
```

and its whole item-mapping block with a direct map rendering one card per step:

```tsx
              <div className="space-y-10">
                {howItWorks.map((step, index) => (
                  <ProseMediaCard
                    key={`${step.title}-${index}`}
                    layout="side"
                    mediaPosition={index % 2 === 1 ? "end" : "start"}
                    title={step.title}
                    body={step.description}
                    media={{ iconImage: step.iconImage }}
                    mediaKey={`what-we-do:${page.slug}:${step.title}`}
                    theme="training"
                  />
                ))}
              </div>
```

`space-y-10` matches `AlternatingFeatureRow`'s own outer spacing — confirm that by reading the component before deleting it, and use whatever value it actually had. Swap the import.

Note the alternation condition: `AlternatingFeatureRow` used `isReversed = index % 2 === 1` and put the visual in `lg:order-2` when reversed, which corresponds to `mediaPosition="end"`. Verify that mapping against the component's source rather than trusting this description.

- [ ] **Step 3: Delete both retired components**

```bash
git rm components/shared/spotlight-card.tsx components/shared/alternating-feature-row.tsx
```

- [ ] **Step 4: Confirm nothing references either**

```bash
grep -rn "SpotlightCard\|spotlight-card\|AlternatingFeatureRow\|alternating-feature-row" --include="*.ts" --include="*.tsx" . | grep -v node_modules | grep -v "^./docs/"
```

Expected: no output. A hit under `components/admin/` means the deletion breaks the admin build — STOP and report, because that changes the scope.

- [ ] **Step 5: Verify**

```bash
npm run type-check && npm run lint && npm run build
```

- [ ] **Step 6: Visual comparison — the real gate**

```bash
rm -rf .next && npm run dev
```

Open `/partner-with-us/educational` and `/what-we-do/girls-in-tech`.

The focus cards must still show: a 6px accent bar at the top, an edge-to-edge 16/9 image, a pill label, the title, the prose, and a pink CTA button — with `rounded-[18px]` corners, not the panel's larger radius. The how-it-works rows must still alternate the image left/right down the page with the same spacing.

If either page differs from before, the migration is wrong. Capture what you see either way and report it.

- [ ] **Step 7: Commit** (only once John has approved committing)

```bash
git add -A
git commit -m "refactor: migrate focus cards and feature rows to ProseMediaCard, retire duplicates"
```

---

## Definition of done for phase 4a

- `npm run type-check`, `npm run lint` and `npm run build` all pass.
- `components/shared/spotlight-card.tsx` and `components/shared/alternating-feature-row.tsx` no longer exist, and nothing references them.
- `ProseMediaCard` is the only card primitive, and it carries both designs.
- `/partner-with-us/<track>` and `/what-we-do/<initiative>` render exactly as they did before.
- `types/content.ts`, `lib/utils/validators.ts`, `package.json`, `components/admin/` and `app/(admin)/` are unchanged.

## What 4b will do

Adopt `ProseMediaCard` (panel variant) across the 11 card families that have no media slot today, hub by hub, wiring `resolveMediaSet` at each grid so sibling cards never share a photograph: `overviewCards` and `howItWorks` and `packages` (for-organisations), `howItWorks` (partner-with-us), `measurementCards` and `evidenceCards` and `reportResources` and SDG `goals` (our-impact), `ecosystemCards` and `pathwayCards` (what-we-do), `audienceSections` (apply-for-training), `responseSteps` (contact), `editorialPillars` (news), and department `services`. Each hub gets a theme assignment and a Lighthouse check before the next begins.
