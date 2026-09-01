/**
 * Spec §10, first checklist item: "No {{TOKEN}} string exists anywhere in
 * published content."
 *
 * Run deliberately: `npm run verify:tokens`. Exits 1 while a Phase 1 token is
 * unresolved, so it CAN gate a production deploy — but it is not wired into
 * prebuild, a git hook or CI, matching this repo's standing rule that
 * verification is a command run on purpose and never blocks a build.
 *
 * Before IT for Youth supplies content this script SHOULD fail. That is the
 * honest state, not a bug.
 */
import {
  LAPTOP_BANK_TOKENS,
  type TokenEntry,
  type TokenName,
} from "../lib/content/laptop-bank-tokens";

const entries = Object.entries(LAPTOP_BANK_TOKENS) as Array<[TokenName, TokenEntry]>;
const unresolved = entries.filter(([, entry]) => entry.value === undefined);
const blocking = unresolved.filter(([, entry]) => entry.phase === 1);

if (unresolved.length > 0) {
  console.log("Awaiting content from IT for Youth:\n");
  for (const phase of [1, 2] as const) {
    const forPhase = unresolved.filter(([, entry]) => entry.phase === phase);
    if (forPhase.length === 0) continue;
    console.log(`  Phase ${phase}`);
    for (const [name, entry] of forPhase) {
      console.log(`    {{${name}}}`.padEnd(28) + `${entry.needed}  —  pages ${entry.usedOn.join(", ")}`);
    }
    console.log("");
  }
}

console.log(`${entries.length - unresolved.length}/${entries.length} tokens resolved.`);

if (blocking.length > 0) {
  console.error(
    `\n${blocking.length} Phase 1 token${blocking.length === 1 ? "" : "s"} still unresolved — not ready to publish.`,
  );
  process.exit(1);
}

console.log("No unresolved Phase 1 tokens. Publishable.");
