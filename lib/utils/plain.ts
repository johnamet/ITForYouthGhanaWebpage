/**
 * Converts CMS data into values React can hand to a Client Component.
 *
 * WHY THIS EXISTS
 * A Firestore document can contain class instances — a `Timestamp` most
 * commonly, since every writer in this repo stamps `updatedAt` with
 * `FieldValue.serverTimestamp()`. Passing one from a Server Component into a
 * Client Component throws:
 *
 *   Error: Only plain objects, and a few built-ins, can be passed to Client
 *   Components from Server Components. Classes or null prototypes are not
 *   supported.
 *
 * Next logs that during prerender and still exits 0, so it is easy to ship and
 * easy to miss — it went unnoticed on /partner-with-us until a deliberate scan
 * of every CMS reader found it.
 *
 * A `Timestamp` becomes an ISO string (readable, sortable, serialisable). Any
 * other non-plain object is DROPPED rather than coerced: something like a
 * `DocumentReference` has no meaningful string form, and silently stringifying
 * it would put "[object Object]" into page content. Dropping it makes the
 * field absent, which every consumer in this repo already handles.
 */

type FirestoreTimestampLike = { toDate: () => Date };

function isTimestampLike(value: object): value is FirestoreTimestampLike {
  return "toDate" in value && typeof (value as FirestoreTimestampLike).toDate === "function";
}

/**
 * Deep-converts a value read from Firestore into plain JSON-safe data.
 *
 * Apply it at the READER boundary, in `lib/cms/*`, not at the component — a
 * component receiving a Timestamp means a reader already leaked one, and every
 * page rendering that reader's data is affected, not just the one that noticed.
 */
export function toPlainData<T>(value: T): T {
  return convert(value) as T;
}

function convert(value: unknown, depth = 0): unknown {
  // Firestore documents are shallow in practice; the cap only stops a
  // pathological self-referencing structure from recursing forever.
  if (depth > 32) return undefined;

  if (value === null || typeof value !== "object") return value;

  if (Array.isArray(value)) {
    return value.map((item) => convert(item, depth + 1));
  }

  if (value instanceof Date) return value.toISOString();

  const proto = Object.getPrototypeOf(value);
  const isPlainObject = proto === Object.prototype || proto === null;

  if (!isPlainObject) {
    if (isTimestampLike(value)) {
      try {
        return value.toDate().toISOString();
      } catch {
        return undefined;
      }
    }
    // Not a plain object and not a timestamp — drop it. See the note above.
    return undefined;
  }

  const out: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
    const converted = convert(item, depth + 1);
    // Dropping the key entirely, rather than storing undefined, keeps the
    // result JSON-safe and matches how an absent CMS field already behaves.
    if (converted !== undefined) out[key] = converted;
  }
  return out;
}
