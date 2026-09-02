/**
 * Verifies the Laptop Bank consent filters and the CMS coercion layer against
 * a real Firestore project.
 *
 * WHY THIS EXISTS
 * Build spec §10's last checklist item is "Story and Donor queries exclude
 * non-consenting records — verified with a test record". That cannot be
 * verified by reading code: the filters live in Firestore `where` clauses, and
 * a wrong clause fails silently by returning too much. So this writes records,
 * asserts the public readers exclude the right ones, and deletes them.
 *
 * ⚠ THIS SCRIPT WRITES TO FIRESTORE. It creates documents prefixed
 * `ZZ-TEST-` in laptopBankDonors, laptopBankStories, laptopBankStages and
 * laptopBankMetrics, then deletes them in a `finally` block so a failed
 * assertion still cleans up. Run it against a project you are willing to write
 * to. It is deliberately NOT part of `npm run build`, any git hook or CI —
 * verification in this repo is a command run on purpose.
 *
 *   npm run verify:laptop-bank
 *
 * It writes to the SINGLETON metrics document id ("current") and to process
 * stage id "5", so do not run it while real records occupy those ids — it
 * deletes them on cleanup. Both are empty on a fresh project.
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

const DONOR_IDS = ["ZZ-TEST-donor-anonymous", "ZZ-TEST-donor-named", "ZZ-TEST-donor-logo"];
const STORY_IDS = [
  "ZZ-TEST-story-noconsent",
  "ZZ-TEST-story-consent-norecord",
  "ZZ-TEST-story-full",
];
const STAGE_ID = "99";
const METRICS_ID = "current";

let failures = 0;

function check(label: string, pass: boolean, detail = "") {
  console.log(`${pass ? "PASS" : "FAIL"}  ${label}${detail ? ` — ${detail}` : ""}`);
  if (!pass) failures += 1;
}

async function main() {
  const { getAdminFirestore, getAdminSdkStatus } = await import("../lib/firebase/admin");
  const status = getAdminSdkStatus();

  if (!status.configured) {
    console.error("Firebase Admin is not configured. Set FIREBASE_SERVICE_ACCOUNT_BASE64.");
    if (status.warnings.length) console.error(status.warnings.join("\n"));
    process.exit(1);
  }

  console.log(`Project: ${status.projectId}\n`);

  const db = await getAdminFirestore();
  if (!db) {
    console.error("Could not obtain a Firestore handle.");
    process.exit(1);
  }

  const readers = await import("../lib/cms/laptop-bank");
  const admin = await import("../lib/cms/laptop-bank-admin");
  const { LAPTOP_BANK_CONTENT_TYPES } = await import("../lib/content/laptop-bank-admin-schema");

  // The metrics singleton has one fixed document id, so this script cannot
  // round-trip it without touching whatever is really stored there. When a
  // real record exists, that ONE assertion is skipped and said so — it must
  // not block the consent checks, which are the ones spec §10 actually
  // mandates. An earlier version refused to run at all, and a metrics record
  // someone had saved in the admin silently disabled the whole test.
  const existingMetrics = await db.collection("laptopBankMetrics").doc(METRICS_ID).get();
  const skipMetricsRoundTrip = existingMetrics.exists;

  // The stage id is 99, which the spec's nine stages can never occupy, so
  // there is nothing real to protect here.
  const existingStage = await db.collection("laptopBankStages").doc(STAGE_ID).get();
  if (existingStage.exists) {
    console.error(
      `Refusing to run: a record exists at laptopBankStages/${STAGE_ID}, which this script uses as scratch space.`,
    );
    process.exit(1);
  }

  try {
    // ── Seed: three donors, one per consent value ──────────────────────────
    await db
      .collection("laptopBankDonors")
      .doc(DONOR_IDS[0])
      .set({ name: "ZZ TEST Anonymous Donor", display_consent: "anonymous", logo: "https://images.unsplash.com/photo-1.png" });
    await db
      .collection("laptopBankDonors")
      .doc(DONOR_IDS[1])
      .set({ name: "ZZ TEST Named Only Donor", display_consent: "named", logo: "https://images.unsplash.com/photo-2.png" });
    await db
      .collection("laptopBankDonors")
      .doc(DONOR_IDS[2])
      .set({ name: "ZZ TEST Logo Donor", display_consent: "logo", logo: "https://images.unsplash.com/photo-3.png" });

    // ── Seed: three stories, covering both story consent rules ─────────────
    await db.collection("laptopBankStories").doc(STORY_IDS[0]).set({
      preferred_name: "ZZ TEST No Consent",
      quote: "should never appear",
      publication_consent: false,
      institution: "ZZ TEST University",
      photo: "https://images.unsplash.com/photo-4.png",
      consent_record_ref: "REF-1",
    });
    await db.collection("laptopBankStories").doc(STORY_IDS[1]).set({
      preferred_name: "ZZ TEST Consent No Record",
      quote: "quote may appear",
      publication_consent: true,
      institution: "ZZ TEST University",
      photo: "https://images.unsplash.com/photo-5.png",
    });
    await db.collection("laptopBankStories").doc(STORY_IDS[2]).set({
      preferred_name: "ZZ TEST Full Consent",
      quote: "fully consented",
      publication_consent: true,
      institution: "ZZ TEST University",
      photo: "https://images.unsplash.com/photo-6.png",
      consent_record_ref: "REF-2",
    });

    console.log("— Donor consent (spec §4 DATA) —");
    const consenting = (await readers.getConsentingDonors()).map((donor) => donor.name);
    check("anonymous donor excluded", !consenting.includes("ZZ TEST Anonymous Donor"), consenting.join(", "));
    check("named donor included", consenting.includes("ZZ TEST Named Only Donor"));
    check("logo donor included", consenting.includes("ZZ TEST Logo Donor"));

    const logoOnly = (await readers.getLogoConsentingDonors()).map((donor) => donor.name);
    check("logo grid excludes anonymous", !logoOnly.includes("ZZ TEST Anonymous Donor"));
    check("logo grid excludes named-only", !logoOnly.includes("ZZ TEST Named Only Donor"), logoOnly.join(", "));
    check("logo grid includes logo-consenting", logoOnly.includes("ZZ TEST Logo Donor"));

    console.log("\n— Story consent (spec §4 DATA and 5.14 DATA) —");
    const stories = await readers.getPublishableStories();
    const storyNames = stories.map((story) => story.preferred_name);
    check("unconsented story excluded", !storyNames.includes("ZZ TEST No Consent"), storyNames.join(", "));
    check("consented story included", storyNames.includes("ZZ TEST Full Consent"));

    const noRecord = stories.find((story) => story.preferred_name === "ZZ TEST Consent No Record");
    check("consented story without a consent record is still returned", Boolean(noRecord));
    check("...its institution is withheld", noRecord?.institution === undefined, String(noRecord?.institution));
    check("...its photograph is withheld", noRecord?.photo === undefined, String(noRecord?.photo));

    const full = stories.find((story) => story.preferred_name === "ZZ TEST Full Consent");
    check("fully consented story keeps its institution", full?.institution === "ZZ TEST University");
    check("fully consented story keeps its photograph", Boolean(full?.photo));
    check("limit is honoured", (await readers.getPublishableStories(1)).length === 1);

    console.log("\n— CMS coercion (spec §4, §10) —");
    const projected = admin.projectRecord(LAPTOP_BANK_CONTENT_TYPES.donor, {
      name: "  Trimmed Name  ",
      display_consent: "logo",
      evil_field: "should not survive",
    });
    check("undeclared key dropped", !("evil_field" in projected), Object.keys(projected).join(","));
    check("text trimmed", projected.name === "Trimmed Name");

    const metrics = admin.projectRecord(LAPTOP_BANK_CONTENT_TYPES["dashboard-metrics"], {
      period_label: "ZZ TEST period",
      last_updated: "2026-09-02",
      units_accepted: "12",
      drives_sanitised: "",
      deployed_individual: "0",
      partner_orgs: "4",
    });
    check("filled number coerced to a number", metrics.units_accepted === 12);
    check("EMPTY number stored as null, never 0", metrics.drives_sanitised === null, JSON.stringify(metrics.drives_sanitised));
    check('explicit "0" stored as 0, never null', metrics.deployed_individual === 0);
    check(
      "nullable metrics are not reported as missing",
      admin.missingRequiredFields(LAPTOP_BANK_CONTENT_TYPES["dashboard-metrics"], metrics).length === 0,
    );

    // A count cannot be negative and a percentage cannot exceed 100. A real
    // record reached Firestore with units_offered = -70 before this check.
    const negative = admin.projectRecord(LAPTOP_BANK_CONTENT_TYPES["dashboard-metrics"], {
      period_label: "ZZ", last_updated: "ZZ", units_offered: "-70", retention_12m_pct: "140",
    });
    const ranges = admin.outOfRangeFields(LAPTOP_BANK_CONTENT_TYPES["dashboard-metrics"], negative);
    check("negative count rejected", ranges.some((f) => f.includes("Units offered")), ranges.join("; "));
    check("percentage above 100 rejected", ranges.some((f) => f.includes("12 months")), ranges.join("; "));
    check(
      "a valid record reports no range errors",
      admin.outOfRangeFields(LAPTOP_BANK_CONTENT_TYPES["dashboard-metrics"], metrics).length === 0,
    );

    if (skipMetricsRoundTrip) {
      console.log(
        "SKIP  metrics round trip — a real record exists at laptopBankMetrics/current.\n" +
          "      The coercion assertions above still cover null-vs-zero; only the\n" +
          "      write-and-read-back is skipped, so your data is left untouched.",
      );
    } else {
      await admin.saveRecord("dashboard-metrics", undefined, metrics);
      const stored = await readers.getDashboardMetrics();
      check("singleton written to its fixed id", Boolean(stored));
      check("null metric survives the round trip", stored?.drives_sanitised === null, JSON.stringify(stored?.drives_sanitised));
      check("zero metric survives the round trip", stored?.deployed_individual === 0);
    }

    const stage = {
      number: STAGE_ID,
      title: "ZZ TEST stage",
      duration: "x",
      summary_sentence: "s",
      full_text: "f",
      owner: "o",
      record_produced: "r",
    };
    await admin.saveRecord("process-stage", undefined, stage);
    await admin.saveRecord("process-stage", undefined, { ...stage, title: "ZZ TEST stage edited" });
    const testStages = (await admin.listRecords("process-stage")).filter((row) =>
      String(row.title).startsWith("ZZ TEST"),
    );
    check("two writes to the same stage number make ONE record", testStages.length === 1, `got ${testStages.length}`);
    check("the later write replaced the earlier", testStages[0]?.title === "ZZ TEST stage edited");
    check("stage number coerced to a number", testStages[0]?.number === Number(STAGE_ID), typeof testStages[0]?.number);
  } finally {
    for (const id of DONOR_IDS) await db.collection("laptopBankDonors").doc(id).delete();
    for (const id of STORY_IDS) await db.collection("laptopBankStories").doc(id).delete();
    await db.collection("laptopBankStages").doc(STAGE_ID).delete();
    // Only remove the metrics doc if this run is what created it.
    if (!skipMetricsRoundTrip) {
      await db.collection("laptopBankMetrics").doc(METRICS_ID).delete();
    }

    const leftovers = await Promise.all(
      ["laptopBankDonors", "laptopBankStories", "laptopBankStages", "laptopBankMetrics"].map(
        async (name) => [name, (await db.collection(name).get()).size] as const,
      ),
    );
    console.log(
      `\nCleanup: ${leftovers.map(([name, size]) => `${name}=${size}`).join(", ")}`,
    );
    const dirty = leftovers.filter(([name, size]) => {
      // A metrics record this run deliberately did not touch is not a leftover.
      if (name === "laptopBankMetrics" && skipMetricsRoundTrip) return false;
      return size > 0;
    });
    if (dirty.length) {
      console.error(
        `WARNING: ${dirty.map(([name]) => name).join(", ")} still hold documents. Check for leftover ZZ-TEST records.`,
      );
    }
  }

  console.log(failures ? `\n${failures} ASSERTION(S) FAILED` : "\nAll assertions passed.");
  process.exit(failures ? 1 : 0);
}

main().catch((error) => {
  console.error("verify:laptop-bank failed:", error);
  process.exit(1);
});
