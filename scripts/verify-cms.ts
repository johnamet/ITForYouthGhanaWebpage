/**
 * Two invariants the admin depends on and nothing else enforces.
 *
 *   1. Every admin API route that writes also records an audit entry.
 *      22 of this repo's 45 routes did not, which made /admin/audit quietly
 *      incomplete: a change made through one of them could not be attributed
 *      to anyone. Two routes are exempt and say so in their own source.
 *
 *   2. Every registered descriptor is reachable — it has a node in
 *      lib/content/admin-registry.ts, which is what the sidebar and Content
 *      Explorer read. A content type nobody can navigate to is not editable,
 *      which is the failure the Laptop Bank hit when it was registered only
 *      in `adminNavigation`.
 *
 * Static analysis only: it reads route files off disk and compares two
 * in-code maps, so it needs no Firestore and is safe to run anywhere.
 *
 *   npm run verify:cms
 */
import fs from "node:fs";
import path from "node:path";

/**
 * Routes that write but legitimately record nothing. Each says why in its own
 * source; keep the two lists in step.
 */
const AUDIT_EXEMPT = new Set([
  // Sign-in/out. Belongs in an auth log, not the content change history.
  "session/route.ts",
  // Rebuilds cached pages. Writes no data, so there is nothing to attribute.
  "revalidate/route.ts",
]);

const WRITE_VERBS = /export async function (PUT|POST|DELETE|PATCH)\b/;

let failures = 0;

function fail(message: string) {
  console.error(`FAIL  ${message}`);
  failures += 1;
}

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name === "route.ts") out.push(full);
  }
  return out;
}

async function main() {
  // ── 1. Audit coverage ────────────────────────────────────────────────────
  const adminApiDir = path.join(process.cwd(), "app", "api", "admin");
  const routes = walk(adminApiDir);
  let writeRoutes = 0;
  let audited = 0;
  let exempt = 0;

  for (const file of routes) {
    const source = fs.readFileSync(file, "utf8");
    if (!WRITE_VERBS.test(source)) continue;
    writeRoutes += 1;

    const rel = path.relative(adminApiDir, file).split(path.sep).join("/");
    if (AUDIT_EXEMPT.has(rel)) {
      exempt += 1;
      if (!source.includes("AUDIT EXEMPT")) {
        fail(`${rel} is exempt in this script but does not say so in its own source.`);
      }
      continue;
    }

    if (source.includes("writeAuditLog") || source.includes("auditedWrite")) {
      audited += 1;
    } else {
      fail(`${rel} writes but records no audit entry.`);
    }
  }

  console.log(
    `Audit coverage: ${audited}/${writeRoutes - exempt} write routes audited ` +
      `(${exempt} exempt, ${routes.length} admin routes total).`,
  );

  // ── 2. Descriptor reachability ───────────────────────────────────────────
  const { CMS_DESCRIPTORS } = await import("../lib/cms/descriptors/registry");
  const { adminNodes, adminHubs } = await import("../lib/content/admin-registry");

  const nodePaths = new Set(adminNodes.map((node) => node.adminPath));
  const hubKeys = new Set(adminHubs.map((hub) => hub.key));

  let reachable = 0;
  for (const [key, descriptor] of Object.entries(CMS_DESCRIPTORS)) {
    const expected = [
      `/admin/cms/${key}`,
      `/admin/laptop-bank/records/${key}`,
    ];
    if (expected.some((candidate) => nodePaths.has(candidate))) {
      reachable += 1;
    } else {
      fail(`descriptor "${key}" has no node in admin-registry, so nothing links to it.`);
    }

    if (!hubKeys.has(descriptor.hub)) {
      fail(`descriptor "${key}" declares hub "${descriptor.hub}", which is not in adminHubs.`);
    }

    // A descriptor with no revalidate paths saves successfully and then leaves
    // the public page showing the old copy until the next deploy, because
    // these pages are statically prerendered. Nothing appears to be wrong,
    // which is why this is asserted rather than left to review.
    if (!descriptor.revalidatePaths?.length) {
      fail(`descriptor "${key}" declares no revalidatePaths, so an edit would not reach the public page until the next deploy.`);
    }
  }

  console.log(
    `Descriptor reachability: ${reachable}/${Object.keys(CMS_DESCRIPTORS).length} reachable from the admin registry.`,
  );

  if (failures) {
    console.error(`\n${failures} problem(s) found.`);
    process.exit(1);
  }
  console.log("\nAll CMS invariants hold.");
}

main().catch((error) => {
  console.error("verify:cms failed:", error);
  process.exit(1);
});
