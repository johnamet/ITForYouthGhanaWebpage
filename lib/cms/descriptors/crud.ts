import { PATH_SEPARATOR } from "@/lib/cms/descriptors/page-overrides";
import { getDescriptor } from "@/lib/cms/descriptors/registry";
import {
  BASE_ID_KEY,
  findSeedRecord,
  isSeedCollection,
  resolveFields,
  templateRecord,
} from "@/lib/cms/descriptors/seed-collections";
import type {
  ContentTypeDescriptor,
  FieldDescriptor,
} from "@/lib/cms/descriptors/types";
import { getAdminFirestore } from "@/lib/firebase/admin";

/**
 * Generic create/read/update/delete over any registered content collection,
 * driven by the descriptors in lib/cms/descriptors/registry.ts.
 *
 * IMPORTANT — these reads are ADMIN-ONLY and deliberately UNFILTERED.
 * lib/cms/laptop-bank.ts is the public read path and enforces consent in the
 * query (spec §4 DATA): it excludes anonymous donors and unconsented stories.
 * An editor must be able to see and correct exactly those records, so the
 * functions here return everything. Never call them from a public page — doing
 * so would publish a record whose owner did not consent.
 */

export type AdminRecord = Record<string, unknown> & { id: string };

export type WriteResult = {
  configured: boolean;
  written: boolean;
  id?: string;
};

/**
 * Coerces one submitted value to the shape the field declares.
 *
 * The number case is the one that matters. A form control always produces a
 * string, and storing "12" where a number belongs breaks
 * `MetricCardGrid`'s `toLocaleString`. Worse, an EMPTY number field must store
 * `null`, never `0` — `DashboardMetrics` fields are nullable precisely so that
 * "not counted yet" and "counted, and it is zero" are different claims, and
 * spec §10 forbids publishing a placeholder zero. Coercing "" to 0 here would
 * silently turn every uncounted metric into a published figure of nought.
 */
function coerceValue(field: FieldDescriptor, raw: unknown): unknown {
  switch (field.kind) {
    /**
     * A `string[]`, submitted as one line per item.
     *
     * Blank lines are dropped rather than stored, because a stray newline in a
     * textarea would otherwise publish an empty bullet.
     */
    case "stringList": {
      const lines = Array.isArray(raw)
        ? raw.map((item) => String(item))
        : typeof raw === "string"
          ? raw.split("\n")
          : [];
      return lines.map((line) => line.trim()).filter(Boolean);
    }

    /**
     * A repeatable group, stored whole.
     *
     * Two rules carry the weight here. Unknown keys on a row are PRESERVED —
     * a section's `href` and `anchor` are deliberately not editable, and a save
     * that rebuilt each row from the declared fields alone would strip every
     * link destination on the page. And a row whose editable fields are all
     * blank is DROPPED, so pressing "add" and then changing your mind does not
     * publish an empty card.
     */
    case "list": {
      if (!Array.isArray(raw)) return [];
      const itemFields = field.itemFields ?? [];
      const rows: Record<string, unknown>[] = [];

      for (const entry of raw) {
        if (!entry || typeof entry !== "object" || Array.isArray(entry)) continue;
        const source = entry as Record<string, unknown>;
        const row: Record<string, unknown> = { ...source };
        let filled = false;

        for (const itemField of itemFields) {
          const value = coerceValue(itemField, source[itemField.key]);
          if (value === null || value === undefined) {
            delete row[itemField.key];
            continue;
          }

          /**
           * A key the row never had, still empty, is not added.
           *
           * Item controls are generated from the shape MERGED across every row,
           * so a card that carries bullets gives every card a bullets control.
           * Writing the empty ones back would add `bullets: []` to rows that
           * had no bullets at all — which verify:cms caught as "opening the
           * editor and saving would change sections" on all eight initiatives.
           */
          const isEmpty =
            value === "" || (Array.isArray(value) && value.length === 0);
          if (isEmpty && !(itemField.key in source)) continue;

          row[itemField.key] = value;
          if (typeof value === "string" ? value !== "" : Array.isArray(value) ? value.length > 0 : true) {
            filled = true;
          }
        }

        if (filled) rows.push(row);
      }

      return rows;
    }

    case "boolean":
      return raw === true || raw === "true" || raw === "on";

    case "number": {
      if (raw === "" || raw === null || raw === undefined) return null;
      const parsed = typeof raw === "number" ? raw : Number(raw);
      return Number.isFinite(parsed) ? parsed : null;
    }

    case "text":
    case "textarea":
    case "url":
    case "select":
    default: {
      if (typeof raw !== "string") return raw === null || raw === undefined ? "" : String(raw);
      return raw.trim();
    }
  }
}

/**
 * Projects a submitted payload onto exactly the fields the descriptor
 * declares.
 *
 * Unknown keys are dropped rather than stored, so a tampered form body cannot
 * write a field the content type does not have — including a field a public
 * reader might later trust.
 */
export function projectRecord(
  descriptor: ContentTypeDescriptor,
  payload: Record<string, unknown>,
  fields: FieldDescriptor[] = descriptor.fields,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const field of fields) {
    out[field.key] = coerceValue(field, payload[field.key]);
  }
  return out;
}

/**
 * Values that are out of the range their field declares, by label.
 *
 * Separate from `missingRequiredFields` because the two produce different
 * messages: one asks for something, the other says a figure cannot be what was
 * entered. A count of units offered cannot be negative, and a retention
 * percentage cannot exceed 100 — a real record reached Firestore with
 * units_offered = -70 before this existed.
 */
export function outOfRangeFields(
  descriptor: ContentTypeDescriptor,
  record: Record<string, unknown>,
  fields: FieldDescriptor[] = descriptor.fields,
): string[] {
  return fields
    .filter((field) => {
      if (field.kind !== "number") return false;
      const value = record[field.key];
      if (typeof value !== "number") return false;
      if (field.min !== undefined && value < field.min) return true;
      if (field.max !== undefined && value > field.max) return true;
      return false;
    })
    .map((field) => {
      if (field.min !== undefined && field.max !== undefined) {
        return `${field.label} (must be between ${field.min} and ${field.max})`;
      }
      if (field.min !== undefined) return `${field.label} (cannot be below ${field.min})`;
      return `${field.label} (cannot be above ${field.max})`;
    });
}

/** Missing required fields, by label, for a submitted payload. */
export function missingRequiredFields(
  descriptor: ContentTypeDescriptor,
  record: Record<string, unknown>,
  fields: FieldDescriptor[] = descriptor.fields,
): string[] {
  return fields
    .filter((field) => {
      if (!field.required) return false;
      const value = record[field.key];
      if (field.kind === "number") return value === null || value === undefined;
      if (field.kind === "boolean") return false; // false is a valid answer
      if (field.kind === "list" || field.kind === "stringList") {
        return !Array.isArray(value) || value.length === 0;
      }
      return typeof value !== "string" || value.trim() === "";
    })
    .map((field) => field.label);
}

function sortRecords(descriptor: ContentTypeDescriptor, rows: AdminRecord[]): AdminRecord[] {
  const key = descriptor.sortField;
  if (!key) return rows;
  return [...rows].sort((left, right) => {
    const a = left[key];
    const b = right[key];
    if (typeof a === "number" && typeof b === "number") return a - b;
    return String(a ?? "").localeCompare(String(b ?? ""));
  });
}

// ─── Reads ────────────────────────────────────────────────────────────────────

export async function listRecords(key: string): Promise<AdminRecord[]> {
  const descriptor = getDescriptor(key);
  if (!descriptor) return [];

  const db = await getAdminFirestore();
  if (!db) return [];

  try {
    const snapshot = await db.collection(descriptor.collection).get();
    const rows = snapshot.docs.map((doc) => ({ ...(doc.data() ?? {}), id: doc.id }) as AdminRecord);
    return sortRecords(descriptor, rows);
  } catch (error) {
    console.error(`Laptop Bank ${key} list failed`, error);
    return [];
  }
}

export async function getRecord(
  key: string,
  id: string,
): Promise<AdminRecord | undefined> {
  const descriptor = getDescriptor(key);
  if (!descriptor) return undefined;

  const db = await getAdminFirestore();
  if (!db) return undefined;

  try {
    const doc = await db.collection(descriptor.collection).doc(id).get();
    if (!doc.exists) return undefined;
    return { ...(doc.data() ?? {}), id: doc.id } as AdminRecord;
  } catch (error) {
    console.error(`Laptop Bank ${key} read failed`, error);
    return undefined;
  }
}

/** The singleton's record, or undefined when it has never been written. */
export async function getSingletonRecord(
  key: string,
): Promise<AdminRecord | undefined> {
  const descriptor = getDescriptor(key);
  if (!descriptor?.singletonId) return undefined;
  return getRecord(key, descriptor.singletonId);
}

/**
 * The fields a write should be validated and projected against.
 *
 * Only a seed-backed collection needs the extra read: its copy fields come
 * from the record's own seed, and for a record added through the admin the
 * seed is named by the stored document rather than by the id. One read on an
 * admin write path is a fair price for not having to smuggle the base through
 * the form body, where a tampered value would decide which fields are
 * accepted.
 */
export async function resolveFieldsForWrite(
  descriptor: ContentTypeDescriptor,
  id: string | undefined,
): Promise<FieldDescriptor[]> {
  if (!isSeedCollection(descriptor)) return descriptor.fields;
  if (!id) return resolveFields(descriptor, { isCreate: true });
  if (findSeedRecord(descriptor, id)) return resolveFields(descriptor, { id });

  const stored = await getRecord(descriptor.key, id);
  return resolveFields(descriptor, { id, stored });
}

export async function countRecords(key: string): Promise<number> {
  return (await listRecords(key)).length;
}

// ─── Writes ───────────────────────────────────────────────────────────────────

/**
 * Creates or replaces one record.
 *
 * `id` undefined means create. For a type with an `idField` the id is taken
 * from that field's value, so a process stage lives at a stable, meaningful
 * document id rather than a random one — that keeps the nine stages
 * addressable and stops a duplicate stage 5 being created by accident, because
 * a second write to the same number replaces the first.
 */
export async function saveRecord(
  key: string,
  id: string | undefined,
  data: Record<string, unknown>,
  fields?: FieldDescriptor[],
): Promise<WriteResult> {
  const descriptor = getDescriptor(key);
  if (!descriptor) return { configured: false, written: false };

  const db = await getAdminFirestore();
  if (!db) return { configured: false, written: false };

  const resolved = fields ?? (await resolveFieldsForWrite(descriptor, id));
  const record = projectRecord(descriptor, data, resolved);
  const { FieldValue } = await import("firebase-admin/firestore");

  let documentId = id;
  if (!documentId) {
    if (descriptor.shape === "singleton") {
      documentId = descriptor.singletonId;
    } else if (descriptor.idField) {
      const raw = record[descriptor.idField];
      documentId = raw === null || raw === undefined ? undefined : String(raw);
    }
  }

  const collection = db.collection(descriptor.collection);
  const reference = documentId ? collection.doc(documentId) : collection.doc();

  /**
   * A record added to a seed-backed collection records the seed record it
   * inherited its structure from, so its editor can be generated later and its
   * unedited fields fall back to that base rather than rendering blank.
   */
  if (isSeedCollection(descriptor) && !findSeedRecord(descriptor, reference.id)) {
    const template = templateRecord(descriptor);
    if (template && record[BASE_ID_KEY] === undefined) record[BASE_ID_KEY] = template.id;
  }

  /**
   * Clears stale flat-path keys under a list field.
   *
   * An array used to be walked into `sections__0__title` … and is now stored
   * whole under `sections`. A document holding both shapes would have the
   * flat paths applied on top of the array the editor just saved — the editor
   * would remove a section, save, and watch it come back. Removing the old
   * keys is what makes the two shapes one value.
   */
  const listKeys = resolved
    .filter((field) => field.kind === "list" || field.kind === "stringList")
    .map((field) => `${field.key}${PATH_SEPARATOR}`);

  if (listKeys.length) {
    const existing = await reference.get();
    for (const storedKey of Object.keys(existing.data() ?? {})) {
      if (listKeys.some((prefix) => storedKey.startsWith(prefix))) {
        record[storedKey] = FieldValue.delete();
      }
    }
  }

  await reference.set(
    { ...record, updatedAt: FieldValue.serverTimestamp() },
    // merge so a partially-filled edit does not blank fields the form did not
    // send — and so `updatedAt` accumulates rather than replacing the doc.
    { merge: true },
  );

  return { configured: true, written: true, id: reference.id };
}

export async function deleteRecord(
  key: string,
  id: string,
): Promise<WriteResult> {
  const descriptor = getDescriptor(key);
  if (!descriptor) return { configured: false, written: false };

  const db = await getAdminFirestore();
  if (!db) return { configured: false, written: false };

  await db.collection(descriptor.collection).doc(id).delete();
  return { configured: true, written: true, id };
}
