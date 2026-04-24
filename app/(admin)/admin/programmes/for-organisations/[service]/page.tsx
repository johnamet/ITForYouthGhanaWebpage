import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

type AdminOrganisationServicePageProps = {
  params: { service: string };
};

export default function AdminOrganisationServicePage({ params }: AdminOrganisationServicePageProps) {
  return (
    <AdminPlaceholder
      title={`Organisation Service Editor: ${params.service}`}
      description="The new organisational service routes are ready for future CMS-backed editing."
      nextSteps={[
        "Connect each service slug to a Firestore-backed document.",
        "Add rich text, CTAs, and proof blocks.",
        "Reuse page-section primitives across service routes.",
      ]}
    />
  );
}
