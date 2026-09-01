import { ContentImage } from "@/components/media/content-image";
import { cn } from "@/lib/utils/cn";
import type { Story } from "@/types/laptop-bank";

type StoryCardProps = {
  story: Story;
  className?: string;
};

/**
 * C10 — recipient story card.
 *
 * Spec §3: "Reads Story content type. Renders only records where publication
 * consent = true."
 *
 * THIS COMPONENT DOES NOT FILTER. getPublishableStories() in
 * lib/cms/laptop-bank.ts already applied both consent rules — the
 * publication_consent filter, and spec 5.14's rule that preferred_name,
 * institution and photo may never render together without a
 * consent_record_ref, which it enforces by stripping institution and photo
 * from a story that lacks one. So this component renders exactly the fields it
 * is handed and asks no questions: if `institution` is undefined here, that is
 * the query having done its job.
 *
 * Draft 1 §16 also forbids any composite story presented as an individual.
 * There is no seed Story record anywhere in this codebase for that reason.
 */
export function StoryCard({ story, className }: StoryCardProps) {
  const meta = [story.pathway?.trim(), story.institution?.trim(), story.region?.trim()].filter(
    Boolean,
  );

  return (
    <figure
      className={cn(
        "flex flex-col gap-5 rounded-[30px] border border-brand-border bg-white p-6 shadow-sm",
        className,
      )}
    >
      {story.photo?.trim() ? (
        <ContentImage
          src={story.photo}
          alt={story.preferred_name}
          aspectRatio="landscape"
          sizes="(min-width: 1024px) 33vw, 100vw"
        />
      ) : null}
      <blockquote className="border-l-2 border-brand-gold pl-5 text-base leading-8 text-brand-ink">
        {story.quote}
      </blockquote>
      <figcaption>
        <p className="font-heading text-lg font-bold text-brand-ink">{story.preferred_name}</p>
        {meta.length ? <p className="mt-1 text-sm leading-7 text-slate-500">{meta.join(" · ")}</p> : null}
      </figcaption>
    </figure>
  );
}

export function StoryGrid({ stories, className }: { stories: Story[]; className?: string }) {
  if (!stories.length) return null;

  return (
    <div className={cn("grid gap-5 lg:grid-cols-3", className)}>
      {stories.map((story, index) => (
        <StoryCard key={`${story.preferred_name}-${index}`} story={story} />
      ))}
    </div>
  );
}
