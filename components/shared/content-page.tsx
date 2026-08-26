import type { SitePage } from "@/types/content";
import { Card } from "@/components/ui/card";
import { StatsSection } from "@/components/content/stats-section";
import { PageContainer } from "@/components/layout/page-container";
import { EditorialImageHero } from "@/components/shared/editorial-image-hero";
import { RouteCardGrid } from "@/components/shared/route-card-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { StorySection } from "@/components/content/story-section";
import { composeProse } from "@/lib/utils/prose";

type ContentPageProps = {
  page: SitePage;
};

export function ContentPage({ page }: ContentPageProps) {
  const stats = page.stats.filter((stat) => stat.value.trim() || stat.label.trim() || stat.description?.trim());
  const sections = page.sections.filter(
    (section) => section.title.trim() || section.body.trim() || section.bullets?.some((bullet) => bullet.trim()),
  );
  const ctas = page.ctas.filter((cta) => cta.label.trim() && cta.href.trim());
  const related = page.related.filter((card) => card.title.trim() && card.href.trim());

  return (
    <div className="bg-brand-mist">
      <EditorialImageHero
        imageSrc={page.heroImage}
        imageAlt={page.title}
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        supportingText={page.intro}
        ctas={ctas.map((cta, i) => ({ ...cta, variant: i === 0 ? "primary" : "secondary" }))}
        priority
      />

      {stats.length ? <StatsSection stats={stats} eyebrow={page.highlightsEyebrow || "In focus"} title="The numbers behind the work" /> : null}

      {sections.length ? (
        <PageContainer as="section" className="space-y-10 py-4 lg:py-6">
          {sections.map((section, idx) => {
            const description = composeProse(section.body, section.bullets);
            const hasMedia = Boolean(section.image || section.videoUrl);
            if (hasMedia) {
              return (
                <StorySection
                  key={section.title}
                  title={section.title}
                  description={description}
                  image={section.image}
                  imageAlt={section.imageAlt || section.title}
                  videoUrl={section.videoUrl}
                  videoTitle={section.videoTitle || section.title}
                  imagePosition={idx % 2 === 0 ? "left" : "right"}
                />
              );
            }
            // Fallback to a textual card when no media is provided
            return (
              <Card key={section.title} className="rounded-[32px]">
                <h2 className="font-heading text-2xl font-semibold text-brand-ink">{section.title}</h2>
                <p className="mt-4 max-w-prose text-base leading-8 text-slate-600">{description}</p>
              </Card>
            );
          })}
        </PageContainer>
      ) : null}

      {related.length ? (
        <PageContainer as="section" className="space-y-8 py-16">
          <SectionHeading
            eyebrow={page.exploreEyebrow || "Related routes"}
            title={page.exploreTitle || "Continue exploring"}
            description={page.exploreDescription || "Discover more routes across the platform."}
          />
          <RouteCardGrid cards={related} />
        </PageContainer>
      ) : null}
    </div>
  );
}
