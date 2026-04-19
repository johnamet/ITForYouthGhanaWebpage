import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export default function AdminSettingsPage() {
  return (
    <AdminPlaceholder
      title="Settings"
      description="Global SEO defaults, contact info, and integrations will live here."
      nextSteps={[
        "Capture site-wide metadata and social handles.",
        "Store integration keys and operational settings.",
        "Expose safe defaults for public rendering.",
      ]}
    />
  );
}
