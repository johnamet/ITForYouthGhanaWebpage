import Image from "next/image";
import Link from "next/link";
import { breadcrumbs } from "@/lib/content/site-config";

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

function formatDeadline(value: string | undefined) {
  if (!value) {
    return "Open";
  }

  return new Intl.DateTimeFormat("en-GH", {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}

export function TrainingCourseListingPage({
  page,
  courses,
}: TrainingCourseListingPageProps) {
  const freeCourses = courses.filter((course) => course.pricing.isFree).length;
  const categories = new Set(courses.map((course) => course.category)).size;
  const [catalogStat, categoryStat, freeStat, deadlineStat] = page.stats;
  const [comparisonSection, shortlistSection] = page.sections;
  const catalogSections = [comparisonSection, shortlistSection].filter(
    (section): section is NonNullable<typeof section> => Boolean(section),
  );
  const highlights = comparisonSection?.bullets?.length
    ? comparisonSection.bullets
    : trainingCatalogContent.highlights;
  const heroStats = [
    {
      value: String(courses.length),
      label: catalogStat?.label ?? "Courses available",
      description:
        catalogStat?.description ??
        "Seeded and live options across development, design, data, and career pathways.",
    },
    {
      value: String(categories),
      label: categoryStat?.label ?? "Categories",
      description:
        categoryStat?.description ??
        "Technical, creative, and employability-focused entry points for different starting points.",
    },
    {
      value: String(freeCourses),
      label: freeStat?.label ?? "Free options",
      description:
        freeStat?.description ??
        "No-cost routes that remove financial barriers for motivated first-time learners.",
    },
    {
      value: formatDeadline(trainingCatalogContent.cohorts[0]?.applicationDeadline),
      label: deadlineStat?.label ?? "Next deadline",
      description:
        deadlineStat?.description ??
        "Cohort 8 Foundations deadline. See the full timeline below for all upcoming dates.",
    },
  ];

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="absolute inset-0">
          <Image
            src={page.heroImage ?? trainingCatalogContent.heroImage}
            alt="Learners exploring training pathways"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(10,27,52,0.92)_0%,rgba(10,27,52,0.78)_44%,rgba(10,27,52,0.45)_100%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <nav
            aria-label="Breadcrumb"
            className="mb-10 flex flex-wrap items-center gap-2 text-sm text-white/70"
          >
            <Link href="/" className="transition hover:text-white">
              {breadcrumbs.home}
            </Link>
            <span>/</span>
            <Link href="/apply-for-training" className="transition hover:text-white">
              {breadcrumbs.apply.root}
            </Link>
            <span>/</span>
            <span className="text-white">{breadcrumbs.apply.courses}</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
                {page.eyebrow}
              </p>
              <h1 className="max-w-4xl font-heading text-5xl font-bold leading-tight sm:text-6xl">
                {page.title}
              </h1>
              <p className="max-w-3xl text-xl leading-8 text-slate-100">
                {page.description}
              </p>
              <p className="max-w-3xl text-base leading-8 text-white/78">{page.intro}</p>

              <div className="grid gap-3 sm:grid-cols-3">
                {highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="rounded-[24px] border border-white/12 bg-white/10 px-4 py-4 text-sm leading-7 text-white/82"
                  >
                    {highlight}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[28px] border border-white/12 bg-white/10 p-5 backdrop-blur-sm"
                >
                  <p className="font-heading text-4xl font-bold text-white">{stat.value}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{stat.label}</p>
                  <p className="mt-2 text-sm leading-7 text-white/65">{stat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
