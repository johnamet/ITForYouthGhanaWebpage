import { cn } from "@/lib/utils/cn";

type AdminStatusPillProps = {
  status: string;
  label?: string;
  className?: string;
};

const statusStyles: Record<string, string> = {
  published: "bg-emerald-100 text-emerald-700",
  draft: "bg-slate-100 text-slate-700",
  archived: "bg-zinc-200 text-zinc-700",
  new: "bg-amber-100 text-amber-700",
  reviewed: "bg-sky-100 text-sky-700",
  shortlisted: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
  enrolled: "bg-teal-100 text-teal-700",
  // Laptop Bank submission review states. Offer statuses follow the spec's own
  // vocabulary (5.2 stage 1: accepted in full, in part, or declined); without
  // these every row's pill fell back to grey and the status column carried no
  // signal at all.
  reviewing: "bg-sky-100 text-sky-700",
  "accepted-in-full": "bg-emerald-100 text-emerald-700",
  "accepted-in-part": "bg-lime-100 text-lime-800",
  declined: "bg-rose-100 text-rose-700",
  collected: "bg-teal-100 text-teal-700",
  "waiting-list": "bg-amber-100 text-amber-800",
  offered: "bg-emerald-100 text-emerald-700",
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-slate-100 text-slate-700",
  configured: "bg-emerald-100 text-emerald-700",
  missing: "bg-rose-100 text-rose-700",
  "live-seed": "bg-brand-warm text-brand-navy",
  "cms-ready": "bg-sky-100 text-sky-700",
  "needs-firebase": "bg-amber-100 text-amber-700",
  protected: "bg-violet-100 text-violet-700",
  live: "bg-emerald-100 text-emerald-700",
  hidden: "bg-slate-100 text-slate-700",
  planned: "bg-amber-100 text-amber-700",
};

function humanizeStatus(status: string) {
  return status
    .split("-")
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(" ");
}

export function AdminStatusPill({
  status,
  label,
  className,
}: AdminStatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-bold",
        statusStyles[status] ?? "bg-slate-100 text-slate-700",
        className,
      )}
    >
      {label ?? humanizeStatus(status)}
    </span>
  );
}
