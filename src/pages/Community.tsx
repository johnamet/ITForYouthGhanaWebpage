import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import Hero from '../components/shared/Hero'
import { content } from '../data/content'

const Community: React.FC = () => {
  return (
    <>
      <SEO
        title="Community Outreach"
        description="How IT for Youth Ghana works with learners, families, volunteers, and partners to build long-term local impact."
        canonical="/community"
      />
      <div className="min-h-screen bg-white pt-24">
        <Hero
          title="Community Outreach"
          subtitle="Building Skills, Confidence, and Opportunity"
          description="Our programs are designed with local communities and delivered in ways that improve long-term outcomes for learners and families."
          primaryCta={{
            text: 'Volunteer',
            action: () => { window.location.href = '/opportunities/volunteers' }
          }}
          secondaryCta={{
            text: 'Partner With Us',
            action: () => { window.location.href = '/partnerships' }
          }}
        />

        <section id="community-focus" className="section bg-white">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="heading-xl mb-4" style={{ color: '#0c2d5a' }}>Our Community Focus</h2>
              <p className="text-lead max-w-3xl mx-auto">
                We combine practical tech education with mentorship, inclusion, and ongoing support.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {content.about.values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="rounded-2xl border border-slate-200 p-6 bg-white"
                >
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">{value.title}</h3>
                  <p className="text-slate-700 text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="section bg-neutral-50">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="heading-xl mb-4" style={{ color: '#0c2d5a' }}>Impact Snapshot</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {content.hero.stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="rounded-2xl bg-white border border-slate-200 p-6 text-center"
                >
                  <p className="text-3xl font-bold text-primary mb-2">{stat.number}</p>
                  <p className="font-semibold text-slate-900 mb-2">{stat.label}</p>
                  <p className="text-sm text-slate-600">{stat.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 p-8">
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">How You Can Contribute</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Link to="/opportunities/volunteers" className="btn btn-secondary text-center">Volunteer With Us</Link>
                <Link to="/who-can-apply" className="btn btn-secondary text-center">Refer a Learner</Link>
                <Link to="/partnerships" className="btn btn-secondary text-center">Start a Partnership</Link>
                <Link to="/donate" className="btn btn-secondary text-center">Support Through Donation</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Community
