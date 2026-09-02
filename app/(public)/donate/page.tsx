import type { Metadata } from "next";
import Link from "next/link";

import { DonationCampaign } from "@/components/home/donation-campaign";
import { TokenText } from "@/components/laptop-bank/token";
import { Button } from "@/components/ui/button";
import { activeDonationCampaign } from "@/lib/content/site-config";
import { herFirstLaptopContent } from "@/lib/content/her-first-laptop-config";

export const metadata: Metadata = {
  title: "Donate | IT For Youth Ghana",
  description:
    "Give to IT For Youth Ghana's general work, or fund a renewed laptop for a young woman in training through Her First Laptop.",
};

const HER_FIRST_LAPTOP = "her-first-laptop";

/**
 * Draft 1 §11 asks the donate landing page to "split the choice: general
 * giving, or Her First Laptop", and Draft 1 §3.3 says the Donate button's
 * landing page "should offer a choice between general giving and Her First
 * Laptop". This page is also where C15 hands off, so it has to be able to
 * receive that hand-off — before this, /donate ignored the query string
 * entirely and a donor's chosen amount was silently discarded.
 */
type DonatePageProps = {
  searchParams?: { campaign?: string; amount?: string };
};

/**
 * The amount arrives in a query string, so it is caller-controlled. Accept only
 * a plain figure and cap its length: React escapes markup, but echoing
 * arbitrary text back to a donor as "your chosen amount" is its own problem.
 */
function readAmount(raw?: string): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (!/^\d{1,9}(\.\d{1,2})?$/.test(trimmed)) return undefined;
  return trimmed;
}

export default function DonatePage({ searchParams }: DonatePageProps) {
  const isHerFirstLaptop = searchParams?.campaign === HER_FIRST_LAPTOP;
  const amount = readAmount(searchParams?.amount);

  return (
    <div className="bg-white">
      {/* ── The split ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
          Give
        </p>
        <h1 className="mt-3 font-heading text-4xl font-bold text-brand-ink sm:text-5xl">
          Two ways to give
        </h1>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <Link
            href="/donate"
            aria-current={isHerFirstLaptop ? undefined : "page"}
            className={`rounded-[28px] border p-6 shadow-sm transition ${
              isHerFirstLaptop
                ? "border-brand-border bg-white hover:border-brand-gold/60"
                : "border-brand-gold bg-brand-warm"
            }`}
          >
            <p className="font-heading text-2xl font-bold text-brand-ink">
              The general fund
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Training, mentorship and progression across every pathway. Use this if you would
              rather we put your gift where it is needed most.
            </p>
          </Link>

          <Link
            href={`/donate?campaign=${HER_FIRST_LAPTOP}`}
            aria-current={isHerFirstLaptop ? "page" : undefined}
            className={`rounded-[28px] border p-6 shadow-sm transition ${
              isHerFirstLaptop
                ? "border-brand-gold bg-brand-warm"
                : "border-brand-border bg-white hover:border-brand-gold/60"
            }`}
          >
            <p className="font-heading text-2xl font-bold text-brand-ink">Her First Laptop</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {herFirstLaptopContent.hero.subheading} Your gift covers sanitisation, parts,
              licensing, logistics and a year of support.
            </p>
          </Link>
        </div>
      </section>

      {isHerFirstLaptop ? (
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold text-brand-ink">
            {amount ? `Giving GHS ${amount} to Her First Laptop` : "Giving to Her First Laptop"}
          </h2>

          {/*
           * No payment provider is configured in this repository. Draft 1 §15
           * lists "Payment provider configured for cedis, and for GBP or USD if
           * possible" as BLOCKING the giving flow, and Draft 1 §16 forbids
           * implying the UK entity can receive donations before its
           * registration and banking are in place. So this page carries the
           * donor's intent to a person instead of pretending to take a card.
           * When a provider is configured, this block is where the checkout
           * goes — and the amount is already parsed and to hand.
           */}
          <p className="mt-5 text-base leading-8 text-slate-700">
            Online card payment is not live yet. Email us and we will send you the ways to give
            that are available today, including bank transfer and mobile money
            {amount ? `, and confirm what GHS ${amount} covers` : ""}.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              href={`mailto:info@itforyouthghana.org?subject=${encodeURIComponent(
                amount
                  ? `Her First Laptop — giving GHS ${amount}`
                  : "Her First Laptop — I would like to give",
              )}`}
              variant="solid-pink"
              size="lg"
            >
              Email us to give
            </Button>
            <Button href="/her-first-laptop" variant="blue-outline" size="lg">
              Read about Her First Laptop
            </Button>
          </div>

          <p className="mt-10 border-l-2 border-brand-gold pl-5 text-sm leading-7 text-slate-600">
            <TokenText>{herFirstLaptopContent.loanToOwn.body}</TokenText>
          </p>

          <p className="mt-8 text-sm leading-7 text-slate-500">
            Are you a student looking for a laptop?{" "}
            <Link
              href="/her-first-laptop/apply"
              className="font-semibold text-brand-primary hover:text-brand-ink"
            >
              Apply here
            </Link>
            . Applying is free and no member of our staff will ever ask you for money.
          </p>
        </section>
      ) : (
        <DonationCampaign campaign={activeDonationCampaign} />
      )}
    </div>
  );
}
