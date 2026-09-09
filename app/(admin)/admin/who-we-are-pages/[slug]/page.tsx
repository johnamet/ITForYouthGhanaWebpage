import { notFound } from "next/navigation";

import { SitePageWorkspaceBar } from "@/components/admin/site-page-workspace/workspace-bar";
import { RegionEditor } from "@/components/admin/site-page-workspace/region-editor";
import { RegionRail } from "@/components/admin/site-page-workspace/region-rail";
import { SitePageWorkspaceProvider } from "@/components/admin/site-page-workspace/record-provider";
import { SitePagePreviewPane } from "@/components/admin/site-page-workspace/preview-pane-adapter";
import { WorkspaceShell } from "@/components/admin/workspace-kit/workspace-shell";
import { SITE_PAGE_FAMILIES } from "@/lib/cms/site-page-families";
import { getCmsWhoWeAreDynamicPageBySlug } from "@/lib/cms/site-pages";
import type { EditableSitePage } from "@/types/content";

type PageProps = {
  params: { slug: string };
  searchParams: { region?: string };
};

export default async function AdminEditWhoWeAreDynamicPage({
  params,
  searchParams,
}: PageProps) {
  const record = await getCmsWhoWeAreDynamicPageBySlug(params.slug, true);

  if (!record) {
    notFound();
  }

  const source: EditableSitePage = record;
  const publishedRecord = JSON.parse(JSON.stringify(source)) as EditableSitePage;

  return (
    <SitePageWorkspaceProvider
      family={SITE_PAGE_FAMILIES["who-we-are"]}
      publishedRecord={publishedRecord}
      initialRegionId={searchParams.region ?? null}
    >
      <WorkspaceShell
        bar={<SitePageWorkspaceBar />}
        rail={<RegionRail />}
        editor={<RegionEditor />}
        preview={<SitePagePreviewPane />}
      />
    </SitePageWorkspaceProvider>
  );
}
