/**
 * Navigation configuration and links
 */

export interface NavLink {
  label: string
  href: string
  description?: string
  children?: NavLink[]
  icon?: string
}

export const mainNavigation: NavLink[] = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Who We Are',
    href: '/who-we-are',
    description: 'Learn about our mission, vision, team, and partners',
    children: [
      { label: 'About Us', href: '/who-we-are', description: 'Our mission & vision' },
      { label: 'Our Team', href: '/who-we-are/team', description: 'Meet the team' },
      { label: 'Our Partners', href: '/who-we-are/partners', description: 'Partner organizations' },
      { label: 'Join Our Team', href: '/who-we-are/careers', description: 'Career opportunities' },
    ],
  },
  {
    label: 'What We Do',
    href: '/what-we-do',
    description: 'Explore our initiatives and programs',
    children: [
      { label: 'Girls in Tech Programs', href: '/what-we-do/girls-in-tech' },
      { label: 'Youth Tech Academy', href: '/what-we-do/youth-academy' },
      { label: 'Tech Entrepreneurship Hub', href: '/what-we-do/entrepreneurship-hub' },
      { label: 'Code Impact Challenge', href: '/what-we-do/code-impact-challenge' },
      { label: 'Rural Tech Connect', href: '/what-we-do/rural-tech-connect' },
      { label: 'Community Outreach', href: '/what-we-do/community-outreach' },
      { label: 'Advocacy', href: '/what-we-do/advocacy' },
      { label: 'Tech Clubs', href: '/what-we-do/tech-clubs' },
    ],
  },
  {
    label: 'Opportunities',
    href: '/opportunities',
    description: 'Explore opportunities for students, businesses, and volunteers',
    children: [
      {
        label: 'For Students & Graduates',
        href: '/opportunities/students',
        children: [
          { label: 'Who Can Apply', href: '/opportunities/students/who-can-apply' },
          { label: 'Browse Programs', href: '/opportunities/students/programs' },
          { label: 'How It Works', href: '/opportunities/students/how-it-works' },
        ],
      },
      {
        label: 'For Businesses',
        href: '/opportunities/businesses',
        children: [
          { label: 'Corporate Training', href: '/opportunities/businesses/corporate-training' },
          { label: 'Hire Our Graduates', href: '/opportunities/businesses/hire-graduates' },
          { label: 'Sponsorships', href: '/opportunities/businesses/sponsorships' },
        ],
      },
      {
        label: 'For Volunteers',
        href: '/opportunities/volunteers',
      },
      {
        label: 'For Organizations',
        href: '/opportunities/organizations',
        children: [
          { label: 'Corporate Training', href: '/opportunities/organizations/corporate-training' },
          { label: 'Sponsorships & Partnerships', href: '/opportunities/organizations/sponsorships' },
          { label: 'Hire Our Graduates', href: '/opportunities/organizations/hire-graduates' },
          { label: 'Staff Volunteering', href: '/opportunities/organizations/staff-volunteering' },
        ],
      },
    ],
  },
  {
    label: 'Our Impact',
    href: '/impact-reports',
    description: 'Discover our impact, testimonials, and SDG alignment',
    children: [
      { label: 'Impact Reports', href: '/impact-reports', description: 'Our impact metrics' },
      { label: 'Testimonials', href: '/impact-reports/testimonials', description: 'Success stories' },
      { label: 'UN SDGs', href: '/impact-reports/sdgs', description: 'Sustainable Development Goals' },
    ],
  },
  {
    label: 'News & Updates',
    href: '/news-and-updates',
    description: 'Latest news and blog posts',
    children: [
      { label: 'News', href: '/news-and-updates/news', description: 'Latest news' },
      { label: 'Blogs', href: '/news-and-updates/blogs', description: 'Blog posts' },
    ],
  },
  {
    label: 'Partnerships',
    href: '/partnerships',
    description: 'Partnership opportunities',
    children: [
      { label: 'Educational', href: '/partnerships/educational-partnerships' },
      { label: 'Corporate Sponsorship', href: '/partnerships/corporate-sponsorship' },
      { label: 'Corporate Training', href: '/partnerships/corporate-training' },
      { label: 'Government', href: '/partnerships/government-collaboration' },
      { label: 'NGO & Foundations', href: '/partnerships/ngo-and-foundation-partnerships' },
      { label: 'International', href: '/partnerships/international-development' },
      { label: 'Technology', href: '/partnerships/technology-partners' },
    ],
  },
  {
    label: 'Contact',
    href: '/contact',
    description: 'Get in touch with us',
  },
  {
    label: 'Donate',
    href: '/donate',
    description: 'Support our mission',
  },
]

export const footerLinks = {
  organization: [
    { label: 'About Us', href: '/who-we-are' },
    { label: 'Our Team', href: '/who-we-are/team' },
    { label: 'Our Impact', href: '/impact-reports' },
    { label: 'News & Updates', href: '/news-and-updates' },
    { label: 'Careers', href: '/who-we-are/careers' },
  ],
  programs: [
    { label: 'What We Do', href: '/what-we-do' },
    { label: 'For Students', href: '/opportunities/students' },
    { label: 'For Businesses', href: '/opportunities/businesses' },
    { label: 'For Volunteers', href: '/opportunities/volunteers' },
    { label: 'For Organizations', href: '/opportunities/organizations' },
  ],
  partnerships: [
    { label: 'All Partnerships', href: '/partnerships' },
    { label: 'Educational', href: '/partnerships/educational-partnerships' },
    { label: 'Corporate Sponsorship', href: '/partnerships/corporate-sponsorship' },
    { label: 'Corporate Training', href: '/partnerships/corporate-training' },
    { label: 'Government', href: '/partnerships/government-collaboration' },
  ],
  support: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Donate', href: '/donate' },
    { label: 'Testimonials', href: '/impact-reports/testimonials' },
    { label: 'Press Kit', href: '#' }, // Update with actual URL
  ],
}

export const socialLinks = {
  twitter: 'https://twitter.com',
  facebook: 'https://facebook.com',
  linkedin: 'https://linkedin.com',
  instagram: 'https://instagram.com',
}
