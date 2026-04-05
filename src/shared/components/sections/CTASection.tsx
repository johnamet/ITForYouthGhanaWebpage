import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface CTASectionProps {
  title: string
  description?: string
  primaryCta: {
    label: string
    href: string
  }
  secondaryCta?: {
    label: string
    href: string
  }
  children?: ReactNode
  variant?: 'primary' | 'dark'
}

/**
 * Call-to-action section component
 */
export function CTASection({
  title,
  description,
  primaryCta,
  secondaryCta,
  children,
  variant = 'primary',
}: CTASectionProps) {
  const isDark = variant === 'dark'

  return (
    <section className={`py-16 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-foreground text-background' : 'bg-primary/10'}`}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          {title}
        </h2>
        
        {description && (
          <p className="text-lg mb-8 opacity-90">
            {description}
          </p>
        )}
        
        {children && <div className="mb-8">{children}</div>}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={primaryCta.href}
            className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
              isDark
                ? 'bg-background text-foreground hover:bg-background/90'
                : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            {primaryCta.label}
          </Link>
          
          {secondaryCta && (
            <Link
              to={secondaryCta.href}
              className={`px-8 py-3 rounded-lg font-semibold border-2 transition-colors ${
                isDark
                  ? 'border-background text-background hover:bg-background/10'
                  : 'border-primary text-primary hover:bg-primary/10'
              }`}
            >
              {secondaryCta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
