import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { AdminCollectionGrid } from "@/components/admin/admin-collection-grid";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusPill } from "@/components/admin/admin-status-pill";
import {
  adminActivityItems,
  adminDashboardMetrics,
  adminRoleCapabilities,
  cmsCollections,
} from "@/lib/cms/admin-config";
import { revalidationMap } from "@/lib/utils/revalidate";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="CMS dashboard"
        title="Publishing health, content contracts, and Firebase readiness"
        description="This dashboard turns the CMS plan into an operational surface. It shows which collections exist, what is currently seeded, what will need Firestore, and how roles and revalidation fit together."
        primaryAction={{ label: "Open homepage builder", href: "/admin/content/homepage" }}
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {adminDashboardMetrics.map((metric) => (
          <AdminMetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="grid gap-8 xl:grid-cols-[0.68fr_0.32fr]">
        <section className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-gold">
                Collections
              </p>
              <h2 className="mt-2 font-heading text-3xl font-bold text-slate-950">
                Firestore collection map
              </h2>
            </div>
            <AdminStatusPill status="cms-ready" label="CMS foundation" />
          </div>
          <AdminCollectionGrid collections={cmsCollections} />
        </section>

        <aside className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-brand-gold">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">
                  Roles
                </p>
                <h2 className="font-heading text-2xl font-bold text-slate-950">
                  Access model
                </h2>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {adminRoleCapabilities.map((role) => (
                <div key={role.role} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-bold text-slate-950">{role.label}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{role.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">
              Activity
            </p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-slate-950">
              Recent build notes
            </h2>
            <div className="mt-6 space-y-4">
              {adminActivityItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="block rounded-2xl border border-slate-100 p-4 transition hover:border-brand-gold hover:bg-brand-warm/40"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-bold text-slate-950">{item.title}</p>
                    <AdminStatusPill status={item.status} />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    {item.timestamp}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">
              Revalidation
            </p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-slate-950">
              Save targets
            </h2>
            <div className="mt-5 space-y-3">
              {Object.entries(revalidationMap).map(([type, paths]) => (
                <div key={type} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-bold text-slate-950">{type}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {paths.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
