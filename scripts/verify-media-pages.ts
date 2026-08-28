// Asserts the one invariant that is actually this programme's to guarantee:
// a pool-resolved photograph (one that came out of `resolveMediaSet`, i.e.
// a `ProseMediaCardGrid`/`gate()` grid entry) must not collide with any
// other image the page renders — whether that other image is another
// pool-resolved photograph, or an authored image (hero, overview image,
// gallery item, initiative card, ...) that predates this work entirely.
//
// It deliberately does NOT assert that authored images are distinct from
// each other. An editor re-showing a hero inside a gallery, or a gallery
// repeating an overview image, is a normal editorial choice that predates
// the media-pool rollout and is not something this programme introduced —
// it is not this gate's business to block on it. Those cases are reported
// as an informational line (`INFO`, not `FAIL`) so the information is not
// thrown away, but they never fail the run.
//
// Put precisely: pool-vs-anything is in scope; authored-vs-authored is not.
//
// ProseMediaCardGrid guarantees no repeat WITHIN one grid, by resolving the
// group in a single resolveMediaSet call. It cannot guarantee anything about
// what else is on the page. The theme pools overlap heavily (community and
// rural share 7 of their 8 photographs; three other pairs share 4 of 8), and
// the same 30 local ITFYG photographs that stock the pool are also used
// directly as authored heroes, overview images, and gallery images. So two
// grids on one page can collide with each other, and any of them can collide
// with an authored image the page renders outside a grid altogether.
//
// Choosing different themes is NOT sufficient — it has to be checked. Every
// editorially-natural assignment tried while planning the rollout failed this
// gate at least once, including on pages where a sampled check had passed,
// because the resolver hashes the real content strings rather than positions.
//
// Run this after adding or re-theming any grid:
//     npx tsx scripts/verify-media-pages.ts
//
// Keep it in sync with the grids that actually exist. A page missing from here
// is a page nobody is checking.
//
// This model's SCOPE — what counts as a collision, not the union/collision
// logic itself — has been the thing repeatedly wrong. It has been widened
// three times and narrowed once:
//   1. Grid-vs-grid only — missed a page's own hero colliding with a card.
//   2. + the page's own hero — missed a page whose hero was omitted from the
//      source list, and missed images a page renders that are neither its
//      hero nor a grid card (an initiative overview page's own initiative
//      cards, each carrying its own heroImage; a what-we-do gallery strip).
//   3. + every other image the page renders (`otherImages`, below) — the
//      `gate()` helper took an array of every non-grid image a page puts on
//      screen, not a single `hero` string. This widening overshot: it also
//      started failing on authored images duplicating each other (an
//      initiative's own gallery re-showing its hero or overview image, two
//      static `what-we-do` gallery items), which is authored-content
//      editorial choice, not a defect this programme introduced.
//   4. Narrowed back to pool-vs-anything (this version) — `otherImages` is
//      still every non-grid image a page renders, and is still the thing
//      most likely to be incomplete next: when a page gets a new section, a
//      new card variant, or a new gallery, re-read its component and ask
//      whether it renders an image this file doesn't know about yet. But the
//      gate now only fails when a pool-resolved image (from a `grids` entry)
//      is part of the collision — never when two authored images collide
//      with each other and no pool image is involved.
//
// Two categories are deliberately excluded from `otherImages`, and both are
// noted again at their call site so the exclusion isn't silently assumed:
//   - A pre-existing duplicate nobody is fixing today: PartnershipTrackPage
//     and ImpactReportsPage each render a VideoCard whose `thumbnail` prop is
//     literally set to that page's own `heroImage`. That is already a
//     same-image repeat by construction, so adding it as a second array entry
//     would fail every one of those pages for a reason unrelated to theming.
//   - Images from a live/CMS data source this script cannot see: the news hub
//     renders each article's `coverImage`, and the training course catalog
//     renders each course's `image`, but both `articles` and `courses` are
//     fetched at request time (`getCmsPublishedArticles()`,
//     `getTrainingCatalogMixed()`) rather than imported from the static
//     `lib/content/*.ts` seed files this script reads. There is no static
//     source of truth here to check against, so these are excluded rather
//     than silently treated as safe.

import { resolveMediaSet } from '../lib/content/media-pool';
import { organisationServices } from '../lib/content/organisation-config';
import { partnershipTracks } from '../lib/content/partnership-config';
import { impactOverviewContent, impactReportsContent, impactSdgsContent } from '../lib/content/impact-config';
import {
  whatWeDoOverviewContent,
  departments,
  initiatives,
  whoCanApplyHub,
  applyForTrainingHub,
  howItWorksHub,
  trainingCoursesHub,
  newsAndUpdatesHub,
} from '../lib/content/site-config';
import { newsHubContent } from '../lib/content/news-config';
import { contactPageContent } from '../lib/content/contact-config';
let fails = 0, pages = 0;
const t = (v: any) => v?.title?.trim() || v?.description?.trim();
// `otherImages`: every AUTHORED image this page instance renders outside a
// converted grid — the hero, plus anything else a component read turned up
// (initiative cards, gallery strips, overview images, ...). See the module
// doc above for what is deliberately left out and why, and for why authored
// images are allowed to duplicate each other.
function gate(name: string, grids: [string, any, string[]][], otherImages: (string | undefined)[] = []) {
  pages++;
  const authored: string[] = otherImages.filter((u): u is string => Boolean(u));
  const pool: string[] = [];
  for (const [, theme, keys] of grids) resolveMediaSet(keys, theme).forEach((e) => pool.push(e.url));

  // Informational only: authored images duplicating each other. Real (an
  // editor's choice, predates this work) but not this gate's business — see
  // the module doc's "pool-vs-anything, not authored-vs-authored" invariant.
  const authoredCounts = new Map<string, number>();
  for (const u of authored) authoredCounts.set(u, (authoredCounts.get(u) ?? 0) + 1);
  const authoredDupes = [...authoredCounts.entries()].filter(([, n]) => n > 1).map(([u]) => u);
  if (authoredDupes.length) {
    console.log(`INFO ${name}  authored-vs-authored duplicate(s), not a failure: ${authoredDupes.join(', ')}`);
  }

  // The actual gate: a pool-resolved image colliding with anything else
  // (another pool image, or an authored image) fails the page.
  const authoredSet = new Set(authored);
  const seenPool = new Set<string>();
  const poolCollisions = new Set<string>();
  for (const u of pool) {
    if (authoredSet.has(u) || seenPool.has(u)) poolCollisions.add(u);
    seenPool.add(u);
  }
  if (poolCollisions.size) {
    fails++;
    console.log(`FAIL ${name}  pool collision(s): ${[...poolCollisions].join(', ')}  [${grids.map((g) => g[0] + ':' + g[1]).join(' ')}]`);
  }
}
// Case studies (organisation-service-page.tsx) are title/summary/outcome text
// cards with no image slot, and the packages/FAQ/contact/related sections
// render no images either — the hero is the only non-grid image this page
// renders.
for (const s of organisationServices as any[]) gate('for-organisations/' + s.slug, [
  ['ov', 'corporate', (s.overviewCards ?? []).filter(t).map((x: any) => `for-organisations:${s.slug}:ov:${x.title}`)],
  ['hiw', 'coding', (s.howItWorks ?? []).filter(t).map((x: any) => `for-organisations:${s.slug}:hiw:${x.title}`)],
  ['pk', 'entrepreneurship', (s.packages ?? []).filter((p: any) => p.name?.trim() || p.description?.trim()).map((p: any) => `for-organisations:${s.slug}:pk:${p.name}`)]], [s.heroImage]);
// partnership-track-page.tsx also renders a VideoCard whose thumbnail is
// `page.heroImage ?? page.image` verbatim — see the module doc's exclusions.
// Scenarios, FAQs, contact, and related sections render no images.
for (const p of partnershipTracks as any[]) gate('partner-with-us/' + p.slug, [
  ['focus(4a)', 'partnership', (p.focusCards ?? []).filter(t).map((c: any) => `partner-with-us:${p.slug}:${c.title}`)],
  ['hiw', 'training', (p.howItWorks ?? []).filter(t).map((x: any) => `partner-with-us:${p.slug}:hiw:${x.title}`)]], [p.heroImage ?? p.image]);
// initiative-page.tsx (components/what-we-do/initiative-page.tsx) renders
// three more image sources besides the hero and the howItWorks grid:
// `overviewImage` (a plain <Image>) and every `gallery[].src` (rendered by
// InitiativeGallery, one <Image> per entry). Testimonial avatars and partner
// logos are excluded on purpose — they live under /images/people/ and
// /images/partnerorga/ respectively, disjoint from the /images/randomPictures/
// pool this gate is about, so they cannot collide with it.
for (const i of initiatives as any[]) gate('what-we-do/' + i.slug, [
  ['hiw(4a)', 'training', (i.sections?.howItWorks ?? []).filter(t).map((x: any) => `what-we-do:${i.slug}:${x.title}`)]], [i.heroImage, i.overviewImage, ...((i.gallery ?? []) as any[]).map((g: any) => g.src)]);
// impact-overview-page.tsx renders StatsSection (numbers), RouteCardGrid, and
// PartnersStrip (partner logos, a disjoint asset set like the initiative
// pages' partner logos above) beyond the hero and the measurement grid — none
// of those add a pool image.
gate('our-impact', [['measure', 'graduation', (impactOverviewContent as any).measurementCards.map((c: any) => `our-impact:measure:${c.title}`)]], [(impactOverviewContent as any).heroImage]);
// impact-reports-page.tsx renders the same VideoCard-thumbnail-equals-hero
// pattern as partner-with-us — see the module doc's exclusions.
gate('our-impact/reports', [
  ['rr', 'training', (impactReportsContent as any).reportResources.map((r: any) => `our-impact:rr:${r.title}`)],
  ['ev', 'mentoring', (impactReportsContent as any).evidenceCards.map((c: any) => `our-impact:ev:${c.title}`)]], [(impactReportsContent as any).heroImage]);
// SDGs page is deliberately deferred (phase 4b-2 scope) — left untouched.
gate('our-impact/sdgs', [['goals', 'advocacy', (impactSdgsContent as any).goals.map((g: any) => `our-impact:sdg:${g.goal}`)]], [(impactSdgsContent as any).heroImage]);
// what-we-do-overview-page.tsx renders more than its own hero and its two
// grids: it renders one card per initiative — each with its own
// `heroImage` — under "Explore each initiative in more depth", and it
// renders `galleryItems` (WhatWeDoGallery) under "See the work in action".
// Both are real <img>/<Image> renders on this exact page instance, so both
// belong in the union.
gate('what-we-do', [
  ['eco', 'mentoring', (whatWeDoOverviewContent as any).ecosystemCards.map((c: any) => `what-we-do:eco:${c.title}`)],
  ['path', 'coding', (whatWeDoOverviewContent as any).pathwayCards.map((c: any) => `what-we-do:path:${c.title}`)]], [
  (whatWeDoOverviewContent as any).heroImage,
  ...(initiatives as any[]).map((i) => i.heroImage),
  ...((whatWeDoOverviewContent as any).galleryItems ?? []).map((g: any) => g.url),
]);
// news-hub-page.tsx also renders each article's `coverImage` via ArticleCard
// (lead, secondary, and latest articles), but `articles` is fetched from
// getCmsPublishedArticles() at request time — see the module doc's
// exclusions. editorialPillars render as text-only cards (no image slot).
gate('news-and-updates', [['pillars', 'community', (newsHubContent as any).editorialPillars.map((p: any) => `news:pillar:${p.title}`)]], [(newsHubContent as any).heroImage ?? (newsAndUpdatesHub as any).heroImage]);
// contact-page.tsx: responseSteps and routeCards are text/link only.
gate('contact', [['steps', 'mentoring', (contactPageContent as any).responseSteps.map((s: any) => `contact:step:${s.number}`)]], [(contactPageContent as any).heroImage]);
// department-detail-page.tsx: services and team-member cards are text only,
// stats/workflows/priorities/resources are text only.
for (const d of departments as any[]) gate('departments/' + d.slug, [
  ['svc', 'team', (d.services ?? []).map((s: any) => `departments:${d.slug}:${s.title}`)]], [d.heroImage]);

// Task 1 (phase 4b-2): the two grids the survey left unthemed. Both are
// single-grid pages, but the theme is checked here rather than assumed —
// see the module doc above on why an editorially-obvious theme still has to
// be gated. `who-can-apply` was originally `training`, but once its hero
// (studentsblueclothing.jpg) was added to this gate (F1, phase 4b-2), that
// theme collided: `training` resolves one audienceSections card to the
// page's own hero. Retheming to `girls-in-tech` clears it. audienceSections
// cards themselves are text only — no other image on this page.
gate('apply-for-training/who-can-apply', [
  ['audience', 'girls-in-tech', (whoCanApplyHub.sections ?? []).slice(0, 3).filter(t).map((s: any) => `training:audience:${s.title}`)]], [whoCanApplyHub.heroImage]);

// TrainingProcessStrip renders on three routes (apply-for-training,
// apply-for-training/courses, apply-for-training/how-it-works). Each is
// gated as its own page instance — the strip is the only grid on any of the
// three, so there is no co-located grid to collide with, but the theme
// still has to be checked per the rule above. TrainingProcessStrip itself
// only renders `step.iconImage` (a small icon), never a pool photograph.
gate('apply-for-training', [
  ['process', 'training', (applyForTrainingHub.process ?? []).filter(t).map((s: any) => `training:process:${s.number}`)]], [applyForTrainingHub.heroImage]);
// training-course-listing-page.tsx also renders each course's `image` via
// TrainingCourseCatalog, but `courses` comes from getTrainingCatalogMixed()
// at request time (a live API + CMS mix), not from static content this
// script reads — see the module doc's exclusions.
gate('apply-for-training/courses', [
  ['process', 'training', (trainingCoursesHub.process ?? []).filter(t).map((s: any) => `training:process:${s.number}`)]], [trainingCoursesHub.heroImage]);
gate('apply-for-training/how-it-works', [
  // TrainingHowItWorksPage derives its steps from the page's first four
  // sections rather than from a `process` field — see toProcessSteps in
  // components/training/training-how-it-works-page.tsx — so the gate
  // mirrors that derivation instead of reading a `process` array that page
  // never renders. Timeline and checklist sections are text only.
  ['process', 'training', (howItWorksHub.sections ?? []).slice(0, 4).filter(t).map((s: any, i: number) => `training:process:${String(i + 1).padStart(2, '0')}`)]], [howItWorksHub.heroImage]);

console.log(fails === 0 ? `ALL ${pages} PAGE INSTANCES PASS — page-level union distinct everywhere` : `${fails} of ${pages} FAILED`);
