import React, { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { content } from '../../../../data/content/index'
import { programs } from '../../../../data/content/programs'
import Modal from '../../../../components/Modal'

const ProgramsOverview: React.FC = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [selectedProgram, setSelectedProgram] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'past' | 'current' | 'courses' | 'future'>('past')

  const handleProgramClick = (program: any) => {
    setSelectedProgram(program)
    setShowModal(true)
  }

  const handleModalClose = () => {
    setShowModal(false)
    setSelectedProgram(null)
  }

  // Get programs based on active tab
  const getCurrentPrograms = () => {
    switch (activeTab) {
      case 'past':
        return programs.past
      case 'current':
        return programs.current
      case 'courses':
        return programs.courses
      case 'future':
        return programs.future
      default:
        return programs.current
    }
  }

  const tabLabels = {
    past: 'Completed',
    current: 'Active Programs',
    courses: 'Workshops',
    future: 'Coming Soon'
  }

  // const tabIcons = {
  //   current: '🚀',
  //   past: '✅',
  //   courses: '📚',
  //   future: '⭐'
  // }

  return (
    <section id="programs" ref={ref} className="section bg-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="heading-xl mb-6" style={{ color: '#0c2d5a' }}>Our Training Programs</h2>
          <p className="text-lead text-center max-w-4xl mx-auto text-neutral-700 leading-relaxed">
            Professional training programs designed for Ghana's most in-demand tech skills. 
            Your investment in a transformative career journey.
          </p>
        </motion.div>

        {/* Homepage Style Program Category Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-20"
        >
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto px-4">
            {(Object.keys(tabLabels) as Array<keyof typeof tabLabels>).map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? 'btn btn-primary'
                    : 'btn btn-secondary'
                } min-w-[160px]`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  padding: '14px 28px'
                }}
              >
                <span>{tabLabels[tab]}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Programs Grid */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid lg:grid-cols-3 gap-8 items-stretch"
        >
          {getCurrentPrograms().map((program: any, index: number) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-neutral-100 group flex flex-col h-full"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              
              <div className="p-8 flex flex-col h-full">
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-opacity-80 transition-colors" style={{ color: '#0c2d5a' }}>
                    {program.title}
                  </h3>
                  {program.subtitle && (
                    <span 
                      className="text-sm font-medium px-3 py-1 rounded-full"
                      style={{ 
                        color: '#0c2d5a',
                        backgroundColor: 'rgba(12, 45, 90, 0.1)'
                      }}
                    >
                      {program.subtitle}
                    </span>
                  )}
                  <div className="mt-4 space-y-2 text-sm text-neutral-600">
                    <div className="flex items-center">
                      <strong>Duration:</strong> {program.duration}
                    </div>
                    {program.status && (
                      <div className="flex items-center">
                        <strong>Status:</strong> {program.status}
                      </div>
                    )}
                    {program.schedule && (
                      <div className="flex items-center">
                        <strong>Schedule:</strong> {program.schedule}
                      </div>
                    )}
                    {program.startDate && (
                      <div className="flex items-center space-x-2">
                        <span><strong>Start:</strong> {program.startDate}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="text-neutral-700 mb-6 leading-relaxed flex-grow">
                  {program.description || `Professional training in ${program.title.toLowerCase()} with comprehensive hands-on experience.`}
                </p>
                
                <div className="pt-6 border-t border-neutral-100 mt-auto">
                  {(activeTab === 'past' || activeTab === 'current') ? (
                    <Link
                      to={`/training/${program.title.toLowerCase().replace(/\s+/g, '-')}`}
                      className="btn btn-primary w-full text-center inline-block"
                      style={{ textDecoration: 'none' }}
                    >
                      Learn More
                    </Link>
                  ) : (
                    <motion.button
                      className="btn btn-secondary w-full border-0 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => window.location.href = '/contact'}
                    >
                      {activeTab === 'future' ? 'Get Updates' : 'Enroll Now'}
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-24"
        >
          <div 
            className="rounded-3xl p-12 shadow-2xl border relative overflow-hidden"
            style={{ 
              backgroundColor: 'rgba(12, 45, 90, 0.03)',
              borderColor: 'rgba(12, 45, 90, 0.1)'
            }}
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 opacity-5" style={{ backgroundColor: '#0c2d5a' }}>
              <div className="w-full h-full rounded-full transform translate-x-32 -translate-y-32"></div>
            </div>
            
            <div className="relative z-10">
              <div className="mb-6">
                <h3 className="text-3xl font-bold mb-4" style={{ color: '#0c2d5a' }}>
                  Invest in Your Future
                </h3>
              </div>
              <p className="text-xl mb-8 text-neutral-700 max-w-3xl mx-auto leading-relaxed">
                Professional training programs designed to prepare you for in-demand careers in Ghana's rapidly growing tech industry. 
                Join over 250 successful graduates who transformed their lives through our programs.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <div className="flex items-center space-x-2 text-neutral-600">
                  <span>85% Employment Rate</span>
                </div>
                <div className="flex items-center space-x-2 text-neutral-600">
                  <span>Industry-Recognized Certificates</span>
                </div>
                <div className="flex items-center space-x-2 text-neutral-600">
                  <span>Career Support & Mentorship</span>
                </div>
              </div>

              <motion.button
                onClick={() => window.location.href = '/contact'}
                className="btn btn-primary inline-flex items-center space-x-3 border-0 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Check Your Eligibility</span>
                <span>→</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Modal */}
        <Modal
          isOpen={showModal}
          onClose={handleModalClose}
          title={selectedProgram?.title || ''}
          size="large"
        >
          {selectedProgram && (
            <div className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <img
                    src={selectedProgram.image}
                    alt={selectedProgram.title}
                    className="w-full h-64 object-cover rounded-2xl shadow-lg"
                  />
                </div>
                
                <div>
                  <p className="text-lg mb-6 leading-relaxed text-neutral-700">
                    {selectedProgram.whatYoullLearn}
                  </p>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(12, 45, 90, 0.05)' }}>
                      <h4 className="font-bold mb-2" style={{ color: '#0c2d5a' }}>Duration</h4>
                      <p className="text-neutral-700">{selectedProgram.duration}</p>
                    </div>
                    <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(12, 45, 90, 0.05)' }}>
                      <h4 className="font-bold mb-2" style={{ color: '#0c2d5a' }}>Class Size</h4>
                      <p className="text-neutral-700">{selectedProgram.participants}</p>
                    </div>
                  </div>
                  
                  {selectedProgram.prerequisites && (
                    <div 
                      className="p-4 border rounded-xl"
                      style={{ 
                        backgroundColor: 'rgba(12, 45, 90, 0.1)',
                        borderColor: 'rgba(12, 45, 90, 0.2)'
                      }}
                    >
                      <h4 className="font-bold mb-2" style={{ color: '#0c2d5a' }}>Prerequisites</h4>
                      <p style={{ color: '#0c2d5a' }}>{selectedProgram.prerequisites}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xl mb-6" style={{ color: '#0c2d5a' }}>
                  Skills You'll Master
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedProgram.skills?.map((skill: string, index: number) => (
                    <div key={index} className="flex items-center p-3 bg-neutral-50 rounded-lg">
                      <span className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: '#0c2d5a' }}></span>
                      <span className="text-neutral-800 font-medium">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedProgram.highlights && (
                <div>
                  <h4 className="font-bold text-xl mb-6" style={{ color: '#0c2d5a' }}>
                    Program Features
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedProgram.highlights?.map((highlight: string, index: number) => (
                      <span 
                        key={index} 
                        className="px-4 py-2 rounded-full text-white font-medium shadow-sm"
                        style={{ backgroundColor: '#0c2d5a' }}
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedProgram.careerOutcomes && (
                <div>
                  <h4 className="font-bold text-xl mb-6" style={{ color: '#0c2d5a' }}>
                    Career Opportunities
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedProgram.careerOutcomes?.map((outcome: string, index: number) => (
                      <span 
                        key={index} 
                        className="px-4 py-2 rounded-full font-medium border"
                        style={{
                          backgroundColor: 'rgba(12, 45, 90, 0.1)',
                          color: '#0c2d5a',
                          borderColor: 'rgba(12, 45, 90, 0.2)'
                        }}
                      >
                        {outcome}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedProgram.realTalk && (
                <div className="p-6 rounded-2xl border-l-4" style={{ 
                  backgroundColor: 'rgba(12, 45, 90, 0.05)',
                  borderColor: '#0c2d5a'
                }}>
                  <h4 className="font-bold mb-3" style={{ color: '#0c2d5a' }}>Real Talk</h4>
                  <p className="text-neutral-700 italic leading-relaxed">
                    {selectedProgram.realTalk}
                  </p>
                </div>
              )}
            
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-neutral-200">
                <motion.button
                  className="btn btn-primary flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleModalClose()
                    window.location.href = '/contact'
                  }}
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>Apply Now</span>
                  </span>
                </motion.button>
                <motion.button
                  className="btn btn-secondary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleModalClose}
                >
                  Close
                </motion.button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </section>
  )
}

export default ProgramsOverview