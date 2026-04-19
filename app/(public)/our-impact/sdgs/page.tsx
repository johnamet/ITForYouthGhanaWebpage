import { ContentPage } from "@/components/shared/content-page";
import { buildHubPage } from "@/lib/content/page-builders";

const page = buildHubPage(
  "sdgs",
  "UN SDGs",
  "This route is ready for impact-to-SDG mapping and donor-facing credibility storytelling.",
  [
    {
      title: "International Development",
      description: "Tie SDG alignment directly into the dedicated partner track.",
      href: "/partner-with-us/international-development",
      eyebrow: "Partner path",
    },
  ],
);

export default function SdgsPage() {
  return <ContentPage page={page} />;
}
