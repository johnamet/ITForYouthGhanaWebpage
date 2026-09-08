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
