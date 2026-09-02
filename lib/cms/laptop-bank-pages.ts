import * as React from "react";

import {
  PATH_SEPARATOR,
  getPageSeed,
} from "@/lib/content/laptop-bank-page-seeds";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { toPlainData } from "@/lib/utils/plain";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

/**
 * Applies CMS overrides onto a page's seed copy.
 *
 * Stored documents hold flat path keys — `hero__heading`, `handleForYou__cards__0__title`
 * — because that is exactly what the generated admin editor produces, and a
 * flat map is trivially mergeable without any nested-diff logic. See
 * PATH_SEPARATOR for why the separator is not a dot.
 *
 * AN EMPTY VALUE MEANS "NOT OVERRIDDEN", not "blank this out". A heading
 * cleared by accident would otherwise leave a live page with a missing title,
 * and there is no way for a reader to tell that from a deliberate deletion.
 * Removing a section is a structural change, not a copy edit, so it stays a
 * developer job — the editor's guidance says so.
 */

/** See the note in lib/cms/laptop-bank-tokens.ts — React.cache is Next-only. */
type CacheFn = <T extends (...args: never[]) => unknown>(fn: T) => T;
const perRequest: CacheFn =
  typeof (React as { cache?: unknown }).cache === "function"
    ? (React as unknown as { cache: CacheFn }).cache
    : (fn) => fn;

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

export const getLaptopBankPageContent = perRequest(
  async <T extends Record<string, unknown>>(key: string): Promise<T> => {
    const page = getPageSeed(key);
    if (!page) throw new Error(`Unknown Laptop Bank page key: ${key}`);

    const seed = clone(page.seed) as T;

    const db = await getAdminFirestore();
    if (!db) return seed;

    try {
      const doc = await db.collection(FIREBASE_COLLECTIONS.laptopBankPages).doc(key).get();
      if (!doc.exists) return seed;

      const stored = toPlainData((doc.data() ?? {}) as Record<string, unknown>);

      for (const [storedKey, value] of Object.entries(stored)) {
        if (typeof value !== "string" || !value.trim()) continue;
        applyOverride(seed as Record<string, unknown>, storedKey.split(PATH_SEPARATOR), value);
      }

      return seed;
    } catch (error) {
      console.error(`Laptop Bank page copy read failed for ${key}`, error);
      return seed;
    }
  },
);
