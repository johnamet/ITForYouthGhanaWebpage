import type { ContentBlock } from "@/types/content";
import { pointsToParagraph } from "@/lib/utils/prose";

type EditorialGuidanceGridProps = {
  eyebrow?: string | null;
  sections: ContentBlock[];
};

const hasText = (value?: string | null): value is string => Boolean(value?.trim());

export function EditorialGuidanceGrid({ eyebrow, sections }: EditorialGuidanceGridProps) {
  const visibleSections = sections.filter(
    (section) =>
      hasText(section.title) ||
      hasText(section.body) ||
      section.bullets?.some((paragraph) => hasText(paragraph)),
  );

  if (!visibleSections.length) return null;

  return (
    <div className="grid overflow-hidden border-y border-brand-border lg:grid-cols-2">
      {visibleSections.map((section, index) => {
        const supportingParagraph = pointsToParagraph(section.bullets);

        return (
          <article
            key={`${section.title}-${index}`}
            className={`relative px-1 py-10 sm:px-8 lg:px-10 lg:py-14 ${
              index > 0 ? "border-t border-brand-border lg:border-l lg:border-t-0" : ""
            }`}
          >
            {hasText(eyebrow) ? (
              <p className="relative text-[0.65rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
                {eyebrow}
              </p>
            ) : null}

            {hasText(section.title) ? (
              <h2 className="relative mt-4 max-w-xl font-heading text-3xl font-bold leading-tight text-brand-ink sm:text-4xl">
                {section.title}
              </h2>
            ) : null}

            {hasText(section.body) ? (
              <p className="relative mt-6 max-w-xl text-lg leading-8 text-slate-700">
                {section.body}
              </p>
            ) : null}

            {supportingParagraph ? (
              <div className="relative mt-7 max-w-xl border-l-2 border-brand-gold pl-5 sm:pl-6">
                <p className="text-[0.95rem] leading-8 text-slate-600">{supportingParagraph}</p>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
