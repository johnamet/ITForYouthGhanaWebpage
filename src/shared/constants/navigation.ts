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
    description: 'Learn about our mission and vision',
    children: [
      { label: 'About Us', href: '/who-we-are' },
      { label: 'Our Partners', href: '/who-we-are/partners' },
    ],
  },
  {
    label: 'Opportunities',
    href: '/opportunities',
    description: 'Explore opportunities for different groups',
    children: [
      { label: 'For Students & Graduates', href: '/opportunities/students-graduates' },
      { label: 'For Businesses', href: '/opportunities/businesses' },
      { label: 'For Volunteers', href: '/opportunities/volunteers' },
    ],
  },
  {
    label: 'Programs',
    href: '/programs',
    description: 'Browse our training programs',
  },
  {
    label: 'Partnerships',
    href: '/partnerships',
    description: 'Partner with us',
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
    description: 'Support our cause',
  },
]

export const footerLinks = {
  organization: [
    { label: 'Who We Are', href: '/who-we-are' },
    { label: 'Impact', href: '/impact' },
    { label: 'News', href: '/news' },
    { label: 'Careers', href: '/careers' },
  ],
  programs: [
    { label: 'Programs', href: '/programs' },
    { label: 'Students & Graduates', href: '/opportunities/students-graduates' },
    { label: 'Businesses', href: '/opportunities/businesses' },
    { label: 'Volunteers', href: '/opportunities/volunteers' },
  ],
  partnerships: [
    { label: 'Partnerships', href: '/partnerships' },
    { label: 'Educational', href: '/partnerships/educational-partnerships' },
    { label: 'Corporate', href: '/partnerships/corporate-sponsorship' },
  ],
  support: [
    { label: 'Contact', href: '/contact' },
    { label: 'Donate', href: '/donate' },
    { label: 'Community', href: '/community' },
  ],
}

export const socialLinks = {
  twitter: 'https://twitter.com',
  facebook: 'https://facebook.com',
  linkedin: 'https://linkedin.com',
  instagram: 'https://instagram.com',
}
