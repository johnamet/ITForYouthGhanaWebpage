import Link from "next/link";

import type { Course } from "@/types/course";

type ProgramsOverviewProps = {
  courses: Course[];
};

export function ProgramsOverview({ courses }: ProgramsOverviewProps) {
  const featuredCourses = courses.slice(0, 6);

  return (
    <div className="space-y-10">
      <div className="rounded-[32px] border border-brand-border bg-white p-8 shadow-sm">
        <h1 className="font-heading text-4xl font-semibold text-brand-ink">Programs Portal Compatibility</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
          `/programs/**` remains available in the rebuild branch so course discovery keeps working while the
          rest of the public site moves into the new information architecture.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {featuredCourses.length ? (
          featuredCourses.map((course) => (
            <div key={course.id} className="rounded-[28px] border border-brand-border bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold">
                {course.category}
              </p>
              <h2 className="mt-3 font-heading text-2xl font-semibold text-brand-ink">{course.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{course.shortDescription}</p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="rounded-full bg-brand-mist px-3 py-1">{course.level}</span>
                <span className="rounded-full bg-brand-mist px-3 py-1">{course.duration}</span>
                <span className="rounded-full bg-brand-mist px-3 py-1">{course.deliveryMode}</span>
              </div>
              <div className="mt-6 flex gap-3">
                <Link
                  href={`/apply-for-training/courses/${course.slug}`}
                  className="text-sm font-semibold text-brand-navy"
                >
                  View details
                </Link>
                <a
                  href={course.applyUrl ?? "https://portal.itforyouthghana.org"}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-brand-gold"
                >
                  Apply
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[28px] border border-dashed border-brand-border bg-white p-8 text-sm text-slate-600 md:col-span-2 xl:col-span-3">
            Course data is scaffolded through the new integration layer. The page compiled successfully even if
            the external API is unavailable during this pass.
          </div>
        )}
      </div>
    </div>
  );
}
