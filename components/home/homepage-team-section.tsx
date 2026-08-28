import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { TeamMemberProfile } from "@/types/content";
import { Button } from "@/components/ui/button";
import { TeamMemberCard } from "@/components/shared/team-directory";

type HomepageTeamSectionProps = {
  members: TeamMemberProfile[];
};

export function HomepageTeamSection({ members }: HomepageTeamSectionProps) {
  const visibleMembers = members.filter((member) => member.status === "active").slice(0, 6);

  if (!visibleMembers.length) {
    return null;
  }

  return (
    <section className="border-b border-brand-border bg-[#F7F9FC] px-5 py-16 sm:px-6 md:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-4 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-brand-accent">
              People &amp; governance
            </p>
            <h2 className="font-heading text-4xl font-bold leading-[1.02] tracking-tight text-brand-navy sm:text-5xl lg:text-6xl">
              Meet the people behind the mission.
            </h2>
            <p className="mt-5 max-w-2xl text-[0.95rem] leading-[1.8] text-brand-muted">
              The teams shaping our programmes, partnerships, and learning journeys are grounded in lived experience and professional care.
            </p>
          </div>

          <Button href="/who-we-are/team" variant="pink-outline" className="group w-fit shrink-0">
            Meet the full team
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </header>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/who-we-are/team"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-brand-accent transition hover:text-brand-accent-dark"
          >
            Explore all people
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
