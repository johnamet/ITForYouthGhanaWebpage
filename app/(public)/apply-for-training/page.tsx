import { ContentPage } from "@/components/shared/content-page";
import { buildHubPage } from "@/lib/content/page-builders";

const page = buildHubPage(
  "apply-for-training",
  "Apply for Training",
  "The learner journey now has a cleaner structure, with public guidance and retained portal compatibility.",
  [
    {
      eyebrow: "Learner path",
      title: "Who Can Apply",
      description: "Eligibility guidance and audience fit.",
      href: "/apply-for-training/who-can-apply",
    },
    {
      eyebrow: "Learner path",
      title: "Browse Courses",
      description: "New route backed by the migrated course integration layer.",
      href: "/apply-for-training/courses",
    },
    {
      eyebrow: "Learner path",
      title: "How It Works",
      description: "An application-to-onboarding story tailored to the new IA.",
      href: "/apply-for-training/how-it-works",
    },
  ],
);

export default function ApplyForTrainingPage() {
  return <ContentPage page={page} />;
}
