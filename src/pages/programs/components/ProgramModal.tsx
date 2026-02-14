import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Modal from '../../../components/Modal'

interface Program {
  title: string
  subtitle: string
  description: string
  duration: string
  participants?: string
  image: string
  skills?: string[]
  requirements: string
  status: 'current' | 'past' | 'future'
  type: string
  nextStart?: string
  completedDate?: string
  careerOutcomes?: string[]
  highlights?: string[]
}

interface ProgramModalProps {
  isOpen: boolean
  onClose: () => void
  program: Program | null
}

const ProgramModal: React.FC<ProgramModalProps> = ({
  isOpen,
  onClose,
  program
}) => {
  if (!program) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="large"
    >
      <div className="relative">
        {/* Header Image Background */}
        <div className="relative h-64 md:h-80 -mt-6 -mx-6 md:-mt-8 md:-mx-8 mb-8 overflow-hidden rounded-t-3xl">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10" />
          <img
            src={program.image}
            alt={program.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 p-6 md:p-8 z-20 w-full">
            <span className="inline-block py-1 px-3 rounded-full bg-primary text-white text-xs font-bold mb-3 shadow-lg">
              {program.type}
            </span>
            <h2 className="heading-lg mb-1 text-primary drop-shadow-sm">{program.title}</h2>
            <p className="text-lg text-primary/80 font-medium">{program.subtitle}</p>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full p-2 text-white transition-all shadow-lg border border-white/30"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="heading-sm mb-4 flex items-center gap-2">
                <span className="w-8 h-1 bg-primary rounded-full"></span>
                About the Program
              </h3>
              <p className="text-body leading-relaxed text-lg">
                {program.description}
              </p>
            </div>

            {program.highlights && (
              <div>
                <h4 className="heading-sm mb-4">Highlights</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  {program.highlights.map((highlight: string, index: number) => (
                    <div key={index} className="flex items-start bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                      <span className="text-primary mr-3 text-xl">✓</span>
                      <span className="text-sm font-medium text-slate-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="heading-sm mb-4">You will learn</h4>
              <div className="flex flex-wrap gap-2">
                {program.skills?.map((skill: string, index: number) => (
                  <span key={index} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 shadow-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {program.careerOutcomes && (
              <div>
                <h4 className="heading-sm mb-4">Career Paths</h4>
                <div className="flex flex-wrap gap-2">
                  {program.careerOutcomes.map((outcome: string, index: number) => (
                    <span key={index} className="badge badge-accent">
                      {outcome}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-1">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 sticky top-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6">Program Details</h4>

              <div className="space-y-6">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Duration</div>
                  <div className="font-bold text-primary">{program.duration}</div>
                </div>

                <div>
                  <div className="text-xs text-slate-500 mb-1">
                    {program.status === 'past' ? 'Completed' :
                      program.status === 'future' ? 'Planned Start' :
                        'Next Cohort'}
                  </div>
                  <div className="font-bold text-primary">
                    {program.status === 'past' ? program.completedDate :
                      program.nextStart || 'To be announced'}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-500 mb-1">Format</div>
                  <div className="font-bold text-primary">Hybrid / In-Person</div>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <div className="text-xs text-slate-500 mb-1">Prerequisites</div>
                  <div className="text-sm font-medium text-slate-700">{program.requirements}</div>
                </div>

                <div className="pt-4">
                  {program.status === 'current' ? (
                    <button
                      className="btn btn-primary w-full shadow-lg shadow-blue-900/20"
                      onClick={() => {
                        onClose()
                        const courseParam = encodeURIComponent(program.title.toLowerCase().replace(/\s+/g, '-'))
                        window.location.href = `https://portal.itforyouthghana.org?course=${courseParam}`
                      }}
                    >
                      Apply Now
                    </button>
                  ) : program.status === 'future' ? (
                    <button
                      className="btn btn-primary w-full"
                      onClick={() => {
                        alert('Thank you! We will notify you.')
                      }}
                    >
                      Get Notified
                    </button>
                  ) : (
                    <button
                      className="btn btn-secondary w-full"
                      onClick={() => {
                        onClose()
                        window.location.href = '/impact'
                      }}
                    >
                      View Outcomes
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ProgramModal
