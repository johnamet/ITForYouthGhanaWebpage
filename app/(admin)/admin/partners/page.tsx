import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export default function AdminPartnersPage() {
  return (
    <AdminPlaceholder
      title="Partners"
      description="Partner records, logos, URLs, and ordering will be managed here."
      nextSteps={[
        "Support creation and editing routes already scaffolded.",
        "Connect logo upload and validation.",
        "Expose homepage and public-page visibility controls.",
      ]}
    />
  );
}
