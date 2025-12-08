# Bildverzeichnis-Konfiguration
# Definiert verfügbare Bildkategorien und Pfade für die gesamte Website

## Bild-Kategorien

### 1. People Images (Team & Success Stories)
# Pfad: public/images/people/
# Status: ✅ VERFÜGBAR (3 Dateien existieren)

export const PEOPLE_IMAGES = {
  # Team Members & Speakers
  elisabeth: {
    path: '/images/people/elisabeth.jpg',
    alt: 'Elisabeth Awartey - Database Specialist',
    title: 'Elisabeth Awartey',
    description: 'Database Specialist at Bank of Ghana',
    category: 'team'
  },
  
  benedicta: {
    path: '/images/people/benedicta.jpg',
    alt: 'Benedicta Konadu - Graphic Designer', 
    title: 'Benedicta Konadu',
    description: 'Graphic Designer sharing creative expertise',
    category: 'team'
  },
  
  danielle: {
    path: '/images/people/danielle.jpg',
    alt: 'Danielle Mensah - Web Developer',
    title: 'Danielle Mensah',
    description: 'Web Developer with full-stack experience',
    category: 'team'
  }
}

### 2. Partner Organization Logos
# Pfad: public/images/partnerorga/
# Status: ✅ VERFÜGBAR (7 Logos existieren)

export const PARTNER_LOGOS = {
  # Educational Partners
  download1: {
    path: '/images/partnerorga/Download (1).png',
    alt: 'Educational Partner Logo 1',
    name: 'Download Logo'
  },
  download2: {
    path: '/images/partnerorga/Download (2).png',
    alt: 'Educational Partner Logo 2',
    name: 'Download Logo 2'
  },
  download3: {
    path: '/images/partnerorga/Download (3).png',
    alt: 'Educational Partner Logo 3',
    name: 'Download Logo 3'
  },
  download4: {
    path: '/images/partnerorga/Download (4).png',
    alt: 'Educational Partner Logo 4',
    name: 'Download Logo 4'
  },
  download5: {
    path: '/images/partnerorga/Download (5).png',
    alt: 'Eduational Partner Logo 5',
    name: 'Download Logo 5'
  },
  download6: {
    path: '/images/partnerorga/Download (6).png',
    alt: 'Educational Partner Logo 6',
    name: 'Download Logo 6'
  },
  
  # Technology Partners
  generictech: {
    path: '/images/partnerorga/Download.jpeg',
    alt: 'Generic Technology Logo',
    name: 'Generic Tech Logo'
  }
}

### 3. Random Pictures (Activities, Events, Daily Life)
# Pfad: public/images/randomPictures/
# Status: ✅ VERFÜGBAR (40+ Bilder existieren)

export const RANDOM_IMAGES = {
  # Graduation & Achievement
  frontalgraduation: {
    path: '/images/randomPictures/frontalgraduation.jpg',
    alt: 'Frontal Graduation Ceremony',
    category: 'graduation'
  },
  maingraduationpic: {
    path: '/images/randomPictures/maingraduationpic.jpg',
    alt: 'Main Graduation Picture',
    category: 'graduation'
  },
  graduationspeaking: {
    path: '/images/randomPictures/graduationspeaking.jpg',
    alt: 'Graduation Speech',
    category: 'graduation'
  },
  graduation: {
    path: '/images/randomPictures/graduation.jpg',
    alt: 'Graduation Success',
    category: 'graduation'
  },
  graduations: {
    path: '/images/randomPictures/graduations.jpg',
    alt: 'Graduations Group',
    category: 'graduation'
  },
  
  # Learning & Education
  studentslisteningfrontal: {
    path: '/images/randomPictures/studentslisteningfrontal.jpg',
    alt: 'Students Learning Frontal',
    category: 'learning'
  },
  studentsBackcoding: {
    path: '/images/randomPictures/studentsBackcoding.jpg',
    alt: 'Students Coding Background',
    category: 'learning'
  },
  studentscodingback: {
    path: '/images/randomPictures/studentsBackcoding.jpg',
    alt: 'Students Coding Back View',
    category: 'learning'
  },
  peterblackboard: {
    path: '/images/randomPictures/peterblackboard.jpg',
    alt: 'Peter Teaching at Blackboard',
    category: 'learning'
  },
  peterfocus: {
    path: '/images/randomPictures/peterfocus.jpg',
    alt: 'Peter Focused Teaching',
    category: 'learning'
  },
  petertalkingfrontal: {
    path: '/images/randomPictures/petertalkingfrontal.jpg',
    alt: 'Peter Teaching Frontal View',
    category: 'learning'
  },
  uXstudents: {
    path: '/images/randomPictures/uXstudents.jpg',
    alt: 'UX Students Working',
    category: 'learning'
  },
  UXteacher: {
    path: '/images/randomPictures/UXteacher.png',
    alt: 'UX Teacher Session',
    category: 'learning'
  },
  UX4: {
    path: '/images/randomPictures/UX4.jpg',
    alt: 'UX Learning Session',
    category: 'learning'
  },
  
  # Group Activities & Team Work
  groupworkstudents: {
    path: '/images/randomPictures/groupworkstudents.jpg',
    alt: 'Students Group Work',
    category: 'group'
  },
  groupworkUX: {
    path: '/images/randomPictures/groupworkUX.jpg',
    alt: 'Group UX Session',
    category: 'group'
  },
  group_girls: {
    path: '/images/randomPictures/group_girls.jpg',
    alt: 'Group of Girls',
    category: 'group'
  },
  groupofgirlsentrance: {
    path: '/images/randomPictures/groupofgirlsentrance.jpg',
    alt: 'Girls at Entrance',
    category: 'group'
  },
  happystudentscasual: {
    path: '/images/randomPictures/happystudentscasual.jpg',
    alt: 'Happy Students Casual',
    category: 'group'
  },
  
  # Events & Activities
  children_holding_sign_in_streets: {
    path: '/images/randomPictures/children_holding_sign_in_streets.jpg',
    alt: 'Children Holding Sign in Streets',
    category: 'events'
  },
  studentgroupguys: {
    path: '/images/randomPictures/studentgroupguys.jpg',
    alt: 'Student Group Guys',
    category: 'events'
  },
  redstudentgrouplesson: {
    path: '/images/randomPictures/redstudentgrouplesson.jpg',
    alt: 'Red Student Group Lesson',
    category: 'events'
  },
  studentpresentin: {
    path: '/images/randomPictures/studentpresentin.jpg',
    alt: 'Student Presentation',
    category: 'events'
  },
  studentpresenting: {
    path: '/images/randomPictures/studentpresenting.jpg',
    alt: 'Student Presenting',
    category: 'events'
  },
  
  # Individual Portraits
  whiteLady: {
    path: '/images/randomPictures/whiteLady.jpg',
    alt: 'White Lady Portrait',
    category: 'portrait'
  },
  mave: {
    path: '/images/randomPictures/mave.jpg',
    alt: 'Mave Portrait',
    category: 'portrait'
  },
  mave_peter: {
    path: '/images/randomPictures/mave_peter.jpg',
    alt: 'Mave and Peter',
    category: 'portrait'
  },
  mireiotalking: {
    path: '/images/randomPictures/mireiotalking.jpg',
    alt: 'Mireio Talking',
    category: 'portrait'
  },
  peterTalking: {
    path: '/images/randomPictures/peterTalking.jpg',
    alt: 'Peter Talking',
    category: 'portrait'
  },
  
  # Main/Hero Images (high quality)
  main: {
    path: '/images/randomPictures/main.jpg',
    alt: 'Main Hero Image',
    category: 'hero'
  }
}

## Utility-Funktionen

### Aktuelle getImagePath (für GitHub Pages optimiert)
export const getImagePath = (path: string): string => {
  // GitHub Pages Base URL bereits durch Vite config gehandhabt
  return path.startsWith('/') ? `/Webpage${path}` : `/Webpage/${path}`
}

### Erweiterte getImagePath mit Kategorien-Validierung
export const getImageFromCategory = (category: string, identifier: string): string | null => {
  switch (category) {
    case 'people':
      return PEOPLE_IMAGES[identifier as keyof typeof PEOPLE_IMAGES]?.path || null
    case 'partners':
      return PARTNER_LOGOS[identifier as keyof typeof PARTNER_LOGOS]?.path || null
    case 'random':
      return RANDOM_IMAGES[identifier as keyof typeof RANDOM_IMAGES]?.path || null
    default:
      return null
  }
}

### Zufällige Bildauswahl pro Kategorie
export const getRandomFromCategory = (category: string, count: number = 1): string[] => {
  const categoryMap = {
    people: Object.values(PEOPLE_IMAGES).filter(img => img !== null),
    partners: Object.values(PARTNER_LOGOS).filter(img => img !== null),
    random: Object.values(RANDOM_IMAGES).filter(img => img !== null)
  }
  
  const images = categoryMap[category] || []
  const shuffled = [...images].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count).map(img => img.path)
}

### Kategorie-spezifische Arrays für schnellen Zugriff
export const GRADUATION_IMAGES = [
  RANDOM_IMAGES.frontalgraduation.path,
  RANDOM_IMAGES.maingraduationpic.path,
  RANDOM_IMAGES.graduationspeaking.path,
  RANDOM_IMAGES.graduation.path,
  RANDOM_IMAGES.graduations.path
]

export const LEARNING_IMAGES = [
  RANDOM_IMAGES.studentslisteningfrontal.path,
  RANDOM_IMAGES.studentsBackcoding.path,
  RANDOM_IMAGES.studentscodingback.path,
  RANDOM_IMAGES.peterblackboard.path,
  RANDOM_IMAGES.peterfocus.path,
  RANDOM_IMAGES.petertalkingfrontal.path,
  RANDOM_IMAGES.UXteacher.path,
  RANDOM_IMAGES.UX4.path,
  RANDOM_IMAGES.uXstudents.path
]

export const GROUP_IMAGES = [
  RANDOM_IMAGES.groupworkstudents.path,
  RANDOM_IMAGES.groupworkUX.path,
  RANDOM_IMAGES.group_girls.path,
  RANDOM_IMAGES.groupofgirlsentrance.path,
  RANDOM_IMAGES.happystudentscasual.path
]

export const PORTRAIT_IMAGES = [
  RANDOM_IMAGES.whiteLady.path,
  RANDOM_IMAGES.mave.path,
  RANDOM_IMAGES.mave_peter.path,
  RANDOM_IMAGES.mireiotalking.path,
  RANDOM_IMAGES.peterTalking.path
]

export const EVENT_IMAGES = [
  RANDOM_IMAGES.children_holding_sign_in_streets.path,
  RANDOM_IMAGES.studentgroupguys.path,
  RANDOM_IMAGES.redstudentgrouplesson.path,
  RANDOM_IMAGES.studentpresentin.path,
  RANDOM_IMAGES.studentpresenting.path
]

export const HERO_IMAGES = [
  RANDOM_IMAGES.main.path,
  RANDOM_IMAGES.UX4.path
]