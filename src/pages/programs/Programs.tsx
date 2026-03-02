// Refactored Programs page with dynamic API-based courses + search/filter
import React, { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
// import { content } from '../../data/content/index' — removed: no more mock future programs
import SEO from '../../components/SEO'
import ProgramsHero from './components/ProgramsHero'
import ProgramFilter from './components/ProgramFilter'
import ProgramGrid from './components/ProgramGrid'
import CourseSearchBar from './components/CourseSearchBar'
import { useCourseFilters } from '../../hooks/useCourseFilters'
import { getImagePath } from '../../utils/randomImages'
import { Course } from '../../types/course'

const Programs: React.FC = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  const [activeFilter, setActiveFilter] = useState<'current' | 'past'>('current')

  const {
    filteredCourses,
    categories,
    loading,
    error,
    retry,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    priceFilter,
    setPriceFilter,
    totalCount,
    filteredCount,
    hasActiveFilters,
    clearFilters,
    courses: allApiCourses,
  } = useCourseFilters()

  // Dynamic courses from the API for 'current'
  const currentPrograms: Course[] = filteredCourses

  // Mock data adapted to the Course interface format for past
  const pastPrograms: Course[] = [
    {
      id: 'past-1',
      title: 'Digital Literacy Bootcamp 2023',
      slug: 'digital-literacy-2023',
      shortDescription: 'Basic computer skills and digital literacy for rural communities.',
      description: 'Basic computer skills and digital literacy for rural communities.',
      level: 'beginner',
      category: 'Foundation Skills',
      image: getImagePath('/images/randomPictures/studentsBackcoding.jpg'),
      pricing: { amount: 0, currency: 'GHS', isFree: true },
      duration: { weeks: 6, displayText: '6 weeks' },
      status: 'archived',
      portalApplyUrl: '',
      skills: ['Computer Basics', 'Internet Navigation', 'Digital Safety', 'Email & Communication'],
      prerequisites: ['No prior experience required'],
      enrollment: { count: 120, capacity: 120 },
      // Optional extra fields for mock display mapping
      type: 'Completed Program',
      completedDate: 'December 2023'
    } as Course & { type: string, completedDate: string },
    {
      id: 'past-2',
      title: 'Web Development Intensive 2022',
      slug: 'web-dev-2022',
      shortDescription: 'Comprehensive web development training with real-world projects.',
      description: 'Comprehensive web development training with real-world projects.',
      level: 'intermediate',
      category: 'Full Stack Development',
      image: getImagePath('/images/randomPictures/peterblackboard.jpg'),
      pricing: { amount: 0, currency: 'GHS', isFree: true },
      duration: { weeks: 12, displayText: '12 weeks' },
      status: 'archived',
      portalApplyUrl: '',
      skills: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Database Design'],
      prerequisites: ['Basic computer skills'],
      enrollment: { count: 45, capacity: 50 },
      type: 'Completed Program',
      completedDate: 'August 2022'
    } as Course & { type: string, completedDate: string }
  ]

  const allPrograms: Record<'current' | 'past', Course[]> = {
    current: currentPrograms,
    past: pastPrograms,
  }

  // For filter counts: use total API courses (unfiltered) for current
  const currentCount = allApiCourses.filter(c => c.status === 'active').length || filteredCourses.length
  const pastCount = allPrograms.past.length

  const filteredPrograms = allPrograms[activeFilter as 'current' | 'past'] || []

  return (
    <>
      <SEO
        title="Tech Programs - Programming Courses Ghana"
        description="Explore our comprehensive technology programs in Ghana. Web development, data science, mobile app development courses with 70% female participation."
        canonical="/programs"
        ogType="website"
      />
      <div className="min-h-screen bg-white pt-24">
        {/* Hero Section */}
        <ProgramsHero />

        {/* Programs Overview */}
        <section ref={ref} className="py-20 bg-white">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="heading-xl mb-6">Choose Your Program</h2>
              <p className="text-lead text-center max-w-3xl mx-auto">
                From basics to advanced skills - our programs are designed to accompany you on your tech journey.
              </p>
            </motion.div>

            {/* Filter Buttons */}
            <ProgramFilter
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              currentCount={currentCount}
              pastCount={pastCount}
            />

            {/* Search/Filter Bar — only shown on 'current' tab */}
            {activeFilter === 'current' && (
              <CourseSearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                categoryFilter={categoryFilter}
                onCategoryChange={setCategoryFilter}
                priceFilter={priceFilter}
                onPriceChange={setPriceFilter}
                categories={categories}
                totalCount={totalCount}
                filteredCount={filteredCount}
                hasActiveFilters={hasActiveFilters}
                onClearFilters={clearFilters}
              />
            )}

            {/* Program Cards Grid with Loading/Error States */}
            <ProgramGrid
              programs={filteredPrograms}
              activeFilter={activeFilter}
              loading={activeFilter === 'current' ? loading : false}
              error={activeFilter === 'current' ? error : null}
              onRetry={retry}
            />
          </div>
        </section>

        {/* Application Process */}
        <section className="py-20 bg-gray-50">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="heading-xl mb-6">How to Apply</h2>
            </motion.div>

            <div className="responsive-grid responsive-grid-sm-2 responsive-grid-lg-4">
              {[
                { step: '1', title: 'Choose Program', description: 'Select the program that best fits your goals' },
                { step: '2', title: 'Apply Online', description: 'Fill out our simple online application form on the Portal' },
                { step: '3', title: 'Interview', description: 'Brief conversation about your motivation and goals' },
                { step: '4', title: 'Get Started', description: 'Welcome to IT for Youth Ghana!' }
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="heading-sm mb-3">{item.title}</h3>
                  <p className="text-body">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  )
}

export default Programs
