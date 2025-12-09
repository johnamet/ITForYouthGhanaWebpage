import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { getImagePath } from '../../../utils/randomImages'

const QuickOverview: React.FC = () => {
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
          <h2 className="heading-xl mb-6" style={{ color: '#0c2d5a' }}>Transforming Lives Through Technology</h2>
          <p className="text-lead max-w-4xl mx-auto">
            We are Ghana's leading NGO dedicated to bridging the digital divide through 
            inclusive technology education, with a special focus on empowering women and 
            underserved communities.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="heading-lg mb-6" style={{ color: '#0c2d5a' }}>Why We Exist</h3>
            <p className="text-body mb-6 leading-relaxed">
              Ghana's tech industry is growing rapidly, but many young people lack 
              access to quality technology education. We bridge this gap with professional 
              training programs that prepare students for real careers.
            </p>
            <div className="rounded-xl p-6 border" style={{ backgroundColor: 'rgba(12, 45, 90, 0.05)', borderColor: 'rgba(12, 45, 90, 0.1)' }}>
              <p className="text-body text-neutral-700 leading-relaxed">
                Our programs focus on <span className="font-semibold" style={{ color: '#0c2d5a' }}>inclusive technology education</span>, 
                with special emphasis on empowering women and underserved communities. 
                We provide comprehensive training that leads to real employment opportunities 
                and sustainable career paths in Ghana's growing tech industry.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <img 
              src={getImagePath("/images/randomPictures/studentslistening.jpg")} 
              alt="Students learning technology" 
              className="rounded-2xl shadow-lg w-full h-80 object-cover"
            />
            <div className="absolute inset-0 rounded-2xl" style={{ backgroundColor: 'rgba(12, 45, 90, 0.2)' }}></div>
            <div className="absolute bottom-4 left-4 rounded-lg p-4 text-white" style={{ backgroundColor: 'rgba(12, 45, 90, 0.95)' }}>
              <p className="text-sm font-semibold text-white">Empowering Ghana's Youth</p>
              <p className="text-xs text-white opacity-90">Through technology education and mentorship</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default QuickOverview