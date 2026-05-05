import Image from "next/image";
import Link from "next/link";

import { PartnersStrip, type Partner } from "@/components/home/patrners-strip";
import { RouteCardGrid } from "@/components/shared/route-card-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { StatList } from "@/components/shared/stat-list";
import type { ImpactOverviewContent } from "@/types/content";

type ImpactOverviewPageProps = {
  content: ImpactOverviewContent;
  partners: Partner[];
};

const anchorLinks = [
  { id: "overview", label: "Overview" },
  { id: "measurement", label: "Measurement" },
  { id: "routes", label: "Routes" },
];

export function ImpactOverviewPage({
  content,
  partners,
}: ImpactOverviewPageProps) {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="absolute inset-0">
          <Image
            src={content.heroImage}
            alt="Graduates and learners representing IT For Youth Ghana impact"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(10,27,52,0.92)_0%,rgba(10,27,52,0.78)_45%,rgba(10,27,52,0.38)_100%)]" />
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
            <span className="text-white">Our Impact</span>
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
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/our-impact/reports"
                  className="rounded-full bg-brand-gold px-6 py-3.5 text-sm font-semibold text-brand-ink transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Explore reports
                </Link>
                <Link
                  href="/our-impact/testimonials"
                  className="rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/15"
                >
                  Read stories
                </Link>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/12 bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold">
                Why this section exists
              </p>
              <div className="mt-5 space-y-3">
                {content.proofPoints.map((point) => (
                  <div
                    key={point}
                    className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-4 text-sm leading-7 text-white/82"
                  >
                    {point}
                  </div>
                ))}
              </div>
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
            eyebrow="Headline snapshot"
            title="The quickest view of what the work is reaching"
            description="These top-line indicators are not the full story, but they provide a fast and practical sense of scale before you move into deeper reporting, stories, and alignment frameworks."
          />
          <StatList stats={content.stats} />
        </div>
      </section>

      <section
        id="measurement"
        className="scroll-mt-36 bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl space-y-10">
          <SectionHeading
            eyebrow="Measurement"
            title="How we think about impact, not only how we count it"
            description="The framework below helps explain what kinds of evidence matter most when trying to understand the difference the work is making."
          />

          <div className="grid gap-5 md:grid-cols-2">
            {content.measurementCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[30px] border border-brand-border bg-white p-7 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl" aria-hidden="true">
                    {card.icon}
                  </span>
                  <span className="rounded-full bg-brand-mist/70 px-3 py-1 text-xs font-semibold text-brand-navy">
                    Evidence lens
                  </span>
                </div>
                <h2 className="mt-5 font-heading text-2xl font-bold text-brand-ink">
                  {card.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
                <div className="mt-5 space-y-3">
                  {card.bullets.map((bullet) => (
                    <div
                      key={bullet}
                      className="rounded-[22px] border border-brand-border bg-brand-mist/45 px-4 py-4 text-sm leading-7 text-slate-700"
                    >
                      {bullet}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="routes" className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <SectionHeading
            eyebrow="Impact routes"
            title="Go deeper based on the kind of evidence you need"
            description="Some audiences need report briefs. Others need stories, or a development-alignment lens. These routes are designed to support each of those needs clearly."
          />
          <RouteCardGrid cards={content.routeCards} />
        </div>
      </section>

      <PartnersStrip
        partners={partners}
        heading="Partners, institutions, and collaborators helping make the impact possible"
      />
    </div>
  );
}
