import { ContentHubPage as ContentHubPageView } from "@/components/admin/content-hub-page";

export const dynamic = "force-dynamic";

export default function ContentHubPage({ params }: { params: { hub: string } }) {
  return <ContentHubPageView hubKey={params.hub} />;
}
