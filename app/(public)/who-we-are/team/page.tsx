import { ContentPage } from "@/components/shared/content-page";
import { buildHubPage } from "@/lib/content/page-builders";

const page = buildHubPage(
  "team",
  "Our Team",
  "Department-grouped profiles, featured leaders, and future modal bios all start from this route.",
  [
    {
      title: "Leadership-ready",
      description: "Scaffolded to support grouped team cards and longer biographies later.",
      href: "/admin/team",
      eyebrow: "Admin link",
    },
  ],
);

export default function TeamPage() {
  return <ContentPage page={page} />;
}
