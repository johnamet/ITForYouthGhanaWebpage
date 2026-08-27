# Phase 2: Prose Conversion and Number-Badge Removal — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert every remaining list-style renderer on the public site into prose, and remove every rendered number badge, so no public page displays enumerated or bulleted content.

**Architecture:** Phase 1 built `pointsToParagraph`/`composeProse` in `lib/utils/prose.ts`. This phase applies them to the fifteen list sites those helpers did not already cover, and deletes the thirteen rendered number badges. No data model changes: the CMS keeps its `string[]` fields and authors keep entering discrete points; only the rendering changes.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript 5.7, Tailwind 3.4. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-08-26-public-page-prose-and-media-foundations-design.md` (programme context; this phase is its row 2). Standing rules: no bullets, no decorative icons or emoji, prose paired with media.

## Global Constraints

- **No test framework.** Do not add Vitest, Jest, `node --test`, or Playwright, and do not write test files. Verification is `npm run type-check`, `npm run lint`, `npm run build`, and visual comparison in the dev server.
- **No new dependencies.** `package.json` must be unchanged by this phase.
- **Admin is out of scope.** Nothing under `components/admin/` or `app/(admin)/`.
- **No content-type changes.** `types/content.ts` is untouched. `bullets`, `highlights`, `objectives`, `requirements`, `priorities`, `features`, `responsibilities`, `includedItems`, `eligibility` all keep their `string[]` shape.
- **Icons and emoji are PHASE 3, not this phase.** Leave every `lucide-react` icon and every emoji `icon` field exactly where it is, including `stepIcons = ["🧭", "📝", "✅", "🚀"]` in `training-how-it-works-page.tsx:12`. Removing a number badge sometimes leaves an icon alone in a `justify-between` flex row — that is expected and correct for now.
- **Use the shared helper.** Every conversion calls `pointsToParagraph` or `composeProse` from `@/lib/utils/prose`. Do not hand-roll a join, and do not reintroduce an inline `/[.!?]$/` copy.
- **Branch:** `incircles`. Commit locally; do not push, merge, or touch `main`.
- **These pages WILL change appearance.** That is the point of this phase, unlike phase 1.

## What is deliberately NOT a bullet or a badge

Do not touch these — they are functional UI, not enumerated content:

- `components/home/hero-slideshow.tsx:643,648,850,856` — the slide counter (`01 / 08`). A carousel position indicator.
- `components/home/hero-slideshow.tsx:1137` and `components/home/testimonials-section.tsx:146` — `aria-label={...index + 1}` on carousel dots. Accessibility labels.
- Every `key={step.number}` — React keys. They must survive; only the *rendered* badge goes. This applies at `training-process-strip.tsx:35`, `contact-page.tsx:134`, `organisation-service-page.tsx:139`, and `partnership-track-page.tsx:127`.
- `components/layout/site-footer.tsx` — `<ul>/<li>` navigation links.

---

### Task 1: Prose conversion — the chip-grid shape

Seven sites across six files share one shape: a wrapper `<div>` mapping a string array into bordered "chip" boxes. Each becomes a single `<p>`.

**Files:**
- Modify: `components/news/news-hub-page.tsx:153-164`
- Modify: `components/impact/impact-overview-page.tsx:105-114`
- Modify: `components/impact/impact-reports-page.tsx:97-106`
- Modify: `components/organisations/organisation-service-page.tsx:252-261`
- Modify: `components/what-we-do/initiative-page.tsx:130-139` and `:234-243`
- Modify: `components/training/training-how-it-works-page.tsx:94-102`

**Interfaces:**
- Consumes: `pointsToParagraph(points?: string[]): string` from `@/lib/utils/prose`.
- Produces: nothing. Presentational only.

- [ ] **Step 1: `news-hub-page.tsx` — editorial pillar bullets**

Add `import { pointsToParagraph } from "@/lib/utils/prose";` to the imports. Replace:

```tsx
                {pillar.bullets?.length ? (
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {pillar.bullets.map((bullet) => (
                      <div
                        key={bullet}
                        className="rounded-[20px] border border-brand-border bg-brand-mist/55 px-4 py-4 text-sm font-medium leading-6 text-slate-700"
                      >
                        {bullet}
                      </div>
                    ))}
                  </div>
                ) : null}
```

with:

```tsx
                {pillar.bullets?.length ? (
                  <p className="mt-5 border-l-2 border-brand-gold pl-5 text-sm leading-7 text-slate-600">
                    {pointsToParagraph(pillar.bullets)}
                  </p>
                ) : null}
```

- [ ] **Step 2: `impact-overview-page.tsx` — measurement card bullets**

Add `import { pointsToParagraph } from "@/lib/utils/prose";`. Replace:

```tsx
                <div className="mt-5 space-y-3">
                  {card.bullets.map((bullet) => (
                    <div
                      key={bullet}
                      className="rounded-[22px] border border-brand-border bg-brand-mist/45 px-4 py-4 text-sm leading-7 text-slate-700"
                    >
                      {bullet}
                    </div>
                  ))}
                </div>
```

with:

```tsx
                {card.bullets.length ? (
                  <p className="mt-5 border-l-2 border-brand-gold pl-5 text-sm leading-7 text-slate-600">
                    {pointsToParagraph(card.bullets)}
                  </p>
                ) : null}
```

- [ ] **Step 3: `impact-reports-page.tsx` — report resource highlights**

`pointsToParagraph` is already imported in this file (phase 1 added it). Replace:

```tsx
                <div className="mt-5 space-y-3">
                  {resource.highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="rounded-[22px] border border-brand-border bg-brand-mist/45 px-4 py-4 text-sm leading-7 text-slate-700"
                    >
                      {highlight}
                    </div>
                  ))}
                </div>
```

with:

```tsx
                {resource.highlights.length ? (
                  <p className="mt-5 border-l-2 border-brand-gold pl-5 text-sm leading-7 text-slate-600">
                    {pointsToParagraph(resource.highlights)}
                  </p>
                ) : null}
```

- [ ] **Step 4: `organisation-service-page.tsx` — package features**

`composeProse` is already imported here; add `pointsToParagraph` to that same import statement. Replace:

```tsx
                  <div className="mt-6 space-y-3">
                    {item.features.map((feature) => (
                      <div
                        key={feature}
                        className="rounded-[22px] border border-brand-border bg-brand-mist/45 px-4 py-4 text-sm leading-7 text-slate-700"
                      >
                        {feature}
                      </div>
                    ))}
                  </div>
```

with:

```tsx
                  {item.features.length ? (
                    <p className="mt-6 border-l-2 border-brand-gold pl-5 text-sm leading-7 text-slate-600">
                      {pointsToParagraph(item.features)}
                    </p>
                  ) : null}
```

- [ ] **Step 5: `initiative-page.tsx` — objectives**

Add `import { pointsToParagraph } from "@/lib/utils/prose";`. Replace:

```tsx
                {objectives.length ? <div className="grid gap-3">
                  {objectives.map((objective) => (
                    <div
                      key={objective}
                      className="rounded-[22px] border border-brand-border bg-brand-mist/60 px-5 py-4 text-sm leading-7 text-slate-700"
                    >
                      {objective}
                    </div>
                  ))}
                </div> : null}
```

with:

```tsx
                {objectives.length ? (
                  <p className="border-l-2 border-brand-gold pl-5 text-sm leading-7 text-slate-600">
                    {pointsToParagraph(objectives)}
                  </p>
                ) : null}
```

- [ ] **Step 6: `initiative-page.tsx` — eligibility**

In the same file, replace:

```tsx
                <div className="mt-6 space-y-4">
                  {eligibility.map((item) => (
                    <div
                      key={item}
                      className="rounded-[22px] border border-brand-border bg-brand-mist/45 px-4 py-4 text-sm leading-7 text-slate-700"
                    >
                      {item}
                    </div>
                  ))}
                </div>
```

with:

```tsx
                <p className="mt-6 text-sm leading-7 text-slate-600">
                  {pointsToParagraph(eligibility)}
                </p>
```

- [ ] **Step 7: `training-how-it-works-page.tsx` — preparation checklist**

Add `import { pointsToParagraph } from "@/lib/utils/prose";`. Replace:

```tsx
          <div className="space-y-4">
            {checklist.map((item) => (
              <div
                key={item}
                className="rounded-[26px] border border-brand-border bg-white px-5 py-5 shadow-sm"
              >
                <p className="text-sm leading-7 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
```

with:

```tsx
          <div className="rounded-[26px] border border-brand-border bg-white px-6 py-6 shadow-sm">
            <p className="text-sm leading-7 text-slate-700">{pointsToParagraph(checklist)}</p>
          </div>
```

- [ ] **Step 8: Verify**

```bash
npm run type-check && npm run lint && npm run build
```

Expected: all pass. If a file now imports `pointsToParagraph` without using it, that is a mistake in one of the steps above — find it rather than deleting the import.

- [ ] **Step 9: Visual check**

`npm run dev`, then visit `/news-and-updates`, `/our-impact`, `/our-impact/reports`, `/for-organisations/corporate-training`, `/what-we-do/girls-in-tech`, and `/apply-for-training/how-it-works`. Each previously-chipped list must now read as one paragraph, with full stops between the points and no leftover empty bordered boxes.

- [ ] **Step 10: Commit** (only once John has approved committing)

```bash
git add components/news/news-hub-page.tsx components/impact/impact-overview-page.tsx components/impact/impact-reports-page.tsx components/organisations/organisation-service-page.tsx components/what-we-do/initiative-page.tsx components/training/training-how-it-works-page.tsx
git commit -m "refactor: render chip-grid lists as prose on public pages"
```

---

### Task 2: Prose conversion — the real `<ul>/<li>` sites

Six sites across two files use genuine list markup. These are the only remaining `<ul>` elements on public pages outside the footer's navigation.

**Files:**
- Modify: `components/departments/department-detail-page.tsx:45-53`, `:62-70`, `:127-137`
- Modify: `components/programs/course-detail-card.tsx:157-169`, `:275-283`, `:285-293`

**Interfaces:**
- Consumes: `pointsToParagraph` from `@/lib/utils/prose`.
- Produces: nothing.

- [ ] **Step 1: `department-detail-page.tsx` — responsibilities**

Add `import { pointsToParagraph } from "@/lib/utils/prose";`. Replace:

```tsx
              <ul className="grid gap-3">
                {department.responsibilities.map((item) => (
                  <li key={item} className="rounded-2xl border border-brand-border bg-brand-mist/55 px-4 py-3 text-sm leading-7 text-slate-700">
                    {item}
                  </li>
                ))}
              </ul>
```

with:

```tsx
              <p className="text-sm leading-7 text-slate-700">
                {pointsToParagraph(department.responsibilities)}
              </p>
```

- [ ] **Step 2: `department-detail-page.tsx` — service bullets**

Replace:

```tsx
                      {service.bullets?.length ? (
                        <ul className="mt-4 grid gap-2 text-sm font-medium text-brand-navy">
                          {service.bullets.map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                          ))}
                        </ul>
                      ) : null}
```

with:

```tsx
                      {service.bullets?.length ? (
                        <p className="mt-4 text-sm leading-7 text-brand-navy">
                          {pointsToParagraph(service.bullets)}
                        </p>
                      ) : null}
```

- [ ] **Step 3: `department-detail-page.tsx` — current priorities**

Replace:

```tsx
                <ul className="mt-5 grid gap-3 text-sm leading-7 text-slate-600">
                  {department.priorities.map((priority) => (
                    <li key={priority} className="border-l-2 border-brand-gold pl-3">
                      {priority}
                    </li>
                  ))}
                </ul>
```

with:

```tsx
                <p className="mt-5 border-l-2 border-brand-gold pl-3 text-sm leading-7 text-slate-600">
                  {pointsToParagraph(department.priorities)}
                </p>
```

- [ ] **Step 4: `course-detail-card.tsx` — learning objectives**

Add `import { pointsToParagraph } from "@/lib/utils/prose";`. Replace:

```tsx
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {objectives.map((objective) => (
                  <div
                    key={objective}
                    className="flex gap-3 rounded-[22px] border border-brand-border bg-brand-mist/40 p-4 text-sm leading-6 text-slate-600"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold" />
                    <span>{objective}</span>
                  </div>
                ))}
              </div>
```

with:

```tsx
              <p className="mt-5 rounded-[22px] border border-brand-border bg-brand-mist/40 p-5 text-sm leading-7 text-slate-600">
                {pointsToParagraph(objectives)}
              </p>
```

This removes the only use of `CheckCircle2` in this file's objectives block. **Do not remove the `CheckCircle2` import yet** — check whether it is still used elsewhere in the file first. If it is now unused, `next lint` will flag it; only then remove it from the import.

- [ ] **Step 5: `course-detail-card.tsx` — requirements**

Replace:

```tsx
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                    {requirements.map((requirement) => (
                      <li key={requirement}>{requirement}</li>
                    ))}
                  </ul>
```

with:

```tsx
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {pointsToParagraph(requirements)}
                  </p>
```

- [ ] **Step 6: `course-detail-card.tsx` — included items**

Replace:

```tsx
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                    {includedItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
```

with:

```tsx
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {pointsToParagraph(includedItems)}
                  </p>
```

- [ ] **Step 7: Confirm no public `<ul>` remains except footer navigation**

```bash
grep -rn "<ul\|<li" --include="*.tsx" components app | grep -v components/admin | grep -v "app/(admin)"
```

Expected: hits only in `components/layout/site-footer.tsx` (navigation links) and `components/home/hero-slideshow.tsx` (carousel dot list). Any other hit is a site this task missed.

- [ ] **Step 8: Verify**

```bash
npm run type-check && npm run lint && npm run build
```

- [ ] **Step 9: Visual check**

`npm run dev`, then visit `/departments` and one department detail page, plus `/programs` and one course detail page. No bulleted or boxed lists may remain.

- [ ] **Step 10: Commit** (only once John has approved committing)

```bash
git add components/departments/department-detail-page.tsx components/programs/course-detail-card.tsx
git commit -m "refactor: render department and course lists as prose"
```

---

### Task 3: Prose conversion — check-icon rows and the last inline join

**Files:**
- Modify: `components/who-we-are/who-we-are-page.tsx:169-178` and `:245-257`
- Modify: `components/training/training-who-can-apply-page.tsx:45-49`

**Interfaces:**
- Consumes: `pointsToParagraph` from `@/lib/utils/prose`.
- Produces: nothing.

- [ ] **Step 1: `who-we-are-page.tsx` — light-tone section bullets**

Add `import { pointsToParagraph } from "@/lib/utils/prose";`. Replace:

```tsx
                    {section.bullets?.length ? (
                      <div className="mt-6 grid gap-3">
                        {section.bullets.map((bullet) => (
                          <p key={bullet} className="flex gap-3 text-sm leading-7 text-slate-600">
                            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-brand-gold" />
                            <span>{bullet}</span>
                          </p>
                        ))}
                      </div>
                    ) : null}
```

with:

```tsx
                    {section.bullets?.length ? (
                      <p className="mt-6 border-l-2 border-brand-gold pl-5 text-sm leading-7 text-slate-600">
                        {pointsToParagraph(section.bullets)}
                      </p>
                    ) : null}
```

- [ ] **Step 2: `who-we-are-page.tsx` — dark-tone principle bullets**

In the same file, replace:

```tsx
                        {section.bullets?.length ? (
                          <div className="mt-4 grid gap-2">
                            {section.bullets.map((bullet) => (
                              <p
                                key={bullet}
                                className="flex gap-3 text-sm leading-7 text-white/72"
                              >
                                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-brand-gold" />
                                <span>{bullet}</span>
                              </p>
                            ))}
                          </div>
                        ) : null}
```

with:

```tsx
                        {section.bullets?.length ? (
                          <p className="mt-4 border-l-2 border-brand-gold pl-5 text-sm leading-7 text-white/72">
                            {pointsToParagraph(section.bullets)}
                          </p>
                        ) : null}
```

After both steps, `CheckCircle2` may be unused in this file. Run `grep -n "CheckCircle2" components/who-we-are/who-we-are-page.tsx` — if the only remaining hit is the import line, remove it from the `lucide-react` import. Leave every other icon in that import alone; they are phase 3's business.

- [ ] **Step 3: `training-who-can-apply-page.tsx` — the last un-normalised join**

This file joins points without adding terminal punctuation, so it produces run-on text like `first point second point`. It is the sixteenth and last inline copy. Add `import { pointsToParagraph } from "@/lib/utils/prose";` and replace:

```tsx
              {(card.bullets ?? []).length ? (
                <p className="mt-5 border-l-2 border-brand-gold pl-5 text-sm leading-8 text-slate-700">
                  {(card.bullets ?? []).join(" ")}
                </p>
              ) : null}
```

with:

```tsx
              {(card.bullets ?? []).length ? (
                <p className="mt-5 border-l-2 border-brand-gold pl-5 text-sm leading-8 text-slate-700">
                  {pointsToParagraph(card.bullets)}
                </p>
              ) : null}
```

The rendered text gains full stops between points. That is the intended normalisation.

- [ ] **Step 4: Confirm no hand-rolled joins remain on public pages**

```bash
grep -rn '\.join(" ")' --include="*.tsx" components app | grep -v components/admin | grep -v "app/(admin)"
```

Expected: only joins over things that are genuinely not content points — for example `[t.programme, t.year].filter(Boolean).join(" · ")` in `components/home/testimonials-section.tsx`, and the ` • ` hero supporting-text joins in the impact and training pages. Those are metadata separators, not prose, and phase 3 revisits the ` • ` ones. Any `join(" ")` over a `bullets`-shaped array is a site this task missed.

- [ ] **Step 5: Verify**

```bash
npm run type-check && npm run lint && npm run build
```

- [ ] **Step 6: Visual check**

`npm run dev`, then visit `/who-we-are` (both the light card section and the dark principles section) and `/apply-for-training/who-can-apply`. No check-icon rows may remain, and the who-can-apply supporting paragraphs must now have full stops between points.

- [ ] **Step 7: Commit** (only once John has approved committing)

```bash
git add components/who-we-are/who-we-are-page.tsx components/training/training-who-can-apply-page.tsx
git commit -m "refactor: render check-icon lists as prose and normalise last inline join"
```

---

### Task 4: Remove rendered number badges

Thirteen rendered badges across eleven files. React keys and carousel counters stay — see "What is deliberately NOT a bullet or a badge" above.

**Files:**
- Modify: `components/shared/alternating-feature-row.tsx:61-65` plus its type and `components/what-we-do/initiative-page.tsx:165`
- Modify: `components/shared/editorial-guidance-grid.tsx:33-35`
- Modify: `components/home/programme-showcase.tsx` (the numeral `<span>` around line 163)
- Modify: `components/training/training-process-strip.tsx:48-50`
- Modify: `components/training/training-who-can-apply-page.tsx:40-42`
- Modify: `components/contact/contact-page.tsx:137-140`
- Modify: `components/departments/department-detail-page.tsx:113-116`
- Modify: `components/organisations/organisation-service-page.tsx:152-154`
- Modify: `components/partnerships/partnership-track-page.tsx:140-142`
- Modify: `components/who-we-are/who-we-are-page.tsx:161-163` and `:236-239`
- Modify: `components/training/training-how-it-works-page.tsx:66-68`
- Modify: `components/what-we-do/what-we-do-overview-page.tsx:211-214`

**Interfaces:**
- Consumes: nothing.
- Produces: `AlternatingFeatureItem` loses its `number` field.

- [ ] **Step 1: `alternating-feature-row.tsx` — remove the numeral and its spacer**

Removing just the numeral would leave a lone invisible spacer in a `justify-between` row, so remove the whole row. Replace:

```tsx
                <div className="flex items-center justify-between">
                  <div className="h-7 w-7" aria-hidden="true" />
                  {item.number ? (
                    <span className="font-heading text-3xl font-bold text-brand-gold/70">{item.number}</span>
                  ) : null}
                </div>
                <h3 className="mt-5 font-heading text-2xl font-bold text-brand-ink">{item.title}</h3>
```

with:

```tsx
                <h3 className="font-heading text-2xl font-bold text-brand-ink">{item.title}</h3>
```

Then remove `number?: string;` from the `AlternatingFeatureItem` type near the top of the file.

- [ ] **Step 2: `initiative-page.tsx` — stop passing `number`**

Remove the line `number: step.number,` from the object literal passed to `AlternatingFeatureRow`. Leave every other field.

- [ ] **Step 3: `editorial-guidance-grid.tsx` — remove the ghost numeral**

Delete:

```tsx
            <div className="absolute right-4 top-7 font-heading text-7xl font-bold leading-none text-brand-mist sm:right-8">
              {String(index + 1).padStart(2, "0")}
            </div>
```

The `index` parameter is still used for the border classes on the `<article>`, so leave the `map((section, index) =>` signature alone. The `pr-20` and `pr-14` right-padding on the eyebrow and heading existed to clear that numeral — change `pr-20` to `pr-0` and `pr-14` to `pr-0`, or simply drop both classes.

- [ ] **Step 4: `programme-showcase.tsx` — remove the card numeral**

Delete the `<span>` whose body is `{String(index + 1).padStart(2, "0")}` together with its multi-line `className` block. If the parent `<div>` is left with no children, delete the parent too. Check whether `index` is still used elsewhere in that map callback; if it is not, change the signature from `map((item, index) =>` to `map((item) =>`.

- [ ] **Step 5: `training-process-strip.tsx` — remove the step numeral**

Delete:

```tsx
              <span className="font-heading text-3xl font-bold text-brand-gold/70">
                {step.number}
              </span>
```

Keep `key={step.number}` at line 35 — it is the React key. The icon `<span>` above it stays until phase 3.

- [ ] **Step 6: `training-who-can-apply-page.tsx` — remove the audience numeral**

Delete:

```tsx
              <p className="font-heading text-5xl font-bold text-brand-mist">
                {String(index + 1).padStart(2, "0")}
              </p>
```

and change the following heading's `className` from `"mt-2 font-heading ..."` to `"font-heading ..."`. The `index` parameter becomes unused — change `map((card, index) =>` to `map((card) =>`.

- [ ] **Step 7: `contact-page.tsx` — remove the response-step numeral**

Delete:

```tsx
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-navy text-sm font-bold text-brand-gold">
                      {step.number}
                    </span>
```

The enclosing `<div className="flex items-start gap-4">` now wraps a single child — remove that wrapper too and let its `<div>` child stand alone. Keep `key={step.number}`.

- [ ] **Step 8: `department-detail-page.tsx` — remove the workflow numeral**

Delete:

```tsx
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-navy text-sm font-bold text-white">
                        {index + 1}
                      </span>
```

The enclosing `<div key={step.title} className="flex gap-3">` now wraps a single `<div>` — collapse it so the inner `<div>` carries the `key`. The `index` parameter becomes unused; change `map((step, index) =>` to `map((step) =>`.

- [ ] **Step 9: `organisation-service-page.tsx` — remove the process-step numeral**

Delete:

```tsx
                  <span className="font-heading text-3xl font-bold text-brand-gold/70">
                    {step.number}
                  </span>
```

Keep `key={step.number}`. The icon block above stays until phase 3.

- [ ] **Step 10: `partnership-track-page.tsx` — remove the process-step numeral**

Delete the identical block:

```tsx
                  <span className="font-heading text-3xl font-bold text-brand-gold/70">
                    {step.number}
                  </span>
```

Keep `key={step.number}`.

- [ ] **Step 11: `who-we-are-page.tsx` — remove both numerals**

First, delete:

```tsx
                      <p className="font-heading text-4xl font-bold text-brand-gold/55">
                        {String(index + 1).padStart(2, "0")}
                      </p>
```

The enclosing `<div className="flex items-start justify-between gap-4">` now holds only the icon block. Leave that wrapper in place — phase 3 removes the icon and can collapse it then.

Second, delete:

```tsx
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-gold text-brand-ink">
                        {index + 1}
                      </div>
```

Its `<div className="flex gap-4">` parent now wraps a single child — remove that wrapper and let the inner `<div>` stand alone.

Check afterwards whether `index` is still used in either map callback and tidy the signatures if not.

- [ ] **Step 12: `training-how-it-works-page.tsx` — remove the "Step NN" label**

Delete:

```tsx
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
                  Step {String(index + 1).padStart(2, "0")}
                </p>
```

and change the following heading's `className` from `"mt-4 font-heading ..."` to `"font-heading ..."`. The `index` parameter becomes unused — change `map((item, index) =>` to `map((item) =>`.

**Leave `toProcessSteps`'s `number: String(index + 1).padStart(2, "0")` at line 16 alone** — that value feeds `TrainingProcessStrip`'s React key, which must stay unique.

- [ ] **Step 13: `what-we-do-overview-page.tsx` — remove the pathway numeral**

Delete:

```tsx
                <p className="font-heading text-4xl font-bold text-brand-gold/70">
                  {String(index + 1).padStart(2, "0")}
                </p>
```

and change the following heading's `className` from `"mt-4 font-heading ..."` to `"font-heading ..."`. The `index` parameter becomes unused — change `map((card, index) =>` to `map((card) =>`.

- [ ] **Step 14: Confirm no rendered badges remain**

```bash
grep -rn 'padStart(2, "0")\|{step\.number}\|{index + 1}' --include="*.tsx" components | grep -v components/admin
```

Expected hits, and ONLY these:
- `components/home/hero-slideshow.tsx` — the slide counter and the `aria-label` on dots
- `components/home/testimonials-section.tsx` — the `aria-label` on dots
- `components/training/training-how-it-works-page.tsx:16` — the React key source

Any other hit is a badge this task missed. `key={step.number}` will not appear in this grep because of the braces pattern; confirm those separately with `grep -rn "key={step.number}" --include="*.tsx" components` and check all four still exist.

- [ ] **Step 15: Verify**

```bash
npm run type-check && npm run lint && npm run build
```

Expected: all pass. `next lint` flags unused `index` parameters, so a clean lint is the check that steps 4, 6, 8, 11, 12 and 13 tidied their map signatures.

- [ ] **Step 16: Visual check**

`npm run dev`, then visit `/apply-for-training/how-it-works`, `/apply-for-training/who-can-apply`, `/for-organisations/corporate-training`, `/partner-with-us/educational`, `/who-we-are`, `/what-we-do`, `/contact`, `/`, and one department detail page. No step, card, or section may display a number. Confirm the hero slideshow's `01 / 08` counter still works and its dots still navigate.

- [ ] **Step 17: Commit** (only once John has approved committing)

```bash
git add components/shared/alternating-feature-row.tsx components/shared/editorial-guidance-grid.tsx components/home/programme-showcase.tsx components/training/training-process-strip.tsx components/training/training-who-can-apply-page.tsx components/training/training-how-it-works-page.tsx components/contact/contact-page.tsx components/departments/department-detail-page.tsx components/organisations/organisation-service-page.tsx components/partnerships/partnership-track-page.tsx components/who-we-are/who-we-are-page.tsx components/what-we-do/what-we-do-overview-page.tsx components/what-we-do/initiative-page.tsx
git commit -m "refactor: remove rendered number badges from public pages"
```

---

## Definition of done for phase 2

- `npm run type-check`, `npm run lint`, and `npm run build` all pass.
- No `<ul>` or `<li>` remains in a public component except `site-footer.tsx` navigation and the hero slideshow's dot list.
- No public page renders a number badge. The hero slideshow counter and both sets of carousel `aria-label`s still work.
- No hand-rolled point-joining remains; every conversion goes through `pointsToParagraph` or `composeProse`.
- `types/content.ts` is unchanged, `package.json` is unchanged, and no admin file was touched.
- Icons and emoji are all still present — phase 3 removes them.
