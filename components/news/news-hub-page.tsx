import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

import { ArticleCard } from "@/components/news/article-card";
import { EditorialImageHero } from "@/components/shared/editorial-image-hero";
import { RouteCardGrid } from "@/components/shared/route-card-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { StatList } from "@/components/shared/stat-list";
import {
  articleCategoryContent,
  articleCategoryLabels,
  articleCategories,
} from "@/lib/content/news-config";
import type { ArticleSeed, NewsHubContent } from "@/types/content";
import { OffsetFrames } from "@/components/media/offset-frames";

type NewsHubPageProps = {
  content: NewsHubContent;
  articles: ArticleSeed[];
};

const anchorLinks = [
  { id: "featured", label: "Featured" },
  { id: "browse", label: "Browse" },
  { id: "editorial", label: "Editorial" },
  { id: "subscribe", label: "Subscribe" },
];

export function NewsHubPage({ content, articles }: NewsHubPageProps) {
  const featuredArticles = articles.filter((article) => article.featured).slice(0, 3);
  const leadArticle = featuredArticles[0] ?? articles[0];
  const secondaryArticles = featuredArticles.slice(1);
  const latestArticles = articles
    .filter((article) => article.slug !== leadArticle?.slug)
    .slice(0, 4);

  return (
    <div className="bg-white">
      <EditorialImageHero
        imageSrc={content.heroImage}
        imageAlt="IT For Youth Ghana news and updates"
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "News & Updates" }]}
        ctas={content.heroCtas.map((cta, index) => ({ ...cta, variant: index === 0 ? "primary" as const : "secondary" as const }))}
        priority
      />

      <div className="sticky top-[72px] z-30 border-y border-brand-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 py-4 [scrollbar-width:none] sm:px-6 lg:px-8">
          {anchorLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="whitespace-nowrap rounded-full border border-brand-border px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-accent hover:text-brand-ink"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <section id="featured" className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-10">
          <SectionHeading
            eyebrow={content.featuredSectionEyebrow}
            title={content.featuredSectionTitle}
            description={content.featuredSectionDescription}
          />

          {leadArticle ? (
            <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
              <ArticleCard article={leadArticle} variant="featured" />
              <div className="grid gap-6">
                {secondaryArticles.map((article) => (
                  <ArticleCard key={article.slug} article={article} variant="compact" />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section id="browse" className="scroll-mt-36 bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-10">
          <SectionHeading
            eyebrow={content.browseSectionEyebrow}
            title={content.browseSectionTitle}
            description={content.browseSectionDescription}
          />

          <RouteCardGrid cards={content.routeCards} />

          <div className="grid gap-5 lg:grid-cols-2">
            {articleCategories.map((category) => {
              const categoryArticles = articles.filter((article) => article.category === category);
              const categoryContent = articleCategoryContent[category];

              return (
                <Link
                  key={category}
                  href={`/news-and-updates/${category}`}
                  className="group rounded-panel border border-brand-border bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-panel"
                >
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    <div>
                      <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-accent">
                        {articleCategoryLabels[category]}
                      </p>
                      <h2 className="mt-3 font-heading text-3xl font-bold text-brand-ink">
                        {categoryContent.title}
                      </h2>
                    </div>
                    <span className="rounded-full bg-brand-deep px-4 py-2 text-sm font-bold text-white">
                      {categoryArticles.length} articles
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {categoryContent.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-deep">
                    Open {articleCategoryLabels[category].toLowerCase()}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="editorial" className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <div className="space-y-8">
            <SectionHeading
              eyebrow={content.editorialSectionEyebrow}
              title={content.editorialSectionTitle}
              description={content.editorialSectionDescription}
            />
            <StatList stats={content.stats} compact />

            {/* Offset plates. This column is tall next to the pillar stack, and
                stacking wide photographs is how vertical mass is built from a
                landscape library rather than cropping one frame into a
                portrait hole. */}
            <OffsetFrames
              frames={[
                {
                  src: "/images/randomPictures/graduationspeaking.jpg",
                  alt: "A graduate speaking at a cohort graduation ceremony",
                },
                {
                  src: "/images/randomPictures/uXstudents.jpg",
                  alt: "Learners working through a design exercise at their laptops",
                },
              ]}
            />
          </div>

          <div className="grid gap-5">
            {content.editorialPillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-panel border border-brand-border bg-white p-7 shadow-sm"
              >
                <h2 className="font-heading text-2xl font-bold text-brand-ink">
                  {pillar.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{pillar.body}</p>
                {pillar.bullets?.length ? (
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {pillar.bullets.map((bullet) => (
                      <div
                        key={bullet}
                        className="rounded-panel border border-brand-border bg-brand-mist/55 px-4 py-4 text-sm font-medium leading-6 text-slate-700"
                      >
                        {bullet}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-deep px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-accent">
              {content.latestSectionEyebrow}
            </p>
            <h2 className="max-w-2xl font-heading text-3xl font-bold leading-snug text-white sm:text-4xl">
              {content.latestSectionTitle}
            </h2>
            <p className="max-w-2xl text-[0.95rem] leading-[1.8] text-white/70">
              {content.latestSectionDescription}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-4">
            {latestArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} variant="compact" />
            ))}
          </div>
        </div>
      </section>

      <section id="subscribe" className="scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-[34px] border border-brand-border bg-brand-warm p-8 shadow-sm lg:grid-cols-[0.75fr_0.25fr] lg:items-center lg:p-10">
          <div className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-deep text-brand-accent">
              <Mail className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-deep">
              {content.subscribeSectionEyebrow}
            </p>
            <h2 className="font-heading text-3xl font-bold text-brand-ink sm:text-4xl">
              {content.subscribeSectionTitle}
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-slate-700">
              {content.subscribeSectionDescription}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            {content.subscribeCtas.filter((cta) => cta.label.trim() && cta.href.trim()).map((cta, index) => (
              <Link key={`${cta.href}-${cta.label}`} href={cta.href} className={index === 0 ? "rounded-full bg-brand-deep px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg" : "rounded-full border border-brand-deep/20 bg-white px-6 py-3.5 text-sm font-semibold text-brand-deep transition hover:border-brand-deep"}>
                {cta.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
