import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { getImagePath } from '../../../utils/randomImages'

const StatsSection: React.FC = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const impactStats = [
    { value: '250+', label: 'Youth Trained', description: 'In Digital Skills and Tech Empowerment' },
    { value: '800+', label: 'Students Reached', description: 'Through Tech Outreach in 20 Schools' },
    { value: '40%', label: 'Female Participation', description: 'Breaking barriers in tech industry' },
    { value: '85%', label: 'Employment Success', description: 'Graduates find work or start businesses' }
  ]

  return (
    <section ref={ref} className="section bg-white">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="heading-xl mb-6" style={{ color: '#0c2d5a' }}>Our Impact in Numbers</h2>
          <p className="text-lead text-center max-w-3xl mx-auto">
            Real results from our commitment to transforming lives through technology education
          </p>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {impactStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              className="text-center group"
            >
              <div className="rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300" style={{ backgroundColor: '#0c2d5a' }}>
                <div className="text-4xl md:text-5xl font-bold text-white mb-3 group-hover:scale-105 transition-transform duration-300">
                  {stat.value}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {stat.label}
                </h3>
                <p className="text-sm text-white/80">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Large Feature Images Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-20"
        >
          <h3 className="heading-lg mb-12 text-center" style={{ color: '#0c2d5a' }}>Our Programs in Action</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Large Image 1 */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="relative"
            >
              <img 
                src={getImagePath("/images/randomPictures/peterblackboard.jpg")} 
                alt="Tech training session with instructor" 
                className="rounded-2xl shadow-lg w-full h-80 object-cover"
              />
              <div className="absolute inset-0 rounded-2xl" style={{ backgroundColor: 'rgba(12, 45, 90, 0.3)' }}></div>
              <div className="absolute bottom-6 left-6 right-6 rounded-xl p-4 text-white" style={{ backgroundColor: 'rgba(12, 45, 90, 0.95)' }}>
                <h4 className="text-lg font-semibold text-white mb-2">Hands-On Training</h4>
                <p className="text-sm text-white/90">Interactive learning sessions with experienced instructors</p>
              </div>
            </motion.div>

            {/* Large Image 2 */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="relative"
            >
              <img 
                src={getImagePath("/images/randomPictures/groupofgirlsentrance.jpg")} 
                alt="Female students in tech education" 
                className="rounded-2xl shadow-lg w-full h-80 object-cover"
              />
              <div className="absolute inset-0 rounded-2xl" style={{ backgroundColor: 'rgba(12, 45, 90, 0.3)' }}></div>
              <div className="absolute bottom-6 left-6 right-6 rounded-xl p-4 text-white" style={{ backgroundColor: 'rgba(12, 45, 90, 0.95)' }}>
                <h4 className="text-lg font-semibold text-white mb-2">Women in Tech</h4>
                <p className="text-sm text-white/90">Empowering young women through technology education</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Key Initiatives with Clean Layout */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h3 className="heading-lg mb-12 text-center" style={{ color: '#0c2d5a' }}>Our Key Initiatives</h3>
          
          <div className="grid md:grid-cols-2 gap-16">
            {/* Tech Empowerment Initiative */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="space-y-6"
            >
              <div className="relative">
                <img 
                  src={getImagePath("/images/randomPictures/redstudentgrouplesson.jpg")} 
                  alt="Students working together" 
                  className="rounded-xl w-full h-48 object-cover shadow-lg"
                />
                <div className="absolute inset-0 rounded-xl" style={{ backgroundColor: 'rgba(12, 45, 90, 0.2)' }}></div>
              </div>
              
              <div>
                <div className="flex items-center mb-4">
                  <span className="text-4xl font-bold" style={{ color: '#0c2d5a' }}>200+</span>
                  <h4 className="text-lg font-semibold ml-4" style={{ color: '#0c2d5a' }}>Youth Adults Trained in Digital Skills</h4>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Tech Empowerment for Employment and Entrepreneurship Initiative - Through our six-month training program, we have equipped 200 youth aged 12-24 with essential IT skills, including coding, web development, graphic design, and data analytics.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  By combining practical learning with internships, we prepare participants for careers in tech or to launch their own entrepreneurial ventures.
                </p>
              </div>
            </motion.div>

            {/* Tech Outreach Initiative */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="space-y-6"
            >
              <div className="relative">
                <img 
                  src={getImagePath("/images/randomPictures/maingraduationpic.jpg")} 
                  alt="Graduation ceremony" 
                  className="rounded-xl w-full h-48 object-cover shadow-lg"
                />
                <div className="absolute inset-0 rounded-xl" style={{ backgroundColor: 'rgba(12, 45, 90, 0.2)' }}></div>
              </div>
              
              <div>
                <div className="flex items-center mb-4">
                  <span className="text-4xl font-bold" style={{ color: '#0c2d5a' }}>800+</span>
                  <h4 className="text-lg font-semibold ml-4" style={{ color: '#0c2d5a' }}>Students Impacted Through Outreach</h4>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Tech Outreach Initiative - Through our Tech Awareness Outreach initiative, we've visited 20 schools to spark interest in technology careers, inspiring students to start their digital journey early.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Our outreach programs focus on bridging the digital divide by introducing students to the possibilities in technology and encouraging them to pursue STEM education.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default StatsSection