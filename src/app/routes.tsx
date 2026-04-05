/**
 * Centralized route configuration
 * 
 * This file defines all routes in the application with their metadata,
 * making it easy to maintain and extend routing.
 * 
 * Benefits:
 * - Single source of truth for routing
 * - Easy to add route metadata (SEO, access control)
 * - Better type safety
 * - Easier to maintain and extend
 */

import React, { Suspense } from 'react'
import { RouteObject } from 'react-router-dom'
import { MainLayout } from '../shared/components/layout'
import type { RouteHandle } from './types'

// Page Loading Fallback
const PageLoading: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-neutral-800">Loading...</p>
    </div>
  </div>
)

// Lazy load pages for better performance
const Home = React.lazy(() => import('../pages/Home'))
const WhoWeAre = React.lazy(() => import('../pages/who-we-are/WhoWeAre'))
const StudentsGraduates = React.lazy(() => import('../pages/Opportunities/students-graduates/StudentsGraduates'))
const Businesses = React.lazy(() => import('../pages/Opportunities/businesses/Businesses'))
const Volunteers = React.lazy(() => import('../pages/Opportunities/volunteers/Volunteers'))
const WhoCanApply = React.lazy(() => import('../pages/who-can-apply/WhoCanApply'))
const StudentsProcess = React.lazy(() => import('../pages/how-it-works/students-graduates/StudentsProcess'))
const BusinessesProcess = React.lazy(() => import('../pages/how-it-works/businesses/BusinessesProcess'))
const VolunteersProcess = React.lazy(() => import('../pages/how-it-works/volunteers/VolunteersProcess'))
const Testimonials = React.lazy(() => import('../pages/testimonials/Testimonials'))
const Contact = React.lazy(() => import('../pages/Contact'))
const Donate = React.lazy(() => import('../pages/Donate'))
const Partners = React.lazy(() => import('../pages/Partners'))
const Careers = React.lazy(() => import('../pages/Careers'))
const TechEmpowerment = React.lazy(() => import('../pages/TechEmpowerment'))
const ImpactPage = React.lazy(() => import('../pages/impact/Impact'))
const News = React.lazy(() => import('../pages/News'))
const Community = React.lazy(() => import('../pages/Community'))
const Error404 = React.lazy(() => import('../pages/Error404'))
const Error500 = React.lazy(() => import('../pages/Error500'))

// Program pages
const ProgramsPage = React.lazy(() => import('../pages/programs/Programs'))
const ProgramDetail = React.lazy(() => import('../components/programs/ProgramDetail'))
const TrainingProgramDetail = React.lazy(() => import('../components/programs/TrainingProgramDetail'))
const CategoryPage = React.lazy(() => import('../pages/programs/CategoryPage'))
const CourseDetailPage = React.lazy(() => import('../pages/programs/CourseDetailPage'))
const ApiCourseDetailPage = React.lazy(() => import('../pages/programs/ApiCourseDetailPage'))

// Partnership pages
const EducationalPartnerships = React.lazy(() => import('../pages/partnerships/educational-partnerships/EducationalPartnerships'))
const CorporateSponsorship = React.lazy(() => import('../pages/partnerships/corporate-sponsorship/CorporateSponsorship'))
const CorporateTraining = React.lazy(() => import('../pages/partnerships/corporate-training/CorporateTraining'))
const GovernmentCollaboration = React.lazy(() => import('../pages/partnerships/government-collaboration/GovernmentCollaboration'))
const NgoAndFoundationPartnerships = React.lazy(() => import('../pages/partnerships/ngo-and-foundation-partnerships/NgoAndFoundationPartnerships'))
const InternationalDevelopment = React.lazy(() => import('../pages/partnerships/international-development/InternationalDevelopment'))
const TechnologyPartners = React.lazy(() => import('../pages/partnerships/technology-partners/TechnologyPartners'))

/**
 * Suspense wrapper for lazy loaded pages
 */
function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoading />}>{children}</Suspense>
}

/**
 * Main application routes
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    handle: {
      title: 'IT For Youth Ghana',
      description: 'Empowering African youth with IT skills and opportunities',
    } as RouteHandle,
    children: [
      // Home
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <Home />
          </SuspenseWrapper>
        ),
        handle: {
          title: 'Home - IT For Youth Ghana',
          description: 'Empowering African youth with IT skills and opportunities',
        } as RouteHandle,
      },

      // Who We Are Section
      {
        path: 'who-we-are',
        handle: {
          title: 'Who We Are',
          description: 'Learn about IT For Youth Ghana',
        } as RouteHandle,
        children: [
          {
            index: true,
            element: (
              <SuspenseWrapper>
                <WhoWeAre />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'partners',
            element: (
              <SuspenseWrapper>
                <Partners />
              </SuspenseWrapper>
            ),
            handle: {
              title: 'Our Partners',
              description: 'Meet our partner organizations',
            } as RouteHandle,
          },
        ],
      },

      // Opportunities Section (Route group)
      {
        path: 'opportunities',
        handle: {
          title: 'Opportunities',
          description: 'Explore opportunities for different groups',
        } as RouteHandle,
        children: [
          {
            path: 'students-graduates',
            element: (
              <SuspenseWrapper>
                <StudentsGraduates />
              </SuspenseWrapper>
            ),
            handle: {
              title: 'For Students & Graduates',
              description: 'Training and employment opportunities for students',
            } as RouteHandle,
          },
          {
            path: 'businesses',
            element: (
              <SuspenseWrapper>
                <Businesses />
              </SuspenseWrapper>
            ),
            handle: {
              title: 'For Businesses',
              description: 'Partnership opportunities for businesses',
            } as RouteHandle,
          },
          {
            path: 'volunteers',
            element: (
              <SuspenseWrapper>
                <Volunteers />
              </SuspenseWrapper>
            ),
            handle: {
              title: 'For Volunteers',
              description: 'Volunteer opportunities with IT For Youth Ghana',
            } as RouteHandle,
          },
        ],
      },

      // How It Works Section
      {
        path: 'how-it-works',
        handle: {
          title: 'How It Works',
          description: 'Process for different participant types',
        } as RouteHandle,
        children: [
          {
            path: 'students-graduates',
            element: (
              <SuspenseWrapper>
                <StudentsProcess />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'businesses',
            element: (
              <SuspenseWrapper>
                <BusinessesProcess />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'volunteers',
            element: (
              <SuspenseWrapper>
                <VolunteersProcess />
              </SuspenseWrapper>
            ),
          },
        ],
      },

      // Programs/Courses
      {
        path: 'programs',
        handle: {
          title: 'Programs',
          description: 'Browse our training programs',
        } as RouteHandle,
        children: [
          {
            index: true,
            element: (
              <SuspenseWrapper>
                <ProgramsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'course/:courseSlug',
            element: (
              <SuspenseWrapper>
                <ApiCourseDetailPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: ':category',
            element: (
              <SuspenseWrapper>
                <CategoryPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: ':category/:courseId',
            element: (
              <SuspenseWrapper>
                <CourseDetailPage />
              </SuspenseWrapper>
            ),
          },
        ],
      },

      // Partnerships
      {
        path: 'partnerships',
        handle: {
          title: 'Partnerships',
          description: 'Partner with us',
        } as RouteHandle,
        children: [
          {
            path: 'educational-partnerships',
            element: (
              <SuspenseWrapper>
                <EducationalPartnerships />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'corporate-sponsorship',
            element: (
              <SuspenseWrapper>
                <CorporateSponsorship />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'corporate-training',
            element: (
              <SuspenseWrapper>
                <CorporateTraining />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'government-collaboration',
            element: (
              <SuspenseWrapper>
                <GovernmentCollaboration />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'ngo-and-foundation-partnerships',
            element: (
              <SuspenseWrapper>
                <NgoAndFoundationPartnerships />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'international-development',
            element: (
              <SuspenseWrapper>
                <InternationalDevelopment />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'technology-partners',
            element: (
              <SuspenseWrapper>
                <TechnologyPartners />
              </SuspenseWrapper>
            ),
          },
        ],
      },

      // Other Pages
      {
        path: 'who-can-apply',
        element: (
          <SuspenseWrapper>
            <WhoCanApply />
          </SuspenseWrapper>
        ),
        handle: {
          title: 'Who Can Apply',
          description: 'Eligibility requirements and application process',
        } as RouteHandle,
      },
      {
        path: 'testimonials',
        element: (
          <SuspenseWrapper>
            <Testimonials />
          </SuspenseWrapper>
        ),
        handle: {
          title: 'Testimonials',
          description: 'Success stories from our participants',
        } as RouteHandle,
      },
      {
        path: 'impact',
        element: (
          <SuspenseWrapper>
            <ImpactPage />
          </SuspenseWrapper>
        ),
        handle: {
          title: 'Our Impact',
          description: 'The impact we&apos;ve made in the community',
        } as RouteHandle,
      },
      {
        path: 'news',
        element: (
          <SuspenseWrapper>
            <News />
          </SuspenseWrapper>
        ),
        handle: {
          title: 'News',
          description: 'Latest news and updates',
        } as RouteHandle,
      },
      {
        path: 'community',
        element: (
          <SuspenseWrapper>
            <Community />
          </SuspenseWrapper>
        ),
        handle: {
          title: 'Community',
          description: 'Join our community',
        } as RouteHandle,
      },
      {
        path: 'contact',
        element: (
          <SuspenseWrapper>
            <Contact />
          </SuspenseWrapper>
        ),
        handle: {
          title: 'Contact Us',
          description: 'Get in touch with us',
        } as RouteHandle,
      },
      {
        path: 'donate',
        element: (
          <SuspenseWrapper>
            <Donate />
          </SuspenseWrapper>
        ),
        handle: {
          title: 'Donate',
          description: 'Support our cause',
        } as RouteHandle,
      },
      {
        path: 'careers',
        element: (
          <SuspenseWrapper>
            <Careers />
          </SuspenseWrapper>
        ),
        handle: {
          title: 'Careers',
          description: 'Join our team',
        } as RouteHandle,
      },
      {
        path: 'tech-empowerment',
        element: (
          <SuspenseWrapper>
            <TechEmpowerment />
          </SuspenseWrapper>
        ),
        handle: {
          title: 'Tech Empowerment',
          description: 'Technology empowerment initiatives',
        } as RouteHandle,
      },

      // Legacy routes (redirects)
      {
        path: 'what-we-offer/students-graduates',
        element: (
          <SuspenseWrapper>
            <StudentsGraduates />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'what-we-offer/businesses',
        element: (
          <SuspenseWrapper>
            <Businesses />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'what-we-offer/volunteers',
        element: (
          <SuspenseWrapper>
            <Volunteers />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'training/:programId',
        element: (
          <SuspenseWrapper>
            <TrainingProgramDetail />
          </SuspenseWrapper>
        ),
      },

      // Error pages
      {
        path: '404',
        element: (
          <SuspenseWrapper>
            <Error404 />
          </SuspenseWrapper>
        ),
      },
      {
        path: '500',
        element: (
          <SuspenseWrapper>
            <Error500 />
          </SuspenseWrapper>
        ),
      },
    ],
  },

  // Catch-all for 404
  {
    path: '*',
    element: (
      <SuspenseWrapper>
        <Error404 />
      </SuspenseWrapper>
    ),
  },
]
