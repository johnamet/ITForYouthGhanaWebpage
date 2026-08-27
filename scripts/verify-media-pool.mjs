// Checks that every photograph referenced by lib/content/media-pool.ts still
// resolves: local files must exist on disk, Unsplash URLs must return 200.
// Run after changing the pool. A photograph withdrawn from Unsplash renders as
// a broken image in production, and this is the only thing that catches it.

import { readFile, access } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const source = await readFile(join(root, "lib/content/media-pool.ts"), "utf8");

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
  const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=400&q=60`;
  let response;
  try {
    response = await fetch(url, { method: "HEAD" });
  } catch {
    // A thrown exception is a transient network/DNS blip, not an answer.
    // Retry once after a short delay before treating it as a failure.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      response = await fetch(url, { method: "HEAD" });
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

const themes = [...source.matchAll(/^  "?([a-z-]+)"?:\s*\[$/gm)].map((m) => m[1]);
console.log(
  `Checked ${new Set(localPaths).size} local and ${new Set(unsplashIds).size} Unsplash photographs across ${themes.length} themes.`,
);

if (failures) {
  console.error(`${failures} failed.`);
  process.exit(1);
}
console.log("All photographs resolve.");
