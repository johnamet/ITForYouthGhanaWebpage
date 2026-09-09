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

/** Canvas has mounted and can accept a payload. */
export type PreviewReadyMessage = { type: "itfyg:preview-ready" };

/** A viewer clicked an editable section in the preview. */
export type PreviewSelectMessage = {
  type: "itfyg:preview-select";
  sectionId: string;
};

/** A debounced draft payload. Always carries all seven sections. */
export type PreviewDraftMessage = {
  type: "itfyg:preview-draft";
  payloadVersion: number;
  values: HomepageDraftValues;
  activeSectionId: string;
};

/** The active section changed in the rail; scroll the preview to match. */
export type PreviewScrollMessage = {
  type: "itfyg:preview-scroll";
  sectionId: string;
};

export type CanvasToParentMessage = PreviewReadyMessage | PreviewSelectMessage;
export type ParentToCanvasMessage = PreviewDraftMessage | PreviewScrollMessage;

/**
 * The preview is same-origin by construction, so both directions reject any
 * message whose origin is not an exact match.
 */
export function isTrustedPreviewEvent(event: MessageEvent): boolean {
  return event.origin === window.location.origin;
}

/** DOM id of a preview section wrapper, used for scrolling and outlining. */
export function previewSectionDomId(sectionId: string): string {
  return `preview-section-${sectionId}`;
}
