import { getAdminFirestore } from "@/lib/firebase/admin";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

/**
 * Staff-side reads for the two Laptop Bank public forms (build spec §6.1 and
 * §6.2).
 *
 * These are the ONLY route staff have to a submission. Spec §7 keeps every
 * piece of personal data out of the notification email body, so the email
 * carries a reference and a link and nothing else — which means if these reads
 * or the screens above them break, a submitted application is invisible and
 * effectively lost. That is what made both forms a dead end before this
 * existed.
 *
 * Both collections are keyed by the reference the submitter was given, so the
 * Firestore document id IS the reference. There is no separate id.
 */

export type EquipmentOfferStatus =
  | "new"
  | "reviewing"
  | "accepted-in-full"
  | "accepted-in-part"
  | "declined"
  | "collected"
  | "archived";

export type StudentApplicationStatus =
  | "new"
  | "reviewed"
  | "shortlisted"
  | "waiting-list"
  | "offered"
  | "rejected"
  | "enrolled";

export type ConsentRecord = {
  given: boolean;
  at?: string;
};

export type CmsEquipmentOffer = {
  reference: string;
  organisationName: string;
  sector?: string;
  country: string;
  city: string;
  contactName: string;
  contactRole: string;
  workEmail: string;
  phone?: string;
  heardAboutUs?: string;
  equipmentTypes: string[];
  estimatedQuantity: string;
  approximateAge: string;
  makeAndModel?: string;
  releasedFromManagement: string;
  firmwarePasswordsCleared: string;
  drivesAlreadyWiped: string;
  drivesRetainedByYou: string;
  collectionAddress?: string;
  targetTimeline: string;
  publicRecognition: string;
  supportRefurbishmentCosts: boolean;
  deploymentReport: boolean;
  anythingElse?: string;
  /** Operational flags the form captures — see spec §6.1. */
  import_flag: boolean;
  needs_storage: boolean;
  free_webmail: boolean;
  display_consent: string;
  consents: Record<string, ConsentRecord>;
  assetListUploadId?: string;
  assetListStorageFailed: boolean;
  status: EquipmentOfferStatus;
  notes?: string;
  createdAt?: string;
};

export type CmsStudentApplication = {
  reference: string;
  fullName: string;
  preferredName?: string;
  phone: string;
  phoneIsWhatsApp: boolean;
  alternativeContact: string;
  email?: string;
  institution: string;
  programmeOfStudy: string;
  yearOfStudy: string;
  expectedCompletionMonth: string;
  expectedCompletionYear: string;
  studentIdentifier: string;
  regionOfResidence: string;
  currentComputerAccess: string;
  itfyTrack: string;
  whyYouNeedIt: string;
  whatYouWillDo: string;
  referralSource?: string;
  consents: Record<string, ConsentRecord>;
  storyAndPhotoConsent: boolean;
  proofOfEnrolmentUploadId?: string;
  proofOfEnrolmentStorageFailed: boolean;
  status: StudentApplicationStatus;
  notes?: string;
  createdAt?: string;
};

export type SubmissionKind = "equipment-offer" | "student-application";

const COLLECTIONS: Record<SubmissionKind, string> = {
  "equipment-offer": FIREBASE_COLLECTIONS.laptopBankOffers,
  "student-application": FIREBASE_COLLECTIONS.laptopBankApplications,
};

// ─── Value coercion ───────────────────────────────────────────────────────────
//
// Same reason lib/cms/contact-messages.ts has these: a Firestore Timestamp is
// a class instance, and passing one from a server component into a React tree
// throws "Only plain objects can be passed to Client Components".

function toIsoDate(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object" && value && "toDate" in value) {
    try {
      return (value as { toDate: () => Date }).toDate().toISOString();
    } catch {
      return undefined;
    }
  }
  return undefined;
}

const str = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

const optionalStr = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value : undefined;

const bool = (value: unknown): boolean => value === true;

const strList = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

/** Normalises the stored consent map, dropping anything malformed. */
function consents(value: unknown): Record<string, ConsentRecord> {
  if (!value || typeof value !== "object") return {};
  const out: Record<string, ConsentRecord> = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (!entry || typeof entry !== "object") continue;
    const record = entry as { given?: unknown; at?: unknown };
    out[key] = { given: record.given === true, at: toIsoDate(record.at) };
  }
  return out;
}

const OFFER_STATUSES: EquipmentOfferStatus[] = [
  "new",
  "reviewing",
  "accepted-in-full",
  "accepted-in-part",
  "declined",
  "collected",
  "archived",
];

const APPLICATION_STATUSES: StudentApplicationStatus[] = [
  "new",
  "reviewed",
  "shortlisted",
  "waiting-list",
  "offered",
  "rejected",
  "enrolled",
];

function normaliseOffer(reference: string, data: Record<string, unknown>): CmsEquipmentOffer {
  return {
    reference,
    organisationName: str(data.organisationName),
    sector: optionalStr(data.sector),
    country: str(data.country),
    city: str(data.city),
    contactName: str(data.contactName),
    contactRole: str(data.contactRole),
    workEmail: str(data.workEmail),
    phone: optionalStr(data.phone),
    heardAboutUs: optionalStr(data.heardAboutUs),
    equipmentTypes: strList(data.equipmentTypes),
    estimatedQuantity: str(data.estimatedQuantity),
    approximateAge: str(data.approximateAge),
    makeAndModel: optionalStr(data.makeAndModel),
    releasedFromManagement: str(data.releasedFromManagement),
    firmwarePasswordsCleared: str(data.firmwarePasswordsCleared),
    drivesAlreadyWiped: str(data.drivesAlreadyWiped),
    drivesRetainedByYou: str(data.drivesRetainedByYou),
    collectionAddress: optionalStr(data.collectionAddress),
    targetTimeline: str(data.targetTimeline),
    publicRecognition: str(data.publicRecognition),
    supportRefurbishmentCosts: bool(data.supportRefurbishmentCosts),
    deploymentReport: bool(data.deploymentReport),
    anythingElse: optionalStr(data.anythingElse),
    import_flag: bool(data.import_flag),
    needs_storage: bool(data.needs_storage),
    free_webmail: bool(data.free_webmail),
    display_consent: str(data.display_consent),
    consents: consents(data.consents),
    assetListUploadId: optionalStr(data.assetListUploadId),
    assetListStorageFailed: bool(data.assetListStorageFailed),
    status: OFFER_STATUSES.includes(data.status as EquipmentOfferStatus)
      ? (data.status as EquipmentOfferStatus)
      : "new",
    notes: optionalStr(data.notes),
    createdAt: toIsoDate(data.createdAt),
  };
}

function normaliseApplication(
  reference: string,
  data: Record<string, unknown>,
): CmsStudentApplication {
  return {
    reference,
    fullName: str(data.fullName),
    preferredName: optionalStr(data.preferredName),
    phone: str(data.phone),
    phoneIsWhatsApp: bool(data.phoneIsWhatsApp),
    alternativeContact: str(data.alternativeContact),
    email: optionalStr(data.email),
    institution: str(data.institution),
    programmeOfStudy: str(data.programmeOfStudy),
    yearOfStudy: str(data.yearOfStudy),
    expectedCompletionMonth: str(data.expectedCompletionMonth),
    expectedCompletionYear: str(data.expectedCompletionYear),
    studentIdentifier: str(data.studentIdentifier),
    regionOfResidence: str(data.regionOfResidence),
    currentComputerAccess: str(data.currentComputerAccess),
    itfyTrack: str(data.itfyTrack),
    whyYouNeedIt: str(data.whyYouNeedIt),
    whatYouWillDo: str(data.whatYouWillDo),
    referralSource: optionalStr(data.referralSource),
    consents: consents(data.consents),
    storyAndPhotoConsent: bool(data.storyAndPhotoConsent),
    proofOfEnrolmentUploadId: optionalStr(data.proofOfEnrolmentUploadId),
    proofOfEnrolmentStorageFailed: bool(data.proofOfEnrolmentStorageFailed),
    status: APPLICATION_STATUSES.includes(data.status as StudentApplicationStatus)
      ? (data.status as StudentApplicationStatus)
      : "new",
    notes: optionalStr(data.notes),
    createdAt: toIsoDate(data.createdAt),
  };
}

/** Newest first — staff work an inbox from the top. */
function byNewest<T extends { createdAt?: string; reference: string }>(rows: T[]): T[] {
  return [...rows].sort((left, right) => {
    if (left.createdAt && right.createdAt) return right.createdAt.localeCompare(left.createdAt);
    if (left.createdAt) return -1;
    if (right.createdAt) return 1;
    // No timestamp on either: fall back to the reference, which embeds the
    // submission date, so ordering stays stable rather than arbitrary.
    return right.reference.localeCompare(left.reference);
  });
}

// ─── Reads ────────────────────────────────────────────────────────────────────

export async function getEquipmentOffers(): Promise<CmsEquipmentOffer[]> {
  const db = await getAdminFirestore();
  if (!db) return [];
  try {
    const snapshot = await db.collection(COLLECTIONS["equipment-offer"]).get();
    return byNewest(snapshot.docs.map((doc) => normaliseOffer(doc.id, doc.data() ?? {})));
  } catch (error) {
    console.error("Equipment offers read failed", error);
    return [];
  }
}

export async function getEquipmentOffer(
  reference: string,
): Promise<CmsEquipmentOffer | undefined> {
  const db = await getAdminFirestore();
  if (!db) return undefined;
  try {
    const doc = await db.collection(COLLECTIONS["equipment-offer"]).doc(reference).get();
    if (!doc.exists) return undefined;
    return normaliseOffer(doc.id, doc.data() ?? {});
  } catch (error) {
    console.error("Equipment offer read failed", error);
    return undefined;
  }
}

export async function getStudentApplications(): Promise<CmsStudentApplication[]> {
  const db = await getAdminFirestore();
  if (!db) return [];
  try {
    const snapshot = await db.collection(COLLECTIONS["student-application"]).get();
    return byNewest(snapshot.docs.map((doc) => normaliseApplication(doc.id, doc.data() ?? {})));
  } catch (error) {
    console.error("Student applications read failed", error);
    return [];
  }
}

export async function getStudentApplication(
  reference: string,
): Promise<CmsStudentApplication | undefined> {
  const db = await getAdminFirestore();
  if (!db) return undefined;
  try {
    const doc = await db.collection(COLLECTIONS["student-application"]).doc(reference).get();
    if (!doc.exists) return undefined;
    return normaliseApplication(doc.id, doc.data() ?? {});
  } catch (error) {
    console.error("Student application read failed", error);
    return undefined;
  }
}

// ─── Writes ───────────────────────────────────────────────────────────────────

/**
 * Updates the staff-owned fields on a submission: status and internal notes.
 *
 * Nothing the submitter wrote is editable here, deliberately. A reviewer must
 * not be able to quietly amend an applicant's own words or a donor's stated
 * consent — the submission is the record of what they said.
 */
export async function updateSubmission(
  kind: SubmissionKind,
  reference: string,
  update: { status: string; notes?: string },
) {
  const db = await getAdminFirestore();
  if (!db) return { configured: false, written: false } as const;
  const { FieldValue } = await import("firebase-admin/firestore");
  await db
    .collection(COLLECTIONS[kind])
    .doc(reference)
    .set(
      { status: update.status, notes: update.notes ?? "", updatedAt: FieldValue.serverTimestamp() },
      { merge: true },
    );
  return { configured: true, written: true } as const;
}

export async function deleteSubmission(kind: SubmissionKind, reference: string) {
  const db = await getAdminFirestore();
  if (!db) return { configured: false, written: false } as const;
  await db.collection(COLLECTIONS[kind]).doc(reference).delete();
  return { configured: true, written: true } as const;
}
