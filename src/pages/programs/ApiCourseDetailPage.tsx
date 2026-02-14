import React from 'react'
import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import SEO from '../../components/SEO'
import { useCourses } from '../../hooks/useCourses'

const ApiCourseDetailPage: React.FC = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>()
  const { courses, loading, error, retry } = useCourses()

  const course = courseSlug ? courses.find(item => item.slug === courseSlug) : null

  const priceLabel = course
    ? (course.pricing.isFree
      ? 'Free'
      : `${course.pricing.currency} ${course.pricing.amount.toLocaleString()}`)
    : ''

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-28">
        <div className="container py-20 text-center">
          <div className="inline-block w-10 h-10 rounded-full border-4 border-slate-200 border-t-primary animate-spin mb-4" />
          <p className="text-slate-600">Loading course details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white pt-28">
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Unable to load course details</h1>
          <p className="text-slate-600 mb-6">{error.message}</p>
          <button className="btn btn-primary" onClick={retry}>
            Try Again
          </button>
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
      </>
    )
  }

  return (
    <>
      <SEO
        title={`${course.title} Course Details`}
        description={course.shortDescription || course.description}
        canonical={`/programs/course/${course.slug}`}
        ogType="article"
      />

      <div className="min-h-screen bg-white pt-24">
        <section className="relative py-16 overflow-hidden" style={{ backgroundColor: '#0c2d5a' }}>
          <div className="container relative z-10">
            <nav className="text-sm text-white/70 mb-8">
              <Link to="/" className="hover:text-white">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/programs" className="hover:text-white">Programs</Link>
              <span className="mx-2">/</span>
              <span className="text-white">{course.title}</span>
            </nav>

            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white">
                    {course.level}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white">
                    {course.category}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{course.title}</h1>
                <p className="text-lg text-white/90 mb-8">
                  {course.shortDescription || course.description}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-white/70 text-xs mb-1">Duration</p>
                    <p className="text-white font-semibold">{course.duration.displayText}</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-white/70 text-xs mb-1">Price</p>
                    <p className="text-white font-semibold">{priceLabel}</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-white/70 text-xs mb-1">Status</p>
                    <p className="text-white font-semibold capitalize">{course.status}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link to="/who-can-apply" className="btn bg-white text-primary hover:bg-white/90">
                    Apply Now
                  </Link>
                  <Link to="/programs" className="btn border border-white text-white hover:bg-white/10">
                    Back to Programs
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-[380px] object-cover rounded-2xl shadow-2xl"
                />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-4 text-slate-900">About This Course</h2>
              <p className="text-slate-700 leading-relaxed mb-10">{course.description}</p>

              {course.skills && course.skills.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-2xl font-semibold mb-4 text-slate-900">Skills You Will Learn</h3>
                  <div className="flex flex-wrap gap-2">
                    {course.skills.map(skill => (
                      <span key={skill} className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-2xl font-semibold mb-4 text-slate-900">Prerequisites</h3>
                  <ul className="space-y-2">
                    {course.prerequisites.map(item => (
                      <li key={item} className="text-slate-700">• {item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {course.outcomes && course.outcomes.length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold mb-4 text-slate-900">Outcomes</h3>
                  <ul className="space-y-2">
                    {course.outcomes.map(item => (
                      <li key={item} className="text-slate-700">• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default ApiCourseDetailPage
