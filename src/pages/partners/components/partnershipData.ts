import { getImagePath } from '../../../utils/randomImages'

// Partnership options data
export interface PartnershipOption {
  title: string
  description: string
  icon: string
  image: string
  benefits: string[]
  detailContent: {
    overview: string
    whatWeOffer: string[]
    whatWeSeek: string[]
    successStories: string
    nextSteps: string
    requirements: string
  }
}

export const partnershipOptions: PartnershipOption[] = [
  {
    title: 'Educational Partnerships',
    description: 'Partner with schools, universities, and educational institutions to integrate technology education into curricula.',
    icon: 'ED',
    image: getImagePath('/images/randomPictures/studentslistening.jpg'),
    benefits: ['Curriculum integration', 'Teacher training', 'Student mentorship', 'Resource sharing'],
    detailContent: {
      overview: 'Our Educational Partnerships program works with schools, universities, and other educational institutions to integrate comprehensive technology education into existing curricula and create new pathways for students.',
      whatWeOffer: [
        'Curriculum development and integration support',
        'Teacher training and certification programs',
        'Student mentorship and internship opportunities',
        'Technology infrastructure and equipment',
        'Ongoing support and program evaluation'
      ],
      whatWeSeek: [
        'Access to students and classroom facilities',
        'Commitment to long-term partnership',
        'Integration into official curriculum',
        'Teacher participation in training programs',
        'Support for student recruitment and retention'
      ],
      successStories: 'We have successfully partnered with 25+ schools across Ghana, training over 80 teachers and reaching 1,200+ students. Our partner schools have seen a 300% increase in students pursuing STEM subjects.',
      nextSteps: 'Initial consultation → Needs assessment → Curriculum design → Pilot program → Full implementation → Ongoing evaluation',
      requirements: 'Formal educational institution status, commitment to at least 2-year partnership, dedicated classroom space, minimum 20 students per cohort'
    }
  },
  {
    title: 'Corporate Sponsorship',
    description: 'Join us as a corporate sponsor to support our programs and gain visibility while making a social impact.',
    icon: 'CO',
    image: getImagePath('/images/randomPictures/graduationspeaking.jpg'),
    benefits: ['Brand visibility', 'CSR impact', 'Tax benefits', 'Employee engagement'],
    detailContent: {
      overview: 'Our Corporate Sponsorship program offers businesses meaningful opportunities to support digital inclusion while achieving corporate social responsibility goals and gaining valuable brand exposure.',
      whatWeOffer: [
        'Brand visibility across all our programs and events',
        'Named program opportunities (e.g., "Company X Tech Center")',
        'Employee volunteer and mentorship opportunities',
        'Impact reporting and measurement',
        'Tax-deductible donation receipts',
        'Recognition in annual reports and website',
        'Invitation to exclusive partner events'
      ],
      whatWeSeek: [
        'Financial support for programs and operations',
        'In-kind donations (equipment, software, facilities)',
        'Employee volunteers and mentors',
        'Technical expertise and guidance',
        'Long-term partnership commitment'
      ],
      successStories: 'Our corporate partners have helped us reach 2,000+ youth, establish 15 tech centers, and provide over GHS 500,000 in scholarships and equipment. Partners report high employee satisfaction and measurable CSR impact.',
      nextSteps: 'Partnership discussion → Proposal development → Agreement signing → Program implementation → Impact measurement',
      requirements: 'Registered business entity, alignment with our mission and values, minimum 1-year commitment, willingness to be publicly associated with our work'
    }
  },
  {
    title: 'Government Collaboration',
    description: 'Work with government agencies to scale digital inclusion initiatives and influence policy development.',
    icon: 'GO',
    image: getImagePath('/images/randomPictures/peterTalking.jpg'),
    benefits: ['Policy influence', 'Scale impact', 'Resource access', 'Legitimacy'],
    detailContent: {
      overview: 'Our Government Collaboration program works with local, regional, and national government agencies to scale digital inclusion initiatives and create supportive policy environments for technology education.',
      whatWeOffer: [
        'Technical expertise in digital inclusion and youth development',
        'Program implementation and management capabilities',
        'Evidence-based policy recommendations',
        'Community engagement and mobilization',
        'Monitoring and evaluation frameworks',
        'International best practices and connections'
      ],
      whatWeSeek: [
        'Policy support and regulatory backing',
        'Funding and resource allocation',
        'Access to public facilities and institutions',
        'Integration into national development plans',
        'Support for scaling successful programs'
      ],
      successStories: 'We have collaborated with the Ministry of Education on curriculum development, with regional governments on youth employment programs, and provided input on national digital inclusion policies.',
      nextSteps: 'Policy consultation → Pilot program design → Implementation agreement → Program rollout → Policy integration',
      requirements: 'Government agency or ministry status, alignment with national development goals, dedicated liaison officer, commitment to evidence-based programming'
    }
  },
  {
    title: 'NGO & Foundation Partnerships',
    description: 'Collaborate with other NGOs and foundations to maximize impact and share resources.',
    icon: 'NG',
    image: getImagePath('/images/randomPictures/groupworkstudents.jpg'),
    benefits: ['Shared resources', 'Expanded reach', 'Knowledge exchange', 'Joint funding'],
    detailContent: {
      overview: 'Our NGO & Foundation Partnerships foster collaboration with like-minded organizations to maximize impact, share resources, and create comprehensive solutions for digital inclusion challenges.',
      whatWeOffer: [
        'Technology education expertise and curriculum',
        'Proven program models and implementation guides',
        'Shared resources and cost efficiencies',
        'Joint program development and implementation',
        'Knowledge sharing and capacity building',
        'Collaborative advocacy and policy work'
      ],
      whatWeSeek: [
        'Complementary expertise and programs',
        'Shared funding and resource mobilization',
        'Access to different target populations',
        'Joint advocacy and policy influence',
        'Knowledge exchange and learning opportunities'
      ],
      successStories: 'We have partnered with 15+ NGOs and foundations, creating joint programs that have reached 3,000+ additional beneficiaries and secured over GHS 800,000 in collaborative funding.',
      nextSteps: 'Partnership exploration → Joint program design → Resource sharing agreement → Collaborative implementation → Impact evaluation',
      requirements: 'Registered NGO or foundation status, complementary mission and values, proven track record, commitment to collaborative approach'
    }
  },
  {
    title: 'International Development',
    description: 'Partner with international organizations to bring global expertise and funding to local programs.',
    icon: 'IN',
    image: getImagePath('/images/randomPictures/maingraduationpic.jpg'),
    benefits: ['Global expertise', 'International funding', 'Knowledge transfer', 'Best practices'],
    detailContent: {
      overview: 'Our International Development partnerships connect us with global organizations, bringing international expertise, funding, and best practices to enhance our local programs and expand our impact.',
      whatWeOffer: [
        'Local knowledge and community connections',
        'Cultural competency and language skills',
        'Program implementation and management',
        'Monitoring and evaluation capabilities',
        'Government and stakeholder relationships',
        'Proven track record in digital inclusion'
      ],
      whatWeSeek: [
        'International funding and grants',
        'Technical expertise and best practices',
        'Global network connections',
        'Capacity building and training opportunities',
        'Exchange programs and partnerships',
        'Research and evaluation support'
      ],
      successStories: 'Our international partnerships have brought over $200,000 in funding, enabled 50+ youth to participate in international programs, and helped us adopt best practices from leading digital inclusion organizations worldwide.',
      nextSteps: 'Initial consultation → Partnership proposal → Due diligence → Program design → Implementation → Knowledge sharing',
      requirements: 'International organization status, track record in development work, commitment to local capacity building, alignment with sustainable development goals'
    }
  },
  {
    title: 'Technology Partners',
    description: 'Collaborate with technology companies to provide cutting-edge tools, training, and career pathways.',
    icon: 'TE',
    image: getImagePath('/images/randomPictures/studentsBackcoding.jpg'),
    benefits: ['Latest technology', 'Expert training', 'Career pathways', 'Innovation'],
    detailContent: {
      overview: 'Our Technology Partnerships connect us with leading technology companies to provide our participants with access to cutting-edge tools, expert training, and direct pathways to technology careers.',
      whatWeOffer: [
        'Access to motivated and trained tech talent',
        'Product testing and feedback opportunities',
        'Local market insights and connections',
        'Brand visibility in emerging markets',
        'Corporate social responsibility opportunities',
        'Employee volunteer and mentorship programs'
      ],
      whatWeSeek: [
        'Software licenses and technology access',
        'Technical training and certification programs',
        'Industry expert mentors and speakers',
        'Internship and employment opportunities',
        'Equipment and infrastructure support',
        'Innovation challenges and competitions'
      ],
      successStories: 'Our technology partners have provided software worth over $100,000, created 200+ internship opportunities, and enabled our graduates to secure technology employment or start their own tech businesses.',
      nextSteps: 'Technology assessment → Partnership proposal → Pilot program → Training integration → Career pathway development',
      requirements: 'Technology company status, commitment to youth development, willingness to provide technical training, interest in African tech talent'
    }
  }
]