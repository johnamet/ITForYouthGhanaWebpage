"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Loader2, Save, Trash2 } from "lucide-react";

export type SubmissionFormKind = "equipment-offer" | "student-application";

const inputClassName =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20";
const textareaClassName =
  "mt-2 min-h-32 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm leading-7 text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20";

/**
 * Status options per form, matching the two zod enums in
 * lib/utils/validators.ts. Keep the two in step — the schema is the gate, this
 * is only the picker.
 */
const STATUS_OPTIONS: Record<SubmissionFormKind, { value: string; label: string }[]> = {
  "equipment-offer": [
    { value: "new", label: "New" },
    { value: "reviewing", label: "Reviewing" },
    { value: "accepted-in-full", label: "Accepted in full" },
    { value: "accepted-in-part", label: "Accepted in part" },
    { value: "declined", label: "Declined" },
    { value: "collected", label: "Collected" },
    { value: "archived", label: "Archived" },
  ],
  "student-application": [
    { value: "new", label: "New" },
    { value: "reviewed", label: "Reviewed" },
    { value: "shortlisted", label: "Shortlisted" },
    { value: "waiting-list", label: "On the waiting list" },
    { value: "offered", label: "Offered a laptop" },
    { value: "rejected", label: "Not selected" },
    { value: "enrolled", label: "Enrolled and handed over" },
  ],
};

const ENDPOINTS: Record<SubmissionFormKind, string> = {
  "equipment-offer": "/api/admin/laptop-bank/offers",
  "student-application": "/api/admin/laptop-bank/applications",
};

const LISTS: Record<SubmissionFormKind, string> = {
  "equipment-offer": "/admin/laptop-bank/offers",
  "student-application": "/admin/laptop-bank/applications",
};

/**
 * Records a reviewer's decision on one submission.
 *
 * Status and internal notes only. Everything the submitter wrote is displayed
 * on the page around this form but is not editable — the submission is the
 * record of what they said, and a reviewer amending an applicant's own words
 * or a donor's stated consent would destroy that.
 */
export function LaptopBankSubmissionForm({
  kind,
  reference,
  status,
  notes,
}: {
  kind: SubmissionFormKind;
  reference: string;
  status: string;
  notes?: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState({ status, notes: notes ?? "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notice, setNotice] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  });

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setNotice({ type: "idle", message: "" });
    try {
      const response = await fetch(`${ENDPOINTS[kind]}/${reference}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) throw new Error(payload?.message || "Update failed");
      setNotice({ type: "success", message: payload.message || "Submission updated." });
      router.refresh();
    } catch (error) {
      setNotice({
        type: "error",
        message: error instanceof Error ? error.message : "Update failed",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (
      !window.confirm(
        `Delete ${reference} permanently? This removes the submitter's record and cannot be undone.`,
      )
    ) {
      return;
    }
    setIsDeleting(true);
    setNotice({ type: "idle", message: "" });
    try {
      const response = await fetch(`${ENDPOINTS[kind]}/${reference}`, { method: "DELETE" });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) throw new Error(payload?.message || "Delete failed");
      router.push(LISTS[kind]);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="font-heading text-xl font-bold text-slate-950">Your review</h2>
        <p className="mt-1 text-sm text-slate-500">
          Status and internal notes. Nothing the submitter wrote can be edited here.
        </p>
      </div>

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

      <div>
        <label htmlFor={`${reference}-status`} className="text-sm font-bold text-brand-ink">
          Status
        </label>
        <select
          id={`${reference}-status`}
          value={values.status}
          onChange={(event) => setValues((current) => ({ ...current, status: event.target.value }))}
          className={inputClassName}
        >
          {STATUS_OPTIONS[kind].map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${reference}-notes`} className="text-sm font-bold text-brand-ink">
          Internal notes
        </label>
        <textarea
          id={`${reference}-notes`}
          value={values.notes}
          onChange={(event) => setValues((current) => ({ ...current, notes: event.target.value }))}
          className={textareaClassName}
          placeholder="Visible to staff only. Not shared with the submitter."
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-control border border-brand-navy bg-brand-navy px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white hover:text-brand-navy disabled:pointer-events-none disabled:opacity-60"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save review
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="inline-flex items-center gap-2 rounded-control border border-rose-300 bg-white px-5 py-2.5 text-sm font-bold text-rose-700 transition hover:bg-rose-50 disabled:pointer-events-none disabled:opacity-60"
        >
          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          Delete
        </button>
      </div>
    </form>
  );
}
