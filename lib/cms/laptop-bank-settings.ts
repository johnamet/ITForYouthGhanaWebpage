import * as React from "react";

import {
  APPLICATION_STATUS_DOC_ID,
  DEFAULT_APPLICATION_STATUS,
  type ApplicationStatus,
  type ApplicationStatusState,
} from "@/lib/content/laptop-bank-status";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { toPlainData } from "@/lib/utils/plain";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

/**
 * Settings documents for the Laptop Bank that are neither page copy nor a
 * record collection. Currently the application status (Draft 1 §9 §1); the
 * token values live in the same collection under their own document id.
 */

/** See the note in lib/cms/laptop-bank-tokens.ts — React.cache is Next-only. */
type CacheFn = <T extends (...args: never[]) => unknown>(fn: T) => T;
const perRequest: CacheFn =
  typeof (React as { cache?: unknown }).cache === "function"
    ? (React as unknown as { cache: CacheFn }).cache
    : (fn) => fn;

const STATES: ApplicationStatusState[] = ["open", "closed", "waiting-list"];

const text = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

export const getApplicationStatus = perRequest(async (): Promise<ApplicationStatus> => {
  const db = await getAdminFirestore();
  if (!db) return DEFAULT_APPLICATION_STATUS;

  try {
    const doc = await db
      .collection(FIREBASE_COLLECTIONS.laptopBankSettings)
      .doc(APPLICATION_STATUS_DOC_ID)
      .get();
    if (!doc.exists) return DEFAULT_APPLICATION_STATUS;

    const data = toPlainData((doc.data() ?? {}) as Record<string, unknown>);
    const state = STATES.includes(data.state as ApplicationStatusState)
      ? (data.state as ApplicationStatusState)
      : DEFAULT_APPLICATION_STATUS.state;

    return {
      state,
      openUntil: text(data.openUntil),
      replyBy: text(data.replyBy),
      nextRoundOpens: text(data.nextRoundOpens),
      messageOverride: text(data.messageOverride),
    };
  } catch (error) {
    console.error("Laptop Bank application status read failed", error);
    return DEFAULT_APPLICATION_STATUS;
  }
});
