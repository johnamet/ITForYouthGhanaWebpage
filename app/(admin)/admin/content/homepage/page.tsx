import { LayoutList } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TickerForm } from "@/components/admin/ticker-form";
import { NewsletterForm } from "@/components/admin/newsletter-form";
import { ProgrammeShowcaseForm } from "@/components/admin/programme-showcase-form";
import { JoinCtaCardsForm } from "@/components/admin/join-cta-cards-form";
import {
  getCmsHomepageTicker,
  getCmsProgrammeShowcase,
  getCmsJoinCtaCards,
  getCmsNewsletterSignup,
} from "@/lib/cms/homepage";

export default async function AdminHomepageCombinedPage() {
  const [ticker, showcase, cards, newsletter] = await Promise.all([
    getCmsHomepageTicker(),
    getCmsProgrammeShowcase(),
    getCmsJoinCtaCards(),
    getCmsNewsletterSignup(),
  ]);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Homepage CMS"
        title="Homepage sections"
        description="Edit ticker, programme showcase and join cards as JSON, and newsletter as a structured form."
        icon={<LayoutList className="h-5 w-5" />}
      />
      {/* Ticker JSON editor */}
      <div className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
        <h3 className="font-heading text-xl font-semibold text-brand-ink">Marquee ticker</h3>
        <p className="mt-2 text-sm leading-7 text-slate-600">Controls mode, speed, and the list of items for the ticker below the hero.</p>
        <div className="mt-6">
          <TickerForm initial={ticker} />
        </div>
      </div>

      {/* Programme showcase repeater */}
      <div className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
        <h3 className="font-heading text-xl font-semibold text-brand-ink">Programme showcase</h3>
        <p className="mt-2 text-sm leading-7 text-slate-600">Manage cards displayed in the homepage programme showcase.</p>
        <div className="mt-6">
          <ProgrammeShowcaseForm initial={showcase} />
        </div>
      </div>

      {/* Join CTA cards repeater */}
      <div className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
        <h3 className="font-heading text-xl font-semibold text-brand-ink">Join CTA cards</h3>
        <p className="mt-2 text-sm leading-7 text-slate-600">Manage the join-CTA cards shown at the end of the homepage.</p>
        <div className="mt-6">
          <JoinCtaCardsForm initial={cards} />
        </div>
      </div>

      <div className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
        <h3 className="font-heading text-xl font-semibold text-brand-ink">Newsletter signup</h3>
        <p className="mt-2 text-sm leading-7 text-slate-600">Edit the newsletter signup section copy and toggles.</p>
        <div className="mt-6">
          <NewsletterForm initial={newsletter} />
        </div>
      </div>
    </div>
  );
}
