import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TeamForm } from "@/components/admin/team-form";
import { getCmsTeamMemberById } from "@/lib/cms/team";

type AdminEditTeamMemberPageProps = {
  params: { id: string };
};

export default async function AdminEditTeamMemberPage({ params }: AdminEditTeamMemberPageProps) {
  const member = await getCmsTeamMemberById(params.id);

  if (!member) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="People & governance"
        title={`Edit team member: ${member.name}`}
        description="Update profile fields, department ordering, featured status, and visibility."
      />

      <TeamForm mode="edit" member={member} />
    </div>
  );
}
