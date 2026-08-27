# SDD ledger — plan: docs/superpowers/plans/2026-08-27-phase-2-prose-conversion.md

Spec: docs/superpowers/specs/2026-08-26-public-page-prose-and-media-foundations-design.md (programme row 2)
Branch: incircles. BASE at start: 50de7f4f1ce8cd37a52e1ffc69908460cb5eb713
Commits gated on John's approval; controller ruled in phase 1 to commit locally without pushing, and that ruling carries forward.
Workspace retention: KEEP this workspace at the end. John tried to open a phase-1 task report after I deleted it, so the reports stay this time unless he says otherwise.

## Pre-flight conflict scan

### Cross-task rows (files touched by more than one task)

| File | Tasks | Finding |
|---|---|---|
| organisation-service-page.tsx | 1, 4 | Overlap. T1 converts `item.features`; T4 deletes the step numeral. Different regions, but T1 shifts T4's line numbers. |
| training-how-it-works-page.tsx | 1, 4 | Overlap. T1 converts `checklist`; T4 deletes the "Step NN" label. T1 runs first and shifts lines. |
| initiative-page.tsx | 1, 4 | Overlap. T1 converts objectives and eligibility; T4 removes the `number` pass to AlternatingFeatureRow. |
| department-detail-page.tsx | 2, 4 | Overlap. T2 converts three lists; T4 deletes the workflow numeral. |
| who-we-are-page.tsx | 3, 4 | Overlap. T3 converts two bullet blocks; T4 deletes two numerals. Heaviest overlap in the plan. |
| training-who-can-apply-page.tsx | 3, 4 | Overlap. T3 normalises the join; T4 deletes the audience numeral. |
| hero-slideshow.tsx, testimonials-section.tsx | 2, 4 | Not real overlaps — both tasks only name these as files to LEAVE ALONE. |
| T1/T2/T3 against each other | — | No shared files. Disjoint. |

### Per-task self-consistency rows

| Task | Files listed vs. steps | Verdict |
|---|---|---|
| T1 | 6 files, 7 sites; Steps 1-7 cover all seven; Step 10 `git add` names all six | Agrees with itself. |
| T2 | 2 files, 6 sites; Steps 1-6 cover all six; Step 7 grep is the completeness check | Agrees with itself. |
| T3 | 2 files, 3 sites; Steps 1-3 cover all three | Agrees with itself. |
| T4 | 13 files listed; Steps 1-13 cover 13 rendered badges plus the type and pass cleanup; Step 17 `git add` names all 13 | Agrees with itself. |

### Findings and rulings

**Finding 1 — Task 4's line numbers will be stale by the time it runs.**
Six files are edited by an earlier task first, so every line number in Task 4's
Files block is a pre-phase-2 reading.

Ruling: implementers must locate every edit by the exact code block the plan
quotes, never by line number, and must re-grep before editing. The plan quotes
the full block verbatim for all 13 badge sites, so this is workable as written.
Task 4 is dispatched LAST, after Tasks 1-3 are committed. Every dispatch brief
will carry this instruction.
Cost if wrong: an implementer edits the wrong region and the build or the
visual check catches it; recoverable within the task.

**Finding 2 — Task order is not free.**
T1, T2 and T3 are mutually disjoint and may run in any order, but T4 must run
after all three because it is the one that inherits their drift.
Ruling: run T1, T2, T3, T4 strictly in that order, one implementer at a time.
Cost if wrong: avoidable merge friction inside single files.

No other conflicts found.

## Task log
Task 1: implemented (commit 970069f, base 50de7f4) — all 7 chip-grid sites converted, type-check/lint/build pass. Controller spot-check confirmed scope discipline: the diff touches no `step.number`/`index + 1`/`padStart` line and removes no icon import, so badges (Task 4) and icons (phase 3) are intact. Review dispatched.
Task 2: implementer dispatched (base 970069f) in parallel with Task 1 review — disjoint files (department-detail + course-detail-card vs Task 1's six).
Task 1: review returned Spec ✅ but one Important finding — the checklist conversion in training-how-it-works-page.tsx renders an unguarded bordered card, so an all-empty checklist now shows a visible empty box where it previously showed nothing. `checklist` is built by flatMapping optional `bullets` fields, so empty is a real CMS state.

Ruling: FIX IT. This is a defect in my own brief — Step 7 specified the replacement without a `.length` guard, while the equivalent conversions in impact-overview-page and impact-reports-page were specified WITH one. The implementer followed the brief faithfully; the inconsistency is mine. The fix is to add the same guard the siblings got.
Cost if wrong: none identified — the guard only suppresses a card that would otherwise be empty.

Task 1: ⚠️ resolved by controller — reviewer could not confirm rendered styling from the diff. Not a gap: the implementer curl-checked all six routes and found no leftover chip markup, and whether `border-l-2 border-brand-gold pl-5` reads well is a design judgement for John's eye, not a correctness gate. Flagged to him instead.
Task 1: fix dispatch deferred until Task 2's implementer finishes, to avoid two agents racing the git index.
Task 2: implemented (commit c4c4d2e, base 970069f) — all 6 ul/li sites converted; CheckCircle2 removed from course-detail-card's import only after lint confirmed it unused. DONE_WITH_CONCERNS.

**Finding — a 16th list site the plan missed.** Task 2's Step 7 grep surfaced `<ul>/<li>` at course-detail-card.tsx:259-266, the "Taught by" teachers roster. It is not one of the plan's named sites and not one of the two sanctioned exceptions. Good catch by the implementer, which is what that grep was for.

Ruling: CONVERT IT, but not with `pointsToParagraph`. `teachers` is an array of `{ name, email? }` objects — a roster of people, not prose points. Running names through `pointsToParagraph` would render "Ama Mensah. Kofi Boateng." which is wrong; names are not sentences. Render them as a comma-joined line inside a `<p>` instead. This satisfies John's no-bullets rule without pretending a roster is prose.
Cost if wrong: John wanted the roster to keep its list form as a people directory rather than a sentence; one small revert.

Batching this with the Task 1 checklist-guard fix into one dispatch — both are small, single-site corrections in different files.
Task 2: review returned Spec ✅ / Approved. All 6 sites use pointsToParagraph, guards preserved, the department workflow numeral survives (Task 4's to remove), CheckCircle2 removed only after confirming it unused while all 6 other icons in that import survive. Reviewer also judged the comma-join treatment of the teachers roster correct rather than a deviation to challenge.
Task 2: minor (deferred): department-detail's Responsibilities panel has no empty-array guard. Pre-existing and unchanged in kind — an empty array rendered an empty <ul> before and an empty <p> now, both inside the same bordered Panel. Not a regression; left alone.
Fix wave 1 applied: dfee9d3 (checklist empty-state guard), 21098e6 (teachers roster comma-joined). Both verified.
Correction to my own plan: the plan claimed hero-slideshow.tsx holds a carousel dot <li> list. It does not — that grep hit was `<linearGradient` substring-matching "<li". The only real list markup left on public pages is site-footer.tsx navigation. Task 4's brief inherits this correction.
Fix wave 1 re-review: both findings ADDRESSED, no new breakage, badges and icons intact, two genuinely separate commits.
Task 3: implemented (commit a5790d8) DONE_WITH_CONCERNS — the three named sites converted, CheckCircle2 removed only after confirming it unused.

**Finding — four more un-normalised joins the plan missed.** Task 3's Step 4 grep found `legacy-homepage-sections.tsx:101` (problemItems) and `:107` (solutionItems), `apply-for-training-overview-page.tsx:103` (supportPoints), and `training-who-can-apply-page.tsx:74` (readinessSection.bullets). The last is a SECOND join in the very file whose other join my brief called "the last inline join" — my count was wrong twice in this phase.

Ruling: CONVERT ALL FOUR. Each joins a content-point array with a bare space and no terminal punctuation, producing run-on text — exactly what pointsToParagraph exists to fix, and exactly what John's no-bullets-prose rule is about. Leaving them would mean the phase's own completeness claim is false.
Cost if wrong: four paragraphs gain full stops between points, matching every other converted site.

Controller audited every remaining `.join(" ")` on public pages. The rest are legitimate and stay: hero-slideshow:79-80 splits a headline into words, marquee-ticker:108 joins CSS class names, training-how-it-works:31 joins two hero sentences, and the courses [slug] page joins slug words into a title. None are content points.
Task 3: review returned Spec ✅ / Approved with no findings at any severity. Reviewer confirmed the dark-tone paragraph kept text-white/72 rather than inheriting dark-on-dark, both guards survive, all three number badges survive, and CheckCircle2 was dropped only after verifying zero remaining uses while all six other icons remain used.
Task 3: complete (commits 21098e6..a5790d8, review clean)
Fix wave 2 applied (commit b47dcac) — all four missed joins converted; final audit shows the only remaining `.join(" ")` calls on public pages are the four legitimate non-content ones.
Task 4 dispatched last, as the pre-flight ruling requires, so it inherits the line drift from Tasks 1-3 and both fix waves.
Fix wave 2 re-review: all four sites ADDRESSED, no new breakage, light-on-dark colour classes preserved, no duplicate import, admin-consumed exported types unchanged.
Task 4: implemented (commit f638435, base b47dcac) — 13 files, +31/-92. The implementer was KILLED MID-RUN by a session-limit API error AFTER committing but BEFORE writing task-4-report.md. No report exists for this task.
Task 4: controller verified the commit directly in the implementer's absence — all 13 intended files touched; all four `key={step.number}` React keys survive; `toProcessSteps`'s `number:` key source survives; hero-slideshow's slide counter and both sets of carousel aria-labels survive; no rendered badge remains anywhere; type-check exit 0, lint clean with no warnings, build exit 0.
Ruling: accept the commit despite the missing report rather than re-running the task. The deliverable is verifiable directly from the diff and the gate, all of which I checked myself, and re-running would risk undoing correct work. The task review is dispatched with the missing report called out so the reviewer leans on the diff alone.
Cost if wrong: no written account of the implementer's own reasoning survives; the diff and this ledger entry are the record.
Task 4: review returned Spec ✅ / Approved. All 13 badges removed in the intended regions; every must-survive item confirmed on disk; `AlternatingFeatureItem.number` and its only caller removed together with no orphan; wrapper collapses and orphaned top-margins handled; map signatures correctly tidied where `index` became unused AND correctly retained where it is still used (programme-showcase's `priority={index < 4}`, who-we-are's `operatingIcons[index]`); the three icon-beside-badge rows correctly left uncollapsed for phase 3.
Task 4: minor (deferred): editorial-guidance-grid.tsx:33,38 changed `pr-20`/`pr-14` to `pr-0` rather than dropping the classes. `pr-0` is a Tailwind no-op, so this is dead markup, not a bug. Fold into a final tidy if a fix wave runs; otherwise ship.
Task 4: complete (commits b47dcac..f638435, review clean, 1 deferred minor)

All 4 phase 2 tasks complete. Branch 50de7f4..f638435, 7 commits. Final whole-branch review dispatched.

## Final whole-branch review — rulings

Verdict: approve after one follow-up commit. No Critical findings.

Ruling I1/I2 (tag arrays given prose treatment): FIX NOW. Department `services[].bullets` and organisation package `features` are 1-3 word tags — "Timetables", "Venues", "Single-topic workshop" — and pointsToParagraph renders them as "Timetables. Facilitator coordination. Learner support." This is the exact failure mode I already ruled on for the teachers roster; I made the right call there and then failed to apply it consistently across the phase. Same fix: comma-join. Affects 9 department pages and 2 organisation pages, so shipping it would put copy that reads as a mistake on eleven live pages.
Cost if wrong: John prefers full sentences for these; one-line revert per site.

Ruling I3 (unguarded empty card in impact-sdgs-page): FIX NOW. Same empty-bordered-box defect fixed mid-phase in training-how-it-works, surviving in phase-1 code. One `.length` guard closes the class of bug rather than leaving one instance behind.
Cost if wrong: none.

Ruling M1/M2 (gold-rule token drift, three treatments in one file): FIX NOW. Mechanical, and it is the direct answer to "does this read as one system". department-detail's pl-3 becomes pl-5, training-who-can-apply's leading-8/slate-700 becomes leading-7/slate-600, and department-detail's Responsibilities adopts the gold-rule standard so the page stops showing three treatments in one scroll.
Cost if wrong: cosmetic; trivially adjustable.

Ruling M5 (dead pr-0 classes): FIX — drop the `pr-0`. Leaving `relative` in place: it is inert for layout and only affects stacking, so removing it is a marginally riskier change for no gain.
Ruling M8 (`px=3` typo): FIX. One character, a genuine pre-existing bug leaving a badge with no horizontal padding. Cheaper to fix while we are in the file than to file.

Deferred to phase 3: M3 (three near-miss card variants), M4 (vestigial single-child wrappers around icons — phase 3 removes the icons and collapses them), M6 (pre-existing unguarded empty paragraphs, unchanged in kind), M7 (`number` is now a required CMS field rendering nowhere; validators still demand it and duplicates now have no visual tell).
Reviewer closed the department Responsibilities guard item outright rather than deferring: validators enforce `.min(1)`, so an empty array is unreachable through the admin path.
Reviewer independently re-derived Task 4 from the diff and endorsed accepting it without its lost report.
Final fix wave applied (commit 5497fdc) — all seven findings F1-F7 implemented. Controller verified: all three tag sites now comma-joined (department service bullets, organisation package features, course teachers roster), `px=3` typo gone, both dead `pr-0` tokens gone, type-check exit 0, lint clean, build exit 0. Scoped re-review dispatched.
Final fix wave re-review: all seven findings ADDRESSED, no new breakage. Reviewer independently confirmed the `pointsToParagraph` import removal from organisation-service-page is safe (no remaining call; composeProse still imported and used), and that the readiness callout in training-who-can-apply was correctly left untouched. The `font-medium` the reviewer noted as beyond F1's spec was deliberate on my part — it restores the tag-like weight the original <ul> carried.

PHASE 2 COMPLETE. Branch 50de7f4..5497fdc, 8 commits. Gate: type-check 0, lint clean, build 0.
Workspace RETAINED (not deleted) — John tried to open a phase-1 task report after I cleared that workspace.
