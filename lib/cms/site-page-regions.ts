import type { EditableSitePage } from "@/types/content";

export type SitePageRegionId =
  | "hero"
  | "ctas"
  | "stats"
  | "body"
  | "related"
  | "settings"
  | "other";

export type SitePageRegion = {
  id: SitePageRegionId;
  label: string;
  description: string;
  /**
   * The fields this region owns. Every field SitePageForm exposes belongs to
   * exactly one region, so splitting the form loses no editing capability.
   */
  fields: readonly (keyof EditableSitePage)[];
  /**
   * DOM id of the block this region renders as in the preview, or null when
   * ContentPage renders nothing for it.
   */
  previewTarget: string | null;
  /** Position in ContentPage's render order; regions that render nothing sort last. */
  order: number;
};

const REGIONS = {
  hero: {
    id: "hero",
    label: "Hero",
    description: "The banner at the top of the page: label, title, summary and image.",
    fields: ["eyebrow", "title", "description", "intro", "heroImage"],
    previewTarget: "hero",
    order: 1,
  },
  ctas: {
    id: "ctas",
    label: "Calls to action",
    description: "Buttons shown inside the hero. The first is styled as the primary action.",
    fields: ["ctas"],
    // Not a mistake: ContentPage passes these to EditorialImageHero, so they
    // render inside the hero rather than as a block of their own.
    previewTarget: "hero",
    order: 2,
  },
  stats: {
    id: "stats",
    label: "Statistics",
    description: "The numbers block, and the label above it.",
    fields: ["stats", "highlightsEyebrow"],
    previewTarget: "stats",
    order: 3,
  },
  body: {
    id: "body",
    label: "Body sections",
    description: "The page's written sections, in order. Add, reorder and remove them here.",
    fields: ["sections"],
    previewTarget: "body",
    order: 4,
  },
  related: {
    id: "related",
    label: "Related pages",
    description: "Cards linking onward, and the heading above them.",
    fields: ["related", "exploreEyebrow", "exploreTitle", "exploreDescription"],
    previewTarget: "related",
    order: 5,
  },
  settings: {
    id: "settings",
    label: "Page settings",
    description: "URL slug, publish status and ordering. Changes the address, not the content.",
    fields: ["slug", "status", "order"],
    previewTarget: null,
    order: 6,
  },
  other: {
    id: "other",
    label: "Not shown on this page",
    description:
      "Fields this page template does not read. Editable because other templates use them.",
    fields: [
      "heroVideoUrl",
      "heroVideoThumbnail",
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
      "processEyebrow",
      "processTitle",
      "processDescription",
      "nextStepEyebrow",
      "nextStepTitle",
      "nextStepDescription",
      "cohorts",
      "process",
    ],
    previewTarget: null,
    order: 7,
  },
} satisfies Record<SitePageRegionId, SitePageRegion>;

export const sitePageRegionsById = REGIONS;

export const sitePageRegions: SitePageRegion[] = Object.values(REGIONS).sort(
  (left, right) => left.order - right.order,
);

export const DEFAULT_SITE_PAGE_REGION_ID = "hero" as const;

export function findSitePageRegion(
  id: string | null | undefined,
): SitePageRegion {
  return (
    sitePageRegions.find((region) => region.id === id) ??
    REGIONS[DEFAULT_SITE_PAGE_REGION_ID]
  );
}

/** Which region owns a field, for attributing a validation error to a region. */
export function regionForField(field: string): SitePageRegion | undefined {
  return sitePageRegions.find((region) =>
    (region.fields as readonly string[]).includes(field),
  );
}

function isBlank(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (typeof value === "number") return false;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

// ContentPage's own per-item filters, mirrored so this module agrees with what
// actually renders. An array-length test is NOT equivalent: ContentPage drops
// blank items first, so a single empty row — which every "Add" button creates —
// renders nothing while the array is length 1. Cited by line; if a filter in
// content-page.tsx changes, change its twin here.
const meaningfulStats = (page: EditableSitePage) =>
  // content-page.tsx:17
  page.stats.filter(
    (stat) => stat.value.trim() || stat.label.trim() || stat.description?.trim(),
  );

const meaningfulSections = (page: EditableSitePage) =>
  // content-page.tsx:18-20
  page.sections.filter(
    (section) =>
      section.title.trim() ||
      section.body.trim() ||
      section.bullets?.some((bullet) => bullet.trim()),
  );

const meaningfulCtas = (page: EditableSitePage) =>
  // content-page.tsx:21
  page.ctas.filter((cta) => cta.label.trim() && cta.href.trim());

const meaningfulRelated = (page: EditableSitePage) =>
  // content-page.tsx:22
  page.related.filter((card) => card.title.trim() && card.href.trim());

/**
 * Whether ContentPage renders the block a preview target names.
 *
 * This answers a different question from `isRegionEmpty` below, and conflating
 * the two is a bug: the hero block always renders even when every hero field is
 * blank, and CTAs have no block of their own at all. The preview canvas uses
 * THIS function to predict which children ContentPage produced, so it must
 * track the renderer exactly.
 */
export function doesTargetRender(
  target: string,
  page: EditableSitePage,
): boolean {
  switch (target) {
    // content-page.tsx:36-46 — EditorialImageHero is rendered unconditionally.
    case "hero":
      return true;
    // content-page.tsx:48
    case "stats":
      return meaningfulStats(page).length > 0;
    // content-page.tsx:50
    case "body":
      return meaningfulSections(page).length > 0;
    // content-page.tsx:80
    case "related":
      return meaningfulRelated(page).length > 0;
    default:
      return false;
  }
}

/**
 * Whether the editor has put anything meaningful in this region. Drives the
 * rail's "nothing added yet" state and nothing else — it deliberately does NOT
 * predict whether a block renders, which is `doesTargetRender`'s job.
 */
export function isRegionEmpty(
  region: SitePageRegion,
  page: EditableSitePage,
): boolean {
  switch (region.id) {
    case "ctas":
      return meaningfulCtas(page).length === 0;
    case "stats":
      return meaningfulStats(page).length === 0;
    case "body":
      return meaningfulSections(page).length === 0;
    case "related":
      return (
        meaningfulRelated(page).length === 0 &&
        isBlank(page.exploreEyebrow) &&
        isBlank(page.exploreTitle) &&
        isBlank(page.exploreDescription)
      );
    default:
      return region.fields.every((field) => isBlank(page[field]));
  }
}
