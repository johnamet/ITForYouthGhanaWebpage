import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export default function AdminUsersPage() {
  return (
    <AdminPlaceholder
      title="Users"
      description="Super-admin account management will be implemented here."
      nextSteps={[
        "Manage roles and invite states.",
        "Restrict access by claim-aware auth checks.",
        "Keep an audit trail for account changes.",
      ]}
    />
  );
}
