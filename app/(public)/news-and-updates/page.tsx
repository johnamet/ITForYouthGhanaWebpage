import { ContentPage } from "@/components/shared/content-page";
import { buildHubPage } from "@/lib/content/page-builders";

const page = buildHubPage(
  "news-and-updates",
  "News & Updates",
  "The article system now has stable list and detail routes for both news and blog content.",
  [
    {
      title: "News",
      description: "Operational updates, announcements, and time-sensitive stories.",
      href: "/news-and-updates/news",
      eyebrow: "Article type",
    },
    {
      title: "Blogs",
      description: "Thought leadership, reflections, and longer-form writing.",
      href: "/news-and-updates/blogs",
      eyebrow: "Article type",
    },
  ],
);

export default function NewsAndUpdatesPage() {
  return <ContentPage page={page} />;
}
