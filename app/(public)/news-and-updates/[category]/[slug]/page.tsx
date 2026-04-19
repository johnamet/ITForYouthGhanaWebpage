import { notFound } from "next/navigation";

import { articles } from "@/lib/content/site-config";
import { formatDate } from "@/lib/utils/formatters";

type ArticleDetailPageProps = {
  params: { category: string; slug: string };
};

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const article = articles.find(
    (entry) => entry.category === params.category && entry.slug === params.slug,
  );

  if (!article) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[32px] bg-white p-10 shadow-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
          {article.category.slice(0, 1).toUpperCase() + article.category.slice(1)} · {formatDate(article.publishedAt)}
        </p>
        <h1 className="mt-4 font-heading text-4xl font-semibold text-brand-ink">{article.title}</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">{article.excerpt}</p>
        <div className="mt-10 grid gap-6 text-base leading-8 text-slate-700">
          {article.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </article>
  );
}
