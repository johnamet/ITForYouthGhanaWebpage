import Image from "next/image";
import Link from "next/link";
import { breadcrumbs } from "@/lib/content/site-config";

import { RouteCardGrid } from "@/components/shared/route-card-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import type { InitiativePage, WhatWeDoOverviewContent } from "@/types/content";

type WhatWeDoOverviewPageProps = {
  content: WhatWeDoOverviewContent;
  initiatives: InitiativePage[];
};

const anchorLinks = [
  { id: "overview", label: "Overview" },
  { id: "initiatives", label: "Initiatives" },
  { id: "pathways", label: "Pathways" },
  { id: "next-steps", label: "Next Steps" },
];

export function WhatWeDoOverviewPage({ content, initiatives }: WhatWeDoOverviewPageProps) {
  const liveRoutes = initiatives.length;
  const totalGalleryImages = initiatives.reduce(
    (count, initiative) => count + initiative.gallery.length,
    0,
  );
  const totalTestimonials = initiatives.reduce(
    (count, initiative) => count + initiative.testimonials.length,
    0,
  );
  const totalPartners = initiatives.reduce(
    (count, initiative) => count + initiative.partners.length,
    0,
  );

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="absolute inset-0">
          <Image
            src={content.heroImage}
            alt="IT For Youth Ghana initiative overview"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(12,45,90,0.92)_0%,rgba(12,45,90,0.78)_42%,rgba(12,45,90,0.45)_100%)]" />
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
            <span className="text-white">{breadcrumbs.whatWeDo.root}</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
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
              <p className="max-w-3xl text-base leading-8 text-white/80">
                {content.overviewSectionDescription}
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/apply-for-training"
                  className="rounded-full bg-brand-gold px-6 py-3.5 text-sm font-semibold text-brand-ink transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Apply for training
                </Link>
                <Link
                  href="/partner-with-us"
                  className="rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/15"
                >
                  Partner with us
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { value: String(liveRoutes), ...content.heroStats[0] },
                { value: String(totalGalleryImages), ...content.heroStats[1] },
                { value: String(totalTestimonials), ...content.heroStats[2] },
                { value: String(totalPartners), ...content.heroStats[3] },
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
        <div className="space-y-8">
          <SectionHeading
            eyebrow={content.overviewSectionEyebrow ?? "Overview"}
            title={
              content.overviewSectionTitle ?? "The work is designed as a connected system"
            }
            description={
              content.overviewSectionDescription ??
              "We do not treat access, training, entrepreneurship, and advocacy as separate silos. The strongest outcomes happen when these pieces reinforce each other."
            }
          />

          <div className="grid gap-5 lg:grid-cols-3">
            {content.ecosystemCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[30px] border border-brand-border bg-white p-7 shadow-sm"
              >
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
                  {card.eyebrow}
                </p>
                <h2 className="mt-4 font-heading text-2xl font-bold text-brand-ink">
                  {card.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="initiatives"
        className="scroll-mt-36 bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl space-y-10">
          <SectionHeading
            eyebrow={content.initiativesSectionEyebrow ?? "Initiatives"}
            title={
              content.initiativesSectionTitle ??
              "Explore each initiative in more depth"
            }
            description={
              content.initiativesSectionDescription ??
              "Every initiative page now has a dedicated structure with galleries, FAQs, testimonials, partner references, and a stronger narrative arc."
            }
          />

          <div className="grid gap-6 lg:grid-cols-2">
            {initiatives.map((initiative) => (
              <Link
                key={initiative.slug}
                href={`/what-we-do/${initiative.slug}`}
                className="group overflow-hidden rounded-[32px] border border-brand-border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-panel"
              >
                <div className="grid md:grid-cols-[0.42fr_0.58fr]">
                  <div className="relative min-h-[18rem] bg-brand-mist">
                    <Image
                      src={initiative.heroImage}
                      alt={initiative.title}
                      fill
                      sizes="(max-width: 767px) 100vw, 35vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/45 via-transparent to-transparent" />
                  </div>

                  <div className="flex flex-col justify-between p-7">
                    <div className="space-y-3">
                      <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
                        {initiative.eyebrow}
                      </p>
                      <h3 className="font-heading text-3xl font-bold text-brand-ink">
                        {initiative.title}
                      </h3>
                      <p className="text-sm font-medium leading-7 text-brand-navy">
                        {initiative.tagline}
                      </p>
                      <p className="text-sm leading-7 text-slate-600">
                        {initiative.description}
                      </p>
                    </div>

                    <div className="mt-6 space-y-5">
                      <div className="grid gap-3 sm:grid-cols-2">
                        {initiative.impactStats.slice(0, 2).map((stat) => (
                          <div
                            key={stat.label}
                            className="rounded-[22px] border border-brand-border bg-brand-mist/45 px-4 py-4"
                          >
                            <p className="font-heading text-2xl font-bold text-brand-navy">
                              {stat.value}
                            </p>
                            <p className="mt-1 text-sm font-semibold text-brand-ink">
                              {stat.label}
                            </p>
                          </div>
                        ))}
                      </div>

                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy">
                        Explore initiative
                        <span className="transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="pathways" className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-10">
          <SectionHeading
            eyebrow={content.pathwaysSectionEyebrow ?? "Pathways"}
            title={
              content.pathwaysSectionTitle ??
              "From first exposure to longer-term opportunity"
            }
            description={
              content.pathwaysSectionDescription ??
              "The strongest version of this work helps a learner move forward over time, not just attend one moment. These pathways show how the portfolio supports that progression."
            }
          />

          <div className="grid gap-5 lg:grid-cols-4">
            {content.pathwayCards.map((card, index) => (
              <div
                key={card.title}
                className="rounded-[30px] border border-brand-border bg-white p-7 shadow-sm"
              >
                <p className="font-heading text-4xl font-bold text-brand-gold/70">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 font-heading text-2xl font-bold text-brand-ink">
                  {card.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="next-steps" className="scroll-mt-36 bg-brand-navy px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="space-y-3">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
              {content.nextStepsSectionEyebrow ?? "Next steps"}
            </p>
            <h2 className="max-w-3xl font-heading text-3xl font-bold leading-snug text-white sm:text-4xl">
              {content.nextStepsSectionTitle ?? "Choose the right entry point into the work"}
            </h2>
            <p className="max-w-3xl text-[0.95rem] leading-[1.8] text-white/70">
              {content.nextStepsSectionDescription ??
                "Whether you are a learner, partner, or supporter, the next move should feel clear from here."}
            </p>
          </div>
          <RouteCardGrid cards={content.nextSteps} />
        </div>
      </section>
    </div>
  );
}
