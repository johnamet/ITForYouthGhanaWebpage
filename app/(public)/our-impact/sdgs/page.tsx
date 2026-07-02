import type { Metadata } from "next";

import { ImpactSdgsPage } from "@/components/impact/impact-sdgs-page";
import { getCmsImpactPage } from "@/lib/cms/impact-pages";
import { impactSdgsContent } from "@/lib/content/impact-config";

export const metadata: Metadata = {
  title: impactSdgsContent.eyebrow,
  description: impactSdgsContent.description,
};

export default async function SdgsPage() {
  const content = await getCmsImpactPage("sdgs");

  return <ImpactSdgsPage content={content} />;
}
