// CHANGED: Kompakte Kern-Benefits (3-4 Punkte) für Home-Seite
// CHANGED: Kompakte Kern-Benefits (3-4 Punkte) für Home-Seite
import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { content } from '../../../data/content/index'
import { getImagePath } from '../../../utils/randomImages'


const Vision: React.FC = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section ref={ref} className="section bg-white">
      <div className="container">
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

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <img 
              src={getImagePath("/images/randomPictures/studentsblueclothing.jpg")} 
              alt="Students learning technology" 
              className="rounded-2xl shadow-lg w-full h-80 object-cover"
            />
            <div className="absolute inset-0 rounded-2xl" style={{ backgroundColor: 'rgba(12, 45, 90, 0.2)' }}></div>
            <div className="absolute bottom-4 left-4 rounded-lg p-4 text-white" style={{ backgroundColor: 'rgba(12, 45, 90, 0.95)' }}>
              <p className="text-sm font-semibold text-white">Building Ghana's Tech Future</p>
              <p className="text-xs text-white opacity-90">Through inclusive technology education</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="heading-lg mb-6" style={{ color: '#0c2d5a' }}>Our Mission</h3>
            <p className="text-body mb-6 leading-relaxed">
              We provide practical technology education that leads to real employment opportunities. Our focus is on underserved communities and ensuring that women have equal access to tech careers.
            </p>
            
          </motion.div>
        </div>

        {/* Statistics Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {content.hero.stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.8 + (index * 0.1),
                  type: "spring",
                  stiffness: 100
                }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#0c2d5a' }}>
                  {stat.number}
                </div>
                <p className="text-sm font-medium text-neutral-800">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Vision