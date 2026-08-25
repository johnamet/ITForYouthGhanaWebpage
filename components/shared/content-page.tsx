import { PanelList } from "@/components/content/panel-list";
import { SectionIntro } from "@/components/content/section-intro";
import { StatsSection } from "@/components/content/stats-section";
import { StorySection } from "@/components/content/story-section";
import { PageContainer } from "@/components/layout/page-container";
import { CircularFigure } from "@/components/media/circular-figure";
import { WideFrame } from "@/components/media/wide-frame";
import { EditorialImageHero } from "@/components/shared/editorial-image-hero";
import { RouteCardGrid } from "@/components/shared/route-card-grid";
import type { SitePage } from "@/types/content";

type ContentPageProps = {
  page: SitePage;
};

/**
 * The shared template behind several hub and custom pages.
 *
 * Section treatments ROTATE on a three-step cycle rather than alternating
 * image-left / image-right down the page. Alternation satisfies the pairing
 * rule and still produces something exhausting to scroll, which is the failure
 * mode docs/addendum-media-pairing.md names explicitly. A three-step cycle also
 * guarantees no arrangement repeats twice in a row.
 *
 *   0  wide frame above the text column
 *   1  circular figure beside the text
 *   2  story section, media beside the text, side alternating
 *
 * Programme content gets the wide steps because the library is roughly 30:1
 * landscape. The circular step is orientation-agnostic, so it works from either
 * library and is the treatment to try before calling a section unpairable.
 */
export function ContentPage({ page }: ContentPageProps) {
  const stats = page.stats.filter(
    (stat) => stat.value.trim() || stat.label.trim() || stat.description?.trim(),
  );
  const sections = page.sections.filter(
    (section) =>
      section.title.trim() || section.body.trim() || section.bullets?.some((b) => b.trim()),
  );
  const ctas = page.ctas.filter((cta) => cta.label.trim() && cta.href.trim());
  const related = page.related.filter((card) => card.title.trim() && card.href.trim());

  return (
    <div className="bg-brand-mist">
      <EditorialImageHero
        imageSrc={page.heroImage}
        imageAlt={page.heroImageAlt || page.title}
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        supportingText={page.intro}
        ctas={ctas.map((cta, i) => ({ ...cta, variant: i === 0 ? "primary" : "secondary" }))}
        priority
      />

      {stats.length ? (
        <StatsSection
          stats={stats}
          eyebrow={page.highlightsEyebrow || "In focus"}
          title="The numbers behind the work"
        />
      ) : null}

      {sections.length ? (
        <PageContainer as="section" className="space-y-16 py-14 lg:py-20">
          {sections.map((section, index) => {
            const treatment = index % 3;
            const image = section.image?.trim();
            const imageAlt = section.imageAlt || section.title;
            const bullets = (section.bullets ?? []).filter((b) => b?.trim());

            const prose = (
              <>
                <SectionIntro title={section.title} description={section.body || undefined} />
                {bullets.length ? <PanelList className="mt-6" items={bullets} /> : null}
              </>
            );

            /* No image on the record: a considered typographic opening rather
               than a broken frame or one photograph reused down the page. */
            if (!image && !section.videoUrl?.trim()) {
              return (
                <div key={section.title} className="grid gap-6 lg:grid-cols-[7rem_minmax(0,1fr)]">
                  <p
                    aria-hidden="true"
                    className="font-heading text-6xl font-bold leading-none text-brand-primary/25"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <div>{prose}</div>
                </div>
              );
            }

            if (treatment === 0) {
              return (
                <div key={section.title} className="space-y-7">
                  <WideFrame src={image!} alt={imageAlt} ratio="cinema" />
                  <div className="max-w-3xl">{prose}</div>
                </div>
              );
            }

            if (treatment === 1) {
              return (
                <div
                  key={section.title}
                  className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_auto]"
                >
                  <div>{prose}</div>
                  <CircularFigure src={image!} alt={imageAlt} size="lg" />
                </div>
              );
            }

            return (
              <StorySection
                key={section.title}
                title={section.title}
                description={section.body}
                supportingText={bullets.length ? bullets.join(" ") : undefined}
                image={section.image}
                imageAlt={imageAlt}
                videoUrl={section.videoUrl}
                videoTitle={section.videoTitle || section.title}
                imagePosition={index % 2 === 0 ? "left" : "right"}
              />
            );
          })}
        </PageContainer>
      ) : null}

      {related.length ? (
        <PageContainer as="section" className="space-y-8 py-16">
          <SectionIntro
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
