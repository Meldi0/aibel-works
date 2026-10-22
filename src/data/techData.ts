export interface TechItem {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'ai' | 'tools' | 'creative';
  categoryLabel: string;
  level: string;
  levelNum: number;
  highlight: string;
  description: string;
  architecturePattern: string;
  productionCase: string;
  tags: string[];
}

export const TECH_LIST: TechItem[] = [
  {
    id: 'frontend',
    name: 'React.js, TypeScript & Vite',
    category: 'frontend',
    categoryLabel: 'FRONTEND DEVELOPMENT',
    level: 'Hands-On',
    levelNum: 92,
    highlight: 'Modern, Responsive & Interactive Web Interfaces',
    description: 'Creating modern, responsive, and interactive web interfaces using React.js, TypeScript, JavaScript (ES6+), HTML5, CSS3, Vite, Tailwind CSS, and the Canvas API.',
    architecturePattern: 'Component-Driven UI, Responsive Layouts & Canvas Media Processing',
    productionCase: 'Used across SNAPDAYS (CissPic Photobooth), POSIND Control Tower, Flowbase Dashboard, and interactive web experiments.',
    tags: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'TypeScript', 'React.js', 'Vite', 'Tailwind CSS', 'Responsive Web Design', 'Canvas API'],
  },
  {
    id: 'backend-laravel',
    name: 'PHP & Laravel',
    category: 'backend',
    categoryLabel: 'BACKEND DEVELOPMENT',
    level: 'Hands-On',
    levelNum: 90,
    highlight: 'Structured Application Logic, APIs & Data Systems',
    description: 'PHP and Laravel are part of my backend development toolkit, helping me explore structured approaches to application logic, APIs, authentication, and data-driven systems.',
    architecturePattern: 'MVC Architecture, RESTful API Integration & Role-Based Access',
    productionCase: 'Powering Smart School Ecosystem, operational backends, and structured enterprise workflows.',
    tags: ['PHP', 'Laravel', 'REST API Development', 'API Integration', 'Authentication & Authorization Concepts'],
  },
  {
    id: 'backend-node-python',
    name: 'Node.js & Python',
    category: 'backend',
    categoryLabel: 'BACKEND DEVELOPMENT',
    level: 'Hands-On',
    levelNum: 88,
    highlight: 'Backend Services, AI Pipelines & Automation',
    description: 'Building backend services, API integrations, business logic, and AI data pipelines using Node.js and Python to connect interfaces with databases and local AI models.',
    architecturePattern: 'REST API Services, Async Data Processing & LLM Orchestration',
    productionCase: 'Used in POSO System, Local AI Shipment Agent, and Personal Local AI Assistant.',
    tags: ['Node.js', 'Python', 'REST API Development', 'API Integration', 'Authentication & Authorization Concepts'],
  },
  {
    id: 'database-cloud',
    name: 'MySQL, MongoDB & Aiven Cloud',
    category: 'database',
    categoryLabel: 'DATABASE & CLOUD',
    level: 'Hands-On',
    levelNum: 90,
    highlight: 'Relational, Document & Cloud Database Systems',
    description: 'Working with MySQL, MongoDB, and Aiven Cloud Database to explore how applications store, organize, validate, map, and retrieve structured and operational datasets.',
    architecturePattern: 'Relational Database Design, Document Stores & Master Data Mapping',
    productionCase: 'Applied in iPOS5 Data Integration, POSO System (MySQL & Aiven), and Local AI Shipment Agent (MongoDB).',
    tags: ['MySQL', 'MongoDB', 'Aiven Cloud Database', 'Database Design', 'Data Mapping', 'Data Processing'],
  },
  {
    id: 'ai-automation',
    name: 'Ollama & Local AI Agents',
    category: 'ai',
    categoryLabel: 'AI & AUTOMATION',
    level: 'Exploring',
    levelNum: 86,
    highlight: 'Local LLMs, Tool Calling & Contextual Workflows',
    description: 'Experimenting with AI-powered applications using Ollama and Local Large Language Models—building intelligent agents that work with real data, understand context, and support actual workflows.',
    architecturePattern: 'Local-First LLM Agents, Prompt Engineering & Tool Calling',
    productionCase: 'Developed the Local AI Shipment Agent at PT Graha Pos Indonesia and a Personal Local AI Assistant.',
    tags: ['Ollama', 'Local Large Language Models', 'AI Agent Development', 'Prompt Engineering', 'Tool Calling Exploration', 'Workflow Automation'],
  },
  {
    id: 'dev-tools',
    name: 'Git, Linux (Fedora KDE) & DevTools',
    category: 'tools',
    categoryLabel: 'DEVELOPMENT TOOLS',
    level: 'Daily Driver',
    levelNum: 92,
    highlight: 'Cross-OS Workflow, Version Control & API Debugging',
    description: 'Customizing development environments across Windows and Linux (Fedora KDE), managing packages and version control with Git & npm, and debugging APIs and UI performance.',
    architecturePattern: 'Iterative Debugging, Environment Customization & API Testing',
    productionCase: 'Daily development workflow across full-stack, data, and AI engineering projects.',
    tags: ['Git', 'npm', 'Visual Studio Code', 'Browser DevTools', 'Windows', 'Linux', 'Fedora KDE', 'API Testing & Debugging'],
  },
  {
    id: 'creative-interactive',
    name: 'Creative UI, Glassmorphism & Roblox Studio',
    category: 'creative',
    categoryLabel: 'CREATIVE & INTERACTIVE',
    level: 'Exploring',
    levelNum: 88,
    highlight: 'UI/UX, Typography Tools & 3D World Building',
    description: 'Building interactive web applications, glassmorphism interfaces, typography experiments (GlyphLab), and atmospheric social environments in Roblox Studio with Luau.',
    architecturePattern: 'Interactive Editors, Design Systems & Spatial World Building',
    productionCase: 'SNAPDAYS photobooth studio, GlyphLab typography tool, and Midnight District in Roblox Studio.',
    tags: ['UI/UX Design', 'Interactive Web Applications', 'Glassmorphism Design', 'Responsive Layouts', 'Typography Experiments', 'Roblox Studio', 'Luau Exploration'],
  },
];

export const CATEGORIES = [
  { id: 'all', label: 'ALL TECHNOLOGIES' },
  { id: 'frontend', label: 'FRONTEND DEVELOPMENT' },
  { id: 'backend', label: 'BACKEND DEVELOPMENT' },
  { id: 'database', label: 'DATABASE & CLOUD' },
  { id: 'ai', label: 'AI & AUTOMATION' },
  { id: 'tools', label: 'DEVELOPMENT TOOLS' },
  { id: 'creative', label: 'CREATIVE & INTERACTIVE' },
];


