import React from 'react'
import SEO from '../../../components/SEO'
import Hero from '../../../components/shared/Hero'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const trainingPrograms = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Digital Skills for Teams',
    description: 'Equip your workforce with essential digital competencies — from office productivity and collaboration tools to cybersecurity awareness and data literacy.',
    duration: '2–4 weeks',
    format: 'On-site or Virtual',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    title: 'Software Development Bootcamp',
    description: 'Intensive training in modern web and mobile development — React, Node.js, Python, and cloud technologies — tailored to your team\'s stack and goals.',
    duration: '6–12 weeks',
    format: 'Hybrid',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Data Analytics & AI',
    description: 'Transform your organization\'s decision-making with hands-on training in data analysis, visualization, machine learning fundamentals, and AI integration strategies.',
    duration: '4–8 weeks',
    format: 'Virtual or On-site',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Cybersecurity Awareness',
    description: 'Protect your business with comprehensive security training — phishing prevention, data protection best practices, compliance readiness, and incident response protocols.',
    duration: '1–2 weeks',
    format: 'On-site or Virtual',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Leadership & Digital Transformation',
    description: 'Executive-level training on leading digital transformation initiatives, technology strategy, change management, and building innovation cultures within organizations.',
    duration: '2–3 weeks',
    format: 'Workshop Series',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    title: 'Cloud & DevOps',
    description: 'Upskill your IT team in cloud infrastructure (AWS, Azure, GCP), containerization, CI/CD pipelines, and modern DevOps practices for faster, more reliable delivery.',
    duration: '4–6 weeks',
    format: 'Hybrid',
  },
]

const whyChooseUs = [
  {
    stat: '500+',
    label: 'Professionals Trained',
    description: 'Corporate employees upskilled across multiple industries',
  },
  {
    stat: '98%',
    label: 'Satisfaction Rate',
    description: 'Consistently high ratings from corporate training participants',
  },
  {
    stat: '40+',
    label: 'Organizations Served',
    description: 'From startups to large enterprises across Ghana and West Africa',
  },
  {
    stat: '85%',
    label: 'Skill Application',
    description: 'Participants applying new skills within 30 days of training',
  },
]

const processSteps = [
  {
    step: '01',
    title: 'Needs Assessment',
    description: 'We conduct a thorough analysis of your team\'s current skills, goals, and gaps to design a program that delivers measurable results.',
  },
  {
    step: '02',
    title: 'Custom Curriculum',
    description: 'Our experts build a tailored curriculum aligned with your industry, tech stack, and business objectives — no generic courses.',
  },
  {
    step: '03',
    title: 'Delivery & Coaching',
    description: 'Experienced instructors deliver hands-on training with real-world projects, mentoring, and ongoing support throughout the program.',
  },
  {
    step: '04',
    title: 'Impact Measurement',
    description: 'We measure outcomes with pre/post assessments, project deliverables, and ROI reporting so you can track the value of your investment.',
  },
]

const CorporateTraining: React.FC = () => {
  return (
    <>
      <SEO
        title="Corporate Training Programs - IT for Youth Ghana"
        description="Upskill your workforce with customized technology training programs. Digital skills, software development, data analytics, cybersecurity, and leadership training for organizations."
        canonical="/partnerships/corporate-training"
        ogType="website"
      />

      <div className="min-h-screen">
        <Hero
          title="Corporate Training"
          subtitle="Empower Your Workforce with Future-Ready Skills"
          description="Custom technology training programs designed to upskill your teams, accelerate digital transformation, and drive measurable business impact."
          primaryCta={{ text: 'Request a Training Proposal', action: () => window.location.href = '/contact' }}
          secondaryCta={{ text: 'View Our Programs', action: () => document.getElementById('training-programs')?.scrollIntoView({ behavior: 'smooth' }) }}
        />

        {/* Why Choose Us — Stats */}
        <section className="section bg-white">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <span className="inline-block py-1 px-4 rounded-full text-xs font-bold uppercase tracking-wider mb-4" style={{ backgroundColor: 'rgba(12, 45, 90, 0.08)', color: '#0c2d5a' }}>
                Trusted by Leading Organizations
              </span>
              <h2 className="heading-xl mb-4" style={{ color: '#0c2d5a' }}>Why Organizations Choose Us</h2>
              <p className="text-lead text-neutral-600 max-w-2xl mx-auto">
                We combine deep technical expertise with a passion for education to deliver training that sticks.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {whyChooseUs.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: '#0c2d5a' }}>{item.stat}</div>
                  <div className="font-bold text-sm mb-1" style={{ color: '#0c2d5a' }}>{item.label}</div>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Training Programs */}
        <section id="training-programs" className="section bg-neutral-50">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <h2 className="heading-xl mb-4" style={{ color: '#0c2d5a' }}>Training Programs</h2>
              <p className="text-lead text-neutral-600 max-w-3xl mx-auto">
                From foundational digital literacy to advanced AI and cloud computing — we design programs
                that match your team's level and your business goals.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trainingPrograms.map((program, index) => (
                <motion.div
                  key={program.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="bg-white rounded-2xl p-7 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 text-white"
                    style={{ backgroundColor: '#0c2d5a' }}
                  >
                    {program.icon}
                  </div>

                  <h3 className="heading-sm mb-3" style={{ color: '#0c2d5a' }}>{program.title}</h3>
                  <p className="text-body text-neutral-600 mb-5 flex-1 leading-relaxed">{program.description}</p>

                  {/* Meta Tags */}
                  <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-slate-100">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-600">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {program.duration}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-600">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {program.format}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="section bg-white">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <h2 className="heading-xl mb-4" style={{ color: '#0c2d5a' }}>How It Works</h2>
              <p className="text-lead text-neutral-600 max-w-2xl mx-auto">
                A proven process that ensures every training program delivers real, measurable impact.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {/* Connecting line (desktop) */}
              <div className="hidden lg:block absolute top-14 left-[12%] right-[12%] h-0.5" style={{ backgroundColor: 'rgba(12, 45, 90, 0.1)' }} />

              {processSteps.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.12 }}
                  className="text-center relative"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-5 relative z-10 shadow-lg"
                    style={{ backgroundColor: '#0c2d5a' }}
                  >
                    {item.step}
                  </div>
                  <h3 className="heading-sm mb-3" style={{ color: '#0c2d5a' }}>{item.title}</h3>
                  <p className="text-body text-neutral-600 text-sm leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Differentiators / What Sets Us Apart */}
        <section className="section" style={{ backgroundColor: '#0c2d5a' }}>
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <h2 className="heading-xl text-white mb-4">What Sets Us Apart</h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                We don't do cookie-cutter training. Every program is built around your people, your tech, and your goals.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Custom-Built Curricula',
                  description: 'Every program is designed from scratch based on your industry, team level, and strategic objectives.',
                  icon: '🎯',
                },
                {
                  title: 'Industry Practitioners',
                  description: 'Our trainers are working professionals — engineers, data scientists, and CTOs — not just academics.',
                  icon: '👩‍💻',
                },
                {
                  title: 'Hands-On Projects',
                  description: 'Participants build real solutions during training — no slides-only sessions. Projects can use your actual codebase.',
                  icon: '🔧',
                },
                {
                  title: 'Post-Training Support',
                  description: '30-day follow-up mentoring included with every program to ensure skills are applied on the job.',
                  icon: '🤝',
                },
                {
                  title: 'Flexible Delivery',
                  description: 'On-site at your office, virtual, or hybrid — we adapt to your team\'s schedule and location.',
                  icon: '📍',
                },
                {
                  title: 'ROI-Focused Reporting',
                  description: 'Pre/post skill assessments, project evaluations, and executive summaries so you can quantify impact.',
                  icon: '📊',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-colors duration-300"
                >
                  <div className="text-3xl mb-4">{item.icon}</div>
                  <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial / Social Proof */}
        <section className="section bg-neutral-50">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="heading-xl mb-10" style={{ color: '#0c2d5a' }}>What Our Clients Say</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-left">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-neutral-700 italic mb-4 leading-relaxed">
                    "The training transformed how our engineering team approaches problem-solving. The custom curriculum
                    addressed exactly the gaps we identified, and the hands-on projects gave our team immediately applicable skills."
                  </p>
                  <div>
                    <p className="font-bold text-sm" style={{ color: '#0c2d5a' }}>CTO, FinTech Startup</p>
                    <p className="text-xs text-slate-500">Software Development Bootcamp</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-left">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-neutral-700 italic mb-4 leading-relaxed">
                    "After the Digital Skills training, our administrative staff became dramatically more efficient. Processes that
                    took days now take hours. The ROI was clear within the first month."
                  </p>
                  <div>
                    <p className="font-bold text-sm" style={{ color: '#0c2d5a' }}>HR Director, Manufacturing Company</p>
                    <p className="text-xs text-slate-500">Digital Skills for Teams</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="section bg-white">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div
                className="rounded-2xl p-12"
                style={{
                  backgroundColor: 'rgba(12, 45, 90, 0.05)',
                  border: '1px solid rgba(12, 45, 90, 0.1)'
                }}
              >
                <h3 className="heading-lg mb-4" style={{ color: '#0c2d5a' }}>Ready to Upskill Your Team?</h3>
                <p className="text-lead mb-8 text-neutral-600">
                  Tell us about your team, your goals, and your timeline. We'll design a program that delivers real results.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.a
                    href="/contact"
                    className="btn btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Request a Proposal
                  </motion.a>
                  <motion.a
                    href="/partnerships/corporate-sponsorship"
                    className="btn btn-secondary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Looking to Sponsor Instead?
                  </motion.a>
                </div>

                <p className="text-sm text-slate-400 mt-6">
                  Not sure what you need? <Link to="/contact" className="font-semibold hover:underline" style={{ color: '#0c2d5a' }}>Let's chat</Link> — we'll help you figure it out.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}

export default CorporateTraining
