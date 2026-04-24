import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";

import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { FloatingElements } from "@/components/layout/floating-elements";
import { SiteHeader }      from "@/components/layout/site-header";
import { SiteFooter }      from "@/components/layout/site-footer";
import { activeAnnouncement, floatingElementsContent } from "@/lib/content/site-config";

import "@/app/globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

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
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="antialiased">
        {/*
         * Stack order:
         *   AnnouncementBar — z-50, not sticky, scrolls away naturally
         *   SiteHeader      — z-40, sticky top-0
         *   main            — page content
         *   SiteFooter      — full-width dark footer
         */}
        <AnnouncementBar announcement={activeAnnouncement} />
        <SiteHeader />
        <main>{children}</main>
        <FloatingElements content={floatingElementsContent} />
        <SiteFooter />
      </body>
    </html>
  );
}
