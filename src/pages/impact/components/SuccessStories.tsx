import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { content } from '../../../data/content/index'
import { getImagePath } from '../../../utils/randomImages'

interface SuccessStory {
  name: string
  age: number
  role: string
  company: string
  quote: string
  image: string
  program: string
  year: string
}

interface SuccessStoriesProps {}

const SuccessStories: React.FC<SuccessStoriesProps> = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const successStories: SuccessStory[] = content.impact.stories.concat([
    {
      name: 'Elisabeth Awartey',
      age: 25,
      role: 'Database Management Specialist',
      company: 'Bank of Ghana',
      quote: 'IT For Youth Ghana completely changed my perspective on technology. The skills I acquired opened doors I never thought possible.',
      image: getImagePath('/images/people/elisabeth.jpg'),
      program: 'Rural Tech Connect',
      year: '2022'
    },
    {
      name: 'Benedicta Konadu',
      age: 23,
      role: 'Graphic Designer',
      company: 'Creative Agency Kumasi',
      quote: 'The support I received fueled my growth and gave me the courage to pursue my dreams in the design world.',
      image: getImagePath('/images/people/benedicta.jpg'),
      program: 'Girls in Tech Program',
      year: '2021'
    },
    {
      name: 'Danielle Mensah',
      age: 22,
      role: 'Web Developer',
      company: 'Freelancer',
      quote: 'I came with no skills, but now I have built a website! This program changed my life.',
      image: getImagePath('/images/people/danielle.jpg'),
      program: 'Code Impact Challenge',
      year: '2023'
    }
  ])

  return (
    <section ref={ref} className="section bg-neutral-50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="heading-xl mb-6">Success Stories</h2>
          <p className="text-lead text-center max-w-3xl mx-auto">
            Meet our graduates who are now leading Ghana's tech industry
          </p>
        </motion.div>

        {/* Moderne Success Stories Grid */}
        <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {successStories.slice(0, 3).map((story, index) => (
            <motion.div
              key={story.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-100 group relative overflow-hidden"
            >
              {/* Quote Background */}
              <div className="absolute top-4 right-4 text-6xl text-primary/5 font-serif">"</div>
              
              {/* Profile Section */}
              <div className="flex items-start space-x-4 mb-6">
                <motion.div 
                  className="relative flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <img 
                    src={story.image} 
                    alt={story.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-primary/20"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                </motion.div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-1">{story.name}</h3>
                  <p className="text-primary font-medium text-sm mb-1">{story.role}</p>
                  <p className="text-neutral-700 text-xs">{story.company}</p>
                </div>
                
                <div className="text-right">
                  <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
                    {story.year}
                  </span>
                </div>
              </div>

              {/* Quote */}
              <blockquote className="text-neutral-700 leading-relaxed mb-6 italic relative z-10">
                "{story.quote}"
              </blockquote>

              {/* Program Badge */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center bg-gradient-to-r from-primary/10 to-accent/10 text-primary text-xs font-medium px-3 py-1 rounded-full border border-primary/20">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  {story.program}
                </span>
                <div className="text-neutral-800">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SuccessStories