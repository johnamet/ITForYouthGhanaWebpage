import type { Metadata } from "next";

import { PartnerWithUsOverviewPage } from "@/components/partnerships/partner-with-us-overview-page";
import {
  partnershipOverviewContent,
  partnershipTracks,
} from "@/lib/content/partnership-config";

export const metadata: Metadata = {
  title: partnershipOverviewContent.eyebrow,
  description: partnershipOverviewContent.description,
};

export default function PartnerWithUsPage() {
  return (
    <PartnerWithUsOverviewPage
      content={partnershipOverviewContent}
      tracks={partnershipTracks}
    />
  );
}
