import { cn } from "@/lib/utils/cn";
import type { DashboardMetrics } from "@/types/laptop-bank";

type StatBandProps = {
  metrics: DashboardMetrics | null;
  className?: string;
};

/**
 * The four figures spec 5.1 block 2 publishes: "accepted, equipped, drives
 * sanitised, partners", mapped onto the Dashboard Metrics fields from 5.11.
 */
const BAND_METRICS = [
  { field: "units_accepted", label: "Units accepted" },
  { field: "deployed_individual", label: "Machines equipped" },
  { field: "drives_sanitised", label: "Drives sanitised" },
  { field: "partner_orgs", label: "Partner organisations" },
] as const;

/**
 * C2 — stat band.
 *
 * Spec §3: "4 metrics from one CMS record. Displays last-updated date.
 * Auto-hides the whole band if any metric is null."
 *
 * The whole band hides, not the missing tile. A band showing three of four
 * figures invites the reader to assume the fourth is zero, and spec §10 is
 * explicit that this module either shows real figures with a last-updated date
 * or is hidden: "No zeros, no placeholders." A null record hides it too, which
 * is the state at launch — getDashboardMetrics() returns null until a real
 * record exists.
 */
export function StatBand({ metrics, className }: StatBandProps) {
  if (!metrics) return null;

  const values = BAND_METRICS.map(({ field }) => metrics[field]);
  if (values.some((value) => value === null || value === undefined)) return null;

  const lastUpdated = metrics.last_updated?.trim();
  // A figure without a date is an undated claim. Spec §10 pairs the two, so an
  // absent date hides the band rather than shipping unattributed numbers.
  if (!lastUpdated) return null;

  return (
    <section className={cn("border-y border-brand-border bg-brand-mist/40", className)}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BAND_METRICS.map(({ field, label }) => (
            <div key={field}>
              <p className="font-heading text-4xl font-bold text-brand-navy">
                {(metrics[field] as number).toLocaleString("en-GH")}
              </p>
              <p className="mt-2 text-sm font-bold text-brand-ink">{label}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          {metrics.period_label?.trim() ? `${metrics.period_label} · ` : ""}Last updated {lastUpdated}
        </p>
      </div>
    </section>
  );
}
