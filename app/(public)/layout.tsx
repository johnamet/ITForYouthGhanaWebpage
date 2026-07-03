import type { Metadata } from "next";

import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { FloatingElements } from "@/components/layout/floating-elements";
import { SiteHeader }      from "@/components/layout/site-header";
import { SiteFooter }      from "@/components/layout/site-footer";
import { siteMeta } from "@/lib/content/site-config";
import { getCmsAnnouncement, getCmsFloatingElements } from "@/lib/cms/homepage";
import { getCmsSettings } from "@/lib/cms/settings";

export const metadata: Metadata = {
  title: {
    default: siteMeta.defaultTitle,
    template: siteMeta.titleTemplate,
  },
  description: siteMeta.description,
  openGraph: siteMeta.openGraph,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [announcement, floating, settings] = await Promise.all([
    getCmsAnnouncement(),
    getCmsFloatingElements(),
    getCmsSettings(),
  ]);

  return (
    <>
      {/*
       * Stack order:
       *   AnnouncementBar - z-50, not sticky, scrolls away naturally
       *   SiteHeader      - z-40, sticky top-0
       *   main            - page content
       *   SiteFooter      - full-width dark footer
      */}
      <AnnouncementBar announcement={announcement} />
      <SiteHeader logoUrl={settings.logoUrl} />
      <main className="antialiased">{children}</main>
      <FloatingElements content={floating} />
      <SiteFooter settings={settings} />
    </>
  );
}
