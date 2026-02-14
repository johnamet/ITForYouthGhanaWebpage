import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CourseFAQ as FAQType } from '../../data/courseCategories'

interface CourseFAQProps {
    faqs: FAQType[]
}

const CourseFAQ: React.FC<CourseFAQProps> = ({ faqs }) => {
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

    const toggleFaq = (index: number) => {
        setExpandedFaq(expandedFaq === index ? null : index)
    }

    if (faqs.length === 0) {
        return null
    }

    return (
        <div className="space-y-4">
            {faqs.map((faq, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
                >
                    <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                    >
                        <h4 className="font-semibold text-gray-900 pr-4">{faq.question}</h4>
                        <motion.div
                            animate={{ rotate: expandedFaq === index ? 45 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: expandedFaq === index ? '#0c2d5a' : 'rgba(12, 45, 90, 0.1)' }}
                        >
                            <svg
                                className="w-4 h-4 transition-colors"
                                style={{ color: expandedFaq === index ? 'white' : '#0c2d5a' }}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12M6 12h12" />
                            </svg>
                        </motion.div>
                    </button>

                    <AnimatePresence>
                        {expandedFaq === index && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="px-6 pb-6 border-t border-gray-100">
                                    <p className="text-gray-600 mt-4 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            ))}
        </div>
    )
}

export default CourseFAQ
