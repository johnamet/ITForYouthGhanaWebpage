import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

export default function AdminArticlesPage() {
  return (
    <AdminPlaceholder
      title="Articles"
      description="List, search, schedule, and review news/blog content from one route."
      nextSteps={[
        "Show draft, published, and archived article states.",
        "Link to create and edit routes already scaffolded in the tree.",
        "Add SEO previews and publish scheduling.",
      ]}
    />
  );
}
