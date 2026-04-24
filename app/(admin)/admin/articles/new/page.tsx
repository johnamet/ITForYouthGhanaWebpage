import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export default function AdminNewArticlePage() {
  return (
    <AdminPlaceholder
      title="Create Article"
      description="This route will host the TipTap-backed article creation flow."
      nextSteps={[
        "Create title, slug, excerpt, body, tags, and SEO fields.",
        "Connect cover uploads to the media library.",
        "Support preview and scheduled publishing.",
      ]}
    />
  );
}
