import type { Metadata } from "next";

import { ForOrganisationsOverviewPage } from "@/components/organisations/for-organisations-overview-page";
import {
  organisationOverviewContent,
  organisationServices,
} from "@/lib/content/organisation-config";

export const metadata: Metadata = {
  title: organisationOverviewContent.title,
  description: organisationOverviewContent.description,
};

export default function ForOrganisationsPage() {
  return (
    <ForOrganisationsOverviewPage
      content={organisationOverviewContent}
      services={organisationServices}
    />
  );
}
