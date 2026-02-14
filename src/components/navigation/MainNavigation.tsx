import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchCourses } from '../../lib/api/courseApi'

interface NavigationSubItem {
  id: string
  label: string
  path: string
}

interface NavigationItem {
  id: string
  label: string
  path?: string
  subItems?: NavigationSubItem[]
}

// NEW NAVIGATION STRUCTURE - Cleaner and more intuitive
const INITIAL_NAVIGATION_CONFIG: NavigationItem[] = [
  {
    id: 'home',
    label: 'Home',
    path: '/'
  },
  {
    id: 'about',
    label: 'About',
    subItems: [
      { id: 'who-we-are', label: 'Who We Are', path: '/who-we-are' },
      { id: 'impact', label: 'Our Impact', path: '/impact' },
      { id: 'testimonials', label: 'Testimonials', path: '/testimonials' },
      { id: 'partners', label: 'Our Partners', path: '/partners' },
      { id: 'news', label: 'News & Updates', path: '/news' }
    ]
  },
  {
    id: 'what-we-do',
    label: 'What We Do',
    subItems: [
      { id: 'programs', label: 'Our Programs', path: '/programs' },
      { id: 'partnerships', label: 'Partnerships', path: '/partnerships' },
      { id: 'impact-stories', label: 'Impact & Success Stories', path: '/impact' },
      { id: 'community', label: 'Community Outreach', path: '/community' }
    ]
  },
  {
    id: 'apply-for-training',
    label: 'Apply for Training',
    subItems: []
  },
  {
    id: 'for-organizations',
    label: 'For Organizations',
    subItems: [
      { id: 'corporate-training', label: 'Corporate Training', path: '/partnerships/corporate-sponsorship' },
      { id: 'educational', label: 'Educational Partnerships', path: '/partnerships/educational-partnerships' },
      { id: 'government', label: 'Government Programs', path: '/partnerships/government-collaboration' },
      { id: 'ngo', label: 'NGO & Foundation', path: '/partnerships/ngo-and-foundation-partnerships' },
      { id: 'volunteer', label: 'Volunteer With Us', path: '/opportunities/volunteers' }
    ]
  },
  {
    id: 'contact',
    label: 'Contact',
    path: '/contact'
  },
  {
    id: 'donate',
    label: 'Donate',
    path: '/donate'
  }
]

const MainNavigation: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [navigationConfig, setNavigationConfig] = useState<NavigationItem[]>(INITIAL_NAVIGATION_CONFIG)
  const location = useLocation()

  useEffect(() => {
    fetchCourses()
      .then(courses => {
        const courseItems = courses.map(course => ({
          id: course.slug,
          label: course.title,
          path: `/programs/course/${course.slug}`
        }))
        const subItems = [
          ...courseItems,
          {
            id: 'view-all-courses',
            label: 'View All Courses',
            path: '/programs'
          }
        ]
        setNavigationConfig(prev =>
          prev.map(item =>
            item.id === 'apply-for-training'
              ? { ...item, subItems }
              : item
          )
        )
      })
      .catch(err => console.error('Failed to fetch courses for navigation:', err))
  }, [])

  const isActivePath = (path?: string, subItems?: NavigationSubItem[]) => {
    if (path) return location.pathname === path
    if (subItems) {
      return subItems.some(item => location.pathname === item.path)
    }
    return false
  }

  const handleMouseEnter = (itemId: string) => {
    setActiveDropdown(itemId)
  }

  const handleMouseLeave = () => {
    setActiveDropdown(null)
  }

  const handleLoginClick = () => {
    alert('Login functionality coming soon!')
  }

  const handleRegisterClick = () => {
    alert('Registration functionality coming soon!')
  }

  return (
    <>
      {/* Top Login/Register Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 py-1.5" style={{ backgroundColor: '#0c2d5a' }}>
        <div className="container mx-auto px-4">
          <div className="flex justify-end items-center">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleLoginClick}
                className="text-white/80 hover:text-white text-xs font-medium px-2 py-0.5 rounded-full hover:bg-white/10 transition-all duration-200"
              >
                Login
              </button>
              <div className="w-px h-3 bg-white/30"></div>
              <button
                onClick={handleRegisterClick}
                className="text-white/80 hover:text-white text-xs font-medium px-2 py-0.5 rounded-full hover:bg-white/10 transition-all duration-200"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white shadow-lg fixed left-0 right-0 z-40" style={{ top: '32px' }}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">

              <div className="h-8 w-auto flex items-center font-bold text-[#0c2d5a] text-lg">
                ITForYouth Ghana
              </div>
            </Link>

            {/* Desktop & Tablet Navigation - Clean & Professional */}
            <div className="hidden md:flex items-center md:space-x-0.5 lg:space-x-1">
              {navigationConfig.filter(item => item.id !== 'donate' && item.id !== 'apply').map((item) => (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => item.subItems && handleMouseEnter(item.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  {item.path ? (
                    <Link
                      to={item.path}
                      className={`relative md:px-2 lg:px-4 py-2 font-medium md:text-xs lg:text-sm transition-all duration-200 ${isActivePath(item.path, item.subItems)
                        ? ''
                        : 'text-neutral-600 hover:text-[#0c2d5a]'
                        }`}
                    >
                      {item.label}
                      {isActivePath(item.path, item.subItems) && (
                        <motion.div
                          layoutId="navbar-active"
                          className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#0c2d5a' }}
                          initial={false}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </Link>
                  ) : (
                    <button
                      className={`relative md:px-2 lg:px-4 py-2 font-medium md:text-xs lg:text-sm transition-all duration-200 flex items-center gap-1 ${isActivePath(item.path, item.subItems)
                        ? ''
                        : 'text-neutral-600 hover:text-[#0c2d5a]'
                        }`}
                    >
                      {item.label}
                      {item.subItems && (
                        <svg
                          className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === item.id ? 'rotate-180' : ''
                            }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                      {isActivePath(item.path, item.subItems) && (
                        <motion.div
                          layoutId="navbar-active"
                          className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#0c2d5a' }}
                          initial={false}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </button>
                  )}

                  {/* Clean Dropdown Menu */}
                  <AnimatePresence>
                    {item.subItems && activeDropdown === item.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-neutral-100 py-1 z-50"
                      >
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.id}
                            to={subItem.path!}
                            className={`block px-4 py-2 text-sm transition-colors duration-150 ${location.pathname === subItem.path
                              ? 'font-medium'
                              : 'text-neutral-700 hover:bg-neutral-50'
                              }`}
                            style={location.pathname === subItem.path
                              ? { color: '#0c2d5a', backgroundColor: 'rgba(12, 45, 90, 0.05)' }
                              : undefined
                            }
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Apply Now Button - Highlighted */}
              <div className="md:ml-2 lg:ml-4">
                <Link
                  to="/who-can-apply"
                  className="inline-flex items-center gap-1 md:gap-1 lg:gap-2"
                  style={{
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    borderRadius: '50px',
                    background: '#0c2d5a',
                    color: 'white',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 4px 15px rgba(12, 45, 90, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)'
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(12, 45, 90, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)'
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(12, 45, 90, 0.3)'
                  }}
                >
                  Apply Now
                </Link>
              </div>

              {/* Clean Donate Button */}
              <div className="md:ml-2 lg:ml-4 md:pl-2 lg:pl-4 border-l border-neutral-200">
                <a
                  href="https://www.globalgiving.org/projects/coding-and-digital-skills-for-1000-girls-in-ghana/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 md:gap-1 lg:gap-2"
                  style={{
                    padding: '8px 12px',
                    fontSize: '11px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    borderRadius: '50px',
                    background: '#0c2d5a',
                    color: 'white',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 6px 20px rgba(12, 45, 90, 0.3)',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(12, 45, 90, 0.4)'
                    e.currentTarget.style.background = '#0c2d5a'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)'
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(12, 45, 90, 0.3)'
                    e.currentTarget.style.background = '#0c2d5a'
                  }}
                >
                  <svg className="w-3 h-3 md:w-3 md:h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="hidden lg:inline">Donate</span>
                  <span className="md:inline lg:hidden">Give</span>
                </a>
              </div>
            </div>

            {/* Mobile Menu Button - Clean */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <div className={`w-5 h-0.5 bg-neutral-700 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : 'mb-1'
                  }`} />
                <div className={`w-5 h-0.5 bg-neutral-700 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'mb-1'
                  }`} />
                <div className={`w-5 h-0.5 bg-neutral-700 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''
                  }`} />
              </div>
            </button>
          </div>

          {/* Clean Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-neutral-200 bg-white"
              >
                <div className="py-4">
                  {navigationConfig.filter(item => item.id !== 'donate' && item.id !== 'apply').map((item) => (
                    <div key={item.id} className="px-4">
                      {item.path ? (
                        <Link
                          to={item.path}
                          className={`block py-3 font-medium transition-colors duration-200 ${isActivePath(item.path, item.subItems)
                            ? ''
                            : 'text-neutral-700 hover:text-[#0c2d5a]'
                            }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <>
                          <div className="py-3 font-medium text-neutral-700">
                            {item.label}
                          </div>
                          {item.subItems && (
                            <div className="pl-4 space-y-1 mb-2">
                              {item.subItems.map((subItem) => (
                                <Link
                                  key={subItem.id}
                                  to={subItem.path!}
                                  className={`block py-2 text-sm transition-colors duration-200 ${location.pathname === subItem.path
                                    ? 'text-[#0c2d5a] font-medium'
                                    : 'text-neutral-600 hover:text-[#0c2d5a]'
                                    }`}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  {subItem.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}

                  {/* Mobile Apply Now Button */}
                  <div className="px-4 pt-2">
                    <Link
                      to="/who-can-apply"
                      className="flex items-center justify-center gap-2"
                      style={{
                        padding: '12px 24px',
                        fontSize: '14px',
                        fontWeight: '600',
                        textDecoration: 'none',
                        borderRadius: '50px',
                        background: '#0c2d5a',
                        color: 'white',
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 4px 15px rgba(12, 45, 90, 0.3)',
                        transition: 'all 0.3s ease',
                        display: 'block',
                        textAlign: 'center'
                      }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Apply Now
                    </Link>
                  </div>

                  {/* Mobile Donate Button */}
                  <div className="px-4 pt-4 mt-4 border-t border-neutral-200">
                    <a
                      href="https://www.globalgiving.org/projects/coding-and-digital-skills-for-1000-girls-in-ghana/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                      style={{
                        padding: '14px 28px',
                        fontSize: '16px',
                        fontWeight: '600',
                        textDecoration: 'none',
                        borderRadius: '50px',
                        background: '#0c2d5a',
                        color: 'white',
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 6px 20px rgba(12, 45, 90, 0.3)',
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        backdropFilter: 'blur(10px)'
                      }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 10px 25px rgba(12, 45, 90, 0.4)'
                        e.currentTarget.style.background = '#0c2d5a'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(12, 45, 90, 0.3)'
                        e.currentTarget.style.background = '#0c2d5a'
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Donate Now
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </>
  )
}

export default MainNavigation
