import { Bot, Database, Layout, Palette, Server } from 'lucide-react';
import { Reveal, SectionLabel } from './Reveal';

const WHAT_I_DO = [
  {
    number: '01',
    title: 'Frontend Development',
    subtitle: 'MODERN, RESPONSIVE & INTERACTIVE WEB INTERFACES',
    Icon: Layout,
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
          <Reveal delay={.08}><span className="muted">everything.</span></Reveal>
        </h2>
        <p><Reveal>With intention. Exploring frontend, backend, local AI, databases, and creative coding.</Reveal></p>
      </div>
      <div className="what-i-do-grid">
        {WHAT_I_DO.map((item, i) => {
          const Icon = item.Icon;
          return (
            <article className="metric what-i-do-card" key={item.number}>
              <div className="card-top-meta">
                <span className="card-icon-badge"><Icon size={16} /></span>
                <span className="eyebrow">{item.number} / Discipline</span>
              </div>
              <h3 className="what-i-do-title"><Reveal delay={i * .05}>{item.title}</Reveal></h3>
              <p className="metric-sublabel">{item.subtitle}</p>
              {item.paragraphs.map((p, idx) => (
                <p className="metric-detail" key={idx}><Reveal delay={i * .05 + idx * .03}>{p}</Reveal></p>
              ))}
            </article>
          );
        })}
      </div>
    </section>
  );
}
