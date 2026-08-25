import { cn } from "@/lib/utils/cn";

type SlideshowStageProps = {
  className?: string;
  children: React.ReactNode;
};

/**
 * The frame the hero capsule sits in.
 *
 * Deliberately almost nothing. It used to carry the blurred photograph, the
 * per-slide wash and two drifting blooms, all of which existed to give a
 * floating capsule something to float on. The capsule now fills the hero, so
 * every one of those layers was hidden behind it and doing no work; the
 * photograph and the wash moved inside the capsule (see CapsuleGround).
 *
 * What is left is the inset ground visible in the few pixels around the shell,
 * and the positioning context the controls anchor to. --hero-inset is the same
 * value the hero capsule uses for its own sizing, so the margin and the height
 * calculation cannot drift apart.
 */
export function SlideshowStage({ className, children }: SlideshowStageProps) {
  return (
    <div
      className={cn(
        "itfy-hero-stage",
        "relative isolate grid min-h-[100svh] place-items-center overflow-hidden bg-[#05070f]",
        className,
      )}
    >
      {children}
    </div>
  );
}
