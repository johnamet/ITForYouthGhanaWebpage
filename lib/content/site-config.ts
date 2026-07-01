/**
 * lib/content/site-config.ts
 *
 * Single source of truth for all static site content.
 * Replace your existing site-config.ts with this file entirely.
 */

import type { HeroSlide }       from "@/components/home/hero-slideshow";
import type { MarqueeTickerContent } from "@/components/home/marquee-ticker";
import type { FeaturedProgram } from "@/components/home/featured-programs";
import type { ProgrammeShowcaseItem } from "@/components/home/programme-showcase";
import type { DonationCampaignContent } from "@/components/home/donation-campaign";
import type { FeaturedStoryContent } from "@/components/home/featured-story-video";
import type { JoinCtaCard } from "@/components/home/join-cta-block";
import type { NewsletterSignupContent } from "@/components/home/newsletter-signup-section";
import type { FloatingElementsContent } from "@/components/layout/floating-elements";
import type { Testimonial }     from "@/components/home/testimonials-section";
import type { Partner }         from "@/components/home/patrners-strip";
import type { EventItem }       from "@/components/home/upcoming-events";
import type { Announcement }    from "@/components/layout/announcement-bar";
import type { AdminNavItem }    from "@/types/admin";
import type { ArticleSeed, InitiativePage, SitePage } from "@/types/content";

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

// ─── Announcement bar ─────────────────────────────────────────────────────────

export const activeAnnouncement: Announcement = {
  id: "cohort-7-2026",
  variant: "urgent",
  label: "Cohort 7 open",
  message:
    "Applications for Cohort 7 close 31 May 2026. Limited places for young people ready to build digital skills and careers.",
  cta: { label: "Apply for Cohort 7", href: "/apply-for-training/courses" },
  startDate: "2026-04-18T00:00:00.000Z",
  endDate: "2026-05-31T23:59:59.000Z",
  countdownDate: "2026-05-31T23:59:59.000Z",
  dismissible: true,
};

export const floatingElementsContent: FloatingElementsContent = {
  donateButton: {
    label: "Donate now",
    href: "/donate",
    showAfterPx: 400,
    active: true,
  },
  scrollToTop: {
    showAfterPx: 600,
    ariaLabel: "Scroll back to top",
    active: true,
  },
  exitIntent: {
    id: "homepage-newsletter-2026",
    mode: "newsletter",
    headline: "Before you go, stay close to the next cohort, stories, and opportunities",
    description:
      "Join the mailing list for application windows, programme updates, learner stories, and ways to support young people building their future in tech.",
    image: "/images/randomPictures/studentslisteningfrontal.JPG",
    delayMs: 60_000,
    dismissDays: 7,
    newsletterInterest: "exit-intent",
    active: true,
  },
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

type InitiativeSeedConfig = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  tagline: string;
  heroImage: string;
  overviewImage: string;
  stats: InitiativePage["stats"];
  mission: string;
  objectives: string[];
  howItWorks: InitiativePage["howItWorks"];
  impactStats: InitiativePage["impactStats"];
  audience: InitiativePage["audience"];
  gallery: InitiativePage["gallery"];
  testimonials: InitiativePage["testimonials"];
  partners: InitiativePage["partners"];
  faqs: InitiativePage["faqs"];
  related: InitiativePage["related"];
};

function buildInitiativePage(config: InitiativeSeedConfig): InitiativePage {
  return {
    slug: config.slug,
    eyebrow: config.eyebrow,
    title: config.title,
    description: config.description,
    intro: config.intro,
    ctas: [
      { label: "Apply for training", href: "/apply-for-training" },
      { label: "Contact the team", href: "/contact" },
    ],
    sections: [
      {
        title: "Mission",
        body: config.mission,
      },
      {
        title: "Objectives",
        body: "The initiative is designed around a practical set of outcomes that can later be managed from the CMS.",
        bullets: config.objectives,
      },
    ],
    related: config.related,
    stats: config.stats,
    tagline: config.tagline,
    heroImage: config.heroImage,
    overviewImage: config.overviewImage,
    mission: config.mission,
    objectives: config.objectives,
    howItWorks: config.howItWorks,
    impactStats: config.impactStats,
    audience: config.audience,
    gallery: config.gallery,
    testimonials: config.testimonials,
    partners: config.partners,
    faqs: config.faqs,
    applyCta: {
      heading: `Ready to explore ${config.title}?`,
      description:
        "The rebuild now gives this initiative a real storytelling structure. The next step is to turn interest into an application, a conversation, or a partnership.",
      primary: { label: "Apply now", href: "/apply-for-training" },
      secondary: { label: "Have questions?", href: "/contact" },
    },
  };
}

export const initiatives: InitiativePage[] = [
  buildInitiativePage({
    slug: "girls-in-tech",
    eyebrow: "Flagship initiative",
    title: "Girls in Tech",
    description:
      "Confidence-building technical training, mentorship, and access pathways designed specifically for young women in Ghana.",
    intro:
      "Girls in Tech is one of the clearest ways IT For Youth Ghana turns inclusion into action, combining technical learning with the confidence, community, and role models young women need to stay in the pipeline.",
    tagline:
      "A practical pathway that helps more young women see themselves, and succeed, in technology.",
    heroImage: "/images/randomPictures/group_girls.jpg",
    overviewImage: "/images/randomPictures/groupofgirlsentrance.jpg",
    stats: [
      { value: "1,200+", label: "Young women reached", description: "Across training, mentoring, and confidence-building experiences." },
      { value: "48%", label: "Female participation", description: "A growing signal that the pipeline is becoming more inclusive." },
      { value: "18", label: "Mentor sessions", description: "Structured support connecting learners to role models and practitioners." },
      { value: "6", label: "Cities engaged", description: "Local activity hubs and partner venues supporting delivery." },
    ],
    mission:
      "The initiative exists to help girls and young women move from curiosity about technology to sustained participation, practical skill-building, and visible pathways into careers, further learning, and entrepreneurship.",
    objectives: [
      "Reduce the confidence gap that often pushes girls out of technical learning early.",
      "Connect learners to hands-on projects, not just awareness sessions.",
      "Create visible mentorship and peer-support systems that make persistence easier.",
      "Strengthen the transition from participation into real opportunities.",
    ],
    howItWorks: [
      { number: "01", title: "Recruit", description: "Outreach with schools, communities, and partner networks brings in girls who are interested but may not yet see tech as a realistic path.", icon: "📣" },
      { number: "02", title: "Train", description: "Learners move through practical sessions in design, coding, digital confidence, and career readiness with facilitators who meet them where they are.", icon: "💻" },
      { number: "03", title: "Mentor", description: "Mentors, alumni, and volunteers help learners connect what they are building to real careers and real people in the industry.", icon: "🤝" },
      { number: "04", title: "Launch", description: "Participants leave with stronger portfolios, clearer next steps, and pathways into the academy, clubs, internships, and entrepreneurship support.", icon: "🚀" },
    ],
    impactStats: [
      { value: "320+", label: "Learners trained", description: "Hands-on participation through dedicated girls-focused cohorts.", icon: "👩‍💻" },
      { value: "76%", label: "Completion rate", description: "A strong retention signal across structured programme runs.", icon: "✅" },
      { value: "140+", label: "Mentorship matches", description: "Connections made between learners and role models in tech.", icon: "🌟" },
      { value: "28", label: "Scholarship placements", description: "Learners who progressed into deeper training support.", icon: "🎓" },
    ],
    audience: {
      summary:
        "Girls in Tech is designed for young women who need more than inspiration. It is especially useful for learners who are capable and curious, but need access, mentorship, and sustained encouragement to stay on the path.",
      groups: [
        "Senior high school and tertiary learners exploring digital careers for the first time.",
        "Young women who need confidence-building before entering more intensive technical training.",
        "Learners seeking female-led mentorship and a stronger sense of belonging in tech spaces.",
      ],
      eligibility: [
        "Open to young women with a clear interest in learning, even if they have no prior technical background.",
        "Best suited to participants who can commit to practical sessions and project work.",
        "Priority can be given where access barriers, underrepresentation, or transition support needs are highest.",
      ],
    },
    gallery: [
      { src: "/images/randomPictures/group_girls.jpg", alt: "Girls in Tech participants gathered during a learning session." },
      { src: "/images/randomPictures/girlstaslkingUX.jpg", alt: "Learners discussing design ideas in a collaborative workshop." },
      { src: "/images/randomPictures/uXstudents.jpg", alt: "Participants presenting their work during a skills showcase." },
      { src: "/images/randomPictures/UXteacher.png", alt: "Facilitator guiding students through practical digital exercises." },
    ],
    testimonials: [
      { quote: "Before this programme, tech felt like something other people did. Now I can build, present, and apply with confidence.", name: "Benedicta O.", role: "Girls in Tech participant", avatar: "/images/people/benedicta.jpg" },
      { quote: "The mentorship made the biggest difference. It helped me imagine a future I could actually step into.", name: "Elisabeth A.", role: "Learner and emerging UX designer", avatar: "/images/people/elisabeth.jpg" },
      { quote: "Girls in Tech works because it combines technical learning with the emotional support learners need to persist.", name: "Danielle M.", role: "Volunteer mentor", avatar: "/images/people/danielle.jpg" },
    ],
    partners: [
      { name: "UNICEF Ghana", description: "Supports inclusive opportunity framing and youth-centered programme visibility.", logo: "/images/partnerorga/Download (1).jpg" },
      { name: "Vodafone Ghana", description: "Provides ecosystem visibility and practical partnership credibility for digital-skills programming.", logo: "/images/partnerorga/Download (4).jpg" },
    ],
    faqs: [
      { question: "Do participants need prior coding experience?", answer: "No. The initiative is designed to welcome learners at different starting points and build confidence alongside technical skill." },
      { question: "Is this separate from the Youth Tech Academy?", answer: "It can serve as an entry point, a confidence-building layer, or a connected pathway into deeper training depending on the learner’s stage." },
      { question: "How do mentors get involved?", answer: "Mentors can support through talks, feedback sessions, project reviews, or more structured guidance across a programme cycle." },
    ],
    related: [
      { href: "/apply-for-training", eyebrow: "Apply", title: "Apply for Training", description: "Move from interest into the next available learning pathway." },
      { href: "/partner-with-us", eyebrow: "Partner", title: "Partner With Us", description: "Support gender inclusion in tech through funding, mentoring, or collaboration." },
      { href: "/our-impact/testimonials", eyebrow: "Stories", title: "Read More Testimonials", description: "See more participant and partner stories across the platform." },
    ],
  }),
  buildInitiativePage({
    slug: "youth-academy",
    eyebrow: "Training pathway",
    title: "Youth Tech Academy",
    description:
      "A structured digital skills pathway designed to move young people from curiosity to job-ready confidence.",
    intro:
      "The academy is the backbone of the learning experience: practical, cohort-based, and focused on preparing participants for work, deeper specialisation, or entrepreneurship.",
    tagline:
      "A disciplined training environment where ambition becomes practical, career-facing skill.",
    heroImage: "/images/randomPictures/studentsBackcoding.jpg",
    overviewImage: "/images/randomPictures/groupworkstudents.jpg",
    stats: [
      { value: "850+", label: "Academy learners", description: "Participants who have moved through the structured training pathway." },
      { value: "12", label: "Weeks per cycle", description: "A focused training rhythm with project work and guided support." },
      { value: "85%", label: "Employment rate", description: "Graduates entering work, further learning, or enterprise paths." },
      { value: "4", label: "Core tracks", description: "Seeded pathways in software, design, entrepreneurship, and digital literacy." },
    ],
    mission:
      "Youth Tech Academy exists to create a reliable bridge between raw interest and real opportunity by giving young people practical digital skills, project discipline, and a stronger transition into the world of work.",
    objectives: [
      "Deliver structured, high-accountability training that feels relevant to real life and real work.",
      "Help learners build portfolios, not just complete sessions.",
      "Support transitions into internships, jobs, self-employment, or deeper learning pathways.",
      "Give employers and partners a clearer route to emerging talent.",
    ],
    howItWorks: [
      { number: "01", title: "Assess", description: "Applicants are profiled to understand motivation, commitment, and the best route into the available training tracks.", icon: "🧭" },
      { number: "02", title: "Train", description: "Learners move through practical technical sessions, assignments, collaboration, and facilitator feedback.", icon: "🧑‍🏫" },
      { number: "03", title: "Build", description: "Projects, presentations, and portfolio work help participants apply what they are learning in visible ways.", icon: "🛠️" },
      { number: "04", title: "Transition", description: "Graduates are supported toward jobs, internships, entrepreneurship, or connected opportunity routes.", icon: "📈" },
    ],
    impactStats: [
      { value: "210+", label: "Graduates", description: "Learners completing intensive academy pathways.", icon: "🎓" },
      { value: "65+", label: "Portfolio projects", description: "Visible work that strengthens credibility and employability.", icon: "🗂️" },
      { value: "34", label: "Internship links", description: "Transitions into work exposure and practical experience.", icon: "💼" },
      { value: "92%", label: "Attendance consistency", description: "A sign of accountability and structured engagement.", icon: "📊" },
    ],
    audience: {
      summary:
        "The academy is for young people who are ready for a more serious training environment and want a clearer route into employability, freelancing, or business-building.",
      groups: [
        "Learners transitioning from awareness and outreach programmes into deeper technical practice.",
        "Young people seeking a portfolio-led route into digital careers.",
        "Graduates who need structure, accountability, and exposure to professional expectations.",
      ],
      eligibility: [
        "Best for learners who can commit consistently across a full cohort period.",
        "No single academic background is required, but motivation and follow-through matter.",
        "Applicants should be ready for practical assignments, collaboration, and regular feedback.",
      ],
    },
    gallery: [
      { src: "/images/randomPictures/studentsBackcoding.jpg", alt: "Youth Tech Academy participants working during a coding session." },
      { src: "/images/randomPictures/UXcours.jpg", alt: "Learners reviewing ideas and course exercises together." },
      { src: "/images/randomPictures/studentpresenting.jpg", alt: "A participant presenting project work to peers and facilitators." },
      { src: "/images/randomPictures/studentsblueclothing.jpg", alt: "Academy learners gathered in a collaborative classroom setting." },
    ],
    testimonials: [
      { quote: "The academy changed how I approach learning. I stopped waiting to feel ready and started building real things.", name: "Mlan K.", role: "Youth Tech Academy graduate", avatar: "/images/people/Mlan.jpg" },
      { quote: "What stood out was the accountability. We were expected to ship work, improve, and present it clearly.", name: "Emmanuel T.", role: "Graduate and junior developer", avatar: "/images/people/emmanuel.jpg" },
      { quote: "The academy makes learners legible to employers because they leave with visible projects and better communication skills.", name: "Peter A.", role: "Industry mentor", avatar: "/images/people/peter.jpg" },
    ],
    partners: [
      { name: "Microsoft", description: "Signals the type of industry-facing standards and digital pathways the academy aligns with.", logo: "/images/partnerorga/Download (5).jpg" },
      { name: "Google.org", description: "Represents the kind of ecosystem support that strengthens training credibility and reach.", logo: "/images/partnerorga/Download.jpg" },
    ],
    faqs: [
      { question: "What kind of courses sit inside the academy?", answer: "The academy is designed as a structured pathway, so course themes can evolve while the overall learner journey stays stable." },
      { question: "Does the academy guarantee employment?", answer: "No programme can promise that, but the academy is intentionally designed to improve readiness, visibility, and transition outcomes." },
      { question: "Can beginners still apply?", answer: "Yes, if they are ready for committed learning and practical assignments. Some learners enter directly, while others come through adjacent initiatives first." },
    ],
    related: [
      { href: "/apply-for-training/courses", eyebrow: "Courses", title: "Browse Courses", description: "See the training catalogue and connected programme routes." },
      { href: "/for-organisations/hire-graduates", eyebrow: "Talent", title: "Hire Our Graduates", description: "Explore how organisations can connect with emerging talent." },
      { href: "/our-impact/reports", eyebrow: "Impact", title: "Impact Reports", description: "See how training outcomes connect to the wider mission." },
    ],
  }),
  buildInitiativePage({
    slug: "entrepreneurship-hub",
    eyebrow: "Venture pathway",
    title: "Entrepreneurship Hub",
    description:
      "Support for aspiring founders building ideas, practical business skills, and early market confidence.",
    intro:
      "The hub sits at the point where digital skill meets initiative. It helps learners and young founders move from ideas and prototypes toward clearer business thinking and real-world traction.",
    tagline:
      "A space where technical ability turns into enterprise, experimentation, and local problem-solving.",
    heroImage: "/images/randomPictures/studentpresenting.jpg",
    overviewImage: "/images/randomPictures/peterTalking.jpg",
    stats: [
      { value: "110+", label: "Founders supported", description: "Young people exposed to practical business-building support." },
      { value: "24", label: "Pitch sessions", description: "Opportunities to present ideas, improve, and gain feedback." },
      { value: "12", label: "Mentor touchpoints", description: "Structured coaching and founder guidance moments." },
      { value: "8", label: "Partner referrals", description: "Warm routes into networks, showcases, and support ecosystems." },
    ],
    mission:
      "The Entrepreneurship Hub helps young people turn initiative into action by building the business confidence, market literacy, and support systems needed to test and grow ideas responsibly.",
    objectives: [
      "Help learners think beyond products to value, users, and sustainability.",
      "Give early founders practical support instead of abstract motivation.",
      "Create more visible links between youth innovation and local opportunity.",
      "Strengthen a culture of problem-solving that can continue beyond the classroom.",
    ],
    howItWorks: [
      { number: "01", title: "Explore", description: "Participants identify local challenges, user needs, and areas where digital thinking can unlock value.", icon: "🔍" },
      { number: "02", title: "Prototype", description: "Ideas are shaped into early products, service concepts, and pitchable narratives through guided sessions.", icon: "🧪" },
      { number: "03", title: "Refine", description: "Mentors help founders strengthen assumptions, improve communication, and prioritise feasible next steps.", icon: "✍️" },
      { number: "04", title: "Connect", description: "Promising ideas are linked to networks, showcases, and potential support pathways for growth.", icon: "🌐" },
    ],
    impactStats: [
      { value: "35", label: "Pitches delivered", description: "Early ventures presented in public or partner-facing settings.", icon: "🎤" },
      { value: "14", label: "Ideas incubated", description: "Concepts that moved beyond initial brainstorming into active development.", icon: "💡" },
      { value: "9", label: "Mentor-led clinics", description: "Focused sessions on business thinking, market fit, and communication.", icon: "🧠" },
      { value: "3", label: "Cohort showcases", description: "Moments where founders present progress and attract visibility.", icon: "📍" },
    ],
    audience: {
      summary:
        "This initiative is for participants who are already making, building, or imagining something and need more support turning that energy into clearer entrepreneurial direction.",
      groups: [
        "Academy learners who want to explore enterprise routes alongside technical skills.",
        "Young founders testing ideas that respond to community or market needs.",
        "Participants who need structure and feedback to move from concept to action.",
      ],
      eligibility: [
        "Open to learners with ideas at different stages, from rough concept to early prototype.",
        "Best for participants willing to test assumptions and revise based on feedback.",
        "Strong fit for those interested in self-employment, venture creation, or innovation challenges.",
      ],
    },
    gallery: [
      { src: "/images/randomPictures/studentpresenting.jpg", alt: "Founder presenting an idea during an entrepreneurship session." },
      { src: "/images/randomPictures/peterTalking.jpg", alt: "Facilitator speaking with learners during a venture workshop." },
      { src: "/images/randomPictures/studentpresentin.jpg", alt: "Participants sharing project concepts in a guided feedback environment." },
      { src: "/images/randomPictures/petertalkingtostudentscoloful.jpg", alt: "Collaborative learning session focused on pitching and business ideas." },
    ],
    testimonials: [
      { quote: "This was the first place where my idea stopped feeling vague and started feeling buildable.", name: "Konadu A.", role: "Entrepreneurship Hub participant", avatar: "/images/people/konadu.jpg" },
      { quote: "The most useful part was getting practical feedback, not just encouragement. It made the next step obvious.", name: "Junior M.", role: "Young founder", avatar: "/images/people/junior.jpg" },
      { quote: "The hub is strongest when it helps participants see entrepreneurship as disciplined problem-solving, not just ambition.", name: "Peter S.", role: "Business mentor", avatar: "/images/people/peter.jpg" },
    ],
    partners: [
      { name: "Tony Elumelu Foundation", description: "Represents the type of ecosystem support that helps young founders think beyond the first idea.", logo: "/images/partnerorga/Download (6).jpg" },
      { name: "Mastercard Foundation", description: "Signals the role partnership can play in scaling youth employability and enterprise pathways.", logo: "/images/partnerorga/Download (3).jpg" },
    ],
    faqs: [
      { question: "Do participants need a registered business?", answer: "No. The hub supports learners from idea-stage through to clearer venture direction and early testing." },
      { question: "Is funding guaranteed?", answer: "No, but the hub improves founder readiness and visibility, which makes support pathways more realistic." },
      { question: "Can academy learners participate too?", answer: "Yes. The hub is designed to connect well with the wider ITFY training ecosystem." },
    ],
    related: [
      { href: "/partner-with-us/technology", eyebrow: "Partner", title: "Technology Companies", description: "Support innovation, mentoring, and founder visibility through partnership." },
      { href: "/apply-for-training", eyebrow: "Apply", title: "Apply for Training", description: "Explore the training routes that feed into this entrepreneurship pathway." },
      { href: "/news-and-updates/blogs", eyebrow: "Read", title: "Blogs", description: "Follow ideas, reflections, and ecosystem stories across the platform." },
    ],
  }),
  buildInitiativePage({
    slug: "code-impact-challenge",
    eyebrow: "Challenge format",
    title: "Code Impact Challenge",
    description:
      "A challenge-led programme connecting technical learning with real-world problem solving.",
    intro:
      "The challenge format gives learners a public, time-bound, mission-focused way to apply their skills and collaborate around meaningful local problems.",
    tagline:
      "A high-energy format where technical learning becomes visible impact under real constraints.",
    heroImage: "/images/randomPictures/redstudentgrouplesson.jpg",
    overviewImage: "/images/randomPictures/studentsblueclothing.jpg",
    stats: [
      { value: "14", label: "Challenge teams", description: "Learner groups building solutions around shared problem statements." },
      { value: "6", label: "Partner briefs", description: "Real-world themes and community-facing challenge prompts." },
      { value: "120+", label: "Participants", description: "Young people exposed to challenge-based collaborative learning." },
      { value: "4", label: "Showcase rounds", description: "Visible presentation milestones from concept to final demo." },
    ],
    mission:
      "Code Impact Challenge turns technical learning into active problem-solving by giving young people opportunities to build around real needs, present under pressure, and sharpen teamwork through challenge-based practice.",
    objectives: [
      "Strengthen problem-solving and collaboration through purposeful competition.",
      "Help learners practice applied building in public, not only in private classrooms.",
      "Create more visible moments where communities and partners can see learner capability.",
      "Support a culture of experimentation, iteration, and communication.",
    ],
    howItWorks: [
      { number: "01", title: "Frame", description: "Teams receive challenge prompts tied to local, social, or ecosystem needs that require practical digital thinking.", icon: "🧩" },
      { number: "02", title: "Build", description: "Participants research, prototype, test, and refine possible responses within a structured challenge window.", icon: "⌨️" },
      { number: "03", title: "Present", description: "Teams pitch their work to peers, judges, and invited stakeholders with clear criteria and deadlines.", icon: "🎯" },
      { number: "04", title: "Reflect", description: "Feedback and debrief sessions help participants carry lessons forward into future projects or deeper programmes.", icon: "🔁" },
    ],
    impactStats: [
      { value: "28", label: "Prototype concepts", description: "Ideas developed into early challenge-ready solutions.", icon: "🛠️" },
      { value: "11", label: "Judging mentors", description: "Partners and practitioners helping teams sharpen their thinking.", icon: "👥" },
      { value: "4", label: "Winning teams", description: "Outstanding participant groups recognized for execution and impact.", icon: "🏆" },
      { value: "88%", label: "Team completion", description: "A strong signal of engagement and collaborative follow-through.", icon: "📈" },
    ],
    audience: {
      summary:
        "This initiative is best for learners who already have some technical exposure and want a more applied, collaborative, and time-bound format to stretch their skills.",
      groups: [
        "Participants ready to practice teamwork and problem-solving in public.",
        "Learners who benefit from challenge deadlines and presentation moments.",
        "Young builders interested in innovation, prototyping, and community relevance.",
      ],
      eligibility: [
        "Works best for learners with some prior exposure to digital tools or technical learning.",
        "Participants should be comfortable collaborating, presenting, and iterating quickly.",
        "Teams may combine different skills, including design, coding, research, and storytelling.",
      ],
    },
    gallery: [
      { src: "/images/randomPictures/redstudentgrouplesson.jpg", alt: "Learners working intensely during a challenge session." },
      { src: "/images/randomPictures/studentsblueclothing.jpg", alt: "A team collaborating during project development." },
      { src: "/images/randomPictures/studentgroupguys.jpg", alt: "Participants preparing together for a showcase moment." },
      { src: "/images/randomPictures/studentpresenting.jpg", alt: "A final demo presentation during the challenge format." },
    ],
    testimonials: [
      { quote: "The challenge forced us to think clearly, move faster, and explain our decisions in a way we never had before.", name: "Saah J.", role: "Challenge participant", avatar: "/images/people/saah.jpg" },
      { quote: "It was one of the few experiences where you could see learners becoming more confident with every round.", name: "Amoako F.", role: "Volunteer judge", avatar: "/images/people/amoako.jpg" },
      { quote: "The strongest teams were not always the most technical. They were the ones that understood the problem best.", name: "Agboku E.", role: "Mentor and reviewer", avatar: "/images/people/agboku.jpg" },
    ],
    partners: [
      { name: "GIZ", description: "Signals the type of partner ecosystem that can help connect challenge work to broader development themes.", logo: "/images/partnerorga/Download (2).jpg" },
      { name: "USAID", description: "Represents public-interest alignment and the value of challenge-led approaches to local problem solving.", logo: "/images/partnerorga/Download (6).jpg" },
    ],
    faqs: [
      { question: "Is the challenge only for advanced coders?", answer: "No. Teams can bring different strengths, and challenge design can reward research, design, communication, and execution alongside technical depth." },
      { question: "Do participants work alone or in teams?", answer: "The challenge is designed primarily around collaborative teams because teamwork is part of the learning outcome." },
      { question: "What happens after the challenge ends?", answer: "Strong teams and individuals can be connected to future programmes, showcases, or partnership opportunities." },
    ],
    related: [
      { href: "/our-impact/reports", eyebrow: "Impact", title: "Impact Reports", description: "See how challenge-based learning fits into the wider mission." },
      { href: "/apply-for-training", eyebrow: "Apply", title: "Apply for Training", description: "Explore the routes that can prepare learners for future challenge participation." },
      { href: "/partner-with-us/international-development", eyebrow: "Partner", title: "International Development", description: "See how challenge-led work can align with broader development goals." },
    ],
  }),
  buildInitiativePage({
    slug: "rural-tech-connect",
    eyebrow: "Access initiative",
    title: "Rural Tech Connect",
    description:
      "Expanding access to digital opportunity beyond city centers through local partnerships and targeted outreach.",
    intro:
      "Rural Tech Connect exists to close the geography gap in digital opportunity by bringing training, exposure, and partnership-driven support closer to underserved communities.",
    tagline:
      "A route to digital inclusion that starts with access, trust, and local relevance.",
    heroImage: "/images/randomPictures/children_holding_sign_in_streets.jpg",
    overviewImage: "/images/randomPictures/studentslisteningfrontal.JPG",
    stats: [
      { value: "9", label: "Community hubs", description: "Places where local partnerships help anchor delivery." },
      { value: "1,500+", label: "Learners reached", description: "Exposure and training activity extending beyond major cities." },
      { value: "22", label: "Outreach visits", description: "Local engagements that help build trust and readiness." },
      { value: "5", label: "Regional partners", description: "Organisations and institutions supporting local delivery." },
    ],
    mission:
      "Rural Tech Connect is designed to make digital opportunity more geographically inclusive by bringing exposure, practical training, and trusted local partnership models to communities that are often left out of mainstream access pathways.",
    objectives: [
      "Reduce the location-based barriers that restrict access to training and digital confidence.",
      "Build local trust through partnership with schools, community actors, and institutions.",
      "Create visible routes from outreach into deeper ITFY learning pathways.",
      "Support a model of expansion that is community-aware instead of city-centric.",
    ],
    howItWorks: [
      { number: "01", title: "Partner", description: "Local schools, leaders, and organisations help identify where support is most needed and how delivery can fit the local context.", icon: "🫱" },
      { number: "02", title: "Activate", description: "Introductory sessions, workshops, and demonstrations create first access points and build awareness.", icon: "📍" },
      { number: "03", title: "Train", description: "Participants move into more practical engagement, with relevant digital skills and structured follow-up where possible.", icon: "🧰" },
      { number: "04", title: "Link", description: "Promising learners are connected to longer-form programmes, clubs, or future partner-supported pathways.", icon: "🔗" },
    ],
    impactStats: [
      { value: "42", label: "School activations", description: "Local moments of access and awareness-building.", icon: "🏫" },
      { value: "380+", label: "Hands-on learners", description: "Participants who moved beyond exposure into practical engagement.", icon: "💻" },
      { value: "7", label: "District touchpoints", description: "Geographic reach through partnerships and outreach work.", icon: "🗺️" },
      { value: "60+", label: "Referral transitions", description: "Learners connected onward into deeper pathways.", icon: "➡️" },
    ],
    audience: {
      summary:
        "This initiative is for communities and learners who are often excluded from centralised digital opportunities, but are ready to engage when training becomes locally accessible and context-aware.",
      groups: [
        "Young people in communities beyond major urban centres.",
        "Schools and local actors seeking practical youth digital exposure pathways.",
        "Partners interested in geographically broader inclusion strategies.",
      ],
      eligibility: [
        "Participation often depends on local activation formats, school partnerships, or regional outreach plans.",
        "Learners do not need prior technical experience to engage at entry level.",
        "Partner-supported pathways can extend opportunities for stronger follow-up and referral.",
      ],
    },
    gallery: [
      { src: "/images/randomPictures/children_holding_sign_in_streets.jpg", alt: "Community-based outreach moment during Rural Tech Connect." },
      { src: "/images/randomPictures/studentslisteningfrontal.JPG", alt: "Learners listening during a regional activation session." },
      { src: "/images/randomPictures/redclothingStudents.jpg", alt: "A local group of students gathered for a digital exposure session." },
      { src: "/images/randomPictures/studentslistening.jpg", alt: "Community learners participating in a practical outreach event." },
    ],
    testimonials: [
      { quote: "Bringing the programme to us changed everything. It made technology feel close enough to belong to us too.", name: "Awartey L.", role: "Regional participant", avatar: "/images/people/awartey.jpg" },
      { quote: "Rural Tech Connect works because it respects local context and builds trust before expecting commitment.", name: "Avevor S.", role: "Community partner", avatar: "/images/people/avevor.jpg" },
      { quote: "The real value is not just the session itself. It is the route it opens for learners afterwards.", name: "Adjej K.", role: "Regional education supporter", avatar: "/images/people/adjej.jpg" },
    ],
    partners: [
      { name: "Educational Institutions", description: "School and local-institution partnerships are central to making regional activation work sustainable.", href: "/partner-with-us/educational" },
      { name: "Government", description: "Regional and public collaboration can help scale inclusive digital access models responsibly.", href: "/partner-with-us/government" },
    ],
    faqs: [
      { question: "Does Rural Tech Connect run year-round in every location?", answer: "No. Delivery depends on outreach schedules, partnerships, and regional planning, but the route is designed to scale over time." },
      { question: "Is this only an awareness programme?", answer: "No. It includes awareness, practical engagement, and referral into deeper pathways where possible." },
      { question: "How can organisations support this work?", answer: "Support can come through sponsorship, logistics, local connections, or partnership models that help reach more communities sustainably." },
    ],
    related: [
      { href: "/partner-with-us/educational", eyebrow: "Partner", title: "Educational Institutions", description: "Work with us to extend access through schools and learning communities." },
      { href: "/partner-with-us/government", eyebrow: "Collaborate", title: "Government", description: "Explore civic collaboration routes for broader youth digital inclusion." },
      { href: "/our-impact/reports", eyebrow: "Impact", title: "Impact Reports", description: "See how outreach and access connect to the wider mission." },
    ],
  }),
  buildInitiativePage({
    slug: "community-outreach",
    eyebrow: "Community pathway",
    title: "Community Outreach",
    description:
      "Awareness, activation, and learning experiences that connect more communities to digital opportunity.",
    intro:
      "Community Outreach is where ITFY meets people before they are ready to apply, enroll, or commit. It creates the first trust-building moments that make future participation possible.",
    tagline:
      "A front door into digital opportunity built around visibility, access, and community presence.",
    heroImage: "/images/randomPictures/studentslistening.jpg",
    overviewImage: "/images/randomPictures/peterblackboard.jpg",
    stats: [
      { value: "80+", label: "Outreach events", description: "Sessions designed to create access, awareness, and first contact." },
      { value: "3,000+", label: "People reached", description: "Students, parents, schools, and communities engaged through visibility work." },
      { value: "16", label: "Partner venues", description: "Spaces that help ITFY show up consistently and visibly." },
      { value: "420+", label: "Follow-up leads", description: "People who moved into deeper next steps after outreach contact." },
    ],
    mission:
      "Community Outreach exists to widen the top of the funnel by helping more young people, families, schools, and communities understand that digital opportunity is possible, relevant, and connected to their futures.",
    objectives: [
      "Create high-trust entry points into the wider ITFY ecosystem.",
      "Make programmes more visible to people who may not find them otherwise.",
      "Translate digital skills into language communities can understand and value.",
      "Build stronger referral pathways from outreach into training and partnership routes.",
    ],
    howItWorks: [
      { number: "01", title: "Show up", description: "ITFY activates in schools, events, and community spaces where awareness gaps are still high.", icon: "🚶" },
      { number: "02", title: "Demystify", description: "Facilitators turn big ideas about tech and opportunity into practical, relatable conversations.", icon: "💬" },
      { number: "03", title: "Engage", description: "Learners and community members interact through talks, mini-workshops, and early exposure activities.", icon: "🧑‍🤝‍🧑" },
      { number: "04", title: "Convert", description: "Interested participants are linked into programmes, updates, or future engagement routes.", icon: "📨" },
    ],
    impactStats: [
      { value: "210+", label: "School referrals", description: "Connections built between outreach work and formal next steps.", icon: "📚" },
      { value: "33", label: "Community sessions", description: "Structured public-facing activations in partner spaces.", icon: "🏘️" },
      { value: "12", label: "Awareness campaigns", description: "Focused outreach pushes connected to programmes or application cycles.", icon: "📢" },
      { value: "74%", label: "Follow-up engagement", description: "Participants taking at least one next action after outreach contact.", icon: "✅" },
    ],
    audience: {
      summary:
        "Community Outreach is for anyone who is not yet inside the training pipeline but could be, especially where awareness, access, or trust are still barriers.",
      groups: [
        "Students who need first exposure before they are ready to apply.",
        "Parents, schools, and community leaders who influence learner participation.",
        "Partners seeking visible, community-facing engagement formats.",
      ],
      eligibility: [
        "Most outreach formats are open-access and designed for broad participation.",
        "No prior technical background is required for entry-level engagement.",
        "Follow-up routes depend on interest, readiness, and the connected programme pathway.",
      ],
    },
    gallery: [
      { src: "/images/randomPictures/studentslistening.jpg", alt: "Community learners listening during an outreach activation." },
      { src: "/images/randomPictures/peterblackboard.jpg", alt: "Facilitator explaining concepts during a school outreach session." },
      { src: "/images/randomPictures/maingraduationpic.jpg", alt: "A visible community moment showing the scale of ITFY engagement." },
      { src: "/images/randomPictures/frontalgraduation.jpg", alt: "Audience participation during a community-facing ITFY event." },
    ],
    testimonials: [
      { quote: "The outreach event made the whole idea of digital skills feel concrete, not distant.", name: "White Lady A.", role: "Community participant", avatar: "/images/people/white lady-Cover.jpg" },
      { quote: "It helped our students understand that technology is not just something they consume. It is something they can build with.", name: "Mensah I.", role: "School partner", avatar: "/images/people/mensah.jpg" },
      { quote: "Outreach is where belief starts. Without it, a lot of learners would never take the first step.", name: "Belinda A.", role: "Programme facilitator", avatar: "/images/people/Belinda.jpg" },
    ],
    partners: [
      { name: "Educational Institutions", description: "Schools are a critical anchor point for effective community outreach and student referral pathways.", href: "/partner-with-us/educational" },
      { name: "NGOs & Foundations", description: "Mission-aligned collaborators can help widen reach and deepen community trust.", href: "/partner-with-us/ngo-foundations" },
    ],
    faqs: [
      { question: "Is Community Outreach the same as a training programme?", answer: "Not exactly. It is often the entry point that helps people understand and move toward deeper training opportunities." },
      { question: "Can schools request an outreach activation?", answer: "Yes. That kind of request is a strong fit for the partnership and contact routes already live on the site." },
      { question: "What happens after an outreach session?", answer: "Participants may join the mailing list, ask questions, apply for training, or enter future programme pathways depending on readiness." },
    ],
    related: [
      { href: "/contact", eyebrow: "Contact", title: "Request an Activation", description: "Start a conversation about outreach, school visits, or partner events." },
      { href: "/apply-for-training", eyebrow: "Apply", title: "Apply for Training", description: "Move from first exposure into deeper practical learning." },
      { href: "/news-and-updates/news", eyebrow: "Updates", title: "News", description: "Follow programme updates and community-facing stories." },
    ],
  }),
  buildInitiativePage({
    slug: "advocacy",
    eyebrow: "Influence work",
    title: "Advocacy",
    description:
      "Public-facing thought leadership and coalition work that widen opportunity for youth in tech.",
    intro:
      "Advocacy gives ITFY a voice beyond programme delivery. It helps turn field experience into public-facing influence, ecosystem conversation, and stronger alignment around youth digital opportunity.",
    tagline:
      "A route for shaping the wider conditions that make youth digital opportunity more possible.",
    heroImage: "/images/randomPictures/graduationspeaking.jpg",
    overviewImage: "/images/randomPictures/mireiotalking.jpg",
    stats: [
      { value: "14", label: "Public engagements", description: "Talks, panels, and ecosystem-facing conversation spaces." },
      { value: "9", label: "Coalition touchpoints", description: "Moments where ITFY voice contributes to broader influence work." },
      { value: "5", label: "Policy themes", description: "Recurring issues around access, inclusion, and youth digital futures." },
      { value: "2", label: "Thought series", description: "Seeded content directions ready for deeper publishing later." },
    ],
    mission:
      "Advocacy helps ensure that youth digital opportunity is not treated as an isolated programme issue, but as a larger ecosystem priority that requires visibility, evidence, and coalition-building.",
    objectives: [
      "Translate programme learning into clearer public-facing insight.",
      "Support dialogue around access, gender, employability, and digital inclusion.",
      "Make ITFY a more credible voice in youth-technology conversations.",
      "Create content and partnership routes that widen influence beyond direct delivery.",
    ],
    howItWorks: [
      { number: "01", title: "Observe", description: "Insights from programmes, learners, and communities help surface the issues that matter most.", icon: "👀" },
      { number: "02", title: "Frame", description: "Those insights are translated into public-facing themes, stories, and arguments that others can understand and engage with.", icon: "📝" },
      { number: "03", title: "Engage", description: "ITFY shows up in conversations, collaborations, and content spaces where influence can build over time.", icon: "🗣️" },
      { number: "04", title: "Align", description: "Partnership and ecosystem relationships help turn shared concerns into stronger collective action.", icon: "🤲" },
    ],
    impactStats: [
      { value: "18", label: "Audience touchpoints", description: "Public-facing opportunities to communicate programme insight.", icon: "📡" },
      { value: "6", label: "Partner dialogues", description: "Cross-sector conversations about youth and digital opportunity.", icon: "🤝" },
      { value: "4", label: "Thematic priorities", description: "Issues consistently surfaced across ITFY’s work.", icon: "🧭" },
      { value: "1", label: "Shared narrative", description: "A stronger public language for why the mission matters.", icon: "📘" },
    ],
    audience: {
      summary:
        "Advocacy is for partners, institutions, media, and ecosystem actors who want to understand the wider context around youth digital opportunity and where ITFY’s field experience can contribute.",
      groups: [
        "Funders and institutions looking for grounded programme insight.",
        "Policy and development actors interested in local digital inclusion narratives.",
        "Media, coalitions, and ecosystem partners engaging youth opportunity themes.",
      ],
      eligibility: [
        "This route is open to institutions, collaborators, and public audiences, not only programme participants.",
        "Strong fit for groups seeking evidence-led partnership or ecosystem dialogue.",
        "Public-facing content and events can become the main entry points here over time.",
      ],
    },
    gallery: [
      { src: "/images/randomPictures/graduationspeaking.jpg", alt: "Public speaking moment connected to advocacy and influence work." },
      { src: "/images/randomPictures/mireiotalking.jpg", alt: "Conversation-led engagement with partners and public audiences." },
      { src: "/images/randomPictures/peterTalking.jpg", alt: "Facilitator or speaker addressing a group around shared opportunity themes." },
      { src: "/images/randomPictures/whiteLady.jpg", alt: "An audience-facing programme moment that signals broader ecosystem engagement." },
    ],
    testimonials: [
      { quote: "What matters here is that the message comes from lived programme experience, not from a distance.", name: "Agboku S.", role: "Ecosystem collaborator", avatar: "/images/people/agboku1.png" },
      { quote: "Advocacy helps us connect what we are seeing on the ground to the bigger systems conversation.", name: "Belinda K.", role: "Programme team member", avatar: "/images/people/Belinda.jpg" },
      { quote: "The strongest voice in these conversations is one that combines care, evidence, and credibility.", name: "Danielle F.", role: "Partner representative", avatar: "/images/people/danielle.jpg" },
    ],
    partners: [
      { name: "International Development", description: "A natural route for partners seeking credible, locally grounded programme insight and evidence.", href: "/partner-with-us/international-development" },
      { name: "Government", description: "Public collaboration can help translate youth digital inclusion priorities into more durable support frameworks.", href: "/partner-with-us/government" },
    ],
    faqs: [
      { question: "Is advocacy separate from programme work?", answer: "It is connected. Advocacy grows out of what ITFY sees through programme delivery and translates that into broader influence." },
      { question: "What kinds of issues does this work focus on?", answer: "The strongest themes include access, inclusion, employability, opportunity gaps, and the conditions needed for young people to thrive in tech." },
      { question: "How can institutions engage with this route?", answer: "Through dialogue, partnership, events, collaborative content, or contact around a shared area of interest." },
    ],
    related: [
      { href: "/partner-with-us/international-development", eyebrow: "Partner", title: "International Development", description: "Explore donor- and agency-facing collaboration routes." },
      { href: "/our-impact/sdgs", eyebrow: "SDGs", title: "UN SDGs", description: "See how programme themes connect to wider development priorities." },
      { href: "/news-and-updates/blogs", eyebrow: "Read", title: "Blogs", description: "Follow longer-form reflections and thought leadership." },
    ],
  }),
  buildInitiativePage({
    slug: "tech-clubs",
    eyebrow: "School network",
    title: "Tech Clubs",
    description:
      "School-based communities that give young people recurring exposure to digital skills and peer learning.",
    intro:
      "Tech Clubs create consistency. Instead of one-off exposure, they give students a place to keep practicing, collaborating, and seeing technology as something they can grow into over time.",
    tagline:
      "A recurring school-based learning space where curiosity can turn into confidence.",
    heroImage: "/images/randomPictures/studentgroupguys.jpg",
    overviewImage: "/images/randomPictures/studentsblueclothing.jpg",
    stats: [
      { value: "18", label: "School clubs", description: "Active or seeded club routes within the ITFY ecosystem." },
      { value: "800+", label: "Students reached", description: "Young people exposed to recurring peer-led or facilitator-led engagement." },
      { value: "32", label: "Club sessions", description: "Structured practice moments across school terms." },
      { value: "6", label: "Competition entries", description: "Students progressing into more visible challenge formats." },
    ],
    mission:
      "Tech Clubs are designed to create recurring, low-barrier digital learning communities inside schools so students can build familiarity, confidence, and peer momentum over time.",
    objectives: [
      "Turn one-time exposure into recurring engagement and practical habit-building.",
      "Make digital learning feel social, local, and accessible inside school contexts.",
      "Identify learners who may be ready for deeper training or challenge participation.",
      "Support schools with a practical structure for sustained digital-skills engagement.",
    ],
    howItWorks: [
      { number: "01", title: "Start", description: "ITFY works with schools to seed a club model that fits the local context and student demand.", icon: "🏫" },
      { number: "02", title: "Gather", description: "Students meet regularly for guided activities, peer learning, exposure, and practice.", icon: "👥" },
      { number: "03", title: "Stretch", description: "Projects, mini challenges, and presentations help learners deepen confidence over time.", icon: "🧗" },
      { number: "04", title: "Progress", description: "Promising students can move into outreach events, challenges, or longer-form training pathways.", icon: "➡️" },
    ],
    impactStats: [
      { value: "260+", label: "Active club members", description: "Students participating beyond one-off exposure moments.", icon: "🧑‍🤝‍🧑" },
      { value: "12", label: "School partners", description: "Institutions helping sustain recurring engagement environments.", icon: "🏫" },
      { value: "48", label: "Peer-led activities", description: "Moments where student confidence becomes visible through action.", icon: "🙌" },
      { value: "21", label: "Referral transitions", description: "Learners moving into deeper ITFY pathways.", icon: "🚪" },
    ],
    audience: {
      summary:
        "Tech Clubs are for students who benefit from regular exposure and community, and for schools that want a more sustainable digital-skills rhythm than isolated events can provide.",
      groups: [
        "Secondary school students who want consistent exposure to digital learning.",
        "Schools seeking a structured but accessible club format.",
        "Learners who may later progress into challenges, outreach leadership, or formal training.",
      ],
      eligibility: [
        "Club participation is usually linked to partner schools or school-based activations.",
        "Students do not need prior technical experience to begin participating.",
        "The strongest fit is for schools ready to support recurring engagement, not just one-time events.",
      ],
    },
    gallery: [
      { src: "/images/randomPictures/studentgroupguys.jpg", alt: "Students working together in a school-based tech club session." },
      { src: "/images/randomPictures/studentsblueclothing.jpg", alt: "Club participants gathered for recurring digital learning activities." },
      { src: "/images/randomPictures/groupworkstudents.jpg", alt: "Learners collaborating on a practical classroom challenge." },
      { src: "/images/randomPictures/studentpresentin.jpg", alt: "Students sharing what they have learned with peers." },
    ],
    testimonials: [
      { quote: "The club gave us somewhere to keep going after the first workshop. That consistency changed everything.", name: "Emmanuel D.", role: "Tech Club member", avatar: "/images/people/emmanuel.jpg" },
      { quote: "What students need most is repetition and confidence. Clubs create both in a way one-off sessions cannot.", name: "Mr. Mensah", role: "School ICT lead", avatar: "/images/people/mensah.jpg" },
      { quote: "Students start by attending, but the magic happens when they begin leading and teaching each other.", name: "Amoako T.", role: "Club facilitator", avatar: "/images/people/amoako.jpg" },
    ],
    partners: [
      { name: "Educational Institutions", description: "School partnerships are the backbone of making the club model sustainable and visible.", href: "/partner-with-us/educational" },
      { name: "Corporate Training", description: "There is room for future staff-volunteering and mentorship support tied to school-based club activity.", href: "/for-organisations/staff-volunteering" },
    ],
    faqs: [
      { question: "How is a tech club different from a workshop?", answer: "A workshop is often a single moment. A club creates continuity, peer learning, and practice over time." },
      { question: "Can schools request support to start a club?", answer: "Yes. The educational institutions and contact routes are the right place to begin that conversation." },
      { question: "Do club members move into other ITFY programmes?", answer: "Yes. Clubs can become a valuable feeder route into challenges, outreach leadership, and deeper training pathways." },
    ],
    related: [
      { href: "/partner-with-us/educational", eyebrow: "Partner", title: "Educational Institutions", description: "Explore how schools can collaborate on club-based digital learning." },
      { href: "/what-we-do/code-impact-challenge", eyebrow: "Next step", title: "Code Impact Challenge", description: "See where club learners can stretch into more applied building work." },
      { href: "/apply-for-training/who-can-apply", eyebrow: "Apply", title: "Who Can Apply", description: "Understand the training routes available for learners ready to go deeper." },
    ],
  }),
];

export const organisationPages: SitePage[] = [
  {
    slug: "corporate-training",
    eyebrow: "For organisations",
    title: "Corporate Training",
    description: "Practical digital skills training for teams that need to move faster and work smarter.",
    intro: "We design short, focused programmes for companies that want their people to gain real skills in web development, data, digital tools, or product thinking — delivered in Accra with projects that matter to your context.",
    stats: heroStats,
    sections: [
      {
        title: "What teams actually learn",
        body: "Sessions are hands-on. Participants ship small projects, present their work, and leave with skills they can use the next week. We adapt the focus to your industry and team size.",
      },
      {
        title: "Formats that fit real schedules",
        body: "Choose from multi-week cohorts, intensive bootcamps, or targeted workshops. We handle facilitation, materials, and progress tracking so your internal team can focus on outcomes.",
      },
    ],
    ctas: [
      { label: "Request a training brief", href: "/contact" },
      { label: "See sample curricula", href: "/what-we-do" },
    ],
    related: [
      { href: "/for-organisations/sponsorships", eyebrow: "Support", title: "Sponsorships", description: "Fund scholarships or full cohorts for young people while building your brand." },
      { href: "/for-organisations/hire-graduates", eyebrow: "Talent", title: "Hire Our Graduates", description: "Meet learners who have already built portfolios and worked on real projects." },
    ],
  },
  {
    slug: "sponsorships",
    eyebrow: "For organisations",
    title: "Sponsorships",
    description: "Fund training access, devices, and pathways for young people who are ready to build.",
    intro: "Your sponsorship directly removes cost barriers for learners. Every sponsored place covers tuition, learning materials, and wraparound support so more young Ghanaians can complete the programme and move into work or enterprise.",
    stats: heroStats,
    sections: [
      {
        title: "Where sponsorship goes",
        body: "Tuition waivers for learners who cannot afford fees. Devices and data support. Mentorship coordination. Career transition support after graduation. You choose the focus or let us match you to the highest-need cohort.",
      },
      {
        title: "Recognition that feels right",
        body: "We credit sponsors in cohort communications, at graduation, and in impact reporting. We can also create private updates for your team or CSR reporting.",
      },
    ],
    ctas: [
      { label: "Sponsor Cohort 7", href: "/donate" },
      { label: "Talk to the team", href: "/contact" },
    ],
    related: [
      { href: "/our-impact/reports", eyebrow: "Proof", title: "See the Impact", description: "Read how past cohorts have translated support into real outcomes." },
      { href: "/for-organisations/hire-graduates", eyebrow: "Talent", title: "Hire Our Graduates", description: "Connect directly with the young people your sponsorship helped train." },
    ],
  },
  {
    slug: "hire-graduates",
    eyebrow: "For organisations",
    title: "Hire Our Graduates",
    description: "Meet young people who have built real projects, worked in teams, and proved they can deliver.",
    intro: "Our graduates leave with portfolios, presentation experience, and a track record of completing a demanding 12-week programme. Many are ready for junior roles, internships, or freelance work from day one.",
    stats: heroStats,
    sections: [
      {
        title: "What makes them different",
        body: "They have shipped projects under time pressure. They have presented their thinking to mentors and peers. They have worked in mixed teams. They know how to learn fast because that is what the programme demanded.",
      },
      {
        title: "How to connect",
        body: "Share a role brief with us. We will introduce you to matched graduates, help you run a small project test, or set up a short internship window. No bloated processes — just direct access to people who are ready to work.",
      },
    ],
    ctas: [
      { label: "Share a role or brief", href: "/contact" },
      { label: "See recent graduate work", href: "/our-impact/testimonials" },
    ],
    related: [
      { href: "/for-organisations/corporate-training", eyebrow: "Train", title: "Corporate Training", description: "Build internal capability while you evaluate future hires." },
      { href: "/partner-with-us/technology", eyebrow: "Partner", title: "Technology Companies", description: "Deeper collaboration routes for companies that want ongoing talent pipelines." },
    ],
  },
  {
    slug: "staff-volunteering",
    eyebrow: "For organisations",
    title: "Staff Volunteering",
    description: "Give your team structured ways to mentor, review work, and contribute real skills to young learners.",
    intro: "Many professionals want to give back but do not know where to start. We create clear, time-bounded roles — project reviewers, mentor sessions, career talks, mock interviews — so your staff can contribute without guesswork.",
    stats: heroStats,
    sections: [
      {
        title: "Roles that actually help",
        body: "One-off talks. Multi-week mentorship. Portfolio reviews. Mock interviews. Facilitation support during challenge weeks. We match the ask to the time your team can realistically give.",
      },
      {
        title: "What volunteers say",
        body: "People who volunteer with us often tell us it sharpened their own communication and leadership skills. It is not charity work — it is two-way professional development.",
      },
    ],
    ctas: [
      { label: "Propose a volunteering window", href: "/contact" },
      { label: "See current opportunities", href: "/partner-with-us" },
    ],
    related: [
      { href: "/for-organisations/hire-graduates", eyebrow: "Talent", title: "Hire Our Graduates", description: "Turn volunteering relationships into hiring pipelines." },
      { href: "/partner-with-us/technology", eyebrow: "Partner", title: "Technology Companies", description: "Structure a longer-term skills partnership." },
    ],
  },
];

export const partnershipPages: SitePage[] = [
  {
    slug: "educational",
    eyebrow: "Partnership track",
    title: "Educational Institutions",
    description: "Work with schools, universities, and learning communities to bring consistent digital skills access to students.",
    intro: "Schools and tertiary institutions are some of our strongest partners. We help them run tech clubs, host outreach, refer students into training, and create recurring pathways so young people do not just get one exposure — they get a route.",
    stats: heroStats,
    sections: [
      {
        title: "How schools and universities work with us",
        body: "We co-design club programmes, run teacher-facilitator training, bring challenge formats onto campus, and create clear referral routes into the academy and Girls in Tech. Partners choose the depth that fits their calendar and capacity.",
      },
      {
        title: "What partners gain",
        body: "Students get real, recurring practice. Teachers get support and visibility into industry expectations. Institutions strengthen their digital offering without building everything from scratch. We handle facilitation, materials, and measurement.",
      },
    ],
    ctas: [
      { label: "Start a school partnership", href: "/contact" },
      { label: "See Tech Clubs in action", href: "/what-we-do/tech-clubs" },
    ],
    related: [
      { href: "/what-we-do/tech-clubs", eyebrow: "Programme", title: "Tech Clubs", description: "Recurring school-based clubs that turn one-off interest into sustained practice." },
      { href: "/what-we-do/community-outreach", eyebrow: "Outreach", title: "Community Outreach", description: "First-contact activations that feed into deeper school partnerships." },
    ],
  },
  {
    slug: "government",
    eyebrow: "Partnership track",
    title: "Government",
    description: "Collaborate on scalable youth digital skills and inclusion programmes across regions and institutions.",
    intro: "Government agencies and public bodies can work with us to expand proven models — tech clubs in public schools, regional outreach, challenge programmes, and transition support — with the accountability and documentation that public programmes require.",
    stats: heroStats,
    sections: [
      {
        title: "Where public collaboration adds value",
        body: "We bring delivery experience, curriculum that has been tested with thousands of learners, and a track record of reaching young women and underserved communities. Partners bring scale, policy alignment, and reach into public systems.",
      },
      {
        title: "What we can deliver together",
        body: "Pilot programmes that can be evaluated and expanded. Regional rollouts with local partners. Data and stories that show real outcomes. Clear models for teacher support and student progression.",
      },
    ],
    ctas: [
      { label: "Explore a pilot or collaboration", href: "/contact" },
      { label: "See our reach and outcomes", href: "/our-impact/reports" },
    ],
    related: [
      { href: "/partner-with-us/international-development", eyebrow: "Funders", title: "International Development", description: "Many government-aligned programmes are co-funded with development partners." },
      { href: "/what-we-do/rural-tech-connect", eyebrow: "Access", title: "Rural Tech Connect", description: "Geographic inclusion work that often needs public sector coordination." },
    ],
  },
  {
    slug: "ngo-foundations",
    eyebrow: "Partnership track",
    title: "NGOs & Foundations",
    description: "Mission-aligned partnerships for programme delivery, scholarships, and ecosystem building.",
    intro: "Local and international NGOs and foundations partner with us because we deliver at the last mile — with young people who are often missed by mainstream programmes — and we can show the numbers and the stories.",
    stats: heroStats,
    sections: [
      {
        title: "Partnership models that work",
        body: "Co-funded cohorts. Scholarship programmes for girls or rural learners. Joint challenge or entrepreneurship initiatives. Capacity support where our delivery model complements your existing work. We are comfortable being a strong implementing partner or a visible co-brand.",
      },
      {
        title: "Proof you can stand behind",
        body: "3,000+ youth trained. 40% female participation. 85% of graduates in work, learning, or building. Clear cohort reporting, participant stories, and financial transparency that meets funder expectations.",
      },
    ],
    ctas: [
      { label: "Discuss a partnership", href: "/contact" },
      { label: "Review our impact data", href: "/our-impact/reports" },
    ],
    related: [
      { href: "/partner-with-us/international-development", eyebrow: "Scale", title: "International Development", description: "Many foundation partners work through or alongside development agencies." },
      { href: "/for-organisations/sponsorships", eyebrow: "Support", title: "Sponsorships", description: "A direct route for foundations that want to fund learner places at scale." },
    ],
  },
  {
    slug: "international-development",
    eyebrow: "Partnership track",
    title: "International Development",
    description: "Work with agencies and funders who need credible, locally grounded delivery on youth, skills, and digital inclusion.",
    intro: "We are a Ghanaian organisation with deep community roots and the operational discipline that international partners need. We have worked with Google.org, UNICEF, GIZ, Mastercard Foundation, USAID, and others because we deliver, we measure, and we tell the story honestly.",
    stats: heroStats,
    sections: [
      {
        title: "What development partners value",
        body: "Clear theory of change. Strong gender and inclusion practice. Geographic reach beyond Accra. Real participant data and stories. Reliable reporting and financial stewardship. A partner that can represent the work credibly in-country and in donor conversations.",
      },
      {
        title: "How we align with broader goals",
        body: "Our programmes map directly to skills development, youth employment, gender equity, and digital inclusion priorities. We can speak to SDG alignment and contribute grounded evidence to larger portfolios.",
      },
    ],
    ctas: [
      { label: "Start a conversation", href: "/contact" },
      { label: "See SDG alignment", href: "/our-impact/sdgs" },
    ],
    related: [
      { href: "/partner-with-us/ngo-foundations", eyebrow: "Ecosystem", title: "NGOs & Foundations", description: "Many international programmes are delivered through local NGO and foundation partnerships." },
      { href: "/our-impact/reports", eyebrow: "Evidence", title: "Impact Reports", description: "Review the data and stories that support larger programme reporting." },
    ],
  },
  {
    slug: "technology",
    eyebrow: "Partnership track",
    title: "Technology Companies",
    description: "Sponsor, mentor, volunteer, and hire through a partner that already produces job-ready young talent.",
    intro: "Technology companies in Ghana and beyond work with us for three reasons: they want to give back in a way that actually builds the pipeline; they need early talent that has already shipped projects; and they want structured ways for their own teams to engage without creating new programmes from scratch.",
    stats: heroStats,
    sections: [
      {
        title: "Ways to engage",
        body: "Sponsor full cohorts or targeted scholarships. Run staff volunteering and mentorship programmes. Host challenge briefs or innovation days. Hire directly from our graduate pool. Co-design corporate training that also creates social impact.",
      },
      {
        title: "Why it works for tech teams",
        body: "You get visibility into emerging talent before the market does. Your people get meaningful engagement that builds their own leadership and communication skills. The work is structured, time-bounded, and easy to report on internally.",
      },
    ],
    ctas: [
      { label: "Explore a company partnership", href: "/contact" },
      { label: "Hire our graduates", href: "/for-organisations/hire-graduates" },
    ],
    related: [
      { href: "/for-organisations/corporate-training", eyebrow: "Train", title: "Corporate Training", description: "Practical skills programmes for your own teams while supporting the mission." },
      { href: "/for-organisations/staff-volunteering", eyebrow: "Engage", title: "Staff Volunteering", description: "Structured roles for your engineers, designers, and leaders to contribute." },
    ],
  },
];

// ─── Hub pages (rich content replacing buildHubPage scaffolds) ─────────────────

export const whoWeAreHub: SitePage = {
  slug: "who-we-are",
  eyebrow: "About ITFY Ghana",
  title: "Who We Are",
  description: "A Ghanaian organisation building digital skills, confidence, and pathways for young people — especially young women and those in underserved communities.",
  intro: "We run cohort-based training, school clubs, outreach, and entrepreneurship support that turns curiosity into careers. 3,000+ youth trained. 85% of graduates in work, further study, or building within six months. We work with schools, companies, and development partners who want measurable outcomes, not just activity.",
  stats: heroStats,
  sections: [
    {
      title: "What drives us",
      body: "Young people in Ghana have ambition and talent. What they often lack is consistent access to training, mentorship, devices, and a community that believes they belong in tech. We exist to close that gap with programmes that are practical, recurring, and honest about outcomes.",
    },
    {
      title: "How we work",
      body: "Everything we run is cohort-based or club-based so learners get repetition, peer support, and real projects. We measure progression, not just attendance. We publish impact data and stories because partners and participants deserve transparency.",
    },
  ],
  ctas: [
    { label: "Meet the team", href: "/who-we-are/team" },
    { label: "See our partners", href: "/who-we-are/partners" },
  ],
  related: [
    { href: "/who-we-are/team", eyebrow: "People", title: "Our Team", description: "The facilitators, mentors, and operations team behind the programmes." },
    { href: "/who-we-are/partners", eyebrow: "Credibility", title: "Our Partners", description: "Google.org, UNICEF, GIZ, Mastercard Foundation and others who trust us with delivery." },
    { href: "/who-we-are/careers", eyebrow: "Join", title: "Join Our Team", description: "Roles, volunteering, and ways to contribute your skills to the mission." },
  ],
};

export const applyForTrainingHub: SitePage = {
  slug: "apply-for-training",
  eyebrow: "Learner pathway",
  title: "Apply for Training",
  description: "Cohort-based digital skills programmes in Accra. 12 weeks. Real projects. Clear progression into work or enterprise.",
  intro: "Our training is not a lecture series. You learn by building, presenting, and iterating with mentors who have shipped products. Cohorts run twice a year. Scholarships and device support are available for those who need them. 85% of graduates are in work, learning, or building within six months.",
  stats: heroStats,
  sections: [
    {
      title: "Who this is for",
      body: "Young Ghanaians aged 15–30 who are ready to commit 12 weeks of focused learning. No prior coding experience is required for the beginner tracks. We especially encourage young women and learners from communities with limited tech access.",
    },
    {
      title: "What you will leave with",
      body: "A portfolio of real projects. Presentation and collaboration experience. Career readiness support. Connections to mentors and hiring partners. A community that continues after the cohort ends.",
    },
  ],
  ctas: [
    { label: "Browse current courses", href: "/apply-for-training/courses" },
    { label: "Check if you can apply", href: "/apply-for-training/who-can-apply" },
  ],
  related: [
    { href: "/apply-for-training/who-can-apply", eyebrow: "Eligibility", title: "Who Can Apply", description: "Age, commitment, and background guidance for prospective learners." },
    { href: "/apply-for-training/how-it-works", eyebrow: "Process", title: "How It Works", description: "From application to onboarding and what happens during the 12 weeks." },
    { href: "/apply-for-training/courses", eyebrow: "Programmes", title: "Browse Courses", description: "Youth Tech Academy, Girls in Tech, and other current offerings." },
  ],
};

export const newsAndUpdatesHub: SitePage = {
  slug: "news-and-updates",
  eyebrow: "Stories & updates",
  title: "News & Updates",
  description: "Programme announcements, graduate stories, and reflections on building digital opportunity in Ghana.",
  intro: "We share what is actually happening — cohort launches, scholarship campaigns, new school partnerships, graduate wins, and honest reflections on what is working and what we are still learning.",
  stats: heroStats,
  sections: [
    {
      title: "What you will find here",
      body: "News items cover time-sensitive updates: application windows, graduation dates, new partnerships, and campaign progress. Blogs are longer-form pieces on programme design, gender inclusion, rural access, and the realities of running skills programmes in Ghana.",
    },
  ],
  ctas: [
    { label: "Read the latest news", href: "/news-and-updates/news" },
    { label: "Explore our thinking", href: "/news-and-updates/blogs" },
  ],
  related: [
    { href: "/news-and-updates/news", eyebrow: "Updates", title: "News", description: "Cohort openings, events, partnerships, and operational announcements." },
    { href: "/news-and-updates/blogs", eyebrow: "Reflections", title: "Blogs", description: "Deeper writing on how we design programmes and why certain choices matter." },
    { href: "/our-impact/testimonials", eyebrow: "Voices", title: "Graduate Stories", description: "Real outcomes told by the young people who lived them." },
  ],
};

export const ourImpactHub: SitePage = {
  slug: "our-impact",
  eyebrow: "Proof & transparency",
  title: "Our Impact",
  description: "Numbers, stories, and alignment with national and global development goals.",
  intro: "We track progression, not just participation. 3,000+ youth trained. 40% female. 85% of graduates in work, further study, or enterprise within six months. Here is the data and the human stories behind it.",
  stats: heroStats,
  sections: [
    {
      title: "How we measure what matters",
      body: "We follow learners after they leave. We record employment, further education, and business starts at 3 months and 6 months. We also track gender balance, geographic spread, and partner feedback. Reports are published so you can see the real picture.",
    },
    {
      title: "Why transparency matters",
      body: "Partners, donors, schools, and families deserve to know what actually happens to the young people who train with us. We do not inflate numbers. We report what we can verify and we are honest about where we still need to improve.",
    },
  ],
  ctas: [
    { label: "Read the latest reports", href: "/our-impact/reports" },
    { label: "See graduate stories", href: "/our-impact/testimonials" },
  ],
  related: [
    { href: "/our-impact/reports", eyebrow: "Data", title: "Impact Reports", description: "Cohort outcomes, progression stats, and downloadable summaries." },
    { href: "/our-impact/testimonials", eyebrow: "Voices", title: "Testimonials", description: "Stories from graduates, school partners, and mentors." },
    { href: "/our-impact/sdgs", eyebrow: "Alignment", title: "UN SDGs", description: "How our work connects to global development priorities." },
  ],
};

// ─── Additional rich hubs (replacing remaining buildHubPage scaffolds) ─────────

export const forOrganisationsHub: SitePage = {
  slug: "for-organisations",
  eyebrow: "Collaborate",
  title: "For Organisations",
  description: "Corporate training, sponsorship, hiring pipelines, and staff volunteering that deliver measurable social impact.",
  intro: "Work with us to train your teams, sponsor young talent, hire graduates who have already shipped projects, or give your staff structured ways to mentor. 3,000+ youth trained. 85% progression rate. Partners include Google.org, UNICEF, GIZ, Mastercard Foundation, and Microsoft.",
  stats: heroStats,
  sections: [
    {
      title: "Four clear routes",
      body: "Corporate training builds internal capability. Sponsorships fund learner places with clear reporting. Hiring gives you direct access to job-ready graduates. Staff volunteering creates meaningful engagement for your people while supporting the mission.",
    },
    {
      title: "Why organisations choose ITFY",
      body: "You get structured programmes, verified outcomes, and Ghana-grounded delivery. No vague promises — we track progression and we publish the numbers. Your support creates visible impact and a stronger local talent pipeline.",
    },
  ],
  ctas: [
    { label: "Explore the routes", href: "/for-organisations/corporate-training" },
    { label: "Talk to the team", href: "/contact" },
  ],
  related: [
    { href: "/for-organisations/corporate-training", eyebrow: "Train", title: "Corporate Training", description: "Practical digital skills programmes for your staff while supporting young learners." },
    { href: "/for-organisations/sponsorships", eyebrow: "Fund", title: "Sponsorships", description: "Fund full cohorts or targeted scholarships with transparent reporting." },
    { href: "/for-organisations/hire-graduates", eyebrow: "Hire", title: "Hire Our Graduates", description: "Access young talent who have built portfolios and proved themselves in real projects." },
    { href: "/for-organisations/staff-volunteering", eyebrow: "Engage", title: "Staff Volunteering", description: "Structured mentoring, review, and career support roles for your team." },
  ],
};

export const partnerWithUsHub: SitePage = {
  slug: "partner-with-us",
  eyebrow: "Partnership tracks",
  title: "Partner With Us",
  description: "Five partnership routes for schools, government, NGOs, development agencies, and technology companies.",
  intro: "We work with educational institutions, public bodies, foundations, international development partners, and tech companies who want credible, locally grounded delivery on youth skills and digital inclusion. 8,500+ students reached through school and community partnerships.",
  stats: heroStats,
  sections: [
    {
      title: "Partnerships that scale",
      body: "Every track is designed for a different kind of partner. Schools get recurring clubs and referral routes. Government gets scalable models with documentation. NGOs and foundations get last-mile delivery with proof. Development agencies get in-country credibility and SDG alignment. Tech companies get talent pipelines and structured engagement.",
    },
  ],
  ctas: [
    { label: "Find your route", href: "/partner-with-us/educational" },
    { label: "Start a conversation", href: "/contact" },
  ],
  related: [
    { href: "/partner-with-us/educational", eyebrow: "Schools", title: "Educational Institutions", description: "Tech clubs, outreach, and clear pathways from classroom to training." },
    { href: "/partner-with-us/government", eyebrow: "Public", title: "Government", description: "Regional and national programmes with accountability and measurable reach." },
    { href: "/partner-with-us/ngo-foundations", eyebrow: "Mission", title: "NGOs & Foundations", description: "Co-funded cohorts, scholarships, and ecosystem partnerships." },
    { href: "/partner-with-us/international-development", eyebrow: "Scale", title: "International Development", description: "Locally rooted delivery for youth, skills, and inclusion portfolios." },
    { href: "/partner-with-us/technology", eyebrow: "Industry", title: "Technology Companies", description: "Sponsor, mentor, volunteer, and hire through a partner that produces ready talent." },
  ],
};

export const teamHub: SitePage = {
  slug: "team",
  eyebrow: "Our people",
  title: "Our Team",
  description: "Facilitators, mentors, and operations staff who run cohort training, school clubs, and partnerships across Ghana.",
  intro: "We are practitioners first — people who have built products, taught in classrooms, and worked with young people in real Ghanaian contexts. The team combines technical depth, facilitation experience, and operational discipline.",
  stats: heroStats,
  sections: [
    {
      title: "What the team actually does",
      body: "We design and deliver 12-week cohorts. We train and support school facilitators. We run outreach that turns first exposure into sustained interest. We manage partnerships, track outcomes, and publish honest reports. Every role exists to make the learner journey work.",
    },
    {
      title: "How we stay grounded",
      body: "Most of us are Ghanaian or long-term residents. We hire alumni where possible. We spend time in schools and communities, not just offices. We measure what happens to learners after they leave, not just what happens in the room.",
    },
  ],
  ctas: [
    { label: "See open roles", href: "/who-we-are/careers" },
    { label: "Partner with the team", href: "/contact" },
  ],
  related: [
    { href: "/who-we-are/partners", eyebrow: "Credibility", title: "Our Partners", description: "The organisations that trust us to deliver at scale." },
    { href: "/who-we-are/careers", eyebrow: "Join", title: "Join Our Team", description: "Roles, volunteering, and ways to contribute your skills." },
  ],
};

export const partnersHub: SitePage = {
  slug: "partners",
  eyebrow: "Credibility",
  title: "Our Partners",
  description: "Google.org, UNICEF Ghana, GIZ, Mastercard Foundation, Vodafone Ghana, Microsoft, Tony Elumelu Foundation, and USAID — organisations that have chosen ITFY for delivery.",
  intro: "We do not list logos for decoration. Every partner on this page has worked with us on real programmes — funded cohorts, co-designed clubs, sponsored learners, or hired graduates. They return because we deliver numbers and stories they can stand behind.",
  stats: heroStats,
  sections: [
    {
      title: "What partners get",
      body: "Clear proposals. Reliable delivery. Cohort-level reporting. Participant stories with consent. Financial transparency. A Ghanaian organisation that can represent the work credibly in-country and in donor conversations.",
    },
    {
      title: "Partnership principles",
      body: "We say yes to work we can actually do well. We report honestly, including what did not go to plan. We protect learner dignity in all storytelling. We are comfortable being an implementing partner or a visible co-brand, depending on what serves the mission.",
    },
  ],
  ctas: [
    { label: "Explore partnership routes", href: "/partner-with-us" },
    { label: "Talk to the team", href: "/contact" },
  ],
  related: [
    { href: "/partner-with-us", eyebrow: "Routes", title: "Partner With Us", description: "Five tracks for schools, government, NGOs, development, and tech companies." },
    { href: "/our-impact/reports", eyebrow: "Proof", title: "Impact Reports", description: "The data and stories that support every partnership." },
  ],
};

export const careersHub: SitePage = {
  slug: "careers",
  eyebrow: "Join the mission",
  title: "Join Our Team",
  description: "Roles, volunteering, and contribution pathways for people who want to build digital opportunity in Ghana.",
  intro: "We hire facilitators, programme coordinators, partnership leads, and operations staff who are serious about outcomes. We also create structured volunteering and internship routes for professionals and students who want to contribute without a full-time role.",
  stats: heroStats,
  sections: [
    {
      title: "What we look for",
      body: "People who can teach or mentor at a high standard. People who can run operations without drama. People who treat young Ghanaians with respect and high expectations at the same time. Technical skill matters, but character and consistency matter more.",
    },
    {
      title: "How to engage",
      body: "Full-time and contract roles are posted when open. Volunteering windows (mentorship, portfolio review, career talks) can be proposed anytime. Alumni often return as facilitators or mentors — that pipeline is real.",
    },
  ],
  ctas: [
    { label: "See current openings", href: "/contact" },
    { label: "Propose a volunteering window", href: "/contact" },
  ],
  related: [
    { href: "/who-we-are/team", eyebrow: "People", title: "Our Team", description: "Meet the facilitators and operations staff already on the ground." },
    { href: "/for-organisations/staff-volunteering", eyebrow: "Companies", title: "Staff Volunteering", description: "Structured ways for company teams to contribute." },
  ],
};

export const testimonialsHub: SitePage = {
  slug: "testimonials",
  eyebrow: "Real voices",
  title: "Testimonials",
  description: "Stories from graduates, school partners, and mentors who have lived the programmes.",
  intro: "Numbers tell part of the story. The rest comes from the young people who trained, the teachers who hosted clubs, and the professionals who mentored. These are the voices that keep us honest about what works.",
  stats: heroStats,
  sections: [
    {
      title: "How we collect stories",
      body: "We interview graduates at 3 and 6 months. We ask school partners for feedback after each term. We capture mentor reflections during and after cohorts. All stories are shared with consent and we are careful not to over-claim.",
    },
  ],
  ctas: [
    { label: "Read impact reports", href: "/our-impact/reports" },
    { label: "See the latest news", href: "/news-and-updates/news" },
  ],
  related: [
    { href: "/our-impact/reports", eyebrow: "Data", title: "Impact Reports", description: "Progression stats and cohort outcomes that sit alongside the stories." },
    { href: "/news-and-updates/blogs", eyebrow: "Reflections", title: "Blogs", description: "Deeper writing on programme design and what we are learning." },
  ],
};

export const sdgsHub: SitePage = {
  slug: "sdgs",
  eyebrow: "Global alignment",
  title: "UN SDGs",
  description: "How ITFY's work on youth skills, gender inclusion, and digital access connects to the Sustainable Development Goals.",
  intro: "We are a Ghanaian organisation first, but our programmes map directly to global development priorities. Skills development, youth employment, gender equity, and digital inclusion are not abstract goals — they are the daily work.",
  stats: heroStats,
  sections: [
    {
      title: "Primary alignments",
      body: "SDG 4 (Quality Education): cohort training, tech clubs, and teacher support that give young people practical digital skills. SDG 5 (Gender Equality): Girls in Tech and deliberate 40% female participation targets. SDG 8 (Decent Work): 85% progression into work, study, or enterprise within six months.",
    },
    {
      title: "Secondary alignments",
      body: "SDG 9 (Industry & Innovation): entrepreneurship support and challenge-based learning. SDG 10 (Reduced Inequalities): rural outreach and scholarships that reach learners who would otherwise be excluded. SDG 17 (Partnerships): every major programme is delivered with schools, companies, or development partners.",
    },
  ],
  ctas: [
    { label: "See impact data", href: "/our-impact/reports" },
    { label: "Partner on SDG-aligned work", href: "/partner-with-us/international-development" },
  ],
  related: [
    { href: "/partner-with-us/international-development", eyebrow: "Funders", title: "International Development", description: "The partnership track most aligned with SDG portfolios." },
    { href: "/our-impact/reports", eyebrow: "Evidence", title: "Impact Reports", description: "Data and stories that support SDG reporting." },
  ],
};

export const whoCanApplyHub: SitePage = {
  slug: "who-can-apply",
  eyebrow: "Eligibility",
  title: "Who Can Apply",
  description: "Clear guidance on age, commitment, background, and what makes a strong applicant for ITFY training.",
  intro: "We are looking for young Ghanaians who are ready to commit 12 weeks of focused learning. No prior coding experience is required for beginner tracks. We especially welcome young women and learners from communities with limited tech access.",
  stats: heroStats,
  sections: [
    {
      title: "Basic requirements",
      body: "Age 15–30. Ability to attend sessions in Accra for the full cohort duration. Basic literacy and numeracy. A willingness to learn in public, present work, and iterate based on feedback. Device access is helpful but not a blocker — scholarships and device support exist for those who need them.",
    },
    {
      title: "What makes an application strong",
      body: "Clear motivation. Evidence of persistence (school, work, side projects, community roles). Willingness to work in teams. For Girls in Tech, a genuine interest in closing the gender gap. We do not require a portfolio for entry-level tracks — we build that during the programme.",
    },
  ],
  ctas: [
    { label: "Browse current courses", href: "/apply-for-training/courses" },
    { label: "See how it works", href: "/apply-for-training/how-it-works" },
  ],
  related: [
    { href: "/apply-for-training/how-it-works", eyebrow: "Process", title: "How It Works", description: "From application to onboarding and what happens during the 12 weeks." },
    { href: "/apply-for-training/courses", eyebrow: "Programmes", title: "Browse Courses", description: "Youth Tech Academy, Girls in Tech, and current offerings." },
  ],
};

export const howItWorksHub: SitePage = {
  slug: "how-it-works",
  eyebrow: "Learner journey",
  title: "How It Works",
  description: "From application to graduation: the steps, expectations, and support that define the ITFY training experience.",
  intro: "Our training is cohort-based and project-driven. You apply, get selected, join a 12-week programme, ship real work, present to mentors, and leave with a portfolio and a next-step plan. Scholarships, devices, and career support are available throughout.",
  stats: heroStats,
  sections: [
    {
      title: "Application to onboarding",
      body: "You submit a short application. We review for motivation and fit. Shortlisted applicants may do a simple task or conversation. Accepted learners receive onboarding materials, scholarship decisions (if applicable), and a clear schedule before the first day.",
    },
    {
      title: "During the cohort",
      body: "Three to four sessions per week. Technical skills + professional skills + project work. Weekly mentor touchpoints. Mid-cohort reviews. Final project presentations. Career readiness sessions in the final weeks. We track attendance and progression because outcomes matter.",
    },
    {
      title: "After graduation",
      body: "3-month and 6-month check-ins. Alumni community access. Job and internship referrals. Entrepreneurship support for those building. We publish cohort outcomes so everyone can see what actually happens next.",
    },
  ],
  ctas: [
    { label: "Check if you can apply", href: "/apply-for-training/who-can-apply" },
    { label: "Apply for the next cohort", href: "/apply-for-training/courses" },
  ],
  related: [
    { href: "/apply-for-training/who-can-apply", eyebrow: "Fit", title: "Who Can Apply", description: "Age, commitment, and background guidance." },
    { href: "/apply-for-training/courses", eyebrow: "Offerings", title: "Browse Courses", description: "Current programmes and application windows." },
  ],
};

export const articles: ArticleSeed[] = [
  {
    slug: "cohort-7-scholarship-campaign",
    category: "news",
    title: "ITFY launches a scholarship campaign for Cohort 7 applicants",
    excerpt: "The new campaign focuses on tuition support, devices, and mentoring so more learners can enter the next intake without cost becoming a blocker.",
    publishedAt: "2026-04-23",
    coverImage: "/images/randomPictures/UXteacher.png",
    readTimeMinutes: 4,
    content: [
      "The Cohort 7 scholarship campaign is designed to remove the barriers that keep talented young people from starting their digital journey.",
      "This phase of fundraising supports tuition waivers, learning devices, and wraparound mentorship for participants who are ready to take the next step.",
      "The campaign also gives partners and donors a clearer way to connect their support directly to learner outcomes.",
    ],
  },
  {
    slug: "community-tech-clubs-expansion",
    category: "news",
    title: "Community tech clubs are expanding into more schools this term",
    excerpt: "A new rollout plan is helping ITFY strengthen recurring access points for students who need more than one-off exposure to technology.",
    publishedAt: "2026-04-21",
    coverImage: "/images/randomPictures/studentsblueclothing.jpg",
    readTimeMinutes: 3,
    content: [
      "The next expansion of school-based tech clubs is focused on consistency, not just reach.",
      "By working with school leaders and local facilitators, the programme is building spaces where students can keep practicing over time.",
      "That recurring engagement is a key part of turning interest into confidence and confidence into pathway decisions.",
    ],
  },
  {
    slug: "cohort-7-now-open",
    category: "news",
    title: "Cohort 7 applications are now open across Accra",
    excerpt: "Young people can apply for the next Youth Tech Academy and Girls in Tech cohorts. Scholarships and device support are available for those who need them.",
    publishedAt: "2026-04-18",
    coverImage: "/images/randomPictures/maingraduationpic.jpg",
    readTimeMinutes: 3,
    content: [
      "Cohort 7 is now accepting applications for the Youth Tech Academy and Girls in Tech programmes.",
      "The 12-week training covers web development, data fundamentals, and professional skills. Every participant ships real projects and presents to mentors.",
      "Scholarship places, device support, and data stipends are available for learners who would otherwise be unable to join.",
    ],
  },
  {
    slug: "why-homepage-clarity-matters",
    category: "blogs",
    title: "Why homepage clarity matters for growing mission-driven teams",
    excerpt: "A stronger homepage sequence makes trust, urgency, and discovery easier for learners, funders, and partners.",
    publishedAt: "2026-04-19",
    coverImage: "/images/randomPictures/mireiotalking.jpg",
    readTimeMinutes: 5,
    content: [
      "For a growing organisation, the homepage has to do more than look polished. It has to guide multiple audiences quickly and clearly.",
      "That is why we give special attention to the opening sequence: announcement, hero, impact proof, and clear next steps.",
      "That stack helps young people, partners, and organisations understand the mission and the pathways available to them in just a few seconds.",
    ],
  },
  {
    slug: "why-partnership-storytelling-builds-trust",
    category: "blogs",
    title: "Why partnership storytelling matters when an organisation is scaling",
    excerpt: "Partners do not just need a donation page. They need evidence, clarity, and a fast way to see where they fit in the mission.",
    publishedAt: "2026-04-17",
    coverImage: "/images/randomPictures/groupworkstudents.jpg",
    readTimeMinutes: 4,
    content: [
      "Good partnership storytelling creates confidence before a meeting ever happens.",
      "It helps potential collaborators understand what the organisation already does well and where support can amplify that work.",
      "That is why we make room for partner-facing proof, clearer calls to action, and better visibility into programme outcomes.",
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
    id: "slide-students",
    eyebrow: "For young Ghanaians",
    heading: "Build the skills. Get the confidence. Shape your future in tech.",
    body: "Cohort-based training in Accra for young people ready to move from curiosity to real digital careers, entrepreneurship, or further study. 85% of graduates are in work, learning, or building within six months.",
    image: "/images/randomPictures/maingraduationpic.jpg",
    overlayFrom: "rgba(10,15,40,0.88)",
    overlayTo: "rgba(10,15,40,0.35)",
    cta: {
      primary:   { label: "Apply for Cohort 7", href: "/apply-for-training/courses" },
      secondary: { label: "See who can apply",  href: "/apply-for-training/who-can-apply" },
    },
  },
  {
    id: "slide-partners",
    eyebrow: "For partners & supporters",
    heading: "Back the next generation of Ghana's digital workforce.",
    body: "3,000+ youth trained. 8,500+ students reached. 40% female participation. Your support funds scholarships, devices, mentorship, and clear pathways into work and enterprise across Ghana.",
    image: "/images/randomPictures/groupworkstudents.jpg",
    overlayFrom: "rgba(5,25,15,0.88)",
    overlayTo: "rgba(5,25,15,0.40)",
    cta: {
      primary:   { label: "Donate to Cohort 7", href: "/donate" },
      secondary: { label: "See our impact",     href: "/our-impact/reports" },
    },
  },
  {
    id: "slide-organisations",
    eyebrow: "For organisations",
    heading: "Train your teams. Sponsor cohorts. Hire ready talent.",
    body: "Partner with IT For Youth Ghana for corporate training, staff volunteering, scholarship sponsorship, or direct access to graduates who have built portfolios and proved themselves in real projects.",
    image: "/images/randomPictures/studentsBackcoding.jpg",
    overlayFrom: "rgba(30,15,5,0.88)",
    overlayTo: "rgba(30,15,5,0.40)",
    cta: {
      primary:   { label: "Work with us",        href: "/for-organisations" },
      secondary: { label: "Hire our graduates",  href: "/for-organisations/hire-graduates" },
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

export const programmeShowcase: ProgrammeShowcaseItem[] = [
  {
    id: "initiative-girls-in-tech",
    eyebrow: "Inclusion pathway",
    title: "Girls in Tech",
    description: "Mentorship, confidence-building, and technical training designed so more young women can lead in Ghana's digital economy.",
    href: "/what-we-do/girls-in-tech",
    image: "/images/randomPictures/group_girls.jpg",
    accent: "#F5A623",
    icon: "👩‍💻",
  },
  {
    id: "initiative-youth-academy",
    eyebrow: "Training pathway",
    title: "Youth Tech Academy",
    description: "Cohort-based digital skills training that moves young people from first steps to job-ready portfolios in 12 focused weeks.",
    href: "/what-we-do/youth-academy",
    image: "/images/randomPictures/studentsBackcoding.jpg",
    accent: "#0C2D5A",
    icon: "💡",
  },
  {
    id: "initiative-entrepreneurship-hub",
    eyebrow: "Venture pathway",
    title: "Entrepreneurship Hub",
    description: "Practical support for young founders turning digital skills into ideas, prototypes, and early ventures that solve local problems.",
    href: "/what-we-do/entrepreneurship-hub",
    image: "/images/randomPictures/studentpresenting.jpg",
    accent: "#157F6B",
    icon: "🚀",
  },
  {
    id: "initiative-code-impact-challenge",
    eyebrow: "Challenge pathway",
    title: "Code Impact Challenge",
    description: "Time-bound, team-based challenges where learners build real solutions to problems that matter in their communities.",
    href: "/what-we-do/code-impact-challenge",
    image: "/images/randomPictures/redstudentgrouplesson.jpg",
    accent: "#C44900",
    icon: "🧠",
  },
  {
    id: "initiative-rural-tech-connect",
    eyebrow: "Access pathway",
    title: "Rural Tech Connect",
    description: "Extending training, devices, and opportunity to young people in communities beyond Accra through local partnerships.",
    href: "/what-we-do/rural-tech-connect",
    image: "/images/randomPictures/children_holding_sign_in_streets.jpg",
    accent: "#2A6F97",
    icon: "🌍",
  },
  {
    id: "initiative-community-outreach",
    eyebrow: "Community pathway",
    title: "Community Outreach",
    description: "School visits, activations, and events that turn first exposure into real interest and clear next steps for thousands of students.",
    href: "/what-we-do/community-outreach",
    image: "/images/randomPictures/studentslistening.jpg",
    accent: "#8B5E34",
    icon: "🤝",
  },
  {
    id: "initiative-advocacy",
    eyebrow: "Influence pathway",
    title: "Advocacy",
    description: "Thought leadership and coalition work that makes youth digital opportunity a visible priority for institutions and policymakers.",
    href: "/what-we-do/advocacy",
    image: "/images/randomPictures/graduationspeaking.jpg",
    accent: "#A63D40",
    icon: "📣",
  },
  {
    id: "initiative-tech-clubs",
    eyebrow: "School pathway",
    title: "Tech Clubs",
    description: "Recurring, school-based clubs that give students consistent practice, peer learning, and a place to grow their skills over time.",
    href: "/what-we-do/tech-clubs",
    image: "/images/randomPictures/studentgroupguys.jpg",
    accent: "#1F7A8C",
    icon: "🏫",
  },
];

export const activeDonationCampaign: DonationCampaignContent = {
  id: "campaign-cohort-7-scholarships",
  eyebrow: "Active campaign",
  headline: "Fund 500 learner scholarships for the next ITFY cohort",
  description:
    "This campaign helps remove cost barriers for ambitious young people who are ready to build careers, businesses, and long-term confidence in tech. Every gift expands access to tuition support, devices, mentorship, and transition-to-work opportunities.",
  image: "/images/randomPictures/UXteacher_opt.jpg",
  currency: "USD",
  goalAmount: 67500,
  raisedAmount: 45230,
  donorCount: 186,
  deadline: "2026-07-31T23:59:59.000Z",
  supportPoints: [
    "Sponsor training access for learners who otherwise could not afford to join.",
    "Grow girls' participation through scholarships, mentoring, and safe learning communities.",
    "Support graduates with career readiness, internships, and entrepreneurship pathways.",
  ],
  primaryCta: { label: "Donate now", href: "/donate" },
  secondaryCta: { label: "Learn how your donation helps", href: "/our-impact/reports" },
  active: true,
};

export const featuredStory: FeaturedStoryContent = {
  id: "story-belinda",
  label: "Graduate story",
  headline: "From zero experience to building products with confidence in six months",
  quote:
    "IT For Youth Ghana gave me structure, community, and the courage to apply for opportunities I used to think were meant for someone else.",
  name: "Belinda A.",
  role: "Frontend Developer",
  programme: "Youth Tech Academy alumna",
  backgroundImage: "/images/randomPictures/UX4.jpg",
  videoUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
  primaryCtaLabel: "Watch her story",
  secondaryCta: { label: "Read more stories", href: "/our-impact/testimonials" },
};

// ─── Testimonials ─────────────────────────────────────────────────────────────

export const testimonials: Testimonial[] = [
  // PLACEHOLDER — replace with real graduate voice
  {
    id: "t1",
    quote:
      "The academy gave me structure I had never had. I went from not knowing what a portfolio was to presenting real projects to mentors. Six months after graduating I started as a junior developer in Accra.",
    name: "Ama Kofi",
    role: "Junior Developer",
    programme: "Youth Tech Academy",
    year: "Cohort 6",
    avatar: "/images/people/Belinda.jpg",
    initials: "AK",
  },
  // PLACEHOLDER — replace with real graduate voice
  {
    id: "t2",
    quote:
      "Before Girls in Tech I was curious but unsure if tech was for someone like me. The mentorship and the cohort made it feel possible. I now work as a UX designer and I mentor the next group of girls coming through.",
    name: "Efua Asante",
    role: "UX Designer",
    programme: "Girls in Tech",
    year: "Cohort 5",
    avatar: "/images/people/elisabeth.jpg",
    initials: "EA",
  },
  // PLACEHOLDER — replace with real graduate voice
  {
    id: "t3",
    quote:
      "We partnered with ITFY to run tech clubs in our school. The consistency of the sessions changed how our students see technology. Several have now joined the academy and one is already interning.",
    name: "Mr. Isaac Mensah",
    role: "Head of ICT",
    programme: "Tech Clubs & Community Outreach",
    year: "School partner 2025",
    avatar: "/images/people/mensah.jpg",
    initials: "IM",
  },
];

// ─── Partners ─────────────────────────────────────────────────────────────────
// Add `logo: "/images/partners/name.svg"` once assets are available.

export const partners: Partner[] = [
  { id: "p1", name: "Google.org", logo: "/images/partnerorga/Download.jpg" },
  { id: "p2", name: "UNICEF Ghana", logo: "/images/partnerorga/Download (1).jpg" },
  { id: "p3", name: "GIZ", logo: "/images/partnerorga/Download (2).jpg" },
  { id: "p4", name: "Mastercard Foundation", logo: "/images/partnerorga/Download (3).jpg" },
  { id: "p5", name: "Vodafone Ghana", logo: "/images/partnerorga/Download (4).jpg" },
  { id: "p6", name: "Microsoft", logo: "/images/partnerorga/Download (5).jpg" },
  { id: "p7", name: "Tony Elumelu Foundation", logo: "/images/partnerorga/Download (6).jpg" },
  { id: "p8", name: "USAID" },
];

export const joinCtaCards: JoinCtaCard[] = [
  {
    id: "join-students",
    eyebrow: "For students",
    title: "Apply for training",
    description: "Check who can apply, browse available courses, and move from interest to enrolment with a clear next step.",
    href: "/apply-for-training",
    buttonLabel: "Start your application",
    icon: "students",
  },
  {
    id: "join-organisations",
    eyebrow: "For organisations",
    title: "Work with us",
    description: "Explore sponsorship, hiring, staff volunteering, or custom training routes designed for mission-aligned organisations.",
    href: "/for-organisations",
    buttonLabel: "Explore organisation pathways",
    icon: "organisations",
  },
  {
    id: "join-volunteer",
    eyebrow: "For volunteers",
    title: "Share your time and skills",
    description: "Mentor, teach, review projects, or support programme delivery where your experience can unlock confidence for learners.",
    href: "/partner-with-us",
    buttonLabel: "See how to get involved",
    icon: "volunteer",
  },
];

export const newsletterSignupContent: NewsletterSignupContent = {
  eyebrow: "Mailing list",
  heading: "Stay close to the work as new cohorts, stories, and opportunities go live",
  description:
    "Join the mailing list for programme openings, impact updates, upcoming events, and stories from the learners and partners shaping the mission.",
  privacyNote:
    "We’ll only send relevant updates, and every email includes a simple unsubscribe link.",
  interest: "homepage",
  active: true,
};

// ─── Events ───────────────────────────────────────────────────────────────────

export const upcomingEvents: EventItem[] = [
  {
    id: "ev1",
    date: "12 Jun 2026",
    month: "Jun",
    day: "12",
    title: "2026 Bootcamp Open Day — Accra",
    location: "ITFY Learning Centre, Accra",
    type: "Info Day",
    href: "/news-and-updates/news",
    featured: true,
  },
  {
    id: "ev2",
    date: "26 Jun 2026",
    month: "Jun",
    day: "26",
    title: "Tech Sisters Mentorship Kickoff",
    location: "Online (Zoom)",
    type: "Webinar",
    href: "/news-and-updates/news",
  },
  {
    id: "ev3",
    date: "18 Jul 2026",
    month: "Jul",
    day: "18",
    title: "Junior Coders Regional Competition",
    location: "Kumasi, Ghana",
    type: "Workshop",
    href: "/news-and-updates/news",
  },
  {
    id: "ev4",
    date: "05 Sep 2026",
    month: "Sep",
    day: "05",
    title: "2026 Cohort Graduation Ceremony",
    location: "National Theatre, Accra",
    type: "Graduation",
    href: "/news-and-updates/news",
  },
];

// ─── Public hubs (navigation cards) ──────────────────────────────────────────

export const publicHubs: RouteCard[] = [
  {
    href: "/who-we-are",
    eyebrow: "About us",
    title: "Who We Are",
    description:
      "A Ghanaian organisation running cohort training, school clubs, and partnerships. 3,000+ youth trained. 85% progression into work, study, or enterprise within six months.",
  },
  {
    href: "/what-we-do",
    eyebrow: "Programmes",
    title: "What We Do",
    description:
      "Eight practical initiatives: Youth Tech Academy, Girls in Tech, Tech Clubs, Entrepreneurship Hub, Rural Tech Connect, Community Outreach, Corporate Training, and Advocacy.",
  },
  {
    href: "/apply-for-training",
    eyebrow: "Start here",
    title: "Apply for Training",
    description:
      "12-week cohort programmes in Accra. No prior experience required for beginner tracks. Scholarships and device support available. 85% of graduates progress within six months.",
  },
  {
    href: "/for-organisations",
    eyebrow: "Collaborate",
    title: "For Organisations",
    description:
      "Corporate training, cohort sponsorships, staff volunteering, and direct access to job-ready graduates. Partners include Google.org, UNICEF, GIZ, and Mastercard Foundation.",
  },
  {
    href: "/partner-with-us",
    eyebrow: "Partnerships",
    title: "Partner With Us",
    description:
      "Five tracks for schools, government, NGOs, international development, and technology companies. 8,500+ students reached through school and community partnerships.",
  },
  {
    href: "/our-impact/reports",
    eyebrow: "Proof",
    title: "Our Impact",
    description:
      "Cohort outcomes, progression data, graduate stories, and SDG alignment. We track what happens after training — and we publish the numbers.",
  },
  {
    href: "/news-and-updates",
    eyebrow: "Stories",
    title: "News & Updates",
    description:
      "Cohort announcements, graduate wins, partnership updates, and honest reflections on building digital opportunity in Ghana.",
  },
  {
    href: "/contact",
    eyebrow: "Talk to us",
    title: "Contact Us",
    description:
      "Reach the team in Accra for training enquiries, partnerships, sponsorships, or media. Office hours and clear response times.",
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
