import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";

import "./globals.css";

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
  metadataBase: new URL("https://itforyouthghana.org"),
  title: {
    default: "IT For Youth Ghana",
    template: "%s | IT For Youth Ghana",
  },
  description:
    "Next.js rebuild foundation for IT For Youth Ghana, with a new public information architecture and CMS-ready scaffolding.",
  applicationName: "IT For Youth Ghana",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.svg",
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
