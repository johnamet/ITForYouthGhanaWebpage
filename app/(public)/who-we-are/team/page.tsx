import { ContentPage } from "@/components/shared/content-page";
import { TeamDirectory } from "@/components/shared/team-directory";
import { getCmsTeamMembers } from "@/lib/cms/team";
import { getCmsSitePage } from "@/lib/cms/site-pages";
import { teamHub } from "@/lib/content/site-config";

export default async function TeamPage() {
  const [page, members] = await Promise.all([
    getCmsSitePage("team"),
    getCmsTeamMembers(false),
  ]);

  return (
    <>
      <ContentPage page={page ?? teamHub} />
      <TeamDirectory members={members} />
    </>
  );
}
