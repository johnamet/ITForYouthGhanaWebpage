import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getImagePath } from '../../../utils/randomImages'

const Impact: React.FC = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const opportunities = [
    {
      title: 'For Students & Graduates',
      description: 'Professional 6-month tech training programs with job placement support and real-world project experience.',
      image: getImagePath('/images/randomPictures/girlstaslkingUX.jpg'),
      link: '/opportunities/students-graduates'
    },
    {
      title: 'For Businesses',  
      description: 'Access to job-ready tech talent, corporate training programs and strategic partnership opportunities.',
      image: getImagePath('/images/randomPictures/whiteLady.jpg'),
      link: '/opportunities/businesses'
    },
    {
      title: 'For Volunteers',
      description: 'Make an impact in your community through teaching support, outreach programs and event management.',
      image: getImagePath('/images/randomPictures/mireiotalking.jpg'),
      link: '/opportunities/volunteers'
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
          <h2 className="heading-xl mb-6" style={{ color: '#0c2d5a' }}>Get Involved</h2>
          <p className="text-lead max-w-4xl mx-auto">
            Whether you're a student looking to build a tech career, a business seeking skilled talent, 
            or someone wanting to volunteer your time and expertise, we have opportunities for you to make a difference.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {opportunities.map((opportunity, index) => (
            <motion.div
              key={opportunity.title}
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
                    src={opportunity.image} 
                    alt={opportunity.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 rounded-t-xl" style={{ backgroundColor: 'rgba(12, 45, 90, 0.2)' }}></div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  {/* Title */}
                  <h3 className="heading-sm mb-4 transition-colors duration-300" style={{ color: '#0c2d5a' }}>
                    {opportunity.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-body text-gray-600 mb-6 leading-relaxed flex-grow">
                    {opportunity.description}
                  </p>

                  {/* Button - Always at bottom */}
                  <div className="mt-6">
                    <Link 
                    to={opportunity.link}
                    className="w-full text-center block"
                    style={{
                      padding: '12px 24px',
                      borderRadius: '50px',
                      background: 'white',
                      color: '#0c2d5a',
                      textDecoration: 'none',
                      fontWeight: '600',
                      fontSize: '14px',
                      border: '2px solid #0c2d5a',
                      boxShadow: '0 6px 20px rgba(12, 45, 90, 0.2)',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(12, 45, 90, 0.3)'
                      e.currentTarget.style.background = '#0c2d5a'
                      e.currentTarget.style.color = 'white'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)'
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(12, 45, 90, 0.2)'
                      e.currentTarget.style.background = 'white'
                      e.currentTarget.style.color = '#0c2d5a'
                    }}
                  >
                    Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Impact