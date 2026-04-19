import { ContentPage } from "@/components/shared/content-page";
import { buildHubPage } from "@/lib/content/page-builders";
import { partnershipPages } from "@/lib/content/site-config";

const page = buildHubPage(
  "partner-with-us",
  "Partner With Us",
  "Five partnership tracks now sit inside a consistent structure for funders, institutions, and collaborators.",
  partnershipPages.map((partner) => ({
    title: partner.title,
    description: partner.description,
    href: `/partner-with-us/${partner.slug}`,
    eyebrow: partner.eyebrow,
  })),
);

export default function PartnerWithUsPage() {
  return <ContentPage page={page} />;
}
