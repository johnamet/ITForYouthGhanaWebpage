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
 * Walks a page's seed content and produces one editable field per leaf string.
 *
 * Generated rather than hand-listed because the ten pages hold roughly two
 * hundred strings between them: enumerating those by hand would be a second
 * copy to keep in step with the seed, and the first field anyone forgot would
 * be silently uneditable. Adding a string to a content object now makes it
 * appear in the editor automatically.
 *
 * Only strings become fields. Numbers and booleans do not appear in page copy,
 * and NON_EDITABLE_KEYS holds back the values that are structure rather than
 * content — link destinations (spec §2.2: the URL map is final and printed on
 * legal paperwork) and anchors (spec §10 checks they resolve, and a shared
 * anchor is a URL someone may have bookmarked).
 */
function walkSeed(
  value: unknown,
  trail: string[],
  fields: FieldDescriptor[],
  depth = 0,
): void {
  if (depth > 8) return;

  if (typeof value === "string") {
    const key = trail.join(PATH_SEPARATOR);
    const leaf = trail[trail.length - 1] ?? key;
    fields.push({
      key,
      label: trail.map(humaniseSegment).join(" › "),
      kind: looksLongform(leaf, value) ? "textarea" : "text",
      wide: looksLongform(leaf, value),
      help: `Currently: “${value.length > 120 ? `${value.slice(0, 120)}…` : value}”`,
    });
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => walkSeed(item, [...trail, String(index)], fields, depth + 1));
    return;
  }

  if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      if (NON_EDITABLE_KEYS.has(key)) continue;
      walkSeed(item, [...trail, key], fields, depth + 1);
    }
  }
}

export function buildSeedFields(seed: Record<string, unknown>): FieldDescriptor[] {
  const fields: FieldDescriptor[] = [];
  walkSeed(seed, [], fields);
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
 * Applies stored flat-path overrides onto a clone of a seed object.
 *
 * Stored documents hold flat path keys — `hero__heading`,
 * `handleForYou__cards__0__title` — which is exactly what the generated editor
 * produces, and a flat map is trivially mergeable with no nested-diff logic.
 */
export function applyOverrides<T extends Record<string, unknown>>(
  seed: T,
  stored: Record<string, unknown>,
): T {
  const result = clone(seed);
  for (const [storedKey, value] of Object.entries(stored)) {
    if (typeof value !== "string" || !value.trim()) continue;
    applyOverride(result as Record<string, unknown>, storedKey.split(PATH_SEPARATOR), value);
  }
  return result;
}
