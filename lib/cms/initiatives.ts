import { applyOverrides } from "@/lib/cms/descriptors/page-overrides";
import { readSeedCollection } from "@/lib/cms/descriptors/seed-collections";
import { initiativeDescriptor } from "@/lib/content/cms-descriptors/seed-collections";
import {
  initiatives as seedInitiatives,
  whatWeDoOverviewContent as seedWhatWeDoOverviewContent,
} from "@/lib/content/site-config";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { toPlainData } from "@/lib/utils/plain";
import type { InitiativePage, WhatWeDoOverviewContent } from "@/types/content";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

const WHAT_WE_DO_OVERVIEW_DOC_ID = "what-we-do";

/**
 * The What We Do hub copy: its seed with stored overrides applied.
 *
 * `normalizeOverview` used to spread the stored document over the seed, which
 * carried a Firestore Timestamp into the React tree — the class of bug
 * verify:cms now checks for statically.
 */
export async function getCmsWhatWeDoOverview(): Promise<WhatWeDoOverviewContent> {
  const db = await getAdminFirestore();

  if (!db) {
    return seedWhatWeDoOverviewContent;
  }

  try {
    const doc = await db
      .collection(FIREBASE_COLLECTIONS.siteContent)
      .doc(WHAT_WE_DO_OVERVIEW_DOC_ID)
      .get();

    if (!doc.exists) {
      return seedWhatWeDoOverviewContent;
    }

    return applyOverrides(
      seedWhatWeDoOverviewContent as unknown as Record<string, unknown>,
      toPlainData((doc.data() ?? {}) as Record<string, unknown>),
    ) as unknown as WhatWeDoOverviewContent;
  } catch (error) {
    console.error("Firestore What We Do overview read failed. Falling back to seed content.", error);
    return seedWhatWeDoOverviewContent;
  }
}

/**
 * The initiatives: the eight the site ships, with any stored edits applied.
 *
 * `normalizeInitiative` used to spread a stored document over its seed and
 * shallow-merge `sectionContent`, which meant a stored value of the wrong type
 * reached the page and a nested key not in `sectionContent` was lost. The
 * merge in lib/cms/descriptors/page-overrides.ts does neither, and it walks
 * the whole structure rather than one hand-listed level of it.
 */
export async function getCmsInitiatives(): Promise<InitiativePage[]> {
  const items = await readSeedCollection<InitiativePage>(initiativeDescriptor);
  return items.length ? items : seedInitiatives;
}

export async function getCmsInitiativeBySlug(slug: string): Promise<InitiativePage | undefined> {
  const initiatives = await getCmsInitiatives();
  return initiatives.find((initiative) => initiative.slug === slug);
}
