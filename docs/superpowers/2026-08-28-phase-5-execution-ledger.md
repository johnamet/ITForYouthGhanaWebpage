# SDD ledger — plan: docs/superpowers/plans/2026-08-28-phase-5-card-slots-and-guards.md

Branch: incircles (tracks origin/incircles). Commits local. Workspace: RETAIN.

## John's three decisions that scope this phase

- NOT merging to main. The work stays on incircles.
- The media gate stays advisory — "let themes fail silently". Do NOT wire verify:media-pages into prebuild, a hook, or CI. Recorded to memory as a standing preference alongside his earlier refusal of a test runner: verification is something run deliberately, never something that blocks a build.
- Do the package cards and the image guards. Photography is explicitly parked.

## Pre-flight conflict scan

| Pair | Finding |
|---|---|
| T1 -> T2 | No interface dependency. T1 grows ProseMediaCard's props; T2 touches next/image call sites. |
| T1 vs T2 files | Near-disjoint. T1 owns prose-media-card.tsx and organisation-service-page.tsx; T2 owns ~20 files calling next/image directly. prose-media-card.tsx already routes through safeImageSrc, so T2 has no reason to touch it. |

Ruling: run sequentially anyway. Both tasks commit, and a stray overlap on prose-media-card.tsx would race the index for no benefit. A review may overlap an implementer; two implementers may not.

Per-task self-consistency: T1 lists 2 files and its steps touch exactly those. T2's file list is discovered in its own Step 1 rather than fixed in advance, which is deliberate — I gave the RULE (guard CMS-fed, skip static) instead of an enumeration, because the last time I handed an implementer an explicit list the list silently became the scope and pages were left unchecked.

### Finding and ruling

**The badge/aside/footnote slots are API growth on a shared primitive for one caller's benefit.** Worth naming, because the alternative was to leave the package cards flattened.
Ruling: add them. John has already chosen consolidation over parallel components once in this programme — he had me port a retired component's styling into this primitive as variants rather than keep both. Growing it again for a genuine expressive gap is consistent with that, and all three slots are generic enough that reportResources' badge and several other families could use them later. They are strictly optional, so every existing caller is untouched.
Cost if wrong: three unused optional props on a component with fourteen call sites.

**Do NOT default the badge label to "Pricing".** The slot is generic; only the package card knows the word. A default would leak one caller's vocabulary into the primitive.

## Task log
Task 1: implemented (commit eb063e8) — badge/aside/footnote added, package cards restored. All four routes 200; type-check/lint/build/verify:media-pages clean.
Controller verified directly: every class from the retired markup is present again (rounded-[20px] bg-brand-navy, tracking-[0.16em] text-brand-gold, font-heading text-2xl font-bold, border-l-2 border-brand-gold pl-5, text-slate-500); all three slots are gated on BOTH presence and !isSpotlight, so the frozen spotlight variant cannot pick them up; the label is never defaulted; and the package mapping now passes description alone as body with price, features and note in their own slots.
Dark-tone choices: aside text-white/78 matching the description's dark treatment, footnote text-white/60 to keep it dimmer. Badge left unconditional since it was never slate-on-navy.
Task 2 dispatched (image guards) in parallel with Task 1's review only.
Task 1: review returned Spec ✅ / Approved. Reviewer confirmed the restored classes are byte-identical to the retired markup, the badge label is never defaulted, badge-less cards keep byte-identical markup (titleElement hoisted and rendered alone when no badge), and the spotlight variant is gated out with a comment. Two latent Minors, neither live: a whitespace-only note no longer renders an empty line (a strict improvement), and a badge on a dark-tone card would merge into the navy shell — no caller combines them.
Its view on the generality question: aside and footnote are pitched right; badge is the one leaning toward "one family's layout wearing a generic name", but given John's established preference for growing one primitive it would not block, and renaming later is cheap.
Task 1: complete (commit eb063e8, review clean)

Task 2: implemented (commit 2da297c) — guard coverage went from 5 sites to 38, zero unguarded.
**Bonus find, a real pre-existing bug:** course-detail-card.tsx and training-course-catalog.tsx carried a hand-rolled hostname allowlist of 8 hosts against next.config.mjs's 9, missing `files.itforyouthghana.org` — the org's OWN file server. Any course image uploaded to CMS storage was silently swapped for a placeholder. Consolidating on safeImageSrc fixed it as a side effect, and the reviewer confirmed nothing the old function did was lost while two of its behaviours got stricter in the right direction.

Task 2: review returned Spec ✅ / Approved, 5 Minors, no Critical or Important. It checked the suspicious "zero static" classification I asked about and found it honest — there is not a single hardcoded literal `src` in any non-admin component, so there was genuinely nothing to skip. It also confirmed the allowlist matches next.config.mjs exactly in both directions and that url.href preserves query strings, so the pool's Unsplash URLs survive.

Its answer on the judgement call was the valuable part: silent degradation is right for visitors and gets BETTER at scale (blast radius shrinks from "page down" to "one image absent"), but nobody ever learns the value is broken — and console.warn is weaker than it looks, because nine of the touched files are "use client", so half those warnings land in a visitor's browser console.

Final fix wave (commits b39262d, 4a23e16) — F1 restored the absent-vs-empty distinction on who-we-are so an emptied CMS field renders no hero rather than substituting one; F2 finished the pattern across the other five hero call sites so the same input no longer behaves two ways; F3 removed all six double-calls and their non-null assertions, which were both double-warning and the only place undefined could later reach next/image; F4 collapsed a duplicated one-liner; F5 gave verify-media-pages an opt-in rejection sink so a human can see rejected values on demand.
Controller verified: zero non-null assertions remain on a safeImageSrc result; the sink is off by default with a comment explaining it stays inert in every request path; the gate still exits 0 at 35/35 and now also reports rejections; type-check, lint and build clean.
Ruling on F5's shape: reporting, never enforcement. The sink does not touch the exit code and nothing was wired into prebuild, a hook or CI — John's standing preference is that verification is a command he runs deliberately.

PHASE 5 COMPLETE.
Corroboration worth noting: the fix implementer independently found the malformed CMS value still live on /who-we-are/team (PETER_PROFILE.png). That is the record I flagged to John earlier — the guard keeps the page at 200, but the data still needs fixing in the CMS.
