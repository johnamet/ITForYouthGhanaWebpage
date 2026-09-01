"use client";

import type { ReactNode } from "react";

import { FormField } from "@/components/ui/form-field";
import { cn } from "@/lib/utils/cn";

/**
 * Select, radio and checkbox controls for the two Laptop Bank forms.
 *
 * components/ui/form-field.tsx supplies FormField, TextInput and TextArea but
 * no select, radio or checkbox. Rather than each form growing its own copies,
 * they live here once — both forms need all three, and spec §3 is explicit
 * that components are built once and reused with no page-specific duplicates.
 *
 * The class string below is copied from form-field.tsx's `controlClassName`
 * rather than imported, because that constant is not exported. If the shared
 * control styling ever changes there, change it here too.
 *
 * Accessibility, per Draft 1 §14.3: every field has a visible associated label
 * (placeholder text is not a label), and error messages name the field and sit
 * next to it — both of which FormField already handles.
 */
const controlClassName =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70";

export type Option = { value: string; label: string };

// ─── Select ───────────────────────────────────────────────────────────────────

export function SelectField({
  label,
  id,
  name,
  options,
  value,
  onChange,
  required,
  error,
  placeholder = "Please choose",
}: {
  label: string;
  id: string;
  name: string;
  options: readonly Option[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
}) {
  return (
    <FormField label={label} htmlFor={id} required={required} error={error}>
      <select
        id={id}
        name={name}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={controlClassName}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}

// ─── Radio group ──────────────────────────────────────────────────────────────

export function RadioGroup({
  label,
  name,
  idPrefix,
  options,
  value,
  onChange,
  required,
  error,
  /** Rendered below the options — the conditional info panels in spec §6.1. */
  panel,
  description,
}: {
  label: string;
  name: string;
  idPrefix: string;
  options: readonly Option[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  panel?: ReactNode;
  description?: string;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-bold text-brand-ink">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-brand-gold">
            *
          </span>
        ) : null}
      </legend>
      {description ? <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p> : null}
      <div className="mt-3 space-y-2">
        {options.map((option) => {
          const id = `${idPrefix}-${option.value}`;
          return (
            <label
              key={option.value}
              htmlFor={id}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 text-sm leading-6 transition",
                value === option.value
                  ? "border-brand-gold bg-brand-warm text-brand-ink"
                  : "border-brand-border bg-white text-slate-700 hover:border-brand-gold/60",
              )}
            >
              <input
                id={id}
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                required={required}
                onChange={() => onChange(option.value)}
                className="mt-1 h-4 w-4 shrink-0 accent-brand-gold"
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
      {panel ? <div className="mt-3">{panel}</div> : null}
      {error ? <p className="mt-2 text-sm font-medium text-rose-600">{error}</p> : null}
    </fieldset>
  );
}

// ─── Checkbox ─────────────────────────────────────────────────────────────────

/**
 * One checkbox, one boolean.
 *
 * Spec §7: "Consent checkboxes are never pre-ticked and never bundled." There
 * is deliberately no multi-consent variant of this component — bundling two
 * consents into one input would be a spec violation, and the shape of the
 * component is one place to make that impossible.
 */
export function CheckboxField({
  label,
  id,
  name,
  checked,
  onChange,
  required,
  error,
  hint,
}: {
  label: ReactNode;
  id: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
  error?: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-700">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          required={required}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-brand-gold"
        />
        <span>
          {label}
          {required ? (
            <span aria-hidden="true" className="ml-1 text-brand-gold">
              *
            </span>
          ) : null}
        </span>
      </label>
      {hint ? <p className="mt-1 pl-7 text-sm leading-6 text-slate-500">{hint}</p> : null}
      {error ? <p className="mt-2 pl-7 text-sm font-medium text-rose-600">{error}</p> : null}
    </div>
  );
}

// ─── Checkbox set (multiselect) ───────────────────────────────────────────────

/**
 * A multiselect rendered as checkboxes rather than a <select multiple>, which
 * is close to unusable on a phone. Spec §6.1's "Equipment types" is the only
 * multiselect in either form.
 *
 * This is NOT for consents — see CheckboxField's note. Each entry here is a
 * value in one field's array, not a separate permission.
 */
export function CheckboxSet({
  label,
  name,
  idPrefix,
  options,
  values,
  onToggle,
  required,
  error,
}: {
  label: string;
  name: string;
  idPrefix: string;
  options: readonly Option[];
  values: string[];
  onToggle: (value: string, checked: boolean) => void;
  required?: boolean;
  error?: string;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-bold text-brand-ink">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-brand-gold">
            *
          </span>
        ) : null}
      </legend>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const id = `${idPrefix}-${option.value}`;
          const checked = values.includes(option.value);
          return (
            <label
              key={option.value}
              htmlFor={id}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 text-sm leading-6 transition",
                checked
                  ? "border-brand-gold bg-brand-warm text-brand-ink"
                  : "border-brand-border bg-white text-slate-700 hover:border-brand-gold/60",
              )}
            >
              <input
                id={id}
                type="checkbox"
                name={name}
                value={option.value}
                checked={checked}
                onChange={(event) => onToggle(option.value, event.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 accent-brand-gold"
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
      {error ? <p className="mt-2 text-sm font-medium text-rose-600">{error}</p> : null}
    </fieldset>
  );
}

// ─── File field ───────────────────────────────────────────────────────────────

export function FileField({
  label,
  id,
  name,
  accept,
  file,
  onChange,
  required,
  error,
  hint,
}: {
  label: string;
  id: string;
  name: string;
  accept: string;
  file: File | undefined;
  onChange: (file: File | undefined) => void;
  required?: boolean;
  error?: string;
  hint?: string;
}) {
  return (
    <FormField label={label} htmlFor={id} required={required} error={error}>
      <input
        id={id}
        name={name}
        type="file"
        accept={accept}
        // Not `required` on the input itself even when the field is required:
        // save-and-resume cannot restore a File, so a resuming applicant would
        // be blocked by native validation on a field they had already answered
        // once. The server-side check is the one that counts.
        onChange={(event) => onChange(event.target.files?.[0])}
        className="mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink file:mr-4 file:rounded-control file:border-0 file:bg-brand-mist file:px-4 file:py-2 file:text-sm file:font-bold file:text-brand-navy"
      />
      {hint ? <p className="mt-2 text-sm leading-6 text-slate-500">{hint}</p> : null}
      {file ? (
        <p className="mt-2 text-sm font-semibold text-brand-primary">Selected: {file.name}</p>
      ) : null}
    </FormField>
  );
}
