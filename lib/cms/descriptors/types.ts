import type { FIREBASE_COLLECTIONS } from "@/types/firebase";

/**
 * The descriptor types behind every generated admin editor.
 *
 * WHY ONE DESCRIPTOR SET AND ONE RENDERER, NOT A FORM PER CONTENT TYPE.
 * Content types differ almost entirely in their field lists. A hand-written
 * form each means one place per type to fix the same bug, and — more
 * importantly — one chance per type for the publishing-decision treatment to
 * drift. That treatment is the part that must not drift: a donor's
 * display_consent decides whether a real organisation's logo goes on the
 * public internet, a story's publication_consent decides whether a real young
 * woman's name and photograph do, and a partner's permission-on-file flag is
 * the same decision again. One renderer means one place where it is got right.
 *
 * Extracted from the Laptop Bank implementation, which proved the pattern
 * across 21 editors including 202 page-copy fields generated from seed
 * content.
 */

export type FieldKind =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "select"
  | "url"
  /**
   * A `string[]`, edited as one line per item.
   *
   * This is how the hand-written forms already treated a department's
   * responsibilities, and it is the only shape an id list such as
   * `teamMemberIds` can hold — so an empty array in a seed becomes one of
   * these rather than nothing at all.
   */
  | "stringList"
  /**
   * A repeatable group: an array of objects, with `itemFields` describing one
   * row.
   *
   * Added because the four hand-written forms this kit replaced could add and
   * remove array items — a stat, a section, a CTA, a department service — and
   * the generated editor could only reword the items a seed already had.
   * Deleting a form that could do more than its replacement would have removed
   * a real capability rather than refactored one.
   */
  | "list";

export type FieldDescriptor = {
  key: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
  /**
   * Bounds for a `number` field. Counts are non-negative by nature — a real
   * record was saved with units_offered = -70, which no amount of care at the
   * keyboard prevents and which would have published as a figure. A
   * percentage is additionally capped at 100.
   */
  min?: number;
  max?: number;
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
  /**
   * For a `list` field: the controls one row gets.
   *
   * Generated from the seed's first item, and may itself contain `list` and
   * `stringList` fields — which is what keeps a nested array such as an SDG
   * goal's linked routes editable rather than silently frozen.
   */
  itemFields?: FieldDescriptor[];
  /**
   * Shown only when creating a record, never when editing one.
   *
   * For the slug of a record in a seed-backed collection: it becomes the
   * Firestore document id, and a document id cannot be changed afterwards, so
   * offering the field on an edit screen would promise something the save
   * cannot deliver.
   */
  createOnly?: boolean;
  /**
   * Value a NEW record starts with.
   *
   * Needed because the old hand-written forms carried defaults in their zod
   * schemas — `partnerSchema` defaults `active` to true — and a generic form
   * that initialised every boolean to false would have saved new partners
   * hidden. A `consent` field should normally NOT set this: the point of the
   * consent treatment is that a publishing decision is made deliberately, not
   * inherited.
   */
  defaultValue?: string | boolean;
};

export type ContentTypeDescriptor = {
  key: string;
  /**
   * Which admin hub this editor belongs to — a key from `adminHubs` in
   * lib/content/admin-registry.ts. The registry generates a navigable node
   * from this, which is what makes the editor findable: the Laptop Bank spent
   * a day registered only in `adminNavigation`, which nothing renders, and was
   * invisible in the admin the whole time.
   */
  hub: string;
  collection: string;
  label: string;
  plural: string;
  description: string;
  /**
   * "collection" lists many records; "singleton" edits one fixed document;
   * "seed-collection" lists the records the site ships in code and stores only
   * the edits made to them.
   *
   * The third exists because `listRecords` returns stored documents, and for
   * departments and initiatives Firestore holds none at all — the eight
   * records of each live in lib/content/site-config.ts. A plain collection
   * editor pointed at those would have shown eight departments as none, which
   * is worse than no editor: it reads as data loss.
   */
  shape: "collection" | "singleton" | "seed-collection";
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
  /**
   * The hand-declared fields.
   *
   * For a `seed-collection` these are the STRUCTURAL fields only — `status`,
   * `order`, `featured`, the slug — so they get a select, a number and a
   * checkbox rather than the free-text control a seed walk would give a
   * status string. The copy fields are generated per record from that record's
   * own seed, and the walk skips any key declared here. Use
   * `resolveFields` in lib/cms/descriptors/seed-collections.ts rather than
   * reading this directly, or a seed-backed editor renders four controls
   * instead of forty.
   */
  fields: FieldDescriptor[];
  /**
   * For a `seed-collection`: the records the site ships, in display order.
   */
  seedRecords?: SeedCollectionRecord[];
  /**
   * For a page singleton generated from seed content: that seed.
   *
   * Carried on the descriptor so an editor can show what a repeatable list
   * currently holds. A text field can show its current wording in help text
   * and stay empty to mean "not overridden", but a list cannot: an editor
   * asked to change the third of five sections has to see all five, so the
   * control is initialised from the merged content rather than from the
   * stored overrides alone.
   */
  seed?: Record<string, unknown>;
  /**
   * For a `seed-collection`: the seed record a NEWLY created record inherits
   * its structure from. Defaults to the first seed record.
   */
  templateId?: string;
  /**
   * Document ids in this collection that are NOT records of this type.
   *
   * The partnership tracks and the Partner With Us overview share the
   * `partnerships` collection, so the tracks editor must not list `_overview`
   * as a sixth track — it is a page, edited by its own singleton descriptor.
   */
  excludeDocIds?: string[];
  /**
   * Whether the editor offers a "new record" screen.
   *
   * Defaults to true for a plain collection and false for a seed-backed one.
   * Initiatives set it false on purpose: an initiative is a programme with its
   * own routing and imagery, so adding one is a code change that then becomes
   * editable — not a form submission that leaves a page half-wired.
   */
  allowCreate?: boolean;
  /** The spec rule governing this type, in plain words, shown above the form. */
  guidance?: string;
  /** The public route this content renders on, for a preview link. */
  previewHref?: string;
  /**
   * Public paths to revalidate after a write.
   *
   * NOT optional in practice, and the reason is worth stating: the pages these
   * editors feed are statically prerendered, so their CMS reads happen at
   * build time. Without a revalidate call an editor saves a change, sees a
   * success message, and the public page keeps showing the old copy until the
   * next deploy — the worst kind of bug, because nothing appears to be wrong.
   */
  revalidatePaths?: string[];
};


/**
 * One record a seed-backed collection ships with.
 *
 * `id` is both the Firestore document id and the seed's stable key — its slug
 * — so an edit lands on the record it was made against even though the seed
 * itself is never written to.
 */
export type SeedCollectionRecord = {
  id: string;
  /** Row title in the list, taken from the seed rather than from a stored doc. */
  title: string;
  /** The record exactly as the site ships it. */
  seed: Record<string, unknown>;
};

/** A collection name from types/firebase.ts. */
export type CmsCollection = (typeof FIREBASE_COLLECTIONS)[keyof typeof FIREBASE_COLLECTIONS];
