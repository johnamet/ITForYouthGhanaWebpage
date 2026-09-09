import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

import {
  getAdminSessionCookieName,
  verifyAdminSessionCookie,
} from "@/lib/firebase/auth";

export async function getCurrentAdminUser() {
  const sessionCookie = cookies().get(getAdminSessionCookieName())?.value;

  return verifyAdminSessionCookie(sessionCookie).catch((error) => {
    console.error("Admin session verification failed", error);
    return null;
  });
}

/**
 * Page-level auth guard. Returns the signed-in admin, or redirects to the
 * login page. Shared by every admin layout so the redirect target cannot
 * drift between them.
 */
export async function requireAdminPage() {
  const adminUser = await getCurrentAdminUser();

  if (!adminUser) {
    redirect("/admin-login");
  }

  return adminUser;
}

export async function requireAdminApiSession() {
  const user = await getCurrentAdminUser();

  if (user) {
    return null;
  }

  return NextResponse.json(
    {
      success: false,
      message: "Please sign in before managing CMS content.",
    },
    { status: 401 },
  );
}
