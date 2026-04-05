import React from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  subtitle?: string
}

/**
 * Reusable page header component
 * Used to display page title and description
 */
export function PageHeader({ title, description, subtitle }: PageHeaderProps) {
  return (
    <div className="bg-gradient-to-br from-primary/5 to-primary/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
          {title}
        </h1>
        {description && (
          <p className="text-lg text-muted-foreground">
            {description}
          </p>
        )}
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-2">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
