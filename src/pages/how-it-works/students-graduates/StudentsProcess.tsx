import React, { useRef, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import SEO from '../../../components/SEO'
import Hero from '../../../components/shared/Hero'
import { navigateToPage } from '../../../utils/navigation'

const StudentsProcess: React.FC = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 }) // Reduced threshold for faster trigger

  const handleStartApplication = () => {
    navigateToPage('/programs')
  }

  // Memoize steps to prevent re-renders
  const steps = useMemo(() => [
    {
      step: 1,
      title: 'Application',
      description: 'Complete our online application form with your background and motivation',
      duration: '5-10 minutes',
      hasButton: true
    },
    {
      step: 2,
      title: 'Interview',
      description: 'Brief conversation about your goals, motivation, and program fit',
      duration: '30 minutes'
    },
    {
      step: 3,
      title: 'Program Selection',
      description: 'Choose your program based on interests and career goals with our guidance',
      duration: '1 week'
    },
    {
      step: 4,
      title: 'Training',
      description: 'Intensive hands-on training with experienced instructors and real projects',
      duration: '6 months'
    },
    {
      step: 5,
      title: 'Career Support',
      description: 'Job placement assistance, resume building, and interview preparation',
      duration: 'Ongoing'
    }
  ], [])

  return (
    <>
      <SEO
        title="How It Works - For Students & Graduates"
        description="Step-by-step guide to joining our programs. From application to career placement - here's your journey to a tech career."
        canonical="/how-it-works/students-graduates"
      />
      
      <div id="main-content" className="min-h-screen bg-white pt-24">
        <Hero
          title="Your Path to Tech Career"
          subtitle="How It Works - For Students & Graduates"
          description="A clear, step-by-step path from application to career placement. We guide you every step of the way."
        />
        
        <section ref={ref} className="section bg-white">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="relative timeline-container">
                {/* Timeline Linie in der Mitte */}
                <div className="timeline-line absolute left-1/2 top-0 bottom-0 w-0.5 transform -translate-x-1/2" style={{ backgroundColor: 'rgba(12, 45, 90, 0.2)' }}></div>
                
                {steps.map((step, index) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ 
                      duration: window.innerWidth <= 768 ? 0.3 : 0.6, 
                      delay: window.innerWidth <= 768 ? index * 0.05 : index * 0.1,
                      ease: "easeOut"
                    }}
                    className={`relative mb-12 flex step-container ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    {/* Timeline Punkt in der Mitte */}
                    <div className="timeline-point absolute left-1/2 top-6 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold z-10" style={{ backgroundColor: '#0c2d5a' }}>
                      {step.step}
                    </div>
                    
                    {/* Inhaltskarte - abwechselnd links und rechts */}
                    <div className={`content-card w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-full border p-6" style={{ borderColor: 'rgba(12, 45, 90, 0.1)' }}>
                        <div className={`flex flex-col header-container ${index % 2 === 0 ? 'sm:flex-row-reverse' : 'sm:flex-row'} sm:items-center sm:justify-between mb-3`}>
                          <h3 className="heading-sm" style={{ color: '#0c2d5a' }}>{step.title}</h3>
                          <span className="text-sm font-medium mt-1 sm:mt-0 px-2 py-1 rounded-full" style={{ color: '#0c2d5a', backgroundColor: 'rgba(12, 45, 90, 0.1)' }}>{step.duration}</span>
                        </div>
                        <p className="text-body text-gray-600 mb-4 leading-relaxed">{step.description}</p>
                        
                        {/* CTA-Button nur im ersten Schritt */}
                        {step.hasButton && (
                          <motion.button
                            className={`button-alignment ${index % 2 === 0 ? 'ml-auto' : ''}`}
                            style={{
                              padding: '12px 24px',
                              borderRadius: '50px',
                              background: '#0c2d5a',
                              color: 'white',
                              border: 'none',
                              fontWeight: '600',
                              fontSize: '14px',
                              cursor: 'pointer',
                              boxShadow: '0 4px 15px rgba(12, 45, 90, 0.3)',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)'
                              e.currentTarget.style.boxShadow = '0 6px 20px rgba(12, 45, 90, 0.4)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0) scale(1)'
                              e.currentTarget.style.boxShadow = '0 4px 15px rgba(12, 45, 90, 0.3)'
                            }}
                            whileHover={window.innerWidth > 768 ? { scale: 1.05 } : {}}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            onClick={handleStartApplication}
                          >
                            Start Application
                          </motion.button>
                        )}
                      </div>
                    </div>
                    
                    {/* Leerer Bereich für die andere Seite */}
                    <div className="empty-space w-5/12"></div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-center mt-16"
            >
              <div className="rounded-2xl p-8 border" style={{ backgroundColor: 'rgba(12, 45, 90, 0.05)', borderColor: 'rgba(12, 45, 90, 0.1)' }}>
                <h3 className="heading-md mb-4" style={{ color: '#0c2d5a' }}>Ready to Get Started?</h3>
                <p className="text-lg mb-6 max-w-2xl mx-auto text-gray-700">
                  Applications are rolling admission. Start your application today and begin your journey to a tech career.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartApplication}
                  style={{
                    padding: '16px 32px',
                    borderRadius: '50px',
                    background: '#0c2d5a',
                    color: 'white',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: '16px',
                    cursor: 'pointer',
                    boxShadow: '0 8px 25px rgba(12, 45, 90, 0.3)',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(12, 45, 90, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)'
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(12, 45, 90, 0.3)'
                  }}
                >
                  Begin Application
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Mobile-optimized CSS with performance improvements */}
      <style>{`
        /* Performance optimizations for mobile */
        @media (max-width: 768px) {
          /* Enable hardware acceleration */
          .step-container {
            transform: translateZ(0);
            will-change: transform, opacity;
          }
          
          /* Optimize animations for mobile */
          .timeline-point,
          .content-card {
            backface-visibility: hidden;
            transform: translateZ(0);
          }
          
          /* Reduce motion for better performance */
          .timeline-container {
            position: relative !important;
          }
          
          /* Timeline Linie links positionieren auf Mobile */
          .timeline-line {
            left: 20px !important;
            transform: none !important;
            background-color: rgba(12, 45, 90, 0.2) !important;
          }
          
          /* Alle Steps als single column auf Mobile */
          .step-container {
            flex-direction: column !important;
            margin-bottom: 24px !important;
            padding-left: 40px !important;
          }
          
          /* Timeline Punkt links positionieren */
          .timeline-point {
            left: 20px !important;
            top: 8px !important;
            transform: none !important;
            width: 32px !important;
            height: 32px !important;
          }
          
          /* Content Card full width auf Mobile */
          .content-card {
            width: 100% !important;
            padding: 0 !important;
            text-align: left !important;
          }
          
          /* Empty space entfernen auf Mobile */
          .empty-space {
            display: none !important;
          }
          
          /* Header immer links ausrichten auf Mobile */
          .header-container {
            flex-direction: column !important;
            align-items: flex-start !important;
            text-align: left !important;
          }
          
          /* Button immer links ausrichten auf Mobile */
          .button-alignment {
            margin-left: 0 !important;
            align-self: flex-start !important;
          }
        }
      `}</style>
    </>
  )
}

export default StudentsProcess