import { notFound, redirect } from "next/navigation";
import { Database } from "lucide-react";

import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { listRecords, type AdminRecord } from "@/lib/cms/descriptors/crud";
import { getDescriptor } from "@/lib/cms/descriptors/registry";
import { isSeedCollection, seedCollectionRows } from "@/lib/cms/descriptors/seed-collections";
import { adminHubs } from "@/lib/content/admin-registry";
import type { AdminTableColumn } from "@/types/admin";

type Row = AdminRecord & {
  /** Seed-backed rows carry where they came from and whether they were edited. */
  __seeded?: boolean;
  __edited?: boolean;
  __overrides?: number;
};

function displayValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.length ? `${value.length}` : "—";
  return String(value);
}

/**
 * The list screen for any descriptor-driven collection.
 *
 * A seed-backed collection lists what the SITE ships, annotated with whether
 * anything has been changed — eight departments against an empty Firestore
 * collection have to appear as eight rows, not as an empty table. Reading them
 * out of Firestore would have shown "No departments yet", which is worse than
 * no editor at all: it reads as data loss, and the obvious next move would be
 * to recreate a record that already exists.
 */
export default async function AdminCmsRecordsPage({
  params,
}: {
  params: { type: string };
}) {
  const descriptor = getDescriptor(params.type);
  if (!descriptor) notFound();

  // A singleton has no list. Send the editor straight to the one record rather
  // than showing a one-row table that only ever links to itself.
  if (descriptor.shape === "singleton") {
    redirect(`/admin/cms/${descriptor.key}/${descriptor.singletonId}`);
  }

  const seedBacked = isSeedCollection(descriptor);
  const rows: Row[] = seedBacked
    ? (await seedCollectionRows(descriptor)).map((row) => ({
        ...row.record,
        id: row.id,
        [descriptor.titleField]: row.title,
        __seeded: row.seeded,
        __edited: row.edited,
        __overrides: row.overrides,
      }))
    : ((await listRecords(descriptor.key)) as Row[]);

  // Columns are derived from the descriptor: the title field, then the next
  // three plain fields, then an edit link. Deriving them means a new field
  // shows up in the list without a second edit here.
  const summaryFields = descriptor.fields
    .filter((field) => field.key !== descriptor.titleField && !field.wide && !field.createOnly)
    .slice(0, 3);

  const columns: AdminTableColumn<Row>[] = [
    {
      key: descriptor.titleField,
      label:
        descriptor.fields.find((field) => field.key === descriptor.titleField)?.label ?? "Record",
      render: (row) => (
        <p className="font-bold text-slate-950">{displayValue(row[descriptor.titleField])}</p>
      ),
    },
    ...summaryFields.map((field) => ({
      key: field.key,
      label: field.label,
      render: (row: Row) => (
        <span className="text-sm text-slate-700">{displayValue(row[field.key])}</span>
      ),
    })),
    ...(seedBacked
      ? [
          {
            key: "__edited",
            label: "Content",
            render: (row: Row) => (
              <span className="text-sm text-slate-700">
                {row.__seeded === false
                  ? "Added here"
                  : row.__edited
                    ? `Edited — ${row.__overrides} field${row.__overrides === 1 ? "" : "s"}`
                    : "As shipped"}
              </span>
            ),
          },
        ]
      : []),
    {
      key: "actions",
      label: "",
      className: "text-right",
      render: (row) => (
        <a
          href={`/admin/cms/${descriptor.key}/${encodeURIComponent(row.id)}`}
          className="text-sm font-semibold text-brand-navy hover:text-brand-ink"
        >
          Edit
        </a>
      ),
    },
  ];

  // A seed-backed collection does not offer "add" unless it says so: adding a
  // department is a content decision, adding an initiative is a programme with
  // its own routing and imagery, so each declares for itself.
  const allowCreate = descriptor.allowCreate ?? !seedBacked;
  const hubLabel = adminHubs.find((hub) => hub.key === descriptor.hub)?.label ?? "Content";

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow={hubLabel}
        title={descriptor.plural}
        description={descriptor.description}
        icon={<Database className="h-6 w-6" />}
      />

      {allowCreate ? (
        <div>
          <a
            href={`/admin/cms/${descriptor.key}/new`}
            className="inline-flex items-center gap-2 rounded-control border border-brand-navy bg-brand-navy px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white hover:text-brand-navy"
          >
            Add a {descriptor.label.toLowerCase()}
          </a>
        </div>
      ) : null}

      <AdminDataTable
        columns={columns}
        rows={rows}
        emptyMessage={`No ${descriptor.plural.toLowerCase()} yet.`}
      />
    </div>
  );
}
