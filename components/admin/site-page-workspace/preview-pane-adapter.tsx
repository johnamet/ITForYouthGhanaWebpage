"use client";

import { PreviewFrame } from "@/components/admin/workspace-kit/preview-frame";

import { useSitePageWorkspace } from "./record-provider";

export function SitePagePreviewPane() {
  const { family, published, draft, activeRegion, payloadVersion, selectRegion } =
    useSitePageWorkspace();

  return (
    <PreviewFrame
      previewRoute={`/admin/site-pages/${family.id}/${encodeURIComponent(published.slug)}/preview`}
      payloadVersion={payloadVersion}
      data={draft}
      activeSectionId={activeRegion.id}
      // Page settings and the not-shown region render nothing, so there is
      // nowhere to scroll. This is what PreviewFrame's nullable prop is for.
      scrollTargetId={activeRegion.previewTarget}
      onSelectSection={selectRegion}
      footerLabel={`${family.label} · ${published.title || published.slug} · ${activeRegion.label}`}
      subject={`${family.label}: ${published.title || published.slug}`}
      publicHref={`${family.publicBase}/${published.slug}`}
    />
  );
}
