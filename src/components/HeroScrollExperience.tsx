import { lazy, Suspense, useLayoutEffect, useRef, useState } from 'react';
import { ArrowDown, Code2, Cpu, Layers, Sparkles, Terminal, Volume2, VolumeX } from 'lucide-react';
import { gsap, ScrollTrigger, useMotionSettings } from '../lib/motion';
import { Magnetic } from './Magnetic';
const ThreeCanvas = lazy(() => import('./ThreeCanvas').then(module => ({ default: module.ThreeCanvas })));
const WORDS = [
  { title: 'INSIGHT', subtitle: 'Full-Stack Developer • Creative Technologist • AI Explorer', noteTitle: '01 — Hey, I’m Eldi!', noteSub: 'Turning ideas into real digital experiences.', Icon: Terminal },
  { title: 'INSPIRE', subtitle: 'Crafting digital experiences through code, creativity, and curiosity', noteTitle: '02 — Creative Web', noteSub: 'Not just work, but feel good to use.', Icon: Sparkles },
  { title: 'ARCHITECT', subtitle: 'JavaScript, TypeScript, PHP, Laravel, React, Node.js, Python, MySQL & MongoDB', noteTitle: '03 — Full-Stack & Data', noteSub: 'Web apps, backend systems & data dashboards.', Icon: Layers },
  { title: 'RESILIENT', subtitle: 'AI Agents, Local LLMs with Ollama & Data-Driven Applications', noteTitle: '04 — AI & Automation', noteSub: '“What if I could make this?”', Icon: Cpu },
  { title: 'SCALING', subtitle: 'Keep learning. Keep building. Keep improving.', noteTitle: '05 — Currently Into', noteSub: 'Full-Stack, AI Agents, UI/UX & Creative Coding.', Icon: Code2 },
];
export function HeroScrollExperience({ isAudioPlaying, onToggleAudio }: { isAudioPlaying: boolean; onToggleAudio: () => void }) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { reduced, desktop } = useMotionSettings();

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
        { yPercent: 115, opacity: 0, filter: desktop && !reduced ? 'blur(7px)' : 'none' },
        { yPercent: 0, opacity: 1, filter: 'blur(0px)', stagger: .035, duration: .95, ease: 'premium', clearProps: 'filter' }
      );
      gsap.fromTo(
        '.hero-subtitle, .hero-side-note',
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: .65, ease: 'premium' }
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

  const ActiveIcon = WORDS[active].Icon;
  return <section id="hero" ref={root} className="hero">
    <div className="hero-sticky">
      <div className="hero-ambient" aria-hidden="true" />
      <p className="hero-eyebrow"><Sparkles size={13} className="inline-icon" /> <span>MUHAMAD ELDI • aka AIBEL</span><span className="hero-eyebrow-extra"> — Full-Stack Developer • AI Explorer</span></p>
      <div className="hero-headline-group">
        <h1 key={active} className={`hero-headline ${WORDS[active].title.length > 7 ? 'hero-headline-long' : ''}`} aria-label={WORDS[active].title}>
          {WORDS[active].title.split('').map((letter, i) => <span className="hero-letter-mask" key={i} aria-hidden="true"><span className="hero-letter">{letter}</span></span>)}
        </h1>
        <p className="hero-subtitle">{WORDS[active].subtitle}</p>
      </div>
      <div className="hero-scene"><Suspense fallback={null}><ThreeCanvas /></Suspense></div>
      <div className="hero-side-note">
        <div className="hero-side-note-top">
          <span className="icon-label"><ActiveIcon size={13} /> {WORDS[active].noteTitle}</span>
          <span className="hero-step-counter">STEP 0{active + 1} / 0{WORDS.length}</span>
        </div>
        <span className="hero-side-note-sub">{WORDS[active].noteSub}</span>
        <div className="hero-step-progress" aria-hidden="true">
          <div className="hero-step-bar" style={{ transform: `scaleX(${(active + 1) / WORDS.length})` }} />
        </div>
      </div>
      <div className="hero-word-nav" role="group" aria-label="Explore disciplines">{WORDS.map((word, i) => <button key={word.title} onClick={() => selectWord(i)} aria-label={word.title} aria-pressed={active === i}><span className={active === i ? 'active' : ''} /><span className={`word-nav-label ${active === i ? 'is-active' : ''}`}>0{i + 1} · {word.title}</span></button>)}</div>
      <footer className="hero-footer">
        <Magnetic className="sound-button" onClick={onToggleAudio} aria-pressed={isAudioPlaying} aria-label={`Ambient sound ${isAudioPlaying ? 'on' : 'off'}`}>{isAudioPlaying ? <Volume2 size={15} /> : <VolumeX size={15} />} Sound {isAudioPlaying ? 'on' : 'off'}</Magnetic>
        <p>Crafting digital experiences through code,<br />creativity, and curiosity.</p>
        <a href="#identity" className="scroll-indicator">Scroll to explore <span><ArrowDown size={17} /></span></a>
      </footer>
    </div>
  </section>;
}
