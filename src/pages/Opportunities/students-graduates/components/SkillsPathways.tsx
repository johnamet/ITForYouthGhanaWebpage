import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const SkillsPathways: React.FC = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const pathways = [
    {
      title: 'Frontend Development',
      description: 'Build beautiful, interactive user interfaces',
      skills: ['HTML/CSS', 'JavaScript', 'React', 'Responsive Design'],
      outcome: 'Frontend Developer, UI Developer',
      
    },
    {
      title: 'Backend Development', 
      description: 'Create robust server-side applications',
      skills: ['Python/Node.js', 'Databases', 'APIs', 'Cloud Deployment'],
      outcome: 'Backend Developer, Full-Stack Developer',
      
    },
    {
      title: 'Data Analysis',
      description: 'Transform data into actionable insights',
      skills: ['Excel', 'Python', 'SQL', 'Data Visualization'],
      outcome: 'Data Analyst, Business Intelligence Analyst',
     
    },
    {
      title: 'Digital Design',
      description: 'Design engaging digital experiences',
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Thinking'],
      outcome: 'UI/UX Designer, Product Designer',
    
    }
  ]

  return (
    <section ref={ref} className="section bg-neutral-50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="heading-xl mb-6" style={{ color: '#0c2d5a' }}>Career Pathways</h2>
          <p className="text-lead text-center max-w-4xl mx-auto">
            Choose your path and build the specific skills needed to succeed in your chosen tech career.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {pathways.map((pathway, index) => (
            <motion.div
              key={pathway.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start space-x-4 mb-6">
               
                <div className="flex-1">
                  <h3 className="heading-sm mb-2" style={{ color: '#0c2d5a' }}>{pathway.title}</h3>
                  <p className="text-body text-neutral-600">{pathway.description}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold text-neutral-800 mb-3">Core Skills:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {pathway.skills.map((skill, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#0c2d5a' }}></div>
                      <span className="text-sm text-neutral-700">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(12, 45, 90, 0.1)' }}>
                <h4 className="font-semibold mb-2" style={{ color: '#0c2d5a' }}>Career Outcome:</h4>
                <p className="text-sm text-neutral-700">{pathway.outcome}</p>
              </div>
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
            <h3 className="heading-md mb-4" style={{ color: '#0c2d5a' }}>Not Sure Which Path to Choose?</h3>
            <p className="text-lg mb-6 text-neutral-700 max-w-2xl mx-auto">
            Our career counselors will help you identify the best path based on your interests, 
            skills, and career goals. </p>
            <motion.button
              onClick={() => window.location.href = '/contact'}
              className="btn btn-primary inline-block border-0 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Career Guidance
            </motion.button>
          </div>
        </motion.div>

      


      

      </div>
    </section>
  )
}

export default SkillsPathways