import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';

/* ==========================================================================
   1. SPLIT-WORD KINETIC HEADLINE (Apple Keynote staggered rise + blur clear)
   ========================================================================== */

interface SplitHeadlineProps {
  text: string;
  accentText?: string;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  accentClassName?: string;
  breakBeforeAccent?: boolean;
  delay?: number;
  replayOnScroll?: boolean;
}

export function SplitHeadline({
  text,
  accentText,
  as = 'h2',
  className = '',
  accentClassName = 'font-serif-italic accent-vermilion',
  breakBeforeAccent = false,
  delay = 0,
  replayOnScroll = false,
}: SplitHeadlineProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: !replayOnScroll, amount: 0.01 });

  const mainWords = text.trim().split(/\s+/).filter(Boolean);
  const accentWords = accentText ? accentText.trim().split(/\s+/).filter(Boolean) : [];

  const Tag = as;

  const renderWord = (word: string, idx: number, extraClass = '') => (
    <span key={`${word}-${idx}`} className="split-word-mask">
      <motion.span
        className={`split-word-inner ${extraClass}`}
        initial={reduced ? false : { y: '115%', opacity: 0, filter: 'blur(8px)', rotateX: 20 }}
        animate={
          inView || reduced
            ? { y: '0%', opacity: 1, filter: 'blur(0px)', rotateX: 0 }
            : { y: '115%', opacity: 0, filter: 'blur(8px)', rotateX: 20 }
        }
        transition={{
          duration: 0.72,
          delay: reduced ? 0 : delay + idx * 0.055,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {word}
      </motion.span>
    </span>
  );

  return (
    <Tag ref={ref} className={`split-headline ${className}`}>
      {mainWords.map((w, i) => renderWord(w, i))}
      {breakBeforeAccent && accentWords.length > 0 && <br />}
      {accentWords.map((w, i) => renderWord(w, mainWords.length + i, accentClassName))}
    </Tag>
  );
}

/* ==========================================================================
   2. APPLE SCROLL-SCRUBBED WORD ILLUMINATION PARAGRAPH
   Words smoothly illuminate from soft faded glass to sharp obsidian as you scroll!
   ========================================================================== */

function ScrubWord({
  word,
  progress,
  range,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.22, 1]);
  const y = useTransform(progress, range, [4, 0]);
  return (
    <motion.span className="scrub-word" style={{ opacity, y }}>
      {word}{' '}
    </motion.span>
  );
}

export function AppleScrollRevealText({
  text,
  className = '',
}: {
  text: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 92%', 'end 58%'],
  });

  const words = text.trim().split(/\s+/);

  if (reduced) {
    return <p className={className}>{text}</p>;
  }

  return (
    <p ref={ref} className={`apple-scrub-text ${className}`}>
      {words.map((word, idx) => {
        const start = (idx / words.length) * 0.78;
        const end = Math.min(1, start + 0.24);
        return <ScrubWord key={`${word}-${idx}`} word={word} progress={scrollYProgress} range={[start, end]} />;
      })}
    </p>
  );
}

/* ==========================================================================
   3. INTERACTIVE LIQUID GLASS SURFACE (Mouse-tracking specular sheen)
   ========================================================================== */

interface LiquidGlassSurfaceProps {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}

export function LiquidGlassSurface({
  children,
  className = '',
  dark = false,
}: LiquidGlassSurfaceProps) {
  const boxRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = boxRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--gx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty('--gy', `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };

  return (
    <div
      ref={boxRef}
      className={`liquid-glass-surface ${dark ? 'is-dark-glass' : ''} ${className}`}
      onPointerMove={handleMove}
    >
      <span className="liquid-glass-sheen" aria-hidden="true" />
      {children}
    </div>
  );
}

/* ==========================================================================
   4. KINETIC NUMBER COUNTER (Counts smoothly on entry)
   ========================================================================== */

export function KineticCounter({
  target,
  suffix = '',
  decimals = 0,
  trigger,
}: {
  target: number;
  suffix?: string;
  decimals?: number;
  trigger?: boolean;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const shouldRun = trigger !== undefined ? trigger : inView;
  const [val, setVal] = useState(reduced ? target : 0);

  useEffect(() => {
    if (!shouldRun) return;
    if (reduced) {
      setVal(target);
      return;
    }
    const duration = 1050;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 4);
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setVal(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [shouldRun, target, reduced]);

  return (
    <span ref={ref} style={{ display: 'inline-block' }}>
      {decimals > 0 ? val.toFixed(decimals) : Math.round(val)}
      {suffix}
    </span>
  );
}

/* ==========================================================================
   5. SUBTLE LIQUID-GLASS CURSOR LENS (Desktop Pointer Follower)
   ========================================================================== */

export function GlassCursorHalo() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [cursorLabel, setCursorLabel] = useState('');

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const sx = useSpring(mx, { stiffness: 320, damping: 28, mass: 0.35 });
  const sy = useSpring(my, { stiffness: 320, damping: 28, mass: 0.35 });

  useEffect(() => {
    if (reduced) return;
    const isFine = window.matchMedia('(pointer: fine)').matches;
    if (!isFine) return;

    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      setVisible(true);

      const target = e.target as HTMLElement | null;
      const interactive = target?.closest('a, button, [role="button"], .wheel-arc-card, .hero-portrait-stage');
      if (interactive) {
        setExpanded(true);
        const label = interactive.getAttribute('data-cursor') || '';
        setCursorLabel(label);
      } else {
        setExpanded(false);
        setCursorLabel('');
      }
    };
    const onLeave = () => setVisible(false);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [reduced, mx, my]);

  if (reduced) return null;

  return (
    <motion.div
      className={`glass-cursor-halo ${visible ? 'is-visible' : ''} ${expanded ? 'is-expanded' : ''} ${cursorLabel ? 'has-label' : ''}`}
      style={{ x: sx, y: sy }}
      aria-hidden="true"
    >
      {cursorLabel && <span>{cursorLabel}</span>}
    </motion.div>
  );
}
