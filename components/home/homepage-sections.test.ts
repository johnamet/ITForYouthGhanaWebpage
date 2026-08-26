import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const read = (path: string) => readFileSync(path, "utf8");

describe("homepage editorial composition", () => {
  it("adopts the template chapter order through typed section blocks", () => {
    const source = read("components/home/homepage-sections.tsx");
    const ids = [
      "home-hero",
      "home-manifesto",
      "home-programmes",
      "home-impact",
      "home-story",
      "home-involve",
      "home-news",
      "home-closing",
    ];

    let previous = -1;
    for (const id of ids) {
      const position = source.indexOf(`id: "${id}"`);
      assert.ok(position > previous, `${id} must follow the preceding template chapter`);
      previous = position;
    }

    assert.match(source, /const sections: PageSection\[\]/);
    assert.match(source, /<PageSectionRenderer/);
    assert.match(source, /<SectionNavigation/);
    assert.doesNotMatch(source, /<LegacyHomepageSections|<HeroCapsuleSlideshow|<TestimonialsSection/);
  });

  it("keeps every adopted homepage chapter connected to CMS-backed data", () => {
    const source = read("components/home/homepage-sections.tsx");
    for (const reader of [
      "getCmsHeroSlides",
      "getCmsChallengeSection",
      "getCmsMissionSection",
      "getCmsOverviewSection",
      "getCmsProgrammeShowcase",
      "getCmsImpactStats",
      "getCmsDonationCampaign",
      "getCmsFeaturedStory",
      "getCmsJoinCtaCards",
      "getCmsFeaturedArticles",
      "getCmsNewsletterSignup",
    ]) {
      assert.match(source, new RegExp(reader), `${reader} must remain in the homepage data flow`);
    }
  });

  it("disables automatic hero movement when reduced motion is requested", () => {
    const source = read("components/page-sections/editorial-hero.tsx");
    assert.match(source, /prefers-reduced-motion: reduce/);
    assert.match(source, /media\.matches/);
    assert.match(source, /motion-reduce:transition-none/);
  });
});
