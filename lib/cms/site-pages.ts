import {
  careersHub,
  partnersHub,
  teamHub,
  testimonialsHub,
  whoWeAreHub,
} from "@/lib/content/site-config";
import { getAdminFirestore } from "@/lib/firebase/admin";
import type { SitePage } from "@/types/content";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

const pageFallbacks: Record<string, SitePage> = {
  "who-we-are": whoWeAreHub,
  team: teamHub,
  partners: partnersHub,
  careers: careersHub,
  testimonials: testimonialsHub,
};

function asString(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function mergeSitePage(fallback: SitePage, data: Record<string, unknown>): SitePage {
  const stats = Array.isArray(data.stats) ? data.stats : fallback.stats;
  const sections = Array.isArray(data.sections) ? data.sections : fallback.sections;
  const ctas = Array.isArray(data.ctas) ? data.ctas : fallback.ctas;
  const related = Array.isArray(data.related) ? data.related : fallback.related;

  return {
    slug: asString(data.slug) ?? fallback.slug,
    eyebrow: asString(data.eyebrow) ?? fallback.eyebrow,
    title: asString(data.title) ?? fallback.title,
    description: asString(data.description) ?? fallback.description,
    intro: asString(data.intro) ?? fallback.intro,
    stats,
    sections,
    ctas,
    related,
  };
}

export async function getCmsSitePage(slug: string): Promise<SitePage | null> {
  const fallback = pageFallbacks[slug];
  const db = await getAdminFirestore();

  if (!db) {
    return fallback ?? null;
  }

  try {
    const directDoc = await db.collection(FIREBASE_COLLECTIONS.siteContent).doc(slug).get();

    if (directDoc.exists) {
      return mergeSitePage(fallback ?? whoWeAreHub, directDoc.data() ?? {});
    }

    const slugMatch = await db
      .collection(FIREBASE_COLLECTIONS.siteContent)
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (slugMatch.empty) {
      return fallback ?? null;
    }

    return mergeSitePage(fallback ?? whoWeAreHub, slugMatch.docs[0].data());
  } catch (error) {
    console.error("Firestore site-content read failed. Falling back to seed content.", error);
    return fallback ?? null;
  }
}
