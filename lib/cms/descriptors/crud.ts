import { getDescriptor } from "@/lib/cms/descriptors/registry";
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
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const field of descriptor.fields) {
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
): string[] {
  return descriptor.fields
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
): string[] {
  return descriptor.fields
    .filter((field) => {
      if (!field.required) return false;
      const value = record[field.key];
      if (field.kind === "number") return value === null || value === undefined;
      if (field.kind === "boolean") return false; // false is a valid answer
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
): Promise<WriteResult> {
  const descriptor = getDescriptor(key);
  if (!descriptor) return { configured: false, written: false };

  const db = await getAdminFirestore();
  if (!db) return { configured: false, written: false };

  const record = projectRecord(descriptor, data);
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
