import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/laptop-bank/og-card";

export const alt = "Her First Laptop — give a laptop to a young woman in Ghana";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/**
 * Draft 1 §14.4 singles this one out: it "is the one that will circulate on
 * WhatsApp, which will be your largest referral channel". The subtitle is the
 * page's own hero subheading, so the share card and the page cannot say
 * different things.
 */
export default function Image() {
  return renderOgCard({
    eyebrow: "Her First Laptop",
    title: "Her first laptop",
    subtitle: "A refurbished machine of her own, and the training to use it.",
  });
}
