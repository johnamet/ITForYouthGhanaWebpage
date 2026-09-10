"use client";

import { useState } from "react";

import { PreviewFrame } from "@/components/admin/workspace-kit/preview-frame";
import { WorkspaceShell } from "@/components/admin/workspace-kit/workspace-shell";
import { RecordForm } from "@/components/admin/record-form";
import type { FormValues } from "@/lib/cms/descriptors/form-values";
import type { ContentTypeDescriptor, FieldDescriptor } from "@/lib/cms/descriptors/types";

export function EditorWithPreview({
  descriptor,
  record,
  fields,
  fallbackRecord,
  revertible,
  recordId,
  initialValues,
}: {
  descriptor: ContentTypeDescriptor;
  record?: Record<string, unknown> & { id?: string };
  fields?: FieldDescriptor[];
  fallbackRecord?: Record<string, unknown>;
  revertible?: boolean;
  recordId: string;
  initialValues: FormValues;
}) {
  // Observed, never owned: RecordForm keeps its own state and its own save.
  const [values, setValues] = useState<FormValues>(initialValues);
  const [payloadVersion, setPayloadVersion] = useState(0);

  return (
    <WorkspaceShell
      bar={
        <header className="shrink-0 border-b border-slate-200 bg-white/95 px-4 py-4 shadow-sm backdrop-blur sm:px-6">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brand-primary">
            {descriptor.plural}
          </p>
          <h1 className="mt-1 font-heading text-2xl font-bold text-brand-ink">
            {descriptor.label}
          </h1>
        </header>
      }
      editor={
        <div className="h-full min-h-0 overflow-y-auto bg-brand-alt p-5">
          <RecordForm
            descriptor={descriptor}
            record={record}
            fields={fields}
            fallbackRecord={fallbackRecord}
            revertible={revertible}
            onValuesChange={(next) => {
              setValues(next);
              setPayloadVersion((version) => version + 1);
            }}
          />
        </div>
      }
      preview={
        <PreviewFrame
          previewRoute={`/admin/cms-preview/${descriptor.key}/${encodeURIComponent(recordId)}/preview`}
          payloadVersion={payloadVersion}
          data={values}
          activeSectionId={descriptor.key}
          // Null: this preview has no addressable sections to scroll to.
          scrollTargetId={null}
          onSelectSection={() => {}}
          footerLabel={descriptor.label}
          subject={descriptor.label}
          publicHref={descriptor.previewHref ?? "/"}
        />
      }
    />
  );
}
