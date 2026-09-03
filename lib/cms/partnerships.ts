import { applyOverrides } from "@/lib/cms/descriptors/page-overrides";
import { partnershipOverviewContent as seedOverview, partnershipTracks as seedTracks } from "@/lib/content/partnership-config";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { toPlainData } from "@/lib/utils/plain";
import type { PartnershipOverviewContent, PartnershipTrackPage } from "@/types/content";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

const OVERVIEW_ID = "_overview";

/**
 * Merges stored fields over the seed.
 *
 * `toPlainData` is applied to the stored side because both readers below feed
 * pages that render through Client Components, and a raw Firestore document
 * carries an `updatedAt` Timestamp (written by the two updaters at the bottom
 * of this file). Spreading that through produced the "Only plain objects can
 * be passed to Client Components" error that Next logged twice on every
 * production build while still exiting 0.
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

function normalizeTrack(slug: string, data: Record<string, unknown> | undefined): PartnershipTrackPage {
  const fallback = seedTracks.find((t) => t.slug === slug) ?? seedTracks[0]!;
  return normalizeObject(fallback, data ?? {});
}

/**
 * The partnership tracks: the seeded set, with any stored document applied over
 * its matching track.
 *
 * THIS USED TO REPLACE THE SEED RATHER THAN OVERRIDE IT, and that was a live
 * content bug. The old version returned only the stored documents, so as soon
 * as one track was edited in the CMS the hub page listed one track instead of
 * five — the four unedited ones vanished. Their individual pages kept working,
 * because getCmsPartnershipTrackBySlug falls back per slug, which is what made
 * it easy to miss.
 *
 * The seed is the authoritative set here: these five tracks are the programme,
 * not placeholder content. A stored document customises a track; it does not
 * decide which tracks exist. (Contrast lib/cms/partners.ts, where the
 * collection genuinely is CMS-owned and replacing the seed is intended.)
 */
export async function getCmsPartnershipTracks(): Promise<PartnershipTrackPage[]> {
  const db = await getAdminFirestore();
  if (!db) return seedTracks;
  try {
    const snapshot = await db.collection(FIREBASE_COLLECTIONS.partnerships).get();
    const stored = new Map(
      snapshot.docs
        .filter((doc) => doc.id !== OVERVIEW_ID)
        .map((doc) => [doc.id, doc.data() as Record<string, unknown>]),
    );

    const tracks = seedTracks.map((track) =>
      stored.has(track.slug) ? normalizeTrack(track.slug, stored.get(track.slug)) : track,
    );

    // A stored document whose slug is not in the seed is a track added purely
    // through the CMS. Keep it, after the seeded ones.
    for (const [slug, data] of stored) {
      if (seedTracks.some((track) => track.slug === slug)) continue;
      tracks.push(normalizeTrack(slug, data));
    }

    return tracks;
  } catch (e) {
    console.error("Partnership tracks read failed. Falling back to seed.", e);
    return seedTracks;
  }
}

export async function getCmsPartnershipTrackBySlug(slug: string): Promise<PartnershipTrackPage | undefined> {
  const db = await getAdminFirestore();
  if (!db) return seedTracks.find((t) => t.slug === slug);
  try {
    const doc = await db.collection(FIREBASE_COLLECTIONS.partnerships).doc(slug).get();
    if (!doc.exists) return seedTracks.find((t) => t.slug === slug);
    return normalizeTrack(slug, doc.data() as Record<string, unknown>);
  } catch (e) {
    console.error("Partnership track read failed. Falling back to seed.", e);
    return seedTracks.find((t) => t.slug === slug);
  }
}

export async function saveCmsPartnershipTrack(slug: string, payload: Partial<PartnershipTrackPage>) {
  const db = await getAdminFirestore();
  if (!db) return { configured: false, written: false } as const;
  const { FieldValue } = await import("firebase-admin/firestore");
  await db.collection(FIREBASE_COLLECTIONS.partnerships).doc(slug).set(
    { slug, ...(payload as Record<string, unknown>), updatedAt: FieldValue.serverTimestamp() },
    { merge: true },
  );
  return { configured: true, written: true, id: slug } as const;
}

export async function deleteCmsPartnershipTrack(slug: string) {
  const db = await getAdminFirestore();
  if (!db) return { configured: false, written: false } as const;
  await db.collection(FIREBASE_COLLECTIONS.partnerships).doc(slug).delete();
  return { configured: true, written: true, id: slug } as const;
}

export async function saveCmsPartnershipOverview(payload: Partial<PartnershipOverviewContent>) {
  const db = await getAdminFirestore();
  if (!db) return { configured: false, written: false } as const;
  const { FieldValue } = await import("firebase-admin/firestore");
  await db.collection(FIREBASE_COLLECTIONS.partnerships).doc(OVERVIEW_ID).set(
    { ...(payload as Record<string, unknown>), updatedAt: FieldValue.serverTimestamp() },
    { merge: true },
  );
  return { configured: true, written: true, id: OVERVIEW_ID } as const;
}
