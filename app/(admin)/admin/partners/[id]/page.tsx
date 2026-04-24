import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

type AdminEditPartnerPageProps = {
  params: { id: string };
};

export default function AdminEditPartnerPage({ params }: AdminEditPartnerPageProps) {
  return (
    <AdminPlaceholder
      title={`Edit Partner: ${params.id}`}
      description="This edit route is ready for partner document updates."
      nextSteps={["Load partner metadata and connect revalidation to partner pages."]}
    />
  );
}
