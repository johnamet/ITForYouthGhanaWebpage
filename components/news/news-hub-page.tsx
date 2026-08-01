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
        ctas={[
          { label: "Read latest news", href: "/news-and-updates/news" },
          { label: "Explore blogs", href: "/news-and-updates/blogs", variant: "secondary" },
        ]}
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

      <section id="featured" className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-10">
          <SectionHeading
            eyebrow="Featured"
            title="A living front page for the latest mission signals"
            description="The CMS phase will decide what is featured, published, drafted, archived, and scheduled. For now, this static layer proves the complete public reading experience."
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
            eyebrow="Browse"
            title="Choose the kind of update you need"
            description="News stays practical and current. Blogs give the team room to explain thinking, context, and lessons from the field."
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
                  className="group rounded-[30px] border border-brand-border bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-panel"
                >
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    <div>
                      <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
                        {articleCategoryLabels[category]}
                      </p>
                      <h2 className="mt-3 font-heading text-3xl font-bold text-brand-ink">
                        {categoryContent.title}
                      </h2>
                    </div>
                    <span className="rounded-full bg-brand-navy px-4 py-2 text-sm font-bold text-white">
                      {categoryArticles.length} articles
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {categoryContent.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-navy">
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
              eyebrow="Editorial logic"
              title="What the news system is designed to carry"
              description="The content model supports quick updates, deeper analysis, and proof-led storytelling without having to redesign the page structure later."
            />
            <StatList stats={content.stats} compact />
          </div>

          <div className="grid gap-5">
            {content.editorialPillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-[30px] border border-brand-border bg-white p-7 shadow-sm"
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
                        className="rounded-[20px] border border-brand-border bg-brand-mist/55 px-4 py-4 text-sm font-medium leading-6 text-slate-700"
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

      <section className="bg-brand-navy px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-gold">
              Latest
            </p>
            <h2 className="max-w-2xl font-heading text-3xl font-bold leading-snug text-white sm:text-4xl">
              Recently published
            </h2>
            <p className="max-w-2xl text-[0.95rem] leading-[1.8] text-white/70">
              A quick view of the newest published content, across both news and blog routes.
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
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-navy text-brand-gold">
              <Mail className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-navy">
              Stay close
            </p>
            <h2 className="font-heading text-3xl font-bold text-brand-ink sm:text-4xl">
              Get cohort windows, stories, and partner opportunities as they go live
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-slate-700">
              Newsletter collection is already scaffolded elsewhere in the site. This route keeps the public article
              system connected to that audience-building path.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link
              href="/contact"
              className="rounded-full bg-brand-navy px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Contact the team
            </Link>
            <Link
              href="/apply-for-training"
              className="rounded-full border border-brand-navy/20 bg-white px-6 py-3.5 text-sm font-semibold text-brand-navy transition hover:border-brand-navy"
            >
              Apply for training
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
