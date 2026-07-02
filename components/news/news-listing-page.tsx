import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Tags } from "lucide-react";

import { ArticleCard } from "@/components/news/article-card";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  articleCategoryLabels,
  getArticleLabel,
  getArticleReadTime,
} from "@/lib/content/news-config";
import { formatDate } from "@/lib/utils/formatters";
import type {
  ArticleCategoryContent,
  ArticleSeed,
} from "@/types/content";

type NewsListingPageProps = {
  content: ArticleCategoryContent;
  articles: ArticleSeed[];
  tags: string[];
};

export function NewsListingPage({
  content,
  articles,
  tags,
}: NewsListingPageProps) {
  const leadArticle = articles[0];
  const remainingArticles = articles.slice(1);

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="absolute inset-0">
          <Image
            src={content.heroImage}
            alt={`${articleCategoryLabels[content.category]} listing`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(10,27,52,0.94)_0%,rgba(10,27,52,0.76)_50%,rgba(10,27,52,0.34)_100%)]" />
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
            <Link href="/news-and-updates" className="transition hover:text-white">
              News & Updates
            </Link>
            <span>/</span>
            <span className="text-white">{articleCategoryLabels[content.category]}</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <div className="space-y-6">
              <Link
                href="/news-and-updates"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/75 transition hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to hub
              </Link>
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
                Listing snapshot
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] border border-white/10 bg-white/8 p-5">
                  <p className="font-heading text-4xl font-bold text-white">
                    {articles.length}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    Published articles
                  </p>
                  <p className="mt-2 text-sm leading-7 text-white/68">
                    Static seed count now, Firestore count later.
                  </p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/8 p-5">
                  <p className="font-heading text-4xl font-bold text-white">
                    {tags.length}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    Topic tags
                  </p>
                  <p className="mt-2 text-sm leading-7 text-white/68">
                    Tags are ready for CMS filtering.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {leadArticle ? (
          <div className="space-y-10">
            <SectionHeading
              eyebrow="Lead article"
              title="Start with the most recent published story"
              description="The listing sorts by published date now and can keep the same behaviour once Firestore powers the article collection."
            />
            <ArticleCard article={leadArticle} variant="featured" />
          </div>
        ) : (
          <div className="rounded-[32px] border border-brand-border bg-brand-mist/45 p-10 text-center">
            <p className="text-sm font-semibold text-slate-600">{content.emptyState}</p>
          </div>
        )}
      </section>

      <section className="bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.76fr_0.24fr] lg:items-start">
          <div className="space-y-8">
            <SectionHeading
              eyebrow="Archive"
              title={`More ${articleCategoryLabels[content.category].toLowerCase()}`}
              description="This archive is deliberately simple for the foundation pass: published content, stable route shapes, and a body renderer ready for CMS HTML."
            />

            <div className="grid gap-6 md:grid-cols-2">
              {remainingArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>

          <aside className="sticky top-32 rounded-[30px] border border-brand-border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-navy text-brand-gold">
                <Tags className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-gold">
                  Topics
                </p>
                <h2 className="font-heading text-2xl font-bold text-brand-ink">
                  Browse by signal
                </h2>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-brand-border bg-brand-mist/65 px-3 py-1.5 text-xs font-semibold text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-7 border-t border-brand-border pt-6">
              <p className="text-sm leading-7 text-slate-600">
                Filter UI will become interactive in the CMS pass. The content model already carries the tag data needed for it.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {leadArticle ? (
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-[34px] border border-brand-border bg-brand-navy p-8 text-white lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.72fr_0.28fr] lg:items-center">
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-gold">
                  Latest signal
                </p>
                <h2 className="font-heading text-3xl font-bold sm:text-4xl">
                  {leadArticle.title}
                </h2>
                <p className="max-w-3xl text-sm leading-7 text-white/72">
                  {getArticleLabel(leadArticle)} published on {formatDate(leadArticle.publishedAt)}. Estimated reading time:{" "}
                  {getArticleReadTime(leadArticle)} minutes.
                </p>
              </div>
              <Link
                href={`/news-and-updates/${leadArticle.category}/${leadArticle.slug}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-6 py-3.5 text-sm font-bold text-brand-ink transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Read the lead article
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
