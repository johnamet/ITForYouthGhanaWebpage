"use client";

import type { ReactElement } from "react";

import { ContentPage } from "@/components/shared/content-page";
import { ContactPage } from "@/components/contact/contact-page";
import { ImpactOverviewPage } from "@/components/impact/impact-overview-page";
import { ImpactReportsPage } from "@/components/impact/impact-reports-page";
import { ImpactSdgsPage } from "@/components/impact/impact-sdgs-page";
import { ImpactTestimonialsPage } from "@/components/impact/impact-testimonials-page";
import { NewsHubPage } from "@/components/news/news-hub-page";
import { PartnerDirectory } from "@/components/shared/partner-directory";
import { PartnerWithUsOverviewPage } from "@/components/partnerships/partner-with-us-overview-page";
import { CareersList } from "@/components/shared/careers-list";
import { TeamDirectory } from "@/components/shared/team-directory";
import { ApplyForTrainingOverviewPage } from "@/components/training/apply-for-training-overview-page";
import { TrainingCourseListingPage } from "@/components/training/training-course-listing-page";
import { TrainingHowItWorksPage } from "@/components/training/training-how-it-works-page";
import { TrainingWhoCanApplyPage } from "@/components/training/training-who-can-apply-page";
import { WhatWeDoOverviewPage } from "@/components/what-we-do/what-we-do-overview-page";
import { WhoWeArePage } from "@/components/who-we-are/who-we-are-page";
import { mergeCourseCatalog } from "@/lib/api/training";
import type { FormValues } from "@/lib/cms/descriptors/form-values";

import type { PreviewableKey, PreviewContext } from "./preview-context";

export { PREVIEWABLE_KEYS, isPreviewableDescriptor } from "./preview-context";
export type { PreviewableKey } from "./preview-context";

/**
 * Renders the public composition for one descriptor against draft values.
 *
 * The `: ReactElement` annotation is what makes this switch exhaustive: this
 * project does not set `noImplicitReturns`, so without it a missing case
 * widens the inferred return to include `undefined` — a valid ReactNode — and
 * the omission would compile clean and render blank.
 */
export function renderDescriptorPreview(
  key: PreviewableKey,
  values: FormValues,
  context: PreviewContext,
): ReactElement {
  // Every renderer here already tolerates partially-filled seed content, which
  // is exactly the shape a half-typed draft has.
  const doc = values as unknown as never;

  switch (key) {
    case "page-who-we-are":
      return <WhoWeArePage page={doc} />;
    case "page-team":
      return (
        <>
          <ContentPage page={doc} />
          <TeamDirectory members={context.teamMembers} />
        </>
      );
    case "page-partners":
      return (
        <>
          <ContentPage page={doc} />
          <PartnerDirectory partners={context.partners} />
        </>
      );
    case "page-careers":
      return (
        <>
          <ContentPage page={doc} />
          <CareersList jobs={context.jobs} />
        </>
      );
    case "page-what-we-do":
      return (
        <WhatWeDoOverviewPage content={doc} initiatives={context.initiatives} />
      );
    case "page-apply-for-training":
      return (
        <ApplyForTrainingOverviewPage
          page={doc}
          cohorts={(values.cohorts as never) ?? []}
          process={(values.process as never) ?? []}
        />
      );
    case "page-apply-who-can-apply":
      return <TrainingWhoCanApplyPage page={doc} />;
    case "page-apply-how-it-works":
      return <TrainingHowItWorksPage page={doc} />;
    case "page-apply-courses":
      return (
        <TrainingCourseListingPage
          page={doc}
          // Merged on the client: this list depends on the draft's own
          // courses, so a server-side read would show nothing change.
          courses={mergeCourseCatalog(
            context.courseCatalogue,
            values.courses as unknown[] | undefined,
          )}
        />
      );
    case "page-impact-overview":
      return (
        <ImpactOverviewPage content={doc} partners={context.impactPartners} />
      );
    case "page-impact-reports":
      return <ImpactReportsPage content={doc} />;
    case "page-impact-testimonials":
      return <ImpactTestimonialsPage content={doc} />;
    case "page-impact-sdgs":
      return <ImpactSdgsPage content={doc} />;
    case "page-partner-with-us":
      return <PartnerWithUsOverviewPage content={doc} tracks={context.tracks} />;
    case "page-news-hub":
      return <NewsHubPage content={doc} articles={context.articles} />;
    case "page-contact":
      return <ContactPage content={doc} />;
  }
}
