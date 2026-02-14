import React from 'react'
import { motion } from 'framer-motion'
import { Instructor } from '../../data/courseCategories'

interface InstructorCardProps {
    instructor: Instructor
}

const InstructorCard: React.FC<InstructorCardProps> = ({ instructor }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
        >
            <div className="md:flex">
                {/* Instructor Image */}
                <div className="md:w-1/3">
                    <img
                        src={instructor.image}
                        alt={instructor.name}
                        className="w-full h-64 md:h-full object-cover"
                    />
                </div>

                {/* Instructor Info */}
                <div className="p-8 md:w-2/3">
                    <div className="flex items-center gap-2 mb-2">
                        <span
                            className="text-xs font-semibold px-3 py-1 rounded-full"
                            style={{ backgroundColor: 'rgba(12, 45, 90, 0.1)', color: '#0c2d5a' }}
                        >
                            Your Instructor
                        </span>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{instructor.name}</h3>
                    <p className="text-lg text-gray-500 mb-4">{instructor.title}</p>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                        {instructor.bio}
                    </p>

                    {/* Expertise Tags */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Areas of Expertise</h4>
                        <div className="flex flex-wrap gap-2">
                            {instructor.expertise.map((skill, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-full bg-gray-100 text-gray-700"
                                >
                                    <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default InstructorCard
