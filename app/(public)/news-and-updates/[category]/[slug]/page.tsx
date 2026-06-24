import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NewsArticlePage } from "@/components/news/news-article-page";
import {
  getArticleBySlug,
  getPublishedArticles,
  getRelatedArticles,
  isArticleCategory,
} from "@/lib/content/news-config";

type ArticleDetailPageProps = {
  params: { category: string; slug: string };
};

export function generateStaticParams() {
  return getPublishedArticles().map((article) => ({
    category: article.category,
    slug: article.slug,
  }));
}

export function generateMetadata({
  params,
}: ArticleDetailPageProps): Metadata {
  if (!isArticleCategory(params.category)) {
    return {
      title: "Article | IT For Youth Ghana",
    };
  }

  const article = getArticleBySlug(params.category, params.slug);

  if (!article) {
    return {
      title: "Article | IT For Youth Ghana",
    };
  }

  return {
    title: article.seo?.title ?? `${article.title} | IT For Youth Ghana`,
    description: article.seo?.description ?? article.excerpt,
    openGraph: {
      title: article.seo?.title ?? article.title,
      description: article.seo?.description ?? article.excerpt,
      images: article.seo?.ogImage ?? article.coverImage,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: article.author ? [article.author.name] : undefined,
    },
  };
}

export default function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  if (!isArticleCategory(params.category)) {
    notFound();
  }

  const article = getArticleBySlug(params.category, params.slug);

  if (!article) {
    notFound();
  }

  return (
    <NewsArticlePage
      article={article}
      relatedArticles={getRelatedArticles(article)}
    />
  );
}
