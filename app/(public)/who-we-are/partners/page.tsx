import { ContentPage } from "@/components/shared/content-page";
import { PartnerDirectory } from "@/components/shared/partner-directory";
import { getCmsPartners } from "@/lib/cms/partners";
import { getCmsSitePage } from "@/lib/cms/site-pages";
import { partnersHub } from "@/lib/content/site-config";

export default async function PartnersPage() {
  const [page, partners] = await Promise.all([
    getCmsSitePage("partners"),
    getCmsPartners(),
  ]);

  return (
    <>
      <ContentPage page={page ?? partnersHub} />
      <PartnerDirectory partners={partners} />
    </>
  );
}
