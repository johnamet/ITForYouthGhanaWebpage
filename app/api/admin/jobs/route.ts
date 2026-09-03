import { auditedWrite } from "@/lib/cms/descriptors/audit";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/cms/admin-auth";
import { saveCmsJob } from "@/lib/cms/jobs";
import { jobSchema } from "@/lib/utils/validators";
import { getRevalidationPaths } from "@/lib/utils/revalidate";

function revalidateJobRoutes() {
  for (const path of getRevalidationPaths("job")) {
    revalidatePath(path);
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApiSession();

  if (unauthorized) {
    return unauthorized;
  }

  const payload = await request.json().catch(() => null);
  const parsed = jobSchema.safeParse(payload);

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

  const result = await auditedWrite({
    action: "create",
    resourceType: "jobs",
    resourceId: (created) => created.id ?? "unknown",
    summary: `Created job ${parsed.data.title}`,
    changes: parsed.data,
    write: () => saveCmsJob(parsed.data),
  });

  if (!result.configured) {
    return NextResponse.json(
      {
        success: false,
        message: "Firebase Admin is not configured yet, so the job listing cannot be saved.",
      },
      { status: 503 },
    );
  }

  revalidateJobRoutes();

  return NextResponse.json({ success: true, message: "Job listing saved.", id: result.id });
}
