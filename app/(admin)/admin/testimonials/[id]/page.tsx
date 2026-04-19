import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

type AdminEditTestimonialPageProps = {
  params: { id: string };
};

export default function AdminEditTestimonialPage({ params }: AdminEditTestimonialPageProps) {
  return (
    <AdminPlaceholder
      title={`Edit Testimonial: ${params.id}`}
      description="This edit route is ready for testimonial CRUD implementation."
      nextSteps={["Load the testimonial document and expose publishing controls."]}
    />
  );
}
