import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getCurrentAdminUser, requireAdminApiSession } from "@/lib/cms/admin-auth";
import { writeAuditLog } from "@/lib/cms/audit";
import {
  deleteRecord,
  missingRequiredFields,
  outOfRangeFields,
  projectRecord,
  saveRecord,
} from "@/lib/cms/laptop-bank-admin";
import { getContentTypeDescriptor } from "@/lib/content/laptop-bank-admin-schema";

/**
 * Rebuilds the public pages a descriptor declares.
 *
 * The pages these editors feed are statically prerendered, so their CMS reads
 * happen at build time. Without this an editor saves a change, sees a success
 * message, and the public page keeps showing the old copy until the next
 * deploy — the worst kind of bug, because nothing appears to be wrong.
 */
function revalidateFor(paths: string[] | undefined) {
  for (const path of paths ?? []) revalidatePath(path);
}

/** Updates one content record. */
export async function PUT(request: Request, { params }: { params: { type: string; id: string } }) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  const descriptor = getContentTypeDescriptor(params.type);
  if (!descriptor) {
    return NextResponse.json({ success: false, message: "Unknown content type." }, { status: 404 });
  }

  const payload = await request.json().catch(() => null);
  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const record = projectRecord(descriptor, payload as Record<string, unknown>);
  const missing = missingRequiredFields(descriptor, record);
  if (missing.length) {
    return NextResponse.json(
      { success: false, message: `Please fill in: ${missing.join(", ")}.` },
      { status: 400 },
    );
  }

  const outOfRange = outOfRangeFields(descriptor, record);
  if (outOfRange.length) {
    return NextResponse.json(
      { success: false, message: `Please check: ${outOfRange.join(", ")}.` },
      { status: 400 },
    );
  }

  const result = await saveRecord(descriptor.key, params.id, record);
  if (!result.configured) {
    return NextResponse.json(
      { success: false, message: "Firebase Admin is not configured yet." },
      { status: 503 },
    );
  }

  const current = await getCurrentAdminUser();
  await writeAuditLog({
    action: "update",
    resourceType: `laptop-bank-${descriptor.key}`,
    resourceId: params.id,
    actor: current ? { uid: current.uid, email: current.email, role: current.role } : null,
    summary: `Updated ${descriptor.label.toLowerCase()}`,
    changes: record,
  });

  revalidateFor(descriptor.revalidatePaths);

  return NextResponse.json({ success: true, message: `${descriptor.label} saved.` });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { type: string; id: string } },
) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  const descriptor = getContentTypeDescriptor(params.type);
  if (!descriptor) {
    return NextResponse.json({ success: false, message: "Unknown content type." }, { status: 404 });
  }

  if (descriptor.shape === "singleton") {
    return NextResponse.json(
      {
        success: false,
        // Deleting the metrics record would not "clear the dashboard" — the
        // public page reads a missing record as "nothing published yet", which
        // is achieved by emptying the fields instead. Refusing the delete
        // keeps the period label and last-updated date from being lost by
        // someone reaching for the wrong control.
        message: `${descriptor.label} is a single record and cannot be deleted. Clear its fields instead.`,
      },
      { status: 400 },
    );
  }

  const result = await deleteRecord(descriptor.key, params.id);
  if (!result.configured) {
    return NextResponse.json(
      { success: false, message: "Firebase Admin is not configured yet." },
      { status: 503 },
    );
  }

  const current = await getCurrentAdminUser();
  await writeAuditLog({
    action: "delete",
    resourceType: `laptop-bank-${descriptor.key}`,
    resourceId: params.id,
    actor: current ? { uid: current.uid, email: current.email, role: current.role } : null,
    summary: `Deleted ${descriptor.label.toLowerCase()}`,
  });

  revalidateFor(descriptor.revalidatePaths);

  return NextResponse.json({ success: true, message: `${descriptor.label} deleted.` });
}
