# Public page prose and media — Foundations

**Date:** 2026-08-26
**Status:** Draft, awaiting review
**Phase:** 1 of 4

## Why

Three presentation rules now govern every public page of the ITFYG site:

1. No bulleted content. Anything the CMS models as a string array renders as prose.
2. No decorative icons or emoji. Icons that act as the only label on a functional control stay.
3. Every prose block — section *and* card — is accompanied by an image or a video.

Applying those rules touches roughly twenty components and around three hundred
media slots. Doing it component by component would produce twenty slightly
different answers to the same three questions. This phase builds the three
shared pieces that the remaining phases consume, and changes no page.

## Programme shape

| Phase | Delivers | Reviewable as |
|---|---|---|
| 1. Foundations | `pointsToParagraph`, the media pool and resolver, `ProseMediaCard` | Type-check and build; no visual change |
| 2. Prose conversion | 13 list sites become paragraphs; number badges removed | Every public page, diffed against today |
| 3. De-iconing | Decorative glyphs, emoji fields, `icon-map.ts`, icon SVGs removed | Every public page |
| 4. Media rollout | `ProseMediaCard` adopted hub by hub | One hub at a time |

Phases 2 and 3 are independently shippable. Phase 4 depends on 1 and reads
better after 3, because the icon slot in each card becomes the media slot.

## Component 1 — `lib/utils/prose.ts`

Six public components already carry an identical inline helper that turns a
string array into a sentence run. The first copy is at
`components/shared/content-page.tsx:21`; the others are in
`editorial-guidance-grid`, `organisation-service-page`, `partnership-track-page`,
`impact-sdgs-page`, and `impact-reports-page`. Phase 2 would add a seventh. This
extracts one definition and deletes the copies.

```ts
/** Joins discrete content points into a single prose run. */
export function pointsToParagraph(points?: string[]): string;

/** Composes an authored body with its points, as the page components do today. */
export function composeProse(body?: string, points?: string[]): string;
```

`pointsToParagraph` trims each entry, discards empties, appends a full stop to
any entry not already ending in `.`, `!`, or `?`, and joins with a single space.
That is the existing behaviour, preserved exactly — including the `/[.!?]$/`
test, which deliberately does not special-case a trailing quote or bracket.
Empty or absent input returns `""`.

`composeProse` is the `[body, points].filter(Boolean).join(" ")` pattern that
`content-page.tsx:49` performs after calling the helper.

Both are pure and synchronous. No behavioural change is intended anywhere; if a
page renders differently after the swap, that is a bug in the extraction.

## Component 2 — `lib/content/media-pool.ts`

### The problem it solves

Phase 4 needs a photograph for every card that lacks one. The repository holds
31 photos in `public/images/randomPictures` and 18 in `public/images/people`,
against roughly 300 slots. Unsplash fills the gap; `images.unsplash.com` is
already an allowed `remotePatterns` host in `next.config.mjs`, so no
configuration change is required.

### Shape

```ts
export type PoolEntry = {
  url: string;   // an Unsplash URL, or a local path under /images/
  alt: string;   // describes the photograph, used when no imageAlt is authored
};

export type MediaTheme =
  | "training" | "coding" | "mentoring" | "community" | "girls-in-tech"
  | "entrepreneurship" | "partnership" | "corporate" | "graduation"
  | "rural" | "advocacy" | "youth" | "team" | "impact";

export const MEDIA_POOL: Record<MediaTheme, PoolEntry[]>;
```

Each theme carries at least eight entries, so the largest card group on any one
page can be filled without repetition. Entries are a mix of two sources: local
paths such as `/images/randomPictures/studentsblueclothing.jpg`, and Unsplash
URLs of the form
`https://images.unsplash.com/photo-<id>?auto=format&fit=crop&w=1200&q=70`. Local
photographs are listed first within each theme and so win the low hash indices,
because real photographs of the actual programme beat stock every time. Only the
Unsplash entries are subject to the verification script below; local paths are
checked for existence on disk instead.

### Resolution

```ts
export function resolveMedia(key: string, theme: MediaTheme): PoolEntry;
export function resolveMediaSet(keys: string[], theme: MediaTheme): PoolEntry[];
```

`resolveMedia` hashes `key` with FNV-1a and indexes the theme's pool by the
remainder. It must be deterministic and must not call `Math.random` or read the
clock: these components render on the server and hydrate on the client, and a
non-deterministic pick produces a hydration mismatch. The key is a stable
content identifier such as `` `${pageSlug}:${cardTitle}` ``, never an array index
alone, so reordering cards in the CMS does not reshuffle every photograph on the
page.

`resolveMediaSet` assigns to a sibling group. It hashes the first key to choose a
starting offset, then walks the pool with linear probing so that no two cards in
the group share a photograph while the group is no larger than the pool. Beyond
that size it wraps and repeats, which is the honest degradation.

### Precedence

Authored content always wins. A card renders `card.image` when set, falls back to
the resolver otherwise, and the same order applies to `imageAlt` over the pool
entry's `alt`. Resolution happens in the component at render time, not in the
`lib/cms/*.ts` getters — keeping derived media out of the data layer means the
admin editors keep showing authors what they actually set, and nobody has to
debug why a card carries a photograph no one chose.

### Verifying the URLs

Unsplash photo IDs cannot be confirmed by reading code, and a dead ID renders as
a broken image in production. `scripts/verify-media-pool.ts` issues a HEAD
request for every URL in the pool and exits non-zero on any non-200. It runs once
when the pool is populated and again in CI, so a photo withdrawn from Unsplash
fails the build rather than the page.

## Component 3 — `components/shared/prose-media-card.tsx`

The five repeating card families — step cards, service cards, evidence cards,
overview cards, focus cards — account for most of the ~300 slots and today each
implement their own variant of the same rounded-panel layout. This is the single
definition they move to.

```tsx
type ProseMediaCardProps = {
  eyebrow?: string;
  title: string;
  body?: string;
  points?: string[];              // joined via composeProse
  media?: { image?: string; imageAlt?: string; videoUrl?: string; videoTitle?: string };
  mediaKey: string;               // stable key for the resolver
  theme: MediaTheme;
  layout?: "stacked" | "side";    // media above, or beside on lg+
  tone?: "light" | "dark";        // white panel, or on brand-navy
  href?: string;
};
```

The caller supplies `theme`; the component never infers one. Phase 4 assigns a
theme per section as it converts each hub, which keeps the mapping from page
context to subject matter an editorial decision rather than a guess made from a
card title.

It builds on `components/media/content-image.tsx`, which already handles the
`fill`/`sizes`/`object-cover` treatment and has a deliberate empty state, and on
`components/media/video-card.tsx` when `videoUrl` is set — the same pairing
`StorySection` uses at `components/content/story-section.tsx:43`. Visual
treatment matches the existing card idiom: `rounded-[30px]`, `border-brand-border`,
`bg-white`, `shadow-sm`, with the dark tone rendering on `bg-brand-navy` with
`text-white/78` body copy.

`sizes` is set per layout — `(min-width: 1024px) 25vw, 100vw` for cards in the
four-column grids, `(min-width: 1024px) 50vw, 100vw` for `side`. Getting this
wrong is the main performance risk in phase 4: three hundred images served at
full width would be considerably worse than the icons they replace.

Cards in a grid are rendered `loading="lazy"` (the `next/image` default) with no
`priority`, so only the hero above the fold is eager.

## Data flow

```
CMS / seed config
      │
      ├─ card.image, card.imageAlt ──────────────┐
      │                                          ▼
      └─ card.title, card.body, card.bullets ─→ ProseMediaCard
                                                 │
                          composeProse(body, points) → one paragraph
                          media ?? resolveMedia(mediaKey, theme) → PoolEntry
                                                 │
                                                 ▼
                                  ContentImage | VideoCard  +  <p>
```

## Edge cases

**No points and no body.** `ProseMediaCard` renders nothing and returns `null`,
matching how the existing components guard their sections. A card that is only a
photograph is not prose, and an empty panel is worse than an absent one.

**Video without a thumbnail.** `VideoCard` accepts a null thumbnail and
`ContentImage` paints its gradient placeholder. The resolver supplies a
thumbnail in this case rather than leaving the gradient, since a poster frame
reads better than a block of colour.

**Pool smaller than the card group.** `resolveMediaSet` wraps and repeats rather
than throwing. A repeated photograph is a cosmetic problem; a build failure is
not worth it. The verification script reports any theme with fewer than eight
entries so the situation is visible before it ships.

**An Unsplash URL 404s at runtime.** `next/image` renders a broken image; there
is no client-side fallback and adding one would mean shipping an error boundary
around 300 images. The CI verification step is the control instead.

## Verification

This project has no test runner and is not getting one: `package.json` defines
only `dev`, `build`, `start`, `lint`, and `type-check`, and the `test-results/`
directory is a leftover Playwright artefact with no Playwright dependency behind
it. No test tooling is added by this programme.

Every phase is verified by:

- `npm run type-check`
- `npm run lint`
- `npm run build`
- Running the dev server and comparing the affected pages against their previous
  rendering.

For phase 1 specifically, the extraction of `pointsToParagraph` is proved by the
fact that it must change nothing: the six inline copies are replaced with calls
to one function that has the same body, so any visual difference on a page that
used them is a defect. The determinism of `resolveMedia` is proved by building
twice and confirming the same photographs land in the same slots, and by the
absence of hydration warnings in the dev console.

`scripts/verify-media-pool.ts` remains — it is a URL liveness check rather than
a test, run manually when the pool is populated or changed.

## Out of scope for this phase

- No page renders differently. Nothing in phases 2 to 4 happens here.
- No content type changes. Several types declare `icon: string` as required
  (`types/content.ts:202`, `:403`, `:506`, `:521`, `:631`, `:644`, `:795`, `:844`);
  making those optional and updating the admin forms belongs to phase 3.
- No admin UI changes. `components/admin` and `app/(admin)` keep their lists and
  icons throughout the programme.
- The `ArrowRight` link affordance is retained for now and revisited in phase 3.

## Risks

**The pool needs real photo IDs.** They cannot be written from memory with any
confidence. Implementation populates them from actual Unsplash searches and the
verification script proves each one resolves before the phase is called done.

**Auto-assigned photographs carry no semantic tie to their card.** A stock
classroom photo beside a paragraph about governance is filler, and at 300 slots
some of it will read as filler. Authored `card.image` values always win, so the
pool is the floor rather than the ceiling — the recommendation is to replace pool
picks with real ITFYG photography on the highest-traffic hubs over time.

**Page weight.** Three hundred photographs where there were icons is a real
change in bytes over the wire. The per-layout `sizes` values and lazy loading
are the mitigation; phase 4 checks Lighthouse on at least one representative hub
before rollout continues.
