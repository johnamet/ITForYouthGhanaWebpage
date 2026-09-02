import { GraduationCap } from "lucide-react";

import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusPill } from "@/components/admin/admin-status-pill";
import {
  getStudentApplications,
  type CmsStudentApplication,
} from "@/lib/cms/laptop-bank-submissions";
import type { AdminTableColumn } from "@/types/admin";

const ACCESS_LABELS: Record<string, string> = {
  none: "No access",
  "phone-only": "Phone only",
  "shared-machine": "Shared machine",
  "campus-lab-or-cafe": "Campus lab or cafe",
  "broken-laptop": "Broken laptop",
};

/**
 * The Her First Laptop application inbox (build spec §6.2).
 *
 * The list shows the preferred name where one was given. Spec §6.2 says
 * preferred name is "used in all correspondence", and a selection panel
 * reading a list of legal names when the applicant asked to be called
 * something else is the small kind of disrespect that adds up.
 *
 * Current computer access is in the list because spec 5.7 makes it the first
 * selection criterion — it is what a panel sorts on.
 */
const columns: AdminTableColumn<CmsStudentApplication>[] = [
  {
    key: "reference",
    label: "Reference",
    render: (row) => (
      <div>
        <p className="font-mono text-xs font-bold text-slate-950">{row.reference}</p>
        <p className="mt-1 text-sm text-slate-500">{row.createdAt?.slice(0, 10) ?? "—"}</p>
      </div>
    ),
  },
  {
    key: "fullName",
    label: "Applicant",
    render: (row) => (
      <div>
        <p className="font-bold text-slate-950">{row.preferredName || row.fullName}</p>
        <p className="mt-1 text-sm text-slate-500">{row.regionOfResidence}</p>
      </div>
    ),
  },
  {
    key: "institution",
    label: "Studying",
    render: (row) => (
      <div>
        <p className="max-w-xs text-sm font-semibold text-slate-800">{row.institution}</p>
        <p className="mt-1 text-sm text-slate-500">
          {[row.programmeOfStudy, row.yearOfStudy].filter(Boolean).join(" · ")}
        </p>
      </div>
    ),
  },
  {
    key: "currentComputerAccess",
    label: "Current access",
    render: (row) => (
      <span className="text-sm text-slate-800">
        {ACCESS_LABELS[row.currentComputerAccess] ?? row.currentComputerAccess}
      </span>
    ),
  },
  {
    key: "flags",
    label: "Flags",
    render: (row) =>
      row.proofOfEnrolmentStorageFailed ? (
        <p className="text-xs font-bold text-amber-700">Proof lost</p>
      ) : (
        <span className="text-sm text-slate-400">—</span>
      ),
  },
  {
    key: "status",
    label: "Status",
    render: (row) => <AdminStatusPill status={row.status} />,
  },
  {
    key: "actions",
    label: "",
    className: "text-right",
    render: (row) => (
      <a
        href={`/admin/laptop-bank/applications/${row.reference}`}
        className="text-sm font-semibold text-brand-navy hover:text-brand-ink"
      >
        Review
      </a>
    ),
  },
];

export default async function AdminLaptopBankApplicationsPage() {
  const applications = await getStudentApplications();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Her First Laptop"
        title="Laptop applications"
        description="Applications submitted through /her-first-laptop/apply. Every applicant gets an outcome, whether or not they are selected."
        icon={<GraduationCap className="h-6 w-6" />}
      />

      <AdminDataTable
        columns={columns}
        rows={applications}
        emptyMessage="No applications yet. Applications submitted through the public form appear here."
      />
    </div>
  );
}
