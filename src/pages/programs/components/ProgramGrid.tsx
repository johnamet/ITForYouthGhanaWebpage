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
  onRetry = () => {}
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
            onClick={onRetry}
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="responsive-grid responsive-grid-md-2 responsive-grid-lg-3 mb-16"
    >
      {programs.map((program, index) => (
        <motion.div
          key={program.title}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          whileHover={{ y: -10, transition: { duration: 0.3 } }}
          onClick={() => onProgramClick(program)}
          className="card overflow-hidden cursor-pointer group"
        >
          <div className="relative h-48 overflow-hidden">
            <img
              src={program.image}
              alt={program.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                program.status === 'current' ? 'bg-success text-white' :
                program.status === 'past' ? 'bg-neutral-500 text-white' :
                'bg-accent text-white'
              }`}>
                {program.type}
              </span>
            </div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="heading-sm text-white mb-1">{program.title}</h3>
              <p className="text-sm opacity-90">{program.subtitle}</p>
            </div>
          </div>
          
          <div className="card-body">
            <p className="text-body mb-4 line-clamp-3">{program.description}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-primary font-semibold">
                {program.status === 'past' ? program.completedDate :
                 program.status === 'future' ? 'Development' :
                 program.participants}
              </span>
              <span className="text-accent font-semibold">Details →</span>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default ProgramGrid
