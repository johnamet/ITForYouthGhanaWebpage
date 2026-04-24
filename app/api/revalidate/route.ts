import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { isValidRevalidationSecret } from "@/lib/utils/revalidate";

export async function POST(request: Request) {
  const payload = (await request.json()) as { paths?: string[]; secret?: string };

  if (!isValidRevalidationSecret(payload.secret)) {
    return NextResponse.json({ success: false, message: "Invalid secret." }, { status: 401 });
  }

  for (const path of payload.paths ?? []) {
    revalidatePath(path);
  }

  return NextResponse.json({ success: true, revalidated: payload.paths ?? [] });
}
