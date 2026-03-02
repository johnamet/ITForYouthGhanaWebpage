import React, { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CourseCategory } from '@/types/course'
import { PriceFilter } from '@/hooks/useCourseFilters'

interface CourseSearchBarProps {
    searchTerm: string
    onSearchChange: (term: string) => void
    categoryFilter: string
    onCategoryChange: (category: string) => void
    priceFilter: PriceFilter
    onPriceChange: (filter: PriceFilter) => void
    categories: CourseCategory[]
    totalCount: number
    filteredCount: number
    hasActiveFilters: boolean
    onClearFilters: () => void
}

const CourseSearchBar: React.FC<CourseSearchBarProps> = ({
    searchTerm,
    onSearchChange,
    categoryFilter,
    onCategoryChange,
    priceFilter,
    onPriceChange,
    categories,
    totalCount,
    filteredCount,
    hasActiveFilters,
    onClearFilters,
}) => {
    const searchRef = useRef<HTMLInputElement>(null)

    const priceOptions: { value: PriceFilter; label: string }[] = [
        { value: 'all', label: 'All Prices' },
        { value: 'free', label: 'Free' },
        { value: 'paid', label: 'Paid' },
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-10"
        >
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-4 md:p-6">
                {/* Search + Filters Row */}
                <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            ref={searchRef}
                            type="text"
                            value={searchTerm}
                            onChange={e => onSearchChange(e.target.value)}
                            placeholder="Search courses by name, skill, or topic..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                            id="course-search-input"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => {
                                    onSearchChange('')
                                    searchRef.current?.focus()
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
                                aria-label="Clear search"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Category Dropdown */}
                    <div className="relative min-w-[160px]">
                        <select
                            value={categoryFilter}
                            onChange={e => onCategoryChange(e.target.value)}
                            className="w-full appearance-none py-3 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 cursor-pointer"
                            id="course-category-filter"
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>
                                    {cat.name} ({cat.course_count})
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {/* Price Toggle */}
                    <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1 gap-0.5">
                        {priceOptions.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => onPriceChange(opt.value)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all duration-200 whitespace-nowrap ${priceFilter === opt.value
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-white'
                                    }`}
                                id={`price-filter-${opt.value}`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Count & Clear */}
                <AnimatePresence>
                    {hasActiveFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100"
                        >
                            <p className="text-sm text-slate-500">
                                Showing <span className="font-bold text-primary">{filteredCount}</span> of{' '}
                                <span className="font-semibold">{totalCount}</span> courses
                            </p>
                            <button
                                onClick={onClearFilters}
                                className="text-xs font-semibold text-primary hover:text-primary-light transition-colors flex items-center gap-1"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Clear filters
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}

export default CourseSearchBar
