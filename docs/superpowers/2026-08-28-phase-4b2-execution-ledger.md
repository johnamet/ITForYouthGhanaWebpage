# SDD ledger — plan: docs/superpowers/plans/2026-08-28-phase-4b2-media-rollout.md

Branch: incircles (now tracks origin/incircles — pushed after John chose "push first, then roll out").
BASE at start: c7b3256c455c1be4a463bcfc5e91a92205f957a7
Commits: local only. Workspace: RETAIN.

## Planning work done and verified BEFORE this plan was written

- Enumerated all 15 target grids with their real wrapper classes, column counts, breakpoints, gaps, and seed card counts.
- Produced a theme assignment VERIFIED by scripts/verify-media-pages.ts across all 31 page instances. It took four attempts because every editorially-natural choice failed:
  * corporate + partnership + entrepreneurship gave 9/10 on a service page
  * impact + graduation gave 6/7 (those two pools share 4 of 8 photographs)
  * community + youth gave 6/7
  * "partnership" for the NEW partner-with-us grid collides with 4a's existing focus-cards grid on that same page — and it was the obvious pick
- Learned that sampled checks using SYNTHETIC keys prove nothing. The resolver hashes real content strings, so a synthetic "org:ov:0" passing says nothing about "Corporate Training". The full-instance gate caught three failures a sampled check had waved through. Any future theme change must be gated on real keys across every instance.
- Committed the gate as scripts/verify-media-pages.ts plus an npm run verify:media-pages script (commit c7b3256). It shells out via npx --yes tsx because tsx is not a dependency and adding one was out of scope.

## Survey findings that shaped the plan

- ecosystemCards ALREADY renders an edge-to-edge 16/9 image above a p-7 body with an eyebrow — the spotlight variant's shape, not the panel's. It is NOT a media-less family; my earlier count was wrong again. It gets variant="spotlight", with the authored image outranking the pool.
- reportResources (a download link) and SDG goals (linked routes) carry links the panel variant cannot express, because cta renders only on spotlight. Task 1 fixes that.
- gap-4 is needed by contact responseSteps and department services, but the grid's gap union is only "5" or "6". Exactly the additive widening 4b-1's closing review predicted.
- Several families key off fields other than title: packages use name, contact steps use step.number, SDG goals use goal.goal. The gate script uses those fields, so the pages must too — otherwise the gate checks strings nothing renders.

## Pre-flight conflict scan

- scripts/verify-media-pages.ts is edited by ALL FIVE tasks. Real shared file.
- training-process-strip.tsx and training-who-can-apply-page.tsx appear in tasks 1 and 5, but that is a FALSE overlap: Task 1 only assigns and gates their themes in the script; Task 5 edits the components.
- Component files are otherwise disjoint: T2 organisations, T3 impact, T4 what-we-do plus partnerships, T5 contact/news/departments/training.

**Ruling — tasks run STRICTLY SEQUENTIALLY, no parallel implementers.** Every task edits the gate script, so two implementers would race both it and the git index. This differs from earlier phases where I deliberately ran an implementer alongside a review; here a review may overlap an implementer, but never two implementers.
Cost if wrong: index contention and a corrupted gate script — cheap to avoid, expensive to untangle.

**Ruling — the SDG goals grid may be deferred.** Task 3 Step 4 authorises the implementer to STOP and report rather than force it through the primitive. It is a two-column panel with a navy inner block and linked routes, unlike every other target. Deferring one grid is far cheaper than silently losing content.
Cost if wrong: one grid ships a phase later than the rest.

**Note on my own tooling slip:** the first attempt at this ledger used an UNQUOTED heredoc, so backticked theme names were executed as shell command substitutions and the file was written corrupted. Rewritten with a quoted heredoc. Worth remembering when writing ledgers that quote code.

## Task log
Task 1: implemented (commit 3f037c6) — gap widened to "4"|"5"|"6"; cta now renders on the panel variant using Button variant="blue"; the anchor-nesting guard simplified to Boolean(href) && !videoUrl && !cta with no variant-conditional left; themes gated for the last two grids. Gate grew 31 -> 35 page instances, all passing. Canaries /partner-with-us/educational and /what-we-do/girls-in-tech both 200.
Both remaining grids settled on `training` and passed first try, because each is the only grid on its page — so resolveMediaSet alone guarantees no repeat regardless of theme. The implementer also discovered TrainingProcessStrip renders on THREE routes (/apply-for-training, /apply-for-training/courses, /apply-for-training/how-it-works), not one; all three are now gated.
Good judgement call by the implementer: my brief told it to add the settled themes to the plan's table while my outer constraints said "change only these three files". It flagged the conflict instead of guessing. I resolved it myself in commit be6c0b9.
Task 2 dispatched (for-organisations, 3 grids on one page) in parallel with Task 1's review only — no second implementer, per the sequential ruling.
Task 1: review returned Spec ✅ / Approved, no Critical or Important findings. Reviewer verified against the real source tree rather than the diff: guard simplified with zero `isSpotlight && cta` remnants repo-wide, Button variant "blue" confirmed to exist, both new gate entries' key derivations confirmed to mirror the actual page code exactly (audienceSections matches whoCanApplyHub.sections.slice(0,3); the process-strip derivation mirrors toProcessSteps rather than reading an unused field), no existing gate entry dropped (35 = 31 + 4, purely additive), and all three TrainingProcessStrip routes confirmed by grep.
Task 1: complete (commit 3f037c6, review clean)

**Finding for John's decision — the gate has NO automated trigger.** package.json defines verify:media-pages as a standalone script; there is no CI workflow, no pre-commit hook, and no prebuild wiring. It runs only when a human types it. The reviewer also found that BOTH newly-gated routes already contain a second plain card grid that is an obvious future conversion target (training-how-it-works timelineSections; apply-for-training focusSections), either of which would break the "only grid on this page" premise those two themes rest on — and nothing would catch the resulting collision, because type-check and build pass either way. Every other single-grid entry in the table has the same latent gap, so this is inherited rather than new.
Ruling: DO NOT wire it into prebuild unilaterally. Making a failing gate block `npm run build` is a real change to John's workflow — a bad theme would block a deploy — and the reviewer explicitly said it warrants his decision rather than a silent default. Carry it to the phase wrap-up as an explicit question. The remaining tasks each run the gate as a required step, so the rollout itself is covered meanwhile.
Cost if wrong: someone adds a grid later without re-running the gate and a page repeats a photograph, caught by eye rather than by the build.

Task 2: implemented (commit 3468efa) — three grids converted, all four service pages 200, no repeated photograph on any of them (the implementer checked every rendered img src across each whole page, not just the script's per-grid union), gate 35/35, type-check/lint/build clean. The gate script needed no edits: its existing for-organisations entries already matched the required key templates character for character.
Task 2 decisions: item.price -> eyebrow; item.features folded into body as "Includes: a, b, c." (comma-joined, never through points, which would punctuate each tag as a sentence); item.note appended as body's final sentence (wired but unexercised — no package in current CMS data sets it).
**Task 2 concern to surface:** packages lost their distinct visual hierarchy — the navy price badge, gold tag strip and grey note are now one paragraph plus an eyebrow. Content is fully preserved, and this phase changes appearance by design, but it is the largest visual flattening of the three grids and deserves John's eye specifically. Also noted: hire-graduates and staff-volunteering have no packages array at all in current content, which is pre-existing.
Task 3 dispatched (our-impact, 4 grids) in parallel with Task 2's review only.
Task 2: review returned Spec ✅ / Approved. Reviewer verified all five package fields survive, features never went through points, iconImage carried on both grids, mediaKey strings match the gate character for character (confirming the "no script edit needed" claim rather than accepting it), and scope was exactly one file. Its judgement on the packages flattening: acceptable for this phase, but price in a plain eyebrow is visually indistinguishable from a category label, so a dedicated price slot would be the right follow-up if prose-media-card is ever reopened.
Task 2: complete (commit 3468efa, review clean, 1 deferred minor)

Task 3: implemented (commit b091dad) DONE_WITH_CONCERNS. Three of four grids converted; all three routes 200.
- SDG goals DEFERRED, as the plan authorised. Each goal is a navy inner block plus two independently-linked route mini-cards; the grid has no slot for arbitrary text-as-media or multiple per-card links, so converting would lose either the navy block or the links. impact-sdgs-page.tsx untouched. This was the right call and the plan explicitly sanctioned it.
- reportResources: resource.year -> eyebrow (preserving its prior styling), the badge pill (identical text on every card) folded into a leading clause of body.

**Finding — a collision class my gate could not see.** The implementer found /our-impact's hero and a measurement card both rendering frontalgraduation.jpg, and /our-impact/reports' hero and a report card both rendering graduations.jpg. My gate only compared grid against grid, never against the page's authored hero.
I measured the scope: ALL 25 pages with a hero have one that also sits in some theme pool — unavoidable, because the pool deliberately contains the same 30 local ITFYG photographs used as heroes. But only 2 of 19 converted pages actually resolved to a repeat.
Ruling: fix the GATE, not just the two pages. A hero-aware gate turns this from something to notice into something that fails. Then retheme from verified hero-aware values: /our-impact measurementCards impact -> graduation; /our-impact/reports reportResources impact -> training and evidenceCards training -> mentoring.
Cost if wrong: three themes are less editorially apt than "impact" on impact pages. Worth it — a page showing its own hero photo twice is a visible defect.

Hero fix wave (commits 82d838e, 6804c59, 8ae9624): gate made hero-aware, three themes changed, and Button gained an additive `download` prop threaded through ProseMediaCard's cta — the conversion had silently turned report downloads into plain navigations, a real functional regression. The implementer proved the gate works by running it after F1 alone: it newly failed exactly the two pages I had measured, no more and no less.

**Second finding — my own source list was incomplete.** I listed only six hero sources, so pages that Tasks 4-5 will convert had unchecked heroes. Extending coverage revealed exactly one further failure before Task 5 could ship it: /apply-for-training/who-can-apply on theme `training` resolves a card to its own hero. Retheme to `girls-in-tech` (verified hero-aware). Commit bbdda0e. Gate now covers all 35 instances WITH heroes and passes.
Lesson worth keeping: when I hand an implementer an explicit list, the list becomes the scope. Better to state the rule ("every page with a hero") and let it enumerate.

Task 4 dispatched (what-we-do overview + partner-with-us) in parallel with Task 3's review only.
Task 3 + hero fixes: review returned Spec ✅ / Approved. Reviewer independently agreed the SDG deferral was correct (each goal is an asymmetric navy panel with TWO independently-hrefed links; ProseMediaCard exposes one link surface and tone colours the whole card, so it cannot be expressed without dropping content), verified the download prop is strictly additive across ~9 other Button callers, and cross-checked every hero field the gate reads against what each page actually renders — all 9 match, no gate entry dropped across three separate edits.
Task 3: complete (commit b091dad + fixes 82d838e/6804c59/8ae9624/bbdda0e, review clean, SDG grid deferred)

Task 4: implemented (commit 76e8f55) DONE_WITH_CONCERNS — what-we-do overview and all five partnership tracks converted, all six routes 200, ecosystemCards correctly on the spotlight variant, focusCards untouched, key prefixes distinct.
**Finding — a THIRD variant of the collision class.** /what-we-do renders an initiative card per initiative, each with its OWN heroImage, and pathwayCards' "Discover" card resolved onto the Community Outreach card's hero. The gate could not see it: my model was "grid photos + the page's own hero", and this is neither.

Ruling — and this one includes correcting my own over-correction. I first asked for the gate to assert "every image the page renders must be distinct". The implementer applied it, ran it, and correctly STOPPED rather than proceeding: it newly failed all 8 initiative sub-pages, because their authored galleries deliberately re-show their own hero. That is an editorial choice predating this programme, not our defect.
So the invariant was narrowed to the one that actually matters: A POOL-RESOLVED PHOTOGRAPH MUST NOT COLLIDE WITH ANY OTHER IMAGE ON THE PAGE, authored or pool. Authored-vs-authored duplication is reported as INFO, never a failure. The gate now passes 35/35 and emits 9 informational lines an editor may want to act on.
Cost if wrong: an editor duplicating two authored images on one page gets a note rather than a hard failure — which is the correct division of responsibility.

Lesson worth keeping, and it has now cost four rounds: the gate's LOGIC was never wrong. What was repeatedly wrong was its MODEL OF WHAT A PAGE RENDERS — too narrow three times, then too broad once. When a check keeps finding new failure shapes, the scope is the thing to interrogate, not the assertion.

The corrected gate and the retheme (ecosystemCards community -> mentoring, pathwayCards training -> coding, verified against all 16 images that page renders) were applied by an agent that hit a session limit before committing. I verified the working tree myself — gate 35/35 with 9 INFO lines, type-check/lint/build clean, themes agreeing across page, script and plan table — and committed as 75bb36f and a35519d.
Left uncommitted deliberately: a .gitignore edit adding .superdesign/tmp/ and an untracked .superdesign/ directory. Neither is my work and I could not establish provenance, so they are flagged for John rather than swept into a commit.

Task 5 dispatched (contact, news, departments, training) — the last of the rollout.
Task 5: implemented — all five grids converted (contact responseSteps, news editorialPillars, department services, who-can-apply audienceSections, training process strip). The implementer hit a session limit before committing, the fourth agent death this phase. I verified the working tree myself rather than re-running work already done: every theme matches the verified table including the corrected girls-in-tech; no page calls a resolver directly; department service tags keep their comma-joined treatment rather than going through points; and the one remaining pointsToParagraph call in who-can-apply is the standalone readiness callout outside any grid, which legitimately needs it, while the grid itself receives raw body/points. Committed as 6f4b9a2.

Whole-site sweep: all 16 checked public routes return 200. Gate passes 35/35 with 9 informational authored-vs-authored lines. type-check 0, lint 0, build 0 at 145/145 pages.

Note on the rendered-image check: counting `url=` occurrences in the HTML overcounts badly, because next/image emits the same url once per srcset width — 121 occurrences for 11 actual photographs. Distinct counts are 11 on for-organisations/corporate-training, 16 on what-we-do, 8 on our-impact/reports, with no evidence of a real repeat. The data-level gate stays the authoritative check; the rendered count is corroboration only.

PHASE 4b-2 COMPLETE except the deliberately deferred SDG goals grid.
Left uncommitted and NOT mine: a .gitignore edit adding .superdesign/tmp/, plus untracked .superdesign/ and test-results/ directories.
