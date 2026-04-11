// Programs.tsx — Redesigned programs page
// Drop-in replacement for your existing Programs.tsx
// Requires: framer-motion, react-router-dom, your existing hooks/types

import React, { useRef, useState, useEffect, useMemo } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import SEO from '../../components/SEO'
import { useCourseFilters } from '../../hooks/useCourseFilters'
import { getImagePath } from '../../utils/randomImages'
import type { Course } from '../../types/course'

// ─── Helpers ────────────────────────────────────────────────────────────────

const levelStyles: Record<string, string> = {
  beginner:
    'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
  intermediate:
    'border-amber-400/40 text-amber-300 bg-amber-400/10',
  advanced:
    'border-rose-400/40 text-rose-300 bg-rose-400/10',
}

const formatPrice = (course: Course) =>
  course.pricing.isFree
    ? 'Free'
    : `${course.pricing.currency} ${course.pricing.amount.toLocaleString()}`

// ─── Animation variants ──────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay },
  }),
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const cardVariant = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, y: -12, scale: 0.97, transition: { duration: 0.25 } },
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const PulseDot = () => (
  <span className="relative flex h-2 w-2">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00d4a8] opacity-60" />
    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00d4a8]" />
  </span>
)

const Divider = () => (
  <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
)

const StatPill: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="text-center px-6 py-4">
    <div className="text-2xl font-black text-[#00d4a8] leading-none mb-1">{value}</div>
    <div className="font-mono text-[10px] text-white/40 uppercase tracking-widest">{label}</div>
  </div>
)

// ─── Course Card ─────────────────────────────────────────────────────────────

const CourseCard: React.FC<{ course: Course; isPast?: boolean }> = ({ course, isPast }) => {
  const price = formatPrice(course)
  const tags = course.tags?.slice(0, 3) ?? []
  const slug = (course as any).slug || course.id

  return (
    <motion.div
      variants={cardVariant}
      layout
      className="group relative bg-[#0a1628] border border-white/8 rounded-2xl overflow-hidden
                 hover:border-[#00d4a8]/35 transition-colors duration-300 flex flex-col"
    >
      {/* Shimmer overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
        style={{
          background:
            'linear-gradient(105deg, transparent 40%, rgba(0,212,168,0.04) 50%, transparent 60%)',
        }}
      />

      {/* Image */}
      <div className="relative h-44 overflow-hidden flex-shrink-0">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            ;(e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80'
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/80 via-transparent to-transparent" />

        {/* Level badge */}
        <span
          className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold border capitalize tracking-wide ${
            levelStyles[course.level] ?? levelStyles.beginner
          }`}
        >
          {course.level}
        </span>

        {/* Price badge */}
        <span className="absolute top-3 right-3 bg-[#060e1b]/85 backdrop-blur-sm border border-white/10 rounded-lg px-2.5 py-1 text-xs font-black text-[#00d4a8]">
          {price}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <p className="font-mono text-[#00d4a8] text-[10px] tracking-[0.18em] uppercase mb-1.5">
          {course.category}
        </p>
        <h3 className="text-white font-black text-base leading-tight mb-2 line-clamp-2">
          {course.title}
        </h3>

        {/* Short description — plain text fallback strips HTML */}
        <p
          className="text-white/50 text-xs font-light leading-relaxed mb-4 line-clamp-2 flex-1"
          dangerouslySetInnerHTML={{
            __html:
              course.shortDescription?.replace(/<[^>]*>/g, '') ||
              course.description?.replace(/<[^>]*>/g, '').slice(0, 120) + '…',
          }}
        />

        {/* Meta row */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-white/40">
            <svg className="w-3 h-3 text-[#00d4a8]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {course.duration.displayText}
          </div>
          {course.enrollment.count > 0 && (
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-white/40">
              <svg className="w-3 h-3 text-[#00d4a8]/60" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
              {course.enrollment.count.toLocaleString()} enrolled
            </div>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {tags.map((t) => (
              <span
                key={t}
                className="text-[10px] px-2 py-0.5 rounded-full border border-white/8 bg-white/[0.03] text-white/35 lowercase"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 mt-auto">
          {!isPast ? (
            <Link
              to={`/programs/course/${slug}`}
              className={`flex-1 text-center py-2.5 rounded-xl font-bold text-sm transition-all duration-200
                ${
                  course.pricing.isFree
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25'
                    : 'bg-[#00d4a8] text-[#060e1b] hover:opacity-88 hover:-translate-y-0.5'
                }`}
            >
              {course.pricing.isFree ? 'Enroll Free' : 'View Course'}
            </Link>
          ) : (
            <span className="flex-1 text-center py-2.5 rounded-xl font-bold text-sm bg-white/[0.04] border border-white/8 text-white/30 cursor-default">
              Completed
            </span>
          )}

          {!isPast && (
            <Link
              to={`/programs/course/${slug}`}
              className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/40
                        hover:border-[#00d4a8]/40 hover:text-[#00d4a8] hover:bg-[#00d4a8]/8 transition-all duration-200 flex-shrink-0"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Loading skeletons ───────────────────────────────────────────────────────

const CardSkeleton = () => (
  <div className="bg-[#0a1628] border border-white/8 rounded-2xl overflow-hidden animate-pulse">
    <div className="h-44 bg-white/5" />
    <div className="p-5 space-y-3">
      <div className="h-3 bg-white/5 rounded w-1/3" />
      <div className="h-4 bg-white/8 rounded w-3/4" />
      <div className="h-3 bg-white/5 rounded w-full" />
      <div className="h-3 bg-white/5 rounded w-2/3" />
      <div className="flex gap-2 pt-2">
        <div className="h-5 bg-white/5 rounded-full w-16" />
        <div className="h-5 bg-white/5 rounded-full w-20" />
      </div>
      <div className="h-9 bg-white/5 rounded-xl mt-4" />
    </div>
  </div>
)

// ─── Past programs mock data ─────────────────────────────────────────────────

const PAST_COURSES: Course[] = [
  {
    id: 'past-1',
    title: 'Digital Literacy Bootcamp 2023',
    slug: '',
    shortDescription: 'Basic computer skills and digital literacy for rural communities. 120 students completed this cohort.',
    description: 'Basic computer skills and digital literacy for rural communities.',
    level: 'beginner',
    category: 'Foundation Skills',
    image: getImagePath('/images/randomPictures/studentsBackcoding.jpg'),
    pricing: { amount: 0, currency: 'GHS', isFree: true },
    duration: { weeks: 6, displayText: '6 weeks' },
    status: 'archived',
    portalApplyUrl: '',
    skills: ['Computer Basics', 'Internet Navigation', 'Digital Safety', 'Email & Communication'],
    prerequisites: ['No prior experience required'],
    enrollment: { count: 120, capacity: 120 },
    tags: ['computer basics', 'internet', 'digital safety'],
    teachers: [],
    modules: [],
  } as unknown as Course,
  {
    id: 'past-2',
    title: 'Web Development Intensive 2022',
    slug: '',
    shortDescription: 'Comprehensive web development training with real-world projects. 45 graduates placed in tech roles.',
    description: 'Comprehensive web development training with real-world projects.',
    level: 'intermediate',
    category: 'Full Stack Development',
    image: getImagePath('/images/randomPictures/peterblackboard.jpg'),
    pricing: { amount: 0, currency: 'GHS', isFree: true },
    duration: { weeks: 12, displayText: '12 weeks' },
    status: 'archived',
    portalApplyUrl: '',
    skills: ['HTML/CSS', 'JavaScript', 'React', 'Node.js'],
    prerequisites: ['Basic computer skills'],
    enrollment: { count: 45, capacity: 50 },
    tags: ['html', 'css', 'javascript', 'react', 'node'],
    teachers: [],
    modules: [],
  } as unknown as Course,
]

// ─── Main component ──────────────────────────────────────────────────────────

const Programs: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  const heroInView = useInView(heroRef, { once: true })

  const [activeTab, setActiveTab] = useState<'current' | 'past'>('current')
  const [levelFilter, setLevelFilter] = useState<string>('All')
  const [searchTerm, setSearchTerm] = useState('')

  const {
    filteredCourses,
    loading,
    error,
    retry,
    searchTerm: hookSearch,
    setSearchTerm: setHookSearch,
    courses: allCourses,
  } = useCourseFilters()

  // Sync local search into hook
  useEffect(() => {
    setHookSearch(searchTerm)
  }, [searchTerm, setHookSearch])

  // Level-filter on top of hook-filtered courses
  const displayedCourses = useMemo(() => {
    if (activeTab === 'past') return PAST_COURSES
    if (levelFilter === 'All') return filteredCourses
    return filteredCourses.filter((c) => c.level === levelFilter)
  }, [filteredCourses, levelFilter, activeTab])

  const currentCount = allCourses.filter((c) => c.status === 'active').length || filteredCourses.length
  const levels = ['All', 'beginner', 'intermediate', 'advanced']

  return (
    <>
      <SEO
        title="Tech Programs — IT for Youth Ghana"
        description="Explore hands-on technology programs in Ghana. Web development, data analytics, cybersecurity, and UI/UX design courses with 70% female participation."
        canonical="/programs"
        ogType="website"
      />

      <div className="min-h-screen bg-[#060e1b] pt-20">

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section
          ref={heroRef}
          className="relative bg-[#0a1628] py-24 lg:py-32 overflow-hidden"
        >
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),
                                linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)`,
              backgroundSize: '44px 44px',
              maskImage: 'linear-gradient(to bottom,transparent,black 20%,black 80%,transparent)',
            }}
          />
          {/* Glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse, rgba(0,212,168,0.09) 0%, transparent 65%)',
              filter: 'blur(40px)',
            }}
          />

          <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 bg-[#00d4a8]/10 border border-[#00d4a8]/25 rounded-full px-4 py-2 mb-8"
            >
              <PulseDot />
              <span className="font-mono text-[#00d4a8] text-xs tracking-[0.18em] uppercase">
                IT For Youth Ghana · Programs
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[0.93] mb-6"
            >
              Transform Your<br />
              <span className="text-[#00d4a8]">Future in Tech</span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.16 }}
              className="text-white/55 text-lg font-light leading-relaxed max-w-2xl mx-auto mb-12"
            >
              Hands-on technology programs designed to take you from zero to career-ready.
              Learn from industry practitioners and build real-world projects.
            </motion.p>

            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.24 }}
              className="inline-flex items-stretch divide-x divide-white/8 bg-white/[0.04] border border-white/8 rounded-2xl mb-12 overflow-hidden"
            >
              <StatPill value={`${currentCount}`} label="Active Courses" />
              <StatPill value="8wk" label="Avg Duration" />
              <StatPill value="70%" label="Female Participation" />
              <StatPill value="GHS" label="Local Currency" />
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="flex items-center justify-center gap-3 flex-wrap"
            >
              <a
                href="#programs"
                className="inline-flex items-center gap-2 bg-[#00d4a8] text-[#060e1b] font-black px-8 py-4 rounded-xl hover:opacity-88 hover:-translate-y-0.5 transition-all duration-200 text-base shadow-lg shadow-[#00d4a8]/20"
              >
                Browse Programs
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
              <Link
                to="/who-can-apply"
                className="inline-flex items-center px-8 py-4 border border-white/15 text-white/75 font-semibold rounded-xl hover:bg-white/5 hover:border-white/25 transition-all duration-200 text-base"
              >
                How to Apply
              </Link>
            </motion.div>
          </div>
        </section>

        <Divider />

        {/* ── PROGRAMS SECTION ─────────────────────────────────────────────── */}
        <section id="programs" className="py-20 max-w-6xl mx-auto px-6">

          {/* Section label */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-10"
          >
            <p className="font-mono text-[#00d4a8] text-xs tracking-[0.2em] uppercase mb-2 flex items-center gap-2">
              Our Programs <span className="inline-block w-8 h-px bg-[#00d4a8]/40" />
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Choose Your Program</h2>
          </motion.div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            {/* Tab switcher */}
            <div className="flex gap-1.5 bg-white/[0.04] border border-white/8 rounded-xl p-1">
              {(['current', 'past'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setLevelFilter('All') }}
                  className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                    activeTab === tab
                      ? 'bg-[#00d4a8] text-[#060e1b]'
                      : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  {tab === 'current' ? `Current (${currentCount})` : `Past (${PAST_COURSES.length})`}
                </button>
              ))}
            </div>

            {/* Search — only for current */}
            {activeTab === 'current' && (
              <div className="flex items-center gap-2.5 bg-white/[0.04] border border-white/8 rounded-xl px-4 py-2.5 flex-1 max-w-xs">
                <svg className="w-3.5 h-3.5 text-white/30 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" strokeWidth={2} />
                  <path strokeLinecap="round" strokeWidth={2} d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search courses…"
                  className="bg-transparent border-none outline-none text-white text-sm placeholder:text-white/30 w-full"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="text-white/30 hover:text-white/60 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Level filter pills — only for current */}
          {activeTab === 'current' && (
            <div className="flex flex-wrap gap-2 mb-8">
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevelFilter(lvl)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 capitalize ${
                    levelFilter === lvl
                      ? 'bg-[#00d4a8]/15 border-[#00d4a8]/40 text-[#00d4a8]'
                      : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/65'
                  }`}
                >
                  {lvl === 'All' ? 'All Levels' : lvl}
                </button>
              ))}
            </div>
          )}

          {/* Results count */}
          {activeTab === 'current' && !loading && (
            <p className="font-mono text-[11px] text-white/30 uppercase tracking-widest mb-6">
              Showing {displayedCourses.length} of {allCourses.length} program{allCourses.length !== 1 ? 's' : ''}
            </p>
          )}

          {/* ── Grid ── */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => <CardSkeleton key={i} />)}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-white/50 mb-6 font-light">{error.message}</p>
              <button
                onClick={retry}
                className="px-6 py-3 bg-[#00d4a8] text-[#060e1b] font-bold rounded-xl hover:opacity-88 transition-opacity"
              >
                Try Again
              </button>
            </div>
          ) : displayedCourses.length === 0 ? (
            <div className="text-center py-24 col-span-3">
              <div className="w-14 h-14 rounded-full bg-white/[0.04] border border-white/8 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" strokeWidth={1.5} />
                  <path strokeLinecap="round" strokeWidth={1.5} d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <p className="text-white/35 font-light">No courses match your search.</p>
              <button
                onClick={() => { setSearchTerm(''); setLevelFilter('All') }}
                className="mt-4 text-[#00d4a8] text-sm font-semibold hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              <AnimatePresence mode="popLayout">
                {displayedCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    isPast={activeTab === 'past'}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </section>

        <Divider />

        {/* ── HOW TO APPLY ─────────────────────────────────────────────────── */}
        <section className="py-20 bg-[#0a1628]">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-14 text-center"
            >
              <p className="font-mono text-[#00d4a8] text-xs tracking-[0.2em] uppercase mb-2 flex items-center justify-center gap-2">
                Process <span className="inline-block w-8 h-px bg-[#00d4a8]/40" />
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">How to Apply</h2>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-5">
              {[
                { step: '01', title: 'Choose a Program', desc: 'Browse our courses and pick the one that fits your goals and experience level.' },
                { step: '02', title: 'Apply Online', desc: 'Fill out our simple application form on the portal. Takes under 5 minutes.' },
                { step: '03', title: 'Brief Interview', desc: 'A short conversation about your motivation — we want to understand your goals.' },
                { step: '04', title: 'Get Started!', desc: 'Welcome to IT for Youth Ghana. Your tech journey starts here.' },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i * 0.1}
                  className="relative bg-white/[0.03] border border-white/8 rounded-2xl p-6 hover:border-[#00d4a8]/20 transition-colors group"
                >
                  <div className="font-mono text-4xl font-black text-white/[0.06] mb-4 group-hover:text-[#00d4a8]/15 transition-colors">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-white text-base mb-2">{item.title}</h3>
                  <p className="text-white/45 text-sm font-light leading-relaxed">{item.desc}</p>
                  {i < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                      <svg className="w-6 h-6 text-white/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ── BOTTOM CTA ───────────────────────────────────────────────────── */}
        <section className="py-24 relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 100%, rgba(0,212,168,0.07) 0%, transparent 65%)',
            }}
          />
          <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="font-mono text-[#00d4a8] text-xs tracking-[0.2em] uppercase mb-4 flex items-center justify-center gap-2">
                Ready to begin? <span className="inline-block w-8 h-px bg-[#00d4a8]/40" />
              </p>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                Start Your Journey<br />
                <span className="text-[#00d4a8]">Today</span>
              </h2>
              <p className="text-white/50 font-light mb-10 text-lg">
                Applications are open. Secure your spot in our next cohort.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link
                  to="/who-can-apply"
                  className="inline-flex items-center gap-2 bg-[#00d4a8] text-[#060e1b] font-black px-9 py-4 rounded-xl hover:opacity-88 hover:-translate-y-0.5 transition-all duration-200 text-base shadow-xl shadow-[#00d4a8]/15"
                >
                  Apply Now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-8 py-4 border border-white/15 text-white/75 font-semibold rounded-xl hover:bg-white/5 hover:border-white/25 transition-all duration-200 text-base"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </>
  )
}

export default Programs
