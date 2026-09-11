import type { ComponentProps } from "react";

import type { CareersList } from "@/components/shared/careers-list";
import type { ImpactOverviewPage } from "@/components/impact/impact-overview-page";
import type { ForOrganisationsOverviewPage } from "@/components/organisations/for-organisations-overview-page";
import type { NewsHubPage } from "@/components/news/news-hub-page";
import type { PartnerDirectory } from "@/components/shared/partner-directory";
import type { PartnerWithUsOverviewPage } from "@/components/partnerships/partner-with-us-overview-page";
import type { TeamDirectory } from "@/components/shared/team-directory";
import type { TrainingCourseListingPage } from "@/components/training/training-course-listing-page";
import type { WhatWeDoOverviewPage } from "@/components/what-we-do/what-we-do-overview-page";
import type { ContentTypeDescriptor } from "@/lib/cms/descriptors/types";

/**
 * Everything the twenty-one previews need beyond the descriptor's own document.
 * Read once when the preview document loads: these are other screens' content,
 * and editing partners should not live-update the Our Impact preview.
 *
 * `courseCatalogue` is the BASE catalogue only. The courses preview merges the
 * draft's own courses over it on the client, because that list depends on what
 * the editor is typing.
 */
export type PreviewContext = {
  teamMembers: ComponentProps<typeof TeamDirectory>["members"];
  partners: ComponentProps<typeof PartnerDirectory>["partners"];
  jobs: ComponentProps<typeof CareersList>["jobs"];
  initiatives: ComponentProps<typeof WhatWeDoOverviewPage>["initiatives"];
  impactPartners: ComponentProps<typeof ImpactOverviewPage>["partners"];
  tracks: ComponentProps<typeof PartnerWithUsOverviewPage>["tracks"];
  articles: ComponentProps<typeof NewsHubPage>["articles"];
  courseCatalogue: ComponentProps<typeof TrainingCourseListingPage>["courses"];
  /**
   * The four service pages, for the For Organisations overview, which lists
   * them. Context rather than draft: editing a service does not live-update the
   * overview preview, the same way editing a partner does not live-update Our
   * Impact.
   */
  organisationServices: ComponentProps<typeof ForOrganisationsOverviewPage>["services"];
};

/**
 * The twenty-one descriptor keys with a previewable public route.
 *
 * These are the real `ContentTypeDescriptor.key` values, i.e. `page-<slug>` —
 * `PAGE_DESCRIPTORS` in `lib/content/cms-descriptors/pages.ts` keys every page
 * singleton as `page-${entry.key}` (confirmed against that file and against
 * `/admin/cms/page-who-we-are` in `app/(admin)/admin/documentation/page.tsx`),
 * not the bare slug. A bare-slug list here would never match a real
 * descriptor's `key`, so `isPreviewableDescriptor` would silently always
 * return false.
 *
 * Lives here rather than in `preview-registry.tsx` so that
 * `components/admin/admin-shell.tsx` — a `"use client"` module wrapping every
 * admin page — can import the key list without dragging all nineteen public
 * page components into the shared admin client chunk. This module has only
 * type-only imports and no renderers, so the key list costs nothing here.
 */
export const PREVIEWABLE_KEYS = [
  "page-who-we-are",
  "page-team",
  "page-partners",
  "page-careers",
  "page-what-we-do",
  "page-apply-for-training",
  "page-apply-who-can-apply",
  "page-apply-how-it-works",
  "page-apply-courses",
  "page-impact-overview",
  "page-impact-reports",
  "page-impact-testimonials",
  "page-impact-sdgs",
  "page-partner-with-us",
  "page-news-hub",
  "page-contact",
  // For Organisations, moved off its raw-JSON editor onto descriptors.
  "page-for-organisations",
  "page-corporate-training",
  "page-sponsorships",
  "page-hire-graduates",
  "page-staff-volunteering",
] as const;

export type PreviewableKey = (typeof PREVIEWABLE_KEYS)[number];

/**
 * Whether this descriptor's editor should show a preview. A collection has no
 * single page to preview, and a descriptor without a route has no page at all.
 *
 * The public-route field on `ContentTypeDescriptor` is `previewHref`, not
 * `route` — there is no `route` field on the type.
 */
export function isPreviewableDescriptor(
  descriptor: ContentTypeDescriptor,
): boolean {
  return (
    descriptor.shape === "singleton" &&
    Boolean(descriptor.previewHref) &&
    (PREVIEWABLE_KEYS as readonly string[]).includes(descriptor.key)
  );
}
