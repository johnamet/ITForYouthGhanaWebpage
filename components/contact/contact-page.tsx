import {
  ArrowRight,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  ShieldCheck,
} from "lucide-react";

import { ContactForm } from "@/components/contact/contact-form";
import { EditorialImageHero } from "@/components/shared/editorial-image-hero";
import { RouteCardGrid } from "@/components/shared/route-card-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { StatList } from "@/components/shared/stat-list";
import type { ContactChannel, ContactPageContent } from "@/types/content";

type ContactPageProps = {
  content: ContactPageContent;
};

const anchorLinks = [
  { id: "channels", label: "Channels" },
  { id: "form", label: "Form" },
  { id: "routing", label: "Routes" },
];

function ChannelIcon({ channel }: { channel: ContactChannel }) {
  if (channel.label === "Email") {
    return <Mail className="h-5 w-5" />;
  }

  if (channel.label === "Phone") {
    return <Phone className="h-5 w-5" />;
  }

  return <MapPin className="h-5 w-5" />;
}

export function ContactPage({ content }: ContactPageProps) {
  const emailChannel = content.channels.find((channel) => channel.label.toLowerCase() === "email");

  return (
    <div className="bg-white">
      <EditorialImageHero
        imageSrc={content.heroImage}
        imageAlt="Learners and facilitators collaborating during an IT For Youth Ghana session"
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        ctas={[
          {
            label: "Email the team",
            href: emailChannel?.href ?? "mailto:info@itforyouthghana.org",
          },
          { label: "Use the form", href: "#form", variant: "secondary" },
        ]}
        priority
      />

      <div className="sticky top-[72px] z-30 border-y border-brand-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 py-4 [scrollbar-width:none] sm:px-6 lg:px-8">
          {anchorLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="whitespace-nowrap rounded-full border border-brand-border px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-gold hover:text-brand-ink"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <section id="channels" className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div className="space-y-8">
            <SectionHeading
              eyebrow="Direct channels"
              title="Use the fastest route when you already know what you need"
              description="The form below is best for routing context. These direct channels remain visible for people who need a simpler first step."
            />
            <StatList stats={content.stats} compact />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {content.channels.map((channel) => {
              const isExternal = channel.href.startsWith("http");

              return (
                <a
                  key={channel.label}
                  href={channel.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noreferrer" : undefined}
                  className="group rounded-[30px] border border-brand-border bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-panel"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-navy text-brand-gold">
                    <ChannelIcon channel={channel} />
                  </div>
                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.24em] text-brand-gold">
                    {channel.label}
                  </p>
                  <h2 className="mt-2 break-words font-heading text-2xl font-bold text-brand-ink">
                    {channel.value}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {channel.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-navy">
                    Open channel
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section id="form" className="scroll-mt-36 bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:items-start">
          <div className="space-y-8">
            <SectionHeading
              eyebrow="Enquiry form"
              title="Give the team enough context to route your message well"
              description="Share the details that will help the team understand what you need and who should respond."
            />

            <div className="grid gap-4">
              {content.responseSteps.map((step) => (
                <div
                  key={step.number}
                  className="rounded-[28px] border border-brand-border bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-navy text-sm font-bold text-brand-gold">
                      {step.number}
                    </span>
                    <div>
                      <h2 className="font-heading text-2xl font-bold text-brand-ink">
                        {step.title}
                      </h2>
                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-[28px] border border-brand-border bg-brand-warm p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-navy text-brand-gold">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold text-brand-ink">
                    Privacy and routing
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    {content.privacyNote}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[34px] border border-brand-border bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-8 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-navy text-brand-gold">
                <MessageSquareText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-gold">
                  Message
                </p>
                <h2 className="font-heading text-3xl font-bold text-brand-ink">
                  Send an enquiry
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Choose the closest route, add context, and the team will use it to follow up clearly.
                </p>
              </div>
            </div>

            <ContactForm
              enquiryOptions={content.enquiryOptions}
              privacyNote={content.privacyNote}
            />
          </div>
        </div>
      </section>

      <section id="routing" className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <SectionHeading
            eyebrow="Before you write"
            title="Some questions already have a better front door"
            description="These routes help learners, organisations, partners, and donors self-serve before sending a message."
          />
          <RouteCardGrid cards={content.routeCards} />
        </div>
      </section>
    </div>
  );
}
