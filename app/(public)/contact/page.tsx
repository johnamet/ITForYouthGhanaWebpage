export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[32px] bg-hero-grid p-10 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">Contact</p>
          <h1 className="mt-3 font-heading text-4xl font-semibold">Start the conversation</h1>
          <p className="mt-4 text-base leading-8 text-slate-200">
            The route is live, the API endpoint is scaffolded, and the page is ready for a future fully wired contact flow.
          </p>
          <div className="mt-8 space-y-3 text-sm text-slate-200">
            <p>info@itforyouthghana.org</p>
            <p>+233 596 244 834</p>
            <p>Accra, Ghana</p>
          </div>
        </div>

        <div className="rounded-[32px] border border-brand-border bg-white p-8 shadow-sm">
          <h2 className="font-heading text-2xl font-semibold text-brand-ink">Foundation form</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Form validation and a route handler are scaffolded. Live delivery wiring can be added in the next phase.
          </p>
          <div className="mt-8 grid gap-4">
            <input className="rounded-2xl border border-brand-border px-4 py-3" placeholder="Your name" />
            <input className="rounded-2xl border border-brand-border px-4 py-3" placeholder="Email address" />
            <input className="rounded-2xl border border-brand-border px-4 py-3" placeholder="Organisation (optional)" />
            <textarea className="min-h-40 rounded-2xl border border-brand-border px-4 py-3" placeholder="How can we help?" />
            <button type="button" className="rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white">
              Submission handler scaffolded
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
