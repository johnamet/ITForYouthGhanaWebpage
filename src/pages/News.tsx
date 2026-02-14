import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import Hero from '../components/shared/Hero'
import { content } from '../data/content'

interface NewsItem {
  title: string
  date: string
  category: 'Program' | 'Impact' | 'Partnership'
  summary: string
}

const News: React.FC = () => {
  const updates: NewsItem[] = [
    {
      title: content.programs.current[0]?.title || 'Current Program Cohort Update',
      date: 'January 2026',
      category: 'Program',
      summary: content.programs.current[0]?.description || 'Our active cohort continues with practical project delivery and mentorship.'
    },
    {
      title: content.programs.future[0]?.title || 'Upcoming Program Launch',
      date: 'February 2026',
      category: 'Program',
      summary: content.programs.future[0]?.description || 'New training opportunities are being prepared for the next intake cycle.'
    },
    {
      title: 'Graduate Outcomes and Employment Progress',
      date: 'December 2025',
      category: 'Impact',
      summary: content.impact.outcomes[0] || 'Our graduates continue to move into internships, employment, and entrepreneurship pathways.'
    },
    {
      title: 'Expanded Collaboration with Local and International Partners',
      date: 'November 2025',
      category: 'Partnership',
      summary: 'We are deepening collaborations with organizations that strengthen training quality and job pathways for youth.'
    }
  ]

  const stories = content.impact.stories.slice(0, 2)

  const categoryStyles: Record<NewsItem['category'], string> = {
    Program: 'bg-blue-100 text-blue-700',
    Impact: 'bg-emerald-100 text-emerald-700',
    Partnership: 'bg-amber-100 text-amber-700'
  }

  return (
    <>
      <SEO
        title="News & Updates"
        description="Latest updates from IT for Youth Ghana programs, partnerships, and community impact."
        canonical="/news"
      />
      <div className="min-h-screen bg-white pt-24">
        <Hero
          title="News & Updates"
          subtitle="What We Are Building Right Now"
          description="Track program milestones, partner collaborations, and outcomes from across our learning community."
          primaryCta={{
            text: 'View Programs',
            action: () => { window.location.href = '/programs' }
          }}
          secondaryCta={{
            text: 'Contact Team',
            action: () => { window.location.href = '/contact' }
          }}
        />

        <section className="section bg-white">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="heading-xl mb-4" style={{ color: '#0c2d5a' }}>Latest Updates</h2>
              <p className="text-lead max-w-3xl mx-auto">
                Recent highlights from our programs and operations.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {updates.map((item, index) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryStyles[item.category]}`}>
                      {item.category}
                    </span>
                    <span className="text-sm text-slate-500">{item.date}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-slate-900">{item.title}</h3>
                  <p className="text-slate-700 leading-relaxed">{item.summary}</p>
                </motion.article>
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
              <h2 className="heading-xl mb-4" style={{ color: '#0c2d5a' }}>From Our Community</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {stories.map((story, index) => (
                <motion.div
                  key={story.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200"
                >
                  <p className="text-slate-700 italic mb-4">"{story.quote}"</p>
                  <p className="font-semibold text-slate-900">{story.name}</p>
                  <p className="text-sm text-slate-500">{story.role} - {story.company}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link to="/impact" className="btn btn-primary">
                Explore Full Impact
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default News
