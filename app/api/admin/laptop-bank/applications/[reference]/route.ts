import { NextResponse } from "next/server";

import { getCurrentAdminUser, requireAdminApiSession } from "@/lib/cms/admin-auth";
import { writeAuditLog } from "@/lib/cms/audit";
import {
  deleteSubmission,
  getStudentApplication,
  updateSubmission,
} from "@/lib/cms/laptop-bank-submissions";
import { LAPTOP_BANK_PRIVACY_NOTICE_HREF } from "@/lib/content/laptop-bank-config";
import { hasOutcomeEmail, sendApplicationOutcome } from "@/lib/email/laptop-bank-notification";
import { studentApplicationAdminUpdateSchema } from "@/lib/utils/validators";

const KIND = "student-application" as const;
const RESOURCE_TYPE = "laptop-bank-applications";
const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "https://itforyouthghana.org";

/**
 * Review actions on one Her First Laptop application.
 *
 * Same shape as every other admin route in this repo: session first, zod
 * second, 503 when Firebase is unconfigured, then an audit entry naming the
 * actor. Draft 1 §14.2 asks that access to applicant records be logged, and a
 * status change is the action most worth having a trail for — it is the
 * decision itself.
 */
export async function PUT(request: Request, { params }: { params: { reference: string } }) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  const payload = await request.json().catch(() => null);
  const parsed = studentApplicationAdminUpdateSchema.safeParse(payload);
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

  const result = await updateSubmission(KIND, params.reference, parsed.data);
  if (!result.configured) {
    return NextResponse.json(
      { success: false, message: "Firebase Admin is not configured yet." },
      { status: 503 },
    );
  }

  // ── Optionally tell the applicant ──────────────────────────────────────────
  //
  // Only when the reviewer asked for it, and only for a status that has an
  // outcome letter. Draft 1 §14.6: "The not-selected email matters more than
  // the offer email. You will send far more of them, and each one either
  // protects or damages your standing with a student who talks to other
  // students."
  //
  // Spec 5.8 makes SMS the primary channel and §6.2 makes email optional on
  // the form, so an applicant may have no address. That is reported back
  // plainly rather than silently doing nothing — the reviewer then reaches her
  // by phone or WhatsApp.
  let notified: "sent" | "no-email" | "not-configured" | "failed" | "not-requested" =
    "not-requested";

  if (parsed.data.notifyApplicant && hasOutcomeEmail(parsed.data.status)) {
    const application = await getStudentApplication(params.reference);
    if (!application?.email) {
      notified = "no-email";
    } else {
      const result = await sendApplicationOutcome({
        outcome: parsed.data.status,
        toEmail: application.email,
        toName: application.preferredName || application.fullName,
        reference: params.reference,
        privacyNoticeUrl: `${SITE_ORIGIN}${LAPTOP_BANK_PRIVACY_NOTICE_HREF}`,
      });
      notified = result.delivered ? "sent" : result.configured ? "failed" : "not-configured";
    }
  }

  const current = await getCurrentAdminUser();
  await writeAuditLog({
    action: "update",
    resourceType: RESOURCE_TYPE,
    resourceId: params.reference,
    actor: current ? { uid: current.uid, email: current.email, role: current.role } : null,
    summary: `Set ${params.reference} to ${parsed.data.status}${
      notified === "sent" ? " and emailed the applicant" : ""
    }`,
    // Recorded because "was she told, and when" is the question this log will
    // actually be asked, and Draft 1 wants every applicant to get an answer.
    changes: { ...parsed.data, applicantNotified: notified },
  });

  const NOTICE: Record<typeof notified, string> = {
    "not-requested": "Review saved.",
    sent: "Review saved, and the applicant has been emailed her outcome.",
    "no-email": "Review saved. She gave no email address, so contact her by phone or WhatsApp.",
    "not-configured": "Review saved. Email is not configured, so no message was sent.",
    failed: "Review saved, but the email could not be sent. Please contact her directly.",
  };

  return NextResponse.json({ success: true, message: NOTICE[notified], notified });
}

export async function DELETE(_request: Request, { params }: { params: { reference: string } }) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  const result = await deleteSubmission(KIND, params.reference);
  if (!result.configured) {
    return NextResponse.json(
      { success: false, message: "Firebase Admin is not configured yet." },
      { status: 503 },
    );
  }

  const current = await getCurrentAdminUser();
  await writeAuditLog({
    action: "delete",
    resourceType: RESOURCE_TYPE,
    resourceId: params.reference,
    actor: current ? { uid: current.uid, email: current.email, role: current.role } : null,
    summary: `Deleted ${params.reference}`,
  });

  return NextResponse.json({ success: true, message: "Submission deleted." });
}
