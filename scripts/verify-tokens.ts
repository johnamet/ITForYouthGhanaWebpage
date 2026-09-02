/**
 * Spec §10, first checklist item: "No {{TOKEN}} string exists anywhere in
 * published content."
 *
 * Values live in the CMS (spec 5.1: "Single source in the CMS"), so this reads
 * them from Firestore rather than from the code registry, and reports exactly
 * what IT for Youth still owes.
 *
 * Exits 1 while any Phase 1 token is unresolved. Run it deliberately:
 *
 *   npm run verify:tokens
 *
 * It is also wired into the Vercel PRODUCTION build only, so an incomplete
 * page cannot reach the public site — see vercel.json. Local `npm run build`
 * is deliberately left unblocked.
 */
import fs from "node:fs";
import path from "node:path";

// Next loads .env automatically; a bare tsx process does not.
for (const file of [".env", ".env.local"]) {
  const full = path.join(process.cwd(), file);
  if (!fs.existsSync(full)) continue;
  for (const line of fs.readFileSync(full, "utf8").split("\n")) {
    const match = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line);
    if (!match) continue;
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[match[1]] === undefined) process.env[match[1]] = value;
  }
}

async function main() {
  const { LAPTOP_BANK_TOKENS, isTokenResolved } = await import(
    "../lib/content/laptop-bank-tokens"
  );
  const { getTokenValues } = await import("../lib/cms/laptop-bank-tokens");
  const { getAdminSdkStatus } = await import("../lib/firebase/admin");

  type Name = keyof typeof LAPTOP_BANK_TOKENS;

  const status = getAdminSdkStatus();
  if (!status.configured) {
    // Fail loudly rather than reporting a clean sheet from an empty read: "no
    // values because the database is unreachable" must never look like "no
    // values outstanding".
    console.error(
      "Firebase Admin is not configured, so token values cannot be read.\n" +
        "Set FIREBASE_SERVICE_ACCOUNT_BASE64 before trusting this check.",
    );
    process.exit(1);
  }

  const values = await getTokenValues();
  const names = Object.keys(LAPTOP_BANK_TOKENS) as Name[];
  const unresolved = names.filter((name) => !isTokenResolved(values, name));
  const blocking = unresolved.filter((name) => LAPTOP_BANK_TOKENS[name].phase === 1);

  console.log(`Project: ${status.projectId}\n`);

  if (unresolved.length) {
    console.log("Awaiting content from IT for Youth:\n");
    for (const phase of [1, 2] as const) {
      const forPhase = unresolved.filter((name) => LAPTOP_BANK_TOKENS[name].phase === phase);
      if (!forPhase.length) continue;
      console.log(`  Phase ${phase}`);
      for (const name of forPhase) {
        const entry = LAPTOP_BANK_TOKENS[name];
        console.log(
          `    {{${name}}}`.padEnd(28) + `${entry.needed}  —  pages ${entry.usedOn.join(", ")}`,
        );
      }
      console.log("");
    }
    console.log("  Fill these in at /admin/laptop-bank/records/token\n");
  }

  console.log(`${names.length - unresolved.length}/${names.length} tokens resolved.`);

  if (blocking.length) {
    console.error(
      `\n${blocking.length} Phase 1 token${blocking.length === 1 ? "" : "s"} still unresolved — not ready to publish.`,
    );
    process.exit(1);
  }

  console.log("No unresolved Phase 1 tokens. Publishable.");
}

main().catch((error) => {
  console.error("verify:tokens failed:", error);
  process.exit(1);
});
