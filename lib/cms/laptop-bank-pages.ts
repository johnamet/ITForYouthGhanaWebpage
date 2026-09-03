import * as React from "react";

import { applyOverrides } from "@/lib/cms/descriptors/page-overrides";
import { getPageSeed } from "@/lib/content/laptop-bank-page-seeds";
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

export const getLaptopBankPageContent = perRequest(
  async <T extends Record<string, unknown>>(key: string): Promise<T> => {
    const page = getPageSeed(key);
    if (!page) throw new Error(`Unknown Laptop Bank page key: ${key}`);

    const seed = page.seed as T;

    const db = await getAdminFirestore();
    if (!db) return applyOverrides(seed, {});

    try {
      const doc = await db.collection(FIREBASE_COLLECTIONS.laptopBankPages).doc(key).get();
      if (!doc.exists) return applyOverrides(seed, {});

      const stored = toPlainData((doc.data() ?? {}) as Record<string, unknown>);
      return applyOverrides(seed, stored);
    } catch (error) {
      console.error(`Laptop Bank page copy read failed for ${key}`, error);
      return applyOverrides(seed, {});
    }
  },
);
