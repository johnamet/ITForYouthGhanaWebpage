# SDD ledger — plan: docs/superpowers/plans/2026-08-28-phase-4b1-grid-primitive.md

Branch: incircles. BASE at start: 0c568a17ac03ce7253bf946788e95e35f68e29b4
Commits: local only, no push. Workspace: RETAIN.

## Why 4b is split

4b as specced is ~15 grids across 11 card families. 4b-1 (this plan) is the API work those callers need first; 4b-2 onward is the hub rollout. Same reasoning as the 4a split: callers should target a finished component, not one shifting under them.

## Pre-flight conflict scan

| Pair | Produces -> Consumes | Finding |
|---|---|---|
| T1 -> T2 | aspectRatio/mediaFit on ProseMediaCard -> not used by T2 | No dependency in practice. T2 imports ProseMediaCardProps, which T1 widens, so T1 first avoids a type churn, but they are independent. |
| T1 vs T2 files | — | Disjoint. T1 owns prose-media-card.tsx + content-image.tsx; T2 creates prose-media-card-grid.tsx. |

Per-task self-consistency: T1 lists 2 files and Steps 1-3 touch exactly those (content-image.tsx added to the Files block and to the git add line after I discovered the CSS problem below). T2 creates 1 file, Step 2 asserts no adoption, Step 3 proves the contract. Both agree with themselves.

### Finding and ruling

**Finding — the obvious way to implement mediaFit silently does nothing.** I nearly specified "pass object-contain via imageClassName". Investigated before dispatching: ContentImage composes `cn("object-cover transition duration-700", imageClassName)` and lib/utils/cn.ts is plain clsx, not tailwind-merge, so both classes land on the element and CSS source order decides. In the generated stylesheet object-fit:contain sits at offset 35020 and object-fit:cover at 35075 — cover is declared later and wins. The override would be dead code that looks correct.

Ruling: change the choice at its source. Add an optional `fit` prop to ContentImage that selects exactly one object-fit class, and have ProseMediaCard pass it through. This puts components/media/content-image.tsx in scope for T1 by exception, since it is the only place the fix can correctly live. The plan now carries the measurement so the implementer does not rediscover it.
Cost if wrong: one additive optional prop on a shared primitive, defaulted to today's behaviour.

Note this is the same class of trap the 4a reviewer flagged as M2 (cn is not tailwind-merge, so className cannot override shell classes). It has now bitten once; worth remembering for the rollout.

## Task log
Task 1: implemented (commit 414d59a) — both routes 200, type-check/lint/build clean, mediaFit confined to prose-media-card with neither existing consumer passing it.
Controller verified directly: ContentImage gained `fit = "cover"` selecting exactly one object-fit class, so its default output is byte-identical to before; all THREE media paths select rather than append (mediaFrame at :215, ContentImage via `fit={mediaFit}` at :227, spotlight at :334); safeImageSrc still guards each. The new prop's doc comment records the clsx/tailwind-merge reasoning, so the next person will not "simplify" it back into a layered class.
Task 2: implementer dispatched in parallel with Task 1 review — disjoint files (new prose-media-card-grid.tsx).
Task 1: review returned Spec ✅ / Approved. Reviewer independently proved the byte-identical claim rather than accepting it: clsx joins truthy string args with single spaces, so `cn("object-cover", "transition duration-700", imageClassName)` produces the same string in the same order as the old `cn("object-cover transition duration-700", imageClassName)`. It also confirmed all three paths select rather than append, all three safeImageSrc guards are untouched (only className expressions changed), the aspectRatio fallback matches every current caller, tailwind-merge was NOT added, and neither of the previous phase's fixes regressed.
Task 1: minor (to fix): the trap this task closed still exists one level up — a caller passing `imageClassName="object-contain"` while `fit` stays "cover" still puts two conflicting classes on the element and still loses to stylesheet order. `imageClassName` currently has no doc comment at all. With ~15 call sites about to appear, add a one-line warning that object-fit utilities must go through `fit`. Cheap, and it stops the same bug reappearing immediately.
Task 1: complete (commit 414d59a, review clean, 1 minor queued for a small follow-up)

Note: the reviewer flagged that it could not verify John had approved committing before Step 6 ran. That is the standing ruling from phase 1 — local commits on incircles, no push — carried forward in this ledger's header. Not a defect.
Task 2: implemented (commit eb5cc63) — grid created exactly as specified, type-check/lint/build clean, zero adopters. Step 3 proof reproduced: per-card resolution gives 3/4, 3/4, 2/4, 4/4, 3/4 unique across the five partnership tracks while group resolution gives 4/4 for all five. Controller read the component in full and confirmed the three deliberate choices survive.

Three usage hazards now on the table for 4b-2, two raised by the implementer and one by me:
1. Splitting one visual group across multiple grid calls defeats dedup, since each call resolves independently.
2. Pool exhaustion — a group larger than its theme's 8 entries lets repeats resume by design.
3. (Mine) Multiple grids on the SAME page sharing a theme resolve independently of each other. organisation-service-page alone has three grids, so two on one theme can show the same photograph on one page even though each grid is internally clean — and three grids of four cards on one theme is twelve cards against a pool of eight, making exhaustion reachable on a single page rather than merely in theory.
Referred all three to the closing review with the question of what to change now, while there are zero callers, versus what to merely document. The practical consequence either way: 4b-2 must assign themes PER GRID deliberately, not per hub.

Ruling — closing this phase on two task-scoped reviews plus my own verification, WITHOUT a separate whole-branch review. Reasoning: this phase changes no page and adopts nothing, so the risk profile is far lower than 4a, where I consolidated reviews and a real regression (lost card chrome on eight pages) slipped through as a direct result. I put that reasoning to the closing reviewer explicitly and asked whether I am repeating the same mistake, rather than assuming I am not.
Cost if wrong: a defect in a component nobody imports yet, which 4b-2's first adoption would surface immediately.

## Closing review — rulings

Spec ✅ (grid byte-identical to the brief). One Important finding, two Minors, plus the hazard analysis.

Ruling — sizes/breakpoint drift: FIXED (commit 6321750). This was a defect in MY OWN brief's stated guarantee, not in the implementation. I claimed `columns` closes layout/sizes drift; only the column axis was closed. `breakpoint` never reached `sizes`, which hardcodes (min-width: 1024px), so a md:grid-cols-2 grid declared 100vw until 1024px and fetched images ~2x too wide (~4x pixels) between 768 and 1024. The reviewer measured that md: outnumbers lg: 135 to 30 in this repo and that two of the three grids in the first hub to convert are md:grid-cols-2 — so it would have bitten on first adoption. Fixed inside the grid via ProseMediaCard's existing `sizes` escape hatch, with both required guards (caller-supplied sizes wins; never applied to layout="side", which has its own correct 50vw). `gridSizes` was extracted and exported so it can be exercised without rendering. All six proof cases matched, including both guards.

Ruling — doc comment carries the constraints: DONE. Pool size 8, the split-group hazard, and the co-located-grid hazard including the pool-overlap figures now live in the component's own doc comment, which is what fifteen authors will actually read.

Ruling — imageClassName trap: DOCUMENTED in content-image.tsx.

**My proposed mitigation for hazard 3 was WRONG and the reviewer corrected it.** I said "assign a different theme per grid". Insufficient: the pools overlap. I verified independently — all 14 pools are exactly 8 entries with no intra-pool duplicates (so the within-grid guarantee is airtight), but community<->rural share 7 of 8 photographs; mentoring<->team, entrepreneurship<->advocacy and graduation<->impact each share 4 of 8; training<->corporate, community<->advocacy, community<->youth, entrepreneurship<->impact and rural<->advocacy each share 3 of 8. Co-located grids need POOL-DISJOINT themes, verified rather than assumed.

Ruling — build no new props. The reviewer rejected all three code options and I agree: an `exclude` prop would be opt-in and would fail exactly the way plain resolveMediaSet already failed; page-level resolution would require re-opening the `resolved` omission that makes correctness structural; larger pools reduce probability without removing the failure. Instead 4b-2 carries a per-hub verification gate of the same shape as this phase's Step 3 — a throwaway script that resolves every grid on a page and asserts the union is distinct. Same structural move, one level up, no API surface.
Cost if wrong: hazard 3 is caught by a script rather than prevented by a type. If the script is skipped, repeats ship.

Ruling — closing without a whole-branch review: UPHELD, with the reasoning sharpened. The reviewer agreed but corrected why. 4a's failure was a cross-file interaction defect that task-scoped reviews each saw only half of; that surface does not exist here (one commit, one new file, zero importers), and Task 1 — which did touch shared files — got its own review that re-derived the byte-identical claim rather than accepting it. The residual risk was different in kind: this phase's product is an API, so the likeliest defect was an under-specified BRIEF, invisible to any review that checks the file against the brief. That is precisely what the sizes drift was. The transferable rule, recorded here so it is repeated rather than re-derived: **a phase whose product is an API needs one review aimed past the brief at the callers.**

Deferred to 4b-2 (all agreed can-ship): `gap` and `columns` unions are narrower than repo-wide usage (gap-4 appears 70 times, and two grid-cols-5 exist) so expect one additive widening; the duplicate-mediaKey React warning is development-only, so a production build would not surface two same-titled cards in one grid.

PHASE 4b-1 COMPLETE.
