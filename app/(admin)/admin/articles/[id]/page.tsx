import { AdminPlaceholder } from "@/components/admin/admin-placeholder";

type AdminEditArticlePageProps = {
  params: { id: string };
};

export default function AdminEditArticlePage({ params }: AdminEditArticlePageProps) {
  return (
    <AdminPlaceholder
      title={`Edit Article: ${params.id}`}
      description="The edit route is active and ready for article CRUD wiring."
      nextSteps={[
        "Load the article document by ID.",
        "Support draft, published, and archived transitions.",
        "Trigger article and homepage revalidation after save.",
      ]}
    />
  );
}
