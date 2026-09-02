import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { Database } from "lucide-react";

import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { listRecords, type AdminRecord } from "@/lib/cms/laptop-bank-admin";
import { getContentTypeDescriptor } from "@/lib/content/laptop-bank-admin-schema";
import type { AdminTableColumn } from "@/types/admin";

function displayValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

export default async function AdminLaptopBankRecordsPage({
  params,
}: {
  params: { type: string };
}) {
  const descriptor = getContentTypeDescriptor(params.type);
  if (!descriptor) notFound();

  // A singleton has no list. Send the editor straight to the one record rather
  // than showing a one-row table that only ever links to itself.
  if (descriptor.shape === "singleton") {
    redirect(`/admin/laptop-bank/records/${descriptor.key}/${descriptor.singletonId}`);
  }

  const records = await listRecords(descriptor.key);

  // Columns are derived from the descriptor: the title field, then the next
  // three non-longform fields, then a review link. Deriving them means a new
  // field shows up in the list without a second edit here.
  const summaryFields = descriptor.fields
    .filter((field) => field.key !== descriptor.titleField && !field.wide)
    .slice(0, 3);

  const columns: AdminTableColumn<AdminRecord>[] = [
    {
      key: descriptor.titleField,
      label: descriptor.fields.find((field) => field.key === descriptor.titleField)?.label ?? "Record",
      render: (row) => (
        <p className="font-bold text-slate-950">{displayValue(row[descriptor.titleField])}</p>
      ),
    },
    ...summaryFields.map((field) => ({
      key: field.key,
      label: field.label,
      render: (row: AdminRecord) => (
        <span className="text-sm text-slate-700">{displayValue(row[field.key])}</span>
      ),
    })),
    {
      key: "actions",
      label: "",
      className: "text-right",
      render: (row) => (
        <a
          href={`/admin/laptop-bank/records/${descriptor.key}/${encodeURIComponent(row.id)}`}
          className="text-sm font-semibold text-brand-navy hover:text-brand-ink"
        >
          Edit
        </a>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="IT for Youth Laptop Bank"
        title={descriptor.plural}
        description={descriptor.description}
        icon={<Database className="h-6 w-6" />}
      />

      <div>
        <a
          href={`/admin/laptop-bank/records/${descriptor.key}/new`}
          className="inline-flex items-center gap-2 rounded-control border border-brand-navy bg-brand-navy px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white hover:text-brand-navy"
        >
          Add a {descriptor.label.toLowerCase()}
        </a>
      </div>

      <AdminDataTable
        columns={columns}
        rows={records}
        emptyMessage={`No ${descriptor.plural.toLowerCase()} yet.`}
      />
    </div>
  );
}
