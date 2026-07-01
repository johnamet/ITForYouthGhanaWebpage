import type { Metadata } from "next";

import { ImpactTestimonialsPage } from "@/components/impact/impact-testimonials-page";
import { getCmsTestimonials } from "@/lib/cms/testimonials";
import { impactTestimonialsContent } from "@/lib/content/impact-config";
import type { ImpactStory } from "@/types/content";

export const metadata: Metadata = {
  title: impactTestimonialsContent.eyebrow,
  description: impactTestimonialsContent.description,
};

function buildImpactStories(): Promise<ImpactStory[]> {
  return getCmsTestimonials().then((testimonials) =>
    testimonials.slice(0, 4).map((testimonial, index) => ({
      id: `cms-story-${testimonial.id}`,
      title: testimonial.programme
        ? `${testimonial.programme} story`
        : `Learner story ${index + 1}`,
      quote: testimonial.quote,
      name: testimonial.name,
      role: testimonial.role,
      programme: testimonial.programme ?? "IT For Youth Ghana",
      year: testimonial.year ?? "Recent cohort",
      theme: testimonial.programme ?? "Learner progression",
      image: testimonial.avatar,
      format: "written",
    })),
  );
}

export default async function TestimonialsPage() {
  const stories = await buildImpactStories();
  const content = stories.length
    ? {
        ...impactTestimonialsContent,
        stories,
        themes: Array.from(new Set(stories.map((story) => story.theme))).slice(0, 6),
      }
    : impactTestimonialsContent;

  return <ImpactTestimonialsPage content={content} />;
}
