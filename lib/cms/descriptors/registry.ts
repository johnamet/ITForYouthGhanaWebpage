import type { ContentTypeDescriptor } from "@/lib/cms/descriptors/types";
import { PAGE_DESCRIPTORS } from "@/lib/content/cms-descriptors/pages";
import { RECORD_DESCRIPTORS } from "@/lib/content/cms-descriptors/records";
import { SEED_COLLECTION_DESCRIPTORS } from "@/lib/content/cms-descriptors/seed-collections";
import { LAPTOP_BANK_CONTENT_TYPES } from "@/lib/content/laptop-bank-admin-schema";

/**
 * Every descriptor-driven editor in the admin.
 *
 * One map, so the sidebar, the Content Explorer, the generic routes and
 * `verify:cms` all agree on what exists. A content type registered anywhere
 * else is a content type nobody can find: the Laptop Bank was initially
 * registered only in `adminNavigation`, which nothing renders, and stayed
 * invisible in the admin until someone went looking for it.
 *
 * Adding an area means adding its descriptors here and nothing else — the
 * routes at /admin/cms/[type], the API at /api/admin/cms/[type] and the
 * registry nodes in lib/content/admin-registry.ts are all derived from this.
 */
export const CMS_DESCRIPTORS: Record<string, ContentTypeDescriptor> = {
  ...LAPTOP_BANK_CONTENT_TYPES,
  ...RECORD_DESCRIPTORS,
  ...SEED_COLLECTION_DESCRIPTORS,
  ...PAGE_DESCRIPTORS,
};

/**
 * The source maps, for the duplicate-key check in scripts/verify-cms.ts.
 *
 * Merging four maps means a key defined twice silently loses one editor with
 * nothing to see: the Laptop Bank already has a `page-how-it-works`, and a
 * second one added elsewhere would simply replace it.
 */
export const CMS_DESCRIPTOR_SOURCES = {
  "laptop-bank": LAPTOP_BANK_CONTENT_TYPES,
  records: RECORD_DESCRIPTORS,
  "seed-collections": SEED_COLLECTION_DESCRIPTORS,
  pages: PAGE_DESCRIPTORS,
};

export const CMS_DESCRIPTOR_KEYS = Object.keys(CMS_DESCRIPTORS);

export function getDescriptor(key: string): ContentTypeDescriptor | undefined {
  return Object.prototype.hasOwnProperty.call(CMS_DESCRIPTORS, key)
    ? CMS_DESCRIPTORS[key]
    : undefined;
}
