import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export default function AdminNewTeamMemberPage() {
  return (
    <AdminPlaceholder
      title="Create Team Member"
      description="The create route is ready for profile onboarding."
      nextSteps={["Capture role, department, bio, social links, and media."]}
    />
  );
}
