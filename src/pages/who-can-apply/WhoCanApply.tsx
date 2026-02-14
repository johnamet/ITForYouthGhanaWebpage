import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SEO from '../../components/SEO'
import { navigateToPage } from '../../utils/navigation'

const WhoCanApply: React.FC = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const handleApplyNow = () => {
    navigateToPage('/contact')
  }

  // UPDATED: Focus on individual learners only
  const eligibilityCategories = [
    {
      title: 'High School Graduates',
      requirements: [
        'Completed secondary school (WASSCE/GCE)',
        'Age 18-30 years old',
        'Basic English literacy',
        'No prior tech experience needed'
      ],
      description: 'Start your tech career right after secondary school with professional training'
    },
    {
      title: 'University/Diploma Students',
      requirements: [
        'Currently enrolled or recently graduated',
        'Any field of study welcome',
        'Available for program duration',
        'Eager to gain practical tech skills'
      ],
      description: 'Complement your degree with in-demand tech skills for better career prospects'
    },
    {
      title: 'Career Changers',
      requirements: [
        'Any educational background',
        'Currently employed or seeking employment',
        'Motivation to transition into tech',
        'Commitment to complete the program'
      ],
      description: 'Switch careers into the fast-growing tech industry with our support'
    },
    {
      title: 'Career Upgraders',
      requirements: [
        'Working professionals seeking advancement',
        'Basic computer literacy helpful',
        'Clear career development goals',
        'Dedicated to skill improvement'
      ],
      description: 'Level up your current career with new tech skills and certifications'
    }
  ]

  return (
    <>
      <SEO
        title="Who Can Apply - IT for Youth Ghana"
        description="Individual tech training programs for students, graduates, and professionals. Start your tech career or upgrade your skills with our professional training."
        canonical="/who-can-apply"
      />

      <div id="main-content" className="min-h-screen bg-white pt-24">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden" style={{ backgroundColor: '#0c2d5a' }}>
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-white max-w-4xl mx-auto"
            >
              <h1 className="heading-xl text-white mb-6">
                Who Can Apply
              </h1>
              <p className="text-lead text-white/90 mb-8">
                Individual Training Programs for Students & Professionals
              </p>
              <p className="text-xl mb-12 text-white/80 leading-relaxed max-w-3xl mx-auto">
                Our programs are designed for individuals looking to start or advance their tech careers. Whether you're a student, graduate, or working professional - we have a path for you.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-6 justify-center"
              >
                <motion.button
                  className="btn btn-secondary"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleApplyNow}
                >
                  Apply Now
                </motion.button>
                <motion.button
                  className="btn btn-ghost"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => document.getElementById('eligibility')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  See Requirements
                </motion.button>
              </motion.div>

              {/* NEW: Link to Corporate Training */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8 pt-6 border-t border-white/20"
              >
                <p className="text-white/70 text-sm mb-2">Looking for corporate or team training?</p>
                <button
                  onClick={() => navigateToPage('/partnerships/corporate-sponsorship')}
                  className="text-white hover:text-white/90 underline text-sm font-medium"
                >
                  View Corporate Training Services →
                </button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Eligibility Categories */}
        <section id="eligibility" ref={ref} className="section bg-white">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="heading-lg mb-6" style={{ color: '#0c2d5a' }}>Who Qualifies?</h2>
              <p className="text-lead text-center max-w-4xl mx-auto text-neutral-800">
                We welcome individual applicants from all backgrounds. Check which category fits you best:
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              {eligibilityCategories.map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border group"
                  style={{ borderColor: 'rgba(12, 45, 90, 0.1)' }}
                >
                  <h3 className="heading-sm mb-4 group-hover:text-opacity-80 transition-colors duration-300" style={{ color: '#0c2d5a' }}>
                    {category.title}
                  </h3>

                  <p className="text-body mb-6 text-neutral-700 leading-relaxed group-hover:text-neutral-800 transition-colors duration-300">
                    {category.description}
                  </p>

                  <div
                    className="rounded-xl p-4 transition-colors duration-300"
                    style={{ backgroundColor: 'rgba(12, 45, 90, 0.1)' }}
                  >
                    <h4 className="font-semibold mb-3" style={{ color: '#0c2d5a' }}>Requirements:</h4>
                    <ul className="space-y-2">
                      {category.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start space-x-3">
                          <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#0c2d5a' }}></div>
                          <span className="text-body text-sm">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Special Considerations */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="rounded-2xl p-12 text-center max-w-6xl mx-auto"
              style={{ backgroundColor: 'rgba(12, 45, 90, 0.05)' }}
            >
              <h3 className="heading-md mb-8" style={{ color: '#0c2d5a' }}>What You Get</h3>

              <div className="grid md:grid-cols-2 gap-12 mb-12">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="bg-white rounded-xl p-6 shadow-lg"
                >
                  <h4 className="text-left space-y-3 heading-sm mb-4" style={{ color: '#0c2d5a' }}>Priority Given To:</h4>
                  <ul className="text-left space-y-3">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#0c2d5a' }}></div>
                      <span className="text-body">Women and girls (70%+ of our students)</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#0c2d5a' }}></div>
                      <span className="text-body">Underserved and rural communities</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#0c2d5a' }}></div>
                      <span className="text-body">First-generation tech learners</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#0c2d5a' }}></div>
                      <span className="text-body">Demonstrated commitment and financial need</span>
                    </li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  className="bg-white rounded-xl p-6 shadow-lg"
                >
                  <h4 className="text-left space-y-3 heading-sm mb-4" style={{ color: '#0c2d5a' }}>Included in Your Training:</h4>
                  <ul className="text-left space-y-3">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#0c2d5a' }}></div>
                      <span className="text-body">Professional tech training & certification</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#0c2d5a' }}></div>
                      <span className="text-body">All necessary equipment & software</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#0c2d5a' }}></div>
                      <span className="text-body">Career counseling & job placement support</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#0c2d5a' }}></div>
                      <span className="text-body">Professional network & mentorship</span>
                    </li>
                  </ul>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="flex flex-col sm:flex-row gap-6 justify-center"
              >
                <motion.button
                  className="btn btn-primary"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleApplyNow}
                >
                  Start Your Application
                </motion.button>
                <motion.button
                  className="btn btn-secondary"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigateToPage('/programs')}
                >
                  View Programs
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* NEW: Corporate Training CTA Section */}
        <section className="py-16" style={{ backgroundColor: '#f8f9fa' }}>
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="heading-md mb-4" style={{ color: '#0c2d5a' }}>
                  Looking to Train Your Team or Organization?
                </h3>
                <p className="text-body mb-8 text-neutral-700">
                  We offer customized corporate training programs, workshops, and capacity building for businesses, NGOs, schools, and government organizations.
                </p>
                <motion.button
                  className="btn btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigateToPage('/partnerships/corporate-sponsorship')}
                >
                  Explore Corporate Training →
                </motion.button>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default WhoCanApply
