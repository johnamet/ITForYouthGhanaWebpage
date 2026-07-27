import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";

const challengeData = [
  {
    label: "Offline Population",
    value: "30.1%",
    description: "10.5M people without internet access",
  },
  {
    label: "Rural Digital Gap",
    value: "77.3%",
    description: "Rural residents without internet",
  },
  {
    label: "Limited Access",
    value: "25%",
    description: "Rural areas lack mobile coverage",
  },
  {
    label: "Skills Gap",
    value: "70%",
    description: "Youth lack digital skills",
  },
];

const withoutDigitalAccess = [
  "Limited job opportunities",
  "Reduced access to education",
  "Isolation from digital economy",
  "Decreased social mobility",
];

const withItfy = [
  "Practical digital skills training",
  "Mentorship and career guidance",
  "Real projects and portfolio building",
  "Pathways into work, study, and enterprise",
];

function QuickOverview() {
  return (
    <section className="bg-white px-6 py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <h2 className="font-heading text-5xl font-bold leading-none text-brand-navy sm:text-6xl lg:text-7xl">
            Digital opportunity
          </h2>
          <p className="mt-5 font-heading text-3xl font-bold leading-tight text-brand-navy sm:text-4xl">
            Skills that move young people forward
          </p>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            IT For Youth Ghana helps young people build practical digital skills,
            confidence, and clear pathways into work, further study, and enterprise.
          </p>
        </div>

        <div className="grid items-center gap-12 md:grid-cols-2 lg:gap-16">
          <div>
            <h3 className="font-heading text-4xl font-bold leading-tight text-brand-navy sm:text-5xl">
              Why we exist
            </h3>
            <p className="mt-4 font-heading text-2xl font-bold leading-tight text-brand-navy sm:text-3xl">
              Ghana’s digital growth should include every young person.
            </p>
            <p className="mt-6 leading-8 text-slate-600">
              Ghana’s digital economy is creating new possibilities, but access to quality
              training, devices, and career guidance remains uneven. We close that gap with
              structured learning built around the skills young people can use.
            </p>
            <div className="mt-6 rounded-xl border border-brand-border bg-brand-mist/50 p-6">
              <p className="leading-8 text-slate-600">
                Our programmes prioritise{" "}
                <span className="font-semibold text-brand-navy">
                  young women and underserved communities
                </span>
                . Each cohort combines hands-on training, mentorship, and real projects so
                participants leave with evidence of what they can do and a practical next step.
              </p>
            </div>
            <Link
              href="/apply-for-training"
              className="itfy-button-blue mt-7 px-6 py-3.5 text-sm"
            >
              Find your training pathway
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="relative h-80 overflow-hidden rounded-2xl shadow-lg">
            <Image
              src="/images/randomPictures/studentslistening.jpg"
              alt="Students learning technology"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-brand-navy/20" />
            <div className="absolute bottom-4 left-4 rounded-lg bg-brand-navy/95 p-4 text-white">
              <p className="text-sm font-semibold text-white">Learning by doing</p>
              <p className="mt-1 text-xs text-white/90">
                Practical training, projects, and mentorship
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Challenge() {
  return (
    <section className="bg-brand-navy px-6 py-20 text-white lg:px-10 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="font-heading text-5xl font-bold leading-none text-white sm:text-6xl lg:text-7xl">
            The challenge
          </h2>
          <p className="mx-auto mt-5 max-w-5xl font-heading text-3xl font-bold leading-tight text-white/90 sm:text-4xl">
            Talent is everywhere. Access is not.
          </p>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/90">
            Ghana’s digital divide keeps capable young people from the learning,
            connections, and opportunities they need to participate in the digital economy.
          </p>
        </div>

        <div className="mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {challengeData.map((item) => (
            <article
              key={item.label}
              className="rounded-xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur-sm transition-colors hover:bg-white/15"
            >
              <p className="font-heading text-4xl font-bold text-white md:text-5xl">
                {item.value}
              </p>
              <h3 className="mt-3 text-lg font-semibold text-white">{item.label}</h3>
              <p className="mt-2 text-sm text-white/80">{item.description}</p>
            </article>
          ))}
        </div>

        <div className="mx-auto max-w-4xl rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm">
          <h3 className="text-center font-heading text-2xl font-bold text-white sm:text-3xl">
            What the digital divide changes
          </h3>
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div>
              <h4 className="mb-4 text-xl font-semibold text-white">
                Without digital access
              </h4>
              <ul className="space-y-3">
                {withoutDigitalAccess.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/90">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-white" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-xl font-semibold text-white">
                With IT For Youth Ghana
              </h4>
              <ul className="space-y-3">
                {withItfy.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/90">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-white" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="mb-6 text-lg text-white/90">
            Help more young people turn digital access into lasting opportunity.
          </p>
          <Link
            href="https://www.globalgiving.org/projects/coding-and-digital-skills-for-1000-girls-in-ghana/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full border-2 border-white bg-white px-8 py-4 font-semibold text-brand-navy shadow-lg transition-transform hover:-translate-y-0.5 hover:scale-[1.02]"
          >
            <Heart className="h-5 w-5" aria-hidden="true" />
            Support digital skills training
          </Link>
        </div>
      </div>
    </section>
  );
}

function Vision() {
  return (
    <section className="bg-white px-6 py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <h2 className="font-heading text-5xl font-bold leading-none text-brand-navy sm:text-6xl lg:text-7xl">
            Our direction
          </h2>
          <p className="mt-5 font-heading text-3xl font-bold leading-tight text-brand-navy sm:text-4xl">
            A digital future shaped by every young Ghanaian
          </p>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            We see a Ghana where geography, gender, or income does not decide who gets to
            learn, create, and lead with technology.
          </p>
        </div>

        <div className="grid items-center gap-12 md:grid-cols-2 lg:gap-16">
          <div className="relative h-80 overflow-hidden rounded-2xl shadow-lg">
            <Image
              src="/images/randomPictures/studentsblueclothing.jpg"
              alt="Students learning technology"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-brand-navy/20" />
            <div className="absolute bottom-4 left-4 rounded-lg bg-brand-navy/95 p-4 text-white">
              <p className="text-sm font-semibold text-white">Building Ghana’s tech future</p>
              <p className="mt-1 text-xs text-white/90">
                Through inclusive technology education
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-heading text-4xl font-bold leading-tight text-brand-navy sm:text-5xl">
              Our mission
            </h3>
            <p className="mt-4 font-heading text-2xl font-bold leading-tight text-brand-navy sm:text-3xl">
              Turn digital learning into real opportunity.
            </p>
            <p className="mt-6 leading-8 text-slate-600">
              We equip young Ghanaians—particularly women and underserved communities—with
              practical skills, mentorship, and pathways into employment, further study,
              and business-building.
            </p>
            <Link
              href="/who-we-are"
              className="itfy-button-outline-blue mt-7 px-6 py-3.5 text-sm"
            >
              Discover who we are
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LegacyHomepageSections() {
  return (
    <>
      <QuickOverview />
      <Challenge />
      <Vision />
    </>
  );
}
