"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { adminNavigation } from "@/lib/content/site-config";
import { cn } from "@/lib/utils/cn";

type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-0 lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-white/10 bg-slate-950/95 px-6 py-8">
          <Link href="/admin/dashboard" className="block font-heading text-2xl font-semibold">
            ITFY Admin
          </Link>
          <p className="mt-2 text-sm text-slate-400">Scaffolded shell for Firebase-authenticated CMS work.</p>
          <nav className="mt-10 grid gap-2">
            {adminNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-2xl px-4 py-3 text-sm transition",
                  pathname === item.href ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/10",
                )}
              >
                <span className="block font-semibold">{item.label}</span>
                <span className="mt-1 block text-xs opacity-70">{item.description}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <main className="bg-slate-100 px-4 py-8 text-slate-900 sm:px-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
