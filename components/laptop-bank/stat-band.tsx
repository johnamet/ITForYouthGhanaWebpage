import { cn } from "@/lib/utils/cn";
import type { DashboardMetrics } from "@/types/laptop-bank";

type StatBandProps = {
  metrics: DashboardMetrics | null;
  className?: string;
};

/**
 * The four figures spec 5.1 block 2 publishes: "accepted, equipped, drives
 * sanitised, partners", mapped onto the Dashboard Metrics fields from 5.11.
 *
 * "Equipped" is deliberately deployed_individual + deployed_shared. Spec 5.11
 * splits deployment into individuals and clubs-and-labs, and a machine placed
 * in a school club has been equipped just as much as one handed to a student —
 * reporting only the individual figure would understate the programme and
 * would contradict /laptop-bank block 5, which exists to tell a corporate
 * donor their equipment is not ring-fenced to one campaign. Because the sum
 * needs both operands, a null in either still hides the whole band, which is
 * the behaviour spec C2 asks for anyway.
 */
type BandMetric = {
  label: string;
  /** Every field this figure needs. A null in any of them hides the band. */
  fields: readonly (keyof DashboardMetrics)[];
};

const BAND_METRICS: readonly BandMetric[] = [
  { label: "Units accepted", fields: ["units_accepted"] },
  { label: "Machines equipped", fields: ["deployed_individual", "deployed_shared"] },
  { label: "Drives sanitised", fields: ["drives_sanitised"] },
  { label: "Partner organisations", fields: ["partner_orgs"] },
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

  // Every operand of every figure must be present. Spec C2: "Auto-hides the
  // whole band if any metric is null" — a band showing three of four figures
  // invites the reader to assume the fourth is zero.
  const operands = BAND_METRICS.flatMap((metric) => metric.fields.map((field) => metrics[field]));
  if (operands.some((value) => value === null || value === undefined)) return null;

  const totals = BAND_METRICS.map((metric) => ({
    label: metric.label,
    value: metric.fields.reduce((sum, field) => sum + (metrics[field] as number), 0),
  }));

  const lastUpdated = metrics.last_updated?.trim();
  // A figure without a date is an undated claim. Spec §10 pairs the two, so an
  // absent date hides the band rather than shipping unattributed numbers.
  if (!lastUpdated) return null;

  return (
    <section className={cn("border-y border-brand-border bg-brand-mist/40", className)}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {totals.map(({ label, value }) => (
            <div key={label}>
              <p className="font-heading text-4xl font-bold text-brand-navy">
                {value.toLocaleString("en-GH")}
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
