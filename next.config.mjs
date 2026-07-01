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
