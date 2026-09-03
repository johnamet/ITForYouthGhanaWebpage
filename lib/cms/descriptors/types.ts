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

export type FieldKind = "text" | "textarea" | "number" | "boolean" | "select" | "url";

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


/** A collection name from types/firebase.ts. */
export type CmsCollection = (typeof FIREBASE_COLLECTIONS)[keyof typeof FIREBASE_COLLECTIONS];
