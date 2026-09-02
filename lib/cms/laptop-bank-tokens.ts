import * as React from "react";

import {
  LAPTOP_BANK_TOKENS,
  type TokenName,
  type TokenValues,
} from "@/lib/content/laptop-bank-tokens";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

/**
 * The single CMS source for the {{TOKEN}} values (build spec 5.1 BEHAVIOUR:
 * "{{SLA_REPLY}} is used on this page, 5.2 and 5.5. Single source in the CMS,
 * referenced three times.").
 *
 * One Firestore document holds all of them. That is deliberate rather than a
 * document per token: spec §10 checks that {{SLA_REPLY}} "renders the same
 * value on 5.1, 5.2 and 5.5", and a single document makes divergence
 * impossible rather than merely unlikely. It is also one read per request
 * instead of twenty-seven.
 *
 * Wrapped in React's `cache` so the public layout's read is shared with any
 * page-level or metadata read in the same request.
 */

/**
 * Per-request dedupe where it exists, a plain call where it does not.
 *
 * `React.cache` is only present in React's server build, which Next provides.
 * `scripts/verify-tokens.ts` imports this module under plain tsx, where it is
 * undefined — calling it there threw "cache is not a function" at module load
 * and made the verify script exit 1 for a reason that had nothing to do with
 * outstanding tokens. Since that script is the Vercel production gate, the
 * gate would have failed every deploy on a crash rather than a real finding.
 */
type CacheFn = <T extends (...args: never[]) => unknown>(fn: T) => T;
const perRequest: CacheFn =
  typeof (React as { cache?: unknown }).cache === "function"
    ? ((React as unknown as { cache: CacheFn }).cache)
    : ((fn) => fn);

export const TOKENS_DOC_ID = "tokens";

/** Only keys the registry declares are accepted, so a stray field cannot leak into copy. */
function project(data: Record<string, unknown>): TokenValues {
  const values: TokenValues = {};
  for (const name of Object.keys(LAPTOP_BANK_TOKENS) as TokenName[]) {
    const raw = data[name];
    if (typeof raw === "string" && raw.trim()) values[name] = raw.trim();
  }
  return values;
}

export const getTokenValues = perRequest(async (): Promise<TokenValues> => {
  const db = await getAdminFirestore();
  // No Firestore means nothing is supplied yet, which is the correct starting
  // state — every token then renders as a visible placeholder rather than
  // silently becoming an empty string in the middle of a sentence.
  if (!db) return {};

  try {
    const doc = await db
      .collection(FIREBASE_COLLECTIONS.laptopBankSettings)
      .doc(TOKENS_DOC_ID)
      .get();
    if (!doc.exists) return {};
    return project((doc.data() ?? {}) as Record<string, unknown>);
  } catch (error) {
    console.error("Laptop Bank token values read failed", error);
    return {};
  }
});
