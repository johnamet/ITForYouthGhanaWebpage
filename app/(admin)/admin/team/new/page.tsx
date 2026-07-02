import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TeamForm } from "@/components/admin/team-form";

export default function AdminNewTeamMemberPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="People & governance"
        title="Create team member"
        description="Add a new team profile with department grouping, ordering, and optional public contact links."
      />

      <TeamForm mode="create" />
    </div>
  );
}
