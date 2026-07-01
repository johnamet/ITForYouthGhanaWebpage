import {
  heroSlides,
  heroStats,
  homepageTicker,
  programmeShowcase,
  activeDonationCampaign,
  featuredStory,
  joinCtaCards,
  newsletterSignupContent,
} from "@/lib/content/site-config";
import { getCmsFeaturedArticles } from "@/lib/cms/articles";
import { getCmsPartners } from "@/lib/cms/partners";
import { getCmsTestimonials } from "@/lib/cms/testimonials";

import { HeroSlideshow } from "@/components/home/hero-slideshow";
import { MarqueeTicker } from "@/components/home/marquee-ticker";
import { ImpactCounter } from "@/components/home/impact-counter";
import { ProgrammeShowcase } from "@/components/home/programme-showcase";
import { DonationCampaign } from "@/components/home/donation-campaign";
import { FeaturedStoryVideo } from "@/components/home/featured-story-video";
import { LatestNewsGrid } from "@/components/home/latest-news-grid";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { PartnersStrip } from "@/components/home/patrners-strip";
import { JoinCtaBlock } from "@/components/home/join-cta-block";
import { NewsletterSignupSection } from "@/components/home/newsletter-signup-section";

export async function HomepageSections() {
  const [articles, testimonials, partners] = await Promise.all([
    getCmsFeaturedArticles(3),
    getCmsTestimonials(),
    getCmsPartners(),
  ]);

  return (
    <div className="bg-white">
      {/* 1 ── Hero slideshow */}
      <HeroSlideshow slides={heroSlides} interval={6000} />

      {/* 2 ── Marquee ticker */}
      <MarqueeTicker ticker={homepageTicker} />

      {/* 3 ── Impact counter */}
      <ImpactCounter stats={heroStats} />

      {/* 4 ── Programme showcase */}
      <ProgrammeShowcase items={programmeShowcase} />

      {/* 5 ── Donation campaign */}
      <DonationCampaign campaign={activeDonationCampaign} />

      {/* 6 ── Featured story / video */}
      <FeaturedStoryVideo story={featuredStory} />

      {/* 7 ── Latest news & blog */}
      <LatestNewsGrid articles={articles} />

      {/* 8 ── Student testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* 9 ── Partner strip */}
      <PartnersStrip partners={partners} />

      {/* 10 ── Apply / join CTA block */}
      <JoinCtaBlock cards={joinCtaCards} />

      {/* 11 ── Newsletter signup */}
      <NewsletterSignupSection content={newsletterSignupContent} />
    </div>
  );
}
