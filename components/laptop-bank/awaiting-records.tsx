import { cn } from "@/lib/utils/cn";

/**
 * The state every Phase 2 page is in until real records exist.
 *
 * Spec §9 BUILD: "Pages 5.11–5.14 must not appear in navigation or sitemap
 * until populated with real records." Spec §10: "Phase 2 pages return 404 or
 * are noindex until populated."
 *
 * These pages are served rather than 404'd, so that the team can review them
 * internally and so the routes are stable the moment records land — but they
 * are noindex, out of the navigation, and out of the sitemap until then.
 *
 * What they must never do is fill the gap. Draft 1 §16 rules out publishing
 * any count that cannot be evidenced from a record, any story without recorded
 * consent, any composite presented as an individual, and any claim that
 * equipment is responsibly recycled without a named partner behind it. So an
 * unpopulated Phase 2 page says plainly that it has nothing to publish yet.
 */
export function AwaitingRecords({
  title,
  body,
  className,
}: {
  title: string;
  body: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[30px] border border-brand-border bg-brand-mist/40 px-6 py-10 text-center sm:px-10",
        className,
      )}
    >
      <h2 className="font-heading text-2xl font-bold text-brand-ink">{title}</h2>
      <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600">{body}</p>
    </div>
  );
}
