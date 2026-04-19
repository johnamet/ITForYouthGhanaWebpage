import { ContentPage } from "@/components/shared/content-page";
import { buildHubPage } from "@/lib/content/page-builders";

const page = buildHubPage(
  "partners",
  "Our Partners",
  "This route becomes the public-facing proof layer for collaborators, logos, and relationship stories.",
  [
    {
      title: "Partner with us",
      description: "Move directly into the new partnership pathways.",
      href: "/partner-with-us",
      eyebrow: "Next path",
    },
  ],
);

export default function PartnersPage() {
  return <ContentPage page={page} />;
}
