import { Bot, Database, Layout, Palette, Server, Sparkles } from 'lucide-react';
import { Reveal, SectionLabel, StaggerCard } from './Reveal';

const WHAT_I_DO = [
  {
    number: '01',
    title: 'Frontend Development',
    subtitle: 'MODERN, RESPONSIVE & INTERACTIVE WEB INTERFACES',
    Icon: Layout,
    visualType: 'frontend',
    visualTags: ['React 19', 'TypeScript', 'GSAP Motion', 'Tailwind CSS'],
    visualCaption: 'Glassmorphism · Smooth Scroll · Micro-Interactions',
    paragraphs: [
      'I create modern, responsive, and interactive web interfaces using technologies like React, JavaScript, TypeScript, HTML, CSS, and Tailwind CSS.',
      'Gue suka desain yang clean, elegant, dan punya karakter. Bukan cuma sekadar halaman yang bagus di screenshot, tapi juga nyaman digunakan.',
      "I'm particularly interested in glassmorphism, smooth animations, typography, thoughtful interactions, and immersive digital experiences.",
    ],
  },
  {
    number: '02',
    title: 'Backend Development',
    subtitle: 'STRUCTURED APPLICATION LOGIC & API INTEGRATION',
    Icon: Server,
    visualType: 'backend',
    visualTags: ['PHP & Laravel', 'Node.js', 'Python', 'REST API'],
    visualCaption: 'RBAC Auth · Clean Architecture · Enterprise Workflows',
    paragraphs: [
      'I explore and build application logic using PHP, Laravel, Node.js, and Python.',
      'Mulai dari API integration, database management, authentication, business logic, sampai bagaimana sebuah sistem bisa bekerja secara terstruktur.',
      'I enjoy understanding what happens behind the interface, because a great application needs more than just a beautiful frontend.',
    ],
  },
  {
    number: '03',
    title: 'AI & Automation',
    subtitle: 'LOCAL AI SYSTEMS, OLLAMA & INTELLIGENT WORKFLOWS',
    Icon: Bot,
    visualType: 'ai',
    visualTags: ['Ollama LLM', 'Local AI Agent', 'Tool Calling', 'Python'],
    visualCaption: '> ollama run popell-agent --context="Shipment & Workspace"',
    paragraphs: [
      'I experiment with AI-powered applications, particularly local AI systems using Ollama and Large Language Models.',
      'Gue tertarik sama AI yang benar-benar useful. Not just a chatbot that talks, but an intelligent system that can work with data, understand context, and support actual workflows.',
    ],
  },
  {
    number: '04',
    title: 'Database & Data Systems',
    subtitle: 'MYSQL, MONGODB, DATA MAPPING & ANALYTICS',
    Icon: Database,
    visualType: 'data',
    visualTags: ['MySQL 3NF', 'MongoDB', 'iPOS5 Mapping', 'Data Analytics'],
    visualCaption: 'Structured Schema · Master Data Validation · Dashboards',
    paragraphs: [
      'I work with databases like MySQL and MongoDB, exploring how applications store, organize, process, and retrieve information.',
      "I've also gained experience working with operational datasets, data mapping, and analytical dashboards.",
    ],
  },
  {
    number: '05',
    title: 'Creative Development',
    subtitle: 'INTERACTIVE WEB EXPERIMENTS & VISUAL TOOLS',
    Icon: Palette,
    visualType: 'creative',
    visualTags: ['Snapdays Studio', 'GlyphLab Type', 'Three.js / WebGL', 'Midnight District'],
    visualCaption: 'Interactive Photobooth · Kinetic Typography · 3D Worlds',
    paragraphs: [
      'I love building interactive web experiments, visual editors, photobooths, typography tools, and digital environments.',
      'Sometimes the best projects start from the most random ideas.',
    ],
  },
];

export function MetricsSection() {
  return (
    <section id="what-i-do" data-tone="light" className="metrics-section section-shell">
      <SectionLabel number="02" detail="A little bit of everything. With intention.">What I Do</SectionLabel>
      <div className="section-heading-row">
        <h2 className="display-heading">
          <Reveal>A little bit of</Reveal>
          <Reveal delay={.08}><span className="muted creative-serif-accent">everything.</span></Reveal>
        </h2>
        <p><Reveal>With intention. Exploring frontend, backend, local AI, databases, and creative coding.</Reveal></p>
      </div>
      <div className="what-i-do-grid">
        {WHAT_I_DO.map((item, i) => {
          const Icon = item.Icon;
          return (
            <StaggerCard className="metric what-i-do-card" key={item.number} index={i}>
              <div className="card-top-meta">
                <span className="card-icon-badge"><Icon size={16} /></span>
                <span className="eyebrow">{item.number} / Discipline</span>
              </div>
              <h3 className="what-i-do-title"><Reveal delay={i * .04}>{item.title}</Reveal></h3>
              <p className="metric-sublabel">{item.subtitle}</p>

              {/* Animated Creative Blueprint Strip tied directly to Eldi's work */}
              <div className={`discipline-blueprint is-${item.visualType}`} aria-hidden="true">
                <div className="blueprint-tags">
                  {item.visualTags.map((tag, idx) => (
                    <span key={tag} className="blueprint-chip" style={{ animationDelay: `${idx * 0.35}s` }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="blueprint-status-bar">
                  <Sparkles size={11} className="blueprint-sparkle" />
                  <span>{item.visualCaption}</span>
                </div>
              </div>

              {item.paragraphs.map((p, idx) => (
                <p className="metric-detail" key={idx}><Reveal delay={i * .04 + idx * .03}>{p}</Reveal></p>
              ))}
            </StaggerCard>
          );
        })}
      </div>
    </section>
  );
}
