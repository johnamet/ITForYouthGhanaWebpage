import { NextResponse } from "next/server";

import { contactSchema } from "@/lib/utils/validators";

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ success: false, errors: parsed.error.flatten() }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message: "Contact endpoint scaffolded. Delivery integration is the next phase.",
    data: parsed.data,
  });
}
