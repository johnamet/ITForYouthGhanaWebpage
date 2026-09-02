"use client";

import { useState } from "react";

import { TokenText, useTokenValues } from "@/components/laptop-bank/token";
import { Button } from "@/components/ui/button";
import { FormField, TextInput } from "@/components/ui/form-field";
import { isTokenResolved, token, type TokenName } from "@/lib/content/laptop-bank-tokens";
import { cn } from "@/lib/utils/cn";

type GivingMechanicProps = {
  /** Distinct per instance — page 5.6 renders this twice (blocks 3 and 8). */
  id: string;
  heading?: string;
  description?: string;
  className?: string;
};

type Tier = {
  amountToken: TokenName;
  /** The same amount in sterling, supplied separately — never derived. */
  sterlingToken: TokenName;
  outcomeToken: TokenName;
};

/** Spec C15: three fixed amounts plus an open amount. */
const TIERS: Tier[] = [
  { amountToken: "GIVE_1", sterlingToken: "GIVE_1_GBP", outcomeToken: "GIVE_1_OUTCOME" },
  { amountToken: "GIVE_2", sterlingToken: "GIVE_2_GBP", outcomeToken: "GIVE_2_OUTCOME" },
  { amountToken: "GIVE_3", sterlingToken: "GIVE_3_GBP", outcomeToken: "GIVE_3_OUTCOME" },
];

/**
 * The second currency shown beside cedis.
 *
 * Spec 5.6 BEHAVIOUR: "C15 shows GHS and one of GBP or USD side by side.
 * Currency toggle optional; dual display is not." GBP is chosen because Draft
 * 1 names a UK entity and diaspora donors as a significant part of this
 * audience.
 */
const SECOND_CURRENCY = "GBP";

/**
 * C15 — giving mechanic.
 *
 * Spec §3: "3 fixed amounts plus open amount. Each amount shows an outcome
 * line. Dual currency display: GHS and GBP/USD."
 *
 * A NOTE ON THE DUAL CURRENCY, because there is a real gap in the spec here.
 * Spec §3 requires two currencies side by side, but spec §11 supplies ONE
 * token per tier ({{GIVE_1}}) and no conversion rate. So the registry declares
 * a separate {{GIVE_n_GBP}} token per tier and this component renders it as-is.
 * It must NEVER derive sterling from cedis: Draft 1 §16 forbids publishing a
 * cost figure that was not properly calculated, a rate hardcoded here would be
 * wrong within weeks, and it would amount to publishing an exchange rate the
 * organisation never agreed to. An earlier version of this component rendered
 * the cedi token in both slots, which would have published a 1:1 rate the
 * moment the amounts arrived — do not reintroduce that.
 *
 * Selection is disabled while a tier's amount is still a token — a donor
 * cannot be allowed to select an amount that does not exist. The open-amount
 * field stays usable throughout, which is also Draft 1 §8's advice: a card-only
 * design caps donors who would give more than the top tier.
 */
export function GivingMechanic({ id, heading, description, className }: GivingMechanicProps) {
  const tokenValues = useTokenValues();
  const [selected, setSelected] = useState<TokenName | "open">("open");
  const [openAmount, setOpenAmount] = useState("");

  // The href must carry the real figure, never the placeholder — /donate
  // validates the amount and would reject "{{GIVE_1}}".
  const selectedAmount =
    selected === "open" ? openAmount.trim() : (tokenValues[selected] ?? "").trim();
  // The payment provider is not configured in this repo (Draft 1 §15 lists it
  // as blocking the giving flow), so the CTA hands the amount to the existing
  // /donate route rather than pretending to take a payment here.
  const donateHref = selectedAmount
    ? `/donate?campaign=her-first-laptop&amount=${encodeURIComponent(selectedAmount)}`
    : "/donate?campaign=her-first-laptop";

  return (
    <section id={id} className={cn("scroll-mt-36", className)}>
      {heading ? (
        <h2 className="font-heading text-3xl font-bold text-brand-ink sm:text-4xl">{heading}</h2>
      ) : null}
      {description ? (
        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">{description}</p>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {TIERS.map((tier) => {
          // Selectable only once BOTH figures exist. The spec makes the dual
          // display mandatory, so an amount that can be chosen must never be
          // showing a red token in one of its two currency slots.
          const resolved =
            isTokenResolved(tokenValues, tier.amountToken) &&
            isTokenResolved(tokenValues, tier.sterlingToken);
          const isSelected = selected === tier.amountToken;

          return (
            <button
              key={tier.amountToken}
              type="button"
              disabled={!resolved}
              aria-pressed={isSelected}
              onClick={() => setSelected(tier.amountToken)}
              className={cn(
                "rounded-[24px] border p-5 text-left transition",
                isSelected
                  ? "border-brand-gold bg-brand-warm shadow-sm"
                  : "border-brand-border bg-white hover:border-brand-gold/60",
                !resolved && "cursor-not-allowed opacity-70",
              )}
            >
              {/* Dual currency, side by side. Both slots always render. */}
              <div className="flex items-baseline gap-3">
                <span className="font-heading text-2xl font-bold text-brand-ink">
                  <span className="text-sm font-bold text-slate-500">GHS </span>
                  <TokenText>{token(tier.amountToken)}</TokenText>
                </span>
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                {SECOND_CURRENCY} <TokenText>{token(tier.sterlingToken)}</TokenText>
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                <TokenText>{token(tier.outcomeToken)}</TokenText>
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-6 max-w-sm">
        <FormField label="Or give another amount" htmlFor={`${id}-open-amount`}>
          <TextInput
            id={`${id}-open-amount`}
            name="openAmount"
            type="text"
            inputMode="decimal"
            placeholder="Amount in GHS"
            value={openAmount}
            onFocus={() => setSelected("open")}
            onChange={(event) => {
              setOpenAmount(event.target.value);
              setSelected("open");
            }}
          />
        </FormField>
      </div>

      <div className="mt-6">
        <Button href={donateHref} variant="solid-pink" size="lg">
          Give a laptop
        </Button>
      </div>
    </section>
  );
}
