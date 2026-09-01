"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export type FormValue = string | boolean | string[];
export type FormValues = Record<string, FormValue>;
export type FileValues = Record<string, File | undefined>;

export type StepContext = {
  values: FormValues;
  files: FileValues;
  setValue: (field: string, value: FormValue) => void;
  setFile: (field: string, file: File | undefined) => void;
  toggleInSet: (field: string, member: string, checked: boolean) => void;
  error: (field: string) => string | undefined;
  fieldId: (field: string) => string;
};

export type FormStep = {
  title: string;
  render: (context: StepContext) => ReactNode;
  /**
   * Field names this step owns. Used only to decide which step to reopen when
   * the server returns field errors, so a submitter is taken back to the step
   * carrying the problem rather than left staring at the last one.
   */
  fields: string[];
};

export type SubmitOutcome = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
  /** Rendered instead of the form when the submission succeeded. */
  confirmation?: ReactNode;
};

export type MultiStepFormProps = {
  id: string;
  steps: FormStep[];
  initialValues: FormValues;
  /**
   * localStorage key for save-and-resume. Pass undefined to disable
   * persistence entirely.
   */
  storageKey?: string;
  submitLabel: string;
  onSubmit: (values: FormValues, files: FileValues) => Promise<SubmitOutcome>;
  /** Rendered above step 1 — the eligibility summary on page 5.8, for instance. */
  intro?: ReactNode;
  className?: string;
};

/** Spec §6.1: the honeypot. Named to match the existing organisation form. */
const HONEYPOT_FIELD = "companyFax";

/**
 * C8 — multi-step form shell.
 *
 * Spec §3: "Step progress indicator, save and resume, conditional panels, file
 * upload with client-side compression, honeypot field, server-side rate limit.
 * No image captcha."
 *
 * Division of labour: the honeypot, the progress indicator, step navigation and
 * save-and-resume live here; conditional panels and the fields themselves are
 * the caller's, supplied through `FormStep.render`, because only the caller
 * knows that "Released from device management = No" opens an info panel. Rate
 * limiting is server-side by definition and lives in the route handler.
 *
 * SAVE AND RESUME (spec 5.5: "against a browser token. No account required";
 * spec 5.8: "keyed on phone number or email. No account.")
 *
 * Values persist to localStorage on every change and restore on mount. FILES
 * ARE DELIBERATELY NOT PERSISTED: a File cannot be serialised, and storing a
 * filename would show a returning applicant an attachment that looks present
 * but would submit nothing. Better to show the file field empty — that is
 * honest about what has to be re-selected. The file section makes this
 * explicit to a resuming applicant rather than leaving them to discover it.
 */
export function MultiStepForm({
  id,
  steps,
  initialValues,
  storageKey,
  submitLabel,
  onSubmit,
  intro,
  className,
}: MultiStepFormProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [files, setFiles] = useState<FileValues>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ tone: "error" | "none"; message: string }>({
    tone: "none",
    message: "",
  });
  const [confirmation, setConfirmation] = useState<ReactNode>(null);
  const [restored, setRestored] = useState(false);

  // ─── Save and resume ───────────────────────────────────────────────────────

  useEffect(() => {
    if (!storageKey) return;
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (!saved) return;
      const parsed = JSON.parse(saved) as { values?: FormValues; stepIndex?: number };
      if (parsed.values) {
        setValues((current) => ({ ...current, ...parsed.values }));
        setRestored(true);
      }
      if (typeof parsed.stepIndex === "number") {
        setStepIndex(Math.min(Math.max(parsed.stepIndex, 0), steps.length - 1));
      }
    } catch {
      // A corrupt or unreadable entry (private browsing, quota, a hand-edited
      // value) must never block the form. Start fresh instead.
    }
    // Restore once, on mount. Re-running on `steps` identity would clobber
    // whatever the submitter has typed since.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ values, stepIndex }));
    } catch {
      // Storage full or blocked. The form still works in-session; only resume
      // is lost, which is not worth interrupting anyone over.
    }
  }, [storageKey, values, stepIndex]);

  const clearSaved = () => {
    if (!storageKey) return;
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      /* nothing useful to do */
    }
  };

  // ─── Step context ──────────────────────────────────────────────────────────

  const context = useMemo<StepContext>(
    () => ({
      values,
      files,
      setValue: (field, value) => {
        setValues((current) => ({ ...current, [field]: value }));
        setFieldErrors((current) => {
          if (!current[field]) return current;
          const next = { ...current };
          delete next[field];
          return next;
        });
      },
      setFile: (field, file) => setFiles((current) => ({ ...current, [field]: file })),
      toggleInSet: (field, member, checked) => {
        setValues((current) => {
          const existing = Array.isArray(current[field]) ? (current[field] as string[]) : [];
          const next = checked
            ? Array.from(new Set([...existing, member]))
            : existing.filter((item) => item !== member);
          return { ...current, [field]: next };
        });
      },
      error: (field) => fieldErrors[field]?.[0],
      fieldId: (field) => `${id}-${field}`,
    }),
    [values, files, fieldErrors, id],
  );

  // ─── Submit ────────────────────────────────────────────────────────────────

  const isLastStep = stepIndex === steps.length - 1;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // On any step but the last, the submit button advances instead. Using the
    // form's own submit event for this means the browser's native required-field
    // validation gates each step, rather than letting someone skip forward past
    // empty required inputs.
    if (!isLastStep) {
      setStepIndex((current) => Math.min(current + 1, steps.length - 1));
      return;
    }

    setIsSubmitting(true);
    setStatus({ tone: "none", message: "" });
    setFieldErrors({});

    try {
      const outcome = await onSubmit(values, files);

      if (!outcome.ok) {
        setFieldErrors(outcome.fieldErrors ?? {});
        // Reopen the step that owns the first field the server rejected.
        const firstBadField = Object.keys(outcome.fieldErrors ?? {})[0];
        if (firstBadField) {
          const owning = steps.findIndex((step) => step.fields.includes(firstBadField));
          if (owning >= 0) setStepIndex(owning);
        }
        setStatus({ tone: "error", message: outcome.message });
        return;
      }

      clearSaved();
      setConfirmation(outcome.confirmation ?? <p>{outcome.message}</p>);
    } catch (error) {
      setStatus({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "We could not send your submission right now. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Confirmation state ────────────────────────────────────────────────────
  //
  // Spec 5.5 and 5.8 BEHAVIOUR: render the confirmation on the same URL. "Do
  // not redirect to a generic thank-you page."

  if (confirmation) {
    return (
      <div
        id={id}
        // Announced to a screen reader, because on a long form the submitter
        // may not have the top of the page in view when this replaces it.
        role="status"
        aria-live="polite"
        className={cn(
          "scroll-mt-36 rounded-[30px] border-l-4 border-brand-gold bg-brand-mist/50 p-6 sm:p-8",
          className,
        )}
      >
        <h2 className="font-heading text-2xl font-bold text-brand-ink sm:text-3xl">
          Submission received
        </h2>
        <div className="mt-4 text-base leading-8 text-slate-700">{confirmation}</div>
      </div>
    );
  }

  const step = steps[stepIndex];

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      className={cn(
        "scroll-mt-36 space-y-8 rounded-[30px] border border-brand-border bg-white p-6 shadow-sm sm:p-8",
        className,
      )}
    >
      {intro ? <div>{intro}</div> : null}

      {/* ── Step progress indicator ─────────────────────────────────────── */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
          Step {stepIndex + 1} of {steps.length}
        </p>
        <ol className="mt-3 grid gap-2" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
          {steps.map((entry, index) => (
            <li key={entry.title}>
              <span
                aria-hidden="true"
                className={cn(
                  "block h-1 rounded-full",
                  index <= stepIndex ? "bg-brand-gold" : "bg-brand-border",
                )}
              />
              <span
                className={cn(
                  "mt-2 block text-[0.7rem] leading-4",
                  index === stepIndex ? "font-bold text-brand-ink" : "text-slate-500",
                )}
              >
                {entry.title}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {restored ? (
        <p className="rounded-[20px] border border-brand-border bg-brand-mist/50 px-5 py-4 text-sm leading-7 text-slate-700">
          We restored what you had already filled in on this device. Any file you attached before
          needs to be selected again — your browser does not let us keep it.
        </p>
      ) : null}

      <h2 className="font-heading text-2xl font-bold text-brand-ink">{step.title}</h2>

      <p className="text-sm text-slate-500">
        Fields marked <span className="font-bold text-brand-gold">*</span> are required.
      </p>

      <div className="space-y-6">{step.render(context)}</div>

      {/* ── Honeypot ────────────────────────────────────────────────────── */}
      {/*
        Off-screen rather than display:none — some bots skip hidden inputs, and
        a positioned-away field is still filled by anything walking the DOM.
        aria-hidden and tabIndex keep it out of a real submitter's path, and
        autoComplete="off" stops a password manager filling it for them.
      */}
      <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={`${id}-${HONEYPOT_FIELD}`}>Company fax</label>
        <input
          id={`${id}-${HONEYPOT_FIELD}`}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={String(values[HONEYPOT_FIELD] ?? "")}
          onChange={(event) => context.setValue(HONEYPOT_FIELD, event.target.value)}
        />
      </div>

      {status.tone === "error" ? (
        <p
          role="alert"
          className="rounded-[20px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium leading-7 text-rose-900"
        >
          {status.message}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 border-t border-brand-border pt-6">
        {stepIndex > 0 ? (
          <Button
            type="button"
            variant="blue-outline"
            size="lg"
            onClick={() => setStepIndex((current) => Math.max(current - 1, 0))}
          >
            Back
          </Button>
        ) : null}
        <Button type="submit" variant="solid-pink" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : isLastStep ? submitLabel : "Continue"}
        </Button>
        {storageKey ? (
          <p className="text-sm text-slate-500">
            Your answers are saved on this device as you go.
          </p>
        ) : null}
      </div>
    </form>
  );
}

export { HONEYPOT_FIELD };
