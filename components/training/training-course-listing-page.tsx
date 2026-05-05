import Image from "next/image";
import Link from "next/link";

import { TrainingCourseCatalog } from "@/components/training/training-course-catalog";
import { TrainingCohortTimeline } from "@/components/training/training-cohort-timeline";
import { TrainingProcessStrip } from "@/components/training/training-process-strip";
import { trainingCatalogContent } from "@/lib/content/training-config";
import type { Course } from "@/types/course";

type TrainingCourseListingPageProps = {
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
  courses,
}: TrainingCourseListingPageProps) {
  const freeCourses = courses.filter((course) => course.pricing.isFree).length;
  const categories = new Set(courses.map((course) => course.category)).size;

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="absolute inset-0">
          <Image
            src={trainingCatalogContent.heroImage}
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
              Home
            </Link>
            <span>/</span>
            <Link href="/apply-for-training" className="transition hover:text-white">
              Apply for Training
            </Link>
            <span>/</span>
            <span className="text-white">Courses</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
                {trainingCatalogContent.eyebrow}
              </p>
              <h1 className="max-w-4xl font-heading text-5xl font-bold leading-tight sm:text-6xl">
                {trainingCatalogContent.title}
              </h1>
              <p className="max-w-3xl text-xl leading-8 text-slate-100">
                {trainingCatalogContent.description}
              </p>

              <div className="grid gap-3 sm:grid-cols-3">
                {trainingCatalogContent.highlights.map((highlight) => (
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
              {[
                {
                  value: String(courses.length),
                  label: "Courses available",
                  description: "Pulled from the live portal when available, with seeded fallback coverage.",
                },
                {
                  value: String(categories),
                  label: "Categories",
                  description: "Different entry points across technical, creative, and career-facing skills.",
                },
                {
                  value: String(freeCourses),
                  label: "Free options",
                  description: "Routes that lower barriers for learners who need a stronger first step.",
                },
                {
                  value: formatDeadline(trainingCatalogContent.cohorts[0]?.applicationDeadline),
                  label: "Next deadline",
                  description: "Use the cohort timeline below if you are deciding based on start dates.",
                },
              ].map((stat) => (
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

      <TrainingCourseCatalog courses={courses} />

      <div id="cohorts" className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8">
        <TrainingCohortTimeline
          eyebrow="Upcoming cohorts"
          title="If timing matters most, use the next intake dates as your guide"
          description="These cohorts provide a clearer sense of when new pathways open, how long they run, and when learners need to act."
          cohorts={trainingCatalogContent.cohorts}
        />
      </div>

      <div id="process" className="bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <TrainingProcessStrip
            eyebrow="Apply process"
            title="From shortlist to start date, the next steps should feel understandable"
            description="The strongest applications come from learners who know what they are applying for, what commitment is expected, and how the onboarding sequence works."
            steps={trainingCatalogContent.process}
          />
        </div>
      </div>
    </div>
  );
}
