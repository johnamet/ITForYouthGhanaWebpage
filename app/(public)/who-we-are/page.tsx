import { ContentPage } from "@/components/shared/content-page";
import { buildHubPage } from "@/lib/content/page-builders";

const page = buildHubPage("who-we-are", "Who We Are", "A clearer home for mission, team, partners, and careers.", [
  {
    eyebrow: "About",
    title: "Our Team",
    description: "Meet the people behind the mission and the future CMS structure for their profiles.",
    href: "/who-we-are/team",
  },
  {
    eyebrow: "About",
    title: "Our Partners",
    description: "A dedicated route for current collaborators and future credibility signals.",
    href: "/who-we-are/partners",
  },
  {
    eyebrow: "About",
    title: "Join Our Team",
    description: "The careers route now has a stable home for roles, volunteer opportunities, and process content.",
    href: "/who-we-are/careers",
  },
]);

export default function WhoWeArePage() {
  return <ContentPage page={page} />;
}
