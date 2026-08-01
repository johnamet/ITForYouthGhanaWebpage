type SectionHeadingProps = {
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const visibleEyebrow = eyebrow?.trim();
  const visibleTitle = title?.trim();
  const visibleDescription = description?.trim();

  if (!visibleEyebrow && !visibleTitle && !visibleDescription) return null;

  const alignClass = align === "center" ? "text-center mx-auto" : "";

  return (
    <div className={`space-y-3 ${alignClass}`}>
      {visibleEyebrow ? <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
        {visibleEyebrow}
      </p> : null}
      {visibleTitle ? <h2
        className={`font-heading text-3xl font-bold leading-snug text-brand-ink sm:text-4xl ${
          align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"
        }`}
      >
        {visibleTitle}
      </h2> : null}
      {visibleDescription ? <p
        className={`text-[0.95rem] leading-[1.8] text-slate-500 ${
          align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"
        }`}
      >
        {visibleDescription}
      </p> : null}
    </div>
  );
}
