import { ContentPage } from "@/components/shared/content-page";
import { buildHubPage } from "@/lib/content/page-builders";
import { initiatives } from "@/lib/content/site-config";

const page = buildHubPage(
  "what-we-do",
  "What We Do",
  "Eight initiative routes have been carved into the new architecture and are ready for richer storytelling.",
  initiatives.map((initiative) => ({
    title: initiative.title,
    description: initiative.description,
    href: `/what-we-do/${initiative.slug}`,
    eyebrow: initiative.eyebrow,
  })),
);

export default function WhatWeDoPage() {
  return <ContentPage page={page} />;
}
