import { organisationOverviewContent as seedOverview, organisationServices as seedServices } from "@/lib/content/organisation-config";
import { applyOverrides } from "@/lib/cms/descriptors/page-overrides";
import { getAdminFirestore } from "@/lib/firebase/admin";
import type { OrganisationOverviewContent, OrganisationServicePage } from "@/types/content";
import { toPlainData } from "@/lib/utils/plain";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

const OVERVIEW_ID = "_overview";

/**
 * Merges stored overrides over the seed.
 *
 * Routed through the shared merger rather than a spread. `{ ...fallback,
 * ...data }` carries a stored `updatedAt` Timestamp straight through, and a
 * Timestamp reaching a Client Component logs an error on every prerender while
 * the build still exits 0 — easy to ship, easy to miss. The same bug was found
 * and fixed in lib/cms/partnerships.ts and lib/cms/impact-pages.ts.
 *
 * The merger only accepts keys the seed already has, so stored plumbing is
 * dropped without a denylist, and it understands both the flat-path keys the
 * generated editor writes and the whole-value keys the old forms wrote.
 */
function merge<T extends object>(fallback: T, data?: Record<string, unknown>): T {
  return applyOverrides(
    fallback as unknown as Record<string, unknown>,
    toPlainData((data ?? {}) as Record<string, unknown>),
  ) as unknown as T;
}

export async function getCmsOrganisationOverview(): Promise<OrganisationOverviewContent> {
  const db = await getAdminFirestore();
  if (!db) return seedOverview;
  try {
    const doc = await db.collection(FIREBASE_COLLECTIONS.forOrganisations).doc(OVERVIEW_ID).get();
    return doc.exists ? merge(seedOverview, doc.data()) : seedOverview;
  } catch (error) {
    console.error("Organisation overview read failed. Falling back to seed.", error);
    return seedOverview;
  }
}

export async function getCmsOrganisationServices(): Promise<OrganisationServicePage[]> {
  const db = await getAdminFirestore();
  if (!db) return seedServices;
  try {
    const snapshot = await db.collection(FIREBASE_COLLECTIONS.forOrganisations).get();
    const records = new Map(snapshot.docs.filter((doc) => doc.id !== OVERVIEW_ID).map((doc) => [doc.id, doc.data()]));
    return seedServices.map((service) => merge(service, records.get(service.slug)));
  } catch (error) {
    console.error("Organisation services read failed. Falling back to seed.", error);
    return seedServices;
  }
}

export async function getCmsOrganisationService(slug: string): Promise<OrganisationServicePage | undefined> {
  const fallback = seedServices.find((service) => service.slug === slug);
  if (!fallback) return undefined;
  const db = await getAdminFirestore();
  if (!db) return fallback;
  try {
    const doc = await db.collection(FIREBASE_COLLECTIONS.forOrganisations).doc(slug).get();
    return doc.exists ? merge(fallback, doc.data()) : fallback;
  } catch (error) {
    console.error("Organisation service read failed. Falling back to seed.", error);
    return fallback;
  }
}

async function save(id: string, payload: object) {
  const db = await getAdminFirestore();
  if (!db) return { configured: false, written: false } as const;
  const { FieldValue } = await import("firebase-admin/firestore");
  await db.collection(FIREBASE_COLLECTIONS.forOrganisations).doc(id).set(
    { ...payload, updatedAt: FieldValue.serverTimestamp() },
    { merge: false },
  );
  return { configured: true, written: true, id } as const;
}

export const saveCmsOrganisationOverview = (payload: OrganisationOverviewContent) => save(OVERVIEW_ID, payload);
export const saveCmsOrganisationService = (slug: string, payload: OrganisationServicePage) => save(slug, { ...payload, slug });
