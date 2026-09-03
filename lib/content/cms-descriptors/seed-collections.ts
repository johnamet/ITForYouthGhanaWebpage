import type { ContentTypeDescriptor, SeedCollectionRecord } from "@/lib/cms/descriptors/types";
import { partnershipTracks } from "@/lib/content/partnership-config";
import { departments, initiatives } from "@/lib/content/site-config";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

/**
 * Descriptors for the content whose RECORDS live in code and whose EDITS live
 * in Firestore: the eight departments, the eight initiatives and the five
 * partnership tracks.
 *
 * These were the last three content types on hand-written forms, and they were
 * left there for a reason worth keeping in mind while reading this file. They
 * are not CMS-owned lists — they are the organisation's structure, rendered
 * whether or not anyone has ever opened the admin, and Firestore held no
 * document for any department or initiative at all. A plain collection editor
 * pointed at them would have listed eight departments as none.
 *
 * See lib/cms/descriptors/seed-collections.ts for how the shape works. The
 * three things to know when adding a record here:
 *
 *   - The seed is the source of WHICH records exist. Adding one to
 *     site-config makes it editable with no migration.
 *   - Structural fields are declared by hand so they get the right control —
 *     a status is a three-option select, not a free-text box — and the seed
 *     walk skips every key declared here.
 *   - `allowCreate` is a real decision each type makes for itself, not a
 *     default. See the note on initiatives.
 */

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft — hidden from the public site" },
  { value: "published", label: "Published — live on the public site" },
  { value: "archived", label: "Archived — hidden, kept for reference" },
];

function seedRecords<T extends { slug: string; title: string }>(records: readonly T[]): SeedCollectionRecord[] {
  return records.map((record) => ({
    id: record.slug,
    title: record.title,
    seed: record as unknown as Record<string, unknown>,
  }));
}

export const departmentDescriptor: ContentTypeDescriptor = {
  key: "department",
  hub: "who-we-are",
  collection: FIREBASE_COLLECTIONS.departments,
  label: "Department",
  plural: "Departments",
  description: "The eight departments on /departments and their individual pages.",
  shape: "seed-collection",
  seedRecords: seedRecords(departments),
  titleField: "title",
  sortField: "order",
  idField: "slug",
  allowCreate: true,
  previewHref: "/departments",
  revalidatePaths: ["/departments", "/departments/[slug]"],
  guidance:
    "These eight departments ship with the site, so an unedited one shows the wording built into the code and needs no document here at all. Anything you change is stored as an override, and “Revert to shipped content” puts a department back to that original wording rather than deleting it. Setting the status to draft hides a department from /departments without losing what you wrote. A department you add here starts from the structure of an existing one, so work through every field before publishing it.",
  fields: [
    {
      key: "slug",
      label: "URL slug",
      kind: "text",
      required: true,
      createOnly: true,
      help: "Lowercase letters, numbers and hyphens. This becomes the page address and cannot be changed afterwards.",
    },
    {
      key: "status",
      label: "Status",
      kind: "select",
      required: true,
      options: STATUS_OPTIONS,
      defaultValue: "draft",
      help: "A new department starts as a draft so it can be written before it appears.",
    },
    { key: "featured", label: "Feature this department", kind: "boolean" },
    { key: "order", label: "Sort order", kind: "number", min: 0, help: "Lower numbers appear first." },
  ],
};

export const initiativeDescriptor: ContentTypeDescriptor = {
  key: "initiative",
  hub: "what-we-do",
  collection: FIREBASE_COLLECTIONS.initiatives,
  label: "Initiative",
  plural: "Initiatives",
  description: "The eight programmes on /what-we-do and their individual pages.",
  shape: "seed-collection",
  seedRecords: seedRecords(initiatives),
  titleField: "title",
  previewHref: "/what-we-do",
  revalidatePaths: ["/what-we-do", "/what-we-do/[slug]", "/"],
  /**
   * No new initiatives through the admin, on purpose.
   *
   * An initiative is a programme with its own imagery, its own place in the
   * navigation and its own route. One added through this form would be a page
   * nothing links to, carrying another programme's photographs. Adding it to
   * the seed in site-config is a one-line change that then makes it editable
   * here — which is the right order for something the site is structured
   * around.
   */
  allowCreate: false,
  guidance:
    "The eight initiatives ship with the site: an unedited one shows the wording built into the code, and “Revert to shipped content” puts it back to that. New initiatives are added in code rather than here, because each one needs its own imagery and its place in the navigation. Every heading, section, objective and card on the initiative's page is editable below.",
  fields: [],
};

export const partnershipTrackDescriptor: ContentTypeDescriptor = {
  key: "partnership-track",
  hub: "partner-with-us",
  collection: FIREBASE_COLLECTIONS.partnerships,
  label: "Partnership track",
  plural: "Partnership tracks",
  description: "The five partner routes on /partner-with-us and their individual pages.",
  shape: "seed-collection",
  seedRecords: seedRecords(partnershipTracks),
  titleField: "title",
  idField: "slug",
  allowCreate: true,
  /**
   * The overview shares this collection and is edited as a page singleton
   * (`page-partner-with-us`), so it must not appear here as a sixth track.
   */
  excludeDocIds: ["_overview"],
  previewHref: "/partner-with-us",
  revalidatePaths: ["/partner-with-us", "/partner-with-us/[slug]"],
  guidance:
    "The five tracks ship with the site, so an unedited one shows the wording built into the code and “Revert to shipped content” puts it back to that. A track has no draft state: one you add here appears on /partner-with-us as soon as it is saved, so fill in the wording before you save rather than after. The headings and cards on the hub page itself are edited under Partner With Us overview.",
  fields: [
    {
      key: "slug",
      label: "URL slug",
      kind: "text",
      required: true,
      createOnly: true,
      help: "Lowercase letters, numbers and hyphens. This becomes the page address and cannot be changed afterwards.",
    },
  ],
};

export const SEED_COLLECTION_DESCRIPTORS: Record<string, ContentTypeDescriptor> = {
  department: departmentDescriptor,
  initiative: initiativeDescriptor,
  "partnership-track": partnershipTrackDescriptor,
};
