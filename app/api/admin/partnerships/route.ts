import { auditedWrite } from "@/lib/cms/descriptors/audit";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/cms/admin-auth";
import { saveCmsPartnershipTrack } from "@/lib/cms/partnerships";
import { partnershipTrackSchema } from "@/lib/utils/validators";
import { getRevalidationPaths } from "@/lib/utils/revalidate";

export async function POST(request: Request) {
  const unauthorized = await requireAdminApiSession();
  if (unauthorized) return unauthorized;

  const payload = await request.json().catch(() => null);
  const parsed = partnershipTrackSchema.safeParse(payload);
  if (!parsed.success || !parsed.data.slug) {
    return NextResponse.json(
      { success: false, message: "Please provide a valid slug and check highlighted fields.", errors: parsed.success ? undefined : parsed.error.flatten() },
      { status: 400 },
    );
  }

  // Hoisted so the `!parsed.data.slug` guard above narrows inside the closure.
  const slug = parsed.data.slug;

  const result = await auditedWrite({
    action: "create",
    resourceType: "partnerships",
    resourceId: slug,
    summary: `Created partnership track ${slug}`,
    changes: parsed.data,
    write: () => saveCmsPartnershipTrack(slug, parsed.data),
  });
  if (!result.configured) {
    return NextResponse.json(
      { success: false, message: "Firebase Admin is not configured yet, so the track cannot be saved." },
      { status: 503 },
    );
  }

  for (const path of getRevalidationPaths("partnership", parsed.data.slug)) {
    revalidatePath(path);
  }

  return NextResponse.json({ success: true, message: "Partner track created.", id: parsed.data.slug });
}
