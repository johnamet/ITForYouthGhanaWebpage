/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["firebase-admin"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.itforyouthghana.org"
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "tse2.mm.bing.net",
      },
      {
        protocol: "https",
        hostname: "imarticus.org",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
      },
      {
        protocol: "https",
        hostname: "photos.fife.usercontent.google.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/what-we-offer/students-graduates",
        destination: "/apply-for-training",
        permanent: true,
      },
      {
        source: "/what-we-offer/businesses",
        destination: "/for-organisations",
        permanent: true,
      },
      {
        source: "/what-we-offer/volunteers",
        destination: "/who-we-are/careers",
        permanent: true,
      },
      {
        source: "/opportunities/students-graduates",
        destination: "/apply-for-training",
        permanent: true,
      },
      {
        source: "/opportunities/businesses",
        destination: "/for-organisations",
        permanent: true,
      },
      {
        source: "/opportunities/volunteers",
        destination: "/who-we-are/careers",
        permanent: true,
      },
      {
        source: "/who-can-apply",
        destination: "/apply-for-training/who-can-apply",
        permanent: true,
      },
      {
        source: "/how-it-works/students-graduates",
        destination: "/apply-for-training/how-it-works",
        permanent: true,
      },
      {
        source: "/how-it-works/businesses",
        destination: "/for-organisations",
        permanent: true,
      },
      {
        source: "/how-it-works/volunteers",
        destination: "/who-we-are/careers",
        permanent: true,
      },
      {
        source: "/impact",
        destination: "/our-impact/reports",
        permanent: true,
      },
      {
        source: "/testimonials",
        destination: "/our-impact/testimonials",
        permanent: true,
      },
      {
        source: "/news",
        destination: "/news-and-updates/news",
        permanent: true,
      },
      {
        source: "/community",
        destination: "/what-we-do/community-outreach",
        permanent: true,
      },
      {
        source: "/partners",
        destination: "/who-we-are/partners",
        permanent: true,
      },
      {
        source: "/partnerships",
        destination: "/partner-with-us",
        permanent: true,
      },
      {
        source: "/partnerships/educational-partnerships",
        destination: "/partner-with-us/educational",
        permanent: true,
      },
      {
        source: "/partnerships/corporate-sponsorship",
        destination: "/for-organisations/sponsorships",
        permanent: true,
      },
      {
        source: "/partnerships/corporate-training",
        destination: "/for-organisations/corporate-training",
        permanent: true,
      },
      {
        source: "/partnerships/government-collaboration",
        destination: "/partner-with-us/government",
        permanent: true,
      },
      {
        source: "/partnerships/ngo-and-foundation-partnerships",
        destination: "/partner-with-us/ngo-foundations",
        permanent: true,
      },
      {
        source: "/partnerships/international-development",
        destination: "/partner-with-us/international-development",
        permanent: true,
      },
      {
        source: "/partnerships/technology-partners",
        destination: "/partner-with-us/technology",
        permanent: true,
      },
      {
        source: "/careers",
        destination: "/who-we-are/careers",
        permanent: true,
      },
      {
        source: "/tech-empowerment",
        destination: "/what-we-do/youth-academy",
        permanent: true,
      },
      // IT for Youth Laptop Bank, build spec §2.2. Early links went out with
      // the /what-we-do/ path before the Laptop Bank was made top level.
      {
        source: "/what-we-do/laptop-bank",
        destination: "/laptop-bank",
        permanent: true,
      },
      { source: "/admin/content/contact", destination: "/admin/cms/page-contact", permanent: false },
      // Team, jobs, partners and testimonials moved onto the descriptor-driven
      // editor. Their bespoke forms are gone, so these keep a bookmarked admin
      // URL working. Temporary, like the Laptop Bank ones below: internal
      // admin URLs, not the public URL map.
      { source: "/admin/team", destination: "/admin/cms/team", permanent: false },
      { source: "/admin/team/:path*", destination: "/admin/cms/team", permanent: false },
      { source: "/admin/jobs", destination: "/admin/cms/job", permanent: false },
      { source: "/admin/jobs/:path*", destination: "/admin/cms/job", permanent: false },
      { source: "/admin/partners", destination: "/admin/cms/partner", permanent: false },
      { source: "/admin/partners/:path*", destination: "/admin/cms/partner", permanent: false },
      { source: "/admin/testimonials", destination: "/admin/cms/testimonial", permanent: false },
      { source: "/admin/testimonials/:path*", destination: "/admin/cms/testimonial", permanent: false },
      // The Laptop Bank's record editors were generalised to /admin/cms/[type]
      // when the descriptor pattern was rolled out. These keep a bookmarked
      // admin URL working. Temporary rather than permanent on purpose: these
      // are internal admin URLs, not the public URL map, so a 308 cached in
      // someone's browser would be harder to undo than it is worth.
      {
        source: "/admin/laptop-bank/records/:type",
        destination: "/admin/cms/:type",
        permanent: false,
      },
      {
        source: "/admin/laptop-bank/records/:type/:id",
        destination: "/admin/cms/:type/:id",
        permanent: false,
      },
      // NOTE: /laptop-bank/uk is RESERVED and must not be published (spec
      // §2.2). It deliberately has no route file and no redirect, so it 404s.
      // Do not repurpose the path — it is held for a UK entity whose
      // registration and banking are not yet in place, and Draft 1 §16
      // forbids implying that entity can receive donations before they are.
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
