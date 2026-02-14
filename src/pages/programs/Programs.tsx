// Refactored Programs page with dynamic API-based courses
import React, { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { content } from '../../data/content/index'
import SEO from '../../components/SEO'
import ProgramsHero from './components/ProgramsHero'
import ProgramFilter from './components/ProgramFilter'
import ProgramGrid from './components/ProgramGrid'
import ProgramModal from './components/ProgramModal'
import { useCourses } from '../../hooks/useCourses'
import { getImagePath } from '../../utils/randomImages'

interface Program {
  title: string
  subtitle: string
  description: string
  duration: string
  participants?: string
  image: string
  skills?: string[]
  requirements: string
  status: 'current' | 'past' | 'future'
  type: string
  nextStart?: string
  completedDate?: string
  careerOutcomes?: string[]
  highlights?: string[]
}

const Programs: React.FC = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  const [activeFilter, setActiveFilter] = useState<'current' | 'past' | 'future'>('current')
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const [showModal, setShowModal] = useState(false)
  const { courses, loading, error, retry } = useCourses()

  const fallbackCurrentPrograms: Program[] = (content.programs.current || []).map(program => ({
    ...program,
    requirements: program.prerequisites || 'No prior experience required',
    nextStart: '10/02/2025',
    status: 'current' as const,
    type: 'Currently Active'
  }))

  const apiCurrentPrograms: Program[] = courses
    .filter(course => course.status === 'active')
    .map(course => ({
      title: course.title,
      subtitle: `${course.level.charAt(0).toUpperCase()}${course.level.slice(1)} Course`,
      description: course.shortDescription || course.description,
      duration: course.duration.displayText,
      participants: course.enrollment?.capacity ? `Up to ${course.enrollment.capacity} participants` : undefined,
      image: course.image,
      skills: course.skills || [],
      requirements: course.prerequisites?.join(', ') || 'No prior experience required',
      status: 'current' as const,
      type: 'Currently Active',
      nextStart: course.startDate
    }))

  const currentPrograms = apiCurrentPrograms.length > 0 ? apiCurrentPrograms : fallbackCurrentPrograms

  const pastPrograms: Program[] = [
    {
      title: 'Digital Literacy Bootcamp 2023',
      subtitle: 'Foundation Skills',
      description: 'Basic computer skills and digital literacy for rural communities.',
      duration: '6 weeks',
      participants: '120 graduates',
      image: getImagePath('/images/randomPictures/studentsBackcoding.jpg'),
      skills: ['Computer Basics', 'Internet Navigation', 'Digital Safety', 'Email & Communication'],
      requirements: 'No prior experience required',
      status: 'past' as const,
      type: 'Completed Program',
      completedDate: 'December 2023'
    },
    {
      title: 'Web Development Intensive 2022',
      subtitle: 'Full Stack Development',
      description: 'Comprehensive web development training with real-world projects.',
      duration: '12 weeks',
      participants: '45 graduates',
      image: getImagePath('/images/randomPictures/peterblackboard.jpg'),
      skills: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Database Design'],
      requirements: 'Basic computer skills',
      status: 'past' as const,
      type: 'Completed Program',
      completedDate: 'August 2022'
    }
  ]

  const futurePrograms: Program[] = content.programs.future?.map(program => ({
    ...program,
    requirements: 'No prior experience required',
    status: 'future' as const,
    type: 'Coming Soon'
  })) || []

  const allPrograms: Record<'current' | 'past' | 'future', Program[]> = {
    current: currentPrograms,
    past: pastPrograms,
    future: futurePrograms
  }

  const currentCount = allPrograms.current.length
  const pastCount = allPrograms.past.length
  const futureCount = allPrograms.future.length

  const filteredPrograms = allPrograms[activeFilter]

  const handleProgramClick = (program: Program) => {
    setSelectedProgram(program)
    setShowModal(true)
  }

  const handleModalClose = () => {
    setShowModal(false)
    setSelectedProgram(null)
  }

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
              futureCount={futureCount}
            />

            {/* Program Cards Grid with Loading/Error States */}
            <ProgramGrid
              programs={filteredPrograms}
              activeFilter={activeFilter}
              onProgramClick={handleProgramClick}
              loading={loading}
              error={error}
              onRetry={retry}
            />
          </div>
        </section>

        {/* Program Details Modal */}
        <ProgramModal
          isOpen={showModal}
          onClose={handleModalClose}
          program={selectedProgram}
        />

        {/* Application Process */}
        <section className="py-20 bg-white">
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
                { step: '2', title: 'Apply Online', description: 'Fill out our simple online application form' },
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

        {/* Future Programs */}
        {futureCount > 0 && (
          <section className="py-20 bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="container">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h2 className="heading-xl mb-6">Coming Soon</h2>
                <p className="text-lead text-center max-w-3xl mx-auto">
                  Innovative programs currently in development to expand our impact and reach
                </p>
              </motion.div>

              <div className="grid md:grid-cols-1 gap-8 max-w-4xl mx-auto">
                {allPrograms.future.map((program, index) => (
                  <motion.div
                    key={program.title}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="card card-body border-l-4 border-accent overflow-hidden"
                  >
                    <div className="responsive-grid responsive-grid-md-2 gap-8 items-start">
                      <div className="space-y-4 min-h-0">
                        <div className="flex items-center mb-4">
                          <h3 className="heading-md mr-4">{program.title}</h3>
                          <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium">
                            {program.subtitle}
                          </span>
                        </div>
                        <p className="text-body mb-4 leading-relaxed">{program.description}</p>

                        <div className="responsive-grid responsive-grid-md-2 gap-4 mb-4">
                          <div>
                            <h4 className="font-semibold text-primary mb-2 text-sm">Initial Cohort:</h4>
                            <p className="text-body text-sm">{program.participants}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-primary mb-2 text-sm">Development Status:</h4>
                            <p className="text-body text-sm">{program.status}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-semibold text-primary mb-2 text-sm">Key Technologies:</h4>
                          <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                            {program.skills?.map((skill, skillIndex) => (
                              <span key={skillIndex} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs whitespace-nowrap">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-primary mb-2 text-sm">Real-World Applications:</h4>
                          <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                            {program.highlights?.map((highlight, highlightIndex) => (
                              <span key={highlightIndex} className="bg-accent/10 text-accent px-2 py-1 rounded-full text-xs whitespace-nowrap">
                                {highlight}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="text-center">
                        <img
                          src={program.image}
                          alt={program.title}
                          className="w-full h-64 object-cover rounded-xl shadow-lg mb-4"
                        />
                        <motion.button
                          className="btn btn-accent"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            window.location.href = 'https://portal.itforyouthghana.org'
                          }}
                        >
                          Register Interest
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  )
}

export default Programs
