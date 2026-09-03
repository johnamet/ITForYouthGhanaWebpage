import { applyOverrides } from "@/lib/cms/descriptors/page-overrides";
import { readSeedCollection, readSeedRecord } from "@/lib/cms/descriptors/seed-collections";
import { partnershipTrackDescriptor } from "@/lib/content/cms-descriptors/seed-collections";
import { partnershipOverviewContent as seedOverview, partnershipTracks as seedTracks } from "@/lib/content/partnership-config";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { toPlainData } from "@/lib/utils/plain";
import type { PartnershipOverviewContent, PartnershipTrackPage } from "@/types/content";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

const OVERVIEW_ID = "_overview";

/**
 * Merges stored fields over the seed.
 *
 * `toPlainData` is applied to the stored side because this reader feeds a page
 * that renders through Client Components, and a raw Firestore document carries
 * an `updatedAt` Timestamp. Spreading that through produced the "Only plain
 * objects can be passed to Client Components" error that Next logged twice on
 * every production build while still exiting 0.
 */
function normalizeObject<T extends object>(fallback: T, data: Record<string, unknown> | undefined): T {
  return applyOverrides(
    fallback as unknown as Record<string, unknown>,
    toPlainData((data ?? {}) as Record<string, unknown>),
  ) as unknown as T;
}

export async function getCmsPartnershipOverview(): Promise<PartnershipOverviewContent> {
  const db = await getAdminFirestore();
  if (!db) return seedOverview;
  try {
    const doc = await db.collection(FIREBASE_COLLECTIONS.partnerships).doc(OVERVIEW_ID).get();
    if (!doc.exists) return seedOverview;
    return normalizeObject(seedOverview, (doc.data() ?? {}) as Record<string, unknown>);
  } catch (e) {
    console.error("Partnership overview read failed. Falling back to seed.", e);
    return seedOverview;
  }
}

/**
 * The five partnership tracks the site ships, with any stored edits applied,
 * then any track added through the admin.
 *
 * The seed is the authoritative set here: these tracks are the programme, not
 * placeholder content. A stored document customises a track; it does not
 * decide which tracks exist. This file previously returned only the STORED
 * documents, so as soon as one track was edited the hub page listed one track
 * instead of five — the four unedited ones vanished, while their individual
 * pages kept working, which is what made it easy to miss. A seed-backed
 * collection makes that class of bug unrepresentable.
 */
export async function getCmsPartnershipTracks(): Promise<PartnershipTrackPage[]> {
  const tracks = await readSeedCollection<PartnershipTrackPage>(partnershipTrackDescriptor);
  return tracks.length ? tracks : seedTracks;
}

export async function getCmsPartnershipTrackBySlug(slug: string): Promise<PartnershipTrackPage | undefined> {
  return readSeedRecord<PartnershipTrackPage>(partnershipTrackDescriptor, slug);
}
