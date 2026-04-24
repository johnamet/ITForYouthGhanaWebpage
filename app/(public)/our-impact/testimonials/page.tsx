import { ContentPage } from "@/components/shared/content-page";
import { buildHubPage } from "@/lib/content/page-builders";

const page = buildHubPage(
  "testimonials",
  "Testimonials",
  "Prepared for a mix of written stories, video clips, and homepage-selected social proof.",
  [
    {
      title: "News & Updates",
      description: "Keep stories fresh with supporting news and blog content.",
      href: "/news-and-updates",
      eyebrow: "Story path",
    },
  ],
);

export default function TestimonialsPage() {
  return <ContentPage page={page} />;
}
