import { applyOverrides, buildSeedFields } from "@/lib/cms/descriptors/page-overrides";
import type {
  ContentTypeDescriptor,
  FieldDescriptor,
  SeedCollectionRecord,
} from "@/lib/cms/descriptors/types";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { toPlainData } from "@/lib/utils/plain";

/**
 * Seed-backed collections: content whose records live in code and whose EDITS
 * live in Firestore.
 *
 * WHY THIS SHAPE EXISTS
 * Departments, initiatives and partnership tracks are not CMS-owned lists —
 * they are the organisation's structure, shipped in lib/content/site-config.ts
 * and rendered whether or not anyone has ever opened the admin. Firestore held
 * literally nothing for departments and initiatives when this was written. A
 * plain collection editor pointed at them would have listed eight departments
 * as none, which is worse than having no editor at all: it reads as data loss,
 * and the obvious next move — pressing "add" — would have created a duplicate
 * alongside the seeded record it appeared to be missing.
 *
 * So the list comes from the seed and the stored document holds only what was
 * changed. Three consequences are worth stating, because each is a decision
 * rather than a detail:
 *
 *   - DELETE MEANS REVERT. Removing the stored document restores the shipped
 *     content; it does not remove the department. The renderer says so in
 *     those words, since "delete permanently" would be a lie.
 *   - AN EDIT IS ALWAYS AGAINST A BASE. A record added through the admin
 *     records the seed record it inherited its structure from, so its editor
 *     has the same controls as the record it was based on — and its unedited
 *     fields fall back to that base rather than rendering blank.
 *   - THE SEED STAYS THE SOURCE OF WHICH RECORDS EXIST. Adding a department to
 *     the seed makes it editable with no migration; removing one from the seed
 *     removes it from the site even if a stored document survives.
 */

/**
 * Field on a stored document naming the seed record it was based on.
 *
 * Only written for a record created through the admin: a record that matches a
 * seed id needs no pointer, its id IS the pointer.
 */
export const BASE_ID_KEY = "baseId";

/** Keys a stored document holds as plumbing rather than content. */
const RESERVED_KEYS = new Set([BASE_ID_KEY, "updatedAt", "createdAt"]);

export function isSeedCollection(descriptor: ContentTypeDescriptor): boolean {
  return descriptor.shape === "seed-collection";
}

export function seedRecordsOf(descriptor: ContentTypeDescriptor): SeedCollectionRecord[] {
  return descriptor.seedRecords ?? [];
}

export function findSeedRecord(
  descriptor: ContentTypeDescriptor,
  id: string | undefined,
): SeedCollectionRecord | undefined {
  if (!id) return undefined;
  return seedRecordsOf(descriptor).find((record) => record.id === id);
}

/** The seed record a NEW record inherits its structure from. */
export function templateRecord(
  descriptor: ContentTypeDescriptor,
): SeedCollectionRecord | undefined {
  const records = seedRecordsOf(descriptor);
  if (!records.length) return undefined;
  return records.find((record) => record.id === descriptor.templateId) ?? records[0];
}

/**
 * The seed one record is edited against: its own, the one it declares as its
 * base, or the template.
 */
export function baseSeedFor(
  descriptor: ContentTypeDescriptor,
  id: string | undefined,
  stored?: Record<string, unknown>,
): Record<string, unknown> | undefined {
  const own = findSeedRecord(descriptor, id);
  if (own) return own.seed;

  const declared = stored?.[BASE_ID_KEY];
  const base = typeof declared === "string" ? findSeedRecord(descriptor, declared) : undefined;
  return (base ?? templateRecord(descriptor))?.seed;
}

/**
 * The fields one editor screen renders.
 *
 * For anything but a seed-backed collection this is just `descriptor.fields`.
 * For a seed-backed one it is the descriptor's structural fields — where
 * `status` gets a three-option select rather than the free-text box a walked
 * string would produce — followed by the copy fields generated from THAT
 * RECORD'S OWN seed. Per record rather than per type, because two initiatives
 * are not the same shape: each generates about 150 fields from its own
 * content, and a shared field list would show one record's sections under
 * another record's name.
 *
 * `createOnly` fields are dropped when editing. The slug is one: it becomes
 * the Firestore document id, and a document id cannot be changed afterwards,
 * so the control would promise something the save cannot deliver.
 */
export function resolveFields(
  descriptor: ContentTypeDescriptor,
  options: { id?: string; stored?: Record<string, unknown>; isCreate?: boolean } = {},
): FieldDescriptor[] {
  const declared = descriptor.fields.filter(
    (field) => options.isCreate || !field.createOnly,
  );
  if (!isSeedCollection(descriptor)) return declared;

  const seed = baseSeedFor(descriptor, options.id, options.stored);
  if (!seed) return declared;

  const skip = new Set(descriptor.fields.map((field) => field.key));
  return [...declared, ...buildSeedFields(seed, skip)];
}

/**
 * The seed record plus whatever has been stored against it.
 *
 * The document id is written back over the merged record's `id` when the seed
 * carries one, so a record's identity is where it lives rather than what a
 * stored field claims.
 */
function mergeOne(
  id: string,
  seed: Record<string, unknown>,
  stored: Record<string, unknown> | undefined,
): Record<string, unknown> {
  const merged = applyOverrides(seed, toPlainData(stored ?? {}));
  if ("id" in merged) merged.id = id;
  return merged;
}

/** Stored documents for a seed-backed collection, by document id. */
async function storedDocuments(
  descriptor: ContentTypeDescriptor,
): Promise<Map<string, Record<string, unknown>>> {
  const stored = new Map<string, Record<string, unknown>>();
  const db = await getAdminFirestore();
  if (!db) return stored;

  try {
    const snapshot = await db.collection(descriptor.collection).get();
    const excluded = new Set(descriptor.excludeDocIds ?? []);
    for (const doc of snapshot.docs) {
      if (excluded.has(doc.id)) continue;
      stored.set(doc.id, (doc.data() ?? {}) as Record<string, unknown>);
    }
  } catch (error) {
    console.error(`Seed collection read failed for ${descriptor.key}. Using seeds.`, error);
  }

  return stored;
}

/**
 * Every record of a seed-backed collection: the seeded ones with their edits
 * applied, in seed order, then any record added through the admin.
 *
 * The cast at each call site is sound because `applyOverrides` can only
 * replace a value the seed already has, with a value of the same shape — see
 * the shape guard in page-overrides.ts. That is the runtime type safety the
 * hand-written normalisers used to provide, kept rather than traded away for
 * editability.
 */
export async function readSeedCollection<T>(
  descriptor: ContentTypeDescriptor,
): Promise<T[]> {
  const stored = await storedDocuments(descriptor);
  const records: Record<string, unknown>[] = [];

  for (const record of seedRecordsOf(descriptor)) {
    records.push(mergeOne(record.id, record.seed, stored.get(record.id)));
  }

  const seededIds = new Set(seedRecordsOf(descriptor).map((record) => record.id));
  for (const [id, document] of stored) {
    if (seededIds.has(id)) continue;
    const seed = baseSeedFor(descriptor, id, document);
    if (!seed) continue;
    records.push(mergeOne(id, seed, document));
  }

  return records as T[];
}

/** One record of a seed-backed collection, by document id. */
export async function readSeedRecord<T>(
  descriptor: ContentTypeDescriptor,
  id: string,
): Promise<T | undefined> {
  const seedRecord = findSeedRecord(descriptor, id);
  const db = await getAdminFirestore();

  if (!db) return seedRecord ? (mergeOne(id, seedRecord.seed, undefined) as T) : undefined;

  try {
    const doc = await db.collection(descriptor.collection).doc(id).get();
    const stored = doc.exists ? ((doc.data() ?? {}) as Record<string, unknown>) : undefined;
    const seed = baseSeedFor(descriptor, id, stored);
    if (!seed) return undefined;
    // A record with neither a seed entry nor a stored document does not exist.
    if (!seedRecord && !stored) return undefined;
    return mergeOne(id, seed, stored) as T;
  } catch (error) {
    console.error(`Seed record read failed for ${descriptor.key}/${id}. Using seed.`, error);
    return seedRecord ? (mergeOne(id, seedRecord.seed, undefined) as T) : undefined;
  }
}

/**
 * The content an editor is looking at: the seed with stored overrides applied.
 *
 * Returned for a seed-backed record and for a page singleton that carries its
 * seed; undefined for a plain collection, where a record IS its stored
 * document and there is nothing to fall back to. The form uses it to fill its
 * repeatable lists — see the note on `ContentTypeDescriptor.seed`.
 */
export function mergedRecordFor(
  descriptor: ContentTypeDescriptor,
  id: string | undefined,
  stored: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
  if (isSeedCollection(descriptor)) {
    const seed = baseSeedFor(descriptor, id, stored);
    return seed ? mergeOne(id ?? "", seed, stored) : undefined;
  }
  if (descriptor.seed) return applyOverrides(descriptor.seed, toPlainData(stored ?? {}));
  return undefined;
}

export type SeedCollectionRow = {
  id: string;
  title: string;
  /** False for a record added through the admin rather than shipped in code. */
  seeded: boolean;
  /** Whether a stored document exists — i.e. whether anything was changed. */
  edited: boolean;
  /** How many fields have been overridden, for the list column. */
  overrides: number;
  /** The merged record, so the list can show its structural fields. */
  record: Record<string, unknown>;
};

/**
 * Rows for the admin list of a seed-backed collection.
 *
 * Built from the seed rather than from Firestore, which is the whole point:
 * eight departments with no stored documents must list as eight rows marked
 * "as shipped", not as an empty table.
 */
export async function seedCollectionRows(
  descriptor: ContentTypeDescriptor,
): Promise<SeedCollectionRow[]> {
  const stored = await storedDocuments(descriptor);
  const rows: SeedCollectionRow[] = [];

  const countOverrides = (document: Record<string, unknown> | undefined) =>
    document ? Object.keys(document).filter((key) => !RESERVED_KEYS.has(key)).length : 0;

  for (const record of seedRecordsOf(descriptor)) {
    const document = stored.get(record.id);
    rows.push({
      id: record.id,
      title: record.title,
      seeded: true,
      edited: document !== undefined,
      overrides: countOverrides(document),
      record: mergeOne(record.id, record.seed, document),
    });
  }

  const seededIds = new Set(seedRecordsOf(descriptor).map((record) => record.id));
  for (const [id, document] of stored) {
    if (seededIds.has(id)) continue;
    const seed = baseSeedFor(descriptor, id, document);
    if (!seed) continue;
    const merged = mergeOne(id, seed, document);
    rows.push({
      id,
      title: String(merged[descriptor.titleField] ?? id),
      seeded: false,
      edited: true,
      overrides: countOverrides(document),
      record: merged,
    });
  }

  return rows;
}
