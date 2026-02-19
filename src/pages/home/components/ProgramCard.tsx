import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Program } from '../../../data/programs'

interface ProgramCardProps {
  program: Program
  index: number
}

export const ProgramCard: React.FC<ProgramCardProps> = ({ 
  program, 
  index
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Link 
        to={`/programs/${program.id}`}
        className="block h-full"
        style={{ textDecoration: 'none' }}
      >
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-full border flex flex-col" style={{ borderColor: 'rgba(12, 45, 90, 0.1)' }}>
          {/* Image */}
          <div className="relative w-full h-48 overflow-hidden rounded-t-xl flex-shrink-0" style={{ aspectRatio: '4/3' }}>
            <img 
              src={program.image} 
              alt={program.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              style={{ aspectRatio: '4/3', display: 'block' }}
              crossOrigin="anonymous"
              decoding="async"
            />
            <div className="absolute inset-0 rounded-t-xl" style={{ backgroundColor: 'rgba(12, 45, 90, 0.2)' }}></div>
          </div>

          <div className="p-6 flex flex-col flex-grow">
            <div className="flex-grow">
              {/* Title */}
              <h3 className="heading-sm mb-4 transition-colors duration-300" style={{ color: '#0c2d5a' }}>
                {program.title}
              </h3>
              
              {/* Description */}
              <p className="text-body text-gray-600 leading-relaxed">
                {program.description}
              </p>
            </div>

            {/* Button - Always at bottom */}
            <div className="mt-6">
              <div
                className="w-full text-center block"
                style={{
                  padding: '12px 24px',
                  borderRadius: '50px',
                  background: 'white',
                  color: '#0c2d5a',
                  fontWeight: '600',
                  fontSize: '14px',
                  border: '2px solid #0c2d5a',
                  boxShadow: '0 6px 20px rgba(12, 45, 90, 0.2)',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(12, 45, 90, 0.3)'
                  e.currentTarget.style.background = '#0c2d5a'
                  e.currentTarget.style.color = 'white'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(12, 45, 90, 0.2)'
                  e.currentTarget.style.background = 'white'
                  e.currentTarget.style.color = '#0c2d5a'
                }}
              >
                Learn More
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default ProgramCard
