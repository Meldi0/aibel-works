import { useCallback, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, BarChart3, BookOpen, Bot, Briefcase, CheckCircle2, Code2, Compass, Database, Layers, Layout, Palette, RefreshCw, ShieldCheck, Sparkles, Terminal } from 'lucide-react';
import { PROJECTS_DATA } from '../data/portfolioData';
import type { ProjectItem } from '../types';
import { ProjectModal } from './ProjectModal';
import { Reveal, SectionLabel } from './Reveal';
import { EASE } from '../lib/motion';

const HOW_I_THINK = [
  {
    number: '01',
    title: 'Curious by default.',
    Icon: Compass,
    paragraphs: [
      'Gue suka penasaran sama cara sesuatu bekerja.',
      "When I discover an interesting feature or technology, I want to understand how it's built, why it works that way, and whether there's a better approach.",
    ],
  },
  {
    number: '02',
    title: 'Function matters. Design matters too.',
    Icon: Layers,
    paragraphs: [
      'A beautiful interface that doesn’t work is just decoration. A working interface that nobody enjoys using isn’t much better.',
      'I want both.',
    ],
  },
  {
    number: '03',
    title: 'Small details make a big difference.',
    Icon: Sparkles,
    paragraphs: [
      'Typography, animations, spacing, loading states, feedback, and responsiveness might look like small details.',
      'But those details can completely change how a product feels.',
    ],
  },
  {
    number: '04',
    title: 'Build. Break. Debug. Improve. Repeat.',
    Icon: RefreshCw,
    paragraphs: [
      'My development process is iterative. Gue suka experimenting, testing ideas, finding issues, dan terus improve sesuatu sampai hasilnya terasa lebih matang.',
      'Sometimes it takes several iterations to get something right, and that’s perfectly normal.',
    ],
  },
  {
    number: '05',
    title: 'Always a student.',
    Icon: BookOpen,
    paragraphs: [
      'I don’t pretend to know everything. There are still so many technologies, concepts, and development practices I want to learn.',
      'What matters to me is staying curious, adapting quickly, and being willing to improve.',
    ],
  },
];

const LEARNING_TRACKS = [
  {
    title: 'Full-Stack Development',
    Icon: Code2,
    description: 'Improving my understanding of frontend and backend architecture, with technologies including React, PHP, Laravel, Node.js, and database systems.',
  },
  {
    title: 'AI Engineering',
    Icon: Bot,
    description: 'Exploring AI Agents, local LLM integration, tool calling, and how intelligent systems can interact with real data.',
  },
  {
    title: 'UI/UX Engineering',
    Icon: Layout,
    description: 'Learning more about visual systems, interactive interfaces, web animations, accessibility, and performance.',
  },
  {
    title: 'Data Systems',
    Icon: Database,
    description: 'Understanding how data can be structured, validated, processed, and transformed into useful information.',
  },
  {
    title: 'Creative Coding',
    Icon: Palette,
    description: 'Building interactive experiences that combine programming, creativity, and visual experimentation.',
  },
];

const INTERNSHIP_POINTS = [
  'Developing and improving internal web applications.',
  'Working with frontend and backend technologies.',
  'Exploring AI-powered shipment analysis using Ollama and MongoDB.',
  'Working with operational dashboards and shipment datasets.',
  'Preparing and mapping master office data.',
  'Learning how logistics tracking and exception monitoring workflows operate.',
  'Gaining exposure to enterprise tools and monitoring environments.',
  'Working with structured datasets and image annotation.',
];

const LAB_EXPLORATIONS = [
  {
    code: 'EXP-01',
    title: 'Local AI Shipment Agent',
    category: 'AI Engineering • Internship Project',
    tagline: 'Turning tracking data into actionable insights.',
    description: 'An AI-powered shipment analysis system developed during my internship at PT Graha Pos Indonesia to make logistics data easier to understand and more useful for operational decision-making. Integrates with a local MongoDB database and a locally running AI model through Ollama to explore delivery failures, interception requests, delayed packages, and shipments requiring attention. Gue juga explore gimana AI bisa membaca history paket berdasarkan nomor resi sebelum memberikan kesimpulan, sehingga responsnya lebih contextual dan data-driven.',
    stack: ['Python', 'MongoDB', 'Ollama', 'REST API', 'Web Technologies', 'Local AI', 'AI Agents', 'Logistics Analytics'],
    status: 'Ongoing Development',
    Icon: Bot,
  },
  {
    code: 'EXP-02',
    title: 'Personal Local AI Assistant',
    category: 'AI Experiment • Personal Project',
    tagline: 'An AI assistant that actually understands my workspace.',
    description: 'An experimental project exploring a personal AI assistant powered by locally running language models that goes beyond simple conversations. Designed to understand project context, interact with authorized files and tools, and support development workflows—exploring tool calling, filesystem interactions, AI Agents, and local-first AI architecture.',
    stack: ['Ollama', 'Python', 'Local LLMs', 'Web Technologies', 'AI Agents', 'Tool Integration', 'Developer Productivity'],
    status: 'Experimental / In Development',
    Icon: Terminal,
  },
  {
    code: 'EXP-03',
    title: 'POSO System',
    category: 'Full-Stack Web Application • Enterprise System',
    tagline: 'Building better operational workflows.',
    description: 'An operational web application involving application interfaces, backend integration, databases, and internal operational workflows. Explored improvements involving user roles, account permissions, multi-factor authentication concepts, operator activity monitoring, and administrative dashboards—gaining deeper understanding of how enterprise applications are structured and how components communicate.',
    stack: ['React', 'TypeScript', 'Vite', 'Node.js', 'MySQL', 'Aiven', 'Enterprise Apps', 'Access Management'],
    status: 'Enterprise System',
    Icon: ShieldCheck,
  },
  {
    code: 'EXP-04',
    title: 'Regional Performance Dashboard',
    category: 'Data Visualization • Analytics Dashboard',
    tagline: 'Making complex data easier to understand.',
    description: 'A regional shipment-performance dashboard designed to present operational data in a structured, understandable, and visually accessible interface. Focuses on regional shipment volumes and delivery product categories across regions. Gue belajar bahwa dashboard yang bagus bukan cuma punya banyak grafik, tetapi juga bisa membantu pengguna memahami informasi tanpa harus membaca spreadsheet yang panjang.',
    stack: ['Vite', 'JavaScript Ecosystem', 'Web UI Technologies', 'Data Visualization', 'Analytics', 'Dashboard Design'],
    status: 'Analytics Dashboard',
    Icon: BarChart3,
  },
  {
    code: 'EXP-05',
    title: 'iPOS5 Data Integration',
    category: 'Enterprise Data • Internship Project',
    tagline: 'Better systems start with better data.',
    description: 'A data preparation and integration project involving master office data and official regional reference datasets. Explored data validation, structural differences, and a consistent mapping strategy so existing application records align with reliable reference data. This project taught me an important lesson: real-world data doesn’t always come in the structure your application expects.',
    stack: ['Master Data Management', 'Data Mapping', 'Data Validation', 'Enterprise Data Integration'],
    status: 'Internship Project',
    Icon: Database,
  },
  {
    code: 'EXP-06',
    title: 'Midnight District',
    category: 'Game Development • Creative Project',
    tagline: 'An immersive city made for exploration and social experiences.',
    description: 'A Roblox game development concept focused on creating a modern, atmospheric social environment. The vision includes detailed architecture, dynamic lighting, realistic-inspired weather, interactive buildings, and thoughtfully designed interiors—creating functional spaces such as cafés, hotels, elevators, and explorable rooms with smooth surfaces and elegant Game UI.',
    stack: ['Roblox Studio', 'Luau Exploration', 'Interactive Environments', 'World Building', 'Game UI'],
    status: 'In Development',
    Icon: Sparkles,
  },
  {
    code: 'EXP-07',
    title: 'GlyphLab',
    category: 'Creative Typography Tool • Web Experiment',
    tagline: 'Making typography a little less boring.',
    description: 'A creative web experiment focused on decorative typography, font combinations, scrapbook-inspired text, and customizable visual styles. Explores different typography personalities—from cute and playful to elegant, chaotic, and spooky—with curated style filters and interactive customization. Because even a simple piece of text can have its own personality.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Creative UI', 'Typography', 'Interactive Web Tools'],
    status: 'Web Experiment',
    Icon: Palette,
  },
  {
    code: 'EXP-08',
    title: 'Top Customer Analytics',
    category: 'Data Analytics • Internship Experience',
    tagline: 'Finding meaningful patterns in business data.',
    description: 'A data-focused project involving customer information, structured datasets, and business analytics. The work introduced me to how customer-related information can support operational monitoring and business insights in a real enterprise environment.',
    stack: ['Customer Analytics', 'Data Processing', 'Business Insights', 'Structured Datasets'],
    status: 'Internship Experience',
    Icon: Layout,
  },
  {
    code: 'EXP-09',
    title: 'Image Annotation & Operational Tools',
    category: 'Data Operations • Internship Experience',
    tagline: 'The technical work behind reliable data.',
    description: 'Hands-on experience working with image annotation activities involving logistics-related objects, including packages, buildings, and PO Boxes, alongside operational monitoring systems and enterprise workflows—connecting data quality, system monitoring, and software applications in real working environments.',
    stack: ['Image Annotation', 'Operational Monitoring', 'Data Quality', 'Enterprise Systems'],
    status: 'Internship Experience',
    Icon: Layers,
  },
];

export function ProjectsSection() {
  const [selected, setSelected] = useState<ProjectItem | null>(null);
  const [expandedLabs, setExpandedLabs] = useState<Record<string, boolean>>({});
  const close = useCallback(() => setSelected(null), []);
  const reduced = useReducedMotion();
  const toggleLab = (code: string) =>
    setExpandedLabs(prev => ({ ...prev, [code]: !prev[code] }));
  return <>
    <section id="projects" data-tone="light" className="projects-section section-shell">
      <SectionLabel number="04" detail="Things I've been building">Featured Projects</SectionLabel>
      <div className="section-heading-row"><h2 className="display-heading"><Reveal>Project</Reveal><Reveal delay={.08}><span className="muted">archive.</span></Reveal></h2><p><Reveal>A collection of personal projects, real-world applications, creative experiments, and systems I’ve worked on throughout my development journey.</Reveal></p></div>
      <LayoutGroup id="project-archive">
        <div className="project-list">{PROJECTS_DATA.map(project => <article className="project" key={project.id}>
          <div className="project-info"><span className="eyebrow"><Reveal>{project.number} / {project.year}</Reveal></span>
            <motion.h3 layoutId={reduced ? undefined : `title-${project.id}`}><button className="project-title-button" onClick={() => setSelected(project)}>{project.title}</button></motion.h3>
            <p className="project-subtitle">{project.subtitle}</p><p className="project-description"><Reveal>{project.description}</Reveal></p>
            <p className="project-role">{project.role}</p>
            <div className="tech-tags">{project.technologies.map(tech => <span key={tech}>{tech}</span>)}</div>
            <div className="project-bottom"><span>{project.metrics}</span><button className="text-link" onClick={() => setSelected(project)} aria-label={`Explore case study: ${project.title}`}>Case study <ArrowUpRight size={17} /></button></div>
          </div>
          <motion.button className={`project-visual ${project.aspect === 'portrait' ? 'is-portrait' : ''}`} layoutId={reduced ? undefined : `visual-${project.id}`} transition={{ duration: .85, ease: EASE }} onClick={() => setSelected(project)} aria-label={`Open ${project.title}`}>
            <img src={project.image} alt={project.title} width="1280" height="720" loading="lazy" decoding="async" />
            <span className="project-highlight" aria-hidden="true" /><span className="project-image-index">{project.number} — {project.year}</span><span className="project-open-icon" aria-hidden="true"><ArrowUpRight size={23} /></span>
          </motion.button>
        </article>)}</div>
        <AnimatePresence>{selected && <ProjectModal key={selected.id} project={selected} onClose={close} />}</AnimatePresence>
      </LayoutGroup>

      <div className="lab-explorations-block">
        <div className="lab-explorations-header">
          <div>
            <span className="eyebrow icon-label"><Sparkles size={13} /> R&D Lab & Ongoing Explorations</span>
            <h3>Additional AI, Creative & Data Projects</h3>
          </div>
          <p className="muted">Some are ongoing developments, and some are experiments where I’m exploring what’s possible.</p>
        </div>
        <div className="what-i-do-grid">
          {LAB_EXPLORATIONS.map(item => {
            const Icon = item.Icon;
            const isExpanded = !!expandedLabs[item.code];
            return (
              <article
                className={`metric what-i-do-card lab-card ${isExpanded ? 'is-expanded' : ''}`}
                key={item.code}
                onClick={() => toggleLab(item.code)}
              >
                <div className="card-top-meta">
                  <span className="card-icon-badge"><Icon size={16} /></span>
                  <span className="eyebrow">{item.code} · {item.status}</span>
                </div>
                <h4 className="what-i-do-title">{item.title}</h4>
                <p className="metric-sublabel">{item.category}</p>
                <p className="lab-tagline">“{item.tagline}”</p>
                <p className="metric-detail lab-description">{item.description}</p>
                <span className="lab-read-more">
                  {isExpanded ? 'Sembunyikan −' : 'Selengkapnya +'}
                </span>
                <div className="tech-tags" style={{ marginTop: '14px' }}>
                  {item.stack.map(tech => <span key={tech}>{tech}</span>)}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>

    <section id="experience" data-tone="dark" className="experience-section section-shell">
      <SectionLabel number="05" detail="SMK Software Engineering (RPL) • PT Pos Indonesia">Experience & Education</SectionLabel>
      <div className="section-heading-row">
        <h2 className="display-heading"><Reveal>Learning beyond</Reveal><Reveal delay={.08}><span className="muted">the classroom.</span></Reveal></h2>
        <p><Reveal>PT Pos Indonesia · Operations Control (Pengendalian Operasi) | Bandung</Reveal></p>
      </div>
      <div className="experience-card">
        <div className="experience-header">
          <div>
            <span className="eyebrow icon-label"><Briefcase size={13} /> Internship (PKL) · Operations Control Division (Pengendalian Operasi)</span>
            <h3>Operations Control, Software & AI Intern</h3>
            <p className="project-subtitle">PT POS INDONESIA · BANDUNG, INDONESIA</p>
          </div>
        </div>
        <div className="experience-body">
          <div className="experience-narrative">
            <p>As a Software Engineering (Rekayasa Perangkat Lunak / RPL) vocational student, I completed my industry internship (PKL) at PT Pos Indonesia in the <strong>Operations Control (Pengendalian Operasi)</strong> division—gaining hands-on exposure to software development, AI experimentation, enterprise data, and national logistics operations.</p>
            <p>One thing I learned in Operations Control is that building a real application is very different from a small classroom demo. Real-world logistics systems need reliable data, clear monitoring workflows, thoughtful interfaces, and solutions that actually help operational teams track and control shipments.</p>
          </div>
          <div>
            <span className="eyebrow experience-list-label">Key responsibilities in Operations Control</span>
            <ul className="experience-list">
              {INTERNSHIP_POINTS.map(point => <li key={point}><CheckCircle2 size={15} className="list-check-icon" /><span>{point}</span></li>)}
            </ul>
          </div>
        </div>
      </div>

      <div className="subsection-block">
        <SectionLabel number="06" detail="My approach to development">How I Think & Build</SectionLabel>
        <div className="what-i-do-grid">
          {HOW_I_THINK.map((item, i) => {
            const Icon = item.Icon;
            return (
              <article className="metric what-i-do-card" key={item.number}>
                <div className="card-top-meta">
                  <span className="card-icon-badge"><Icon size={16} /></span>
                  <span className="eyebrow">{item.number} / Principle</span>
                </div>
                <h3 className="what-i-do-title"><Reveal delay={i * .05}>{item.title}</Reveal></h3>
                {item.paragraphs.map((p, idx) => (
                  <p className="metric-detail" key={idx}>{p}</p>
                ))}
              </article>
            );
          })}
        </div>
      </div>

      <div className="beyond-grid subsection-block">
        <div>
          <SectionLabel number="07" detail="More than just syntax and semicolons">Beyond The Code</SectionLabel>
          <h3 className="beyond-heading">More than just syntax and semicolons.</h3>
          <p className="metric-detail">Outside traditional software development, I enjoy exploring the creative side of technology. I’m interested in digital aesthetics, interface design, AI-powered experiences, typography, interactive tools, and game environments.</p>
          <p className="metric-detail">My visual preferences often lean toward clean typography, elegant layouts, subtle motion, glass-inspired interfaces, and carefully considered interactions. I also enjoy experimenting with different operating systems, customizing my development environment, and discovering tools that improve my workflow.</p>
          <p className="metric-detail">Sometimes I’m working on a serious operational dashboard. Sometimes I’m experimenting with an AI Agent. And sometimes I’m designing a photobooth, customizing typography, or figuring out how to make a virtual hotel elevator work properly. <strong>Different projects. Same curiosity.</strong></p>
        </div>
        <div>
          <SectionLabel number="08" detail="Currently exploring">What I’m Learning</SectionLabel>
          <h3 className="beyond-heading">My goal isn’t just to build bigger applications. It’s to build better ones.</h3>
          <div className="learning-list">
            {LEARNING_TRACKS.map(track => {
              const Icon = track.Icon;
              return (
                <div className="learning-item" key={track.title}>
                  <h4><Icon size={16} className="inline-icon" /> {track.title}</h4>
                  <p>{track.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="developer-identity-banner subsection-block">
        <SectionLabel number="09" detail="The person behind AIBEL">My Developer Identity</SectionLabel>
        <div className="identity-biography identity-banner-grid">
          <div>
            <span className="eyebrow icon-label"><Terminal size={13} /> Muhamad Eldi • aka AIBEL</span>
            <h3 className="identity-banner-title">Developer | Full-Stack Developer & AI Explorer</h3>
            <p className="muted identity-banner-tagline">Crafting digital experiences through code, creativity, and curiosity.</p>
          </div>
          <div className="identity-banner-copy">
            <p className="identity-banner-lead">I see myself as a developer who enjoys working across different parts of technology. PHP and Laravel are part of my backend development toolkit, helping me explore more structured approaches to application logic, APIs, and data-driven systems. At the same time, I enjoy working with frontend frameworks, creative interfaces, database technologies, and local AI tools.</p>
            <p className="identity-banner-body">I believe being versatile is valuable, but understanding the technologies I use is even more important. Some of my skills come from hands-on development experience, while others are still evolving through experiments and personal projects. I want my work to speak for itself through real implementations, thoughtful solutions, and continuous improvement.</p>
            <p className="identity-banner-closing">Not here to know everything. Here to keep figuring things out.</p>
          </div>
        </div>
      </div>
    </section>
  </>;
}
