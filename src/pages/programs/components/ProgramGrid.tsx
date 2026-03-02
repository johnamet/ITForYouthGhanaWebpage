import React from 'react'
import { motion } from 'framer-motion'
import { Course } from '@/types/course'
import { useNavigate } from 'react-router-dom'

// Extended course type for UI presentation
export type UICourse = Course & {
  type?: string
  subtitle?: string
  completedDate?: string
  nextStart?: string
  displayStatus?: 'current' | 'past' | 'future'
}

interface ProgramGridProps {
  programs: UICourse[]
  activeFilter: 'current' | 'past' | 'future'
  loading?: boolean
  error?: Error | null
  onRetry?: () => void
}

// Loading skeleton component
const ProgramSkeleton: React.FC = () => (
  <div className="card overflow-hidden animate-pulse p-0">
    <div className="h-52 bg-slate-200"></div>
    <div className="p-6 space-y-3">
      <div className="flex gap-2">
        <div className="h-5 bg-slate-200 rounded-full w-20"></div>
        <div className="h-5 bg-slate-100 rounded-full w-14"></div>
      </div>
      <div className="h-5 bg-slate-200 rounded w-3/4"></div>
      <div className="h-3 bg-slate-100 rounded w-full"></div>
      <div className="h-3 bg-slate-100 rounded w-5/6"></div>
      <div className="flex justify-between pt-4 border-t border-slate-100 mt-4">
        <div className="h-4 bg-slate-200 rounded w-24"></div>
        <div className="h-4 bg-slate-200 rounded w-16"></div>
      </div>
    </div>
  </div>
)

const ProgramGrid: React.FC<ProgramGridProps> = ({
  programs,
  activeFilter,
  loading = false,
  error = null,
  onRetry
}) => {
  const navigate = useNavigate()

  // Show loading state
  if (loading && programs.length === 0) {
    return (
      <div className="responsive-grid responsive-grid-md-2 responsive-grid-lg-3 mb-16">
        {[...Array(6)].map((_, index) => (
          <ProgramSkeleton key={index} />
        ))}
      </div>
    )
  }

  // Show error state
  if (error && programs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-16 text-center"
      >
        <div className="inline-block rounded-2xl bg-red-50 p-10 max-w-md border border-red-100">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="heading-md text-red-900 mb-2">Unable to Load Courses</h3>
          <p className="text-red-600 mb-6 text-sm">
            {error.message || 'There was an error fetching the courses. Please try again.'}
          </p>
          <motion.button
            className="btn btn-primary btn-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onRetry?.()}
          >
            Try Again
          </motion.button>
        </div>
      </motion.div>
    )
  }

  // Show empty state
  if (!loading && programs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-16 text-center"
      >
        <div className="inline-block rounded-2xl bg-slate-50 p-10 max-w-md border border-slate-100">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="heading-md text-slate-800 mb-2">No Courses Found</h3>
          <p className="text-slate-500 text-sm">
            {activeFilter === 'current'
              ? 'No courses match your filters. Try adjusting your search.'
              : 'There are currently no courses in this category. Check back soon!'}
          </p>
        </div>
      </motion.div>
    )
  }

  // Helper to format price display
  const formatPrice = (program: UICourse) => {
    if (program.pricing?.isFree) return 'Free'
    if (program.pricing?.amount) {
      return `${program.pricing.currency} ${program.pricing.amount.toLocaleString()}`
    }
    return null
  }

  // Helper to format enrollment count
  const formatEnrollment = (count?: number) => {
    if (!count) return null
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`
    return count.toString()
  }

  // Show courses grid
  return (
    <motion.div
      key={activeFilter}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="responsive-grid responsive-grid-md-2 responsive-grid-lg-3 mb-16"
    >
      {programs.map((program, index) => {
        const price = formatPrice(program)
        const enrollment = formatEnrollment(program.enrollment?.count)

        return (
          <motion.div
            key={program.id}
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            onClick={() => navigate(`/programs/course/${program.slug || program.id}`)}
            className="card group cursor-pointer p-0 h-full border-0 overflow-hidden hover:shadow-xl"
            style={{ minHeight: '420px' }}
          >
            {/* Image Container */}
            <div className="relative h-52 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10 group-hover:from-black/40 transition-colors duration-500" />
              <img
                src={program.image}
                alt={program.title}
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />

              {/* Top Badges */}
              <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-2">
                {/* Category Badge */}
                {program.category && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 text-primary shadow-sm backdrop-blur-sm">
                    {program.category}
                  </span>
                )}
                {/* Status Badge */}
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm ${activeFilter === 'current' ? 'bg-emerald-500/90 text-white' :
                    activeFilter === 'past' ? 'bg-slate-800/90 text-white' :
                      'bg-blue-500/90 text-white'
                  }`}>
                  {program.type || (activeFilter === 'current' ? 'Active' : activeFilter === 'past' ? 'Completed' : 'Coming Soon')}
                </span>
              </div>

              {/* Price Badge - Top Right */}
              {price && (
                <div className="absolute top-3 right-3 z-20">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-md backdrop-blur-sm ${program.pricing?.isFree
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white/95 text-primary'
                    }`}>
                    {price}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1 bg-white">
              {/* Level */}
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">
                {program.level} • {program.duration?.displayText || 'Self-paced'}
              </p>

              <h3 className="heading-sm mb-2 group-hover:text-primary-light transition-colors line-clamp-2 leading-snug">
                {program.title}
              </h3>

              <p className="text-body text-sm mb-4 line-clamp-2 flex-1">
                {program.shortDescription || program.description}
              </p>

              {/* Footer Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                <div className="flex items-center gap-4">
                  {/* Start Date */}
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
                      {activeFilter === 'past' ? 'Completed' : 'Start'}
                    </span>
                    <span className="text-xs font-bold text-primary">
                      {activeFilter === 'past'
                        ? (program.completedDate || 'Ended')
                        : activeFilter === 'future'
                          ? (program.nextStart || 'TBA')
                          : (program.startDate || 'Open')}
                    </span>
                  </div>

                  {/* Enrollment Count */}
                  {enrollment && (
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Students</span>
                      <span className="text-xs font-bold text-primary">{enrollment}</span>
                    </div>
                  )}
                </div>

                {/* Arrow */}
                <motion.div
                  className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300"
                  whileHover={{ rotate: 45 }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

export default ProgramGrid
