"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { adminNavigation } from "@/lib/content/site-config";
import { cn } from "@/lib/utils/cn";
import type { AdminSessionUser } from "@/lib/firebase/auth";

type AdminShellProps = {
  children: React.ReactNode;
  adminUser: AdminSessionUser;
};

export function AdminShell({ children, adminUser }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const isActiveNavItem = (href: string) => {
    if (pathname === href || pathname.startsWith(`${href}/`)) {
      return true;
    }

    if (href.startsWith("/admin/content") && pathname.startsWith("/admin/content")) {
      return true;
    }

    if (href.startsWith("/admin/programmes") && pathname.startsWith("/admin/programmes")) {
      return true;
    }

    return false;
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);

    await fetch("/api/admin/session", {
      method: "DELETE",
    }).catch(() => null);

    router.replace("/admin-login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-0 lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-white/10 bg-slate-950/95 px-6 py-8">
          <Link href="/admin/dashboard" className="block font-heading text-2xl font-semibold">
            ITFY Admin
          </Link>
          <p className="mt-2 text-sm text-slate-400">Firebase-authenticated CMS workspace.</p>
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">
              Signed in
            </p>
            <p className="mt-2 truncate text-sm font-semibold text-white">
              {adminUser.email}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {adminUser.role} via {adminUser.source}
            </p>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="mt-4 w-full rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSigningOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
          <nav className="mt-10 grid gap-2">
            {adminNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-2xl px-4 py-3 text-sm transition",
                  isActiveNavItem(item.href)
                    ? "bg-white text-slate-950"
                    : "text-slate-300 hover:bg-white/10",
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
