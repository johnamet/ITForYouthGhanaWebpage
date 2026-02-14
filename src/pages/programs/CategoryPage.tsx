import React from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getCategoryBySlug, courseCategories } from '../../data/courseCategories'
import { CourseCard } from '../../components/courses'
import SEO from '../../components/SEO'

const CategoryPage: React.FC = () => {
    const { category } = useParams<{ category: string }>()
    const navigate = useNavigate()

    const categoryData = category ? getCategoryBySlug(category) : null

    if (!categoryData) {
        navigate('/programs')
        return null
    }

    return (
        <>
            <SEO
                title={`${categoryData.name} Programs - IT for Youth Ghana`}
                description={categoryData.description}
                canonical={`/programs/${categoryData.slug}`}
            />

            <div className="min-h-screen bg-white pt-24">
                {/* Hero Section */}
                <section
                    className="relative py-20 overflow-hidden"
                    style={{ backgroundColor: '#0c2d5a' }}
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                            backgroundSize: '32px 32px'
                        }} />
                    </div>

                    <div className="container relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="max-w-4xl mx-auto text-center"
                        >
                            {/* Icon */}
                            <div className="text-6xl mb-6">{categoryData.icon}</div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                                {categoryData.name}
                            </h1>

                            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                                {categoryData.longDescription}
                            </p>

                            {/* Quick Stats */}
                            <div className="flex flex-wrap justify-center gap-8 text-white/80">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    <span>{categoryData.courses.length} Courses Available</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span>Career-Ready Training</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                    <span>Certification Included</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Breadcrumbs */}
                <div className="container py-4">
                    <nav className="text-sm text-gray-500">
                        <Link to="/" className="hover:text-gray-700">Home</Link>
                        <span className="mx-2">/</span>
                        <Link to="/programs" className="hover:text-gray-700">Programs</Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900 font-medium">{categoryData.name}</span>
                    </nav>
                </div>

                {/* Courses Grid */}
                <section className="py-16 bg-gray-50">
                    <div className="container">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0c2d5a' }}>
                                Available Courses
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Choose from our carefully curated courses designed to take you from beginner to professional
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {categoryData.courses.map((course, index) => (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    categorySlug={categoryData.slug}
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why Choose This Track */}
                <section className="py-20 bg-white">
                    <div className="container">
                        <div className="max-w-6xl mx-auto">
                            <div className="grid lg:grid-cols-2 gap-16 items-center">
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#0c2d5a' }}>
                                        Why Choose {categoryData.name}?
                                    </h2>

                                    <ul className="space-y-4">
                                        {categoryData.whyChoose.map((reason, index) => (
                                            <motion.li
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                                className="flex items-start gap-4"
                                            >
                                                <div
                                                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-1"
                                                    style={{ backgroundColor: 'rgba(12, 45, 90, 0.1)' }}
                                                >
                                                    <svg className="w-3 h-3" style={{ color: '#0c2d5a' }} fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <span className="text-lg text-gray-700">{reason}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <img
                                        src={categoryData.image}
                                        alt={categoryData.name}
                                        className="w-full h-[400px] object-cover rounded-2xl shadow-2xl"
                                    />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Career Paths */}
                <section className="py-20" style={{ backgroundColor: 'rgba(12, 45, 90, 0.03)' }}>
                    <div className="container">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0c2d5a' }}>
                                Career Opportunities
                            </h2>
                            <p className="text-lg text-gray-600">
                                Our graduates have gone on to successful careers in these roles
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
                            {categoryData.careerPaths.map((career, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow"
                                >
                                    <div
                                        className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
                                        style={{ backgroundColor: 'rgba(12, 45, 90, 0.1)' }}
                                    >
                                        <svg className="w-6 h-6" style={{ color: '#0c2d5a' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-gray-900">{career}</h3>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20" style={{ backgroundColor: '#0c2d5a' }}>
                    <div className="container">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="max-w-3xl mx-auto text-center"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Ready to Start Your {categoryData.name} Journey?
                            </h2>
                            <p className="text-xl text-white/80 mb-8">
                                Join hundreds of students who have transformed their careers through our programs
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/who-can-apply"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-lg font-semibold rounded-full hover:bg-gray-100 transition-colors"
                                    style={{ color: '#0c2d5a' }}
                                >
                                    Apply Now
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white text-lg font-semibold rounded-full hover:bg-white/10 transition-colors"
                                >
                                    Get More Info
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Other Categories */}
                <section className="py-20 bg-white">
                    <div className="container">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#0c2d5a' }}>
                                Explore Other Programs
                            </h2>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            {courseCategories
                                .filter(cat => cat.id !== categoryData.id)
                                .map((cat, index) => (
                                    <motion.div
                                        key={cat.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                    >
                                        <Link
                                            to={`/programs/${cat.slug}`}
                                            className="block bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors group"
                                        >
                                            <div className="text-3xl mb-3">{cat.icon}</div>
                                            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                                {cat.name}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {cat.courses.length} courses
                                            </p>
                                        </Link>
                                    </motion.div>
                                ))}
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

export default CategoryPage
