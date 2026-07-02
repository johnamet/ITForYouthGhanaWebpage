import { ContentPage } from "@/components/shared/content-page";
import { CareersList } from "@/components/shared/careers-list";
import { getCmsJobs } from "@/lib/cms/jobs";
import { getCmsSitePage } from "@/lib/cms/site-pages";
import { careersHub } from "@/lib/content/site-config";

export default async function CareersPage() {
  const [page, jobs] = await Promise.all([
    getCmsSitePage("careers"),
    getCmsJobs(false),
  ]);

  return (
    <>
      <ContentPage page={page ?? careersHub} />
      <CareersList jobs={jobs} />
    </>
  );
}
