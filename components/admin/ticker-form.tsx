"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

import { MarqueeTicker } from "@/components/home/marquee-ticker";
import type { MarqueeTickerContent, MarqueeTickerItem, MarqueeTickerMode } from "@/components/home/marquee-ticker";

const input =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20";
const smallInput =
  "mt-2 w-56 rounded-2xl border border-brand-border bg-white px-3 py-2 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20";

export function TickerForm({
  value,
  onChange,
}: {
  value: MarqueeTickerContent;
  onChange: (next: MarqueeTickerContent) => void;
}) {
  const setValues = (updater: (current: MarqueeTickerContent) => MarqueeTickerContent) =>
    onChange(updater(value));

  const update = <Key extends keyof MarqueeTickerContent>(key: Key, val: MarqueeTickerContent[Key]) => setValues((v) => ({ ...v, [key]: val }));

  const addItem = () => setValues((v) => ({ ...v, items: [...v.items, { label: "", href: "" }] }));
  const removeItem = (i: number) => setValues((v) => ({ ...v, items: v.items.filter((_, idx) => idx !== i) }));
  const updateItem = <Key extends keyof MarqueeTickerItem>(i: number, key: Key, val: MarqueeTickerItem[Key]) =>
    setValues((v) => ({ ...v, items: v.items.map((it, idx) => (idx === i ? { ...it, [key]: val } : it)) }));
  const up = (i: number) => setValues((v) => (i <= 0 ? v : { ...v, items: ((n) => ([n[i - 1], n[i]] = [n[i]!, n[i - 1]!], n))([...v.items]) }));
  const down = (i: number) => setValues((v) => (i >= v.items.length - 1 ? v : { ...v, items: ((n) => ([n[i], n[i + 1]] = [n[i + 1]!, n[i]!], n))([...v.items]) }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="text-sm font-bold text-brand-ink">Mode</label>
            <select className={smallInput} value={value.mode} onChange={(e) => update("mode", e.target.value as MarqueeTickerMode)}>
              {(["stats","partners","news","announcement"] as MarqueeTickerMode[]).map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-bold text-brand-ink">Speed</label>
            <select className={smallInput} value={value.speed ?? "medium"} onChange={(e) => update("speed", e.target.value as MarqueeTickerContent["speed"])}>
              {(["slow","medium","fast"] as (NonNullable<MarqueeTickerContent["speed"]>)[]).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <label className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-brand-border bg-brand-mist px-4 py-3 text-sm font-medium text-brand-ink">
            <input type="checkbox" checked={value.pauseOnHover ?? false} onChange={(e) => update("pauseOnHover", e.target.checked)} className="h-4 w-4 rounded border-slate-300" />
            Pause on hover
          </label>
        </div>
      </div>

      <div className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold text-brand-ink">Items</h3>
          <button onClick={addItem} type="button" className="inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm font-semibold text-brand-ink"><Plus className="h-4 w-4" /> Add item</button>
        </div>

        <div className="space-y-4">
          {value.items.map((it, i) => (
            <div key={`${it.label}-${i}`} className="grid items-end gap-4 rounded-2xl border border-brand-border p-4">
              <div>
                <label className="text-sm font-bold text-brand-ink">Label</label>
                <input className={input} value={it.label} onChange={(e) => updateItem(i, "label", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-bold text-brand-ink">Href (optional)</label>
                <input className={input} value={it.href ?? ""} onChange={(e) => updateItem(i, "href", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-bold text-brand-ink">Type (optional)</label>
                <select
                  className={smallInput}
                  value={it.type ?? ""}
                  onChange={(e) => updateItem(i, "type", e.target.value ? (e.target.value as MarqueeTickerMode) : undefined)}
                >
                  <option value="">Any</option>
                  {(["stats","partners","news","announcement"] as MarqueeTickerMode[]).map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => up(i)} type="button" className="rounded-full border border-brand-border p-2 text-brand-ink"><ArrowUp className="h-4 w-4" /></button>
                <button onClick={() => down(i)} type="button" className="rounded-full border border-brand-border p-2 text-brand-ink"><ArrowDown className="h-4 w-4" /></button>
              </div>
              <button onClick={() => removeItem(i)} type="button" className="h-10 rounded-xl border border-rose-200 px-3 text-sm font-semibold text-rose-700"><Trash2 className="mr-1 inline-block h-4 w-4" /> Remove</button>
            </div>
          ))}
        </div>
      </div>

      {/* Live preview */}
      <section className="overflow-hidden rounded-[30px] border border-brand-border bg-gray-950">
        <div className="border-b border-white/10 p-4">
          <h4 className="text-sm font-semibold text-white">Preview</h4>
          <p className="mt-1 text-xs text-white/50">This simulates the marquee with the current values. Save to publish.</p>
        </div>
        <MarqueeTicker ticker={value} />
      </section>
    </div>
  );
}
