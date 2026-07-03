import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Mail } from "lucide-react";

import type { DepartmentProfile, TeamMemberProfile } from "@/types/content";

type DepartmentDetailPageProps = {
  department: DepartmentProfile;
  teamMembers: TeamMemberProfile[];
};

export function DepartmentDetailPage({ department, teamMembers }: DepartmentDetailPageProps) {
  const selectedMembers = teamMembers.filter(
    (member) =>
      department.teamMemberIds.includes(member.id) ||
      member.departmentId === department.id ||
      member.departmentSlug === department.slug ||
      member.department.toLowerCase() === department.title.replace(/ department$/i, "").toLowerCase() ||
      member.department.toLowerCase() === department.title.toLowerCase(),
  );

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-brand-navy px-6 py-20 text-white lg:px-10">
        {department.heroImage ? (
          <Image
            src={department.heroImage}
            alt={department.title}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-28"
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(1,82,190,0.94)_0%,rgba(1,82,190,0.78)_48%,rgba(215,11,82,0.34)_100%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.7fr_0.3fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/80">
              {department.eyebrow}
            </p>
            <h1 className="mt-4 font-heading text-4xl font-bold leading-tight sm:text-5xl">
              {department.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/84">
              {department.description}
            </p>
            {department.ctas.length ? (
              <div className="mt-8 flex flex-wrap gap-3">
                {department.ctas.map((cta, index) => (
                  <Link
                    key={`${cta.href}-${cta.label}`}
                    href={cta.href}
                    className={
                      index === 0
                        ? "inline-flex items-center gap-2 rounded-full bg-brand-gold px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-warm"
                        : "inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15"
                    }
                  >
                    {cta.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          <aside className="rounded-[28px] border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
              style={{ backgroundColor: department.color ?? "#D70B52" }}
              aria-hidden="true"
            >
              {department.icon ?? "•"}
            </div>
            <p className="mt-5 text-sm leading-7 text-white/82">{department.summary}</p>
            {department.contact?.email ? (
              <a
                href={`mailto:${department.contact.email}`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white"
              >
                <Mail className="h-4 w-4" />
                {department.contact.email}
              </a>
            ) : null}
          </aside>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-10">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.66fr_0.34fr]">
          <div className="space-y-8">
            <Panel title="Mission">
              <p className="text-base leading-8 text-slate-600">{department.mission}</p>
            </Panel>

            <Panel title="Responsibilities">
              <ul className="grid gap-3">
                {department.responsibilities.map((item) => (
                  <li key={item} className="rounded-2xl border border-brand-border bg-brand-mist/55 px-4 py-3 text-sm leading-7 text-slate-700">
                    {item}
                  </li>
                ))}
              </ul>
            </Panel>

            {department.services.length ? (
              <Panel title="Services and workflows">
                <div className="grid gap-4 md:grid-cols-2">
                  {department.services.map((service) => (
                    <article key={service.title} className="rounded-[24px] border border-brand-border p-5">
                      <h3 className="font-heading text-xl font-bold text-brand-ink">{service.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{service.body}</p>
                      {service.bullets?.length ? (
                        <ul className="mt-4 grid gap-2 text-sm font-medium text-brand-navy">
                          {service.bullets.map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                          ))}
                        </ul>
                      ) : null}
                    </article>
                  ))}
                </div>
              </Panel>
            ) : null}

            {selectedMembers.length ? (
              <Panel title="Department team">
                <div className="grid gap-4 md:grid-cols-2">
                  {selectedMembers.map((member) => (
                    <article key={member.id} className="rounded-[24px] border border-brand-border bg-white p-5">
                      <h3 className="font-heading text-xl font-bold text-brand-ink">{member.name}</h3>
                      <p className="mt-1 text-sm font-semibold text-brand-navy">{member.role}</p>
                      <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">{member.bio}</p>
                    </article>
                  ))}
                </div>
              </Panel>
            ) : null}
          </div>

          <aside className="space-y-6">
            {department.stats.length ? (
              <div className="rounded-[28px] border border-brand-border bg-brand-mist/50 p-6">
                <h2 className="font-heading text-xl font-bold text-brand-ink">Signals</h2>
                <div className="mt-5 grid gap-4">
                  {department.stats.map((stat) => (
                    <div key={`${stat.value}-${stat.label}`} className="rounded-2xl bg-white p-4">
                      <p className="font-heading text-3xl font-bold text-brand-navy">{stat.value}</p>
                      <p className="mt-1 text-sm font-semibold text-brand-ink">{stat.label}</p>
                      {stat.description ? (
                        <p className="mt-2 text-sm leading-6 text-slate-600">{stat.description}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {department.workflows.length ? (
              <div className="rounded-[28px] border border-brand-border bg-white p-6">
                <h2 className="font-heading text-xl font-bold text-brand-ink">How work moves</h2>
                <div className="mt-5 grid gap-4">
                  {department.workflows.map((step, index) => (
                    <div key={step.title} className="flex gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-navy text-sm font-bold text-white">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-brand-ink">{step.title}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {department.priorities.length ? (
              <div className="rounded-[28px] border border-brand-border bg-white p-6">
                <h2 className="font-heading text-xl font-bold text-brand-ink">Current priorities</h2>
                <ul className="mt-5 grid gap-3 text-sm leading-7 text-slate-600">
                  {department.priorities.map((priority) => (
                    <li key={priority} className="border-l-2 border-brand-gold pl-3">
                      {priority}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {department.resources.length ? (
              <div className="rounded-[28px] border border-brand-border bg-white p-6">
                <h2 className="font-heading text-xl font-bold text-brand-ink">Resources</h2>
                <div className="mt-5 grid gap-3">
                  {department.resources.map((resource) => (
                    <Link
                      key={`${resource.href}-${resource.label}`}
                      href={resource.href}
                      className="rounded-2xl border border-brand-border p-4 transition hover:border-brand-gold"
                    >
                      <span className="font-semibold text-brand-navy">{resource.label}</span>
                      {resource.description ? (
                        <span className="mt-1 block text-sm leading-6 text-slate-600">{resource.description}</span>
                      ) : null}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </section>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
      <h2 className="font-heading text-2xl font-bold text-brand-ink">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}
