import Link from "next/link";

import type { Course } from "@/types/course";

type CourseDetailCardProps = {
  course: Course | null;
  fallbackTitle: string;
};

export function CourseDetailCard({ course, fallbackTitle }: CourseDetailCardProps) {
  if (!course) {
    return (
      <div className="rounded-[32px] border border-dashed border-brand-border bg-white p-8 shadow-sm">
        <h1 className="font-heading text-3xl font-semibold text-brand-ink">{fallbackTitle}</h1>
        <p className="mt-4 max-w-prose text-base leading-8 text-slate-600">
          This route is active in the rebuild branch, but the live portal API did not return course details at
          build time. The compatibility layer remains wired in for runtime requests.
        </p>
        <Link href="/programs" className="mt-6 inline-flex text-sm font-semibold text-brand-navy">
          Back to programs
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-[32px] border border-brand-border bg-white p-8 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold">{course.category}</p>
      <h1 className="mt-3 font-heading text-4xl font-semibold text-brand-ink">{course.title}</h1>
      <p className="mt-4 max-w-prose text-base leading-8 text-slate-600">{course.description}</p>
      <div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-500">
        <span className="rounded-full bg-brand-mist px-3 py-1">{course.level}</span>
        <span className="rounded-full bg-brand-mist px-3 py-1">{course.duration}</span>
        <span className="rounded-full bg-brand-mist px-3 py-1">{course.deliveryMode}</span>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={course.applyUrl ?? "https://portal.itforyouthghana.org"}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white"
        >
          Continue to application
        </a>
        <Link href="/apply-for-training/courses" className="rounded-full border border-brand-border px-5 py-3 text-sm font-semibold text-brand-navy">
          New training hub
        </Link>
      </div>
    </div>
  );
}
