import { notFound } from "next/navigation";

import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

const sections: Record<string, { title: string; description: string }> = {
  homepage: {
    title: "Homepage Builder",
    description: "Section ordering, toggles, and homepage editing will land here.",
  },
  banner: {
    title: "Announcement Banner",
    description: "Scheduling, variant, CTA, and countdown controls are reserved here.",
  },
  "hero-slides": {
    title: "Hero Slides",
    description: "Slide CRUD, ordering, and media upload workflows will land here.",
  },
  "impact-stats": {
    title: "Impact Statistics",
    description: "Editable count-up metrics and homepage proof points live here next.",
  },
  "donation-campaign": {
    title: "Donation Campaign",
    description: "Campaign narrative, progress, and CTA editing belongs here.",
  },
  "featured-story": {
    title: "Featured Story",
    description: "Story/video content editing is reserved in this route.",
  },
  "floating-elements": {
    title: "Floating Elements",
    description: "Donate CTA and future exit-intent controls will be managed here.",
  },
};

type AdminContentSectionPageProps = {
  params: { section: string };
};

export default function AdminContentSectionPage({ params }: AdminContentSectionPageProps) {
  const page = sections[params.section];
  if (!page) {
    notFound();
  }

  return (
    <AdminPlaceholder
      title={page.title}
      description={page.description}
      nextSteps={[
        "Connect Firestore-backed content schema.",
        "Add rich form controls and drag-and-drop ordering where needed.",
        "Trigger on-demand revalidation after saves.",
      ]}
    />
  );
}
