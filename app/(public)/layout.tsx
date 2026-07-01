import type { Metadata } from "next";

import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { FloatingElements } from "@/components/layout/floating-elements";
import { SiteHeader }      from "@/components/layout/site-header";
import { SiteFooter }      from "@/components/layout/site-footer";
import { activeAnnouncement, floatingElementsContent } from "@/lib/content/site-config";

export const metadata: Metadata = {
  title: {
    default: "IT For Youth Ghana",
    template: "%s | IT For Youth Ghana",
  },
  description:
    "Empowering Ghanaian youth with digital skills and the confidence to shape tomorrow's economy.",
  openGraph: {
    siteName: "IT For Youth Ghana",
    locale: "en_GH",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/*
       * Stack order:
       *   AnnouncementBar - z-50, not sticky, scrolls away naturally
       *   SiteHeader      - z-40, sticky top-0
       *   main            - page content
       *   SiteFooter      - full-width dark footer
       */}
      <AnnouncementBar announcement={activeAnnouncement} />
      <SiteHeader />
      <main className="antialiased">{children}</main>
      <FloatingElements content={floatingElementsContent} />
      <SiteFooter />
    </>
  );
}
