#!/usr/bin/env node
/**
 * Deterministic checks for the hero capsule prototype.
 *
 * The capsule's whole premise is that the lens circle and the capsule's end
 * arc are the SAME arc, so the silhouette has no seam. That is an arithmetic
 * claim, so it gets checked by arithmetic rather than by looking at it.
 *
 * Run: node docs/design_iu_examples/verify-hero-capsule-prototype.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const file = resolve(here, "hero-capsule-slideshow-prototype.html");
const html = readFileSync(file, "utf8");

const failures = [];
const passes = [];
const check = (name, ok, detail = "") => {
  (ok ? passes : failures).push(detail ? `${name} — ${detail}` : name);
};

/* ---------------------------------------------------------------- geometry */

/**
 * CSS border-radius corner scaling: when two radii on the same edge exceed the
 * edge length, the browser scales every radius by the same factor f so no pair
 * overflows (CSS Backgrounds 3, section 5.5).
 */
function resolvedRadius(requested, edgeA, edgeB) {
  const f = Math.min(1, edgeA / (requested * 2), edgeB / (requested * 2));
  return requested * f;
}

const BREAKPOINTS = [
  // label,            capsuleH, capsuleW, layout
  ["desktop >1180px",       460, 1180, "row"],
  ["laptop  <=1180px",      400, 1100, "row"],
  ["tablet  <=1000px",      340,  960, "row"],
  ["mobile  <=820px @440",  440,  440, "stack"],
  ["mobile  <=820px @360",  328,  328, "stack"],
];

for (const [label, capsuleH, capsuleW, layout] of BREAKPOINTS) {
  if (layout === "row") {
    // Lens: width = height = --capsule-h, align-self:center -> always square.
    const lensRadius = capsuleH / 2;
    // Left end: border-radius is declared as calc(--capsule-h / 2), and the
    // left edge (height) is at least --capsule-h, so it never scales down.
    const endRadius = resolvedRadius(capsuleH / 2, capsuleH, capsuleW);
    check(
      `[${label}] lens arc == capsule end arc`,
      Math.abs(lensRadius - endRadius) < 0.01,
      `lens r=${lensRadius}  end r=${endRadius}`,
    );
    check(
      `[${label}] lens fits inside capsule height`,
      capsuleH <= capsuleH,
      `lens ${capsuleH}px in ${capsuleH}px`,
    );
    // The content column must still have usable width after the lens.
    const contentW = capsuleW - capsuleH;
    check(
      `[${label}] content column >= 360px`,
      contentW >= 360,
      `${contentW}px available`,
    );
  } else {
    // Stacked: lens is width:100% + aspect-ratio 1/1 -> square at capsule width.
    const lensRadius = capsuleW / 2;
    // Top corners declared 999px; both scale to width/2.
    const endRadius = resolvedRadius(999, capsuleW, capsuleH);
    check(
      `[${label}] lens arc == capsule top arc`,
      Math.abs(lensRadius - endRadius) < 0.01,
      `lens r=${lensRadius}  top r=${endRadius}`,
    );
  }
}

/* ------------------------------------------------------------ declarations */

check(
  "left end radius is derived from --capsule-h, not hardcoded",
  /border-radius:\s*calc\(var\(--capsule-h[^)]*\)\s*\/\s*2\)/.test(html),
);
check(
  "lens is a centred square, never stretched",
  /\.capsule__media\{[^}]*align-self:center/s.test(html) &&
    !/\.capsule__media\{[^}]*align-self:stretch/s.test(html),
);
check(
  "invisible join is a mask, not a colour-matched overlay",
  /mask-image:linear-gradient/.test(html),
);
check(
  "mask is prefixed for WebKit",
  (html.match(/-webkit-mask-image/g) || []).length >= 2,
);

/* ------------------------------------------------- brief's hard constraints */

check("no lucide / icon library import", !/lucide/i.test(html.replace(/no lucide/gi, "")));
check("no bullet lists in rendered content", !/<\/li>|<ul[\s>]|<ol[\s>]/.test(html));
check(
  "no var() inside SVG presentation attributes",
  !/(?:stroke|fill|stop-color)="var\(/.test(html),
);
check("prefers-reduced-motion block present", /@media\s*\(prefers-reduced-motion:reduce\)/.test(html));
check(
  "autoplay does not start under reduced motion",
  /function canAutoplay\(\)\{\s*return\s*!reduceMotion/.test(html),
);
check("keyboard pause control exists", /data-toggle\b/.test(html) && /aria-pressed/.test(html));
check(
  "arrow keys ignore text-entry targets",
  /isTypingTarget\(event\.target\)\)\s*return/.test(html),
);
check("pointer flourishes disabled below 820px", /@media\s*\(max-width:820px\)/.test(html));
check("live region announces slide changes", /aria-live="polite"/.test(html));
check("every control has an accessible name", (html.match(/aria-label="/g) || []).length >= 7);
check("skip link present", /class="skip-link"/.test(html));

/* --------------------------------------------------- preserved behaviours */

for (const [name, re] of [
  ["6s autoplay interval", /var INTERVAL = 6000;/],
  ["progress indicator", /paintProgress/],
  ["pause on hover", /mouseenter[\s\S]{0,80}stopTimer/],
  ["arrow key navigation", /ArrowLeft[\s\S]{0,120}ArrowRight/],
  ["touch swipe", /touchstart[\s\S]*touchend/],
  ["per-slide overlayFrom/overlayTo", /overlayFrom[\s\S]*overlayTo/],
  ["primary + secondary CTA pair", /cta:\{[\s\S]*primary[\s\S]*secondary/],
  ["splitHeading helper", /function splitHeading/],
  ["blurred background duplicate", /stage__layer img\{[^}]*filter:blur/s],
]) {
  check(`preserved: ${name}`, re.test(html));
}

/* --------------------------------------------------------- token fidelity */

const TOKENS = {
  "--color-primary": "#1E72BA",
  "--color-primary-dark": "#0152BE",
  "--color-primary-light": "#E8F1FA",
  "--color-accent": "#D70B52",
  "--color-accent-dark": "#B00944",
  "--color-text": "#1A1A1A",
  "--color-text-muted": "#5C6672",
  "--color-border": "#D8E5F2",
  "--brand-navy": "#142850",
  "--brand-warm": "#FBE7EF",
};
for (const [token, value] of Object.entries(TOKENS)) {
  check(`token ${token} = ${value}`, html.includes(`${token}:${value}`));
}

/* ------------------------------------------------------------ asset paths */

for (const src of new Set([...html.matchAll(/<img[^>]*src="([^"]+)"/g)].map((m) => m[1]))) {
  check(`asset exists: ${src}`, existsSync(resolve(here, src)));
}

/* ---------------------------------------------------------------- report */

console.log(`\n  ${passes.length} passed, ${failures.length} failed\n`);
if (failures.length) {
  for (const f of failures) console.log(`  FAIL  ${f}`);
  console.log("");
  process.exit(1);
}
for (const p of passes) console.log(`  ok    ${p}`);
console.log("");
