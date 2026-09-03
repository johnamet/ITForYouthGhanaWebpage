import { notFound, redirect } from "next/navigation";
import { Database } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { RecordForm } from "@/components/admin/record-form";
import { getDescriptor } from "@/lib/cms/descriptors/registry";
import {
  isSeedCollection,
  resolveFields,
  templateRecord,
} from "@/lib/cms/descriptors/seed-collections";

export default function AdminCmsNewRecordPage({
  params,
}: {
  params: { type: string };
}) {
  const descriptor = getDescriptor(params.type);
  if (!descriptor) notFound();

  // There is nothing to create for a singleton.
  if (descriptor.shape === "singleton") {
    redirect(`/admin/cms/${descriptor.key}/${descriptor.singletonId}`);
  }

  const seedBacked = isSeedCollection(descriptor);
  if (!(descriptor.allowCreate ?? !seedBacked)) {
    redirect(`/admin/cms/${descriptor.key}`);
  }

  const template = seedBacked ? templateRecord(descriptor) : undefined;
  const fields = resolveFields(descriptor, { isCreate: true });

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow={descriptor.plural}
        title={`Add a ${descriptor.label.toLowerCase()}`}
        description={descriptor.description}
        icon={<Database className="h-6 w-6" />}
      />

      {/*
        A record added to a seed-backed collection inherits its structure from
        one of the shipped records, and any field left empty keeps that
        record's wording rather than rendering blank. Saying so here is the
        difference between an editor filling the form in and an editor
        discovering another department's services under a new name.
      */}
      {template ? (
        <div className="rounded-[24px] border border-amber-300 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
          This starts from the structure of “{template.title}”. Every field you leave empty will
          show that record’s wording, so work through the form before publishing.
        </div>
      ) : null}

      <RecordForm descriptor={descriptor} fields={fields} />
    </div>
  );
}
