import Image from "next/image";
import Link from "next/link";

import { RouteCardGrid } from "@/components/shared/route-card-grid";
import { TrainingCohortTimeline } from "@/components/training/training-cohort-timeline";
import { TrainingProcessStrip } from "@/components/training/training-process-strip";
import type { TrainingLandingContent } from "@/types/content";

type ApplyForTrainingOverviewPageProps = {
  content: TrainingLandingContent;
};

const anchorLinks = [
  { id: "overview", label: "Overview" },
  { id: "pathways", label: "Pathways" },
  { id: "cohorts", label: "Cohorts" },
  { id: "process", label: "Apply Process" },
];

export function ApplyForTrainingOverviewPage({
  content,
}: ApplyForTrainingOverviewPageProps) {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="absolute inset-0">
          <Image
            src={content.heroImage}
            alt="Learners in an IT For Youth Ghana training session"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(10,27,52,0.92)_0%,rgba(10,27,52,0.78)_45%,rgba(10,27,52,0.42)_100%)]" />
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
            <span className="text-white">Apply for Training</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
                {content.eyebrow}
              </p>
              <h1 className="max-w-4xl font-heading text-5xl font-bold leading-tight sm:text-6xl">
                {content.title}
              </h1>
              <p className="max-w-3xl text-xl leading-8 text-slate-100">
                {content.description}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/apply-for-training/courses"
                  className="rounded-full bg-brand-gold px-6 py-3.5 text-sm font-semibold text-brand-ink transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Browse courses
                </Link>
                <Link
                  href="/apply-for-training/how-it-works"
                  className="rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/15"
                >
                  See how it works
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {content.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[28px] border border-white/12 bg-white/10 p-5 backdrop-blur-sm"
                >
                  {stat.icon ? (
                    <span className="text-2xl" aria-hidden="true">
                      {stat.icon}
                    </span>
                  ) : null}
                  <p className="mt-3 font-heading text-3xl font-bold text-white">{stat.value}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{stat.label}</p>
                  {stat.description ? (
                    <p className="mt-2 text-sm leading-7 text-white/65">{stat.description}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="sticky top-[72px] z-30 border-y border-brand-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 py-4 [scrollbar-width:none] sm:px-6 lg:px-8">
          {anchorLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="whitespace-nowrap rounded-full border border-brand-border px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-gold hover:text-brand-ink"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <section id="overview" className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-6">
            <div className="max-w-3xl space-y-3">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
                Overview
              </p>
              <h2 className="font-heading text-3xl font-bold text-brand-ink sm:text-4xl">
                The training experience is built to turn interest into momentum
              </h2>
              <p className="text-base leading-8 text-slate-600">
                The public training routes should help learners answer three practical questions
                quickly: am I a fit, what can I study, and what happens next if I apply.
              </p>
            </div>

            <div className="grid gap-4">
              {content.focusAreas.map((area) => (
                <div
                  key={area.title}
                  className="rounded-[28px] border border-brand-border bg-white p-6 shadow-sm"
                >
                  <h3 className="font-heading text-2xl font-bold text-brand-ink">
                    {area.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{area.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] bg-brand-mist/55 p-8">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
              Learner support
            </p>
            <div className="mt-6 space-y-4">
              {content.supportPoints.map((point) => (
                <div
                  key={point}
                  className="rounded-[22px] border border-brand-border bg-white px-5 py-4 text-sm leading-7 text-slate-700"
                >
                  {point}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="pathways"
        className="scroll-mt-36 bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="max-w-3xl space-y-3">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
              Pathways
            </p>
            <h2 className="font-heading text-3xl font-bold text-brand-ink sm:text-4xl">
              Start with the route that answers your biggest question first
            </h2>
            <p className="text-base leading-8 text-slate-600">
              Some learners want to confirm fit before anything else. Others need the catalog or
              the application steps. The route structure is designed to support both.
            </p>
          </div>

          <RouteCardGrid cards={content.routeCards} />
        </div>
      </section>

      <div id="cohorts" className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8">
        <TrainingCohortTimeline
          eyebrow="Upcoming cohorts"
          title="See what is opening next before you commit"
          description="Timing clarity helps learners decide whether to apply now, wait for a better-fit intake, or ask the team a few more questions first."
          cohorts={content.cohorts}
        />
      </div>

      <div
        id="process"
        className="scroll-mt-36 bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <TrainingProcessStrip
            eyebrow="Apply process"
            title="A clearer path from first click to first class"
            description="The training journey is intentionally simple: choose the right route, apply, hear back clearly, and start with a stronger sense of what to expect."
            steps={content.process}
          />
        </div>
      </div>

      <section className="bg-brand-navy px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-4">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
              Ready to begin
            </p>
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">
              Move from interest into the route that fits your next season best
            </h2>
            <p className="max-w-3xl text-base leading-8 text-white/75">
              If you are not sure where to begin, start with the course catalog and come back to
              the fit or process pages whenever you need more clarity.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/apply-for-training/courses"
              className="rounded-full bg-brand-gold px-6 py-3.5 text-sm font-semibold text-brand-ink transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Explore courses
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/18 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/15"
            >
              Ask a question
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
