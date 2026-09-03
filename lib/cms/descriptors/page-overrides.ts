import type { FieldDescriptor } from "@/lib/cms/descriptors/types";

/**
 * Page-copy overrides: generating an editor from seed content, and merging
 * stored overrides back onto it.
 *
 * WHY GENERATE RATHER THAN HAND-LIST
 * The Laptop Bank's ten pages hold roughly two hundred strings between them.
 * Enumerating those by hand would be a second copy to keep in step with the
 * seed, and the first field anyone forgot would be silently uneditable — which
 * is the state every hand-written page form in this repo is in. Generating
 * means a string added to a content object becomes editable with no second
 * edit.
 *
 * WHY EMPTY MEANS "NOT OVERRIDDEN"
 * A heading cleared by accident would otherwise leave a live page with no
 * title, and a reader cannot tell that from a deliberate deletion. Removing a
 * section is a structural change, not a copy edit, and stays a developer job.
 * This is the rule that makes a copy override safe to hand to a
 * non-developer.
 */

/**
 * The separator used in stored field keys for a nested path.
 *
 * `hero.heading` is stored as `hero__heading`. A dot is avoided on purpose:
 * Firestore treats a dot as a field-path separator in `update()` and in
 * queries, so a literal dotted key is a trap waiting for whoever writes the
 * next query against the collection.
 */
export const PATH_SEPARATOR = "__";

/**
 * Keys that must never become editable fields.
 *
 * Link destinations and anchors are structure, not copy. In the Laptop Bank's
 * case spec §2.2 says the URL map is final and gets printed on legal
 * paperwork, and spec §10 checks that anchors resolve — but the general point
 * holds everywhere: an anchor that has been shared is an address someone may
 * have bookmarked.
 */
export const NON_EDITABLE_KEYS = new Set([
  "href",
  "anchor",
  "id",
  "mediaKey",
  "variant",
  "slug",
]);

/** "handleForYou" -> "Handle for you"; "cards" -> "Cards"; "0" -> "1". */
function humaniseSegment(segment: string): string {
  if (/^\d+$/.test(segment)) return String(Number(segment) + 1);
  const spaced = segment.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
}

/** A long string, or one that reads like prose, gets a textarea. */
function looksLongform(key: string, value: string): boolean {
  return value.length > 90 || ["body", "answer", "description", "intro", "subheading", "summary"].some((hint) =>
    key.toLowerCase().includes(hint),
  );
}

/**
 * The shape one row of an array has, merged across every item.
 *
 * Merged rather than taken from the first item because an optional key — a
 * card that carries an icon where its neighbours do not — would otherwise be
 * uneditable on every row, purely because of which item happens to be first.
 */
function itemShape(items: unknown[]): Record<string, unknown> {
  const shape: Record<string, unknown> = {};
  for (const item of items) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    for (const [key, value] of Object.entries(item as Record<string, unknown>)) {
      if (shape[key] === undefined && value !== undefined) shape[key] = value;
    }
  }
  return shape;
}

/** The controls one row of a `list` field gets. */
function buildItemFields(shape: Record<string, unknown>): FieldDescriptor[] {
  const fields: FieldDescriptor[] = [];
  for (const [key, value] of Object.entries(shape)) {
    if (NON_EDITABLE_KEYS.has(key)) continue;
    const field = fieldForValue(key, humaniseSegment(key), value);
    if (field) fields.push(field);
  }
  return fields;
}

/**
 * A field for an array value: a line-per-item textarea for strings, a
 * repeatable group for objects.
 *
 * An EMPTY array becomes a string list. That is not a guess for its own sake:
 * the only empty array in any seed is a department's `teamMemberIds`, and an
 * id list can hold nothing but strings. The alternative — no field at all —
 * would leave the one editable thing about it invisible.
 */
function arrayField(key: string, label: string, items: unknown[]): FieldDescriptor | null {
  const first = items.find((item) => item !== undefined && item !== null);
  const count = `${items.length} at the moment.`;

  if (first === undefined || typeof first === "string") {
    return {
      key,
      label,
      kind: "stringList",
      wide: true,
      help: `One per line. ${count}`,
    };
  }

  if (typeof first === "object" && !Array.isArray(first)) {
    const itemFields = buildItemFields(itemShape(items));
    // Every key held back as structure rather than copy: there is nothing to
    // edit, so a repeatable group would be an empty box with an Add button.
    if (!itemFields.length) return null;
    return { key, label, kind: "list", wide: true, itemFields, help: count };
  }

  // An array of numbers, booleans or arrays. None occurs in any seed; if one
  // is added, it stays uneditable rather than being guessed at, and is carried
  // through a save untouched.
  return null;
}

/** One field for one seed value, or null when the value is not editable copy. */
function fieldForValue(key: string, label: string, value: unknown): FieldDescriptor | null {
  if (typeof value === "string") {
    const longform = looksLongform(key, value);
    return {
      key,
      label,
      kind: longform ? "textarea" : "text",
      wide: longform,
      help: `Currently: \u201c${value.length > 120 ? `${value.slice(0, 120)}\u2026` : value}\u201d`,
    };
  }

  if (Array.isArray(value)) return arrayField(key, label, value);

  // Numbers and booleans are editable INSIDE a list row, where the whole row
  // is stored and this file controls the coercion. They are not editable at
  // the top level of a page: a flat-path override can only replace a string
  // (see applyOverride), so a number field there would save and do nothing.
  if (typeof value === "number") return { key, label, kind: "number" };
  if (typeof value === "boolean") return { key, label, kind: "boolean" };

  return null;
}

/**
 * Walks a page's seed content and produces one editable field per leaf string,
 * plus one repeatable-list field per array.
 *
 * Generated rather than hand-listed because the ten Laptop Bank pages hold
 * roughly two hundred strings between them, and the twenty-nine seed-backed
 * records added later hold some two and a half thousand: enumerating those by
 * hand would be a second copy to keep in step with the seed, and the first
 * field anyone forgot would be silently uneditable. Adding a string to a
 * content object now makes it appear in the editor automatically.
 *
 * Arrays became `list` and `stringList` fields when this kit took over from
 * the four hand-written forms, which could ADD and REMOVE array items — a
 * stat, a section, a department service. Walking an array into
 * `sections__0__title` … `sections__4__body` can reword the items a seed has
 * but cannot add a sixth, so retiring those forms would have removed a real
 * capability. NON_EDITABLE_KEYS is applied inside a row as well as at the top
 * level, which is what keeps link destinations out of the editor.
 */
function walkSeed(
  value: unknown,
  trail: string[],
  fields: FieldDescriptor[],
  skip: Set<string>,
  depth = 0,
): void {
  if (depth > 8) return;

  if (value && typeof value === "object" && !Array.isArray(value)) {
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      if (NON_EDITABLE_KEYS.has(key) || skip.has(key)) continue;
      const trailed = [...trail, key];
      if (item && typeof item === "object" && !Array.isArray(item)) {
        walkSeed(item, trailed, fields, skip, depth + 1);
        continue;
      }
      const field = fieldForValue(
        trailed.join(PATH_SEPARATOR),
        trailed.map(humaniseSegment).join(" \u203a "),
        item,
      );
      // A top-level number or boolean is dropped: a flat-path override can
      // only replace a string, so the control would save and change nothing.
      if (field && field.kind !== "number" && field.kind !== "boolean") fields.push(field);
    }
    return;
  }

  // A seed that is itself a string or an array — only reached for a nested
  // value handed straight in, which no descriptor does today.
  const field = fieldForValue(
    trail.join(PATH_SEPARATOR),
    trail.map(humaniseSegment).join(" \u203a "),
    value,
  );
  if (field) fields.push(field);
}

/**
 * The generated fields for one seed object.
 *
 * `skipKeys` holds back keys a descriptor declares itself — a department's
 * `status` gets a three-option select from the descriptor rather than the
 * free-text box a walked string would produce.
 */
export function buildSeedFields(
  seed: Record<string, unknown>,
  skipKeys: Iterable<string> = [],
): FieldDescriptor[] {
  const fields: FieldDescriptor[] = [];
  walkSeed(seed, [], fields, new Set(skipKeys));
  return fields;
}

/** Deep clone that keeps arrays as arrays. Seeds are plain JSON-shaped data. */
function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/**
 * Writes one flat path into a cloned seed.
 *
 * Refuses to create structure the seed does not already have: if the path does
 * not resolve to an existing string, the override is ignored. That is what
 * stops a stale stored key — left behind after copy was restructured in code —
 * from growing a phantom field that no page renders but every editor sees.
 */
function applyOverride(target: Record<string, unknown>, path: string[], value: string): void {
  let cursor: unknown = target;

  for (const segment of path.slice(0, -1)) {
    if (cursor === null || typeof cursor !== "object") return;
    const next = (cursor as Record<string, unknown>)[segment];
    if (next === undefined) return;
    cursor = next;
  }

  if (cursor === null || typeof cursor !== "object") return;
  const leaf = path[path.length - 1];
  const container = cursor as Record<string, unknown>;
  if (typeof container[leaf] !== "string") return;

  container[leaf] = value;
}
/**
 * Whether a stored value may replace the seed value it is aimed at.
 *
 * This is the runtime type safety the hand-written normalisers used to provide.
 * `normalizeDepartment` rebuilt every field with an explicit type check, which
 * is why replacing it with a merge looked like a trade: editability for
 * safety. It is not a trade if the merge refuses a value of the wrong shape —
 * a string cannot land where the page renders an array and then crash a map()
 * at build time.
 */
function shapeMatches(seedValue: unknown, value: unknown): boolean {
  if (Array.isArray(seedValue)) return Array.isArray(value);
  if (Array.isArray(value)) return false;
  if (seedValue === null || seedValue === undefined) return true;
  if (typeof seedValue === "object") return typeof value === "object" && value !== null;
  return typeof seedValue === typeof value;
}

/**
 * Assigns a legacy whole-value override.
 *
 * Documents written before the flat-path editor existed store a whole value
 * under its top-level key — `siteContent/apply-for-training` holds 28 such
 * keys, `partnerships/educational` 32. Those are real edits somebody made, and
 * a migration that only understood flat paths would silently ignore every one
 * of them and revert the page to its seed. So both shapes are honoured.
 *
 * This is also the shape a `list` field writes, which is deliberate: an array
 * has to be stored whole for a row to be added or removed, and storing it
 * under its plain key means an array edited by the old form and then by the
 * generated editor stays one value rather than two competing ones.
 *
 * Three rules decide what is accepted:
 *
 *   - A key the seed has must be replaced by a value of the SAME SHAPE. See
 *     shapeMatches.
 *   - A key the seed does NOT have is dropped. That is what keeps `updatedAt`
 *     and `createdAt` out without a denylist to maintain. Accepting an absent
 *     key as a string was tried and immediately let `updatedAt` through, since
 *     `toPlainData` turns its Timestamp into an ISO string — so an optional
 *     field a page needs is declared in the seed object instead, where it is
 *     typed and visible.
 *   - An empty value means "not overridden", never "blank this out".
 */
function applyLegacyOverride(
  target: Record<string, unknown>,
  key: string,
  value: unknown,
): void {
  if (value === undefined || value === null) return;
  if (typeof value === "string" && !value.trim()) return;
  // An empty array is "no rows entered", which is the same statement as an
  // empty string: keep the shipped content rather than publishing a page with
  // a section list that renders nothing.
  if (Array.isArray(value) && value.length === 0) return;

  if (!(key in target)) return;

  if (!shapeMatches(target[key], value)) return;
  target[key] = value;
}

/**
 * Applies stored overrides onto a clone of a seed object.
 *
 * Two shapes are accepted, and both are load-bearing:
 *
 *   - `heroHeading` / `sections` — a whole value under its own key, written by
 *     the hand-built forms that came before and by the generated editor's
 *     `list` and `stringList` controls. See applyLegacyOverride.
 *   - `hero__heading` — a flat path, written by the generated editor's text
 *     controls. Applied only when it resolves to an existing string in the
 *     seed, so a stale key left behind after copy was restructured in code
 *     cannot grow a phantom field.
 *
 * WHOLE VALUES ARE APPLIED FIRST, FLAT PATHS SECOND. The order used to be
 * whatever `Object.entries` returned, which meant a page holding both shapes
 * for the same string merged differently depending on key insertion order.
 * Flat paths win because they are what the current editor writes: a document
 * carrying `sections` from the old form and `sections__0__title` from a later
 * copy edit should show the copy edit.
 *
 * In both cases an empty value means "not overridden", never "blank this out".
 * A heading cleared by accident would otherwise leave a live page with no
 * title, and a reader cannot tell that from a deliberate deletion.
 */
export function applyOverrides<T extends Record<string, unknown>>(
  seed: T,
  stored: Record<string, unknown>,
): T {
  const result = clone(seed);
  const entries = Object.entries(stored);

  for (const [storedKey, value] of entries) {
    if (storedKey.includes(PATH_SEPARATOR)) continue;
    applyLegacyOverride(result as Record<string, unknown>, storedKey, value);
  }

  for (const [storedKey, value] of entries) {
    if (!storedKey.includes(PATH_SEPARATOR)) continue;
    if (typeof value !== "string" || !value.trim()) continue;
    applyOverride(result as Record<string, unknown>, storedKey.split(PATH_SEPARATOR), value);
  }

  return result;
}
