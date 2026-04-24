import Link from "next/link";
import { notFound } from "next/navigation";

import { articles } from "@/lib/content/site-config";
import { formatDate } from "@/lib/utils/formatters";

type ArticleCategoryPageProps = {
  params: { category: string };
};

export default function ArticleCategoryPage({ params }: ArticleCategoryPageProps) {
  if (params.category !== "news" && params.category !== "blogs") {
    notFound();
  }

  const filtered = articles.filter((article) => article.category === params.category);

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[32px] bg-hero-grid p-10 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">Article listing</p>
        <h1 className="mt-3 font-heading text-4xl font-semibold capitalize">{params.category}</h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-200">
          Seeded article routes are live now so the CMS phase can drop content into a stable structure.
        </p>
      </div>

      <div className="grid gap-5">
        {filtered.map((article) => (
          <Link
            key={article.slug}
            href={`/news-and-updates/${article.category}/${article.slug}`}
            className="rounded-[28px] border border-brand-border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-panel"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold">
              {formatDate(article.publishedAt)}
            </p>
            <h2 className="mt-3 font-heading text-2xl font-semibold text-brand-ink">{article.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{article.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
