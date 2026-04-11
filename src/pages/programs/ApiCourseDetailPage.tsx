import React, { useState, useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { useCourse } from '../../hooks/useCourse'
import { generateApplyUrl } from '../../lib/api/courseApi'
import type { Course, Teacher, CourseModule } from '../../types/course'
import DOMPurify from 'dompurify'

// ─── SEO Stub ────────────────────────────────────────────────────────────────
interface SEOProps {
  title: string
  description?: string
  canonical?: string
  noindex?: boolean
  ogType?: string
  ogImage?: string
}
const SEO: React.FC<SEOProps> = ({ title, description, noindex }) => {
  useEffect(() => {
    document.title = title
    if (description) {
      let m = document.querySelector<HTMLMetaElement>('meta[name="description"]')
      if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m) }
      m.content = description
    }
    if (noindex) {
      let m = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
      if (!m) { m = document.createElement('meta'); m.name = 'robots'; document.head.appendChild(m) }
      m.content = 'noindex'
    }
  }, [title, description, noindex])
  return null
}

// ─── Animation presets ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
  }),
}
const fadeLeft = { hidden: { opacity: 0, x: -24 }, visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }
const fadeRight = { hidden: { opacity: 0, x: 24 }, visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }

// ─── Level badge colours ──────────────────────────────────────────────────────
const levelStyles: Record<Course['level'], string> = {
  beginner: 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10',
  intermediate: 'border-amber-400/50   text-amber-300   bg-amber-400/10',
  advanced: 'border-rose-400/50    text-rose-300     bg-rose-400/10',
}

// ─── Divider ──────────────────────────────────────────────────────────────────
const Divider = () => (
  <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
)

// ─── Section header ───────────────────────────────────────────────────────────
const SectionHeader: React.FC<{ eyebrow: string; title: string }> = ({ eyebrow, title }) => (
  <div className="mb-10">
    <p className="font-mono text-[#00d4a8] text-xs tracking-[0.2em] uppercase mb-2 flex items-center gap-2">
      {eyebrow}<span className="inline-block w-8 h-px bg-[#00d4a8]/40" />
    </p>
    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">{title}</h2>
  </div>
)

// ─── Stat card ────────────────────────────────────────────────────────────────
const StatCard: React.FC<{ label: string; value: React.ReactNode; accent?: boolean }> = ({ label, value, accent }) => (
  <div className="bg-white/5 border border-white/8 rounded-xl p-4">
    <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-1.5">{label}</p>
    <p className={`font-bold text-base leading-tight ${accent ? 'text-[#00d4a8]' : 'text-white'}`}>{value}</p>
  </div>
)

// ─── Loading skeleton ─────────────────────────────────────────────────────────
const LoadingSkeleton: React.FC = () => (
  <div className="min-h-screen bg-[#050d1a] pt-24">
    <div className="max-w-6xl mx-auto px-6 py-20 animate-pulse">
      <div className="h-4 bg-white/10 rounded w-48 mb-10" />
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-5">
          <div className="flex gap-2">
            <div className="h-7 w-24 bg-white/10 rounded-full" />
            <div className="h-7 w-32 bg-white/10 rounded-full" />
          </div>
          <div className="h-14 bg-white/10 rounded w-3/4" />
          <div className="h-14 bg-white/10 rounded w-1/2" />
          <div className="space-y-2 pt-2">
            {[1, 2, 3].map(i => <div key={i} className="h-4 bg-white/5 rounded" />)}
          </div>
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[1, 2, 3].map(i => <div key={i} className="h-20 bg-white/5 rounded-xl" />)}
          </div>
        </div>
        <div className="h-80 bg-white/5 rounded-2xl" />
      </div>
    </div>
  </div>
)

// ─── Error state ──────────────────────────────────────────────────────────────
const ErrorState: React.FC<{ message: string; retry: () => void }> = ({ message, retry }) => (
  <div className="min-h-screen bg-[#050d1a] flex items-center justify-center px-6">
    <div className="text-center max-w-md">
      <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-5">
        <svg className="w-8 h-8 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-white mb-3">Unable to load course</h2>
      <p className="text-white/50 mb-8 font-light">{message}</p>
      <button onClick={retry} className="px-6 py-3 bg-[#00d4a8] text-[#050d1a] font-bold rounded-lg hover:opacity-90 transition-opacity">
        Try again
      </button>
    </div>
  </div>
)

// ─── Not found state ──────────────────────────────────────────────────────────
const NotFoundState: React.FC = () => (
  <>
    <SEO title="Course Not Found | IT for Youth Ghana" noindex />
    <div className="min-h-screen bg-[#050d1a] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Course Not Found</h1>
        <p className="text-white/50 mb-8 font-light">The course you're looking for is unavailable or no longer listed.</p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/programs" className="px-6 py-3 bg-[#00d4a8] text-[#050d1a] font-bold rounded-lg hover:opacity-90 transition-opacity">View Programs</Link>
          <Link to="/who-can-apply" className="px-6 py-3 border border-white/15 text-white font-medium rounded-lg hover:bg-white/5 transition-colors">Apply</Link>
        </div>
      </div>
    </div>
  </>
)

// ─── Apply button ─────────────────────────────────────────────────────────────
const ApplyButton: React.FC<{ course: Course; variant?: 'hero' | 'card'; className?: string }> = ({
  course, variant = 'hero', className = '',
}) => {
  const [loading, setLoading] = useState(false)
  const isFree = course.pricing.isFree
  const label = isFree ? 'Enroll Free' : 'Apply Now'

  const handleClick = useCallback(async () => {
    setLoading(true)
    try {
      const result = await generateApplyUrl(course.slug || course.id, {
        source: 'main_site', medium: 'web', campaign: 'course_detail',
      })
      window.location.href =
        result?.apply_url ||
        course.portalApplyUrl ||
        `https://portal.itforyouthghana.org/register?course_id=${course.id}&ref=main_site`
    } catch {
      window.location.href =
        course.portalApplyUrl ||
        `https://portal.itforyouthghana.org/register?course_id=${course.id}&ref=main_site`
    } finally {
      setLoading(false)
    }
  }, [course])

  const heroClass =
    `inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all duration-200 ` +
    (isFree ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20 '
      : 'bg-[#00d4a8] hover:opacity-90 text-[#050d1a] shadow-lg shadow-[#00d4a8]/20 ') +
    (loading ? 'opacity-70 cursor-wait' : 'hover:-translate-y-0.5')

  const cardClass =
    `w-full py-4 rounded-xl font-bold text-base transition-all duration-200 ` +
    (isFree ? 'bg-emerald-500 hover:bg-emerald-400 text-white '
      : 'bg-[#00d4a8] hover:opacity-90 text-[#050d1a] ') +
    (loading ? 'opacity-70 cursor-wait' : '')

  return (
    <motion.button
      whileHover={{ scale: loading ? 1 : 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      disabled={loading}
      className={`${variant === 'hero' ? heroClass : cardClass} ${className}`}
    >
      {loading ? (
        <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />Redirecting…</>
      ) : (
        <>
          {label}
          {variant === 'hero' && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          )}
        </>
      )}
    </motion.button>
  )
}

// ─── Teacher card ─────────────────────────────────────────────────────────────
const TeacherCard: React.FC<{ teacher: Teacher }> = ({ teacher }) => {
  const initials = [teacher.firstName[0], teacher.lastName?.[0]]
    .filter(Boolean).join('').toUpperCase()

  return (
    <div className="flex items-center gap-4 bg-white/[0.03] border border-white/8 rounded-2xl p-5 hover:border-[#00d4a8]/25 transition-colors">
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00d4a8] to-[#0e1f38] flex items-center justify-center font-black text-white text-lg flex-shrink-0 border-2 border-[#00d4a8]/20">
        {initials}
      </div>
      <div>
        <p className="font-semibold text-white leading-tight">{teacher.fullName}</p>
        <p className="font-mono text-[#00d4a8] text-xs tracking-wider mt-0.5">Instructor</p>
        {teacher.email && (
          <a
            href={`mailto:${teacher.email}`}
            className="text-white/40 text-xs hover:text-[#00d4a8] transition-colors mt-1 block"
          >
            {teacher.email}
          </a>
        )}
      </div>
    </div>
  )
}

// ─── Module item ──────────────────────────────────────────────────────────────
const ModuleItem: React.FC<{ module: CourseModule; index: number }> = ({ module, index }) => (
  <motion.div
    variants={fadeUp} initial="hidden" whileInView="visible"
    viewport={{ once: true }} custom={index * 0.06}
    className="flex items-start gap-4 bg-white/[0.03] border border-white/8 rounded-xl p-4 hover:border-[#00d4a8]/20 transition-colors"
  >
    <div className="w-8 h-8 rounded-lg bg-[#00d4a8]/10 border border-[#00d4a8]/20 flex items-center justify-center flex-shrink-0 font-mono text-[#00d4a8] text-xs font-bold">
      {String(index + 1).padStart(2, '0')}
    </div>
    <div>
      <p className="font-semibold text-white text-sm">{module.name}</p>
      {module.description && (
        <p className="text-white/40 text-xs font-light mt-0.5 leading-relaxed">{module.description}</p>
      )}
    </div>
  </motion.div>
)

// ─── Main component ───────────────────────────────────────────────────────────
const ApiCourseDetailPage: React.FC = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>()
  const { course, loading, error, retry } = useCourse(courseSlug)
  const progressRef = useRef<HTMLDivElement>(null)

  console.log(course)

  // Scroll progress bar
  useEffect(() => {
    const onScroll = () => {
      if (!progressRef.current) return
      const total = document.documentElement.scrollHeight - window.innerHeight
      progressRef.current.style.width = total > 0 ? `${(window.scrollY / total) * 100}%` : '0%'
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── States ──────────────────────────────────────────────────────────────────
  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorState message={error.message} retry={retry} />
  if (!course) return <NotFoundState />

  // ── Derived values ──────────────────────────────────────────────────────────
  const priceLabel = course.pricing.isFree ? 'Free' : `${course.pricing.currency} ${course.pricing.amount.toLocaleString()}`
  const enrollmentCount = course.enrollment.count
  const hasTeachers = course.teachers.length > 0
  const hasModules = course.modules.length > 0
  const hasTags = course.tags.length > 0
  const hasSyncMeta = course.syncedFromMoodle || !!course.lastSyncedAt || !!course.syncStatus || !!course.lastSyncError

  const formatDate = (d?: string | null) =>
    d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : null

  // ── Page ────────────────────────────────────────────────────────────────────
  return (
    <>
      <SEO
        title={`${course.title} | IT for Youth Ghana`}
        description={course.shortDescription || course.description}
        canonical={`/programs/course/${course.slug}`}
        ogType="article"
        ogImage={course.image}
      />

      {/* Scroll progress */}
      <div
        ref={progressRef}
        className="fixed top-0 left-0 h-[2px] z-[200] bg-[#00d4a8] w-0 transition-[width] duration-100"
        style={{ boxShadow: '0 0 8px #00d4a8' }}
      />

      <div className="min-h-screen bg-[#050d1a] pt-20">

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <section className="relative py-20 lg:py-28 overflow-hidden bg-[#091426]">
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)`,
            backgroundSize: '48px 48px',
            maskImage: 'linear-gradient(to bottom,transparent 0%,black 25%,black 75%,transparent 100%)',
          }} />
          {/* Teal glow */}
          <div className="absolute top-0 right-0 w-[640px] h-[640px] pointer-events-none" style={{
            background: 'radial-gradient(circle,rgba(0,212,168,0.07) 0%,transparent 65%)',
            transform: 'translate(20%,-20%)', filter: 'blur(40px)',
          }} />

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            {/* Breadcrumb */}
            <motion.nav
              variants={fadeUp} initial="hidden" animate="visible" custom={0}
              aria-label="Breadcrumb"
              className="text-xs font-mono text-white/40 mb-10 flex items-center gap-2"
            >
              <Link to="/" className="hover:text-[#00d4a8] transition-colors">Home</Link>
              <span>/</span>
              <Link to="/programs" className="hover:text-[#00d4a8] transition-colors">Programs</Link>
              <span>/</span>
              <span className="text-white/70 truncate max-w-[200px]">{course.title}</span>
            </motion.nav>

            <div className="grid lg:grid-cols-[1fr_420px] gap-12 items-center">
              {/* Left */}
              <div>
                {/* Badges */}
                <motion.div
                  variants={fadeUp} initial="hidden" animate="visible" custom={0.05}
                  className="flex flex-wrap gap-2 mb-6"
                >
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize tracking-wide ${levelStyles[course.level]}`}>
                    {course.level}
                  </span>
                  {course.category && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold border border-white/10 text-white/60 bg-white/5 tracking-wide">
                      {course.category}
                    </span>
                  )}
                  {course.deliveryProvider && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold border border-white/8 text-white/35 bg-white/[0.03] tracking-wide font-mono uppercase">
                      via {course.deliveryProvider}
                    </span>
                  )}
                  {enrollmentCount > 0 && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                      </svg>
                      {enrollmentCount.toLocaleString()} enrolled
                    </span>
                  )}
                </motion.div>

                {/* Title */}
                <motion.h1
                  variants={fadeLeft} initial="hidden" animate="visible"
                  className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.93] tracking-tight mb-6"
                >
                  {course.title}
                </motion.h1>

                {/* Short description */}
                <motion.p
                  variants={fadeUp} initial="hidden" animate="visible" custom={0.2}
                  className="text-white/60 text-lg font-light leading-relaxed mb-9 max-w-xl"
                >
                  <div
                    className="prose prose-invert max-w-none
             prose-h2:text-[#00d4a8]
             prose-h3:text-white prose-h3:font-semibold
             prose-strong:text-white
             prose-ul:list-disc prose-ul:pl-6
             prose-li:text-white/80 leading-relaxed text-[15.5px]"
                    dangerouslySetInnerHTML={{ __html: course.shortDescription ? DOMPurify.sanitize(course.shortDescription) : DOMPurify.sanitize(course.description.slice(0, 300) + '...') }}
                  />
                </motion.p>

                {/* Quick stats */}
                <motion.div
                  variants={fadeUp} initial="hidden" animate="visible" custom={0.28}
                  className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-9"
                >
                  <StatCard label="Duration" value={course.duration.displayText} />
                  <StatCard label="Tuition" value={priceLabel} accent={!course.pricing.isFree} />
                  {course.startDate && (
                    <StatCard label="Starts" value={formatDate(course.startDate)} accent />
                  )}
                </motion.div>

                {/* CTAs */}
                <motion.div
                  variants={fadeUp} initial="hidden" animate="visible" custom={0.36}
                  className="flex flex-wrap gap-3"
                >
                  <ApplyButton course={course} variant="hero" />
                  <Link
                    to="/programs"
                    className="inline-flex items-center px-6 py-4 border border-white/15 text-white/80 font-medium rounded-xl hover:bg-white/5 hover:border-white/25 transition-all duration-200 text-base"
                  >
                    All Programs
                  </Link>
                </motion.div>
              </div>

              {/* Right — image */}
              <motion.div variants={fadeRight} initial="hidden" animate="visible" className="hidden lg:block">
                <div className="relative">
                  <div className="absolute -inset-px rounded-2xl opacity-30" style={{ background: 'linear-gradient(135deg,#00d4a8,transparent 60%)' }} />
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-[380px] object-cover rounded-2xl relative z-10"
                    onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80' }}
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-[#091426]/60 via-transparent to-transparent z-20" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <Divider />

        {/* ── ABOUT ─────────────────────────────────────────────────────────── */}
        <section className="py-20 max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_340px] gap-16 items-start">

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <SectionHeader eyebrow="Overview" title="About This Course" />

              <div
                className="prose prose-invert max-w-none
             prose-h2:text-[#00d4a8]
             prose-h3:text-white prose-h3:font-semibold
             prose-strong:text-white
             prose-ul:list-disc prose-ul:pl-6
             prose-li:text-white/80 leading-relaxed text-[15.5px]"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(course.description) }}
              />
            </motion.div>

            {/* Sticky details card */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.1}
              className="sticky top-24"
            >
              <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
                <p className="font-mono text-[#00d4a8] text-xs tracking-[0.2em] uppercase mb-5">Course Details</p>

                {([
                  { key: 'Code', val: course.shortName || '—' },
                  { key: 'Category', val: course.category },
                  { key: 'Level', val: <span className="capitalize">{course.level}</span> },
                  { key: 'Duration', val: course.duration.displayText },
                  { key: 'Language', val: course.language?.toUpperCase() || 'EN' },
                  { key: 'Format', val: course.format || '—' },
                  { key: 'Delivery', val: course.deliveryProvider || '—' },
                  { key: 'Progress', val: course.progressSource || '—' },
                  { key: 'Capacity', val: course.enrollment.capacity ? course.enrollment.capacity.toLocaleString() : 'Unlimited' },
                  ...(course.startDate ? [{ key: 'Starts', val: formatDate(course.startDate) }] : []),
                  ...(course.endDate ? [{ key: 'Ends', val: formatDate(course.endDate) }] : []),
                  { key: 'Fee', val: <span className="text-[#00d4a8] font-black text-lg">{priceLabel}</span> },
                ] as { key: string; val: React.ReactNode }[]).map(({ key, val }) => (
                  <div key={key} className="flex justify-between items-center py-3 border-b border-white/6 last:border-none">
                    <span className="text-white/40 text-sm">{key}</span>
                    <span className="text-white text-sm font-medium text-right">{val}</span>
                  </div>
                ))}

                <ApplyButton course={course} variant="card" className="mt-6" />
                <p className="text-center text-xs text-white/30 mt-3">
                  {course.pricing.isFree ? 'No payment required' : 'Secure your spot today'}
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <Divider />

        {/* ── MODULES ───────────────────────────────────────────────────────── */}
        {hasModules && (
          <>
            <section className="py-20 bg-[#091426]">
              <div className="max-w-6xl mx-auto px-6">
                <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <SectionHeader
                    eyebrow="Curriculum"
                    title={`${course.modules.length} Course Module${course.modules.length !== 1 ? 's' : ''}`}
                  />
                </motion.div>
                <div className="grid md:grid-cols-2 gap-3">
                  {course.modules.map((mod, i) => (
                    <ModuleItem key={mod.id} module={mod} index={i} />
                  ))}
                </div>
              </div>
            </section>
            <Divider />
          </>
        )}

        {/* ── TAGS ──────────────────────────────────────────────────────────── */}
        {hasTags && (
          <>
            <section className="py-20 max-w-6xl mx-auto px-6">
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <SectionHeader eyebrow="Topics" title="What You'll Learn" />
              </motion.div>
              <div className="flex flex-wrap gap-2.5">
                {course.tags.map((tag, i) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.88 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    className="inline-block px-3 py-1.5 rounded-full border border-[#00d4a8]/25 bg-[#00d4a8]/8 text-[#00d4a8] text-xs font-medium tracking-wide lowercase"
                  >
                    #{tag}
                  </motion.span>
                ))}
              </div>
            </section>
            <Divider />
          </>
        )}

        {/* ── TEACHERS ──────────────────────────────────────────────────────── */}
        {hasTeachers && (
          <>
            <section className="py-20 bg-[#091426]">
              <div className="max-w-6xl mx-auto px-6">
                <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <SectionHeader
                    eyebrow="Instructors"
                    title={course.teachers.length === 1 ? 'Meet Your Instructor' : 'Meet Your Instructors'}
                  />
                </motion.div>
                <div className="grid md:grid-cols-2 gap-4 max-w-2xl">
                  {course.teachers.map((teacher, i) => (
                    <motion.div
                      key={teacher.id}
                      variants={fadeUp} initial="hidden" whileInView="visible"
                      viewport={{ once: true }} custom={i * 0.08}
                    >
                      <TeacherCard teacher={teacher} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
            <Divider />
          </>
        )}

        {/* ── SYNC META ─────────────────────────────────────────────────────── */}
        {hasSyncMeta && (
          <>
            <section className="py-10 max-w-6xl mx-auto px-6">
              <motion.div
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="flex flex-wrap gap-2"
              >
                {course.syncedFromMoodle && (
                  <span className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/8 text-white/30 text-xs font-mono flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d4a8] inline-block" />
                    Synced from Moodle
                  </span>
                )}
                {course.syncStatus && (
                  <span className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/8 text-white/30 text-xs font-mono">
                    Sync: {course.syncStatus}
                  </span>
                )}
                {course.lastSyncedAt && (
                  <span className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/8 text-white/30 text-xs font-mono">
                    Last synced: {formatDate(course.lastSyncedAt.slice(0, 10))}
                  </span>
                )}
                {course.lastSyncError && (
                  <span className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono">
                    Sync error: {course.lastSyncError}
                  </span>
                )}
              </motion.div>
            </section>
            <Divider />
          </>
        )}

        {/* ── BOTTOM CTA ────────────────────────────────────────────────────── */}
        <section className="py-20 bg-[#091426] relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4z'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none" style={{
            background: 'radial-gradient(ellipse,rgba(0,212,168,0.06) 0%,transparent 70%)', filter: 'blur(20px)',
          }} />

          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-10">
              {/* Left */}
              <motion.div variants={fadeLeft} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <p className="font-mono text-[#00d4a8] text-xs tracking-[0.2em] uppercase mb-3">Ready to begin?</p>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                  Start Your<br /><span className="text-[#00d4a8]">Journey Today</span>
                </h2>
                <div className="flex flex-col gap-2 text-white/50 text-sm font-light">
                  {course.duration.displayText && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#00d4a8]/60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {course.duration.displayText}
                    </div>
                  )}
                  {course.startDate && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#00d4a8]/60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Starts {formatDate(course.startDate)}
                    </div>
                  )}
                  {enrollmentCount > 0 && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#00d4a8]/60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {enrollmentCount.toLocaleString()}+ learners enrolled
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Right — price card */}
              <motion.div
                variants={fadeRight} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 text-center min-w-[280px] backdrop-blur-sm"
              >
                <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-2">Course Fee</p>
                <p className={`text-4xl font-black mb-6 ${course.pricing.isFree ? 'text-emerald-400' : 'text-[#00d4a8]'}`}>
                  {priceLabel}
                </p>
                <ApplyButton course={course} variant="card" />
                <p className="text-white/30 text-xs mt-3">
                  {course.pricing.isFree ? 'No payment required' : 'Limited spots available'}
                </p>
                <div className="mt-5 pt-5 border-t border-white/8">
                  <Link to="/contact" className="text-sm text-[#00d4a8]/70 hover:text-[#00d4a8] transition-colors font-medium">
                    Have questions? Contact us →
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}

export default ApiCourseDetailPage
