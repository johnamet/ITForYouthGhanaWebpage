import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/cms/admin-auth";
import { deleteCmsTeamMember, getCmsTeamMemberById, saveCmsTeamMember } from "@/lib/cms/team";
import { teamSchema } from "@/lib/utils/validators";
import { getRevalidationPaths } from "@/lib/utils/revalidate";

type TeamRouteProps = {
  params: { id: string };
};

function revalidateTeamRoutes() {
  for (const path of getRevalidationPaths("team")) {
    revalidatePath(path);
  }
}

export async function PUT(request: Request, { params }: TeamRouteProps) {
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

  const existing = await getCmsTeamMemberById(params.id);
  const documentId = existing?.id ?? params.id;
  const result = await saveCmsTeamMember(parsed.data, documentId);

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

  return NextResponse.json({ success: true, message: "Team member updated.", id: result.id });
}

export async function DELETE(_request: Request, { params }: TeamRouteProps) {
  const unauthorized = await requireAdminApiSession();

  if (unauthorized) {
    return unauthorized;
  }

  const existing = await getCmsTeamMemberById(params.id);
  const documentId = existing?.id ?? params.id;
  const result = await deleteCmsTeamMember(documentId);

  if (!result.configured) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Firebase Admin is not configured yet, so the team member cannot be deleted.",
      },
      { status: 503 },
    );
  }

  revalidateTeamRoutes();

  return NextResponse.json({ success: true, message: "Team member deleted.", id: result.id });
}
