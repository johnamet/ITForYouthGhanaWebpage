import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Course } from '../../data/courseCategories'

interface CourseCardProps {
    course: Course
    categorySlug: string
    index?: number
}

const CourseCard: React.FC<CourseCardProps> = ({ course, categorySlug, index = 0 }) => {
    const levelColors = {
        Beginner: 'bg-green-500',
        Intermediate: 'bg-yellow-500',
        Advanced: 'bg-red-500'
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
        >
            <Link
                to={`/programs/${categorySlug}/${course.id}`}
                className="block h-full"
            >
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full group hover:shadow-2xl transition-all duration-300 border border-gray-100">
                    {/* Course Image */}
                    <div className="relative h-48 overflow-hidden">
                        <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        {/* Level Badge */}
                        <div className="absolute top-4 left-4">
                            <span className={`${levelColors[course.level]} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                                {course.level}
                            </span>
                        </div>

                        {/* Duration Badge */}
                        <div className="absolute top-4 right-4">
                            <span className="bg-white/90 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {course.duration}
                            </span>
                        </div>

                        {/* Title on Image */}
                        <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-xl font-bold text-white mb-1">{course.title}</h3>
                        </div>
                    </div>

                    {/* Course Content */}
                    <div className="p-6">
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {course.shortDescription}
                        </p>

                        {/* Skills Preview */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {course.skills.slice(0, 3).map((skill, idx) => (
                                <span
                                    key={idx}
                                    className="text-xs px-2 py-1 rounded-full"
                                    style={{ backgroundColor: 'rgba(12, 45, 90, 0.1)', color: '#0c2d5a' }}
                                >
                                    {skill}
                                </span>
                            ))}
                            {course.skills.length > 3 && (
                                <span className="text-xs text-gray-500">+{course.skills.length - 3} more</span>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                                {course.certification && (
                                    <span className="flex items-center text-xs text-green-600">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Certificate
                                    </span>
                                )}
                            </div>
                            <span
                                className="text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all"
                                style={{ color: '#0c2d5a' }}
                            >
                                View Details
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}

export default CourseCard
