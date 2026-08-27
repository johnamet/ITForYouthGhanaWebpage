import Image from "next/image";
import Link from "next/link";
import { breadcrumbs } from "@/lib/content/site-config";
import { ArrowRight } from "lucide-react";
import { pointsToParagraph } from "@/lib/utils/prose";

import { EditorialImageHero } from "@/components/shared/editorial-image-hero";
import { VideoCard } from "@/components/media/video-card";
import { StatsSection } from "@/components/content/stats-section";
import { RouteCardGrid } from "@/components/shared/route-card-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import type { SitePage } from "@/types/content";

type WhoWeArePageProps = {
  page: SitePage;
};

const anchorLinks = [
  { id: "overview", label: "Overview" },
  { id: "model", label: "Operating Model" },
  { id: "principles", label: "Principles" },
  { id: "routes", label: "Explore" },
];

const heroImage = "/images/randomPictures/groupworkstudents.jpg";

function isPresent<T>(value: T | null | undefined): value is T {
  return Boolean(value);
}

export function WhoWeArePage({ page }: WhoWeArePageProps) {
  const [primaryCta, secondaryCta] = page.ctas;
  const [
    leadSection,
    deliverySection,
    transparencySection,
    partnershipSection,
    principlesLeadSection,
    ...remainingSections
  ] = page.sections;
  const operatingSections = [deliverySection, transparencySection, partnershipSection].filter(
    (section) => isPresent(section) && Boolean(section.title || section.body || section.bullets?.length),
  );
  const principleSections = [principlesLeadSection, ...remainingSections].filter(
    (section) => isPresent(section) && Boolean(section.title || section.body || section.bullets?.length),
  );
  const hasOverview = Boolean(leadSection || page.intro || page.stats.length || page.overviewTitle || page.overviewDescription);
  const visibleAnchors = anchorLinks.filter((link) =>
    link.id === "overview" ? hasOverview : link.id === "model" ? operatingSections.length : link.id === "principles" ? principleSections.length : page.related.length,
  );

  return (
    <div className="overflow-hidden bg-white text-brand-ink">
      <EditorialImageHero
        imageSrc={page.heroImage ?? heroImage}
        imageAlt="IT For Youth Ghana learners collaborating during a training session"
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        supportingText={page.intro}
        breadcrumbs={[
          { label: breadcrumbs.home, href: "/" },
          { label: breadcrumbs.whoWeAre?.root ?? "Who We Are" },
        ]}
        ctas={[
          ...(primaryCta ? [{ ...primaryCta, variant: "primary" as const }] : []),
          ...(secondaryCta ? [{ ...secondaryCta, variant: "secondary" as const }] : []),
        ]}
        priority
      />

      <div className="sticky top-[72px] z-30 border-y border-brand-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 py-4 [scrollbar-width:none] sm:px-6 lg:px-8">
          {visibleAnchors.map((link) => (
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

      {hasOverview ? <section id="overview" className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-7">
            <SectionHeading
              eyebrow={leadSection?.title ?? "Our story"}
                title={page.overviewTitle ?? "Built around access, confidence, and visible outcomes"}
              description={
                page.overviewDescription ??
                leadSection?.body ??
                "IT For Youth Ghana exists to make digital opportunity practical, welcoming, and measurable for young people who are ready to build."
              }
            />

            {page.intro ? <div className="rounded-[32px] border border-brand-border bg-brand-mist/55 p-7">
              <p className="mt-5 text-lg leading-9 text-slate-700">{page.intro}</p>
            </div> : null}
          </div>

          <div>
            <VideoCard
              thumbnail={page.heroImage ?? heroImage}
              title={page.overviewVideoTitle ?? page.title}
              videoUrl={page.overviewVideoUrl}
              className="max-w-3xl lg:ml-auto"
            />
          </div>
        </div>
      </section> : null}

      {page.stats.length ? (
        <StatsSection
          stats={page.stats}
          eyebrow={page.highlightsEyebrow || "In focus"}
          title={"The numbers behind the work"}
        />
      ) : null}

      {operatingSections.length ? (
        <section
          id="model"
          className="scroll-mt-36 bg-brand-mist/60 px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
        >
          <div className="mx-auto max-w-7xl space-y-10">
            <SectionHeading
              eyebrow={page.operatingEyebrow ?? "Operating model"}
              title={page.operatingTitle ?? "The way we turn mission into repeatable delivery"}
              description={
                page.operatingDescription ??
                "These CMS-managed sections describe how ITFY moves from intent to learning environments, evidence, and partner trust."
              }
              align="center"
            />

            <div className="grid gap-5 lg:grid-cols-3">
              {operatingSections.map((section) => (
                <article
                  key={section.title}
                  className="group rounded-[32px] border border-brand-border bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-panel"
                >
                  <h2 className="mt-6 font-heading text-2xl font-bold text-brand-ink">
                    {section.title}
                  </h2>
                  <p className="mt-4 text-sm leading-8 text-slate-600">{section.body}</p>
                  {section.bullets?.length ? (
                    <p className="mt-6 border-l-2 border-brand-gold pl-5 text-sm leading-7 text-slate-600">
                      {pointsToParagraph(section.bullets)}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {principleSections.length ? (
        <section id="principles" className="scroll-mt-36 bg-brand-navy px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            {page.principlesImage ? <div className="relative overflow-hidden rounded-[36px] border border-white/12 bg-white/10 shadow-[0_28px_80px_rgba(0,0,0,0.28)]">
              <div className="relative min-h-[26rem]">
                <Image
                  src={page.principlesImage}
                  alt={page.principlesImageAlt ?? "IT For Youth Ghana facilitator speaking with learners"}
                  fill
                  sizes="(max-width: 1023px) 100vw, 42vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/86 via-brand-navy/16 to-transparent" />
              </div>
              {page.principlesHeroEyebrow || page.principlesHeroTitle ? <div className="absolute bottom-5 left-5 right-5 rounded-[28px] border border-white/14 bg-white/12 p-6 backdrop-blur-md">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-gold">
                    {page.principlesHeroEyebrow ?? "What we protect"}
                  </p>
                  <h2 className="mt-2 font-heading text-3xl font-bold text-white">
                    {page.principlesHeroTitle ?? "Trust, inclusion, and accountability as the work grows."}
                  </h2>
                </div>
              </div> : null}
            </div> : null}

            <div className="space-y-7">
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-gold">
                  {page.principlesEyebrow ?? "Principles"}
                </p>
                <h2 className="max-w-3xl font-heading text-4xl font-bold leading-snug text-white">
                  {page.principlesTitle ?? "A strong organisation is more than programmes on a calendar"}
                </h2>
                <p className="max-w-3xl text-base leading-8 text-white/70">
                  {page.principlesDescription ??
                    "The Who We Are story should show how decisions are made, what standards matter, and why partners can trust the delivery model."}
                </p>
              </div>

              <div className="grid gap-4">
                {principleSections.map((section) => (
                  <article
                    key={section.title}
                    className="rounded-[28px] border border-white/12 bg-white/8 p-6"
                  >
                    <div>
                      <h3 className="font-heading text-2xl font-bold text-white">
                        {section.title}
                      </h3>
                      <p className="mt-3 text-sm leading-8 text-white/68">{section.body}</p>
                      {section.bullets?.length ? (
                        <p className="mt-4 border-l-2 border-brand-gold pl-5 text-sm leading-7 text-white/72">
                          {pointsToParagraph(section.bullets)}
                        </p>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {page.related.length ? (
        <section id="routes" className="scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl space-y-10">
            <SectionHeading
              eyebrow={page.exploreEyebrow ?? "Keep exploring"}
              title={
                page.exploreTitle ??
                "Meet the people, partners, and opportunities behind the mission"
              }
              description={
                page.exploreDescription ??
                "These connected routes make the Who We Are page a hub, not a dead end."
              }
            />
            <RouteCardGrid cards={page.related} />
          </div>
        </section>
      ) : null}

      {page.ctas.length ? <section className="px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="overflow-hidden rounded-[36px] bg-brand-gold">
            <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-ink/70">
                  {page.nextStepEyebrow}
                </p>
                <h2 className="max-w-3xl font-heading text-4xl font-bold leading-tight text-brand-ink">
                  {page.nextStepTitle}
                </h2>
                <p className="max-w-2xl text-base leading-8 text-brand-ink/75">
                  {page.nextStepDescription}
                </p>
              </div>

              <div className="grid gap-3">
                {page.ctas.map((cta) => (
                  <Link
                    key={cta.href}
                    href={cta.href}
                    className="group flex items-center justify-between gap-4 rounded-full bg-white px-5 py-4 text-sm font-bold text-brand-ink shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <span>{cta.label}</span>
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section> : null}
    </div>
  );
}
