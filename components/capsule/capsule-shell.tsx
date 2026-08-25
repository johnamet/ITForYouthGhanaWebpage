import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type CapsuleShellProps = {
  /** The circular lens. */
  media: ReactNode;
  /** The text side. */
  children: ReactNode;
  /** Optional fill clipped to the shell, used by the homepage hero. */
  background?: ReactNode;
  tone?: "dark" | "paper";
  /** "hero" uses the contained homepage layout; "inline" uses the leading lobe. */
  variant?: "inline" | "hero";
  /** Set false for a shell that is already on screen, e.g. a static page. */
  animateIn?: boolean;
  className?: string;
};

/**
 * The shared capsule silhouette.
 *
 * Inline capsules keep the established leading-lobe treatment. The homepage
 * hero uses a contained-lens variant from the approved concept sketch: the
 * media sits inside a rounded rectangular shell whose background is supplied
 * through `background`.
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
