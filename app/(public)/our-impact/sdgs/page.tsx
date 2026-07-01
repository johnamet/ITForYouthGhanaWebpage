import type { Metadata } from "next";

import { ImpactSdgsPage } from "@/components/impact/impact-sdgs-page";
import { impactSdgsContent } from "@/lib/content/impact-config";

export const metadata: Metadata = {
  title: impactSdgsContent.eyebrow,
  description: impactSdgsContent.description,
};

export default function SdgsPage() {
  return <ImpactSdgsPage content={impactSdgsContent} />;
}
