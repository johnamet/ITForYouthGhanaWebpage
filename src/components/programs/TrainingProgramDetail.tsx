import React from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { programs } from '../../data/content/programs'
import SEO from '../SEO'
import Hero from '../shared/Hero'

const TrainingProgramDetail: React.FC = () => {
  const { programId } = useParams<{ programId: string }>()
  const navigate = useNavigate()
  
  // Find program by title converted to slug or by exact match
  const program = Object.values(programs).flat().find(p => {
    const slug = p.title.toLowerCase().replace(/\s+/g, '-')
    return slug === programId || p.title === programId
  })
  
  if (!program) {
    navigate('/404')
    return null
  }

  const handleApplyNow = () => {
    window.location.href = '/contact'
  }

  const handleGetHelp = () => {
    window.location.href = '/contact'
  }

  return (
    <>
      <SEO
        title={`${program.title} - IT for Youth Ghana`}
        description={program.description || `Professional training in ${program.title}`}
        canonical={`/programs/${program.title.toLowerCase().replace(/\s+/g, '-')}`}
      />
      
      <div id="main-content" className="min-h-screen bg-white pt-24">
        <Hero
          title={program.title}
          subtitle={program.subtitle || "Professional Training Program"}
          description={program.description || `Professional training in ${program.title.toLowerCase()}`}
          primaryCta={{ text: "Apply Now", action: handleApplyNow }}
          secondaryCta={{ text: "Get Help", action: handleGetHelp }}
        />

        {/* Program Image */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="rounded-xl overflow-hidden shadow-2xl"
              >
                <img 
                  src={program.image} 
                  alt={program.title}
                  className="w-full h-[400px] object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Program Overview */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#0c2d5a' }}>
                  What You'll Learn
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                  {program.whatYoullLearn || program.description}
                </p>
              </motion.div>

              {/* Program Details Grid */}
              <div className="grid md:grid-cols-2 gap-8 mb-16">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
                >
                  <h3 className="text-xl font-bold mb-4" style={{ color: '#0c2d5a' }}>Program Duration</h3>
                  <p className="text-lg text-gray-700">{program.duration}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
                >
                  <h3 className="text-xl font-bold mb-4" style={{ color: '#0c2d5a' }}>Class Info</h3>
                  <p className="text-lg text-gray-700">{program.participants}</p>
                </motion.div>
              </div>

              {/* Prerequisites if available */}
              {program.prerequisites && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="mb-16"
                >
                  <div 
                    className="p-6 border rounded-xl"
                    style={{ 
                      backgroundColor: 'rgba(12, 45, 90, 0.1)',
                      borderColor: 'rgba(12, 45, 90, 0.2)'
                    }}
                  >
                    <h3 className="text-xl font-bold mb-4" style={{ color: '#0c2d5a' }}>Prerequisites</h3>
                    <p className="text-lg" style={{ color: '#0c2d5a' }}>{program.prerequisites}</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        {program.skills && (
          <section className="py-16 bg-gray-50">
            <div className="container">
              <div className="max-w-6xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-16"
                >
                  <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#0c2d5a' }}>
                    Skills You'll Master
                  </h2>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {program.skills.map((skill: string, index: number) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center"
                    >
                      <div className="w-3 h-3 rounded-full mx-auto mb-3" style={{ backgroundColor: '#0c2d5a' }}></div>
                      <span className="text-gray-800 font-medium">{skill}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Program Features */}
        {program.highlights && (
          <section className="py-16 bg-white">
            <div className="container">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-16"
                >
                  <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#0c2d5a' }}>
                    Program Features
                  </h2>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                  {program.highlights.map((highlight: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                            style={{ backgroundColor: '#0c2d5a' }}
                          >
                            ✓
                          </div>
                        </div>
                        <p className="ml-4 text-lg text-gray-700 leading-relaxed">
                          {highlight}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Career Opportunities */}
        {program.careerOutcomes && (
          <section className="py-16 bg-gray-50">
            <div className="container">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-16"
                >
                  <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#0c2d5a' }}>
                    Career Opportunities
                  </h2>
                  <p className="text-xl text-gray-600">
                    Upon completion, you'll be qualified for these roles
                  </p>
                </motion.div>

                <div className="flex flex-wrap gap-4 justify-center">
                  {program.careerOutcomes.map((outcome: string, index: number) => (
                    <motion.span 
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="px-6 py-3 rounded-full font-medium text-lg border-2"
                      style={{
                        backgroundColor: 'rgba(12, 45, 90, 0.1)',
                        color: '#0c2d5a',
                        borderColor: 'rgba(12, 45, 90, 0.2)'
                      }}
                    >
                      {outcome}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Real Talk Section */}
        {program.realTalk && (
          <section className="py-16 bg-white">
            <div className="container">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="p-8 rounded-2xl border-l-4" 
                  style={{ 
                    backgroundColor: 'rgba(12, 45, 90, 0.05)',
                    borderColor: '#0c2d5a'
                  }}
                >
                  <h3 className="text-2xl font-bold mb-4" style={{ color: '#0c2d5a' }}>Real Talk</h3>
                  <p className="text-xl text-gray-700 italic leading-relaxed">
                    {program.realTalk}
                  </p>
                </motion.div>
              </div>
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section className="py-16" style={{ backgroundColor: '#0c2d5a' }}>
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                  Ready to Transform Your Career?
                </h2>
                <p className="text-xl text-white/90 mb-8 leading-relaxed">
                  Join our {program.title} and take the first step towards a successful career in technology. 
                  Get in touch with our team to learn more about enrollment and requirements.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <motion.button
                    onClick={handleApplyNow}
                    className="inline-block px-8 py-4 text-lg font-bold rounded-full transition-all duration-300 border-0 cursor-pointer"
                    style={{
                      backgroundColor: 'white',
                      color: '#0c2d5a',
                      border: '2px solid white'
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Apply Now
                  </motion.button>
                  <motion.button
                    onClick={handleGetHelp}
                    className="inline-block px-8 py-4 text-lg font-bold rounded-full transition-all duration-300 border-0 cursor-pointer"
                    style={{
                      backgroundColor: 'transparent',
                      color: 'white',
                      border: '2px solid white'
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Help
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default TrainingProgramDetail