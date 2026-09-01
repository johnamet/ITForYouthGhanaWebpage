"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type StickyMobileCtaProps = {
  label: string;
  href: string;
};

/** Spec C14: appears after 40% scroll. */
const SCROLL_TRIGGER = 0.4;

/**
 * C14 — sticky mobile call to action.
 *
 * Spec §3: "Appears below 768px after 40% scroll. One button."
 *
 * Progress is measured against the scrollable distance rather than raw page
 * height, so a page shorter than the viewport (scrollable === 0) never leaves
 * the bar permanently off-screen or permanently on.
 */
export function StickyMobileCta({ label, href }: StickyMobileCtaProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(scrollable > 0 && window.scrollY / scrollable >= SCROLL_TRIGGER);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      // aria-hidden while off-screen so a screen reader does not announce a
      // button the sighted reader cannot yet see, and inert to pointers so the
      // translated-out bar cannot swallow taps at the bottom of the page.
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-brand-border bg-white/95 p-3 shadow-[0_-8px_24px_rgba(20,40,80,0.12)] backdrop-blur transition-transform duration-200 md:hidden",
        visible ? "translate-y-0" : "pointer-events-none translate-y-full",
      )}
    >
      <Button href={href} variant="solid-pink" size="lg" className="w-full">
        {label}
      </Button>
    </div>
  );
}
