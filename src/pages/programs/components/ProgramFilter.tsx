import React from 'react'
import { motion } from 'framer-motion'

interface ProgramFilterProps {
  activeFilter: 'current' | 'past' | 'future'
  setActiveFilter: (filter: 'current' | 'past' | 'future') => void
  currentCount: number
  pastCount: number
  futureCount: number
}

const ProgramFilter: React.FC<ProgramFilterProps> = ({
  activeFilter,
  setActiveFilter,
  currentCount,
  pastCount,
  futureCount
}) => {
  const filters = [
    { key: 'current' as const, label: 'Current', count: currentCount },
    { key: 'future' as const, label: 'Future', count: futureCount },
    { key: 'past' as const, label: 'Past', count: pastCount }
  ]

  return (
    <div className="mb-12">
      {/* Centered Pill Filter for all screens */}
      <div className="flex justify-center">
        <div className="bg-slate-100 p-1.5 rounded-full inline-flex relative shadow-inner">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.key
            return (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`
                  relative z-10 flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300
                  ${isActive ? 'text-primary' : 'text-slate-500 hover:text-slate-700'}
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFilterPill"
                    className="absolute inset-0 bg-white shadow-sm rounded-full border border-slate-200"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-20">{filter.label}</span>
                <span className={`
                  relative z-20 text-xs py-0.5 px-2 rounded-full transition-colors
                  ${isActive ? 'bg-primary/10 text-primary' : 'bg-slate-200 text-slate-500'}
                `}>
                  {filter.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ProgramFilter
