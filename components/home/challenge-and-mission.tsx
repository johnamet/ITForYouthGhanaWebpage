import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  MapPin,
  UsersRound,
} from "lucide-react";

const challenges = [
  {
    icon: MapPin,
    title: "Access is still uneven",
    description:
      "Where a young person lives, studies, or starts from can still limit access to devices, guidance, and practical digital learning.",
  },
  {
    icon: GraduationCap,
    title: "Learning must lead somewhere",
    description:
      "Short introductions are not enough. Young people need structured practice, mentorship, and portfolios that show what they can do.",
  },
  {
    icon: UsersRound,
    title: "Women remain underrepresented",
    description:
      "Young women need intentional access pathways, visible role models, and supportive communities to enter and lead in technology.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Employers need proven skills",
    description:
      "Ghana's digital economy needs people who can solve real problems, work in teams, and move confidently from training into opportunity.",
  },
];

const responseSteps = [
  "Practical, cohort-based digital skills training",
  "Mentorship, teamwork, and challenge-led projects",
  "Career, further-study, and enterprise pathways",
];

export function ChallengeAndMission() {
  return (
    <section className="overflow-hidden bg-brand-navy px-6 py-20 text-white lg:px-10 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-white/70">
              Why we exist
            </p>
            <h2 className="mt-4 max-w-xl font-heading text-4xl font-bold leading-[1.08] text-white sm:text-5xl">
              Talent is everywhere. Digital opportunity is not.
            </h2>
          </div>
          <div className="lg:border-l lg:border-white/20 lg:pl-10">
            <p className="max-w-2xl text-lg leading-8 text-white/80">
              Ghana’s digital economy is growing, but too many capable young people
              still face barriers between ambition and opportunity. We work to close
              that distance, with a strong focus on women and underserved communities.
            </p>
            <Link
              href="/who-we-are"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white underline decoration-brand-gold decoration-2 underline-offset-8 transition-opacity hover:opacity-75"
            >
              Read our story
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-[30px] border border-white/15 bg-white/15 sm:grid-cols-2 lg:grid-cols-4">
          {challenges.map((challenge) => {
            const Icon = challenge.icon;
            return (
              <article key={challenge.title} className="bg-brand-navy p-6 sm:p-7">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                  <Icon className="h-5 w-5 text-white" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-heading text-lg font-bold text-white">
                  {challenge.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  {challenge.description}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-16 grid overflow-hidden rounded-[34px] bg-white text-brand-ink shadow-[0_30px_80px_rgba(0,0,0,0.2)] lg:grid-cols-2">
          <div className="relative min-h-[360px] lg:min-h-[520px]">
            <Image
              src="/images/randomPictures/studentslistening.jpg"
              alt="Young people taking part in a technology learning session"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/75 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
              <p className="max-w-md font-heading text-2xl font-bold leading-snug text-white">
                Building Ghana’s digital future with the young people who will lead it.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14">
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-brand-gold">
              Our response
            </p>
            <h3 className="mt-4 font-heading text-3xl font-bold leading-tight text-brand-ink sm:text-4xl">
              We turn access into a pathway forward.
            </h3>
            <p className="mt-5 text-base leading-8 text-slate-600">
              Our mission is to equip young Ghanaians with practical digital skills,
              confidence, and connections that lead to work, further study, or
              business-building.
            </p>

            <ol className="mt-8 space-y-4">
              {responseSteps.map((step, index) => (
                <li key={step} className="flex items-center gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-primary-light text-sm font-bold text-brand-primary-dark">
                    {index + 1}
                  </span>
                  <span className="font-semibold text-brand-ink">{step}</span>
                </li>
              ))}
            </ol>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/what-we-do" className="itfy-button-blue px-6 py-3.5 text-sm">
                Explore our approach
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/partner-with-us"
                className="itfy-button-outline-pink px-6 py-3.5 text-sm"
              >
                Help close the gap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
