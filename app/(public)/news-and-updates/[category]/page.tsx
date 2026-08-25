import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NewsListingPage } from "@/components/news/news-listing-page";
import {
  getCmsArticleTags,
  getCmsArticlesByCategory,
} from "@/lib/cms/articles";
import { getCmsArticleCategoryContent } from "@/lib/cms/news-pages";
import {
  articleCategories,
  articleCategoryLabels,
  isArticleCategory,
} from "@/lib/content/news-config";

type ArticleCategoryPageProps = {
  params: { category: string };
};

export function generateStaticParams() {
  return articleCategories.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: ArticleCategoryPageProps): Promise<Metadata> {
  if (!isArticleCategory(params.category)) {
    return {
      title: "News & Updates",
    };
  }

  const content = await getCmsArticleCategoryContent(params.category);

  return {
    title: articleCategoryLabels[params.category],
    description: content.description,
  };
}

export default async function ArticleCategoryPage({
  params,
}: ArticleCategoryPageProps) {
  if (!isArticleCategory(params.category)) {
    notFound();
  }

  const [content, articles, tags] = await Promise.all([
    getCmsArticleCategoryContent(params.category),
    getCmsArticlesByCategory(params.category),
    getCmsArticleTags(params.category),
  ]);

  return (
    <NewsListingPage
      content={content}
      articles={articles}
      tags={tags}
    />
  );
}
