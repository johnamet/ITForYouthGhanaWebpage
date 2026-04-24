import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export default function AdminMediaPage() {
  return (
    <AdminPlaceholder
      title="Media Library"
      description="The future Storage browser will land on this route."
      nextSteps={[
        "Support folders, previews, and copyable public URLs.",
        "Connect uploads across articles, team, initiatives, and partners.",
        "Add rename and delete controls with confirmations.",
      ]}
    />
  );
}
