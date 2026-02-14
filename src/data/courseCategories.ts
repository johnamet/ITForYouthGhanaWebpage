// Course Categories Data - Mock data for programs/courses pages
// Ready for future backend integration
import { getImagePath } from "../utils/randomImages";

// Course category types
export interface CourseModule {
  title: string;
  duration: string;
  lessons: string[];
}

export interface Instructor {
  name: string;
  title: string;
  bio: string;
  image: string;
  expertise: string[];
}

export interface CourseFAQ {
  question: string;
  answer: string;
}

export interface CourseTestimonial {
  name: string;
  role: string;
  quote: string;
  image?: string;
}

export interface Course {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  price: string;
  certification: boolean;
  certificationName?: string;
  image: string;
  skills: string[];
  prerequisites: string[];
  modules: CourseModule[];
  instructor: Instructor;
  faqs: CourseFAQ[];
  testimonials: CourseTestimonial[];
  careerOutcomes: string[];
  schedule: string;
  startDate: string;
  maxStudents: number;
  format: "In-person" | "Online" | "Hybrid";
}

export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  icon: string;
  image: string;
  color: string;
  whyChoose: string[];
  careerPaths: string[];
  courses: Course[];
}

// Default instructor for all courses
const defaultInstructor: Instructor = {
  name: "IT For Youth Ghana Team",
  title: "Lead Instructor",
  bio: "Our experienced instructors bring years of industry experience and a passion for teaching to help you succeed in your tech career.",
  image: getImagePath("/images/randomPictures/peterblackboard.jpg"),
  expertise: ["Software Development", "Technology Education", "Career Mentorship"],
};

// Web Development Category
export const webDevelopment: CourseCategory = {
  id: "web-development",
  name: "Web Development",
  slug: "web-development",
  description: "Learn to build modern websites and web applications from scratch",
  longDescription:
    "Our Web Development track provides comprehensive training in building modern, responsive websites and web applications. From HTML/CSS fundamentals to advanced React and Node.js development, you'll gain the skills needed to launch a career as a professional web developer.",
  icon: "💻",
  image: getImagePath("/images/randomPictures/studentsBackcoding.jpg"),
  color: "#0c2d5a",
  whyChoose: [
    "Hands-on projects with real-world applications",
    "Industry-standard tools and technologies",
    "Portfolio development throughout the program",
    "Career support and job placement assistance",
    "Small class sizes for personalized attention",
  ],
  careerPaths: [
    "Frontend Developer",
    "Backend Developer",
    "Full-Stack Developer",
    "Web Designer",
    "Freelance Web Developer",
  ],
  courses: [
    {
      id: "frontend-fundamentals",
      title: "Frontend Fundamentals",
      shortDescription: "Master HTML, CSS, and JavaScript basics",
      description:
        "Start your web development journey with this comprehensive course covering HTML, CSS, and JavaScript fundamentals. You'll learn to create beautiful, responsive websites from scratch and understand how the web works.",
      level: "Beginner",
      duration: "8 weeks",
      price: "GHS 800",
      certification: true,
      certificationName: "Frontend Development Certificate",
      image: getImagePath("/images/randomPictures/studentslisteningfrontal.jpg"),
      skills: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "Git Basics"],
      prerequisites: ["Basic computer skills", "No prior coding experience required"],
      modules: [
        {
          title: "Introduction to Web Development",
          duration: "1 week",
          lessons: [
            "How the web works",
            "Setting up your development environment",
            "Introduction to HTML",
          ],
        },
        {
          title: "HTML Mastery",
          duration: "2 weeks",
          lessons: [
            "HTML document structure",
            "Semantic HTML",
            "Forms and inputs",
            "Accessibility basics",
          ],
        },
        {
          title: "CSS Styling",
          duration: "2 weeks",
          lessons: [
            "CSS selectors and properties",
            "Box model",
            "Flexbox and Grid",
            "Responsive design",
          ],
        },
        {
          title: "JavaScript Basics",
          duration: "2 weeks",
          lessons: ["Variables and data types", "Functions", "DOM manipulation", "Event handling"],
        },
        {
          title: "Building Your First Website",
          duration: "1 week",
          lessons: ["Project planning", "Building a portfolio site", "Deploying to the web"],
        },
      ],
      instructor: {
        name: "Daniel Kwame Asante",
        title: "Senior Frontend Developer & Instructor",
        bio: "Daniel has over 8 years of experience in web development and has trained hundreds of students in frontend technologies.",
        image: getImagePath("/images/randomPictures/peterblackboard.jpg"),
        expertise: ["HTML/CSS", "JavaScript", "React", "Vue.js"],
      },
      faqs: [
        {
          question: "Do I need any prior coding experience?",
          answer:
            "No! This course is designed for complete beginners. We start from the very basics and gradually build up your skills.",
        },
        {
          question: "What equipment do I need?",
          answer:
            "You'll need a laptop with at least 4GB RAM. We recommend Windows 10/11, macOS, or Linux. All software we use is free.",
        },
        {
          question: "Will I get a certificate?",
          answer:
            "Yes! Upon successful completion of the course and final project, you'll receive a Frontend Development Certificate.",
        },
      ],
      testimonials: [
        {
          name: "Akosua Mensah",
          role: "Graduate, now Junior Developer at TechCorp Ghana",
          quote:
            "This course changed my life. I went from knowing nothing about coding to landing my first developer job!",
        },
      ],
      careerOutcomes: ["Junior Frontend Developer", "Web Designer", "Freelance Web Developer"],
      schedule: "Morning & Evening classes available",
      startDate: "March 2026",
      maxStudents: 20,
      format: "Hybrid",
    },
    {
      id: "react-development",
      title: "React Development",
      shortDescription: "Build dynamic web applications with React",
      description:
        "Take your frontend skills to the next level with React, the most popular JavaScript library for building user interfaces. Learn component-based architecture, state management, and modern React patterns.",
      level: "Intermediate",
      duration: "10 weeks",
      price: "GHS 1,200",
      certification: true,
      certificationName: "React Developer Certificate",
      image: getImagePath("/images/randomPictures/UX4.jpg"),
      skills: [
        "React",
        "JSX",
        "React Hooks",
        "State Management",
        "React Router",
        "API Integration",
      ],
      prerequisites: [
        "HTML/CSS proficiency",
        "JavaScript fundamentals",
        "Frontend Fundamentals course or equivalent",
      ],
      modules: [
        {
          title: "React Fundamentals",
          duration: "2 weeks",
          lessons: [
            "Introduction to React",
            "JSX syntax",
            "Components and props",
            "Setting up a React project",
          ],
        },
        {
          title: "State and Lifecycle",
          duration: "2 weeks",
          lessons: ["useState hook", "useEffect hook", "Component lifecycle", "Handling events"],
        },
        {
          title: "Advanced React Patterns",
          duration: "2 weeks",
          lessons: ["Custom hooks", "Context API", "Performance optimization", "Error boundaries"],
        },
        {
          title: "Routing and Navigation",
          duration: "2 weeks",
          lessons: ["React Router", "Dynamic routes", "Protected routes", "Navigation patterns"],
        },
        {
          title: "Real-World Project",
          duration: "2 weeks",
          lessons: ["Project setup", "API integration", "State management", "Deployment"],
        },
      ],
      instructor: defaultInstructor,
      faqs: [
        {
          question: "What should I know before taking this course?",
          answer:
            "You should be comfortable with HTML, CSS, and JavaScript basics. Our Frontend Fundamentals course is perfect preparation.",
        },
        {
          question: "Is React still relevant in 2026?",
          answer:
            "Absolutely! React remains the most in-demand frontend framework, used by companies like Meta, Netflix, and thousands of startups.",
        },
      ],
      testimonials: [
        {
          name: "Kofi Owusu",
          role: "React Developer at StartupGh",
          quote:
            "The hands-on projects in this course gave me real experience that employers value.",
        },
      ],
      careerOutcomes: ["React Developer", "Frontend Engineer", "Full-Stack Developer"],
      schedule: "Evening classes",
      startDate: "April 2026",
      maxStudents: 15,
      format: "In-person",
    },
    {
      id: "fullstack-nodejs",
      title: "Full-Stack Development with Node.js",
      shortDescription: "Become a complete web developer",
      description:
        "Master both frontend and backend development with this comprehensive full-stack course. Learn to build complete web applications using React, Node.js, Express, and MongoDB.",
      level: "Advanced",
      duration: "16 weeks",
      price: "GHS 2,500",
      certification: true,
      certificationName: "Full-Stack Developer Certificate",
      image: getImagePath("/images/randomPictures/studentpresenting.jpg"),
      skills: [
        "Node.js",
        "Express",
        "MongoDB",
        "React",
        "REST APIs",
        "Authentication",
        "Deployment",
      ],
      prerequisites: ["React Development course or equivalent", "Strong JavaScript skills"],
      modules: [
        {
          title: "Node.js Fundamentals",
          duration: "3 weeks",
          lessons: ["Node.js basics", "NPM and modules", "File system", "Async programming"],
        },
        {
          title: "Express.js & APIs",
          duration: "3 weeks",
          lessons: ["Express setup", "Routing", "Middleware", "RESTful API design"],
        },
        {
          title: "Database Integration",
          duration: "3 weeks",
          lessons: ["MongoDB basics", "Mongoose ODM", "CRUD operations", "Data modeling"],
        },
        {
          title: "Authentication & Security",
          duration: "3 weeks",
          lessons: [
            "JWT authentication",
            "Password hashing",
            "Security best practices",
            "Rate limiting",
          ],
        },
        {
          title: "Full-Stack Project",
          duration: "4 weeks",
          lessons: [
            "Project architecture",
            "Frontend-backend integration",
            "Testing",
            "Cloud deployment",
          ],
        },
      ],
      instructor: defaultInstructor,
      faqs: [
        {
          question: "How intensive is this course?",
          answer:
            "This is our most comprehensive course. Expect to spend 15-20 hours per week on coursework and projects.",
        },
        {
          question: "What kind of projects will I build?",
          answer:
            "You'll build a complete e-commerce platform, a social media application, and your own capstone project.",
        },
      ],
      testimonials: [],
      careerOutcomes: ["Full-Stack Developer", "Backend Developer", "Software Engineer"],
      schedule: "Intensive (Morning + Afternoon)",
      startDate: "May 2026",
      maxStudents: 12,
      format: "In-person",
    },
  ],
};

// Cybersecurity Category
export const cybersecurity: CourseCategory = {
  id: "cybersecurity",
  name: "Cybersecurity",
  slug: "cybersecurity",
  description: "Protect digital assets and build a career in security",
  longDescription:
    "Join the frontline of digital defense with our Cybersecurity track. Learn to identify vulnerabilities, protect systems, and respond to security incidents. With cyber threats on the rise, skilled security professionals are in high demand across all industries.",
  icon: "🔒",
  image: getImagePath("/images/randomPictures/redclothingStudents.jpg"),
  color: "#1a365d",
  whyChoose: [
    "Learn ethical hacking techniques",
    "Hands-on lab environments",
    "Industry-recognized certifications preparation",
    "Real-world security scenarios",
    "Growing job market with competitive salaries",
  ],
  careerPaths: [
    "Security Analyst",
    "Penetration Tester",
    "Security Consultant",
    "Network Security Engineer",
    "Incident Response Specialist",
  ],
  courses: [
    {
      id: "security-fundamentals",
      title: "Cybersecurity Fundamentals",
      shortDescription: "Introduction to security concepts and practices",
      description:
        "Build a strong foundation in cybersecurity concepts, threats, and defense mechanisms. This course covers essential security principles, common attack vectors, and basic protection strategies.",
      level: "Beginner",
      duration: "6 weeks",
      price: "GHS 700",
      certification: true,
      certificationName: "Cybersecurity Fundamentals Certificate",
      image: getImagePath("/images/randomPictures/studentslisteningfrontal.jpg"),
      skills: [
        "Security Concepts",
        "Threat Analysis",
        "Risk Assessment",
        "Security Policies",
        "Basic Networking",
      ],
      prerequisites: ["Basic computer skills", "Interest in security"],
      modules: [
        {
          title: "Introduction to Cybersecurity",
          duration: "1 week",
          lessons: ["What is cybersecurity?", "History of cyber attacks", "Security career paths"],
        },
        {
          title: "Threats and Vulnerabilities",
          duration: "2 weeks",
          lessons: [
            "Types of malware",
            "Social engineering",
            "Common vulnerabilities",
            "Attack vectors",
          ],
        },
        {
          title: "Security Controls",
          duration: "2 weeks",
          lessons: [
            "Physical security",
            "Access controls",
            "Encryption basics",
            "Firewalls and antivirus",
          ],
        },
        {
          title: "Security Best Practices",
          duration: "1 week",
          lessons: [
            "Password security",
            "Safe browsing",
            "Incident response basics",
            "Security awareness",
          ],
        },
      ],
      instructor: {
        name: "Emmanuel Nkrumah",
        title: "Cybersecurity Specialist",
        bio: "Emmanuel is a certified security professional with experience in both offensive and defensive security operations.",
        image: getImagePath("/images/randomPictures/peterblackboard.jpg"),
        expertise: ["Network Security", "Ethical Hacking", "Incident Response"],
      },
      faqs: [
        {
          question: "Do I need a technical background?",
          answer:
            "No, this course starts from the basics. However, basic computer skills are helpful.",
        },
        {
          question: "Will this prepare me for certifications?",
          answer:
            "This course provides a foundation for certifications like CompTIA Security+ and CEH.",
        },
      ],
      testimonials: [],
      careerOutcomes: ["IT Security Specialist", "Security Administrator", "Help Desk Security"],
      schedule: "Weekend classes available",
      startDate: "March 2026",
      maxStudents: 25,
      format: "Hybrid",
    },
    {
      id: "ethical-hacking",
      title: "Ethical Hacking & Penetration Testing",
      shortDescription: "Learn to think like a hacker, protect like a pro",
      description:
        "Master the art of ethical hacking and penetration testing. Learn to identify security weaknesses in systems, networks, and applications before malicious hackers do.",
      level: "Intermediate",
      duration: "12 weeks",
      price: "GHS 1,800",
      certification: true,
      certificationName: "Ethical Hacker Certificate",
      image: getImagePath("/images/randomPictures/UX4.jpg"),
      skills: [
        "Penetration Testing",
        "Vulnerability Assessment",
        "Kali Linux",
        "Network Scanning",
        "Web App Testing",
        "Report Writing",
      ],
      prerequisites: ["Cybersecurity Fundamentals", "Basic Linux knowledge", "Networking basics"],
      modules: [
        {
          title: "Penetration Testing Methodology",
          duration: "2 weeks",
          lessons: [
            "Planning and reconnaissance",
            "Scanning and enumeration",
            "Gaining access",
            "Maintaining access",
            "Covering tracks",
          ],
        },
        {
          title: "Network Penetration Testing",
          duration: "3 weeks",
          lessons: [
            "Network scanning with Nmap",
            "Vulnerability scanning",
            "Exploiting network services",
            "Wireless security testing",
          ],
        },
        {
          title: "Web Application Security",
          duration: "3 weeks",
          lessons: ["OWASP Top 10", "SQL injection", "XSS attacks", "Burp Suite usage"],
        },
        {
          title: "Post-Exploitation & Reporting",
          duration: "2 weeks",
          lessons: [
            "Privilege escalation",
            "Maintaining access",
            "Report writing",
            "Client communication",
          ],
        },
        {
          title: "Capture The Flag Labs",
          duration: "2 weeks",
          lessons: ["Practical exercises", "Real-world scenarios", "Certification prep"],
        },
      ],
      instructor: defaultInstructor,
      faqs: [
        {
          question: "Is ethical hacking legal?",
          answer:
            "Yes, when done with proper authorization. We teach responsible security testing practices.",
        },
        {
          question: "What tools will we use?",
          answer:
            "Kali Linux, Metasploit, Burp Suite, Nmap, Wireshark, and many more industry-standard tools.",
        },
      ],
      testimonials: [],
      careerOutcomes: ["Penetration Tester", "Security Analyst", "Vulnerability Assessor"],
      schedule: "Evening classes",
      startDate: "April 2026",
      maxStudents: 15,
      format: "In-person",
    },
    {
      id: "network-security",
      title: "Network Security & Defense",
      shortDescription: "Secure networks and infrastructure",
      description:
        "Learn to design, implement, and manage secure network infrastructures. This course covers firewalls, intrusion detection systems, VPNs, and network monitoring.",
      level: "Intermediate",
      duration: "10 weeks",
      price: "GHS 1,500",
      certification: true,
      certificationName: "Network Security Specialist Certificate",
      image: getImagePath("/images/randomPictures/graduationspeaking.jpg"),
      skills: [
        "Firewall Configuration",
        "IDS/IPS",
        "VPN Setup",
        "Network Monitoring",
        "Incident Response",
      ],
      prerequisites: ["Networking fundamentals", "Basic security knowledge"],
      modules: [
        {
          title: "Network Security Fundamentals",
          duration: "2 weeks",
          lessons: ["OSI model security", "Network protocols", "Attack surfaces"],
        },
        {
          title: "Firewalls and Access Control",
          duration: "2 weeks",
          lessons: ["Firewall types", "Rule configuration", "DMZ setup", "Access control lists"],
        },
        {
          title: "Intrusion Detection & Prevention",
          duration: "2 weeks",
          lessons: [
            "IDS vs IPS",
            "Snort configuration",
            "Alert analysis",
            "False positive handling",
          ],
        },
        {
          title: "VPN and Secure Communications",
          duration: "2 weeks",
          lessons: ["VPN protocols", "IPSec configuration", "SSL/TLS", "Secure remote access"],
        },
        {
          title: "Security Monitoring & Response",
          duration: "2 weeks",
          lessons: ["SIEM basics", "Log analysis", "Incident handling", "Forensics basics"],
        },
      ],
      instructor: defaultInstructor,
      faqs: [],
      testimonials: [],
      careerOutcomes: ["Network Security Engineer", "SOC Analyst", "Security Administrator"],
      schedule: "Morning classes",
      startDate: "May 2026",
      maxStudents: 18,
      format: "Hybrid",
    },
  ],
};

// Data Analytics Category
export const dataAnalytics: CourseCategory = {
  id: "data-analytics",
  name: "Data Analytics",
  slug: "data-analytics",
  description: "Turn data into insights and drive business decisions",
  longDescription:
    "Our Data Analytics track equips you with the skills to collect, analyze, and visualize data to drive informed business decisions. From Excel to Python, from basic statistics to machine learning, you'll learn the tools and techniques used by data professionals worldwide.",
  icon: "📊",
  image: getImagePath("/images/randomPictures/girlstaslkingUX.jpg"),
  color: "#2c5282",
  whyChoose: [
    "Work with real datasets from local organizations",
    "Learn industry-standard tools (Python, Excel, Power BI)",
    "Business-focused curriculum",
    "Portfolio of analysis projects",
    "High demand across all industries",
  ],
  careerPaths: [
    "Data Analyst",
    "Business Analyst",
    "Data Scientist",
    "Market Research Analyst",
    "Financial Analyst",
  ],
  courses: [
    {
      id: "data-analysis-excel",
      title: "Data Analysis with Excel",
      shortDescription: "Master Excel for data analysis and reporting",
      description:
        "Become an Excel power user and learn to analyze data, create reports, and build dashboards. This practical course covers everything from advanced formulas to pivot tables and data visualization.",
      level: "Beginner",
      duration: "6 weeks",
      price: "GHS 600",
      certification: true,
      certificationName: "Excel Data Analysis Certificate",
      image: getImagePath("/images/randomPictures/studentpresenting.jpg"),
      skills: [
        "Excel Advanced",
        "Pivot Tables",
        "VLOOKUP/XLOOKUP",
        "Data Visualization",
        "Dashboard Creation",
      ],
      prerequisites: ["Basic Excel knowledge", "Basic computer skills"],
      modules: [
        {
          title: "Excel Essentials Review",
          duration: "1 week",
          lessons: [
            "Data entry best practices",
            "Formatting",
            "Basic formulas",
            "Keyboard shortcuts",
          ],
        },
        {
          title: "Advanced Formulas",
          duration: "2 weeks",
          lessons: [
            "VLOOKUP and XLOOKUP",
            "IF statements",
            "SUMIFS and COUNTIFS",
            "Array formulas",
          ],
        },
        {
          title: "Pivot Tables & Charts",
          duration: "2 weeks",
          lessons: [
            "Creating pivot tables",
            "Pivot charts",
            "Slicers and timelines",
            "Calculated fields",
          ],
        },
        {
          title: "Dashboard Design",
          duration: "1 week",
          lessons: ["Dashboard planning", "Interactive elements", "Best practices", "Real project"],
        },
      ],
      instructor: {
        name: "Abena Osei",
        title: "Data Analyst & Excel Trainer",
        bio: "Abena specializes in Excel training and has helped countless professionals improve their data analysis skills.",
        image: getImagePath("/images/randomPictures/group_girls.jpg"),
        expertise: ["Microsoft Excel", "Data Analysis", "Business Intelligence"],
      },
      faqs: [
        {
          question: "Which version of Excel do I need?",
          answer:
            "We recommend Microsoft Excel 2019 or Microsoft 365. Google Sheets can be used but some features may differ.",
        },
        {
          question: "Is this course useful if I already know basic Excel?",
          answer:
            "Absolutely! Most people only use 10% of Excel's capabilities. This course will transform how you work with data.",
        },
      ],
      testimonials: [
        {
          name: "Yaw Mensah",
          role: "Accountant at ABC Finance",
          quote:
            "This course helped me automate reports that used to take hours. Now they take minutes!",
        },
      ],
      careerOutcomes: ["Data Analyst", "Financial Analyst", "Operations Analyst"],
      schedule: "Evening & Weekend classes",
      startDate: "March 2026",
      maxStudents: 20,
      format: "Hybrid",
    },
    {
      id: "python-data-analysis",
      title: "Python for Data Analysis",
      shortDescription: "Analyze data with Python, Pandas, and NumPy",
      description:
        "Learn Python programming with a focus on data analysis. Master essential libraries like Pandas and NumPy, and learn to clean, transform, and analyze large datasets efficiently.",
      level: "Intermediate",
      duration: "10 weeks",
      price: "GHS 1,200",
      certification: true,
      certificationName: "Python Data Analyst Certificate",
      image: getImagePath("/images/randomPictures/studentsBackcoding.jpg"),
      skills: [
        "Python",
        "Pandas",
        "NumPy",
        "Data Cleaning",
        "Data Transformation",
        "Jupyter Notebooks",
      ],
      prerequisites: [
        "Basic programming concepts (helpful but not required)",
        "Data analysis mindset",
      ],
      modules: [
        {
          title: "Python Fundamentals",
          duration: "2 weeks",
          lessons: ["Python basics", "Data types", "Control flow", "Functions"],
        },
        {
          title: "Introduction to Pandas",
          duration: "3 weeks",
          lessons: [
            "DataFrames and Series",
            "Reading data files",
            "Basic operations",
            "Filtering and selection",
          ],
        },
        {
          title: "Data Cleaning & Transformation",
          duration: "2 weeks",
          lessons: [
            "Handling missing data",
            "Data type conversion",
            "String manipulation",
            "Merging datasets",
          ],
        },
        {
          title: "Exploratory Data Analysis",
          duration: "2 weeks",
          lessons: [
            "Descriptive statistics",
            "Grouping and aggregation",
            "Correlation analysis",
            "Pattern discovery",
          ],
        },
        {
          title: "Analysis Project",
          duration: "1 week",
          lessons: ["Real-world dataset", "End-to-end analysis", "Presentation of findings"],
        },
      ],
      instructor: defaultInstructor,
      faqs: [
        {
          question: "Do I need to know programming?",
          answer:
            "No prior programming is required. We teach Python from the basics with a data analysis focus.",
        },
        {
          question: "What kind of projects will I work on?",
          answer:
            "You'll analyze real datasets including sales data, survey responses, and public datasets from Ghana.",
        },
      ],
      testimonials: [],
      careerOutcomes: ["Data Analyst", "Python Developer", "Business Intelligence Analyst"],
      schedule: "Morning classes",
      startDate: "April 2026",
      maxStudents: 18,
      format: "In-person",
    },
    {
      id: "data-visualization",
      title: "Data Visualization & Storytelling",
      shortDescription: "Create compelling visualizations with Power BI",
      description:
        "Learn to transform data into compelling visual stories. Master Power BI to create interactive dashboards and reports that drive business decisions.",
      level: "Intermediate",
      duration: "8 weeks",
      price: "GHS 1,000",
      certification: true,
      certificationName: "Data Visualization Specialist Certificate",
      image: getImagePath("/images/randomPictures/uXstudents.jpg"),
      skills: [
        "Power BI",
        "Data Visualization",
        "DAX",
        "Dashboard Design",
        "Storytelling with Data",
      ],
      prerequisites: ["Data Analysis with Excel or equivalent", "Basic SQL knowledge helpful"],
      modules: [
        {
          title: "Data Visualization Principles",
          duration: "1 week",
          lessons: [
            "Visualization types",
            "Design principles",
            "Color theory",
            "Choosing the right chart",
          ],
        },
        {
          title: "Power BI Fundamentals",
          duration: "2 weeks",
          lessons: [
            "Power BI interface",
            "Connecting to data",
            "Basic visualizations",
            "Formatting",
          ],
        },
        {
          title: "DAX and Calculations",
          duration: "2 weeks",
          lessons: [
            "DAX basics",
            "Measures vs calculated columns",
            "Time intelligence",
            "Advanced calculations",
          ],
        },
        {
          title: "Interactive Dashboards",
          duration: "2 weeks",
          lessons: ["Filters and slicers", "Drill-through", "Bookmarks", "Mobile views"],
        },
        {
          title: "Storytelling Project",
          duration: "1 week",
          lessons: ["Business case study", "Dashboard design", "Presentation to stakeholders"],
        },
      ],
      instructor: defaultInstructor,
      faqs: [],
      testimonials: [],
      careerOutcomes: ["BI Analyst", "Dashboard Developer", "Data Visualization Specialist"],
      schedule: "Evening classes",
      startDate: "May 2026",
      maxStudents: 15,
      format: "Hybrid",
    },
  ],
};

// Graphic Design Category
export const graphicDesign: CourseCategory = {
  id: "graphic-design",
  name: "Graphic Design",
  slug: "graphic-design",
  description: "Create stunning visuals and build your creative career",
  longDescription:
    "Unlock your creative potential with our Graphic Design track. Learn industry-standard design tools, master visual communication principles, and build a portfolio that showcases your unique creative voice. From branding to UI design, motion graphics to print design.",
  icon: "🎨",
  image: getImagePath("/images/randomPictures/uXstudents.jpg"),
  color: "#553c9a",
  whyChoose: [
    "Industry-standard tools (Adobe Creative Suite)",
    "Portfolio development with real client projects",
    "Mentorship from working designers",
    "Freelancing and business skills included",
    "Creative community and networking",
  ],
  careerPaths: [
    "Graphic Designer",
    "UI/UX Designer",
    "Brand Designer",
    "Motion Graphics Designer",
    "Freelance Creative",
  ],
  courses: [
    {
      id: "design-fundamentals",
      title: "Design Fundamentals",
      shortDescription: "Master the principles of visual design",
      description:
        "Build a strong foundation in design principles that apply to any creative field. Learn about composition, color theory, typography, and visual hierarchy through hands-on projects.",
      level: "Beginner",
      duration: "6 weeks",
      price: "GHS 700",
      certification: true,
      certificationName: "Design Fundamentals Certificate",
      image: getImagePath("/images/randomPictures/girlstaslkingUX.jpg"),
      skills: [
        "Design Principles",
        "Color Theory",
        "Typography",
        "Composition",
        "Visual Hierarchy",
      ],
      prerequisites: ["No prior experience needed", "Creativity and willingness to learn"],
      modules: [
        {
          title: "Introduction to Design",
          duration: "1 week",
          lessons: ["What is design?", "Design history", "The design process", "Design thinking"],
        },
        {
          title: "Elements & Principles",
          duration: "2 weeks",
          lessons: [
            "Line, shape, form",
            "Balance and contrast",
            "Repetition and pattern",
            "Unity and variety",
          ],
        },
        {
          title: "Color & Typography",
          duration: "2 weeks",
          lessons: [
            "Color wheel and harmony",
            "Color psychology",
            "Font selection",
            "Type hierarchy",
          ],
        },
        {
          title: "Putting It Together",
          duration: "1 week",
          lessons: [
            "Composition techniques",
            "Creating visual hierarchy",
            "Design critique",
            "Mini projects",
          ],
        },
      ],
      instructor: {
        name: "Nana Adjoa Amponsah",
        title: "Creative Director & Design Educator",
        bio: "Nana has over 12 years of experience in branding and design, working with clients across Africa and Europe.",
        image: getImagePath("/images/randomPictures/group_girls.jpg"),
        expertise: ["Brand Design", "Visual Identity", "Design Thinking"],
      },
      faqs: [
        {
          question: "Do I need to know how to draw?",
          answer:
            "No! Design is about visual communication, not drawing ability. We focus on principles and tools.",
        },
        {
          question: "What software will we use?",
          answer: "We use Figma (free) for this course. Advanced courses use Adobe Creative Suite.",
        },
      ],
      testimonials: [],
      careerOutcomes: ["Junior Designer", "Design Intern", "Creative Assistant"],
      schedule: "Morning & Evening options",
      startDate: "March 2026",
      maxStudents: 20,
      format: "Hybrid",
    },
    {
      id: "adobe-creative-suite",
      title: "Adobe Creative Suite Mastery",
      shortDescription: "Master Photoshop, Illustrator, and InDesign",
      description:
        "Become proficient in the industry-standard Adobe Creative Suite. Learn Photoshop for photo editing, Illustrator for vector graphics, and InDesign for layout design.",
      level: "Intermediate",
      duration: "12 weeks",
      price: "GHS 1,500",
      certification: true,
      certificationName: "Adobe Creative Suite Specialist Certificate",
      image: getImagePath("/images/randomPictures/redclothingStudents.jpg"),
      skills: [
        "Adobe Photoshop",
        "Adobe Illustrator",
        "Adobe InDesign",
        "Photo Editing",
        "Vector Graphics",
        "Layout Design",
      ],
      prerequisites: ["Design Fundamentals or equivalent", "Basic computer skills"],
      modules: [
        {
          title: "Adobe Photoshop",
          duration: "4 weeks",
          lessons: [
            "Interface and tools",
            "Layers and masks",
            "Photo retouching",
            "Compositing",
            "Export for web and print",
          ],
        },
        {
          title: "Adobe Illustrator",
          duration: "4 weeks",
          lessons: [
            "Vector basics",
            "Pen tool mastery",
            "Logo design",
            "Icon design",
            "Pattern creation",
          ],
        },
        {
          title: "Adobe InDesign",
          duration: "4 weeks",
          lessons: [
            "Document setup",
            "Master pages",
            "Typography",
            "Multi-page layouts",
            "Print preparation",
          ],
        },
      ],
      instructor: defaultInstructor,
      faqs: [
        {
          question: "Do I need to buy Adobe software?",
          answer:
            "Adobe offers student discounts. We'll guide you through options including free trials and affordable subscriptions.",
        },
        {
          question: "What kind of projects will I create?",
          answer:
            "Logos, marketing materials, posters, brochures, social media graphics, and a capstone project.",
        },
      ],
      testimonials: [],
      careerOutcomes: ["Graphic Designer", "Production Artist", "Print Designer"],
      schedule: "Evening classes",
      startDate: "April 2026",
      maxStudents: 15,
      format: "In-person",
    },
    {
      id: "ui-ux-design",
      title: "UI/UX Design",
      shortDescription: "Design beautiful and user-friendly digital experiences",
      description:
        "Learn to design apps and websites that users love. Master user research, wireframing, prototyping, and visual design for digital products using Figma.",
      level: "Intermediate",
      duration: "10 weeks",
      price: "GHS 1,400",
      certification: true,
      certificationName: "UI/UX Designer Certificate",
      image: getImagePath("/images/randomPictures/UX4.jpg"),
      skills: [
        "User Research",
        "Wireframing",
        "Prototyping",
        "Figma",
        "Design Systems",
        "Usability Testing",
      ],
      prerequisites: ["Design Fundamentals or equivalent", "Interest in digital products"],
      modules: [
        {
          title: "UX Foundations",
          duration: "2 weeks",
          lessons: [
            "What is UX?",
            "User research methods",
            "Personas and journeys",
            "Information architecture",
          ],
        },
        {
          title: "Wireframing & Prototyping",
          duration: "3 weeks",
          lessons: [
            "Low-fidelity wireframes",
            "Figma basics",
            "Interactive prototypes",
            "User flows",
          ],
        },
        {
          title: "Visual Design for UI",
          duration: "3 weeks",
          lessons: ["Design systems", "Component design", "Responsive design", "Accessibility"],
        },
        {
          title: "Portfolio Project",
          duration: "2 weeks",
          lessons: [
            "End-to-end project",
            "Usability testing",
            "Iteration",
            "Portfolio presentation",
          ],
        },
      ],
      instructor: defaultInstructor,
      faqs: [
        {
          question: "What's the difference between UI and UX?",
          answer:
            "UX (User Experience) focuses on how the product works and feels. UI (User Interface) focuses on how it looks. Both are essential!",
        },
        {
          question: "Is this course suitable for someone who wants to switch careers to tech?",
          answer:
            "Yes! UI/UX design is often a great entry point into tech for people with creative backgrounds.",
        },
      ],
      testimonials: [
        {
          name: "Efua Asante",
          role: "UI Designer at FinTech Startup",
          quote:
            "This course gave me the skills and confidence to make a career change. Now I'm doing what I love!",
        },
      ],
      careerOutcomes: ["UI Designer", "UX Designer", "Product Designer", "Interaction Designer"],
      schedule: "Morning classes",
      startDate: "April 2026",
      maxStudents: 12,
      format: "Hybrid",
    },
    {
      id: "motion-graphics",
      title: "Motion Graphics & Animation",
      shortDescription: "Bring designs to life with animation",
      description:
        "Learn to create engaging animations and motion graphics for social media, advertising, and digital content. Master After Effects and basic animation principles.",
      level: "Advanced",
      duration: "10 weeks",
      price: "GHS 1,600",
      certification: true,
      certificationName: "Motion Graphics Designer Certificate",
      image: getImagePath("/images/randomPictures/studentpresenting.jpg"),
      skills: [
        "After Effects",
        "Animation Principles",
        "Motion Design",
        "Video Editing",
        "Social Media Content",
      ],
      prerequisites: [
        "Adobe Creative Suite Mastery or strong Adobe experience",
        "Design Fundamentals",
      ],
      modules: [
        {
          title: "Animation Principles",
          duration: "2 weeks",
          lessons: [
            "12 principles of animation",
            "Timing and spacing",
            "Easing functions",
            "Storyboarding",
          ],
        },
        {
          title: "After Effects Fundamentals",
          duration: "3 weeks",
          lessons: [
            "Interface and workflow",
            "Keyframe animation",
            "Effects and presets",
            "Text animation",
          ],
        },
        {
          title: "Advanced Techniques",
          duration: "3 weeks",
          lessons: ["Shape layers", "Expressions basics", "3D layers", "Motion tracking"],
        },
        {
          title: "Motion Reel Project",
          duration: "2 weeks",
          lessons: [
            "Concept development",
            "Animation production",
            "Sound design basics",
            "Rendering and export",
          ],
        },
      ],
      instructor: defaultInstructor,
      faqs: [],
      testimonials: [],
      careerOutcomes: ["Motion Designer", "Video Editor", "Content Creator", "Animation Artist"],
      schedule: "Evening classes",
      startDate: "June 2026",
      maxStudents: 12,
      format: "In-person",
    },
  ],
};

// All categories combined
export const courseCategories: CourseCategory[] = [
  webDevelopment,
  cybersecurity,
  dataAnalytics,
  graphicDesign,
];

// Helper functions
export const getCategoryBySlug = (slug: string): CourseCategory | undefined => {
  return courseCategories.find((category) => category.slug === slug);
};

export const getCourseById = (categorySlug: string, courseId: string): Course | undefined => {
  const category = getCategoryBySlug(categorySlug);
  return category?.courses.find((course) => course.id === courseId);
};

export const getAllCourses = (): Course[] => {
  return courseCategories.flatMap((category) => category.courses);
};

export const getCourseCount = (): number => {
  return getAllCourses().length;
};
