import { notFound } from "next/navigation";

import { SitePagePreviewCanvas } from "@/components/admin/site-page-workspace/preview-canvas";
import { findSitePageFamily } from "@/lib/cms/site-page-families";
import {
  getCmsWhatWeDoDynamicPageBySlug,
  getCmsWhoWeAreDynamicPageBySlug,
} from "@/lib/cms/site-pages";
import type { EditableSitePage } from "@/types/content";

type PreviewPageProps = { params: { family: string; slug: string } };

export default async function SitePagePreviewPage({ params }: PreviewPageProps) {
  const family = findSitePageFamily(params.family);

  if (!family) {
    notFound();
  }

  const record =
    family.id === "who-we-are"
      ? await getCmsWhoWeAreDynamicPageBySlug(params.slug, true)
      : await getCmsWhatWeDoDynamicPageBySlug(params.slug, true);

  if (!record) {
    notFound();
  }

  // Firestore can return records whose prototypes are not plain objects, which
  // cannot cross the Server-to-Client boundary. Annotated before serialising so
  // the compiler checks the shape; JSON.stringify accepts `any`, so casting the
  // parse result instead would check nothing.
  const source: EditableSitePage = record;
  const baseline = JSON.parse(JSON.stringify(source)) as EditableSitePage;

  return <SitePagePreviewCanvas baseline={baseline} />;
}
