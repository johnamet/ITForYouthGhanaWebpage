# SDD ledger — plan: docs/superpowers/plans/2026-08-27-phase-3-de-iconing.md

Spec: docs/superpowers/specs/2026-08-26-public-page-prose-and-media-foundations-design.md (programme row 3)
Branch: incircles. BASE at start: 5497fdce0704a5749a3541c8a5567777c318fba2
Commits: local only on incircles, no push (ruling carried from phase 1).
Workspace: RETAIN at the end — John went looking for a phase-1 report after I deleted that workspace.

## Scope decisions John made before planning

- Depth: PRESENTATION ONLY. types/content.ts, lib/utils/validators.ts and components/admin are all out of scope. Accepted cost: authors keep seeing icon inputs and a required step-number that render nothing.
- iconImage: KEEP. It is authored artwork, not emoji decoration. Only the emoji tier and the emoji-derived SVG tier go.

## Pre-flight conflict scan

### Cross-task rows
No cross-task file overlaps at all — verified programmatically. Task 1 owns the 12 emoji-rendering files, Task 2 owns 4 home/layout files, Task 3 owns 7 news/programs/training/shared files, Task 4 owns 3 contact/who-we-are files. Every file has exactly one owner, so tasks 2-4 may run in any order after Task 1.

### Deletion safety (the one genuinely risky step)
Task 1 deletes lib/utils/icon-map.ts and public/images/icons/. Verified before planning:
- No file under components/admin or app/(admin) imports emojiToIconImage or icon-map. Deletion cannot break the admin surface.
- Nothing outside icon-map.ts itself references /images/icons, so the 23 SVGs are unreachable once the bridge goes.

### Per-task self-consistency
| Task | Files vs steps | Verdict |
|---|---|---|
| T1 | 12 modify + 2 delete; Steps 1-3 cover all 12 by shape (3 resolution chains, 5 icon blocks, 5 bare emoji renders + stepIcons); Step 4 does the deletions | Agrees with itself. |
| T2 | 4 files, each with a named keep/remove split; Step 2 asserts the exact expected import lines | Agrees with itself. |
| T3 | 7 files, same shape; Step 2 asserts exact expected import lines | Agrees with itself. |
| T4 | 3 files; Step 5 carries the whole-site decorative and keep-list greps | Agrees with itself. |

### Findings and rulings

**Ruling — link arrows stay.** ArrowRight and ArrowUpRight are retained across 13 files. John's rule was "the hearts, emojis and others that are just decorative not the ones with purpose"; a directional arrow on a link or CTA is a conventional affordance cue on an interactive element, not ornament. Recorded as a controller ruling because it is the one genuine judgement call in the classification, and the plan tells implementers to flag disagreement rather than act unilaterally.
Cost if wrong: 13 files need a second small pass to strip arrows.

**Ruling — icons beside a text label are decorative, even on functional controls.** Mail and Linkedin in team-directory sit beside the visible words "Email" and "LinkedIn"; Heart in floating-elements sits beside the donate button's own label; Send sits on a labelled submit button. All verified by reading the markup. They are ornament and go. By contrast Loader2, AlertCircle and CheckCircle2 in contact-form convey state that no text carries, and X, the chevrons, Play, Search, ArrowUp and ArrowDown are the sole affordance on their controls — those stay.
Cost if wrong: a handful of labelled controls look plainer than John expected; each is a one-line restore.

**Note — phase 3 resolves an interim oddity phase 2 created.** /contact currently shows response-step cards without medallions next to a privacy card that still has one, because phase 2 removed the numerals but ShieldCheck was out of its scope. Task 4 Step 2 closes that.

No other conflicts found.

## Task log
Task 1: implemented (commit 0f9b0ec, base 5497fdc) — 12 files, icon-map.ts and all 23 SVGs deleted. Controller verified: bridge and assets gone, repo-wide grep for emojiToIconImage/icon-map/images/icons returns nothing, zero emoji left in any public component, `iconImage` still rendered in alternating-feature-row, impact-counter, departments-index-page and elsewhere. Review dispatched.

Task 1 raised four concerns:
1. A SECOND, unlisted `emojiToIconImage` call site existed in initiative-page.tsx's impactStats block. The implementer fixed it the same way as its siblings — correct, and the build would have broken on the deletion otherwise. My plan's inventory of call sites was incomplete; this is the third phase in a row where a completeness grep caught something my survey missed.
2. programme-showcase.tsx's floating icon badge sat in `mt-[12.7rem]` with content at `mt-5`; removing it, the implementer set content to `mt-[17.45rem]` (12.7 + 3.5 for h-14 + 1.25 for mt-5) to preserve the content's vertical position. Arithmetic verified correct, and the file already used arbitrary offsets. Accepted, but referred to the reviewer as a DESIGN question: the card may now show a band of dead image space where the badge sat.
3. No seed content populates any `iconImage`, so the authored-artwork path is verified by code and type-check only, never visually. The reviewer was told its read is therefore the only real gate on that invariant.
4. My brief's Step 2 header said "Four files" while naming five. Harmless wording slip in my plan.

Task 2: implementer dispatched (base 0f9b0ec) in parallel with Task 1 review — no file overlap.
Task 1: review returned Spec ✅ / Approved. Reviewer confirmed the critical invariant file by file — `iconImage` survives in all 8 files where it was part of a resolution chain — and established that the 4 bare-emoji files (programme-showcase, impact-reports, impact-overview, impact-sdgs) never read `iconImage` in the first place, so nothing was lost there. `number:` intact, `icon: ""` used correctly for the required field, the unlisted initiative-page call site correctly handled, AlternatingFeatureRow's only consumer confirmed before removing its `icon` field.

**Ruling — programme-showcase offset: RE-TUNE. The reviewer is right and I was wrong to accept it.**
I accepted `mt-[17.45rem]` because the arithmetic preserved the title's position. The reviewer's point is that position was the wrong invariant to preserve: the badge straddled the image/content seam, so with it gone the gap between photo and title grows from an effective ~1.25rem to ~2.17rem — a visible band of dead card face where an element used to be. Preserving geometry sized around a deleted element is not a clean edit.
Fix: set the offset to `mt-[16.53rem]`, which is the image area's own height (57% of min-h-[29rem]). That places the title exactly 1.25rem below the image edge — one card-padding unit, matching the card's own spacing rhythm — and is derived rather than arbitrary. Document the derivation in a comment.
Cost if wrong: the title sits a little tighter under the photo than John wants; one number to adjust, and it is now a documented derivation rather than a magic number.

**Ruling — 173 dead emoji fields in seed content: LEAVE THEM.**
Task 1's reviewer flagged `site-config.ts`'s `icon: "👩‍💻"` as dead surface. Auditing the whole of `lib/content`, there are 173 such emoji `icon:` fields across five config files, all now unread by public pages. They stay, for three reasons: `types/content.ts` still declares `icon` (required in eight places), so stripping the required ones would fail type-check; the admin forms still edit these fields; and John explicitly chose presentation-only with the dead-field cost accepted. Removing them belongs to the deeper cleanup he deliberately deferred.
Cost if wrong: 173 dead values sit in seed data; harmless, and the deep clean remains available as a separate pass.

Fix for the offset batched with any Task 2 findings to avoid racing the git index.
Task 2: implemented (commit ebed6d3, base 0f9b0ec) — 4 files, type-check/lint/build clean, browser check confirmed the donate button and scroll-to-top still work. Two concerns, both fine: join-cta-block has no active cards in this environment so its cards could not be seen (pre-existing data condition, filter logic untouched), and the implementer also dropped the now-pointless `gap-2` from the donate button since nothing remains to separate — a sensible judgement call inside the collapse-stranded-wrappers instruction.
Ruling: the programme-showcase offset re-tune is DEFERRED to phase 3's final fix wave rather than dispatched now. It is a small design tune and folding it into the final wave keeps Task 3's review surface clean, rather than mixing a spacing change into an icon-removal diff.
Task 3: implementer dispatched (base ebed6d3) in parallel with Task 2 review — no file overlap.
Task 2: review returned Spec ✅ / Approved with NO findings at any severity. Reviewer verified against current file contents rather than the diff alone: exactly four files changed, all keep-list icons still present AND still used (ArrowRight on both CTAs, ArrowUp on scroll-to-top, X on the popup close), no residual iconMap/Icon references, and the two `flex items-center gap-3` wrappers in donation-campaign correctly collapsed with their stat values preserved. It judged the `gap-2` removal correct and noted `inline-flex items-center` was rightly retained since it still controls the pill's vertical centring.
Note: `JoinCtaCard.icon` turns out to be a LOCAL type in join-cta-block.tsx (values "students" | "organisations" | "volunteer"), not a field in types/content.ts. Left in place per presentation-only; it is now dead but local and harmless.
Task 2: complete (commits 0f9b0ec..ebed6d3, review clean, 0 findings)
Task 3: implemented (commit 442e899, base ebed6d3) — 7 files, 33 insertions / 92 deletions, type-check/lint/build clean, import lines match the expected set exactly. Two concerns, both environmental: no article seed data so the two news components were verified by code and build rather than by eye, and /who-we-are/team returned HTTP 500.

**Finding — /who-we-are/team returns HTTP 500, and the cause is a robustness gap, not our change.**
A team member's CMS `photo` holds a malformed URL (`https:/files/...`, single slash). `lib/utils/validators.ts:134` types `photo` as `optionalTrimmedString` with no URL validation, so the bad value passes, reaches `next/image` at `components/shared/team-directory.tsx:81-82`, and next/image throws on an invalid src — taking the entire route down with a 500. The existing `member.photo || "/images/logo/logo_small.jpg"` fallback only catches empty, not malformed.

Ruling: FIX IT, in the final fix wave, as a presentation-layer guard. A single bad CMS field should never 500 a public page, and this is a live public page. The guard belongs in the component rather than the validators: John scoped validators out, and changing them would not repair the data already stored. Deferred to the final wave rather than dispatched now so it does not muddy Task 3's review surface.
Cost if wrong: a malformed photo silently shows the logo placeholder instead of erroring loudly. That is the correct trade for a public page.

Worth noting the class is wider than one field: `ContentImage` guards `src?.trim()` but not URL validity, so the same failure is reachable anywhere a CMS-supplied URL reaches next/image. The final wave should consider a shared helper rather than a one-site patch.

Task 4: implementer dispatched (base 442e899) in parallel with Task 3 review — no file overlap.
Task 3: review returned Spec ✅ / Approved. Reviewer verified against live files: all five course-detail-card removals hit the correct seven <dt> rows with every <dd> value intact (duration, dates, level, language, provider, enrollment) — the task's highest-risk area came through clean. PlayCircle's `gap-2` correctly kept since it still pairs with its label; Search's `aria-hidden` correctly still on the surviving icon; "Email" and "LinkedIn" labels intact.
Task 3: minor (deferred to final wave): news-article-page.tsx:117 — the <h2> still carries `mt-5`, which existed to clear the deleted Mail badge. The heading is now the container's first child, so it adds ~20px of unintended gap inside the card's p-6, inconsistent with the sibling Author and Tags cards. Reviewer confirmed the equivalent badge removal in news-hub-page.tsx is fine because that container uses space-y-3.
Task 3: complete (commits ebed6d3..442e899, review clean, 1 deferred minor)

Final fix wave queue for phase 3:
1. programme-showcase.tsx — re-tune offset to mt-[16.53rem] with the derivation documented.
2. Malformed-image-URL guard so a bad CMS photo cannot 500 a route (/who-we-are/team today). Consider a shared helper rather than a one-site patch, since ContentImage has the same gap.
3. news-article-page.tsx:117 — drop the orphaned mt-5.
Task 4: review returned Spec ✅ / Approved. Only `Send` removed from contact-form; AlertCircle, CheckCircle2 and Loader2 all survive and remain wired to their states with `aria-live="polite"` intact — no accessibility regression. operatingIcons array, lookup and render all gone; the leftover wrapper deleted; map signature tidied. Reviewer also independently confirmed the review-package diff is byte-for-byte consistent with the real commit.
Task 4: complete (commits 442e899..70a151d, review clean)

Final fix wave (3 commits): ba2687a safeImageSrc helper wired into team-directory and content-image; 69f9b8f offset re-tuned to mt-[16.53rem] with the derivation documented; b12b2f1 orphaned mt-5 dropped from news-article-page.
**/who-we-are/team verified 500 -> 200** against live Firestore data with the actual malformed record (team member "Peter Duodu"), now showing the logo placeholder. Valid CMS images confirmed still rendering on /what-we-do, /who-we-are, /our-impact and the homepage, so the guard does not over-reject.
Note: the fix implementer verified F2/F3 via temporary uncommitted routes because live data has an empty programmeShowcase and no published articles, then deleted them — controller confirmed a clean tree afterwards.

Margin tidy (commit 07dd71a): 5 orphaned first-child margins dropped under a precise rule (first child AND parent already padded) — who-we-are x2, join-cta-block, contact-page, plus spotlight-card which had the same pattern independently of this phase. 7 candidates deliberately left as judgement calls, all documented; programme-showcase's mt-[16.53rem] correctly identified as deliberate rather than a leftover.

Controller verification of the whole phase, using a CORRECTED grep (my plan's Step 5 grep was faulty — it used `-h`, which suppresses filenames, so its `grep -v components/admin` filter could never match; Task 4's implementer caught this):
- Zero decorative icon names remain in any public component's lucide-react import.
- The whole keep-list survives: AlertCircle, ArrowDown, ArrowRight, ArrowUp, ChevronDown, ChevronLeft, Loader2, PlayCircle, Search.
- Zero emoji in any public component; icon-map.ts and all 23 SVGs deleted.
Final whole-branch review dispatched.

## Final whole-branch review — rulings

No Critical findings. Merge recommended after four small fixes. Five rulings:

Ruling FR1 (departments medallion is an empty coloured swatch): FIX NOW. Task 1 tightened the conditional to `iconImage ? <Image/> : null` but left the styled h-12 w-12 rounded-2xl shadow wrapper rendering unconditionally — and `iconImage` is populated NOWHERE in seed data, so every /departments card now shows a solid 48x48 swatch containing nothing. Previously the medallion always had content. This is a genuine "removed the glyph, kept the frame" defect and my plan's Step 2 wording caused it by describing the reduction without saying to move the wrapper.
Cost if wrong: none; the fix only hides an empty frame.

Ruling FR2 (author avatar is a blank navy disc): FIX NOW. `UserRound` in news-article-page was NOT an icon beside a label — it was the entire content of the no-photo avatar placeholder. My classification treated it as decoration and it was information. Render initials instead, which suits the prose-over-glyph direction and says more than the glyph did.
Cost if wrong: initials where John wanted an empty disc; trivial to revert.

Ruling FR3 (safeImageSrc is built on a wrong diagnosis): FIX NOW. I diagnosed the crash as a URL parse failure. It is not: `new URL("https:/files/x.jpg")` parses fine (host normalises to `files`), and the actual throw is next/image's `hostname "files" is not configured under images in next.config.js`. My dotted-hostname heuristic caught that one record only by luck. Two real holes follow: a protocol-relative `//host/x.jpg` passes the rooted-path fast path and still throws, and any dotted host absent from remotePatterns (a pasted Drive or CDN link) reproduces the original crash exactly. Fix: reject `//`, return `url.href` rather than the raw value, and validate the host against next.config.mjs's remotePatterns list.
Cost if wrong: a legitimate host missing from the allowlist degrades to a placeholder instead of rendering — which is the same failure the allowlist already imposes at the next/image layer, so no new risk.

Ruling FR4 (silent degradation): FIX NOW, minimally. Add one server-side console.warn when a non-empty src is rejected. Without it a malformed record is invisible forever — the org logo is indistinguishable from "no photo", and the only reason we know about the bad record is that it crashed dev before the guard existed.
Cost if wrong: one log line per bad record per render; acceptable and easily removed.

Ruling FR5 (my programme-showcase derivation comment is false): FIX NOW, before phase 4. I documented 16.53rem as "57% of min-h-[29rem]", but `h-[57%]` resolves against the container's ACTUAL height and min-h never binds once there is content, so the card is ~30.3-32rem and the real gap is ~0.5rem — with a two-line title the heading starts above the image seam. My comment is actively misleading and sits exactly where phase 4 puts photographs. Fix: change the image area to `h-[16.53rem]` so the two numbers are provably coupled and the comment becomes true.
Cost if wrong: the card's image area is fixed rather than proportional; that is the point.

Ruling FR6 (accepted dead surface is undocumented IN THE REPO): FIX NOW via comments. Confirmed the reviewer's sharpest point: `.superpowers/sdd/` is gitignored and `docs/` is entirely untracked, so EVERY ruling I have made across three phases lives outside version control. Three one-line comments mark the deliberately-dead `icon` fields so the next person is not left guessing. Also surface to John that his specs, plans and ledgers are not committed.

Deferred (reviewer agreed can-ship): 173 dead emoji seed fields; the 7 left-alone margins (noting 4 are orphaned in practice today since iconImage is unpopulated, but phase 4 replaces that markup); safeImageSrc at the other ~43 direct next/image sites, EditorialImageHero first; 5 redundant single-child wrappers; 3 impact-page badges that silently moved right-aligned to left-aligned; the unfixed Firestore record.
Final review fix wave applied (commit 4a8e82c) — all six fixes F1-F6. Routes: / 200, /departments 200, /who-we-are/team 200 (no regression).
Controller behaviourally tested the rewritten safeImageSrc across 12 inputs. All correct: empty/whitespace/undefined -> undefined silently; rooted path passes; `//host` rejected; unconfigured host `files` rejected; unconfigured `drive.google.com` rejected; valid Unsplash with query string passes; Firebase Storage URL with ?alt=media&token passes; `javascript:` and `data:` URIs rejected. Two bonuses beyond spec: the single-slash typo on a CONFIGURED host (`https:/files.itforyouthghana.org/x.jpg`) is now NORMALISED AND REPAIRED to a working URL rather than merely rejected, and the protocol/allowlist checks incidentally block javascript: and data: srcs.
Scoped re-review dispatched.
Scoped re-review of the fix wave: all six findings F1-F6 ADDRESSED. Allowlist compared host-by-host against next.config.mjs — all 9 match in both directions. F2's initials helper traced through empty, whitespace-only, undefined and null names: none can throw. F5 judged safe on mobile, and the reviewer observed the old `h-[57%]` was likely already inert (a percentage height against a container with only min-height resolves to auto), making the fixed rem a genuine correctness fix rather than a new hazard.

Residual adjudicated and CLOSED rather than parked: the guard accepted `http:` for allowlisted hosts while all nine remotePatterns require https, so `http://files.itforyouthghana.org/x.jpg` would pass the guard and still fail at render — the exact class the guard exists to prevent. Ruling: fix it, as a one-condition change, despite the no-second-fix-wave rule. The finding is inside the guard itself, the fix is a single comparison, and leaving a known hole in a safety check is worse than the process exception. Commit 4dbd14c. Verified across 8 inputs: http rejected, https passes, single-slash typo on a configured host still normalised and repaired, protocol-relative rejected, unconfigured host rejected, rooted paths pass, empty input silent.
Note from the fixer: `npm run build` leaves a production .next that breaks `next dev` with an unrelated MODULE_NOT_FOUND on @opentelemetry; `rm -rf .next` clears it. Worth knowing for future verification runs.

PHASE 3 COMPLETE. Gate: type-check 0, lint clean, build 0.
Workspace RETAINED.

Gate correction: an earlier run of mine reported build=1. That was two things stacked, neither a code defect. First, a stale `.next` left behind by the previous agent's dev server produced `PageNotFoundError: Cannot find module for page: /_document` — the classic dirty-.next symptom, cleared by `rm -rf .next`. Second, my own measurement was unreliable: I captured `$?` after piping to `tail`, so I was reading tail's exit code rather than the build's. Measured properly on a clean tree:
  type-check=0, lint=0, build=0, 145/145 static pages generated.
