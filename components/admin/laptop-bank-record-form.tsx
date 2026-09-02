"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Loader2, Save, ShieldAlert, Trash2 } from "lucide-react";

import type {
  ContentTypeDescriptor,
  FieldDescriptor,
} from "@/lib/content/laptop-bank-admin-schema";

const inputClassName =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20";
const textareaClassName =
  "mt-2 min-h-32 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm leading-7 text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20";

type FormValues = Record<string, string | boolean>;

function initialValues(
  descriptor: ContentTypeDescriptor,
  record?: Record<string, unknown>,
): FormValues {
  const values: FormValues = {};
  for (const field of descriptor.fields) {
    const stored = record?.[field.key];
    if (field.kind === "boolean") {
      values[field.key] = stored === true;
    } else if (field.kind === "number") {
      // null and undefined both render as an empty control, which is what
      // keeps "not counted yet" distinct from a real zero.
      values[field.key] =
        stored === null || stored === undefined ? "" : String(stored);
    } else {
      values[field.key] = typeof stored === "string" ? stored : "";
    }
  }
  return values;
}

/**
 * A field that decides whether something is published.
 *
 * Wrapped in an amber panel that says, in words, what turning it on does.
 * `Donor.display_consent` puts a real organisation's logo on the public
 * internet and `Story.publication_consent` puts a real young woman's name and
 * photograph there — a plain checkbox alongside twelve others is not an
 * adequate interface for that decision.
 */
function ConsentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[24px] border border-amber-300 bg-amber-50 p-5">
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
        <div className="w-full">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-800">
            Publishing decision
          </p>
          {children}
        </div>
      </div>
    </div>
  );
}

function Field({
  field,
  value,
  onChange,
  idPrefix,
}: {
  field: FieldDescriptor;
  value: string | boolean;
  onChange: (value: string | boolean) => void;
  idPrefix: string;
}) {
  const id = `${idPrefix}-${field.key}`;

  const label = (
    <label htmlFor={id} className="text-sm font-bold text-brand-ink">
      {field.label}
      {field.required ? (
        <span aria-hidden="true" className="ml-1 text-brand-gold">
          *
        </span>
      ) : null}
    </label>
  );

  const help = field.help ? (
    <p className="mt-2 text-sm leading-6 text-slate-500">{field.help}</p>
  ) : null;

  let control: React.ReactNode;

  switch (field.kind) {
    case "boolean":
      control = (
        <label htmlFor={id} className="mt-2 flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-700">
          <input
            id={id}
            type="checkbox"
            checked={value === true}
            onChange={(event) => onChange(event.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-brand-gold"
          />
          <span>{field.label}</span>
        </label>
      );
      return (
        <div>
          <p className="text-sm font-bold text-brand-ink">{field.label}</p>
          {control}
          {help}
        </div>
      );

    case "select":
      control = (
        <select
          id={id}
          value={String(value)}
          onChange={(event) => onChange(event.target.value)}
          className={inputClassName}
        >
          {/*
            An empty first option, so a consent select never opens already
            resting on a publishing value. The descriptor also orders the
            safest option first for the same reason.
          */}
          <option value="">Please choose</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
      break;

    case "textarea":
      control = (
        <textarea
          id={id}
          value={String(value)}
          onChange={(event) => onChange(event.target.value)}
          className={textareaClassName}
        />
      );
      break;

    case "number":
      control = (
        <input
          id={id}
          type="number"
          inputMode="numeric"
          value={String(value)}
          onChange={(event) => onChange(event.target.value)}
          className={inputClassName}
          placeholder="Leave empty if not counted yet"
        />
      );
      break;

    case "url":
    case "text":
    default:
      control = (
        <input
          id={id}
          type="text"
          value={String(value)}
          onChange={(event) => onChange(event.target.value)}
          className={inputClassName}
        />
      );
  }

  return (
    <div>
      {label}
      {control}
      {help}
    </div>
  );
}

/**
 * The one editor for all six Laptop Bank content types.
 *
 * Renders from `descriptor.fields`, so adding a field to a content type is a
 * descriptor edit and nothing else. See the note at the top of
 * lib/content/laptop-bank-admin-schema.ts for why this is one component rather
 * than six.
 */
export function LaptopBankRecordForm({
  descriptor,
  record,
}: {
  descriptor: ContentTypeDescriptor;
  record?: Record<string, unknown> & { id?: string };
}) {
  const router = useRouter();
  const recordId = typeof record?.id === "string" ? record.id : undefined;
  const isCreate = !recordId;

  const [values, setValues] = useState<FormValues>(() => initialValues(descriptor, record));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notice, setNotice] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  });

  const listHref = `/admin/laptop-bank/records/${descriptor.key}`;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setNotice({ type: "idle", message: "" });

    try {
      const url = isCreate
        ? `/api/admin/laptop-bank/records/${descriptor.key}`
        : `/api/admin/laptop-bank/records/${descriptor.key}/${encodeURIComponent(recordId)}`;

      const response = await fetch(url, {
        method: isCreate ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) throw new Error(payload?.message || "Save failed");

      setNotice({ type: "success", message: payload.message || "Saved." });

      if (descriptor.shape === "singleton") {
        router.refresh();
      } else {
        router.push(listHref);
        router.refresh();
      }
    } catch (error) {
      setNotice({
        type: "error",
        message: error instanceof Error ? error.message : "Save failed",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!recordId) return;
    if (!window.confirm(`Delete this ${descriptor.label.toLowerCase()} permanently?`)) return;

    setIsDeleting(true);
    setNotice({ type: "idle", message: "" });
    try {
      const response = await fetch(
        `/api/admin/laptop-bank/records/${descriptor.key}/${encodeURIComponent(recordId)}`,
        { method: "DELETE" },
      );
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) throw new Error(payload?.message || "Delete failed");
      router.push(listHref);
      router.refresh();
    } catch (error) {
      setNotice({
        type: "error",
        message: error instanceof Error ? error.message : "Delete failed",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  const setValue = (key: string, value: string | boolean) =>
    setValues((current) => ({ ...current, [key]: value }));

  const consentFields = descriptor.fields.filter((field) => field.consent);
  const plainFields = descriptor.fields.filter((field) => !field.consent);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {descriptor.guidance ? (
        <div className="rounded-[24px] border border-slate-300 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
          {descriptor.guidance}
        </div>
      ) : null}

      {notice.type !== "idle" ? (
        <div
          className={`flex items-start gap-3 rounded-[24px] border p-5 text-sm font-medium ${
            notice.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {notice.type === "success" ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5" />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5" />
          )}
          <span>{notice.message}</span>
        </div>
      ) : null}

      {/* Consent fields first, so the publishing decision is made deliberately
          rather than discovered at the bottom of a long form. */}
      {consentFields.length ? (
        <div className="space-y-4">
          {consentFields.map((field) => (
            <ConsentWrapper key={field.key}>
              <Field
                field={field}
                value={values[field.key]}
                onChange={(value) => setValue(field.key, value)}
                idPrefix={descriptor.key}
              />
            </ConsentWrapper>
          ))}
        </div>
      ) : null}

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5 sm:grid-cols-2">
          {plainFields.map((field) => (
            <div key={field.key} className={field.wide ? "sm:col-span-2" : undefined}>
              <Field
                field={field}
                value={values[field.key]}
                onChange={(value) => setValue(field.key, value)}
                idPrefix={descriptor.key}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-control border border-brand-navy bg-brand-navy px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white hover:text-brand-navy disabled:pointer-events-none disabled:opacity-60"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isCreate ? `Create ${descriptor.label.toLowerCase()}` : "Save changes"}
        </button>

        {recordId && descriptor.shape !== "singleton" ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 rounded-control border border-rose-300 bg-white px-5 py-2.5 text-sm font-bold text-rose-700 transition hover:bg-rose-50 disabled:pointer-events-none disabled:opacity-60"
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Delete
          </button>
        ) : null}

        {descriptor.shape !== "singleton" ? (
          <a href={listHref} className="text-sm font-semibold text-slate-600 hover:text-slate-900">
            Cancel
          </a>
        ) : null}
      </div>
    </form>
  );
}
