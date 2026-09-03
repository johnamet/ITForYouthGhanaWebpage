import type { FieldDescriptor } from "@/lib/cms/descriptors/types";

/**
 * The values an editor screen starts with, as plain data.
 *
 * Pure and outside the React component on purpose: `scripts/verify-cms.ts`
 * asserts that opening an editor and pressing save changes nothing, and that
 * assertion is only worth anything if it exercises the SAME function the form
 * uses. A copy of this logic in the script would verify the copy.
 */

export type ListRow = Record<string, unknown>;
export type FieldValue = string | boolean | ListRow[];
export type FormValues = Record<string, FieldValue>;

/** One row of a `list` field, blank, with every declared field present. */
export function emptyRow(itemFields: FieldDescriptor[]): ListRow {
  const row: ListRow = {};
  for (const field of itemFields) {
    row[field.key] =
      field.kind === "boolean"
        ? false
        : field.kind === "stringList" || field.kind === "list"
          ? []
          : "";
  }
  return row;
}

export function asRows(value: unknown): ListRow[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is ListRow => Boolean(item) && typeof item === "object" && !Array.isArray(item),
  );
}

/** A row's value, read back into the control that edits it. */
export function rowValue(field: FieldDescriptor, row: ListRow): FieldValue {
  const value = row[field.key];
  if (field.kind === "list") return asRows(value);
  if (field.kind === "stringList") {
    // While a row is being edited its string list is held as raw text; the
    // server splits it on save. Both shapes have to read back cleanly.
    if (typeof value === "string") return value;
    return Array.isArray(value) ? value.map((item) => String(item)).join("\n") : "";
  }
  if (field.kind === "boolean") return value === true;
  if (value === null || value === undefined) return "";
  return typeof value === "boolean" ? value : String(value);
}

/**
 * The form's starting values.
 *
 * Two sources, on purpose. A text field shows exactly what is STORED, because
 * empty means "not overridden" and its current wording is already in the help
 * text. A repeatable list shows the MERGED content — `fallback` — because an
 * editor asked to reword the third of five sections has to see all five, and a
 * list that opened empty would mean retyping the page to change a comma.
 */
export function initialValues(
  fields: FieldDescriptor[],
  record?: Record<string, unknown>,
  fallback?: Record<string, unknown>,
): FormValues {
  const values: FormValues = {};

  for (const field of fields) {
    const stored = record?.[field.key];

    if (field.kind === "list") {
      const rows = asRows(stored).length ? asRows(stored) : asRows(fallback?.[field.key]);
      values[field.key] = rows.map((row) => ({ ...row }));
      continue;
    }

    if (field.kind === "stringList") {
      const lines =
        Array.isArray(stored) && stored.length
          ? stored
          : Array.isArray(fallback?.[field.key])
            ? (fallback?.[field.key] as unknown[])
            : [];
      values[field.key] = lines.map((line) => String(line)).join("\n");
      continue;
    }

    /**
     * A checkbox, a select and a number cannot express "not overridden".
     *
     * An empty text field falls back to the shipped wording, which is what
     * makes a copy override safe. There is no equivalent for a checkbox —
     * false IS an answer — so for content with shipped values behind it these
     * three kinds show the CURRENT effective value instead. Without this,
     * opening a shipped department and saving would have set its status to
     * blank and quietly unfeatured it: verify:cms caught exactly that on
     * eleven records.
     *
     * A NEW record still honours the descriptor's default, so a department
     * added here starts as a draft rather than inheriting the template's
     * published status.
     */
    const merged = fallback?.[field.key];
    const inheritable = record !== undefined && stored === undefined && merged !== undefined;

    if (field.kind === "boolean") {
      values[field.key] =
        stored !== undefined
          ? stored === true
          : inheritable
            ? merged === true
            : record === undefined
              ? field.defaultValue === true
              : false;
      continue;
    }

    if (field.kind === "number") {
      // null and undefined both render as an empty control, which is what
      // keeps "not counted yet" distinct from a real zero.
      const value = stored === null || stored === undefined ? (inheritable ? merged : null) : stored;
      values[field.key] = value === null || value === undefined ? "" : String(value);
      continue;
    }

    const defaulted = typeof field.defaultValue === "string" ? field.defaultValue : "";

    if (field.kind === "select") {
      values[field.key] =
        typeof stored === "string" && stored
          ? stored
          : inheritable && typeof merged === "string"
            ? merged
            : record === undefined
              ? defaulted
              : "";
      continue;
    }

    values[field.key] =
      typeof stored === "string" ? stored : record === undefined ? defaulted : "";
  }

  return values;
}
