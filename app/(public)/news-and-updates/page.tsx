import type { Metadata } from "next";

import { NewsHubPage } from "@/components/news/news-hub-page";
import { getCmsPublishedArticles } from "@/lib/cms/articles";
import { newsHubContent } from "@/lib/content/news-config";

export const metadata: Metadata = {
  title: newsHubContent.eyebrow,
  description: newsHubContent.description,
};

export default async function NewsAndUpdatesPage() {
  const articles = await getCmsPublishedArticles();

  return (
    <NewsHubPage
      content={newsHubContent}
      articles={articles}
    />
  );
}
