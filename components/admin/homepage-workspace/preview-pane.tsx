"use client";

import { PreviewFrame } from "@/components/admin/workspace-kit/preview-frame";

import { PREVIEW_ROUTE } from "./preview-messages";
import { useWorkspace } from "./workspace-provider";

export function PreviewPane() {
  const { values, activeSection, payloadVersion, selectSection } = useWorkspace();

  return (
    <PreviewFrame
      previewRoute={PREVIEW_ROUTE}
      payloadVersion={payloadVersion}
      data={values}
      activeSectionId={activeSection.id}
      // Every homepage section the workspace edits renders on the page, so
      // there is always somewhere to scroll.
      scrollTargetId={activeSection.id}
      onSelectSection={selectSection}
      footerLabel={activeSection.label}
      title="Homepage preview"
    />
  );
}
