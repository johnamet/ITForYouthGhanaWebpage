"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Loader2,
  Plus,
  RotateCcw,
  Save,
  ShieldAlert,
  Trash2,
} from "lucide-react";

import {
  asRows,
  emptyRow,
  initialValues,
  rowValue,
  type FieldValue,
  type FormValues,
  type ListRow,
} from "@/lib/cms/descriptors/form-values";
import type {
  ContentTypeDescriptor,
  FieldDescriptor,
} from "@/lib/cms/descriptors/types";

const inputClassName =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20";
const textareaClassName =
  "mt-2 min-h-32 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm leading-7 text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20";

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

/**
 * A repeatable group of rows.
 *
 * This control is the reason the four hand-written forms could be retired. They
 * could add a stat, remove a section, add a process step; the generated editor
 * could only reword what a seed already had, and replacing a form with
 * something that does less is not a refactor. Rows can also be reordered here,
 * which none of the forms it replaced could do — the order is the order they
 * appear on the page.
 *
 * Unknown keys on a row are carried through untouched, so a section's link
 * destination and anchor survive an edit even though neither is shown.
 */
function ListControl({
  field,
  rows,
  onChange,
  idPrefix,
}: {
  field: FieldDescriptor;
  rows: ListRow[];
  onChange: (rows: ListRow[]) => void;
  idPrefix: string;
}) {
  const itemFields = field.itemFields ?? [];

  const setRow = (index: number, key: string, value: unknown) =>
    onChange(rows.map((row, position) => (position === index ? { ...row, [key]: value } : row)));

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    onChange(next);
  };

  const label = (row: ListRow, index: number) => {
    const titleField = itemFields.find((item) => item.kind === "text" || item.kind === "textarea");
    const title = titleField ? String(row[titleField.key] ?? "").trim() : "";
    return title || `Item ${index + 1}`;
  };

  return (
    <div className="mt-3 space-y-4">
      {rows.map((row, index) => (
        <div
          key={index}
          className="rounded-[20px] border border-slate-200 bg-slate-50/70 p-4"
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              {index + 1}. {label(row, index)}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label="Move up"
                className="rounded-xl border border-slate-300 bg-white p-2 text-slate-600 transition hover:text-slate-900 disabled:opacity-40"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === rows.length - 1}
                aria-label="Move down"
                className="rounded-xl border border-slate-300 bg-white p-2 text-slate-600 transition hover:text-slate-900 disabled:opacity-40"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onChange(rows.filter((_, position) => position !== index))}
                aria-label="Remove"
                className="rounded-xl border border-rose-200 bg-white p-2 text-rose-600 transition hover:bg-rose-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {itemFields.map((itemField) => (
              <div
                key={itemField.key}
                className={itemField.wide || itemField.kind === "textarea" ? "sm:col-span-2" : undefined}
              >
                <Field
                  field={itemField}
                  value={rowValue(itemField, row)}
                  onChange={(value) => setRow(index, itemField.key, value)}
                  idPrefix={`${idPrefix}-${field.key}-${index}`}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...rows, emptyRow(itemFields)])}
        className="inline-flex items-center gap-2 rounded-control border border-brand-border bg-white px-4 py-2 text-sm font-bold text-brand-ink transition hover:border-brand-navy"
      >
        <Plus className="h-4 w-4" />
        Add
      </button>

      {rows.length === 0 ? (
        <p className="text-sm leading-6 text-slate-500">
          Nothing entered. Leaving this empty keeps the content the site ships with rather than
          removing the section.
        </p>
      ) : null}
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
  value: FieldValue;
  onChange: (value: FieldValue) => void;
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
    case "list":
      return (
        <div>
          {label}
          {help}
          <ListControl
            field={field}
            rows={asRows(value)}
            onChange={(rows) => onChange(rows)}
            idPrefix={idPrefix}
          />
        </div>
      );

    case "stringList":
      control = (
        <textarea
          id={id}
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onChange(event.target.value)}
          className={textareaClassName}
          placeholder="One per line"
        />
      );
      break;

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
          // Bounds come from the descriptor so the browser blocks an
          // impossible figure before it is submitted. The server checks them
          // again — a native min/max is a courtesy, not a control.
          min={field.min}
          max={field.max}
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
 * The one editor for every descriptor-driven content type in the admin.
 *
 * Renders from `descriptor.fields`, so adding a field to a content type is a
 * descriptor edit and nothing else. See the note at the top of
 * lib/cms/descriptors/types.ts for why this is one component rather than one
 * per type.
 */
export function RecordForm({
  descriptor,
  record,
  fields = descriptor.fields,
  fallbackRecord,
  revertible = false,
}: {
  descriptor: ContentTypeDescriptor;
  record?: Record<string, unknown> & { id?: string };
  /**
   * The fields this screen renders.
   *
   * Passed in rather than read off the descriptor because a seed-backed
   * collection generates its copy fields from the RECORD'S own seed: two
   * initiatives are not the same shape, and a shared field list would show one
   * record's sections under another record's name.
   */
  fields?: FieldDescriptor[];
  /** Seed plus stored overrides, used to fill repeatable lists. */
  fallbackRecord?: Record<string, unknown>;
  /**
   * True for a record the site ships in code, where removing the stored
   * document restores the shipped content rather than deleting anything. The
   * control says so in those words: "delete permanently" would be a lie, and
   * an editor who believed it would not press it.
   */
  revertible?: boolean;
}) {
  const router = useRouter();
  const recordId = typeof record?.id === "string" ? record.id : undefined;
  const isCreate = !recordId;

  const [values, setValues] = useState<FormValues>(() =>
    initialValues(fields, record, fallbackRecord),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notice, setNotice] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  });

  const listHref = `/admin/cms/${descriptor.key}`;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setNotice({ type: "idle", message: "" });

    try {
      const url = isCreate
        ? `/api/admin/cms/${descriptor.key}`
        : `/api/admin/cms/${descriptor.key}/${encodeURIComponent(recordId)}`;

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
    const question = revertible
      ? `Discard every change made to this ${descriptor.label.toLowerCase()} and go back to the wording the site ships with?`
      : `Delete this ${descriptor.label.toLowerCase()} permanently?`;
    if (!window.confirm(question)) return;

    setIsDeleting(true);
    setNotice({ type: "idle", message: "" });
    try {
      const response = await fetch(
        `/api/admin/cms/${descriptor.key}/${encodeURIComponent(recordId)}`,
        { method: "DELETE" },
      );
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) throw new Error(payload?.message || "Delete failed");
      // A revert leaves the record in place, so staying on it shows the
      // restored content. A delete has nothing left to show.
      if (!revertible) router.push(listHref);
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

  const setValue = (key: string, value: FieldValue) =>
    setValues((current) => ({ ...current, [key]: value }));

  const consentFields = fields.filter((field) => field.consent);
  const plainFields = fields.filter((field) => !field.consent);

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
            className={`inline-flex items-center gap-2 rounded-control border bg-white px-5 py-2.5 text-sm font-bold transition disabled:pointer-events-none disabled:opacity-60 ${
              revertible
                ? "border-slate-300 text-slate-700 hover:bg-slate-50"
                : "border-rose-300 text-rose-700 hover:bg-rose-50"
            }`}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : revertible ? (
              <RotateCcw className="h-4 w-4" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            {revertible ? "Revert to shipped content" : "Delete"}
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
