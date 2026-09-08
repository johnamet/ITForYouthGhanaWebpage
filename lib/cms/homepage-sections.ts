import type { JoinCtaCard } from "@/components/home/join-cta-block";
import type {
  ChallengeSectionContent,
  MissionSectionContent,
  OverviewSectionContent,
} from "@/components/home/legacy-homepage-sections";
import type { MarqueeTickerContent } from "@/components/home/marquee-ticker";
import type { NewsletterSignupContent } from "@/components/home/newsletter-signup-section";
import type { ProgrammeShowcaseItem } from "@/types/content";

/**
 * The seven homepage sections editable at /admin/content/homepage, keyed by
 * their `homepageSchema` field name. Every other homepage section is edited on
 * its own admin route and appears in the preview as read-only context.
 */
export type HomepageDraftValues = {
  ticker: MarqueeTickerContent;
  overviewSection: OverviewSectionContent;
  challengeSection: ChallengeSectionContent;
  missionSection: MissionSectionContent;
  programmeShowcase: ProgrammeShowcaseItem[];
  joinCtaCards: JoinCtaCard[];
  newsletterSignup: NewsletterSignupContent;
};

export type HomepageSectionKey = keyof HomepageDraftValues;

export type WorkspaceSection = {
  /** Stable id used in `?section=` and in postMessage payloads. */
  id: string;
  key: HomepageSectionKey;
  label: string;
  description: string;
  /** 1-based position among the fifteen sections the homepage renders. */
  order: number;
};

// This module is imported by client components, so it must never import
// lib/cms/admin-config.ts — that module reads the service-account private key
// via getAdminSdkStatus. The dependency runs the other way: admin-config.ts
// imports these labels. See the spec's client-safety constraint.
const SECTIONS = {
  marquee: {
    id: "marquee",
    key: "ticker",
    label: "Marquee ticker",
    description:
      "Rotating stats, calls to action, news headlines, and partner logos.",
    order: 2,
  },
  overview: {
    id: "overview",
    key: "overviewSection",
    label: "Overview section",
    description:
      "Introduction and story shown near the top of the homepage.",
    order: 3,
  },
  "challenge-section": {
    id: "challenge-section",
    key: "challengeSection",
    label: "Challenge section",
    description:
      "Digital-divide narrative, statistics, comparison lists, and support CTA.",
    order: 4,
  },
  "mission-section": {
    id: "mission-section",
    key: "missionSection",
    label: "Mission section",
    description:
      "Vision and mission narrative, supporting image, CTA, and visibility.",
    order: 5,
  },
  "programme-showcase": {
    id: "programme-showcase",
    key: "programmeShowcase",
    label: "Programme showcase",
    description: "Featured training, initiative, and pathway cards.",
    order: 7,
  },
  "join-cta": {
    id: "join-cta",
    key: "joinCtaCards",
    label: "Join CTA cards",
    description:
      "Learner, organisation, and volunteer CTA cards near the end of the homepage.",
    order: 14,
  },
  newsletter: {
    id: "newsletter",
    key: "newsletterSignup",
    label: "Newsletter signup",
    description:
      "Newsletter signup copy, interest tag, privacy note, and visibility toggle.",
    order: 15,
  },
} satisfies Record<string, WorkspaceSection>;

/** Lookup by section id. `satisfies` keeps every property exactly typed. */
export const workspaceSectionsById = SECTIONS;

/** The seven sections in public page order. */
export const workspaceSections: WorkspaceSection[] = Object.values(
  SECTIONS,
).sort((left, right) => left.order - right.order);

export const DEFAULT_WORKSPACE_SECTION_ID = "overview" as const;

/** Resolves a `?section=` value, falling back to the overview section. */
export function findWorkspaceSection(
  id: string | null | undefined,
): WorkspaceSection {
  return (
    workspaceSections.find((section) => section.id === id) ??
    SECTIONS[DEFAULT_WORKSPACE_SECTION_ID]
  );
}

/**
 * Whether a section will render nothing on the public homepage.
 *
 * Each branch mirrors the guard in the component that actually renders that
 * section, cited by file and line. A single generic `active === false` test is
 * NOT sufficient and was wrong in both directions: the narrative sections also
 * hide when their copy is blank, and an empty programme showcase is not hidden
 * at all because the page substitutes seed content. If you change a renderer's
 * guard, change its branch here too, or the rail will show a wrong badge.
 */
export function isSectionHiddenFromPage(
  key: HomepageSectionKey,
  values: HomepageDraftValues,
): boolean {
  switch (key) {
    // marquee-ticker.tsx always renders. Its `return null` belongs to a
    // separator helper, not to the section component.
    case "ticker":
      return false;

    // legacy-homepage-sections.tsx:62-66
    case "overviewSection": {
      const content = values.overviewSection;
      if (content.active === false) return true;
      const hasIntro = Boolean(
        content.title || content.headline || content.description,
      );
      const hasStory = Boolean(
        content.storyTitle ||
          content.storyHeadline ||
          content.storyDescription ||
          content.callout ||
          (content.ctaLabel && content.ctaHref),
      );
      return !hasIntro && !hasStory && !content.image;
    }

    // legacy-homepage-sections.tsx:71-72
    case "challengeSection": {
      const content = values.challengeSection;
      if (content.active === false) return true;
      return (
        !content.title &&
        !content.headline &&
        !content.description &&
        !content.stats.length &&
        !content.problemItems.length &&
        !content.solutionItems.length
      );
    }

    // legacy-homepage-sections.tsx:130-131
    case "missionSection": {
      const content = values.missionSection;
      if (content.active === false) return true;
      return (
        !content.title &&
        !content.headline &&
        !content.description &&
        !content.image &&
        !content.missionTitle &&
        !content.missionHeadline &&
        !content.missionDescription
      );
    }

    // An empty list is NOT hidden: homepage-sections.tsx:71 substitutes the
    // seed showcase, so InitiativesTree still renders. Only a non-empty list
    // with every item inactive renders nothing (initiatives-tree.tsx:70-72).
    case "programmeShowcase":
      return (
        values.programmeShowcase.length > 0 &&
        values.programmeShowcase.every((item) => item.active === false)
      );

    // join-cta-block.tsx:22-23 — empty or every card inactive.
    case "joinCtaCards":
      return (
        values.joinCtaCards.length === 0 ||
        values.joinCtaCards.every((card) => card.active === false)
      );

    // newsletter-signup-section.tsx:17-18
    case "newsletterSignup":
      return values.newsletterSignup.active === false;
  }
}
