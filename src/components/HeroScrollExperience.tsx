import { lazy, Suspense, useLayoutEffect, useRef, useState } from 'react';
import { ArrowDown, Code2, Cpu, Layers, Sparkles, Terminal, Volume2, VolumeX } from 'lucide-react';
import { gsap, ScrollTrigger, useMotionSettings } from '../lib/motion';
import { Magnetic } from './Magnetic';

const ThreeCanvas = lazy(() => import('./ThreeCanvas').then(module => ({ default: module.ThreeCanvas })));

const WORDS = [
  {
    title: 'INSIGHT',
    kicker: '01 // HEY, I’M MUHAMAD ELDI — AKA POPELL',
    subtitle: 'Full-Stack Developer • Creative Technologist • AI Explorer',
    noteTitle: '01 — Hey, I’m Eldi!',
    noteSub: 'Turning ideas into real digital experiences.',
    Icon: Terminal,
    orbitLeft: { label: 'IDENTITY', value: 'Muhamad Eldi (POPELL)', sub: 'SMK Software Engineering (RPL)' },
    orbitRight: { label: 'BASE', value: 'Bandung, Indonesia', sub: '6°54\'53"S · Creative Studio' },
  },
  {
    title: 'INSPIRE',
    kicker: '02 // WHERE ENGINEERING MEETS VISUAL ART',
    subtitle: 'Crafting digital experiences through code, creativity, and curiosity',
    noteTitle: '02 — Creative Web',
    noteSub: 'Not just work, but feel good to use.',
    Icon: Sparkles,
    orbitLeft: { label: 'CREATIVE STUDIO', value: 'Snapdays Photobooth', sub: '4-Cut Composer & WebRTC' },
    orbitRight: { label: 'EXPERIMENTS', value: 'GlyphLab & 3D Worlds', sub: 'Kinetic Type & Midnight District' },
  },
  {
    title: 'ARCHITECT',
    kicker: '03 // STRUCTURED FULL-STACK & DATABASE SYSTEMS',
    subtitle: 'JavaScript, TypeScript, PHP, Laravel, React, Node.js, Python, MySQL & MongoDB',
    noteTitle: '03 — Full-Stack & Data',
    noteSub: 'Web apps, backend systems & data dashboards.',
    Icon: Layers,
    orbitLeft: { label: 'ENTERPRISE WEB', value: 'PRISMA POS (POSO)', sub: 'RBAC, SLA & Incident Workflows' },
    orbitRight: { label: 'ARCHITECTURE', value: 'React · Laravel · MySQL', sub: 'Clean APIs & 3NF Modeling' },
  },
  {
    title: 'RESILIENT',
    kicker: '04 // LOCAL AI AGENTS & INTELLIGENT WORKFLOWS',
    subtitle: 'AI Agents, Local LLMs with Ollama & Data-Driven Applications',
    noteTitle: '04 — AI & Automation',
    noteSub: '“What if I could make this?”',
    Icon: Cpu,
    orbitLeft: { label: 'LOCAL AI R&D', value: 'Ollama Shipment Agent', sub: 'Contextual Resi History Analysis' },
    orbitRight: { label: 'WORKSPACE AI', value: 'Autonomous Tool Calling', sub: 'Python · MongoDB · Local LLMs' },
  },
  {
    title: 'SCALING',
    kicker: '05 // REAL-WORLD INDUSTRY EXPERIENCE (PKL)',
    subtitle: 'Keep learning. Keep building. Keep improving.',
    noteTitle: '05 — Operations Control',
    noteSub: 'PT Pos Indonesia · Pengendalian Operasi.',
    Icon: Code2,
    orbitLeft: { label: 'INTERNSHIP (PKL)', value: 'PT Pos Indonesia', sub: 'Operations Control Division' },
    orbitRight: { label: 'DATA TELEMETRY', value: 'iPOS5 & Control Tower', sub: 'Regional Performance Analytics' },
  },
];

export function HeroScrollExperience({
  isAudioPlaying,
  onToggleAudio,
}: {
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
}) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const lockUntilRef = useRef(0);
  const { reduced } = useMotionSettings();

  const selectWord = (index: number) => {
    lockUntilRef.current = performance.now() + 750;
    setActive(index);
    if (!root.current) return;
    const stickyDistance = root.current.offsetHeight - window.innerHeight;
    if (stickyDistance <= 0) return;
    const targetProgress = index / (WORDS.length - 1);
    const top = root.current.offsetTop + stickyDistance * targetProgress;
    window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
  };

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(
        '.hero-letter',
        { yPercent: 112, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.032,
          duration: 0.78,
          ease: 'premium',
        }
      );
      gsap.fromTo(
        '.hero-script-kicker, .hero-subtitle, .hero-side-note, .hero-orbit-card',
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.04, duration: 0.58, ease: 'premium' }
      );
    }, root);
    return () => context.revert();
  }, [active]);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const updateActiveWord = (progress: number) => {
        if (performance.now() < lockUntilRef.current) return;
        const clamped = Math.max(0, Math.min(1, progress));
        const index = Math.min(WORDS.length - 1, Math.floor(clamped * WORDS.length * 0.999));
        setActive(prev => (prev !== index ? index : prev));
      };

      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: self => updateActiveWord(self.progress),
        onRefresh: self => updateActiveWord(self.progress),
      });
    }, root);
    return () => context.revert();
  }, []);

  const currentStage = WORDS[active];
  const ActiveIcon = currentStage.Icon;

  return (
    <section id="hero" ref={root} className="hero">
      <div className="hero-sticky">
        <div className="hero-ambient" aria-hidden="true" />
        <p className="hero-eyebrow">
          <Sparkles size={13} className="inline-icon" /> <span>MUHAMAD ELDI • aka POPELL</span>
          <span className="hero-eyebrow-extra"> — Full-Stack Developer • Creative Technologist • AI Explorer</span>
        </p>

        {/* Floating Orbital Context Cards showing Eldi's real work per stage */}
        <div className="hero-orbit-layer" aria-hidden="true">
          <div className="hero-orbit-card hero-orbit-left">
            <span className="orbit-card-tag">
              <span className="orbit-dot" /> {currentStage.orbitLeft.label}
            </span>
            <strong>{currentStage.orbitLeft.value}</strong>
            <small>{currentStage.orbitLeft.sub}</small>
          </div>
          <div className="hero-orbit-card hero-orbit-right">
            <span className="orbit-card-tag">
              <span className="orbit-dot" /> {currentStage.orbitRight.label}
            </span>
            <strong>{currentStage.orbitRight.value}</strong>
            <small>{currentStage.orbitRight.sub}</small>
          </div>
        </div>

        <div className="hero-headline-group">
          <span className="hero-script-kicker">{currentStage.kicker}</span>
          <h1
            key={active}
            className={`hero-headline ${currentStage.title.length > 7 ? 'hero-headline-long' : ''}`}
            aria-label={currentStage.title}
          >
            {currentStage.title.split('').map((letter, i) => (
              <span className="hero-letter-mask" key={i} aria-hidden="true">
                <span className="hero-letter">{letter}</span>
              </span>
            ))}
          </h1>
          <p className="hero-subtitle">{currentStage.subtitle}</p>
        </div>

        <div className="hero-scene">
          <Suspense fallback={null}>
            <ThreeCanvas />
          </Suspense>
        </div>

        <div className="hero-side-note">
          <div className="hero-side-note-top">
            <span className="icon-label">
              <ActiveIcon size={13} /> {currentStage.noteTitle}
            </span>
            <span className="hero-step-counter">
              STEP 0{active + 1} / 0{WORDS.length}
            </span>
          </div>
          <span className="hero-side-note-sub">{currentStage.noteSub}</span>
          <div className="hero-step-progress" aria-hidden="true">
            <div className="hero-step-bar" style={{ transform: `scaleX(${(active + 1) / WORDS.length})` }} />
          </div>
        </div>

        <div className="hero-word-nav" role="group" aria-label="Explore disciplines">
          {WORDS.map((word, i) => (
            <button key={word.title} onClick={() => selectWord(i)} aria-label={word.title} aria-pressed={active === i}>
              <span className={active === i ? 'active' : ''} />
              <span className={`word-nav-label ${active === i ? 'is-active' : ''}`}>
                0{i + 1} · {word.title}
              </span>
            </button>
          ))}
        </div>

        <footer className="hero-footer">
          <Magnetic
            className="sound-button"
            onClick={onToggleAudio}
            aria-pressed={isAudioPlaying}
            aria-label={`Ambient sound ${isAudioPlaying ? 'on' : 'off'}`}
          >
            {isAudioPlaying ? <Volume2 size={15} /> : <VolumeX size={15} />} Sound {isAudioPlaying ? 'on' : 'off'}
          </Magnetic>
          <p>
            Crafting digital experiences through code,
            <br />
            creativity, and curiosity.
          </p>
          <a href="#identity" className="scroll-indicator">
            Scroll to explore <span><ArrowDown size={17} /></span>
          </a>
        </footer>
      </div>
    </section>
  );
}
