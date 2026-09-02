import { NextResponse } from "next/server";

import { getCurrentAdminUser, requireAdminApiSession } from "@/lib/cms/admin-auth";
import { writeAuditLog } from "@/lib/cms/audit";
import {
  missingRequiredFields,
  projectRecord,
  saveRecord,
} from "@/lib/cms/laptop-bank-admin";
import { getContentTypeDescriptor } from "@/lib/content/laptop-bank-admin-schema";

/**
 * Creates one Laptop Bank content record (build spec §4).
 *
 * Validation is descriptor-driven rather than a hand-written zod object per
 * type: the descriptor already declares every field, its kind and whether it
 * is required, so a second declaration in a schema file would be a second
 * thing to keep in step. `projectRecord` drops any key the descriptor does not
 * declare, which is the part that makes this safe — a tampered body cannot
 * write an undeclared field.
 */
export async function POST(request: Request, { params }: { params: { type: string } }) {
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
        message: `${descriptor.label} is a single record. Edit the existing one instead of creating another.`,
      },
      { status: 400 },
    );
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

  const result = await saveRecord(descriptor.key, undefined, record);
  if (!result.configured) {
    return NextResponse.json(
      { success: false, message: "Firebase Admin is not configured yet." },
      { status: 503 },
    );
  }

  const current = await getCurrentAdminUser();
  await writeAuditLog({
    action: "create",
    resourceType: `laptop-bank-${descriptor.key}`,
    resourceId: result.id ?? "unknown",
    actor: current ? { uid: current.uid, email: current.email, role: current.role } : null,
    summary: `Created ${descriptor.label.toLowerCase()}`,
    changes: record,
  });

  return NextResponse.json({
    success: true,
    message: `${descriptor.label} created.`,
    id: result.id,
  });
}
