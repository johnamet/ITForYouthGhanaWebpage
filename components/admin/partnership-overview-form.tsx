"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowDown, ArrowUp, CheckCircle2, Loader2, Plus, Save, Trash2 } from "lucide-react";

import type {
  HighlightStat,
  PartnershipOverviewCard,
  PartnershipOverviewContent,
  RouteCard,
} from "@/types/content";

type ApiResponse = { success?: boolean; message?: string; errors?: unknown };
type SubmitState = { type: "idle" | "success" | "error"; message: string };

type Props = { initial: PartnershipOverviewContent };

const input =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20";

export function PartnershipOverviewForm({ initial }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<PartnershipOverviewContent>(() => initial);
  const [stats, setStats] = useState<HighlightStat[]>(initial.stats ?? []);
  const [valueCards, setValueCards] = useState<PartnershipOverviewCard[]>(initial.valueCards ?? []);
  const [partnerTypeCards, setPartnerTypeCards] = useState<PartnershipOverviewCard[]>(initial.partnerTypeCards ?? []);
  const [nextSteps, setNextSteps] = useState<RouteCard[]>(initial.nextSteps ?? []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({ type: "idle", message: "" });

  const update = <Key extends keyof PartnershipOverviewContent>(
    key: Key,
    value: PartnershipOverviewContent[Key],
  ) => setValues((v) => ({ ...v, [key]: value }));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitState({ type: "idle", message: "" });
    try {
      const payload = { ...values, stats, valueCards, partnerTypeCards, nextSteps };
      const resp = await fetch("/api/admin/partnerships/overview", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await resp.json().catch(() => null)) as ApiResponse | null;
      if (!resp.ok || !body?.success) {
        throw new Error(body?.message || "We couldn't save the overview.");
      }
      setSubmitState({ type: "success", message: body.message || "Overview updated." });
      router.refresh();
    } catch (err) {
      setSubmitState({ type: "error", message: err instanceof Error ? err.message : "We couldn't save the overview." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {submitState.type !== "idle" ? (
        <div className={`flex items-start gap-3 rounded-[24px] border p-5 text-sm font-medium ${submitState.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
          {submitState.type === "success" ? <CheckCircle2 className="mt-0.5 h-5 w-5" /> : <AlertCircle className="mt-0.5 h-5 w-5" />}
          <span>{submitState.message}</span>
        </div>
      ) : null}

      <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
        <h3 className="font-heading text-xl font-semibold text-brand-ink">Overview hero</h3>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <div><label className="text-sm font-bold text-brand-ink">Eyebrow</label><input className={input} value={values.eyebrow} onChange={(e) => update("eyebrow", e.target.value)} /></div>
          <div><label className="text-sm font-bold text-brand-ink">Hero image</label><input className={input} value={values.heroImage} onChange={(e) => update("heroImage", e.target.value)} /></div>
          <div className="md:col-span-2"><label className="text-sm font-bold text-brand-ink">Title</label><input className={input} value={values.title} onChange={(e) => update("title", e.target.value)} /></div>
          <div className="md:col-span-2"><label className="text-sm font-bold text-brand-ink">Description</label><textarea className={input + " h-28"} value={values.description} onChange={(e) => update("description", e.target.value)} /></div>
        </div>
      </section>

      <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
        <h3 className="font-heading text-xl font-semibold text-brand-ink">Stats</h3>
        <div className="mt-4 space-y-4">
          {stats.map((s, i) => (
            <div key={i} className="grid items-end gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-[1fr_1fr_1fr_auto_auto]">
              <div><label className="text-sm font-bold text-brand-ink">Value</label><input className={input} value={s.value ?? ""} onChange={(e) => setStats((arr) => arr.map((it, idx) => idx === i ? { ...it, value: e.target.value } : it))} /></div>
              <div><label className="text-sm font-bold text-brand-ink">Label</label><input className={input} value={s.label ?? ""} onChange={(e) => setStats((arr) => arr.map((it, idx) => idx === i ? { ...it, label: e.target.value } : it))} /></div>
              <div><label className="text-sm font-bold text-brand-ink">Icon</label><input className={input} value={s.icon ?? ""} onChange={(e) => setStats((arr) => arr.map((it, idx) => idx === i ? { ...it, icon: e.target.value } : it))} /></div>
              <div><label className="text-sm font-bold text-brand-ink">Icon image URL</label><input className={input} value={s.iconImage ?? ""} onChange={(e) => setStats((arr) => arr.map((it, idx) => idx === i ? { ...it, iconImage: e.target.value } : it))} /></div>
              <button type="button" onClick={() => setStats((arr) => (i <= 0 ? arr : ((n) => ([n[i-1], n[i]] = [n[i], n[i-1]], n))([...arr])))} className="rounded-full border border-brand-border p-2 text-brand-ink"><ArrowUp className="h-4 w-4" /></button>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setStats((arr) => (i >= arr.length-1 ? arr : ((n) => ([n[i], n[i+1]] = [n[i+1], n[i]], n))([...arr])))} className="rounded-full border border-brand-border p-2 text-brand-ink"><ArrowDown className="h-4 w-4" /></button>
                <button type="button" onClick={() => setStats((arr) => arr.filter((_it, idx) => idx !== i))} className="rounded-full border border-rose-200 p-2 text-rose-700"><Trash2 className="h-4 w-4" /></button>
              </div>
              <div className="md:col-span-3"><label className="text-sm font-bold text-brand-ink">Description</label><input className={input} value={s.description ?? ""} onChange={(e) => setStats((arr) => arr.map((it, idx) => idx === i ? { ...it, description: e.target.value } : it))} /></div>
            </div>
          ))}
          <button type="button" onClick={() => setStats((arr) => [...arr, { value: "", label: "", description: "", icon: "", iconImage: "" }])} className="inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm font-semibold text-brand-ink"><Plus className="h-4 w-4" /> Add stat</button>
        </div>
      </section>

      <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
        <h3 className="font-heading text-xl font-semibold text-brand-ink">Value cards</h3>
        <div className="mt-4 space-y-4">
          {valueCards.map((c, i) => (
            <div key={i} className="grid items-end gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-[1fr_2fr_auto]">
              <div><label className="text-sm font-bold text-brand-ink">Title</label><input className={input} value={c.title ?? ""} onChange={(e) => setValueCards((arr) => arr.map((it, idx) => idx === i ? { ...it, title: e.target.value } : it))} /></div>
              <div><label className="text-sm font-bold text-brand-ink">Description</label><input className={input} value={c.description ?? ""} onChange={(e) => setValueCards((arr) => arr.map((it, idx) => idx === i ? { ...it, description: e.target.value } : it))} /></div>
              <div className="flex items-center gap-2"><button type="button" onClick={() => setValueCards((arr) => arr.filter((_it, idx) => idx !== i))} className="rounded-full border border-rose-200 p-2 text-rose-700"><Trash2 className="h-4 w-4" /></button></div>
            </div>
          ))}
          <button type="button" onClick={() => setValueCards((arr) => [...arr, { title: "", description: "" }])} className="inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm font-semibold text-brand-ink"><Plus className="h-4 w-4" /> Add value card</button>
        </div>
      </section>

      <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
        <h3 className="font-heading text-xl font-semibold text-brand-ink">Partner type cards</h3>
        <div className="mt-4 space-y-4">
          {partnerTypeCards.map((c, i) => (
            <div key={i} className="grid items-end gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-[1fr_2fr_auto]">
              <div><label className="text-sm font-bold text-brand-ink">Title</label><input className={input} value={c.title ?? ""} onChange={(e) => setPartnerTypeCards((arr) => arr.map((it, idx) => idx === i ? { ...it, title: e.target.value } : it))} /></div>
              <div><label className="text-sm font-bold text-brand-ink">Description</label><input className={input} value={c.description ?? ""} onChange={(e) => setPartnerTypeCards((arr) => arr.map((it, idx) => idx === i ? { ...it, description: e.target.value } : it))} /></div>
              <div className="flex items-center gap-2"><button type="button" onClick={() => setPartnerTypeCards((arr) => arr.filter((_it, idx) => idx !== i))} className="rounded-full border border-rose-200 p-2 text-rose-700"><Trash2 className="h-4 w-4" /></button></div>
            </div>
          ))}
          <button type="button" onClick={() => setPartnerTypeCards((arr) => [...arr, { title: "", description: "" }])} className="inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm font-semibold text-brand-ink"><Plus className="h-4 w-4" /> Add partner type</button>
        </div>
      </section>

      <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
        <h3 className="font-heading text-xl font-semibold text-brand-ink">Next steps</h3>
        <div className="mt-4 space-y-4">
          {nextSteps.map((n, i) => (
            <div key={i} className="grid items-end gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-[1fr_1fr_1fr_auto]">
              <div><label className="text-sm font-bold text-brand-ink">Eyebrow</label><input className={input} value={n.eyebrow ?? ""} onChange={(e) => setNextSteps((arr) => arr.map((it, idx) => idx === i ? { ...it, eyebrow: e.target.value } : it))} /></div>
              <div><label className="text-sm font-bold text-brand-ink">Title</label><input className={input} value={n.title ?? ""} onChange={(e) => setNextSteps((arr) => arr.map((it, idx) => idx === i ? { ...it, title: e.target.value } : it))} /></div>
              <div><label className="text-sm font-bold text-brand-ink">Href</label><input className={input} value={n.href ?? ""} onChange={(e) => setNextSteps((arr) => arr.map((it, idx) => idx === i ? { ...it, href: e.target.value } : it))} /></div>
              <div className="flex items-center gap-2"><button type="button" onClick={() => setNextSteps((arr) => arr.filter((_it, idx) => idx !== i))} className="rounded-full border border-rose-200 p-2 text-rose-700"><Trash2 className="h-4 w-4" /></button></div>
              <div className="md:col-span-3"><label className="text-sm font-bold text-brand-ink">Description</label><input className={input} value={n.description ?? ""} onChange={(e) => setNextSteps((arr) => arr.map((it, idx) => idx === i ? { ...it, description: e.target.value } : it))} /></div>
            </div>
          ))}
          <button type="button" onClick={() => setNextSteps((arr) => [...arr, { href: "", eyebrow: "", title: "", description: "" }])} className="inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm font-semibold text-brand-ink"><Plus className="h-4 w-4" /> Add next step</button>
        </div>
      </section>

      <div className="flex items-center gap-3 rounded-[26px] border border-brand-border bg-white px-5 py-4 shadow-sm">
        <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70">
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save overview
        </button>
      </div>
    </form>
  );
}
