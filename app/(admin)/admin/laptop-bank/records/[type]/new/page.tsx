import { notFound, redirect } from "next/navigation";
import { Database } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { RecordForm } from "@/components/admin/record-form";
import { getContentTypeDescriptor } from "@/lib/content/laptop-bank-admin-schema";

export default function AdminLaptopBankNewRecordPage({
  params,
}: {
  params: { type: string };
}) {
  const descriptor = getContentTypeDescriptor(params.type);
  if (!descriptor) notFound();

  // There is nothing to create for a singleton.
  if (descriptor.shape === "singleton") {
    redirect(`/admin/laptop-bank/records/${descriptor.key}/${descriptor.singletonId}`);
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow={descriptor.plural}
        title={`Add a ${descriptor.label.toLowerCase()}`}
        description={descriptor.description}
        icon={<Database className="h-6 w-6" />}
      />

      <RecordForm descriptor={descriptor} />
    </div>
  );
}
