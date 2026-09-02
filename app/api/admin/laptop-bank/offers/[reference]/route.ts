import { NextResponse } from "next/server";

import { getCurrentAdminUser, requireAdminApiSession } from "@/lib/cms/admin-auth";
import { writeAuditLog } from "@/lib/cms/audit";
import { deleteSubmission, updateSubmission } from "@/lib/cms/laptop-bank-submissions";
import { equipmentOfferAdminUpdateSchema } from "@/lib/utils/validators";

const KIND = "equipment-offer" as const;
const RESOURCE_TYPE = "laptop-bank-offers";

/**
 * Review actions on one corporate equipment offer.
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
  const parsed = equipmentOfferAdminUpdateSchema.safeParse(payload);
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

  const current = await getCurrentAdminUser();
  await writeAuditLog({
    action: "update",
    resourceType: RESOURCE_TYPE,
    resourceId: params.reference,
    actor: current ? { uid: current.uid, email: current.email, role: current.role } : null,
    summary: `Set ${params.reference} to ${parsed.data.status}`,
    changes: parsed.data,
  });

  return NextResponse.json({ success: true, message: "Review saved." });
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
