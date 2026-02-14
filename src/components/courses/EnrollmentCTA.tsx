import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

interface EnrollmentCTAProps {
    title?: string
    subtitle?: string
    price?: string
    startDate?: string
    format?: string
}

const EnrollmentCTA: React.FC<EnrollmentCTAProps> = ({
    title = 'Ready to Start Your Journey?',
    subtitle = 'Join our next cohort and transform your career with in-demand tech skills.',
    price,
    startDate,
    format
}) => {
    return (
        <section
            className="relative py-16 overflow-hidden"
            style={{ backgroundColor: '#0c2d5a' }}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            <div className="container relative z-10">
                <div className="max-w-4xl mx-auto">
                    <div className="md:flex items-center justify-between gap-8">
                        {/* Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="mb-8 md:mb-0"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                {title}
                            </h2>
                            <p className="text-lg text-white/80 mb-6">
                                {subtitle}
                            </p>

                            {/* Quick Info */}
                            {(startDate || price || format) && (
                                <div className="flex flex-wrap gap-6 text-white/90">
                                    {startDate && (
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>Starts: {startDate}</span>
                                        </div>
                                    )}
                                    {format && (
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                            <span>{format}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>

                        {/* CTA Box */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="bg-white rounded-2xl p-8 shadow-xl text-center min-w-[280px]"
                        >
                            {price && (
                                <div className="mb-4">
                                    <span className="text-sm text-gray-500">Course Fee</span>
                                    <p className="text-3xl font-bold" style={{ color: '#0c2d5a' }}>{price}</p>
                                </div>
                            )}

                            <Link
                                to="/who-can-apply"
                                className="block w-full py-4 px-6 rounded-full font-semibold text-white transition-all duration-300 hover:opacity-90 hover:shadow-lg mb-4"
                                style={{ backgroundColor: '#0c2d5a' }}
                            >
                                Apply Now
                            </Link>

                            <p className="text-sm text-gray-500">
                                Limited spots available. Secure yours today!
                            </p>

                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <Link
                                    to="/contact"
                                    className="text-sm font-medium hover:underline"
                                    style={{ color: '#0c2d5a' }}
                                >
                                    Have questions? Contact us →
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default EnrollmentCTA
