import React from 'react'
import { motion } from 'framer-motion'

interface Program {
  title: string
  subtitle: string
  description: string
  duration: string
  participants?: string
  image: string
  skills?: string[]
  requirements: string
  status: 'current' | 'past' | 'future'
  type: string
  nextStart?: string
  completedDate?: string
  careerOutcomes?: string[]
  highlights?: string[]
}

interface ProgramGridProps {
  programs: Program[]
  activeFilter: 'current' | 'past' | 'future'
  onProgramClick: (program: Program) => void
  loading?: boolean
  error?: Error | null
  onRetry?: () => void
}

// Loading skeleton component
const ProgramSkeleton: React.FC = () => (
  <div className="card overflow-hidden animate-pulse">
    <div className="h-48 bg-neutral-200"></div>
    <div className="card-body space-y-3">
      <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
      <div className="h-3 bg-neutral-100 rounded w-full"></div>
      <div className="h-3 bg-neutral-100 rounded w-5/6"></div>
      <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
    </div>
  </div>
)

const ProgramGrid: React.FC<ProgramGridProps> = ({
  programs,
  activeFilter,
  onProgramClick,
  loading = false,
  error = null,
  onRetry
}) => {
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
        <div className="inline-block rounded-lg bg-red-50 p-8 max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="heading-md text-red-900 mb-2">Unable to Load Courses</h3>
          <p className="text-red-700 mb-6">
            {error.message || 'There was an error fetching the courses. Please try again.'}
          </p>
          <motion.button
            className="btn btn-primary"
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
        <div className="inline-block rounded-lg bg-neutral-50 p-8 max-w-md">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="heading-md text-neutral-900 mb-2">No Courses Available</h3>
          <p className="text-neutral-600">
            There are currently no courses in this category. Check back soon!
          </p>
        </div>
      </motion.div>
    )
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
      {programs.map((program, index) => (
        <motion.div
          key={program.title}
          layout
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          onClick={() => onProgramClick(program)}
          className="card group cursor-pointer p-0 h-full border-0 overflow-hidden"
          style={{ minHeight: '400px' }} // Taller cards
        >
          {/* Image Container with Zoom Effect */}
          <div className="relative h-56 overflow-hidden">
            <div className="absolute inset-0 bg-primary/20 z-10 group-hover:bg-primary/0 transition-colors duration-500" />
            <img
              src={program.image}
              alt={program.title}
              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
              <span className={`badge border-0 shadow-lg ${program.status === 'current' ? 'bg-white text-green-700' :
                  program.status === 'past' ? 'bg-slate-800 text-white' :
                    'bg-blue-600 text-white'
                }`}>
                {program.type}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 flex flex-col flex-1 relative bg-white">
            <h3 className="heading-sm mb-2 group-hover:text-primary-light transition-colors">
              {program.title}
            </h3>
            <p className="text-sm text-primary/60 font-medium mb-4 uppercase tracking-wider">
              {program.subtitle}
            </p>

            <p className="text-body text-sm mb-6 line-clamp-3 flex-1">
              {program.description}
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-auto">
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wide">
                  {program.status === 'past' ? 'Completed' : 'Start Date'}
                </span>
                <span className="text-sm font-bold text-primary">
                  {program.status === 'past' ? program.completedDate :
                    program.status === 'future' ? program.nextStart || 'TBA' :
                      program.nextStart}
                </span>
              </div>

              <motion.div
                className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors"
                whileHover={{ rotate: 90 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </motion.div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default ProgramGrid
