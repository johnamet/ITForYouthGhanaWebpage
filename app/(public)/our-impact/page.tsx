import type { Metadata } from "next";

import { ImpactOverviewPage } from "@/components/impact/impact-overview-page";
import { impactOverviewContent } from "@/lib/content/impact-config";
import { partners } from "@/lib/content/site-config";

export const metadata: Metadata = {
  title: "Our Impact | IT For Youth Ghana",
  description:
    "Explore the evidence, learner stories, and SDG alignment behind IT For Youth Ghana's work.",
};

export default function OurImpactPage() {
  return <ImpactOverviewPage content={impactOverviewContent} partners={partners} />;
}
