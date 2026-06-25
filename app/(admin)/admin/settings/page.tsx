import { KeyRound, LockKeyhole, Settings } from "lucide-react";

import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusPill } from "@/components/admin/admin-status-pill";
import { adminSettingsGroups } from "@/lib/cms/admin-config";
import type { AdminMetric, AdminSettingsGroup, AdminTableColumn } from "@/types/admin";

const settingsMetrics: AdminMetric[] = [
  {
    label: "Settings groups",
    value: String(adminSettingsGroups.length),
    description: "SEO, contact, Firebase, and integration groups are modeled.",
    status: "active",
  },
  {
    label: "Configured",
    value: String(adminSettingsGroups.filter((group) => group.status === "configured").length),
    description: "Groups with enough seed or env data to render safely.",
    status: "configured",
  },
  {
    label: "Needs env",
    value: String(adminSettingsGroups.filter((group) => group.status === "missing").length),
    description: "Groups waiting on credentials or production configuration.",
    status: "missing",
  },
];

type SettingsRow = {
  id: string;
  group: string;
  field: string;
  value: string;
  status: AdminSettingsGroup["status"];
  secret?: boolean;
};

const settingsRows: SettingsRow[] = adminSettingsGroups.flatMap((group) =>
  group.fields.map((field) => ({
    id: `${group.id}-${field.label}`,
    group: group.label,
    field: field.label,
    value: field.secret ? "Protected value" : field.value,
    status: group.status,
    secret: field.secret,
  })),
);

const settingsColumns: AdminTableColumn<SettingsRow>[] = [
  {
    key: "group",
    label: "Group",
    render: (row) => (
      <div>
        <p className="font-bold text-slate-950">{row.group}</p>
        <AdminStatusPill status={row.status} className="mt-2" />
      </div>
    ),
  },
  {
    key: "field",
    label: "Field",
    render: (row) => (
      <div className="flex items-center gap-2">
        {row.secret ? <LockKeyhole className="h-4 w-4 text-slate-400" /> : <KeyRound className="h-4 w-4 text-slate-400" />}
        <span className="font-semibold text-slate-800">{row.field}</span>
      </div>
    ),
  },
  {
    key: "value",
    label: "Value",
    render: (row) => (
      <p className="max-w-xl break-words text-sm leading-6 text-slate-600">{row.value}</p>
    ),
  },
];

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Settings CMS"
        title="Site settings and integration readiness"
        description="A structured settings surface for SEO defaults, public contact information, Firebase configuration, Brevo notifications, and portal API wiring."
      />

      <div className="grid gap-5 md:grid-cols-3">
        {settingsMetrics.map((metric) => (
          <AdminMetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {adminSettingsGroups.map((group) => (
          <section
            key={group.id}
            className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-brand-gold">
                  <Settings className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">
                    {group.id}
                  </p>
                  <h2 className="mt-2 font-heading text-2xl font-bold text-slate-950">
                    {group.label}
                  </h2>
                </div>
              </div>
              <AdminStatusPill status={group.status} />
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">{group.description}</p>
          </section>
        ))}
      </div>

      <AdminDataTable columns={settingsColumns} rows={settingsRows} />
    </div>
  );
}
