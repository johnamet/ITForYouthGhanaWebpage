import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export default function AdminDashboardPage() {
  return (
    <AdminPlaceholder
      title="Dashboard"
      description="The admin shell is in place and ready for Firebase-authenticated content operations in later phases."
      nextSteps={[
        "Firebase auth guard will replace the placeholder access model.",
        "Dashboard cards can summarize applications, recent edits, and publishing health.",
        "The surrounding shell is already wired for future navigation expansion.",
      ]}
    />
  );
}
