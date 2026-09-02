/**
 * Content IT for Youth has not yet supplied (build spec §11).
 *
 * Spec §1: "Render every {{TOKEN}} in staging as visible red text. Fail the
 * production build if any {{ }} string exists in published content."
 *
 * `npm run verify:tokens` is that gate and exits non-zero while a Phase 1
 * token is unresolved, so it CAN gate a production deploy. It is deliberately
 * NOT wired into `prebuild`, a git hook or CI — in this repo verification is a
 * command run on purpose, never something that blocks a build.
 *
 * Spec §11's standing instruction to the developer is "build with the token in
 * place, do not invent values". Retiring a token means setting its `value`
 * here, in one place, and nowhere else. That is what makes {{SLA_REPLY}}
 * render identically on pages 5.1, 5.2 and 5.5 — spec §10 checks for exactly
 * that, and three hardcoded copies would eventually drift.
 */

export type TokenName =
  | "SLA_REPLY"
  | "DUR_AGREEMENT"
  | "DUR_INTAKE"
  | "DUR_WIPE"
  | "DUR_REFURB"
  | "WIPE_STANDARD"
  | "CERT_RETENTION"
  | "FACILITY_STATEMENT"
  | "OS_NAME"
  | "GIVE_1"
  | "GIVE_1_GBP"
  | "GIVE_1_OUTCOME"
  | "GIVE_2"
  | "GIVE_2_GBP"
  | "GIVE_2_OUTCOME"
  | "GIVE_3"
  | "GIVE_3_GBP"
  | "GIVE_3_OUTCOME"
  | "LOAN_MONTHS"
  | "PEER_HOURS"
  | "CYCLE"
  | "PANEL"
  | "DECISION_DATE"
  | "PRIORITY_GROUPS"
  | "REPORT_CONTACT"
  | "NEED_STAT"
  | "RECYCLER";

export type TokenEntry = {
  /** What IT for Youth needs to supply. Shown as help text in the editor. */
  needed: string;
  /** Spec sections that consume it. */
  usedOn: string[];
  phase: 1 | 2;
  /** Longer answers get a textarea in the admin editor. */
  longform?: boolean;
};

/**
 * Supplied values, keyed by token name. Read from the CMS — see
 * lib/cms/laptop-bank-tokens.ts. A token absent from this map is unresolved
 * and renders as red text.
 */
export type TokenValues = Partial<Record<TokenName, string>>;

export const LAPTOP_BANK_TOKENS: Record<TokenName, TokenEntry> = {
  SLA_REPLY: { needed: "Reply commitment", usedOn: ["5.1", "5.2", "5.5"], phase: 1 },
  DUR_AGREEMENT: { needed: "Stage 2 duration — agreement and transfer of title", usedOn: ["5.2"], phase: 1 },
  DUR_INTAKE: { needed: "Stage 4 duration — intake, tagging and grading", usedOn: ["5.2"], phase: 1 },
  DUR_WIPE: { needed: "Stage 5 duration — data sanitisation", usedOn: ["5.2"], phase: 1 },
  DUR_REFURB: { needed: "Stage 6 duration — refurbishment and quality assurance", usedOn: ["5.2"], phase: 1 },
  WIPE_STANDARD: { needed: "Named sanitisation standard", usedOn: ["5.2 stage 5", "5.4 §2"], phase: 1 },
  CERT_RETENTION: { needed: "Certificate retention period", usedOn: ["5.4 §4"], phase: 1 },
  FACILITY_STATEMENT: { needed: "Physical security paragraph", usedOn: ["5.4 §6"], phase: 1, longform: true },
  OS_NAME: { needed: "Operating system installed", usedOn: ["5.2 stage 6"], phase: 1 },
  /*
   * The giving tiers need TWO figures each, not one.
   *
   * Spec §3 requires C15 to show "GHS and GBP/USD side by side", but spec §11
   * supplies only one token per tier and no conversion rate. The sterling
   * tokens below close that gap explicitly rather than deriving sterling from
   * cedis: Draft 1 §16 forbids publishing a cost figure that was not properly
   * calculated, and a rate hardcoded here would be wrong within weeks and
   * would be publishing an exchange rate the organisation never agreed.
   *
   * Ask IT for Youth for a cedi amount AND a sterling amount per tier.
   */
  GIVE_1: { needed: "First giving amount, in cedis", usedOn: ["5.6"], phase: 1 },
  GIVE_1_GBP: { needed: "First giving amount, in sterling", usedOn: ["5.6"], phase: 1 },
  GIVE_1_OUTCOME: { needed: "Outcome line for the first amount", usedOn: ["5.6"], phase: 1, longform: true },
  GIVE_2: { needed: "Second giving amount, in cedis", usedOn: ["5.6"], phase: 1 },
  GIVE_2_GBP: { needed: "Second giving amount, in sterling", usedOn: ["5.6"], phase: 1 },
  GIVE_2_OUTCOME: { needed: "Outcome line for the second amount", usedOn: ["5.6"], phase: 1, longform: true },
  GIVE_3: { needed: "Third giving amount, in cedis", usedOn: ["5.6"], phase: 1 },
  GIVE_3_GBP: { needed: "Third giving amount, in sterling", usedOn: ["5.6"], phase: 1 },
  GIVE_3_OUTCOME: { needed: "Outcome line for the third amount", usedOn: ["5.6"], phase: 1, longform: true },
  LOAN_MONTHS: { needed: "Loan period", usedOn: ["5.6", "5.7", "6.2"], phase: 1 },
  PEER_HOURS: { needed: "Teaching hours", usedOn: ["5.2", "5.6", "5.7", "6.2"], phase: 1 },
  CYCLE: { needed: "Selection cycle", usedOn: ["5.7", "5.8"], phase: 1 },
  PANEL: { needed: "Selection panel", usedOn: ["5.7", "5.8"], phase: 1 },
  DECISION_DATE: { needed: "Next decision date", usedOn: ["5.7", "5.8"], phase: 1 },
  PRIORITY_GROUPS: { needed: "Published priority groups", usedOn: ["5.7"], phase: 1, longform: true },
  REPORT_CONTACT: { needed: "Reporting route for payment demands", usedOn: ["5.7"], phase: 1 },
  NEED_STAT: { needed: "The one figure in block 2", usedOn: ["5.6"], phase: 1 },
  RECYCLER: { needed: "Licensed handler name and licence reference", usedOn: ["5.13"], phase: 2 },
};

/**
 * Emits the `{{NAME}}` placeholder for use inside a COPY string.
 *
 * This ALWAYS returns the placeholder. Content modules are evaluated once at
 * module scope, so they cannot hold a value that an editor may change at any
 * moment — the substitution happens at render time instead, from values read
 * out of the CMS. `TokenText` does it for markup; `resolveTokens` does it for
 * anything server-side (metadata, an email body, an API response).
 *
 * {{REF}} is deliberately absent from this registry: it is generated at submit
 * time by lib/utils/reference.ts (spec 5.5, 5.8), not supplied by IT for Youth,
 * so it is never an unresolved-content problem.
 */
export function token(name: TokenName): string {
  return `{{${name}}}`;
}

/** True once IT for Youth has supplied a non-empty value. */
export function isTokenResolved(values: TokenValues, name: TokenName): boolean {
  return Boolean(values[name]?.trim());
}

/**
 * Substitutes supplied values into a string, leaving unresolved placeholders
 * in place so they stay visible rather than silently vanishing.
 */
export function resolveTokens(text: string, values: TokenValues): string {
  return text.replace(new RegExp(UNRESOLVED_TOKEN_SOURCE, "g"), (match, name: string) => {
    const supplied = values[name as TokenName];
    return supplied?.trim() ? supplied : match;
  });
}

/** Phase 1 tokens with no supplied value. Spec §10's first checklist item. */
export function outstandingPhaseOneTokens(values: TokenValues): TokenName[] {
  return (Object.keys(LAPTOP_BANK_TOKENS) as TokenName[]).filter(
    (name) => LAPTOP_BANK_TOKENS[name].phase === 1 && !isTokenResolved(values, name),
  );
}

/**
 * Matches an unresolved token in a rendered string.
 *
 * Exported as a source string rather than a shared RegExp because a /g regexp
 * carries `lastIndex` state; sharing one instance across renders would make it
 * skip matches on every other call.
 */
export const UNRESOLVED_TOKEN_SOURCE = "\\{\\{([A-Z0-9_]+)\\}\\}";
