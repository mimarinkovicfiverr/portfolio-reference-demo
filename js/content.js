/**
 * The content desk: edit sample values here, save, then refresh your local preview.
 * Everything about Alex, the employers, education and projects is FICTIONAL.
 * Keep IDs unique, quote strings, and retain commas between array/object items.
 * Preview labels live here too; their HTML/CSS layouts live in projects.js / style.css.
 */
export const content = {
  // Identity: also replace the name inside pageTitle and about.lead below.
  // A short brand (usually 1–3 letters) appears in both logos and the tab icon.
  brand: 'am',
  name: 'Alex Morgan',
  pageTitle: 'Alex Morgan — Front-end Developer · Reference Portfolio',
  pageDescription: 'A fictional front-end developer portfolio. An educational reference built with HTML, CSS and JavaScript.',
  referenceNote: 'Fictional portfolio · Built as a learning reference',
  hero: {
    eyebrow: 'Independent learning / Front-end development',
    title: 'Building for the browser.',
    role: 'Junior front-end developer',
    intro: 'An example portfolio exploring responsive layouts, accessible interactions and practical JavaScript. All work and background shown here are fictional.',
    primaryCta: 'View project studies',
    secondaryCta: 'Contact & demo form',
    notesHeading: 'What I practice',
    notes: [
      { label: 'Structure', detail: 'Semantic HTML' },
      { label: 'Layout', detail: 'Responsive CSS' },
      { label: 'Interaction', detail: 'Accessible JavaScript' },
    ],
  },
  about: {
    heading: 'A little background.',
    lead: 'I’m Alex, a fictional junior developer learning how to make the web easier to read, navigate and use.',
    paragraphs: [
      'In this example background, I began with small HTML pages, then added responsive layouts and JavaScript a feature at a time. I learn best by building something small, testing it and writing down what I would change.',
      'My interests include clear typography, keyboard-friendly interfaces and readable code. Away from the screen, this fictional profile enjoys sketching, walking and reading.',
    ],
    facts: [
      { label: 'Focus', value: 'Accessible web experiences' },
      { label: 'Approach', value: 'Curious, careful, collaborative' },
      { label: 'Based in', value: 'Example City · Fictional location' },
    ],
  },
  experienceHeading: 'Experience',
  experienceNote: 'Sample roles and responsibilities. Fictional employers throughout.',
  // Add/remove a complete object between { and }, including its highlights.
  experience: [
    {
      period: '2025 — Present',
      role: 'Junior Front-end Developer',
      organization: 'Northline Studio · Fictional employer',
      type: 'Sample position',
      description: 'Turning interface concepts into responsive pages with semantic HTML, reusable CSS and focused JavaScript.',
      highlights: [
        'Built accessible navigation and form patterns.',
        'Collaborated on design reviews and cross-device testing.',
      ],
    },
    {
      period: '2024 — 2025',
      role: 'Web Development Intern',
      organization: 'Fieldwork Digital · Fictional employer',
      type: 'Sample internship',
      description: 'Learning the foundations of maintainable websites through small, practical improvements.',
      highlights: [
        'Created mobile-friendly page layouts.',
        'Documented components and practiced Git collaboration.',
      ],
    },
    {
      period: '2023 — 2024',
      role: 'Independent Learning & Experiments',
      organization: 'Personal practice · Fictional background',
      type: 'Sample learning period',
      description: 'Exploring the web by making small projects, reading documentation and learning from each iteration.',
      highlights: [
        'Practiced DOM interactions and public API requests.',
        'Developed a habit of testing keyboard and mobile behavior.',
      ],
    },
  ],
  educationHeading: 'Education & learning',
  educationNote: 'Fictional qualifications and courses.',
  education: [
    {
      period: '2022 — 2025',
      qualification: 'BSc in Computing',
      institution: 'Example Institute of Technology',
      description: 'Fictional education example. Topics include web engineering, interaction design and software fundamentals.',
    },
  ],
  certificationsHeading: 'Certifications & learning',
  certifications: [
    {
      name: 'Responsive Web Foundations',
      issuer: 'Example Learning Academy',
      year: '2025',
      note: 'Fictional certification',
    },
    {
      name: 'JavaScript Essentials',
      issuer: 'Example Learning Academy',
      year: '2024',
      note: 'Fictional certification',
    },
  ],
  skillsHeading: 'Skills & working methods',
  skillsNote: 'A practical toolkit for the sample work below.',
  skills: [
    { title: 'Build the interface', description: 'Solid foundations for the things people see and use.', items: ['HTML5', 'CSS3', 'JavaScript', 'Responsive design'] },
    { title: 'Think about people', description: 'Interfaces that feel clear, inclusive and consistent.', items: ['Accessibility', 'Semantic markup', 'Interface design', 'Prototyping'] },
    { title: 'Work thoughtfully', description: 'A practical workflow from first idea to final review.', items: ['Git & GitHub', 'VS Code', 'Browser DevTools', 'REST APIs'] },
  ],
  projectsHeading: 'Selected project studies',
  // Update this sentence if you add/remove studies, or use count-neutral wording.
  projectsIntro: 'Three approaches to layout and interaction.',
  featuredProjectLabel: 'Featured study',
  // Filter names are editable; each must exactly match a project category or tag.
  // Keeping an unmatched filter is allowed: the interface shows an empty state.
  projectFilters: ['All', 'HTML', 'CSS', 'JavaScript', 'API'],
  projects: [
    {
      id: 'still', name: 'Still — a reading space', category: 'Typography & layout',
      description: 'A reading-page concept built around a comfortable text measure, a clear chapter index and space to concentrate. An exercise in doing more with type and fewer interface elements.',
      tags: ['HTML', 'CSS'], preview: 'focus',
      previewLabel: 'Illustrative Still reading page, with a large serif heading and a two-chapter reading list.',
      previewContent: {
        brand: 'still.', eyebrow: 'A PLACE FOR LONGER READS', title: 'Read a little. Stay a while.',
        caption: 'Notes on making room for a good read.', detail: 'The reading list',
        items: [{ label: 'On paying attention', value: '04 min' }, { label: 'A slower kind of web', value: '06 min' }],
      },
      link: '', linkLabel: 'View project',
    },
    {
      id: 'weatherly', name: 'Weatherly', category: 'Public data & interaction',
      description: 'A weather-interface concept that puts the location, current conditions and daily outlook in a clear reading order. A study in presenting public data simply.',
      tags: ['HTML', 'CSS', 'JavaScript', 'API'], preview: 'weather',
      previewLabel: 'Illustrative Weatherly outlook for Example City: 24 degrees, clear skies and three fictional forecast rows.',
      previewContent: {
        brand: 'weatherly', eyebrow: 'ILLUSTRATIVE FORECAST', title: 'Example City',
        caption: 'Clear skies. A mild afternoon.', detail: '24°',
        items: [{ label: 'Tuesday', value: '23° / 17°' }, { label: 'Wednesday', value: '21° / 16°' }, { label: 'Thursday', value: '25° / 18°' }],
      },
      link: '', linkLabel: 'View project',
    },
    {
      id: 'folio', name: 'Form & function', category: 'Accessible front-end',
      description: 'A portfolio concept using an editorial project index, responsive navigation and accessible form feedback. An exercise in connecting layout and browser behavior.',
      tags: ['HTML', 'CSS', 'JavaScript'], preview: 'portfolio',
      previewLabel: 'Illustrative Form and Function portfolio, with an oversized serif heading and an index of two interface studies.',
      previewContent: {
        brand: 'FORM / FUNCTION', eyebrow: 'A DEVELOPER’S WORKING INDEX', title: 'An index of small ideas.',
        caption: 'Interface studies in HTML, CSS & JavaScript.', detail: 'Selected work',
        items: [{ label: 'Reading space', value: 'Layout' }, { label: 'Daily outlook', value: 'Interaction' }],
      },
      link: '', linkLabel: 'View project',
    },
  ],
  chart: {
    heading: 'Technology use in the sample work',
    description: 'This small inventory counts the technologies used in the fictional project collection below. It describes the examples, not skill levels or professional experience.',
    // Counts are computed from projects[].tags. These names must match those tags.
    technologies: ['HTML', 'CSS', 'JavaScript', 'API'],
    colors: ['#8ed7c5', '#77b9b3', '#b1d8ce', '#8caeb9'],
  },
  contact: {
    heading: 'Contact',
    intro: 'Example contact details for this fictional profile. The practice form checks your input in the browser; it does not send a message.',
    details: [
      { label: 'Email', value: 'hello@example.com', url: '' },
      { label: 'Location', value: 'Example City, Example Country', url: '' },
      { label: 'Elsewhere', value: 'GitHub public organization (external demo)', url: 'https://github.com/github' },
    ],
  },
  demo: {
    githubOrganization: 'github',
    repositoryLimit: 3, // Deliberately clamped to 1–6 in api.js.
    cacheMinutes: 5, // sessionStorage only: public repository metadata, never form fields.
    timeoutMs: 8000,
    // Stable invented data, NOT claimed to be real repositories or live statistics.
    fallbackRepositories: [
      { name: 'interface-foundations', description: 'Demo data: reusable patterns for a thoughtful, accessible interface.', language: 'CSS', stars: 128, url: '' },
      { name: 'little-web-experiments', description: 'Demo data: small explorations of browser APIs and interactions.', language: 'JavaScript', stars: 86, url: '' },
      { name: 'documentation-starter', description: 'Demo data: a beginner-friendly home for useful documentation.', language: 'HTML', stars: 64, url: '' },
    ],
  },
  footer: 'A portfolio reference in HTML, CSS & JavaScript.',
};
