import Image from "next/image";
import Link from "next/link";

import { RouteCardGrid } from "@/components/shared/route-card-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { StatList } from "@/components/shared/stat-list";
import type { ImpactReportsContent } from "@/types/content";

type ImpactReportsPageProps = {
  content: ImpactReportsContent;
};

const anchorLinks = [
  { id: "snapshot", label: "Snapshot" },
  { id: "reports", label: "Reports" },
  { id: "method", label: "Method" },
  { id: "next-steps", label: "Next Steps" },
];

export function ImpactReportsPage({ content }: ImpactReportsPageProps) {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="absolute inset-0">
          <Image
            src={content.heroImage}
            alt="IT For Youth Ghana impact reports and graduation moments"
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
            <Link href="/our-impact" className="transition hover:text-white">
              Our Impact
            </Link>
            <span>/</span>
            <span className="text-white">Impact Reports</span>
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
            </div>

            <div className="rounded-[32px] border border-white/12 bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold">
                Reporting stance
              </p>
              <div className="mt-5 space-y-3">
                {content.methodologyPoints.slice(0, 3).map((point) => (
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

      <section id="snapshot" className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <SectionHeading
            eyebrow="Evidence snapshot"
            title="A quick view of the numbers before you open a brief"
            description="These top-line figures are meant to help readers orient themselves quickly before moving into the supporting documents and context below."
          />
          <StatList stats={content.stats} />
        </div>
      </section>

      <section
        id="reports"
        className="scroll-mt-36 bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl space-y-10">
          <SectionHeading
            eyebrow="Report briefs"
            title="Open the latest evidence briefs and supporting notes"
            description="These seeded report briefs give the route working downloads today, while leaving room for richer annual-report assets and PDFs later."
          />

          <div className="grid gap-6 lg:grid-cols-3">
            {content.reportResources.map((resource) => (
              <article
                key={resource.id}
                className="rounded-[30px] border border-brand-border bg-white p-7 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
                      {resource.year}
                    </p>
                    <h2 className="mt-4 font-heading text-2xl font-bold text-brand-ink">
                      {resource.title}
                    </h2>
                  </div>
                  <span className="rounded-full bg-brand-mist/70 px-3 py-1 text-xs font-semibold text-brand-navy">
                    Brief
                  </span>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-600">{resource.summary}</p>

                <div className="mt-5 space-y-3">
                  {resource.highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="rounded-[22px] border border-brand-border bg-brand-mist/45 px-4 py-4 text-sm leading-7 text-slate-700"
                    >
                      {highlight}
                    </div>
                  ))}
                </div>

                <a
                  href={resource.href}
                  download
                  className="mt-6 inline-flex rounded-full bg-brand-gold px-5 py-3 text-sm font-semibold text-brand-ink transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  {resource.fileLabel}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="method" className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-10">
          <SectionHeading
            eyebrow="Reading the evidence"
            title="What makes impact reporting credible here"
            description="These themes explain how the evidence is meant to be interpreted, especially by partners who need more than a simple list of metrics."
          />

          <div className="grid gap-5 md:grid-cols-2">
            {content.evidenceCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[30px] border border-brand-border bg-white p-7 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl" aria-hidden="true">
                    {card.icon}
                  </span>
                  <span className="rounded-full bg-brand-mist/70 px-3 py-1 text-xs font-semibold text-brand-navy">
                    Evidence theme
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

          <div className="rounded-[32px] bg-brand-navy p-8 text-white">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
              Method notes
            </p>
            <div className="mt-6 grid gap-3">
              {content.methodologyPoints.map((point) => (
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
      </section>

      <section
        id="next-steps"
        className="scroll-mt-36 bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl space-y-8">
          <SectionHeading
            eyebrow="Next steps"
            title="Use the impact system based on what kind of proof you need next"
            description="If the numbers raised questions, the stories and SDG routes below help provide the human and development context around them."
          />
          <RouteCardGrid cards={content.related} />
        </div>
      </section>
    </div>
  );
}
