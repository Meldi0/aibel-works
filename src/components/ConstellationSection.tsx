import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Compass, Layers, Sparkles } from 'lucide-react';
import { TECH_LIST, CATEGORIES } from '../data/techData';
import { Reveal, SectionLabel } from './Reveal';
import { EASE } from '../lib/motion';

export function ConstellationSection() {
  const [category, setCategory] = useState('all');
  const [activeId, setActiveId] = useState('frontend');
  const reduced = useReducedMotion();
  const filtered = category === 'all' ? TECH_LIST : TECH_LIST.filter(tech => tech.category === category);
  const active = TECH_LIST.find(tech => tech.id === activeId) ?? TECH_LIST[0];
  const selectCategory = (id: string) => {
    setCategory(id);
    if (id !== 'all' && active.category !== id) setActiveId(TECH_LIST.find(tech => tech.category === id)!.id);
  };
  return <section id="stack" data-tone="dark" className="stack-section section-shell">
    <SectionLabel number="03" detail="Technology is always evolving, and so is my stack">My Tech Stack</SectionLabel>
    <div className="section-heading-row"><h2 className="display-heading"><Reveal>The tools</Reveal><Reveal delay={.08}><span className="muted">behind my ideas.</span></Reveal></h2><p><Reveal>These are technologies I’ve used, worked with, studied, or explored through different projects.</Reveal></p></div>
    <div className="stack-filters" role="group" aria-label="Filter capabilities">{CATEGORIES.map(item => <button key={item.id} onClick={() => selectCategory(item.id)} aria-pressed={category === item.id}>{item.label}</button>)}</div>
    <div className="stack-grid">
      <div className="tech-list" role="group" aria-label="Choose a technology">{filtered.map((tech, i) => <button className={`tech-row ${tech.id === activeId ? 'is-active' : ''}`} key={tech.id} aria-pressed={tech.id === activeId} aria-controls="technology-detail" onClick={() => setActiveId(tech.id)}><span className="tech-index">{String(i + 1).padStart(2, '0')}</span><span className="tech-name">{tech.name}<span>{tech.highlight}</span></span><span className="tech-level">{tech.level}</span><ArrowUpRight size={18} /></button>)}</div>
      <aside className="tech-inspector" id="technology-detail" aria-live="polite" aria-atomic="true">
        <div className="inspector-meta"><span>{active.categoryLabel}</span><span>Status · {active.level}</span></div>
        <div className="mastery-track" aria-hidden="true"><motion.div initial={false} animate={{ scaleX: active.levelNum / 100 }} transition={{ duration: reduced ? 0 : .9, ease: EASE }} /></div>
        <AnimatePresence mode="wait"><motion.div key={active.id} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .7, ease: EASE }}>
          <h3>{active.name}</h3><p className="inspector-highlight">{active.highlight}</p><p>{active.description}</p>
          <div className="inspector-fact"><h4>Core focus</h4><p>{active.architecturePattern}</p></div>
          <div className="inspector-fact"><h4>Project implementation</h4><p>{active.productionCase}</p></div>
          <h4 className="eyebrow">Technologies & tools in this category</h4><div className="tech-tags">{active.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
        </motion.div></AnimatePresence>
      </aside>
    </div>
    <div className="architecture-pillars">
      <article><p className="eyebrow icon-label"><Layers size={13} /> Perspective</p><h3><Reveal>Hands-on & Evolving</Reveal></h3><p>I don’t claim to have mastered every technology on this list. Some are part of my hands-on projects, while others are technologies I’m actively learning and experimenting with.</p></article>
      <article><p className="eyebrow icon-label"><Compass size={13} /> Developer Mindset</p><h3><Reveal>Learn, Adapt, Solve</Reveal></h3><p>For me, being a developer isn’t about knowing every framework. It’s about knowing how to learn, adapt, and solve problems.</p></article>
      <article><p className="eyebrow icon-label"><Sparkles size={13} /> Versatility</p><h3><Reveal>Code, Creativity & Curiosity</Reveal></h3><p>Whether working on structured PHP & Laravel backends, React interfaces, databases, or local AI Agents with Ollama, understanding how things work matters most.</p></article>
    </div>
  </section>;
}
