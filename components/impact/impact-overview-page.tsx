import { breadcrumbs } from "@/lib/content/site-config";

import { PartnersStrip, type Partner } from "@/components/home/patrners-strip";
import { EditorialImageHero } from "@/components/shared/editorial-image-hero";
import { RouteCardGrid } from "@/components/shared/route-card-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { StatsSection } from "@/components/content/stats-section";
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
      <EditorialImageHero
        imageSrc={content.heroImage}
        imageAlt="Graduates and learners representing IT For Youth Ghana impact"
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
        supportingText={content.proofPoints.filter((point) => point.trim()).join(" • ") || null}
        breadcrumbs={[{ label: breadcrumbs.home, href: "/" }, { label: breadcrumbs.impact.root }]}
        ctas={[{ label: "Explore reports", href: "/our-impact/reports" }, { label: "Read stories", href: "/our-impact/testimonials", variant: "secondary" }]}
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
        <div className="space-y-8">
          <SectionHeading
            eyebrow={content.snapshotSectionEyebrow ?? "Headline snapshot"}
            title={
              content.snapshotSectionTitle ??
              "The quickest view of what the work is reaching"
            }
            description={
              content.snapshotSectionDescription ??
              "These top-line indicators are not the full story, but they provide a fast and practical sense of scale before you move into deeper reporting, stories, and alignment frameworks."
            }
          />
          <StatsSection stats={content.stats} />
        </div>
      </section>

      <section
        id="measurement"
        className="scroll-mt-36 bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl space-y-10">
          <SectionHeading
            eyebrow={content.measurementSectionEyebrow ?? "Measurement"}
            title={
              content.measurementSectionTitle ??
              "How we think about impact, not only how we count it"
            }
            description={
              content.measurementSectionDescription ??
              "The framework below helps explain what kinds of evidence matter most when trying to understand the difference the work is making."
            }
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
                    {content.measurementCardBadgeLabel ?? "Evidence lens"}
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
            eyebrow={content.routesSectionEyebrow ?? "Impact routes"}
            title={
              content.routesSectionTitle ??
              "Go deeper based on the kind of evidence you need"
            }
            description={
              content.routesSectionDescription ??
              "Some audiences need report briefs. Others need stories, or a development-alignment lens. These routes are designed to support each of those needs clearly."
            }
          />
          <RouteCardGrid cards={content.routeCards} />
        </div>
      </section>

      <PartnersStrip
        partners={partners}
        heading={content.partnersHeading ?? "Partners, institutions, and collaborators helping make the impact possible"}
      />
    </div>
  );
}
