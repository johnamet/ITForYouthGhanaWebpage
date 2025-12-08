import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SEO from '../../components/SEO'
import Hero from '../../components/shared/Hero'
import { navigateToPage } from '../../utils/navigation'
import { getImagePath } from '../../utils/randomImages'

const Testimonials: React.FC = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const handleJoinThem = () => {
    navigateToPage('/contact')
  }

  const testimonials = [
    {
      name: 'Elisabeth Awartey',
      age: 25,
      role: 'Database Management Specialist',
      company: 'Bank of Ghana',
      quote: 'IT For Youth Ghana completely changed my perspective on technology. The skills I acquired opened doors I never thought possible.',
      image: getImagePath('/images/people/elisabeth.jpg'),
      program: 'Data Analytics Program',
      year: '2022'
    },
    {
      name: 'Benedicta Konadu',
      age: 23,
      role: 'Graphic Designer',
      company: 'Creative Agency Kumasi',
      quote: 'The support I received fueled my growth and gave me the courage to pursue my dreams in the design world.',
      image: getImagePath('/images/people/benedicta.jpg'),
      program: 'UI/UX Design Program',
      year: '2021'
    },
    {
      name: 'Danielle Mensah',
      age: 22,
      role: 'Web Developer',
      company: 'Freelancer',
      quote: 'I came with no skills, but now I have built multiple websites! This program changed my life completely.',
      image: getImagePath('/images/people/danielle.jpg'),
      program: 'Software Development Program',
      year: '2023'
    },
    {
      name: 'Emmanuel Mensah',
      age: 28,
      role: 'IT Instructor',
      company: 'IT for Youth Ghana',
      quote: 'From student to instructor - this organization gave me skills and now I give back by teaching others.',
      image: getImagePath('/images/people/emmanuel.jpg'),
      program: 'Software Development Program',
      year: '2020'
    },
    {
      name: 'Peter Duodu',
      age: 35,
      role: 'Founder & Executive Director',
      company: 'IT for Youth Ghana',
      quote: 'Seeing young people transform their lives through technology motivates me every day to expand our reach.',
      image: getImagePath('/images/people/peter.jpg'),
      program: 'Founder',
      year: '2019'
    }
  ]

  return (
    <>
      <SEO
        title="Success Stories & Testimonials - IT for Youth Ghana"
        description="Read inspiring stories from our graduates who transformed their careers through technology education. Real impact, real success stories."
        canonical="/testimonials"
      />
      
      <div id="main-content" className="min-h-screen bg-white pt-24">
        <Hero
          title="Success Stories"
          subtitle="Real People, Real Impact"
          description="Meet our graduates who have transformed their lives and careers through our programs. Their success is our success, and every story inspires us to reach more young people across Ghana."
          primaryCta={{ text: "Join Them", action: handleJoinThem }}
          secondaryCta={{ text: "Read Stories", action: () => document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' }) }}
        />
        
        {/* Testimonials Section */}
        <section 
          id="testimonials" 
          ref={ref} 
          className="section bg-white"
        >
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="heading-xl mb-6" style={{ color: '#0c2d5a' }}>Graduate Stories</h2>
              <p className="text-lead max-w-4xl mx-auto">
                From students to professionals, from dreams to reality. These are the stories of transformation that inspire us every day.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.3 } }}
                  className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 group text-center"
                >
                  <div className="mb-8">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-32 h-32 rounded-full object-cover mx-auto border-4 transition-all duration-300"
                      style={{ borderColor: '#0c2d5a' }}
                    />
                  </div>

                  <blockquote className="text-neutral-700 text-xl leading-relaxed italic font-medium">
                    "{testimonial.quote}"
                  </blockquote>
                </motion.div>
              ))}
            </div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-center mt-24"
            >
              <div 
                className="rounded-2xl p-12 border shadow-lg"
                style={{ 
                  backgroundColor: 'rgba(12, 45, 90, 0.05)',
                  borderColor: 'rgba(12, 45, 90, 0.1)'
                }}
              >
                <h3 className="heading-md mb-4" style={{ color: '#0c2d5a' }}>Ready to Write Your Success Story?</h3>
                <p className="text-lg mb-8 text-neutral-700 max-w-3xl mx-auto">
                  Join hundreds of graduates who have transformed their careers and are now 
                  making an impact in Ghana's growing tech industry.
                </p>
                
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2" style={{ color: '#0c2d5a' }}>2000+</div>
                    <div className="text-neutral-600">Lives Transformed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2" style={{ color: '#0c2d5a' }}>85%</div>
                    <div className="text-neutral-600">Find Employment</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2" style={{ color: '#0c2d5a' }}>70%</div>
                    <div className="text-neutral-600">Are Women</div>
                  </div>
                </div>
                
                <motion.button
                  className="btn btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleJoinThem}
                >
                  Start Your Journey Today
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      
    </>
  )
}

export default Testimonials