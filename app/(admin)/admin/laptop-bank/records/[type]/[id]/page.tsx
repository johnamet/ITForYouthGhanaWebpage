import { notFound } from "next/navigation";
import { Database } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { LaptopBankRecordForm } from "@/components/admin/laptop-bank-record-form";
import { getRecord } from "@/lib/cms/laptop-bank-admin";
import { getContentTypeDescriptor } from "@/lib/content/laptop-bank-admin-schema";

export default async function AdminLaptopBankEditRecordPage({
  params,
}: {
  params: { type: string; id: string };
}) {
  const descriptor = getContentTypeDescriptor(params.type);
  if (!descriptor) notFound();

  const record = await getRecord(descriptor.key, params.id);

  // A singleton that has never been written has no document yet. That is the
  // normal starting state, not an error, so the form opens empty and the first
  // save creates it — rather than 404ing an editor out of the only screen
  // where they could enter the figures.
  const isSingleton = descriptor.shape === "singleton";
  if (!record && !isSingleton) {
    return (
      <div className="space-y-8">
        <AdminPageHeader
          eyebrow={descriptor.plural}
          title={`Edit ${descriptor.label.toLowerCase()}`}
          description={descriptor.description}
          icon={<Database className="h-6 w-6" />}
        />
        <p className="rounded-[28px] border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-600">
          No record found. It may have been deleted, or Firebase may not be configured in this
          environment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow={descriptor.plural}
        title={
          record
            ? String(record[descriptor.titleField] || `Edit ${descriptor.label.toLowerCase()}`)
            : descriptor.label
        }
        description={descriptor.description}
        icon={<Database className="h-6 w-6" />}
      />

      <LaptopBankRecordForm
        descriptor={descriptor}
        record={record ?? (isSingleton ? { id: descriptor.singletonId as string } : undefined)}
      />
    </div>
  );
}
