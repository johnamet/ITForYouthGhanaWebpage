import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

/**
 * The title template is applied by the nearest layout, so a page must supply
 * only its own name.
 *
 * app/(public)/layout.tsx sets template "%s | IT For Youth Ghana". Six pages
 * also appended the organisation name by hand, which rendered as
 * "Donate | IT For Youth Ghana | IT For Youth Ghana" in the browser tab, in
 * search results and in every link preview. Nothing failed: the string is
 * valid, the build is green, and only a human reading a tab would notice.
 *
 * openGraph.title is deliberately exempt. Next does not apply the title
 * template to it, so the organisation name there is correct and intended.
 */
/**
 * Read from source rather than imported: lib/content/site-config.ts resolves
 * "@/..." path aliases that only the bundler understands, so importing it into
 * a plain node test fails at resolution.
 */
const siteConfig = readFileSync("lib/content/site-config.ts", "utf8");
const read = (key: string) => {
  const match = siteConfig.match(new RegExp(`${key}:\\s*"([^"]+)"`));
  assert.ok(match, `lib/content/site-config.ts declares no ${key}`);
  return match[1];
};

const SITE_NAME = read("defaultTitle");
const TITLE_TEMPLATE = read("titleTemplate");

function pageFiles(dir: string, out: string[] = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) pageFiles(full, out);
    else if (entry === "page.tsx" || entry === "layout.tsx") out.push(full);
  }
  return out;
}

/** Strip every openGraph and twitter block so only templated titles remain. */
function withoutSocialBlocks(source: string) {
  let text = source;
  for (const key of ["openGraph", "twitter"]) {
    let index: number;
    while ((index = text.indexOf(`${key}: {`)) !== -1) {
      let depth = 0;
      let end = text.indexOf("{", index);
      for (let i = end; i < text.length; i += 1) {
        if (text[i] === "{") depth += 1;
        else if (text[i] === "}") {
          depth -= 1;
          if (depth === 0) {
            end = i;
            break;
          }
        }
      }
      text = text.slice(0, index) + text.slice(end + 1);
    }
  }
  return text;
}

describe("metadata titles", () => {
  it("declares the template exactly once, in the public layout", () => {
    const layout = readFileSync("app/(public)/layout.tsx", "utf8");
    assert.match(layout, /template: siteMeta\.titleTemplate/);
    assert.equal(TITLE_TEMPLATE, `%s | ${SITE_NAME}`);
  });

  it("never appends the organisation name to a templated title", () => {
    const offenders: string[] = [];

    for (const file of pageFiles("app")) {
      const source = withoutSocialBlocks(readFileSync(file, "utf8"));
      source.split("\n").forEach((line, index) => {
        if (!/^\s*title:/.test(line)) return;
        if (!line.includes(SITE_NAME)) return;
        // The layout's own default legitimately is the organisation name.
        if (/default:/.test(line) || /template:/.test(line)) return;
        offenders.push(`${file}:${index + 1} ${line.trim()}`);
      });
    }

    assert.deepEqual(
      offenders,
      [],
      `these titles render the organisation name twice once the template is applied:\n  ${offenders.join("\n  ")}`,
    );
  });
});
