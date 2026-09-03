import type {
  ContentTypeDescriptor,
  FieldDescriptor,
} from "@/lib/cms/descriptors/types";
import { buildSeedFields } from "@/lib/cms/descriptors/page-overrides";
import { LAPTOP_BANK_PAGE_SEEDS } from "@/lib/content/laptop-bank-page-seeds";
import { LAPTOP_BANK_TOKENS, type TokenName } from "@/lib/content/laptop-bank-tokens";
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

export type {
  FieldKind,
  FieldDescriptor,
  ContentTypeDescriptor,
} from "@/lib/cms/descriptors/types";

export type LaptopBankContentTypeKey =
  | "process-stage"
  | "intake-item"
  | "document"
  | "donor"
  | "story"
  | "dashboard-metrics"
  | "token"
  | "application-status"
  | "faq"
  /**
   * One descriptor per editable page, generated from the page's own seed
   * content — see PAGE_CONTENT_TYPES at the bottom of this file. Typed as a
   * template literal rather than enumerated so adding a page to the seed
   * registry needs no change here.
   */
  | `page-${string}`;


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

/**
 * The token fields, generated from the registry rather than listed again here.
 *
 * The registry already declares every token, what IT for Youth needs to supply
 * and which pages consume it, so restating 27 fields would be a second list to
 * keep in step. Adding a token to the registry makes it appear in the editor.
 */
const TOKEN_FIELDS: FieldDescriptor[] = (
  Object.keys(LAPTOP_BANK_TOKENS) as TokenName[]
).map((name) => {
  const entry = LAPTOP_BANK_TOKENS[name];
  return {
    key: name,
    label: `{{${name}}}`,
    kind: entry.longform ? "textarea" : "text",
    wide: entry.longform,
    help: `${entry.needed}. Used on ${entry.usedOn.join(", ")}.${
      entry.phase === 2 ? " Phase 2." : ""
    }`,
  } satisfies FieldDescriptor;
});

const BASE_CONTENT_TYPES: Record<string, ContentTypeDescriptor> = {
  "process-stage": {
    key: "process-stage",
    hub: "laptop-bank",
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
      { key: "number", label: "Stage number", kind: "number", required: true, min: 1, help: "1 to 9. Drives the #stage-n anchor and the ordering." },
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
    hub: "laptop-bank",
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
      { key: "sort_order", label: "Sort order", kind: "number", required: true, min: 0, help: "Lower numbers first. The first six appear on /laptop-bank." },
    ],
  },

  document: {
    key: "document",
    hub: "laptop-bank",
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
    hub: "laptop-bank",
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
    hub: "laptop-bank",
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

  /**
   * The application status banner (Draft 1 §9 §1).
   *
   * Draft 1: "This banner is the single most valuable component on the site
   * for your workload. Every call and direct message you currently field can
   * be answered with a saved reply pointing at this URL."
   *
   * "Open" is deliberately not the stored default — see
   * DEFAULT_APPLICATION_STATUS. An unattended banner claiming applications are
   * open sends students into a form nobody is reading.
   */
  "application-status": {
    key: "application-status",
    hub: "laptop-bank",
    collection: FIREBASE_COLLECTIONS.laptopBankSettings,
    label: "Application status",
    plural: "Application status",
    description:
      "The banner at the top of /her-first-laptop/apply and /her-first-laptop. Answers \"are applications open?\" so your team does not have to, one message at a time.",
    shape: "singleton",
    singletonId: "application-status",
    titleField: "state",
    guidance:
      "Change this the moment a round opens or closes — it is the one setting that most reduces the calls and direct messages your team fields by hand. Dates are optional: a state on its own still answers the question. Use the message override only for a situation the three states do not describe, such as a pause while a consignment is delayed.",
    fields: [
      {
        key: "state",
        label: "Status",
        kind: "select",
        required: true,
        options: [
          { value: "open", label: "Open — applications are being accepted" },
          { value: "closed", label: "Closed — the round has ended" },
          { value: "waiting-list", label: "Waiting list only — more applications than machines" },
        ],
        help: "Shown as a coloured banner with a matching text label, so the state reads without relying on colour.",
      },
      { key: "openUntil", label: "Open until", kind: "text", help: "Open state only. For example \"30 November 2026\". Leave empty to say only that applications are open." },
      { key: "replyBy", label: "All applicants hear by", kind: "text", help: "Open state only. Every applicant gets an answer, so only promise a date you can hold." },
      { key: "nextRoundOpens", label: "Next round opens", kind: "text", help: "Closed state only. For example \"February 2027\"." },
      { key: "messageOverride", label: "Message override", kind: "textarea", wide: true, help: "Replaces the generated sentence entirely. Leave empty unless the three states genuinely do not fit." },
    ],
  },

  /**
   * The FAQs on /her-first-laptop/eligibility (spec 5.7 block 7).
   *
   * Draft 1 §1's second rule for the developer names FAQ entries explicitly:
   * "Every counter, tier amount, FAQ entry, story and application status must
   * be editable without a code change. These change often." Draft 1 §4 §8 adds
   * that the team should "add to them from the CMS as real questions arrive" —
   * which is the whole point: the questions students actually ask are not the
   * six anyone guessed up front.
   *
   * Spec 5.7 supplies six questions in a fixed order, so sort_order drives the
   * ordering rather than insertion time.
   */
  faq: {
    key: "faq",
    hub: "laptop-bank",
    collection: FIREBASE_COLLECTIONS.laptopBankFaqs,
    label: "FAQ",
    plural: "Eligibility FAQs",
    description:
      "The questions and answers on /her-first-laptop/eligibility. Add the questions students actually send you.",
    shape: "collection",
    titleField: "question",
    sortField: "sort_order",
    guidance:
      "Add a question the moment it arrives more than once — that is cheaper than answering it by hand every time. Keep answers to what you can stand behind: an answer here is a public commitment, and anything about payment, ownership or timing should match the eligibility page above it.",
    fields: [
      { key: "question", label: "Question", kind: "text", required: true, wide: true },
      { key: "answer", label: "Answer", kind: "textarea", required: true, wide: true, help: "A {{TOKEN}} such as {{PEER_HOURS}} may be used here and will resolve to its CMS value." },
      { key: "sort_order", label: "Sort order", kind: "number", required: true, min: 0, help: "Lower numbers appear first." },
    ],
  },

  /**
   * The {{TOKEN}} values (build spec §11, and 5.1's "single source in the
   * CMS"). A singleton document, so {{SLA_REPLY}} cannot render one value on
   * page 5.1 and a different one on 5.5 — spec §10 checks precisely that.
   *
   * Nothing here is optional in the sense that matters: an unfilled token
   * renders as visible red text on the public page, so a half-completed
   * record is loudly visible rather than silently wrong. Fields are therefore
   * not marked required — a partially-filled record is a legitimate state
   * while content is still being gathered.
   */
  token: {
    key: "token",
    hub: "laptop-bank",
    collection: FIREBASE_COLLECTIONS.laptopBankSettings,
    label: "Awaited content",
    plural: "Awaited content (tokens)",
    description:
      "Values IT for Youth still owes: reply times, stage durations, the sanitisation standard, giving amounts, the selection cycle and the rest. Anything left empty shows as red placeholder text on the public pages.",
    shape: "singleton",
    singletonId: "tokens",
    titleField: "SLA_REPLY",
    guidance:
      "Every value here appears on a live public page the moment you save it. Do not guess: the sanitisation standard, the recycler's licence reference, the loan period and the giving amounts are compliance, legal and financial commitments — leave one empty rather than filling it with a placeholder, because an empty token is visibly unfinished whereas a wrong one reads as fact. Run `npm run verify:tokens` to see what is still outstanding.",
    fields: TOKEN_FIELDS,
  },

  "dashboard-metrics": {
    key: "dashboard-metrics",
    hub: "laptop-bank",
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
      { key: "units_offered", label: "Units offered", kind: "number", min: 0 },
      { key: "units_accepted", label: "Units accepted", kind: "number", min: 0, help: "Shown in the stat band on /laptop-bank." },
      { key: "units_declined_at_offer", label: "Units declined at offer", kind: "number", min: 0 },
      { key: "units_rejected_at_intake", label: "Units rejected at intake", kind: "number", min: 0 },
      { key: "drives_sanitised", label: "Drives sanitised, with certificates issued", kind: "number", min: 0, help: "Shown in the stat band on /laptop-bank." },
      { key: "deployed_individual", label: "Deployed to individuals", kind: "number", min: 0, help: "Shown in the stat band on /laptop-bank." },
      { key: "deployed_shared", label: "Deployed to clubs and labs", kind: "number", min: 0 },
      { key: "ownership_transfers", label: "Recipients who now own their machine", kind: "number", min: 0 },
      { key: "retention_12m_pct", label: "Working and in her hands at 12 months (%)", kind: "number", min: 0, max: 100 },
      { key: "units_recycled", label: "Units recycled through a licensed handler", kind: "number", min: 0 },
      { key: "partner_orgs", label: "Partner organisations", kind: "number", min: 0, help: "Shown in the stat band on /laptop-bank." },
      { key: "deployment_by_region", label: "Deployment by region", kind: "number", min: 0 },
      { key: "deployment_by_pathway", label: "Deployment by pathway", kind: "number", min: 0 },
    ],
  },
};






// ─── Page copy descriptors, generated from each page's seed ───────────────────

const PAGE_CONTENT_TYPES: Record<string, ContentTypeDescriptor> = Object.fromEntries(
  LAPTOP_BANK_PAGE_SEEDS.map((page) => [
    `page-${page.key}`,
    {
      key: `page-${page.key}`,
      hub: "laptop-bank",
      collection: FIREBASE_COLLECTIONS.laptopBankPages,
      label: page.label,
      plural: page.label,
      description: `${page.description} Renders on ${page.route}.`,
      shape: "singleton" as const,
      singletonId: page.key,
      titleField: "meta__title",
      guidance:
        `Every field here is live copy on ${page.route}. Leave a field empty to keep the wording the site ships with — an empty field falls back to the built-in text rather than blanking the page. Link destinations and section anchors are not editable here on purpose: the URL map is final and gets printed on legal paperwork.`,
      previewHref: page.route,
      fields: buildSeedFields(page.seed),
    } satisfies ContentTypeDescriptor,
  ]),
);

/**
 * Every editable Laptop Bank content type: the six CMS types from spec §4, the
 * token values, the application status, the FAQs, and one entry per editable
 * page.
 */
export const LAPTOP_BANK_CONTENT_TYPES: Record<string, ContentTypeDescriptor> = {
  ...BASE_CONTENT_TYPES,
  ...PAGE_CONTENT_TYPES,
};

export const LAPTOP_BANK_CONTENT_TYPE_KEYS = Object.keys(
  LAPTOP_BANK_CONTENT_TYPES,
) as LaptopBankContentTypeKey[];

/** Keys of everything except the generated page editors. */
export const LAPTOP_BANK_RECORD_TYPE_KEYS = Object.keys(
  BASE_CONTENT_TYPES,
) as LaptopBankContentTypeKey[];

/** Keys of the generated page editors, in registry order. */
export const LAPTOP_BANK_PAGE_TYPE_KEYS = LAPTOP_BANK_PAGE_SEEDS.map(
  (page) => `page-${page.key}` as LaptopBankContentTypeKey,
);

export function isContentTypeKey(value: string): value is LaptopBankContentTypeKey {
  return Object.prototype.hasOwnProperty.call(LAPTOP_BANK_CONTENT_TYPES, value);
}

export function getContentTypeDescriptor(key: string): ContentTypeDescriptor | undefined {
  return isContentTypeKey(key) ? LAPTOP_BANK_CONTENT_TYPES[key] : undefined;
}
