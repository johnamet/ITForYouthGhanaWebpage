import {
  heroSlides,
  heroStats,
  homepageTicker,
  featuredPrograms,
  testimonials,
  partners,
  upcomingEvents,
  publicHubs,
} from "@/lib/content/site-config";

import { HeroSlideshow } from "@/components/home/hero-slideshow";
import { MarqueeTicker } from "@/components/home/marquee-ticker";
import { ImpactCounter } from "@/components/home/impact-counter";
import { FeaturedPrograms } from "@/components/home/featured-programs";
import { CtaStrip } from "@/components/home/cta-strip";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { PartnersStrip } from "@/components/home/patrners-strip";
import { UpcomingEvents } from "@/components/home/upcoming-events";
import { SectionHeading } from "@/components/shared/section-heading";
import { RouteCardGrid } from "@/components/shared/route-card-grid";

export function HomepageSections() {
  return (
    <div className="bg-white">
      {/* 1 ── Hero slideshow */}
      <HeroSlideshow slides={heroSlides} interval={6000} />

      {/* 2 ── Marquee ticker */}
      <MarqueeTicker ticker={homepageTicker} />

      {/* 3 ── Impact counter */}
      <ImpactCounter stats={heroStats} />

      {/* 4 ── Featured programs — editorial layout */}
      <FeaturedPrograms programs={featuredPrograms} />

      {/* 5 ── Gold CTA strip */}
      <CtaStrip
        heading="Ready to change a young person's future?"
        subtext="Partner with us, sponsor a scholarship, or refer someone to our next cohort."
        cta={{ label: "Partner with us today", href: "/partner-with-us" }}
      />

      {/* 6 ── Student testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* 7 ── Partner strip */}
      <PartnersStrip partners={partners} />

      {/* 8 ── Upcoming events */}
      <UpcomingEvents events={upcomingEvents} />

      {/* 9 ── Navigation hubs */}
      <section className="px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-6xl space-y-10">
          <SectionHeading
            eyebrow="Navigate the platform"
            title="Everything you need, right where you'd expect it"
            description="Our information architecture is designed for students, donors, and partners alike."
          />
          <RouteCardGrid cards={publicHubs} />
        </div>
      </section>
    </div>
  );
}
