"use client";

import type { ReactElement } from "react";

import { ContentPage } from "@/components/shared/content-page";
import { ContactPage } from "@/components/contact/contact-page";
import { ImpactOverviewPage } from "@/components/impact/impact-overview-page";
import { ImpactReportsPage } from "@/components/impact/impact-reports-page";
import { ImpactSdgsPage } from "@/components/impact/impact-sdgs-page";
import { ImpactTestimonialsPage } from "@/components/impact/impact-testimonials-page";
import { NewsHubPage } from "@/components/news/news-hub-page";
import { ForOrganisationsOverviewPage } from "@/components/organisations/for-organisations-overview-page";
// Aliased because the component and the content type share the name
// `OrganisationServicePage`, exactly as app/(public)/for-organisations/[slug]
// aliases it for the same reason.
import { OrganisationServicePage as OrganisationServiceTemplate } from "@/components/organisations/organisation-service-page";
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
import type {
  ContactPageContent,
  ImpactOverviewContent,
  ImpactReportsContent,
  ImpactSdgsContent,
  ImpactTestimonialsContent,
  NewsHubContent,
  OrganisationOverviewContent,
  OrganisationServicePage,
  PartnershipOverviewContent,
  SitePage,
  TrainingCohort,
  TrainingProcessStep,
  WhatWeDoOverviewContent,
} from "@/types/content";

import type { PreviewableKey, PreviewContext } from "./preview-context";

export type { PreviewableKey } from "./preview-context";

/**
 * Renders the public composition for one descriptor against the merged draft
 * document.
 *
 * `merged` is what `previewDocument` produces — the NESTED shape the public
 * getters hand their renderers, not the flat `FormValues` the form holds. That
 * distinction is the whole of this file's contract; see preview-document.ts.
 *
 * EVERY ARM CASTS TO ITS OWN RENDERER'S PROP TYPE, on purpose. A single
 * `as unknown as never` stood here and silenced all sixteen prop contracts at
 * once, which is exactly why a whole-document shape error survived a
 * type-check, a lint and a task-scoped review. A named target per arm means a
 * renderer that changes its prop type breaks this file rather than the
 * preview.
 *
 * The `: ReactElement` annotation is what makes this switch exhaustive: this
 * project does not set `noImplicitReturns`, so without it a missing case
 * widens the inferred return to include `undefined` — a valid ReactNode — and
 * the omission would compile clean and render blank.
 */
export function renderDescriptorPreview(
  key: PreviewableKey,
  merged: Record<string, unknown>,
  context: PreviewContext,
): ReactElement {
  switch (key) {
    case "page-who-we-are":
      return <WhoWeArePage page={merged as unknown as SitePage} />;
    case "page-team":
      return (
        <>
          <ContentPage page={merged as unknown as SitePage} />
          <TeamDirectory members={context.teamMembers} />
        </>
      );
    case "page-partners":
      return (
        <>
          <ContentPage page={merged as unknown as SitePage} />
          <PartnerDirectory partners={context.partners} />
        </>
      );
    case "page-careers":
      return (
        <>
          <ContentPage page={merged as unknown as SitePage} />
          <CareersList jobs={context.jobs} />
        </>
      );
    case "page-what-we-do":
      return (
        <WhatWeDoOverviewPage
          content={merged as unknown as WhatWeDoOverviewContent}
          initiatives={context.initiatives}
        />
      );
    case "page-apply-for-training":
      return (
        <ApplyForTrainingOverviewPage
          page={merged as unknown as SitePage}
          cohorts={(merged.cohorts as TrainingCohort[] | undefined) ?? []}
          process={(merged.process as TrainingProcessStep[] | undefined) ?? []}
        />
      );
    case "page-apply-who-can-apply":
      return <TrainingWhoCanApplyPage page={merged as unknown as SitePage} />;
    case "page-apply-how-it-works":
      return <TrainingHowItWorksPage page={merged as unknown as SitePage} />;
    case "page-apply-courses":
      return (
        <TrainingCourseListingPage
          page={merged as unknown as SitePage}
          /**
           * INERT TODAY, AND KEPT ANYWAY.
           *
           * `merged.courses` is always undefined: no descriptor field
           * generates a `courses` key, and the merge drops a stored key the
           * seed does not declare — `trainingCoursesHub` does not. So this
           * merge currently returns the base catalogue unchanged.
           *
           * It stays because every arm here mirrors exactly what its public
           * route does, and `/apply-for-training/courses` really does call
           * `getTrainingCatalogMixed(page.courses)`. Dropping the call would
           * make the preview diverge from the page the day `courses` becomes
           * editable, and that divergence would be silent.
           */
          courses={mergeCourseCatalog(
            context.courseCatalogue,
            merged.courses as unknown[] | undefined,
          )}
        />
      );
    case "page-impact-overview":
      return (
        <ImpactOverviewPage
          content={merged as unknown as ImpactOverviewContent}
          partners={context.impactPartners}
        />
      );
    case "page-impact-reports":
      return (
        <ImpactReportsPage content={merged as unknown as ImpactReportsContent} />
      );
    case "page-impact-testimonials":
      return (
        <ImpactTestimonialsPage
          content={merged as unknown as ImpactTestimonialsContent}
        />
      );
    case "page-impact-sdgs":
      return <ImpactSdgsPage content={merged as unknown as ImpactSdgsContent} />;
    case "page-partner-with-us":
      return (
        <PartnerWithUsOverviewPage
          content={merged as unknown as PartnershipOverviewContent}
          tracks={context.tracks}
        />
      );
    case "page-news-hub":
      return (
        <NewsHubPage
          content={merged as unknown as NewsHubContent}
          articles={context.articles}
        />
      );
    case "page-contact":
      return <ContactPage content={merged as unknown as ContactPageContent} />;
    case "page-for-organisations":
      return (
        <ForOrganisationsOverviewPage
          content={merged as unknown as OrganisationOverviewContent}
          services={context.organisationServices}
        />
      );
    /**
     * The four services render one component from their own document and take
     * nothing from context, so they share an arm rather than repeating it four
     * times. Listed individually because the switch is the exhaustiveness
     * check: a fifth service added to the seed shows up here as a compile
     * error rather than as a preview that silently renders nothing.
     */
    case "page-corporate-training":
    case "page-sponsorships":
    case "page-hire-graduates":
    case "page-staff-volunteering":
      return (
        <OrganisationServiceTemplate
          page={merged as unknown as OrganisationServicePage}
        />
      );
  }
}
