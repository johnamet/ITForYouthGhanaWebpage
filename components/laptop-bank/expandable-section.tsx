"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type ExpandableSectionProps = {
  /** Becomes the element id and therefore the deep-link fragment. */
  id: string;
  title: string;
  children: ReactNode;
  /** Rendered below the body, above the fold line. */
  footer?: ReactNode;
  /** Open on first render regardless of the fragment. */
  defaultOpen?: boolean;
  className?: string;
};

/**
 * C4 — an expandable section with a deep-linkable anchor.
 *
 * Spec §3: "Deep-linkable anchor. Opens automatically when the URL fragment
 * matches."
 *
 * Built on native <details> rather than a React-state accordion so it still
 * expands with JavaScript disabled or not yet hydrated. That matters here:
 * spec 5.8 targets a page under 500 KB for applicants on mobile data, and
 * Draft 1 §14.1 asks that the apply journey avoids heavy JS dependencies. A
 * reader who lands on /laptop-bank/how-it-works#stage-5 from a slow connection
 * gets the content either way — the effect below only adds the auto-open and
 * the scroll.
 */
export function ExpandableSection({
  id,
  title,
  children,
  footer,
  defaultOpen = false,
  className,
}: ExpandableSectionProps) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const openIfTargeted = () => {
      if (window.location.hash !== `#${id}`) return;
      const element = ref.current;
      if (!element) return;
      element.open = true;
      element.scrollIntoView({ block: "start" });
    };

    // Runs on mount for a direct load, and on hashchange because Next's
    // client-side navigation can change the fragment without remounting this
    // component — an in-page anchor link from the stepper does exactly that.
    openIfTargeted();
    window.addEventListener("hashchange", openIfTargeted);
    return () => window.removeEventListener("hashchange", openIfTargeted);
  }, [id]);

  return (
    <details
      ref={ref}
      id={id}
      open={defaultOpen}
      className={cn(
        "group scroll-mt-36 rounded-[28px] border border-brand-border bg-white p-6 shadow-sm",
        className,
      )}
    >
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-heading text-xl font-bold text-brand-ink sm:text-2xl">
        <span>{title}</span>
        <span
          aria-hidden="true"
          className="mt-1 shrink-0 text-sm font-bold text-brand-gold transition group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="mt-4 text-sm leading-7 text-slate-600">{children}</div>
      {footer ? <div className="mt-6 border-t border-brand-border pt-4">{footer}</div> : null}
    </details>
  );
}
