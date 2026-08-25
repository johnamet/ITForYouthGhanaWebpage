import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const read = (path: string) => readFileSync(path, "utf8");

describe("homepage marquee composition", () => {
  it("loads CMS ticker content and renders it immediately after the hero", () => {
    const source = read("components/home/homepage-sections.tsx");

    assert.match(source, /getCmsHomepageTicker/);
    assert.match(source, /<MarqueeTicker ticker=\{ticker\} \/>/);

    const hero = source.indexOf("<HeroCapsuleSlideshow");
    const marquee = source.indexOf("<MarqueeTicker");
    const followingSection = source.indexOf("<LegacyHomepageSections");

    assert.ok(hero >= 0, "homepage hero is missing");
    assert.ok(marquee > hero, "marquee must follow the hero");
    assert.ok(followingSection > marquee, "marquee must stay at the hero boundary");
  });

  it("stops the ticker for reduced motion and hides duplicate links from assistive technology", () => {
    const source = read("components/home/marquee-ticker.tsx");

    assert.match(source, /motion-reduce:animate-none/);
    assert.match(source, /const isDuplicate = index >= effective\.length/);
    assert.match(source, /aria-hidden=\{isDuplicate \|\| undefined\}/);
    assert.match(source, /tabIndex=\{isDuplicate \? -1 : undefined\}/);
  });
});
