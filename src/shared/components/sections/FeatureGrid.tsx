import React, { ReactNode } from 'react'

export interface FeatureItem {
  id: string
  icon?: ReactNode
  title: string
  description: string
}

interface FeatureGridProps {
  title?: string
  description?: string
  features: FeatureItem[]
  columns?: 2 | 3 | 4
}

/**
 * Feature grid component for displaying features in a grid layout
 */
export function FeatureGrid({
  title,
  description,
  features,
  columns = 3,
}: FeatureGridProps) {
  const gridClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }[columns]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {(title || description) && (
          <div className="text-center mb-12">
            {title && <h2 className="text-3xl sm:text-4xl font-bold mb-4">{title}</h2>}
            {description && <p className="text-lg text-muted-foreground">{description}</p>}
          </div>
        )}
        
        <div className={`grid grid-cols-1 gap-8 ${gridClass}`}>
          {features.map((feature) => (
            <div
              key={feature.id}
              className="p-6 rounded-lg border border-border hover:shadow-lg transition-shadow"
            >
              {feature.icon && (
                <div className="mb-4 text-primary text-4xl">
                  {feature.icon}
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
