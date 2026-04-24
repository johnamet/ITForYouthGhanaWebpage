import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export default function AdminJobsPage() {
  return (
    <AdminPlaceholder
      title="Job Listings"
      description="The careers route will eventually be driven from this CRUD surface."
      nextSteps={[
        "Support jobs and volunteer roles from one workflow.",
        "Add status and publishing controls.",
        "Connect applications to downstream operations.",
      ]}
    />
  );
}
