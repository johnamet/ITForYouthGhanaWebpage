import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { getImagePath } from '../../../../utils/randomImages'

const SuccessStories: React.FC = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const highlights = [
    {
      name: 'Elisabeth Awartey',
      role: 'Database Specialist at Bank of Ghana',
      quote: '"The program completely changed my perspective on technology. Now I help manage critical data systems."',
      image: getImagePath('/images/people/elisabeth.jpg')
    },
    {
      name: 'Benedicta Konadu',
      role: 'Graphic Designer',
      quote: 'The design skills and mentorship gave me the confidence to pursue my creative dreams professionally.',
      image: getImagePath('/images/people/benedicta.jpg')
    },
    {
      name: 'Danielle Mensah',
      role: 'Web Developer',
      quote: 'From zero coding knowledge to building websites for clients. This program changed my life.',
      image: getImagePath('/images/people/danielle.jpg')
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
          <h2 className="heading-xl mb-6" style={{ color: '#0c2d5a' }}>Our Impact</h2>
          <p className="text-lead max-w-4xl mx-auto">
            Real stories from real people whose lives have been transformed through our programs.
          </p>
        </motion.div>

        {/* Success Stories */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {highlights.map((story, index) => (
            <motion.div
              key={story.name}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-100"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img 
                  src={story.image} 
                  alt={story.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold" style={{ color: '#0c2d5a' }}>{story.name}</h4>
                  <p className="text-sm text-neutral-600">{story.role}</p>
                </div>
              </div>
              <blockquote className="text-neutral-700 italic text-sm">
                "{story.quote}"
              </blockquote>
            </motion.div>
          ))}
        </div>

         {/* Partnership CTA */}
         <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-br rounded-2xl p-12 border shadow-lg" style={{ backgroundColor: 'rgba(12, 45, 90, 0.05)', borderColor: 'rgba(12, 45, 90, 0.1)' }}>
            <h3 className="heading-md mb-4" style={{ color: '#0c2d5a' }}>Transforming Ghana's Digital Future</h3>
            <p className="text-lg mb-6 text-neutral-700 max-w-2xl mx-auto">
            Join thousands of success stories and be part of Ghana's tech transformation.</p>
            <motion.a
              href="/contact"
              className="btn btn-primary inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Read More Stories
            </motion.a>
          </div>
        </motion.div>

       
      </div>
    </section>
  )
}

export default SuccessStories