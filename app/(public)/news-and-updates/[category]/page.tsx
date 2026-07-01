import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NewsListingPage } from "@/components/news/news-listing-page";
import {
  getCmsArticleTags,
  getCmsArticlesByCategory,
} from "@/lib/cms/articles";
import {
  articleCategories,
  articleCategoryContent,
  articleCategoryLabels,
  isArticleCategory,
} from "@/lib/content/news-config";

type ArticleCategoryPageProps = {
  params: { category: string };
};

export function generateStaticParams() {
  return articleCategories.map((category) => ({ category }));
}

export function generateMetadata({
  params,
}: ArticleCategoryPageProps): Metadata {
  if (!isArticleCategory(params.category)) {
    return {
      title: "News & Updates | IT For Youth Ghana",
    };
  }

  const content = articleCategoryContent[params.category];

  return {
    title: `${articleCategoryLabels[params.category]} | IT For Youth Ghana`,
    description: content.description,
  };
}

export default async function ArticleCategoryPage({
  params,
}: ArticleCategoryPageProps) {
  if (!isArticleCategory(params.category)) {
    notFound();
  }

  const [articles, tags] = await Promise.all([
    getCmsArticlesByCategory(params.category),
    getCmsArticleTags(params.category),
  ]);

  return (
    <NewsListingPage
      content={articleCategoryContent[params.category]}
      articles={articles}
      tags={tags}
    />
  );
}
