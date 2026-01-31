import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { getImagePath } from '../../../utils/randomImages'

const PartnersSection: React.FC = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const handlePartnerWithUs = () => {
    window.location.href = '/who-we-are/partners'
  }

  const partners = [
    {
      name: 'Partner Organization 1',
      image: getImagePath('/images/partnerorga/Download.jpg'),
      type: 'Strategic Partner'
    },
    {
      name: 'Partner Organization 2',
      image: getImagePath('/images/partnerorga/Download (1).jpg'),
      type: 'Technology Partner'
    },
    {
      name: 'Partner Organization 3',
      image: getImagePath('/images/partnerorga/Download (2).jpg'),
      type: 'Educational Partner'
    },
    {
      name: 'Partner Organization 4',
      image: getImagePath('/images/partnerorga/Download (3).jpg'),
      type: 'Community Partner'
    },
    {
      name: 'Partner Organization 5',
      image: getImagePath('/images/partnerorga/Download (4).jpg'),
      type: 'Strategic Partner'
    },
    {
      name: 'Partner Organization 6',
      image: getImagePath('/images/partnerorga/Download (5).jpg'),
      type: 'Technology Partner'
    },
    {
      name: 'Partner Organization 7',
      image: getImagePath('/images/partnerorga/Download (6).jpg'),
      type: 'Educational Partner'
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
          <h2 className="heading-xl mb-6" style={{ color: '#0c2d5a' }}>Our Partners</h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Working together with organizations that share our vision of empowering youth through technology education and creating sustainable impact across Ghana.
          </p>
        </motion.div>

        {/* Partners Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
        >
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.3 + index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{
                y: -10,
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-100 group"
            >
              <div className="flex flex-col items-center">
                <div className="w-24 h-16 mb-4 flex items-center justify-center overflow-hidden rounded-lg bg-neutral-50 transition-colors duration-300 p-2">
                  <img
                    src={partner.image}
                    alt={partner.name}
                    className="w-full h-full object-contain transition-all duration-300"
                  />
                </div>

              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Partnership CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-br from-[#0c2d5a]/5 to-[#0c2d5a]/10 rounded-2xl p-12 border border-[#0c2d5a]/10 shadow-lg">
            <h3 className="heading-md mb-4" style={{ color: '#0c2d5a' }}>Become a Partner</h3>
            <p className="text-lg mb-6 text-neutral-700 max-w-2xl mx-auto">
              Join our network of partners and help us expand our impact. Together, we can create more opportunities for Ghana's youth to thrive in the digital economy.
            </p>
            <motion.button
              onClick={handlePartnerWithUs}
              className="inline-block cursor-pointer border-0"
              style={{
                padding: '16px 32px',
                fontSize: '16px',
                fontWeight: '600',
                textDecoration: 'none',
                borderRadius: '50px',
                background: '#0c2d5a',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 25px rgba(12, 45, 90, 0.3)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                backdropFilter: 'blur(10px)'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(12, 45, 90, 0.4)'
                e.currentTarget.style.background = '#0c2d5a'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(12, 45, 90, 0.3)'
                e.currentTarget.style.background = '#0c2d5a'
              }}
            >
              Partner With Us
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default PartnersSection
