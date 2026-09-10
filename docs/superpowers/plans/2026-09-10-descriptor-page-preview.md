# Descriptor Page Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give all sixteen descriptor-driven page editors a live preview of the real public page, rendered against unsaved draft values.

**Architecture:** `RecordForm` gains one optional observation callback and keeps owning its state, its save, its delete and its revert — the preview only watches. A client-safe registry maps each descriptor key to a composition mirroring what its public route renders, given the draft document and a server-fetched context bundle. The preview itself reuses the existing workspace kit unchanged: same `postMessage` protocol, same `PreviewFrame` geometry, same error boundary.

**Tech Stack:** Next.js 14.2 App Router, React 18.3, TypeScript 5.7 (`strict`, `noUncheckedIndexedAccess` off, **`noImplicitReturns` NOT set**), Tailwind CSS, lucide-react, Firebase Admin (server only), Playwright (screenshots only — not a test runner).

**Spec:** `docs/superpowers/specs/2026-09-10-descriptor-page-preview-design.md`

## Global Constraints

- **No test runner exists in this repo, by explicit decision. Never add one.** Verification for every task is `npm run type-check`, `npm run lint`, `npm run build`, `npm run verify:cms`, plus the browser pass in Task 5.
- **Verification never gates the build.** Anything new goes in a separate npm script.
- **No client component may import `lib/cms/admin-config.ts`**, directly or transitively — it imports `getAdminSdkStatus`, which reads the service-account private key from the environment.
- **`RecordForm` must not become controlled.** It keeps its `values` state, its save, its delete and its revert. The only addition is one optional callback. It is shared by all 24 descriptors across the edit and create routes, so a behaviour change there reaches every CMS screen.
- **Collections and route-less descriptors must be visually and behaviourally untouched.** The two-pane layout applies only where `descriptor.shape === "singleton"` and `descriptor.route` is set.
- **No changes to any public renderer.** The one permitted change outside the admin tree is splitting a pure function out of `lib/api/training.ts`, which is not a renderer.
- **No changes to `/api/admin/cms/*` routes or to any descriptor's saved shape.**
- **The `PreviewFrame` geometry is load-bearing and must not be altered.** Viewport presets are fixed pixel widths — `1280`, `820`, `390` — with a scale-to-fit transform applied *after* the width, and the wrapper carrying the scaled footprint sized to the post-transform dimensions. A percentage width, or a transform without a fixed width, silently makes every preset render below `sm:`. This codebase shipped exactly that bug once.
- **An exhaustive switch does NOT fail the build without an explicit return type.** `noImplicitReturns` is unset, so a missing case widens the inferred return to include `undefined`, which is a valid `ReactNode`. Every exhaustive switch in this plan carries `: ReactElement` or `: boolean`, and that annotation is the mechanism — not the absent `default`.
- **Icons are `lucide-react`.** Never `iconify-icon`.
- **Radius: the semantic `rounded-control` (0.375rem) and `rounded-media` (0.75rem) tokens**, never raw `rounded-md` / `rounded-xl` / `rounded-lg`.
- **Brand palette only** via `brand-*` tokens, with two sanctioned exceptions inside admin chrome only: `slate-*` neutrals, and semantic status colour (`emerald-*` saved, `rose-*` errors).
- **Accessible keyboard focus is required** on the viewport controls.
- **Only the descriptor's own document updates live.** Context — partners, initiatives, tracks, articles, team members, jobs, the external course catalogue — is read once when the preview document loads.

**The sixteen descriptor keys, fixed for the whole plan:**

```
who-we-are  team  partners  careers
what-we-do
apply-for-training  apply-who-can-apply  apply-how-it-works  apply-courses
impact-overview  impact-reports  impact-testimonials  impact-sdgs
partner-with-us  news-hub  contact
```

## File Structure

**Create:**

| File | Responsibility |
|---|---|
| `components/admin/cms-preview/preview-context.ts` | The `PreviewContext` type: everything the sixteen compositions need beyond the draft document. Client-safe. |
| `components/admin/cms-preview/preview-registry.tsx` | Descriptor key → composition. One exhaustive switch, `: ReactElement`. |
| `components/admin/cms-preview/preview-canvas.tsx` | Merges draft messages over the baseline document and renders the registry's composition inside one boundary. |
| `components/admin/cms-preview/editor-with-preview.tsx` | Two-pane client wrapper: `RecordForm` left, `PreviewFrame` right. |
| `app/(admin-preview)/admin/cms-preview/[type]/[id]/preview/page.tsx` | The iframe document. Resolves the descriptor, fetches document and context. |

**Modify:**

| File | Change |
|---|---|
| `components/admin/record-form.tsx` | One optional `onValuesChange` prop, fired from an effect. |
| `components/admin/workspace-kit/workspace-shell.tsx` | `rail` becomes optional; its grid track collapses when absent. |
| `app/(admin)/admin/cms/[type]/[id]/page.tsx` | Renders the two-pane wrapper for routed singletons; unchanged otherwise. |
| `components/admin/admin-shell.tsx` | The bleed predicate gains the two-pane editor route. |
| `lib/api/training.ts` | Split the pure `mergeCourseCatalog` out of `getTrainingCatalogMixed`. |
| `package.json` | Nothing — `shoot:workspace` already takes a route. |

---

### Task 1: The observation callback and an optional rail

Two small changes to shared files, done together because everything else depends on both and neither is worth its own review surface.

**Files:**
- Modify: `components/admin/record-form.tsx`
- Modify: `components/admin/workspace-kit/workspace-shell.tsx`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces:

```ts
// record-form.tsx — added to its existing props object
onValuesChange?: (values: FormValues) => void;

// workspace-shell.tsx — rail is now optional
export type WorkspaceShellProps = {
  bar: React.ReactNode;
  rail?: React.ReactNode;
  editor: React.ReactNode;
  preview?: React.ReactNode;
};
```

- [ ] **Step 1: Add the callback to `RecordForm`**

Add `onValuesChange` to the props object (alongside `revertible`), typed as above, and document why it exists:

```tsx
  /**
   * Called whenever the form's values change. Purely an observer: this form
   * keeps owning its state and its save, because it is shared by every
   * descriptor including collections, and a live preview only needs to watch.
   */
  onValuesChange,
```

Then fire it from an effect rather than from each mutation site, so nothing can be missed — `setValues` is called from the field handler, and revert-to-seed replaces the whole object:

```tsx
  useEffect(() => {
    onValuesChange?.(values);
  }, [values, onValuesChange]);
```

Add `useEffect` to the existing `react` import. Change nothing else: not the save, not the delete, not the revert, not the markup.

- [ ] **Step 2: Make the shell's rail optional**

In `components/admin/workspace-kit/workspace-shell.tsx`, make `rail` optional in the props type and destructuring, and pick the grid template accordingly:

```tsx
  // A consumer with no rail — the descriptor page editors, whose fields have
  // no grouping metadata to enumerate — gets two panes rather than a dead
  // 176px column.
  const gridClass = rail
    ? "xl:grid-cols-[176px_392px_minmax(0,1fr)] 2xl:grid-cols-[196px_430px_minmax(0,1fr)]"
    : "xl:grid-cols-[minmax(0,460px)_minmax(0,1fr)] 2xl:grid-cols-[minmax(0,520px)_minmax(0,1fr)]";
```

Use it in place of the hard-coded classes on the grid div, and render the rail's wrapper only when `rail` is truthy. Keep `min-h-0` on the grid and on every pane wrapper — that is what gives the panes a definite height to scroll against, and it cost a review round to establish.

The below-`xl` tab list stays exactly as it is: with no rail it still switches between Edit and Preview, which is what a narrow viewport needs.

- [ ] **Step 3: Verify nothing regressed**

Run: `npm run type-check && npm run lint && npm run build && npm run verify:cms`
Expected: all PASS. `onValuesChange` is optional and the rail's absence is a new branch, so every existing caller compiles unchanged.

Run: `grep -rn "WorkspaceShell" components/ app/ | grep -v node_modules | grep -v workspace-shell.tsx`
Expected: the two existing consumers — the homepage's `workspace-layout.tsx` and the site-page `[slug]` routes — both of which pass a rail and are therefore on the three-pane branch.

- [ ] **Step 4: Commit**

```bash
git add components/admin/record-form.tsx components/admin/workspace-kit/workspace-shell.tsx
git commit -m "feat(admin): let RecordForm be observed and the shell drop its rail

RecordForm gains one optional onValuesChange, fired from an effect so no
mutation path is missed, and keeps owning its state and its save. It is
shared by all 24 descriptors, so a live preview watching it is a far
smaller change than making it controlled.

The workspace shell's rail becomes optional because descriptors carry a
flat field list with no grouping to enumerate, so those editors get two
panes rather than a dead rail column."
```

---

### Task 2: The context type, the registry, and the course-merge split

**Files:**
- Create: `components/admin/cms-preview/preview-context.ts`
- Create: `components/admin/cms-preview/preview-registry.tsx`
- Modify: `lib/api/training.ts`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `PreviewContext`, `renderDescriptorPreview(key, values, context)`, `isPreviewableDescriptor(descriptor)`, and `mergeCourseCatalog(base, cmsCourses)`.

- [ ] **Step 1: Split the pure merge out of `getTrainingCatalogMixed`**

`lib/api/training.ts:31` currently awaits an external catalogue and then merges the document's own `courses` over it. The merge is pure and `types/course.ts` imports nothing, so the pure half can run on the client — which the courses preview needs, because its list depends on the draft.

Extract everything after `const base = ...` into:

```ts
/**
 * Merge CMS-authored courses over a base catalogue, CMS winning on a slug
 * collision. Pure and client-safe on purpose: the admin course preview re-runs
 * it against unsaved draft values, where an async fetch is not available.
 */
export function mergeCourseCatalog(
  base: Course[],
  cmsCourses?: unknown[],
): Course[] {
  const cms: Course[] = Array.isArray(cmsCourses)
    ? cmsCourses
        .map((raw) => {
          try {
            return transformCourseData(raw);
          } catch {
            return null;
          }
        })
        .filter((c): c is Course => Boolean(c))
    : [];

  const bySlug = new Map<string, Course>();
  for (const c of base) bySlug.set(c.slug || c.id, c);
  for (const c of cms) bySlug.set(c.slug || c.id, c);

  return sortCourses(Array.from(bySlug.values()));
}
```

`getTrainingCatalogMixed` keeps its exact signature and becomes:

```ts
export async function getTrainingCatalogMixed(cmsCourses?: unknown[]): Promise<Course[]> {
  const external = await getCourseCatalog();
  const base = external.length ? external : seedTrainingCourses;
  return mergeCourseCatalog(base, cmsCourses);
}
```

The public route is unchanged, because it calls the async function exactly as before.

- [ ] **Step 2: Create the context type**

Create `components/admin/cms-preview/preview-context.ts`. Types are derived from what each renderer accepts, so this cannot drift from the components it feeds, and every import is type-only so nothing server-side is pulled in:

```ts
import type { ComponentProps } from "react";

import type { CareersList } from "@/components/shared/careers-list";
import type { ImpactOverviewPage } from "@/components/impact/impact-overview-page";
import type { NewsHubPage } from "@/components/news/news-hub-page";
import type { PartnerDirectory } from "@/components/shared/partner-directory";
import type { PartnerWithUsOverviewPage } from "@/components/partnerships/partner-with-us-overview-page";
import type { TeamDirectory } from "@/components/shared/team-directory";
import type { TrainingCourseListingPage } from "@/components/training/training-course-listing-page";
import type { WhatWeDoOverviewPage } from "@/components/what-we-do/what-we-do-overview-page";

/**
 * Everything the sixteen previews need beyond the descriptor's own document.
 * Read once when the preview document loads: these are other screens' content,
 * and editing partners should not live-update the Our Impact preview.
 *
 * `courseCatalogue` is the BASE catalogue only. The courses preview merges the
 * draft's own courses over it on the client, because that list depends on what
 * the editor is typing.
 */
export type PreviewContext = {
  teamMembers: ComponentProps<typeof TeamDirectory>["members"];
  partners: ComponentProps<typeof PartnerDirectory>["partners"];
  jobs: ComponentProps<typeof CareersList>["jobs"];
  initiatives: ComponentProps<typeof WhatWeDoOverviewPage>["initiatives"];
  impactPartners: ComponentProps<typeof ImpactOverviewPage>["partners"];
  tracks: ComponentProps<typeof PartnerWithUsOverviewPage>["tracks"];
  articles: ComponentProps<typeof NewsHubPage>["articles"];
  courseCatalogue: ComponentProps<typeof TrainingCourseListingPage>["courses"];
};
```

Every path above was verified against the repo before this plan was written,
and three of the first guesses were wrong — the directories, and two component
names that the public routes import under an alias. In particular
`WhoWeArePage` and `ImpactReportsPage` are the real export names; the public
routes rename them to `WhoWeAreLandingPage` and `ImpactReportsTemplate` on
import, which is easy to copy by mistake.

If a path still fails, find the real one with
`grep -rn "export function <ComponentName>" components/`. Do not change a
component to make an import work.

- [ ] **Step 3: Create the registry**

Create `components/admin/cms-preview/preview-registry.tsx`. Each arm mirrors exactly what the public route renders — transcribed from `app/(public)/…/page.tsx`, so the preview cannot disagree with the page:

```tsx
"use client";

import type { ReactElement } from "react";

import { ContentPage } from "@/components/shared/content-page";
import { ContactPage } from "@/components/contact/contact-page";
import { ImpactOverviewPage } from "@/components/impact/impact-overview-page";
import { ImpactReportsPage } from "@/components/impact/impact-reports-page";
import { ImpactSdgsPage } from "@/components/impact/impact-sdgs-page";
import { ImpactTestimonialsPage } from "@/components/impact/impact-testimonials-page";
import { NewsHubPage } from "@/components/news/news-hub-page";
import { PartnerDirectory } from "@/components/shared/partner-directory";
import { PartnerWithUsOverviewPage } from "@/components/partnerships/partner-with-us-overview-page";
import { CareersList } from "@/components/shared/careers-list";
import { TeamDirectory } from "@/components/shared/team-directory";
import { ApplyForTrainingOverviewPage } from "@/components/training/apply-for-training-overview-page";
import { TrainingCourseListingPage } from "@/components/training/training-course-listing-page";
import { TrainingHowItWorksPage } from "@/components/training/training-how-it-works-page";
import { TrainingWhoCanApplyPage } from "@/components/training/training-who-can-apply-page";
import { WhatWeDoOverviewPage } from "@/components/what-we-do/what-we-do-overview-page";
import { WhoWeArePage } from "@/components/who-we-are/who-we-are-page";
import { mergeCourseCatalog } from "@/lib/api/training";
import type { ContentTypeDescriptor } from "@/lib/cms/descriptors/types";
import type { FormValues } from "@/lib/cms/descriptors/form-values";

import type { PreviewContext } from "./preview-context";

/** The sixteen descriptor keys with a previewable public route. */
export const PREVIEWABLE_KEYS = [
  "who-we-are",
  "team",
  "partners",
  "careers",
  "what-we-do",
  "apply-for-training",
  "apply-who-can-apply",
  "apply-how-it-works",
  "apply-courses",
  "impact-overview",
  "impact-reports",
  "impact-testimonials",
  "impact-sdgs",
  "partner-with-us",
  "news-hub",
  "contact",
] as const;

export type PreviewableKey = (typeof PREVIEWABLE_KEYS)[number];

/**
 * Whether this descriptor's editor should show a preview. A collection has no
 * single page to preview, and a descriptor without a route has no page at all.
 */
export function isPreviewableDescriptor(
  descriptor: ContentTypeDescriptor,
): boolean {
  return (
    descriptor.shape === "singleton" &&
    Boolean(descriptor.route) &&
    (PREVIEWABLE_KEYS as readonly string[]).includes(descriptor.key)
  );
}

/**
 * Renders the public composition for one descriptor against draft values.
 *
 * The `: ReactElement` annotation is what makes this switch exhaustive: this
 * project does not set `noImplicitReturns`, so without it a missing case
 * widens the inferred return to include `undefined` — a valid ReactNode — and
 * the omission would compile clean and render blank.
 */
export function renderDescriptorPreview(
  key: PreviewableKey,
  values: FormValues,
  context: PreviewContext,
): ReactElement {
  // Every renderer here already tolerates partially-filled seed content, which
  // is exactly the shape a half-typed draft has.
  const doc = values as unknown as never;

  switch (key) {
    case "who-we-are":
      return <WhoWeArePage page={doc} />;
    case "team":
      return (
        <>
          <ContentPage page={doc} />
          <TeamDirectory members={context.teamMembers} />
        </>
      );
    case "partners":
      return (
        <>
          <ContentPage page={doc} />
          <PartnerDirectory partners={context.partners} />
        </>
      );
    case "careers":
      return (
        <>
          <ContentPage page={doc} />
          <CareersList jobs={context.jobs} />
        </>
      );
    case "what-we-do":
      return (
        <WhatWeDoOverviewPage content={doc} initiatives={context.initiatives} />
      );
    case "apply-for-training":
      return (
        <ApplyForTrainingOverviewPage
          page={doc}
          cohorts={(values.cohorts as never) ?? []}
          process={(values.process as never) ?? []}
        />
      );
    case "apply-who-can-apply":
      return <TrainingWhoCanApplyPage page={doc} />;
    case "apply-how-it-works":
      return <TrainingHowItWorksPage page={doc} />;
    case "apply-courses":
      return (
        <TrainingCourseListingPage
          page={doc}
          // Merged on the client: this list depends on the draft's own
          // courses, so a server-side read would show nothing change.
          courses={mergeCourseCatalog(
            context.courseCatalogue,
            values.courses as unknown[] | undefined,
          )}
        />
      );
    case "impact-overview":
      return (
        <ImpactOverviewPage content={doc} partners={context.impactPartners} />
      );
    case "impact-reports":
      return <ImpactReportsPage content={doc} />;
    case "impact-testimonials":
      return <ImpactTestimonialsPage content={doc} />;
    case "impact-sdgs":
      return <ImpactSdgsPage content={doc} />;
    case "partner-with-us":
      return <PartnerWithUsOverviewPage content={doc} tracks={context.tracks} />;
    case "news-hub":
      return <NewsHubPage content={doc} articles={context.articles} />;
    case "contact":
      return <ContactPage content={doc} />;
  }
}
```

No `default` branch, and do not add one. If a component's real prop name differs from what is written here, correct the call site — never the component.

The `doc` cast is deliberate and is the one place this file is loose: `FormValues` is `Record<string, FieldValue>`, while each renderer wants its own content type. Casting once, with the comment above it, is honest about that; casting at sixteen call sites with sixteen different types would not be.

- [ ] **Step 4: Verify**

Run: `npm run type-check && npm run lint && npm run build`
Expected: all PASS.

Prove the exhaustiveness protection is real, rather than assuming it:

```bash
# Temporarily comment out the "contact" case, then:
npm run type-check 2>&1 | grep TS2366
# Expected: an error at renderDescriptorPreview's signature line.
# Restore the case and confirm type-check is clean again.
```

Paste both outputs. Without the `: ReactElement` annotation this check passes silently, which is exactly why it is here.

Run: `grep -c "admin-config" components/admin/cms-preview/*.ts components/admin/cms-preview/*.tsx`
Expected: `0` for every file — these are client components.

- [ ] **Step 5: Commit**

```bash
git add components/admin/cms-preview/preview-context.ts components/admin/cms-preview/preview-registry.tsx lib/api/training.ts
git commit -m "feat(cms): add the descriptor preview registry

Maps each of the sixteen routed singleton descriptors to the same
composition its public route renders, transcribed from those routes so
the preview cannot disagree with the page.

Splits a pure mergeCourseCatalog out of getTrainingCatalogMixed: the
courses listing merges the document's own courses over an external
catalogue, so that list depends on the draft and a server-side read
would show nothing change while an editor typed. The async wrapper keeps
its signature, so the public route is untouched.

Context types derive from each renderer's own props, so they cannot
drift from the components they feed."
```

---

### Task 3: The preview canvas and its route

**Files:**
- Create: `components/admin/cms-preview/preview-canvas.tsx`
- Create: `app/(admin-preview)/admin/cms-preview/[type]/[id]/preview/page.tsx`

**Interfaces:**
- Consumes: the protocol and boundary from `components/admin/workspace-kit/`, plus `PreviewContext`, `renderDescriptorPreview` and `PreviewableKey` from Task 2.
- Produces: `CmsPreviewCanvas` (props `descriptorKey: PreviewableKey`, `baseline: FormValues`, `context: PreviewContext`), and the route `/admin/cms-preview/[type]/[id]/preview`.

- [ ] **Step 1: Create the canvas**

There is no positional outline pairing here and no click-to-select: the compositions are opaque from outside and there is no rail to select into. One boundary wraps the whole composition, keyed on the payload version so a half-typed value recovers by itself.

```tsx
"use client";

import { useEffect, useState } from "react";

import { PreviewSectionBoundary } from "@/components/admin/workspace-kit/section-boundary";
import {
  isTrustedPreviewEvent,
  PREVIEW_DRAFT,
  PREVIEW_READY,
  type ParentToCanvasMessage,
} from "@/components/admin/workspace-kit/preview-protocol";
import type { FormValues } from "@/lib/cms/descriptors/form-values";

import type { PreviewContext } from "./preview-context";
import { renderDescriptorPreview, type PreviewableKey } from "./preview-registry";

export function CmsPreviewCanvas({
  descriptorKey,
  baseline,
  context,
}: {
  descriptorKey: PreviewableKey;
  baseline: FormValues;
  context: PreviewContext;
}) {
  const [values, setValues] = useState(baseline);
  const [payloadVersion, setPayloadVersion] = useState(0);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!isTrustedPreviewEvent(event) || event.source !== window.parent) {
        return;
      }
      const message = event.data as ParentToCanvasMessage<FormValues> | null;
      if (!message || typeof message !== "object") {
        return;
      }
      if (message.type === PREVIEW_DRAFT) {
        setValues(message.data);
        setPayloadVersion(message.payloadVersion);
      }
      // PREVIEW_SCROLL is ignored: this preview has no addressable sections,
      // because the compositions are opaque and there is no rail to scroll from.
    };

    window.addEventListener("message", handleMessage);
    // Announce readiness, or the parent's first payload races the iframe load.
    window.parent.postMessage({ type: PREVIEW_READY }, window.location.origin);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="bg-white">
      <PreviewSectionBoundary label="Page" resetKey={payloadVersion}>
        {renderDescriptorPreview(descriptorKey, values, context)}
      </PreviewSectionBoundary>
    </div>
  );
}
```

- [ ] **Step 2: Create the preview route**

Create `app/(admin-preview)/admin/cms-preview/[type]/[id]/preview/page.tsx`. It resolves the descriptor, refuses anything not previewable, reads the document, and fetches the context bundle once:

```tsx
import { notFound } from "next/navigation";

import { CmsPreviewCanvas } from "@/components/admin/cms-preview/preview-canvas";
import type { PreviewContext } from "@/components/admin/cms-preview/preview-context";
import {
  isPreviewableDescriptor,
  type PreviewableKey,
} from "@/components/admin/cms-preview/preview-registry";
import { getCourseCatalog } from "@/lib/api/courses";
import { getCmsPublishedArticles } from "@/lib/cms/articles";
import { getRecord } from "@/lib/cms/descriptors/crud";
import { getDescriptor } from "@/lib/cms/descriptors/registry";
import { initialValues } from "@/lib/cms/descriptors/form-values";
import { mergedRecordFor, resolveFields } from "@/lib/cms/descriptors/seed-collections";
import { getCmsInitiatives } from "@/lib/cms/initiatives";
import { getCmsJobs } from "@/lib/cms/jobs";
import { getCmsPartners } from "@/lib/cms/partners";
import { getCmsPartnershipTracks } from "@/lib/cms/partnerships";
import { getCmsTeamMembers } from "@/lib/cms/team";
import { seedTrainingCourses } from "@/lib/content/training-config";

type PreviewPageProps = { params: { type: string; id: string } };

export default async function CmsPreviewPage({ params }: PreviewPageProps) {
  const descriptor = getDescriptor(params.type);

  if (!descriptor || !isPreviewableDescriptor(descriptor)) {
    notFound();
  }

  const [
    stored,
    teamMembers,
    partners,
    jobs,
    initiatives,
    tracks,
    articles,
    externalCourses,
  ] = await Promise.all([
    getRecord(descriptor.key, params.id),
    getCmsTeamMembers(false),
    getCmsPartners(),
    getCmsJobs(false),
    getCmsInitiatives(),
    getCmsPartnershipTracks(),
    getCmsPublishedArticles(),
    getCourseCatalog(),
  ]);

  // The same base the public route uses: the external catalogue when it has
  // anything, the shipped seed otherwise.
  const courseCatalogue = externalCourses.length
    ? externalCourses
    : seedTrainingCourses;

  const context: PreviewContext = {
    teamMembers,
    partners,
    jobs,
    initiatives,
    // ImpactOverviewPage takes the same partner list under its own prop name.
    impactPartners: partners,
    tracks,
    articles,
    courseCatalogue,
  };

  // Built exactly as the editor builds it, with the same three helpers and the
  // same inputs, so the baseline is in the shape the form will report. Any
  // other shape and the first draft payload changes shape underneath the
  // composition.
  const fields = resolveFields(descriptor, { id: params.id, stored });
  const fallbackRecord = mergedRecordFor(descriptor, params.id, stored);
  const record = stored ?? { id: params.id };

  // Firestore can return records whose prototypes are not plain objects, which
  // cannot cross the Server-to-Client boundary. Rebuild as plain JSON.
  const baseline = JSON.parse(
    JSON.stringify(initialValues(fields, record, fallbackRecord)),
  ) as FormValues;

  return (
    <CmsPreviewCanvas
      descriptorKey={descriptor.key as PreviewableKey}
      baseline={baseline}
      context={context}
    />
  );
}
```

The baseline is built with the **same three helpers, in the same order, from
the same inputs** as `RecordForm` and the editor route already use —
`resolveFields`, `mergedRecordFor` and `initialValues(fields, record,
fallbackRecord)`. That matters more than it looks: the form reports
`FormValues`, so if the baseline were built any other way the first draft
payload would change shape underneath the composition mid-render.

One thing still to confirm while writing this: each context import above is the
getter the corresponding public route uses, but the module paths are inferred.
Check each with `grep -rn "export async function <getter>" lib/`, and where a
signature takes an argument the public route passes — `getCmsTeamMembers(false)`
and `getCmsJobs(false)` both do — pass the same one.

The `(admin-preview)` group's bare layout already applies `requireAdminPage()`,
and `middleware.ts` matches `/admin/:path*`, so this route is protected twice
over with no further work.

- [ ] **Step 3: Verify**

Run: `npm run type-check && npm run lint && npm run build`
Expected: all PASS, and the build's route list includes
`/admin/cms-preview/[type]/[id]/preview`. Quote that line.

Run: `curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' http://localhost:3000/admin/cms-preview/who-we-are/who-we-are/preview`
Expected: `307` to `/admin-login?next=…` — the route exists and is guarded. Start
the dev server first if it is not running.

- [ ] **Step 4: Commit**

```bash
git add components/admin/cms-preview/preview-canvas.tsx "app/(admin-preview)/admin/cms-preview"
git commit -m "feat(cms): add the descriptor preview document

Renders one descriptor's composition against draft values pushed in over
postMessage, inside a single boundary keyed on the payload version so a
half-typed value recovers on the next keystroke.

Ignores the scroll message deliberately: these compositions are opaque
from outside and there is no rail to scroll from, so there is nothing to
address. Context is fetched once here rather than pushed live, because it
belongs to other editors' screens."
```

---

### Task 4: The two-pane editor

**Files:**
- Create: `components/admin/cms-preview/editor-with-preview.tsx`
- Modify: `app/(admin)/admin/cms/[type]/[id]/page.tsx`
- Modify: `components/admin/admin-shell.tsx`

**Interfaces:**
- Consumes: `RecordForm`'s `onValuesChange` and the optional-rail `WorkspaceShell` (Task 1), `PreviewFrame` from the kit, `isPreviewableDescriptor` (Task 2).
- Produces: `EditorWithPreview`.

- [ ] **Step 1: Create the wrapper**

```tsx
"use client";

import { useState } from "react";

import { PreviewFrame } from "@/components/admin/workspace-kit/preview-frame";
import { WorkspaceShell } from "@/components/admin/workspace-kit/workspace-shell";
import { RecordForm } from "@/components/admin/record-form";
import type { FormValues } from "@/lib/cms/descriptors/form-values";
import type { ContentTypeDescriptor, FieldDescriptor } from "@/lib/cms/descriptors/types";

export function EditorWithPreview({
  descriptor,
  record,
  fields,
  fallbackRecord,
  revertible,
  recordId,
  initialValues,
}: {
  descriptor: ContentTypeDescriptor;
  record?: Record<string, unknown> & { id?: string };
  fields?: FieldDescriptor[];
  fallbackRecord?: Record<string, unknown>;
  revertible?: boolean;
  recordId: string;
  initialValues: FormValues;
}) {
  // Observed, never owned: RecordForm keeps its own state and its own save.
  const [values, setValues] = useState<FormValues>(initialValues);
  const [payloadVersion, setPayloadVersion] = useState(0);

  return (
    <WorkspaceShell
      bar={
        <header className="shrink-0 border-b border-slate-200 bg-white/95 px-4 py-4 shadow-sm backdrop-blur sm:px-6">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brand-primary">
            {descriptor.plural}
          </p>
          <h1 className="mt-1 font-heading text-2xl font-bold text-brand-ink">
            {descriptor.label}
          </h1>
        </header>
      }
      editor={
        <div className="h-full min-h-0 overflow-y-auto bg-brand-alt p-5">
          <RecordForm
            descriptor={descriptor}
            record={record}
            fields={fields}
            fallbackRecord={fallbackRecord}
            revertible={revertible}
            onValuesChange={(next) => {
              setValues(next);
              setPayloadVersion((version) => version + 1);
            }}
          />
        </div>
      }
      preview={
        <PreviewFrame
          previewRoute={`/admin/cms-preview/${descriptor.key}/${encodeURIComponent(recordId)}/preview`}
          payloadVersion={payloadVersion}
          data={values}
          activeSectionId={descriptor.key}
          // Null: this preview has no addressable sections to scroll to.
          scrollTargetId={null}
          onSelectSection={() => {}}
          footerLabel={descriptor.label}
          subject={descriptor.label}
          publicHref={descriptor.route ?? "/"}
        />
      }
    />
  );
}
```

Note the bar is deliberately minimal: saving, deleting and reverting all live
inside `RecordForm`, so duplicating a save button here would be a second control
for the same action.

- [ ] **Step 2: Wire the editor route**

In `app/(admin)/admin/cms/[type]/[id]/page.tsx`, keep everything up to and
including the not-found branch exactly as it is. Then, where it currently
renders `<RecordForm …>`, branch:

```tsx
  if (isPreviewableDescriptor(descriptor)) {
    return (
      <EditorWithPreview
        descriptor={descriptor}
        record={record}
        fields={fields}
        fallbackRecord={fallbackRecord}
        revertible={Boolean(seedRecord)}
        recordId={params.id}
        initialValues={initialValues(fields, record, fallbackRecord)}
      />
    );
  }
```

leaving the existing `AdminPageHeader` + `RecordForm` return as the fallback for
every other descriptor.

`fields`, `fallbackRecord` and `record` are already computed on lines 51-53 of
that page, and `initialValues` comes from
`@/lib/cms/descriptors/form-values` — add that one import. Passing the same
three values `RecordForm` itself would use guarantees the wrapper's first
payload matches what the form reports.

**This branch is the main regression risk in the plan.** Twenty-four
descriptors share this route, and only sixteen take the new path. Confirm the
others are untouched in Step 4.

- [ ] **Step 3: Extend the bleed predicate**

In `components/admin/admin-shell.tsx`, `isBleedAdminRoute` must also match the
routed-singleton editor, which now manages its own full height. The pathname
shape is `/admin/cms/<type>/<id>`:

```tsx
  // Only the routed singletons get the two-pane layout, but the predicate
  // cannot see the descriptor from a pathname — so it matches the shape and
  // accepts that a collection's record editor also loses its page padding.
  if (/^\/admin\/cms\/[^/]+\/[^/]+$/.test(pathname)) {
    return true;
  }
```

**Stop and think before writing this**, because the comment above admits a
problem: that regex matches *every* record editor, including collections that
still render the old one-column form, and those would lose their page padding
for no reason. Two ways out, and the second is better:

1. Match only the sixteen keys: `/^\/admin\/cms\/(who-we-are|team|…)\/[^/]+$/`.
   Correct, but duplicates the key list a third time.
2. Have the page itself declare it. `PREVIEWABLE_KEYS` is already exported, so
   import it and build the pattern from it:

```tsx
import { PREVIEWABLE_KEYS } from "@/components/admin/cms-preview/preview-registry";

const BLEED_CMS_KEYS = new Set<string>(PREVIEWABLE_KEYS);

// …inside isBleedAdminRoute:
  const cmsMatch = /^\/admin\/cms\/([^/]+)\/[^/]+$/.exec(pathname);
  if (cmsMatch && BLEED_CMS_KEYS.has(cmsMatch[1])) {
    return true;
  }
```

Take option 2. It keeps one source of truth for which descriptors are
previewable, and `preview-registry.tsx` is a client module with no server
imports, so importing it into the shell is safe.

- [ ] **Step 4: Verify, including that collections are untouched**

Run: `npm run type-check && npm run lint && npm run build && npm run verify:cms`
Expected: all PASS.

Then prove the predicate discriminates:

```bash
node -e '
const keys = ["who-we-are","team","partners","careers","what-we-do","apply-for-training","apply-who-can-apply","apply-how-it-works","apply-courses","impact-overview","impact-reports","impact-testimonials","impact-sdgs","partner-with-us","news-hub","contact"];
const set = new Set(keys);
const re = /^\/admin\/cms\/([^/]+)\/[^/]+$/;
const cases = [
  ["/admin/cms/who-we-are/who-we-are", true],
  ["/admin/cms/contact/contact", true],
  ["/admin/cms/testimonial/abc123", false],
  ["/admin/cms/partner/xyz", false],
  ["/admin/cms/who-we-are", false],
  ["/admin/cms/who-we-are/who-we-are/extra", false],
];
let bad = 0;
for (const [p, want] of cases) {
  const m = re.exec(p);
  const got = Boolean(m && set.has(m[1]));
  if (got !== want) { bad++; console.log("WRONG", p, got, "want", want); }
}
console.log(bad ? bad + " wrong" : "all six cases correct");
process.exit(bad ? 1 : 0);
'
```

Expected: `all six cases correct`. Note `partner` and `testimonial` are real
collection keys and must NOT bleed, while `partners` (plural, the Who We Are
subpage) must.

- [ ] **Step 5: Commit**

```bash
git add components/admin/cms-preview/editor-with-preview.tsx "app/(admin)/admin/cms/[type]/[id]/page.tsx" components/admin/admin-shell.tsx
git commit -m "feat(cms): give routed singleton editors a two-pane live preview

Sixteen descriptors that declare a public route now edit in two panes,
fields beside a live preview of the real page. Every other descriptor,
collections included, renders exactly the editor it did before.

The shell's bleed predicate derives its key list from the registry
rather than restating it, so a collection's record editor cannot lose
its page padding by accident — `partner` must not bleed while `partners`
must."
```

---

### Task 5: The browser pass

This is the task the two previous plans deferred and never performed. It is possible here, because the descriptor-backed getters fall back to seed content — so every preview renders with **no Firebase credentials**, needing only an admin session cookie.

**Files:**
- None. This task produces evidence, not code.

**Interfaces:**
- Consumes: everything.
- Produces: screenshots and a pass/fail line per viewport.

- [ ] **Step 1: Start the app and sign in**

Run `npm run dev`, open `http://localhost:3000/admin-login`, sign in, and copy the `itfy-admin-session` cookie value from devtools.

- [ ] **Step 2: Walk three editors by hand**

Open each and confirm the preview renders the real page and updates as you type, without saving:

- `http://localhost:3000/admin/cms/who-we-are/who-we-are` — doc-only
- `http://localhost:3000/admin/cms/our-impact/overview` — needs context (partners)
- `http://localhost:3000/admin/cms/apply-courses/courses` — the merged list

For the third, edit a course entry and confirm the **course list itself** changes. That is the one page where a context-only treatment would have silently shown nothing, so it is the specific thing worth checking.

Also confirm a collection editor is unchanged: `http://localhost:3000/admin/cms/testimonial` and one of its records should look exactly as before, one column with page padding.

- [ ] **Step 3: Run the viewport assertions**

```bash
ITFY_ADMIN_SESSION="<cookie value>" npm run shoot:workspace /admin/cms/who-we-are/who-we-are cms-who-we-are
```

Expected:

```
PASS desktop: innerWidth=1280 lgMatches=true (expected true)
PASS tablet: innerWidth=820 lgMatches=false (expected false)
PASS mobile: innerWidth=390 lgMatches=false (expected false)

All viewport checks passed.
```

A `FAIL mobile … lgMatches=true` means the iframe is not driving the breakpoints. Fix the frame, not the script.

- [ ] **Step 4: Record the result**

Append what you observed to the report file, including the three screenshots' paths and whether the courses list updated live. If anything failed, stop and report rather than committing.

- [ ] **Step 5: Commit the screenshots' existence, not the images**

Nothing to commit unless a defect was found and fixed. Report the outcome.

---

## Done when

- All sixteen routed singleton editors show fields beside a live preview of their real public page, updating as you type without saving.
- Editing a course in `apply-courses` changes the rendered course list.
- Every other descriptor's editor — all eight collections — is byte-identical in behaviour and appearance.
- Removing a case from the registry's switch produces `TS2366`.
- `type-check`, `lint`, `build` and `verify:cms` all pass, and no public renderer changed except the pure-function split in `lib/api/training.ts`.
- `shoot:workspace` reports PASS for all three viewports.
