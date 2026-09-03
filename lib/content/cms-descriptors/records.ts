import type { ContentTypeDescriptor } from "@/lib/cms/descriptors/types";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

/**
 * Descriptors for the flat record collections outside the Laptop Bank.
 *
 * Each one closes the same three gaps its hand-written form had: no audit
 * entry on write (fixed repo-wide separately, but these now get it by
 * construction), no numeric validation, and no guidance text telling an editor
 * what a field actually does on the public site.
 *
 * Field lists are taken from the zod schemas in lib/utils/validators.ts, which
 * are what the existing writers accepted — so a record saved through the
 * generic editor is shaped exactly like one saved through the old form.
 */

const TEAM_STATUS = [
  { value: "active", label: "Active — shown on the team page" },
  { value: "inactive", label: "Inactive — hidden from the team page" },
];

export const teamDescriptor: ContentTypeDescriptor = {
  key: "team",
  hub: "who-we-are",
  collection: FIREBASE_COLLECTIONS.team,
  label: "Team member",
  plural: "Team",
  description: "The people on /who-we-are/team, and the team section on the homepage.",
  shape: "collection",
  titleField: "name",
  sortField: "order",
  previewHref: "/who-we-are/team",
  revalidatePaths: ["/who-we-are/team", "/"],
  guidance:
    "Setting the status to inactive hides someone from the public page without deleting their record, which is what you want when a person leaves — deleting loses the biography you would need again if they return. A photograph URL that this site cannot load is dropped rather than shown broken, so if a portrait does not appear, check the URL is on an allowed host.",
  fields: [
    { key: "name", label: "Name", kind: "text", required: true },
    { key: "role", label: "Role", kind: "text", required: true },
    { key: "department", label: "Department", kind: "text", required: true },
    { key: "bio", label: "Biography", kind: "textarea", required: true, wide: true },
    { key: "photo", label: "Photograph URL", kind: "url" },
    { key: "email", label: "Email", kind: "text" },
    { key: "linkedin", label: "LinkedIn URL", kind: "url" },
    { key: "status", label: "Status", kind: "select", required: true, options: TEAM_STATUS, defaultValue: "active" },
    { key: "featured", label: "Feature on the homepage", kind: "boolean" },
    { key: "order", label: "Sort order", kind: "number", min: 0, help: "Lower numbers appear first." },
    { key: "departmentId", label: "Department id", kind: "text", help: "Optional. Links this person to a department record." },
    { key: "departmentSlug", label: "Department slug", kind: "text", help: "Optional. Used to link through to the department page." },
  ],
};

const JOB_TYPES = [
  { value: "full-time", label: "Full time" },
  { value: "part-time", label: "Part time" },
  { value: "contract", label: "Contract" },
  { value: "volunteer", label: "Volunteer" },
];

const JOB_STATUS = [
  { value: "draft", label: "Draft — not visible publicly" },
  { value: "published", label: "Published — open for applications" },
  { value: "closed", label: "Closed — shown as no longer accepting" },
];

export const jobDescriptor: ContentTypeDescriptor = {
  key: "job",
  hub: "who-we-are",
  collection: FIREBASE_COLLECTIONS.jobListings,
  label: "Job listing",
  plural: "Jobs",
  description: "The vacancies on /who-we-are/careers.",
  shape: "collection",
  titleField: "title",
  previewHref: "/who-we-are/careers",
  revalidatePaths: ["/who-we-are/careers"],
  guidance:
    "A listing is invisible publicly until its status is Published, so a half-written vacancy is safe to save. Move a filled role to Closed rather than deleting it: applicants who bookmarked the page then see that it went rather than a missing page. The closing date must be a real date in YYYY-MM-DD form — a date already past is accepted here but reads badly on the page, so update it or close the role.",
  fields: [
    { key: "title", label: "Role title", kind: "text", required: true },
    {
      key: "status",
      label: "Status",
      kind: "select",
      required: true,
      options: JOB_STATUS,
      consent: true,
      // No default: publishing is the decision this field exists to make.
      help: "Nothing appears on the careers page until this is Published.",
    },
    { key: "summary", label: "Summary", kind: "textarea", required: true, wide: true },
    { key: "team", label: "Team or department", kind: "text", required: true },
    { key: "location", label: "Location", kind: "text", required: true },
    { key: "type", label: "Type", kind: "select", required: true, options: JOB_TYPES, defaultValue: "full-time" },
    { key: "applyUrl", label: "Application URL", kind: "url" },
    { key: "closingDate", label: "Closing date", kind: "text", help: "YYYY-MM-DD." },
    { key: "featured", label: "Feature this role", kind: "boolean" },
  ],
};

export const partnerDescriptor: ContentTypeDescriptor = {
  key: "partner",
  hub: "who-we-are",
  collection: FIREBASE_COLLECTIONS.partners,
  label: "Partner",
  plural: "Partners",
  description: "The partner logos on /who-we-are/partners and the homepage logo row.",
  shape: "collection",
  titleField: "name",
  sortField: "order",
  previewHref: "/who-we-are/partners",
  revalidatePaths: ["/who-we-are/partners", "/"],
  guidance:
    "Record written permission before a logo goes up. A partner organisation's mark is their property, and Draft 1 of the Laptop Bank spec is explicit that this should be enforced by the system rather than by staff discipline: \"Do not display a logo until written permission is recorded.\" Note the permission flag below does not yet hide a logo on its own — it records the fact so the gate can be switched on deliberately rather than removing logos that are already live.",
  fields: [
    { key: "name", label: "Organisation name", kind: "text", required: true },
    {
      key: "permissionOnFile",
      label: "Written permission to use their logo is on file",
      kind: "boolean",
      consent: true,
      help: "Tick only when you have it in writing, and note where it is filed. This is the record that the organisation agreed.",
    },
    {
      key: "active",
      label: "Show this partner publicly",
      kind: "boolean",
      consent: true,
      // partnerSchema defaulted this to true, so a new record keeps that
      // behaviour. It is the permission flag above, not this, that should
      // start off — this one only controls whether an already-permitted
      // partner is currently shown.
      defaultValue: true,
      help: "Off hides the partner from every public page without deleting the record.",
    },
    { key: "logo", label: "Logo URL", kind: "url" },
    { key: "href", label: "Their website", kind: "url" },
    { key: "order", label: "Sort order", kind: "number", min: 0, help: "Lower numbers appear first." },
  ],
};

export const testimonialDescriptor: ContentTypeDescriptor = {
  key: "testimonial",
  hub: "our-impact",
  collection: FIREBASE_COLLECTIONS.testimonials,
  label: "Testimonial",
  plural: "Testimonials",
  description: "The quotes on /our-impact/testimonials and the homepage.",
  shape: "collection",
  titleField: "name",
  previewHref: "/our-impact/testimonials",
  revalidatePaths: ["/our-impact/testimonials", "/"],
  guidance:
    "Publish someone's words as they gave them, and only with their agreement — a quote attributed to a named person is a public statement about them, not just about the programme. Never edit a quote to read better. If you have no photograph, leave the avatar empty and give initials instead; a stock portrait attached to a real person's name is a misrepresentation.",
  fields: [
    { key: "name", label: "Name", kind: "text", required: true },
    {
      key: "active",
      label: "Show this testimonial publicly",
      kind: "boolean",
      consent: true,
      // testimonialSchema defaulted this to true.
      defaultValue: true,
      help: "Off hides it from every public page without deleting the record.",
    },
    { key: "quote", label: "Quote", kind: "textarea", required: true, wide: true, help: "Their words, unedited." },
    { key: "role", label: "Role", kind: "text", required: true },
    { key: "programme", label: "Programme", kind: "text" },
    { key: "year", label: "Year", kind: "text" },
    { key: "avatar", label: "Photograph URL", kind: "url" },
    { key: "initials", label: "Initials", kind: "text", help: "Up to three characters. Shown when there is no photograph." },
  ],
};

export const RECORD_DESCRIPTORS = {
  team: teamDescriptor,
  job: jobDescriptor,
  partner: partnerDescriptor,
  testimonial: testimonialDescriptor,
};
