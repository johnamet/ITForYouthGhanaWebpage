import React from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getCourseById, getCategoryBySlug } from '../../data/courseCategories'
import { CourseSyllabus, InstructorCard, CourseFAQ, EnrollmentCTA, CourseCard } from '../../components/courses'
import SEO from '../../components/SEO'

const CourseDetailPage: React.FC = () => {
    const { category, courseId } = useParams<{ category: string; courseId: string }>()
    const navigate = useNavigate()

    const categoryData = category ? getCategoryBySlug(category) : null
    const course = category && courseId ? getCourseById(category, courseId) : null

    if (!course || !categoryData) {
        navigate('/programs')
        return null
    }

    const levelColors = {
        Beginner: { bg: 'bg-green-100', text: 'text-green-700' },
        Intermediate: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
        Advanced: { bg: 'bg-red-100', text: 'text-red-700' }
    }

    // Get related courses (other courses from same category)
    const relatedCourses = categoryData.courses
        .filter(c => c.id !== course.id)
        .slice(0, 2)

    return (
        <>
            <SEO
                title={`${course.title} - ${categoryData.name} | IT for Youth Ghana`}
                description={course.shortDescription}
                canonical={`/programs/${category}/${courseId}`}
            />

            <div className="min-h-screen bg-white pt-24">
                {/* Hero Section */}
                <section
                    className="relative py-16 lg:py-20 overflow-hidden"
                    style={{ backgroundColor: '#0c2d5a' }}
                >
                    <div className="container relative z-10">
                        {/* Breadcrumbs */}
                        <nav className="text-sm text-white/70 mb-8">
                            <Link to="/" className="hover:text-white">Home</Link>
                            <span className="mx-2">/</span>
                            <Link to="/programs" className="hover:text-white">Programs</Link>
                            <span className="mx-2">/</span>
                            <Link to={`/programs/${category}`} className="hover:text-white">{categoryData.name}</Link>
                            <span className="mx-2">/</span>
                            <span className="text-white">{course.title}</span>
                        </nav>

                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                {/* Course Badges */}
                                <div className="flex flex-wrap gap-3 mb-6">
                                    <span className={`${levelColors[course.level].bg} ${levelColors[course.level].text} text-sm font-semibold px-4 py-1.5 rounded-full`}>
                                        {course.level}
                                    </span>
                                    {course.certification && (
                                        <span className="bg-white/10 text-white text-sm font-semibold px-4 py-1.5 rounded-full flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Certificate Included
                                        </span>
                                    )}
                                </div>

                                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                                    {course.title}
                                </h1>

                                <p className="text-xl text-white/90 mb-8">
                                    {course.description}
                                </p>

                                {/* Quick Info */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                    <div className="bg-white/10 rounded-xl p-4 text-center">
                                        <svg className="w-6 h-6 mx-auto mb-2 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-white font-semibold">{course.duration}</p>
                                        <p className="text-white/60 text-sm">Duration</p>
                                    </div>
                                    <div className="bg-white/10 rounded-xl p-4 text-center">
                                        <svg className="w-6 h-6 mx-auto mb-2 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-white font-semibold">{course.price}</p>
                                        <p className="text-white/60 text-sm">Course Fee</p>
                                    </div>
                                    <div className="bg-white/10 rounded-xl p-4 text-center">
                                        <svg className="w-6 h-6 mx-auto mb-2 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-white font-semibold">{course.startDate}</p>
                                        <p className="text-white/60 text-sm">Next Cohort</p>
                                    </div>
                                    <div className="bg-white/10 rounded-xl p-4 text-center">
                                        <svg className="w-6 h-6 mx-auto mb-2 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <p className="text-white font-semibold">{course.maxStudents}</p>
                                        <p className="text-white/60 text-sm">Max Students</p>
                                    </div>
                                </div>

                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4">
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
                                    <a
                                        href="#syllabus"
                                        className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white text-lg font-semibold rounded-full hover:bg-white/10 transition-colors"
                                    >
                                        View Syllabus
                                    </a>
                                </div>
                            </motion.div>

                            {/* Course Image */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                className="hidden lg:block"
                            >
                                <img
                                    src={course.image}
                                    alt={course.title}
                                    className="w-full h-[400px] object-cover rounded-2xl shadow-2xl"
                                />
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Skills You'll Learn */}
                <section className="py-16 bg-white">
                    <div className="container">
                        <div className="max-w-4xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="text-center mb-10"
                            >
                                <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0c2d5a' }}>
                                    Skills You'll Learn
                                </h2>
                                <p className="text-lg text-gray-600">
                                    Master these in-demand technologies and skills
                                </p>
                            </motion.div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {course.skills.map((skill, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="bg-gray-50 rounded-xl p-4 text-center hover:shadow-md transition-shadow"
                                    >
                                        <div
                                            className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center"
                                            style={{ backgroundColor: 'rgba(12, 45, 90, 0.1)' }}
                                        >
                                            <svg className="w-5 h-5" style={{ color: '#0c2d5a' }} fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-gray-800 font-medium">{skill}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Prerequisites */}
                <section className="py-16 bg-gray-50">
                    <div className="container">
                        <div className="max-w-4xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <h2 className="text-3xl font-bold mb-6" style={{ color: '#0c2d5a' }}>
                                    Prerequisites
                                </h2>
                                <div className="bg-white rounded-xl p-8 shadow-md">
                                    <p className="text-gray-600 mb-6">
                                        Before enrolling in this course, you should have:
                                    </p>
                                    <ul className="space-y-4">
                                        {course.prerequisites.map((prereq, index) => (
                                            <li key={index} className="flex items-start gap-4">
                                                <div
                                                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                                                    style={{ backgroundColor: '#0c2d5a' }}
                                                >
                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <span className="text-gray-700 text-lg">{prereq}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Course Syllabus */}
                <section id="syllabus" className="py-16 bg-white">
                    <div className="container">
                        <div className="max-w-4xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="text-center mb-10"
                            >
                                <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0c2d5a' }}>
                                    Course Syllabus
                                </h2>
                                <p className="text-lg text-gray-600">
                                    {course.modules.length} modules • {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons
                                </p>
                            </motion.div>

                            <CourseSyllabus modules={course.modules} />
                        </div>
                    </div>
                </section>

                {/* Instructor Section */}
                <section className="py-16 bg-gray-50">
                    <div className="container">
                        <div className="max-w-4xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="mb-10"
                            >
                                <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0c2d5a' }}>
                                    Meet Your Instructor
                                </h2>
                            </motion.div>

                            <InstructorCard instructor={course.instructor} />
                        </div>
                    </div>
                </section>

                {/* Career Outcomes */}
                <section className="py-16 bg-white">
                    <div className="container">
                        <div className="max-w-4xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="text-center mb-10"
                            >
                                <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0c2d5a' }}>
                                    Career Outcomes
                                </h2>
                                <p className="text-lg text-gray-600">
                                    After completing this course, you'll be prepared for these roles
                                </p>
                            </motion.div>

                            <div className="grid md:grid-cols-3 gap-6">
                                {course.careerOutcomes.map((career, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                        className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
                                    >
                                        <div
                                            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                                            style={{ backgroundColor: 'rgba(12, 45, 90, 0.1)' }}
                                        >
                                            <svg className="w-8 h-8" style={{ color: '#0c2d5a' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">{career}</h3>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                {course.testimonials.length > 0 && (
                    <section className="py-16 bg-gray-50">
                        <div className="container">
                            <div className="max-w-4xl mx-auto">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="text-center mb-10"
                                >
                                    <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0c2d5a' }}>
                                        What Our Students Say
                                    </h2>
                                </motion.div>

                                <div className="grid gap-6">
                                    {course.testimonials.map((testimonial, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: index * 0.1 }}
                                            className="bg-white rounded-xl p-8 shadow-md"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div
                                                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                                                    style={{ backgroundColor: '#0c2d5a' }}
                                                >
                                                    {testimonial.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-lg text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                                                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* FAQs */}
                {course.faqs.length > 0 && (
                    <section className="py-16 bg-white">
                        <div className="container">
                            <div className="max-w-4xl mx-auto">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="text-center mb-10"
                                >
                                    <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0c2d5a' }}>
                                        Frequently Asked Questions
                                    </h2>
                                </motion.div>

                                <CourseFAQ faqs={course.faqs} />
                            </div>
                        </div>
                    </section>
                )}

                {/* Enrollment CTA */}
                <EnrollmentCTA
                    title={`Enroll in ${course.title}`}
                    subtitle="Take the next step in your tech career. Limited spots available for each cohort."
                    price={course.price}
                    startDate={course.startDate}
                    format={course.format}
                />

                {/* Related Courses */}
                {relatedCourses.length > 0 && (
                    <section className="py-16 bg-gray-50">
                        <div className="container">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="text-center mb-10"
                            >
                                <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#0c2d5a' }}>
                                    Other {categoryData.name} Courses
                                </h2>
                            </motion.div>

                            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                                {relatedCourses.map((relatedCourse, index) => (
                                    <CourseCard
                                        key={relatedCourse.id}
                                        course={relatedCourse}
                                        categorySlug={categoryData.slug}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </>
    )
}

export default CourseDetailPage
