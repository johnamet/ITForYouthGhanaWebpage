import { breadcrumbs } from "@/lib/content/site-config";

import { RouteCardGrid } from "@/components/shared/route-card-grid";
import { EditorialImageHero } from "@/components/shared/editorial-image-hero";
import { ProseMediaCardGrid } from "@/components/shared/prose-media-card-grid";
import { VideoCard } from "@/components/media/video-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { StatsSection } from "@/components/content/stats-section";
import type { ImpactReportsContent } from "@/types/content";
import { pointsToParagraph } from "@/lib/utils/prose";

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
      <EditorialImageHero imageSrc={content.heroImage} imageAlt="IT For Youth Ghana impact reports and graduation moments" eyebrow={content.eyebrow} title={content.title} description={content.description} supportingText={content.methodologyPoints.filter((point) => point.trim()).slice(0, 3).join(" • ") || null} breadcrumbs={[{ label: breadcrumbs.home, href: "/" }, { label: breadcrumbs.impact.root, href: "/our-impact" }, { label: breadcrumbs.impact.reports }]} priority />

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
            eyebrow={content.snapshotSectionEyebrow ?? "Evidence snapshot"}
            title={
              content.snapshotSectionTitle ??
              "A quick view of the numbers before you open a brief"
            }
            description={
              content.snapshotSectionDescription ??
              "These top-line figures are meant to help readers orient themselves quickly before moving into the supporting documents and context below."
            }
          />
          <StatsSection stats={content.stats} />
        </div>
      </section>

      <section
        id="reports"
        className="scroll-mt-36 bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl space-y-10">
          <SectionHeading
            eyebrow={content.reportsSectionEyebrow ?? "Report briefs"}
            title={
              content.reportsSectionTitle ??
              "Open the latest evidence briefs and supporting notes"
            }
            description={
              content.reportsSectionDescription ??
              "These seeded report briefs give the route working downloads today, while leaving room for richer annual-report assets and PDFs later."
            }
          />

          <ProseMediaCardGrid
            theme="training"
            columns={3}
            breakpoint="lg"
            gap="6"
            cards={content.reportResources.map((resource) => ({
              eyebrow: resource.year,
              title: resource.title,
              // The badge pill (content.reportBadgeLabel) has no second
              // eyebrow-shaped slot to live in now that resource.year owns
              // the eyebrow, so it becomes a leading clause of the body
              // instead of being dropped.
              body: `${content.reportBadgeLabel ?? "Brief"}. ${resource.summary}`,
              points: resource.highlights,
              cta: { label: resource.fileLabel, href: resource.href },
              mediaKey: `our-impact:rr:${resource.title}`,
            }))}
          />
        </div>
      </section>

      <section id="method" className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-10">
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <SectionHeading
              eyebrow={content.methodSectionEyebrow ?? "Reading the evidence"}
              title={
                content.methodSectionTitle ?? "What makes impact reporting credible here"
              }
              description={
                content.methodSectionDescription ??
                "These themes explain how the evidence is meant to be interpreted, especially by partners who need more than a simple list of metrics."
              }
            />
            <VideoCard
              thumbnail={content.heroImage}
              title={content.methodVideoTitle ?? content.title}
              videoUrl={content.methodVideoUrl}
              className="max-w-3xl lg:ml-auto"
            />
          </div>

          <ProseMediaCardGrid
            theme="mentoring"
            columns={2}
            breakpoint="md"
            gap="5"
            cards={content.evidenceCards.map((card) => ({
              eyebrow: content.methodCardBadgeLabel ?? "Evidence theme",
              title: card.title,
              body: card.description,
              points: card.bullets,
              mediaKey: `our-impact:ev:${card.title}`,
              media: { iconImage: card.iconImage },
            }))}
          />

          <div className="rounded-[32px] bg-brand-navy p-8 text-white">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
              {content.methodBadgeEyebrow ?? "Method notes"}
            </p>
            <p className="mt-6 text-base leading-8 text-white/82">
              {pointsToParagraph(content.methodologyPoints)}
            </p>
          </div>
        </div>
      </section>

      <section
        id="next-steps"
        className="scroll-mt-36 bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl space-y-8">
          <SectionHeading
            eyebrow={content.nextStepsSectionEyebrow ?? "Next steps"}
            title={
              content.nextStepsSectionTitle ??
              "Use the impact system based on what kind of proof you need next"
            }
            description={
              content.nextStepsSectionDescription ??
              "If the numbers raised questions, the stories and SDG routes below help provide the human and development context around them."
            }
          />
          <RouteCardGrid cards={content.related} />
        </div>
      </section>
    </div>
  );
}
