import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type CapsuleShellProps = {
  /** The circular lens. Becomes the shell's leading lobe. */
  media: ReactNode;
  /** The text side. */
  children: ReactNode;
  /**
   * Optional fill rendered behind the media and text and clipped to the shell's
   * own radius. The hero passes a blurred copy of the slide photograph here.
   */
  background?: ReactNode;
  tone?: "dark" | "paper";
  /** "hero" fills the viewport; "inline" sits in the page flow. */
  variant?: "inline" | "hero";
  /** Set false for a shell that is already on screen, e.g. a static page. */
  animateIn?: boolean;
  className?: string;
};

/**
 * The capsule silhouette: one continuous shape in which the media is not placed
 * inside the shell, it IS the shell's leading lobe.
 *
 * The leading (left) end is a semicircle whose radius equals half the lens
 * diameter, so the two arcs are the same arc and the outline has no seam. Both
 * come from a single --capsule-h custom property; see app/globals.css, which
 * also explains why the trailing corners must not be 999px.
 *
 * Deliberately knows nothing about slideshows. Give it static content and it is
 * a static capsule.
 */
export function CapsuleShell({
  media,
  children,
  background,
  tone = "dark",
  variant = "inline",
  animateIn = true,
  className,
}: CapsuleShellProps) {
  return (
    <div
      className={cn(
        "itfy-capsule",
        tone === "dark" ? "itfy-capsule--dark" : "itfy-capsule--paper",
        variant === "hero" && "itfy-capsule--hero",
        animateIn && "itfy-animate-capsule-in",
        className,
      )}
    >
      {background}
      <div className="itfy-capsule__media">{media}</div>
      <div className="itfy-capsule__content">{children}</div>
    </div>
  );
}
