import { ContentPage } from "@/components/shared/content-page";
import { getCmsSitePage } from "@/lib/cms/site-pages";
import { whoWeAreHub } from "@/lib/content/site-config";

export default async function WhoWeArePage() {
  const page = (await getCmsSitePage("who-we-are")) ?? whoWeAreHub;
  return <ContentPage page={page} />;
}
