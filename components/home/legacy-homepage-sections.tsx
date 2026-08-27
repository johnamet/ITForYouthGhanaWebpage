import { StorySection } from "@/components/content/story-section";
import { StatsSection } from "@/components/content/stats-section";
import { Button } from "@/components/ui/button";
import { pointsToParagraph } from "@/lib/utils/prose";

export type ChallengeSectionContent = {
  title: string;
  headline: string;
  description: string;
  stats: Array<{ label: string; value: string; description: string }>;
  comparisonTitle: string;
  problemTitle: string;
  problemItems: string[];
  solutionTitle: string;
  solutionItems: string[];
  ctaText: string;
  ctaLabel: string;
  ctaHref: string;
  videoUrl?: string;
  videoTitle?: string;
  active?: boolean;
};

export type MissionSectionContent = {
  title: string;
  headline: string;
  description: string;
  image: string;
  imageAlt: string;
  imageLabel: string;
  imageCaption: string;
  missionTitle: string;
  missionHeadline: string;
  missionDescription: string;
  ctaLabel: string;
  ctaHref: string;
  videoUrl?: string;
  videoTitle?: string;
  active?: boolean;
};

export type OverviewSectionContent = {
  title: string;
  headline: string;
  description: string;
  storyTitle: string;
  storyHeadline: string;
  storyDescription: string;
  callout: string;
  image: string;
  imageAlt: string;
  imageLabel: string;
  imageCaption: string;
  ctaLabel: string;
  ctaHref: string;
  videoUrl?: string;
  videoTitle?: string;
  active?: boolean;
};

function QuickOverview({ content }: { content: OverviewSectionContent }) {
  if (content.active === false) return null;
  const hasIntro = Boolean(content.title || content.headline || content.description);
  const hasStory = Boolean(content.storyTitle || content.storyHeadline || content.storyDescription || content.callout || (content.ctaLabel && content.ctaHref));

  if (!hasIntro && !hasStory && !content.image) return null;
  return <StorySection eyebrow={content.title} title={content.storyTitle || content.headline} headline={content.storyHeadline || content.headline} description={content.storyDescription || content.description} supportingText={content.callout} image={content.image} imageAlt={content.imageAlt} videoUrl={content.videoUrl} videoTitle={content.videoTitle} action={content.ctaLabel && content.ctaHref ? { label: content.ctaLabel, href: content.ctaHref } : undefined} />;
}

function Challenge({ content }: { content: ChallengeSectionContent }) {
  if (content.active === false) return null;
  if (!content.title && !content.headline && !content.description && !content.stats.length && !content.problemItems.length && !content.solutionItems.length) return null;

  return (
    <section className="bg-brand-navy px-6 py-20 text-white lg:px-10 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="font-heading text-5xl font-bold leading-none text-white sm:text-6xl lg:text-7xl">
            {content.title}
          </h2>
          {content.headline ? <p className="mx-auto mt-5 max-w-5xl font-heading text-3xl font-bold leading-tight text-white/90 sm:text-4xl">
            {content.headline}
          </p> : null}
          {content.description ? <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/90">
            {content.description}
          </p> : null}
        </div>

        <StatsSection stats={content.stats} tone="navy" />

        <div className="mx-auto mt-12 max-w-4xl border-y border-white/20 py-8">
          <h3 className="text-center font-heading text-2xl font-bold text-white sm:text-3xl">
            {content.comparisonTitle}
          </h3>
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div>
              <h4 className="mb-4 text-xl font-semibold text-white">
                {content.problemTitle}
              </h4>
              <p className="text-lg leading-8 text-white/80">{pointsToParagraph(content.problemItems)}</p>
            </div>
            <div>
              <h4 className="mb-4 text-xl font-semibold text-white">
                {content.solutionTitle}
              </h4>
              <p className="text-lg leading-8 text-white/80">{pointsToParagraph(content.solutionItems)}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="mb-6 text-lg text-white/90">
            {content.ctaText}
          </p>
          <Button
            href={content.ctaHref}
            external
            variant="white"
            size="lg"
          >
            {content.ctaLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}

function Vision({ content }: { content: MissionSectionContent }) {
  if (content.active === false) return null;
  if (!content.title && !content.headline && !content.description && !content.image && !content.missionTitle && !content.missionHeadline && !content.missionDescription) return null;

  return <StorySection eyebrow={content.title} title={content.missionTitle || content.headline} headline={content.missionHeadline || content.headline} description={content.missionDescription || content.description} supportingText={content.imageCaption} image={content.image} imageAlt={content.imageAlt} imagePosition="right" videoUrl={content.videoUrl} videoTitle={content.videoTitle} action={content.ctaLabel && content.ctaHref ? { label: content.ctaLabel, href: content.ctaHref, variant: "pink-outline" } : undefined} tone="mist" />;
}

export function LegacyHomepageSections({
  overview,
  challenge,
  mission,
}: {
  overview: OverviewSectionContent;
  challenge: ChallengeSectionContent;
  mission: MissionSectionContent;
}) {
  return (
    <>
      <QuickOverview content={overview} />
      <Challenge content={challenge} />
      <Vision content={mission} />
    </>
  );
}
