import { ContentPage } from "@/components/shared/content-page";
import { buildHubPage } from "@/lib/content/page-builders";
import { organisationPages } from "@/lib/content/site-config";

const page = buildHubPage(
  "for-organisations",
  "For Organisations",
  "A consolidated set of routes for training, sponsorship, hiring, and staff volunteering.",
  organisationPages.map((service) => ({
    title: service.title,
    description: service.description,
    href: `/for-organisations/${service.slug}`,
    eyebrow: service.eyebrow,
  })),
);

export default function ForOrganisationsPage() {
  return <ContentPage page={page} />;
}
