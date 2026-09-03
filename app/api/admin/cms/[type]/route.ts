import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getCurrentAdminUser, requireAdminApiSession } from "@/lib/cms/admin-auth";
import { writeAuditLog } from "@/lib/cms/audit";
import {
  missingRequiredFields,
  outOfRangeFields,
  projectRecord,
  resolveFieldsForWrite,
  saveRecord,
} from "@/lib/cms/descriptors/crud";
import { getDescriptor } from "@/lib/cms/descriptors/registry";
import { isSeedCollection } from "@/lib/cms/descriptors/seed-collections";

/**
 * Creates one content record.
 *
 * Validation is descriptor-driven rather than a hand-written zod object per
 * type: the descriptor already declares every field, its kind and whether it
 * is required, so a second declaration in a schema file would be a second
 * thing to keep in step. `projectRecord` drops any key the descriptor does not
 * declare, which is the part that makes this safe — a tampered body cannot
 * write an undeclared field.
 */
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

export async function POST(request: Request, { params }: { params: { type: string } }) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  const descriptor = getDescriptor(params.type);
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

  /**
   * A seed-backed collection only accepts new records when it says so.
   *
   * Initiatives do not: an initiative is a programme with its own routing and
   * imagery, so one added through a form would be a page nothing links to.
   * Adding it to the seed makes it editable here with no migration.
   */
  if (!(descriptor.allowCreate ?? !isSeedCollection(descriptor))) {
    return NextResponse.json(
      {
        success: false,
        message: `${descriptor.plural} are part of the site's structure and are added in code, not here. Edit an existing one instead.`,
      },
      { status: 400 },
    );
  }

  const payload = await request.json().catch(() => null);
  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const fields = await resolveFieldsForWrite(descriptor, undefined);
  const record = projectRecord(descriptor, payload as Record<string, unknown>, fields);
  const missing = missingRequiredFields(descriptor, record, fields);
  if (missing.length) {
    return NextResponse.json(
      { success: false, message: `Please fill in: ${missing.join(", ")}.` },
      { status: 400 },
    );
  }

  const outOfRange = outOfRangeFields(descriptor, record, fields);
  if (outOfRange.length) {
    return NextResponse.json(
      { success: false, message: `Please check: ${outOfRange.join(", ")}.` },
      { status: 400 },
    );
  }

  const result = await saveRecord(descriptor.key, undefined, record, fields);
  if (!result.configured) {
    return NextResponse.json(
      { success: false, message: "Firebase Admin is not configured yet." },
      { status: 503 },
    );
  }

  const current = await getCurrentAdminUser();
  await writeAuditLog({
    action: "create",
    resourceType: `cms-${descriptor.key}`,
    resourceId: result.id ?? "unknown",
    actor: current ? { uid: current.uid, email: current.email, role: current.role } : null,
    summary: `Created ${descriptor.label.toLowerCase()}`,
    changes: record,
  });

  revalidateFor(descriptor.revalidatePaths);

  return NextResponse.json({
    success: true,
    message: `${descriptor.label} created.`,
    id: result.id,
  });
}
