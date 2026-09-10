"use client";

import { useEffect, useMemo, useState } from "react";

import { PreviewSectionBoundary } from "@/components/admin/workspace-kit/section-boundary";
import {
  isTrustedPreviewEvent,
  PREVIEW_DRAFT,
  PREVIEW_READY,
  type ParentToCanvasMessage,
} from "@/components/admin/workspace-kit/preview-protocol";
import type { FormValues } from "@/lib/cms/descriptors/form-values";

import type { PreviewContext } from "./preview-context";
import { previewDocument, type PreviewMergeInputs } from "./preview-document";
import { renderDescriptorPreview, type PreviewableKey } from "./preview-registry";

export function CmsPreviewCanvas({
  descriptorKey,
  baseline,
  merge,
  context,
}: {
  descriptorKey: PreviewableKey;
  baseline: FormValues;
  merge: PreviewMergeInputs;
  context: PreviewContext;
}) {
  const [values, setValues] = useState(baseline);
  const [payloadVersion, setPayloadVersion] = useState(0);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!isTrustedPreviewEvent(event) || event.source !== window.parent) {
        return;
      }
      const message = event.data as ParentToCanvasMessage<FormValues> | null;
      if (!message || typeof message !== "object") {
        return;
      }
      if (message.type === PREVIEW_DRAFT) {
        setValues(message.data);
        setPayloadVersion(message.payloadVersion);
      }
      // PREVIEW_SCROLL is ignored: this preview has no addressable sections,
      // because the compositions are opaque and there is no rail to scroll from.
    };

    window.addEventListener("message", handleMessage);
    // Announce readiness, or the parent's first payload races the iframe load.
    window.parent.postMessage({ type: PREVIEW_READY }, window.location.origin);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  /**
   * The draft merged onto the server-read baseline, in the shape the public
   * renderers actually take.
   *
   * The form reports a FLAT map of stored-only values; a renderer wants the
   * nested seed-merged document. Running the public read's own merge here is
   * what keeps the preview honest — see preview-document.ts.
   *
   * `list` fields carry their rows whole, so those live-update. `stringList`
   * fields are coerced from newline text before merging, for the same reason.
   * Top-level numbers and booleans do not live-update and cannot: the merge
   * refuses a string where the seed holds a number, and page descriptors do
   * not generate top-level controls of those kinds anyway.
   */
  const merged = useMemo(() => previewDocument(values, merge), [values, merge]);

  return (
    <div className="bg-white">
      <PreviewSectionBoundary label="Page" resetKey={payloadVersion}>
        {renderDescriptorPreview(descriptorKey, merged, context)}
      </PreviewSectionBoundary>
    </div>
  );
}
