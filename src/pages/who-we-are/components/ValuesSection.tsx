import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { getImagePath } from '../../../utils/randomImages'

const ValuesSection: React.FC = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const values = [
    {
      title: 'Inclusion',
      description: 'We believe technology education should be accessible to everyone, regardless of background, gender, or location.',
      image: getImagePath('/images/randomPictures/studentgroupguys.jpg')
    },
    {
      title: 'Empowerment', 
      description: 'Our programs are designed to give participants the skills, confidence, and opportunities to transform their lives.',
      image: getImagePath('/images/randomPictures/whiteLady.jpg')
    },
    {
      title: 'Innovation',
      description: 'We continuously adapt our curriculum and methods to meet evolving industry needs and community challenges.',
      image: getImagePath('/images/randomPictures/studentsblueclothing.jpg')
    },
    {
      title: 'Community',
      description: 'Strong communities are built through collaboration, mutual support, and shared commitment to growth.',
      image: getImagePath('/images/randomPictures/graduation.jpg')
    }
  ]

  return (
    <section ref={ref} className="section bg-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="heading-xl mb-6" style={{ color: '#0c2d5a' }}>Our Values</h2>
          <p className="text-lead max-w-4xl mx-auto">
            The principles that guide everything we do and shape our approach to education and community development
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-full border flex flex-col" style={{ borderColor: 'rgba(12, 45, 90, 0.1)' }}>
                {/* Image */}
                <div className="relative h-48 overflow-hidden rounded-t-xl flex-shrink-0">
                  <img 
                    src={value.image} 
                    alt={value.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 rounded-t-xl" style={{ backgroundColor: 'rgba(12, 45, 90, 0.2)' }}></div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex-grow">
                    {/* Title */}
                    <h3 className="heading-sm mb-4 transition-colors duration-300" style={{ color: '#0c2d5a' }}>
                      {value.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-body text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>

                  {/* Value indicator - Always at bottom */}
                  <div className="mt-6">
                    <div className="flex justify-center">
                      <div 
                        className="w-16 h-1 rounded-full transition-all duration-500 group-hover:w-24"
                        style={{ backgroundColor: '#0c2d5a' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="rounded-2xl p-8 border" style={{ backgroundColor: 'rgba(12, 45, 90, 0.05)', borderColor: 'rgba(12, 45, 90, 0.1)' }}>
            <h3 className="heading-md mb-4" style={{ color: '#0c2d5a' }}>Join Our Mission</h3>
            <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
              Help us empower Ghanaian youth with technology skills and opportunities for a brighter future.
            </p>
            <motion.a
              href="https://www.globalgiving.org/projects/coding-and-digital-skills-for-1000-girls-in-ghana/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3"
              style={{
                padding: '16px 32px',
                borderRadius: '50px',
                background: '#0c2d5a',
                color: 'white',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '16px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 25px rgba(12, 45, 90, 0.3)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
              whileHover={{ scale: 1.05, y: -2 }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(12, 45, 90, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(12, 45, 90, 0.3)'
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Support Our Values
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ValuesSection