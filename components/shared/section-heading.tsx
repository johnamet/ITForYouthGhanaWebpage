type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "";

  return (
    <div className={`space-y-3 ${alignClass}`}>
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
        {eyebrow}
      </p>
      <h2
        className={`font-heading text-3xl font-bold leading-snug text-brand-ink sm:text-4xl ${
          align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"
        }`}
      >
        {title}
      </h2>
      <p
        className={`text-[0.95rem] leading-[1.8] text-slate-500 ${
          align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"
        }`}
      >
        {description}
      </p>
    </div>
  );
}
