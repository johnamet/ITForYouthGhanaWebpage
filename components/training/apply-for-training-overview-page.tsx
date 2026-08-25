import Link from "next/link";

import { CapsulePageHero } from "@/components/capsule";
import { OffsetFrames } from "@/components/media/offset-frames";
import { SectionIntro } from "@/components/content/section-intro";
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
      <CapsulePageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        supportingText={page.intro}
        imageSrc={page.heroImage ?? "/images/randomPictures/peterblackboard.jpg"}
        imageAlt="Learners in an IT For Youth Ghana training session"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Apply for Training" }]}
        primaryAction={primaryCta}
        secondaryAction={secondaryCta}
      />

      <div className="sticky top-[72px] z-30 border-y border-brand-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 py-4 [scrollbar-width:none] sm:px-6 lg:px-8">
          {anchorLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="whitespace-nowrap rounded-capsule border border-brand-border px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-accent hover:text-brand-ink"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <section id="overview" className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-6">
            <SectionIntro
            eyebrow="Overview"
            title={page.overviewTitle ?? "The training experience is built to turn interest into momentum"}
            description={page.overviewDescription ??
                  "The public training routes should help learners answer three practical questions quickly: am I a fit, what can I study, and what happens next if I apply."}
          />

            <div className="grid gap-4">
              {focusSections.slice(0, 3).map((area) => (
                <div
                  key={area.title}
                  className="rounded-panel border border-brand-border bg-white p-6 shadow-sm"
                >
                  <h3 className="font-heading text-2xl font-bold text-brand-ink">
                    {area.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{area.body}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="border-l-2 border-brand-accent py-2 pl-6 sm:pl-8">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-accent">
              Learner support
            </p>
            <h3 className="mt-4 font-heading text-3xl font-bold leading-tight text-brand-ink">
              Support should feel connected, not added on later
            </h3>
            <p className="mt-5 text-base leading-8 text-slate-600">
              {supportPoints.join(" ")}
            </p>

            {/* Stacked offset landscape plates. This aside is a tall column, and
                stacking wide photographs is the only honest way to build
                vertical mass from a library that is roughly 30:1 landscape:
                cropping one wide frame into a portrait hole would throw most of
                it away. See docs/addendum-media-pairing.md. */}
            <OffsetFrames
              className="mt-8"
              frames={[
                {
                  src: "/images/randomPictures/UXteacher_opt.jpg",
                  alt: "A facilitator working through an exercise at a learner's screen",
                },
                {
                  src: "/images/randomPictures/graduations.jpg",
                  alt: "Graduates together at the end of a cohort",
                },
              ]}
            />
          </aside>
        </div>
      </section>

      <section
        id="pathways"
        className="scroll-mt-36 bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl space-y-8">
          <SectionIntro
            eyebrow={page.operatingEyebrow ?? "Pathways"}
            title={page.operatingTitle ?? "Start with the route that answers your biggest question first"}
            description={page.operatingDescription ??
                "Some learners want to confirm fit before anything else. Others need the catalog or the application steps. The route structure is designed to support both."}
          />

          <RouteCardGrid cards={page.related} />
        </div>
      </section>

      {cohorts.length ? <div id="cohorts" className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8">
        <TrainingCohortTimeline
          eyebrow={page.principlesEyebrow ?? "Upcoming cohorts"}
          title={page.principlesTitle ?? "See what is opening next before you commit"}
          description={
            page.principlesDescription ??
            "Timing clarity helps learners decide whether to apply now, wait for a better-fit intake, or ask the team a few more questions first."
          }
          cohorts={cohorts}
        />
      </div> : null}

      {process.length ? <div
        id="process"
        className="scroll-mt-36 bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <TrainingProcessStrip
            eyebrow={page.processEyebrow ?? ""}
            title={page.processTitle ?? ""}
            description={page.processDescription ?? ""}
            steps={process}
          />
        </div>
      </div> : null}

      <section className="bg-brand-deep px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-4">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-accent">
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
                className="rounded-control bg-brand-accent px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
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
