import Link from "next/link";
import Image from "next/image";
import { emojiToIconImage } from "@/lib/utils/icon-map";
import { ArrowRight } from "lucide-react";

import type { DepartmentProfile } from "@/types/content";

type DepartmentsIndexPageProps = {
  departments: DepartmentProfile[];
};

export function DepartmentsIndexPage({ departments }: DepartmentsIndexPageProps) {
  const featured = departments.filter((department) => department.featured);
  const rest = departments.filter((department) => !department.featured);
  const visibleDepartments = featured.length ? [...featured, ...rest] : departments;

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-brand-deep px-6 py-20 text-white lg:px-10">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(1,82,190,0.94)_0%,rgba(30,114,186,0.78)_48%,rgba(215,11,82,0.28)_100%)]" />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/80">
            Organisation
          </p>
          <h1 className="mt-4 max-w-4xl font-heading text-4xl font-bold leading-tight sm:text-5xl">
            Departments that keep youth digital opportunity moving
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/82">
            Explore how IT For Youth Ghana organises delivery, learning design,
            partnerships, outreach, operations, impact, communications, and people systems.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-10">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleDepartments.map((department) => (
            <Link
              key={department.id}
              href={`/departments/${department.slug}`}
              className="group overflow-hidden rounded-[28px] border border-brand-border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-panel"
            >
              <div className="relative h-48 overflow-hidden bg-brand-mist">
                {department.heroImage ? (
                  <Image
                    src={department.heroImage}
                    alt={department.title}
                    fill
                    sizes="(max-width: 767px) 100vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/65 via-brand-deep/15 to-transparent" />
                <div
                  className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl text-xl text-white shadow-lg"
                  style={{ backgroundColor: department.color ?? "#1E72BA" }}
                  aria-hidden="true"
                >
                  {(() => department.iconImage ?? emojiToIconImage(department.icon))() ? (
                    <Image src={(department.iconImage ?? emojiToIconImage(department.icon)) as string} alt={department.title} width={24} height={24} className="h-6 w-6 object-contain" />
                  ) : (
                    department.icon ?? "•"
                  )}
                </div>
              </div>

              <div className="p-6">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-brand-accent">
                  {department.eyebrow}
                </p>
                <h2 className="mt-3 font-heading text-2xl font-bold text-brand-ink transition group-hover:text-brand-deep">
                  {department.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{department.summary}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-deep">
                  View department
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
