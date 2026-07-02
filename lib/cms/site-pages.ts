import {
  applyForTrainingHub,
  careersHub,
  howItWorksHub,
  partnersHub,
  teamHub,
  testimonialsHub,
  trainingCoursesHub,
  whoCanApplyHub,
  whoWeAreHub,
} from "@/lib/content/site-config";
import { getAdminFirestore } from "@/lib/firebase/admin";
import type { SitePagePayload } from "@/lib/utils/validators";
import type { SitePage } from "@/types/content";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

type CmsWriteResult = {
  configured: boolean;
  written: boolean;
  id?: string;
};

const pageFallbacks: Record<string, SitePage> = {
  "who-we-are": whoWeAreHub,
  "apply-for-training": applyForTrainingHub,
  "apply-for-training-who-can-apply": whoCanApplyHub,
  "apply-for-training-how-it-works": howItWorksHub,
  "apply-for-training-courses": trainingCoursesHub,
  team: teamHub,
  partners: partnersHub,
  careers: careersHub,
  testimonials: testimonialsHub,
};

const pageLabels: Record<string, string> = {
  "who-we-are": "Who We Are",
  "apply-for-training": "Apply for Training",
  "apply-for-training-who-can-apply": "Who Can Apply",
  "apply-for-training-how-it-works": "How It Works",
  "apply-for-training-courses": "Training Courses",
  team: "Team",
  partners: "Partners",
  careers: "Careers",
  testimonials: "Testimonials",
};

const optionalStringFields = [
  "heroImage",
  "overviewTitle",
  "overviewDescription",
  "operatingEyebrow",
  "operatingTitle",
  "operatingDescription",
  "principlesEyebrow",
  "principlesTitle",
  "principlesDescription",
  "principlesHeroEyebrow",
  "principlesHeroTitle",
  "exploreEyebrow",
  "exploreTitle",
  "exploreDescription",
] as const satisfies readonly (keyof SitePage)[];

function asString(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function mergeSitePage(fallback: SitePage, data: Record<string, unknown>): SitePage {
  const stats = Array.isArray(data.stats) ? data.stats : fallback.stats;
  const sections = Array.isArray(data.sections) ? data.sections : fallback.sections;
  const ctas = Array.isArray(data.ctas) ? data.ctas : fallback.ctas;
  const related = Array.isArray(data.related) ? data.related : fallback.related;
  const courses = Array.isArray(data.courses) ? data.courses : fallback.courses;
  const optionalFields = Object.fromEntries(
    optionalStringFields.map((field) => [field, asString(data[field]) ?? fallback[field]]),
  );

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
    courses,
    ...optionalFields,
  };
}

export async function getCmsSitePage(slug: string): Promise<SitePage | null> {
  const fallback = pageFallbacks[slug];

  if (!fallback) {
    return null;
  }

  const db = await getAdminFirestore();

  if (!db) {
    return fallback;
  }

  try {
    const directDoc = await db.collection(FIREBASE_COLLECTIONS.siteContent).doc(slug).get();

    if (directDoc.exists) {
      return mergeSitePage(fallback, directDoc.data() ?? {});
    }

    const slugMatch = await db
      .collection(FIREBASE_COLLECTIONS.siteContent)
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (slugMatch.empty) {
      return fallback;
    }

    return mergeSitePage(fallback, slugMatch.docs[0].data());
  } catch (error) {
    console.error("Firestore site-content read failed. Falling back to seed content.", error);
    return fallback;
  }
}

export async function getCmsWhoWeArePage(): Promise<SitePage> {
  return (await getCmsSitePage("who-we-are")) ?? whoWeAreHub;
}

export async function getCmsApplyForTrainingPage(): Promise<SitePage> {
  return (await getCmsSitePage("apply-for-training")) ?? applyForTrainingHub;
}

export async function getCmsTrainingWhoCanApplyPage(): Promise<SitePage> {
  return (await getCmsSitePage("apply-for-training-who-can-apply")) ?? whoCanApplyHub;
}

export async function getCmsTrainingHowItWorksPage(): Promise<SitePage> {
  return (await getCmsSitePage("apply-for-training-how-it-works")) ?? howItWorksHub;
}

export async function getCmsTrainingCoursesPage(): Promise<SitePage> {
  return (await getCmsSitePage("apply-for-training-courses")) ?? trainingCoursesHub;
}

export function isCmsSitePageSlug(slug: string) {
  return slug in pageFallbacks;
}

export function getCmsSitePageLabel(slug: string) {
  return pageLabels[slug] ?? "Site page";
}

export async function saveCmsSitePage(
  slug: string,
  payload: SitePagePayload,
): Promise<CmsWriteResult> {
  const db = await getAdminFirestore();

  if (!db) {
    return {
      configured: false,
      written: false,
    };
  }

  const { FieldValue } = await import("firebase-admin/firestore");
  await db.collection(FIREBASE_COLLECTIONS.siteContent).doc(slug).set(
    {
      ...payload,
      slug,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  return {
    configured: true,
    written: true,
    id: slug,
  };
}
