import { ContentPage } from "@/components/shared/content-page";
import { buildHubPage } from "@/lib/content/page-builders";

const page = buildHubPage(
  "careers",
  "Join Our Team",
  "A new home for jobs, volunteer roles, and future application flows.",
  [
    {
      title: "Applications management",
      description: "Admin-side scaffolding already exists for reviewing applications and internal notes.",
      href: "/admin/applications",
      eyebrow: "CMS scaffold",
    },
  ],
);

export default function CareersPage() {
  return <ContentPage page={page} />;
}
