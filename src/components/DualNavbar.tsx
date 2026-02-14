import { getImagePath } from '../utils/randomImages'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'

const DualNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isWhatWeDoOpen, setIsWhatWeDoOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const PORTAL_BASE_URL = import.meta.env.VITE_PORTAL_URL || 'https://portal.itforyouthghana.org'

  const handleLogin = () => {
    window.location.href = `${PORTAL_BASE_URL}/login`
  }

  const handleRegister = () => {
    window.location.href = `${PORTAL_BASE_URL}/register`
  }

  // Hauptnavigation
  const mainNavItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Impact', href: '/impact' },
    { name: 'Partners', href: '/partners' },
    { name: 'Donate', href: '/donate' },
    { name: 'Contact', href: '/contact' },
  ]

  // "What We Do" Dropdown Items
  const whatWeDoItems = [
    { name: 'Programs', href: '/programs', description: 'Our training programs and courses' },
    { name: 'Volunteer', href: '/volunteer', description: 'Join our volunteer team' },
    { name: 'Donate', href: '/donate', description: 'Support our mission' },
  ]

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Top Navbar - Schmale Leiste mit Login */}
      <div className="bg-primary text-white py-2">
        <div className="container">
          <div className="flex items-center justify-end space-x-4">
            <motion.button
              onClick={handleLogin}
              className="text-sm text-white/90 hover:text-white transition-colors duration-200 px-3 py-1 rounded hover:bg-white/10"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Login
            </motion.button>
            <motion.button
              onClick={handleRegister}
              className="text-sm bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Register
            </motion.button>
          </div>
        </div>
      </div>

      {/* Haupt-Navigation */}
      <motion.header
        className={`bg-white transition-all duration-300 ${
          isScrolled
            ? 'shadow-lg border-b border-neutral-200 py-3'
            : 'shadow-md py-4'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}
              className="flex items-center"
            >
              <motion.div
                className="flex items-center"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src={getImagePath("/images/logo/logo.jpg")}
                  alt="IT for Youth Ghana"
                  className={`w-auto object-contain transition-all duration-300 max-w-[120px] ${
                    isScrolled ? 'h-6' : 'h-8'
                  }`}
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {mainNavItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.href}
                    onClick={() => setTimeout(() => window.scrollTo(0, 0), 100)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-primary/5 hover:text-primary ${
                      location.pathname === item.href
                        ? 'text-primary bg-primary/10'
                        : 'text-neutral-700'
                    }`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}

              {/* What We Do Dropdown */}
              <div className="relative">
                <motion.button
                  onClick={() => setIsWhatWeDoOpen(!isWhatWeDoOpen)}
                  className="px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-primary/5 hover:text-primary text-neutral-700 flex items-center space-x-1"
                  whileHover={{ scale: 1.02 }}
                >
                  <span>WHAT WE DO</span>
                  <motion.svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: isWhatWeDoOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isWhatWeDoOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-neutral-200 py-4 z-50"
                      onMouseLeave={() => setIsWhatWeDoOpen(false)}
                    >
                      {whatWeDoItems.map((item, index) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Link
                            to={item.href}
                            onClick={() => {
                              setIsWhatWeDoOpen(false)
                              setTimeout(() => window.scrollTo(0, 0), 100)
                            }}
                            className="block px-6 py-3 hover:bg-primary/5 transition-colors duration-200 group"
                          >
                            <div className="font-medium text-neutral-900 group-hover:text-primary mb-1">
                              {item.name}
                            </div>
                            <div className="text-sm text-neutral-800">
                              {item.description}
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: isMobileMenuOpen ? 45 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </motion.svg>
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:hidden mt-4 py-4 border-t border-neutral-200"
              >
                <div className="space-y-2">
                  {mainNavItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        setTimeout(() => window.scrollTo(0, 0), 100)
                      }}
                      className={`block px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                        location.pathname === item.href
                          ? 'text-primary bg-primary/10'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}

                  <div className="border-t border-neutral-200 pt-4 mt-4">
                    <div className="text-sm font-medium text-neutral-700 px-4 mb-2">WHAT WE DO</div>
                    {whatWeDoItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => {
                          setIsMobileMenuOpen(false)
                          setTimeout(() => window.scrollTo(0, 0), 100)
                        }}
                        className="block px-4 py-3 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors duration-200"
                      >
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-neutral-700">{item.description}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
    </div>
  )
}

export default DualNavbar
