import type { Metadata } from "next";

import { ForOrganisationsOverviewPage } from "@/components/organisations/for-organisations-overview-page";
import {
  organisationOverviewContent,
  organisationServices,
} from "@/lib/content/organisation-config";

export const metadata: Metadata = {
  title: "For Organisations | IT For Youth Ghana",
  description:
    "Explore corporate training, sponsorships, graduate hiring, and staff-volunteering pathways with IT For Youth Ghana.",
};

export default function ForOrganisationsPage() {
  return (
    <ForOrganisationsOverviewPage
      content={organisationOverviewContent}
      services={organisationServices}
    />
  );
}
