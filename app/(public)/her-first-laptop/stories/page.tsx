import type { Metadata } from "next";

import { AwaitingRecords } from "@/components/laptop-bank/awaiting-records";
import { StoryGrid } from "@/components/laptop-bank/story-card";
import { EditorialImageHero } from "@/components/shared/editorial-image-hero";
import { getPublishableStories } from "@/lib/cms/laptop-bank";

const PHASE_2_NOINDEX = { index: false, follow: false } as const;

export async function generateMetadata(): Promise<Metadata> {
  const stories = await getPublishableStories();

  return {
    title: "Recipient stories | Her First Laptop",
    description:
      "Young women who received a renewed laptop through Her First Laptop, in their own words.",
    robots: stories.length ? undefined : PHASE_2_NOINDEX,
  };
}

/**
 * Page 5.14 — /her-first-laptop/stories (Phase 2).
 *
 * Spec 5.14: the query filters on publication_consent = true, and
 * preferred_name, institution and photo never render together without a
 * consent_record_ref. Both rules live in getPublishableStories(), so this page
 * renders whatever it is handed and checks nothing itself.
 *
 * The empty state ships rather than a filled one. Draft 1 §8 §7: "Ship the
 * section hidden if you do not yet have consented stories, rather than filling
 * it with composites. A composite story presented as real is a reputational
 * risk that far outweighs an empty section."
 */
export default async function HerFirstLaptopStoriesRoute() {
  const stories = await getPublishableStories();

  return (
    <div className="bg-white">
      <EditorialImageHero
        imageAlt="Her First Laptop recipient stories"
        eyebrow="Her First Laptop"
        title="Stories"
        description="Recipients who agreed, in writing, to have their story published."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Her First Laptop", href: "/her-first-laptop" },
          { label: "Stories" },
        ]}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {stories.length ? (
          <StoryGrid stories={stories} />
        ) : (
          <AwaitingRecords
            title="No stories published yet"
            body="We publish a recipient's story only where she has given written consent, recorded against her name. Nothing here is composed, composited or written on anyone's behalf, so this page stays empty until the first recipient has both received her laptop and agreed to have her story told."
          />
        )}
      </section>
    </div>
  );
}
