# SDD ledger — plan: docs/superpowers/plans/2026-09-01-laptop-bank.md

Spec: `docs/superpowers/specs/2026-09-01-laptop-bank-spec.md`
Branch: `incircles` (tracks origin/incircles). Commits local, nothing pushed.
Executed inline, 15 tasks, 14 commits.

## Pre-flight: what Codex had done

Nothing. A repo-wide search for `laptop`, `laptop-bank` and `her-first-laptop`
returned two unrelated hits (`lib/content/media-pool.ts`, an old phase plan).
No branch, no stash, no plan document. Built from scratch.

## Which spec governs

Two PDFs were supplied. **"Website Build Specification v1.0"** (August 2026,
"Developer instructions — what, where, how") governs. **"Website Structure and
Content Specification, Draft 1 — for internal review before build"** is
retained only for the material v1.0 does not cover: the locked naming table
(§2), the technical notes (§14), the "what must exist before build" list (§15)
and the claims-not-to-publish list (§16).

Where they disagree, v1.0 wins and Draft 1 is **superseded**: its 8-stage
process (v1.0 has 9), its "How we make it possible" nav section (v1.0 makes
Laptop Bank top level), and its 3-tier giving table with named tiers (v1.0
makes all three amounts tokens).

## Rulings on conflicts

**1. Navigation — spec §2.1 describes a different site.**
§2.1's primary nav is About / What we do / Laptop Bank / Get involved / Impact
/ News / Contact / Donate. The live nav is Who We Are / What We Do / Apply for
Training / For Organisations / Get Involved / Our Impact / News & Updates, and
commit `b911b32` deliberately tuned it days ago.

Ruling: implement the spec's *actual requirement* — "Laptop Bank is top level,
not nested" and "Get involved dropdown: Her First Laptop · Volunteer · Partner
with us" — and change nothing else. Adopting §2.1 literally would delete Apply
for Training and For Organisations, which is plainly not what a Laptop Bank
spec is asking for, and is not a decision a build spec for one programme gets
to make about the rest of the site. **John should confirm.**

Impact and Partners are listed as Laptop Bank children in §2.1 but are Phase 2
pages, and §9 keeps those out of nav until populated, so they are omitted.
Add them when those pages carry records.

**2. Bullet lists — spec 5.7 versus this repo's standing presentation rule.**
Spec 5.7 blocks 1 and 3 are marked "Bullet list". This repo's public pages
carry no bullet lists; `lib/utils/prose.ts` exists precisely to publish
list-shaped content as prose, and phases 2–5 of the media programme converted
every other content family onto it.

Ruling: blocks 1 and 3 publish the same COPY strings composed through
`pointsToParagraph`. Every word survives; only the glyphs go. Block 2 is
different — the spec presents the four selection criteria as *ranked*, so
flattening them into a sentence would destroy the one thing an applicant most
wants to know. It uses the numbered-circle `<ol>` already established in
`components/organisations/organisation-enquiry-form.tsx`: no bullet glyph, no
icon.

**3. `ProcessStage.summary_sentence` has no supplied copy.**
The content type requires it; the spec supplies stage titles, durations,
"what you receive" lines and `full_text`, but no separate summary.

Ruling: each `summary_sentence` is the **first sentence of that stage's own
`full_text`**. Verbatim client copy, summarising the stage, inventing nothing.
Writing fresh summaries would violate §11's "do not invent values"; reusing
"what you receive" would have published a deliverable where a summary belongs.

**4. Spec 5.2 block 2 words three stages differently from block 3.**
Block 2 says "3 Collection", "6 Refurbishment and quality assurance", "8
In-life tracking"; block 3's expandables say "Collection and chain of
custody", "Refurbishment, imaging and quality assurance", "In-life tracking
and support". Block 2 is marked "publish exactly".

Ruling: keep both. The summary table publishes from its own record set
(`laptopBankStageSummaryRows`) rather than being derived from the Process
Stage records, so neither wording is silently normalised onto the other.

**5. C15 dual currency — a genuine gap in the spec.**
Spec §3 requires "Dual currency display: GHS and GBP/USD". Spec §11 supplies
**one** token per tier (`{{GIVE_1}}`), no second-currency figure, and no
conversion rate. Draft 1 §16 forbids publishing a cost figure not calculated
including failed intake and labour, so the component must not compute the
sterling figure from the cedi one.

Ruling: render both currency slots, fill the cedi slot from the supplied
token, and mark the sterling slot as awaited. **Each tier needs two figures
from IT for Youth, not one.** Raise it with them.

**6. Staff notification emails.**
The existing `sendContactNotification` composes the whole submission — name,
email, phone — into the email body. Spec §7 requires the opposite: "a
reference number and a link only. No personal data in the email body."

Ruling: a separate `lib/email/laptop-bank-notification.ts` rather than reusing
the contact notifier. The existing behaviour is right for a general enquiry
and wrong for an application carrying a student identifier and someone's
account of their circumstances.

**7. The token gate and John's standing preference.**
Spec §1 says "Fail the production build if any `{{ }}` string exists in
published content." John's standing rule is that verification is a command he
runs deliberately and never blocks a build.

Ruling: `npm run verify:tokens` exists and **exits non-zero**, so it can gate
a production deploy the moment John wants it to. It is **not** wired into
`prebuild`, a hook or CI. Wiring it in is one line in `package.json` and is
his call.

## What was deliberately not written

- **No privacy notice text.** Spec §11 lists the body as awaited; Draft 1 §6.2
  flags the Act 843 registration position as a question for a Ghanaian lawyer.
  A drafted notice would be a legal document nobody at IT for Youth wrote,
  stating retention periods and lawful bases nobody agreed, that readers would
  reasonably rely on. The eight-section structure is built, each section shows
  the spec's own "must state" line as visible guidance with an explicit
  awaiting marker, and the page names a contact route meanwhile.
- **No seed Donor, Story or Dashboard Metrics record.** Draft 1 §16 forbids
  publishing any count not evidenced from a record and any story without
  recorded consent. `getDashboardMetrics()` returns `null`, not a seeded
  object, so the stat band hides rather than showing zeros.
- **No photography on either hero.** Draft 1 §4 wants a workbench or a
  technician holding a drive on `/laptop-bank` and explicitly rules out a group
  photo; Draft 1 §8 rules out stock imagery of anonymous African students on
  `/her-first-laptop`. Neither exists in `lib/content/media-pool.ts`, and Draft
  1 §15 lists both as blocking content still owed by Communications.
  `EditorialImageHero` renders correctly with no image; pass the photographs in
  when they arrive. `/her-first-laptop/apply` carries no imagery at all by
  design — spec 5.8 targets a sub-500 KB page for applicants on mobile data.
- **No invented values anywhere.** 23 Phase 1 tokens and 1 Phase 2 token remain
  unresolved, which is the correct state.

## Verification — spec §10 pre-launch checklist

Run against `npm run build` output and a production server (`npm run start`).

| # | Checklist item | Result |
|---|---|---|
| 1 | No `{{TOKEN}}` in published content | `verify:tokens` **exits 1**, listing 23 Phase 1 + 1 Phase 2 outstanding. Correct pre-content state, not a failure. |
| 2 | C2 hidden, or real figures with a date | **Hidden.** 0 occurrences of "Last updated" on `/laptop-bank`. |
| 3 | `{{SLA_REPLY}}` same value on 5.1, 5.2, 5.5 | **Pass.** Present on all three, resolved from one registry entry, so three copies cannot drift. |
| 4 | Privacy notice links from both forms and every footer | **Pass.** 5 links on each form page, 3 on a non-form page (footer coverage). |
| 5 | Nine `#stage-n` anchors on 5.2 resolve and auto-open | **9/9 anchors present.** Auto-open is a `hashchange`+mount effect on native `<details>`; the anchors were verified in HTML, the auto-open behaviour was not clicked through in a browser. |
| 6 | Nine anchors on 5.4 resolve | **9/9.** |
| 7 | Both forms submit on a throttled 3G profile | **NOT VERIFIED.** Requires a browser with network throttling. Not done. |
| 8 | 5.8 total page weight under 500 KB | **Pass.** 126 kB first-load JS + 61.6 KB uncompressed HTML ≈ 188 KB, no images. |
| 9 | Enrolment upload not retrievable without authentication | **Pass.** 404 with no cookie, 404 with a forged cookie, 404 on a path-traversal id. Never 200, never a redirect. |
| 10 | Every consent checkbox unchecked on first load | **Pass.** 0 checked checkboxes in the first-load HTML of both form pages. |
| 11 | Phase 2 pages 404 or noindex until populated | **Pass.** All four emit `noindex`, gated on real data rather than a flag. |
| 12 | Corporate pack downloads without an email gate | **Pass.** Plain `<a href="/policies/laptop-bank-documents">`, no form in front of it. |
| 13 | Story and Donor queries exclude non-consenting records — verified with a test record | **NOT VERIFIED.** Firestore is not configured in this environment, so both readers return `[]` and no test record could be written. The filters are in the query (`where("display_consent","in",["logo","named"])`, `where("publication_consent","==",true)`) and the components carry comments forbidding a redundant template-level check. **Needs a live test with a non-consenting record before launch.** |

Additional checks beyond §10: 301 redirect `/what-we-do/laptop-bank` →
`/laptop-bank` returns 308 (Next's permanent form); reserved `/laptop-bank/uk`
404s with no route file; sitemap carries exactly the ten Phase 1 routes and
zero Phase 2 routes; all seven pathway pages carry their C13 block verbatim in
prerendered HTML and `community-outreach` carries none; `type-check`, `lint`
and `build` clean throughout.

## One security fix, mid-verification

The upload read route originally gated on
`cookies().has("itfy-admin-session")` — a **presence** check, which a forged
cookie value passes. This repo already has `getCurrentAdminUser()`, which
cryptographically verifies the Firebase session cookie, and every admin API
route uses it. Copying the middleware's presence check into a route that
streams an applicant's student ID scan was wrong. Fixed in `9e29fbf`; the
access log now also records *who* read the file.

## Pre-existing issue found, not introduced

`npm run build` logs, twice:

```
Error: Only plain objects, and a few built-ins, can be passed to Client
Components from Server Components.
    at Timeout._onTimeout (...)
```

The build still exits 0. It predates this work — it appeared in the first
build of this session, when no page imported any Laptop Bank code, and the
stack points at a timer-driven path (`components/layout/floating-elements.tsx`
and `components/home/hero-slideshow.tsx` are the only `setTimeout` call sites
in the repo). Not investigated further; flagged for a separate pass.

Also still live from phase 5: the malformed CMS value `PETER_PROFILE.png` on
`/who-we-are/team`, which `safeImageSrc` catches at runtime. Still needs
fixing in the CMS.

## Not built, and why

- **Admin CMS editing screens.** Spec §4 says all six content types are
  "editable without a developer". Delivered: the types, the Firestore
  collections, and Firestore-first readers that fall back to seed — which is
  what makes editing possible. Not delivered: the screens under
  `app/(admin)/`. That is a comparable body of work to this whole plan and
  belongs in its own. **John's call.**
- **SMS confirmation** (spec 5.8, "SMS is the primary channel"). No provider
  is configured in this repo. The email is sent, a single commented call site
  in `app/api/her-first-laptop/apply/route.ts` marks where a provider slots
  in, and the response field is named `smsDelivery: "not-configured"` so
  nothing can mistake it for a message having gone out. Not faked.
- **Retention deletion job** (spec §7). It runs to "the retention schedule in
  5.9 section 6", which is itself awaited content. Cannot be built to a
  schedule that does not exist.
- **Analytics events** (Draft 1 §14.5). Out of scope for v1.0, which does not
  restate them. Also constrained by spec §7's "Set no analytics or embed
  cookies before consent".
- **Payment provider for C15.** Draft 1 §15 lists it as blocking the giving
  flow. The giving mechanic hands its selected amount to the existing
  `/donate` route rather than pretending to take a payment.

## Outstanding asks for IT for Youth

Everything in `LAPTOP_BANK_TOKENS` (run `npm run verify:tokens` for the live
list), plus:

1. **Two figures per giving tier**, not one — a cedi amount and a sterling
   amount. See ruling 5.
2. The six launch PDFs, with a version and date for each.
3. The privacy notice body, all eight sections.
4. Confirmation on the navigation ruling (1).
