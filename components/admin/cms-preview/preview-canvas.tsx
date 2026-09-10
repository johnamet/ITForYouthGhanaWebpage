"use client";

import { useEffect, useState } from "react";

import { PreviewSectionBoundary } from "@/components/admin/workspace-kit/section-boundary";
import {
  isTrustedPreviewEvent,
  PREVIEW_DRAFT,
  PREVIEW_READY,
  type ParentToCanvasMessage,
} from "@/components/admin/workspace-kit/preview-protocol";
import type { FormValues } from "@/lib/cms/descriptors/form-values";

import type { PreviewContext } from "./preview-context";
import { renderDescriptorPreview, type PreviewableKey } from "./preview-registry";

export function CmsPreviewCanvas({
  descriptorKey,
  baseline,
  context,
}: {
  descriptorKey: PreviewableKey;
  baseline: FormValues;
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

  return (
    <div className="bg-white">
      <PreviewSectionBoundary label="Page" resetKey={payloadVersion}>
        {renderDescriptorPreview(descriptorKey, values, context)}
      </PreviewSectionBoundary>
    </div>
  );
}
