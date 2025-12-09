import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const CareerSupport: React.FC = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const supportServices = [
    {
      name: 'Resume Building',
      description: 'Professional resume writing and portfolio development to showcase your skills effectively.'
    },
    {
      name: 'Interview Preparation',
      description: 'Mock interviews and coaching to help you gain confidence in job interviews.'
    },
    {
      name: 'Job Placement',
      description: 'Direct connections with partner companies actively hiring our graduates.'
    },
    {
      name: 'Mentorship',
      description: 'Ongoing support from industry professionals even after graduation.'
    },
    {
      name: 'Freelancing Guidance',
      description: 'Learn how to start and grow your freelance business in tech.'
    },
    {
      name: 'Continuous Learning',
      description: 'Access to advanced courses and workshops to keep your skills current.'
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
          <h2 className="heading-xl mb-6" style={{ color: '#0c2d5a' }}>Career Support Services</h2>
          <p className="text-lead max-w-4xl mx-auto">
            Our commitment to your success doesn't end at graduation. We provide comprehensive career support to ensure you land your dream job.
          </p>
        </motion.div>

        {/* Career Support Services */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {supportServices.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-100 group hover:shadow-xl transition-all duration-300"
            >
              <div className="text-center mb-6">
                <h3 className="font-semibold text-xl mb-3" style={{ color: '#0c2d5a' }}>{service.name}</h3>
              </div>
              <p className="text-neutral-700 leading-relaxed text-center">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-br from-[#0c2d5a]/5 to-[#0c2d5a]/10 rounded-2xl p-12 border border-[#0c2d5a]/10 shadow-lg">
            <h3 className="heading-md mb-4" style={{ color: '#0c2d5a' }}>Ready to Start Your Career Journey?</h3>
            <p className="text-lg mb-6 text-neutral-700 max-w-2xl mx-auto">
              Join our comprehensive program and get access to all these career support services. We're here to help you succeed every step of the way.
            </p>
            <motion.button
              onClick={() => window.location.href = '/contact'}
              className="btn btn-primary inline-block border-0 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Apply Now
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CareerSupport