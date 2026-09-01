# IT for Youth Laptop Bank + Her First Laptop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the fourteen Laptop Bank and Her First Laptop routes, the fifteen reusable components and the two forms specified in the build spec, on top of the existing Next.js 14 App Router site, with every unsupplied value left as a visible token rather than an invented figure.

**Architecture:** Follow the pattern the rest of this site already uses — a type in `types/`, verbatim seed content in `lib/content/*-config.ts`, a reader in `lib/cms/*.ts` that prefers Firestore and falls back to seed, presentational components in `components/<area>/`, and thin route files in `app/(public)/` that fetch and delegate. Reuse the site's existing primitives wherever the spec's component list already has an equivalent (`EditorialImageHero` is C1, `ProseMediaCardGrid` is C7) rather than building duplicates — the spec's own rule is "build once, reuse, no page-specific duplicates". Everything the spec marks Phase 2 is built but kept out of navigation and the sitemap and served `noindex` until real records exist.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript 5.7, Tailwind 3.4, zod 3.24, firebase-admin 13, nodemailer. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-09-01-laptop-bank-spec.md`

## Global Constraints

Every task's requirements implicitly include this section.

**Naming, exact, everywhere (spec §1, Draft 1 §2).**
- `IT for Youth Laptop Bank` on first mention per page; `the Laptop Bank` thereafter. Never "Laptop Bank Ghana", never "ITFYG Laptop Bank".
- `Her First Laptop` — three capitals, always. Never "Her 1st Laptop".
- Say **renewed** or **refurbished**, never used / second-hand / old / pre-owned.
- Say **retired asset**, **fleet refresh**, **decommissioned device**. Waste language (`e-waste`, `scrap`) appears **only** on `/laptop-bank/recycling`.
- Say **students**, **young women**, **participants**, **recipients**. Never "beneficiaries".
- Say **data sanitisation** or **certified erasure**, never wiping / formatting / deleting — except where the spec's own COPY says "wiped", which is published verbatim.
- Say **partner organisation** or **donor organisation**, never "sponsor".

**Copy fidelity.** Every string the spec marks COPY is published byte-for-byte. Do not reword, re-punctuate, or "improve" it. If a COPY string reads awkwardly, that is the client's decision, not yours.

**Do not invent values (spec §11).** Any figure, duration, standard name, date, contact or amount not supplied stays a `{{TOKEN}}`. No placeholder numbers, no representative examples, no zeros standing in for real counts. This extends to seed records: no seed Donor, Story or Dashboard Metrics record ships (Draft 1 §16).

**URLs are final (spec §2.2).** They will be printed on legal paperwork. Exactly the fourteen paths in the spec's URL map, no others, no trailing-slash variants.

**Presentation standards (repo standing preference).** Public pages carry no bullet lists, no icons and no emojis, and pair every prose block with an image or video. List-shaped content composes to prose through `pointsToParagraph` / `composeProse` in `lib/utils/prose.ts`. The one permitted numbered treatment is the existing `<ol>` with numbered circles from `components/organisations/organisation-enquiry-form.tsx`, used only where ordering is semantic. Do not import from `lucide-react` in any file this plan creates under `components/laptop-bank/`.

**No test runner in this repo.** John declined adding one. Every task's verification cycle is therefore:

```bash
npm run type-check && npm run lint && npm run build
```

plus, for tasks that add or change a route, a live check against a dev server:

```bash
npm run dev &          # if not already running
curl -s -o /dev/null -w '%{http_code} %{url_effective}\n' http://localhost:3000/<route>
```

Expected: `200` for every Phase 1 route. A task is not done until those commands are run and their real output confirms success. Never claim a step passed without the output in front of you.

**Consent is enforced in the query, never the template (spec §4, 5.14).** The reader functions in `lib/cms/laptop-bank.ts` filter non-consenting records out before returning. A component must never receive a record it is not allowed to render, so a component-level `if (!consent) return null` is a bug, not a safety net — it hides the fact that the query leaked.

**Verification gates are never wired into the build.** John's standing preference: verification is a command he runs deliberately, never something that blocks a build. `verify:tokens` exits non-zero so it *can* gate a production deploy, but it must not be added to `prebuild`, a git hook, or CI by this plan.

---

## File Structure

**Create:**

| File | Responsibility |
|---|---|
| `types/laptop-bank.ts` | The six CMS content types plus the page-content types |
| `lib/content/laptop-bank-tokens.ts` | The `{{TOKEN}}` registry — every token from spec §11, its phase, and where it is used |
| `lib/content/laptop-bank-config.ts` | Verbatim seed: 9 Process Stages, 14 Intake Items, 6 Documents, page copy for 5.1–5.5, 5.9–5.10 |
| `lib/content/her-first-laptop-config.ts` | Verbatim seed: page copy for 5.6–5.8 |
| `lib/cms/laptop-bank.ts` | Firestore-first readers with consent enforced in the query |
| `components/laptop-bank/token.tsx` | Renders an unsupplied token as visible red text |
| `components/laptop-bank/callout-box.tsx` | C6 |
| `components/laptop-bank/spec-table.tsx` | C5 |
| `components/laptop-bank/expandable-section.tsx` | C4 |
| `components/laptop-bank/process-stepper.tsx` | C3 |
| `components/laptop-bank/document-download-block.tsx` | C12 |
| `components/laptop-bank/sticky-mobile-cta.tsx` | C14 |
| `components/laptop-bank/giving-mechanic.tsx` | C15 |
| `components/laptop-bank/related-programme-block.tsx` | C13 |
| `components/laptop-bank/stat-band.tsx` | C2 |
| `components/laptop-bank/donor-logo-grid.tsx` | C9 |
| `components/laptop-bank/story-card.tsx` | C10 |
| `components/laptop-bank/metric-card-grid.tsx` | C11 |
| `components/laptop-bank/multi-step-form.tsx` | C8 shell — progress, save/resume, honeypot, step nav |
| `components/laptop-bank/equipment-offer-form.tsx` | Form 6.1 |
| `components/laptop-bank/student-application-form.tsx` | Form 6.2 |
| `lib/utils/image-compress.ts` | Client-side downscale to 1600px long edge |
| `lib/utils/rate-limit.ts` | Server-side in-process rate limit |
| `lib/utils/reference.ts` | `{{REF}}` generator |
| `lib/laptop-bank/uploads.ts` | Upload write + authenticated read, outside the public web root |
| `app/api/laptop-bank/equipment-offer/route.ts` | Form 6.1 submit |
| `app/api/her-first-laptop/apply/route.ts` | Form 6.2 submit |
| `app/api/laptop-bank/uploads/[id]/route.ts` | Authenticated retrieval of an uploaded document |
| `app/(public)/laptop-bank/page.tsx` … 13 more route files | Pages 5.1–5.14 |
| `scripts/verify-tokens.ts` | Fails if a `{{ }}` string reaches published content |

**Modify:**

| File | Change |
|---|---|
| `lib/content/site-config.ts:111` | Add the "Laptop Bank" top-level nav item; add Her First Laptop to "Get Involved" |
| `lib/content/site-config.ts:188` | Add the Laptop Bank footer column and the privacy-notice link |
| `lib/content/site-config.ts:383` | Add `relatedProgramme` to seven of the eight initiative seeds |
| `types/content.ts:277` | Add optional `relatedProgramme` to `InitiativePage` |
| `components/what-we-do/initiative-page.tsx` | Render C13 after the main body, before the footer |
| `lib/utils/validators.ts` | Add `equipmentOfferSchema` and `studentApplicationSchema` |
| `app/sitemap.ts` | Add the ten Phase 1 routes; Phase 2 routes stay out |
| `next.config.mjs:47` | 301 `/what-we-do/laptop-bank` → `/laptop-bank` |
| `types/firebase.ts:1` | Add the six Laptop Bank collections |
| `package.json` | Add `verify:tokens` |

---

### Task 1: Types, token registry and the token gate

**Files:**
- Create: `types/laptop-bank.ts`
- Create: `lib/content/laptop-bank-tokens.ts`
- Create: `components/laptop-bank/token.tsx`
- Create: `scripts/verify-tokens.ts`
- Modify: `types/firebase.ts:1-23`
- Modify: `package.json`

**Interfaces:**
- Produces: `ProcessStage`, `IntakeItem`, `Donor`, `Story`, `DashboardMetrics`, `LaptopBankDocument` types; `LAPTOP_BANK_TOKENS` registry; `token(name)` helper returning `"{{NAME}}"`; `<Token name="SLA_REPLY" />` component.
- Consumes: nothing.

- [ ] **Step 1: Write `types/laptop-bank.ts`**

Field names match spec §4 exactly, in snake_case, because they are the CMS
field names the client will see in an editor. Do not camelCase them.

```ts
export type ProcessStage = {
  number: number;
  title: string;
  summary_sentence: string;
  full_text: string;
  owner: string;
  record_produced: string;
  duration: string;
};

export type IntakeItem = {
  item: string;
  minimum_accepted: string;
  notes: string;
  accepted: boolean;
  sort_order: number;
};

export type DonorDisplayConsent = "logo" | "named" | "anonymous";

export type Donor = {
  name: string;
  logo?: string;
  sector?: string;
  country?: string;
  display_consent: DonorDisplayConsent;
  quote?: string;
  quote_attribution?: string;
};

export type Story = {
  preferred_name: string;
  photo?: string;
  quote: string;
  pathway?: string;
  region?: string;
  institution?: string;
  publication_consent: boolean;
  consent_record_ref?: string;
  date?: string;
};

export type DashboardMetrics = {
  period_label: string;
  last_updated: string;
  units_offered: number | null;
  units_accepted: number | null;
  units_declined_at_offer: number | null;
  units_rejected_at_intake: number | null;
  drives_sanitised: number | null;
  deployed_individual: number | null;
  deployed_shared: number | null;
  ownership_transfers: number | null;
  retention_12m_pct: number | null;
  units_recycled: number | null;
  partner_orgs: number | null;
  deployment_by_region: number | null;
  deployment_by_pathway: number | null;
};

export type DocumentAudienceTag = "corporate" | "applicant" | "public";

export type LaptopBankDocument = {
  id: string;
  title: string;
  file: string;
  format: string;
  fileSize?: string;
  version: string;
  date: string;
  audience_tag: DocumentAudienceTag;
};
```

- [ ] **Step 2: Write `lib/content/laptop-bank-tokens.ts`**

One entry per token in spec §11. `{{REF}}` is deliberately absent — it is
generated at submit time, not supplied by the client.

```ts
/**
 * Content IT for Youth has not yet supplied (spec §11).
 *
 * Spec §1: render every token in staging as visible red text, and fail the
 * production build if any `{{ }}` string survives into published content.
 * `npm run verify:tokens` is that gate. It is deliberately NOT wired into
 * `prebuild` — verification in this repo is a command run on purpose.
 */
export type TokenName =
  | "SLA_REPLY"
  | "DUR_AGREEMENT"
  | "DUR_INTAKE"
  | "DUR_WIPE"
  | "DUR_REFURB"
  | "WIPE_STANDARD"
  | "CERT_RETENTION"
  | "FACILITY_STATEMENT"
  | "OS_NAME"
  | "GIVE_1"
  | "GIVE_1_OUTCOME"
  | "GIVE_2"
  | "GIVE_2_OUTCOME"
  | "GIVE_3"
  | "GIVE_3_OUTCOME"
  | "LOAN_MONTHS"
  | "PEER_HOURS"
  | "CYCLE"
  | "PANEL"
  | "DECISION_DATE"
  | "PRIORITY_GROUPS"
  | "REPORT_CONTACT"
  | "NEED_STAT"
  | "RECYCLER";

export type TokenEntry = {
  /** What IT for Youth needs to supply. */
  needed: string;
  /** Spec sections that consume it. */
  usedOn: string[];
  phase: 1 | 2;
  /**
   * Set this to the supplied value to retire the token. While it is
   * undefined the token renders as red text and `verify:tokens` fails.
   */
  value?: string;
};

export const LAPTOP_BANK_TOKENS: Record<TokenName, TokenEntry> = {
  SLA_REPLY: { needed: "Reply commitment", usedOn: ["5.1", "5.2", "5.5"], phase: 1 },
  DUR_AGREEMENT: { needed: "Stage 2 duration", usedOn: ["5.2"], phase: 1 },
  DUR_INTAKE: { needed: "Stage 4 duration", usedOn: ["5.2"], phase: 1 },
  DUR_WIPE: { needed: "Stage 5 duration", usedOn: ["5.2"], phase: 1 },
  DUR_REFURB: { needed: "Stage 6 duration", usedOn: ["5.2"], phase: 1 },
  WIPE_STANDARD: { needed: "Named sanitisation standard", usedOn: ["5.2 stage 5", "5.4"], phase: 1 },
  CERT_RETENTION: { needed: "Certificate retention period", usedOn: ["5.4"], phase: 1 },
  FACILITY_STATEMENT: { needed: "Physical security paragraph", usedOn: ["5.4 §6"], phase: 1 },
  OS_NAME: { needed: "Operating system installed", usedOn: ["5.2 stage 6"], phase: 1 },
  GIVE_1: { needed: "First giving amount", usedOn: ["5.6"], phase: 1 },
  GIVE_1_OUTCOME: { needed: "Outcome line for the first amount", usedOn: ["5.6"], phase: 1 },
  GIVE_2: { needed: "Second giving amount", usedOn: ["5.6"], phase: 1 },
  GIVE_2_OUTCOME: { needed: "Outcome line for the second amount", usedOn: ["5.6"], phase: 1 },
  GIVE_3: { needed: "Third giving amount", usedOn: ["5.6"], phase: 1 },
  GIVE_3_OUTCOME: { needed: "Outcome line for the third amount", usedOn: ["5.6"], phase: 1 },
  LOAN_MONTHS: { needed: "Loan period", usedOn: ["5.6", "5.7", "6.2"], phase: 1 },
  PEER_HOURS: { needed: "Teaching hours", usedOn: ["5.2", "5.6", "5.7", "6.2"], phase: 1 },
  CYCLE: { needed: "Selection cycle", usedOn: ["5.7", "5.8"], phase: 1 },
  PANEL: { needed: "Selection panel", usedOn: ["5.7", "5.8"], phase: 1 },
  DECISION_DATE: { needed: "Next decision date", usedOn: ["5.7", "5.8"], phase: 1 },
  PRIORITY_GROUPS: { needed: "Published priority groups", usedOn: ["5.7"], phase: 1 },
  REPORT_CONTACT: { needed: "Reporting route for payment demands", usedOn: ["5.7"], phase: 1 },
  NEED_STAT: { needed: "The one figure in block 2", usedOn: ["5.6"], phase: 1 },
  RECYCLER: { needed: "Licensed handler name and licence reference", usedOn: ["5.13"], phase: 2 },
};

/** The literal `{{NAME}}` string, for use inside a COPY template. */
export function token(name: TokenName): string {
  return LAPTOP_BANK_TOKENS[name].value ?? `{{${name}}}`;
}

/** True once IT for Youth has supplied the value. */
export function isTokenResolved(name: TokenName): boolean {
  return typeof LAPTOP_BANK_TOKENS[name].value === "string";
}

export const UNRESOLVED_TOKEN_PATTERN = /\{\{([A-Z0-9_]+)\}\}/g;
```

- [ ] **Step 3: Write `components/laptop-bank/token.tsx`**

A string that may contain tokens is split so the tokens can be styled. This is
the only place `{{ }}` is allowed to reach the DOM.

```tsx
import { LAPTOP_BANK_TOKENS, UNRESOLVED_TOKEN_PATTERN, type TokenName } from "@/lib/content/laptop-bank-tokens";

/**
 * Renders COPY that may still contain `{{TOKEN}}` placeholders.
 *
 * Spec §1: an unsupplied token renders as visible red text so nobody
 * reviewing staging can mistake it for finished copy. Once
 * `LAPTOP_BANK_TOKENS[name].value` is set the token resolves silently and
 * this renders plain text.
 */
export function TokenText({ children, className }: { children: string; className?: string }) {
  const parts: Array<string | { token: string }> = [];
  let lastIndex = 0;

  // A fresh regex per call — the module-level one is /g and therefore
  // stateful; sharing it across renders would skip matches.
  const pattern = new RegExp(UNRESOLVED_TOKEN_PATTERN.source, "g");
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(children)) !== null) {
    if (match.index > lastIndex) parts.push(children.slice(lastIndex, match.index));
    parts.push({ token: match[1] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < children.length) parts.push(children.slice(lastIndex));

  return (
    <span className={className}>
      {parts.map((part, index) =>
        typeof part === "string" ? (
          <span key={index}>{part}</span>
        ) : (
          <span
            key={index}
            className="font-bold text-red-600"
            title={LAPTOP_BANK_TOKENS[part.token as TokenName]?.needed ?? "Awaiting content from IT for Youth"}
          >
            {`{{${part.token}}}`}
          </span>
        ),
      )}
    </span>
  );
}
```

- [ ] **Step 4: Write `scripts/verify-tokens.ts`**

Model it on `scripts/verify-media-pages.ts`. It walks the Laptop Bank content
modules, collects unresolved tokens, prints them grouped by phase, and exits 1
if any Phase 1 token is unresolved.

```ts
/**
 * Spec §10, first checklist item: no `{{TOKEN}}` string exists anywhere in
 * published content.
 *
 * Run deliberately: `npm run verify:tokens`. Exits 1 when a Phase 1 token is
 * still unresolved, so it CAN gate a production deploy — but it is not wired
 * into prebuild, a hook or CI, matching this repo's standing rule that
 * verification never blocks a build.
 */
import { LAPTOP_BANK_TOKENS, type TokenName } from "../lib/content/laptop-bank-tokens";

const entries = Object.entries(LAPTOP_BANK_TOKENS) as Array<[TokenName, (typeof LAPTOP_BANK_TOKENS)[TokenName]]>;
const unresolved = entries.filter(([, entry]) => entry.value === undefined);
const blocking = unresolved.filter(([, entry]) => entry.phase === 1);

for (const [name, entry] of unresolved) {
  console.log(`  {{${name}}}  phase ${entry.phase}  ${entry.needed}  (${entry.usedOn.join(", ")})`);
}

console.log(`\n${entries.length - unresolved.length}/${entries.length} tokens resolved.`);

if (blocking.length > 0) {
  console.error(`\n${blocking.length} Phase 1 token(s) still unresolved — not ready to publish.`);
  process.exit(1);
}
```

- [ ] **Step 5: Add the six collections to `types/firebase.ts`**

Append inside `FIREBASE_COLLECTIONS`, before the closing brace on line 23:

```ts
  laptopBankStages: "laptopBankStages",
  laptopBankIntake: "laptopBankIntake",
  laptopBankDonors: "laptopBankDonors",
  laptopBankStories: "laptopBankStories",
  laptopBankMetrics: "laptopBankMetrics",
  laptopBankDocuments: "laptopBankDocuments",
  laptopBankOffers: "laptopBankOffers",
  laptopBankApplications: "laptopBankApplications",
```

- [ ] **Step 6: Add the script to `package.json`**

```json
"verify:tokens": "npx --yes tsx scripts/verify-tokens.ts"
```

- [ ] **Step 7: Verify**

```bash
npm run type-check && npm run lint
npm run verify:tokens; echo "exit=$?"
```

Expected: type-check and lint clean. `verify:tokens` lists 24 unresolved
tokens and exits 1 — that is the correct state before IT for Youth supplies
anything.

- [ ] **Step 8: Commit**

```bash
git add types/laptop-bank.ts types/firebase.ts lib/content/laptop-bank-tokens.ts components/laptop-bank/token.tsx scripts/verify-tokens.ts package.json docs/superpowers/specs docs/superpowers/plans
git commit -m "feat(laptop-bank): add content types, token registry and the token gate"
```

---

### Task 2: Seed content and consent-enforcing readers

**Files:**
- Create: `lib/content/laptop-bank-config.ts`
- Create: `lib/content/her-first-laptop-config.ts`
- Create: `lib/cms/laptop-bank.ts`

**Interfaces:**
- Consumes: Task 1's types and `token()`.
- Produces: `laptopBankStages: ProcessStage[]` (9), `laptopBankIntakeItems: IntakeItem[]` (14), `laptopBankDocuments: LaptopBankDocument[]` (6), page copy objects, and readers `getProcessStages()`, `getIntakeItems()`, `getConsentingDonors()`, `getPublishableStories()`, `getDashboardMetrics()`, `getLaptopBankDocuments()`.

- [ ] **Step 1: Write `lib/content/laptop-bank-config.ts`**

Transcribe from the spec doc, section by section. Nine `ProcessStage` records
from spec 5.2 block 3, with `duration` and `summary_sentence` from block 2's
table. Fourteen `IntakeItem` records from spec 5.3, `sort_order` following the
table order, the nine `accepted: true` rows first. Six `LaptopBankDocument`
records from spec 5.10 with `file: ""` — the PDFs are awaited (spec §11), so
each record carries a real title, version and audience tag but no file, and
C12 renders it as awaited rather than as a broken download.

Interpolate tokens with `token("WIPE_STANDARD")` etc. — inside a template
literal, e.g.:

```ts
full_text: `Every storage device is sanitised to ${token("WIPE_STANDARD")} on arrival, whether or not it has already been wiped. …`,
```

Also export the page copy for 5.1, 5.3, 5.4, 5.5, 5.9, 5.10 as plain objects.
Every COPY string byte-for-byte from the spec doc.

- [ ] **Step 2: Write `lib/content/her-first-laptop-config.ts`**

Page copy for 5.6, 5.7, 5.8, same rules. Note 5.7 block 1 and block 3 are
authored as `string[]` and composed to prose at render time by
`pointsToParagraph`; block 2 stays an ordered `string[]` because its ordering
is semantic.

- [ ] **Step 3: Write `lib/cms/laptop-bank.ts`**

Mirror `lib/cms/initiatives.ts`: try Firestore via `getAdminFirestore()`, fall
back to seed when Firestore is unconfigured. The consent filters are the point
of this file.

```ts
import { getAdminFirestore } from "@/lib/firebase/admin";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";
import type { Donor, Story, DashboardMetrics } from "@/types/laptop-bank";

/**
 * Spec §4 DATA: "Story and Donor records must not render when their consent
 * field is false or 'anonymous'. Enforce in the query, not the template."
 *
 * So the filters live here, above every caller. A component must never be
 * handed a record it is not allowed to render — a consent check inside a
 * component would mean this query had already leaked one.
 */
export async function getConsentingDonors(): Promise<Donor[]> {
  const db = await getAdminFirestore();
  if (!db) return [];
  const snapshot = await db
    .collection(FIREBASE_COLLECTIONS.laptopBankDonors)
    .where("display_consent", "in", ["logo", "named"])
    .get();
  return snapshot.docs.map((doc) => doc.data() as Donor);
}

/** C9 renders logos only, so it needs the narrower slice. */
export async function getLogoConsentingDonors(): Promise<Donor[]> {
  return (await getConsentingDonors()).filter((donor) => donor.display_consent === "logo");
}

/**
 * Spec 5.14 DATA: never render preferred_name, institution and photo together
 * unless consent_record_ref is populated — also enforced here. A story
 * without a consent record is returned with institution and photo stripped
 * rather than dropped, so a consented quote is still publishable.
 */
export async function getPublishableStories(limit?: number): Promise<Story[]> {
  const db = await getAdminFirestore();
  if (!db) return [];
  const snapshot = await db
    .collection(FIREBASE_COLLECTIONS.laptopBankStories)
    .where("publication_consent", "==", true)
    .get();
  const stories = snapshot.docs.map((doc) => {
    const story = doc.data() as Story;
    if (story.consent_record_ref?.trim()) return story;
    return { ...story, institution: undefined, photo: undefined };
  });
  return typeof limit === "number" ? stories.slice(0, limit) : stories;
}
```

`getDashboardMetrics()` returns `null` when Firestore is unconfigured or the
record is missing — never a seeded object, because spec §10 forbids launching
the stat band with placeholder figures.

`getProcessStages()`, `getIntakeItems()` and `getLaptopBankDocuments()` fall
back to the Task 2 Step 1 seed, because those are real published content, not
awaited figures.

- [ ] **Step 4: Verify**

```bash
npm run type-check && npm run lint
```

Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add lib/content/laptop-bank-config.ts lib/content/her-first-laptop-config.ts lib/cms/laptop-bank.ts
git commit -m "feat(laptop-bank): seed process stages, intake items and documents with consent-gated readers"
```

---

### Task 3: Structural components — C6, C5, C4, C3

**Files:**
- Create: `components/laptop-bank/callout-box.tsx` (C6)
- Create: `components/laptop-bank/spec-table.tsx` (C5)
- Create: `components/laptop-bank/expandable-section.tsx` (C4)
- Create: `components/laptop-bank/process-stepper.tsx` (C3)

**Interfaces:**
- Consumes: `TokenText`, `ProcessStage`, `IntakeItem`.
- Produces:
  - `<CalloutBox variant="info" | "warning" heading={string} body={string} />`
  - `<SpecTable items={IntakeItem[]} condensed?={boolean} split?={boolean} />`
  - `<ExpandableSection id={string} title={string} children={ReactNode} footer?={ReactNode} />`
  - `<ProcessStepper stages={ProcessStage[]} summaryOnly?={boolean} />`

- [ ] **Step 1: C6 callout box**

Two variants only. `warning` uses amber, `info` uses the brand mist. No icon —
the variant reads from the rule and the ground colour, per the repo's
de-iconing rule.

```tsx
const variantClasses = {
  info: "border-brand-border bg-brand-mist/50",
  warning: "border-amber-300 bg-amber-50",
} as const;
```

- [ ] **Step 2: C5 spec table**

Requirements from spec §3: responsive; **collapses to stacked cards below
768px**; accepted / not accepted visual states; reads Intake Item.

Implement as one component rendering both a `<table className="hidden
md:table">` and a `<div className="md:hidden">` stack of cards from the same
`items` array — one data source, two presentations, so they cannot drift.
`accepted` drives a left border (`border-l-4 border-emerald-500` vs
`border-l-4 border-slate-400`) plus a text label ("Accepted" / "Not accepted"),
never colour alone — Draft 1 §14.3 requires text alongside colour.

`condensed` (used by page 5.1 block 6) takes the first six items and drops the
`notes` column. `split` (used by page 5.3 block 3) renders two labelled groups,
accepted then not accepted.

A row whose `minimum_accepted` is `"—"` renders the em dash as-is; that is what
the spec publishes.

- [ ] **Step 3: C4 expandable section**

Requirements: deep-linkable anchor; **opens automatically when the URL
fragment matches**.

Use native `<details>` so it works with JavaScript disabled — spec 5.8 wants
the applicant journey light and Draft 1 §14.1 asks for no heavy JS. Add a
small `"use client"` effect that opens the matching one on mount and on
`hashchange`, and scrolls it into view:

```tsx
"use client";

import { useEffect, useRef } from "react";

export function ExpandableSection({ id, title, footer, children }: ExpandableSectionProps) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    // Spec C4: open automatically when the URL fragment matches. Runs on
    // mount and on every hashchange, because Next's client navigation can
    // change the fragment without remounting this component.
    const openIfTargeted = () => {
      if (window.location.hash === `#${id}` && ref.current) {
        ref.current.open = true;
        ref.current.scrollIntoView({ block: "start" });
      }
    };
    openIfTargeted();
    window.addEventListener("hashchange", openIfTargeted);
    return () => window.removeEventListener("hashchange", openIfTargeted);
  }, [id]);

  return (
    <details ref={ref} id={id} className="group scroll-mt-36 rounded-[28px] border border-brand-border bg-white p-6 shadow-sm">
      <summary className="cursor-pointer list-none font-heading text-2xl font-bold text-brand-ink">{title}</summary>
      <div className="mt-4 text-sm leading-7 text-slate-600">{children}</div>
      {footer ? <div className="mt-6 border-t border-brand-border pt-4">{footer}</div> : null}
    </details>
  );
}
```

- [ ] **Step 4: C3 process stepper**

Requirements: horizontal on ≥1024px, vertical accordion below, one anchor per
stage `#stage-1`…`#stage-9`, reads Process Stage.

`summaryOnly` (page 5.1 block 4) renders just `summary_sentence` per stage.
Full mode (page 5.2 block 3) renders each stage as an `ExpandableSection` with
`id={`stage-${stage.number}`}`, `full_text` as the body, and `owner` /
`record_produced` as the two-column footer the spec requires.

The horizontal treatment is `hidden lg:grid lg:grid-cols-9` of numbered nodes
linking to their anchors; the accordion below `lg` is the stacked
`ExpandableSection` list. Both render from the same `stages` array.

- [ ] **Step 5: Verify**

```bash
npm run type-check && npm run lint
grep -rn "lucide-react" components/laptop-bank/ ; echo "icon-imports-exit=$?"
```

Expected: type-check and lint clean; the grep finds nothing (exit 1), because
these components carry no icons.

- [ ] **Step 6: Commit**

```bash
git add components/laptop-bank/callout-box.tsx components/laptop-bank/spec-table.tsx components/laptop-bank/expandable-section.tsx components/laptop-bank/process-stepper.tsx
git commit -m "feat(laptop-bank): add callout, spec table, expandable section and process stepper"
```

---

### Task 4: C12, C14, C15, C13

**Files:**
- Create: `components/laptop-bank/document-download-block.tsx`
- Create: `components/laptop-bank/sticky-mobile-cta.tsx`
- Create: `components/laptop-bank/giving-mechanic.tsx`
- Create: `components/laptop-bank/related-programme-block.tsx`

**Interfaces:**
- Consumes: `LaptopBankDocument`, `TokenText`, `token()`, `Button`.
- Produces:
  - `<DocumentDownloadBlock documents={LaptopBankDocument[]} groupByAudience?={boolean} />`
  - `<StickyMobileCta label={string} href={string} />`
  - `<GivingMechanic id={string} />`
  - `<RelatedProgrammeBlock body={string} linkLabel={string} href={string} />`

- [ ] **Step 1: C12 document download block**

Shows title, format, file size, version, date. A document whose `file` is
empty renders as "Awaiting publication" with the button disabled rather than
linking nowhere — all six launch PDFs are awaited (spec §11) so this is the
state at launch, not an edge case. Use `Button` with `download` for real files;
`Button`'s `download` prop already bypasses `next/link` correctly.

`groupByAudience` (page 5.10) groups into corporate / applicant / public
sections in that order.

- [ ] **Step 2: C14 sticky mobile CTA**

Requirements: appears below 768px after 40% scroll, one button.

```tsx
"use client";

export function StickyMobileCta({ label, href }: { label: string; href: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Spec C14: 40% scroll. Measured against scrollable distance, not page
    // height, so a short page never traps the bar off-screen.
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(scrollable > 0 && window.scrollY / scrollable >= 0.4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-brand-border bg-white p-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] transition-transform md:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <Button href={href} variant="solid-pink" size="lg" className="w-full">{label}</Button>
    </div>
  );
}
```

- [ ] **Step 3: C15 giving mechanic**

Requirements: 3 fixed amounts plus an open amount; each amount shows an
outcome line; **dual currency display, GHS and GBP/USD, side by side** — the
toggle is optional, the dual display is not.

The three amounts and their outcome lines are all tokens
(`GIVE_1`/`GIVE_1_OUTCOME` …). While unresolved, each amount card renders its
token in red via `TokenText` and its select control is disabled — a donor
cannot select an amount that does not exist yet. The open-amount field stays
usable. The GHS/GBP columns are both present regardless, so the layout the
client signed off is visible in staging.

- [ ] **Step 4: C13 related programme block**

Plain prose block plus one link, no card chrome heavier than the rest of the
pathway page. Body text, link label and destination all come in as props so
the eight pathway pages each supply their own (spec §8, CMS-editable per page).

- [ ] **Step 5: Verify**

```bash
npm run type-check && npm run lint
```

- [ ] **Step 6: Commit**

```bash
git add components/laptop-bank/document-download-block.tsx components/laptop-bank/sticky-mobile-cta.tsx components/laptop-bank/giving-mechanic.tsx components/laptop-bank/related-programme-block.tsx
git commit -m "feat(laptop-bank): add document downloads, sticky CTA, giving mechanic and related programme block"
```

---

### Task 5: Phase 2 components — C2, C9, C10, C11

**Files:**
- Create: `components/laptop-bank/stat-band.tsx`
- Create: `components/laptop-bank/donor-logo-grid.tsx`
- Create: `components/laptop-bank/story-card.tsx`
- Create: `components/laptop-bank/metric-card-grid.tsx`

**Interfaces:**
- Consumes: `DashboardMetrics`, `Donor`, `Story`, `safeImageSrc`.
- Produces:
  - `<StatBand metrics={DashboardMetrics | null} />`
  - `<DonorLogoGrid donors={Donor[]} />`
  - `<StoryCard story={Story} />` and `<StoryGrid stories={Story[]} />`
  - `<MetricCardGrid metrics={DashboardMetrics | null} />`

- [ ] **Step 1: C2 stat band**

Requirements: 4 metrics from one CMS record; displays last-updated date;
**auto-hides the whole band if any metric is null**.

```tsx
export function StatBand({ metrics }: { metrics: DashboardMetrics | null }) {
  // Spec C2: auto-hide the WHOLE band if ANY metric is null — a partial band
  // implies the missing number is zero. Spec §10 also forbids launching this
  // with placeholder figures, so a null record hides it too.
  if (!metrics) return null;
  const values = [
    metrics.units_accepted,
    metrics.deployed_individual,
    metrics.drives_sanitised,
    metrics.partner_orgs,
  ];
  if (values.some((value) => value === null || value === undefined)) return null;
  // …render four figures plus `Last updated {metrics.last_updated}`
}
```

The four metrics are, per spec 5.1 block 2: accepted, equipped, drives
sanitised, partners — mapped to `units_accepted`, `deployed_individual`,
`drives_sanitised`, `partner_orgs`.

- [ ] **Step 2: C9 donor logo grid**

Renders the logos it is given. It does **not** filter — `getLogoConsentingDonors()`
already did, in the query. Add a comment saying exactly that, so a later reader
does not "helpfully" add a redundant consent check and blur where the rule
lives. Every logo goes through `safeImageSrc`; `mediaFit` is contain, because
logos must not be cropped. Alt text is the donor name.

Spec 5.1 block 7: hide when fewer than 4 records — that threshold belongs to the
page, not the component, so the component renders whatever it gets and page 5.1
does the counting.

- [ ] **Step 3: C10 story card**

Renders `preferred_name`, `quote`, and — only when the reader supplied them —
`institution` and `photo`. Same no-filtering comment as C9. Never renders a
composite; never renders a name it was not given.

- [ ] **Step 4: C11 metric card grid**

All thirteen metrics from spec 5.11, in the spec's order, with the spec's
labels. Displays `period_label` and `last_updated` at the top of the grid.
A null individual metric renders "Not yet reported" rather than 0 — unlike C2
this grid does not hide, because spec 5.11's whole point is publishing the
unflattering figures alongside the flattering ones. Returns null only when the
whole record is missing.

- [ ] **Step 5: Verify**

```bash
npm run type-check && npm run lint
```

- [ ] **Step 6: Commit**

```bash
git add components/laptop-bank/stat-band.tsx components/laptop-bank/donor-logo-grid.tsx components/laptop-bank/story-card.tsx components/laptop-bank/metric-card-grid.tsx
git commit -m "feat(laptop-bank): add stat band, donor logo grid, story card and metric grid"
```

---

### Task 6: C8 form shell, upload handling, rate limit, references

**Files:**
- Create: `components/laptop-bank/multi-step-form.tsx`
- Create: `lib/utils/image-compress.ts`
- Create: `lib/utils/rate-limit.ts`
- Create: `lib/utils/reference.ts`
- Create: `lib/laptop-bank/uploads.ts`

**Interfaces:**
- Produces:
  - `<MultiStepForm steps={FormStep[]} storageKey={string} onSubmit={(values) => Promise<void>} />` where `FormStep = { title: string; render: (ctx: StepContext) => ReactNode }`
  - `compressImage(file: File, maxEdge?: number): Promise<File>`
  - `checkRateLimit(key: string, limit?: number, windowMs?: number): { allowed: boolean; retryAfterSeconds: number }`
  - `generateReference(prefix: "LB" | "HFL"): string`
  - `storeUpload(file, meta): Promise<{ id: string }>` and `readUpload(id): Promise<{ stream, contentType, filename } | null>`

- [ ] **Step 1: `lib/utils/reference.ts`**

`LB-` / `HFL-` prefix, the date, and a short random suffix. Must be readable
over the phone, so no lowercase and no ambiguous characters (no `O`, `0`, `I`,
`1`) — applicants read this reference back to staff on a call.

- [ ] **Step 2: `lib/utils/rate-limit.ts`**

Spec §6.1 BEHAVIOUR: hidden honeypot plus **server-side rate limiting**, no
image captcha. An in-process fixed-window counter keyed on the caller's IP.
Document plainly that this is per-instance and resets on redeploy — it stops
casual abuse, and a distributed limiter is a later upgrade if volume demands
one. Do not pretend it is more than that in the comment.

- [ ] **Step 3: `lib/utils/image-compress.ts`**

Spec 5.8 BEHAVIOUR: compress image uploads client-side to a maximum 1600px
long edge before upload. Canvas-based, `"use client"`-safe, returns the
original untouched if it is not an image (a PDF proof of enrolment must pass
through unmodified) or if the browser lacks canvas support.

- [ ] **Step 4: `lib/laptop-bank/uploads.ts`**

Spec §7: uploaded enrolment documents are stored **outside the public web
root** and served only through an authenticated route, with **no guessable
URLs**. Write to Firebase Storage under a private prefix with a random
UUID name, never the applicant's filename. `readUpload` is the only read path
and is called solely by the authenticated route in Task 8.

- [ ] **Step 5: C8 multi-step form shell**

Requirements: step progress indicator, save and resume, conditional panels,
file upload with client-side compression, honeypot field, server-side rate
limit, no image captcha.

Save and resume writes values to `localStorage` under `storageKey` on every
change and restores on mount — spec 5.5 says "against a browser token, no
account required". **File inputs are excluded from what is persisted**: a File
cannot be serialised, and persisting a filename the browser can no longer read
would show a resumed applicant an attachment that will not actually submit.
Say so in a comment.

The honeypot is a visually hidden text input named `companyFax`, matching the
name the existing `organisation-enquiry-form` and its API route already use, so
the two forms agree.

Reuse `FormField`, `TextInput`, `TextArea` from `components/ui/form-field.tsx`
and `Button` from `components/ui/button.tsx`. Do not restyle them.

- [ ] **Step 6: Verify**

```bash
npm run type-check && npm run lint
```

- [ ] **Step 7: Commit**

```bash
git add components/laptop-bank/multi-step-form.tsx lib/utils/image-compress.ts lib/utils/rate-limit.ts lib/utils/reference.ts lib/laptop-bank/uploads.ts
git commit -m "feat(laptop-bank): add multi-step form shell, upload handling, rate limit and references"
```

---

### Task 7: Form 6.1 — corporate equipment offer

**Files:**
- Create: `components/laptop-bank/equipment-offer-form.tsx`
- Create: `app/api/laptop-bank/equipment-offer/route.ts`
- Modify: `lib/utils/validators.ts`

**Interfaces:**
- Consumes: `MultiStepForm`, `checkRateLimit`, `generateReference`, `storeUpload`.
- Produces: `equipmentOfferSchema`, `EquipmentOfferPayload`, `<EquipmentOfferForm />`.

- [ ] **Step 1: Add `equipmentOfferSchema` to `lib/utils/validators.ts`**

Every field from spec §6.1, with the spec's exact enum values and required
flags. `privacyConsent: z.literal(true)`; `marketingConsent: z.boolean()`
defaulting false — they are **separate booleans, never bundled** (spec §7).
`companyFax: z.string().optional()` is the honeypot.

- [ ] **Step 2: Build the form**

Three steps, titled exactly: `About your organisation`, `About the equipment`,
`Logistics and consent`.

Conditional panels, per spec:
- "Released from device management" = No / Need to check → opens an info panel;
  **does not block submission**.
- "Firmware passwords cleared" — same three options, same behaviour.
- "Drives already wiped" — all four answers display the same line:
  `We re-sanitise every drive on arrival regardless.`
- Work email on a free webmail domain → **soft prompt, not a block**.

Every consent checkbox unchecked on first load. "Deployment report" is the one
checkbox that defaults checked — it is not a consent.

- [ ] **Step 3: Build the API route**

Model on `app/api/organisation-enquiries/route.ts`. Order of operations:
rate-limit check → schema parse → honeypot (silently 200, store nothing) →
generate reference → persist → notify.

Per spec §7, the staff notification email carries the **reference number and a
link only, no personal data in the body**. This differs from the existing
`organisation-enquiries` route, which composes the whole submission into the
email body — do not copy that part.

Non-Ghana country sets `import_flag: true` on the stored record; "drives
retained by you = Yes" sets `needs_storage: true`; "Public recognition" writes
straight through to `display_consent` on the Donor record the spec expects.

- [ ] **Step 4: Verify**

```bash
npm run type-check && npm run lint && npm run build
```

- [ ] **Step 5: Commit**

```bash
git add components/laptop-bank/equipment-offer-form.tsx app/api/laptop-bank/equipment-offer/route.ts lib/utils/validators.ts
git commit -m "feat(laptop-bank): add the corporate equipment offer form and its endpoint"
```

---

### Task 8: Form 6.2 — student application

**Files:**
- Create: `components/laptop-bank/student-application-form.tsx`
- Create: `app/api/her-first-laptop/apply/route.ts`
- Create: `app/api/laptop-bank/uploads/[id]/route.ts`
- Modify: `lib/utils/validators.ts`

**Interfaces:**
- Consumes: `MultiStepForm`, `compressImage`, `storeUpload`, `readUpload`, `checkRateLimit`, `generateReference`.
- Produces: `studentApplicationSchema`, `StudentApplicationPayload`, `<StudentApplicationForm />`.

- [ ] **Step 1: Add `studentApplicationSchema`**

Every field from spec §6.2. **DATA constraint, non-negotiable:** no household
income, no guardian income, no bank details, no hardship documentation, **no
date of birth**. Add a comment on the schema saying so, naming the spec line —
this is the kind of field someone adds later in good faith.

Four separate consent/commitment booleans, each `z.literal(true)` except story
consent which is optional. Ghana phone format validation. Alternative contact
must differ from the primary phone — a `.refine()` on the object.

- [ ] **Step 2: Build the form**

Live word counters with hard caps: 200 words on "Why you need a computer", 150
on "What you will do with it". Save and resume keyed on phone number or email
(spec 5.8), so the `storageKey` is derived from those rather than fixed.

Proof of enrolment passes through `compressImage` before upload — 1600px long
edge, JPG/PNG/PDF, max 5 MB.

The eligibility and commitments summary (condensed 5.7 blocks 1 and 3) **must
appear before the first field** — it is part of this page's block 1, so the
page renders it above the form; assert that ordering when you build page 5.8.

- [ ] **Step 3: Build the submit route and the authenticated upload route**

Submit: rate limit → parse → honeypot → compress-checked upload stored via
`storeUpload` → reference → persist → confirmation. Confirmation renders on the
same URL; **do not redirect to a generic thank-you page**.

The upload route is `GET /api/laptop-bank/uploads/[id]` and **requires the
admin session cookie** the existing middleware already checks
(`itfy-admin-session`) — verify it in the route handler itself, not by widening
the middleware matcher, so an unauthenticated request gets 404 rather than a
redirect that confirms the id exists.

SMS is named as the primary confirmation channel (spec 5.8). No SMS provider is
configured in this repo. Send the email confirmation, and leave a clearly
commented `TODO(spec 5.8): SMS is the primary channel` at the single call site
where the provider will slot in. Do not fake a send, and do not claim SMS works.

- [ ] **Step 4: Verify**

```bash
npm run type-check && npm run lint && npm run build
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/api/laptop-bank/uploads/does-not-exist
```

Expected: `404`, with no session cookie — never `200`, never a redirect.

- [ ] **Step 5: Commit**

```bash
git add components/laptop-bank/student-application-form.tsx app/api/her-first-laptop/apply/route.ts app/api/laptop-bank/uploads/ lib/utils/validators.ts
git commit -m "feat(her-first-laptop): add the student application form and its endpoints"
```

---

### Task 9: Pages 5.1–5.4

**Files:**
- Create: `app/(public)/laptop-bank/page.tsx`
- Create: `app/(public)/laptop-bank/how-it-works/page.tsx`
- Create: `app/(public)/laptop-bank/what-we-accept/page.tsx`
- Create: `app/(public)/laptop-bank/data-security/page.tsx`
- Create: `components/laptop-bank/laptop-bank-landing-page.tsx`

**Interfaces:**
- Consumes: everything from Tasks 2–5.
- Produces: four routes.

- [ ] **Step 1: Page 5.1**

Nine blocks in the spec's order. C1 is `EditorialImageHero` with the spec's
heading, subheading and two buttons — the secondary must be visible without
scrolling on mobile, which `EditorialImageHero` already satisfies because both
CTAs sit in the same bottom-anchored panel. C7 blocks 3 and 5 are
`ProseMediaCardGrid` with `theme="corporate"` and `theme="youth"` respectively
— two different themes because the grids are co-located, and per that
component's own doc you must check `lib/content/media-pool.ts` for overlap
rather than assume two names are disjoint.

Block 7 (Partners) renders only when `getLogoConsentingDonors()` returns ≥ 4.

Metadata: exactly the title and meta description in spec 5.1.

- [ ] **Step 2: Page 5.2**

Intro, the 9-row summary table published exactly, `ProcessStepper` in full mode
producing `#stage-1`…`#stage-9`, then the CTA.

- [ ] **Step 3: Page 5.3**

Intro, then the C6 **warning** — which **must sit above** the specification
table — then `SpecTable` with `split`, then the closing copy.

- [ ] **Step 4: Page 5.4**

Nine sections in order with the nine anchors exactly as spec 5.4 lists them:
`#commitment`, `#method`, `#verification`, `#certificates`, `#custody`,
`#facility`, `#parts-drives`, `#tags`, `#exclusions`. Page ends with a C12
block holding the data handling statement.

- [ ] **Step 5: Verify**

```bash
npm run build
for r in /laptop-bank /laptop-bank/how-it-works /laptop-bank/what-we-accept /laptop-bank/data-security; do
  curl -s -o /dev/null -w "%{http_code} $r\n" "http://localhost:3000$r"
done
curl -s http://localhost:3000/laptop-bank/how-it-works | grep -o 'id="stage-[0-9]"' | sort -u | wc -l
curl -s http://localhost:3000/laptop-bank/data-security | grep -o 'id="\(commitment\|method\|verification\|certificates\|custody\|facility\|parts-drives\|tags\|exclusions\)"' | wc -l
```

Expected: four `200`s; `9` stage anchors; `9` data-security anchors.

- [ ] **Step 6: Commit**

```bash
git add "app/(public)/laptop-bank" components/laptop-bank/laptop-bank-landing-page.tsx
git commit -m "feat(laptop-bank): add the landing, process, intake and data security pages"
```

---

### Task 10: Pages 5.5–5.8

**Files:**
- Create: `app/(public)/laptop-bank/donate-equipment/page.tsx`
- Create: `app/(public)/her-first-laptop/page.tsx`
- Create: `app/(public)/her-first-laptop/eligibility/page.tsx`
- Create: `app/(public)/her-first-laptop/apply/page.tsx`

- [ ] **Step 1: Page 5.5** — heading, intro, `EquipmentOfferForm`, confirmation state rendered on the same URL.

- [ ] **Step 2: Page 5.6** — nine blocks. Block 6 (one story) renders only when `getPublishableStories(1)` returns a record. Block 3 and block 8 are the same `GivingMechanic`, distinct `id`s. The student link in the hero must stay in the mobile viewport without scrolling — put it in the hero panel, not below the fold.

- [ ] **Step 3: Page 5.7** — eight blocks. Blocks 1 and 3 compose to prose via `pointsToParagraph`; block 2 uses the numbered `<ol>` treatment; block 6 is a C6 warning; block 7 is six `ExpandableSection`s with the spec's six questions in order.

- [ ] **Step 4: Page 5.8** — the eligibility and commitments summary **before the first field**, then the form, then the confirmation state. Keep the page light; spec targets under 500 KB.

- [ ] **Step 5: Verify**

```bash
npm run build
for r in /laptop-bank/donate-equipment /her-first-laptop /her-first-laptop/eligibility /her-first-laptop/apply; do
  curl -s -o /dev/null -w "%{http_code} $r\n" "http://localhost:3000$r"
done
curl -s http://localhost:3000/her-first-laptop/apply | grep -c 'checked'
```

Expected: four `200`s. The `checked` count must be `0` — spec §10 requires
every consent checkbox unchecked on first load.

- [ ] **Step 6: Commit**

```bash
git add "app/(public)/laptop-bank/donate-equipment" "app/(public)/her-first-laptop"
git commit -m "feat(laptop-bank): add the offer form, appeal, eligibility and apply pages"
```

---

### Task 11: Pages 5.9–5.10 (policies)

**Files:**
- Create: `app/(public)/policies/laptop-bank-privacy-notice/page.tsx`
- Create: `app/(public)/policies/laptop-bank-documents/page.tsx`

- [ ] **Step 1: Page 5.9** — the eight sections in order, each with its heading and a body that is explicitly awaited. Spec §11 lists the privacy notice body as content awaiting IT for Youth, so each section renders its "Must state" line as editorial guidance plus an awaited marker. **Do not draft a privacy notice.** An invented privacy notice is a legal document the organisation did not write.

- [ ] **Step 2: Page 5.10** — `DocumentDownloadBlock` with `groupByAudience`, all six launch documents.

- [ ] **Step 3: Verify**

```bash
npm run build
for r in /policies/laptop-bank-privacy-notice /policies/laptop-bank-documents; do
  curl -s -o /dev/null -w "%{http_code} $r\n" "http://localhost:3000$r"
done
```

- [ ] **Step 4: Commit**

```bash
git add "app/(public)/policies"
git commit -m "feat(laptop-bank): add the privacy notice and document download pages"
```

---

### Task 12: Phase 2 pages, noindex and out of the sitemap

**Files:**
- Create: `app/(public)/laptop-bank/impact/page.tsx`
- Create: `app/(public)/laptop-bank/partners/page.tsx`
- Create: `app/(public)/laptop-bank/recycling/page.tsx`
- Create: `app/(public)/her-first-laptop/stories/page.tsx`

- [ ] **Step 1: All four pages export `noindex` metadata**

Spec §10: "Phase 2 pages return 404 or are noindex until populated." Choose
noindex over 404 so the routes exist for internal review, and gate it on real
data rather than a hardcoded flag, so they start indexing themselves the moment
records land:

```ts
export async function generateMetadata(): Promise<Metadata> {
  const populated = (await getLogoConsentingDonors()).length >= 4;
  return {
    title: "…",
    robots: populated ? undefined : { index: false, follow: false },
  };
}
```

- [ ] **Step 2: Each page renders an awaited state when unpopulated** — never a zero, never a placeholder logo, never a composite story.

- [ ] **Step 3: Verify**

```bash
npm run build
for r in /laptop-bank/impact /laptop-bank/partners /laptop-bank/recycling /her-first-laptop/stories; do
  curl -s "http://localhost:3000$r" | grep -q 'name="robots" content="noindex' \
    && echo "noindex OK $r" || echo "MISSING NOINDEX $r"
done
```

Expected: four `noindex OK` lines.

- [ ] **Step 4: Commit**

```bash
git add "app/(public)/laptop-bank/impact" "app/(public)/laptop-bank/partners" "app/(public)/laptop-bank/recycling" "app/(public)/her-first-laptop/stories"
git commit -m "feat(laptop-bank): add phase 2 pages, noindex until populated"
```

---

### Task 13: Navigation, footer, sitemap, redirect

**Files:**
- Modify: `lib/content/site-config.ts:111` and `:188`
- Modify: `app/sitemap.ts`
- Modify: `next.config.mjs:47`

- [ ] **Step 1: Add the Laptop Bank nav item**

Top level, not nested. Insert after "What We Do". Children per spec §2.1, minus
Impact and Partners — those are Phase 2 and §9 keeps them out of nav until
populated:

```ts
  {
    label: "Laptop Bank",
    href: "/laptop-bank",
    items: [
      { label: "How It Works", href: "/laptop-bank/how-it-works" },
      { label: "What We Accept", href: "/laptop-bank/what-we-accept" },
      { label: "Data Security", href: "/laptop-bank/data-security" },
      { label: "Donate Equipment", href: "/laptop-bank/donate-equipment" },
    ],
  },
```

Add `{ label: "Her First Laptop", href: "/her-first-laptop" }` as the first
child of the existing "Get Involved" item. Do not remove or rename any existing
nav item.

- [ ] **Step 2: Footer**

Spec 5.9 BUILD: the privacy notice links from **the footer of every page**. Add
a Laptop Bank column with Laptop Bank, Her First Laptop, Donate Equipment, and
the privacy notice.

- [ ] **Step 3: Sitemap**

Add the ten Phase 1 routes to the `routes` array in `app/sitemap.ts`. **Do not
add the four Phase 2 routes** — spec §9 keeps them out until populated. Note
that the array already spreads `publicNavigation.map(item => item.href)`, so
`/laptop-bank` arrives from Step 1 automatically; add the other nine explicitly.

- [ ] **Step 4: Redirect and the reserved path**

In `next.config.mjs`'s existing `redirects()` array:

```js
{ source: "/what-we-do/laptop-bank", destination: "/laptop-bank", permanent: true },
```

`/laptop-bank/uk` is reserved and must not be published — creating no route
file leaves it a natural 404, which is the correct reservation. Add a comment
in the redirects block recording that the path is reserved, so nobody
repurposes it.

- [ ] **Step 5: Verify**

```bash
npm run build
curl -s -o /dev/null -w '%{http_code} -> %{redirect_url}\n' http://localhost:3000/what-we-do/laptop-bank
curl -s -o /dev/null -w '%{http_code} /laptop-bank/uk\n' http://localhost:3000/laptop-bank/uk
curl -s http://localhost:3000/sitemap.xml | grep -c 'laptop-bank\|her-first-laptop'
curl -s http://localhost:3000/sitemap.xml | grep -c '/laptop-bank/impact\|/laptop-bank/partners\|/laptop-bank/recycling\|/her-first-laptop/stories'
```

Expected: `308 -> …/laptop-bank` (Next serves a permanent redirect as 308),
`404` for `/laptop-bank/uk`, `10` Phase 1 entries, and `0` Phase 2 entries.

- [ ] **Step 6: Commit**

```bash
git add lib/content/site-config.ts app/sitemap.ts next.config.mjs
git commit -m "feat(laptop-bank): wire navigation, footer, sitemap and the legacy redirect"
```

---

### Task 14: C13 cross-links on the eight pathway pages

**Files:**
- Modify: `types/content.ts:277` — add `relatedProgramme?: { body: string; linkLabel: string; href: string }` to `InitiativePage`
- Modify: `lib/content/site-config.ts:383` — add the block to seven initiative seeds
- Modify: `components/what-we-do/initiative-page.tsx` — render it
- Modify: `lib/utils/validators.ts` — allow the field through `sitePageSchema`/initiative schema so it round-trips through the CMS

- [ ] **Step 1: Add the optional type field.** Optional, because Community Outreach has no block at launch (spec §8) and a required field would force an empty object onto it.

- [ ] **Step 2: Add the seven blocks**, body text verbatim from spec §8, to `girls-in-tech`, `youth-academy`, `rural-tech-connect`, `tech-clubs`, `entrepreneurship-hub`, `code-impact-challenge`, `advocacy`. Leave `community-outreach` without one.

- [ ] **Step 3: Render it** in `initiative-page.tsx` **after the main body, before the footer** (spec §8), inside the main column, guarded on presence.

- [ ] **Step 4: Verify**

```bash
npm run build
for s in girls-in-tech youth-academy rural-tech-connect tech-clubs entrepreneurship-hub code-impact-challenge advocacy; do
  curl -s "http://localhost:3000/what-we-do/$s" | grep -qi 'Laptop Bank\|Her First Laptop' \
    && echo "C13 OK $s" || echo "C13 MISSING $s"
done
curl -s http://localhost:3000/what-we-do/community-outreach | grep -ci 'Laptop Bank'
```

Expected: seven `C13 OK` lines, and `0` for community-outreach — spec §8 says
no block there at launch.

- [ ] **Step 5: Commit**

```bash
git add types/content.ts lib/content/site-config.ts components/what-we-do/initiative-page.tsx lib/utils/validators.ts
git commit -m "feat(laptop-bank): cross-link the seven pathway pages to the Laptop Bank"
```

---

### Task 15: Pre-launch checklist verification

**Files:** none created. This task produces evidence, and fixes whatever the evidence shows is wrong.

- [ ] **Step 1: Walk spec §10 item by item** and record actual command output for each:

| Checklist item | Command |
|---|---|
| No `{{TOKEN}}` in published content | `npm run verify:tokens` (expected: exits 1, listing 24 — the honest state before content arrives) |
| C2 hidden or real figures | `curl -s localhost:3000/laptop-bank \| grep -c 'Last updated'` → `0` while unpopulated |
| `{{SLA_REPLY}}` identical on 5.1, 5.2, 5.5 | grep all three routes, diff the rendered fragment |
| Privacy notice links from both forms, every footer | `grep -c laptop-bank-privacy-notice` on the two form routes and any third page |
| Nine `#stage-n` anchors resolve and auto-open | Task 9 Step 5's grep, plus a manual fragment load |
| Nine 5.4 anchors resolve | Task 9 Step 5's grep |
| Both forms submit on throttled 3G | Manual, in a browser with throttling on — report honestly if not done |
| 5.8 under 500 KB | `curl -s -o /dev/null -w '%{size_download}\n' localhost:3000/her-first-laptop/apply` plus its bundle from the build output |
| Upload not retrievable without auth | Task 8 Step 4's curl → `404` |
| Every consent checkbox unchecked | Task 10 Step 5's grep → `0` |
| Phase 2 pages noindex | Task 12 Step 3's loop → four OK |
| Corporate pack downloads without an email gate | Confirm the hero's second button is a plain link, no form in front of it |
| Story and Donor queries exclude non-consenting records | Write one non-consenting test record to Firestore, confirm it does not render, then delete it. If Firestore is not configured locally, say so rather than claiming the check passed. |

- [ ] **Step 2: Full clean verification**

```bash
npm run type-check && npm run lint && npm run build && npm run verify:media-pages
```

- [ ] **Step 3: Write the execution ledger** to `docs/superpowers/2026-09-01-laptop-bank-execution-ledger.md`, following the format of the phase 5 ledger: decisions taken, conflicts found and how they were ruled, and — explicitly — every checklist item that could **not** be verified and why.

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/2026-09-01-laptop-bank-execution-ledger.md
git commit -m "docs: add the laptop bank execution ledger"
```

---

## Self-Review

**Spec coverage.** §1 conventions → Task 1. §2.1 nav → Task 13. §2.2 URL map →
Tasks 9–13 (all fourteen paths). §3 components: C1 reused (Task 9), C2 Task 5,
C3–C6 Task 3, C7 reused (Task 9), C8 Task 6, C9–C11 Task 5, C12–C15 Task 4,
C13 placed Task 14. §4 CMS types → Tasks 1–2, consent in query Task 2. §5.1–5.14
→ Tasks 9–12. §6.1 → Task 7. §6.2 → Task 8. §7 data handling → Tasks 6–8. §8
cross-links → Task 14. §9 build order → Task 12 keeps Phase 2 dark. §10
checklist → Task 15. §11 tokens → Task 1.

**Known gaps, stated rather than hidden:**
- **Admin CMS editing UI.** Spec §4 says all six types are "editable without a
  developer". This plan delivers the types, the collections and Firestore-first
  readers, which is what makes editing possible — but not the admin screens
  under `app/(admin)/`. That is a comparable body of work to this whole plan
  and belongs in its own. Flag it to John rather than half-building it.
- **SMS confirmation** (spec 5.8) — no provider is configured in this repo.
  Task 8 Step 3 leaves a single commented call site and does not fake it.
- **Retention deletion job** (spec §7) — depends on the retention schedule in
  5.9 §6, which is itself awaited content. Cannot be built to a schedule that
  does not exist yet; note it in the ledger.
- **Analytics events** (Draft 1 §14.5) — out of scope for v1.0, which does not
  restate them.

**Type consistency check.** `ProcessStage.number` is used as `stage.number` in
Task 3 Step 4 and `#stage-${stage.number}` in Task 9 Step 2 — consistent.
`getLogoConsentingDonors()` is defined in Task 2 Step 3 and called in Task 9
Step 1 and Task 12 Step 1 under that exact name. `getPublishableStories(limit?)`
defined Task 2, called with `1` in Task 10 Step 2. `companyFax` is the honeypot
name in Task 6 Step 5 and Task 7 Step 1, matching the existing
`organisation-enquiries` route. `TokenText` takes `children: string`
throughout.
