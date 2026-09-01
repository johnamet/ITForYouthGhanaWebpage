import type { DashboardMetrics } from "@/types/laptop-bank";

type MetricCardGridProps = {
  metrics: DashboardMetrics | null;
  className?: string;
};

/** Spec 5.11's thirteen metrics, in the spec's order, with the spec's labels. */
const METRICS = [
  { field: "units_offered", label: "Units offered" },
  { field: "units_accepted", label: "Units accepted" },
  { field: "units_declined_at_offer", label: "Units declined at offer" },
  { field: "units_rejected_at_intake", label: "Units rejected at intake" },
  { field: "drives_sanitised", label: "Drives sanitised, with certificates issued" },
  { field: "deployed_individual", label: "Deployed to individuals" },
  { field: "deployed_shared", label: "Deployed to clubs and labs" },
  { field: "ownership_transfers", label: "Recipients who now own their machine" },
  { field: "retention_12m_pct", label: "Working and in the recipient’s hands at 12 months" },
  { field: "units_recycled", label: "Units recycled through a licensed handler" },
  { field: "partner_orgs", label: "Partner organisations" },
  { field: "deployment_by_region", label: "Deployment by region" },
  { field: "deployment_by_pathway", label: "Deployment by pathway" },
] as const;

/** Percentages read as percentages; everything else is a count. */
const PERCENTAGE_FIELDS = new Set<string>(["retention_12m_pct"]);

/**
 * C11 — metric card grid.
 *
 * Spec §3: "Reads Dashboard Metrics content type. Displays period label and
 * last-updated date." Spec 5.11 DATA: "Do not query the asset register live.
 * Read the CMS record only. Display its last_updated date at the top of the
 * grid."
 *
 * Unlike C2, a single missing metric does NOT hide this grid. Page 5.11's whole
 * purpose is publishing the unflattering figures beside the flattering ones —
 * Draft 1 §10 puts it plainly: the rejection and recycling figures are what
 * make the deployment figure believable. Hiding the grid because one number is
 * outstanding would let a partial dashboard look complete. So a null metric
 * reads "Not yet reported", which is distinguishable from a real zero. Only a
 * wholly absent record hides the grid.
 */
export function MetricCardGrid({ metrics, className }: MetricCardGridProps) {
  if (!metrics) return null;

  return (
    <div className={className}>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
        {[metrics.period_label?.trim(), metrics.last_updated?.trim() ? `Last updated ${metrics.last_updated}` : ""]
          .filter(Boolean)
          .join(" · ")}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {METRICS.map(({ field, label }) => {
          const value = metrics[field];
          const reported = value !== null && value !== undefined;

          return (
            <div key={field} className="rounded-[24px] border border-brand-border bg-white p-6 shadow-sm">
              {reported ? (
                <p className="font-heading text-3xl font-bold text-brand-navy">
                  {value.toLocaleString("en-GH")}
                  {PERCENTAGE_FIELDS.has(field) ? "%" : ""}
                </p>
              ) : (
                <p className="font-heading text-xl font-bold text-slate-400">Not yet reported</p>
              )}
              <p className="mt-2 text-sm leading-7 text-brand-ink">{label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
