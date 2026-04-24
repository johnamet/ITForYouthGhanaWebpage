import { ContentPage } from "@/components/shared/content-page";
import { buildHubPage } from "@/lib/content/page-builders";

const page = buildHubPage(
  "impact-reports",
  "Impact Reports",
  "A reporting-focused route for charts, downloads, narrative proof, and future annual report assets.",
  [
    {
      title: "Testimonials",
      description: "Pair hard numbers with participant and partner stories.",
      href: "/our-impact/testimonials",
      eyebrow: "Impact path",
    },
    {
      title: "UN SDGs",
      description: "Show how programmes align with broader development outcomes.",
      href: "/our-impact/sdgs",
      eyebrow: "Impact path",
    },
  ],
);

export default function ImpactReportsPage() {
  return <ContentPage page={page} />;
}
