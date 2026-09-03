import { notFound } from "next/navigation";
import { Database } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { RecordForm } from "@/components/admin/record-form";
import { getRecord } from "@/lib/cms/descriptors/crud";
import { getDescriptor } from "@/lib/cms/descriptors/registry";
import {
  findSeedRecord,
  isSeedCollection,
  mergedRecordFor,
  resolveFields,
} from "@/lib/cms/descriptors/seed-collections";

export default async function AdminCmsEditRecordPage({
  params,
}: {
  params: { type: string; id: string };
}) {
  const descriptor = getDescriptor(params.type);
  if (!descriptor) notFound();

  const stored = await getRecord(descriptor.key, params.id);
  const seedBacked = isSeedCollection(descriptor);
  const seedRecord = seedBacked ? findSeedRecord(descriptor, params.id) : undefined;

  // A singleton that has never been written has no document yet, and neither
  // does a seed-backed record nobody has edited. Both are the normal starting
  // state rather than an error: the form opens with the shipped content and
  // the first save creates the document.
  const isSingleton = descriptor.shape === "singleton";
  const expected = isSingleton || Boolean(seedRecord);

  if (!stored && !expected) {
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

  const fields = resolveFields(descriptor, { id: params.id, stored });
  const fallbackRecord = mergedRecordFor(descriptor, params.id, stored);
  const record = stored ?? { id: params.id };

  const title = seedRecord
    ? seedRecord.title
    : String(
        (fallbackRecord?.[descriptor.titleField] ?? record[descriptor.titleField]) ||
          `Edit ${descriptor.label.toLowerCase()}`,
      );

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow={descriptor.plural}
        title={title}
        description={descriptor.description}
        icon={<Database className="h-6 w-6" />}
      />

      <RecordForm
        descriptor={descriptor}
        record={record}
        fields={fields}
        fallbackRecord={fallbackRecord}
        revertible={Boolean(seedRecord)}
      />
    </div>
  );
}
