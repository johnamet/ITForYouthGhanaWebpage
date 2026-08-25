import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

/**
 * A ratchet for the redesign's hard rules.
 *
 * The brief bans icons, visible bullet lists, and arbitrary radius values in
 * redesigned components. Those are mechanical properties, so they are checked
 * mechanically rather than trusted to review.
 *
 * REDESIGNED grows as more of the site is reworked. Files not listed here are
 * pre-redesign and deliberately exempt, so this stays a ratchet instead of a
 * repo-wide failure.
 */
const REDESIGNED = [
  "components/capsule/capsule-shell.tsx",
  "components/capsule/capsule-media.tsx",
  "components/capsule/capsule-content.tsx",
  "components/capsule/capsule-actions.tsx",
  "components/capsule/slideshow-stage.tsx",
  "components/capsule/slideshow-controls.tsx",
  "components/content/panel-list.tsx",
  "components/content/process-sequence.tsx",
  "components/home/hero-capsule-slideshow.tsx",
  "components/what-we-do/initiative-page.tsx",
  "components/what-we-do/what-we-do-overview-page.tsx",
  "components/what-we-do/initiative-orbit.tsx",
  "components/what-we-do/pathway-tree.tsx",
  "components/capsule/capsule-page-hero.tsx",
  "components/content/section-intro.tsx",
  "components/content/label-pills.tsx",
  "components/shared/route-card-grid.tsx",
  "components/home/closing-block.tsx",
  "components/home/programme-showcase.tsx",
  "components/training/apply-for-training-overview-page.tsx",
  "components/training/training-who-can-apply-page.tsx",
  "components/training/training-how-it-works-page.tsx",
  "components/training/training-course-listing-page.tsx",
  "components/training/training-course-catalog.tsx",
  "components/training/training-cohort-timeline.tsx",
  "components/training/training-process-strip.tsx",
  "components/programs/course-detail-card.tsx",
];

const read = (path: string) => readFileSync(path, "utf8");

describe("redesign design rules", () => {
  it("imports no icon library", () => {
    for (const path of REDESIGNED) {
      const source = read(path);
      assert.ok(!/from "lucide-react"/.test(source), `${path} imports lucide-react`);
      assert.ok(
        !/emojiToIconImage/.test(source),
        `${path} renders emoji-derived icons`,
      );
    }
  });

  it("renders no emoji", () => {
    // Covers the pictographic and dingbat ranges the content model uses.
    const emoji = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/u;
    for (const path of REDESIGNED) {
      const match = read(path).match(emoji);
      assert.equal(match, null, `${path} contains emoji ${match?.[0]}`);
    }
  });

  it("uses named radius tokens, never arbitrary values", () => {
    for (const path of REDESIGNED) {
      const hits = read(path).match(/rounded-\[[^\]]+\]/g);
      assert.equal(
        hits,
        null,
        `${path} uses arbitrary radii ${JSON.stringify(hits)}; use rounded-control, rounded-media, rounded-panel or rounded-capsule`,
      );
    }
  });

  it("never renders an unordered list in page content", () => {
    for (const path of REDESIGNED) {
      assert.ok(!/<ul[\s>]/.test(read(path)), `${path} renders a <ul>`);
    }
  });

  it("marks any ordered list as list-none so no marker is drawn", () => {
    for (const path of REDESIGNED) {
      const source = read(path);
      for (const tag of source.match(/<ol[^>]*>/g) ?? []) {
        assert.ok(
          /list-none/.test(tag),
          `${path} has an <ol> without list-none: ${tag}`,
        );
      }
    }
  });

  it("keeps every animation behind a reduced-motion fallback", () => {
    const globals = read("app/globals.css");
    const reduced = globals.slice(globals.indexOf("@media (prefers-reduced-motion: reduce)"));
    for (const cls of ["itfy-animate-capsule-in", "itfy-animate-bloom", "itfy-animate-bloom-rev", "itfy-animate-cue"]) {
      assert.ok(globals.includes(`.${cls}`), `${cls} is not defined`);
      assert.ok(reduced.includes(cls), `${cls} has no reduced-motion fallback`);
    }
  });

  it("never starts autoplay under reduced motion", () => {
    const source = read("components/capsule/use-slideshow.ts");
    assert.match(source, /prefersReducedMotion/);
    assert.match(source, /canAutoplay\s*=\s*autoplay\s*&&\s*!prefersReducedMotion/);
  });

  it("gives every slideshow control an accessible name", () => {
    const source = read("components/capsule/slideshow-controls.tsx");
    for (const name of ["Previous slide", "Next slide", "Pause slideshow", "Play slideshow"]) {
      assert.ok(source.includes(name), `missing accessible name: ${name}`);
    }
    // Pager buttons build their label from the slide, so check the template.
    assert.match(source, /aria-label=\{`Slide \$\{slide \+ 1\}/);
  });

  it("derives the capsule end radius from the lens size", () => {
    const globals = read("app/globals.css");
    assert.match(globals, /border-radius:\s*\n?\s*calc\(var\(--capsule-h\)\s*\/\s*2\)/);
    assert.ok(
      // [^}] already spans newlines, so the dotAll flag was never needed
      // (and it requires an ES2018 target, which this tsconfig does not set).
      /\.itfy-capsule__media\s*\{[^}]*align-self:\s*center/.test(globals),
      "the lens must be centred, never stretched, or it stops being square",
    );
  });

  it("keeps the pathway column weights out of an inline style", () => {
    // An inline grid-template-columns outranks every utility class, so the
    // stacked layout below 1024px could never override it.
    const source = read("components/what-we-do/pathway-tree.tsx");
    assert.ok(
      !/gridTemplateColumns:/.test(source),
      "column weights must arrive as --pathway-columns, not an inline grid declaration",
    );
    assert.match(source, /--pathway-columns/);

    const globals = read("app/globals.css");
    assert.match(globals, /\.itfy-pathway\s*\{[^}]*grid-template-columns:\s*var\(--pathway-columns/);
    assert.match(globals, /@media \(max-width: 1023px\)[\s\S]{0,200}grid-template-columns:\s*1fr/);
  });

  it("gates the orbit's proximity behaviour on a hover-capable pointer", () => {
    const source = read("components/what-we-do/initiative-orbit.tsx");
    assert.match(source, /\(min-width: 821px\) and \(hover: hover\)/);
    assert.match(source, /prefersReducedMotion/);
    // Click and focus must work regardless of pointer capability.
    assert.match(source, /onFocus=/);
    assert.match(source, /href=\{`\/what-we-do\//);
  });

  it("keeps var() out of SVG presentation attributes", () => {
    // CSS custom properties do not resolve there, so the ring would vanish.
    for (const path of REDESIGNED) {
      assert.ok(
        !/(?:stroke|fill|stopColor|stop-color)=\{?["']?var\(/.test(read(path)),
        `${path} puts var() in an SVG presentation attribute`,
      );
    }
  });
});
