import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-md rounded-[32px] border border-brand-border bg-white p-10 shadow-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">Admin access</p>
        <h1 className="mt-4 font-heading text-4xl font-semibold text-brand-ink">Admin login scaffold</h1>
        <p className="mt-4 text-base leading-8 text-slate-600">
          Firebase email/password auth and session cookies will be wired here in the next phase.
        </p>
        <div className="mt-8 grid gap-4">
          <input className="rounded-2xl border border-brand-border px-4 py-3" placeholder="Email address" />
          <input className="rounded-2xl border border-brand-border px-4 py-3" placeholder="Password" type="password" />
          <button type="button" className="rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white">
            Auth wiring comes next
          </button>
        </div>
        <Link href="/" className="mt-6 inline-flex text-sm font-semibold text-brand-navy">
          Return to public site
        </Link>
      </div>
    </main>
  );
}
