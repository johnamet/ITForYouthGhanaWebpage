import type { Metadata } from "next";

import { ImpactReportsPage as ImpactReportsTemplate } from "@/components/impact/impact-reports-page";
import { impactReportsContent } from "@/lib/content/impact-config";

export const metadata: Metadata = {
  title: "Impact Reports | IT For Youth Ghana",
  description:
    "Read IT For Youth Ghana impact briefs, evidence themes, and the reporting context behind the work.",
};

export default function ImpactReportsPage() {
  return <ImpactReportsTemplate content={impactReportsContent} />;
}
