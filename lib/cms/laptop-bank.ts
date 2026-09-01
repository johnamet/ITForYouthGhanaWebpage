import {
  laptopBankDocuments as seedDocuments,
  laptopBankIntakeItems as seedIntakeItems,
  laptopBankStages as seedStages,
} from "@/lib/content/laptop-bank-config";
import { getAdminFirestore } from "@/lib/firebase/admin";
import type {
  DashboardMetrics,
  Donor,
  IntakeItem,
  LaptopBankDocument,
  ProcessStage,
  Story,
} from "@/types/laptop-bank";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

/**
 * Readers for the IT for Youth Laptop Bank content types (build spec §4).
 *
 * Two different fallback rules apply here, and the difference matters:
 *
 * - Process Stages, Intake Items and Documents fall back to the seed records
 *   in lib/content/laptop-bank-config.ts. Those are real published copy the
 *   client wrote, so serving them before the CMS is populated is correct.
 *
 * - Donors, Stories and Dashboard Metrics have NO seed and fall back to
 *   empty/null. Spec §10 forbids launching the stat band with placeholder
 *   figures, and Draft 1 §16 forbids publishing any count that cannot be
 *   evidenced from a record or any story without recorded consent. An absent
 *   record must therefore read as absent, never as zero.
 *
 * CONSENT IS ENFORCED HERE, IN THE QUERY — spec §4 DATA: "Story and Donor
 * records must not render when their consent field is false or 'anonymous'.
 * Enforce in the query, not the template." A consent check inside a component
 * would mean one of these functions had already leaked a record it should not
 * have returned. Do not add one; fix the query instead.
 */

// ─── Process Stage ────────────────────────────────────────────────────────────

export async function getProcessStages(): Promise<ProcessStage[]> {
  const db = await getAdminFirestore();
  if (!db) return seedStages;

  try {
    const snapshot = await db.collection(FIREBASE_COLLECTIONS.laptopBankStages).get();
    if (snapshot.empty) return seedStages;
    return snapshot.docs
      .map((doc) => doc.data() as ProcessStage)
      .sort((left, right) => left.number - right.number);
  } catch (error) {
    console.error("Laptop Bank process stages read failed", error);
    return seedStages;
  }
}

// ─── Intake Item ──────────────────────────────────────────────────────────────

export async function getIntakeItems(): Promise<IntakeItem[]> {
  const db = await getAdminFirestore();
  if (!db) return seedIntakeItems;

  try {
    const snapshot = await db.collection(FIREBASE_COLLECTIONS.laptopBankIntake).get();
    if (snapshot.empty) return seedIntakeItems;
    return snapshot.docs
      .map((doc) => doc.data() as IntakeItem)
      .sort((left, right) => left.sort_order - right.sort_order);
  } catch (error) {
    console.error("Laptop Bank intake items read failed", error);
    return seedIntakeItems;
  }
}

// ─── Donor ────────────────────────────────────────────────────────────────────

/**
 * Donors who consented to being named — display_consent of "logo" or "named".
 * "anonymous" never leaves this function.
 */
export async function getConsentingDonors(): Promise<Donor[]> {
  const db = await getAdminFirestore();
  if (!db) return [];

  try {
    const snapshot = await db
      .collection(FIREBASE_COLLECTIONS.laptopBankDonors)
      .where("display_consent", "in", ["logo", "named"])
      .get();
    return snapshot.docs.map((doc) => doc.data() as Donor);
  } catch (error) {
    console.error("Laptop Bank donors read failed", error);
    return [];
  }
}

/**
 * The narrower slice C9's logo grid needs: only donors who consented to their
 * logo being shown, and only those that actually have one. A "named" consent
 * is permission to print the name, not the mark.
 */
export async function getLogoConsentingDonors(): Promise<Donor[]> {
  const donors = await getConsentingDonors();
  return donors.filter((donor) => donor.display_consent === "logo" && Boolean(donor.logo?.trim()));
}

/** Donors who consented to being named and supplied a quote (page 5.12). */
export async function getQuotableDonors(): Promise<Donor[]> {
  const donors = await getConsentingDonors();
  return donors.filter((donor) => Boolean(donor.quote?.trim()));
}

// ─── Story ────────────────────────────────────────────────────────────────────

/**
 * Stories cleared for publication.
 *
 * Two consent rules, both enforced here:
 *
 * 1. publication_consent must be true — filtered in the Firestore query.
 * 2. Spec 5.14 DATA: preferred_name, institution and photo may never render
 *    together unless consent_record_ref is populated. A story without a
 *    consent record is returned with institution and photo stripped rather
 *    than dropped entirely, so a consented quote is still publishable while
 *    the identifying combination is not. Stripping beats dropping because the
 *    alternative silently loses content the recipient did agree to share.
 */
export async function getPublishableStories(limit?: number): Promise<Story[]> {
  const db = await getAdminFirestore();
  if (!db) return [];

  try {
    const snapshot = await db
      .collection(FIREBASE_COLLECTIONS.laptopBankStories)
      .where("publication_consent", "==", true)
      .get();

    const stories = snapshot.docs.map((doc) => {
      const story = doc.data() as Story;
      if (story.consent_record_ref?.trim()) return story;
      return { ...story, institution: undefined, photo: undefined };
    });

    return typeof limit === "number" ? stories.slice(0, limit) : stories;
  } catch (error) {
    console.error("Laptop Bank stories read failed", error);
    return [];
  }
}

// ─── Dashboard Metrics ────────────────────────────────────────────────────────

const DASHBOARD_METRICS_DOC_ID = "current";

/**
 * The single Dashboard Metrics record, or null.
 *
 * Returns null — never a seeded object — when Firestore is unconfigured or the
 * record is missing. Spec §10: the stat band must be hidden, or show real
 * figures with a last-updated date; no zeros, no placeholders. Spec 5.11 DATA
 * also forbids querying the asset register live: this reads the CMS record
 * only.
 */
export async function getDashboardMetrics(): Promise<DashboardMetrics | null> {
  const db = await getAdminFirestore();
  if (!db) return null;

  try {
    const doc = await db
      .collection(FIREBASE_COLLECTIONS.laptopBankMetrics)
      .doc(DASHBOARD_METRICS_DOC_ID)
      .get();
    if (!doc.exists) return null;
    return doc.data() as DashboardMetrics;
  } catch (error) {
    console.error("Laptop Bank dashboard metrics read failed", error);
    return null;
  }
}

// ─── Document ─────────────────────────────────────────────────────────────────

export async function getLaptopBankDocuments(): Promise<LaptopBankDocument[]> {
  const db = await getAdminFirestore();
  if (!db) return seedDocuments;

  try {
    const snapshot = await db.collection(FIREBASE_COLLECTIONS.laptopBankDocuments).get();
    if (snapshot.empty) return seedDocuments;
    const stored = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as LaptopBankDocument);
    // Keep the seed's order, which is the order spec 5.10 lists the files in.
    const seedOrder = new Map(seedDocuments.map((document, index) => [document.id, index]));
    return stored.sort(
      (left, right) =>
        (seedOrder.get(left.id) ?? Number.MAX_SAFE_INTEGER) -
        (seedOrder.get(right.id) ?? Number.MAX_SAFE_INTEGER),
    );
  } catch (error) {
    console.error("Laptop Bank documents read failed", error);
    return seedDocuments;
  }
}

export async function getLaptopBankDocument(id: string): Promise<LaptopBankDocument | undefined> {
  return (await getLaptopBankDocuments()).find((document) => document.id === id);
}
