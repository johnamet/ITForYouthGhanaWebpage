import { breadcrumbs } from "@/lib/content/site-config";

import { EditorialImageHero } from "@/components/shared/editorial-image-hero";
import { RouteCardGrid } from "@/components/shared/route-card-grid";
import { TrainingCourseCatalog } from "@/components/training/training-course-catalog";
import { TrainingCohortTimeline } from "@/components/training/training-cohort-timeline";
import { TrainingProcessStrip } from "@/components/training/training-process-strip";
import { trainingCatalogContent } from "@/lib/content/training-config";
import type { SitePage } from "@/types/content";
import type { Course } from "@/types/course";

type TrainingCourseListingPageProps = {
  page: SitePage;
  courses: Course[];
};

export function TrainingCourseListingPage({
  page,
  courses,
}: TrainingCourseListingPageProps) {
  const [comparisonSection, shortlistSection] = page.sections;
  const catalogSections = [comparisonSection, shortlistSection].filter(
    (section): section is NonNullable<typeof section> => Boolean(section),
  );
  return (
    <div className="bg-white">
      <EditorialImageHero
        imageSrc={page.heroImage ?? trainingCatalogContent.heroImage}
        imageAlt="Learners exploring training pathways"
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        supportingText={page.intro}
        breadcrumbs={[
          { label: breadcrumbs.home, href: "/" },
          { label: breadcrumbs.apply.root, href: "/apply-for-training" },
          { label: breadcrumbs.apply.courses },
        ]}
        priority
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-2">
          {catalogSections.map((section) => (
            <article
              key={section.title}
              className="rounded-[32px] border border-brand-border bg-white p-7 shadow-sm"
            >
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
                {page.overviewTitle ?? "Catalog guidance"}
              </p>
              <h2 className="mt-4 font-heading text-3xl font-bold text-brand-ink">
                {section.title}
              </h2>
              <p className="mt-4 text-sm leading-8 text-slate-600">{section.body}</p>
              {section.bullets?.length ? (
                <div className="mt-5 grid gap-3">
                  {section.bullets.map((bullet) => (
                    <p key={bullet} className="rounded-2xl bg-brand-mist/60 px-4 py-3 text-sm leading-7 text-slate-700">
                      {bullet}
                    </p>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <TrainingCourseCatalog courses={courses} />

      <div id="cohorts" className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8">
        <TrainingCohortTimeline
          eyebrow={page.operatingEyebrow ?? trainingCatalogContent.cohortsSectionEyebrow ?? "Upcoming cohorts"}
          title={
            page.operatingTitle ??
            trainingCatalogContent.cohortsSectionTitle ??
            "Cohort 8 Foundations is open. More programmes start in July and August."
          }
          description={
            page.operatingDescription ??
            trainingCatalogContent.cohortsSectionDescription ??
            "Review exact dates, formats, and deadlines so you can plan your application and participation with confidence."
          }
          cohorts={trainingCatalogContent.cohorts}
        />
      </div>

      <div id="process" className="bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <TrainingProcessStrip
            eyebrow={page.principlesEyebrow ?? trainingCatalogContent.processSectionEyebrow ?? "Apply process"}
            title={
              page.principlesTitle ??
              trainingCatalogContent.processSectionTitle ??
              "Four clear steps from interest to your first class"
            }
            description={
              page.principlesDescription ??
              trainingCatalogContent.processSectionDescription ??
              "We keep the process transparent. Know what to prepare, when decisions happen, and what support is available before you apply."
            }
            steps={trainingCatalogContent.process}
          />
        </div>
      </div>

      {page.related.length ? (
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="max-w-3xl space-y-3">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
                {page.exploreEyebrow ?? "Next steps"}
              </p>
              <h2 className="font-heading text-3xl font-bold text-brand-ink sm:text-4xl">
                {page.exploreTitle ?? "Not sure which course is right yet?"}
              </h2>
              <p className="text-base leading-8 text-slate-600">
                {page.exploreDescription ??
                  "Check eligibility guidance or review the full process before you apply. The team can also answer questions directly."}
              </p>
            </div>
            <RouteCardGrid cards={page.related} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
