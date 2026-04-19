import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

type AdminEditJobPageProps = {
  params: { id: string };
};

export default function AdminEditJobPage({ params }: AdminEditJobPageProps) {
  return (
    <AdminPlaceholder
      title={`Edit Job Listing: ${params.id}`}
      description="The route is ready for job editing and lifecycle changes."
      nextSteps={["Load the record, preserve draft/published state, and sync careers pages."]}
    />
  );
}
