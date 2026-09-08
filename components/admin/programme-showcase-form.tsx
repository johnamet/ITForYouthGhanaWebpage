"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

import type { ProgrammeShowcaseItem } from "@/types/content";

const input =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20";

export function ProgrammeShowcaseForm({
  value,
  onChange,
}: {
  value: ProgrammeShowcaseItem[];
  onChange: (next: ProgrammeShowcaseItem[]) => void;
}) {
  const setItems = (
    updater: (current: ProgrammeShowcaseItem[]) => ProgrammeShowcaseItem[],
  ) => onChange(updater(value));

  const update = <Key extends keyof ProgrammeShowcaseItem>(i: number, key: Key, val: ProgrammeShowcaseItem[Key]) =>
    setItems((arr) => {
      const next = [...arr];
      next[i] = { ...next[i]!, [key]: val };
      return next;
    });

  const add = () =>
    setItems((arr) => [
      ...arr,
      {
        id: `showcase-${Date.now()}`,
        title: "",
        description: "",
        href: "/",
        image: "",
        accent: "#1E72BA",
        icon: "•",
        eyebrow: "",
        active: true,
      },
    ]);

  const remove = (i: number) => setItems((arr) => arr.filter((_, idx) => idx !== i));
  const up = (i: number) => setItems((arr) => (i <= 0 ? arr : ((n) => ([n[i - 1], n[i]] = [n[i]!, n[i - 1]!], n))([...arr])));
  const down = (i: number) => setItems((arr) => (i >= arr.length - 1 ? arr : ((n) => ([n[i], n[i + 1]] = [n[i + 1]!, n[i]!], n))([...arr])));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={add} type="button" className="inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm font-semibold text-brand-ink">
          <Plus className="h-4 w-4" /> Add card
        </button>
      </div>

      {value.map((item, i) => (
        <section key={item.id} className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading text-lg font-semibold text-brand-ink">Card {i + 1}</h3>
            <div className="flex items-center gap-2">
              <button onClick={() => up(i)} type="button" className="rounded-full border border-brand-border p-2 text-brand-ink"><ArrowUp className="h-4 w-4" /></button>
              <button onClick={() => down(i)} type="button" className="rounded-full border border-brand-border p-2 text-brand-ink"><ArrowDown className="h-4 w-4" /></button>
              <button onClick={() => remove(i)} type="button" className="rounded-full border border-rose-200 p-2 text-rose-700"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div><label className="text-sm font-bold text-brand-ink">ID</label><input className={input} value={item.id} onChange={(e) => update(i, "id", e.target.value)} /></div>
            <div><label className="text-sm font-bold text-brand-ink">Eyebrow</label><input className={input} value={item.eyebrow ?? ""} onChange={(e) => update(i, "eyebrow", e.target.value)} /></div>
            <div className="md:col-span-2"><label className="text-sm font-bold text-brand-ink">Title</label><input className={input} value={item.title} onChange={(e) => update(i, "title", e.target.value)} /></div>
            <div className="md:col-span-2"><label className="text-sm font-bold text-brand-ink">Description</label><input className={input} value={item.description} onChange={(e) => update(i, "description", e.target.value)} /></div>
            <div><label className="text-sm font-bold text-brand-ink">Href</label><input className={input} value={item.href} onChange={(e) => update(i, "href", e.target.value)} /></div>
            <div><label className="text-sm font-bold text-brand-ink">Image</label><input className={input} value={item.image} onChange={(e) => update(i, "image", e.target.value)} /></div>
            <div><label className="text-sm font-bold text-brand-ink">Accent color</label><input className={input} value={item.accent} onChange={(e) => update(i, "accent", e.target.value)} /></div>
            <div><label className="text-sm font-bold text-brand-ink">Icon (emoji or single char)</label><input className={input} value={item.icon ?? ""} onChange={(e) => update(i, "icon", e.target.value)} /></div>
            <label className="inline-flex items-center gap-3 rounded-2xl border border-brand-border bg-brand-mist px-4 py-3 text-sm font-medium text-brand-ink">
              <input type="checkbox" checked={item.active !== false} onChange={(e) => update(i, "active", e.target.checked)} className="h-4 w-4 rounded border-slate-300" /> Active
            </label>
          </div>
        </section>
      ))}
    </div>
  );
}
