import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { getImagePath } from '../../../utils/randomImages'

const MissionSection: React.FC = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section ref={ref} className="section bg-white">
      <div className="container">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="heading-xl mb-6" style={{ color: '#0c2d5a' }}>Our Vision & Mission</h2>
          <p className="text-lead max-w-4xl mx-auto">
            We are Ghana's leading NGO dedicated to bridging the digital divide through 
            inclusive technology education, with a special focus on empowering women and 
            underserved communities.
          </p>
        </motion.div>

        {/* Mission Section - Text left, Image right */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="heading-lg mb-6" style={{ color: '#0c2d5a' }}>Our Mission</h3>
            <p className="text-body mb-6 leading-relaxed">
              To bridge the digital divide by empowering underserved youth with high-quality IT education and career development training. We foster innovation, digital entrepreneurship, and equitable opportunities.
            </p>
            <p className="text-body leading-relaxed font-semibold" style={{ color: '#0c2d5a' }}>
              Focusing on women, physically challenged individuals, and financially disadvantaged students.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <img 
              src={getImagePath("/images/randomPictures/group_girls.jpg")} 
              alt="Female students in tech education" 
              className="rounded-2xl shadow-lg w-full h-80 object-cover"
            />
            <div className="absolute inset-0 rounded-2xl" style={{ backgroundColor: 'rgba(12, 45, 90, 0.2)' }}></div>
            <div className="absolute bottom-4 left-4 rounded-lg p-4 text-white" style={{ backgroundColor: 'rgba(12, 45, 90, 0.95)' }}>
              <p className="text-sm font-semibold text-white">Empowering Women in Tech</p>
              <p className="text-xs text-white opacity-90">40% female enrollment in our programs</p>
            </div>
          </motion.div>
        </div>

        {/* Vision Section - Image left, Text right */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <img 
              src={getImagePath("/images/randomPictures/graduations.jpg")} 
              alt="Graduation ceremony success" 
              className="rounded-2xl shadow-lg w-full h-80 object-cover"
            />
            <div className="absolute inset-0 rounded-2xl" style={{ backgroundColor: 'rgba(12, 45, 90, 0.2)' }}></div>
            <div className="absolute bottom-4 left-4 rounded-lg p-4 text-white" style={{ backgroundColor: 'rgba(12, 45, 90, 0.95)' }}>
              <p className="text-sm font-semibold text-white">Our Vision</p>
              <p className="text-xs text-white opacity-90">250+ youth trained and employed</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="heading-lg mb-6" style={{ color: '#0c2d5a' }}>Our Vision</h3>
            <p className="text-body mb-6 leading-relaxed">
              To create a future where all youth, regardless of their background, have access to transformative technology education and opportunities, empowering them to drive innovation, build sustainable careers, and contribute meaningfully to the digital economy.
            </p>
            <p className="text-body leading-relaxed font-semibold" style={{ color: '#0c2d5a' }}>
              Building Ghana's next generation of tech leaders and innovators.
            </p>
          </motion.div>
        </div>

        {/* Why We Exist Section - Balanced with more images */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h3 className="heading-lg mb-6" style={{ color: '#0c2d5a' }}>Why We Exist</h3>
            <h4 className="text-xl font-semibold mb-6" style={{ color: '#0c2d5a' }}>Bridging the Opportunity Gap in Technology</h4>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* Challenge Column */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="space-y-6"
            >
              <div className="relative">
                <img 
                  src={getImagePath("/images/randomPictures/petertalkingtostudentscoloful.jpg")} 
                  alt="Teaching technology skills" 
                  className="rounded-xl object-cover h-48 w-full"
                />
                <div className="absolute inset-0 rounded-xl" style={{ backgroundColor: 'rgba(12, 45, 90, 0.3)' }}></div>
              </div>
              <p className="text-body leading-relaxed">
                Access to technology education is a privilege not afforded to many young people in Ghana. Financial constraints, lack of infrastructure, and limited awareness create barriers for talented individuals.
              </p>
            </motion.div>

            {/* Solution Column */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="space-y-6"
            >
              <div className="relative">
                <img 
                  src={getImagePath("/images/randomPictures/groupworkstudents.jpg")} 
                  alt="Students learning together" 
                  className="rounded-xl object-cover h-48 w-full"
                />
                <div className="absolute inset-0 rounded-xl" style={{ backgroundColor: 'rgba(12, 45, 90, 0.3)' }}></div>
              </div>
              <p className="text-body leading-relaxed">
                We're leveling the playing field by offering innovative programs that transform challenges into opportunities. Our hands-on approach ensures practical skills that lead to real employment.
              </p>
            </motion.div>

            {/* Impact Column */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="space-y-6"
            >
              <div className="relative">
                <img 
                  src={getImagePath("/images/randomPictures/UX4.jpg")} 
                  alt="Modern tech learning environment" 
                  className="rounded-xl object-cover h-48 w-full"
                />
                <div className="absolute inset-0 rounded-xl" style={{ backgroundColor: 'rgba(12, 45, 90, 0.3)' }}></div>
              </div>
              <p className="text-body leading-relaxed">
                Every training session, outreach program, and partnership brings us closer to a Ghana where every youth can thrive in the digital age. We're building the future, one student at a time.
              </p>
            </motion.div>
          </div>

          {/* Bottom Image Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <img 
              src={getImagePath("/images/randomPictures/happystudentscasual.jpg")} 
              alt="Happy students" 
              className="rounded-lg object-cover h-32 w-full"
            />
            <img 
              src={getImagePath("/images/randomPictures/studentpresenting.jpg")} 
              alt="Student presenting project" 
              className="rounded-lg object-cover h-32 w-full"
            />
            <img 
              src={getImagePath("/images/randomPictures/frontalgraduation.jpg")} 
              alt="Graduation ceremony" 
              className="rounded-lg object-cover h-32 w-full"
            />
            <img 
              src={getImagePath("/images/randomPictures/girlstaslkingUX.jpg")} 
              alt="Girls discussing UX" 
              className="rounded-lg object-cover h-32 w-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default MissionSection