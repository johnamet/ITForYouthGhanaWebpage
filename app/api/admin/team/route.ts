import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/cms/admin-auth";
import { saveCmsTeamMember } from "@/lib/cms/team";
import { teamSchema } from "@/lib/utils/validators";
import { getRevalidationPaths } from "@/lib/utils/revalidate";

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

  return NextResponse.json({ success: true, message: "Team member saved.", id: result.id });
}
