"use client";

import { useEffect } from "react";

/**
 * Error boundary for the preview documents.
 *
 * Every route in this group renders inside a 390px-to-1280px iframe whose only
 * readiness signal is a postMessage handshake. When a preview document throws,
 * that handshake never happens, and after eight seconds PreviewFrame tells the
 * editor their session may have expired — which was false and misleading the
 * one time it mattered: a Server Component calling a client-only function threw
 * on every request for all sixteen page previews, and the message sent whoever
 * hit it off to re-authenticate.
 *
 * So this page says plainly that the preview failed to render, and shows the
 * digest, which is what makes the next such failure legible. Sized for the
 * narrowest preset, because that is where it is least forgiving.
 */
export default function AdminPreviewError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Preview document failed to render.", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white px-5 py-10">
      <div className="mx-auto max-w-md rounded-media border border-rose-200 bg-rose-50/60 p-5">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-rose-700">
          Preview error
        </p>
        <h1 className="mt-2 font-heading text-xl font-bold text-brand-ink">
          This preview failed to render
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          The page could not be built from the current draft. Your session is
          fine and nothing you have typed has been lost — the editor beside this
          panel still holds it, and saving still works.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 rounded-control bg-brand-navy px-4 py-2 text-sm font-semibold text-white"
        >
          Try rendering again
        </button>
        {error.digest ? (
          <p className="mt-4 break-all text-xs text-slate-500">
            Reference: {error.digest}
          </p>
        ) : null}
      </div>
    </div>
  );
}
