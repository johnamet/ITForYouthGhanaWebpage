import { ContentPage } from "@/components/shared/content-page";
import { buildHubPage } from "@/lib/content/page-builders";

const page = buildHubPage(
  "who-can-apply",
  "Who Can Apply",
  "Eligibility guidance now sits inside the new learner pathway instead of living as a disconnected legacy route.",
  [
    {
      eyebrow: "Next step",
      title: "Browse Courses",
      description: "See the portal-backed catalog inside the new route structure.",
      href: "/apply-for-training/courses",
    },
  ],
);

export default function WhoCanApplyPage() {
  return <ContentPage page={page} />;
}
