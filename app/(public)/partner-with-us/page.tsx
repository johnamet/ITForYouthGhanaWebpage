import type { Metadata } from "next";

import { PartnerWithUsOverviewPage } from "@/components/partnerships/partner-with-us-overview-page";
import { getCmsPartnershipOverview, getCmsPartnershipTracks } from "@/lib/cms/partnerships";

export const metadata: Metadata = {
  title: "Partner with us",
  description: "Work with IT For Youth Ghana through dedicated partner tracks.",
};

export default async function PartnerWithUsPage() {
  const [content, tracks] = await Promise.all([
    getCmsPartnershipOverview(),
    getCmsPartnershipTracks(),
  ]);
  return <PartnerWithUsOverviewPage content={content} tracks={tracks} />;
}
