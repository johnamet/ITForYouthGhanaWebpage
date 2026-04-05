import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface HeroSectionProps {
  title: string
  subtitle?: string
  description?: string
  backgroundImage?: string
  children?: ReactNode
  cta?: {
    label: string
    href: string
    variant?: 'primary' | 'secondary'
  }
  secondaryCta?: {
    label: string
    href: string
  }
}

/**
 * Reusable hero section component
 */
export function HeroSection({
  title,
  subtitle,
  description,
  backgroundImage,
  children,
  cta,
  secondaryCta,
}: HeroSectionProps) {
  return (
    <section
      className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-black/40 z-0" />
      )}
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {subtitle && (
          <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">
            {subtitle}
          </p>
        )}
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          {title}
        </h1>
        
        {description && (
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {description}
          </p>
        )}
        
        {children && <div className="mb-8">{children}</div>}
        
        {(cta || secondaryCta) && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {cta && (
              <Link
                to={cta.href}
                className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                  cta.variant === 'secondary'
                    ? 'bg-white text-primary hover:bg-gray-50'
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                {cta.label}
              </Link>
            )}
            {secondaryCta && (
              <Link
                to={secondaryCta.href}
                className="px-8 py-3 rounded-lg font-semibold border-2 border-current text-foreground hover:bg-foreground/5 transition-colors"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
