# CMS live-preview workspaces — execution ledger

Two plans, executed back to back on branch `incircles`:

1. `docs/superpowers/plans/2026-09-08-homepage-cms-live-preview.md` — the
   homepage CMS workspace (35 commits, `35aa11c..f529bd2`).
2. `docs/superpowers/plans/2026-09-09-site-page-workspace.md` — the same
   pattern for Who We Are and What We Do custom pages, sharing an extracted kit
   (31 commits, `f529bd2..fee2648`).

This file is the durable record of every decision taken on the repository
owner's behalf during execution, and every finding deliberately deferred. It
exists because those decisions were made without a human in the loop: the
scratch workspaces that held them are deleted, and git history alone does not
explain *why* a thing was chosen.

Both plans' specs and plans were amended repeatedly during execution, because
almost every dangerous defect found was in the plan text rather than in
implementer work. Where that happened the amendment is recorded here and in the
commit that made it.

## Verification status at `fee2648`

- `npm run type-check` — 0 errors
- `npm run lint` — no warnings or errors
- `npm run build` — compiles
- `npm run verify:cms` — all invariants hold (118 admin links against 45 routes)

**Never run:** `npm run shoot:workspace`, for either workspace. It needs an
`itfy-admin-session` cookie, and for the site-page routes it also needs real
Firestore records, because those getters return `[]` with no seed fallback. No
browser verification of either feature has been performed. This is the largest
outstanding gap in both plans.

The only change to a public renderer across both plans is a 9-line additive
export block in `components/home/legacy-homepage-sections.tsx`.

---

# Plan 1 — homepage CMS live preview

# SDD ledger — plan: docs/superpowers/plans/2026-09-08-homepage-cms-live-preview.md

Spec: docs/superpowers/specs/2026-09-08-homepage-cms-live-preview-design.md (read)
Branch: incircles @ f53dd6f (base for the whole plan)

Ruling: work in place on branch `incircles` rather than a new git worktree.
  Why: `incircles` is already a feature branch, not main; the user's IDE and
  dev server are pointed at this directory, and eight of the eleven tasks
  require browser verification against `npm run dev`. A worktree would need
  its own `npm install` for no isolation benefit over the existing branch.
  Cost if wrong: the working tree carries plan work the user may not want
  interleaved with Codex's untracked .superdesign output; recoverable by
  branching, since every task commits separately.

## Pre-flight conflict scan

Pairs sharing a file or an interface:

| Tasks | Produced -> consumed | Finding |
|---|---|---|
| T1 -> T3 | HomepageDraftValues, HomepageSectionKey, findWorkspaceSection -> provider | clean |
| T1 -> T5 | workspaceSections, the two types -> rail | clean |
| T1 -> T7 | workspaceSectionsById labels, HomepageDraftValues -> messages + canvas | clean |
| T1 <-> T10 | registry ids must equal homepageSectionConfigs ids | clean; T1 adds `overview` with the same id T10 reads |
| T2 -> T5 | brand-alt token -> section-editor `bg-brand-alt` | clean; T2 precedes T5 |
| T2 -> T9 | brand-alt token -> boundary `bg-brand-alt` | clean |
| T3 -> T5 | useWorkspace -> rail, bar, editor | clean |
| T3 -> T8 | payloadVersion, values, selectSection -> pane | clean |
| T4 -> T5 | value/onChange form signatures -> section-editor | clean |
| T4 -> T6 | deliberately broken type-check -> resolved by the page rewrite | clean; intentional and stated in both tasks |
| T5 -> T6 | SectionRail, WorkspaceBar, SectionEditor -> workspace-layout | clean |
| T6 <-> T8 | page.tsx modified by both; WorkspaceLayout.preview is optional | clean; T6 compiles without the pane |
| T7 -> T8 | PREVIEW_ROUTE, CanvasToParentMessage, isTrustedPreviewEvent -> pane | clean |
| T7 <-> T9 | preview-canvas.tsx modified by both, sequentially | clean; T9 states it adds to existing state |
| T8 <-> T11 | viewport aria-labels, iframe title, frame URL substring | clean; verified byte-identical, not assumed |

Per-task self-consistency: every task's imports are used by its own code, and
every file a task later touches is a file some task creates. Two exceptions,
both in T1, ruled on below.

Ruling: remove `HOMEPAGE_SECTION_KEYS` from Task 1.
  Why: the scan shows two occurrences in the whole plan - its declaration and
  its mention in T1's Interfaces block. Nothing consumes it. The review rubric
  treats an unused export as a YAGNI defect, so shipping it means a reviewer
  finding on Task 1 for something my own plan mandated.
  Cost if wrong: a later task that needs to iterate all seven keys re-adds one
  line.

Ruling: make `findWorkspaceSection` use `DEFAULT_WORKSPACE_SECTION_ID`.
  Why: as written the constant is exported but dead - `findWorkspaceSection`
  falls back to `SECTIONS.overview` directly, so the named default and the
  actual default are two separate facts that can drift. Using the constant
  makes it load-bearing rather than decorative.
  Cost if wrong: none identified; behaviour is identical either way.

Ruling: keep `BLEED_ADMIN_ROUTES` exported although only its own file reads it.
  Why: it is the documented extension point for the full-bleed variant and T2's
  Interfaces block advertises it, so a reader adding a second full-height admin
  page finds it. An unexported const would be marginally tighter but hides the
  seam the spec calls for.
  Cost if wrong: a reviewer flags an unused export on T2; answer is this line.

Deferred minor (T7, noted pre-flight): a section whose value carries
`active === false` renders null, so its preview wrapper has zero height and its
click-to-select overlay cannot be hit. The rail still reaches it. Not worth
special-casing unless it bites in browser verification.

## Execution

Task 1: complete (commits 6e73366..8c294af, review clean)

Ruling: defer every admin browser-verification step to one consolidated pass at
  the end of the plan, and have per-task implementers verify mechanically
  (type-check, lint, build, verify:cms, plus targeted source assertions).
  Why: middleware.ts matches `/admin/:path*` and requires the
  `itfy-admin-session` cookie, so no subagent can load any admin route. Task 11
  already acknowledges this by taking the cookie from ITFY_ADMIN_SESSION. Asking
  the user for a cookie mid-run would stall the plan for something that can be
  done once, at the end, against the whole feature.
  Affects the browser-check steps in tasks 2, 6, 7, 8, 9 and 10.
  Cost if wrong: a defect visible only in a browser survives to the end of the
  run and costs a late fix round instead of an in-task one. Mitigated because
  the deferred pass happens before the final whole-branch review, not after.
Task 2: complete (commits 8c294af..459fe06, review clean)
Task 2: minor (deferred): admin-shell.tsx:242-247 non-bleed className utility
  order changed. Harmless because `cn` is plain clsx, but would matter if `cn`
  were ever swapped for a tailwind-merge implementation.
Task 3: review found 1 Critical + 2 Important, all plan-mandated (my plan's own
  code block). Rulings below; the plan is patched to match so a re-run cannot
  reintroduce them.

Ruling: FIX the save-in-flight race (Critical). Accepted the finding.
  Why: `save(key)` closes over the draft value read at call time and then
  deletes that key from `drafts` unconditionally on success. Edit the same
  section while the request is in flight and the newer edit is discarded and
  the rail reports the section clean — silent data loss in the one module every
  later task depends on. This contradicts the spec's own guarantee that a save
  cannot discard unsaved work; the reviewer correctly noted the code's comment
  defends the cross-section case while leaving the same-section case open.
  Fix: a latest-drafts ref to detect supersession, clear the draft only when it
  still holds exactly what was sent, and a per-key in-flight set so a repeated
  save of one key cannot overlap.
  Cost if wrong: added complexity in save() for a race that needs fast typing
  during a slow request; the alternative cost is losing an editor's work.

Ruling: FIX the modifier-click gap (Important). Accepted.
  Why: Ctrl/Cmd/Shift-click opens a link in a new tab and leaves the current
  tab's drafts untouched, so prompting is wrong, and cancelling also blocks the
  browser's native new-tab behaviour the guard has no business blocking.
  Cost if wrong: none identified.

Ruling: FIX the bare href prefix match (Important). Accepted despite being
  speculative — no `/admin/content/homepage-archive` route exists today.
  Why: the precise form costs one line, and a future sibling route would be
  silently exempted from the unsaved-changes guard, which is a trap that is
  invisible at the point where someone would add that route.
  Cost if wrong: marginally longer condition for a case that never arrives.

Task 3: minor (deferred): saveState is global rather than per-section. Correct
  for the one-active-section model this design specifies; would need keying if
  multi-section editing is ever added.
Task 3: minor (deferred): type-check evidence in the report is thinner than the
  lint evidence, because tsc is silent on success.

Ruling: patched Task 4 Step 5 to replace newsletter-form's `<form onSubmit>`
  wrapper with a div. Why: audit before dispatch showed it is the only one of
  the four array/simple forms still using a form element (line 49, closing 101);
  the step deleted the handler without replacing the tag that calls it, which
  would not compile. Cost if wrong: none — the spacing class is preserved.
Task 3: fix round 1/5 (3 addressed, 0 open — save race, modifier clicks, href
  prefix; commits b191e61..af14640)
Task 3: complete (commits b191e61..af14640, review clean)

Process note: my `git commit -am` for a plan patch swept in the fix agent's
  concurrent edit to workspace-provider.tsx, putting a code fix under a docs
  commit message. Split into af14640 (code) + 522994c (docs) by soft-resetting
  the unpushed tip. From here on, stage explicit paths, never -a, while any
  subagent may be editing the tree.
Task 4: complete (commits 522994c..4cb6c3d, review clean)
  Implementer caught a real shadowing bug the mechanical values->value rename
  would have introduced in ChallengeSectionForm's stats-remap callback; reviewer
  confirmed it was genuine, correctly fixed, and unique in the diff.
Task 4: minor (deferred): a few `update` helpers had their second parameter
  renamed defensively where no shadowing was possible. Harmless consistency.
Task 5: review found 3 Important + 4 Minor, all plan-mandated. Verified both
  behavioural claims against the real renderers before ruling.

Ruling: FIX isSectionHidden — it was wrong in both directions. Accepted.
  Why: verified against source. The three narrative sections hide on emptiness
  independent of `active` (legacy-homepage-sections.tsx:62-66, 71-72, 130-131),
  so blanking a section's copy hides it on the page while the rail says
  "Saved". And an empty programmeShowcase is NOT hidden — homepage-sections.tsx:71
  substitutes the seed showcase, so the rail claiming "Hidden from page" is
  simply false. A status badge that is wrong in both directions defeats the
  feature it exists for.
  Fix: move the predicate to lib/cms/homepage-sections.ts as an exhaustive
  per-key switch, each branch citing the renderer guard it mirrors by file and
  line, with no `as` casts. Also confirmed MarqueeTicker never returns null (its
  `return null` is in a separator helper), so `ticker` is never hidden — now by
  design rather than by accident.
  Cost if wrong: the predicates are duplicated from the renderers and can drift
  if a renderer's guard changes. Mitigated by citing file and line in each
  branch. Importing the guards instead would mean restructuring four public
  components, which is outside this plan's scope.

Ruling: PARK the emerald/rose palette finding. The code stands.
  Why: the finding is correct to the letter of the constraint, but the
  constraint's intent is the public brand. The approved design brief says
  "Keep the existing dark navy admin sidebar and the current white/slate CMS
  surfaces", and the whole existing admin surface already uses emerald for
  success and rose for error notices. Rendering an error in brand pink — the
  same colour as the primary call to action — would make a failure look like an
  invitation. Semantic status colour is a usability convention, not brand drift.
  I narrowed the plan's Global Constraint to say so explicitly, so later tasks
  and the final review do not re-litigate it.
  Cost if wrong: if John wants strict brand-only admin chrome, four class
  strings change in two files.

Ruling: FIX the duplicated save button (raised as Minor) by extracting a shared
  SaveSectionButton.
  Why: normally a Minor goes to the deferred list, but John has a standing
  preference for growing one primitive with variants rather than keeping
  parallel components that do the same job, and this is two byte-identical
  handlers differing only in wrapper classes. A standing preference outranks the
  Minor label.
  Cost if wrong: one small extra component file.

Ruling: FIX the raw radius utilities. Why: tailwind.config.ts defines
  `control: 0.375rem` and `media: 0.75rem`, and the plan's own constraint is
  stated as "control radius 6px, media 12px" — the semantic tokens ARE that
  constraint. Same rendered value, so zero visual risk.

Task 5: minor (deferred): slate-* neutrals used rather than brand ink/muted/
  border. Same reasoning as the emerald/rose ruling — the design brief blesses
  white/slate CMS surfaces, and ~127 existing usages in components/admin.
Task 5: fix round 1/5 (3 addressed + radius tokens, 0 open; commits 987be5e..86d6ea7)
Task 5: complete (commits 4cb6c3d..86d6ea7, review clean)
Task 5: minor (deferred): the fix commit reuses the original's subject line, so
  two consecutive commits read identically in the log.

Ruling: propagated the semantic radius tokens to tasks 6-9 in the plan before
  dispatching Task 6. Why: the Task 5 fix left the later tasks still writing raw
  rounded-md/rounded-xl, which would have drawn the identical review finding
  three more times. Same rendered pixels. Cost if wrong: none.
Task 6: review found 2 Important + 2 Minor.

Ruling: FIX the pane height propagation (Important). Accepted, and the CSS
  reasoning checks out. Why: the grid wrapper divs are grid items and DO get a
  definite height (grid container is `flex-1 min-h-0` inside an `h-screen` flex
  column, single stretched row). But each wrapper is a plain block div, and a
  block child's height stays content-driven — it is not stretched the way a flex
  or grid child would be. So `overflow-y-auto` on the rail and editor roots has
  no bounded box to clip against, tall content grows past the wrapper, and the
  page scrolls instead of the pane. That defeats the full-height three-pane
  editor this task exists to deliver.
  Fix: add `h-full` to the pane root elements, which resolves against the
  wrapper's definite height. Chose this over making the wrappers flex: a row
  flex container would fix height but leave the child's width content-driven,
  and a column flex container fixes width but not height. `h-full` on a block
  child fixes height and keeps width filling naturally.
  Note this touches two files Task 5 already completed. That is correct — the
  defect only manifests once Task 6's layout provides the bounded parent.
  Cost if wrong: if the deferred browser pass shows scrolling was fine anyway,
  `h-full` is a no-op on a child of a definite-height block.

Ruling: FIX the raw `rounded-lg` on the tab-list container (Important).
  Chose `rounded-media` rather than `rounded-control`: the container has `p-1`
  around 6px-radius buttons, so ~10px reads better than 6px, and 12px is the
  nearer of the two available tokens.

Task 6: minor (deferred): the below-xl tab switcher uses role="tablist"/"tab"
  without aria-controls pairing or arrow-key navigation. Buttons remain natively
  keyboard-operable, so basic access holds; the full ARIA tabs pattern is polish
  and no other admin screen implements it either.
Task 6: minor (deferred): `searchParams: { section?: string }` is narrower than
  Next's runtime `string | string[] | undefined`. A repeated ?section= param
  falls back to the default section rather than erroring — harmless.
Task 6: fix round 1/5 (2 addressed, 0 open; commits e0a02ee..2d37c2b)
Task 6: complete (commits 7610f02..2d37c2b, review clean)
  MILESTONE: npm run type-check now passes with zero errors, which is the gate
  proving all seven form conversions in Task 4 were correct.
Task 7: review Approved with 1 Important + 3 Minor.

Ruling: FIX the untyped payload cast (Important), in BOTH server pages, not just
  the one reviewed. Why: JSON.stringify takes `any`, so building the literal
  inline and casting the JSON.parse result means the compiler never checks the
  literal against PreviewBaseline / HomepageDraftValues at all. A swapped
  variable or dropped field compiles cleanly and hands a component undefined at
  runtime. That directly undercuts the drift-proofing the derived PreviewContext
  types exist to provide. Task 6's workspace page had the identical gap, found
  by checking rather than assuming the finding was local.
  Cost if wrong: none; annotating is strictly more checking than casting.

Ruling: FIX the duplicated auth guard (raised as Minor) by extracting
  requireAdminPage into lib/cms/admin-auth.ts.
  Why: normally a Minor is deferred, but two copies of an authorization decision
  is the worst place to allow drift, and admin-auth.ts already exports
  requireAdminApiSession for API routes so this is its page-level sibling. Also
  matches John's standing preference for one primitive over parallel copies.
  Scope note: this touches app/(admin)/layout.tsx, which no task owns and every
  admin page renders. Ruled in deliberately — the reviewer verified the two
  guards are currently equivalent, so the extraction is faithful.
  Cost if wrong: a regression here would affect every admin route, so the
  deferred browser pass must confirm admin pages still load and that signing out
  still redirects.

Task 7: minor (deferred): the canvas passes showcase items through without the
  public page's String() coercion. Equivalent for well-typed data, and the
  workspace page does not coerce either, so the two admin surfaces agree.
Task 7: minor (deferred): context sections pass a `label` the non-editable
  branch never reads. Harmless dead argument.
Task 7: minor (deferred): the report paraphrased its verification output rather
  than pasting literal command output.
Task 7: fix round 1/5 (2 addressed, 0 open; commits 3ffa806..650d184)
Task 7: complete (commits 2d37c2b..650d184, review clean)
  Re-reviewer traced requireAdminPage's return type through
  getCurrentAdminUser -> verifyAdminSessionCookie -> resolveAdminUser and
  confirmed redirect()'s `never` narrows it to AdminSessionUser with no
  undefined, so AdminShell's non-nullable prop still type-checks. Also confirmed
  only two admin layouts exist, so no third duplicate was missed.
Task 8: review found 2 Important + 2 Minor, all plan-mandated.

Ruling: REMOVE the "Fit preview" control rather than fix it. Accepted the
  finding and went further than the reviewer.
  Why: the reviewer said the transform does not shrink the scrollable extent.
  Checking the structure showed it is more useless than that. The iframe is
  `h-full`, so its layout viewport equals the pane height and the homepage
  scrolls inside the iframe's OWN document. Scaling the wrapper shrinks the
  rendered box while leaving that layout viewport unchanged, so Fit displays
  exactly the same slice of page, smaller. It reveals nothing and shortens no
  scroll. A correct "fit whole page" control would need the canvas to report its
  content height so the iframe could be made tall and then scaled — real work
  for marginal value. Fit is not in the approved brief's requirements, which
  mandate desktop/tablet/mobile viewport controls; it came from the mockup only.
  Shipping a button that does nothing useful is worse than not shipping it.
  Cost if wrong: if John wants fit, it needs the content-height handshake. The
  spec is updated to record why it was dropped so the reason is not lost.

Ruling: FIX the unreachable failure fallback (Important). Accepted.
  Why: iframe.onError does not fire for HTTP errors, auth redirects, or hangs.
  middleware.ts redirects an expired session to /admin-login, which is a normal
  200 navigation — so a session expiring mid-edit renders the admin LOGIN FORM
  silently inside the preview pane. That is a realistic scenario during a long
  editing session and is actively confusing.
  Fix: treat a missing `itfyg:preview-ready` handshake within 8s as failure.
  One timeout covers every mode — auth redirect, error page, and hang — because
  none of them post the handshake. The fallback copy now names re-authentication
  as the likely cause, since that is the most probable trigger.
  Cost if wrong: a genuinely slow load on a cold dev server could show the
  fallback spuriously; the refresh button recovers it, and the handshake
  clearing `failed` would be the refinement.

Ruling: FIX the echoed scroll after a canvas click (raised as Minor).
  Why: clicking a section in the preview posts `select`, the parent sets the
  active section, and the parent then posts `scrollTo` for that same section —
  animating the view away from what the editor just clicked, every single time.
  Small code, visible annoyance.

Ruling: FIX the raw `rounded-lg` on the viewport button group. Consistency with
  the constraint; one token.
Task 8: fix round 1/5 (4 addressed, 1 NEW Important introduced by the fix;
  commits d80b482..a19128a)

Ruling: FIX the stale scroll guard (new Important, introduced by my own round-1
  fix). Accepted — the re-reviewer traced a plausible ordinary sequence, not a
  contrived race.
  Why: the guard cleared itself only on a match. The canvas can select a
  section that is already active, so activeSection.id never changes, the effect
  never re-runs, and the ref stays pinned to that id. A later legitimate rail
  selection back to that section then matched the stale ref and skipped its
  scroll, with no visible cause.
  Fix: read and clear the ref on every effect run, before comparing. A stale id
  is then consumed harmlessly at the next section change instead of lying in
  wait. Traced both paths: the echo case still suppresses correctly, and the
  already-active case now self-heals.
  Cost if wrong: none identified; strictly fewer states than the matched-clear
  version.

  Also noted from the re-review, no action needed: once `failed` is set the
  iframe branch unmounts, so frameRef goes null and the event.source filter
  rejects any late handshake — Refresh is the only recovery path, which is the
  intended behaviour rather than a stuck state.
Task 8: fix round 2/5 (1 addressed, 0 open; commits a19128a..c264c74)
Task 8: complete (commits 650d184..c264c74, review clean)
Task 8: minor (deferred): skipScrollFor is a single slot, so a rapid double
  canvas click on two different sections in one render batch could theoretically
  race. Pre-existing property of the ref design, not introduced by either fix.
Task 9: complete (commits c264c74..dc5f9db, review clean)
  Reviewer traced payloadVersion through workspace-provider to confirm the
  120ms debounce still always carries an incremented version, so boundary
  recovery is bounded to that cadence rather than blocked.
Task 9: minor (deferred): showcaseItems is computed in the canvas's own render
  body, outside any boundary, so a throw there would still blank the whole
  preview. Unreachable through the typed editing surface today; worth revisiting
  only if raw/unvalidated input can ever set programmeShowcase.
Task 9: observation (not a finding, worth telling John): the build emits
  `[safeImageSrc] rejected image src "https:/files/PETER_PROFILE.png"` — a
  malformed URL (single slash) in team content. Pre-existing and independent of
  this plan; the public homepage already renders that data. Real data bug, out
  of scope here.

Ruling: batch tasks 10 and 11 into one dispatch. Why: T10 is a one-line href
  change and T11 adds a script file plus one package.json entry. Neither needs
  its own review surface, and T11's script cannot be executed by a subagent
  anyway (it needs a dev server and a real session cookie), so its real
  verification belongs to my consolidated browser pass regardless.
  Cost if wrong: the two changes share one review; they touch disjoint files, so
  a finding in one is still unambiguous.
Tasks 10+11: implemented in one dispatch (d3b9261 = T10, 0dfb812 = T11).
  The implementer raised a real concern I had not anticipated: `playwright` is
  imported by the new script but is NOT declared in package.json. Confirmed —
  version 1.62.1 resolves from node_modules, but nothing declares it.

Ruling: make the script fail with an actionable message when playwright is
  missing, and do NOT add it as a dependency.
  Why: on a fresh clone `npm run shoot:homepage-workspace` would die with an
  opaque module-not-found, and this script is the plan's only mechanical proof
  of its central design claim, so it has to be usable. But declaring playwright
  pulls a heavy devDependency plus a browser download that John did not ask for,
  and the existing local practice is already that playwright is present
  out-of-band — his own untracked .claude-shot.mjs imports it the same way, and
  the repo's other verify scripts reach for tooling via `npx --yes`. Adding the
  dependency is his call, not mine, so I surface it rather than decide it.
  Cost if wrong: if John would rather declare it, that is a one-line
  devDependencies entry plus `npx playwright install chromium`.
Task 11: fix round 1/5 (2 addressed, 0 open; commits 0dfb812..86c05e5)
Task 10: complete (commit d3b9261, review clean)
Task 11: complete (commits 0dfb812..86c05e5, review clean)
Task 11: minor (deferred): none outstanding.

ALL ELEVEN TASKS COMPLETE. Proceeding to full verification sweep, then the
whole-branch review over 35aa11c..HEAD (35aa11c was HEAD when this session
began, so that range is exactly this plan's work).

## Final whole-branch review

Verdict: NOT mergeable. Found 2 Critical + 4 Important that all eleven task
reviews and four static gates missed, because both Criticals are geometric
rather than logical. I verified every number against source before acting.

  Critical 1: max-w-[1500px] + [320px_1fr] -> main <=1180; xl tracks 176+392 ->
  preview column 612; two p-4 layers -> iframe ~548px. Tailwind sm: is 640, so
  the "100%" desktop preset sat BELOW sm:, making it render narrower than the
  760px tablet preset, and no preset ever reached md:/lg:. The one thing the
  iframe architecture existed to guarantee was true for mobile only.

  Critical 2: the seven forms kept viewport-relative md:grid-cols inside a fixed
  392px editor track, collapsing the ticker's five-track row to three ~48px
  inputs. Same class of error as Critical 1.

Ruling: fix both, plus Importants 3-5 and Minors 7/8/10, in one wave; spec
  corrected first (it had prescribed the wrong widths and was silent on form
  layout). Deferred everything the reviewer triaged as ship-as-is.
  The final reviewer independently endorsed both of my earlier contested
  rulings: the emerald/rose palette exemption, and leaving playwright
  undeclared — while correctly noting the latter's consequence, that making the
  only mechanical proof optional to run meant it never ran.

Fix wave: commit f529bd2. The implementer's API connection timed out while
  writing its report, AFTER committing, so no fix report exists. I verified the
  work myself instead: all eight fixes present (real pixel widths 1280/820/390,
  ResizeObserver scale-to-fit with the outer wrapper sized to the scaled
  footprint, md: grids removed from all five form files, minmax(0,1fr) tracks,
  max-w-none for bleed routes, saveState cleared on section change, six
  admin-config entries sourcing labels from the registry with the "displayed"
  drift gone, canvas source check, repost on ready).
  Gates at f529bd2: type-check 0 errors, lint clean, build compiled
  successfully, verify:cms all invariants hold.

OUTSTANDING, blocking merge:
  1. Scoped re-review of the fix wave (f529bd2). Not yet dispatched.
  2. The consolidated browser pass, including `npm run shoot:homepage-workspace`
     — needs ITFY_ADMIN_SESSION from John. This is the gate the whole design
     was built around and it has never run.

---

# Plan 2 — site-page workspace

# SDD ledger — plan: docs/superpowers/plans/2026-09-09-site-page-workspace.md

Spec: docs/superpowers/specs/2026-09-09-site-page-workspace-design.md (read)
Branch: incircles @ d85d8ea (base for this plan)

Ruling: continue on branch `incircles` alongside the completed homepage-workspace
  work rather than branching or merging first.
  Why: the user asked to start another section immediately after accepting the
  homepage work's verification, so the homepage plan's branch was never
  finished. Both plans touch the same admin surface and phase 1 of this plan
  deliberately refactors homepage code, so separating them would mean merging
  the first immediately anyway.
  Cost if wrong: `incircles` accumulates two features, so reverting one alone
  means cherry-picking rather than dropping a branch. Every task commits
  separately, so that stays possible.

## Pre-flight conflict scan

Pairs sharing a file or an interface:

| Tasks | Produced -> consumed | Finding |
|---|---|---|
| T1 -> T2 | protocol constants, message types, guards -> PreviewFrame | clean |
| T1 -> T9 | protocol + PreviewSectionBoundary -> site-page canvas | clean |
| T1 <-> T2 | PREVIEW_ROUTE deliberately stays in preview-messages.ts; T2's adapter imports it from there | clean |
| T2 -> T10 | PreviewFrame, incl. the nullable scrollTargetId -> adapter | clean; the two regions that render nothing are exactly why it is nullable |
| T3 -> T10 | WorkspaceShell slots -> both edit routes | clean |
| T4 -> T5,T6 | EditableSitePage, region field lists -> region components | clean |
| T4 -> T7 | regionForField, sitePageRegions -> provider | clean |
| T4 -> T8,T9 | registry -> rail, editor, canvas | clean |
| T5 -> T6 | shared.ts + four regions -> the form composition | clean |
| T5,T6 -> T8 | all seven regions -> RegionEditor's exhaustive switch | clean |
| T7 -> T8,T10 | useSitePageWorkspace -> rail, bar, editor, adapter | clean |
| T9 -> T10 | preview route path -> the adapter's previewRoute URL | clean; both use published.slug |
| T2 <-> T11 | iframe title + viewport aria-labels -> script selectors | **FINDING** (ruled below) |
| T10 self | the bleed predicate's regex against the routes it must and must not match | **FINDING** (ruled below) |

Per-task self-consistency: every task's imports are used by its own code, and
every file a later task touches is created by an earlier one. Two exceptions,
both ruled on below.

Ruling: give PreviewFrame a `title` prop and have the screenshot script select
  a stable `data-preview-frame` attribute instead of the title text.
  Why: T2 moves the iframe's `title="Homepage preview"` verbatim into the shared
  frame, so a Who We Are page's preview would announce itself to screen readers
  as "Homepage preview". That is simply false, and accessible naming is a stated
  constraint. But T11's script selects on that exact string, so the two
  requirements collide: the title must vary per workspace and the selector must
  not. Splitting them fixes both — the title becomes a caller's prop, and the
  script keys off an attribute that never varies.
  Cost if wrong: one extra prop and one attribute; if the attribute is ever
  dropped, the script fails loudly rather than silently, because a missing frame
  already counts as a failure.

Ruling: anchor the bleed predicate's regex with a negative lookahead for `new`.
  Why: tested the plan's regex before dispatching and
  `/^\/admin\/(who-we-are|what-we-do)-pages\/[^/]+$/` matches
  `/admin/who-we-are-pages/new`. That would strip the shell's padding from both
  create pages, which are ordinary scrolling forms and would render flush
  against the sidebar with no full-height layout to justify it. `(?!new$)` fixes
  it; verified that the index pages, both create pages, and a deeper path all
  stay on the normal layout while real slugs bleed.
  Cost if wrong: none identified. If a family ever gains another reserved
  non-record segment, it needs adding to the lookahead.

## Execution

Task 1: complete (commits 1997be6..7354820, review clean, zero findings)
  Boundary moved as a git rename with similarity index 100%, which is the
  strongest possible evidence the resetKey logic survived untouched.

Ruling: defer every admin browser-verification step to one consolidated pass at
  the end, as with the homepage plan, and have per-task implementers verify
  mechanically.
  Why: middleware.ts matches `/admin/:path*` and needs the itfy-admin-session
  cookie, so no subagent can load an admin route. Worse than last time: these
  getters return [] without Firestore, so the workspace also needs real
  Firestore data, not just a cookie. Phase 2's regions stay verifiable through
  the two `new` routes, which need no record.
  Cost if wrong: a defect visible only in a browser survives to the end of the
  run. Unlike the homepage plan, the final browser pass here may be impossible
  without seeded Firestore data — which I must surface to John rather than
  quietly skip.
Task 2: implemented at ac47b7d, reported DONE_WITH_CONCERNS with two concerns.
  Both verified before ruling.

Ruling: the `"100%"` grep hit is NOT a finding. Verified it is a `height`
  fallback at preview-frame.tsx:296, present verbatim at 7354820 before the
  refactor. My geometry check grepped for the bare string rather than
  `width:.*100%`, so it flagged a correct line. The constraint is about width,
  which drives the layout viewport; height does not.
  Cost if wrong: none — the check was mine and it was imprecise.

Ruling: FIX the two hard-coded homepage strings the implementer found. My brief
  missed them.
  Why: I caught the iframe `title` in pre-flight but not
  `aria-label="Live homepage preview"` (line 206) or the footer's `· Homepage ·`
  (line 316). In a now-shared component both are false for a site page, and the
  aria-label one is an accessibility defect of exactly the kind the title fix
  was for — a Who We Are workspace would announce its preview as the homepage's.
  Fix: the wrapper's aria-label derives from the existing `title` prop rather
  than adding a fourth naming prop, and `footerLabel` becomes the whole trailing
  text composed by the caller instead of being appended to a literal.
  Cost if wrong: callers must compose a slightly longer string; both adapters
  are updated in the same change so nothing is left inconsistent.
Task 2: fix round 1/5 (1 real finding addressed, 1 dismissed with reasons;
  commits ac47b7d..58432a0)
Task 2: complete (commits 7354820..58432a0, review clean)
  Reviewer confirmed the geometry is byte-identical to the pre-refactor file at
  every checked point, and that the homepage's rendered footer is unchanged.

Ruling: fix the redundant accessible name now, carried into Task 3's dispatch
  rather than deferred.
  Why: the reviewer flagged `aria-label={`Live preview: ${title}`}` with
  title="Homepage preview" reading as "Live preview: Homepage preview", and
  noted it compounds in Task 10 where the title is "${family.label} page
  preview". It is a Minor, so the rules say defer — but Task 10 has not run
  yet, so fixing now costs one small change and fixing later costs the same
  change plus an inherited defect in a second file. The prop becomes a SUBJECT
  rather than a phrase, and the two slots compose it differently: iframe
  `title={`${subject} preview`}`, wrapper `aria-label={`Live preview of
  ${subject}`}`. Reads correctly in both.
  Batched into Task 3 because that implementer is already in the kit directory,
  and Task 3's review covers both.
  Cost if wrong: a prop rename across two adapters; caught immediately by
  type-check if a caller is missed.

Task 2: minor (deferred): the fix commit reuses the original's subject line, so
  two consecutive commits read identically in the log.
Task 3: complete (commits 58432a0..a295c2e, review clean)
  Includes the carried Task 2 minor (2f00647, title -> subject).
  Reviewer's one unverified item (lint/build/verify:cms) resolved by the
  controller: all three pass at a295c2e.
Task 3: minor (deferred): the shell wraps the `bar` slot in an extra
  `<div className="shrink-0">` where the original rendered WorkspaceBar
  directly, so `shrink-0` now appears twice. Behaviourally inert — the wrapper
  is not a flex container — and one extra DOM node.

PHASE 1 COMPLETE. The shared kit exists and the homepage is re-pointed at it,
with no behaviour change: protocol, section boundary, preview frame and
three-pane shell are all workspace-agnostic.
Task 4: review found 1 Important (plan-mandated) + 3 Minor.

Ruling: FIX isRegionEmpty, and split it in two. Accepted; verified the
  divergence by running it.
  Why: ContentPage filters PER ITEM — `ctas.filter(c => c.label.trim() &&
  c.href.trim())` — so `[{label:"",href:""}]` renders nothing while my
  array-length check called it populated. Confirmed by execution. Any "Add"
  button that inserts a blank row creates exactly this state, so it is common,
  not exotic. And the hero renders unconditionally (content-page.tsx:36), so it
  is never absent, yet my function would report it empty when its fields were
  blank.
  The reviewer also exposed a conflation in my design: "does this block render?"
  (what Task 9's canvas needs to predict ContentPage's children) and "has the
  editor put anything here?" (what the rail displays) are different questions I
  had wired to one function. Splitting them into doesTargetRender(target, page)
  and isRegionEmpty(region, page), both mirroring ContentPage's real predicates
  with line citations.
  Load-bearing: Task 9 pairs ContentPage's children by count, so a wrong
  prediction would spuriously disable preview outlining on any page with a
  blank row.
  Cost if wrong: the predicates are duplicated from ContentPage and can drift if
  its filters change; mitigated by citing file and line on each branch, the same
  mitigation used for the homepage's hidden-section predicate.

Task 4: minor (deferred): the report claims it added a DynamicSitePage import
  that was already present, and has a wrong home-directory path in one line.
  Report-only inaccuracies, no code impact.
Task 4: resolved the reviewer's one unverified item — whether `SitePage` is
  still used in site-page-form.tsx after its import was dropped. Lint passed at
  374d27d and next lint reports unused imports, so it is genuinely unused.
Task 4: fix round 1/5 (1 addressed, 0 open; commits 374d27d..a3d1cf1)
Task 4: complete (commits a295c2e..a3d1cf1, review clean)
  Controller executed both helpers against a page with blank placeholder rows:
  doesTargetRender("hero")=true, doesTargetRender("stats")=false,
  isRegionEmpty(ctas)=true. All correct.
Task 5: implemented at 399adbc, reported DONE_WITH_CONCERNS. The implementer
  found a PRE-EXISTING bug and flagged it instead of fixing it silently.

Ruling: ACCEPT the deviation from pure relocation. Verified the claim myself.
  Why: at a3d1cf1 the related-cards `.map()` opened at line 818 and closed at
  868, and processEyebrow/processTitle/processDescription sat at 854-856 —
  INSIDE it. They rendered once per related card, each with the same hard-coded
  `id`, producing duplicate DOM ids and broken label association. The fix was
  not optional either: the region registry assigns those three fields to region
  `other`, so the split cannot honour the registry while they live inside the
  related map. Leaving it would have propagated the bug into the extracted
  components.
  Cost if wrong: the diff is larger than a pure move, which makes review
  harder; mitigated because the implementer isolated and described it.

  I also checked whether the implementer had invented the surrounding
  `values.process !== undefined` guard, which would have hidden three fields on
  records without a `process` array — the exact capability regression the field
  gate exists to catch. It did not: that conditional is present verbatim at
  a3d1cf1 and moved with the markup. My suspicion was wrong.

Observation for Task 6 (not a finding): that pre-existing guard means the three
  process copy fields are hidden on any record where `process` is undefined.
  Task 6 moves them into other-fields-region; preserve the guard as-is rather
  than silently changing when those fields are reachable.
Task 5: complete (commits a3d1cf1..399adbc, review clean)
  Reviewer independently re-ran the field-baseline grep across the form plus all
  four region files: byte-identical to fields-before.txt, 38/38. Also verified
  the reconstructed related-cards map closes cleanly and the three relocated
  fields render exactly once with unchanged wiring.
Task 5: minor (deferred): highlightsEyebrow's wrapper gained `mb-6` because it
  moved out of a 2-column grid cell into a standalone field. Necessary layout
  adaptation, cosmetic.
Task 6: implemented at a3cbd1b, DONE with one flagged addition.

Ruling: ACCEPT the `slugBasePath` prop the implementer added to SettingsRegion.
  Verified: it was already a SitePageFormProps prop (line 52 at 399adbc) with a
  "/who-we-are" default, it drives the slug helper text "This becomes
  {slugBasePath}/{slug}", and BOTH what-we-do routes pass "/what-we-do".
  Moving the slug field into SettingsRegion without threading it would have
  silently shown the wrong URL preview on the two What We Do routes. My brief
  omitted it; the implementer caught it.
  Cost if wrong: none — it preserves existing behaviour rather than adding any.

  Controller re-ran both coverage gates independently: all 38 fields assigned to
  a region, all 38 rendered by a region component. Form is 147 lines, down from
  893. The pre-existing `values.process !== undefined` guard survived into
  other-fields-region.
Task 6: complete (commits 399adbc..a3cbd1b, review clean)
  NOTE: the reviewing subagent's safety classifier timed out, so I verified its
  substantive claims myself. The SettingsRegion early-return guard exists at
  settings-region.tsx:23-25, and all four call sites pass both flags true, so
  the branch is unreachable. type-check 0 errors, build compiled.
Task 6: minor (deferred): SettingsRegion returns null when both display flags
  are false. Unreachable from any current call site; defensible for an isolated
  region that would otherwise render an empty panel, but it is undisclosed
  behaviour beyond a pure move.
Task 6: minor (deferred): other-fields-region.tsx is 459 lines, the largest
  region, mixing 20 scalar fields with two list editors. Exactly what the brief
  specified; worth splitting only if it grows.
Task 6: minor (deferred): my brief said "the fifteen overview*/operating*/
  principles*/process*/nextStep* fields" where the real count is 18. Arithmetic
  slip in the brief; the region's 22-field total is correct and gate-verified.

PHASE 2 COMPLETE. SitePageForm is a 147-line composition of seven region
components, down from 893 lines, with both coverage gates confirming all 38
fields survive. Both `new` routes are untouched.
Task 7: review found 1 Important (plan-mandated) + 2 Minor.

Ruling: FIX the save-in-flight state incoherence. Accepted; traced the sequence.
  Why: applyDraft unconditionally resets saveState to "idle" and clears
  serverErrors on every edit, with no regard for an outstanding request. So:
  edit, save, keep typing -> saveState snaps to idle while the request is still
  in flight; a second Save click passes canSave but is silently swallowed by the
  saving.current guard with no feedback; the original response then lands and
  reports "Page updated." while the live draft has moved on and isDirty is still
  true. On the failure path it is worse — a stale response repopulates
  serverErrors with messages attributed to fields the editor has already fixed,
  resurrecting phantom errors that applyDraft had just cleared.
  No data is lost, but this is the same class of defect the homepage provider
  shipped, and it is the workspace's data layer.
  Fix: applyDraft leaves saveState and serverErrors alone while a save is in
  flight; the save captures the payload it sent and compares it against a
  latest-draft ref on completion, applying server errors only when the draft has
  not moved on and reporting supersession honestly when it has; a second click
  during a save now says so instead of no-op'ing.
  Cost if wrong: more branches in save() for a window that needs typing during a
  slow request; the alternative is a UI that claims success while dirty.

Ruling: FIX the duplicated field-error grouping (raised as Minor). The same
  13-line loop appears twice, in the client memo and the save error branch, and
  both need identical behaviour — a shared helper removes it without inventing
  an abstraction. John's standing preference is one primitive over parallel
  copies.

Task 7: minor (deferred): the nav guard only intercepts hrefs starting with "/",
  so a same-origin absolute URL bypasses the unsaved-changes prompt. Real gap,
  but every link in this codebase is root-relative via next/link.
Task 7: fix round 1/5 (2 addressed, 0 open; commits 949213c..1afed2b)
Task 7: complete (commits a3cbd1b..1afed2b, review clean)
  Re-reviewer traced all four sequences and confirmed saving.current cannot
  wedge: both early returns precede setting it, and the only path that sets it
  is followed by try/catch/finally with no return inside the try.
Task 8: implemented at 5df657f, DONE_WITH_CONCERNS.

Ruling: FIX the missing slugBasePath in RegionEditor's settings case. Accepted.
  Why: without it the workspace always shows the "/who-we-are" default in the
  slug helper text, so a What We Do page tells the editor its URL will be
  /who-we-are/<slug>. Cosmetic in that saving and validation are unaffected,
  but it is wrong information about the record's address, shown at exactly the
  moment the editor is deciding that address.
  This is the SECOND appearance of the same defect: Task 6's implementer caught
  it in SitePageForm, and my Task 8 brief reintroduced it in the workspace path.
  The family descriptor carries `publicBase` for precisely this, so the fix is
  `slugBasePath={family.publicBase}`.
  Cost if wrong: none — it passes an existing value to an existing prop.

  Pattern worth recording: both plans' most dangerous defects have been in my
  plan text rather than in implementer work, and this one recurred in a second
  place after being fixed in the first. When a defect is found in one consumer
  of a shared component, the right move is to grep for the other consumers
  rather than fix only the reported one.
Task 8: review found 1 Important (plan-mandated) + 1 Minor. The reviewer
  REPRODUCED its finding in a scratch file rather than asserting it, which is
  what made it credible enough to act on immediately.

Ruling: FIX the false exhaustiveness guarantee, in this plan AND in the
  already-shipped homepage equivalent. Verified the claim myself.
  Why: I reproduced it with the project's own tsc. A switch over a union with a
  missing case, in a function with NO return-type annotation, compiles clean —
  the inferred return widens to include undefined, which is a valid ReactNode.
  The same switch in a function WITH an explicit return type errors with
  TS2366. `noImplicitReturns` is not set in this repo's tsconfig.
  So the guarantee I asserted is TRUE for the annotated helpers
  (isSectionHiddenFromPage(): boolean, doesTargetRender(): boolean) and FALSE
  for the two unannotated selectors — site-page ActiveRegion and the homepage's
  already-shipped ActiveForm, which carries the same false comment at
  section-editor.tsx:21-22.
  Worse than a missing safety net: a code comment stating a protection that
  does not exist will make a future maintainer trust it. The next region added
  without an editor would render silently blank with a clean type-check.
  Fix: annotate both selectors `: ReactElement` with an explicit
  `import type { ReactElement } from "react"`, which makes the missing-case
  error real, and correct both comments to say what actually enforces it.
  Scope note: this touches components/admin/homepage-workspace/section-editor.tsx,
  which belongs to the completed homepage plan. Ruled in deliberately — same
  repo, same branch, one-line fix, and leaving a knowingly-false comment in
  shipped code is worse than a small out-of-plan edit.
  Cost if wrong: none identified; the annotation only narrows what the compiler
  accepts.

Task 8: minor (deferred): the bar's "N region(s) need attention" count derives
  from regionErrors while canSave also considers page-level formErrors, so a
  save blocked purely by a form-level error would read "0 region(s)". The
  reviewer found no UI-reachable path today.
Task 8: fix round 1/5 (slugBasePath; commits 5df657f..dd863c5)
Task 8: fix round 2/5 (1 addressed, 0 open — false exhaustiveness guarantee in
  TWO files; commits dd863c5..de54001)
Task 8: complete (commits 1afed2b..de54001, review clean)
  Controller independently proved the new protection: removing the `related`
  case from region-editor.tsx produced TS2366 at the annotated signature, and
  restoring it returned type-check to zero errors. Build and verify:cms both
  pass after the out-of-plan homepage edit.
Task 9: review found 1 Important (plan-mandated) + 1 Minor.

Ruling: FIX the overlay geometry staleness. Accepted, and it is worse than the
  reviewer judged.
  Why: overlays are measured from offsetTop/offsetHeight once per
  record/payloadVersion change, with no resize path. The reviewer called a
  window resize "very plausible". It is in fact guaranteed: the shared
  PreviewFrame has desktop/tablet/mobile viewport controls that change the
  iframe's width, so every block moves while `record` and `payloadVersion` stay
  identical. Switching viewport would leave every outline over the wrong block,
  and a click would then select the wrong region — silently, since nothing
  fails.
  Fix: a ResizeObserver on the canvas root that re-runs the same measurement,
  so any reflow re-measures — viewport switches, image loads, font swaps alike.
  Cost if wrong: one observer's worth of churn on a preview surface; the
  alternative is outlines that lie after the feature's own controls are used.

Ruling: FIX the boundary's hard-coded console message. It warns "Homepage
  preview section ..." regardless of its label, so a site-page failure reports
  the wrong workspace. This is the FOURTH hard-coded identity string found in
  the extracted kit — after the iframe title, the wrapper aria-label and the
  footer segment. Same species, same cause: moving a component from one consumer
  to two turns every embedded proper noun into a lie, and none of them fail to
  compile. Fix uses the label the boundary already receives.
  Cost if wrong: none.
Task 9: fix round 1/5 (2 addressed, 0 open; commits 0a00218..0a561bb)
Task 9: complete (commits de54001..0a561bb, review clean)
  Re-reviewer confirmed no ResizeObserver oscillation: the overlays are
  absolutely positioned, so re-rendering them cannot change the observed
  element's height, and steady state is reached after the first measure.
  Audited the whole kit afterwards: preview-protocol, section-boundary and
  workspace-shell contain zero "homepage" occurrences, and preview-frame's three
  are all inside the `subject` doc comment explaining why that prop must not be
  hard-coded. The kit is genuinely workspace-agnostic.

Ruling: batch tasks 10 and 11 into one dispatch, as with the homepage plan.
  Why: T10 rewires two routes plus a shell predicate, T11 generalises a script
  and adds one npm entry. Neither needs its own review surface, and T11's script
  cannot be executed by a subagent anyway — it needs a dev server, a session
  cookie AND real Firestore records. They touch disjoint files, so a finding in
  one stays unambiguous.
Task 10: complete (commit d80f20d, review clean)
Task 11: complete (commit bfdfec4, review clean)
Task 10/11: minor (deferred): the script's frame lookup is a substring match on
  "/preview" rather than an exact route match; brief-mandated, and no other
  /preview route exists.
Task 10/11: minor (deferred): the two [slug] route files are near-identical by
  design — family and getter differ per route, and there is nothing further to
  share.
  Reviewer's unverified item (the four gates) resolved by the controller below.

ALL ELEVEN TASKS COMPLETE.

## Final whole-branch review

Verdict: mergeable with fixes. Found 4 Important + 11 Minor. It ran the real
zod schemas against synthetic records to prove two of them, which is why they
were actionable immediately.

  Important 1: blank optional fields are stripped by the schema, so after a
  successful save the refreshed baseline differed representationally from the
  draft and every affected region stayed marked "unsaved" forever — driving a
  perpetual leave-confirmation and making the rail lie.
  Important 2: `order: 0`, which lib/cms/site-pages.ts writes for any
  never-ordered document, fails the schema's positive-integer rule, so Save was
  permanently disabled on load for those records.
  Important 3: two MORE hard-coded homepage identities in the shared frame —
  "Save the section to publish." and href="/" on the failure fallback's Open
  public page link. Fifth and sixth of that species; both escaped the earlier
  audit because neither contains the word "homepage".
  Important 4: the spec promised a duplicate-title mitigation never carried into
  the plan, half of which is impossible.

Fix wave: commit 104eb1d, nine fixes. Spec corrected separately at 7ffcf09.

Ruling: make ONE further one-line fix rather than deferring it, then stop.
  Why: the scoped re-review found a composition gap between two of my own
  fixes. Fix A's canonicalRecord parses the raw record; Fix B established that
  `order: 0` makes that parse fail. So for precisely the records B exists to
  serve — never-ordered ones, the common case — canonicalRecord falls back to
  the raw record on both sides and Important 1's permanent-false-dirty symptom
  reappears untouched. I reproduced it: order=0 "DIRTY FOREVER" as shipped,
  "clean" with toPayload composed in, while order=2 already worked.
  The skill says no second fix wave. This is not a wave: it is
  `safeParse(toPayload(page))` in one helper, load-bearing because it decides
  whether Important 1 was actually fixed, and verifiable by execution. Deferring
  it would ship a fix that is inert in the exact case it was written for.
  Cost if wrong: none identified; toPayload only maps a falsy order to absent.

Deferred after final-review triage (all ship-as-is per the reviewer):
  - serverErrors surviving a save: fixed in the wave.
  - "Still saving your previous change" branch is unreachable; harmless.
  - Seven duplicated `update` helpers across region components.
  - ContentPage hard-codes a "Who We Are" breadcrumb, so a What We Do preview
    shows the wrong trail. Public renderer, out of scope, recorded in the spec.
  - heroVideoUrl/heroVideoThumbnail do not round-trip through mergeSitePage.
    Recorded in the spec.
  - No region owns `courses`; a malformed stored value blocks saving with no
    editor for it anywhere. Recorded in the spec.
  - AdminShell's sign-out uses router.push, which triggers neither the click
    guard nor beforeunload, so signing out discards a draft silently.
  - Create-route panel order changed to registry order; spec corrected to say so.
