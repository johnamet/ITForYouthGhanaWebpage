import type { Metadata } from "next";

import { NewsHubPage } from "@/components/news/news-hub-page";
import { getCmsPublishedArticles } from "@/lib/cms/articles";
import { newsHubContent } from "@/lib/content/news-config";

export const metadata: Metadata = {
  title: "News & Updates | IT For Youth Ghana",
  description:
    "Programme news, blog reflections, events, and public updates from IT For Youth Ghana.",
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
