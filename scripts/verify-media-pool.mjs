// Checks that every photograph referenced by lib/content/media-pool.ts still
// resolves: local files must exist on disk, Unsplash URLs must return 200.
// Run after changing the pool. A photograph withdrawn from Unsplash renders as
// a broken image in production, and this is the only thing that catches it.

import { readFile, access } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const source = await readFile(join(root, "lib/content/media-pool.ts"), "utf8");

// Node's built-in fetch (undici) sends no User-Agent by default, and
// images.unsplash.com rejects those requests outright (the connection is
// reset before any status line comes back, so it surfaces as a thrown
// "fetch failed" rather than a non-200 response). Do not remove this header:
// it is required for correctness, not a stylistic addition.
const FETCH_HEADERS = { "User-Agent": "itfyg-media-verifier" };

const unsplashIds = [...source.matchAll(/UNSPLASH\("([^"]+)"\)/g)].map((m) => m[1]);
const localPaths = [...source.matchAll(/url:\s*"(\/images\/[^"]+)"/g)].map((m) => m[1]);

let failures = 0;

for (const path of new Set(localPaths)) {
  try {
    await access(join(root, "public", path));
  } catch {
    console.error(`MISSING  ${path}`);
    failures += 1;
  }
}

for (const id of new Set(unsplashIds)) {
  // images.unsplash.com does not serve HEAD reliably: measured across all 30
  // unique IDs in the pool, HEAD requests threw "fetch failed" on roughly
  // half of them regardless of added delay, while a GET of a tiny rendition
  // (?w=32&q=20, ~1KB) was consistently 30/30 ok. Use a small GET instead of
  // HEAD here — do not "optimise" this back to HEAD.
  const url = `https://images.unsplash.com/${id}?w=32&q=20`;
  let response;
  try {
    response = await fetch(url, { headers: FETCH_HEADERS });
    await response.arrayBuffer();
  } catch {
    // A thrown exception is a transient network/DNS blip, not an answer.
    // Retry once after a short delay before treating it as a failure.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      response = await fetch(url, { headers: FETCH_HEADERS });
      await response.arrayBuffer();
    } catch (retryError) {
      console.error(`NETWORK  ${id}  ${retryError.message}`);
      failures += 1;
      continue;
    }
  }
  if (!response.ok) {
    // A real non-200 status is an answer, not a blip — fail immediately,
    // never retry.
    console.error(`HTTP ${response.status}  ${id}`);
    failures += 1;
  }
}

const themeMatches = [...source.matchAll(/^  "?([a-z-]+)"?:\s*\[$/gm)];
const themes = themeMatches.map((m) => m[1]);

// Report any theme with fewer than 8 entries. A short theme thins out
// resolveMediaSet's group-dedupe headroom (more sibling cards forced to
// repeat), but it is not itself a broken photograph, so it is a warning,
// not a build failure.
const MIN_THEME_ENTRIES = 8;
let shortThemes = 0;
for (let i = 0; i < themeMatches.length; i += 1) {
  const start = themeMatches[i].index + themeMatches[i][0].length;
  const end = i + 1 < themeMatches.length ? themeMatches[i + 1].index : source.length;
  const slice = source.slice(start, end);
  const entryCount = (slice.match(/(?:LOCAL\.\w+|\{\s*url:)/g) ?? []).length;
  if (entryCount < MIN_THEME_ENTRIES) {
    console.warn(`WARNING  theme "${themes[i]}" has only ${entryCount} entries (fewer than ${MIN_THEME_ENTRIES})`);
    shortThemes += 1;
  }
}

console.log(
  `Checked ${new Set(localPaths).size} local and ${new Set(unsplashIds).size} Unsplash photographs across ${themes.length} themes.`,
);
if (shortThemes) {
  console.warn(`${shortThemes} theme(s) below the ${MIN_THEME_ENTRIES}-entry minimum.`);
}

if (failures) {
  console.error(`${failures} failed.`);
  process.exit(1);
}
console.log("All photographs resolve.");
