import {
  getCmsHeroSlides,
  getCmsHomepageTicker,
  getCmsProgrammeShowcase,
  getCmsOverviewSection,
  getCmsChallengeSection,
  getCmsMissionSection,
  getCmsDonationCampaign,
  getCmsFeaturedStory,
  getCmsJoinCtaCards,
  getCmsNewsletterSignup,
} from "@/lib/cms/homepage";
import { getCmsFeaturedArticles } from "@/lib/cms/articles";
import { getCmsPartners } from "@/lib/cms/partners";
import { getCmsTestimonials } from "@/lib/cms/testimonials";
import { getCmsImpactStats } from "@/lib/cms/impact-stats";

import { HeroSlideshow } from "@/components/home/hero-slideshow";
import { MarqueeTicker } from "@/components/home/marquee-ticker";
import { ImpactCounter } from "@/components/home/impact-counter";
import { LegacyHomepageSections } from "@/components/home/legacy-homepage-sections";
import { ProgrammeShowcase } from "@/components/home/programme-showcase";
import { DonationCampaign } from "@/components/home/donation-campaign";
import { FeaturedStoryVideo } from "@/components/home/featured-story-video";
import { LatestNewsGrid } from "@/components/home/latest-news-grid";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { PartnersStrip } from "@/components/home/patrners-strip";
import { JoinCtaBlock } from "@/components/home/join-cta-block";
import { NewsletterSignupSection } from "@/components/home/newsletter-signup-section";

export async function HomepageSections() {
  const [
    articles,
    testimonials,
    partners,
    impactStats,
    slides,
    ticker,
    showcase,
    campaign,
    story,
    joinCards,
    newsletter,
    challenge,
    mission,
    overview,
  ] = await Promise.all([
    getCmsFeaturedArticles(3),
    getCmsTestimonials(),
    getCmsPartners(),
    getCmsImpactStats(),
    getCmsHeroSlides(),
    getCmsHomepageTicker(),
    getCmsProgrammeShowcase(),
    getCmsDonationCampaign(),
    getCmsFeaturedStory(),
    getCmsJoinCtaCards(),
    getCmsNewsletterSignup(),
    getCmsChallengeSection(),
    getCmsMissionSection(),
    getCmsOverviewSection(),
  ]);

  return (
    <div className="bg-white">
      {/* 1 ── Hero slideshow */}
      <HeroSlideshow slides={slides} interval={6000} />

      {/* 2 ── Marquee ticker */}
      <MarqueeTicker ticker={ticker} />

      {/* 3 ── Legacy overview, challenge, and vision sections */}
      <LegacyHomepageSections overview={overview} challenge={challenge} mission={mission} />

      {/* 4 ── Impact counter */}
      <ImpactCounter stats={impactStats} />

      {/* 5 ── Programme showcase */}
      <ProgrammeShowcase items={showcase} />

      {/* 6 ── Donation campaign */}
      <DonationCampaign campaign={campaign} />

      {/* 7 ── Featured story / video */}
      <FeaturedStoryVideo story={story} />

      {/* 8 ── Latest news & blog */}
      <LatestNewsGrid articles={articles} />

      {/* 9 ── Student testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* 10 ── Partner strip */}
      <PartnersStrip partners={partners} />

      {/* 11 ── Apply / join CTA block */}
      <JoinCtaBlock cards={joinCards} />

      {/* 12 ── Newsletter signup */}
      <NewsletterSignupSection content={newsletter} />
    </div>
  );
}
