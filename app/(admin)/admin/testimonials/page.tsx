import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export default function AdminTestimonialsPage() {
  return (
    <AdminPlaceholder
      title="Testimonials"
      description="A centralized pool of stories will live here for reuse across the homepage and impact pages."
      nextSteps={[
        "Support filtering by initiative and featured state.",
        "Add create and edit flows.",
        "Make homepage carousel selections reference this collection.",
      ]}
    />
  );
}
