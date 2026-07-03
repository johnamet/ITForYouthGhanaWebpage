"use client";

import { FormEvent, ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2, Plus, Save, Trash2 } from "lucide-react";

import type {
  EcosystemCardContent,
  HighlightStat,
  InitiativeAudience,
  InitiativeFaq,
  InitiativeGalleryImage,
  InitiativePage,
  InitiativePartner,
  InitiativeProcessStep,
  InitiativeTestimonial,
  PathwayCardContent,
  RouteCard,
  WhatWeDoHeroStatLabel,
  WhatWeDoOverviewContent,
} from "@/types/content";

type ApiResponse = { success?: boolean; message?: string; errors?: unknown };
type SubmitState = { type: "idle" | "success" | "error"; message: string };

type WhatWeDoOverviewFormProps = {
  initial: WhatWeDoOverviewContent;
  endpoint: string;
};

type InitiativeFormProps = {
  initial: InitiativePage;
  endpoint: string;
};

const inputClass =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20";
const panelClass = "rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8";
const addButtonClass =
  "inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm font-semibold text-brand-ink transition hover:bg-brand-mist";
const removeButtonClass =
  "inline-flex items-center gap-2 rounded-full border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-50";

const emptyHeroStat: WhatWeDoHeroStatLabel = { label: "", description: "" };
const emptyEcosystemCard: EcosystemCardContent = { eyebrow: "", title: "", description: "" };
const emptyPathwayCard: PathwayCardContent = { title: "", description: "" };
const emptyRouteCard: RouteCard = { href: "/", eyebrow: "", title: "", description: "" };
const emptyStat: HighlightStat = { value: "", label: "", description: "", icon: "", iconImage: "" };
const emptyProcessStep: InitiativeProcessStep = { number: "", title: "", description: "", icon: "" };
const emptyGalleryImage: InitiativeGalleryImage = { src: "", alt: "" };
const emptyTestimonial: InitiativeTestimonial = { quote: "", name: "", role: "", avatar: "" };
const emptyPartner: InitiativePartner = { name: "", description: "", href: "", logo: "" };
const emptyFaq: InitiativeFaq = { question: "", answer: "" };

function Field({
  label,
  value,
  onChange,
  multiline = false,
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-brand-ink">{label}</label>
      {multiline ? (
        <textarea
          className={`${inputClass} h-28`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          readOnly={readOnly}
        />
      ) : (
        <input
          className={inputClass}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          readOnly={readOnly}
        />
      )}
    </div>
  );
}

function Panel({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className={panelClass}>
      <div className="mb-6">
        {eyebrow ? (
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-gold">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-2 font-heading text-2xl font-bold text-brand-ink">{title}</h2>
        {description ? (
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-500">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function FormStatus({ state }: { state: SubmitState }) {
  if (state.type === "idle") return null;

  return (
    <div
      className={`flex items-start gap-3 rounded-[24px] border p-5 text-sm font-medium ${
        state.type === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-rose-200 bg-rose-50 text-rose-700"
      }`}
    >
      {state.type === "success" ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5" />
      ) : (
        <AlertCircle className="mt-0.5 h-5 w-5" />
      )}
      <span>{state.message}</span>
    </div>
  );
}

function SubmitButton({ isSubmitting, label }: { isSubmitting: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      {label}
    </button>
  );
}

function StringListEditor({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <div className="rounded-2xl border border-brand-border p-4">
      <div className="flex items-center justify-between gap-4">
        <p className="font-bold text-brand-ink">{label}</p>
        <button type="button" onClick={() => onChange([...values, ""])} className={addButtonClass}>
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>
      <div className="mt-4 grid gap-3">
        {values.map((item, index) => (
          <div key={`${label}-${index}`} className="grid gap-3 md:grid-cols-[1fr_auto]">
            <input
              className={inputClass}
              value={item}
              onChange={(event) =>
                onChange(values.map((value, itemIndex) => (itemIndex === index ? event.target.value : value)))
              }
            />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))}
              className={removeButtonClass}
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function RouteCardsEditor({
  values,
  onChange,
}: {
  values: RouteCard[];
  onChange: (values: RouteCard[]) => void;
}) {
  return (
    <Repeater title="Route cards" addLabel="Add route card" onAdd={() => onChange([...values, emptyRouteCard])}>
      {values.map((card, index) => (
        <div key={`route-${index}`} className="grid gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-2">
          <Field label="Eyebrow" value={card.eyebrow ?? ""} onChange={(value) => onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, eyebrow: value } : item)))} />
          <Field label="Title" value={card.title} onChange={(value) => onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, title: value } : item)))} />
          <Field label="Href" value={card.href} onChange={(value) => onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, href: value } : item)))} />
          <Field label="Description" value={card.description} onChange={(value) => onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, description: value } : item)))} />
          <RemoveButton onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))} />
        </div>
      ))}
    </Repeater>
  );
}

function StatsEditor({
  title = "Stats",
  values,
  onChange,
}: {
  title?: string;
  values: HighlightStat[];
  onChange: (values: HighlightStat[]) => void;
}) {
  return (
    <Repeater title={title} addLabel="Add stat" onAdd={() => onChange([...values, emptyStat])}>
      {values.map((stat, index) => (
        <div key={`stat-${index}`} className="grid gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-2">
          <Field label="Value" value={stat.value} onChange={(value) => onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, value } : item)))} />
          <Field label="Label" value={stat.label} onChange={(value) => onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, label: value } : item)))} />
          <Field label="Icon" value={stat.icon ?? ""} onChange={(value) => onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, icon: value } : item)))} />
          <Field label="Icon image URL" value={stat.iconImage ?? ""} onChange={(value) => onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, iconImage: value } : item)))} />
          <div className="md:col-span-2">
            <Field label="Description" value={stat.description ?? ""} multiline onChange={(value) => onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, description: value } : item)))} />
          </div>
          <RemoveButton onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))} />
        </div>
      ))}
    </Repeater>
  );
}

function Repeater({
  title,
  addLabel,
  onAdd,
  children,
}: {
  title: string;
  addLabel: string;
  onAdd: () => void;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-heading text-xl font-semibold text-brand-ink">{title}</h3>
        <button type="button" onClick={onAdd} className={addButtonClass}>
          <Plus className="h-4 w-4" />
          {addLabel}
        </button>
      </div>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`${removeButtonClass} justify-self-start`}>
      <Trash2 className="h-4 w-4" />
      Remove
    </button>
  );
}

async function submitForm(endpoint: string, values: unknown) {
  const response = await fetch(endpoint, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  const payload = (await response.json().catch(() => null)) as ApiResponse | null;

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || "We could not save this content right now.");
  }

  return payload;
}

export function WhatWeDoOverviewForm({ initial, endpoint }: WhatWeDoOverviewFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<WhatWeDoOverviewContent>(initial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({ type: "idle", message: "" });

  const update = <Key extends keyof WhatWeDoOverviewContent>(
    key: Key,
    value: WhatWeDoOverviewContent[Key],
  ) => setValues((current) => ({ ...current, [key]: value }));

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitState({ type: "idle", message: "" });

    try {
      const payload = await submitForm(endpoint, values);
      setSubmitState({ type: "success", message: payload.message || "What We Do overview saved." });
      router.refresh();
    } catch (error) {
      setSubmitState({
        type: "error",
        message: error instanceof Error ? error.message : "We could not save this overview.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <FormStatus state={submitState} />

      <Panel eyebrow="Overview" title="Hero and page identity">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Eyebrow" value={values.eyebrow} onChange={(value) => update("eyebrow", value)} />
          <Field label="Title" value={values.title} onChange={(value) => update("title", value)} />
          <div className="md:col-span-2">
            <Field label="Description" value={values.description} multiline onChange={(value) => update("description", value)} />
          </div>
          <div className="md:col-span-2">
            <Field label="Hero image" value={values.heroImage} onChange={(value) => update("heroImage", value)} />
          </div>
        </div>
      </Panel>

      <Panel title="Hero stat labels" description="The public page computes values from initiative records. These fields control labels and descriptions.">
        <Repeater title="Hero stats" addLabel="Add stat label" onAdd={() => update("heroStats", [...values.heroStats, emptyHeroStat])}>
          {values.heroStats.map((stat, index) => (
            <div key={`hero-stat-${index}`} className="grid gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-2">
              <Field label="Label" value={stat.label} onChange={(value) => update("heroStats", values.heroStats.map((item, itemIndex) => (itemIndex === index ? { ...item, label: value } : item)))} />
              <Field label="Description" value={stat.description} onChange={(value) => update("heroStats", values.heroStats.map((item, itemIndex) => (itemIndex === index ? { ...item, description: value } : item)))} />
              <RemoveButton onClick={() => update("heroStats", values.heroStats.filter((_, itemIndex) => itemIndex !== index))} />
            </div>
          ))}
        </Repeater>
      </Panel>

      <Panel title="Overview section">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Section eyebrow" value={values.overviewSectionEyebrow ?? ""} onChange={(value) => update("overviewSectionEyebrow", value)} />
          <Field label="Section title" value={values.overviewSectionTitle ?? ""} onChange={(value) => update("overviewSectionTitle", value)} />
          <div className="md:col-span-2">
            <Field label="Section description" value={values.overviewSectionDescription ?? ""} multiline onChange={(value) => update("overviewSectionDescription", value)} />
          </div>
        </div>
        <div className="mt-8">
          <Repeater title="Ecosystem cards" addLabel="Add card" onAdd={() => update("ecosystemCards", [...values.ecosystemCards, emptyEcosystemCard])}>
            {values.ecosystemCards.map((card, index) => (
              <div key={`ecosystem-${index}`} className="grid gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-2">
                <Field label="Eyebrow" value={card.eyebrow} onChange={(value) => update("ecosystemCards", values.ecosystemCards.map((item, itemIndex) => (itemIndex === index ? { ...item, eyebrow: value } : item)))} />
                <Field label="Title" value={card.title} onChange={(value) => update("ecosystemCards", values.ecosystemCards.map((item, itemIndex) => (itemIndex === index ? { ...item, title: value } : item)))} />
                <div className="md:col-span-2">
                  <Field label="Description" value={card.description} multiline onChange={(value) => update("ecosystemCards", values.ecosystemCards.map((item, itemIndex) => (itemIndex === index ? { ...item, description: value } : item)))} />
                </div>
                <RemoveButton onClick={() => update("ecosystemCards", values.ecosystemCards.filter((_, itemIndex) => itemIndex !== index))} />
              </div>
            ))}
          </Repeater>
        </div>
      </Panel>

      <Panel title="Initiatives section">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Section eyebrow" value={values.initiativesSectionEyebrow ?? ""} onChange={(value) => update("initiativesSectionEyebrow", value)} />
          <Field label="Section title" value={values.initiativesSectionTitle ?? ""} onChange={(value) => update("initiativesSectionTitle", value)} />
          <div className="md:col-span-2">
            <Field label="Section description" value={values.initiativesSectionDescription ?? ""} multiline onChange={(value) => update("initiativesSectionDescription", value)} />
          </div>
        </div>
      </Panel>

      <Panel title="Pathways section">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Section eyebrow" value={values.pathwaysSectionEyebrow ?? ""} onChange={(value) => update("pathwaysSectionEyebrow", value)} />
          <Field label="Section title" value={values.pathwaysSectionTitle ?? ""} onChange={(value) => update("pathwaysSectionTitle", value)} />
          <div className="md:col-span-2">
            <Field label="Section description" value={values.pathwaysSectionDescription ?? ""} multiline onChange={(value) => update("pathwaysSectionDescription", value)} />
          </div>
        </div>
        <div className="mt-8">
          <Repeater title="Pathway cards" addLabel="Add pathway" onAdd={() => update("pathwayCards", [...values.pathwayCards, emptyPathwayCard])}>
            {values.pathwayCards.map((card, index) => (
              <div key={`pathway-${index}`} className="grid gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-2">
                <Field label="Title" value={card.title} onChange={(value) => update("pathwayCards", values.pathwayCards.map((item, itemIndex) => (itemIndex === index ? { ...item, title: value } : item)))} />
                <Field label="Description" value={card.description} multiline onChange={(value) => update("pathwayCards", values.pathwayCards.map((item, itemIndex) => (itemIndex === index ? { ...item, description: value } : item)))} />
                <RemoveButton onClick={() => update("pathwayCards", values.pathwayCards.filter((_, itemIndex) => itemIndex !== index))} />
              </div>
            ))}
          </Repeater>
        </div>
      </Panel>

      <Panel title="Next steps">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Section eyebrow" value={values.nextStepsSectionEyebrow ?? ""} onChange={(value) => update("nextStepsSectionEyebrow", value)} />
          <Field label="Section title" value={values.nextStepsSectionTitle ?? ""} onChange={(value) => update("nextStepsSectionTitle", value)} />
          <div className="md:col-span-2">
            <Field label="Section description" value={values.nextStepsSectionDescription ?? ""} multiline onChange={(value) => update("nextStepsSectionDescription", value)} />
          </div>
        </div>
        <div className="mt-8">
          <RouteCardsEditor values={values.nextSteps} onChange={(nextSteps) => update("nextSteps", nextSteps)} />
        </div>
      </Panel>

      <SubmitButton isSubmitting={isSubmitting} label="Save overview" />
    </form>
  );
}

export function InitiativeForm({ initial, endpoint }: InitiativeFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<InitiativePage>(initial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({ type: "idle", message: "" });

  const update = <Key extends keyof InitiativePage>(key: Key, value: InitiativePage[Key]) =>
    setValues((current) => ({ ...current, [key]: value }));
  const updateAudience = <Key extends keyof InitiativeAudience>(key: Key, value: InitiativeAudience[Key]) =>
    update("audience", { ...values.audience, [key]: value });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitState({ type: "idle", message: "" });

    try {
      const payload = await submitForm(endpoint, values);
      setSubmitState({ type: "success", message: payload.message || "Initiative saved." });
      router.refresh();
    } catch (error) {
      setSubmitState({
        type: "error",
        message: error instanceof Error ? error.message : "We could not save this initiative.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <FormStatus state={submitState} />

      <Panel eyebrow="Initiative" title="Hero and identity">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Slug" value={values.slug} onChange={() => undefined} readOnly />
          <Field label="Eyebrow" value={values.eyebrow} onChange={(value) => update("eyebrow", value)} />
          <Field label="Title" value={values.title} onChange={(value) => update("title", value)} />
          <Field label="Tagline" value={values.tagline} onChange={(value) => update("tagline", value)} />
          <div className="md:col-span-2">
            <Field label="Description" value={values.description} multiline onChange={(value) => update("description", value)} />
          </div>
          <div className="md:col-span-2">
            <Field label="Intro" value={values.intro} multiline onChange={(value) => update("intro", value)} />
          </div>
          <Field label="Hero image" value={values.heroImage} onChange={(value) => update("heroImage", value)} />
          <Field label="Overview image" value={values.overviewImage} onChange={(value) => update("overviewImage", value)} />
          <div className="md:col-span-2">
            <Field label="Mission" value={values.mission} multiline onChange={(value) => update("mission", value)} />
          </div>
        </div>
      </Panel>

      <Panel title="Snapshot and objectives">
        <StatsEditor title="Hero snapshot stats" values={values.stats} onChange={(stats) => update("stats", stats)} />
        <div className="mt-8">
          <StringListEditor label="Objectives" values={values.objectives} onChange={(objectives) => update("objectives", objectives)} />
        </div>
      </Panel>

      <Panel title="How it works">
        <Repeater title="Process steps" addLabel="Add step" onAdd={() => update("howItWorks", [...values.howItWorks, emptyProcessStep])}>
          {values.howItWorks.map((step, index) => (
            <div key={`step-${index}`} className="grid gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-2">
              <Field label="Number" value={step.number} onChange={(value) => update("howItWorks", values.howItWorks.map((item, itemIndex) => (itemIndex === index ? { ...item, number: value } : item)))} />
              <Field label="Title" value={step.title} onChange={(value) => update("howItWorks", values.howItWorks.map((item, itemIndex) => (itemIndex === index ? { ...item, title: value } : item)))} />
              <Field label="Icon" value={step.icon} onChange={(value) => update("howItWorks", values.howItWorks.map((item, itemIndex) => (itemIndex === index ? { ...item, icon: value } : item)))} />
              <Field label="Icon image URL" value={step.iconImage ?? ""} onChange={(value) => update("howItWorks", values.howItWorks.map((item, itemIndex) => (itemIndex === index ? { ...item, iconImage: value } : item)))} />
              <div className="md:col-span-2">
                <Field label="Description" value={step.description} multiline onChange={(value) => update("howItWorks", values.howItWorks.map((item, itemIndex) => (itemIndex === index ? { ...item, description: value } : item)))} />
              </div>
              <RemoveButton onClick={() => update("howItWorks", values.howItWorks.filter((_, itemIndex) => itemIndex !== index))} />
            </div>
          ))}
        </Repeater>
      </Panel>

      <Panel title="Impact and audience">
        <StatsEditor title="Impact stats" values={values.impactStats} onChange={(impactStats) => update("impactStats", impactStats)} />
        <div className="mt-8 grid gap-5">
          <Field label="Audience summary" value={values.audience.summary} multiline onChange={(value) => updateAudience("summary", value)} />
          <StringListEditor label="Audience groups" values={values.audience.groups} onChange={(groups) => updateAudience("groups", groups)} />
          <StringListEditor label="Eligibility notes" values={values.audience.eligibility} onChange={(eligibility) => updateAudience("eligibility", eligibility)} />
        </div>
      </Panel>

      <Panel title="Gallery, testimonials, partners, and FAQs">
        <Repeater title="Gallery images" addLabel="Add image" onAdd={() => update("gallery", [...values.gallery, emptyGalleryImage])}>
          {values.gallery.map((image, index) => (
            <div key={`gallery-${index}`} className="grid gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-2">
              <Field label="Image URL" value={image.src} onChange={(value) => update("gallery", values.gallery.map((item, itemIndex) => (itemIndex === index ? { ...item, src: value } : item)))} />
              <Field label="Alt text" value={image.alt} onChange={(value) => update("gallery", values.gallery.map((item, itemIndex) => (itemIndex === index ? { ...item, alt: value } : item)))} />
              <RemoveButton onClick={() => update("gallery", values.gallery.filter((_, itemIndex) => itemIndex !== index))} />
            </div>
          ))}
        </Repeater>

        <div className="mt-8">
          <Repeater title="Testimonials" addLabel="Add testimonial" onAdd={() => update("testimonials", [...values.testimonials, emptyTestimonial])}>
            {values.testimonials.map((testimonial, index) => (
              <div key={`testimonial-${index}`} className="grid gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-2">
                <Field label="Name" value={testimonial.name} onChange={(value) => update("testimonials", values.testimonials.map((item, itemIndex) => (itemIndex === index ? { ...item, name: value } : item)))} />
                <Field label="Role" value={testimonial.role} onChange={(value) => update("testimonials", values.testimonials.map((item, itemIndex) => (itemIndex === index ? { ...item, role: value } : item)))} />
                <Field label="Avatar URL" value={testimonial.avatar ?? ""} onChange={(value) => update("testimonials", values.testimonials.map((item, itemIndex) => (itemIndex === index ? { ...item, avatar: value } : item)))} />
                <div className="md:col-span-2">
                  <Field label="Quote" value={testimonial.quote} multiline onChange={(value) => update("testimonials", values.testimonials.map((item, itemIndex) => (itemIndex === index ? { ...item, quote: value } : item)))} />
                </div>
                <RemoveButton onClick={() => update("testimonials", values.testimonials.filter((_, itemIndex) => itemIndex !== index))} />
              </div>
            ))}
          </Repeater>
        </div>

        <div className="mt-8">
          <Repeater title="Partners" addLabel="Add partner" onAdd={() => update("partners", [...values.partners, emptyPartner])}>
            {values.partners.map((partner, index) => (
              <div key={`partner-${index}`} className="grid gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-2">
                <Field label="Name" value={partner.name} onChange={(value) => update("partners", values.partners.map((item, itemIndex) => (itemIndex === index ? { ...item, name: value } : item)))} />
                <Field label="Href" value={partner.href ?? ""} onChange={(value) => update("partners", values.partners.map((item, itemIndex) => (itemIndex === index ? { ...item, href: value } : item)))} />
                <Field label="Logo URL" value={partner.logo ?? ""} onChange={(value) => update("partners", values.partners.map((item, itemIndex) => (itemIndex === index ? { ...item, logo: value } : item)))} />
                <div className="md:col-span-2">
                  <Field label="Description" value={partner.description} multiline onChange={(value) => update("partners", values.partners.map((item, itemIndex) => (itemIndex === index ? { ...item, description: value } : item)))} />
                </div>
                <RemoveButton onClick={() => update("partners", values.partners.filter((_, itemIndex) => itemIndex !== index))} />
              </div>
            ))}
          </Repeater>
        </div>

        <div className="mt-8">
          <Repeater title="FAQs" addLabel="Add FAQ" onAdd={() => update("faqs", [...values.faqs, emptyFaq])}>
            {values.faqs.map((faq, index) => (
              <div key={`faq-${index}`} className="grid gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-2">
                <Field label="Question" value={faq.question} onChange={(value) => update("faqs", values.faqs.map((item, itemIndex) => (itemIndex === index ? { ...item, question: value } : item)))} />
                <Field label="Answer" value={faq.answer} multiline onChange={(value) => update("faqs", values.faqs.map((item, itemIndex) => (itemIndex === index ? { ...item, answer: value } : item)))} />
                <RemoveButton onClick={() => update("faqs", values.faqs.filter((_, itemIndex) => itemIndex !== index))} />
              </div>
            ))}
          </Repeater>
        </div>
      </Panel>

      <Panel title="Apply CTA and related routes">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <Field label="CTA heading" value={values.applyCta.heading} onChange={(value) => update("applyCta", { ...values.applyCta, heading: value })} />
          </div>
          <div className="md:col-span-2">
            <Field label="CTA description" value={values.applyCta.description} multiline onChange={(value) => update("applyCta", { ...values.applyCta, description: value })} />
          </div>
          <Field label="Primary CTA label" value={values.applyCta.primary.label} onChange={(value) => update("applyCta", { ...values.applyCta, primary: { ...values.applyCta.primary, label: value } })} />
          <Field label="Primary CTA href" value={values.applyCta.primary.href} onChange={(value) => update("applyCta", { ...values.applyCta, primary: { ...values.applyCta.primary, href: value } })} />
          <Field label="Secondary CTA label" value={values.applyCta.secondary.label} onChange={(value) => update("applyCta", { ...values.applyCta, secondary: { ...values.applyCta.secondary, label: value } })} />
          <Field label="Secondary CTA href" value={values.applyCta.secondary.href} onChange={(value) => update("applyCta", { ...values.applyCta, secondary: { ...values.applyCta.secondary, href: value } })} />
        </div>
        <div className="mt-8">
          <RouteCardsEditor values={values.related} onChange={(related) => update("related", related)} />
        </div>
      </Panel>

      <SubmitButton isSubmitting={isSubmitting} label="Save initiative" />
    </form>
  );
}
