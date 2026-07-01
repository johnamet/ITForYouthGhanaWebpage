import type { Metadata } from "next";

import { ImpactReportsPage as ImpactReportsTemplate } from "@/components/impact/impact-reports-page";
import { impactReportsContent } from "@/lib/content/impact-config";

export const metadata: Metadata = {
  title: impactReportsContent.eyebrow,
  description: impactReportsContent.description,
};

export default function ImpactReportsPage() {
  return <ImpactReportsTemplate content={impactReportsContent} />;
}
