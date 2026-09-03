/**
 * Two invariants the admin depends on and nothing else enforces.
 *
 *   1. Every admin API route that writes also records an audit entry.
 *      22 of this repo's 45 routes did not, which made /admin/audit quietly
 *      incomplete: a change made through one of them could not be attributed
 *      to anyone. Two routes are exempt and say so in their own source.
 *
 *   2. Opening any generated editor and pressing save changes nothing.
 *      The one invariant that keeps a generated editor safe to hand over: if
 *      a round trip through the form's own value builder, the write path's
 *      coercion and the read path's merge does not return the seed unchanged,
 *      then simply looking at a page in the admin would rewrite it.
 *
 *   3. Every registered descriptor is reachable — it has a node in
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

  // ── 2. No reader spreads raw Firestore data over a seed ──────────────────
  //
  // `{ ...seed, ...doc.data() }` carries a stored Timestamp into the React
  // tree, which logs an error on every prerender while the build still exits
  // 0. It shipped twice — lib/cms/partnerships.ts and lib/cms/impact-pages.ts
  // — and the second one survived a scan of every zero-argument reader because
  // it takes a slug. Checking the PATTERN statically catches the class rather
  // than the instances.
  const cmsDir = path.join(process.cwd(), "lib", "cms");
  const rawSpread = /\.\.\.\((?:doc\.data\(\)|data|snapshot)\b/;
  let readersChecked = 0;

  for (const entry of fs.readdirSync(cmsDir)) {
    if (!entry.endsWith(".ts")) continue;
    const source = fs.readFileSync(path.join(cmsDir, entry), "utf8");
    readersChecked += 1;
    for (const [index, line] of source.split("\n").entries()) {
      if (!rawSpread.test(line)) continue;
      if (line.includes("toPlainData") || line.includes("applyOverrides")) continue;
      fail(
        `lib/cms/${entry}:${index + 1} spreads raw Firestore data over a seed. ` +
          "Route it through toPlainData or applyOverrides — a stored Timestamp " +
          "reaching a Client Component logs an error on every prerender.",
      );
    }
  }

  console.log(`Reader hygiene: ${readersChecked} CMS modules checked for raw Firestore spreads.`);

  // ── 3. A no-op save is a no-op ───────────────────────────────────────────
  //
  // Simulated end to end, through the real functions rather than copies:
  // initialValues() is what the form renders from, projectRecord() is what the
  // API route stores, applyOverrides() is what the public page reads back. An
  // editor who opens a page, changes nothing and saves must leave the page
  // byte-identical — otherwise the act of looking at content edits it, which
  // is the kind of bug that only shows up as "who changed this?" weeks later.
  //
  // This is where the repeatable-list controls earn their keep or fail: a list
  // is stored WHOLE, so a coercion that drops a row's unknown key, or reorders
  // it, or turns an empty array into a stored empty array, shows up here as a
  // difference against the seed.
  const { initialValues } = await import("../lib/cms/descriptors/form-values");
  const { projectRecord } = await import("../lib/cms/descriptors/crud");
  const { applyOverrides } = await import("../lib/cms/descriptors/page-overrides");
  const { resolveFields, seedRecordsOf } = await import(
    "../lib/cms/descriptors/seed-collections"
  );
  const { CMS_DESCRIPTORS: descriptors } = await import("../lib/cms/descriptors/registry");

  let roundTripped = 0;

  const checkRoundTrip = (
    label: string,
    descriptor: import("../lib/cms/descriptors/types").ContentTypeDescriptor,
    id: string | undefined,
    seed: Record<string, unknown>,
  ) => {
    const fields = resolveFields(descriptor, { id });
    const values = initialValues(fields, undefined, seed);
    const stored = projectRecord(descriptor, values as Record<string, unknown>, fields);
    const merged = applyOverrides(seed, stored);
    roundTripped += 1;

    for (const key of Object.keys(seed)) {
      const before = JSON.stringify(seed[key]);
      const after = JSON.stringify((merged as Record<string, unknown>)[key]);
      if (before !== after) {
        fail(
          `${label}: opening the editor and saving would change "${key}".\n` +
            `        was:  ${String(before).slice(0, 160)}\n` +
            `        then: ${String(after).slice(0, 160)}`,
        );
      }
    }
  };

  for (const [key, descriptor] of Object.entries(descriptors)) {
    if (descriptor.shape === "seed-collection") {
      for (const record of seedRecordsOf(descriptor)) {
        checkRoundTrip(`${key}/${record.id}`, descriptor, record.id, record.seed);
      }
      continue;
    }
    if (descriptor.seed) checkRoundTrip(key, descriptor, descriptor.singletonId, descriptor.seed);
  }

  console.log(`No-op saves: ${roundTripped} generated editor(s) round-trip their seed unchanged.`);

  // ── 4. Descriptor reachability ───────────────────────────────────────────
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

    // Both of these mistakes present as an EMPTY EDITOR rather than an error:
    // a seed-backed collection with no seed records lists nothing, and a list
    // field with no item fields renders a box with an Add button that adds a
    // row of no controls.
    if (descriptor.shape === "seed-collection" && !descriptor.seedRecords?.length) {
      fail(`descriptor "${key}" is a seed-collection but declares no seedRecords, so its editor would list nothing.`);
    }

    const listFields = (fields: import("../lib/cms/descriptors/types").FieldDescriptor[]): string[] =>
      fields.flatMap((field) =>
        field.kind === "list"
          ? [
              ...(field.itemFields?.length ? [] : [field.key]),
              ...listFields(field.itemFields ?? []),
            ]
          : [],
      );

    for (const emptyList of listFields(descriptor.fields)) {
      fail(`descriptor "${key}" declares list field "${emptyList}" with no itemFields, so its rows would have no controls.`);
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
