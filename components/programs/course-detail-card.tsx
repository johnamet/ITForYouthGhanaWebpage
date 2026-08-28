import Image from "next/image";
import Link from "next/link";
import { PlayCircle } from "lucide-react";

import { pointsToParagraph } from "@/lib/utils/prose";
import { resolveCourseImage } from "@/lib/utils/image-src";
import type { Course } from "@/types/course";

type CourseDetailCardProps = {
  course: Course | null;
  fallbackTitle: string;
};

function formatPrice(course: Course) {
  if (course.pricing.isFree || course.pricing.amount === 0) {
    return "Free";
  }
  if (typeof course.pricing.amount === "number") {
    return `${course.pricing.currency} ${course.pricing.amount.toLocaleString()}`;
  }
  return "See details";
}

function formatDate(value: string | null) {
  if (!value) {
    return "Shared after review";
  }

  return new Intl.DateTimeFormat("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function CourseDetailCard({ course, fallbackTitle }: CourseDetailCardProps) {
  if (!course) {
    return (
      <div className="rounded-[32px] border border-dashed border-brand-border bg-white p-8 shadow-sm">
        <h1 className="font-heading text-3xl font-semibold text-brand-ink">{fallbackTitle}</h1>
        <p className="mt-4 max-w-prose text-base leading-8 text-slate-600">
          This course route is active, but the course API did not return details for this slug.
          The browse catalogue remains wired for runtime requests from the configured endpoint.
        </p>
        <Link
          href="/apply-for-training/courses"
          className="mt-6 inline-flex text-sm font-semibold text-brand-navy"
        >
          Back to courses
        </Link>
      </div>
    );
  }

  const objectives = course.objectives ?? [];
  const requirements = course.requirements ?? [];
  const includedItems = course.includedItems ?? [];
  const tags = course.tags ?? [];
  const teachers = course.teachers ?? [];

  return (
    <article className="overflow-hidden rounded-[32px] border border-brand-border bg-white shadow-sm">
      <div className="relative min-h-[360px] bg-brand-mist">
        <Image
          src={resolveCourseImage(course.image)}
          alt={course.title}
          fill
          priority
          sizes="(max-width: 1023px) 100vw, 1024px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-brand-navy/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
          <Link
            href="/apply-for-training/courses"
            className="mb-6 inline-flex rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-brand-navy transition hover:bg-white"
          >
            Back to courses
          </Link>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold">
            {course.category}
          </p>
          <h1 className="mt-3 max-w-4xl font-heading text-4xl font-semibold leading-tight text-white sm:text-5xl">
            {course.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-white/85">{course.shortDescription}</p>
          {tags.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/40 bg-white/10 px-3 py-1 text-xs font-semibold text-white"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_320px] lg:p-10">
        <div>
          {course.descriptionHtml ? (
            <div
              className="course-prose"
              dangerouslySetInnerHTML={{ __html: course.descriptionHtml }}
            />
          ) : (
            <p className="max-w-prose text-base leading-8 text-slate-600">{course.description}</p>
          )}

          {course.previewVideoUrl && /(youtube\.com|youtu\.be|vimeo\.com)/i.test(course.previewVideoUrl) ? (
            <section className="mt-8">
              <div className="aspect-video overflow-hidden rounded-[22px] border border-brand-border bg-black">
                <iframe
                  src={course.previewVideoUrl.replace("watch?v=", "embed/")}
                  title={`${course.title} preview`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </section>
          ) : null}

          {objectives.length ? (
            <section className="mt-10">
              <h2 className="font-heading text-2xl font-bold text-brand-ink">What you will learn</h2>
              <p className="mt-5 rounded-[22px] border border-brand-border bg-brand-mist/40 p-5 text-sm leading-7 text-slate-600">
                {pointsToParagraph(objectives)}
              </p>
            </section>
          ) : null}
        </div>

        <aside className="h-fit rounded-[28px] border border-brand-border bg-brand-mist/45 p-5">
          <div className="rounded-[22px] bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Price
            </p>
            <p className="mt-2 font-heading text-3xl font-bold text-brand-navy">
              {formatPrice(course)}
            </p>
            <a
              href={course.applyUrl ?? "https://portal.itforyouthghana.org"}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex w-full justify-center rounded-full bg-brand-gold px-5 py-3 text-sm font-semibold text-brand-ink transition hover:-translate-y-0.5 hover:shadow-md"
            >
              Continue to application
            </a>
          </div>

          <dl className="mt-5 grid gap-3 text-sm">
            <div className="rounded-[20px] bg-white px-4 py-4">
              <dt className="font-semibold text-brand-ink">Duration</dt>
              <dd className="mt-2 text-slate-600">{course.duration}</dd>
            </div>
            <div className="rounded-[20px] bg-white px-4 py-4">
              <dt className="font-semibold text-brand-ink">Starts</dt>
              <dd className="mt-2 text-slate-600">{formatDate(course.startDate)}</dd>
            </div>
            {course.endDate ? (
              <div className="rounded-[20px] bg-white px-4 py-4">
                <dt className="font-semibold text-brand-ink">Ends</dt>
                <dd className="mt-2 text-slate-600">{formatDate(course.endDate)}</dd>
              </div>
            ) : null}
            <div className="rounded-[20px] bg-white px-4 py-4">
              <dt className="font-semibold text-brand-ink">Level</dt>
              <dd className="mt-2 text-slate-600">{course.level}</dd>
            </div>
            <div className="rounded-[20px] bg-white px-4 py-4">
              <dt className="font-semibold text-brand-ink">Language</dt>
              <dd className="mt-2 text-slate-600">{course.language ?? "English"}</dd>
            </div>
            {course.provider ? (
              <div className="rounded-[20px] bg-white px-4 py-4">
                <dt className="font-semibold text-brand-ink">Provider</dt>
                <dd className="mt-2 text-slate-600">{course.provider}</dd>
              </div>
            ) : null}
            {typeof course.enrollmentCount === "number" ? (
              <div className="rounded-[20px] bg-white px-4 py-4">
                <dt className="font-semibold text-brand-ink">Enrolled</dt>
                <dd className="mt-2 text-slate-600">{course.enrollmentCount}</dd>
              </div>
            ) : null}
          </dl>

          {course.previewVideoUrl ? (
            <a
              href={course.previewVideoUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-brand-border bg-white px-5 py-3 text-sm font-semibold text-brand-navy transition hover:border-brand-gold hover:text-brand-ink"
            >
              <PlayCircle className="h-4 w-4" />
              Watch preview
            </a>
          ) : null}

          {teachers.length || requirements.length || includedItems.length ? (
            <div className="mt-5 space-y-5 rounded-[22px] bg-white p-5">
              {teachers.length ? (
                <section>
                  <h2 className="text-sm font-bold text-brand-ink">Taught by</h2>
                  {/* Teachers are a roster of names, not prose points, so join with commas
                      here instead of routing through pointsToParagraph (which appends a
                      full stop to every entry, e.g. "Ama Mensah. Kofi Boateng."). */}
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {teachers.map((teacher) => teacher.name.trim()).filter(Boolean).join(", ")}
                  </p>
                </section>
              ) : null}
              {requirements.length ? (
                <section>
                  <h2 className="text-sm font-bold text-brand-ink">Requirements</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {pointsToParagraph(requirements)}
                  </p>
                </section>
              ) : null}
              {includedItems.length ? (
                <section>
                  <h2 className="text-sm font-bold text-brand-ink">Included</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {pointsToParagraph(includedItems)}
                  </p>
                </section>
              ) : null}
            </div>
          ) : null}
        </aside>
      </div>
    </article>
  );
}
