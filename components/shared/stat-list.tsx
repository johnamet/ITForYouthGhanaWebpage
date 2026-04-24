import type { HighlightStat } from "@/types/content";

type StatListProps = {
  stats: HighlightStat[];
  compact?: boolean;
};

export function StatList({ stats, compact = false }: StatListProps) {
  return (
    <div className={`grid gap-4 ${compact ? "sm:grid-cols-3" : "md:grid-cols-3"}`}>
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-3xl border border-brand-border bg-white p-6 shadow-sm">
          <p className="font-heading text-3xl font-semibold text-brand-navy">{stat.value}</p>
          <p className="mt-2 text-sm font-semibold text-brand-ink">{stat.label}</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">{stat.description}</p>
        </div>
      ))}
    </div>
  );
}
