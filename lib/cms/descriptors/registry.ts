import type { ContentTypeDescriptor } from "@/lib/cms/descriptors/types";
import { PAGE_DESCRIPTORS } from "@/lib/content/cms-descriptors/pages";
import { RECORD_DESCRIPTORS } from "@/lib/content/cms-descriptors/records";
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
  ...PAGE_DESCRIPTORS,
};

export const CMS_DESCRIPTOR_KEYS = Object.keys(CMS_DESCRIPTORS);

export function getDescriptor(key: string): ContentTypeDescriptor | undefined {
  return Object.prototype.hasOwnProperty.call(CMS_DESCRIPTORS, key)
    ? CMS_DESCRIPTORS[key]
    : undefined;
}
