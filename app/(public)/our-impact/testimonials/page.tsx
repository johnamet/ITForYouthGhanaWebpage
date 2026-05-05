import type { Metadata } from "next";

import { ImpactTestimonialsPage } from "@/components/impact/impact-testimonials-page";
import { impactTestimonialsContent } from "@/lib/content/impact-config";

export const metadata: Metadata = {
  title: "Testimonials | IT For Youth Ghana",
  description:
    "Read and watch learner, school, and partner stories that show the human side of IT For Youth Ghana's impact.",
};

export default function TestimonialsPage() {
  return <ImpactTestimonialsPage content={impactTestimonialsContent} />;
}
