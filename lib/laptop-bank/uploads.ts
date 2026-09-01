import { randomUUID } from "node:crypto";

import { getFirebaseAdminApp } from "@/lib/firebase/admin";

/**
 * Storage for files submitted through the two Laptop Bank forms.
 *
 * Spec §7, first rule: "Uploaded enrolment documents are stored outside the
 * public web root and served only through an authenticated route. No guessable
 * URLs." Draft 1 §14.2 adds that they must never be "served from a guessable
 * URL".
 *
 * Three things follow from that, and all three are load-bearing:
 *
 * 1. Files go to Firebase Storage under PRIVATE_PREFIX, never to /public. The
 *    Next public directory is served statically by path, so anything placed
 *    there is world-readable by definition.
 * 2. The stored object name is a fresh UUID, never the applicant's filename.
 *    A student ID scan called "kwame-mensah-id.jpg" leaks the applicant's name
 *    to anyone who can see a URL, and predictable names invite enumeration.
 *    The original filename is kept as object metadata for staff, where it is
 *    only readable by an authenticated caller.
 * 3. No signed URL is minted here and no object is made public. The single
 *    read path is app/api/laptop-bank/uploads/[id]/route.ts, which checks the
 *    admin session before streaming bytes.
 */

const PRIVATE_PREFIX = "private/laptop-bank-uploads";

export type StoredUpload = {
  id: string;
  originalName: string;
  contentType: string;
  size: number;
};

export type UploadMetadata = {
  /** The reference the submitter was given, so staff can join the two. */
  reference: string;
  /** Which form the file came from. */
  form: "equipment-offer" | "student-application";
};

export type UploadResult =
  | { configured: true; stored: StoredUpload }
  | { configured: false; stored?: undefined };

async function getBucket() {
  const app = await getFirebaseAdminApp();
  if (!app) return null;
  const { getStorage } = await import("firebase-admin/storage");
  try {
    return getStorage(app).bucket();
  } catch (error) {
    console.error("Laptop Bank upload bucket unavailable", error);
    return null;
  }
}

/**
 * Writes one file and returns its opaque id.
 *
 * Returns `{ configured: false }` when Firebase Storage is not set up, so a
 * caller can accept the rest of a submission rather than losing it. An
 * application whose file could not be stored is still an application, and
 * Draft 1 §14.5 warns that silent upload failures are the fault most likely to
 * be quietly losing applicants — so the caller must record that the file is
 * missing rather than treating the submission as complete.
 */
export async function storeUpload(
  file: File,
  metadata: UploadMetadata,
): Promise<UploadResult> {
  const bucket = await getBucket();
  if (!bucket) return { configured: false };

  const id = randomUUID();
  const contentType = file.type || "application/octet-stream";
  const buffer = Buffer.from(await file.arrayBuffer());

  await bucket.file(`${PRIVATE_PREFIX}/${id}`).save(buffer, {
    resumable: false,
    contentType,
    metadata: {
      contentType,
      metadata: {
        originalName: file.name,
        reference: metadata.reference,
        form: metadata.form,
        uploadedAt: new Date().toISOString(),
      },
    },
  });

  return {
    configured: true,
    stored: { id, originalName: file.name, contentType, size: buffer.length },
  };
}

export type ReadUploadResult = {
  buffer: Buffer;
  contentType: string;
  originalName: string;
};

/**
 * Reads one stored file.
 *
 * CALLER CONTRACT: authenticate first. This function performs no authorisation
 * of its own, and its only caller is the admin-gated route in
 * app/api/laptop-bank/uploads/[id]. Do not call it from anywhere that a
 * visitor can reach.
 */
export async function readUpload(id: string): Promise<ReadUploadResult | null> {
  // The id came off a URL path. Reject anything that is not a plain UUID
  // before it can be concatenated into an object path — otherwise "../" or a
  // nested path would let a caller address objects outside PRIVATE_PREFIX.
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return null;

  const bucket = await getBucket();
  if (!bucket) return null;

  const object = bucket.file(`${PRIVATE_PREFIX}/${id}`);
  const [exists] = await object.exists();
  if (!exists) return null;

  const [buffer] = await object.download();
  const [metadata] = await object.getMetadata();

  return {
    buffer,
    contentType: String(metadata.contentType ?? "application/octet-stream"),
    originalName: String(metadata.metadata?.originalName ?? id),
  };
}
