import { NextResponse } from "next/server";

import { applicationSchema } from "@/lib/utils/validators";

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = applicationSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ success: false, errors: parsed.error.flatten() }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message: "Application endpoint scaffolded. Persistence and notifications come next.",
    data: parsed.data,
  });
}
