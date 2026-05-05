import type { Metadata } from "next";

import { ImpactSdgsPage } from "@/components/impact/impact-sdgs-page";
import { impactSdgsContent } from "@/lib/content/impact-config";

export const metadata: Metadata = {
  title: "UN SDGs | IT For Youth Ghana",
  description:
    "See how IT For Youth Ghana's work aligns with education, gender, work, innovation, inequality, and partnership goals.",
};

export default function SdgsPage() {
  return <ImpactSdgsPage content={impactSdgsContent} />;
}
