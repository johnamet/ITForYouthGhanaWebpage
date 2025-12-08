import React, { useState } from 'react'
import SEO from '../../../components/SEO'
import Hero from '../../../components/shared/Hero'
import { motion } from 'framer-motion'
import { partnershipOptions } from '../../partners/components/partnershipData'
import { getImagePath } from '../../../utils/randomImages'

const Businesses: React.FC = () => {
  // Map partnership titles to URLs
  const getPartnershipUrl = (title: string) => {
    const urlMap: { [key: string]: string } = {
      'Educational Partnerships': '/partnerships/educational-partnerships',
      'Corporate Sponsorship': '/partnerships/corporate-sponsorship',
      'Government Collaboration': '/partnerships/government-collaboration',
      'NGO & Foundation Partnerships': '/partnerships/ngo-and-foundation-partnerships',
      'International Development': '/partnerships/international-development',
      'Technology Partners': '/partnerships/technology-partners'
    }
    return urlMap[title] || '/contact'
  }


  return (
    <>
      <SEO
        title="For Businesses - IT for Youth Ghana"
        description="Partner with us to access job-ready tech talent. Corporate training, recruitment pipeline, and CSR opportunities with Ghana's leading tech education NGO."
        canonical="/opportunities/businesses"
      />
      
      <div className="min-h-screen">
        <Hero
          title="Partner with Purpose"
          subtitle="For Businesses"
          description="Transform lives while advancing your business goals through meaningful partnerships that create lasting impact in Ghana's tech ecosystem."
          primaryCta={{ text: "Partner With Us", action: () => window.location.href = '/contact' }}
        />

        {/* Programs & Initiatives Section - Homepage Style */}
        <section className="section bg-white">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="heading-xl mb-6" style={{ color: '#0c2d5a' }}>Partnership Opportunities</h2>
              <p className="text-lead max-w-3xl mx-auto text-neutral-700">
                Collaborate with us to create meaningful impact while achieving your business goals and corporate social responsibility objectives.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {partnershipOptions.map((partnership, index) => (
                <motion.div
                  key={partnership.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="h-full"
                >
                  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-full border flex flex-col" style={{ borderColor: 'rgba(12, 45, 90, 0.1)' }}>
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden rounded-t-xl flex-shrink-0">
                      <img 
                        src={partnership.image} 
                        alt={partnership.title}
                        className="w-full h-full object-cover transition-transform duration-500"
                      />
                      <div className="absolute inset-0 rounded-t-xl" style={{ backgroundColor: 'rgba(12, 45, 90, 0.2)' }}></div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex-grow">
                        {/* Title */}
                        <h3 className="heading-sm mb-4 transition-colors duration-300" style={{ color: '#0c2d5a' }}>
                          {partnership.title}
                        </h3>
                        
                        {/* Description */}
                        <p className="text-body text-gray-600 leading-relaxed">
                          {partnership.description}
                        </p>
                      </div>

                      {/* Button - Always at bottom */}
                      <div className="mt-6">
                        <motion.a
                          href={getPartnershipUrl(partnership.title)}
                          className="w-full text-center block"
                          style={{
                            padding: '12px 24px',
                            borderRadius: '50px',
                            background: 'white',
                            color: '#0c2d5a',
                            fontWeight: '600',
                            fontSize: '14px',
                            border: '2px solid #0c2d5a',
                            boxShadow: '0 6px 20px rgba(12, 45, 90, 0.2)',
                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            cursor: 'pointer',
                            textDecoration: 'none'
                          }}
                          whileHover={{
                            y: -2,
                            scale: 1.02
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 10px 25px rgba(12, 45, 90, 0.3)'
                            e.currentTarget.style.background = '#0c2d5a'
                            e.currentTarget.style.color = 'white'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(12, 45, 90, 0.2)'
                            e.currentTarget.style.background = 'white'
                            e.currentTarget.style.color = '#0c2d5a'
                          }}
                        >
                          Learn More
                        </motion.a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>


        {/* Partners Section */}
        <section className="section bg-white">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="heading-xl mb-6" style={{ color: '#0c2d5a' }}>Our Partners</h2>
              <p className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
                Working together with organizations that share our vision of empowering youth through technology education and creating sustainable impact across Ghana.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mb-20">
              {[
                getImagePath('/images/partnerorga/Download.jpg'),
                getImagePath('/images/partnerorga/Download.jpg'),
                getImagePath('/images/partnerorga/Download (2).jpg'),
                getImagePath('/images/partnerorga/Download (3).jpg'),
                getImagePath('/images/partnerorga/Download (4).jpg'),
                getImagePath('/images/partnerorga/Download (5).jpg'),
                getImagePath('/images/partnerorga/Download (6).jpg'),
                getImagePath('/images/partnerorga/Download.jpg'),
                getImagePath('/images/partnerorga/Download (1).jpg')
              ].map((logo, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
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
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-100"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 mb-4 flex items-center justify-center overflow-hidden rounded-lg bg-neutral-50">
                      <img 
                        src={logo} 
                        alt="Strategic Partner Logo"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    
                    <div className="text-center">
                      <p className="text-xs font-semibold opacity-70" style={{ color: '#0c2d5a' }}>
                        Strategic Partner
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div 
                className="bg-gradient-to-br rounded-2xl p-12 border shadow-lg"
                style={{ 
                  backgroundColor: 'rgba(12, 45, 90, 0.05)',
                  borderColor: 'rgba(12, 45, 90, 0.1)'
                }}
              >
                <h3 className="heading-md mb-4" style={{ color: '#0c2d5a' }}>Become a Partner</h3>
                <p className="text-lg mb-6 text-neutral-700 max-w-2xl mx-auto">
                  Join our network of partners and help us expand our impact. Together, we can create more opportunities for Ghana's youth to thrive in the digital economy.
                </p>
                <motion.a
                  href="/contact"
                  className="btn btn-primary inline-block"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Partner With Us
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </>
  )
}

export default Businesses