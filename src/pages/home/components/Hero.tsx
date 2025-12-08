import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getImagePath } from '../../../utils/randomImages'

const heroSlides = [
  {
    image: getImagePath('/images/randomPictures/maingraduationpic.jpg'),
    title: 'Graduation Success 2024',
    subtitle: 'Celebrating our students achievements as they complete their IT training journey'
  },
  {
    image: getImagePath('/images/randomPictures/girlstaslkingUX.jpg'),
    title: 'UX Design Training',
    subtitle: 'Students mastering user experience design and digital product development'
  },
  {
    image: getImagePath('/images/randomPictures/petertalkingtostudentscoloful.jpg'),
    title: 'Expert Instruction',
    subtitle: 'Learn from experienced tech professionals and industry experts'
  },
  {
    image: getImagePath('/images/randomPictures/groupworkstudents.jpg'),
    title: 'Collaborative Learning',
    subtitle: 'Work together on real-world projects and build team skills'
  },
  {
    image: getImagePath('/images/randomPictures/studentgroupguys.jpg'),
    title: 'Tech Community',
    subtitle: 'Join a vibrant community of aspiring tech professionals'
  },
  {
    image: getImagePath('/images/randomPictures/graduationspeaking.jpg'),
    title: 'Your Success Story',
    subtitle: 'Transform your career with professional IT training and certification'
  }
]

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isFirstRender, setIsFirstRender] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
      setIsFirstRender(false)
    }, 5000) // 5 seconds per slide

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    setIsFirstRender(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => prev === 0 ? heroSlides.length - 1 : prev - 1)
    setIsFirstRender(false)
  }

  return (
    <>
      <section 
        className="hero mobile-hero-design"
        style={{
          position: 'relative',
          height: '90vh',
          overflow: 'hidden'
        }}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
      {/* Hero Background with proper centering */}
      <div 
        className="hero-background"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          background: '#0c2d5a'
        }}
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentSlide}
            className="absolute inset-0"
            initial={isFirstRender ? { x: '0%' } : { x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <img
              src={heroSlides[currentSlide].image}
              alt={heroSlides[currentSlide].title}
              className="hero-image"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center'
              }}
              loading="eager"
              onError={(e) => {
                console.log('Image failed to load:', heroSlides[currentSlide].image);
                console.log('Error event:', e);
              }}
              onLoad={() => {
                console.log('Image loaded successfully:', heroSlides[currentSlide].image);
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Centered Logo - Desktop higher, Mobile lower */}
      <div 
        className="logo-container"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.img
            src={getImagePath("/images/logo/logo.jpg")}
            alt="IT for Youth Ghana - Empowering Youth Through Technology"
            className="logo"
            style={{
              width: 'clamp(220px, 25vw, 380px)',
              height: 'auto',
              borderRadius: '50%',
              objectFit: 'contain',
              background: 'transparent',
              filter: 'drop-shadow(0 12px 40px rgba(0, 0, 0, 0.5))'
            }}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.3 }
            }}
          />
        </motion.div>
      </div>

      {/* Navigation Controls */}
      <button
        onClick={prevSlide}
        className="nav-button nav-button-left"
        aria-label="Previous slide"
        style={{
          position: 'absolute',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          border: 'none',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          color: 'white'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
        }}
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="nav-button nav-button-right"
        aria-label="Next slide"
        style={{
          position: 'absolute',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          border: 'none',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          color: 'white'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
        }}
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div 
        style={{
          position: 'absolute',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
          zIndex: 10
        }}
      >
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              border: 'none',
              background: index === currentSlide ? 'white' : 'rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: index === currentSlide ? 'scale(1.25)' : 'scale(1)'
            }}
            onMouseEnter={(e) => {
              if (index !== currentSlide) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.7)'
              }
            }}
            onMouseLeave={(e) => {
              if (index !== currentSlide) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)'
              }
            }}
          />
        ))}
      </div>

      {/* Mobile Contact Buttons - Inside Hero Section */}
      <div 
        className="mobile-contact-buttons"
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '15px',
          zIndex: 20
        }}
      >
        {/* Mail Button */}
        <a
          href="mailto:info@itforyouthghana.org"
          className="btn btn-primary"
          title="Send Email"
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0',
            minWidth: '56px',
            minHeight: '56px'
          }}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </a>

        {/* Phone Button */}
        <a
          href="tel:+233596244834"
          className="btn btn-secondary"
          title="Call Us"
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0',
            minWidth: '56px',
            minHeight: '56px'
          }}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </a>

        {/* LinkedIn Button */}
        <a
          href="https://www.linkedin.com/company/98944149/admin/dashboard/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          title="LinkedIn"
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0',
            minWidth: '56px',
            minHeight: '56px'
          }}
        >
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
      </div>

      </section>

      {/* Desktop Contact Buttons - Outside Hero Section */}
      <div 
        className="contact-buttons desktop-only"
        style={{
          position: 'relative',
          marginTop: '-40px',
          display: 'none',
          justifyContent: 'center',
          gap: '15px',
          zIndex: 30,
          paddingBottom: '20px'
        }}
      >
        {/* Mail Button */}
        <a
          href="mailto:info@itforyouthghana.org"
          className="btn btn-primary"
          title="Send Email"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <span style={{ 
            width: '22px', 
            height: '22px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '50%',
            padding: '4px'
          }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </span>
          <span>Email</span>
        </a>

        {/* Phone Button */}
        <a
          href="tel:+233596244834"
          className="btn btn-secondary"
          title="Call Us"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <span style={{ 
            width: '22px', 
            height: '22px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'rgba(1, 82, 190, 0.1)',
            borderRadius: '50%',
            padding: '4px'
          }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </span>
          <span>Phone</span>
        </a>

        {/* LinkedIn Button */}
        <a
          href="https://www.linkedin.com/company/it-for-youth-ghana"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          title="LinkedIn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <span style={{ 
            width: '22px', 
            height: '22px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '50%',
            padding: '4px'
          }}>
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </span>
          <span>LinkedIn</span>
        </a>
      </div>
      <style>{`
        /* Desktop: Hero mit Bogen (clipPath) */
        @media (min-width: 769px) {
          .mobile-hero-design {
            clip-path: ellipse(100% 100% at 50% 0%);
          }
          
          /* Desktop: Zeige normale Buttons mit Text - außerhalb der section */
          .contact-buttons.desktop-only {
            flex-direction: row !important;
            gap: 15px !important;
            position: relative !important;
            margin-top: -40px !important;
            bottom: auto !important;
            left: auto !important;
            transform: none !important;
            display: flex !important;
          }
          
          /* Desktop: Verstecke mobile contact buttons */
          .mobile-contact-buttons {
            display: none !important;
          }
          
          .contact-buttons .btn {
            min-width: 120px !important;
            width: auto !important;
            height: auto !important;
            padding: 12px 24px !important;
            border-radius: 50px !important;
            min-height: 48px !important;
          }
          
          .contact-buttons .btn span:last-child {
            display: inline !important;
          }
          
          .contact-buttons .btn span:first-child {
            width: 22px !important;
            height: 22px !important;
            background: rgba(255, 255, 255, 0.15) !important;
            padding: 4px !important;
          }
          
          .contact-buttons .btn span:first-child svg {
            width: 14px !important;
            height: 14px !important;
          }
        }
        
        /* Mobile: Hero ohne Bogen - verbessertes Design */
        @media (max-width: 768px) {
          .mobile-hero-design {
            clip-path: none !important;
            border-radius: 0 !important;
            min-height: 100vh !important;
            height: 100vh !important;
            margin-top: -112px !important;
            padding-top: 112px !important;
          }
          
          .hero-background {
            height: calc(100vh - 112px) !important;
            min-height: calc(100vh - 112px) !important;
            top: 112px !important;
          }
          
          .hero-background img {
            height: 100% !important;
            object-fit: cover !important;
            object-position: center !important;
          }
          
          .contact-buttons.desktop-only {
            display: none !important;
          }
          
          /* Mobile: Buttons sauber positioniert */
          .mobile-contact-buttons {
            display: flex !important;
            position: absolute !important;
            bottom: 20px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            gap: 12px !important;
            z-index: 30 !important;
            padding: 0 16px;
          }
          
          /* Mobile buttons optimiert - nur Icons */
          .mobile-contact-buttons .btn {
            min-width: 50px !important;
            width: 50px !important;
            height: 50px !important;
            padding: 0 !important;
            border-radius: 50% !important;
            justify-content: center !important;
            font-size: 18px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
          }
          
          .logo {
            width: clamp(200px, 45vw, 300px) !important;
            max-width: 300px !important;
          }
          
          .logo-container {
            top: 45% !important;
          }
          
          .nav-button-left,
          .nav-button-right {
            top: 45% !important;
            transform: translateY(-50%) !important;
            width: 40px !important;
            height: 40px !important;
            min-width: 40px !important;
            min-height: 40px !important;
          }
          
          .nav-button-left {
            left: 8px !important;
          }
          
          .nav-button-right {
            right: 8px !important;
          }
          
          /* Slide indicators besser positioniert */
          .mobile-hero-design div[style*="bottom: 80px"] {
            bottom: 80px !important;
          }
          
          /* Navigation buttons SVG kleiner für mobile */
          .nav-button svg {
            width: 20px !important;
            height: 20px !important;
          }
        }
        
        /* Hero Image Styles - Optimiert für Ghana Internet */
        .hero-image-container {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          overflow: hidden;
        }
        
        .hero-image {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          object-position: center !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
        }
        
        /* Desktop: Bilder fokussieren oberes Zentrum */
        @media (min-width: 769px) {
          .hero-image {
            object-position: center top !important;
          }
        }
        
        /* Additional container styles for LazyImage component */
        .hero-image-container .relative {
          width: 100% !important;
          height: 100% !important;
        }
        
        .hero-image-container img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          object-position: center !important;
        }
      `}</style>
    </>
  )
}

export default Hero