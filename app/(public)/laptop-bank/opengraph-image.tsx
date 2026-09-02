import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/laptop-bank/og-card";

export const alt = "IT for Youth Laptop Bank — donate retired corporate laptops in Ghana";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Draft 1 §14.4. Next attaches this to the route's metadata automatically. */
export default function Image() {
  return renderOgCard({
    eyebrow: "IT for Youth Ghana",
    title: "IT for Youth Laptop Bank",
    subtitle:
      "Certified data destruction, documented transfer, and licensed recycling for your fleet refresh.",
  });
}
