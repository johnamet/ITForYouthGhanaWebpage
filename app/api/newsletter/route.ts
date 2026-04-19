import { NextResponse } from "next/server";

import { newsletterSchema } from "@/lib/utils/validators";

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = newsletterSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ success: false, errors: parsed.error.flatten() }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message: "Newsletter endpoint scaffolded. Brevo wiring can now plug into this route.",
    data: parsed.data,
  });
}
