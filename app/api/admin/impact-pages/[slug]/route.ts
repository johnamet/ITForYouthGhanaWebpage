import { auditedWrite } from "@/lib/cms/descriptors/audit";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/cms/admin-auth";
import {
  impactPageLabels,
  impactPagePreviewPaths,
  isImpactPageSlug,
  saveCmsImpactPage,
} from "@/lib/cms/impact-pages";
import { getRevalidationPaths } from "@/lib/utils/revalidate";
import { impactPageSchema } from "@/lib/utils/validators";

type ImpactPageRouteContext = {
  params: { slug: string };
};

export async function PUT(request: Request, { params }: ImpactPageRouteContext) {
  const unauthorized = await requireAdminApiSession();

  if (unauthorized) {
    return unauthorized;
  }

  if (!isImpactPageSlug(params.slug)) {
    return NextResponse.json(
      {
        success: false,
        message: "This impact page is not registered for CMS editing.",
      },
      { status: 404 },
    );
  }

  const payload = await request.json().catch(() => null);
  const parsed = impactPageSchema.safeParse(payload);

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

  // Hoisted so the narrowing from isImpactPageSlug survives into the closure.
  const slug = params.slug;

  const result = await auditedWrite({
    action: "update",
    resourceType: "impact-pages",
    resourceId: slug,
    summary: `Updated impact page ${slug}`,
    changes: parsed.data,
    write: () => saveCmsImpactPage(slug, parsed.data),
  });

  if (!result.configured) {
    return NextResponse.json(
      {
        success: false,
        message: `Firebase Admin is not configured yet, so ${impactPageLabels[params.slug]} cannot be saved.`,
      },
      { status: 503 },
    );
  }

  for (const path of getRevalidationPaths("impactPage", params.slug)) {
    revalidatePath(path);
  }

  revalidatePath(impactPagePreviewPaths[params.slug]);

  return NextResponse.json({
    success: true,
    message: `${impactPageLabels[params.slug]} updated.`,
    id: result.id,
  });
}
