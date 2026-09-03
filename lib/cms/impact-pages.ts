import { applyOverrides } from "@/lib/cms/descriptors/page-overrides";
import {
  impactOverviewContent,
  impactReportsContent,
  impactSdgsContent,
  impactTestimonialsContent,
} from "@/lib/content/impact-config";
import { getAdminFirestore } from "@/lib/firebase/admin";
import type {
  ImpactOverviewContent,
  ImpactReportsContent,
  ImpactSdgsContent,
  ImpactTestimonialsContent,
} from "@/types/content";
import { toPlainData } from "@/lib/utils/plain";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

export const IMPACT_PAGE_SLUGS = ["overview", "reports", "testimonials", "sdgs"] as const;

export type ImpactPageSlug = (typeof IMPACT_PAGE_SLUGS)[number];

export type ImpactPageContentMap = {
  overview: ImpactOverviewContent;
  reports: ImpactReportsContent;
  testimonials: ImpactTestimonialsContent;
  sdgs: ImpactSdgsContent;
};

export type ImpactPageContent = ImpactPageContentMap[ImpactPageSlug];

const seedImpactPages: ImpactPageContentMap = {
  overview: impactOverviewContent,
  reports: impactReportsContent,
  testimonials: impactTestimonialsContent,
  sdgs: impactSdgsContent,
};

export const impactPageLabels: Record<ImpactPageSlug, string> = {
  overview: "Impact overview",
  reports: "Impact reports",
  testimonials: "Impact testimonials",
  sdgs: "UN SDGs",
};

export const impactPagePreviewPaths: Record<ImpactPageSlug, string> = {
  overview: "/our-impact",
  reports: "/our-impact/reports",
  testimonials: "/our-impact/testimonials",
  sdgs: "/our-impact/sdgs",
};

export function isImpactPageSlug(value: string): value is ImpactPageSlug {
  return IMPACT_PAGE_SLUGS.includes(value as ImpactPageSlug);
}

/**
 * Merges stored overrides over the seed.
 *
 * Routed through the shared merger rather than a spread, which fixes a leak
 * this file had: `{ ...fallback, ...data }` carried the stored `updatedAt`
 * Timestamp straight through, and a Timestamp reaching a Client Component logs
 * an error on every prerender while still exiting 0. It went unnoticed because
 * the scan that found the same bug in lib/cms/partnerships.ts only covered
 * readers taking no arguments, and this one takes a slug.
 *
 * The merger only accepts keys the seed already has, so `updatedAt` is dropped
 * without needing a denylist, and it understands both the flat-path keys the
 * generated editor writes and the whole-value keys the old form wrote — there
 * are 21 of the latter stored against `overview` today.
 */
function normalizeObject<T extends object>(fallback: T, data: Record<string, unknown> | undefined): T {
  return applyOverrides(
    fallback as unknown as Record<string, unknown>,
    toPlainData((data ?? {}) as Record<string, unknown>),
  ) as unknown as T;
}

export async function getCmsImpactPage<Slug extends ImpactPageSlug>(
  slug: Slug,
): Promise<ImpactPageContentMap[Slug]> {
  const fallback = seedImpactPages[slug];
  const db = await getAdminFirestore();

  if (!db) {
    return fallback;
  }

  try {
    const doc = await db.collection(FIREBASE_COLLECTIONS.impactPages).doc(slug).get();

    if (!doc.exists) {
      return fallback;
    }

    return normalizeObject(fallback, doc.data() ?? {});
  } catch (error) {
    console.error("Impact page read failed. Falling back to seed content.", error);
    return fallback;
  }
}

export function getSeedImpactPage<Slug extends ImpactPageSlug>(slug: Slug): ImpactPageContentMap[Slug] {
  return seedImpactPages[slug];
}

export async function saveCmsImpactPage<Slug extends ImpactPageSlug>(
  slug: Slug,
  payload: Partial<ImpactPageContentMap[Slug]>,
) {
  const db = await getAdminFirestore();

  if (!db) {
    return { configured: false, written: false } as const;
  }

  const { FieldValue } = await import("firebase-admin/firestore");
  await db.collection(FIREBASE_COLLECTIONS.impactPages).doc(slug).set(
    {
      ...(payload as Record<string, unknown>),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  return { configured: true, written: true, id: slug } as const;
}
