export type SitePageFamilyId = "who-we-are" | "what-we-do";

export type SitePageFamily = {
  id: SitePageFamilyId;
  /** Shown in the workspace breadcrumb. */
  label: string;
  /** Save endpoint; the record's slug is appended. */
  endpointBase: string;
  /** Public URL prefix; the record's slug is appended. */
  publicBase: string;
  /** Admin index this family's records are listed on. */
  adminIndex: string;
};

const FAMILIES = {
  "who-we-are": {
    id: "who-we-are",
    label: "Who We Are",
    endpointBase: "/api/admin/who-we-are-pages",
    publicBase: "/who-we-are",
    adminIndex: "/admin/who-we-are-pages",
  },
  "what-we-do": {
    id: "what-we-do",
    label: "What We Do",
    endpointBase: "/api/admin/what-we-do-pages",
    publicBase: "/what-we-do",
    adminIndex: "/admin/what-we-do-pages",
  },
} satisfies Record<SitePageFamilyId, SitePageFamily>;

export const SITE_PAGE_FAMILIES = FAMILIES;

export function findSitePageFamily(id: string): SitePageFamily | undefined {
  return (FAMILIES as Record<string, SitePageFamily>)[id];
}
