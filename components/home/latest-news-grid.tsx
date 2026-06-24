import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";
import {
  getArticleLabel,
  getArticleReadTime,
} from "@/lib/content/news-config";
import { formatDate } from "@/lib/utils/formatters";
import type { ArticleSeed } from "@/types/content";

type LatestNewsGridProps = {
  articles: ArticleSeed[];
};

export function LatestNewsGrid({ articles }: LatestNewsGridProps) {
  const latest = [...articles]
    .sort(
      (left, right) =>
        new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime(),
    )
    .slice(0, 3);

  return (
    <section className="bg-white px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Latest news & blog"
            title="Fresh updates from the programmes, people, and partnerships shaping the work"
            description="We’re building a homepage that always feels alive. This section previews the most recent stories while keeping the full article system ready for the CMS phase."
          />
          <Link
            href="/news-and-updates"
            className="inline-flex items-center gap-2 rounded-full border border-brand-border px-5 py-3 text-sm font-semibold text-brand-ink transition hover:border-brand-gold hover:text-brand-gold"
          >
            View all updates
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {latest.map((article) => (
            <Link
              key={article.slug}
              href={`/news-and-updates/${article.category}/${article.slug}`}
              className="group overflow-hidden rounded-[28px] border border-brand-border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-panel"
            >
              <div className="relative h-56 overflow-hidden bg-brand-mist">
                {article.coverImage ? (
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    sizes="(max-width: 1023px) 100vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-hero-grid" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/45 via-brand-navy/10 to-transparent" />
                <div className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-navy">
                  {getArticleLabel(article)}
                </div>
              </div>

              <div className="space-y-4 p-6">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  <span>{formatDate(article.publishedAt)}</span>
                  <span className="h-1 w-1 rounded-full bg-brand-gold" />
                  <span>{getArticleReadTime(article)} min read</span>
                </div>

                <div className="space-y-3">
                  <h3 className="font-heading text-2xl font-bold leading-snug text-brand-ink transition group-hover:text-brand-navy">
                    {article.title}
                  </h3>
                  <p className="overflow-hidden text-sm leading-7 text-slate-600 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                    {article.excerpt}
                  </p>
                </div>

                <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy">
                  Read more
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
