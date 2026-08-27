# Phase 3: De-iconing — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove every decorative icon and emoji from public pages, keeping the icons that do a job and keeping authored `iconImage` artwork.

**Architecture:** Presentation-only, exactly like phase 2. `types/content.ts`, `lib/utils/validators.ts` and the admin forms are all untouched — the CMS keeps its `icon` fields and authors keep filling them in; the public components simply stop rendering them. The emoji-to-SVG bridge (`lib/utils/icon-map.ts`) and the 23 SVGs it maps to become unreachable and are deleted.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript 5.7, Tailwind 3.4, `lucide-react`. No dependency changes — `lucide-react` stays, because the functional icons remain.

**Spec:** `docs/superpowers/specs/2026-08-26-public-page-prose-and-media-foundations-design.md` (programme row 3).

## Global Constraints

- **No test framework.** Do not add Vitest, Jest, `node --test`, or Playwright, and do not write test files. Verification is `npm run type-check`, `npm run lint`, `npm run build`, and visual comparison in the dev server.
- **No dependency changes.** `package.json` untouched. Do NOT uninstall `lucide-react`.
- **`types/content.ts` and `lib/utils/validators.ts` are OUT OF SCOPE.** John chose presentation-only. Leave every `icon: string` field and every validator as they are. Authors will keep seeing icon inputs that render nothing; that is the accepted cost of this approach and is recorded as such.
- **`components/admin/` and `app/(admin)/` are OUT OF SCOPE.** Admin UI may keep every icon it likes.
- **`iconImage` MUST KEEP WORKING.** It holds authored image URLs an editor deliberately chose. Only the emoji tier and the emoji-derived SVG tier are removed. Where a component resolves `image || iconImage || emojiToIconImage(icon)`, the result must become `image || iconImage`.
- **Branch:** `incircles`. Commit locally; do not push, merge, or touch `main`.
- **These pages WILL change appearance.** That is the deliverable.

## The keep-list — icons that stay, and why

Do not remove any of these. Each is the sole affordance on a control, or conveys state.

| Icon | Files | Why it stays |
|---|---|---|
| `X` | `announcement-bar`, `site-header`, `featured-story-video`, `initiative-gallery`, `what-we-do-gallery`, `floating-elements` | Close buttons with no text label |
| `ChevronLeft` / `ChevronRight` | `hero-slideshow`, `testimonials-section` | Carousel controls |
| `ChevronDown` | `site-header` | Dropdown affordance |
| `ArrowDown` | `hero-slideshow` | Scroll cue |
| `ArrowUp` | `floating-elements` | Scroll-to-top control |
| `Play` / `PlayCircle` | `video-card`, `featured-story-video`, `what-we-do-gallery`, `course-detail-card` | Video play trigger |
| `Search` | `training-course-catalog` | Search field affordance |
| `Loader2`, `AlertCircle`, `CheckCircle2` | `contact-form` | Submit and validation state |
| `ArrowRight` / `ArrowUpRight` | `story-section`, `latest-news-grid`, `programme-showcase`, `departments-index-page`, `contact-page`, `donation-campaign`, `join-cta-block`, `article-card`, `news-hub-page`, `news-listing-page`, `training-course-catalog`, `who-we-are-page`, `hero-slideshow` | Direction cue on an interactive element. John's rule was "not the ones with purpose"; a link arrow is a conventional affordance cue, not ornament. This is a controller ruling — flag it if you disagree, do not act unilaterally. |

Everything else in a `lucide-react` import on a public component is decoration and goes.

---

### Task 1: Remove the emoji tier and delete the emoji-to-SVG bridge

Twelve files render an emoji `icon`, either directly or through `emojiToIconImage`. In every case, authored `image` and `iconImage` must keep working; only the emoji path goes.

**Files:**
- Modify: `components/shared/alternating-feature-row.tsx`
- Modify: `components/home/impact-counter.tsx`
- Modify: `components/home/programme-showcase.tsx`
- Modify: `components/departments/departments-index-page.tsx`
- Modify: `components/training/training-process-strip.tsx`
- Modify: `components/training/training-how-it-works-page.tsx`
- Modify: `components/partnerships/partnership-track-page.tsx`
- Modify: `components/organisations/organisation-service-page.tsx`
- Modify: `components/what-we-do/initiative-page.tsx`
- Modify: `components/impact/impact-reports-page.tsx`
- Modify: `components/impact/impact-overview-page.tsx`
- Modify: `components/impact/impact-sdgs-page.tsx`
- Delete: `lib/utils/icon-map.ts`
- Delete: `public/images/icons/` (all 23 SVGs)

**Interfaces:**
- Consumes: nothing.
- Produces: `emojiToIconImage` no longer exists. No other task may reference it.

- [ ] **Step 1: Remove the emoji fallback where media is resolved**

Three files resolve a visual through a three-tier chain. In each, drop the emoji tier and the `emojiToIconImage` import, keeping the first two tiers.

`components/shared/alternating-feature-row.tsx` — change:

```tsx
        const visual = item.image || item.iconImage || (item.icon ? emojiToIconImage(item.icon) : undefined);
```

to:

```tsx
        const visual = item.image || item.iconImage;
```

`components/partnerships/partnership-track-page.tsx` — change:

```tsx
                const image = (card.image || card.iconImage || (emojiToIconImage(card.icon) as string | undefined)) as string | undefined;
```

to:

```tsx
                const image = (card.image || card.iconImage) as string | undefined;
```

`components/what-we-do/initiative-page.tsx` — find the `AlternatingFeatureRow` items mapping and change:

```tsx
                  iconImage: step.iconImage ?? (emojiToIconImage(step.icon) || undefined),
```

to:

```tsx
                  iconImage: step.iconImage,
```

Then remove the `icon: step.icon,` line from that same object literal — with the emoji tier gone, `AlternatingFeatureRow` no longer consumes it. If `AlternatingFeatureItem` still declares `icon?: string`, remove that field from the type in `alternating-feature-row.tsx` too, since nothing sets or reads it any more.

- [ ] **Step 2: Remove the icon blocks that render an emoji or its SVG**

Four files render a block of the shape "if there is an icon image show it, otherwise show the emoji". The whole block goes, because `iconImage` is displayed elsewhere in these components or not at all — read each one and confirm before deleting.

In `components/training/training-process-strip.tsx`, `components/organisations/organisation-service-page.tsx`, and `components/partnerships/partnership-track-page.tsx`, delete the conditional icon `<span>`/`<Image>` block of this shape:

```tsx
              {(() => step.iconImage ?? emojiToIconImage(step.icon))() ? (
                <span className="inline-flex items-center justify-center" aria-hidden="true">
                  <Image src={(step.iconImage ?? emojiToIconImage(step.icon)) as string} alt={step.title} width={28} height={28} className="h-7 w-7 object-contain" />
                </span>
              ) : (
                <span className="text-3xl" aria-hidden="true">
                  {step.icon}
                </span>
              )}
```

**and replace it with a plain `iconImage`-only block**, so authored artwork survives:

```tsx
              {step.iconImage ? (
                <span className="inline-flex items-center justify-center" aria-hidden="true">
                  <Image src={step.iconImage} alt={step.title} width={28} height={28} className="h-7 w-7 object-contain" />
                </span>
              ) : null}
```

Phase 2 left each of these inside a `<div className="flex items-center justify-between">` that held the icon and a now-deleted number badge. **Collapse that wrapper now**: if the only remaining child is this icon block, remove the wrapper `<div>` and let the icon block stand alone, then check the following heading's top-margin class still makes sense.

In `components/home/impact-counter.tsx` and `components/departments/departments-index-page.tsx`, do the same — reduce the three-tier block to an `iconImage`-only block. In `departments-index-page.tsx` note the emoji fallback is written as `department.icon ?? "•"`; that bullet-character fallback goes with it.

- [ ] **Step 3: Remove bare emoji renders**

Five sites render an emoji directly with no image tier. Delete the element that renders it, and any wrapper left holding nothing:

- `components/home/programme-showcase.tsx` — the element rendering `{item.icon ?? "•"}`
- `components/impact/impact-reports-page.tsx` — the element rendering `{card.icon}`
- `components/impact/impact-overview-page.tsx` — the element rendering `{card.icon}`
- `components/impact/impact-sdgs-page.tsx` — the element rendering `{goal.icon}`

In `components/training/training-how-it-works-page.tsx`, delete the module-level array:

```tsx
const stepIcons = ["🧭", "📝", "✅", "🚀"];
```

and remove the `icon: stepIcons[index] ?? "•",` line from the object literal inside `toProcessSteps`. **Keep the `number:` line in that literal** — it feeds a React key downstream. `TrainingProcessStep`'s `icon` field is in `types/content.ts`, which is out of scope, so leaving the field unset is correct; if TypeScript requires it, set `icon: ""` rather than editing the type.

- [ ] **Step 4: Delete the bridge and its assets**

```bash
git rm lib/utils/icon-map.ts
git rm -r public/images/icons
```

- [ ] **Step 5: Confirm nothing references either**

```bash
grep -rn "emojiToIconImage\|icon-map\|images/icons" --include="*.ts" --include="*.tsx" . | grep -v node_modules | grep -v "^./docs/"
```

Expected: no output. A hit under `components/admin/` is still a real problem here — deleting the module breaks any importer, admin or not. If an admin file imports it, STOP and report; that changes the scope and needs a decision.

- [ ] **Step 6: Verify**

```bash
npm run type-check && npm run lint && npm run build
```

- [ ] **Step 7: Visual check**

`npm run dev`, then visit `/`, `/departments`, `/apply-for-training`, `/apply-for-training/how-it-works`, `/for-organisations/corporate-training`, `/partner-with-us/educational`, `/what-we-do/girls-in-tech`, `/our-impact`, `/our-impact/reports`, `/our-impact/sdgs`. No emoji may appear. Any card that has an authored `iconImage` must still show it.

- [ ] **Step 8: Commit** (only once John has approved committing)

```bash
git add -A
git commit -m "refactor: remove emoji icon tier and delete emoji-to-SVG bridge"
```

---

### Task 2: Remove decorative icons from home and layout components

**Files:**
- Modify: `components/home/donation-campaign.tsx` — remove `Clock3`, `HeartHandshake`, `Users`. **Keep `ArrowRight`.**
- Modify: `components/home/join-cta-block.tsx` — remove `Building2`, `GraduationCap`, `HeartHandshake`, and the `iconMap` lookup that maps `card.icon` to them. **Keep `ArrowRight`.** Remove the `LucideIcon` type import if it becomes unused.
- Modify: `components/home/legacy-homepage-sections.tsx` — remove `Heart`.
- Modify: `components/layout/floating-elements.tsx` — remove `Heart` from the donate button, which already carries `content.donateButton.label` as its text. **Keep `ArrowUp` and `X`.**

**Interfaces:**
- Consumes: nothing.
- Produces: `join-cta-block.tsx` no longer reads `card.icon`. The `JoinCtaCard.icon` field stays in `types/content.ts` (out of scope) but becomes unread.

- [ ] **Step 1: Remove each decorative icon element and its import entry**

For each icon named above: delete the JSX element that renders it, then remove that name from the file's `lucide-react` import. Leave the surrounding text and layout intact — every one of these sits beside a text label that must survive. Where deleting an icon leaves a flex wrapper holding a single text node, collapse the wrapper.

In `join-cta-block.tsx` the removal is larger than one element: the `iconMap` object and the `const Icon = iconMap[card.icon];` lookup both go, along with the `<Icon ... />` render. Do not remove `card.icon` from the data — just stop reading it.

- [ ] **Step 2: Verify the import lines are exactly right**

```bash
grep -n "lucide-react" -A1 components/home/donation-campaign.tsx components/home/join-cta-block.tsx components/home/legacy-homepage-sections.tsx components/layout/floating-elements.tsx
```

Expected: `donation-campaign` imports only `ArrowRight`; `join-cta-block` imports only `ArrowRight`; `legacy-homepage-sections` has no `lucide-react` import left at all; `floating-elements` imports only `ArrowUp` and `X`.

- [ ] **Step 3: Verify**

```bash
npm run type-check && npm run lint && npm run build
```

`next lint` flags unused imports, so a clean lint confirms no icon name was left behind in an import.

- [ ] **Step 4: Visual check**

`npm run dev`, then visit `/` and `/donate`. The donate floating button must still read its label. Homepage CTA cards must still show their titles and copy. Carousel arrows, close buttons and scroll-to-top must all still work.

- [ ] **Step 5: Commit** (only once John has approved committing)

```bash
git add components/home/donation-campaign.tsx components/home/join-cta-block.tsx components/home/legacy-homepage-sections.tsx components/layout/floating-elements.tsx
git commit -m "refactor: remove decorative icons from home and layout components"
```

---

### Task 3: Remove decorative icons from news, programs, training and shared components

**Files:**
- Modify: `components/news/article-card.tsx` — remove `CalendarDays`, `Clock3`. **Keep `ArrowRight`.**
- Modify: `components/news/news-article-page.tsx` — remove `Mail`, `Tags`, `UserRound`.
- Modify: `components/news/news-hub-page.tsx` — remove `Mail`. **Keep `ArrowRight`.**
- Modify: `components/news/news-listing-page.tsx` — remove `Tags`. **Keep `ArrowRight`.**
- Modify: `components/programs/course-detail-card.tsx` — remove `CalendarDays`, `Clock3`, `Tag`, `Users`, `Globe2`. **Keep `PlayCircle`.**
- Modify: `components/shared/team-directory.tsx` — remove `Mail`, `Linkedin`. Both sit beside the visible labels "Email" and "LinkedIn", which stay.
- Modify: `components/training/training-course-catalog.tsx` — remove `CalendarDays`, `Clock3`. **Keep `Search` and `ArrowRight`.**

**Interfaces:**
- Consumes: nothing.
- Produces: nothing.

- [ ] **Step 1: Remove each decorative icon element and its import entry**

For each icon named above: delete the JSX element, then remove the name from that file's `lucide-react` import. Every one of these sits next to text — a date, a duration, a tag name, a label — which must survive unchanged. Where an icon was the first child of a flex row whose only purpose was icon-beside-text, collapse the wrapper so the text is not left in a one-item flex container with a `gap`.

`course-detail-card.tsx` has five removals across the metadata rows; work through them one at a time and re-read the file after each, because several sit in similar-looking rows.

- [ ] **Step 2: Verify the import lines**

```bash
grep -n "from \"lucide-react\"" -B4 components/news/article-card.tsx components/news/news-article-page.tsx components/news/news-hub-page.tsx components/news/news-listing-page.tsx components/programs/course-detail-card.tsx components/shared/team-directory.tsx components/training/training-course-catalog.tsx
```

Expected: `article-card` → `ArrowRight` only; `news-article-page` → no `lucide-react` import at all; `news-hub-page` → `ArrowRight` only; `news-listing-page` → `ArrowRight` only; `course-detail-card` → `PlayCircle` only; `team-directory` → no `lucide-react` import at all; `training-course-catalog` → `ArrowRight` and `Search` only.

- [ ] **Step 3: Verify**

```bash
npm run type-check && npm run lint && npm run build
```

- [ ] **Step 4: Visual check**

`npm run dev`, then visit `/news-and-updates`, `/news-and-updates/news`, one article page, `/who-we-are/team`, `/apply-for-training/courses`, and one course detail page. Dates, durations, tags and contact labels must all still read correctly. The course catalog's search field must still show its magnifier, and a course with a video must still show its play control.

- [ ] **Step 5: Commit** (only once John has approved committing)

```bash
git add components/news/article-card.tsx components/news/news-article-page.tsx components/news/news-hub-page.tsx components/news/news-listing-page.tsx components/programs/course-detail-card.tsx components/shared/team-directory.tsx components/training/training-course-catalog.tsx
git commit -m "refactor: remove decorative icons from news, programs and training components"
```

---

### Task 4: Remove decorative icons from contact and who-we-are, and collapse phase 2's leftover wrappers

**Files:**
- Modify: `components/contact/contact-form.tsx` — remove `Send` from the submit button, which already carries a text label. **Keep `AlertCircle`, `CheckCircle2` and `Loader2`** — they convey submit and validation state.
- Modify: `components/contact/contact-page.tsx` — remove `Mail`, `MapPin`, `MessageSquareText`, `Phone`, `ShieldCheck`. **Keep `ArrowRight`.**
- Modify: `components/who-we-are/who-we-are-page.tsx` — remove `Compass`, `HeartHandshake`, `Layers3`, `Quote`, `ShieldCheck`, and the `operatingIcons` array plus the `operatingIcons[index]` lookup. **Keep `ArrowRight`.**

**Interfaces:**
- Consumes: nothing.
- Produces: nothing.

- [ ] **Step 1: `contact-form.tsx` — remove the Send glyph only**

Delete the `<Send ... />` element from the submit button and remove `Send` from the `lucide-react` import. Do not touch the loading spinner, the error indicator, or the success indicator — those three communicate state and are on the keep-list.

- [ ] **Step 2: `contact-page.tsx` — remove the channel glyphs**

Each contact channel and enquiry option renders a glyph beside its label. Delete the five icon elements and remove those five names from the import, leaving `ArrowRight`. Where a glyph was the first child of a flex row that existed only to place it beside text, collapse the wrapper.

**Note the interim oddity this resolves.** Phase 2 removed the numbered medallions from the response-step cards but left the privacy card's `ShieldCheck` medallion directly beneath them, so `/contact` currently shows two adjacent cards where one has a medallion and one does not. Removing `ShieldCheck` here is what makes that column consistent again — confirm it looks right in the visual check.

- [ ] **Step 3: `who-we-are-page.tsx` — remove the icon system**

This file has the most involved removal. Delete:
- the `operatingIcons` array (`Compass`, `HeartHandshake`, `Layers3` or similar) declared near the top,
- the `const Icon = operatingIcons[index]` style lookup and its `<Icon ... />` render,
- the `<Quote ... />` element in the testimonial or pull-quote block,
- the `<ShieldCheck ... />` element,
- and those five names from the `lucide-react` import, leaving `ArrowRight`.

Phase 2 deliberately left a `<div className="flex items-start justify-between gap-4">` here that held the icon beside a now-deleted number badge. With the icon gone that wrapper holds nothing — **delete the wrapper entirely** and check the following heading's top-margin still makes sense.

The `map` callback that used `index` only for `operatingIcons[index]` will now have an unused `index`. Tidy the signature; `next lint` will flag it if you miss it.

- [ ] **Step 4: Verify the import lines**

```bash
grep -n "from \"lucide-react\"" -B8 components/contact/contact-form.tsx components/contact/contact-page.tsx components/who-we-are/who-we-are-page.tsx
```

Expected: `contact-form` → `AlertCircle`, `CheckCircle2`, `Loader2`; `contact-page` → `ArrowRight` only; `who-we-are-page` → `ArrowRight` only.

- [ ] **Step 5: Whole-site verification**

```bash
npm run type-check && npm run lint && npm run build
```

Then confirm the keep-list is intact and nothing decorative survives:

```bash
grep -rhoE "\b(Heart|HeartHandshake|Users|Clock3|Building2|GraduationCap|Compass|Layers3|Quote|ShieldCheck|MessageSquareText|Tags|Tag|UserRound|CalendarDays|Globe2|MapPin|Phone|Mail|Linkedin|Send)\b" --include="*.tsx" components | grep -v components/admin | sort -u
```

Expected: no output. Any name printed is a decorative icon still present somewhere.

```bash
grep -rhoE "\b(X|ChevronLeft|ChevronRight|ChevronDown|ArrowDown|ArrowUp|Play|PlayCircle|Search|Loader2|AlertCircle|CheckCircle2|ArrowRight|ArrowUpRight)\b" --include="*.tsx" components | grep -v components/admin | sort -u
```

Expected: most of these still present. A missing one means a functional control lost its only affordance — report it.

- [ ] **Step 6: Visual check**

`npm run dev`, then visit `/contact` (submit the form with a deliberate validation error to confirm the error and spinner states still show their indicators) and `/who-we-are` (both the light card section and the dark principles section). Then re-check the whole keep-list in the browser: open the mobile menu and close it, page the hero slideshow and the testimonial carousel, open and close a gallery lightbox, and use the course catalog search field.

- [ ] **Step 7: Commit** (only once John has approved committing)

```bash
git add components/contact/contact-form.tsx components/contact/contact-page.tsx components/who-we-are/who-we-are-page.tsx
git commit -m "refactor: remove decorative icons from contact and who-we-are pages"
```

---

## Definition of done for phase 3

- `npm run type-check`, `npm run lint` and `npm run build` all pass.
- No emoji renders on any public page, and `lib/utils/icon-map.ts` and `public/images/icons/` no longer exist.
- Authored `iconImage` values still render wherever they are set.
- No decorative icon remains on a public component; every icon on the keep-list still works, verified in a browser.
- `types/content.ts`, `lib/utils/validators.ts`, `package.json`, `components/admin/` and `app/(admin)/` are all unchanged.
- The `justify-between` wrappers phase 2 left holding a lone icon are gone.

## Known and accepted

Authors will still see `icon` inputs in the admin forms that render nothing, and the step-`number` validator still demands a value nothing displays. John chose presentation-only with eyes open. If that becomes irritating, the follow-up is a small admin-and-validators pass, deliberately kept out of this phase.
