import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
