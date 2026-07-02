import type { Metadata } from "next";

import { ImpactTestimonialsPage } from "@/components/impact/impact-testimonials-page";
import { getCmsImpactPage } from "@/lib/cms/impact-pages";
import { impactTestimonialsContent } from "@/lib/content/impact-config";

export const metadata: Metadata = {
  title: impactTestimonialsContent.eyebrow,
  description: impactTestimonialsContent.description,
};

export default async function TestimonialsPage() {
  const content = await getCmsImpactPage("testimonials");

  return <ImpactTestimonialsPage content={content} />;
}
