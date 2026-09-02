import { FIREBASE_COLLECTIONS } from "@/types/firebase";

/**
 * Field descriptors for the six Laptop Bank CMS content types (build spec §4:
 * "All six are editable without a developer").
 *
 * WHY ONE DESCRIPTOR SET AND ONE RENDERER, NOT SIX FORMS.
 * The six types differ only in their field lists. Six hand-written forms would
 * be six places to fix the same bug, and — more importantly — six chances for
 * the consent treatment to drift. The consent treatment is the part that must
 * not drift: `Donor.display_consent` decides whether a real organisation's
 * logo goes on the public internet, and `Story.publication_consent` decides
 * whether a real young woman's name and photograph do. One renderer means one
 * place where that is got right.
 *
 * Field names are the spec's snake_case names, unchanged, because they are
 * both the Firestore field names and what an editor sees.
 */

export type FieldKind = "text" | "textarea" | "number" | "boolean" | "select" | "url";

export type FieldDescriptor = {
  key: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
  help?: string;
  options?: { value: string; label: string }[];
  /**
   * Marks a field that decides whether something appears publicly. The
   * renderer gives these an amber panel spelling out what publishing does, and
   * never pre-selects the publishing value.
   */
  consent?: boolean;
  /** Full-width control, for long text. */
  wide?: boolean;
};

export type LaptopBankContentTypeKey =
  | "process-stage"
  | "intake-item"
  | "document"
  | "donor"
  | "story"
  | "dashboard-metrics";

export type ContentTypeDescriptor = {
  key: LaptopBankContentTypeKey;
  collection: string;
  label: string;
  plural: string;
  description: string;
  /** "collection" lists many records; "singleton" edits one fixed document. */
  shape: "collection" | "singleton";
  /** Firestore document id for a singleton. */
  singletonId?: string;
  /** Which field titles a row in a list. */
  titleField: string;
  /** Numeric or string field a collection is sorted by. */
  sortField?: string;
  /**
   * Field whose value becomes the document id on create. When absent, the id
   * is generated. Used where the spec implies a stable, meaningful key.
   */
  idField?: string;
  fields: FieldDescriptor[];
  /** The spec rule governing this type, in plain words, shown above the form. */
  guidance?: string;
};

const AUDIENCE_OPTIONS = [
  { value: "corporate", label: "Corporate — donor organisations" },
  { value: "applicant", label: "Applicant — students and recipients" },
  { value: "public", label: "Public — anyone" },
];

/**
 * Donor display consent.
 *
 * "anonymous" is listed FIRST so it is the value a half-completed record lands
 * on. Spec §4 DATA excludes anonymous donors from every public query, so the
 * safe default is the one that publishes nothing.
 */
const DISPLAY_CONSENT_OPTIONS = [
  { value: "anonymous", label: "Anonymous — publish nothing about them" },
  { value: "named", label: "Named only — publish the name, not the logo" },
  { value: "logo", label: "Named with logo — publish the name and the logo" },
];

export const LAPTOP_BANK_CONTENT_TYPES: Record<
  LaptopBankContentTypeKey,
  ContentTypeDescriptor
> = {
  "process-stage": {
    key: "process-stage",
    collection: FIREBASE_COLLECTIONS.laptopBankStages,
    label: "Process stage",
    plural: "Process stages",
    description:
      "The nine stages published on /laptop-bank/how-it-works, and the condensed stepper on /laptop-bank.",
    shape: "collection",
    titleField: "title",
    sortField: "number",
    idField: "number",
    guidance:
      "Nine stages, numbered 1 to 9. The anchors on the public page are built from the number, so changing a number changes a URL that may already have been shared — renumber only if you mean to. The summary sentence is what the condensed stepper on /laptop-bank shows; keep it to one sentence.",
    fields: [
      { key: "number", label: "Stage number", kind: "number", required: true, help: "1 to 9. Drives the #stage-n anchor and the ordering." },
      { key: "title", label: "Title", kind: "text", required: true },
      { key: "duration", label: "Duration", kind: "text", required: true, help: "Shown in the summary table. A token such as {{DUR_WIPE}} is allowed here." },
      { key: "summary_sentence", label: "Summary sentence", kind: "textarea", required: true, wide: true, help: "One sentence. Shown on /laptop-bank." },
      { key: "full_text", label: "Full text", kind: "textarea", required: true, wide: true, help: "The expandable body on /laptop-bank/how-it-works." },
      { key: "owner", label: "Owner", kind: "text", required: true, help: "The role accountable for this stage." },
      { key: "record_produced", label: "Record produced", kind: "text", required: true, help: "The document this stage generates." },
    ],
  },

  "intake-item": {
    key: "intake-item",
    collection: FIREBASE_COLLECTIONS.laptopBankIntake,
    label: "Intake item",
    plural: "Intake specification",
    description:
      "The published minimums on /laptop-bank/what-we-accept, and the condensed first six on /laptop-bank.",
    shape: "collection",
    titleField: "item",
    sortField: "sort_order",
    guidance:
      "This is the most-read trust section on the corporate side of the site, and the spec is explicit that it must not be softened. The first six items by sort order are the ones shown on /laptop-bank, so order matters. Use an em dash (—) for a minimum that does not apply.",
    fields: [
      { key: "item", label: "Item", kind: "text", required: true },
      { key: "minimum_accepted", label: "Minimum accepted", kind: "textarea", required: true, wide: true, help: "Publish a number, not \"reasonably modern\"." },
      { key: "notes", label: "Notes", kind: "textarea", wide: true },
      { key: "accepted", label: "We accept this", kind: "boolean", help: "Off puts the item in the \"We cannot accept\" group." },
      { key: "sort_order", label: "Sort order", kind: "number", required: true, help: "Lower numbers first. The first six appear on /laptop-bank." },
    ],
  },

  document: {
    key: "document",
    collection: FIREBASE_COLLECTIONS.laptopBankDocuments,
    label: "Document",
    plural: "Documents",
    description: "The downloads on /policies/laptop-bank-documents and the data handling statement on /laptop-bank/data-security.",
    shape: "collection",
    titleField: "title",
    guidance:
      "Leave the file URL empty until the PDF exists — the public page then shows the document as awaiting publication rather than linking to nothing. Every published file must carry a version and a date. Replace a superseded version in place; never add a second record for a newer version of the same document.",
    fields: [
      { key: "title", label: "Title", kind: "text", required: true },
      { key: "file", label: "File URL", kind: "url", help: "Leave empty while the file is still being written." },
      { key: "format", label: "Format", kind: "text", required: true, help: "For example PDF." },
      { key: "fileSize", label: "File size", kind: "text", help: "For example 240 KB. Shown so a reader on mobile data knows what they are about to download." },
      { key: "version", label: "Version", kind: "text", help: "Required once the file is published." },
      { key: "date", label: "Date", kind: "text", help: "Required once the file is published." },
      { key: "audience_tag", label: "Audience", kind: "select", required: true, options: AUDIENCE_OPTIONS, help: "Groups the document on the downloads page." },
    ],
  },

  donor: {
    key: "donor",
    collection: FIREBASE_COLLECTIONS.laptopBankDonors,
    label: "Donor organisation",
    plural: "Donor organisations",
    description: "Partner organisations on /laptop-bank/partners and the logo band on /laptop-bank.",
    shape: "collection",
    titleField: "name",
    guidance:
      "Set display consent to exactly what the organisation told us on its offer form. An anonymous donor never appears anywhere public. \"Named only\" publishes the name but not the logo. Only \"Named with logo\" puts a logo on the site, and the logo band on /laptop-bank stays hidden until at least four organisations have agreed to that.",
    fields: [
      { key: "name", label: "Organisation name", kind: "text", required: true },
      {
        key: "display_consent",
        label: "Display consent",
        kind: "select",
        required: true,
        options: DISPLAY_CONSENT_OPTIONS,
        consent: true,
        help: "What this organisation agreed we may publish. Taken from the recognition answer on their offer form.",
      },
      { key: "logo", label: "Logo URL", kind: "url", help: "Only ever shown for \"Named with logo\"." },
      { key: "sector", label: "Sector", kind: "text" },
      { key: "country", label: "Country", kind: "text" },
      { key: "quote", label: "Quote", kind: "textarea", wide: true, help: "Optional. Shown on /laptop-bank/partners when present." },
      { key: "quote_attribution", label: "Quote attribution", kind: "text", help: "Who said it. Falls back to the organisation name." },
    ],
  },

  story: {
    key: "story",
    collection: FIREBASE_COLLECTIONS.laptopBankStories,
    label: "Recipient story",
    plural: "Recipient stories",
    description: "Stories on /her-first-laptop/stories and the single story on /her-first-laptop.",
    shape: "collection",
    titleField: "preferred_name",
    guidance:
      "A story is published only when publication consent is on. Her name, institution and photograph appear together only when a consent record reference is filled in — without one, the public page shows the quote and preferred name alone. Never enter a composite, and never write a story on someone's behalf: a composite presented as a real person is a serious risk to the organisation and to her.",
    fields: [
      { key: "preferred_name", label: "Preferred name", kind: "text", required: true, help: "The name she asked to be called. Not her full legal name." },
      {
        key: "publication_consent",
        label: "Publication consent given",
        kind: "boolean",
        consent: true,
        help: "Off keeps this story off every public page.",
      },
      {
        key: "consent_record_ref",
        label: "Consent record reference",
        kind: "text",
        consent: true,
        help: "Where the signed consent is filed. Without this, her institution and photograph are withheld even when publication consent is on.",
      },
      { key: "quote", label: "Quote", kind: "textarea", required: true, wide: true, help: "Her words, as she gave them." },
      { key: "photo", label: "Photograph URL", kind: "url", help: "Only shown when a consent record reference is filled in." },
      { key: "institution", label: "Institution", kind: "text", help: "Only shown when a consent record reference is filled in." },
      { key: "pathway", label: "Pathway", kind: "text" },
      { key: "region", label: "Region", kind: "text" },
      { key: "date", label: "Date", kind: "text" },
    ],
  },

  "dashboard-metrics": {
    key: "dashboard-metrics",
    collection: FIREBASE_COLLECTIONS.laptopBankMetrics,
    label: "Dashboard metrics",
    plural: "Dashboard metrics",
    description: "The figures on /laptop-bank/impact and the stat band on /laptop-bank.",
    shape: "singleton",
    singletonId: "current",
    titleField: "period_label",
    guidance:
      "One record, edited in place. Leave a metric empty when it has not been counted yet — the public page then says \"Not yet reported\", which is not the same claim as zero. The stat band on /laptop-bank stays hidden entirely until its four figures and the last-updated date are all filled in, so a partial record cannot imply a missing number is zero. Never enter a figure you could not evidence from a record.",
    fields: [
      { key: "period_label", label: "Period label", kind: "text", required: true, help: "For example \"To 31 December 2026\"." },
      { key: "last_updated", label: "Last updated", kind: "text", required: true, help: "Shown at the top of the grid, and required before the stat band will appear." },
      { key: "units_offered", label: "Units offered", kind: "number" },
      { key: "units_accepted", label: "Units accepted", kind: "number", help: "Shown in the stat band on /laptop-bank." },
      { key: "units_declined_at_offer", label: "Units declined at offer", kind: "number" },
      { key: "units_rejected_at_intake", label: "Units rejected at intake", kind: "number" },
      { key: "drives_sanitised", label: "Drives sanitised, with certificates issued", kind: "number", help: "Shown in the stat band on /laptop-bank." },
      { key: "deployed_individual", label: "Deployed to individuals", kind: "number", help: "Shown in the stat band on /laptop-bank." },
      { key: "deployed_shared", label: "Deployed to clubs and labs", kind: "number" },
      { key: "ownership_transfers", label: "Recipients who now own their machine", kind: "number" },
      { key: "retention_12m_pct", label: "Working and in her hands at 12 months (%)", kind: "number" },
      { key: "units_recycled", label: "Units recycled through a licensed handler", kind: "number" },
      { key: "partner_orgs", label: "Partner organisations", kind: "number", help: "Shown in the stat band on /laptop-bank." },
      { key: "deployment_by_region", label: "Deployment by region", kind: "number" },
      { key: "deployment_by_pathway", label: "Deployment by pathway", kind: "number" },
    ],
  },
};

export const LAPTOP_BANK_CONTENT_TYPE_KEYS = Object.keys(
  LAPTOP_BANK_CONTENT_TYPES,
) as LaptopBankContentTypeKey[];

export function isContentTypeKey(value: string): value is LaptopBankContentTypeKey {
  return Object.prototype.hasOwnProperty.call(LAPTOP_BANK_CONTENT_TYPES, value);
}

export function getContentTypeDescriptor(
  key: string,
): ContentTypeDescriptor | undefined {
  return isContentTypeKey(key) ? LAPTOP_BANK_CONTENT_TYPES[key] : undefined;
}
