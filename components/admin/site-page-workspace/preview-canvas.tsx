"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ContentPage } from "@/components/shared/content-page";
import { PreviewSectionBoundary } from "@/components/admin/workspace-kit/section-boundary";
import {
  isTrustedPreviewEvent,
  PREVIEW_DRAFT,
  PREVIEW_READY,
  PREVIEW_SCROLL,
  PREVIEW_SELECT,
  type ParentToCanvasMessage,
} from "@/components/admin/workspace-kit/preview-protocol";
import {
  doesTargetRender,
  sitePageRegions,
  sitePageRegionsById,
} from "@/lib/cms/site-page-regions";
import type { EditableSitePage } from "@/types/content";

/** Distinct preview targets, in the order ContentPage renders them. */
const TARGET_ORDER = ["hero", "stats", "body", "related"] as const;

type Overlay = { target: string; label: string; top: number; height: number };

export function SitePagePreviewCanvas({
  baseline,
}: {
  baseline: EditableSitePage;
}) {
  const [record, setRecord] = useState(baseline);
  const [activeRegionId, setActiveRegionId] = useState<string>("hero");
  const [payloadVersion, setPayloadVersion] = useState(0);
  const [overlays, setOverlays] = useState<Overlay[]>([]);
  const [pairingFailed, setPairingFailed] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!isTrustedPreviewEvent(event) || event.source !== window.parent) {
        return;
      }
      const message = event.data as ParentToCanvasMessage<EditableSitePage> | null;
      if (!message || typeof message !== "object") {
        return;
      }
      if (message.type === PREVIEW_DRAFT) {
        setRecord(message.data);
        setActiveRegionId(message.activeSectionId);
        setPayloadVersion(message.payloadVersion);
        return;
      }
      if (message.type === PREVIEW_SCROLL) {
        const node = rootRef.current?.querySelector<HTMLElement>(
          `[data-preview-target="${message.sectionId}"]`,
        );
        node?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    window.addEventListener("message", handleMessage);
    window.parent.postMessage({ type: PREVIEW_READY }, window.location.origin);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const onSelect = useCallback(
    (target: string) => {
      // The parent addresses regions, not targets, and hero and CTAs share the
      // hero target. If the active region already owns the clicked target,
      // keep it — clicking the hero should not yank the editor from the CTA
      // fields to the hero fields. Otherwise take the first region owning it.
      const active = sitePageRegionsById[
        activeRegionId as keyof typeof sitePageRegionsById
      ];
      const regionId =
        active?.previewTarget === target
          ? active.id
          : (sitePageRegions.find((candidate) => candidate.previewTarget === target)
              ?.id ?? "hero");

      window.parent.postMessage(
        { type: PREVIEW_SELECT, sectionId: regionId },
        window.location.origin,
      );
    },
    [activeRegionId],
  );

  // Pair ContentPage's element children against the targets we expect it to
  // have rendered. See Step 1: a mismatch means its structure changed, and
  // mispaired outlines would be worse than none.
  useEffect(() => {
    const root = rootRef.current?.firstElementChild;
    if (!root) {
      return;
    }
    // doesTargetRender, not isRegionEmpty: the two answer different questions,
    // and only this one tracks what ContentPage actually produced.
    const expected = TARGET_ORDER.filter((target) =>
      doesTargetRender(target, record),
    );
    const children = Array.from(root.children) as HTMLElement[];

    if (children.length !== expected.length) {
      setPairingFailed(true);
      setOverlays([]);
      return;
    }
    setPairingFailed(false);
    setOverlays(
      expected.map((target, index) => {
        const node = children[index];
        node.setAttribute("data-preview-target", target);
        const region = sitePageRegions.find(
          (candidate) => candidate.previewTarget === target,
        );
        return {
          target,
          label: region?.label ?? target,
          top: node.offsetTop,
          height: node.offsetHeight,
        };
      }),
    );
  }, [record, payloadVersion]);

  return (
    <div ref={rootRef} className="relative bg-white">
      <PreviewSectionBoundary label="Page" resetKey={payloadVersion}>
        <ContentPage page={record} />
      </PreviewSectionBoundary>

      {pairingFailed ? (
        <p className="sticky bottom-0 border-t border-brand-border bg-brand-alt px-4 py-2 text-xs text-slate-600">
          Section outlines are unavailable for this page. Editing and the
          preview still work; use the rail to change region.
        </p>
      ) : (
        overlays.map((overlay) => (
          <button
            key={overlay.target}
            type="button"
            onClick={() => onSelect(overlay.target)}
            style={{ top: overlay.top, height: overlay.height }}
            className={`absolute left-0 z-20 w-full border-2 transition focus:outline-none focus-visible:border-brand-accent ${
              sitePageRegionsById[activeRegionId as keyof typeof sitePageRegionsById]
                ?.previewTarget === overlay.target
                ? "border-brand-accent bg-brand-accent/[0.04]"
                : "border-transparent hover:border-brand-primary"
            }`}
          >
            <span className="sr-only">Edit {overlay.label}</span>
          </button>
        ))
      )}
    </div>
  );
}
