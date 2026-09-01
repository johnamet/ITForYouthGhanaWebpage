import { NextResponse } from "next/server";

import { getCurrentAdminUser } from "@/lib/cms/admin-auth";
import { readUpload } from "@/lib/laptop-bank/uploads";

/**
 * The only read path for a file submitted through a Laptop Bank form.
 *
 * Spec §7: "Uploaded enrolment documents are stored outside the public web
 * root and served only through an authenticated route. No guessable URLs."
 *
 * Authorisation is checked HERE rather than by widening middleware.ts's
 * matcher, for two reasons. First, the middleware redirects an unauthenticated
 * caller to /admin-login, and a redirect is itself a disclosure: it tells the
 * caller the route exists and behaves differently from a miss. Second, an id
 * that does not exist and an id the caller may not read must be
 * indistinguishable — so both return 404, never 401 or 403. A caller learns
 * nothing about which ids are real.
 *
 * It uses getCurrentAdminUser(), which cryptographically verifies the Firebase
 * session cookie, NOT a bare `cookies().has(...)` presence check. The
 * middleware's presence check is only a first gate in front of routes that
 * verify properly themselves; relying on presence alone here would mean a
 * forged cookie value could read an applicant's student ID scan. This is the
 * most sensitive data on the site, so it gets the same verification the admin
 * API routes use.
 *
 * Draft 1 §14.2 also asks that access to applicant records be logged. The
 * console line below is the minimum honest version of that; a durable audit
 * trail belongs in lib/cms/audit.ts and is not built here.
 */
export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const admin = await getCurrentAdminUser();

  if (!admin) {
    // 404, not 401 — see the note above.
    return new NextResponse("Not found", { status: 404 });
  }

  const upload = await readUpload(params.id).catch((error) => {
    console.error("Laptop Bank upload read failed", error);
    return null;
  });

  if (!upload) {
    return new NextResponse("Not found", { status: 404 });
  }

  // Draft 1 §14.2 asks that access to applicant records be logged. Recording
  // who, not just what — an access log without an identity answers the wrong
  // question. A durable audit trail belongs in lib/cms/audit.ts; this is the
  // minimum honest version.
  console.info(`Laptop Bank upload ${params.id} accessed by ${admin.uid}`);

  return new NextResponse(new Uint8Array(upload.buffer), {
    status: 200,
    headers: {
      "Content-Type": upload.contentType,
      // `attachment` rather than `inline`: an uploaded file is
      // attacker-controlled content, and rendering it in the browser on our
      // own origin would allow stored XSS via an SVG or HTML payload.
      "Content-Disposition": `attachment; filename="${upload.originalName.replace(/["\\]/g, "")}"`,
      // Never cached by a proxy or a shared browser cache.
      "Cache-Control": "private, no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
