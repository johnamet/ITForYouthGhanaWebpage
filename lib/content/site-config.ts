/**
 * lib/content/site-config.ts
 *
 * Single source of truth for all static site content.
 * Replace your existing site-config.ts with this file entirely.
 */

import type { HeroSlide }       from "@/components/home/hero-slideshow";
import type { MarqueeTickerContent } from "@/components/home/marquee-ticker";
import type { FeaturedProgram } from "@/components/home/featured-programs";
import type { Testimonial }     from "@/components/home/testimonials-section";
import type { Partner }         from "@/components/home/patrners-strip";
import type { EventItem }       from "@/components/home/upcoming-events";
import type { Announcement }    from "@/components/layout/announcement-bar";
import type { AdminNavItem }    from "@/types/admin";
import type { ArticleSeed, SitePage } from "@/types/content";

// ─── Shared types (keep in sync with @/types/content) ────────────────────────

export type HighlightStat = {
  value: string;
  label: string;
  description?: string;
  icon?: string;
};

export type RouteCard = {
  href: string;
  eyebrow?: string;
  title: string;
  description: string;
};

export type NavItem = {
  label: string;
  href: string;
  items?: { label: string; href: string }[];
};

type ScaffoldPageConfig = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  primaryCta: { label: string; href: string };
};

// ─── Announcement bar ─────────────────────────────────────────────────────────

export const activeAnnouncement: Announcement = {
  id: "cohort-7-2026",
  variant: "urgent",
  label: "Now open",
  message:
    "Applications for Cohort 7 are open until May 31, 2026, with limited places for the next intake.",
  cta: { label: "Apply now", href: "/apply-for-training/courses" },
  startDate: "2026-04-18T00:00:00.000Z",
  endDate: "2026-05-31T23:59:59.000Z",
  countdownDate: "2026-05-31T23:59:59.000Z",
  dismissible: true,
};

// ─── Navigation ───────────────────────────────────────────────────────────────

export const publicNavigation: NavItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Who We Are",
    href: "/who-we-are",
    items: [
      { label: "About Us", href: "/who-we-are" },
      { label: "Our Team", href: "/who-we-are/team" },
      { label: "Our Partners", href: "/who-we-are/partners" },
      { label: "Join Our Team", href: "/who-we-are/careers" },
    ],
  },
  {
    label: "What We Do",
    href: "/what-we-do",
    items: [
      { label: "Girls in Tech", href: "/what-we-do/girls-in-tech" },
      { label: "Youth Tech Academy", href: "/what-we-do/youth-academy" },
      { label: "Entrepreneurship Hub", href: "/what-we-do/entrepreneurship-hub" },
      { label: "Code Impact Challenge", href: "/what-we-do/code-impact-challenge" },
      { label: "Rural Tech Connect", href: "/what-we-do/rural-tech-connect" },
      { label: "Community Outreach", href: "/what-we-do/community-outreach" },
      { label: "Advocacy", href: "/what-we-do/advocacy" },
      { label: "Tech Clubs", href: "/what-we-do/tech-clubs" },
    ],
  },
  {
    label: "Apply for Training",
    href: "/apply-for-training",
    items: [
      { label: "Who Can Apply", href: "/apply-for-training/who-can-apply" },
      { label: "Browse Courses", href: "/apply-for-training/courses" },
      { label: "How It Works", href: "/apply-for-training/how-it-works" },
    ],
  },
  {
    label: "For Organisations",
    href: "/for-organisations",
    items: [
      { label: "Corporate Training", href: "/for-organisations/corporate-training" },
      { label: "Sponsorships", href: "/for-organisations/sponsorships" },
      { label: "Hire Our Graduates", href: "/for-organisations/hire-graduates" },
      { label: "Staff Volunteering", href: "/for-organisations/staff-volunteering" },
    ],
  },
  {
    label: "Partner With Us",
    href: "/partner-with-us",
    items: [
      { label: "Educational Institutions", href: "/partner-with-us/educational" },
      { label: "Government", href: "/partner-with-us/government" },
      { label: "NGOs & Foundations", href: "/partner-with-us/ngo-foundations" },
      { label: "International Development", href: "/partner-with-us/international-development" },
      { label: "Technology Companies", href: "/partner-with-us/technology" },
    ],
  },
  {
    label: "Our Impact",
    href: "/our-impact/reports",
    items: [
      { label: "Impact Reports", href: "/our-impact/reports" },
      { label: "Testimonials", href: "/our-impact/testimonials" },
      { label: "UN SDGs", href: "/our-impact/sdgs" },
    ],
  },
  {
    label: "News & Updates",
    href: "/news-and-updates",
    items: [
      { label: "News", href: "/news-and-updates/news" },
      { label: "Blogs", href: "/news-and-updates/blogs" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

// ─── Hero stats ───────────────────────────────────────────────────────────────

export const heroStats: HighlightStat[] = [
  {
    value: "3000+",
    label: "Youth Trained",
    description: "Across digital skills and employability pathways.",
    icon: "👩‍💻",
  },
  {
    value: "8500+",
    label: "Students Reached",
    description: "Through school outreach, clubs, and community activations.",
    icon: "🏫",
  },
  {
    value: "40%",
    label: "Female Participation",
    description: "Driving stronger gender inclusion in technology spaces.",
    icon: "📊",
  },
  {
    value: "85%",
    label: "Employment Rate",
    description: "Graduates in work, further learning, or business-building pathways.",
    icon: "✅",
  },
];

export const homepageTicker: MarqueeTickerContent = {
  mode: "stats",
  speed: "medium",
  pauseOnHover: true,
  items: [
    { label: "3000+ Youth Trained" },
    { label: "8500+ Students Reached" },
    { label: "40% Female Participation" },
    { label: "85% Employment Rate" },
    { label: "Cohort 7 Applications Open Until May 31, 2026" },
  ],
};

function buildScaffoldPage(config: ScaffoldPageConfig): SitePage {
  return {
    slug: config.slug,
    eyebrow: config.eyebrow,
    title: config.title,
    description: config.description,
    intro: config.intro,
    stats: heroStats,
    sections: [
      {
        title: "Foundation now in place",
        body: "This route is live inside the new App Router structure with placeholder content that can be replaced by richer CMS-driven storytelling in the next implementation passes.",
      },
      {
        title: "What comes next",
        body: "The next phase will deepen this page with stronger visuals, richer structured sections, and route-specific content instead of shared scaffold copy.",
      },
    ],
    ctas: [config.primaryCta, { label: "Contact the team", href: "/contact" }],
    related: [],
  };
}

export const initiatives: SitePage[] = [
  buildScaffoldPage({
    slug: "girls-in-tech",
    eyebrow: "Flagship initiative",
    title: "Girls in Tech",
    description: "Confidence-building technical training, mentorship, and access pathways for young women in Ghana.",
    intro: "This route is the foundation for a deeper Girls in Tech story covering enrolment, outcomes, mentors, and graduate voices.",
    primaryCta: { label: "Apply for training", href: "/apply-for-training/courses" },
  }),
  buildScaffoldPage({
    slug: "youth-academy",
    eyebrow: "Training pathway",
    title: "Youth Tech Academy",
    description: "A structured digital skills pathway designed to move young people from curiosity to job-ready confidence.",
    intro: "The academy page will eventually hold clearer programme pathways, course groupings, and graduate proof points.",
    primaryCta: { label: "Browse courses", href: "/apply-for-training/courses" },
  }),
  buildScaffoldPage({
    slug: "entrepreneurship-hub",
    eyebrow: "Venture pathway",
    title: "Entrepreneurship Hub",
    description: "Support for aspiring founders building ideas, practical business skills, and market confidence.",
    intro: "This page will grow into a home for venture support storytelling, alumni journeys, and partner opportunities.",
    primaryCta: { label: "Partner with us", href: "/partner-with-us" },
  }),
  buildScaffoldPage({
    slug: "code-impact-challenge",
    eyebrow: "Challenge format",
    title: "Code Impact Challenge",
    description: "A challenge-led programme connecting technical learning with real-world problem solving.",
    intro: "The challenge route is ready for future cohort showcases, judging criteria, and public-facing outcomes.",
    primaryCta: { label: "See our impact", href: "/our-impact/reports" },
  }),
  buildScaffoldPage({
    slug: "rural-tech-connect",
    eyebrow: "Access initiative",
    title: "Rural Tech Connect",
    description: "Expanding access to digital opportunity beyond city centers through local partnerships and targeted outreach.",
    intro: "This route will later support map-driven storytelling, community case studies, and reach data.",
    primaryCta: { label: "Partner with us", href: "/partner-with-us" },
  }),
  buildScaffoldPage({
    slug: "community-outreach",
    eyebrow: "Community pathway",
    title: "Community Outreach",
    description: "Awareness, activation, and learning experiences that connect more communities to digital opportunity.",
    intro: "This page will become the home for outreach campaigns, school activations, and community event stories.",
    primaryCta: { label: "Read updates", href: "/news-and-updates/news" },
  }),
  buildScaffoldPage({
    slug: "advocacy",
    eyebrow: "Influence work",
    title: "Advocacy",
    description: "Public-facing thought leadership and coalition work that widen opportunity for youth in tech.",
    intro: "The advocacy route will later support policy-aligned storytelling, campaigns, and ecosystem partnerships.",
    primaryCta: { label: "Read blogs", href: "/news-and-updates/blogs" },
  }),
  buildScaffoldPage({
    slug: "tech-clubs",
    eyebrow: "School network",
    title: "Tech Clubs",
    description: "School-based communities that give young people recurring exposure to digital skills and peer learning.",
    intro: "This page is prepared for future school partner stories, club formats, and student pathways.",
    primaryCta: { label: "Who can apply", href: "/apply-for-training/who-can-apply" },
  }),
];

export const organisationPages: SitePage[] = [
  buildScaffoldPage({
    slug: "corporate-training",
    eyebrow: "For organisations",
    title: "Corporate Training",
    description: "Custom digital skills training for teams, institutions, and mission-aligned partners.",
    intro: "This route will later carry service tiers, delivery formats, and case studies.",
    primaryCta: { label: "Contact us", href: "/contact" },
  }),
  buildScaffoldPage({
    slug: "sponsorships",
    eyebrow: "For organisations",
    title: "Sponsorships",
    description: "Support cohorts, scholarships, events, and growth initiatives through focused sponsorship pathways.",
    intro: "This page will become the public-facing home for sponsor value, recognition, and campaign impact.",
    primaryCta: { label: "Donate now", href: "/donate" },
  }),
  buildScaffoldPage({
    slug: "hire-graduates",
    eyebrow: "For organisations",
    title: "Hire Our Graduates",
    description: "A direct route for employers seeking emerging talent from IT For Youth Ghana programmes.",
    intro: "This route will grow into a bridge between employer demand and the graduate talent story.",
    primaryCta: { label: "Start a conversation", href: "/contact" },
  }),
  buildScaffoldPage({
    slug: "staff-volunteering",
    eyebrow: "For organisations",
    title: "Staff Volunteering",
    description: "Structured opportunities for teams to mentor, teach, and contribute skills through ITFY programmes.",
    intro: "This route is ready to expand into volunteering formats, expectations, and team-engagement stories.",
    primaryCta: { label: "Partner with us", href: "/partner-with-us" },
  }),
];

export const partnershipPages: SitePage[] = [
  buildScaffoldPage({
    slug: "educational",
    eyebrow: "Partnership track",
    title: "Educational Institutions",
    description: "Collaborations with schools, universities, and learning communities that expand access and outcomes.",
    intro: "This page is the future home for school partnership models and institutional collaboration stories.",
    primaryCta: { label: "Reach out", href: "/contact" },
  }),
  buildScaffoldPage({
    slug: "government",
    eyebrow: "Partnership track",
    title: "Government",
    description: "Civic collaboration routes for scalable youth and digital empowerment programmes.",
    intro: "This route will support future institutional messaging, programme scale stories, and alignment outcomes.",
    primaryCta: { label: "Partner with us", href: "/contact" },
  }),
  buildScaffoldPage({
    slug: "ngo-foundations",
    eyebrow: "Partnership track",
    title: "NGOs & Foundations",
    description: "Mission-aligned partnerships for programme delivery, funding, and broader reach.",
    intro: "This route is prepared for funder-fit narrative, implementation models, and collaborative outcomes.",
    primaryCta: { label: "Explore impact", href: "/our-impact/reports" },
  }),
  buildScaffoldPage({
    slug: "international-development",
    eyebrow: "Partnership track",
    title: "International Development",
    description: "A dedicated route for agencies and funders seeking credible, locally grounded delivery.",
    intro: "This page is ready for donor-facing storytelling, SDG alignment, and evidence-led positioning.",
    primaryCta: { label: "Explore SDGs", href: "/our-impact/sdgs" },
  }),
  buildScaffoldPage({
    slug: "technology",
    eyebrow: "Partnership track",
    title: "Technology Companies",
    description: "Ways for technology firms to sponsor, mentor, partner, and hire through ITFY Ghana.",
    intro: "This route will become the ecosystem-facing home for talent alignment, volunteering, and sponsorship.",
    primaryCta: { label: "Hire our graduates", href: "/for-organisations/hire-graduates" },
  }),
];

export const articles: ArticleSeed[] = [
  {
    slug: "rebuild-foundation-update",
    category: "news",
    title: "The website rebuild foundation is now live",
    excerpt: "The new Next.js structure is in place with aligned navigation, homepage scaffolding, and stronger route foundations.",
    publishedAt: "2026-04-18",
    content: [
      "The IT For Youth Ghana website rebuild has moved into an active implementation phase.",
      "This foundation pass establishes the public information architecture, the shared layout system, and the top-of-homepage experience.",
      "Upcoming passes will deepen the homepage, expand route-specific storytelling, and connect the future CMS.",
    ],
  },
  {
    slug: "why-homepage-clarity-matters",
    category: "blogs",
    title: "Why homepage clarity matters for growing mission-driven teams",
    excerpt: "A stronger homepage sequence makes trust, urgency, and discovery easier for learners, funders, and partners.",
    publishedAt: "2026-04-18",
    content: [
      "For a growing NGO, the homepage has to do more than look polished. It has to guide multiple audiences quickly and clearly.",
      "That is why this rebuild gives special attention to the opening sequence: announcement, hero, ticker, and impact proof.",
      "That stack helps users understand the mission, the urgency, and the pathways available to them in just a few seconds.",
    ],
  },
];

export const adminNavigation: AdminNavItem[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    description: "Overview, activity, and publishing health.",
  },
  {
    label: "Content",
    href: "/admin/content/homepage",
    description: "Homepage sections, banner, slides, and impact content.",
  },
  {
    label: "Articles",
    href: "/admin/articles",
    description: "News and blog management scaffolding.",
  },
  {
    label: "Team",
    href: "/admin/team",
    description: "Profiles, departments, and featured people.",
  },
  {
    label: "Partners",
    href: "/admin/partners",
    description: "Logos, links, and organisation metadata.",
  },
  {
    label: "Applications",
    href: "/admin/applications",
    description: "Training application review workflow.",
  },
];

// ─── Hero slides ──────────────────────────────────────────────────────────────

export const heroSlides: HeroSlide[] = [
  {
    id: "slide-stories",
    eyebrow: "Student Stories",
    heading: "Turning ambition into opportunity, one graduate at a time.",
    body: "Every year, hundreds of young Ghanaians cross the stage — not just with a certificate, but with the skills and confidence to shape the digital economy.",
    image: "/images/randomPictures/maingraduationpic.jpg",
    overlayFrom: "rgba(10,15,40,0.85)",
    overlayTo: "rgba(10,15,40,0.4)",
    cta: {
      primary:   { label: "Meet our graduates", href: "/our-impact/testimonials" },
      secondary: { label: "Who we are",         href: "/who-we-are" },
    },
  },
  {
    id: "slide-programs",
    eyebrow: "Our Programs",
    heading: "Hands-on digital skills for the careers of tomorrow.",
    body: "From coding bootcamps to entrepreneurship labs, our programmes are designed with industry partners to ensure every student is work-ready on day one.",
    image: "/images/randomPictures/groupworkstudents.jpg",
    overlayFrom: "rgba(5,25,15,0.85)",
    overlayTo: "rgba(5,25,15,0.45)",
    cta: {
      primary:   { label: "Browse courses", href: "/apply-for-training/courses" },
      secondary: { label: "What we do",      href: "/what-we-do" },
    },
  },
  {
    id: "slide-impact",
    eyebrow: "Our Impact",
    heading: "10 years of closing Ghana's digital divide.",
    body: "Over 3,000 youth trained, 40+ partner organisations, and a decade of proven results — IT For Youth Ghana is the most trusted name in youth digital empowerment.",
    image: "/images/randomPictures/happystudentscasual.jpg",
    overlayFrom: "rgba(30,15,5,0.85)",
    overlayTo: "rgba(30,15,5,0.45)",
    cta: {
      primary:   { label: "See our impact",  href: "/our-impact/reports" },
      secondary: { label: "Partner with us", href: "/partner-with-us" },
    },
  },
];

// ─── Featured programs ────────────────────────────────────────────────────────

export const featuredPrograms: FeaturedProgram[] = [
  {
    id: "bootcamp",
    eyebrow: "Flagship Initiative",
    title: "Digital Skills Bootcamp",
    description:
      "An intensive 12-week programme covering web development, data literacy, and digital entrepreneurship. Cohorts run twice yearly with mentorship baked in from day one.",
    image: "/images/randomPictures/groupworkstudents.jpg",
    href: "/apply-for-training/courses",
    cta: "Apply for next cohort",
    tags: ["12 weeks", "In-person", "Accra"],
    featured: true,
  },
  {
    id: "junior-coders",
    eyebrow: "For Schools",
    title: "Junior Coders Club",
    description:
      "Bringing coding to secondary schools across Accra, Kumasi & Takoradi — free of charge.",
    href: "/what-we-do/tech-clubs",
    cta: "Enrol your school",
    tags: ["Free", "Secondary"],
  },
  {
    id: "tech-sisters",
    eyebrow: "For Women",
    title: "Tech Sisters Initiative",
    description:
      "Closing the gender gap in tech with dedicated scholarships, mentoring, and community events for young women.",
    href: "/what-we-do/girls-in-tech",
    cta: "Find out more",
    tags: ["Scholarship", "Mentorship"],
  },
  {
    id: "startup-launchpad",
    eyebrow: "For Entrepreneurs",
    title: "Startup Launchpad",
    description:
      "Practical business training, seed funding connections, and a growing alumni network for aspiring founders.",
    href: "/what-we-do/entrepreneurship-hub",
    cta: "Explore",
    tags: ["Funding", "Networking"],
  },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "The bootcamp didn't just teach me to code — it taught me to think like a problem solver. Six months later I landed my first role as a junior developer in Accra.",
    name: "Ama Kofi",
    role: "Bootcamp Graduate · Junior Developer at TechHub GH",
    initials: "AK",
  },
  {
    id: "t2",
    quote:
      "As a young woman from Kumasi, I never thought tech was for me. The Tech Sisters programme proved me wrong. The mentors here are exceptional human beings.",
    name: "Efua Asante",
    role: "Tech Sisters Scholar · UX Designer",
    initials: "EA",
  },
  {
    id: "t3",
    quote:
      "IT For Youth Ghana gave our school the resources we simply couldn't afford. Our students now compete in national coding challenges — and win.",
    name: "Mr. Isaac Mensah",
    role: "Head of ICT · Accra Academy Secondary School",
    initials: "IM",
  },
];

// ─── Partners ─────────────────────────────────────────────────────────────────
// Add `logo: "/images/partners/name.svg"` once assets are available.

export const partners: Partner[] = [
  { id: "p1", name: "Google.org" },
  { id: "p2", name: "UNICEF Ghana" },
  { id: "p3", name: "GIZ" },
  { id: "p4", name: "Mastercard Foundation" },
  { id: "p5", name: "Vodafone Ghana" },
  { id: "p6", name: "Microsoft" },
  { id: "p7", name: "Tony Elumelu Foundation" },
  { id: "p8", name: "USAID" },
];

// ─── Events ───────────────────────────────────────────────────────────────────

export const upcomingEvents: EventItem[] = [
  {
    id: "ev1",
    date: "15 Jul 2025",
    month: "Jul",
    day: "15",
    title: "2025 Bootcamp Open Day — Accra",
    location: "ITFY Learning Centre, Accra",
    type: "Info Day",
    href: "/news-and-updates/news",
    featured: true,
  },
  {
    id: "ev2",
    date: "22 Jul 2025",
    month: "Jul",
    day: "22",
    title: "Tech Sisters Mentorship Kickoff",
    location: "Online (Zoom)",
    type: "Webinar",
    href: "/news-and-updates/news",
  },
  {
    id: "ev3",
    date: "02 Aug 2025",
    month: "Aug",
    day: "02",
    title: "Junior Coders Regional Competition",
    location: "Kumasi, Ghana",
    type: "Workshop",
    href: "/news-and-updates/news",
  },
  {
    id: "ev4",
    date: "20 Sep 2025",
    month: "Sep",
    day: "20",
    title: "2024 Cohort Graduation Ceremony",
    location: "National Theatre, Accra",
    type: "Graduation",
    href: "/news-and-updates/news",
  },
];

// ─── Public hubs (navigation cards) ──────────────────────────────────────────

export const publicHubs: RouteCard[] = [
  {
    href: "/who-we-are",
    eyebrow: "Learn",
    title: "Who We Are",
    description:
      "Meet the organisation, the team behind the mission, and the partners helping expand impact.",
  },
  {
    href: "/what-we-do",
    eyebrow: "Explore",
    title: "What We Do",
    description:
      "See the eight initiatives shaping digital opportunity for young people across Ghana.",
  },
  {
    href: "/apply-for-training",
    eyebrow: "Apply",
    title: "Apply for Training",
    description:
      "Check eligibility, browse courses, and understand the training journey from first click to enrolment.",
  },
  {
    href: "/for-organisations",
    eyebrow: "Collaborate",
    title: "For Organisations",
    description:
      "Explore corporate training, sponsorship, staff volunteering, and ways to hire our graduates.",
  },
  {
    href: "/partner-with-us",
    eyebrow: "Partner",
    title: "Partner With Us",
    description:
      "Find the right route for educational institutions, governments, NGOs, foundations, and tech companies.",
  },
  {
    href: "/our-impact/reports",
    eyebrow: "Discover",
    title: "Our Impact",
    description:
      "Explore impact reports, testimonials, and SDG alignment across our work.",
  },
  {
    href: "/news-and-updates",
    eyebrow: "Updates",
    title: "News & Updates",
    description:
      "Follow programme news, stories, and blog content as the new platform grows.",
  },
  {
    href: "/contact",
    eyebrow: "Connect",
    title: "Contact Us",
    description:
      "Reach our team in Accra for programme enquiries, partnerships, or media opportunities.",
  },
];

export const homepageSections: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  variant?: "navy" | "gold" | "default";
  items?: string[];
  cta?: { label: string; href: string };
}[] = [];
