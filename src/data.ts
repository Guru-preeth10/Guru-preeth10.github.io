export const profile = {
  name: 'Gurupreeth H',
  first: 'Guru',
  last: 'preeth',
  email: 'gurupreethh87@gmail.com',
  phone: '+91 94491 68023',
  location: 'Bengaluru, India',
  github: 'https://github.com/Guru-preeth10',
  linkedin: 'https://linkedin.com/in/gurupreeth-h',
  resume: '/Gurupreeth_H_Resume.pdf',
}

export const facts = [
  { k: 'University', v: 'RV University', s: 'B.Tech (Hons.) CSE · 2024 – 2028' },
  { k: 'Major', v: 'AI & Machine Learning', s: 'Currently in Semester 5' },
  { k: 'Minor', v: 'Film Direction', s: 'Where the framing comes from' },
  { k: 'CGPA', v: '8.91', s: 'S1 9.00 · S2 8.57 · S3 8.80 · S4 9.23' },
]

export type Scene = {
  id: string
  no: string
  title: string
  kicker: string
  year: string
  stack: string[]
  logline: string
  points: string[]
  metrics?: { v: string; k: string }[]
  repo: string
  visual: 'gateway' | 'scheduler' | 'finance' | 'bites'
}

export const scenes: Scene[] = [
  {
    id: 'llm-gateway',
    no: '01',
    title: 'LLM Safety Gateway',
    kicker: 'AI security · on-device',
    year: '2025',
    stack: ['Node.js', 'React', 'Python', 'Ollama', 'NLP'],
    logline:
      'A real-time, three-layer security pipeline that intercepts every prompt before it ever reaches a local LLM.',
    points: [
      'RITD → NCD → LDF pipeline blocks jailbreaks, fuzzing and adversarial patterns.',
      'Entropy analysis via GZIP compression ratios + linguistic DNA fingerprinting.',
      'Live React dashboard: pipeline view, threat counters, timestamped audit logs.',
      'Zero external API calls. All inference runs fully on-device.',
    ],
    metrics: [
      { v: '100%', k: 'detection on test adversarial set' },
      { v: '<5%', k: 'false positives on benign queries' },
      { v: '<200ms', k: 'response latency' },
    ],
    repo: 'https://github.com/Guru-preeth10/LLM-Gateway',
    visual: 'gateway',
  },
  {
    id: 'mini-os',
    no: '02',
    title: 'Mini OS Simulator',
    kicker: 'Systems · scheduling',
    year: '2025',
    stack: ['Java', 'HTML', 'CSS', 'JavaScript'],
    logline:
      'Process scheduling, thread lifecycles and synchronisation — implemented from scratch and rendered live.',
    points: [
      'FCFS, SJF, Round Robin and Priority scheduling in a Java core.',
      'Thread lifecycle management and inter-process synchronisation.',
      'Browser UI renders Gantt charts and real-time state transitions.',
    ],
    repo: 'https://github.com/Guru-preeth10/Mini-OS-Process-Thread-Management-Simulator',
    visual: 'scheduler',
  },
  {
    id: 'finance',
    no: '03',
    title: 'Smart Finance Advisor',
    kicker: 'Full-stack · containerised',
    year: '2025',
    stack: ['JavaScript', 'Node.js', 'CSS', 'Docker'],
    logline:
      'A personal-finance web app with a split frontend / backend, shipped as a one-command Docker Compose deploy.',
    points: [
      'Separated frontend and backend services, containerised with Docker Compose.',
      'Environment-based configuration and demo scripts.',
      'Setup documentation written for production, not just coursework.',
    ],
    repo: 'https://github.com/Guru-preeth10/smart-finance-advisor-',
    visual: 'finance',
  },
  {
    id: 'rvu-bites',
    no: '04',
    title: 'RVU Bites',
    kicker: 'Android · solo build',
    year: '2026',
    stack: ['Java', 'Kotlin', 'Android Studio', 'Gradle KTS', 'REST'],
    logline:
      'A campus food-ordering app, built solo from first wireframe to signed release APK.',
    points: [
      'Activities, Fragments and RecyclerView with Material Design.',
      'Live menu fetch and order submission over REST via OkHttp.',
      'Debug / release build variants and signing with Gradle Kotlin DSL.',
    ],
    repo: 'https://github.com/Guru-preeth10/RVU-Bites',
    visual: 'bites',
  },
]

export const archive = [
  {
    name: 'DevPulse',
    desc: 'An intelligent software project workspace.',
    lang: 'TypeScript',
    year: '2026',
    url: 'https://github.com/Guru-preeth10/DevPulse',
  },
  {
    name: 'Spectral Bias in CNNs',
    desc: 'Analysing spectral bias of CNNs on hazy satellite imagery.',
    lang: 'Jupyter',
    year: '2026',
    url: 'https://github.com/Guru-preeth10/Spectral-Bias-Analysis-in-CNNs-for-Hazy-Satellite-Imagery',
  },
  {
    name: 'Hallucination',
    desc: 'Experiments around LLM hallucination.',
    lang: 'Python',
    year: '2026',
    url: 'https://github.com/Guru-preeth10/hallucination',
  },
  {
    name: 'Face Recognition Attendance',
    desc: 'Attendance tracking with face recognition. Live on Vercel.',
    lang: 'Python',
    year: '2025',
    url: 'https://github.com/Guru-preeth10/face-recognition-attendace-tracker-',
    live: 'https://face-recognition-attendace-tracker.vercel.app',
  },
  {
    name: 'Smart Airport Network',
    desc: 'A full airport network topology designed in Cisco Packet Tracer.',
    lang: 'Networking',
    year: '2025',
    url: 'https://github.com/Guru-preeth10/Smart-Airport-Network-Cisco-Packet-Tracer-',
  },
  {
    name: 'Online Car Rental',
    desc: 'Car rental management system on PHP and MySQL.',
    lang: 'PHP',
    year: '2025',
    url: 'https://github.com/Guru-preeth10/Online-Car-Rental-Managment',
  },
]

export const toolkit = [
  { group: 'Languages', items: ['Java', 'Kotlin', 'Python', 'JavaScript', 'C', 'C++', 'SQL'] },
  { group: 'AI / ML', items: ['Machine Learning', 'NLP', 'Prompt Security', 'Ollama', 'Jupyter'] },
  { group: 'Web & Backend', items: ['Node.js', 'React', 'Fastify', 'REST APIs', 'HTML', 'CSS'] },
  { group: 'Mobile', items: ['Android', 'Gradle KTS', 'Fragments', 'RecyclerView', 'Material Design'] },
  { group: 'DevOps & Tools', items: ['Docker', 'Docker Compose', 'Git', 'GitHub', 'Android Studio', 'VS Code'] },
  { group: 'Data', items: ['Firebase', 'Firestore', 'Firebase Auth', 'MySQL'] },
]

export const circuit = [
  {
    event: 'Smart India Hackathon',
    award: 'National Round',
    detail: 'Top 10 in college round, advanced to the national stage.',
    year: '2024 – 26',
  },
  {
    event: 'GDG Tech Sprint',
    award: '4th of 90 teams',
    detail: 'Google Developer Groups. Cleared rounds 1 and 2.',
    year: '2024 – 26',
  },
  {
    event: "Argonyx '24",
    award: 'Top 30 · Team Lead',
    detail: '24-hour national hackathon at RV University.',
    year: '2024',
  },
  {
    event: 'RoboFiesta, RVITM',
    award: 'Team Lead',
    detail: 'Cleared rounds 1 and 2 among 70 competing teams.',
    year: '2024 – 26',
  },
]

export const certs = [
  { name: 'Introduction to Generative AI', by: 'Google', date: 'Oct 2024' },
  { name: 'What Is Generative AI?', by: 'LinkedIn Learning', date: 'Oct 2024' },
  { name: 'Computer Networking Basics', by: 'IBM SkillsBuild', date: 'MDLPT-244' },
]

export const sections = [
  { id: 'top', label: 'Opening' },
  { id: 'logline', label: 'Logline' },
  { id: 'scenes', label: 'Selected Work' },
  { id: 'archive', label: 'Projects' },
  { id: 'toolkit', label: 'Tech Stack' },
  { id: 'circuit', label: 'Festival Circuit' },
  { id: 'credits', label: 'End Credits' },
]
