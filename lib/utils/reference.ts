import { randomInt } from "node:crypto";

/**
 * Generates the {{REF}} value the confirmation states on pages 5.5 and 5.8
 * quote back to the submitter.
 *
 * Draft 1 §9 §7 explains why this matters: "A reference number materially
 * reduces follow-up contact, because it gives the applicant something to
 * hold." Applicants read this reference back to staff over the phone or type
 * it into WhatsApp, so the alphabet below drops every character that is
 * ambiguous when spoken or handwritten — no O/0, no I/1, no S/5, no B/8 — and
 * the whole thing is upper case.
 */
const UNAMBIGUOUS = "ACDEFGHJKLMNPQRTUVWXY2346789";

export type ReferencePrefix = "LB" | "HFL";

function suffix(length: number): string {
  let value = "";
  for (let index = 0; index < length; index += 1) {
    // randomInt over Math.random: a reference is quoted as proof of
    // submission, so it should not be trivially guessable from a neighbouring
    // one.
    value += UNAMBIGUOUS[randomInt(UNAMBIGUOUS.length)];
  }
  return value;
}

/**
 * `LB-260901-K7QD` for a corporate equipment offer, `HFL-260901-K7QD` for a
 * student application. The date makes a reference sortable and lets staff see
 * at a glance which cycle it belongs to.
 */
export function generateReference(prefix: ReferencePrefix, now: Date = new Date()): string {
  const year = String(now.getUTCFullYear()).slice(-2);
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  return `${prefix}-${year}${month}${day}-${suffix(4)}`;
}

/** Substitutes a generated reference into a confirmation COPY template. */
export function applyReference(template: string, reference: string): string {
  return template.replace(/\{\{REF\}\}/g, reference);
}
