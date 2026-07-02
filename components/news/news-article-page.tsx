import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Mail,
  Tags,
  UserRound,
} from "lucide-react";

import { ArticleCard } from "@/components/news/article-card";
import {
  articleCategoryLabels,
  getArticleLabel,
  getArticleReadTime,
} from "@/lib/content/news-config";
import { formatDate } from "@/lib/utils/formatters";
import type { ArticleSeed } from "@/types/content";

type NewsArticlePageProps = {
  article: ArticleSeed;
  relatedArticles: ArticleSeed[];
};

function getArticleHtml(article: ArticleSeed) {
  if (article.contentHtml) {
    return article.contentHtml;
  }

  return article.content.map((paragraph) => `<p>${paragraph}</p>`).join("");
}

export function NewsArticlePage({
  article,
  relatedArticles,
}: NewsArticlePageProps) {
  return (
    <article className="bg-white">
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="absolute inset-0">
          {article.coverImage ? (
            <Image
              src={article.coverImage}
              alt={article.coverAlt ?? article.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-hero-grid" />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(10,27,52,0.95)_0%,rgba(10,27,52,0.8)_52%,rgba(10,27,52,0.34)_100%)]" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
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
            <Link
              href={`/news-and-updates/${article.category}`}
              className="transition hover:text-white"
            >
              {articleCategoryLabels[article.category]}
            </Link>
            <span>/</span>
            <span className="text-white">Article</span>
          </nav>

          <div className="space-y-6">
            <Link
              href={`/news-and-updates/${article.category}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/75 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {articleCategoryLabels[article.category].toLowerCase()}
            </Link>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-brand-gold px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-ink">
                {getArticleLabel(article)}
              </span>
              {article.featured ? (
                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white">
                  Featured
                </span>
              ) : null}
            </div>

            <h1 className="font-heading text-5xl font-bold leading-tight sm:text-6xl">
              {article.title}
            </h1>
            <p className="max-w-3xl text-xl leading-8 text-slate-100">
              {article.excerpt}
            </p>

            <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-white/78">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-brand-gold" />
                {formatDate(article.publishedAt)}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-brand-gold" />
                {getArticleReadTime(article)} min read
              </span>
              {article.author ? (
                <span className="inline-flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-brand-gold" />
                  {article.author.name}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.72fr_0.28fr] lg:px-8">
        <div className="min-w-0">
          <div className="rounded-[34px] border border-brand-border bg-white p-6 shadow-sm sm:p-8 lg:p-10">
            {/* Static seed HTML now. Sanitize CMS/TipTap HTML before it reaches this renderer. */}
            <div
              className="article-prose"
              dangerouslySetInnerHTML={{ __html: getArticleHtml(article) }}
            />
          </div>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
          {article.author ? (
            <div className="rounded-[30px] border border-brand-border bg-brand-mist/45 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-gold">
                Author
              </p>
              <div className="mt-5 flex items-center gap-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-full bg-white">
                  {article.author.avatar ? (
                    <Image
                      src={article.author.avatar}
                      alt={article.author.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-brand-navy text-brand-gold">
                      <UserRound className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="font-heading text-xl font-bold text-brand-ink">
                    {article.author.name}
                  </h2>
                  <p className="text-sm font-medium text-slate-600">
                    {article.author.role}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {article.tags?.length ? (
            <div className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-navy text-brand-gold">
                  <Tags className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-gold">
                    Tags
                  </p>
                  <h2 className="font-heading text-2xl font-bold text-brand-ink">
                    Article topics
                  </h2>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-brand-border bg-brand-mist/65 px-3 py-1.5 text-xs font-semibold text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="rounded-[30px] border border-brand-border bg-brand-warm p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-navy text-brand-gold">
              <Mail className="h-4 w-4" />
            </div>
            <h2 className="mt-5 font-heading text-2xl font-bold text-brand-ink">
              Stay close to the next update
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              The newsletter route is already scaffolded across the site, ready to connect programme openings, stories, and partner news.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center justify-center rounded-full bg-brand-navy px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Contact the team
            </Link>
          </div>
        </aside>
      </section>

      {relatedArticles.length ? (
        <section className="bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-gold">
                  Keep reading
                </p>
                <h2 className="mt-3 font-heading text-3xl font-bold text-brand-ink sm:text-4xl">
                  Related updates and reflections
                </h2>
              </div>
              <Link
                href="/news-and-updates"
                className="rounded-full border border-brand-border bg-white px-5 py-3 text-sm font-bold text-brand-navy transition hover:border-brand-gold"
              >
                View all updates
              </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {relatedArticles.map((relatedArticle) => (
                <ArticleCard
                  key={relatedArticle.slug}
                  article={relatedArticle}
                  variant="compact"
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}
