import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/cms/admin-auth";
import {
  deleteCmsTestimonial,
  getCmsTestimonialById,
  saveCmsTestimonial,
} from "@/lib/cms/testimonials";
import { testimonialSchema } from "@/lib/utils/validators";
import { getRevalidationPaths } from "@/lib/utils/revalidate";

type TestimonialRouteProps = {
  params: {
    id: string;
  };
};

function revalidateTestimonialRoutes() {
  for (const path of getRevalidationPaths("testimonials")) {
    revalidatePath(path);
  }
}

export async function PUT(request: Request, { params }: TestimonialRouteProps) {
  const unauthorized = await requireAdminApiSession();

  if (unauthorized) {
    return unauthorized;
  }

  const payload = await request.json().catch(() => null);
  const parsed = testimonialSchema.safeParse(payload);

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

  const existing = await getCmsTestimonialById(params.id);
  const documentId = existing?.id ?? params.id;
  const result = await saveCmsTestimonial(parsed.data, documentId);

  if (!result.configured) {
    return NextResponse.json(
      {
        success: false,
        message: "Firebase Admin is not configured yet, so the testimonial cannot be saved.",
      },
      { status: 503 },
    );
  }

  revalidateTestimonialRoutes();

  return NextResponse.json({
    success: true,
    message: "Testimonial updated.",
    id: result.id,
  });
}

export async function DELETE(_request: Request, { params }: TestimonialRouteProps) {
  const unauthorized = await requireAdminApiSession();

  if (unauthorized) {
    return unauthorized;
  }

  const existing = await getCmsTestimonialById(params.id);
  const documentId = existing?.id ?? params.id;
  const result = await deleteCmsTestimonial(documentId);

  if (!result.configured) {
    return NextResponse.json(
      {
        success: false,
        message: "Firebase Admin is not configured yet, so the testimonial cannot be deleted.",
      },
      { status: 503 },
    );
  }

  revalidateTestimonialRoutes();

  return NextResponse.json({
    success: true,
    message: "Testimonial deleted.",
    id: result.id,
  });
}
