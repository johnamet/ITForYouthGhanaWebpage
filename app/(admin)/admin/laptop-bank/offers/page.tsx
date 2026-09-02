import { Laptop } from "lucide-react";

import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusPill } from "@/components/admin/admin-status-pill";
import { getEquipmentOffers, type CmsEquipmentOffer } from "@/lib/cms/laptop-bank-submissions";
import type { AdminTableColumn } from "@/types/admin";

/**
 * The corporate equipment offer inbox (build spec §6.1).
 *
 * The import flag and the storage flag are shown in the list rather than only
 * on the detail screen. Both are operational signals the public form goes out
 * of its way to capture — a non-Ghana offer needs an import conversation, and
 * a donor keeping their drives changes what we have to supply — and a signal
 * only visible after a click is a signal most reviewers will miss.
 */
const columns: AdminTableColumn<CmsEquipmentOffer>[] = [
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
    key: "organisationName",
    label: "Organisation",
    render: (row) => (
      <div>
        <p className="font-bold text-slate-950">{row.organisationName}</p>
        <p className="mt-1 text-sm text-slate-500">
          {[row.city, row.country].filter(Boolean).join(", ")}
        </p>
      </div>
    ),
  },
  {
    key: "estimatedQuantity",
    label: "Offer",
    render: (row) => (
      <div>
        <p className="text-sm font-semibold text-slate-800">{row.estimatedQuantity} units</p>
        <p className="mt-1 max-w-xs text-sm text-slate-500">
          {row.equipmentTypes.length ? row.equipmentTypes.join(", ") : "—"}
        </p>
      </div>
    ),
  },
  {
    key: "flags",
    label: "Flags",
    render: (row) => {
      const flags = [
        row.import_flag ? "Outside Ghana" : null,
        row.needs_storage ? "Keeping drives" : null,
        row.assetListStorageFailed ? "Asset list lost" : null,
      ].filter(Boolean) as string[];

      if (!flags.length) return <span className="text-sm text-slate-400">—</span>;

      return (
        <div className="space-y-1">
          {flags.map((flag) => (
            <p key={flag} className="text-xs font-bold text-amber-700">
              {flag}
            </p>
          ))}
        </div>
      );
    },
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
        href={`/admin/laptop-bank/offers/${row.reference}`}
        className="text-sm font-semibold text-brand-navy hover:text-brand-ink"
      >
        Review
      </a>
    ),
  },
];

export default async function AdminLaptopBankOffersPage() {
  const offers = await getEquipmentOffers();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="IT for Youth Laptop Bank"
        title="Equipment offers"
        description="Corporate offers submitted through /laptop-bank/donate-equipment. Reply within the published service level."
        icon={<Laptop className="h-6 w-6" />}
      />

      <AdminDataTable
        columns={columns}
        rows={offers}
        emptyMessage="No equipment offers yet. Offers submitted through the public form appear here."
      />
    </div>
  );
}
