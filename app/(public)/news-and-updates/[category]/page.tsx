import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NewsListingPage } from "@/components/news/news-listing-page";
import {
  articleCategories,
  articleCategoryContent,
  articleCategoryLabels,
  getAllArticleTags,
  getArticlesByCategory,
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

export default function ArticleCategoryPage({
  params,
}: ArticleCategoryPageProps) {
  if (!isArticleCategory(params.category)) {
    notFound();
  }

  return (
    <NewsListingPage
      content={articleCategoryContent[params.category]}
      articles={getArticlesByCategory(params.category)}
      tags={getAllArticleTags(params.category)}
    />
  );
}
