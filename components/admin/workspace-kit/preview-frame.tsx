"use client";

import { Monitor, RefreshCw, Smartphone, Tablet, Zap } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  PREVIEW_DRAFT,
  PREVIEW_READY,
  PREVIEW_SCROLL,
  PREVIEW_SELECT,
  isTrustedPreviewEvent,
  type CanvasToParentMessage,
} from "./preview-protocol";
import { cn } from "@/lib/utils/cn";

const VIEWPORTS = [
  { id: "desktop", label: "Desktop preview", width: 1280, icon: Monitor },
  { id: "tablet", label: "Tablet preview", width: 820, icon: Tablet },
  { id: "mobile", label: "Mobile preview", width: 390, icon: Smartphone },
] as const;

/** Debounce for draft payloads. Long enough to coalesce typing, short enough
 *  that the preview still feels live. */
const DRAFT_DEBOUNCE_MS = 120;

/**
 * How long to wait for the canvas's readiness handshake before treating the
 * preview as failed. iframe `onError` does not fire for HTTP errors, auth
 * redirects, or hangs — and an expired session is redirected by middleware to
 * /admin-login, which would otherwise render the login form silently inside
 * the preview. None of those cases post the handshake, so one timeout covers
 * all of them.
 */
const READY_TIMEOUT_MS = 8000;

export type PreviewFrameProps<TData> = {
  /** Admin route the iframe loads. */
  previewRoute: string;
  /** Increments on every draft change; drives the debounced post and the
   *  boundary resets inside the canvas. */
  payloadVersion: number;
  /** The whole payload the canvas renders. */
  data: TData;
  /** Which section is active, sent with each payload so the canvas can
   *  outline it. */
  activeSectionId: string;
  /** Section to scroll the preview to, or null when the active section
   *  renders nothing on the page. */
  scrollTargetId: string | null;
  /** Called when someone clicks an outlined section inside the canvas. */
  onSelectSection: (sectionId: string) => void;
  /** Right-hand text in the frame's footer strip. */
  footerLabel: string;
  /**
   * Accessible name for the iframe. It must describe THIS workspace's page —
   * a site page announcing itself as "Homepage preview" would be false — so
   * it is a caller's prop, and the screenshot script keys off the frame's
   * `data-preview-frame` attribute instead of this text.
   */
  title: string;
};

export function PreviewFrame<TData>({
  previewRoute,
  payloadVersion,
  data,
  activeSectionId,
  scrollTargetId,
  onSelectSection,
  footerLabel,
  title,
}: PreviewFrameProps<TData>) {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [stage, setStage] = useState({ width: 0, height: 0 });
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [viewport, setViewport] = useState<(typeof VIEWPORTS)[number]["id"]>("desktop");
  const [reloadKey, setReloadKey] = useState(0);
  // Set when the canvas itself asked for a section, so the scroll effect below
  // does not animate the view away from what the editor just clicked.
  const skipScrollFor = useRef<string | null>(null);

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
      if (message.type === PREVIEW_READY) {
        setReady(true);
        // A self-reload (e.g. dev HMR) re-fires this handshake without
        // `ready` transitioning, since it was already true — so the debounced
        // draft effect below never reposts. Posting here too keeps the
        // canvas from falling back to its published baseline until the next
        // keystroke.
        post({
          type: PREVIEW_DRAFT,
          payloadVersion,
          data,
          activeSectionId,
        });
        return;
      }
      if (message.type === PREVIEW_SELECT) {
        skipScrollFor.current = message.sectionId;
        onSelectSection(message.sectionId);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onSelectSection, post, payloadVersion, data, activeSectionId]);

  // Downward channel: debounced draft payloads. Always all seven sections, so
  // the parent stays authoritative even immediately after a save.
  useEffect(() => {
    if (!ready) {
      return;
    }
    const timer = window.setTimeout(() => {
      post({
        type: PREVIEW_DRAFT,
        payloadVersion,
        data,
        activeSectionId,
      });
    }, DRAFT_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [ready, post, payloadVersion, data, activeSectionId]);

  // Selecting in the rail scrolls the preview to the matching section. A
  // selection that came FROM the canvas is skipped: the editor is already
  // looking at that section, so echoing a scroll back would animate away from
  // where they clicked.
  useEffect(() => {
    if (!ready || scrollTargetId === null) {
      return;
    }
    const skip = skipScrollFor.current;
    skipScrollFor.current = null;

    if (skip === scrollTargetId) {
      return;
    }
    post({ type: PREVIEW_SCROLL, sectionId: scrollTargetId });
  }, [ready, post, scrollTargetId]);

  // Failure detection. See READY_TIMEOUT_MS: the handshake is the only signal
  // that distinguishes a working preview from a login page, an error page, or
  // a hang, because none of those fire onError.
  useEffect(() => {
    if (ready) {
      return;
    }
    const timer = window.setTimeout(() => setFailed(true), READY_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [ready, reloadKey]);

  // A reload discards readiness until the fresh document announces itself, and
  // gives a failed preview another chance.
  const refresh = () => {
    setReady(false);
    setFailed(false);
    setReloadKey((key) => key + 1);
  };

  const active = VIEWPORTS.find((option) => option.id === viewport) ?? VIEWPORTS[0];

  // The preview column is far narrower than a desktop viewport, so a truthful
  // 1280px render has to be scaled down to be visible. Measuring the stage is
  // what lets the scale be exact rather than guessed.
  useEffect(() => {
    const element = stageRef.current;
    if (!element) {
      return;
    }
    const observer = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect;
      if (!box) {
        return;
      }
      // Rounded to whole pixels so subpixel resize noise cannot thrash state.
      setStage({ width: Math.round(box.width), height: Math.round(box.height) });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [failed]);

  // Never scale above 1: a preset narrower than the stage renders at 1:1.
  const scale =
    stage.width > 0 ? Math.min(1, stage.width / active.width) : 1;

  return (
    <section
      aria-label="Live homepage preview"
      className="flex h-full min-h-0 flex-col bg-slate-200 p-4 2xl:p-5"
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-media border border-slate-300 bg-white shadow-sm">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-3 py-2.5">
          <div className="flex rounded-control border border-slate-200 bg-slate-50 p-0.5">
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

        <div
          ref={stageRef}
          className="flex min-h-0 flex-1 justify-center overflow-auto bg-slate-300/70 p-4"
        >
          {failed ? (
            <div className="m-auto max-w-sm text-center text-sm text-slate-600">
              <p className="font-bold text-brand-ink">
                The preview could not load.
              </p>
              <p className="mt-2 leading-6">
                Your session may have expired — try refreshing the preview, or
                reload this page to sign in again. Editing and saving still
                work, and you can open the public page in a new tab to check
                your changes.
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
              // The scaled footprint. Sizing this to the post-transform
              // dimensions keeps the scroll extents honest — a transform alone
              // does not affect layout, which is what made the old Fit control
              // useless.
              style={{
                width: Math.round(active.width * scale),
                height: stage.height || undefined,
              }}
              className="shrink-0"
            >
              <div
                // The true viewport box. Its width is what the iframe's media
                // queries resolve against, so it must be the real preset width
                // and must never itself be a percentage.
                style={{
                  width: active.width,
                  height: stage.height ? Math.round(stage.height / scale) : "100%",
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                }}
              >
                <iframe
                  key={reloadKey}
                  ref={frameRef}
                  src={previewRoute}
                  title={title}
                  data-preview-frame=""
                  onError={() => setFailed(true)}
                  className="h-full w-full rounded-control border-0 bg-white shadow-sm"
                />
              </div>
            </div>
          )}
        </div>

        <p className="shrink-0 border-t border-slate-200 px-3 py-2 text-[0.64rem] text-slate-500">
          Click any outlined section to edit it · Homepage ·{" "}
          {footerLabel}
        </p>
      </div>
    </section>
  );
}
