// Use Vite's BASE_URL which is automatically set from vite.config.ts (base: '/Webpage')
// This works correctly in both dev (/) and production (/Webpage/)
export const getImagePath = (path: string) => {
  const base = import.meta.env.BASE_URL
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  // Remove trailing slash from base and leading slash is already in cleanPath
  return `${base.replace(/\/$/, '')}${cleanPath}`
}

// Utility für zufällige Bildauswahl aus dem erweiterten Pool
const baseImages = [
  '/images/randomPictures/UX4.jpg',
  '/images/randomPictures/UXteacher.png',
  '/images/randomPictures/children_holding_sign_in_streets.jpg',
  '/images/randomPictures/frontalgraduation.jpg',
  '/images/randomPictures/girlstaslkingUX.jpg',
  '/images/randomPictures/graduation.jpg',
  '/images/randomPictures/graduations.jpg',
  '/images/randomPictures/graduationspeaking.jpg',
  '/images/randomPictures/group_girls.jpg',
  '/images/randomPictures/groupofgirlsentrance.jpg',
  '/images/randomPictures/groupworkUX.jpg',
  '/images/randomPictures/groupworkstudents.jpg',
  '/images/randomPictures/happystudentscasual.jpg',
  '/images/randomPictures/maingraduationpic.jpg',
  '/images/randomPictures/maingraduationpic.jpg',
  '/images/randomPictures/mave_peter.jpg',
  '/images/randomPictures/mireiotalking.jpg',
  '/images/randomPictures/peterTalking.jpg',
  '/images/randomPictures/peterblackboard.jpg',
  '/images/randomPictures/peterblackboard.jpg',
  '/images/randomPictures/petertalkingtostudentscoloful.jpg',
  '/images/randomPictures/petertalkingtostudentscoloful.jpg',
  '/images/randomPictures/redclothingStudents.jpg',
  '/images/randomPictures/redstudentgrouplesson.jpg',
  '/images/randomPictures/studentgroupguys.jpg',
  '/images/randomPictures/studentpresentin.jpg',
  '/images/randomPictures/studentpresenting.jpg',
  '/images/randomPictures/studentsBackcoding.jpg',
  '/images/randomPictures/studentsblueclothing.jpg',
  '/images/randomPictures/studentsBackcoding.jpg',
  '/images/randomPictures/studentslistening.jpg',
  '/images/randomPictures/studentslisteningfrontal.jpg',
  '/images/randomPictures/uXstudents.jpg',
  '/images/randomPictures/whiteLady.jpg'
]

export const randomImages = baseImages.map(img => getImagePath(img))

// Utility-Funktionen für zufällige Bildauswahl
export const getRandomImage = (): string => {
  return randomImages[Math.floor(Math.random() * randomImages.length)]
}

export const getRandomImages = (count: number): string[] => {
  const shuffled = [...randomImages].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export const getRandomImageSet = (count: number): string[] => {
  // Sicherstellen, dass wir keine Duplikate haben
  const selected: string[] = []
  const available = [...randomImages]
  
  for (let i = 0; i < count && available.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * available.length)
    selected.push(available.splice(randomIndex, 1)[0])
  }
  
  return selected
}

// Kategorisierte Bildsets für spezielle Anwendungen
const baseCategoryImages = {
  workshops: [
    '/images/randomPictures/groupworkUX.jpg',
    '/images/randomPictures/groupworkstudents.jpg',
    '/images/randomPictures/UXteacher.png',
    '/images/randomPictures/girlstaslkingUX.jpg',
    '/images/randomPictures/uXstudents.jpg'
  ],
  graduation: [
    '/images/randomPictures/frontalgraduation.jpg',
    '/images/randomPictures/graduation.jpg',
    '/images/randomPictures/graduations.jpg',
    '/images/randomPictures/graduationspeaking.jpg',
    '/images/randomPictures/maingraduationpic.jpg'
  ],
  tech: [
    '/images/randomPictures/studentsBackcoding.jpg',
    '/images/randomPictures/studentslistening.jpg',
    '/images/randomPictures/peterblackboard.jpg',
    '/images/randomPictures/UX4.jpg'
  ],
  community: [
    '/images/randomPictures/group_girls.jpg',
    '/images/randomPictures/happystudentscasual.jpg',
    '/images/randomPictures/children_holding_sign_in_streets.jpg',
    '/images/randomPictures/groupofgirlsentrance.jpg'
  ]
}

export const imageCategories = Object.fromEntries(
  Object.entries(baseCategoryImages).map(([key, images]) => [
    key,
    images.map(img => getImagePath(img))
  ])
) as Record<keyof typeof baseCategoryImages, string[]>

export const getCategoryImages = (category: keyof typeof imageCategories): string[] => {
  return imageCategories[category] || []
}