import type { ComponentProps } from "react";

import type { DonationCampaign } from "@/components/home/donation-campaign";
import type { FeaturedStoryVideo } from "@/components/home/featured-story-video";
import type { HeroSlideshow } from "@/components/home/hero-slideshow";
import type { HomepageTeamSection } from "@/components/home/homepage-team-section";
import type { ImpactCounter } from "@/components/home/impact-counter";
import type { LatestNewsGrid } from "@/components/home/latest-news-grid";
import type { PartnersStrip } from "@/components/home/patrners-strip";
import type { TestimonialsSection } from "@/components/home/testimonials-section";
import type { HomepageDraftValues } from "@/lib/cms/homepage-sections";

export const PREVIEW_ROUTE = "/admin/content/homepage/preview";

/**
 * Published data for the eight sections the workspace does not own. Types are
 * derived from what each component actually accepts, so this cannot drift from
 * the components it feeds.
 */
export type PreviewContext = {
  slides: ComponentProps<typeof HeroSlideshow>["slides"];
  impactStats: ComponentProps<typeof ImpactCounter>["stats"];
  campaign: ComponentProps<typeof DonationCampaign>["campaign"];
  story: ComponentProps<typeof FeaturedStoryVideo>["story"];
  articles: ComponentProps<typeof LatestNewsGrid>["articles"];
  testimonials: ComponentProps<typeof TestimonialsSection>["testimonials"];
  teamMembers: ComponentProps<typeof HomepageTeamSection>["members"];
  partners: ComponentProps<typeof PartnersStrip>["partners"];
};

export type PreviewBaseline = {
  editable: HomepageDraftValues;
  context: PreviewContext;
};

// Re-export the shared protocol
export {
  PREVIEW_READY,
  PREVIEW_SELECT,
  PREVIEW_DRAFT,
  PREVIEW_SCROLL,
  isTrustedPreviewEvent,
  previewSectionDomId,
  type CanvasToParentMessage,
  type ParentToCanvasMessage,
  type PreviewDraftMessage,
  type PreviewReadyMessage,
  type PreviewScrollMessage,
  type PreviewSelectMessage,
} from "@/components/admin/workspace-kit/preview-protocol";
