import type { Metadata } from "next";

import { ImpactReportsPage as ImpactReportsTemplate } from "@/components/impact/impact-reports-page";
import { getCmsImpactPage } from "@/lib/cms/impact-pages";
import { impactReportsContent } from "@/lib/content/impact-config";

export const metadata: Metadata = {
  title: impactReportsContent.eyebrow,
  description: impactReportsContent.description,
};

export default async function ImpactReportsPage() {
  const content = await getCmsImpactPage("reports");

  return <ImpactReportsTemplate content={content} />;
}
