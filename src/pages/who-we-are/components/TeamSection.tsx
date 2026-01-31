import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { getImagePath } from '../../../utils/randomImages'

const TeamSection: React.FC = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const coreTeam = [
    {
      name: 'Peter Duodu',
      role: 'Founder & Business Development Lead',
      image: getImagePath('/images/people/peter.jpg'),
      description: 'Founder and business strategist driving our mission forward. Holds a Master\'s in Accounting and Financial Research with extensive experience in youth training programs and digital inclusion.',
      email: 'peter@itforyouthghana.org',
      linkedin: 'https://www.linkedin.com/in/peter-duodu/',
      expertise: 'Business Strategy, Program Development, Marketing'
    },
    {
      name: 'Miréio Trinley',
      role: 'Software Dev',
      image: getImagePath('/images/people/white lady-Cover.jpg'),
      description: 'Software Dev',
      email: 'mireiotrinley@itforyouthghana.org',
      linkedin: 'https://www.linkedin.com/in/mireio-trinley',
      expertise: 'Software Development'
    },
{
  name: 'John Ametepe Agboku',
  role: 'Software Developer & Tech Moderator',
  image: getImagePath('/images/people/agboku1.jpg'),
  description: 'John Ametepe Agboku is a Software Developer and Tech Moderator at IT For Youth Ghana, dedicated to empowering young people through practical technology training and mentorship. He focuses on building accessible, scalable, and impactful digital solutions that prepare learners for real-world careers.',
  email: 'johnametepe@itforyouthghana.org',
  linkedin: 'https://www.linkedin.com/in/jaagboku/',
  github: 'https://github.com/johnamet',
  expertise: 'Software Development, Data Analytics, Tech Education, Mentorship'
},
  ]

  const boardMembers = [
    {
      name: 'Board Development',
      role: 'In Progress',
      background: 'Wir bauen unser Board of Directors gerade auf',
      expertise: 'Updates folgen in Kürze'
    },
    {
      name: 'Advisory Team',
      role: 'Coming Soon',
      background: 'Erfahrene Führungskräfte werden sich uns anschließen',
      expertise: 'Strategische Beratung & Governance'
    },
    {
      name: 'Strategic Partners',
      role: 'In Development',
      background: 'Partnerschaften mit Bildungsexperten',
      expertise: 'Weitere Ankündigungen folgen'
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
          <h2 className="heading-xl mb-6" style={{ color: '#0c2d5a' }}>Meet Our Team</h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Dedicated professionals and passionate advocates working together to transform lives through technology education across Ghana.
          </p>
        </motion.div>

        {/* Core Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {coreTeam.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-neutral-100 h-full flex flex-col"
              >
                <div className="relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto" style={{ border: '4px solid rgba(12, 45, 90, 0.2)' }}
                  />
                </div>

                <h4 className="text-xl font-bold mb-2" style={{ color: '#0c2d5a' }}>
                  {member.name}
                </h4>

                <p className="font-semibold mb-3" style={{ color: '#0c2d5a' }}>
                  {member.role}
                </p>

                <p className="text-sm text-neutral-600 mb-4 font-medium">
                  {member.expertise}
                </p>

                <p className="text-body text-sm leading-relaxed mb-6 flex-grow">
                  {member.description}
                </p>

                {/* Contact Links */}
                <div className="flex justify-center gap-3 mt-auto">
                  {member.linkedin !== '#' && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                      style={{
                        padding: '10px 16px',
                        fontSize: '13px',
                        fontWeight: '600',
                        textDecoration: 'none',
                        borderRadius: '50px',
                        background: '#0c2d5a',
                        color: 'white',
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 6px 20px rgba(12, 45, 90, 0.3)',
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        backdropFilter: 'blur(10px)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'
                        e.currentTarget.style.boxShadow = '0 10px 25px rgba(12, 45, 90, 0.4)'
                        e.currentTarget.style.background = '#0c2d5a'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)'
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(12, 45, 90, 0.3)'
                        e.currentTarget.style.background = '#0c2d5a'
                      }}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </a>
                  )}
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center gap-2"
                    style={{
                      padding: '10px 16px',
                      fontSize: '13px',
                      fontWeight: '600',
                      textDecoration: 'none',
                      borderRadius: '50px',
                      background: 'white',
                      color: '#0c2d5a',
                      border: '2px solid #0c2d5a',
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      backdropFilter: 'blur(10px)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)'
                      e.currentTarget.style.background = '#f8fafc'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)'
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.1)'
                      e.currentTarget.style.background = 'white'
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Board of Directors Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h3 className="heading-lg text-center mb-12" style={{ color: '#0c2d5a' }}>Board of Directors</h3>
          <p className="text-lead text-center mb-8 max-w-3xl mx-auto">
            Wir bauen gerade unser Board of Directors auf. Erfahrene Führungskräfte aus verschiedenen Bereichen werden uns strategische Beratung und Governance-Unterstützung bieten.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {boardMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="bg-gradient-to-br from-[#0c2d5a]/5 to-[#0c2d5a]/10 rounded-2xl p-6 border border-[#0c2d5a]/20 text-center"
              >
                <h4 className="text-lg font-bold mb-2" style={{ color: '#0c2d5a' }}>
                  {member.name}
                </h4>
                <p className="font-semibold mb-3" style={{ color: '#0c2d5a' }}>
                  {member.role}
                </p>
                <p className="text-sm text-neutral-600 mb-2">
                  {member.background}
                </p>
                <p className="text-xs text-neutral-500 font-medium">
                  {member.expertise}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Team Categories */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20"
        >
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h4 className="text-xl font-semibold mb-4" style={{ color: '#0c2d5a' }}>Board of Directors</h4>
              <p className="text-body leading-relaxed">
                Made up of individuals from diverse educational backgrounds, with vast years of experience guiding our strategic direction and ensuring organizational accountability.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h4 className="text-xl font-semibold mb-4" style={{ color: '#0c2d5a' }}>Technical Team</h4>
              <p className="text-body leading-relaxed">
                Team of Software and Computer Engineers, each bringing relevant skills in curriculum development, program management, and community engagement to deliver quality training.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h4 className="text-xl font-semibold mb-4" style={{ color: '#0c2d5a' }}>International Mentorship Team</h4>
              <p className="text-body leading-relaxed">
                These are experienced professionals across Europe and Africa who empower our beneficiaries and guide them with their experience in various technology fields.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h4 className="text-xl font-semibold mb-4" style={{ color: '#0c2d5a' }}>Community Volunteers</h4>
              <p className="text-body leading-relaxed">
                Dedicated volunteers who support our outreach programs, mentor students, and help with event coordination across our various initiatives.
              </p>
            </div>
          </div>
        </motion.div>


        {/* Partnership CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-br from-[#0c2d5a]/5 to-[#0c2d5a]/10 rounded-2xl p-12 border border-[#0c2d5a]/10 shadow-lg">
            <h3 className="heading-md mb-4" style={{ color: '#0c2d5a' }}> Join Our Mission</h3>
            <p className="text-lg mb-6 text-neutral-700 max-w-2xl mx-auto">
            Ready to make an impact? Connect with our team and discover how you can contribute to transforming lives through technology education in Ghana.
            </p>
            <motion.a
              href="/contact"
              className="inline-block"
              style={{
                padding: '16px 32px',
                fontSize: '16px',
                fontWeight: '600',
                textDecoration: 'none',
                borderRadius: '50px',
                background: '#0c2d5a',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 25px rgba(1, 82, 190, 0.3)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                backdropFilter: 'blur(10px)'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(1, 82, 190, 0.4)'
                e.currentTarget.style.background = '#0c2d5a'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(1, 82, 190, 0.3)'
                e.currentTarget.style.background = '#0c2d5a'
              }}
            >
          Get In Touch
            </motion.a>
          </div>
        </motion.div>



      </div>
    </section>
  )
}

export default TeamSection
