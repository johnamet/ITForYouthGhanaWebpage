# SDD ledger — plan: docs/superpowers/plans/2026-09-02-laptop-bank-admin.md

Spec: `docs/superpowers/specs/2026-09-01-laptop-bank-spec.md`
Phase 1 ledger: `docs/superpowers/2026-09-01-laptop-bank-execution-ledger.md`
Branch: `incircles`. Commits local, nothing pushed. 6 commits.

## Two corrections to the phase 1 record

**1. Firestore IS configured in this environment.** The phase 1 ledger says it
is not, and used that to explain two unverified checklist items. That was
wrong. `FIREBASE_SERVICE_ACCOUNT_BASE64` is set in `.env` — Next loads it, and
a bare `node -e` does not, which is what produced the mistaken conclusion. The
project is `itfy-website` and all eight Laptop Bank collections were reachable
and empty. The *behaviour* phase 1 described was still correct (an empty
collection and an unconfigured SDK both produce a hidden stat band and no
partners), but the reason given was not, and it meant a mandated test went
unrun when it could have been run.

**2. Both `npm run start` verifications in phase 1 silently failed.** Port 3000
was held by a `next-server` process that survived every
`pkill -f "next dev"` — the pattern matches the parent `next dev`, not the
`next-server` child it spawns. So both `next start` attempts died with
`EADDRINUSE` and every curl was answered by that older server. It was a *dev*
server compiling from current source, so the phase 1 route results were
substantively right, but they were not testing the production build they
claimed to be.

Both are now settled: the stale process was killed, a real production server
was started, and **every curl-based claim in the phase 1 ledger was re-run
against it**. All of them hold — ten Phase 1 routes 200, four Phase 2 routes
200 and noindex, `/what-we-do/laptop-bank` → 308 → `/laptop-bank`,
`/laptop-bank/uk` 404, upload route 404 with no cookie and 404 with a forged
one. The lesson worth keeping: `pkill -f "next dev"` does not stop the server.

## The defect this phase existed to fix

Phase 1's staff notification linked to `/admin/messages` and
`/admin/applications`. Those pages read `contactMessages` and `applications`;
Laptop Bank submissions are written to `laptopBankOffers` and
`laptopBankApplications`. The link resolved to a page that would never show the
record.

That is worse than an ordinary broken href. Spec §7 forbids any personal data
in the notification email body, so the link is the *only* route staff have to a
submission — which made both public forms a dead end. Fixed in `7cbde00`; the
link now carries the reference and `adminLinkFor` documents why it must never
point at a generic inbox again.

## Rulings

**1. One descriptor-driven editor, not six forms.** The six content types
differ only in their field lists. Six hand-written forms would be six places to
fix one bug and six chances for the consent treatment to drift — and consent is
the part that must not drift, since `display_consent` puts a real
organisation's logo on the public internet and `publication_consent` puts a
real young woman's name and photograph there. One renderer means one place
where that is got right. Consistent with this repo's earlier choices (phase 4a
card consolidation, phase 5 slot growth).

Cost if wrong: a type that eventually needs a bespoke control needs an escape
hatch in the descriptor. Cheap.

**2. Consent fields get a different interface from ordinary fields.** They
render first, not in field order, inside an amber "publishing decision" panel
that says in words what turning them on does. A consent `select` opens on no
value at all, and the descriptor lists `anonymous` first so a half-completed
donor rests on the option that publishes nothing. A plain checkbox among twelve
others is not an adequate interface for a decision that is irreversible in
practice once a logo or a photograph has been seen.

**3. An empty number field stores `null`, never `0`.** `DashboardMetrics`
fields are nullable precisely so "not counted yet" and "counted, and it is
zero" are different claims, and spec §10 forbids publishing a placeholder zero.
Coercing `""` to `0` would silently convert every uncounted metric into a
published figure of nought. Pinned by assertion in `verify:laptop-bank`.

**4. Process stages are keyed by stage number.** The nine stages are a fixed
set with anchors built from the number, so the document id is the number. A
second write to stage 5 replaces it rather than creating a duplicate stage 5.
Also pinned by assertion.

**5. The metrics singleton refuses DELETE.** Deleting it would lose the period
label and last-updated date when what an editor reaching for that control
actually wants is to clear the figures. The API returns 400 with that
explanation. A singleton that has never been written opens as an empty form
rather than a 404 — that is the normal starting state, and it is the only
screen where the figures can be entered.

**6. Admin reads are deliberately unfiltered.** `lib/cms/laptop-bank.ts` is the
public path and enforces consent in the query. An editor must be able to see
and correct exactly the records that path excludes, so
`lib/cms/laptop-bank-admin.ts` returns everything and carries a comment saying
it must never be called from a public page.

**7. Auth is checked before the content type is looked up.** An unknown
`[type]` returns 401 to an anonymous caller, not 404 — so nobody can probe
which content types exist without a session.

**8. Nothing the submitter wrote is editable.** `updateSubmission` can change
only status and notes. A reviewer must not be able to amend an applicant's own
words or a donor's stated consent: the submission is the record of what they
said.

## Verification

Everything below was run and its output read.

| Check | Result |
|---|---|
| `type-check`, `lint`, `build` | Clean |
| `verify:media-pages` | exit 0, 35/35 |
| `verify:tokens` | exit 1 — 23 Phase 1 + 1 Phase 2 outstanding. Expected, not a regression |
| `verify:laptop-bank` (new) | exit 0, **28 assertions passing**, collections back to zero |
| Admin pages unauthenticated | 307 → `/admin-login` for the index, both inboxes, both detail routes and all six content types |
| Admin write endpoints unauthenticated | 401 on offer PUT, application DELETE, record POST, record PUT — matching the existing `/api/admin/messages` behaviour |
| Unknown content type, anonymous | 401 from the API, 307 from the page — existence not leaked |
| All phase 1 curl claims | Re-run on a genuine production server. All hold |

**Spec §10's last open item is now closed.** `verify:laptop-bank` writes a
donor per consent value and three stories covering both story rules, asserts
the public readers behave, and deletes them. It proves what code review could
not: an anonymous donor never leaves the reader; a "named only" donor reaches
the partners page but not the logo grid; an unconsented story is excluded
entirely; and a consented story with no consent record on file is returned with
its institution and photograph *stripped rather than dropped* — spec 5.14's
rule, and the one most easily got wrong in either direction.

It writes to Firestore, so it announces that at the top, refuses to run if real
records already occupy the two fixed ids it uses, and reports leftovers if
cleanup fails. Not wired into the build, a hook or CI.

### Still not verified

- **Both forms on a throttled 3G profile** (spec §10). Needs a browser with
  network throttling. Not done, same as phase 1.
- **The end-to-end round trip** — submit the public form, then open the record
  at the URL the notification email would send. The pieces are each verified
  (the form posts, the route writes to `laptopBankOffers`, the reader reads that
  collection, the inbox renders it, the link now points there) but they have not
  been exercised as one chain, because doing so writes a real submission and
  sends real email through Brevo. Worth doing once on staging before launch.
- **The admin UI under a real session.** Every screen was verified to be gated;
  none was verified rendering *inside* a session, because that needs a Firebase
  admin login this environment has no credentials for. The data layer beneath
  them is covered by `verify:laptop-bank`.

## Still out of scope, and why

- **Token editing.** Spec 5.1 BEHAVIOUR wants `{{SLA_REPLY}}` to have a "single
  source in the CMS". It has a single source, but in code
  (`lib/content/laptop-bank-tokens.ts`), not the CMS. Moving it needs `token()`
  to resolve per request, and `token()` is currently called at module scope to
  build the page content objects — so this is a real refactor of how Laptop Bank
  content is assembled, not another screen. **The right next phase.** Until
  then, retiring a token is a one-line code edit in one file, and
  `npm run verify:tokens` lists exactly what is outstanding.
- **SMS confirmation**, **the retention deletion job**, **the payment
  provider**, **analytics events** — unchanged from the phase 1 ledger, all
  blocked on things outside this codebase.

## Outstanding asks for IT for Youth

Unchanged from phase 1, and now all enterable through the admin rather than
needing a developer:

1. Everything `npm run verify:tokens` lists.
2. **Two figures per giving tier**, not one — a cedi amount and a sterling
   amount. Spec §3 requires dual currency; §11 supplies one token per tier.
3. The six launch PDFs, with a version and date each →
   **/admin/laptop-bank/records/document**.
4. The privacy notice body, all eight sections.
5. Confirmation on the phase 1 navigation ruling.
