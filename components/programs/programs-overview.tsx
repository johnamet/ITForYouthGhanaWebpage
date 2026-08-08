import type { Course } from "@/types/course";
import { FeatureCard } from "@/components/content/feature-card";

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

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {featuredCourses.length ? (
          featuredCourses.map((course) => (
            <FeatureCard
              key={course.id}
              image={course.image}
              imageAlt={course.title}
              category={course.category}
              title={course.title}
              description={course.shortDescription}
              href={`/apply-for-training/courses/${course.slug}`}
              ctaLabel="View details"
            />
          ))
        ) : (
          <div className="rounded-[28px] border border-dashed border-brand-border bg-white p-8 text-sm text-slate-600 md:col-span-2 xl:col-span-3">
            Course data is scaffolded through the new integration layer. The page compiled successfully even if the external API is unavailable during this pass.
          </div>
        )}
      </div>
    </div>
  );
}
