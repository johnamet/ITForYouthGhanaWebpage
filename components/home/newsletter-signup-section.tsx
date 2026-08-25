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
    <section className="bg-brand-deep px-6 py-20 text-white lg:px-10">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-heading text-5xl font-bold leading-none text-white sm:text-6xl lg:text-7xl">
          {content.eyebrow}
        </h2>
        <p className="mt-5 font-heading text-2xl font-bold leading-tight text-white sm:text-3xl">
          {content.heading}
        </p>
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
