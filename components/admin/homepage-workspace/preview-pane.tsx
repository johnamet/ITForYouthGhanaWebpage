"use client";

import { Maximize2, Monitor, RefreshCw, Smartphone, Tablet, Zap } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useWorkspace } from "./workspace-provider";
import {
  isTrustedPreviewEvent,
  PREVIEW_ROUTE,
  type CanvasToParentMessage,
} from "./preview-messages";
import { cn } from "@/lib/utils/cn";

const VIEWPORTS = [
  { id: "desktop", label: "Desktop preview", width: "100%", icon: Monitor },
  { id: "tablet", label: "Tablet preview", width: "760px", icon: Tablet },
  { id: "mobile", label: "Mobile preview", width: "390px", icon: Smartphone },
] as const;

/** Debounce for draft payloads. Long enough to coalesce typing, short enough
 *  that the preview still feels live. */
const DRAFT_DEBOUNCE_MS = 120;

export function PreviewPane() {
  const { values, activeSection, payloadVersion, selectSection } = useWorkspace();
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [viewport, setViewport] = useState<(typeof VIEWPORTS)[number]["id"]>("desktop");
  const [fit, setFit] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const post = useCallback((message: unknown) => {
    frameRef.current?.contentWindow?.postMessage(message, window.location.origin);
  }, []);

  // Upward channel: readiness and section clicks.
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!isTrustedPreviewEvent(event)) {
        return;
      }
      if (event.source !== frameRef.current?.contentWindow) {
        return;
      }
      const message = event.data as CanvasToParentMessage | null;
      if (!message || typeof message !== "object") {
        return;
      }
      if (message.type === "itfyg:preview-ready") {
        setReady(true);
        return;
      }
      if (message.type === "itfyg:preview-select") {
        selectSection(message.sectionId);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [selectSection]);

  // Downward channel: debounced draft payloads. Always all seven sections, so
  // the parent stays authoritative even immediately after a save.
  useEffect(() => {
    if (!ready) {
      return;
    }
    const timer = window.setTimeout(() => {
      post({
        type: "itfyg:preview-draft",
        payloadVersion,
        values,
        activeSectionId: activeSection.id,
      });
    }, DRAFT_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [ready, post, payloadVersion, values, activeSection.id]);

  // Selecting in the rail scrolls the preview to the matching section.
  useEffect(() => {
    if (!ready) {
      return;
    }
    post({ type: "itfyg:preview-scroll", sectionId: activeSection.id });
  }, [ready, post, activeSection.id]);

  // A reload discards readiness until the fresh document announces itself.
  const refresh = () => {
    setReady(false);
    setReloadKey((key) => key + 1);
  };

  const active = VIEWPORTS.find((option) => option.id === viewport) ?? VIEWPORTS[0];

  return (
    <section
      aria-label="Live homepage preview"
      className="flex h-full min-h-0 flex-col bg-slate-200 p-4 2xl:p-5"
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-media border border-slate-300 bg-white shadow-sm">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-3 py-2.5">
          <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            {VIEWPORTS.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-label={option.label}
                  aria-pressed={viewport === option.id}
                  onClick={() => setViewport(option.id)}
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-control transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent",
                    viewport === option.id
                      ? "border border-brand-border bg-white text-brand-navy"
                      : "border border-transparent text-slate-500",
                  )}
                >
                  <Icon aria-hidden className="h-3.5 w-3.5" />
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Fit preview"
              aria-pressed={fit}
              onClick={() => setFit((current) => !current)}
              className="flex h-8 w-8 items-center justify-center rounded-control border border-slate-200 text-slate-500 transition hover:bg-slate-50"
            >
              <Maximize2 aria-hidden className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              aria-label="Refresh preview"
              onClick={refresh}
              className="flex h-8 w-8 items-center justify-center rounded-control border border-slate-200 text-slate-500 transition hover:bg-slate-50"
            >
              <RefreshCw aria-hidden className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <p className="flex shrink-0 items-center gap-2 border-b border-brand-border bg-brand-mist/60 px-3 py-2 text-[0.66rem] leading-5 text-brand-navy">
          <Zap aria-hidden className="h-3 w-3 text-brand-primary" />
          <span>
            <b>Live draft:</b> typing updates this preview immediately. Save the
            section to publish.
          </span>
        </p>

        <div className="flex min-h-0 flex-1 justify-center overflow-auto bg-slate-300/70 p-4">
          {failed ? (
            <div className="m-auto max-w-sm text-center text-sm text-slate-600">
              <p className="font-bold text-brand-ink">
                The preview could not load.
              </p>
              <p className="mt-2 leading-6">
                Editing and saving still work. Open the public page in a new tab
                to check your changes.
              </p>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex rounded-control border border-brand-border bg-white px-4 py-2 text-xs font-bold text-slate-700"
              >
                Open public page
              </a>
            </div>
          ) : (
            <div
              // Width drives the iframe's real layout viewport, which is what
              // makes the homepage's Tailwind breakpoints resolve correctly.
              // Fit is a transform, which does NOT alter the layout viewport,
              // so zooming cannot corrupt the breakpoints being displayed.
              style={{
                width: active.width,
                transform: fit ? "scale(0.75)" : undefined,
                transformOrigin: "top center",
              }}
              className="h-full shrink-0"
            >
              <iframe
                key={reloadKey}
                ref={frameRef}
                src={PREVIEW_ROUTE}
                title="Homepage preview"
                onError={() => setFailed(true)}
                className="h-full min-h-[650px] w-full rounded-control border-0 bg-white shadow-sm"
              />
            </div>
          )}
        </div>

        <p className="shrink-0 border-t border-slate-200 px-3 py-2 text-[0.64rem] text-slate-500">
          Click any outlined section to edit it · Homepage ·{" "}
          {activeSection.label}
        </p>
      </div>
    </section>
  );
}
