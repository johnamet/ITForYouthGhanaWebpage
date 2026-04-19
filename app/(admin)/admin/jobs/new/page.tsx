import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export default function AdminNewJobPage() {
  return (
    <AdminPlaceholder
      title="Create Job Listing"
      description="This route is reserved for the future job creation form."
      nextSteps={["Capture role type, description, CTA, and visibility state."]}
    />
  );
}
