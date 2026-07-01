import type { Metadata } from "next";

import { ImpactOverviewPage } from "@/components/impact/impact-overview-page";
import { getCmsPartners } from "@/lib/cms/partners";
import { impactOverviewContent } from "@/lib/content/impact-config";

export const metadata: Metadata = {
  title: impactOverviewContent.eyebrow,
  description: impactOverviewContent.description,
};

export default async function OurImpactPage() {
  const partners = await getCmsPartners();

  return <ImpactOverviewPage content={impactOverviewContent} partners={partners} />;
}
