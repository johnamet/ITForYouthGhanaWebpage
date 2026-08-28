# Phase 5: Card Slots and Image Guards — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the visual hierarchy the package cards lost during the media rollout, and extend the malformed-URL guard to the twenty `<Image>` call sites that still lack it.

**Architecture:** Two independent jobs sharing a phase. The first grows `ProseMediaCard` with three optional slots so a card family can express a prominent badge, a supporting line and a footnote — the package card is the immediate consumer, but the slots are generic. The second threads `safeImageSrc` through the remaining direct `next/image` callers, closing the same bad-data class that once returned a 500 on `/who-we-are/team`.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript 5.7, Tailwind 3.4. No dependency changes.

## Global Constraints

- **No test framework.** Do not add Vitest, Jest, `node --test`, or Playwright, and do not write test files. Verification is `npm run type-check`, `npm run lint`, `npm run build`, `npm run verify:media-pages`, and the dev server.
- **No dependency changes.** `package.json` untouched.
- **Do NOT wire any check into `prebuild`, a pre-commit hook, or CI.** John's standing preference is that verification stays something run deliberately, never something that blocks a build.
- **`types/content.ts`, `types/course.ts` and `lib/utils/validators.ts` are OUT OF SCOPE.** Presentation-only, as in every phase of this programme.
- **`components/admin/` and `app/(admin)/` are OUT OF SCOPE.**
- **`npm run verify:media-pages` must still pass at 35/35** at the end of each task.
- **We are NOT merging to `main`.** Work stays on `incircles`, which tracks `origin/incircles`. Commit locally; do not merge.
- **`npm run build` leaves a production `.next` that breaks `next dev`** with an unrelated `MODULE_NOT_FOUND` on `@opentelemetry`. Run `rm -rf .next` between a build and a dev-server check.
- **Do not regress earlier phases:** the anchor-nesting guard stays `Boolean(href) && !videoUrl && !cta`; `chrome="bare"` / `mediaFrame` keeps working; the spotlight variant's appearance is unchanged; `ProseMediaCard` stays a server component with no `Math.random`/`Date.now`/`new Date`.

---

### Task 1: Give ProseMediaCard a badge, an aside and a footnote

**Files:**
- Modify: `components/shared/prose-media-card.tsx`
- Modify: `components/organisations/organisation-service-page.tsx`

**Interfaces:**
- Produces: `ProseMediaCardProps` gains `badge?: { label?: string; value: string }`, `aside?: string`, and `footnote?: string`.

**Why.** The media rollout converted the package cards and, having nowhere to put them, folded three distinct pieces of information into one paragraph. Compare what they were against what they are:

| Before | After |
|---|---|
| Price in a navy `rounded-[20px] bg-brand-navy px-4 py-3` block, labelled "Pricing", value at `font-heading text-2xl font-bold` | `eyebrow` — plain gold uppercase, visually identical to a category label like "Service area" |
| Features on their own gold-rule line (`border-l-2 border-brand-gold pl-5`) | appended to the body as `Includes: a, b, c.` |
| Note as a muted `text-slate-500` paragraph | appended to the body |

Content survived; the hierarchy did not. On a pricing card the price is the thing a reader scans for, and it currently looks like a topic tag.

- [ ] **Step 1: Add the three props**

Extend `ProseMediaCardProps`:

```tsx
  /**
   * A prominent labelled value, rendered top-right of the text block. Built for
   * the price on a pricing card, where the number is what a reader scans for
   * and an `eyebrow` reads as a category label instead.
   */
  badge?: { label?: string; value: string };
  /**
   * A supporting line set off by the site's gold rule, below the prose. Use it
   * for content that belongs with the card but is not part of its prose — a
   * feature list, a set of tags.
   */
  aside?: string;
  /** A muted closing line, below everything else. */
  footnote?: string;
```

All three optional, all defaulting to absent, so every existing caller is unchanged.

- [ ] **Step 2: Render them**

In the text block, matching the retired markup exactly:

- **badge** — top-right of the title row. Restore the original treatment: a `rounded-[20px] bg-brand-navy px-4 py-3 text-white` block, with `label` (default `"Pricing"` is WRONG — do not default it; render the label element only when `label` is given) in `text-xs font-semibold uppercase tracking-[0.16em] text-brand-gold`, and `value` in `mt-2 font-heading text-2xl font-bold`.

  This means the title and badge now share a row. Wrap them in `flex flex-wrap items-start justify-between gap-4` **only when a badge is present**, so a card without one keeps exactly the markup it has today.

- **aside** — below the prose: `mt-6 border-l-2 border-brand-gold pl-5 text-sm leading-7 text-slate-600`, the site's established supporting-line treatment.

- **footnote** — below that: `mt-5 text-sm leading-7 text-slate-500`.

On the dark tone (`tone="dark"`), pick sensible equivalents rather than leaving slate text on navy — say what you chose. On the spotlight variant, these three slots are **not** rendered; that variant is a faithful port of a retired component and must not change. Say so in a comment.

- [ ] **Step 3: Use them on the package cards**

In `components/organisations/organisation-service-page.tsx`, rework the `packages` mapping so:

- `title` stays `item.name`
- `body` becomes **only** `item.description` — no more folded-in features or note
- `badge` becomes `{ label: "Pricing", value: item.price }`, rendered only when `item.price` is set
- `aside` becomes the comma-joined feature line — keep the comma join, do NOT pass features through `points`, which would punctuate each 1-3 word tag as its own sentence
- `footnote` becomes `item.note`
- `eyebrow` is dropped, since price no longer lives there

Update the block comment to describe the new mapping; the current one explains a workaround that no longer applies.

- [ ] **Step 4: Verify**

```bash
npm run type-check && npm run lint && npm run build && npm run verify:media-pages
```

- [ ] **Step 5: Visual check**

`rm -rf .next && npm run dev`, then open `/for-organisations/corporate-training` and `/for-organisations/sponsorships` — the two services that actually have packages. Confirm the navy price block is back top-right, the feature line has its gold rule, and the note reads as a muted closing line. Also open `/for-organisations/hire-graduates`, which has no packages, and confirm nothing changed there.

Then check a card family that passes none of the new props — `/our-impact` measurement cards — and confirm it renders exactly as before. Report all four HTTP statuses.

- [ ] **Step 6: Commit** (only once John has approved committing)

```bash
git add components/shared/prose-media-card.tsx components/organisations/organisation-service-page.tsx
git commit -m "feat: restore price, feature and note hierarchy on package cards"
```

---

### Task 2: Guard every CMS-fed image against a malformed URL

**Files:**
- Modify: up to 20 files under `components/` that call `next/image` directly (enumerated in Step 1)

**Interfaces:**
- Consumes: `safeImageSrc` from `@/lib/utils/image-src`.

**Why.** A malformed CMS `photo` value (`https:/files/...`, single slash) once reached `next/image` and took down `/who-we-are/team`. `safeImageSrc` fixes that class — it rejects protocol-relative values, non-http(s) protocols and hostnames absent from `next.config.mjs`'s `remotePatterns`, and repairs a single-slash typo on a configured host. But it currently guards only **3 of 23** `<Image>` call sites in public components. Seventeen to twenty remain unguarded, and the list includes `components/shared/editorial-image-hero.tsx` — the hero on nearly every page on the site.

- [ ] **Step 1: Enumerate and classify**

```bash
for f in $(grep -rl "next/image" --include="*.tsx" components | grep -v components/admin); do
  n=$(grep -c "<Image" "$f"); [ "$n" = "0" ] && continue
  grep -q "safeImageSrc" "$f" && s=guarded || s=UNGUARDED
  printf "%-9s %-2s %s\n" "$s" "$n" "$f"
done | sort
```

For each UNGUARDED file, read the `src` expression and classify it:

- **CMS-fed** — the value comes from content, the CMS, or a prop that traces back to either. **These must be guarded.**
- **Static** — a hardcoded path such as a bundled logo. **Leave these alone**; wrapping a literal adds noise and the guard cannot help.

Report the classification for every file. If you cannot tell, treat it as CMS-fed and guard it — a needless guard costs nothing, a missing one costs a page.

- [ ] **Step 2: Apply the guard**

For each CMS-fed site, wrap the `src` expression: `safeImageSrc(expr)`. Then handle the undefined case, because `safeImageSrc` returns `undefined` for a rejected value and `next/image` requires a `src`:

- Where the component already has a placeholder or fallback path, route the undefined case to it.
- Where it does not, guard the whole `<Image>` so it renders nothing rather than crashing — mirroring how `ContentImage` and the spotlight variant already handle it.
- **Never** substitute a different image silently where the component previously rendered nothing.

Add the import where missing. Do not restructure anything beyond what the guard requires.

- [ ] **Step 3: Confirm coverage**

Re-run Step 1's command. Every file you classified CMS-fed must now read `guarded`. Paste the before and after tables into your report.

- [ ] **Step 4: Verify**

```bash
npm run type-check && npm run lint && npm run build && npm run verify:media-pages
```

- [ ] **Step 5: Prove the guard works where it matters most**

`editorial-image-hero.tsx` is the highest-traffic instance. Exercise `safeImageSrc` directly and confirm it still behaves as built:

```bash
npx --yes tsx -e "
import { safeImageSrc } from './lib/utils/image-src';
for (const v of ['/images/logo/logo_small.jpg','https://files.itforyouthghana.org/x.jpg','https:/files.itforyouthghana.org/x.jpg','//files.itforyouthghana.org/x.jpg','https://drive.google.com/x.jpg','http://files.itforyouthghana.org/x.jpg','',undefined])
  console.log(JSON.stringify(v),'->',JSON.stringify(safeImageSrc(v as any)));
"
```

Expected: rooted path and configured https URL pass; the single-slash typo on a configured host is repaired to a working URL; protocol-relative, unconfigured host, plain http, empty and undefined all return undefined.

- [ ] **Step 6: Visual check**

`rm -rf .next && npm run dev`, then load `/`, `/who-we-are`, `/who-we-are/team`, `/news-and-updates`, `/our-impact/testimonials`, `/what-we-do`, and one department page. Every image that rendered before must still render — a guard that rejects a good URL is worse than the bug it prevents. Report each HTTP status and any image that disappeared.

- [ ] **Step 7: Commit** (only once John has approved committing)

```bash
git add components
git commit -m "fix: guard every CMS-fed image against a malformed URL"
```

---

## Definition of done

- `npm run type-check`, `npm run lint`, `npm run build` and `npm run verify:media-pages` all pass.
- Package cards show price in its navy block, features on a gold rule, and the note as a muted closing line.
- A card passing none of the three new props renders exactly as it did before.
- Every CMS-fed `<Image>` in public components routes its `src` through `safeImageSrc`, and every statically-sourced one is documented as deliberately skipped.
- No image that rendered before this phase has disappeared.
- `types/content.ts`, `lib/utils/validators.ts`, `package.json`, `components/admin/` and `app/(admin)/` are unchanged, and nothing was wired into the build.
