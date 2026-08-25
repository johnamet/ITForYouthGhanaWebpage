import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NewsArticlePage } from "@/components/news/news-article-page";
import {
  getCmsArticleBySlug,
  getCmsPublishedArticles,
  getCmsRelatedArticles,
} from "@/lib/cms/articles";
import {
  isArticleCategory,
} from "@/lib/content/news-config";

type ArticleDetailPageProps = {
  params: { category: string; slug: string };
};

export async function generateStaticParams() {
  return (await getCmsPublishedArticles()).map((article) => ({
    category: article.category,
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  if (!isArticleCategory(params.category)) {
    return {
      title: "Article",
    };
  }

  const article = await getCmsArticleBySlug(params.category, params.slug);

  if (!article) {
    return {
      title: "Article",
    };
  }

  return {
    title: article.seo?.title ?? article.title,
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

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  if (!isArticleCategory(params.category)) {
    notFound();
  }

  const article = await getCmsArticleBySlug(params.category, params.slug);

  if (!article) {
    notFound();
  }

  return (
    <NewsArticlePage
      article={article}
      relatedArticles={await getCmsRelatedArticles(article)}
    />
  );
}
