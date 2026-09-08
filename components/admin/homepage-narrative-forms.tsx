"use client";

import type {
  ChallengeSectionContent,
  MissionSectionContent,
  OverviewSectionContent,
} from "@/components/home/legacy-homepage-sections";

const input =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20";

export function ChallengeSectionForm({
  value,
  onChange,
}: {
  value: ChallengeSectionContent;
  onChange: (next: ChallengeSectionContent) => void;
}) {
  const update = <K extends keyof ChallengeSectionContent>(key: K, next: ChallengeSectionContent[K]) =>
    onChange({ ...value, [key]: next });

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Section title" value={value.title} onChange={(value) => update("title", value)} />
        <Field label="Headline" value={value.headline} onChange={(value) => update("headline", value)} />
        <Field label="Description (optional)" value={value.description} onChange={(value) => update("description", value)} textarea wide />
        {value.stats.map((stat, index) => (
          <div key={index} className="rounded-2xl border border-brand-border bg-brand-mist/40 p-4 md:col-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">Statistic {index + 1}</p>
            <div className="mt-3 grid gap-4 md:grid-cols-3">
              {(["value", "label", "description"] as const).map((key) => (
                <Field key={key} label={key[0].toUpperCase() + key.slice(1)} value={stat[key]} onChange={(next) => update("stats", value.stats.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: next } : item))} />
              ))}
            </div>
          </div>
        ))}
        <Field label="Comparison title" value={value.comparisonTitle} onChange={(value) => update("comparisonTitle", value)} wide />
        <Field label="Problem column title" value={value.problemTitle} onChange={(value) => update("problemTitle", value)} />
        <Field label="Solution column title" value={value.solutionTitle} onChange={(value) => update("solutionTitle", value)} />
        <Field label="Problem items (one per line)" value={value.problemItems.join("\n")} onChange={(value) => update("problemItems", value.split("\n").filter(Boolean))} textarea />
        <Field label="Solution items (one per line)" value={value.solutionItems.join("\n")} onChange={(value) => update("solutionItems", value.split("\n").filter(Boolean))} textarea />
        <Field label="CTA supporting text" value={value.ctaText} onChange={(value) => update("ctaText", value)} wide />
        <Field label="CTA label" value={value.ctaLabel} onChange={(value) => update("ctaLabel", value)} />
        <Field label="CTA link" value={value.ctaHref} onChange={(value) => update("ctaHref", value)} />
        <Active checked={value.active !== false} onChange={(checked) => update("active", checked)} />
      </div>
    </div>
  );
}

export function OverviewSectionForm({
  value,
  onChange,
}: {
  value: OverviewSectionContent;
  onChange: (next: OverviewSectionContent) => void;
}) {
  const update = <K extends keyof OverviewSectionContent>(key: K, next: OverviewSectionContent[K]) =>
    onChange({ ...value, [key]: next });
  return <div className="space-y-6">
    <div className="grid gap-5 md:grid-cols-2">
      <Field label="Section title" value={value.title} onChange={(value) => update("title", value)} />
      <Field label="Headline" value={value.headline} onChange={(value) => update("headline", value)} />
      <Field label="Description (optional)" value={value.description} onChange={(value) => update("description", value)} textarea wide />
      <Field label="Story title" value={value.storyTitle} onChange={(value) => update("storyTitle", value)} />
      <Field label="Story headline" value={value.storyHeadline} onChange={(value) => update("storyHeadline", value)} />
      <Field label="Story description" value={value.storyDescription} onChange={(value) => update("storyDescription", value)} textarea wide />
      <Field label="Callout" value={value.callout} onChange={(value) => update("callout", value)} textarea wide />
      <Field label="Image URL" value={value.image} onChange={(value) => update("image", value)} />
      <Field label="Image alt text" value={value.imageAlt} onChange={(value) => update("imageAlt", value)} />
      <Field label="Image label" value={value.imageLabel} onChange={(value) => update("imageLabel", value)} />
      <Field label="Image caption" value={value.imageCaption} onChange={(value) => update("imageCaption", value)} />
      <Field label="Video URL (optional)" value={value.videoUrl ?? ""} onChange={(value) => update("videoUrl", value)} wide />
      <Field label="Video title (optional)" value={value.videoTitle ?? ""} onChange={(value) => update("videoTitle", value)} wide />
      <Field label="CTA label" value={value.ctaLabel} onChange={(value) => update("ctaLabel", value)} />
      <Field label="CTA link" value={value.ctaHref} onChange={(value) => update("ctaHref", value)} />
      <Active checked={value.active !== false} onChange={(checked) => update("active", checked)} />
    </div>
  </div>;
}

export function MissionSectionForm({
  value,
  onChange,
}: {
  value: MissionSectionContent;
  onChange: (next: MissionSectionContent) => void;
}) {
  const update = <K extends keyof MissionSectionContent>(key: K, next: MissionSectionContent[K]) =>
    onChange({ ...value, [key]: next });

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Section title" value={value.title} onChange={(value) => update("title", value)} />
        <Field label="Headline" value={value.headline} onChange={(value) => update("headline", value)} />
        <Field label="Description (optional)" value={value.description} onChange={(value) => update("description", value)} textarea wide />
        <Field label="Image path" value={value.image} onChange={(value) => update("image", value)} />
        <Field label="Image alt text" value={value.imageAlt} onChange={(value) => update("imageAlt", value)} />
        <Field label="Image label" value={value.imageLabel} onChange={(value) => update("imageLabel", value)} />
        <Field label="Image caption" value={value.imageCaption} onChange={(value) => update("imageCaption", value)} />
        <Field label="Video URL (optional)" value={value.videoUrl ?? ""} onChange={(value) => update("videoUrl", value)} wide />
        <Field label="Video title (optional)" value={value.videoTitle ?? ""} onChange={(value) => update("videoTitle", value)} wide />
        <Field label="Mission title" value={value.missionTitle} onChange={(value) => update("missionTitle", value)} />
        <Field label="Mission headline" value={value.missionHeadline} onChange={(value) => update("missionHeadline", value)} />
        <Field label="Mission description" value={value.missionDescription} onChange={(value) => update("missionDescription", value)} textarea wide />
        <Field label="CTA label" value={value.ctaLabel} onChange={(value) => update("ctaLabel", value)} />
        <Field label="CTA link" value={value.ctaHref} onChange={(value) => update("ctaHref", value)} />
        <Active checked={value.active !== false} onChange={(checked) => update("active", checked)} />
      </div>
    </div>
  );
}

function Field({ label, value, onChange, textarea = false, wide = false }: { label: string; value: string; onChange: (value: string) => void; textarea?: boolean; wide?: boolean }) {
  return (
    <label className={wide ? "md:col-span-2" : ""}>
      <span className="text-sm font-bold text-brand-ink">{label}</span>
      {textarea ? <textarea className={`${input} h-28`} value={value} onChange={(event) => onChange(event.target.value)} /> : <input className={input} value={value} onChange={(event) => onChange(event.target.value)} />}
    </label>
  );
}

function Active({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="inline-flex items-center gap-3 rounded-2xl border border-brand-border bg-brand-mist px-4 py-3 text-sm font-medium text-brand-ink"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 rounded border-slate-300" />Active</label>;
}
