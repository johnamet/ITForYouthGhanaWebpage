"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

import type { JoinCtaCard } from "@/components/home/join-cta-block";

const input =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20";

export function JoinCtaCardsForm({
  value,
  onChange,
}: {
  value: JoinCtaCard[];
  onChange: (next: JoinCtaCard[]) => void;
}) {
  const setCards = (updater: (current: JoinCtaCard[]) => JoinCtaCard[]) =>
    onChange(updater(value));

  const update = <Key extends keyof JoinCtaCard>(i: number, key: Key, val: JoinCtaCard[Key]) =>
    setCards((arr) => {
      const next = [...arr];
      next[i] = { ...next[i]!, [key]: val };
      return next;
    });

  const add = () =>
    setCards((arr) => [
      ...arr,
      {
        id: `cta-${Date.now()}`,
        eyebrow: "",
        title: "",
        description: "",
        href: "/",
        buttonLabel: "Learn more",
        icon: "students",
        active: true,
      },
    ]);

  const remove = (i: number) => setCards((arr) => arr.filter((_, idx) => idx !== i));
  const up = (i: number) => setCards((arr) => (i <= 0 ? arr : ((n) => ([n[i - 1], n[i]] = [n[i]!, n[i - 1]!], n))([...arr])));
  const down = (i: number) => setCards((arr) => (i >= arr.length - 1 ? arr : ((n) => ([n[i], n[i + 1]] = [n[i + 1]!, n[i]!], n))([...arr])));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={add} type="button" className="inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm font-semibold text-brand-ink">
          <Plus className="h-4 w-4" /> Add card
        </button>
      </div>

      {value.map((card, i) => (
        <section key={card.id} className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading text-lg font-semibold text-brand-ink">Card {i + 1}</h3>
            <div className="flex items-center gap-2">
              <button onClick={() => up(i)} type="button" className="rounded-full border border-brand-border p-2 text-brand-ink"><ArrowUp className="h-4 w-4" /></button>
              <button onClick={() => down(i)} type="button" className="rounded-full border border-brand-border p-2 text-brand-ink"><ArrowDown className="h-4 w-4" /></button>
              <button onClick={() => remove(i)} type="button" className="rounded-full border border-rose-200 p-2 text-rose-700"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>

          <div className="grid gap-5">
            <div><label className="text-sm font-bold text-brand-ink">ID</label><input className={input} value={card.id} onChange={(e) => update(i, "id", e.target.value)} /></div>
            <div><label className="text-sm font-bold text-brand-ink">Icon</label>
              <select className={input} value={card.icon} onChange={(e) => update(i, "icon", e.target.value as JoinCtaCard["icon"])}>
                {(["students","organisations","volunteer"] as JoinCtaCard["icon"][]).map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div><label className="text-sm font-bold text-brand-ink">Eyebrow</label><input className={input} value={card.eyebrow} onChange={(e) => update(i, "eyebrow", e.target.value)} /></div>
            <div className="md:col-span-2"><label className="text-sm font-bold text-brand-ink">Title</label><input className={input} value={card.title} onChange={(e) => update(i, "title", e.target.value)} /></div>
            <div className="md:col-span-2"><label className="text-sm font-bold text-brand-ink">Description</label><input className={input} value={card.description} onChange={(e) => update(i, "description", e.target.value)} /></div>
            <div><label className="text-sm font-bold text-brand-ink">Href</label><input className={input} value={card.href} onChange={(e) => update(i, "href", e.target.value)} /></div>
            <div><label className="text-sm font-bold text-brand-ink">Button label</label><input className={input} value={card.buttonLabel} onChange={(e) => update(i, "buttonLabel", e.target.value)} /></div>
            <label className="inline-flex items-center gap-3 rounded-2xl border border-brand-border bg-brand-mist px-4 py-3 text-sm font-medium text-brand-ink">
              <input type="checkbox" checked={card.active !== false} onChange={(e) => update(i, "active", e.target.checked)} className="h-4 w-4 rounded border-slate-300" /> Active
            </label>
          </div>
        </section>
      ))}
    </div>
  );
}
