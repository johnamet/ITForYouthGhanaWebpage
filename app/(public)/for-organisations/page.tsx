import type { Metadata } from "next";

import { ForOrganisationsOverviewPage } from "@/components/organisations/for-organisations-overview-page";
import { organisationOverviewContent } from "@/lib/content/organisation-config";
import { getCmsOrganisationOverview, getCmsOrganisationServices } from "@/lib/cms/organisations";

export const metadata: Metadata = {
  title: organisationOverviewContent.title,
  description: organisationOverviewContent.description,
};

export default async function ForOrganisationsPage() {
  const [content, services] = await Promise.all([getCmsOrganisationOverview(), getCmsOrganisationServices()]);
  return (
    <ForOrganisationsOverviewPage
      content={content}
      services={services}
    />
  );
}
