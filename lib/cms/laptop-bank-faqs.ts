import * as React from "react";

import { herFirstLaptopEligibilityContent } from "@/lib/content/her-first-laptop-config";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { toPlainData } from "@/lib/utils/plain";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

/**
 * The eligibility FAQs (spec 5.7 block 7).
 *
 * Draft 1 §1 names FAQ entries as content that must be editable without a code
 * change, and §4 §8 wants the team to "add to them from the CMS as real
 * questions arrive" — because the questions students actually send are not the
 * six anyone guessed in advance.
 *
 * The spec's six ship as the seed, so the page is complete before anything is
 * stored.
 */

export type LaptopBankFaq = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
};

/** See the note in lib/cms/laptop-bank-tokens.ts — React.cache is Next-only. */
type CacheFn = <T extends (...args: never[]) => unknown>(fn: T) => T;
const perRequest: CacheFn =
  typeof (React as { cache?: unknown }).cache === "function"
    ? (React as unknown as { cache: CacheFn }).cache
    : (fn) => fn;

const SEED: LaptopBankFaq[] = herFirstLaptopEligibilityContent.faqs.items.map(
  (item, index) => ({
    id: `seed-${index + 1}`,
    question: item.question,
    answer: item.answer,
    sort_order: index + 1,
  }),
);

export const getEligibilityFaqs = perRequest(async (): Promise<LaptopBankFaq[]> => {
  const db = await getAdminFirestore();
  if (!db) return SEED;

  try {
    const snapshot = await db.collection(FIREBASE_COLLECTIONS.laptopBankFaqs).get();
    // An empty collection means nobody has edited them yet, so the spec's six
    // still stand. It does NOT mean "no FAQs" — deleting every record to hide
    // the section would be a structural change, not a content one.
    if (snapshot.empty) return SEED;

    return snapshot.docs
      .map((doc) => {
        const data = toPlainData((doc.data() ?? {}) as Record<string, unknown>);
        return {
          id: doc.id,
          question: typeof data.question === "string" ? data.question : "",
          answer: typeof data.answer === "string" ? data.answer : "",
          sort_order: typeof data.sort_order === "number" ? data.sort_order : Number.MAX_SAFE_INTEGER,
        };
      })
      .filter((faq) => faq.question.trim() && faq.answer.trim())
      .sort((left, right) => left.sort_order - right.sort_order);
  } catch (error) {
    console.error("Laptop Bank FAQ read failed", error);
    return SEED;
  }
});
