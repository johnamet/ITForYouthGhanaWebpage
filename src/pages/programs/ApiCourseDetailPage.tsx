import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import SEO from '../../components/SEO'
import { useCourses } from '../../hooks/useCourses'
import { generateApplyUrl } from '../../lib/api/courseApi'

const ApiCourseDetailPage: React.FC = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>()
  const { courses, loading, error, retry } = useCourses()
  const [applyLoading, setApplyLoading] = useState(false)

  const course = courseSlug ? courses.find(item => item.slug === courseSlug || item.id === courseSlug) : null

  const priceLabel = course
    ? (course.pricing.isFree
      ? 'Free'
      : `${course.pricing.currency} ${course.pricing.amount.toLocaleString()}`)
    : ''

  const ctaLabel = course?.pricing.isFree ? 'Enroll Free' : 'Apply Now'

  const handleApplyClick = useCallback(async () => {
    if (!course) return

    setApplyLoading(true)
    try {
      const result = await generateApplyUrl(course.slug || course.id, {
        source: 'main_site',
        medium: 'web',
        campaign: 'course_detail',
      })

      if (result?.apply_url) {
        window.location.href = result.apply_url
      } else if (course.portalApplyUrl) {
        // Fallback to the portal apply URL from course data
        window.location.href = course.portalApplyUrl
      } else {
        window.location.href = `https://portal.itforyouthghana.org/register?course_id=${course.id}&ref=main_site`
      }
    } catch {
      // Ultimate fallback
      if (course.portalApplyUrl) {
        window.location.href = course.portalApplyUrl
      } else {
        window.location.href = `https://portal.itforyouthghana.org/register?course_id=${course.id}&ref=main_site`
      }
    } finally {
      setApplyLoading(false)
    }
  }, [course])

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-28">
        <div className="container py-20">
          {/* Skeleton Hero */}
          <div className="animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-48 mb-8"></div>
            <div className="grid lg:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="h-7 w-20 bg-slate-200 rounded-full"></div>
                  <div className="h-7 w-24 bg-slate-200 rounded-full"></div>
                </div>
                <div className="h-12 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-100 rounded w-full"></div>
                <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="h-20 bg-slate-100 rounded-xl"></div>
                  <div className="h-20 bg-slate-100 rounded-xl"></div>
                  <div className="h-20 bg-slate-100 rounded-xl"></div>
                </div>
              </div>
              <div className="h-80 bg-slate-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white pt-28">
        <div className="container py-20 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-3">Unable to load course details</h1>
            <p className="text-slate-600 mb-6">{error.message}</p>
            <button className="btn btn-primary" onClick={retry}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <>
        <SEO
          title="Course Not Found"
          description="The requested course could not be found."
          canonical="/programs"
          noindex={true}
        />
        <div className="min-h-screen bg-white pt-28">
          <div className="container py-20 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-4">Course Not Found</h1>
              <p className="text-slate-600 mb-8">
                The course you selected is unavailable or no longer listed.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link to="/programs" className="btn btn-primary">View Programs</Link>
                <Link to="/who-can-apply" className="btn btn-secondary">Apply</Link>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  const enrollmentCount = course.enrollment?.count || 0

  return (
    <>
      <SEO
        title={`${course.title} | IT for Youth Ghana`}
        description={course.shortDescription || course.description}
        canonical={`/programs/course/${course.slug}`}
        ogType="article"
        ogImage={course.image || undefined}
      />

      <div className="min-h-screen bg-white pt-24">
        {/* Hero Section */}
        <section className="relative py-16 lg:py-20 overflow-hidden" style={{ backgroundColor: '#0c2d5a' }}>
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-300 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="container relative z-10">
            {/* Breadcrumbs */}
            <nav className="text-sm text-white/60 mb-8" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/programs" className="hover:text-white transition-colors">Programs</Link>
              <span className="mx-2">/</span>
              <span className="text-white/90">{course.title}</span>
            </nav>

            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/15 text-white backdrop-blur-sm border border-white/10">
                    {course.level}
                  </span>
                  {course.category && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/15 text-white backdrop-blur-sm border border-white/10">
                      {course.category}
                    </span>
                  )}
                  {enrollmentCount > 0 && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 backdrop-blur-sm border border-emerald-400/20">
                      <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                      {enrollmentCount} enrolled
                    </span>
                  )}
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">{course.title}</h1>
                <p className="text-lg text-white/85 mb-8 leading-relaxed">
                  {course.shortDescription || course.description}
                </p>

                {/* Quick Info Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/5">
                    <p className="text-white/50 text-xs mb-1 font-medium">Duration</p>
                    <p className="text-white font-bold">{course.duration.displayText}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/5">
                    <p className="text-white/50 text-xs mb-1 font-medium">Price</p>
                    <p className={`font-bold ${course.pricing.isFree ? 'text-emerald-400' : 'text-white'}`}>
                      {priceLabel}
                    </p>
                  </div>
                  {course.startDate && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/5">
                      <p className="text-white/50 text-xs mb-1 font-medium">Start Date</p>
                      <p className="text-white font-bold">{course.startDate}</p>
                    </div>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleApplyClick}
                    disabled={applyLoading}
                    className={`inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full transition-all duration-300 shadow-lg ${course.pricing.isFree
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30'
                        : 'bg-white hover:bg-slate-50 text-primary shadow-white/20'
                      } ${applyLoading ? 'opacity-70 cursor-wait' : ''}`}
                  >
                    {applyLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Redirecting...
                      </>
                    ) : (
                      <>
                        {ctaLabel}
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </>
                    )}
                  </motion.button>
                  <Link
                    to="/programs"
                    className="inline-flex items-center px-6 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
                  >
                    Back to Programs
                  </Link>
                </div>
              </motion.div>

              {/* Course Image */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-[380px] object-cover rounded-2xl shadow-2xl ring-1 ring-white/10"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* About This Course */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold mb-4 text-slate-900">About This Course</h2>
                <p className="text-slate-700 leading-relaxed text-lg mb-10">{course.description}</p>
              </motion.div>

              {/* What You'll Learn */}
              {course.skills && course.skills.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-12"
                >
                  <h3 className="text-2xl font-bold mb-6 text-slate-900 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </span>
                    What You'll Learn
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {course.skills.map((skill, index) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.04 }}
                        className="bg-slate-50 rounded-xl px-4 py-3 text-center hover:shadow-md hover:bg-white transition-all duration-200 border border-slate-100"
                      >
                        <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center bg-primary/10">
                          <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-slate-700 font-medium text-sm">{skill}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Prerequisites */}
              {course.prerequisites && course.prerequisites.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-12"
                >
                  <h3 className="text-2xl font-bold mb-6 text-slate-900 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    Prerequisites
                  </h3>
                  <div className="bg-amber-50/50 rounded-xl p-6 border border-amber-100">
                    <ul className="space-y-3">
                      {course.prerequisites.map((prereq, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-slate-700">{prereq}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}

              {/* Outcomes */}
              {course.outcomes && course.outcomes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-12"
                >
                  <h3 className="text-2xl font-bold mb-6 text-slate-900 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </span>
                    Career Outcomes
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {course.outcomes.map((outcome, index) => (
                      <div key={index} className="flex items-center gap-3 bg-emerald-50/50 rounded-xl p-4 border border-emerald-100">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-slate-700 font-medium">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="relative py-16 overflow-hidden" style={{ backgroundColor: '#0c2d5a' }}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="md:flex items-center justify-between gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-8 md:mb-0"
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Ready to Start?
                  </h2>
                  <p className="text-lg text-white/80 mb-4">
                    Join {enrollmentCount > 0 ? `${enrollmentCount}+ learners` : 'our students'} and transform your career.
                  </p>
                  <div className="flex flex-wrap gap-5 text-white/80 text-sm">
                    {course.duration.displayText && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{course.duration.displayText}</span>
                      </div>
                    )}
                    {course.startDate && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Starts: {course.startDate}</span>
                      </div>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white rounded-2xl p-8 shadow-xl text-center min-w-[280px]"
                >
                  <div className="mb-4">
                    <span className="text-sm text-gray-500">Course Fee</span>
                    <p className={`text-3xl font-bold ${course.pricing.isFree ? 'text-emerald-600' : ''}`} style={course.pricing.isFree ? {} : { color: '#0c2d5a' }}>
                      {priceLabel}
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleApplyClick}
                    disabled={applyLoading}
                    className={`block w-full py-4 px-6 rounded-full font-semibold text-white transition-all duration-300 hover:opacity-90 hover:shadow-lg mb-4 ${course.pricing.isFree
                        ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30'
                        : 'shadow-blue-900/30'
                      } ${applyLoading ? 'opacity-70 cursor-wait' : ''}`}
                    style={course.pricing.isFree ? {} : { backgroundColor: '#0c2d5a' }}
                  >
                    {applyLoading ? 'Redirecting...' : ctaLabel}
                  </motion.button>

                  <p className="text-sm text-gray-500">
                    {course.pricing.isFree ? 'No payment required' : 'Limited spots available. Secure yours today!'}
                  </p>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <Link
                      to="/contact"
                      className="text-sm font-medium hover:underline"
                      style={{ color: '#0c2d5a' }}
                    >
                      Have questions? Contact us →
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default ApiCourseDetailPage
