import Link from "next/link";

import { EditorialImageHero } from "@/components/shared/editorial-image-hero";
import { RouteCardGrid } from "@/components/shared/route-card-grid";
import { TrainingCohortTimeline } from "@/components/training/training-cohort-timeline";
import { TrainingProcessStrip } from "@/components/training/training-process-strip";
import type { SitePage, TrainingCohort, TrainingProcessStep } from "@/types/content";

type ApplyForTrainingOverviewPageProps = {
  page: SitePage;
  cohorts: TrainingCohort[];
  process: TrainingProcessStep[];
};

const anchorLinks = [
  { id: "overview", label: "Overview" },
  { id: "pathways", label: "Pathways" },
  { id: "cohorts", label: "Cohorts" },
  { id: "process", label: "Apply Process" },
];

export function ApplyForTrainingOverviewPage({
  page,
  cohorts,
  process,
}: ApplyForTrainingOverviewPageProps) {
  const [primaryCta, secondaryCta] = page.ctas;
  const [supportSection, ...focusSections] = page.sections;
  const supportPoints = supportSection?.bullets?.length
    ? supportSection.bullets
    : page.sections.flatMap((section) => section.bullets ?? []).slice(0, 4);

  return (
    <div className="bg-white">
      <EditorialImageHero
        imageSrc={page.heroImage ?? "/images/randomPictures/peterblackboard.jpg"}
        imageAlt="Learners in an IT For Youth Ghana training session"
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        supportingText={page.intro}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Apply for Training" }]}
        ctas={[
          ...(primaryCta ? [{ ...primaryCta, variant: "primary" as const }] : []),
          ...(secondaryCta ? [{ ...secondaryCta, variant: "secondary" as const }] : []),
        ]}
        priority
      />

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
                {page.overviewTitle ?? "The training experience is built to turn interest into momentum"}
              </h2>
              <p className="text-base leading-8 text-slate-600">
                {page.overviewDescription ??
                  "The public training routes should help learners answer three practical questions quickly: am I a fit, what can I study, and what happens next if I apply."}
              </p>
            </div>

            <div className="grid gap-4">
              {focusSections.slice(0, 3).map((area) => (
                <div
                  key={area.title}
                  className="rounded-[28px] border border-brand-border bg-white p-6 shadow-sm"
                >
                  <h3 className="font-heading text-2xl font-bold text-brand-ink">
                    {area.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{area.body}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="border-l-2 border-brand-gold py-2 pl-6 sm:pl-8">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
              Learner support
            </p>
            <h3 className="mt-4 font-heading text-3xl font-bold leading-tight text-brand-ink">
              Support should feel connected, not added on later
            </h3>
            <p className="mt-5 text-base leading-8 text-slate-600">
              {supportPoints.join(" ")}
            </p>
          </aside>
        </div>
      </section>

      <section
        id="pathways"
        className="scroll-mt-36 bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="max-w-3xl space-y-3">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
              {page.operatingEyebrow ?? "Pathways"}
            </p>
            <h2 className="font-heading text-3xl font-bold text-brand-ink sm:text-4xl">
              {page.operatingTitle ?? "Start with the route that answers your biggest question first"}
            </h2>
            <p className="text-base leading-8 text-slate-600">
              {page.operatingDescription ??
                "Some learners want to confirm fit before anything else. Others need the catalog or the application steps. The route structure is designed to support both."}
            </p>
          </div>

          <RouteCardGrid cards={page.related} />
        </div>
      </section>

      <div id="cohorts" className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8">
        <TrainingCohortTimeline
          eyebrow={page.principlesEyebrow ?? "Upcoming cohorts"}
          title={page.principlesTitle ?? "See what is opening next before you commit"}
          description={
            page.principlesDescription ??
            "Timing clarity helps learners decide whether to apply now, wait for a better-fit intake, or ask the team a few more questions first."
          }
          cohorts={cohorts}
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
            steps={process}
          />
        </div>
      </div>

      <section className="bg-brand-navy px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-4">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
              {page.exploreEyebrow ?? "Ready to begin"}
            </p>
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">
              {page.exploreTitle ?? "Move from interest into the route that fits your next season best"}
            </h2>
            <p className="max-w-3xl text-base leading-8 text-white/75">
              {page.exploreDescription ??
                "If you are not sure where to begin, start with the course catalog and come back to the fit or process pages whenever you need more clarity."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {page.ctas.map((cta) => (
              <Link
                key={cta.href}
                href={cta.href}
                className="rounded-full bg-brand-gold px-6 py-3.5 text-sm font-semibold text-brand-ink transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                {cta.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
