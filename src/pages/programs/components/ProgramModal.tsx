import React from 'react'
import { motion } from 'framer-motion'
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
      title={program.title}
      size="large"
    >
      <div className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <img
              src={program.image}
              alt={program.title}
              className="w-full h-64 object-cover rounded-xl"
            />
          </div>
          
          <div>
            <p className="text-body mb-6 leading-relaxed">
              {program.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="font-semibold text-primary mb-2">Duration:</h4>
                <p className="text-body">{program.duration}</p>
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-2">
                  {program.status === 'past' ? 'Completed:' :
                   program.status === 'future' ? 'Planned:' :
                   'Participants:'}
                </h4>
                <p className="text-body">
                  {program.status === 'past' ? program.completedDate :
                   program.status === 'future' ? program.status :
                   program.participants}
                </p>
              </div>
              {program.nextStart && (
                <div>
                  <h4 className="font-semibold text-primary mb-2">Next Start:</h4>
                  <p className="text-body">{program.nextStart}</p>
                </div>
              )}
              <div>
                <h4 className="font-semibold text-primary mb-2">Requirements:</h4>
                <p className="text-body">{program.requirements}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h4 className="font-semibold text-primary mb-4">Skills & Technologies:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {program.skills?.map((skill: string, index: number) => (
              <div key={index} className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></span>
                <span className="text-body">{skill}</span>
              </div>
            ))}
          </div>
        </div>

        {program.careerOutcomes && (
          <div className="mt-6">
            <h4 className="font-semibold text-primary mb-4">Career Outcomes:</h4>
            <div className="flex flex-wrap gap-2">
              {program.careerOutcomes.map((outcome: string, index: number) => (
                <span key={index} className="badge badge-accent">
                  {outcome}
                </span>
              ))}
            </div>
          </div>
        )}

        {program.highlights && (
          <div className="mt-6">
            <h4 className="font-semibold text-primary mb-4">Program Highlights:</h4>
            <div className="flex flex-wrap gap-2">
              {program.highlights.map((highlight: string, index: number) => (
                <span key={index} className="badge badge-primary">
                  {highlight}
                </span>
              ))}
            </div>
          </div>
        )}
      
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-neutral-200">
          {program.status === 'current' && (
            <motion.button
              className="btn btn-primary flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onClose()
                // Redirect to portal with course context
                window.location.href = 'https://portal.itforyouthghana.org'
              }}
            >
              Enroll Now
            </motion.button>
          )}
          {program.status === 'future' && (
            <>
              <motion.button
                className="btn btn-primary flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onClose()
                  // Redirect to portal
                  window.location.href = 'https://portal.itforyouthghana.org'
                }}
              >
                Notify Me
              </motion.button>
              <motion.button
                className="btn btn-secondary flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onClose()
                  window.location.href = 'https://portal.itforyouthghana.org'
                }}
              >
                Sign Up
              </motion.button>
            </>
          )}
          {program.status === 'past' && (
            <motion.button
              className="btn btn-secondary flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onClose()
                window.location.href = '/impact'
              }}
            >
              View Alumni
            </motion.button>
          )}
          <motion.button
            className="btn btn-secondary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
          >
            Close
          </motion.button>
        </div>
      </div>
    </Modal>
  )
}

export default ProgramModal
