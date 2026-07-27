import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

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
  "Technology skills training",
  "Career pathway development",
  "Digital literacy programs",
  "Community empowerment",
];

function QuickOverview() {
  return (
    <section className="bg-white px-6 py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <h2 className="font-heading text-4xl font-bold text-brand-navy sm:text-5xl">
            Transforming Lives Through Technology
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            We are Ghana’s leading NGO dedicated to bridging the digital divide through
            inclusive technology education, with a special focus on empowering women and
            underserved communities.
          </p>
        </div>

        <div className="grid items-center gap-12 md:grid-cols-2 lg:gap-16">
          <div>
            <h3 className="font-heading text-3xl font-bold text-brand-navy">Why We Exist</h3>
            <p className="mt-6 leading-8 text-slate-600">
              Ghana’s tech industry is growing rapidly, but many young people lack access to
              quality technology education. We bridge this gap with professional training
              programs that prepare students for real careers.
            </p>
            <div className="mt-6 rounded-xl border border-brand-border bg-brand-mist/50 p-6">
              <p className="leading-8 text-slate-600">
                Our programs focus on{" "}
                <span className="font-semibold text-brand-navy">
                  inclusive technology education
                </span>
                , with special emphasis on empowering women and underserved communities. We
                provide comprehensive training that leads to real employment opportunities
                and sustainable career paths in Ghana’s growing tech industry.
              </p>
            </div>
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
              <p className="text-sm font-semibold text-white">Empowering Ghana’s Youth</p>
              <p className="mt-1 text-xs text-white/90">
                Through technology education and mentorship
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
          <h2 className="font-heading text-4xl font-bold text-white sm:text-5xl">
            The Challenge
          </h2>
          <p className="mt-6 text-lg text-white/90">
            Ghana’s digital divide creates barriers to opportunity
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
            Ghana’s Digital Divide Impact
          </h3>
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div>
              <h4 className="mb-4 text-xl font-semibold text-white">
                Without Digital Access:
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
                With IT For Youth Ghana:
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
            Be part of the solution. Help us bridge Ghana’s digital divide.
          </p>
          <Link
            href="https://www.globalgiving.org/projects/coding-and-digital-skills-for-1000-girls-in-ghana/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full border-2 border-white bg-white px-8 py-4 font-semibold text-brand-navy shadow-lg transition-transform hover:-translate-y-0.5 hover:scale-[1.02]"
          >
            <Heart className="h-5 w-5" aria-hidden="true" />
            Support Our Mission - Donate Now
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
          <h2 className="font-heading text-4xl font-bold text-brand-navy sm:text-5xl">
            Our Vision &amp; Mission
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            We are Ghana’s leading NGO dedicated to bridging the digital divide through
            inclusive technology education, with a special focus on empowering women and
            underserved communities.
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
              <p className="text-sm font-semibold text-white">Building Ghana’s Tech Future</p>
              <p className="mt-1 text-xs text-white/90">
                Through inclusive technology education
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-heading text-3xl font-bold text-brand-navy">Our Mission</h3>
            <p className="mt-6 leading-8 text-slate-600">
              We provide practical technology education that leads to real employment
              opportunities. Our focus is on underserved communities and ensuring that
              women have equal access to tech careers.
            </p>
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
