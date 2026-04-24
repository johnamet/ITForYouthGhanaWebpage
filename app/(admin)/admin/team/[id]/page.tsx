import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

type AdminEditTeamMemberPageProps = {
  params: { id: string };
};

export default function AdminEditTeamMemberPage({ params }: AdminEditTeamMemberPageProps) {
  return (
    <AdminPlaceholder
      title={`Edit Team Member: ${params.id}`}
      description="The route is ready for document loading and profile editing."
      nextSteps={["Preserve ordering and featured state while editing."]}
    />
  );
}
