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
import type { InitiativePage } from "@/types/content";

export { articles } from "@/lib/content/news-config";

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
  label: "Now open",
  message:
    "Applications for Cohort 7 are open until May 31, 2026, with limited places for the next intake.",
  cta: { label: "Apply now", href: "/apply-for-training/courses" },
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

export const programmeShowcase: ProgrammeShowcaseItem[] = [
  {
    id: "initiative-girls-in-tech",
    eyebrow: "Inclusion pathway",
    title: "Girls in Tech",
    description: "Mentorship, confidence, and technical pathways built for young women entering the digital economy.",
    href: "/what-we-do/girls-in-tech",
    image: "/images/randomPictures/group_girls.jpg",
    accent: "#F5A623",
    icon: "👩‍💻",
  },
  {
    id: "initiative-youth-academy",
    eyebrow: "Training pathway",
    title: "Youth Tech Academy",
    description: "Structured, hands-on training that helps young people become job-ready and portfolio-ready.",
    href: "/what-we-do/youth-academy",
    image: "/images/randomPictures/studentsBackcoding.jpg",
    accent: "#0C2D5A",
    icon: "💡",
  },
  {
    id: "initiative-entrepreneurship-hub",
    eyebrow: "Venture pathway",
    title: "Entrepreneurship Hub",
    description: "Practical business support for learners turning technical ability into sustainable ventures.",
    href: "/what-we-do/entrepreneurship-hub",
    image: "/images/randomPictures/studentpresenting.jpg",
    accent: "#157F6B",
    icon: "🚀",
  },
  {
    id: "initiative-code-impact-challenge",
    eyebrow: "Challenge pathway",
    title: "Code Impact Challenge",
    description: "Project-led learning where young people solve meaningful local problems with technology.",
    href: "/what-we-do/code-impact-challenge",
    image: "/images/randomPictures/redstudentgrouplesson.jpg",
    accent: "#C44900",
    icon: "🧠",
  },
  {
    id: "initiative-rural-tech-connect",
    eyebrow: "Access pathway",
    title: "Rural Tech Connect",
    description: "Bringing training, devices, and opportunity to young people beyond major urban centres.",
    href: "/what-we-do/rural-tech-connect",
    image: "/images/randomPictures/children_holding_sign_in_streets.jpg",
    accent: "#2A6F97",
    icon: "🌍",
  },
  {
    id: "initiative-community-outreach",
    eyebrow: "Community pathway",
    title: "Community Outreach",
    description: "School and community activations that widen awareness, confidence, and first access to tech.",
    href: "/what-we-do/community-outreach",
    image: "/images/randomPictures/studentslistening.jpg",
    accent: "#8B5E34",
    icon: "🤝",
  },
  {
    id: "initiative-advocacy",
    eyebrow: "Influence pathway",
    title: "Advocacy",
    description: "Ecosystem-building work that pushes for wider digital inclusion and youth opportunity.",
    href: "/what-we-do/advocacy",
    image: "/images/randomPictures/graduationspeaking.jpg",
    accent: "#A63D40",
    icon: "📣",
  },
  {
    id: "initiative-tech-clubs",
    eyebrow: "School pathway",
    title: "Tech Clubs",
    description: "Recurring peer-led learning communities that keep students connected to technology year-round.",
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
  {
    id: "t1",
    quote:
      "The bootcamp didn't just teach me to code — it taught me to think like a problem solver. Six months later I landed my first role as a junior developer in Accra.",
    name: "Ama Kofi",
    role: "Junior Developer at TechHub GH",
    programme: "Digital Skills Bootcamp",
    year: "Class of 2025",
    avatar: "/images/people/Belinda.jpg",
    initials: "AK",
  },
  {
    id: "t2",
    quote:
      "As a young woman from Kumasi, I never thought tech was for me. The Tech Sisters programme proved me wrong. The mentors here are exceptional human beings.",
    name: "Efua Asante",
    role: "UX Designer",
    programme: "Girls in Tech",
    year: "Class of 2024",
    avatar: "/images/people/elisabeth.jpg",
    initials: "EA",
  },
  {
    id: "t3",
    quote:
      "IT For Youth Ghana gave our school the resources we simply couldn't afford. Our students now compete in national coding challenges — and win.",
    name: "Mr. Isaac Mensah",
    role: "Head of ICT, Accra Academy Secondary School",
    programme: "Community Outreach Partner",
    year: "2026 partner voice",
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
