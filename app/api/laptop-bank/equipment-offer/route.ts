import { NextResponse } from "next/server";

import {
  sendLaptopBankAcknowledgement,
  sendLaptopBankStaffNotification,
} from "@/lib/email/laptop-bank-notification";
import { storeUpload } from "@/lib/laptop-bank/uploads";
import {
  LAPTOP_BANK_PRIVACY_NOTICE_HREF,
  laptopBankDonateEquipmentContent,
} from "@/lib/content/laptop-bank-config";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { getTokenValues } from "@/lib/cms/laptop-bank-tokens";
import { resolveTokens } from "@/lib/content/laptop-bank-tokens";
import { checkRateLimit, rateLimitKeyFromRequest } from "@/lib/utils/rate-limit";
import { applyReference, generateReference } from "@/lib/utils/reference";
import { equipmentOfferSchema, isFreeWebmail } from "@/lib/utils/validators";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

const ASSET_LIST_MAX_BYTES = 10 * 1024 * 1024;
const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "https://itforyouthghana.org";

/**
 * Form 6.1 — corporate equipment offer (build spec 5.5, §6.1).
 *
 * Order of operations, and the reason for it:
 *
 * 1. Rate limit, before anything is parsed. Spec §6.1 requires server-side
 *    rate limiting; doing it first means a flood costs us no parsing or I/O.
 * 2. Schema parse.
 * 3. Honeypot. A caught submission returns a normal success response and
 *    stores nothing — telling a bot it was detected only helps it adapt.
 * 4. Generate the reference, store the asset list, persist, then notify.
 *
 * Spec §7 governs the emails: the staff notification carries a reference and a
 * link only. This route therefore does NOT reuse
 * lib/email/contact-notification.ts, which composes the whole submission into
 * its body — see the note at the top of lib/email/laptop-bank-notification.ts.
 */
export async function POST(request: Request) {
  const limit = checkRateLimit(rateLimitKeyFromRequest(request, "laptop-bank-offer"));
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
      { success: false, message: "We could not read that submission. Please try again." },
      { status: 400 },
    );
  }

  // getAll for the one multiselect; get for everything else. Checkbox values
  // arrive as the strings "true"/"false", which the schema's preprocessors
  // already coerce.
  const raw: Record<string, unknown> = {};
  for (const key of new Set(Array.from(form.keys()))) {
    if (key === "assetList") continue;
    const values = form.getAll(key).filter((value): value is string => typeof value === "string");
    raw[key] = key === "equipmentTypes" ? values : values[0];
  }

  const parsed = equipmentOfferSchema.safeParse(raw);
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

  // Honeypot: accept and discard. Spec §6.1 BEHAVIOUR.
  if (parsed.data.companyFax) {
    return NextResponse.json({
      success: true,
      message: "Thank you. Your offer has been received.",
      confirmation: "Thank you. Your offer has been received.",
    });
  }

  const reference = generateReference("LB");

  // ─── Asset list ────────────────────────────────────────────────────────────

  const assetList = form.get("assetList");
  let storedAssetListId: string | undefined;
  let assetListStorageFailed = false;

  if (assetList instanceof File && assetList.size > 0) {
    if (assetList.size > ASSET_LIST_MAX_BYTES) {
      return NextResponse.json(
        {
          success: false,
          message: "Please check the highlighted fields and try again.",
          errors: { fieldErrors: { assetList: ["Please attach a file under 10 MB."] } },
        },
        { status: 400 },
      );
    }

    const upload = await storeUpload(assetList, { reference, form: "equipment-offer" }).catch(
      (error) => {
        console.error("Equipment offer asset list upload failed", error);
        return { configured: true as const, stored: undefined };
      },
    );
    storedAssetListId = upload.stored?.id;
    // Recorded rather than swallowed. Draft 1 §14.5 names silent upload
    // failures as the fault most likely to be quietly losing submissions, so
    // an offer whose asset list did not store must say so on the record.
    assetListStorageFailed = !upload.stored;
  }

  // ─── Persist ───────────────────────────────────────────────────────────────

  // The honeypot value is dropped rather than stored: it is never legitimate
  // content, and keeping it would put attacker-controlled text on the record.
  const submission = { ...parsed.data };
  delete submission.companyFax;

  const record = {
    ...submission,
    reference,
    // Spec §6.1: a non-Ghana country sets the import flag.
    import_flag: submission.country !== "Ghana",
    // Spec §6.1: "Drives retained by you — Yes sets crm.needs_storage = true".
    needs_storage: submission.drivesRetainedByYou === "yes",
    /**
     * Spec §6.1 step 3: public recognition "writes directly to
     * Donor.display_consent". Carried through under that field name so the
     * Donor record can be created from this submission without a second
     * mapping step and without anyone guessing what the donor agreed to.
     */
    display_consent: submission.publicRecognition,
    // Soft signal only. Spec §6.1 is explicit that a free webmail address
    // must never block: this flags it for follow-up and nothing more.
    free_webmail: isFreeWebmail(submission.workEmail),
    // Each consent stored as its own boolean with a timestamp — spec §7.
    consents: {
      privacy: { given: submission.privacyConsent, at: new Date().toISOString() },
      marketing: { given: submission.marketingConsent, at: new Date().toISOString() },
    },
    assetListUploadId: storedAssetListId ?? null,
    assetListStorageFailed,
    status: "new",
    source: "website",
    createdAt: new Date().toISOString(),
  };

  let persisted = false;
  const db = await getAdminFirestore();
  if (db) {
    try {
      await db.collection(FIREBASE_COLLECTIONS.laptopBankOffers).doc(reference).set(record);
      persisted = true;
    } catch (error) {
      console.error("Equipment offer persistence failed", error);
    }
  }

  // ─── Notify ────────────────────────────────────────────────────────────────

  const staffNotification = await sendLaptopBankStaffNotification("equipment-offer", reference);

  // Resolve {{TOKEN}} placeholders before this reaches a person. The copy
  // carries them so the CMS stays the single source, but a submitter must
  // never receive "{{SLA_REPLY}}" in a confirmation.
  const confirmation = resolveTokens(
    applyReference(laptopBankDonateEquipmentContent.confirmation, reference),
    await getTokenValues(),
  );

  await sendLaptopBankAcknowledgement({
    toEmail: submission.workEmail,
    toName: submission.contactName,
    subject: `Your equipment offer to the IT for Youth Laptop Bank — ${reference}`,
    bodyText: confirmation,
    privacyNoticeUrl: `${SITE_ORIGIN}${LAPTOP_BANK_PRIVACY_NOTICE_HREF}`,
    // The corporate pack PDF is awaited (spec §11). Until it exists the
    // acknowledgement links to the documents page rather than promising an
    // attachment that is not there.
    packUrl: `${SITE_ORIGIN}/policies/laptop-bank-documents`,
  });

  if (!persisted && !staffNotification.delivered) {
    // Nothing recorded the submission anywhere. Say so rather than showing a
    // confirmation the organisation would rely on.
    const configured = Boolean(db) || staffNotification.configured;
    if (configured) {
      return NextResponse.json(
        {
          success: false,
          message:
            "We could not record your offer right now. Please try again, or email the team directly.",
        },
        { status: 502 },
      );
    }
  }

  return NextResponse.json({
    success: true,
    reference,
    confirmation,
    message: confirmation,
    persistence: persisted ? "firestore" : db ? "failed" : "not-configured",
    delivery: staffNotification.delivered ? "brevo" : "not-delivered",
  });
}
