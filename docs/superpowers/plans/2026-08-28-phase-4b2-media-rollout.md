# Phase 4b-2: Media Rollout — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pair every remaining prose card on the public site with a photograph, by routing fifteen card grids through `ProseMediaCardGrid` with themes that are verified collision-free rather than chosen by eye.

**Architecture:** Everything this needs is already built. `ProseMediaCard` renders a prose block with media; `ProseMediaCardGrid` resolves a whole group's photographs in one `resolveMediaSet` call so siblings cannot repeat; `scripts/verify-media-pages.ts` asserts that no *page* repeats a photograph across grids. This phase is adoption plus two small API completions the survey turned up.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript 5.7, Tailwind 3.4. No dependency changes.

**Spec:** `docs/superpowers/specs/2026-08-26-public-page-prose-and-media-foundations-design.md` (programme row 4).

## Global Constraints

- **No test framework.** Do not add Vitest, Jest, `node --test`, or Playwright, and do not write test files. Verification is `npm run type-check`, `npm run lint`, `npm run build`, `npm run verify:media-pages`, and the dev server.
- **No dependency changes.** `package.json` may gain nothing beyond what is already there.
- **`types/content.ts`, `types/course.ts` and `lib/utils/validators.ts` are OUT OF SCOPE.** Presentation-only, as in every phase.
- **`components/admin/` and `app/(admin)/` are OUT OF SCOPE.**
- **`npm run verify:media-pages` must pass at the end of every task**, and every task that adds or re-themes a grid must add that grid to the script. A page missing from that script is a page nobody is checking.
- **Never call `resolveMediaSet` or `resolveMedia` from a page.** Use `ProseMediaCardGrid`. The one exception is the two grids 4a already wired by hand; leave those as they are.
- **Themes are assigned per grid, from the verified table below. Do not substitute one.** Every editorially-natural assignment tried during planning failed the page gate at least once. If a theme must change, re-run the gate and change the table.
- **`npm run build` leaves a production `.next` that breaks `next dev`** with an unrelated `MODULE_NOT_FOUND` on `@opentelemetry`. Run `rm -rf .next` between a build and a dev-server check.
- **Branch:** `incircles`, which now tracks `origin/incircles`. Commit locally; do not push, merge, or touch `main`.
- **These pages WILL change appearance** — every converted card gains a photograph. That is the deliverable.

## The verified theme table

Produced by search and confirmed by `npm run verify:media-pages` across all 31 page instances. Grids marked *(4a)* already exist and are not touched by this phase; they are listed because the gate must account for them.

| Page | Grid | Theme | columns | breakpoint | gap |
|---|---|---|---|---|---|
| `for-organisations/[slug]` | `overviewCards` | `corporate` | 2 | md | 5 |
| `for-organisations/[slug]` | `howItWorks` | `coding` | 4 | lg | 5 |
| `for-organisations/[slug]` | `packages` | `entrepreneurship` | 2 | md | 5 |
| `partner-with-us/[slug]` | `focusCards` *(4a)* | `partnership` | — | — | — |
| `partner-with-us/[slug]` | `howItWorks` | `training` | 4 | lg | 5 |
| `what-we-do/[slug]` | `howItWorks` *(4a)* | `training` | — | — | — |
| `what-we-do` | `ecosystemCards` | `community` | 3 | lg | 5 |
| `what-we-do` | `pathwayCards` | `training` | 4 | lg | 5 |
| `our-impact` | `measurementCards` | `graduation` | 2 | md | 5 |
| `our-impact/reports` | `reportResources` | `training` | 3 | lg | 6 |
| `our-impact/reports` | `evidenceCards` | `mentoring` | 2 | md | 5 |
| `our-impact/sdgs` | `goals` | `advocacy` | 1 | lg | 6 |
| `news-and-updates` | `editorialPillars` | `community` | 1 | lg | 5 |
| `contact` | `responseSteps` | `mentoring` | 1 | lg | 4 |
| `departments/[slug]` | `services` | `team` | 2 | md | 4 |
| `apply-for-training/who-can-apply` | `audienceSections` | `training` | 3 | lg | — |
| `apply-for-training` (+ `/courses`, `/how-it-works`) | `TrainingProcessStrip` steps | `training` | 4 | lg | 5 |

The last two rows were assigned and gated by Task 1. Both settled on `training` and passed on the first candidate, because each is the only grid on its page — so `resolveMediaSet` alone guarantees no repeat regardless of theme. Note the process strip renders on three routes (`/apply-for-training`, `/apply-for-training/courses`, `/apply-for-training/how-it-works`), all now covered by the gate.

## The canonical transformation

Every conversion in Tasks 2 to 5 has the same shape. Read this once; each task then gives only its own specifics.

**Before** — a bare grid div mapping items into bespoke card markup:

```tsx
<div className="grid gap-5 md:grid-cols-2">
  {content.someCards.map((card) => (
    <div key={card.title} className="rounded-[30px] border border-brand-border bg-white p-7 shadow-sm">
      {/* badge, heading, prose … */}
    </div>
  ))}
</div>
```

**After** — build an array of card props, hand it to the grid:

```tsx
<ProseMediaCardGrid
  theme="impact"
  columns={2}
  breakpoint="md"
  gap="5"
  cards={content.someCards.map((card) => ({
    eyebrow: content.someCardBadgeLabel ?? "Evidence lens",
    title: card.title,
    body: card.description,
    points: card.bullets,
    mediaKey: `our-impact:measure:${card.title}`,
    media: { iconImage: card.iconImage },
  }))}
/>
```

Rules that apply to every conversion:

- **`mediaKey` must match the table's key prefix exactly**, because `scripts/verify-media-pages.ts` hashes the same strings. A key that differs from the script's means the gate is checking something the page does not render. The prefixes are given per grid in each task.
- **Pass prose through `body` and `points`, never pre-joined.** The card runs `composeProse` itself. If the existing code computes a joined description with `composeProse` or `pointsToParagraph` above the map, delete that and pass the raw fields — otherwise the text is punctuated twice.
- **Carry `iconImage` through `media.iconImage`** wherever the old markup read it. It is authored artwork and outranks the pool.
- **Filter before mapping, not inside.** The grid resolves positionally, so the array it receives must already be the array that renders.
- **Do not keep the old card's wrapper.** `ProseMediaCardGrid` owns the grid classes and `ProseMediaCard` owns the card shell.
- **Add the grid to `scripts/verify-media-pages.ts` in the same commit**, then run `npm run verify:media-pages`.

---

### Task 1: Complete the API and gate the two unassigned grids

**Files:**
- Modify: `components/shared/prose-media-card-grid.tsx`
- Modify: `components/shared/prose-media-card.tsx`
- Modify: `scripts/verify-media-pages.ts`

**Interfaces:**
- Produces: `gap` accepts `"4"`; `cta` renders on the panel variant; verified themes for `audienceSections` and the training process steps.

Three gaps the survey found. All three block a later task, so they land first.

- [ ] **Step 1: `gap` must accept `"4"`**

`ProseMediaCardGridProps.gap` is currently `"5" | "6"`, but two grids in the table need `gap-4` (`contact` `responseSteps`, `departments` `services`). Widen the union to `"4" | "5" | "6"` and extend the gap expression to emit `gap-4`. Keep `"5"` as the default.

- [ ] **Step 2: `cta` must render on the panel variant**

`cta` currently renders only under the spotlight variant. Two grids in the table carry a link the panel variant cannot express: `reportResources` has a download link, and SDG `goals` has linked routes. Without this they would lose their links.

Render `cta` on the panel variant too, below the prose, using the same markup the spotlight variant uses (`<div className="mt-5">` wrapping a `Button`). Use `variant="blue"` rather than the spotlight's `"pink"` — read `components/ui/button.tsx` and confirm `blue` exists before relying on it; if it does not, pick an existing variant that suits a panel card and say which.

**The existing anchor-nesting guard must keep holding.** `isLinked` is `Boolean(href) && !videoUrl && !(isSpotlight && cta)`. Now that `cta` renders on panel as well, that guard is wrong again for the same reason it was wrong before: `Button` with an `href` emits its own anchor, so `href` + `cta` would nest anchors on *either* variant. Simplify it to `Boolean(href) && !videoUrl && !cta` and update the comment to say `cta` renders on both variants now. Do not leave a variant-conditional guard behind.

- [ ] **Step 3: Assign and gate themes for the two remaining grids**

`audienceSections` (`components/training/training-who-can-apply-page.tsx`) and the steps in `components/training/training-process-strip.tsx` have no theme yet.

Both are single-grid pages, but the process strip renders on more than one route — find every page that renders `TrainingProcessStrip` before choosing, because a page that already has a grid constrains the choice.

Add both to `scripts/verify-media-pages.ts` with a candidate theme, run `npm run verify:media-pages`, and iterate until it passes. `training` is the editorially obvious choice for both; if it collides, work outward. **Report which themes you settled on and what you tried**, and add them to the plan's table in a follow-up edit.

- [ ] **Step 4: Verify**

```bash
npm run type-check && npm run lint && npm run build && npm run verify:media-pages
```

Then `rm -rf .next && npm run dev` and confirm `/partner-with-us/educational` and `/what-we-do/girls-in-tech` still render as they do now — the two 4a pages are the regression canary for any change to these components. Report both HTTP statuses.

- [ ] **Step 5: Commit** (only once John has approved committing)

```bash
git add components/shared/prose-media-card-grid.tsx components/shared/prose-media-card.tsx scripts/verify-media-pages.ts
git commit -m "feat: widen grid gap, render cta on panel cards, gate remaining themes"
```

---

### Task 2: Roll out the for-organisations hub

**Files:**
- Modify: `components/organisations/organisation-service-page.tsx`
- Modify: `scripts/verify-media-pages.ts`

Three grids on one page — the heaviest page in the rollout and the reason the page gate exists.

- [ ] **Step 1: `overviewCards`**

Theme `corporate`, `columns={2}`, `breakpoint="md"`, `gap="5"`. Key prefix `` `for-organisations:${page.slug}:ov:${card.title}` ``.

The current markup reads `card.iconImage` — carry it through `media.iconImage`. Its badge is `page.overviewCardBadgeLabel ?? "Service area"` → `eyebrow`. It computes `composeProse(card.description, card.bullets)` above the map; delete that and pass `body: card.description` and `points: card.bullets`.

- [ ] **Step 2: `howItWorks`**

Theme `coding`, `columns={4}`, `breakpoint="lg"`, `gap="5"`. Key prefix `` `for-organisations:${page.slug}:hiw:${step.title}` ``.

Steps carry `title` and `description` only. Their number badge was removed in phase 2 and their icon in phase 3, so nothing but title and prose remains to carry across. `step.iconImage` still exists on the type — carry it through `media.iconImage`.

- [ ] **Step 3: `packages`**

Theme `entrepreneurship`, `columns={2}`, `breakpoint="md"`, `gap="5"`. Key prefix `` `for-organisations:${page.slug}:pk:${item.name}` ``.

Note packages key off `name`, not `title` — the gate script uses `name`, so the page must too. Map `item.name` → `title`, `item.description` → `body`, `item.features` → **not** `points`. Phase 2 established that `features` are 1-3 word tags rendered as a comma-joined line, not prose; keep that treatment by passing the joined string as part of `body` or rendering it beneath, and do NOT pass tags through `points`, which would punctuate each as a sentence. Read the current markup and preserve what it does. `item.price` and `item.note` must survive too — decide where they go and say so in your report.

- [ ] **Step 4: Update the gate and verify**

The three grids are already in `scripts/verify-media-pages.ts` with these themes. Confirm the key strings in the page now match the script exactly, then:

```bash
npm run type-check && npm run lint && npm run build && npm run verify:media-pages
```

- [ ] **Step 5: Visual check**

`rm -rf .next && npm run dev`, then visit all four service pages: `/for-organisations/corporate-training`, `/sponsorships`, `/hire-graduates`, `/staff-volunteering`. On each, confirm every card shows a photograph, no two photographs on the page are the same, and no card lost its price, note, or feature list. Report what you saw per page.

- [ ] **Step 6: Commit** (only once John has approved committing)

```bash
git add components/organisations/organisation-service-page.tsx scripts/verify-media-pages.ts
git commit -m "feat: pair for-organisations cards with photographs via ProseMediaCardGrid"
```

---

### Task 3: Roll out the our-impact hub

**Files:**
- Modify: `components/impact/impact-overview-page.tsx`
- Modify: `components/impact/impact-reports-page.tsx`
- Modify: `components/impact/impact-sdgs-page.tsx`
- Modify: `scripts/verify-media-pages.ts`

- [ ] **Step 1: `measurementCards`**

Theme `impact`, `columns={2}`, `breakpoint="md"`, `gap="5"`. Key prefix `` `our-impact:measure:${card.title}` ``. Badge `content.measurementCardBadgeLabel ?? "Evidence lens"` → `eyebrow`. `card.bullets` → `points`.

- [ ] **Step 2: `reportResources`**

Theme `impact`, `columns={3}`, `breakpoint="lg"`, `gap="6"`. Key prefix `` `our-impact:rr:${resource.title}` ``.

This grid has a download link — use the `cta` prop Task 1 added to the panel variant. `resource.year` currently renders as a gold uppercase eyebrow; map it to `eyebrow`. There is also a badge pill; decide which of year and badge becomes the eyebrow and where the other goes, and say so in your report. `resource.summary` → `body`, `resource.highlights` → `points`.

- [ ] **Step 3: `evidenceCards`**

Theme `training`, `columns={2}`, `breakpoint="md"`, `gap="5"`. Key prefix `` `our-impact:ev:${card.title}` ``. `card.description` → `body`, `card.bullets` → `points`, `card.iconImage` → `media.iconImage`.

- [ ] **Step 4: SDG `goals`**

Theme `advocacy`, `columns={1}`, `breakpoint="lg"`, `gap="6"`. Key prefix `` `our-impact:sdg:${goal.goal}` `` — note it keys off `goal.goal`, not a title.

This one is the least like the others: each goal renders as a two-column panel with a navy inner block, and it carries linked routes. Read it carefully. If `ProseMediaCardGrid` at `columns={1}` cannot reproduce it without losing the navy block or the links, **stop and report rather than forcing it** — this grid may belong in a follow-up with a `tone="dark"` treatment, and losing content is worse than deferring one grid.

- [ ] **Step 5: Verify**

```bash
npm run type-check && npm run lint && npm run build && npm run verify:media-pages
```

- [ ] **Step 6: Visual check**

`rm -rf .next && npm run dev`, then `/our-impact`, `/our-impact/reports`, `/our-impact/sdgs`. Confirm photographs everywhere, no repeats within a page, download links still work on reports, and SDG linked routes still work. Report per page.

- [ ] **Step 7: Commit** (only once John has approved committing)

```bash
git add components/impact scripts/verify-media-pages.ts
git commit -m "feat: pair our-impact cards with photographs via ProseMediaCardGrid"
```

---

### Task 4: Roll out what-we-do and partner-with-us

**Files:**
- Modify: `components/what-we-do/what-we-do-overview-page.tsx`
- Modify: `components/partnerships/partnership-track-page.tsx`
- Modify: `scripts/verify-media-pages.ts`

- [ ] **Step 1: `ecosystemCards` — use the spotlight variant**

Theme `community`, `columns={3}`, `breakpoint="lg"`, `gap="5"`. Key prefix `` `what-we-do:eco:${card.title}` ``.

**This family already renders an image** — an edge-to-edge `aspect-[16/9]` above a `p-7` body, with an eyebrow. That is the spotlight variant's shape, not the panel's. Pass `variant="spotlight"` on each card, and pass the authored image through `media.image` with `media.imageAlt: card.imageAlt` so it outranks the pool. Cards without an authored image then fall through to the pool, which is the point.

- [ ] **Step 2: `pathwayCards`**

Theme `training`, `columns={4}`, `breakpoint="lg"`, `gap="5"`. Key prefix `` `what-we-do:path:${card.title}` ``. Plain panel cards: `card.title` → `title`, `card.description` → `body`. Their number badge was removed in phase 2.

- [ ] **Step 3: `howItWorks` on the partnership track page**

Theme `training`, `columns={4}`, `breakpoint="lg"`, `gap="5"`. Key prefix `` `partner-with-us:${page.slug}:hiw:${step.title}` ``.

**Note the `hiw:` segment.** This page already has a `focusCards` grid from 4a whose keys are `` `partner-with-us:${page.slug}:${card.title}` `` with no segment. The prefixes must stay distinct or the two grids can hash to the same entries. `training` was chosen here precisely because `partnership` — the obvious choice — collides with the existing focus-cards grid on this page.

**Do not touch the `focusCards` grid.** It is 4a's, it is hand-wired with `resolveMediaSet`, and it is verified.

- [ ] **Step 4: Verify**

```bash
npm run type-check && npm run lint && npm run build && npm run verify:media-pages
```

- [ ] **Step 5: Visual check**

`rm -rf .next && npm run dev`, then `/what-we-do` and all five partner tracks (`/partner-with-us/educational`, `/government`, `/ngo-foundations`, `/international-development`, `/technology`). On each track page confirm the focus cards AND the new how-it-works cards all show different photographs — this is the page most likely to repeat one. Report per page.

- [ ] **Step 6: Commit** (only once John has approved committing)

```bash
git add components/what-we-do components/partnerships scripts/verify-media-pages.ts
git commit -m "feat: pair what-we-do and partner-with-us cards with photographs"
```

---

### Task 5: Roll out contact, news, departments and training

**Files:**
- Modify: `components/contact/contact-page.tsx`
- Modify: `components/news/news-hub-page.tsx`
- Modify: `components/departments/department-detail-page.tsx`
- Modify: `components/training/training-who-can-apply-page.tsx`
- Modify: `components/training/training-process-strip.tsx`
- Modify: `scripts/verify-media-pages.ts`

- [ ] **Step 1: `responseSteps`**

Theme `mentoring`, `columns={1}`, `breakpoint="lg"`, `gap="4"`. Key prefix `` `contact:step:${step.number}` `` — note it keys off `step.number`, which is what the gate script uses. `step.title` → `title`, `step.description` → `body`. Phase 3 removed this card's medallion, so title and prose are all that remain.

- [ ] **Step 2: `editorialPillars`**

Theme `community`, `columns={1}`, `breakpoint="lg"`, `gap="5"`. Key prefix `` `news:pillar:${pillar.title}` ``. `pillar.body` → `body`, `pillar.bullets` → `points`.

- [ ] **Step 3: department `services`**

Theme `team`, `columns={2}`, `breakpoint="md"`, `gap="4"`. Key prefix `` `departments:${department.slug}:${service.title}` ``.

`service.bullets` are 1-3 word tags rendered comma-joined, established in phase 2. Do NOT pass them through `points`. Preserve the existing comma-joined treatment.

- [ ] **Step 4: `audienceSections` and the training process strip**

Use the themes Task 1 gated and recorded. Key prefixes are whatever Task 1 added to the script — read it rather than inventing them.

`audienceSections` currently renders in a bordered `grid gap-x-10 gap-y-12 lg:grid-cols-3` with no card shell, and its supporting prose uses the gold-rule treatment. `ProseMediaCardGrid` will give each item a card shell. If that is a bigger visual change than the rest of the rollout, note it and proceed — this phase changes appearance by design — but say clearly what changed.

`training-process-strip.tsx` renders on more than one route. Convert it once; confirm every page that renders it still passes the gate.

- [ ] **Step 5: Verify**

```bash
npm run type-check && npm run lint && npm run build && npm run verify:media-pages
```

- [ ] **Step 6: Whole-site check**

`rm -rf .next && npm run dev`, then walk every public route: `/`, `/who-we-are`, `/who-we-are/team`, `/who-we-are/partners`, `/who-we-are/careers`, `/what-we-do`, one initiative, `/apply-for-training`, `/apply-for-training/who-can-apply`, `/apply-for-training/courses`, `/apply-for-training/how-it-works`, `/for-organisations` and one service, `/partner-with-us` and one track, `/our-impact`, `/our-impact/reports`, `/our-impact/sdgs`, `/our-impact/testimonials`, `/news-and-updates`, `/contact`, `/donate`, `/departments` and one department. Report the HTTP status of each and any page showing a repeated photograph.

- [ ] **Step 7: Lighthouse**

The spec named page weight as this phase's main risk — a few hundred photographs where there were icons. Run Lighthouse (or `next build`'s reported First Load JS plus a manual network check) on `/for-organisations/corporate-training`, the heaviest converted page, and report LCP and total image bytes. If LCP has regressed badly, report it rather than tuning — the `sizes` work is already done and a regression would mean something else is wrong.

- [ ] **Step 8: Commit** (only once John has approved committing)

```bash
git add components scripts/verify-media-pages.ts
git commit -m "feat: pair contact, news, department and training cards with photographs"
```

---

## Definition of done for phase 4b-2

- `npm run type-check`, `npm run lint`, `npm run build` and `npm run verify:media-pages` all pass.
- Every grid in the verified table renders through `ProseMediaCardGrid`, and no page calls `resolveMediaSet` or `resolveMedia` directly except the two grids 4a wired by hand.
- `scripts/verify-media-pages.ts` accounts for every grid on every public page, and passes.
- No public page shows the same photograph twice, confirmed in a browser and not only by the script.
- No card lost content in conversion — no dropped price, note, download link, linked route, or tag list.
- `types/content.ts`, `lib/utils/validators.ts`, `package.json`, `components/admin/` and `app/(admin)/` are unchanged.

## Known risks

**The SDG goals grid may not fit.** It is a two-column panel with a navy inner block and linked routes, unlike every other target. Task 3 Step 4 says to stop and report rather than force it. Deferring one grid is much cheaper than silently losing content.

**`audienceSections` will gain a card shell it does not have today.** That is a larger visual change than the other conversions, and worth John's eye specifically.

**Stock photography is roughly half the pool.** Every converted card that lacks an authored image gets a pool photograph, and the Unsplash half skews Western and corporate. The pool prefers local ITFYG photographs, but there are only 30 of them. This phase makes the shortage visible across the whole site rather than on two pages.
