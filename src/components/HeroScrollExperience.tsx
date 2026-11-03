import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowDown, Code2, Cpu, Layers, Sparkles, Terminal, Volume2, VolumeX } from 'lucide-react';
import { gsap, ScrollTrigger, useMotionSettings } from '../lib/motion';
import { Magnetic } from './Magnetic';

const ThreeCanvas = lazy(() => import('./ThreeCanvas').then(module => ({ default: module.ThreeCanvas })));

const WORDS = [
  {
    title: 'INSIGHT',
    kicker: 'Hey, I’m Muhamad Eldi — aka POPELL',
    subtitle: 'Full-Stack Developer • Creative Technologist • AI Explorer',
    noteTitle: '01 — Hey, I’m Eldi!',
    noteSub: 'Turning ideas into real digital experiences.',
    Icon: Terminal,
    orbitLeft: { label: 'IDENTITY', value: 'Muhamad Eldi (POPELL)', sub: 'SMK Software Engineering (RPL)' },
    orbitRight: { label: 'BASE', value: 'Bandung, Indonesia', sub: '6°54\'53"S · Creative Studio' },
  },
  {
    title: 'INSPIRE',
    kicker: 'Where Engineering Meets Visual Art',
    subtitle: 'Crafting digital experiences through code, creativity, and curiosity',
    noteTitle: '02 — Creative Web',
    noteSub: 'Not just work, but feel good to use.',
    Icon: Sparkles,
    orbitLeft: { label: 'CREATIVE STUDIO', value: 'Snapdays Photobooth', sub: '4-Cut Composer & WebRTC' },
    orbitRight: { label: 'EXPERIMENTS', value: 'GlyphLab & 3D Worlds', sub: 'Kinetic Type & Midnight District' },
  },
  {
    title: 'ARCHITECT',
    kicker: 'Structured Full-Stack & Database Systems',
    subtitle: 'JavaScript, TypeScript, PHP, Laravel, React, Node.js, Python, MySQL & MongoDB',
    noteTitle: '03 — Full-Stack & Data',
    noteSub: 'Web apps, backend systems & data dashboards.',
    Icon: Layers,
    orbitLeft: { label: 'ENTERPRISE WEB', value: 'PRISMA POS (POSO)', sub: 'RBAC, SLA & Incident Workflows' },
    orbitRight: { label: 'ARCHITECTURE', value: 'React · Laravel · MySQL', sub: 'Clean APIs & 3NF Modeling' },
  },
  {
    title: 'RESILIENT',
    kicker: 'Local AI Agents & Intelligent Workflows',
    subtitle: 'AI Agents, Local LLMs with Ollama & Data-Driven Applications',
    noteTitle: '04 — AI & Automation',
    noteSub: '“What if I could make this?”',
    Icon: Cpu,
    orbitLeft: { label: 'LOCAL AI R&D', value: 'Ollama Shipment Agent', sub: 'Contextual Resi History Analysis' },
    orbitRight: { label: 'WORKSPACE AI', value: 'Autonomous Tool Calling', sub: 'Python · MongoDB · Local LLMs' },
  },
  {
    title: 'SCALING',
    kicker: 'Real-World Industry Experience (PKL)',
    subtitle: 'Keep learning. Keep building. Keep improving.',
    noteTitle: '05 — Operations Control',
    noteSub: 'PT Pos Indonesia · Pengendalian Operasi.',
    Icon: Code2,
    orbitLeft: { label: 'INTERNSHIP (PKL)', value: 'PT Pos Indonesia', sub: 'Operations Control Division' },
    orbitRight: { label: 'DATA TELEMETRY', value: 'iPOS5 & Control Tower', sub: 'Regional Performance Analytics' },
  },
];

const CIPHER_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/';

export function HeroScrollExperience({
  isAudioPlaying,
  onToggleAudio,
}: {
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
}) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [scrambledKicker, setScrambledKicker] = useState(WORDS[0].kicker);
  const { reduced, desktop } = useMotionSettings();

  // Subtle creative cipher decode effect on the stage kicker whenever active stage changes
  useEffect(() => {
    const targetText = WORDS[active].kicker;
    if (reduced) {
      setScrambledKicker(targetText);
      return;
    }
    let iteration = 0;
    const interval = setInterval(() => {
      setScrambledKicker(
        targetText
          .split('')
          .map((char, idx) => {
            if (char === ' ' || char === '—' || char === '•') return char;
            if (idx < iteration) return targetText[idx];
            return CIPHER_CHARS[(idx + Math.floor(iteration * 3)) % CIPHER_CHARS.length];
          })
          .join('')
      );
      iteration += 1.4;
      if (iteration >= targetText.length) {
        setScrambledKicker(targetText);
        clearInterval(interval);
      }
    }, 24);
    return () => clearInterval(interval);
  }, [active, reduced]);

  const selectWord = (index: number) => {
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
        {
          yPercent: 120,
          rotateX: desktop && !reduced ? -72 : 0,
          scale: 0.86,
          opacity: 0,
          filter: desktop && !reduced ? 'blur(9px)' : 'none',
        },
        {
          yPercent: 0,
          rotateX: 0,
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          stagger: 0.042,
          duration: 1.02,
          ease: 'premium',
          clearProps: 'filter',
        }
      );
      gsap.fromTo(
        '.hero-sub-word',
        { y: 14, opacity: 0, filter: desktop && !reduced ? 'blur(4px)' : 'none' },
        { y: 0, opacity: 1, filter: 'blur(0px)', stagger: 0.028, duration: 0.68, ease: 'premium', clearProps: 'filter' }
      );
      gsap.fromTo(
        '.hero-side-note, .hero-orbit-card',
        { y: 16, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, stagger: 0.08, duration: 0.72, ease: 'premium' }
      );
    }, root);
    return () => context.revert();
  }, [active, reduced, desktop]);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const updateActiveWord = (progress: number) => {
        const clamped = Math.max(0, Math.min(1, progress));
        const index = Math.min(WORDS.length - 1, Math.round(clamped * (WORDS.length - 1)));
        setActive(prev => (prev !== index ? index : prev));
      };

      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom bottom',
        snap: desktop
          ? {
              snapTo: 1 / (WORDS.length - 1),
              duration: { min: 0.2, max: 0.45 },
              delay: 0.05,
              ease: 'power2.out',
            }
          : undefined,
        onUpdate: self => updateActiveWord(self.progress),
        onRefresh: self => updateActiveWord(self.progress),
      });
    }, root);
    return () => context.revert();
  }, [reduced, desktop]);

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

        {/* Floating Orbital Context Cards (Desktop & Tablet) showing Eldi's real work per stage */}
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
          <span className="hero-script-kicker">{scrambledKicker}</span>
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
          <p key={`sub-${active}`} className="hero-subtitle">
            {currentStage.subtitle.split(' ').map((word, idx, arr) => (
              <span key={idx} className="hero-sub-word">
                {word}
                {idx < arr.length - 1 ? '\u00A0' : ''}
              </span>
            ))}
          </p>
        </div>

        <div className="hero-scene">
          <Suspense fallback={null}>
            <ThreeCanvas activeStage={active} />
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
