import { NextResponse } from "next/server";

import { LAPTOP_BANK_PRIVACY_NOTICE_HREF } from "@/lib/content/laptop-bank-config";
import { herFirstLaptopApplyContent } from "@/lib/content/her-first-laptop-config";
import { sendLaptopBankAcknowledgement, sendLaptopBankStaffNotification } from "@/lib/email/laptop-bank-notification";
import { storeUpload } from "@/lib/laptop-bank/uploads";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { checkRateLimit, rateLimitKeyFromRequest } from "@/lib/utils/rate-limit";
import { applyReference, generateReference } from "@/lib/utils/reference";
import { studentApplicationSchema } from "@/lib/utils/validators";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

const PROOF_MAX_BYTES = 5 * 1024 * 1024;
const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "https://itforyouthghana.org";

/**
 * Form 6.2 — Her First Laptop student application (build spec 5.8, §6.2).
 *
 * Handles the most sensitive data on this site: a name, a phone number, an
 * institution, a student identifier, an enrolment document, and a free-text
 * account of someone's circumstances. Spec §7 and Draft 1 §14.2 both govern
 * what may be done with it, and three rules shape this handler:
 *
 * 1. The uploaded document goes to private storage under an opaque UUID and is
 *    readable only through the admin-gated route. Never a public URL.
 * 2. The staff notification carries a reference and a link only. No personal
 *    data in the email body.
 * 3. Each consent is stored as its own boolean with its own timestamp, never
 *    bundled.
 */
export async function POST(request: Request) {
  const limit = checkRateLimit(rateLimitKeyFromRequest(request, "her-first-laptop-apply"));
  if (!limit.allowed) {
    return NextResponse.json(
      {
        success: false,
        message: "That is a few submissions in a short time. Please wait a moment and try again.",
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const form = await request.formData().catch(() => null);
  if (!form) {
    return NextResponse.json(
      { success: false, message: "We could not read that application. Please try again." },
      { status: 400 },
    );
  }

  const raw: Record<string, unknown> = {};
  for (const key of new Set(Array.from(form.keys()))) {
    if (key === "proofOfEnrolment") continue;
    const value = form.get(key);
    if (typeof value === "string") raw[key] = value;
  }

  const parsed = studentApplicationSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Please check the highlighted fields and try again.",
        errors: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  // Honeypot: accept and discard, storing nothing.
  if (parsed.data.companyFax) {
    return NextResponse.json({
      success: true,
      message: "Your application is in.",
      confirmation: "Your application is in.",
    });
  }

  // ─── Proof of enrolment ────────────────────────────────────────────────────

  const proof = form.get("proofOfEnrolment");
  if (!(proof instanceof File) || proof.size === 0) {
    return NextResponse.json(
      {
        success: false,
        message: "Please attach your proof of enrolment.",
        errors: { fieldErrors: { proofOfEnrolment: ["Please attach a photograph or scan."] } },
      },
      { status: 400 },
    );
  }

  if (proof.size > PROOF_MAX_BYTES) {
    return NextResponse.json(
      {
        success: false,
        message: "Please attach a proof of enrolment under 5 MB.",
        errors: { fieldErrors: { proofOfEnrolment: ["Please choose a file under 5 MB."] } },
      },
      { status: 400 },
    );
  }

  const reference = generateReference("HFL");

  const upload = await storeUpload(proof, { reference, form: "student-application" }).catch(
    (error) => {
      console.error("Her First Laptop proof upload failed", error);
      return { configured: true as const, stored: undefined };
    },
  );

  // ─── Persist ───────────────────────────────────────────────────────────────

  const submission = { ...parsed.data };
  // Never stored: it is never legitimate content, and keeping it would put
  // attacker-controlled text on an applicant's record.
  delete submission.companyFax;

  const now = new Date().toISOString();

  const record = {
    ...submission,
    reference,
    /**
     * Spec §7: "Store each consent as its own boolean with a timestamp." Kept
     * as separate entries rather than one object with one timestamp, because
     * the point of the rule is that each permission can be evidenced
     * independently — including the optional story consent, whose absence is
     * as important to record as its presence.
     */
    consents: {
      commitmentCompleteTrack: { given: submission.commitmentCompleteTrack, at: now },
      commitmentPeerTeaching: { given: submission.commitmentPeerTeaching, at: now },
      commitmentCheckIns: { given: submission.commitmentCheckIns, at: now },
      loanToOwnTerms: { given: submission.loanToOwnTerms, at: now },
      declarationOfTruth: { given: submission.declarationOfTruth, at: now },
      privacy: { given: submission.privacyConsent, at: now },
      storyAndPhoto: { given: submission.storyAndPhotoConsent, at: now },
    },
    proofOfEnrolmentUploadId: upload.stored?.id ?? null,
    // Recorded, not swallowed. Draft 1 §14.5: upload failure is the fault most
    // likely to be silently losing applicants, so a reviewer must be able to
    // see that this application arrived without its document.
    proofOfEnrolmentStorageFailed: !upload.stored,
    status: "new",
    source: "website",
    createdAt: now,
  };

  let persisted = false;
  const db = await getAdminFirestore();
  if (db) {
    try {
      await db.collection(FIREBASE_COLLECTIONS.laptopBankApplications).doc(reference).set(record);
      persisted = true;
    } catch (error) {
      console.error("Her First Laptop application persistence failed", error);
    }
  }

  const staffNotification = await sendLaptopBankStaffNotification("student-application", reference);

  if (!persisted && !staffNotification.delivered && (Boolean(db) || staffNotification.configured)) {
    return NextResponse.json(
      {
        success: false,
        message:
          "We could not record your application right now. Please try again in a few minutes — your answers are saved on this device.",
      },
      { status: 502 },
    );
  }

  // ─── Confirm to the applicant ──────────────────────────────────────────────

  const confirmation = applyReference(herFirstLaptopApplyContent.confirmation, reference);

  /*
   * TODO(spec 5.8): SMS is the primary confirmation channel — "On submit: send
   * confirmation by SMS and email. SMS is the primary channel." No SMS
   * provider is configured in this repository, so only the email is sent
   * below. This is the single place a provider slots in: send to
   * `submission.phone` with `confirmation` as the body. Deliberately not
   * faked, and not reported as sent.
   */
  if (submission.email) {
    await sendLaptopBankAcknowledgement({
      toEmail: submission.email,
      toName: submission.preferredName || submission.fullName,
      subject: `Your Her First Laptop application — ${reference}`,
      bodyText: confirmation,
      privacyNoticeUrl: `${SITE_ORIGIN}${LAPTOP_BANK_PRIVACY_NOTICE_HREF}`,
    });
  }

  return NextResponse.json({
    success: true,
    reference,
    confirmation,
    message: confirmation,
    persistence: persisted ? "firestore" : db ? "failed" : "not-configured",
    // Named honestly so a caller cannot mistake this for an SMS having gone out.
    smsDelivery: "not-configured",
  });
}
