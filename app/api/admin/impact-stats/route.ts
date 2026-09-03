import { getCurrentAdminUser } from "@/lib/cms/admin-auth";
import { writeAuditLog } from "@/lib/cms/audit";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/cms/admin-auth";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { impactStatsSchema } from "@/lib/utils/validators";
import { getRevalidationPaths } from "@/lib/utils/revalidate";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

export async function PUT(request: Request) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) {
    return unauthorized;
  }

  const payload = await request.json().catch(() => null);
  const parsed = impactStatsSchema.safeParse(payload);

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

  const db = await getAdminFirestore();
  if (!db) {
    return NextResponse.json(
      {
        success: false,
        message: "Firebase Admin is not configured yet, so the impact stats cannot be saved.",
      },
      { status: 503 },
    );
  }

  const { FieldValue } = await import("firebase-admin/firestore");
  await db.collection(FIREBASE_COLLECTIONS.impactStats).doc("main").set(
    {
      stats: parsed.data.stats,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  for (const path of getRevalidationPaths("impactStats")) {
    revalidatePath(path);
  }

  // This route writes Firestore directly rather than through a CMS writer,
  // so the audit entry is recorded here instead of via auditedWrite.
  const actor = await getCurrentAdminUser();
  await writeAuditLog({
    action: "update",
    resourceType: "impact-stats",
    resourceId: "main",
    actor: actor ? { uid: actor.uid, email: actor.email, role: actor.role } : null,
    summary: "Updated impact statistics",
    changes: parsed.data,
  }).catch((error) => console.error("Audit entry failed for impact-stats", error));

  return NextResponse.json({ success: true, message: "Impact stats updated." });
}
