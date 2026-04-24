import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export default function AdminTeamPage() {
  return (
    <AdminPlaceholder
      title="Team"
      description="Department-grouped team management belongs here."
      nextSteps={[
        "Create ordering by department.",
        "Support featured profiles and rich biographies.",
        "Connect image upload through the media library.",
      ]}
    />
  );
}
