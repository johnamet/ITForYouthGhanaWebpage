# Homepage CMS Live-Preview Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the seven stacked forms at `/admin/content/homepage` with a section-aware editing workspace whose live preview renders the real public homepage components against unsaved draft values.

**Architecture:** A single mounted client provider owns the published baseline and a draft map keyed by `homepageSchema` field names; the seven existing forms become controlled inputs against it. The preview is a same-origin iframe pointing at an `/admin` route that renders the genuine public homepage components, fed debounced draft payloads over `postMessage`. An iframe is required rather than an in-place render because the homepage components style themselves with viewport-relative Tailwind breakpoints, which only resolve correctly inside a real nested browsing context.

**Tech Stack:** Next.js 14.2 App Router, React 18.3, TypeScript 5.7 (`strict`, `noUncheckedIndexedAccess` off), Tailwind CSS, lucide-react, Firebase Admin (server only), Playwright (screenshots only — not a test runner).

**Spec:** `docs/superpowers/specs/2026-09-08-homepage-cms-live-preview-design.md`

## Global Constraints

- **No test runner exists in this repo, by explicit decision. Never add one.** Verification for every task is `npm run type-check`, `npm run lint`, `npm run build`, plus a browser check where stated.
- **Verification never gates the build.** Anything new goes in a separate npm script.
- **No client component may import `lib/cms/admin-config.ts`, directly or transitively.** It imports `getAdminSdkStatus`, which calls `loadServiceAccount()` and reads the service-account private key from the environment.
- **Per-section save only.** Each save PUTs exactly one `homepageSchema` key. There is no "save all" anywhere in this plan.
- **Section switching must not remount the workspace and must not re-render the server page.** Use `window.history.replaceState`, supported natively since Next 14.1. `router.replace()` is wrong here: in the App Router it re-renders the server component, re-running all seven Firestore getters on every section click.
- **Drafts are in-memory only.** No `sessionStorage`, no `localStorage`.
- **No changes to `PUT /api/admin/homepage` or to `homepageSchema`.** The endpoint already merge-sets any subset of keys.
- **No restyling of public homepage components.** They are rendered as-is.
- **Icons are `lucide-react`.** The mockup's `<iconify-icon>` tags are mockup-only; never introduce that dependency.
- **Brand palette only**, via existing Tailwind `brand-*` tokens: navy `#142850`, primary blue `#1E72BA`, dark blue `#0152BE`, mist `#E8F1FA`, accent pink `#D70B52`, dark pink `#B00944`, warm pink `#FBE7EF`, ink `#1A1A1A`, muted `#5C6672`, border `#D8E5F2`, alt background `#F7F9FC`, white. No green, orange, yellow, purple, neon, metallic, or gradients outside tonal blends of these.
  Two deliberate exemptions inside the admin surface, which the approved brief
  blesses when it says to keep "the current white/slate CMS surfaces":
  `slate-*` neutrals, and **semantic status colour** — `emerald-*` for saved and
  `rose-*` for errors, as every existing admin form already uses. Rendering an
  error in brand pink, the same colour as the primary action, would make a
  failure look like an invitation. This exemption covers admin chrome only and
  never public pages.
- **Control radius 6px; media and small surfaces 12px** — expressed through the
  semantic Tailwind tokens `rounded-control` (0.375rem) and `rounded-media`
  (0.75rem) that `tailwind.config.ts` already defines, not raw `rounded-md` /
  `rounded-xl`. Headings use `font-heading` (Georgia/Cambria); body copy uses Inter.
- **Accessible keyboard focus is required** on the rail, the section outlines, and the viewport controls.

**The seven section keys, fixed for the whole plan.** Every task uses exactly these strings:

```
ticker  overviewSection  challengeSection  missionSection
programmeShowcase  joinCtaCards  newsletterSignup
```

**The fifteen preview sections in public render order.** Editable ones marked `*`:

```
 1 hero slideshow          9 featured story
 2 marquee ticker *       10 latest news
 3 overview *             11 testimonials
 4 challenge *            12 team
 5 mission *              13 partners
 6 impact counter         14 join CTA cards *
 7 programme showcase *   15 newsletter signup *
 8 donation campaign
```

## File Structure

**Create:**

| File | Responsibility |
|---|---|
| `lib/cms/homepage-sections.ts` | The seven-section registry. Client-safe, standalone, no `admin-config` import. Source of truth for id, schema key, label, description, page order. |
| `components/admin/homepage-workspace/workspace-provider.tsx` | The only stateful module: baseline, drafts, active section, per-section save, leave guard. |
| `components/admin/homepage-workspace/section-rail.tsx` | Section list with active / unsaved / saved / hidden states. |
| `components/admin/homepage-workspace/section-editor.tsx` | Maps active section to its controlled form; renders the save footer. |
| `components/admin/homepage-workspace/workspace-bar.tsx` | Sticky header: breadcrumb, dirty badge, save, open public page. |
| `components/admin/homepage-workspace/preview-pane.tsx` | Iframe host: viewport controls, fit, refresh, message plumbing. |
| `components/admin/homepage-workspace/preview-messages.ts` | The message contract shared by pane and canvas. Types and origin guard in one place. |
| `components/admin/homepage-workspace/preview-canvas.tsx` | Renders the fifteen sections, merges drafts over baseline, outlines and labels each. |
| `components/admin/homepage-workspace/preview-section-boundary.tsx` | Per-section error boundary, keyed on payload version. |
| `components/admin/homepage-workspace/workspace-layout.tsx` | Three-column layout and the responsive Edit/Preview tab state. |
| `app/(admin-preview)/layout.tsx` | Bare auth-checked layout with no shell chrome, for the iframe document. |
| `app/(admin-preview)/admin/content/homepage/preview/page.tsx` | The iframe document. Server-fetches the baseline. |
| `scripts/shoot-homepage-workspace.mjs` | Playwright screenshots at the three preview widths. |

**Modify:**

| File | Change |
|---|---|
| `lib/cms/admin-config.ts` | Add the missing `overview` entry, sourcing label and description from the new registry. |
| `components/admin/admin-shell.tsx` | Full-bleed variant selected from `usePathname()`. |
| `tailwind.config.ts` | Add the missing `brand-alt` token for the palette's `#F7F9FC`. |
| `components/home/legacy-homepage-sections.tsx` | Export the three narrative sections so each can be outlined separately. |
| `components/admin/homepage-narrative-forms.tsx` | Three forms become controlled. |
| `components/admin/ticker-form.tsx` | Controlled. |
| `components/admin/programme-showcase-form.tsx` | Controlled. |
| `components/admin/join-cta-cards-form.tsx` | Controlled. |
| `components/admin/newsletter-form.tsx` | Controlled. |
| `app/(admin)/admin/content/homepage/page.tsx` | Becomes a thin server page rendering the workspace. |
| `app/(admin)/admin/content/homepage/sections/[section]/page.tsx` | Homepage-owned rows gain `?section=<id>`. |
| `package.json` | Add the `shoot:homepage-workspace` script. |

---

### Task 1: Section registry and the missing overview entry

Nothing else can be built until the seven sections have stable ids and keys, because the rail, the editor, the messages, and the canvas all address sections by id.

**Files:**
- Create: `lib/cms/homepage-sections.ts`
- Modify: `lib/cms/admin-config.ts:427-547` (the `homepageSectionConfigs` array)

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `HomepageDraftValues`, `HomepageSectionKey`, `WorkspaceSection`, `workspaceSections`, `workspaceSectionsById`, `DEFAULT_WORKSPACE_SECTION_ID`, `findWorkspaceSection(id)`.

Export nothing beyond that list. In particular do not add a keys array or any
other convenience export that no other task consumes.

- [ ] **Step 1: Create the registry**

Create `lib/cms/homepage-sections.ts`:

```ts
import type { JoinCtaCard } from "@/components/home/join-cta-block";
import type {
  ChallengeSectionContent,
  MissionSectionContent,
  OverviewSectionContent,
} from "@/components/home/legacy-homepage-sections";
import type { MarqueeTickerContent } from "@/components/home/marquee-ticker";
import type { NewsletterSignupContent } from "@/components/home/newsletter-signup-section";
import type { ProgrammeShowcaseItem } from "@/types/content";

/**
 * The seven homepage sections editable at /admin/content/homepage, keyed by
 * their `homepageSchema` field name. Every other homepage section is edited on
 * its own admin route and appears in the preview as read-only context.
 */
export type HomepageDraftValues = {
  ticker: MarqueeTickerContent;
  overviewSection: OverviewSectionContent;
  challengeSection: ChallengeSectionContent;
  missionSection: MissionSectionContent;
  programmeShowcase: ProgrammeShowcaseItem[];
  joinCtaCards: JoinCtaCard[];
  newsletterSignup: NewsletterSignupContent;
};

export type HomepageSectionKey = keyof HomepageDraftValues;

export type WorkspaceSection = {
  /** Stable id used in `?section=` and in postMessage payloads. */
  id: string;
  key: HomepageSectionKey;
  label: string;
  description: string;
  /** 1-based position among the fifteen sections the homepage renders. */
  order: number;
};

// This module is imported by client components, so it must never import
// lib/cms/admin-config.ts — that module reads the service-account private key
// via getAdminSdkStatus. The dependency runs the other way: admin-config.ts
// imports these labels. See the spec's client-safety constraint.
const SECTIONS = {
  marquee: {
    id: "marquee",
    key: "ticker",
    label: "Marquee ticker",
    description:
      "Rotating stats, calls to action, news headlines, and partner logos.",
    order: 2,
  },
  overview: {
    id: "overview",
    key: "overviewSection",
    label: "Overview section",
    description:
      "Introduction and story shown near the top of the homepage.",
    order: 3,
  },
  "challenge-section": {
    id: "challenge-section",
    key: "challengeSection",
    label: "Challenge section",
    description:
      "Digital-divide narrative, statistics, comparison lists, and support CTA.",
    order: 4,
  },
  "mission-section": {
    id: "mission-section",
    key: "missionSection",
    label: "Mission section",
    description:
      "Vision and mission narrative, supporting image, CTA, and visibility.",
    order: 5,
  },
  "programme-showcase": {
    id: "programme-showcase",
    key: "programmeShowcase",
    label: "Programme showcase",
    description: "Featured training, initiative, and pathway cards.",
    order: 7,
  },
  "join-cta": {
    id: "join-cta",
    key: "joinCtaCards",
    label: "Join CTA cards",
    description:
      "Learner, organisation, and volunteer CTA cards near the end of the homepage.",
    order: 14,
  },
  newsletter: {
    id: "newsletter",
    key: "newsletterSignup",
    label: "Newsletter signup",
    description:
      "Newsletter signup copy, interest tag, privacy note, and visibility toggle.",
    order: 15,
  },
} satisfies Record<string, WorkspaceSection>;

/** Lookup by section id. `satisfies` keeps every property exactly typed. */
export const workspaceSectionsById = SECTIONS;

/** The seven sections in public page order. */
export const workspaceSections: WorkspaceSection[] = Object.values(
  SECTIONS,
).sort((left, right) => left.order - right.order);

export const DEFAULT_WORKSPACE_SECTION_ID = "overview" as const;

/** Resolves a `?section=` value, falling back to the overview section. */
export function findWorkspaceSection(
  id: string | null | undefined,
): WorkspaceSection {
  return (
    workspaceSections.find((section) => section.id === id) ??
    SECTIONS[DEFAULT_WORKSPACE_SECTION_ID]
  );
}
```

- [ ] **Step 2: Verify it type-checks in isolation**

Run: `npm run type-check`
Expected: PASS. If `satisfies` errors, confirm TypeScript is 5.x — the repo has `^5.7.3`.

- [ ] **Step 3: Add the missing overview entry to admin-config**

`lib/cms/admin-config.ts` currently holds fifteen `homepageSectionConfigs` entries and has no `overview` entry, even though `/admin/content/homepage` renders `OverviewSectionForm`.

Add this import alongside the existing imports at the top of the file:

```ts
import { workspaceSectionsById } from "@/lib/cms/homepage-sections";
```

Then insert this entry into the `homepageSectionConfigs` array immediately **after** the existing `marquee` entry (which ends at line 451) and **before** the `impact-counter` entry, so the array order continues to track the page:

```ts
  {
    id: workspaceSectionsById.overview.id,
    label: workspaceSectionsById.overview.label,
    route: "/admin/content/homepage",
    status: "live",
    collection: FIREBASE_COLLECTIONS.homepage,
    description: workspaceSectionsById.overview.description,
  },
```

This brings the array to sixteen entries and takes the count of rows pointing at `/admin/content/homepage` from six to seven.

- [ ] **Step 4: Verify**

Run: `npm run type-check && npm run lint && npm run build`
Expected: all PASS.

Then run: `npm run verify:cms`
Expected: PASS. This exercises CMS wiring and will catch a malformed config entry.

- [ ] **Step 5: Commit**

```bash
git add lib/cms/homepage-sections.ts lib/cms/admin-config.ts
git commit -m "feat(cms): add the homepage workspace section registry

Declares the seven sections editable at /admin/content/homepage with
their homepageSchema keys, labels, descriptions and page order, and
fills the missing overview entry in homepageSectionConfigs.

The registry is standalone rather than derived from admin-config,
because admin-config reads the service-account private key and the
section rail that consumes this is a client component."
```

---

### Task 2: Full-bleed admin shell variant

The workspace needs the full viewport height. `AdminShell` wraps every admin page in `px-4 py-8 sm:px-6 lg:px-10`, which a three-column full-height layout cannot live inside.

A prop cannot express this: the page is a *child* of `AdminShell`, so it cannot set its parent's props, and a nested layout cannot alter a parent layout's padding. `AdminShell` is already a client component calling `usePathname()` for nav active states, so the variant is selected from the pathname.

**Files:**
- Modify: `components/admin/admin-shell.tsx:233`
- Modify: `tailwind.config.ts` (the `brand` colour block)

**Interfaces:**
- Consumes: nothing.
- Produces: `BLEED_ADMIN_ROUTES` exported from `components/admin/admin-shell.tsx`, and the `brand-alt` Tailwind token.

- [ ] **Step 1: Add the missing brand-alt token**

The approved palette includes `#F7F9FC` as the alternate background, and later
tasks use `bg-brand-alt` for the editor pane and the error placeholder. The
`brand` block in `tailwind.config.ts` has no token for it, so the class would
silently render nothing.

Add this line to the `brand` colour block in `tailwind.config.ts`, beside the
existing `mist`, `border`, and `warm` entries:

```ts
          alt: "#F7F9FC",
```

Every other colour these tasks use already exists: `brand-primary`,
`brand-primary-dark`, `brand-accent`, `brand-accent-dark`, `brand-navy`,
`brand-ink`, `brand-mist`, `brand-border`, `brand-warm`, `brand-muted`.

- [ ] **Step 2: Add the route list**

In `components/admin/admin-shell.tsx`, add below the existing `SidebarItem` type declaration:

```ts
/**
 * Admin routes that manage their own full-height layout and must not receive
 * the shell's default page padding. Selected from the pathname because a page
 * cannot set a prop on the shell that renders it.
 */
export const BLEED_ADMIN_ROUTES = ["/admin/content/homepage"];
```

- [ ] **Step 3: Apply the variant**

`AdminShell` already calls `usePathname()`. Inside the component body, above the returned JSX, add:

```ts
const isBleed = BLEED_ADMIN_ROUTES.includes(pathname);
```

Replace line 233:

```tsx
        <main className="bg-slate-100 px-4 py-8 text-slate-900 sm:px-6 lg:px-10">{children}</main>
```

with:

```tsx
        <main
          className={cn(
            "bg-slate-100 text-slate-900",
            isBleed ? "min-h-screen" : "px-4 py-8 sm:px-6 lg:px-10",
          )}
        >
          {children}
        </main>
```

`cn` is already imported in this file from `@/lib/utils/cn`.

Note `BLEED_ADMIN_ROUTES.includes(pathname)` is an exact match, so
`/admin/content/homepage/sections/...` and `/admin/content/homepage/preview`
keep the normal padding. That is deliberate — the preview route is rendered
inside an iframe and must not inherit workspace chrome.

- [ ] **Step 4: Verify no other admin page changed**

Run: `npm run dev`

Visit `/admin/dashboard` and `/admin/articles`. Expected: unchanged padded layout.
Visit `/admin/content/homepage`. Expected: the seven existing forms now sit flush against the sidebar with no page padding. It will look wrong — that is correct for this task, since the workspace layout arrives in Task 6.

- [ ] **Step 5: Verify**

Run: `npm run type-check && npm run lint && npm run build`
Expected: all PASS.

- [ ] **Step 6: Commit**

```bash
git add components/admin/admin-shell.tsx tailwind.config.ts
git commit -m "feat(admin): add a full-bleed shell variant for full-height pages

The homepage CMS workspace manages its own full-height three-column
layout and cannot live inside the shell's page padding. Selected from
usePathname() because a page cannot set a prop on its parent shell."
```

---

### Task 3: Workspace provider

The only stateful module. Everything after this reads from it.

**Files:**
- Create: `components/admin/homepage-workspace/workspace-provider.tsx`

**Interfaces:**
- Consumes: `HomepageDraftValues`, `HomepageSectionKey`, `WorkspaceSection`, `findWorkspaceSection` from Task 1.
- Produces: `HomepageWorkspaceProvider` (props `publishedValues: HomepageDraftValues`, `initialSectionId: string | null`, `children`), `useWorkspace()`, and type `SaveState`.

- [ ] **Step 1: Create the provider**

Create `components/admin/homepage-workspace/workspace-provider.tsx`:

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

import {
  findWorkspaceSection,
  type HomepageDraftValues,
  type HomepageSectionKey,
  type WorkspaceSection,
} from "@/lib/cms/homepage-sections";

export type SaveState =
  | { status: "idle" }
  | { status: "saving" }
  | { status: "saved"; message: string }
  | { status: "error"; message: string };

type WorkspaceContextValue = {
  /** Published values as last read from the server. */
  published: HomepageDraftValues;
  /** Only sections with unsaved edits appear here. */
  drafts: Partial<HomepageDraftValues>;
  /** published merged with drafts — exactly what the preview renders. */
  values: HomepageDraftValues;
  activeSection: WorkspaceSection;
  /** Increments on every draft change. Keys the preview error boundaries. */
  payloadVersion: number;
  isDirty: (key: HomepageSectionKey) => boolean;
  anyDirty: boolean;
  saveState: SaveState;
  setValue: <K extends HomepageSectionKey>(
    key: K,
    value: HomepageDraftValues[K],
  ) => void;
  selectSection: (id: string) => void;
  save: (key: HomepageSectionKey) => Promise<void>;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function useWorkspace(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error(
      "useWorkspace must be used inside HomepageWorkspaceProvider",
    );
  }
  return context;
}

export function HomepageWorkspaceProvider({
  publishedValues,
  initialSectionId,
  children,
}: {
  publishedValues: HomepageDraftValues;
  initialSectionId: string | null;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [published, setPublished] = useState(publishedValues);
  const [drafts, setDrafts] = useState<Partial<HomepageDraftValues>>({});
  const [activeId, setActiveId] = useState(
    () => findWorkspaceSection(initialSectionId).id,
  );
  const [payloadVersion, setPayloadVersion] = useState(0);
  const [saveState, setSaveState] = useState<SaveState>({ status: "idle" });

  // `save` needs to know what the drafts hold *when its request returns*, not
  // what they held when it was called. Reading state through a ref is the only
  // way to see edits made while the request was in flight.
  const draftsRef = useRef(drafts);
  useEffect(() => {
    draftsRef.current = drafts;
  }, [drafts]);

  // Keys with a save request currently in flight, so one section cannot have
  // two overlapping writes.
  const inFlight = useRef<Set<HomepageSectionKey>>(new Set());

  // A save calls router.refresh(), which hands this component new published
  // props. Replace the baseline ONLY — never touch drafts, or saving one
  // section would silently discard unsaved edits in another.
  useEffect(() => {
    setPublished(publishedValues);
  }, [publishedValues]);

  const values = useMemo(
    () => ({ ...published, ...drafts }) as HomepageDraftValues,
    [published, drafts],
  );

  const anyDirty = Object.keys(drafts).length > 0;

  const isDirty = useCallback(
    (key: HomepageSectionKey) => key in drafts,
    [drafts],
  );

  const setValue = useCallback(
    <K extends HomepageSectionKey>(key: K, value: HomepageDraftValues[K]) => {
      setDrafts((current) => ({ ...current, [key]: value }));
      setPayloadVersion((version) => version + 1);
      setSaveState({ status: "idle" });
    },
    [],
  );

  const selectSection = useCallback((id: string) => {
    const section = findWorkspaceSection(id);
    setActiveId(section.id);
    // Shallow by design. window.history is natively supported by the App
    // Router since Next 14.1 and does NOT re-render the server component, so
    // switching sections never re-runs the seven Firestore getters.
    // router.replace() would.
    const url = new URL(window.location.href);
    url.searchParams.set("section", section.id);
    window.history.replaceState(null, "", url);
  }, []);

  const save = useCallback(
    async (key: HomepageSectionKey) => {
      const value = drafts[key];
      if (value === undefined || inFlight.current.has(key)) {
        return;
      }

      inFlight.current.add(key);
      setSaveState({ status: "saving" });
      try {
        const response = await fetch("/api/admin/homepage", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [key]: value }),
        });
        const payload = (await response.json().catch(() => null)) as
          | { success?: boolean; message?: string }
          | null;

        if (!response.ok || !payload?.success) {
          throw new Error(
            payload?.message || "We couldn't save this homepage section.",
          );
        }

        // The server now holds `value`, so fold it into the baseline
        // regardless — that is simply true.
        setPublished((current) => ({ ...current, [key]: value }));

        // But the editor may have changed this section again while the request
        // was in flight. Clearing the draft unconditionally would discard that
        // newer edit and report the section as saved, which is silent data
        // loss. Only clear when the draft still holds exactly what was sent;
        // `setValue` always creates a new object, so identity is a sound test.
        const superseded = draftsRef.current[key] !== value;

        if (superseded) {
          setSaveState({
            status: "saved",
            message:
              "Saved. You have changed this section since — save again to publish those edits.",
          });
        } else {
          setDrafts((current) => {
            const next = { ...current };
            delete next[key];
            return next;
          });
          setSaveState({
            status: "saved",
            message: payload.message || "Homepage section updated.",
          });
        }
        router.refresh();
      } catch (error) {
        // Keep the draft. The editor footer surfaces this message.
        setSaveState({
          status: "error",
          message: error instanceof Error ? error.message : "Save failed.",
        });
      } finally {
        inFlight.current.delete(key);
      }
    },
    [drafts, router],
  );

  // Browser-level guard for tab close and reload.
  useEffect(() => {
    if (!anyDirty) {
      return;
    }
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () =>
      window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [anyDirty]);

  // In-app guard for admin navigation. Capture phase so it runs before the
  // router's own click handling.
  useEffect(() => {
    if (!anyDirty) {
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
      // A modified or non-primary click opens the link in a new tab or window
      // and leaves this tab's drafts untouched, so there is nothing to warn
      // about — and cancelling would block the browser's own behaviour.
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
      // Navigation within the workspace is not leaving it. Matched precisely
      // so a future sibling route such as /admin/content/homepage-archive is
      // not silently exempted from the guard.
      const workspacePath = "/admin/content/homepage";
      if (
        href === workspacePath ||
        href.startsWith(`${workspacePath}?`) ||
        href.startsWith(`${workspacePath}#`)
      ) {
        return;
      }
      const confirmed = window.confirm(
        "You have unsaved homepage changes. Leave and discard them?",
      );
      if (!confirmed) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [anyDirty]);

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      published,
      drafts,
      values,
      activeSection: findWorkspaceSection(activeId),
      payloadVersion,
      isDirty,
      anyDirty,
      saveState,
      setValue,
      selectSection,
      save,
    }),
    [
      published,
      drafts,
      values,
      activeId,
      payloadVersion,
      isDirty,
      anyDirty,
      saveState,
      setValue,
      selectSection,
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
Expected: both PASS. The provider is not yet rendered anywhere, so `npm run build` will tree-shake it; that is fine at this stage.

- [ ] **Step 3: Commit**

```bash
git add components/admin/homepage-workspace/workspace-provider.tsx
git commit -m "feat(cms): add the homepage workspace draft store

Holds the published baseline and a draft map keyed by homepageSchema
field name. Dirtiness is derived from key presence rather than stored
separately, and a save folds its value into the baseline as it clears
the draft so the preview cannot flicker back to the pre-save copy.

Section switching uses window.history.replaceState so it never
re-renders the server page and re-runs the seven Firestore getters."
```

---

### Task 4: Make the seven forms controlled

The forms currently own their values and their saving. The provider now owns both.

**These forms use updater-function state throughout** — `setValues((v) => ...)`, `setItems((arr) => ...)`, `setCards((arr) => ...)`. Rather than rewriting a dozen helpers per form, give each form a local adapter with the same shape, so **every existing call site stays byte-identical**:

```tsx
const setValues = (updater: (current: T) => T) => onChange(updater(value));
```

This is safe here because every handler in these files calls its setter exactly once per event. If a future handler needs two updates in one event, it must compose them into a single call — the adapter is synchronous and has no queue.

**Files:**
- Modify: `components/admin/homepage-narrative-forms.tsx`
- Modify: `components/admin/ticker-form.tsx`
- Modify: `components/admin/programme-showcase-form.tsx`
- Modify: `components/admin/join-cta-cards-form.tsx`
- Modify: `components/admin/newsletter-form.tsx`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: seven controlled components, each taking exactly `{ value, onChange }`:

```tsx
OverviewSectionForm    { value: OverviewSectionContent;    onChange: (next: OverviewSectionContent) => void }
ChallengeSectionForm   { value: ChallengeSectionContent;   onChange: (next: ChallengeSectionContent) => void }
MissionSectionForm     { value: MissionSectionContent;     onChange: (next: MissionSectionContent) => void }
TickerForm             { value: MarqueeTickerContent;      onChange: (next: MarqueeTickerContent) => void }
ProgrammeShowcaseForm  { value: ProgrammeShowcaseItem[];   onChange: (next: ProgrammeShowcaseItem[]) => void }
JoinCtaCardsForm       { value: JoinCtaCard[];             onChange: (next: JoinCtaCard[]) => void }
NewsletterForm         { value: NewsletterSignupContent;   onChange: (next: NewsletterSignupContent) => void }
```

- [ ] **Step 1: Establish the failing state**

Run: `npm run type-check`
Expected: PASS right now. This step records the starting point — after Step 2 it must fail at `app/(admin)/admin/content/homepage/page.tsx`, which still passes `initial`. That failure is the signal the refactor is complete and is resolved in Task 6.

- [ ] **Step 2: Convert `homepage-narrative-forms.tsx`**

For each of `OverviewSectionForm`, `ChallengeSectionForm`, `MissionSectionForm`:

1. Change the signature. For example, `ChallengeSectionForm` becomes:

```tsx
export function ChallengeSectionForm({
  value,
  onChange,
}: {
  value: ChallengeSectionContent;
  onChange: (next: ChallengeSectionContent) => void;
}) {
  const update = <K extends keyof ChallengeSectionContent>(
    key: K,
    next: ChallengeSectionContent[K],
  ) => onChange({ ...value, [key]: next });
```

2. Delete these from the component body: the `useRouter()` call, `useState(initial)`, the `busy` state, the `state`/`setState` submit state, and the whole `submit` function.
3. Rename every remaining reference to the old state variable `values` so it reads `value` (for example `values.stats` becomes `value.stats`, `values.problemItems` becomes `value.problemItems`).
4. Replace the wrapping `<form onSubmit={submit} className="space-y-6">` with `<div className="space-y-6">` and its closing tag, and delete the `<Notice state={state} />` line and the `<SaveButton busy={busy} label="..." />` line.

Then delete the now-unused module-level helpers `Notice`, `SaveButton`, `saveHomepageField`, and the `ApiResponse` / `SubmitState` types, plus the now-unused imports (`FormEvent`, `useState`, `useRouter`, `AlertCircle`, `CheckCircle2`, `Loader2`, `Save`). Keep `Field`, `Active`, and the `input` class constant — the field JSX still uses them.

- [ ] **Step 3: Convert `ticker-form.tsx`**

```tsx
export function TickerForm({
  value,
  onChange,
}: {
  value: MarqueeTickerContent;
  onChange: (next: MarqueeTickerContent) => void;
}) {
  const setValues = (updater: (current: MarqueeTickerContent) => MarqueeTickerContent) =>
    onChange(updater(value));
```

Every existing helper — `update`, `addItem`, `removeItem`, `updateItem`, `up`, `down` — is left exactly as written, because each already calls `setValues((v) => ...)`.

Then delete: the `useRouter()` call, `useState`, `isSubmitting`, `submitState`, the whole `onSave` function, the submit-state notice block in the JSX, and the save button. Replace remaining reads of `values` in the JSX with `value`. Delete the now-unused `Props`, `ApiResponse`, and `SubmitState` types and unused imports.

- [ ] **Step 4: Convert `programme-showcase-form.tsx` and `join-cta-cards-form.tsx`**

These hold arrays. For `programme-showcase-form.tsx`:

```tsx
export function ProgrammeShowcaseForm({
  value,
  onChange,
}: {
  value: ProgrammeShowcaseItem[];
  onChange: (next: ProgrammeShowcaseItem[]) => void;
}) {
  const setItems = (
    updater: (current: ProgrammeShowcaseItem[]) => ProgrammeShowcaseItem[],
  ) => onChange(updater(value));
```

and for `join-cta-cards-form.tsx`:

```tsx
export function JoinCtaCardsForm({
  value,
  onChange,
}: {
  value: JoinCtaCard[];
  onChange: (next: JoinCtaCard[]) => void;
}) {
  const setCards = (updater: (current: JoinCtaCard[]) => JoinCtaCard[]) =>
    onChange(updater(value));
```

All of `add`, `remove`, `up`, `down`, and the per-field updaters stay as written. Replace JSX reads of `items` with `value` in the showcase form and of `cards` with `value` in the join-CTA form. Delete the router, `useState`, submit state, save function, notice block, and save button in both, plus now-unused types and imports.

- [ ] **Step 5: Convert `newsletter-form.tsx`**

```tsx
export function NewsletterForm({
  value,
  onChange,
}: {
  value: NewsletterSignupContent;
  onChange: (next: NewsletterSignupContent) => void;
}) {
  const setValues = (
    updater: (current: NewsletterSignupContent) => NewsletterSignupContent,
  ) => onChange(updater(value));
```

`update` stays as written. Delete the router, `useState`, submit state, save function, notice block, and save button; replace JSX reads of `values` with `value`; remove now-unused types and imports.

This form is the only one of the four still wrapped in a `<form>`: line 49 is
`<form onSubmit={onSubmit} className="space-y-8">`, closing at line 101.
Replace both tags with `<div className="space-y-8">` and `</div>`, keeping the
`space-y-8` spacing. The ticker, showcase, and join-CTA forms are already
plain `<div className="space-y-6">` wrappers and need no such change.

- [ ] **Step 6: Confirm the expected failure**

Run: `npm run type-check`
Expected: **FAIL**, with errors only in `app/(admin)/admin/content/homepage/page.tsx` about `initial` not existing on the form props. Any error in another file means a conversion was done wrong — fix it before continuing.

Run: `npm run lint`
Expected: PASS with no unused-variable warnings in the five converted files. A warning here means a helper, type, or import was left behind.

- [ ] **Step 7: Commit**

```bash
git add components/admin/homepage-narrative-forms.tsx components/admin/ticker-form.tsx components/admin/programme-showcase-form.tsx components/admin/join-cta-cards-form.tsx components/admin/newsletter-form.tsx
git commit -m "refactor(cms): make the seven homepage forms controlled

Each form took an initial value and owned its own state, save request,
busy flag and notice, duplicating identical save plumbing seven times.
They now take value/onChange and render fields only; the workspace
provider owns values and saving.

A local updater-shaped adapter keeps every existing call site
unchanged, so this is a signature change rather than a rewrite.

The homepage route does not compile until Task 6 rewires it."
```

---

### Task 5: Section rail, workspace bar, section editor

The three panes that read from the provider. No preview yet.

**Files:**
- Modify: `lib/cms/homepage-sections.ts` (append the hide predicate)
- Create: `components/admin/homepage-workspace/section-rail.tsx`
- Create: `components/admin/homepage-workspace/workspace-bar.tsx`
- Create: `components/admin/homepage-workspace/section-editor.tsx`
- Create: `components/admin/homepage-workspace/save-section-button.tsx`

**Interfaces:**
- Consumes: `useWorkspace()` from Task 3; the seven controlled forms from Task 4; `workspaceSections` from Task 1.
- Produces: `SectionRail`, `WorkspaceBar`, `SectionEditor`, `SaveSectionButton` — all reading context; only `SaveSectionButton` takes a prop (`className`). Also `isSectionHiddenFromPage(key, values)`, appended to `lib/cms/homepage-sections.ts`.

- [ ] **Step 1: Create the rail**

Create `components/admin/homepage-workspace/section-rail.tsx`:

First create the one save action, shared by the bar and the editor footer.
The approved design shows the button in both places; that is one action
rendered twice, not two actions, so it is one component.

Create `components/admin/homepage-workspace/save-section-button.tsx`:

```tsx
"use client";

import { Loader2, Save } from "lucide-react";

import { cn } from "@/lib/utils/cn";

import { useWorkspace } from "./workspace-provider";

/**
 * The single per-section save action. Rendered in both the workspace bar and
 * the editor footer, per the approved design. There is no save-all.
 */
export function SaveSectionButton({ className }: { className?: string }) {
  const { activeSection, isDirty, saveState, save } = useWorkspace();
  const dirty = isDirty(activeSection.key);
  const saving = saveState.status === "saving";

  return (
    <button
      type="button"
      disabled={!dirty || saving}
      onClick={() => save(activeSection.key)}
      className={cn(
        "inline-flex items-center gap-2 rounded-control bg-brand-accent px-4 py-2.5 text-xs font-bold text-white transition hover:bg-brand-accent-dark disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      {saving ? (
        <Loader2 aria-hidden className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Save aria-hidden className="h-3.5 w-3.5" />
      )}
      Save {activeSection.label.toLowerCase()}
    </button>
  );
}
```

Next add the hide predicate to the registry, which is where per-section facts
belong. Append to `lib/cms/homepage-sections.ts`:

```ts
/**
 * Whether a section will render nothing on the public homepage.
 *
 * Each branch mirrors the guard in the component that actually renders that
 * section, cited by file and line. A single generic `active === false` test is
 * NOT sufficient and was wrong in both directions: the narrative sections also
 * hide when their copy is blank, and an empty programme showcase is not hidden
 * at all because the page substitutes seed content. If you change a renderer's
 * guard, change its branch here too, or the rail will show a wrong badge.
 */
export function isSectionHiddenFromPage(
  key: HomepageSectionKey,
  values: HomepageDraftValues,
): boolean {
  switch (key) {
    // marquee-ticker.tsx always renders. Its `return null` belongs to a
    // separator helper, not to the section component.
    case "ticker":
      return false;

    // legacy-homepage-sections.tsx:62-66
    case "overviewSection": {
      const content = values.overviewSection;
      if (content.active === false) return true;
      const hasIntro = Boolean(
        content.title || content.headline || content.description,
      );
      const hasStory = Boolean(
        content.storyTitle ||
          content.storyHeadline ||
          content.storyDescription ||
          content.callout ||
          (content.ctaLabel && content.ctaHref),
      );
      return !hasIntro && !hasStory && !content.image;
    }

    // legacy-homepage-sections.tsx:71-72
    case "challengeSection": {
      const content = values.challengeSection;
      if (content.active === false) return true;
      return (
        !content.title &&
        !content.headline &&
        !content.description &&
        !content.stats.length &&
        !content.problemItems.length &&
        !content.solutionItems.length
      );
    }

    // legacy-homepage-sections.tsx:130-131
    case "missionSection": {
      const content = values.missionSection;
      if (content.active === false) return true;
      return (
        !content.title &&
        !content.headline &&
        !content.description &&
        !content.image &&
        !content.missionTitle &&
        !content.missionHeadline &&
        !content.missionDescription
      );
    }

    // An empty list is NOT hidden: homepage-sections.tsx:71 substitutes the
    // seed showcase, so InitiativesTree still renders. Only a non-empty list
    // with every item inactive renders nothing (initiatives-tree.tsx:70-72).
    case "programmeShowcase":
      return (
        values.programmeShowcase.length > 0 &&
        values.programmeShowcase.every((item) => item.active === false)
      );

    // join-cta-block.tsx:22-23 — empty or every card inactive.
    case "joinCtaCards":
      return (
        values.joinCtaCards.length === 0 ||
        values.joinCtaCards.every((card) => card.active === false)
      );

    // newsletter-signup-section.tsx:17-18
    case "newsletterSignup":
      return values.newsletterSignup.active === false;
  }
}
```

The switch is exhaustive over `HomepageSectionKey` with no `default`, so adding
a section to the registry without a hide rule fails the build. It needs no `as`
casts, because each branch knows its own value's type.

Then create `components/admin/homepage-workspace/section-rail.tsx`:

```tsx
"use client";

import { Check, Eye, EyeOff } from "lucide-react";

import {
  isSectionHiddenFromPage,
  workspaceSections,
} from "@/lib/cms/homepage-sections";
import { cn } from "@/lib/utils/cn";

import { useWorkspace } from "./workspace-provider";

export function SectionRail() {
  const { activeSection, selectSection, isDirty, values } = useWorkspace();

  return (
    // h-full is load-bearing: the grid wrapper has a definite height, but a
    // block child's height stays content-driven, so without it the
    // overflow-y-auto here would have no bounded box to clip against and the
    // page would scroll instead of the pane.
    <aside
      aria-label="Homepage sections"
      className="h-full min-h-0 overflow-y-auto border-r border-brand-border bg-white p-3"
    >
      <div className="mb-3 flex items-center justify-between px-2">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-400">
          Page sections
        </p>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[0.62rem] font-bold text-slate-500">
          {workspaceSections.length}
        </span>
      </div>

      <div className="grid gap-1.5">
        {workspaceSections.map((section) => {
          const isActive = section.id === activeSection.id;
          const dirty = isDirty(section.key);
          const hidden = isSectionHiddenFromPage(section.key, values);

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => selectSection(section.id)}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "flex items-start gap-2 rounded-control px-2.5 py-2 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent",
                isActive
                  ? "bg-brand-mist text-brand-navy"
                  : "text-slate-600 hover:bg-slate-50",
              )}
            >
              <span className="mt-0.5 shrink-0">
                {dirty ? (
                  <span
                    aria-hidden
                    className="block h-1.5 w-1.5 rounded-full bg-brand-accent"
                  />
                ) : hidden ? (
                  <EyeOff aria-hidden className="h-3 w-3 text-slate-300" />
                ) : (
                  <Check aria-hidden className="h-3 w-3 text-emerald-600" />
                )}
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-bold leading-4">
                  {section.label}
                </span>
                <span className="mt-0.5 block text-[0.62rem] leading-4 text-slate-400">
                  {dirty
                    ? "Unsaved changes"
                    : hidden
                      ? "Hidden from page"
                      : "Saved"}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 border-t border-slate-100 px-2 pt-4 text-[0.63rem] leading-5 text-slate-400">
        <p className="font-bold uppercase tracking-[0.16em] text-slate-500">
          Status
        </p>
        <p className="mt-2 flex items-center gap-1.5">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
          Draft changes
        </p>
        <p className="flex items-center gap-1.5">
          <Check aria-hidden className="h-3 w-3 text-emerald-600" />
          Saved
        </p>
        <p className="flex items-center gap-1.5">
          <EyeOff aria-hidden className="h-3 w-3 text-slate-300" />
          Hidden from page
        </p>
        <p className="mt-3 flex items-center gap-1.5">
          <Eye aria-hidden className="h-3 w-3 text-brand-primary" />
          Click a preview section to edit it
        </p>
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Create the workspace bar**

Create `components/admin/homepage-workspace/workspace-bar.tsx`:

```tsx
"use client";

import { ChevronRight, ExternalLink } from "lucide-react";

import { SaveSectionButton } from "./save-section-button";
import { useWorkspace } from "./workspace-provider";

export function WorkspaceBar() {
  const { activeSection, isDirty } = useWorkspace();
  const dirty = isDirty(activeSection.key);

  return (
    <header className="shrink-0 border-b border-slate-200 bg-white/95 px-4 py-4 shadow-sm backdrop-blur sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1 text-[0.66rem] font-bold uppercase tracking-[0.15em] text-slate-400"
          >
            <span>Content</span>
            <ChevronRight aria-hidden className="h-3 w-3" />
            <span>Homepage</span>
            <ChevronRight aria-hidden className="h-3 w-3" />
            <span className="text-brand-primary">{activeSection.label}</span>
          </nav>
          <div className="mt-1.5 flex flex-wrap items-center gap-3">
            <h1 className="font-heading text-3xl font-bold text-brand-ink">
              Edit homepage
            </h1>
            {dirty ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-warm px-3 py-1 text-xs font-bold text-brand-accent">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full bg-brand-accent"
                />
                Unsaved changes
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-control border border-brand-border px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <ExternalLink aria-hidden className="h-3.5 w-3.5" />
            Open public page
          </a>
          <SaveSectionButton />
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Create the section editor**

Create `components/admin/homepage-workspace/section-editor.tsx`:

```tsx
"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";

import {
  ChallengeSectionForm,
  MissionSectionForm,
  OverviewSectionForm,
} from "@/components/admin/homepage-narrative-forms";
import { JoinCtaCardsForm } from "@/components/admin/join-cta-cards-form";
import { NewsletterForm } from "@/components/admin/newsletter-form";
import { ProgrammeShowcaseForm } from "@/components/admin/programme-showcase-form";
import { TickerForm } from "@/components/admin/ticker-form";

import { SaveSectionButton } from "./save-section-button";
import { useWorkspace } from "./workspace-provider";

function ActiveForm() {
  const { activeSection, values, setValue } = useWorkspace();

  // Exhaustive over HomepageSectionKey — TypeScript fails the build if a
  // section key is added to the registry without a form here.
  switch (activeSection.key) {
    case "overviewSection":
      return (
        <OverviewSectionForm
          value={values.overviewSection}
          onChange={(next) => setValue("overviewSection", next)}
        />
      );
    case "challengeSection":
      return (
        <ChallengeSectionForm
          value={values.challengeSection}
          onChange={(next) => setValue("challengeSection", next)}
        />
      );
    case "missionSection":
      return (
        <MissionSectionForm
          value={values.missionSection}
          onChange={(next) => setValue("missionSection", next)}
        />
      );
    case "ticker":
      return (
        <TickerForm
          value={values.ticker}
          onChange={(next) => setValue("ticker", next)}
        />
      );
    case "programmeShowcase":
      return (
        <ProgrammeShowcaseForm
          value={values.programmeShowcase}
          onChange={(next) => setValue("programmeShowcase", next)}
        />
      );
    case "joinCtaCards":
      return (
        <JoinCtaCardsForm
          value={values.joinCtaCards}
          onChange={(next) => setValue("joinCtaCards", next)}
        />
      );
    case "newsletterSignup":
      return (
        <NewsletterForm
          value={values.newsletterSignup}
          onChange={(next) => setValue("newsletterSignup", next)}
        />
      );
  }
}

export function SectionEditor() {
  const { activeSection, isDirty, saveState } = useWorkspace();
  const dirty = isDirty(activeSection.key);

  return (
    <section
      aria-labelledby="workspace-editor-title"
      className="h-full min-h-0 overflow-y-auto border-r border-slate-200 bg-brand-alt"
    >
      <div className="border-b border-slate-200 bg-white px-5 py-4">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brand-primary">
          Homepage section
        </p>
        <h2
          id="workspace-editor-title"
          className="mt-1 font-heading text-2xl font-bold text-brand-ink"
        >
          {activeSection.label}
        </h2>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          {activeSection.description}
        </p>
      </div>

      <div className="space-y-5 p-5">
        <ActiveForm />

        {saveState.status === "error" ? (
          <div className="flex items-start gap-3 rounded-media border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
            <AlertCircle aria-hidden className="mt-0.5 h-5 w-5" />
            <span>{saveState.message}</span>
          </div>
        ) : null}

        {saveState.status === "saved" ? (
          <div className="flex items-start gap-3 rounded-media border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
            <CheckCircle2 aria-hidden className="mt-0.5 h-5 w-5" />
            <span>{saveState.message}</span>
          </div>
        ) : null}

        <div className="sticky bottom-3 flex items-center justify-between rounded-media border border-brand-border bg-white/95 p-3 shadow-sm backdrop-blur">
          <span className="flex items-center gap-1.5 text-[0.68rem] font-semibold text-slate-500">
            {dirty ? (
              <>
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full bg-brand-accent"
                />
                <span className="text-brand-accent">Not saved</span>
              </>
            ) : (
              "No unsaved changes"
            )}
          </span>
          <SaveSectionButton />
        </div>
      </div>
    </section>
  );
}
```

Both save buttons are now the one `SaveSectionButton`, rendered in two places
as the mockup shows. Neither is a "save all", and there is only one
implementation to keep correct.

- [ ] **Step 4: Verify**

Run: `npm run type-check`
Expected: still FAIL, and **only** in `app/(admin)/admin/content/homepage/page.tsx`. The three new files must contribute no errors.

Run: `npm run lint`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/admin/homepage-workspace/section-rail.tsx components/admin/homepage-workspace/workspace-bar.tsx components/admin/homepage-workspace/section-editor.tsx
git commit -m "feat(cms): add the homepage workspace rail, bar and editor

The rail derives saved, unsaved and hidden states from the draft store
and the section values, mirroring how the public renderers decide not
to render. The editor switches exhaustively over the section key, so
adding a section to the registry without a form fails the build."
```

---

### Task 6: Rewire the homepage route to the workspace

Resolves the type error from Task 4 and makes the workspace usable end to end, minus the preview.

**Files:**
- Create: `components/admin/homepage-workspace/workspace-layout.tsx`
- Modify: `app/(admin)/admin/content/homepage/page.tsx` (full rewrite)

**Interfaces:**
- Consumes: `HomepageWorkspaceProvider`, `SectionRail`, `WorkspaceBar`, `SectionEditor`.
- Produces: `WorkspaceLayout` (props: `preview?: React.ReactNode`). Task 8 passes the preview pane into it.

- [ ] **Step 1: Create the layout**

The responsive Edit/Preview tab state is local presentational state, so it lives here rather than in the provider.

Create `components/admin/homepage-workspace/workspace-layout.tsx`:

```tsx
"use client";

import { useState } from "react";

import { cn } from "@/lib/utils/cn";

import { SectionEditor } from "./section-editor";
import { SectionRail } from "./section-rail";
import { WorkspaceBar } from "./workspace-bar";

export function WorkspaceLayout({ preview }: { preview?: React.ReactNode }) {
  const [view, setView] = useState<"edit" | "preview">("edit");

  return (
    <div className="flex h-screen flex-col">
      <WorkspaceBar />

      {/* Below xl the panes would both be unusable, so switch instead. */}
      <div className="shrink-0 border-b border-slate-200 bg-white p-3 xl:hidden">
        <div
          role="tablist"
          aria-label="Editor view"
          className="grid grid-cols-2 rounded-media bg-slate-100 p-1"
        >
          {(["edit", "preview"] as const).map((option) => (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={view === option}
              onClick={() => setView(option)}
              className={cn(
                "rounded-control px-4 py-2 text-sm font-bold capitalize transition",
                view === option
                  ? "bg-white shadow-sm text-brand-ink"
                  : "text-slate-500",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* The grid gets a definite height from flex-1 + min-h-0 inside h-screen,
          and its items stretch to the row. Each pane root carries h-full so
          that height reaches the scrolling element itself. */}
      <div className="grid min-h-0 flex-1 xl:grid-cols-[176px_392px_minmax(520px,1fr)] 2xl:grid-cols-[196px_430px_minmax(580px,1fr)]">
        {/* Below xl the rail stacks above the editor in the Edit tab. It must
            stay reachable: it is the only way to change section, so hiding it
            outright would strand narrow-viewport editors on one section. */}
        <div
          className={cn(
            "min-h-0",
            view === "edit" ? "block" : "hidden",
            "xl:block",
          )}
        >
          <SectionRail />
        </div>

        <div
          className={cn(
            "min-h-0",
            view === "edit" ? "block" : "hidden",
            "xl:block",
          )}
        >
          <SectionEditor />
        </div>

        <div
          className={cn(
            "min-h-0",
            view === "preview" ? "block" : "hidden",
            "xl:block",
          )}
        >
          {preview}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Rewrite the route**

Replace the entire contents of `app/(admin)/admin/content/homepage/page.tsx` with:

```tsx
import { HomepageWorkspaceProvider } from "@/components/admin/homepage-workspace/workspace-provider";
import { WorkspaceLayout } from "@/components/admin/homepage-workspace/workspace-layout";
import type { HomepageDraftValues } from "@/lib/cms/homepage-sections";
import {
  getCmsChallengeSection,
  getCmsHomepageTicker,
  getCmsJoinCtaCards,
  getCmsMissionSection,
  getCmsNewsletterSignup,
  getCmsOverviewSection,
  getCmsProgrammeShowcase,
} from "@/lib/cms/homepage";

type AdminHomepagePageProps = {
  searchParams: { section?: string };
};

export default async function AdminHomepageWorkspacePage({
  searchParams,
}: AdminHomepagePageProps) {
  const [
    ticker,
    overviewSection,
    challengeSection,
    missionSection,
    programmeShowcase,
    joinCtaCards,
    newsletterSignup,
  ] = await Promise.all([
    getCmsHomepageTicker(),
    getCmsOverviewSection(),
    getCmsChallengeSection(),
    getCmsMissionSection(),
    getCmsProgrammeShowcase(),
    getCmsJoinCtaCards(),
    getCmsNewsletterSignup(),
  ]);

  // Annotated rather than cast, so the compiler checks this object against
  // HomepageDraftValues. JSON.stringify accepts `any`, so building the literal
  // inline and casting the result would let a swapped variable or a dropped
  // field compile cleanly and fail at runtime.
  const published: HomepageDraftValues = {
    ticker,
    overviewSection,
    challengeSection,
    missionSection,
    programmeShowcase,
    joinCtaCards,
    newsletterSignup,
  };

  // Firestore can return records whose prototypes are not plain objects, which
  // cannot cross the Server-to-Client boundary. Rebuild as plain JSON. Every
  // date on these records is already a string (see normalizeArticle), so this
  // is lossless.
  const publishedValues = JSON.parse(
    JSON.stringify(published),
  ) as HomepageDraftValues;

  return (
    <HomepageWorkspaceProvider
      publishedValues={publishedValues}
      initialSectionId={searchParams.section ?? null}
    >
      <WorkspaceLayout />
    </HomepageWorkspaceProvider>
  );
}
```

- [ ] **Step 3: Verify the type error is resolved**

Run: `npm run type-check`
Expected: PASS. This is the gate proving all seven form conversions in Task 4 were correct.

Run: `npm run lint && npm run build`
Expected: both PASS.

- [ ] **Step 4: Verify in the browser**

Run: `npm run dev`, then visit `/admin/content/homepage`.

Expected:
- Full-height, no page padding, rail on the left and editor beside it.
- The rail lists seven sections, overview selected by default.
- Clicking a rail entry changes the editor and the URL gains `?section=<id>` **without a full page reload**.
- Editing a field marks that rail entry "Unsaved changes"; switching to another section and back **retains the edit**.
- Save writes the section, clears the dot, and shows the success notice. Without Firebase credentials it shows the 503 message and retains the draft — both are correct.
- Attempting to navigate to `/admin/dashboard` with unsaved changes prompts for confirmation.
- Visit `/admin/content/homepage?section=newsletter` directly: the newsletter section is selected on load.

- [ ] **Step 5: Commit**

```bash
git add components/admin/homepage-workspace/workspace-layout.tsx "app/(admin)/admin/content/homepage/page.tsx"
git commit -m "feat(cms): replace the stacked homepage forms with the workspace

The route is now a thin server page that reads the seven published
sections and hands them to the draft store. Editing, per-section
saving, deep links via ?section= and the unsaved-changes guard all
work; the preview pane arrives next."
```

---

### Task 7: The preview document — route, canvas, message contract

This task builds the **iframe side** of the protocol completely. It is verifiable on its own by opening the preview route directly in a browser tab.

Two constraints discovered while planning, both load-bearing:

1. **The preview route cannot live under `app/(admin)/`.** That group's layout wraps every child in `AdminShell`, so the iframe would render the admin sidebar inside itself. It goes in a new `app/(admin-preview)/` route group with its own bare layout that performs the same auth redirect. Route groups do not affect URLs and the two groups define different paths, so there is no collision. `middleware.ts` already matches `/admin/:path*`, so the route is also protected at the edge.
2. **`QuickOverview`, `Challenge`, and `Vision` in `legacy-homepage-sections.tsx` are not exported.** The preview must outline overview, challenge, and mission separately, so they must be individually renderable. They are exported under clearer aliases; `LegacyHomepageSections` keeps rendering all three for the public page, unchanged.

**Files:**
- Create: `components/admin/homepage-workspace/preview-messages.ts`
- Create: `components/admin/homepage-workspace/preview-canvas.tsx`
- Create: `app/(admin-preview)/layout.tsx`
- Create: `app/(admin-preview)/admin/content/homepage/preview/page.tsx`
- Modify: `components/home/legacy-homepage-sections.tsx` (add three aliased exports)
- Modify: `lib/cms/admin-auth.ts` (add the shared `requireAdminPage` guard)
- Modify: `app/(admin)/layout.tsx` (use the shared guard)

**Interfaces:**
- Consumes: `HomepageDraftValues`, `workspaceSectionsById` from Task 1.
- Produces: `PreviewBaseline`, `PreviewContext`, the four message types, `isTrustedPreviewEvent`, `previewSectionDomId`, `PREVIEW_ROUTE`, and `HomepagePreviewCanvas`.

- [ ] **Step 1: Export the three narrative sections**

At the very bottom of `components/home/legacy-homepage-sections.tsx`, add:

```tsx
// Exported so the admin homepage preview can outline and label each narrative
// section separately. LegacyHomepageSections still renders all three together
// for the public page; nothing about its behaviour changes.
export {
  QuickOverview as HomepageOverviewSection,
  Challenge as HomepageChallengeSection,
  Vision as HomepageMissionSection,
};
```

- [ ] **Step 2: Create the message contract**

Create `components/admin/homepage-workspace/preview-messages.ts`:

```ts
import type { ComponentProps } from "react";

import type { DonationCampaign } from "@/components/home/donation-campaign";
import type { FeaturedStoryVideo } from "@/components/home/featured-story-video";
import type { HeroSlideshow } from "@/components/home/hero-slideshow";
import type { HomepageTeamSection } from "@/components/home/homepage-team-section";
import type { ImpactCounter } from "@/components/home/impact-counter";
import type { LatestNewsGrid } from "@/components/home/latest-news-grid";
import type { PartnersStrip } from "@/components/home/patrners-strip";
import type { TestimonialsSection } from "@/components/home/testimonials-section";
import type { HomepageDraftValues } from "@/lib/cms/homepage-sections";

export const PREVIEW_ROUTE = "/admin/content/homepage/preview";

/**
 * Published data for the eight sections the workspace does not own. Types are
 * derived from what each component actually accepts, so this cannot drift from
 * the components it feeds.
 */
export type PreviewContext = {
  slides: ComponentProps<typeof HeroSlideshow>["slides"];
  impactStats: ComponentProps<typeof ImpactCounter>["stats"];
  campaign: ComponentProps<typeof DonationCampaign>["campaign"];
  story: ComponentProps<typeof FeaturedStoryVideo>["story"];
  articles: ComponentProps<typeof LatestNewsGrid>["articles"];
  testimonials: ComponentProps<typeof TestimonialsSection>["testimonials"];
  teamMembers: ComponentProps<typeof HomepageTeamSection>["members"];
  partners: ComponentProps<typeof PartnersStrip>["partners"];
};

export type PreviewBaseline = {
  editable: HomepageDraftValues;
  context: PreviewContext;
};

/** Canvas has mounted and can accept a payload. */
export type PreviewReadyMessage = { type: "itfyg:preview-ready" };

/** A viewer clicked an editable section in the preview. */
export type PreviewSelectMessage = {
  type: "itfyg:preview-select";
  sectionId: string;
};

/** A debounced draft payload. Always carries all seven sections. */
export type PreviewDraftMessage = {
  type: "itfyg:preview-draft";
  payloadVersion: number;
  values: HomepageDraftValues;
  activeSectionId: string;
};

/** The active section changed in the rail; scroll the preview to match. */
export type PreviewScrollMessage = {
  type: "itfyg:preview-scroll";
  sectionId: string;
};

export type CanvasToParentMessage = PreviewReadyMessage | PreviewSelectMessage;
export type ParentToCanvasMessage = PreviewDraftMessage | PreviewScrollMessage;

/**
 * The preview is same-origin by construction, so both directions reject any
 * message whose origin is not an exact match.
 */
export function isTrustedPreviewEvent(event: MessageEvent): boolean {
  return event.origin === window.location.origin;
}

/** DOM id of a preview section wrapper, used for scrolling and outlining. */
export function previewSectionDomId(sectionId: string): string {
  return `preview-section-${sectionId}`;
}
```

- [ ] **Step 3: Create the canvas**

Create `components/admin/homepage-workspace/preview-canvas.tsx`:

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";

import { DonationCampaign } from "@/components/home/donation-campaign";
import { FeaturedStoryVideo } from "@/components/home/featured-story-video";
import { HeroSlideshow } from "@/components/home/hero-slideshow";
import { HomepageTeamSection } from "@/components/home/homepage-team-section";
import { ImpactCounter } from "@/components/home/impact-counter";
import { InitiativesTree } from "@/components/home/initiatives-tree";
import { JoinCtaBlock } from "@/components/home/join-cta-block";
import { LatestNewsGrid } from "@/components/home/latest-news-grid";
import {
  HomepageChallengeSection,
  HomepageMissionSection,
  HomepageOverviewSection,
} from "@/components/home/legacy-homepage-sections";
import { MarqueeTicker } from "@/components/home/marquee-ticker";
import { NewsletterSignupSection } from "@/components/home/newsletter-signup-section";
import { PartnersStrip } from "@/components/home/patrners-strip";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { workspaceSectionsById } from "@/lib/cms/homepage-sections";
import { programmeShowcase as defaultProgrammeShowcase } from "@/lib/content/site-config";
import { cn } from "@/lib/utils/cn";

import {
  isTrustedPreviewEvent,
  previewSectionDomId,
  type ParentToCanvasMessage,
  type PreviewBaseline,
} from "./preview-messages";

function PreviewSection({
  sectionId,
  label,
  editable,
  isActive,
  onSelect,
  children,
}: {
  sectionId: string;
  label: string;
  editable: boolean;
  isActive: boolean;
  onSelect: (sectionId: string) => void;
  children: React.ReactNode;
}) {
  if (!editable) {
    // Context sections are shown for layout truth but are not editable here.
    return (
      <div
        id={previewSectionDomId(sectionId)}
        className="pointer-events-none opacity-40"
      >
        {children}
      </div>
    );
  }

  return (
    <div id={previewSectionDomId(sectionId)} className="group relative">
      {children}
      <button
        type="button"
        onClick={() => onSelect(sectionId)}
        className={cn(
          "absolute inset-0 z-20 border-2 transition focus:outline-none focus-visible:border-brand-accent",
          isActive
            ? "border-brand-accent bg-brand-accent/[0.04]"
            : "border-transparent hover:border-brand-primary",
        )}
      >
        <span className="sr-only">Edit {label}</span>
      </button>
      <span
        className={cn(
          "pointer-events-none absolute left-0 top-0 z-30 px-2 py-1 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-white transition",
          isActive
            ? "bg-brand-accent opacity-100"
            : "bg-brand-primary opacity-0 group-hover:opacity-100",
        )}
      >
        {label}
      </span>
    </div>
  );
}

export function HomepagePreviewCanvas({
  baseline,
}: {
  baseline: PreviewBaseline;
}) {
  const [values, setValues] = useState(baseline.editable);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!isTrustedPreviewEvent(event)) {
        return;
      }
      const message = event.data as ParentToCanvasMessage | null;
      if (!message || typeof message !== "object") {
        return;
      }

      if (message.type === "itfyg:preview-draft") {
        setValues(message.values);
        setActiveSectionId(message.activeSectionId);
        return;
      }

      if (message.type === "itfyg:preview-scroll") {
        setActiveSectionId(message.sectionId);
        document
          .getElementById(previewSectionDomId(message.sectionId))
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    window.addEventListener("message", handleMessage);
    // Announce readiness. Without this the parent's first payload can race the
    // iframe load and be dropped.
    window.parent.postMessage(
      { type: "itfyg:preview-ready" },
      window.location.origin,
    );
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const onSelect = useCallback((sectionId: string) => {
    window.parent.postMessage(
      { type: "itfyg:preview-select", sectionId },
      window.location.origin,
    );
  }, []);

  // Mirrors the public page: an empty showcase falls back to seed content.
  const showcaseItems = values.programmeShowcase.length
    ? values.programmeShowcase
    : defaultProgrammeShowcase;

  const editable = (sectionId: string, label: string, node: React.ReactNode) => (
    <PreviewSection
      sectionId={sectionId}
      label={label}
      editable
      isActive={activeSectionId === sectionId}
      onSelect={onSelect}
    >
      {node}
    </PreviewSection>
  );

  const context = (sectionId: string, node: React.ReactNode) => (
    <PreviewSection
      sectionId={sectionId}
      label={sectionId}
      editable={false}
      isActive={false}
      onSelect={onSelect}
    >
      {node}
    </PreviewSection>
  );

  return (
    <div className="bg-white">
      {context(
        "hero-slideshow",
        <HeroSlideshow slides={baseline.context.slides} interval={6000} />,
      )}
      {editable(
        "marquee",
        workspaceSectionsById.marquee.label,
        <MarqueeTicker ticker={values.ticker} />,
      )}
      {editable(
        "overview",
        workspaceSectionsById.overview.label,
        <HomepageOverviewSection content={values.overviewSection} />,
      )}
      {editable(
        "challenge-section",
        workspaceSectionsById["challenge-section"].label,
        <HomepageChallengeSection content={values.challengeSection} />,
      )}
      {editable(
        "mission-section",
        workspaceSectionsById["mission-section"].label,
        <HomepageMissionSection content={values.missionSection} />,
      )}
      {context(
        "impact-counter",
        <ImpactCounter stats={baseline.context.impactStats} />,
      )}
      {editable(
        "programme-showcase",
        workspaceSectionsById["programme-showcase"].label,
        <InitiativesTree items={showcaseItems} />,
      )}
      {context(
        "donation",
        <DonationCampaign campaign={baseline.context.campaign} />,
      )}
      {context(
        "featured-story",
        <FeaturedStoryVideo story={baseline.context.story} />,
      )}
      {context(
        "articles",
        <LatestNewsGrid articles={baseline.context.articles} />,
      )}
      {context(
        "testimonials",
        <TestimonialsSection testimonials={baseline.context.testimonials} />,
      )}
      {context(
        "team",
        <HomepageTeamSection members={baseline.context.teamMembers} />,
      )}
      {context(
        "partners",
        <PartnersStrip partners={baseline.context.partners} />,
      )}
      {editable(
        "join-cta",
        workspaceSectionsById["join-cta"].label,
        <JoinCtaBlock cards={values.joinCtaCards} />,
      )}
      {editable(
        "newsletter",
        workspaceSectionsById.newsletter.label,
        <NewsletterSignupSection content={values.newsletterSignup} />,
      )}
    </div>
  );
}
```

- [ ] **Step 4: Extract the page-level auth guard**

The new layout needs the same auth check `app/(admin)/layout.tsx` performs.
Duplicating it would put two copies of an authorization decision in the tree,
free to drift — and an auth check is the worst place to allow drift. Extract it
once. `lib/cms/admin-auth.ts` already exports `requireAdminApiSession` for API
routes, so this is its page-level sibling.

Add to `lib/cms/admin-auth.ts`, importing `redirect` from `next/navigation`:

```ts
/**
 * Page-level auth guard. Returns the signed-in admin, or redirects to the
 * login page. Shared by every admin layout so the redirect target cannot
 * drift between them.
 */
export async function requireAdminPage() {
  const adminUser = await getCurrentAdminUser();

  if (!adminUser) {
    redirect("/admin-login");
  }

  return adminUser;
}
```

`redirect()` returns `never`, so TypeScript narrows `adminUser` to non-null
after the guard and the return type needs no assertion.

Then rewrite the body of `app/(admin)/layout.tsx` to use it, leaving its
imports otherwise unchanged:

```tsx
export default async function AdminLayout({ children }: AdminLayoutProps) {
  const adminUser = await requireAdminPage();

  return <AdminShell adminUser={adminUser}>{children}</AdminShell>;
}
```

Its `getCurrentAdminUser` and `redirect` imports become unused — remove them
and import `requireAdminPage` from `@/lib/cms/admin-auth` instead.

- [ ] **Step 5: Create the bare preview layout**

Create `app/(admin-preview)/layout.tsx`:

```tsx
import { requireAdminPage } from "@/lib/cms/admin-auth";

/**
 * Bare admin layout. Renders no shell chrome, because its only route is the
 * homepage preview document that the CMS workspace loads in an iframe. It
 * exists separately from app/(admin)/layout.tsx because that layout's whole
 * purpose is to wrap children in AdminShell, which must not appear inside the
 * iframe — but it shares the same auth guard.
 */
export default async function AdminPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminPage();

  return <>{children}</>;
}
```

- [ ] **Step 6: Create the preview route**

Create `app/(admin-preview)/admin/content/homepage/preview/page.tsx`:

```tsx
import { HomepagePreviewCanvas } from "@/components/admin/homepage-workspace/preview-canvas";
import type { PreviewBaseline } from "@/components/admin/homepage-workspace/preview-messages";
import { getCmsFeaturedArticles } from "@/lib/cms/articles";
import {
  getCmsChallengeSection,
  getCmsDonationCampaign,
  getCmsFeaturedStory,
  getCmsHeroSlides,
  getCmsHomepageTicker,
  getCmsJoinCtaCards,
  getCmsMissionSection,
  getCmsNewsletterSignup,
  getCmsOverviewSection,
  getCmsProgrammeShowcase,
} from "@/lib/cms/homepage";
import { getCmsImpactStats } from "@/lib/cms/impact-stats";
import { getCmsPartners } from "@/lib/cms/partners";
import { getCmsTeamMembers } from "@/lib/cms/team";
import { getCmsTestimonials } from "@/lib/cms/testimonials";

export default async function HomepagePreviewPage() {
  const [
    ticker,
    overviewSection,
    challengeSection,
    missionSection,
    programmeShowcase,
    joinCtaCards,
    newsletterSignup,
    slides,
    impactStats,
    campaign,
    story,
    articles,
    testimonials,
    teamMembers,
    partners,
  ] = await Promise.all([
    getCmsHomepageTicker(),
    getCmsOverviewSection(),
    getCmsChallengeSection(),
    getCmsMissionSection(),
    getCmsProgrammeShowcase(),
    getCmsJoinCtaCards(),
    getCmsNewsletterSignup(),
    getCmsHeroSlides(),
    getCmsImpactStats(),
    getCmsDonationCampaign(),
    getCmsFeaturedStory(),
    getCmsFeaturedArticles(3),
    getCmsTestimonials(),
    getCmsTeamMembers(false),
    getCmsPartners(),
  ]);

  // Annotated rather than cast, so the compiler checks this object against
  // PreviewBaseline. JSON.stringify accepts `any`, so building the literal
  // inline and casting the result would let a swapped variable or a dropped
  // field compile cleanly and hand a component `undefined` at runtime — which
  // is exactly the drift PreviewBaseline's derived types exist to prevent.
  const source: PreviewBaseline = {
    editable: {
      ticker,
      overviewSection,
      challengeSection,
      missionSection,
      programmeShowcase,
      joinCtaCards,
      newsletterSignup,
    },
    context: {
      slides,
      impactStats,
      campaign,
      story,
      articles,
      testimonials,
      teamMembers,
      partners,
    },
  };

  // Firestore can return records whose prototypes are not plain objects, which
  // cannot cross the Server-to-Client boundary. Rebuild as plain JSON. Dates on
  // these records are already strings (see normalizeArticle), so this is
  // lossless.
  const baseline = JSON.parse(JSON.stringify(source)) as PreviewBaseline;

  return <HomepagePreviewCanvas baseline={baseline} />;
}
```

- [ ] **Step 7: Verify**

Run: `npm run type-check && npm run lint && npm run build`
Expected: all PASS. A build error about two route groups resolving the same path means the directory nesting under `(admin-preview)` is wrong — it must be exactly `admin/content/homepage/preview`.

- [ ] **Step 8: Verify in the browser**

Run: `npm run dev`, then visit `/admin/content/homepage/preview` directly.

Expected:
- The homepage renders top to bottom with **no admin sidebar**.
- The eight context sections are dimmed; the seven editable ones are full opacity.
- Hovering an editable section shows a blue outline and its label; the label and outline do not appear on dimmed sections.
- The public homepage at `/` is completely unchanged.

- [ ] **Step 9: Commit**

```bash
git add components/admin/homepage-workspace/preview-messages.ts components/admin/homepage-workspace/preview-canvas.tsx "app/(admin-preview)" components/home/legacy-homepage-sections.tsx
git commit -m "feat(cms): add the homepage preview document and message contract

Renders the real fifteen homepage sections in public order, outlining
and labelling the seven the workspace edits and dimming the eight
edited elsewhere.

Lives in its own route group because app/(admin) wraps every child in
AdminShell, which would put the admin sidebar inside the iframe. The
three narrative sections are exported so each can be outlined
separately; LegacyHomepageSections is unchanged for the public page."
```

---

### Task 8: Preview pane — the parent half of the protocol

**Files:**
- Create: `components/admin/homepage-workspace/preview-pane.tsx`
- Modify: `components/admin/homepage-workspace/workspace-layout.tsx` (pass the pane in)

**Interfaces:**
- Consumes: `useWorkspace()`, and everything from `preview-messages.ts`.
- Produces: `PreviewPane`.

- [ ] **Step 1: Create the pane**

Create `components/admin/homepage-workspace/preview-pane.tsx`:

```tsx
"use client";

import { Maximize2, Monitor, RefreshCw, Smartphone, Tablet, Zap } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useWorkspace } from "./workspace-provider";
import {
  isTrustedPreviewEvent,
  PREVIEW_ROUTE,
  type CanvasToParentMessage,
} from "./preview-messages";
import { cn } from "@/lib/utils/cn";

const VIEWPORTS = [
  { id: "desktop", label: "Desktop preview", width: "100%", icon: Monitor },
  { id: "tablet", label: "Tablet preview", width: "760px", icon: Tablet },
  { id: "mobile", label: "Mobile preview", width: "390px", icon: Smartphone },
] as const;

/** Debounce for draft payloads. Long enough to coalesce typing, short enough
 *  that the preview still feels live. */
const DRAFT_DEBOUNCE_MS = 120;

export function PreviewPane() {
  const { values, activeSection, payloadVersion, selectSection } = useWorkspace();
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [viewport, setViewport] = useState<(typeof VIEWPORTS)[number]["id"]>("desktop");
  const [fit, setFit] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const post = useCallback((message: unknown) => {
    frameRef.current?.contentWindow?.postMessage(message, window.location.origin);
  }, []);

  // Upward channel: readiness and section clicks.
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!isTrustedPreviewEvent(event)) {
        return;
      }
      if (event.source !== frameRef.current?.contentWindow) {
        return;
      }
      const message = event.data as CanvasToParentMessage | null;
      if (!message || typeof message !== "object") {
        return;
      }
      if (message.type === "itfyg:preview-ready") {
        setReady(true);
        return;
      }
      if (message.type === "itfyg:preview-select") {
        selectSection(message.sectionId);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [selectSection]);

  // Downward channel: debounced draft payloads. Always all seven sections, so
  // the parent stays authoritative even immediately after a save.
  useEffect(() => {
    if (!ready) {
      return;
    }
    const timer = window.setTimeout(() => {
      post({
        type: "itfyg:preview-draft",
        payloadVersion,
        values,
        activeSectionId: activeSection.id,
      });
    }, DRAFT_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [ready, post, payloadVersion, values, activeSection.id]);

  // Selecting in the rail scrolls the preview to the matching section.
  useEffect(() => {
    if (!ready) {
      return;
    }
    post({ type: "itfyg:preview-scroll", sectionId: activeSection.id });
  }, [ready, post, activeSection.id]);

  // A reload discards readiness until the fresh document announces itself.
  const refresh = () => {
    setReady(false);
    setReloadKey((key) => key + 1);
  };

  const active = VIEWPORTS.find((option) => option.id === viewport) ?? VIEWPORTS[0];

  return (
    <section
      aria-label="Live homepage preview"
      className="flex h-full min-h-0 flex-col bg-slate-200 p-4 2xl:p-5"
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-media border border-slate-300 bg-white shadow-sm">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-3 py-2.5">
          <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            {VIEWPORTS.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-label={option.label}
                  aria-pressed={viewport === option.id}
                  onClick={() => setViewport(option.id)}
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-control transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent",
                    viewport === option.id
                      ? "border border-brand-border bg-white text-brand-navy"
                      : "border border-transparent text-slate-500",
                  )}
                >
                  <Icon aria-hidden className="h-3.5 w-3.5" />
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Fit preview"
              aria-pressed={fit}
              onClick={() => setFit((current) => !current)}
              className="flex h-8 w-8 items-center justify-center rounded-control border border-slate-200 text-slate-500 transition hover:bg-slate-50"
            >
              <Maximize2 aria-hidden className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              aria-label="Refresh preview"
              onClick={refresh}
              className="flex h-8 w-8 items-center justify-center rounded-control border border-slate-200 text-slate-500 transition hover:bg-slate-50"
            >
              <RefreshCw aria-hidden className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <p className="flex shrink-0 items-center gap-2 border-b border-brand-border bg-brand-mist/60 px-3 py-2 text-[0.66rem] leading-5 text-brand-navy">
          <Zap aria-hidden className="h-3 w-3 text-brand-primary" />
          <span>
            <b>Live draft:</b> typing updates this preview immediately. Save the
            section to publish.
          </span>
        </p>

        <div className="flex min-h-0 flex-1 justify-center overflow-auto bg-slate-300/70 p-4">
          {failed ? (
            <div className="m-auto max-w-sm text-center text-sm text-slate-600">
              <p className="font-bold text-brand-ink">
                The preview could not load.
              </p>
              <p className="mt-2 leading-6">
                Editing and saving still work. Open the public page in a new tab
                to check your changes.
              </p>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex rounded-control border border-brand-border bg-white px-4 py-2 text-xs font-bold text-slate-700"
              >
                Open public page
              </a>
            </div>
          ) : (
            <div
              // Width drives the iframe's real layout viewport, which is what
              // makes the homepage's Tailwind breakpoints resolve correctly.
              // Fit is a transform, which does NOT alter the layout viewport,
              // so zooming cannot corrupt the breakpoints being displayed.
              style={{
                width: active.width,
                transform: fit ? "scale(0.75)" : undefined,
                transformOrigin: "top center",
              }}
              className="h-full shrink-0"
            >
              <iframe
                key={reloadKey}
                ref={frameRef}
                src={PREVIEW_ROUTE}
                title="Homepage preview"
                onError={() => setFailed(true)}
                className="h-full min-h-[650px] w-full rounded-control border-0 bg-white shadow-sm"
              />
            </div>
          )}
        </div>

        <p className="shrink-0 border-t border-slate-200 px-3 py-2 text-[0.64rem] text-slate-500">
          Click any outlined section to edit it · Homepage ·{" "}
          {activeSection.label}
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire the pane into the layout**

In `app/(admin)/admin/content/homepage/page.tsx`, change the render to pass the pane:

```tsx
import { PreviewPane } from "@/components/admin/homepage-workspace/preview-pane";
```

```tsx
      <WorkspaceLayout preview={<PreviewPane />} />
```

- [ ] **Step 3: Verify**

Run: `npm run type-check && npm run lint && npm run build`
Expected: all PASS.

- [ ] **Step 4: Verify end to end in the browser**

Run: `npm run dev`, then visit `/admin/content/homepage`.

Expected:
- The preview renders the homepage in the third column.
- Typing in a field updates the matching preview section within a beat, **without saving**.
- Clicking an outlined preview section selects that section in the rail and editor, and the URL's `?section=` updates.
- Selecting a section in the rail scrolls the preview to it.
- The three viewport buttons visibly change layout: at `390px` the homepage renders its **mobile** layout, not a squeezed desktop grid. This is the single most important check in the plan — if the mobile view looks like a narrow desktop, the iframe is not driving the breakpoints and something is wrong with the width plumbing.
- Saving a section leaves the preview **unchanged** — no flicker back to the pre-save copy.
- Refresh reloads the iframe and the preview repopulates from the current drafts.

- [ ] **Step 5: Commit**

```bash
git add components/admin/homepage-workspace/preview-pane.tsx "app/(admin)/admin/content/homepage/page.tsx"
git commit -m "feat(cms): connect the homepage workspace to its live preview

Posts debounced draft payloads into the preview iframe and handles
section clicks coming back, so selection works in both directions.

Payloads always carry all seven sections rather than only the dirty
ones: a save clears the draft, and a drafts-only payload would let the
canvas fall back to its pre-save baseline and visibly revert the
section that was just saved.

Viewport controls set width on the iframe itself so the homepage's
Tailwind breakpoints resolve against a real layout viewport."
```

---

### Task 9: Per-section error boundaries

Draft values reach real components on every keystroke, so the preview renders states the public site never sees: an image URL mid-typing, a momentarily emptied stat array, a cleared required heading. `next/image` and `safeImageSrc` can throw on those, which would blank the whole preview.

**Files:**
- Create: `components/admin/homepage-workspace/preview-section-boundary.tsx`
- Modify: `components/admin/homepage-workspace/preview-canvas.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: `PreviewSectionBoundary` (props `label: string`, `resetKey: number`, `children`).

- [ ] **Step 1: Create the boundary**

React 18 has no hook equivalent, so this is a class component.

Create `components/admin/homepage-workspace/preview-section-boundary.tsx`:

```tsx
"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type PreviewSectionBoundaryProps = {
  label: string;
  /** Changing this clears a previous error so the section can render again. */
  resetKey: number;
  children: ReactNode;
};

type PreviewSectionBoundaryState = { hasError: boolean };

export class PreviewSectionBoundary extends Component<
  PreviewSectionBoundaryProps,
  PreviewSectionBoundaryState
> {
  state: PreviewSectionBoundaryState = { hasError: false };

  static getDerivedStateFromError(): PreviewSectionBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Half-typed draft values produce these legitimately, so this is a console
    // note rather than an error report.
    console.warn(
      `Homepage preview section "${this.props.label}" could not render.`,
      error,
      info,
    );
  }

  componentDidUpdate(previous: PreviewSectionBoundaryProps) {
    // Error boundaries do not self-heal. Without this, a section would stay
    // broken after the editor finished typing a valid value, which reads as a
    // bug in the editor rather than a transient state.
    if (this.state.hasError && previous.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="border-y border-dashed border-brand-border bg-brand-alt px-6 py-10 text-center">
          <p className="font-heading text-lg font-bold text-brand-ink">
            {this.props.label}
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
            This section can&rsquo;t render with the current values. Keep
            editing &mdash; it reappears as soon as the values are valid.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

- [ ] **Step 2: Track the payload version in the canvas**

In `components/admin/homepage-workspace/preview-canvas.tsx`, add the import:

```tsx
import { PreviewSectionBoundary } from "./preview-section-boundary";
```

Add state beside the existing `activeSectionId` state:

```tsx
  const [payloadVersion, setPayloadVersion] = useState(0);
```

In the `itfyg:preview-draft` branch of `handleMessage`, add before the `return`:

```tsx
        setPayloadVersion(message.payloadVersion);
```

- [ ] **Step 3: Wrap every section**

Change `PreviewSection` to accept and use the boundary. Add `resetKey: number` to its props type, and wrap `{children}` in both the context branch and the editable branch:

```tsx
    <PreviewSectionBoundary label={label} resetKey={resetKey}>
      {children}
    </PreviewSectionBoundary>
```

Then pass `resetKey={payloadVersion}` from both the `editable` and `context` helpers in `HomepagePreviewCanvas`.

- [ ] **Step 4: Verify**

Run: `npm run type-check && npm run lint && npm run build`
Expected: all PASS.

- [ ] **Step 5: Verify recovery in the browser**

Run: `npm run dev`, visit `/admin/content/homepage`, select the Mission section.

- Clear the "Image" field, or set it to a single character such as `/`.
  Expected: **only** the mission section falls back to the labelled placeholder card. Hero, ticker, overview, and everything below keep rendering.
- Type a valid path such as `/images/home/mission.jpg`.
  Expected: the mission section renders again **without a manual refresh**. If it stays broken, `resetKey` is not reaching the boundary.

- [ ] **Step 6: Commit**

```bash
git add components/admin/homepage-workspace/preview-section-boundary.tsx components/admin/homepage-workspace/preview-canvas.tsx
git commit -m "feat(cms): isolate preview section render failures

Draft values reach real components on every keystroke, so the preview
renders states the public site never sees and next/image can throw on
a half-typed URL. Each section now fails to a labelled placeholder
instead of blanking the whole preview.

The boundary resets on the payload version, because error boundaries
do not self-heal and the section would otherwise stay broken after the
editor finished typing a valid value."
```

---

### Task 10: Deep links from the homepage sections index

`/admin/content/homepage/sections/homepage` lists every homepage section with an Edit link pointing at `section.route`. For the seven the workspace owns, that now lands on the workspace but not on the right section.

**Files:**
- Modify: `app/(admin)/admin/content/homepage/sections/[section]/page.tsx:60-75` (the actions column)

**Interfaces:**
- Consumes: section ids from Task 1, which match `homepageSectionConfigs` ids exactly.
- Produces: nothing.

- [ ] **Step 1: Point Edit at the matching section**

In the `actions` column's `render`, replace the `href={section.route}` on the Edit link with a computed href. Add above the `return` in that render function:

```tsx
      const editHref =
        section.route === "/admin/content/homepage"
          ? `${section.route}?section=${section.id}`
          : section.route;
```

and use `href={editHref}`.

The seven workspace section ids are exactly the `homepageSectionConfigs` ids, so no mapping table is needed. Rows pointing elsewhere — banner, hero slides, impact stats, donation, featured story, floating elements, articles, testimonials, partners — are untouched.

- [ ] **Step 2: Verify**

Run: `npm run type-check && npm run lint && npm run build`
Expected: all PASS.

Run `npm run dev` and visit `/admin/content/homepage/sections/homepage`.
Expected: the Edit link on "Mission section" goes to `/admin/content/homepage?section=mission-section` and opens with that section selected. The Edit link on "Hero slideshow" still goes to `/admin/content/hero-slides`.

- [ ] **Step 3: Commit**

```bash
git add "app/(admin)/admin/content/homepage/sections/[section]/page.tsx"
git commit -m "fix(admin): deep-link section rows into the homepage workspace

Rows whose route is the homepage workspace now carry ?section=<id>, so
Edit opens the section that row describes instead of the top of the
page."
```

---

### Task 11: Viewport verification script and the full sweep

The one claim in this design that cannot be checked by reading code is that the iframe's width genuinely drives the homepage's Tailwind breakpoints. This task proves it mechanically.

**This is a screenshot and assertion script, not a test suite. Do not add a test runner.**

**Files:**
- Create: `scripts/shoot-homepage-workspace.mjs`
- Modify: `package.json` (one script entry)

**Interfaces:**
- Consumes: the running dev server and an admin session cookie.
- Produces: three PNGs plus a pass/fail line per viewport.

- [ ] **Step 1: Create the script**

The admin area is behind `middleware.ts`, which matches `/admin/:path*` and requires the `itfy-admin-session` cookie, so the script needs a real session value. It takes one from the environment rather than trying to log in.

Create `scripts/shoot-homepage-workspace.mjs`:

```js
import { chromium } from "playwright";

const outDir = process.argv[2] ?? ".superdesign/tmp";
const baseUrl = process.env.PREVIEW_BASE_URL ?? "http://localhost:3000";
const session = process.env.ITFY_ADMIN_SESSION;

if (!session) {
  console.error(
    "Set ITFY_ADMIN_SESSION to the value of your itfy-admin-session cookie.\n" +
      "Copy it from your browser's devtools while signed in to /admin.",
  );
  process.exit(1);
}

// Each entry pairs a viewport button with the widest Tailwind breakpoint that
// must match inside the iframe at that width. This is the actual claim under
// test: the iframe drives the breakpoints, not the admin window.
const VIEWPORTS = [
  { label: "Desktop preview", name: "desktop", lgMustMatch: true },
  { label: "Tablet preview", name: "tablet", lgMustMatch: false },
  { label: "Mobile preview", name: "mobile", lgMustMatch: false },
];

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1800, height: 1100 },
});
await context.addCookies([
  {
    name: "itfy-admin-session",
    value: session,
    url: baseUrl,
  },
]);

const page = await context.newPage();
page.on("console", (message) => {
  if (message.type() === "error") {
    console.log("PAGE ERROR", message.text());
  }
});

await page.goto(`${baseUrl}/admin/content/homepage`, {
  waitUntil: "domcontentloaded",
  timeout: 60000,
});

await page.locator('iframe[title="Homepage preview"]').waitFor({
  state: "visible",
  timeout: 30000,
});

let failures = 0;

for (const viewport of VIEWPORTS) {
  await page.locator(`button[aria-label="${viewport.label}"]`).click();
  // Let the iframe settle at its new width before measuring.
  await page.waitForTimeout(1200);

  const frame = page
    .frames()
    .find((candidate) => candidate.url().includes("/homepage/preview"));

  if (!frame) {
    console.log(`FAIL ${viewport.name}: preview frame not found`);
    failures += 1;
    continue;
  }

  const measured = await frame.evaluate(() => ({
    innerWidth: window.innerWidth,
    // Exactly Tailwind's `lg:` breakpoint. If this reports true at mobile
    // width, the iframe is not driving the breakpoints.
    lgMatches: window.matchMedia("(min-width: 1024px)").matches,
  }));

  const ok = measured.lgMatches === viewport.lgMustMatch;
  if (!ok) {
    failures += 1;
  }
  console.log(
    `${ok ? "PASS" : "FAIL"} ${viewport.name}: innerWidth=${measured.innerWidth} lgMatches=${measured.lgMatches} (expected ${viewport.lgMustMatch})`,
  );

  await page.screenshot({
    path: `${outDir}/homepage-workspace-${viewport.name}.png`,
    animations: "disabled",
  });
}

await browser.close();

if (failures > 0) {
  console.error(`\n${failures} viewport check(s) failed.`);
  process.exit(1);
}
console.log("\nAll viewport checks passed.");
```

- [ ] **Step 2: Add the script entry**

In `package.json`, add to `scripts`:

```json
    "shoot:homepage-workspace": "node scripts/shoot-homepage-workspace.mjs",
```

Nothing in `build` may depend on it — verification must never be able to block a local build.

- [ ] **Step 3: Run it**

In one terminal: `npm run dev`

In another, with a session cookie value copied from the browser:

```bash
ITFY_ADMIN_SESSION="<cookie value>" npm run shoot:homepage-workspace
```

Expected output:

```
PASS desktop: innerWidth=... lgMatches=true (expected true)
PASS tablet: innerWidth=760 lgMatches=false (expected false)
PASS mobile: innerWidth=390 lgMatches=false (expected false)

All viewport checks passed.
```

A `FAIL mobile: ... lgMatches=true` means the iframe is not driving the breakpoints — the width is being applied to a wrapper that does not resize the frame, or a transform is being used where a width belongs. Fix the pane, not the script.

- [ ] **Step 4: Review the screenshots**

Open the three PNGs in `.superdesign/tmp/`. Confirm the mobile shot shows a genuine single-column mobile homepage inside the preview, not a narrow desktop layout.

- [ ] **Step 5: Full verification sweep**

Run each and confirm all pass:

```bash
npm run type-check
npm run lint
npm run build
npm run verify:cms
```

Then check the public site is untouched: visit `/` and confirm the homepage renders exactly as before. The only change to a public component in this whole plan is three added export aliases in `legacy-homepage-sections.tsx`, which change no behaviour.

- [ ] **Step 6: Commit**

```bash
git add scripts/shoot-homepage-workspace.mjs package.json
git commit -m "chore(cms): verify the preview iframe drives real breakpoints

Screenshots the workspace at the three preview widths and asserts that
Tailwind's lg: breakpoint matches inside the iframe only at desktop
width. That is the one claim in this design that cannot be checked by
reading code, and the reason the preview is an iframe at all.

A separate script, so it cannot gate a local build."
```

---

## Done when

- `/admin/content/homepage` shows the rail, the single-section editor, and the live preview.
- Typing updates the preview without saving; saving writes one section and does not disturb drafts in others.
- Clicking a preview section selects its editor and vice versa.
- The three viewport buttons produce genuinely different layouts, proven by `npm run shoot:homepage-workspace`.
- A half-typed value degrades one preview section and recovers on its own.
- Leaving with unsaved drafts prompts first.
- `type-check`, `lint`, `build`, and `verify:cms` all pass, and `/` is unchanged.
