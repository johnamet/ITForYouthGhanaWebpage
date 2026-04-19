import Link from "next/link";

export default function DonatePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] bg-brand-warm p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">Donate</p>
          <h1 className="mt-3 font-heading text-4xl font-semibold text-brand-ink">Support the next chapter</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-700">
            The foundation pass gives giving a dedicated destination in the new architecture, ready for campaign stories,
            progress indicators, and external payment integrations in the next phase.
          </p>
          <div className="mt-8 rounded-[28px] bg-white p-6 shadow-sm">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-brand-ink">Campaign seed</p>
                <p className="mt-1 text-3xl font-semibold text-brand-navy">GHS 45,230 raised</p>
              </div>
              <p className="text-sm text-slate-500">Goal: GHS 67,500</p>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-brand-mist">
              <div className="h-full w-2/3 rounded-full bg-brand-gold" />
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-brand-border bg-white p-8 shadow-sm">
          <h2 className="font-heading text-2xl font-semibold text-brand-ink">Next implementation steps</h2>
          <ul className="mt-5 grid gap-3 text-sm leading-7 text-slate-600">
            <li>• Wire external donation processor or internal route</li>
            <li>• Connect campaign values to CMS-managed content</li>
            <li>• Surface impact explanation alongside the CTA</li>
          </ul>
          <Link href="/contact" className="mt-8 inline-flex rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white">
            Talk to the team
          </Link>
        </div>
      </div>
    </div>
  );
}
