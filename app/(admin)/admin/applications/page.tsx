import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export default function AdminApplicationsPage() {
  return (
    <AdminPlaceholder
      title="Applications"
      description="A dedicated operational route for learner applications is already in place."
      nextSteps={[
        "Display application status, notes, and filters.",
        "Support CSV export and quick actions.",
        "Connect form submissions from the public apply route later.",
      ]}
    />
  );
}
