// Asserts that no public page shows the same pool photograph twice.
//
// ProseMediaCardGrid guarantees this WITHIN one grid, by resolving the group in
// a single resolveMediaSet call. It cannot guarantee it ACROSS grids: two grids
// on the same page resolve independently, and the theme pools overlap heavily
// (community and rural share 7 of their 8 photographs; three other pairs share
// 4 of 8). So a page with two or more grids can repeat an image even though
// each grid is internally clean.
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
} from '../lib/content/site-config';
import { newsHubContent } from '../lib/content/news-config';
import { contactPageContent } from '../lib/content/contact-config';
let fails = 0, pages = 0;
const t = (v: any) => v?.title?.trim() || v?.description?.trim();
function gate(name: string, grids: [string, any, string[]][]) {
  pages++;
  const urls: string[] = [];
  for (const [, theme, keys] of grids) resolveMediaSet(keys, theme).forEach((e) => urls.push(e.url));
  if (new Set(urls).size !== urls.length) {
    fails++;
    console.log(`FAIL ${name}  union ${new Set(urls).size}/${urls.length}  [${grids.map((g) => g[0] + ':' + g[1]).join(' ')}]`);
  }
}
for (const s of organisationServices as any[]) gate('for-organisations/' + s.slug, [
  ['ov', 'corporate', (s.overviewCards ?? []).filter(t).map((x: any) => `for-organisations:${s.slug}:ov:${x.title}`)],
  ['hiw', 'coding', (s.howItWorks ?? []).filter(t).map((x: any) => `for-organisations:${s.slug}:hiw:${x.title}`)],
  ['pk', 'entrepreneurship', (s.packages ?? []).filter((p: any) => p.name?.trim() || p.description?.trim()).map((p: any) => `for-organisations:${s.slug}:pk:${p.name}`)]]);
for (const p of partnershipTracks as any[]) gate('partner-with-us/' + p.slug, [
  ['focus(4a)', 'partnership', (p.focusCards ?? []).filter(t).map((c: any) => `partner-with-us:${p.slug}:${c.title}`)],
  ['hiw', 'training', (p.howItWorks ?? []).filter(t).map((x: any) => `partner-with-us:${p.slug}:hiw:${x.title}`)]]);
for (const i of initiatives as any[]) gate('what-we-do/' + i.slug, [
  ['hiw(4a)', 'training', (i.sections?.howItWorks ?? []).filter(t).map((x: any) => `what-we-do:${i.slug}:${x.title}`)]]);
gate('our-impact', [['measure', 'impact', (impactOverviewContent as any).measurementCards.map((c: any) => `our-impact:measure:${c.title}`)]]);
gate('our-impact/reports', [
  ['rr', 'impact', (impactReportsContent as any).reportResources.map((r: any) => `our-impact:rr:${r.title}`)],
  ['ev', 'training', (impactReportsContent as any).evidenceCards.map((c: any) => `our-impact:ev:${c.title}`)]]);
gate('our-impact/sdgs', [['goals', 'advocacy', (impactSdgsContent as any).goals.map((g: any) => `our-impact:sdg:${g.goal}`)]]);
gate('what-we-do', [
  ['eco', 'community', (whatWeDoOverviewContent as any).ecosystemCards.map((c: any) => `what-we-do:eco:${c.title}`)],
  ['path', 'training', (whatWeDoOverviewContent as any).pathwayCards.map((c: any) => `what-we-do:path:${c.title}`)]]);
gate('news-and-updates', [['pillars', 'community', (newsHubContent as any).editorialPillars.map((p: any) => `news:pillar:${p.title}`)]]);
gate('contact', [['steps', 'mentoring', (contactPageContent as any).responseSteps.map((s: any) => `contact:step:${s.number}`)]]);
for (const d of departments as any[]) gate('departments/' + d.slug, [
  ['svc', 'team', (d.services ?? []).map((s: any) => `departments:${d.slug}:${s.title}`)]]);

// Task 1 (phase 4b-2): the two grids the survey left unthemed. Both are
// single-grid pages, but `training` is checked here rather than assumed —
// see the module doc above on why an editorially-obvious theme still has to
// be gated.
gate('apply-for-training/who-can-apply', [
  ['audience', 'training', (whoCanApplyHub.sections ?? []).slice(0, 3).filter(t).map((s: any) => `training:audience:${s.title}`)]]);

// TrainingProcessStrip renders on three routes (apply-for-training,
// apply-for-training/courses, apply-for-training/how-it-works). Each is
// gated as its own page instance — the strip is the only grid on any of the
// three, so there is no co-located grid to collide with, but the theme
// still has to be checked per the rule above.
gate('apply-for-training', [
  ['process', 'training', (applyForTrainingHub.process ?? []).filter(t).map((s: any) => `training:process:${s.number}`)]]);
gate('apply-for-training/courses', [
  ['process', 'training', (trainingCoursesHub.process ?? []).filter(t).map((s: any) => `training:process:${s.number}`)]]);
gate('apply-for-training/how-it-works', [
  // TrainingHowItWorksPage derives its steps from the page's first four
  // sections rather than from a `process` field — see toProcessSteps in
  // components/training/training-how-it-works-page.tsx — so the gate
  // mirrors that derivation instead of reading a `process` array that page
  // never renders.
  ['process', 'training', (howItWorksHub.sections ?? []).slice(0, 4).filter(t).map((s: any, i: number) => `training:process:${String(i + 1).padStart(2, '0')}`)]]);

console.log(fails === 0 ? `ALL ${pages} PAGE INSTANCES PASS — page-level union distinct everywhere` : `${fails} of ${pages} FAILED`);
