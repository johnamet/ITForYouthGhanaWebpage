import { cn } from "@/lib/utils/cn";

type SlideshowStageProps = {
  className?: string;
  children: React.ReactNode;
};

/**
 * The quiet frame around the inset hero capsule.
 *
 * The concept deliberately keeps photographic atmosphere inside the capsule;
 * this stage owns only centring, spacing and the deep-navy ground visible around
 * the shell.
 */
export function SlideshowStage({ className, children }: SlideshowStageProps) {
  return (
    <div
      className={cn(
        "itfy-hero-stage",
        "relative isolate grid min-h-[calc(100svh-65px)] place-items-center overflow-x-hidden bg-[#05070f]",
        className,
      )}
    >
      {children}
    </div>
  );
}
