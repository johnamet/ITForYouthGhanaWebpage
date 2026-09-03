import { getCurrentAdminUser } from "@/lib/cms/admin-auth";
import { writeAuditLog } from "@/lib/cms/audit";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/cms/admin-auth";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { homepageSchema } from "@/lib/utils/validators";
import { getRevalidationPaths } from "@/lib/utils/revalidate";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

export async function PUT(request: Request) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) {
    return unauthorized;
  }

  const payload = await request.json().catch(() => null);
  const parsed = homepageSchema.safeParse(payload);

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
        message: "Firebase Admin is not configured yet, so the homepage cannot be saved.",
      },
      { status: 503 },
    );
  }

  const { FieldValue } = await import("firebase-admin/firestore");
  await db.collection(FIREBASE_COLLECTIONS.homepage).doc("main").set(
    {
      ...parsed.data,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  for (const path of getRevalidationPaths("homepage")) {
    revalidatePath(path);
  }

  // This route writes Firestore directly rather than through a CMS writer,
  // so the audit entry is recorded here instead of via auditedWrite.
  const actor = await getCurrentAdminUser();
  await writeAuditLog({
    action: "update",
    resourceType: "homepage",
    resourceId: "main",
    actor: actor ? { uid: actor.uid, email: actor.email, role: actor.role } : null,
    summary: "Updated homepage content",
    changes: parsed.data,
  }).catch((error) => console.error("Audit entry failed for homepage", error));

  return NextResponse.json({ success: true, message: "Homepage updated." });
}
