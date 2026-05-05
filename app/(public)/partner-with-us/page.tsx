import type { Metadata } from "next";

import { PartnerWithUsOverviewPage } from "@/components/partnerships/partner-with-us-overview-page";
import {
  partnershipOverviewContent,
  partnershipTracks,
} from "@/lib/content/partnership-config";

export const metadata: Metadata = {
  title: "Partner With Us | IT For Youth Ghana",
  description:
    "Explore partnership tracks for educational institutions, government, NGOs and foundations, international development actors, and technology companies.",
};

export default function PartnerWithUsPage() {
  return (
    <PartnerWithUsOverviewPage
      content={partnershipOverviewContent}
      tracks={partnershipTracks}
    />
  );
}
