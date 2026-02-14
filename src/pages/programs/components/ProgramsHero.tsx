import React from 'react'
import { motion } from 'framer-motion'

const ProgramsHero: React.FC = () => {
  return (
    <section className="relative py-32 overflow-hidden bg-primary">
      {/* Background Gradient & Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-90 to-primary-80 opacity-100" />
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />

      {/* Glow effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-10 transform translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center text-white max-w-4xl mx-auto"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-blue-200 text-sm font-semibold mb-6 backdrop-blur-sm border border-white/10">
            Empowering the Future
          </span>
          <h1 className="hero-title mb-6 tracking-tight">Our Programs</h1>
          <p className="text-xl md:text-2xl text-blue-100 font-light leading-relaxed max-w-2xl mx-auto">
            Comprehensive technology education designed to empower learners from every background.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default ProgramsHero
