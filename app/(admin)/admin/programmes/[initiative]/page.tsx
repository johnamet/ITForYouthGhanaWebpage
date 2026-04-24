import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

type AdminInitiativePageProps = {
  params: { initiative: string };
};

export default function AdminInitiativePage({ params }: AdminInitiativePageProps) {
  return (
    <AdminPlaceholder
      title={`Initiative Editor: ${params.initiative}`}
      description="The dynamic initiative editor scaffold is in place for all eight What We Do routes."
      nextSteps={[
        "Load initiative documents by slug.",
        "Expose hero, overview, stats, gallery, FAQ, and SEO sections.",
        "Revalidate the initiative page and hub page after save.",
      ]}
    />
  );
}
