import { ContentPage } from "@/components/shared/content-page";
import { buildHubPage } from "@/lib/content/page-builders";

const page = buildHubPage(
  "how-it-works",
  "How It Works",
  "The new training flow is scaffolded for application steps, review states, and support content.",
  [
    {
      eyebrow: "Operational path",
      title: "Applications",
      description: "Admin tables and statuses are scaffolded for future applicant management.",
      href: "/admin/applications",
    },
  ],
);

export default function HowItWorksPage() {
  return <ContentPage page={page} />;
}
