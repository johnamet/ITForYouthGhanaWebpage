# Navigation Restructuring Guide
## Visual Reference & Implementation Details

---

## NAVIGATION TREE - NEW STRUCTURE

```
IT FOR YOUTH GHANA WEBSITE
│
├── 🏠 HOME (/)
│
├── 👥 WHO WE ARE (/who-we-are)
│   ├── About Us (/who-we-are)
│   │   └── Mission & Vision
│   ├── Our Team (/who-we-are/team)
│   │   └── Team members grid
│   ├── Our Partners (/who-we-are/partners)
│   │   └── Partner organizations
│   └── Join Our Team (/who-we-are/careers)
│       └── Job listings
│
├── 🚀 WHAT WE DO (/what-we-do)
│   ├── Hub Page (/what-we-do)
│   │   └── Overview of all 8 initiatives
│   ├── Girls in Tech Programs (/what-we-do/girls-in-tech)
│   │   └── Program details, impact, enrollment
│   ├── Youth Tech Academy (/what-we-do/youth-academy)
│   │   └── Curriculum, outcomes, testimonials
│   ├── Tech Entrepreneurship Hub (/what-we-do/entrepreneurship-hub)
│   │   └── Success stories, resources
│   ├── Code Impact Challenge (/what-we-do/code-impact-challenge)
│   │   └── Challenge details, winners
│   ├── Rural Tech Connect (/what-we-do/rural-tech-connect)
│   │   └── Reach, beneficiaries, testimonials
│   ├── Community Outreach Initiative (/what-we-do/community-outreach)
│   │   └── Events, volunteer opportunities
│   ├── Advocacy (/what-we-do/advocacy)
│   │   └── Position papers, policy briefs
│   └── Tech Clubs (/what-we-do/tech-clubs)
│       └── Club directory, activities
│
├── 💼 OPPORTUNITIES (/opportunities)
│   ├── For Students & Graduates (/opportunities/students)
│   │   ├── Who Can Apply (/opportunities/students/who-can-apply)
│   │   │   └── Eligibility, requirements
│   │   ├── Browse Programs (/opportunities/students/programs)
│   │   │   └── Programs list from API
│   │   └── How It Works (/opportunities/students/how-it-works)
│   │       └── Process overview
│   │
│   ├── For Businesses (/opportunities/businesses)
│   │   ├── Corporate Training (/opportunities/businesses/corporate-training)
│   │   │   └── Training programs for staff
│   │   ├── Hire Our Graduates (/opportunities/businesses/hire-graduates)
│   │   │   └── Graduate directory, profiles
│   │   └── Sponsorships (/opportunities/businesses/sponsorships)
│   │       └── Partnership opportunities
│   │
│   ├── For Volunteers (/opportunities/volunteers)
│   │   ├── Who Can Volunteer (/opportunities/volunteers)
│   │   │   └── Eligibility info
│   │   └── Current Opportunities (implied)
│   │       └── Available volunteer roles
│   │
│   └── For Organizations (/opportunities/organizations)
│       ├── Corporate Training (/opportunities/organizations/corporate-training)
│       ├── Sponsorships & Partnerships (/opportunities/organizations/sponsorships)
│       ├── Hire Our Graduates (/opportunities/organizations/hire-graduates)
│       └── Staff Volunteering (/opportunities/organizations/staff-volunteering)
│
├── 📊 OUR IMPACT REPORTS (/impact-reports)
│   ├── Impact Reports (/impact-reports)
│   │   └── Key metrics, statistics, charts
│   ├── Testimonials (/impact-reports/testimonials)
│   │   └── Success stories, video testimonials
│   └── UN SDGs (/impact-reports/sdgs)
│       └── Alignment with Sustainable Development Goals
│
├── 📰 NEWS & UPDATES (/news-and-updates)
│   ├── News (/news-and-updates/news)
│   │   └── Latest news articles
│   └── Blogs (/news-and-updates/blogs)
│       └── Blog posts and articles
│
├── 🤝 PARTNERSHIPS (/partnerships)
│   ├── Educational Partnerships (/partnerships/educational-partnerships)
│   ├── Corporate Sponsorship (/partnerships/corporate-sponsorship)
│   ├── Corporate Training (/partnerships/corporate-training)
│   ├── Government Collaboration (/partnerships/government-collaboration)
│   ├── NGO & Foundation Partnerships (/partnerships/ngo-and-foundation-partnerships)
│   ├── International Development (/partnerships/international-development)
│   └── Technology Partners (/partnerships/technology-partners)
│
├── 📧 CONTACT (/contact)
│   └── Contact form, office info, social links
│
└── 💝 DONATE (/donate)
    └── Donation form, payment methods, impact info
```

---

## URL STRUCTURE MAPPING

### Old URLs → New URLs (with redirects needed)

```
OLD                                      NEW
─────────────────────────────────────────────────────────────
/who-we-are                        →     /who-we-are  (keep)
                                        
/about-us                          →     /who-we-are  (redirect)
                                        
/partners                          →     /who-we-are/partners  (redirect)
                                        
/careers                           →     /who-we-are/careers  (redirect)
                                        
/opportunities/students-graduates  →     /opportunities/students  (redirect)
                                        
/what-we-offer/*                   →     /opportunities/*  (redirects)
                                        
/programs                          →     /programs  (keep)
                                        
/programs/course/:slug             →     /programs/course/:slug  (keep)
                                        
/impact                            →     /impact-reports  (redirect)
                                        
/news                              →     /news-and-updates/news  (redirect)
                                        
/testimonials                      →     /impact-reports/testimonials  (redirect)
                                        
/blog(s)                           →     /news-and-updates/blogs  (redirect)
                                        
/partnerships                      →     /partnerships  (keep)
                                        
/partnerships/*                    →     /partnerships/*  (keep)
                                        
/contact                           →     /contact  (keep)
                                        
/donate                            →     /donate  (keep)
```

---

## MENU DISPLAY IN HEADER

### Main Menu Items (Visible in Header)
1. **Home** - Logo link to /
2. **Who We Are** - Dropdown
   - About Us
   - Our Team
   - Our Partners
   - Join Our Team
3. **What We Do** - Dropdown (8 initiatives)
4. **Opportunities** - Dropdown (4 sections)
5. **Our Impact** - Dropdown (3 sections)
6. **News & Updates** - Dropdown (2 sections)
7. **Partnerships** - Dropdown (7 types)
8. **Contact** - Link to /contact
9. **Donate** - Link to /donate (may be button styled)

### Mobile Menu (Hamburger)
- Collapse all dropdowns to accordion-style
- Show same structure as desktop
- Perhaps simplify to 2 levels max for mobile

---

## IMPLEMENTATION CHECKLIST

### Phase 1: Navigation Update

- [ ] Update `src/shared/constants/navigation.ts`
  - [x] Main navigation structure (DONE)
  - [x] Footer links (DONE)
  - [ ] Mobile menu structure
  - [ ] Breadcrumb data
  
- [ ] Update `src/app/routes.tsx`
  - [ ] Add /what-we-do routes
  - [ ] Update /opportunities structure
  - [ ] Add /impact-reports routes
  - [ ] Add /news-and-updates routes
  - [ ] Add 301 redirects for old URLs

- [ ] Update Header Component
  - [ ] Render new main navigation
  - [ ] Update dropdown styling
  - [ ] Ensure responsive design
  - [ ] Test on mobile

- [ ] Update Footer Component
  - [ ] Update footer links structure
  - [ ] Ensure all links work
  - [ ] Test responsive layout

- [ ] Create Redirect Pages (if needed)
  - [ ] /about-us → /who-we-are
  - [ ] /partners → /who-we-are/partners
  - [ ] /careers → /who-we-are/careers
  - [ ] /impact → /impact-reports
  - [ ] /news → /news-and-updates/news
  - [ ] /blog → /news-and-updates/blogs

### Phase 2: Core Pages

- [ ] Who We Are Section
  - [ ] /who-we-are - Mission & Vision
  - [ ] /who-we-are/team - Team page
  - [ ] /who-we-are/partners - Partners page
  - [ ] /who-we-are/careers - Careers/Join page

- [ ] What We Do Section
  - [ ] /what-we-do - Hub/listing page
  - [ ] /what-we-do/girls-in-tech
  - [ ] /what-we-do/youth-academy
  - [ ] /what-we-do/entrepreneurship-hub
  - [ ] /what-we-do/code-impact-challenge
  - [ ] /what-we-do/rural-tech-connect
  - [ ] /what-we-do/community-outreach
  - [ ] /what-we-do/advocacy
  - [ ] /what-we-do/tech-clubs

### Phase 3: Opportunities Restructuring

- [ ] Reorganize opportunities structure
  - [ ] /opportunities/students paths
  - [ ] /opportunities/businesses paths
  - [ ] /opportunities/volunteers paths
  - [ ] /opportunities/organizations paths (NEW)

### Phase 4: Impact & News

- [ ] Create Impact section
  - [ ] /impact-reports - Main page
  - [ ] /impact-reports/testimonials
  - [ ] /impact-reports/sdgs

- [ ] Create News & Updates section
  - [ ] /news-and-updates - Hub page
  - [ ] /news-and-updates/news
  - [ ] /news-and-updates/blogs

---

## CONTENT MAPPING

### Pages That Need Content Creation

#### Who We Are Section
| Page | Content Needed |
|------|-----------------|
| About Us | Mission statement, vision, history timeline |
| Team | Team member bios, roles, photos |
| Partners | Partner logos, descriptions, links |
| Careers | Job openings, company culture, application |

#### What We Do Section
| Initiative | Content Needed |
|------------|-----------------|
| Girls in Tech | Program overview, impact, testimonials, enrollment |
| Youth Academy | Curriculum, instructors, alumni outcomes |
| Entrepreneurship | Success stories, resources, incubation details |
| Code Impact | Challenge rules, winners, past competitions |
| Rural Tech | Reach statistics, beneficiary stories |
| Community | Event calendar, volunteering opportunities |
| Advocacy | Position papers, policy briefs, reports |
| Tech Clubs | Club directory, member benefits, activities |

#### Opportunities Section
| Path | Content Needed |
|------|-----------------|
| Students | Eligibility, application process, timeline |
| Businesses | Training options, pricing, case studies |
| Volunteers | Volunteer roles, time commitment, benefits |
| Organizations | Training packages, pricing, corporate benefits |

#### Impact & News
| Section | Content Needed |
|---------|-----------------|
| Impact Reports | Charts, statistics, metrics, stories |
| Testimonials | Video interviews, written testimonials |
| SDGs | Mapping of programs to UN SDGs |
| News | Article entries, news feed |
| Blogs | Blog post entries, categories |

---

## RESPONSIVE DESIGN CONSIDERATIONS

### Desktop (1024px+)
- Full horizontal menu with dropdowns
- Multi-level dropdown menus
- Breadcrumbs at top of page

### Tablet (768px - 1023px)
- Condensed menu items
- Mega menu dropdowns (if needed)
- Hamburger menu optional

### Mobile (< 768px)
- Hamburger menu icon
- Accordion-style navigation
- Simplified menu structure
- Touch-friendly button sizes

---

## SEO OPTIMIZATION POINTS

For each page, ensure:
```
✓ Unique title tag (50-60 chars)
✓ Unique meta description (150-160 chars)
✓ Canonical URL
✓ Open Graph tags
✓ Twitter card tags
✓ Structured data (schema.org)
✓ Image alt text
✓ Internal linking
✓ Keyword optimization
✓ Mobile-friendly
```

### Example Meta Tags
```html
<!-- What We Do - Girls in Tech Page -->
<title>Girls in Tech Programs | IT For Youth Ghana</title>
<meta name="description" content="Empower girls with tech skills. Join our Girls in Tech program for mentorship, training, and career opportunities in tech.">
<meta property="og:title" content="Girls in Tech Programs | IT For Youth Ghana">
<meta property="og:description" content="Empower girls with tech skills...">
<meta property="og:image" content="/og-girls-in-tech.png">
```

---

## ANALYTICS & TRACKING

### Events to Track
- Navigation clicks (menu items)
- Page views (all pages)
- CTA clicks (Enroll, Apply, Donate)
- Form submissions
- Time on page
- Scroll depth
- User flow paths

### Goals to Monitor
- Program enrollments
- Volunteer signups
- Donation conversions
- Contact form submissions
- Job applications
- Newsletter signups

---

## BROWSER TESTING CHECKLIST

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

Test for:
- [ ] Menu functionality
- [ ] Link functionality
- [ ] Responsive design
- [ ] Form submission
- [ ] Performance (Lighthouse >90)
- [ ] Accessibility (WCAG AA)

---

## DEPLOYMENT STRATEGY

### Pre-Launch
1. Stage all new pages in staging environment
2. Test all navigation links
3. Set up 301 redirects
4. Update sitemap
5. Update robots.txt (if needed)
6. Test SEO crawling
7. Performance testing
8. Accessibility audit

### Launch
1. Deploy to production
2. Monitor error rates
3. Verify analytics tracking
4. Test critical paths
5. Monitor page load times

### Post-Launch
1. Monitor user behavior
2. Track analytics for 2 weeks
3. Collect user feedback
4. Fix any issues
5. Document lessons learned

---

## TIMELINE ESTIMATE

| Phase | Duration | Effort |
|-------|----------|--------|
| Navigation Setup | 1 week | 20 hours |
| Core Pages (Who We Are, What We Do) | 2 weeks | 60 hours |
| Opportunities Restructure | 1 week | 40 hours |
| Impact & News Pages | 1 week | 40 hours |
| Testing & QA | 1 week | 40 hours |
| Deployment & Monitoring | 1 week | 30 hours |
| **Total** | **7 weeks** | **230 hours** |

---

## GLOSSARY

| Term | Definition |
|------|-----------|
| **Route** | URL path in the application |
| **Navigation** | Menu structure for site navigation |
| **Breadcrumb** | Navigation trail showing current location |
| **SEO** | Search Engine Optimization |
| **CTA** | Call-to-Action button or link |
| **301 Redirect** | Permanent URL redirect |
| **Responsive** | Adapts to different screen sizes |
| **Accessibility** | Usable by people with disabilities |
| **Hub Page** | Landing page for a category/section |

---

**Document Version**: 1.0  
**Last Updated**: 2026-04-05  
**Status**: Ready for Implementation
