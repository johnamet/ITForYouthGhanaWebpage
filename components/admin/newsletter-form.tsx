"use client";

import type { NewsletterSignupContent } from "@/components/home/newsletter-signup-section";

const input =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20";

export function NewsletterForm({
  value,
  onChange,
}: {
  value: NewsletterSignupContent;
  onChange: (next: NewsletterSignupContent) => void;
}) {
  const setValues = (
    updater: (current: NewsletterSignupContent) => NewsletterSignupContent,
  ) => onChange(updater(value));

  const update = <Key extends keyof NewsletterSignupContent>(key: Key, val: NewsletterSignupContent[Key]) => setValues((v) => ({ ...v, [key]: val }));

  return (
    <div className="space-y-8">
      <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-gold">Homepage</p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-brand-ink">Newsletter signup</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="text-sm font-bold text-brand-ink">Eyebrow</label>
            <input className={input} value={value.eyebrow} onChange={(e) => update("eyebrow", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-bold text-brand-ink">Heading</label>
            <input className={input} value={value.heading} onChange={(e) => update("heading", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-bold text-brand-ink">Description</label>
            <textarea className={input + " h-24"} value={value.description} onChange={(e) => update("description", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-bold text-brand-ink">Privacy note</label>
            <textarea className={input + " h-20"} value={value.privacyNote} onChange={(e) => update("privacyNote", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-bold text-brand-ink">Interest tag</label>
            <input className={input} value={value.interest ?? ""} onChange={(e) => update("interest", e.target.value)} />
          </div>
          <label className="mt-2 inline-flex items-center gap-3 rounded-2xl border border-brand-border bg-brand-mist px-4 py-3 text-sm font-medium text-brand-ink">
            <input type="checkbox" checked={value.active !== false} onChange={(e) => update("active", e.target.checked)} className="h-4 w-4 rounded border-slate-300" />
            Active
          </label>
        </div>
      </section>
    </div>
  );
}
