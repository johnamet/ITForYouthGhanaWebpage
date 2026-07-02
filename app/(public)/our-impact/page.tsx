import type { Metadata } from "next";

import { ImpactOverviewPage } from "@/components/impact/impact-overview-page";
import { getCmsImpactPage } from "@/lib/cms/impact-pages";
import { getCmsPartners } from "@/lib/cms/partners";
import { impactOverviewContent } from "@/lib/content/impact-config";

export const metadata: Metadata = {
  title: impactOverviewContent.eyebrow,
  description: impactOverviewContent.description,
};

export default async function OurImpactPage() {
  const [content, partners] = await Promise.all([
    getCmsImpactPage("overview"),
    getCmsPartners(),
  ]);

  return <ImpactOverviewPage content={content} partners={partners} />;
}
