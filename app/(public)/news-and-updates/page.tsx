import type { Metadata } from "next";

import { NewsHubPage } from "@/components/news/news-hub-page";
import { getCmsPublishedArticles } from "@/lib/cms/articles";
import { getCmsNewsPage } from "@/lib/cms/news-pages";
import { newsHubContent } from "@/lib/content/news-config";

export const metadata: Metadata = {
  title: newsHubContent.eyebrow,
  description: newsHubContent.description,
};

export default async function NewsAndUpdatesPage() {
  const [content, articles] = await Promise.all([
    getCmsNewsPage("hub"),
    getCmsPublishedArticles(),
  ]);

  return (
    <NewsHubPage
      content={content}
      articles={articles}
    />
  );
}
