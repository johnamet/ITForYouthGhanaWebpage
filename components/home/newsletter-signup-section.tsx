import { NewsletterSignupForm } from "@/components/shared/newsletter-signup-form";

export type NewsletterSignupContent = {
  eyebrow: string;
  heading: string;
  description: string;
  privacyNote: string;
  interest?: string;
  active?: boolean;
};

type NewsletterSignupSectionProps = {
  content: NewsletterSignupContent;
};

export function NewsletterSignupSection({ content }: NewsletterSignupSectionProps) {
  if (content.active === false) {
    return null;
  }

  return (
    <section className="bg-brand-navy px-6 py-20 text-white lg:px-10">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
          {content.eyebrow}
        </p>
        <h2 className="mt-4 font-heading text-3xl font-bold sm:text-4xl">
          {content.heading}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-[0.98rem] leading-8 text-white/75">
          {content.description}
        </p>

        <div className="mt-10">
          <NewsletterSignupForm
            interest={content.interest}
            buttonLabel="Join the mailing list"
            placeholder="Enter your email address"
          />
        </div>

        <p className="mt-4 text-sm text-white/55">{content.privacyNote}</p>
      </div>
    </section>
  );
}
