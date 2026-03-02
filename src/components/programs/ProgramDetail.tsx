import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { Course } from '../../types/course'
import { fetchCourseById, generateApplyUrl } from '../../lib/api/courseApi'
import SEO from '../SEO'

const ProgramDetail: React.FC = () => {
  const { programId } = useParams<{ programId: string }>()
  const navigate = useNavigate()

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isApplying, setIsApplying] = useState(false)

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setLoading(true)
        if (!programId) {
          navigate('/404')
          return
        }

        const data = await fetchCourseById(programId)
        if (!data) {
          navigate('/404')
          return
        }

        setCourse(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load course details')
      } finally {
        setLoading(false)
      }
    }

    loadCourse()
  }, [programId, navigate])

  const handleApply = async () => {
    if (!course) return

    try {
      setIsApplying(true)
      const data = await generateApplyUrl(course.id)

      if (data && data.apply_url) {
        window.location.href = data.apply_url
      } else if (course.portalApplyUrl) {
        window.location.href = course.portalApplyUrl
      } else {
        window.location.href = 'https://portal.itforyouthghana.org/register'
      }
    } catch (err) {
      console.error('Failed to get apply URL', err)
      // Fallback redirect
      window.location.href = course.portalApplyUrl || 'https://portal.itforyouthghana.org/register'
    } finally {
      setIsApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-32 flex justify-center pb-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-white pt-32 flex flex-col items-center justify-center pb-20">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Oops!</h2>
        <p className="text-gray-600">{error || 'Course not found'}</p>
        <button onClick={() => navigate('/programs')} className="mt-8 btn btn-primary">
          Back to Programs
        </button>
      </div>
    )
  }

  return (
    <>
      <SEO
        title={`${course.title} - IT for Youth Ghana`}
        description={course.shortDescription || course.description}
        canonical={`/programs/${course.id}`}
        ogImage={course.image}
      />

      <div id="main-content" className="min-h-screen bg-white pt-24">
        {/* Course Hero */}
        <section className="relative py-24 overflow-hidden" style={{ backgroundColor: '#0c2d5a' }}>
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center text-white">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-4 py-1 rounded-full bg-accent/20 text-accent font-semibold mb-6">
                  {course.category} • {course.level.charAt(0).toUpperCase()}{course.level.slice(1)}
                </span>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                  {course.title}
                </h1>
                <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                  {course.shortDescription || course.description.slice(0, 150)}
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={handleApply}
                    disabled={isApplying}
                    className="btn bg-accent text-white hover:bg-accent/90 border-0 px-8 py-4 text-lg"
                  >
                    {isApplying ? 'Processing...' : (course.pricing.isFree ? 'Apply for Free' : `Enroll for ${course.pricing.amount} ${course.pricing.currency}`)}
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Program Image & Quick Stats */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8 mb-12 transform -translate-y-24">
                {[
                  { label: 'Duration', value: course.duration.displayText, icon: '⏱️' },
                  { label: 'Format', value: 'Online / Blended', icon: '💻' },
                  { label: 'Skill Level', value: course.level.charAt(0).toUpperCase() + course.level.slice(1), icon: '📈' }
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + (idx * 0.1) }}
                    className="bg-white rounded-xl shadow-lg p-6 text-center"
                  >
                    <div className="text-3xl mb-3">{stat.icon}</div>
                    <div className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">{stat.label}</div>
                    <div className="text-xl font-bold text-primary">{stat.value}</div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="rounded-2xl overflow-hidden shadow-2xl bg-white"
              >
                {course.image && (
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full max-h-[500px] object-cover"
                  />
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Program Description */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-8 text-primary">
                  About this Course
                </h2>
                <div
                  className="prose prose-lg max-w-none text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: course.description }}
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Technologies & Skills */}
        {course.skills && course.skills.length > 0 && (
          <section className="py-16 bg-gray-50 border-t border-gray-100">
            <div className="container">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-3xl font-bold mb-8 text-primary text-center">
                    What You'll Learn
                  </h2>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {course.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-white text-primary border border-gray-200 rounded-full font-medium shadow-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section className="py-20" style={{ backgroundColor: '#0c2d5a' }}>
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                  Ready to start learning?
                </h2>
                <p className="text-xl text-white/80 mb-10 leading-relaxed">
                  Join our community of thousands of students and transform your career with {course.title}.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleApply}
                    disabled={isApplying}
                    className="btn bg-accent text-white hover:bg-accent/90 border-0 px-10 py-4 text-lg font-bold min-w-[200px]"
                  >
                    {isApplying ? 'Processing...' : 'Enroll Now'}
                  </button>
                  <button
                    onClick={() => navigate('/contact')}
                    className="btn bg-transparent text-white border-2 border-white/30 hover:bg-white/10 px-8 py-4 text-lg font-bold"
                  >
                    Contact Us
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default ProgramDetail
