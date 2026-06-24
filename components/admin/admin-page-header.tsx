import Link from "next/link";
import { ArrowRight } from "lucide-react";

type AdminPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    href: string;
  };
};

export function AdminPageHeader({
  eyebrow = "CMS",
  title,
  description,
  primaryAction,
}: AdminPageHeaderProps) {
  return (
    <div className="rounded-[32px] bg-slate-950 p-8 text-white shadow-panel">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
            {eyebrow}
          </p>
          <h1 className="mt-3 font-heading text-4xl font-semibold">{title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
            {description}
          </p>
        </div>

        {primaryAction ? (
          <Link
            href={primaryAction.href}
            className="inline-flex items-center gap-2 rounded-full bg-brand-gold px-5 py-3 text-sm font-bold text-brand-ink transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            {primaryAction.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
