# Public Page Prose and Media Foundations — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the three shared pieces — a prose helper, a themed media pool with a deterministic resolver, and a `ProseMediaCard` primitive — that phases 2 to 4 consume, without changing how any page renders.

**Architecture:** One pure module extracts the sentence-joining helper that seven call sites already duplicate. A second data module holds photograph entries grouped by subject theme, local ITFYG photography first, verified Unsplash URLs after, resolved by an FNV-1a hash of a stable content key so server and client agree. A third module is a presentational card that pairs prose with an image or video, built on the existing `ContentImage` and `VideoCard` primitives.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript 5.7, Tailwind 3.4, `next/image`. No new runtime dependencies.

**Spec:** `docs/superpowers/specs/2026-08-26-public-page-prose-and-media-foundations-design.md`

## Global Constraints

- **No test framework.** Do not add Vitest, Jest, `node --test`, or Playwright, and do not write test files. Verification is `npm run type-check`, `npm run lint`, `npm run build`, and visual comparison in the dev server.
- **No new runtime dependencies.** `package.json` `dependencies` must be unchanged by this phase.
- **Determinism is mandatory.** No `Math.random()`, no `Date.now()`, no `new Date()` in any resolver path. These components render on the server and hydrate on the client; a non-deterministic pick produces a hydration mismatch.
- **No page may change appearance in this phase.** `ProseMediaCard` is created but adopted by nobody until phase 4.
- **Branch:** work on `incircles`. Run the commit steps only after John has said to commit; otherwise leave the work staged and tell him.
- **Admin is out of scope.** Do not modify anything under `components/admin/` or `app/(admin)/`.
- **Image paths are case-sensitive.** `mave_peter.JPG`, `studentslisteningfrontal.JPG`, and `UXteacher.png` are not `.jpg`.
- **`public/images/randomPictures/studentgroupguys.jpg` is corrupt** and must never enter the pool. Task 5 replaces its four existing references.

---

### Task 1: Extract the prose helper

**Files:**
- Create: `lib/utils/prose.ts`
- Modify: `components/shared/content-page.tsx:21-27,48-49`
- Modify: `components/shared/editorial-guidance-grid.tsx:23`
- Modify: `components/organisations/organisation-service-page.tsx:87-92`
- Modify: `components/partnerships/partnership-track-page.tsx:87-92`
- Modify: `components/impact/impact-sdgs-page.tsx:96-100,155-159`
- Modify: `components/impact/impact-reports-page.tsx:143-148,176-180`

**Interfaces:**
- Consumes: nothing.
- Produces: `pointsToParagraph(points?: string[]): string` and `composeProse(body?: string, points?: string[]): string` from `@/lib/utils/prose`. Tasks 4 and all of phases 2 and 4 import these.

- [ ] **Step 1: Create the module**

Create `lib/utils/prose.ts`:

```ts
/**
 * Joins discrete content points into a single prose run.
 *
 * Public pages render list-shaped CMS content as paragraphs rather than
 * bullets, so every string array in the content model passes through here.
 * Each point is trimmed, empties are dropped, and a full stop is appended to
 * any point that does not already end in terminal punctuation.
 */
export function pointsToParagraph(points?: string[]): string {
  if (!points || points.length === 0) return "";

  return points
    .map((point) => (point || "").trim())
    .filter(Boolean)
    .map((point) => (/[.!?]$/.test(point) ? point : `${point}.`))
    .join(" ");
}

/** Composes an authored body with its points into one paragraph of prose. */
export function composeProse(body?: string, points?: string[]): string {
  return [body, pointsToParagraph(points)].filter(Boolean).join(" ");
}
```

- [ ] **Step 2: Replace the copy in `content-page.tsx`**

Delete lines 21-27 — the whole `const bulletsToParagraph = (bullets?: string[]) => { ... };` block. Add to the imports at the top of the file:

```ts
import { composeProse } from "@/lib/utils/prose";
```

Then replace these two lines inside the `sections.map` callback:

```tsx
            const bulletParagraph = bulletsToParagraph(section.bullets);
            const description = [section.body, bulletParagraph].filter(Boolean).join(" ");
```

with:

```tsx
            const description = composeProse(section.body, section.bullets);
```

- [ ] **Step 3: Replace the copy in `organisation-service-page.tsx`**

Add `import { composeProse } from "@/lib/utils/prose";` to the imports. Replace:

```tsx
              const bulletParagraph = (card.bullets || [])
                .map((b) => (b || "").trim())
                .filter(Boolean)
                .map((b) => (/[.!?]$/.test(b) ? b : `${b}.`))
                .join(" ");
              const description = [card.description, bulletParagraph].filter(Boolean).join(" ");
```

with:

```tsx
              const description = composeProse(card.description, card.bullets);
```

- [ ] **Step 4: Replace the copy in `partnership-track-page.tsx`**

Add `import { composeProse } from "@/lib/utils/prose";` to the imports. Replace:

```tsx
                const bulletParagraph = (card.bullets || [])
                  .map((b) => (b || "").trim())
                  .filter(Boolean)
                  .map((b) => (/[.!?]$/.test(b) ? b : `${b}.`))
                  .join(" ");
                const description = [card.description, bulletParagraph].filter(Boolean).join(" ");
```

with:

```tsx
                const description = composeProse(card.description, card.bullets);
```

- [ ] **Step 5: Replace both copies in `impact-sdgs-page.tsx`**

Add `import { pointsToParagraph } from "@/lib/utils/prose";` to the imports.

Replace the first IIFE (around line 95):

```tsx
                  {(() => {
                    const contributionsParagraph = (goal.contributions || [])
                      .map((c) => (c || "").trim())
                      .filter(Boolean)
                      .map((c) => (/[.!?]$/.test(c) ? c : `${c}.`))
                      .join(" ");
                    return (
                      <p className="text-sm leading-7 text-slate-700">{contributionsParagraph}</p>
                    );
                  })()}
```

with:

```tsx
                  <p className="text-sm leading-7 text-slate-700">
                    {pointsToParagraph(goal.contributions)}
                  </p>
```

Replace the second IIFE (around line 154):

```tsx
          {(() => {
            const principlesParagraph = (content.alignmentPrinciples || [])
              .map((p) => (p || "").trim())
              .filter(Boolean)
              .map((p) => (/[.!?]$/.test(p) ? p : `${p}.`))
              .join(" ");
            return (
              <p className="rounded-[26px] border border-brand-border bg-white px-5 py-5 text-sm leading-7 text-slate-700 shadow-sm">{principlesParagraph}</p>
            );
          })()}
```

with:

```tsx
          <p className="rounded-[26px] border border-brand-border bg-white px-5 py-5 text-sm leading-7 text-slate-700 shadow-sm">
            {pointsToParagraph(content.alignmentPrinciples)}
          </p>
```

- [ ] **Step 6: Replace both copies in `impact-reports-page.tsx`**

Add `import { composeProse, pointsToParagraph } from "@/lib/utils/prose";` to the imports.

Replace, inside the `evidenceCards.map` callback:

```tsx
              const bulletParagraph = (card.bullets || [])
                .map((b) => (b || "").trim())
                .filter(Boolean)
                .map((b) => (/[.!?]$/.test(b) ? b : `${b}.`))
                .join(" ");
              const description = [card.description, bulletParagraph].filter(Boolean).join(" ");
```

with:

```tsx
              const description = composeProse(card.description, card.bullets);
```

Then replace the method-notes IIFE:

```tsx
            {(() => {
              const notesParagraph = (content.methodologyPoints || [])
                .map((p) => (p || "").trim())
                .filter(Boolean)
                .map((p) => (/[.!?]$/.test(p) ? p : `${p}.`))
                .join(" ");
              return (
                <p className="mt-6 text-base leading-8 text-white/82">
                  {notesParagraph}
                </p>
              );
            })()}
```

with:

```tsx
            <p className="mt-6 text-base leading-8 text-white/82">
              {pointsToParagraph(content.methodologyPoints)}
            </p>
```

- [ ] **Step 7: Replace the variant copy in `editorial-guidance-grid.tsx`**

**This one is not identical to the others and changes rendered output.** Line 23 currently reads:

```tsx
        const supportingParagraph = section.bullets?.filter(hasText).join(" ");
```

It joins without normalising punctuation, so its output today can read `first point second point third point`. Switching it to the shared helper adds the missing full stops. That is the intended normalisation, not a regression — but it is the one visible text change in this task, so note it when reporting.

Add `import { pointsToParagraph } from "@/lib/utils/prose";` to the imports and replace line 23 with:

```tsx
        const supportingParagraph = pointsToParagraph(section.bullets);
```

- [ ] **Step 8: Confirm no copies remain**

Run:

```bash
grep -rn '\[.!?\]\$' --include="*.tsx" components app | grep -v components/admin
```

Expected: no output. Any hit is a copy that was missed.

- [ ] **Step 9: Verify**

```bash
npm run type-check && npm run lint && npm run build
```

Expected: all three pass. `content-page.tsx` must no longer reference `bulletsToParagraph`; the build fails on an unused import if a `composeProse` import was added to a file that does not use it.

- [ ] **Step 10: Visual check**

```bash
npm run dev
```

Visit `/who-we-are`, `/for-organisations/corporate-training`, `/partner-with-us/educational`, `/our-impact/sdgs`, and `/our-impact/reports`. Prose in the card bodies must read exactly as before. On any page rendering `EditorialGuidanceGrid`, the supporting paragraph now has full stops between points — expected.

- [ ] **Step 11: Commit** (only once John has approved committing)

```bash
git add lib/utils/prose.ts components/shared/content-page.tsx components/shared/editorial-guidance-grid.tsx components/organisations/organisation-service-page.tsx components/partnerships/partnership-track-page.tsx components/impact/impact-sdgs-page.tsx components/impact/impact-reports-page.tsx
git commit -m "refactor: extract pointsToParagraph and composeProse into lib/utils/prose"
```

---

### Task 2: Build the media pool and resolver

**Files:**
- Create: `lib/content/media-pool.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `PoolEntry` (`{ url: string; alt: string }`), the `MediaTheme` union, `MEDIA_POOL: Record<MediaTheme, PoolEntry[]>`, `resolveMedia(key: string, theme: MediaTheme): PoolEntry`, and `resolveMediaSet(keys: string[], theme: MediaTheme): PoolEntry[]`, all from `@/lib/content/media-pool`. Task 4 and all of phase 4 import these.

Every Unsplash ID below was checked to return HTTP 200, and every photograph — local and remote — was viewed before being assigned a theme. Local ITFYG photographs are listed first within each theme so they win the low hash indices.

- [ ] **Step 1: Create the module with types and hash**

Create `lib/content/media-pool.ts` beginning with:

```ts
/**
 * Photographs paired with prose on public pages.
 *
 * Public pages pair every prose block with an image or video. Where the CMS
 * carries no authored image, a card resolves one from this pool. Local ITFYG
 * photography is listed first in each theme so it wins the low hash indices;
 * Unsplash fills the remainder. `images.unsplash.com` is already an allowed
 * remotePatterns host in next.config.mjs.
 */

export type PoolEntry = {
  /** An Unsplash URL, or a local path under /images/. */
  url: string;
  /** Describes the photograph; used when the CMS carries no imageAlt. */
  alt: string;
};

export type MediaTheme =
  | "training"
  | "coding"
  | "mentoring"
  | "community"
  | "girls-in-tech"
  | "entrepreneurship"
  | "partnership"
  | "corporate"
  | "graduation"
  | "rural"
  | "advocacy"
  | "youth"
  | "team"
  | "impact";

const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=70`;

/**
 * FNV-1a. Chosen because it is tiny, dependency-free, and above all
 * deterministic — these components render on the server and hydrate on the
 * client, so the pick must not vary between the two.
 */
function fnv1a(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}
```

- [ ] **Step 2: Add the pool data**

Append to the same file:

```ts
const LOCAL = {
  banner: { url: "/images/randomPictures/children_holding_sign_in_streets.jpg", alt: "Young people holding an IT For Youth Ghana banner in the street." },
  gradFrontal: { url: "/images/randomPictures/frontalgraduation.jpg", alt: "Graduates in gowns seated at a cohort graduation ceremony." },
  girlsUx: { url: "/images/randomPictures/girlstaslkingUX.jpg", alt: "Young women working together at computers in a training lab." },
  graduation: { url: "/images/randomPictures/graduation.jpg", alt: "Graduates in caps and gowns at an IT For Youth Ghana ceremony." },
  graduations: { url: "/images/randomPictures/graduations.jpg", alt: "Graduates holding their ceremony programmes." },
  gradSpeaking: { url: "/images/randomPictures/graduationspeaking.jpg", alt: "The marquee set for a cohort graduation ceremony." },
  groupGirls: { url: "/images/randomPictures/group_girls.jpg", alt: "Participants in IT For Youth Ghana t-shirts standing together." },
  girlsEntrance: { url: "/images/randomPictures/groupofgirlsentrance.jpg", alt: "A group of young women in programme t-shirts outside the venue." },
  schoolHall: { url: "/images/randomPictures/groupworkstudents.jpg", alt: "School pupils in uniform raising their hands during a session." },
  happyStudents: { url: "/images/randomPictures/happystudentscasual.jpg", alt: "Pupils in uniform celebrating during a school tech club session." },
  mainGrad: { url: "/images/randomPictures/maingraduationpic.jpg", alt: "A large group portrait of graduates outdoors." },
  mavePeter: { url: "/images/randomPictures/mave_peter.JPG", alt: "Team members and a young participant at a media appearance." },
  lab: { url: "/images/randomPictures/mireiotalking.jpg", alt: "Facilitators working with learners in a computer lab." },
  assembly: { url: "/images/randomPictures/peterblackboard.jpg", alt: "A school assembly hall full of seated pupils." },
  eventSpeaker: { url: "/images/randomPictures/peterTalking.jpg", alt: "A speaker addressing the Code Impact Challenge audience." },
  cohortGirls: { url: "/images/randomPictures/petertalkingtostudentscoloful.jpg", alt: "Cohort participants in programme t-shirts together." },
  pupilsHands: { url: "/images/randomPictures/redclothingStudents.jpg", alt: "Pupils in school uniform with hands raised in a hall." },
  pupilsHall: { url: "/images/randomPictures/redstudentgrouplesson.jpg", alt: "Pupils gathered in a school hall for a tech club session." },
  podium: { url: "/images/randomPictures/studentpresenting.jpg", alt: "A presenter speaking at a podium beside a projector screen." },
  gradSpeech: { url: "/images/randomPictures/studentpresentin.jpg", alt: "A graduate giving a speech at the ceremony podium." },
  coding: { url: "/images/randomPictures/studentsBackcoding.jpg", alt: "Learners writing code at desktop computers." },
  labBlue: { url: "/images/randomPictures/studentsblueclothing.jpg", alt: "Learners at workstations during a training session." },
  gradSeated: { url: "/images/randomPictures/studentslisteningfrontal.JPG", alt: "Gowned graduates seated under the ceremony marquee." },
  gradListening: { url: "/images/randomPictures/studentslistening.jpg", alt: "Graduates listening during the ceremony." },
  workshop: { url: "/images/randomPictures/UX4.jpg", alt: "Participants at tables with laptops during a workshop." },
  uxCourse: { url: "/images/randomPictures/UXcours.jpg", alt: "Women working on laptops during a UX design course." },
  uxStudents: { url: "/images/randomPictures/uXstudents.jpg", alt: "A classroom of participants working on laptops." },
  facilitator: { url: "/images/randomPictures/UXteacher_opt.jpg", alt: "A facilitator presenting at a whiteboard beside programme banners." },
  facilitator2: { url: "/images/randomPictures/UXteacher.png", alt: "A facilitator leading a session at the whiteboard." },
  classroomPair: { url: "/images/randomPictures/whiteLady.jpg", alt: "A facilitator working with a learner in the classroom." },
} satisfies Record<string, PoolEntry>;

export const MEDIA_POOL: Record<MediaTheme, PoolEntry[]> = {
  training: [
    LOCAL.labBlue, LOCAL.pupilsHall, LOCAL.gradListening, LOCAL.lab, LOCAL.uxStudents, LOCAL.workshop,
    { url: UNSPLASH("photo-1509062522246-3755977927d7"), alt: "A classroom of pupils working with their teacher." },
    { url: UNSPLASH("photo-1524178232363-1fb2b075b655"), alt: "Rows of learners seated in a large lecture room." },
  ],
  coding: [
    LOCAL.coding, LOCAL.labBlue, LOCAL.girlsUx, LOCAL.lab,
    { url: UNSPLASH("photo-1531482615713-2afd69097998"), alt: "Developers working at computers in a studio." },
    { url: UNSPLASH("photo-1516321318423-f06f85e504b3"), alt: "Hands typing on a laptop keyboard." },
    { url: UNSPLASH("photo-1531538606174-0f90ff5dce83"), alt: "Colleagues pointing at code on a laptop screen." },
    { url: UNSPLASH("photo-1497633762265-9d179a990aa6"), alt: "A stack of programming books." },
  ],
  mentoring: [
    LOCAL.facilitator, LOCAL.facilitator2, LOCAL.classroomPair, LOCAL.mavePeter, LOCAL.uxCourse,
    { url: UNSPLASH("photo-1543269865-cbf427effbad"), alt: "Young people collaborating around a table." },
    { url: UNSPLASH("photo-1600880292203-757bb62b4baf"), alt: "Two colleagues celebrating over a laptop." },
    { url: UNSPLASH("photo-1531545514256-b1400bc00f31"), alt: "A small group gathered around a laptop, smiling." },
  ],
  community: [
    LOCAL.banner, LOCAL.schoolHall, LOCAL.happyStudents, LOCAL.assembly, LOCAL.pupilsHands,
    { url: UNSPLASH("photo-1488521787991-ed7bbaae773c"), alt: "Children smiling and reaching towards the camera." },
    { url: UNSPLASH("photo-1541844053589-346841d0b34c"), alt: "Children gathered together outdoors, smiling." },
    { url: UNSPLASH("photo-1509099836639-18ba1795216d"), alt: "A group of children laughing together." },
  ],
  "girls-in-tech": [
    LOCAL.groupGirls, LOCAL.girlsEntrance, LOCAL.cohortGirls, LOCAL.girlsUx, LOCAL.uxCourse,
    { url: UNSPLASH("photo-1571260899304-425eee4c7efc"), alt: "A student standing with books beside her study group." },
    { url: UNSPLASH("photo-1573497019940-1c28c88b4f3e"), alt: "A woman smiling in a professional setting." },
    { url: UNSPLASH("photo-1573164713988-8665fc963095"), alt: "A young professional woman beside a window." },
  ],
  entrepreneurship: [
    LOCAL.podium, LOCAL.gradSpeech, LOCAL.workshop,
    { url: UNSPLASH("photo-1552664730-d307ca884978"), alt: "A team planning against a wall of sticky notes." },
    { url: UNSPLASH("photo-1454165804606-c3d57bc86b40"), alt: "Hands sketching plans beside a laptop." },
    { url: UNSPLASH("photo-1591115765373-5207764f72e7"), alt: "An audience at a startup meetup." },
    { url: UNSPLASH("photo-1434030216411-0b793f4b4173"), alt: "A hand writing notes beside a coffee cup." },
    { url: UNSPLASH("photo-1503945438517-f65904a52ce6"), alt: "Game pieces arranged to suggest strategy." },
  ],
  partnership: [
    LOCAL.mavePeter, LOCAL.eventSpeaker, LOCAL.podium,
    { url: UNSPLASH("photo-1600880292203-757bb62b4baf"), alt: "Two colleagues celebrating over a laptop." },
    { url: UNSPLASH("photo-1517048676732-d65bc937f952"), alt: "A team meeting around a long table." },
    { url: UNSPLASH("photo-1522071820081-009f0129c71c"), alt: "Colleagues working together in a shared workspace." },
    { url: UNSPLASH("photo-1517245386807-bb43f82c33c4"), alt: "Hands gesturing towards charts on a laptop." },
    { url: UNSPLASH("photo-1521737604893-d14cc237f11d"), alt: "A group working together at a long table." },
  ],
  corporate: [
    LOCAL.workshop, LOCAL.uxCourse, LOCAL.uxStudents,
    { url: UNSPLASH("photo-1544717297-fa95b6ee9643"), alt: "A professional working at a desk with a laptop." },
    { url: UNSPLASH("photo-1560250097-0b93528c311a"), alt: "A professional portrait in an office setting." },
    { url: UNSPLASH("photo-1517048676732-d65bc937f952"), alt: "A team meeting around a long table." },
    { url: UNSPLASH("photo-1524178232363-1fb2b075b655"), alt: "Rows of attendees in a large conference room." },
    { url: UNSPLASH("photo-1522071820081-009f0129c71c"), alt: "Colleagues working in a shared workspace." },
  ],
  graduation: [
    LOCAL.gradFrontal, LOCAL.graduation, LOCAL.graduations, LOCAL.gradSpeaking, LOCAL.mainGrad, LOCAL.gradSeated, LOCAL.gradListening,
    { url: UNSPLASH("photo-1541339907198-e08756dedf3f"), alt: "Graduates throwing their caps at sunset." },
  ],
  rural: [
    LOCAL.banner, LOCAL.schoolHall, LOCAL.assembly, LOCAL.pupilsHands,
    { url: UNSPLASH("photo-1509391366360-2e959784a276"), alt: "Solar panels in an open field." },
    { url: UNSPLASH("photo-1541844053589-346841d0b34c"), alt: "Children gathered together outdoors." },
    { url: UNSPLASH("photo-1509099836639-18ba1795216d"), alt: "A group of children laughing together." },
    { url: UNSPLASH("photo-1488521787991-ed7bbaae773c"), alt: "Children reaching towards the camera." },
  ],
  advocacy: [
    LOCAL.banner, LOCAL.eventSpeaker, LOCAL.podium, LOCAL.gradSpeech,
    { url: UNSPLASH("photo-1591115765373-5207764f72e7"), alt: "An audience listening at a public talk." },
    { url: UNSPLASH("photo-1488521787991-ed7bbaae773c"), alt: "Children reaching towards the camera." },
    { url: UNSPLASH("photo-1503945438517-f65904a52ce6"), alt: "Game pieces arranged to suggest a lone voice." },
    { url: UNSPLASH("photo-1541844053589-346841d0b34c"), alt: "Children gathered together outdoors." },
  ],
  youth: [
    LOCAL.groupGirls, LOCAL.girlsEntrance, LOCAL.happyStudents, LOCAL.pupilsHands, LOCAL.schoolHall,
    { url: UNSPLASH("photo-1517486808906-6ca8b3f04846"), alt: "Young people sitting together on a bench outdoors." },
    { url: UNSPLASH("photo-1522202176988-66273c2fd55f"), alt: "Three young people studying together at a laptop." },
    { url: UNSPLASH("photo-1543269865-cbf427effbad"), alt: "Young people collaborating around a table." },
  ],
  team: [
    LOCAL.mavePeter, LOCAL.eventSpeaker, LOCAL.facilitator, LOCAL.facilitator2, LOCAL.classroomPair,
    { url: UNSPLASH("photo-1573497019940-1c28c88b4f3e"), alt: "A team member smiling in a professional setting." },
    { url: UNSPLASH("photo-1560250097-0b93528c311a"), alt: "A professional portrait in an office setting." },
    { url: UNSPLASH("photo-1573164713988-8665fc963095"), alt: "A young professional beside a window." },
  ],
  impact: [
    LOCAL.graduations, LOCAL.mainGrad, LOCAL.podium, LOCAL.gradSpeech, LOCAL.gradFrontal,
    { url: UNSPLASH("photo-1541339907198-e08756dedf3f"), alt: "Graduates throwing their caps at sunset." },
    { url: UNSPLASH("photo-1434030216411-0b793f4b4173"), alt: "A hand writing notes beside a coffee cup." },
    { url: UNSPLASH("photo-1517245386807-bb43f82c33c4"), alt: "Hands gesturing towards charts on a laptop." },
  ],
};
```

- [ ] **Step 3: Add the resolvers**

Append to the same file:

```ts
/** Picks a stable photograph for a single card. */
export function resolveMedia(key: string, theme: MediaTheme): PoolEntry {
  const pool = MEDIA_POOL[theme];
  return pool[fnv1a(key) % pool.length];
}

/**
 * Picks photographs for a group of sibling cards, avoiding repeats within the
 * group. Once the pool is exhausted the used set is cleared and photographs
 * repeat, which is the honest degradation for a group larger than its pool.
 */
export function resolveMediaSet(keys: string[], theme: MediaTheme): PoolEntry[] {
  const pool = MEDIA_POOL[theme];
  const used = new Set<number>();

  return keys.map((key) => {
    if (used.size >= pool.length) used.clear();
    let index = fnv1a(key) % pool.length;
    while (used.has(index)) index = (index + 1) % pool.length;
    used.add(index);
    return pool[index];
  });
}
```

- [ ] **Step 4: Verify**

```bash
npm run type-check && npm run lint
```

Expected: both pass. `as const satisfies Record<string, PoolEntry>` requires TypeScript 4.9+; the project is on 5.7.

- [ ] **Step 5: Commit** (only once John has approved committing)

```bash
git add lib/content/media-pool.ts
git commit -m "feat: add themed media pool with deterministic resolver"
```

---

### Task 3: Add the pool verification script

**Files:**
- Create: `scripts/verify-media-pool.mjs`
- Modify: `package.json` (scripts block only)

**Interfaces:**
- Consumes: `MEDIA_POOL` from Task 2 — but reads it by parsing rather than importing, so the script needs no TypeScript loader.
- Produces: an `npm run verify:media` script.

- [ ] **Step 1: Create the script**

Create `scripts/verify-media-pool.mjs`:

```js
// Checks that every photograph referenced by lib/content/media-pool.ts still
// resolves: local files must exist on disk, Unsplash URLs must return 200.
// Run after changing the pool. A photograph withdrawn from Unsplash renders as
// a broken image in production, and this is the only thing that catches it.

import { readFile, access } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const source = await readFile(join(root, "lib/content/media-pool.ts"), "utf8");

const unsplashIds = [...source.matchAll(/UNSPLASH\("([^"]+)"\)/g)].map((m) => m[1]);
const localPaths = [...source.matchAll(/url:\s*"(\/images\/[^"]+)"/g)].map((m) => m[1]);

let failures = 0;

for (const path of new Set(localPaths)) {
  try {
    await access(join(root, "public", path));
  } catch {
    console.error(`MISSING  ${path}`);
    failures += 1;
  }
}

for (const id of new Set(unsplashIds)) {
  const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=400&q=60`;
  try {
    const response = await fetch(url, { method: "HEAD" });
    if (!response.ok) {
      console.error(`HTTP ${response.status}  ${id}`);
      failures += 1;
    }
  } catch (error) {
    console.error(`ERROR  ${id}  ${error.message}`);
    failures += 1;
  }
}

const themes = [...source.matchAll(/^  "?([a-z-]+)"?:\s*\[$/gm)].map((m) => m[1]);
console.log(
  `Checked ${new Set(localPaths).size} local and ${new Set(unsplashIds).size} Unsplash photographs across ${themes.length} themes.`,
);

if (failures) {
  console.error(`${failures} failed.`);
  process.exit(1);
}
console.log("All photographs resolve.");
```

- [ ] **Step 2: Register the script**

In `package.json`, add to the `scripts` block, after `"type-check"`:

```json
    "verify:media": "node scripts/verify-media-pool.mjs"
```

Remember the comma on the preceding line. Do not touch `dependencies` or `devDependencies`.

- [ ] **Step 3: Run it**

```bash
npm run verify:media
```

Expected: `All photographs resolve.` and exit code 0. If a local path fails, the likely cause is file extension case — `mave_peter.JPG`, `studentslisteningfrontal.JPG`, and `UXteacher.png` are not `.jpg`.

- [ ] **Step 4: Commit** (only once John has approved committing)

```bash
git add scripts/verify-media-pool.mjs package.json
git commit -m "chore: add media pool verification script"
```

---

### Task 4: Build the ProseMediaCard primitive

**Files:**
- Create: `components/shared/prose-media-card.tsx`

**Interfaces:**
- Consumes: `composeProse` from `@/lib/utils/prose` (Task 1); `resolveMedia`, `PoolEntry`, `MediaTheme` from `@/lib/content/media-pool` (Task 2); `ContentImage` from `@/components/media/content-image`; `VideoCard` from `@/components/media/video-card`.
- Produces: `ProseMediaCard` and the `ProseMediaCardProps` type from `@/components/shared/prose-media-card`. Phase 4 imports these.

- [ ] **Step 1: Create the component**

Create `components/shared/prose-media-card.tsx`:

```tsx
import Link from "next/link";

import { ContentImage } from "@/components/media/content-image";
import { VideoCard } from "@/components/media/video-card";
import { resolveMedia, type MediaTheme } from "@/lib/content/media-pool";
import { composeProse } from "@/lib/utils/prose";
import { cn } from "@/lib/utils/cn";

export type ProseMediaCardProps = {
  eyebrow?: string;
  title: string;
  body?: string;
  /** Rendered as prose, never as a list. */
  points?: string[];
  /** Authored media always wins over the pool. */
  media?: {
    image?: string;
    imageAlt?: string;
    videoUrl?: string;
    videoTitle?: string;
  };
  /** Stable content key for the resolver — never a bare array index. */
  mediaKey: string;
  theme: MediaTheme;
  /** Media above the prose, or beside it from lg up. */
  layout?: "stacked" | "side";
  tone?: "light" | "dark";
  href?: string;
  className?: string;
};

/**
 * A prose block paired with a photograph or video.
 *
 * Public pages pair every prose block with media, so this is the shared shape
 * the repeating card families use. When the CMS carries no image, one is
 * resolved deterministically from the themed pool.
 */
export function ProseMediaCard({
  eyebrow,
  title,
  body,
  points,
  media,
  mediaKey,
  theme,
  layout = "stacked",
  tone = "light",
  href,
  className,
}: ProseMediaCardProps) {
  const description = composeProse(body, points);

  if (!title.trim() && !description) return null;

  const isDark = tone === "dark";
  const fallback = resolveMedia(mediaKey, theme);
  const image = media?.image?.trim() || fallback.url;
  const imageAlt = media?.imageAlt?.trim() || fallback.alt;
  const videoUrl = media?.videoUrl?.trim();

  const visual = videoUrl ? (
    <VideoCard thumbnail={image} title={media?.videoTitle?.trim() || title} videoUrl={videoUrl} />
  ) : (
    <ContentImage
      src={image}
      alt={imageAlt}
      aspectRatio={layout === "side" ? "landscape" : "wide"}
      sizes={layout === "side" ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 100vw"}
    />
  );

  const text = (
    <div>
      {eyebrow ? (
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
          {eyebrow}
        </p>
      ) : null}
      {title.trim() ? (
        <h3
          className={cn(
            "font-heading text-2xl font-bold",
            eyebrow ? "mt-4" : null,
            isDark ? "text-white" : "text-brand-ink",
          )}
        >
          {title}
        </h3>
      ) : null}
      {description ? (
        <p className={cn("mt-3 text-sm leading-7", isDark ? "text-white/78" : "text-slate-600")}>
          {description}
        </p>
      ) : null}
    </div>
  );

  const content =
    layout === "side" ? (
      <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
        {visual}
        {text}
      </div>
    ) : (
      <div className="space-y-5">
        {visual}
        {text}
      </div>
    );

  const shell = cn(
    "rounded-[30px] p-6 shadow-sm",
    isDark ? "bg-brand-navy" : "border border-brand-border bg-white",
    href
      ? "transition hover:shadow-editorial focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
      : null,
    className,
  );

  if (href) {
    return (
      <Link href={href} className={cn("block", shell)}>
        {content}
      </Link>
    );
  }

  return <div className={shell}>{content}</div>;
}
```

- [ ] **Step 2: Verify it compiles**

```bash
npm run type-check && npm run lint && npm run build
```

Expected: all pass. The component is not yet imported anywhere, so the build output should be byte-identical in page terms — no route sizes change.

- [ ] **Step 3: Confirm nothing adopted it early**

```bash
grep -rn "prose-media-card\|ProseMediaCard" --include="*.ts" --include="*.tsx" components app \
  | grep -v "components/shared/prose-media-card.tsx"
```

Expected: no output. The component must be imported by nobody in this phase — adoption is phase 4. Since nothing imports it, no page can have changed, which is the guarantee this step exists to prove.

- [ ] **Step 4: Commit** (only once John has approved committing)

```bash
git add components/shared/prose-media-card.tsx
git commit -m "feat: add ProseMediaCard primitive pairing prose with media"
```

---

### Task 5: Replace the corrupt photograph

**Files:**
- Modify: `lib/content/site-config.ts:677,944,987,2324`

**Interfaces:**
- Consumes: nothing.
- Produces: nothing. This is an isolated content fix.

`public/images/randomPictures/studentgroupguys.jpg` is a corrupt JPEG — it declares 3000×2250 but holds 134KB and decodes to a near-uniform pale blue with a truncated data segment. It is currently the hero image of `/what-we-do/tech-clubs` and appears in three galleries, so those are rendering a blank rectangle today. This is a pre-existing bug, not something this programme introduced, but the file must leave the codebase before the pool work makes it look intentional.

- [ ] **Step 1: Confirm the corruption**

```bash
magick identify -verbose public/images/randomPictures/studentgroupguys.jpg 2>&1 | grep -i "corrupt\|premature" || echo "no corruption reported"
```

Expected: a "Corrupt JPEG data: premature end of data segment" warning. If it reports nothing, stop — the file may have been replaced since this plan was written, and this task is then unnecessary.

- [ ] **Step 2: Replace the four references**

In `lib/content/site-config.ts`:

- Line 677, in the `code-impact-challenge` gallery, change the `src` to `/images/randomPictures/studentpresenting.jpg` and the `alt` to `"Participants presenting their work at the showcase."`
- Line 944, the `tech-clubs` `heroImage`, change to `/images/randomPictures/happystudentscasual.jpg`
- Line 987, in the `tech-clubs` gallery, change the `src` to `/images/randomPictures/groupworkstudents.jpg` and the `alt` to `"Pupils taking part in a school-based tech club session."`
- Line 2324, the article image, change to `/images/randomPictures/petertalkingtostudentscoloful.jpg`

- [ ] **Step 3: Delete the corrupt file**

```bash
git rm public/images/randomPictures/studentgroupguys.jpg
```

- [ ] **Step 4: Confirm nothing still references it**

```bash
grep -rn "studentgroupguys" --include="*.ts" --include="*.tsx" --include="*.json" . | grep -v node_modules || echo "no references remain"
```

Expected: `no references remain`.

- [ ] **Step 5: Verify**

```bash
npm run type-check && npm run lint && npm run build && npm run verify:media
```

Expected: all pass.

- [ ] **Step 6: Visual check**

Run `npm run dev` and visit `/what-we-do/tech-clubs`. The hero must now show a real photograph rather than a blank pale-blue rectangle.

- [ ] **Step 7: Commit** (only once John has approved committing)

```bash
git add lib/content/site-config.ts
git commit -m "fix: replace corrupt studentgroupguys.jpg used as tech-clubs hero"
```

---

## Deviation from the spec

Task 5 is not in the design document. The corrupt `studentgroupguys.jpg` was
found while surveying the photo library for the pool, and it is currently the
hero of a live page. It sits squarely in this phase's subject matter and is a
few minutes' work, so it is folded in here rather than filed separately — but it
is an addition to the approved scope and should be called out when reporting.

## Definition of done for phase 1

- `npm run type-check`, `npm run lint`, `npm run build`, and `npm run verify:media` all pass.
- No inline `[.!?]$` punctuation-normalising copy remains outside `lib/utils/prose.ts`.
- No public page renders differently, with the two intended exceptions: `EditorialGuidanceGrid` supporting paragraphs gain terminal punctuation, and `/what-we-do/tech-clubs` gains a working hero image.
- `ProseMediaCard` exists and compiles but is imported by nothing.
