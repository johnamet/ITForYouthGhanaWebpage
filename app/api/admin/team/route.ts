import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getCurrentAdminUser, requireAdminApiSession } from "@/lib/cms/admin-auth";
import { saveCmsTeamMember } from "@/lib/cms/team";
import { teamSchema } from "@/lib/utils/validators";
import { getRevalidationPaths } from "@/lib/utils/revalidate";
import { writeAuditLog } from "@/lib/cms/audit";

function revalidateTeamRoutes() {
  for (const path of getRevalidationPaths("team")) {
    revalidatePath(path);
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApiSession();

  if (unauthorized) {
    return unauthorized;
  }

  const payload = await request.json().catch(() => null);
  const parsed = teamSchema.safeParse(payload);

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

  const result = await saveCmsTeamMember(parsed.data);

  if (!result.configured) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Firebase Admin is not configured yet, so the team member cannot be saved.",
      },
      { status: 503 },
    );
  }

  revalidateTeamRoutes();
  const current = await getCurrentAdminUser();
  await writeAuditLog({
    action: "create",
    resourceType: "team",
    resourceId: String(result.id),
    actor: current ? { uid: current.uid, email: current.email, role: current.role } : null,
    summary: `Created team member ${parsed.data.name}`,
    changes: { status: parsed.data.status, department: parsed.data.department },
  });
  return NextResponse.json({ success: true, message: "Team member saved.", id: result.id });
}
