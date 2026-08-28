# SDD ledger — plan: docs/superpowers/plans/2026-08-27-phase-4a-card-consolidation.md

Spec: docs/superpowers/specs/2026-08-26-public-page-prose-and-media-foundations-design.md (programme row 4, first half)
Branch: incircles. BASE at start: c64dbd4f1a49f3f53e84e97d1cf49db24d104cfd
Commits: local only, no push (ruling carried from phase 1).
Workspace: RETAIN at the end.

## Scope decision John made before planning

Offered three ways to handle the four card families that already render an image, I RECOMMENDED leaving them alone (smaller diff, no restyle of finished pages). John chose the most ambitious option instead: route every family through the one primitive AND port the retired components' styling into it as variants. He accepted a larger API and more work for a single card definition. Recorded to memory as a durable preference for consolidation over parallel components.

Phase 4 split into 4a (this plan: extend the primitive, migrate the two consumers, delete the duplicates) and 4b (roll media out across the 11 media-less families, hub by hub). Rationale: 4b has fifteen callers, and they should target a finished API rather than one shifting under them.

## Pre-flight conflict scan

### Cross-task rows
| Pair | Produces -> Consumes | Finding |
|---|---|---|
| T1 -> T2 | `variant`, `accentColor`, `cta` props on ProseMediaCard -> both migrated call sites | Clean. T2 does not modify prose-media-card.tsx, so no file overlap; the dependency is one-directional and T1 runs first. |
| T1/T2 vs each other on files | — | Disjoint. T1 owns components/shared/prose-media-card.tsx; T2 owns the two consumers plus the two deletions. |

### Per-task self-consistency
| Task | Files vs steps | Verdict |
|---|---|---|
| T1 | 1 modify; Steps 1-4 add the props, the shell, the pill/CTA, and preserve existing behaviour; Step 6 asserts no adoption yet | Agrees with itself. |
| T2 | 2 modify + 2 delete; Steps 1-2 migrate both consumers, Step 3 deletes, Step 4 is the reference check | Agrees with itself. |

### Assumptions verified before dispatch (all confirmed)
- `components/ui/button.tsx` supports `variant="pink"` — yes, line 11.
- `PartnershipTrackPage.slug` exists (types/content.ts:671) so the mediaKey is stable.
- `initiative-page.tsx` has `page.slug` in scope.
- `AlternatingFeatureRow`'s outer spacing is `space-y-10` — the plan's guess was right, so the replacement preserves it.
- Only ONE consumer each: SpotlightCard at partnership-track-page.tsx:90, AlternatingFeatureRow at initiative-page.tsx:156. Consolidation is therefore tractable.

### Findings and rulings

**Ruling — this phase is a PURE REFACTOR and the two pages must look unchanged.** Phases 2 and 3 deliberately changed appearance; 4a must not. Both designs are being preserved, so any visual difference on /partner-with-us/<track> or /what-we-do/<initiative> is a defect rather than a deliverable. Both dispatches and both reviews are told this explicitly, because the habit built over two phases is the opposite.
Cost if wrong: a restyle John did not ask for on two live pages.

**Ruling — the spotlight variant must route its src through safeImageSrc.** It uses next/image directly rather than ContentImage (because ContentImage imposes its own rounding and gradient placeholder), and ContentImage is where phase 3's malformed-URL guard lives. Bypassing it silently would reopen the crash class phase 3 closed.
Cost if wrong: none; the guard is a pass-through for valid URLs.

No other conflicts found.

## Task log
Task 1: implemented (commit e812275, base c64dbd4) — spotlight variant added, type-check/lint/build clean, component still imported by nobody. Two concerns raised, neither acted on because this phase is a pure refactor:
1. `variant="spotlight"` combined with `media.videoUrl` would silently render no image and no read-more link. SpotlightCard never supported video and the only consumer never passes one, so it is latent rather than live. CARRY THIS TO 4b — if any of the eleven families uses the spotlight variant with a video, it will render nothing. Referred to the reviewer for a view.
2. It added `href`-wrap support to the spotlight variant even though SpotlightCard never took a card-level href, to satisfy the cross-variant behaviour requirement. A small superset of the original design; harmless and unexercised.
Task 2: implementer dispatched (base e812275) in parallel with Task 1 review — disjoint files.
Task 1: review returned Spec ✅ (every class verified line-by-line against spotlight-card.tsx, safeImageSrc guard confirmed genuinely applied, all five pre-existing behaviours intact for both variants) but Task quality NEEDS WORK on one Important finding.

**Finding — href + cta on the spotlight variant nests anchors.** The implementer added card-level `href` wrapping to the spotlight branch, which SpotlightCard never had. `Button` renders a `next/link` `<a>`, so a caller passing BOTH `href` (wrapping the card in an outer Link) and `cta` (rendering an inner Button) produces nested `<a>` tags — invalid HTML plus a hydration mismatch. This is exactly the bug class the file already guards against for `videoUrl`, and no equivalent guard exists for href + cta.

Ruling: FIX IT, and I am overruling my own implementer's "harmless superset" framing — the reviewer is right that a dormant anchor-nesting bug is not harmless, especially with 4b about to point eleven more card families at this component. Chosen fix: mirror the file's OWN established pattern and suppress the outer link wrap whenever `cta` is set, rather than stripping href from spotlight entirely. That keeps the capability, closes the bug, and stays consistent with how videoUrl is already handled. Also collapse the two redundant `isSpotlight ? x : isDark ? y : x` ternaries the reviewer flagged, since isDark is already forced false when isSpotlight is true.
Cost if wrong: a spotlight card that wants both a whole-card link and an inner CTA gets only the CTA. That combination is invalid HTML anyway, so there is nothing to lose.

Reviewer's judgement on concern 1 (spotlight + videoUrl renders nothing): ACCEPTABLE as-is, and I agree. SpotlightCard had no video concept, no consumer passes one, and silent degradation neither corrupts output nor nests markup. Left for 4b to design explicitly if needed — already carried in this ledger.

Fix deferred until Task 2's implementer finishes, to avoid racing the git index. Task 2's consumer passes `cta` without `href`, so it cannot trigger the bug in the meantime.
Task 2: implemented (commit 440e73d, base e812275) — both consumers migrated, both retired components deleted, both pages reported rendering unchanged. The implementer verified the isReversed -> mediaPosition parity against alternating-feature-row.tsx's own source before deleting it, rather than trusting my brief.
Controller confirmed: spotlight-card.tsx and alternating-feature-row.tsx are gone, both consumers now import ProseMediaCard, and the four remaining "SpotlightCard" mentions are deliberate historical comments explaining why the variant looks as it does — exactly the in-repo documentation an earlier phase's review asked for. Left in place.

**Two agents died on API timeouts in the same round.** Task 2's reviewer failed outright with no output. The fix implementer (F1 anchor-nesting guard, F2 redundant ternaries) was killed after lint passed but before build and commit, leaving its edits uncommitted in the working tree.

Ruling: RECOVER rather than re-dispatch the fix. I inspected the uncommitted diff myself and it is exactly what was specified — `isLinked = Boolean(href) && !videoUrl && !cta` with a comment covering both anchor-emitting cases, and both ternaries collapsed. I verified the premise F2 rests on directly (`isDark = !isSpotlight && tone === "dark"` at line 116, so it is provably false for spotlight, making the collapse behaviour-preserving), then ran the full gate: type-check 0, lint 0, build 0, 145/145 pages. Committed as 9507f8c. Re-running an agent to reproduce work already done and verified would have risked churn for no gain.
Cost if wrong: a fix landed without an independent implementer's report; the diff is small, I read all of it, and the final review covers it.

Ruling: CONSOLIDATE the reviews. Rather than re-dispatching Task 2's dead reviewer AND a separate fix review AND a final review on a three-commit phase, run ONE final whole-branch review over c64dbd4..9507f8c carrying Task 2's fidelity questions. Proportionate to the phase's size, and it avoids a third timeout window.
Cost if wrong: Task 2 gets no task-scoped gate of its own; the final review is given its exact checklist instead.

## CORRECTION to the Task 2 log above

The Task 2 entry records "both pages reported rendering unchanged". That is FALSE for /what-we-do/<initiative> and I relayed it to John before it was checked. The task-scoped reviewer that would have caught it died on an API timeout and I consolidated rather than re-dispatching — that consolidation is how the error survived. The claim stands corrected here.

## Final whole-branch review — rulings

Two Critical findings. The spotlight half of the port is clean; the layout="side" half is not.

Ruling C1 (AlternatingFeatureRow's chrome was lost): FIX. Nobody asked to restyle the how-it-works rows. The row wrapper, the copy's own card, the 32px bordered mist media frame and the 1.05fr/0.95fr column ratio all disappeared into a single white panel with a 12px borderless image. This is a real regression on eight initiative pages and it is squarely my plan's fault: Task 2 Step 2 told the implementer to check spacing and alternation and never mentioned chrome. Fix by adding the escape hatch the reviewer's F3 recommends anyway — a `chrome` prop plus an optional media frame — and restoring the original treatment.
Cost if wrong: ProseMediaCard grows two props it would have needed for 4b regardless.

Ruling C2 (pool photographs now appear where neither component showed an image): ACCEPT, and surface prominently to John. Focus cards and how-it-works steps carry emoji-only content today, so both families gain stock photos. Under a strict pure-refactor contract that is a defect. But the programme's whole stated goal is "every prose block accompanied by an image or video", and 4b would add photographs to these very families within days — so removing them now behind a new opt-out, only to re-add them, is churn. Treating it as 4b arriving early on two families is the cheaper honest answer, CONDITIONAL on fixing I1 first so the photographs are not duplicated.
Cost if wrong: two page families gain photography a phase earlier than planned. Reversible by making the pool fallback opt-out and passing that flag at both call sites. John gets told explicitly so he can reverse it.

Ruling I1 (sibling cards repeat photographs on 7 of 13 pages): FIX NOW. resolveMediaSet has ZERO call sites in the entire repo — 4a built two new grids and neither used it, so ngo-foundations shows the same photo three times in a four-card grid. This is exactly the defect the function exists to prevent, and it is two lines per consumer. It is also the precondition for accepting C2.
Cost if wrong: none.

Ruling I2 (my own cta suppression over-fires on the panel variant): FIX NOW. I ruled the suppression should cover cta, and it does — but cta only renders under isSpotlight, so on the panel variant href is now swallowed while no CTA is emitted either. The comment I approved claims "This holds for both variants", which is the false part. Narrow it to `!(isSpotlight && cta)`.
Cost if wrong: none; no live caller passes href today.

Deferred to the front of 4b's plan, per the reviewer's F1: build a ProseMediaCardGrid that calls resolveMediaSet once and owns the grid classes, so correctness is structural rather than remembered at eleven call sites. Also deferred: F2 (icon-art families need an aspectRatio passthrough and object-contain mode), F4 (split the props into a discriminated union on variant), M2 (cn is plain clsx, not tailwind-merge, so className cannot override shell classes).
Ledger correction per M1: spotlight + videoUrl does NOT render "no image and no read-more link" as I recorded earlier. The thumbnail renders as a plain static image and read-more does render; what is actually lost is the VideoCard play affordance, making the video unreachable. Worse than I recorded.
Critical fix wave applied — a THIRD agent died mid-response (after 62 tool calls, while composing its report), but all three fixes were already committed: 657ed9c (F3 narrowed guard), fda979b (F1 chrome restored), 542fbe2 (F2 resolveMediaSet wired). Working tree clean; only the report file was lost.

Controller verification in the absent report's place:
- Ordering (the risk in F2): keys are derived from the SAME filtered arrays that are then mapped for render (`focusCards`, `howItWorks`), and consumed as `resolved={...Media[index]}`, so photographs cannot attach to the wrong cards. Both call sites keep mediaKey/theme as the fallback.
- Duplicate elimination PROVEN by running the real content through both functions: before, educational 3/4 unique, government 3/4, ngo-foundations 2/4, technology 3/4 (only international-development was clean); after, all five tracks 4/4 unique. This matches the reviewer's independently computed finding exactly, including ngo-foundations being the worst.
- Chrome restoration: every distinctive class from the deleted component — bg-brand-mist, lg:grid-cols-[1.05fr_0.95fr], min-h-[18rem], rounded-[30px], rounded-[32px] — is present again in prose-media-card, and initiative-page passes chrome="bare" and mediaFrame.
- Gate: type-check 0, lint 0.
Scoped re-review of the critical fix wave: F1, F2, F3 all ADDRESSED. Reviewer confirmed the copy wrapper and media frame are byte-for-byte matches to the deleted component, the column bias is restored, ordering in F2 is correct BY CONSTRUCTION (same filtered array, same map, same index) rather than coincidentally, the spotlight block appears only as unmodified diff context, and the new mediaFrame image path is safeImageSrc-guarded so no unguarded next/image was introduced. Gate: type-check 0, lint 0, build 0, 145/145 pages.

Ruling — residual `sizes` mismatch: PARK, deferred to 4b. The framed image uses the computed `(min-width: 1024px) 50vw, 100vw` where the deleted component hard-coded `(max-width: 1023px) 100vw, 45vw` for that box, so the new rows request marginally larger images at lg. It is invisible, affects only srcset selection, and the `sizes` escape hatch already exists if we want it exact. Not worth a fourth dispatch after three consecutive agent deaths, and 4b is already slated to rework sizes and aspect ratios across the rollout.
Cost if wrong: a slightly larger image fetched at one breakpoint on eight initiative pages.

PHASE 4a COMPLETE. Branch c64dbd4..542fbe2, 6 commits. Gate green.
Workspace RETAINED.

Note for whoever reads this: phase 1's workspace (.superpowers/sdd/2026-08-26-prose-and-media-foundations/) was deleted at the end of that phase, before I started retaining them. Its task reports are gone; only its ledger survives, at docs/superpowers/2026-08-26-foundations-execution-ledger.md.
