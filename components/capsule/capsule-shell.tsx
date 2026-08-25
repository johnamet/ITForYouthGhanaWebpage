import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type CapsuleShellProps = {
  /** The circular lens. Becomes the shell's leading lobe. */
  media: ReactNode;
  /** The text side. */
  children: ReactNode;
  tone?: "dark" | "paper";
  /** Set false for a shell that is already on screen, e.g. a static page. */
  animateIn?: boolean;
  className?: string;
};

/**
 * The capsule silhouette: one continuous stadium in which the media is not
 * placed inside the shell, it IS the shell's leading lobe.
 *
 * Geometry lives in app/globals.css under .itfy-capsule, because the lens
 * radius and the shell's end-arc radius have to be derived from a single
 * custom property to stay coincident, and masks and calc() radii are
 * unreadable as inline utility classes.
 *
 * Deliberately knows nothing about slideshows. Give it static content and it
 * is a static capsule.
 */
export function CapsuleShell({
  media,
  children,
  tone = "dark",
  animateIn = true,
  className,
}: CapsuleShellProps) {
  return (
    <div
      className={cn(
        "itfy-capsule",
        tone === "dark" ? "itfy-capsule--dark" : "itfy-capsule--paper",
        animateIn && "itfy-animate-capsule-in",
        className,
      )}
    >
      <div className="itfy-capsule__media">{media}</div>
      <div className="itfy-capsule__content">{children}</div>
    </div>
  );
}
