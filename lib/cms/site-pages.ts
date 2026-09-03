import { applyOverrides } from "@/lib/cms/descriptors/page-overrides";
import {
  applyForTrainingHub,
  careersHub,
  howItWorksHub,
  initiatives,
  partnersHub,
  teamHub,
  testimonialsHub,
  trainingCoursesHub,
  whoCanApplyHub,
  whoWeAreHub,
} from "@/lib/content/site-config";
import { getAdminFirestore } from "@/lib/firebase/admin";
import type { DynamicSitePagePayload, SitePagePayload } from "@/lib/utils/validators";
import type { DynamicSitePage, DynamicSitePageStatus, SitePage } from "@/types/content";
import { toPlainData } from "@/lib/utils/plain";
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

const WHO_WE_ARE_DYNAMIC_PARENT = "who-we-are";
const WHO_WE_ARE_DYNAMIC_TYPE = "whoWeAreDynamicPage";
const RESERVED_WHO_WE_ARE_SLUGS = new Set(["team", "partners", "careers"]);
const WHAT_WE_DO_DYNAMIC_PARENT = "what-we-do";
const WHAT_WE_DO_DYNAMIC_TYPE = "whatWeDoDynamicPage";
const RESERVED_WHAT_WE_DO_SLUGS = new Set(initiatives.map((initiative) => initiative.slug));

function asString(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

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
  "principlesImage",
  "principlesImageAlt",
  "highlightsEyebrow",
  "exploreEyebrow",
  "exploreTitle",
  "exploreDescription",
  "processEyebrow",
  "processTitle",
  "processDescription",
  "nextStepEyebrow",
  "nextStepTitle",
  "nextStepDescription",
] as const satisfies readonly (keyof SitePage)[];

/**
 * Merges a stored document over a page shape, field by field.
 *
 * KEPT ONLY FOR THE DYNAMIC PAGES, and the distinction is the point. The eight
 * seed-backed site pages have real shipped copy behind them, so an empty
 * stored value there means "not overridden" and `applyOverrides` is right. A
 * dynamic page has no shipped copy at all — its fallback is an empty template
 * — so an empty value is a real answer from whoever authored the page, and an
 * empty stats array means the page has no stats rather than "use the blank row
 * from the template".
 */
function mergeSitePage(fallback: SitePage, data: Record<string, unknown>): SitePage {
  const stats = Array.isArray(data.stats) ? data.stats : fallback.stats;
  const sections = Array.isArray(data.sections) ? data.sections : fallback.sections;
  const ctas = Array.isArray(data.ctas) ? data.ctas : fallback.ctas;
  const related = Array.isArray(data.related) ? data.related : fallback.related;
  const courses = Array.isArray(data.courses) ? data.courses : fallback.courses;
  const cohorts = Array.isArray(data.cohorts) ? data.cohorts : fallback.cohorts;
  const process = Array.isArray(data.process) ? data.process : fallback.process;
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
    cohorts,
    process,
    ...optionalFields,
  };
}

function emptyDynamicWhoWeArePage(slug = ""): DynamicSitePage {
  return {
    id: slug,
    parentSlug: WHO_WE_ARE_DYNAMIC_PARENT,
    slug,
    eyebrow: "Who We Are",
    title: "",
    description: "",
    intro: "",
    heroImage: "",
    stats: [
      {
        value: "",
        label: "",
        description: "",
      },
    ],
    sections: [
      {
        title: "",
        body: "",
        bullets: [],
      },
    ],
    ctas: [],
    related: [],
    status: "draft",
    order: 0,
  };
}

function emptyDynamicWhatWeDoPage(slug = ""): DynamicSitePage {
  return {
    id: slug,
    parentSlug: WHAT_WE_DO_DYNAMIC_PARENT,
    slug,
    eyebrow: "What We Do",
    title: "",
    description: "",
    intro: "",
    heroImage: "",
    stats: [
      {
        value: "",
        label: "",
        description: "",
      },
    ],
    sections: [
      {
        title: "",
        body: "",
        bullets: [],
      },
    ],
    ctas: [],
    related: [],
    status: "draft",
    order: 0,
  };
}

function normalizeStatus(value: unknown): DynamicSitePageStatus {
  return value === "published" || value === "archived" || value === "draft" ? value : "draft";
}

function normalizeDynamicSitePage(id: string, data: Record<string, unknown>): DynamicSitePage {
  const fallback = emptyDynamicWhoWeArePage(asString(data.slug) ?? id);
  const page = mergeSitePage(fallback, data);

  return {
    ...page,
    id,
    parentSlug: asString(data.parentSlug) ?? WHO_WE_ARE_DYNAMIC_PARENT,
    status: normalizeStatus(data.status),
    order: typeof data.order === "number" ? data.order : 0,
  };
}

function sortDynamicPages(pages: DynamicSitePage[]) {
  return [...pages].sort((left, right) => {
    const order = left.order - right.order;
    if (order !== 0) {
      return order;
    }

    return left.title.localeCompare(right.title);
  });
}

/**
 * One of the eight seed-backed site pages: its seed with stored overrides
 * applied.
 *
 * This used to be `mergeSitePage`, which rebuilt the page field by field with
 * `asString(data.x) ?? fallback.x` and took any stored array wholesale. Two
 * things went wrong with that, and both were live:
 *
 *   - An EMPTY stored value won. `siteContent/apply-for-training` holds
 *     `intro: ""`, written by a form that submitted every field whether or not
 *     it had been touched, and the live page therefore had no introduction.
 *     `applyOverrides` treats empty as "not overridden", which is the rule
 *     every other page in this CMS already follows.
 *   - An array of the wrong shape was taken as-is. The merge now refuses a
 *     value whose shape does not match the seed's, which is the type safety
 *     the field-by-field version was providing and the reason it looked
 *     unsafe to replace.
 *
 * A key the seed does not declare is dropped, which is what keeps `updatedAt`
 * out of the React tree. So a field the CMS should be able to set has to exist
 * in the seed object — `courses` does not, and a stored `courses: []` is
 * consequently ignored rather than published as an empty catalogue.
 */
export async function getCmsSitePage(slug: string): Promise<SitePage | null> {
  const fallback = pageFallbacks[slug];

  if (!fallback) {
    return null;
  }

  const db = await getAdminFirestore();

  if (!db) {
    return fallback;
  }

  const merge = (data: Record<string, unknown>) =>
    applyOverrides(fallback as unknown as Record<string, unknown>, toPlainData(data)) as unknown as SitePage;

  try {
    const directDoc = await db.collection(FIREBASE_COLLECTIONS.siteContent).doc(slug).get();

    if (directDoc.exists) {
      return merge((directDoc.data() ?? {}) as Record<string, unknown>);
    }

    // A document whose id is not its slug: written before ids were fixed.
    const slugMatch = await db
      .collection(FIREBASE_COLLECTIONS.siteContent)
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (slugMatch.empty) {
      return fallback;
    }

    return merge((slugMatch.docs[0].data() ?? {}) as Record<string, unknown>);
  } catch (error) {
    console.error("Firestore site-content read failed. Falling back to seed content.", error);
    return fallback;
  }
}

export function getEmptyWhoWeAreDynamicPage(slug = ""): DynamicSitePage {
  return emptyDynamicWhoWeArePage(slug);
}

export function getEmptyWhatWeDoDynamicPage(slug = ""): DynamicSitePage {
  return emptyDynamicWhatWeDoPage(slug);
}

export function isReservedWhoWeAreSlug(slug: string) {
  return RESERVED_WHO_WE_ARE_SLUGS.has(slug);
}

export function isReservedWhatWeDoSlug(slug: string) {
  return RESERVED_WHAT_WE_DO_SLUGS.has(slug);
}

export async function getCmsWhoWeAreDynamicPages(
  includeUnpublished = false,
): Promise<DynamicSitePage[]> {
  const db = await getAdminFirestore();

  if (!db) {
    return [];
  }

  try {
    const snapshot = await db
      .collection(FIREBASE_COLLECTIONS.siteContent)
      .where("parentSlug", "==", WHO_WE_ARE_DYNAMIC_PARENT)
      .get();

    let pages = snapshot.docs
      .map((doc) => normalizeDynamicSitePage(doc.id, doc.data() ?? {}))
      .filter((page) => page.parentSlug === WHO_WE_ARE_DYNAMIC_PARENT);

    pages = pages.filter((page) => !RESERVED_WHO_WE_ARE_SLUGS.has(page.slug));

    if (!includeUnpublished) {
      pages = pages.filter((page) => page.status === "published");
    }

    return sortDynamicPages(pages);
  } catch (error) {
    console.error("Firestore Who We Are dynamic-page read failed.", error);
    return [];
  }
}

export async function getCmsWhatWeDoDynamicPages(
  includeUnpublished = false,
): Promise<DynamicSitePage[]> {
  const db = await getAdminFirestore();

  if (!db) {
    return [];
  }

  try {
    const snapshot = await db
      .collection(FIREBASE_COLLECTIONS.siteContent)
      .where("parentSlug", "==", WHAT_WE_DO_DYNAMIC_PARENT)
      .get();

    let pages = snapshot.docs
      .map((doc) => normalizeDynamicSitePage(doc.id, doc.data() ?? {}))
      .filter((page) => page.parentSlug === WHAT_WE_DO_DYNAMIC_PARENT);

    pages = pages.filter((page) => !RESERVED_WHAT_WE_DO_SLUGS.has(page.slug));

    if (!includeUnpublished) {
      pages = pages.filter((page) => page.status === "published");
    }

    return sortDynamicPages(pages);
  } catch (error) {
    console.error("Firestore What We Do dynamic-page read failed.", error);
    return [];
  }
}

export async function getCmsWhoWeAreDynamicPageBySlug(
  slug: string,
  includeUnpublished = false,
): Promise<DynamicSitePage | null> {
  if (RESERVED_WHO_WE_ARE_SLUGS.has(slug)) {
    return null;
  }

  const db = await getAdminFirestore();

  if (!db) {
    return null;
  }

  try {
    const doc = await db
      .collection(FIREBASE_COLLECTIONS.siteContent)
      .doc(`who-we-are-${slug}`)
      .get();

    if (!doc.exists) {
      return null;
    }

    const page = normalizeDynamicSitePage(doc.id, doc.data() ?? {});

    if (!includeUnpublished && page.status !== "published") {
      return null;
    }

    return page;
  } catch (error) {
    console.error("Firestore Who We Are dynamic-page lookup failed.", error);
    return null;
  }
}

export async function getCmsWhatWeDoDynamicPageBySlug(
  slug: string,
  includeUnpublished = false,
): Promise<DynamicSitePage | null> {
  if (RESERVED_WHAT_WE_DO_SLUGS.has(slug)) {
    return null;
  }

  const db = await getAdminFirestore();

  if (!db) {
    return null;
  }

  try {
    const doc = await db
      .collection(FIREBASE_COLLECTIONS.siteContent)
      .doc(`what-we-do-${slug}`)
      .get();

    if (!doc.exists) {
      return null;
    }

    const page = normalizeDynamicSitePage(doc.id, doc.data() ?? {});

    if (!includeUnpublished && page.status !== "published") {
      return null;
    }

    return page;
  } catch (error) {
    console.error("Firestore What We Do dynamic-page lookup failed.", error);
    return null;
  }
}

export async function saveCmsWhoWeAreDynamicPage(
  payload: DynamicSitePagePayload,
): Promise<CmsWriteResult> {
  const db = await getAdminFirestore();

  if (!db) {
    return {
      configured: false,
      written: false,
    };
  }

  const { FieldValue } = await import("firebase-admin/firestore");
  const id = `who-we-are-${payload.slug}`;

  await db.collection(FIREBASE_COLLECTIONS.siteContent).doc(id).set(
    {
      ...payload,
      parentSlug: WHO_WE_ARE_DYNAMIC_PARENT,
      type: WHO_WE_ARE_DYNAMIC_TYPE,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  return {
    configured: true,
    written: true,
    id,
  };
}

export async function saveCmsWhatWeDoDynamicPage(
  payload: DynamicSitePagePayload,
): Promise<CmsWriteResult> {
  const db = await getAdminFirestore();

  if (!db) {
    return {
      configured: false,
      written: false,
    };
  }

  const { FieldValue } = await import("firebase-admin/firestore");
  const id = `what-we-do-${payload.slug}`;

  await db.collection(FIREBASE_COLLECTIONS.siteContent).doc(id).set(
    {
      ...payload,
      parentSlug: WHAT_WE_DO_DYNAMIC_PARENT,
      type: WHAT_WE_DO_DYNAMIC_TYPE,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  return {
    configured: true,
    written: true,
    id,
  };
}

export async function deleteCmsWhoWeAreDynamicPage(slug: string): Promise<CmsWriteResult> {
  const db = await getAdminFirestore();

  if (!db) {
    return {
      configured: false,
      written: false,
    };
  }

  await db.collection(FIREBASE_COLLECTIONS.siteContent).doc(`who-we-are-${slug}`).delete();

  return {
    configured: true,
    written: true,
    id: `who-we-are-${slug}`,
  };
}

export async function deleteCmsWhatWeDoDynamicPage(slug: string): Promise<CmsWriteResult> {
  const db = await getAdminFirestore();

  if (!db) {
    return {
      configured: false,
      written: false,
    };
  }

  await db.collection(FIREBASE_COLLECTIONS.siteContent).doc(`what-we-do-${slug}`).delete();

  return {
    configured: true,
    written: true,
    id: `what-we-do-${slug}`,
  };
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
