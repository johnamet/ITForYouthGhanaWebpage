import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CourseModule } from '../../data/courseCategories'

interface CourseSyllabusProps {
    modules: CourseModule[]
}

const CourseSyllabus: React.FC<CourseSyllabusProps> = ({ modules }) => {
    const [expandedModule, setExpandedModule] = useState<number | null>(0)

    const toggleModule = (index: number) => {
        setExpandedModule(expandedModule === index ? null : index)
    }

    return (
        <div className="space-y-4">
            {modules.map((module, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="border border-gray-200 rounded-xl overflow-hidden bg-white"
                >
                    {/* Module Header */}
                    <button
                        onClick={() => toggleModule(index)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                style={{ backgroundColor: '#0c2d5a' }}
                            >
                                {index + 1}
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">{module.title}</h4>
                                <p className="text-sm text-gray-500">{module.duration} • {module.lessons.length} lessons</p>
                            </div>
                        </div>
                        <motion.svg
                            animate={{ rotate: expandedModule === index ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-5 h-5 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </motion.svg>
                    </button>

                    {/* Module Content */}
                    <AnimatePresence>
                        {expandedModule === index && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="px-5 pb-5 border-t border-gray-100">
                                    <ul className="mt-4 space-y-3">
                                        {module.lessons.map((lesson, lessonIndex) => (
                                            <li key={lessonIndex} className="flex items-start gap-3">
                                                <div className="mt-1.5">
                                                    <div
                                                        className="w-2 h-2 rounded-full"
                                                        style={{ backgroundColor: '#0c2d5a' }}
                                                    />
                                                </div>
                                                <span className="text-gray-700">{lesson}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            ))}
        </div>
    )
}

export default CourseSyllabus
