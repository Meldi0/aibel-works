import { useRef, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { EASE } from '../lib/motion';
export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true, amount: .15 });
  return <span ref={ref} className={`reveal-mask ${className}`}><motion.span className="reveal-content" initial={reduced ? false : { y: '108%', opacity: 0 }} animate={visible || reduced ? { y: 0, opacity: 1 } : undefined} transition={{ duration: .95, ease: EASE, delay: reduced ? 0 : delay }}>{children}</motion.span></span>;
}
export function SectionLabel({ number, children, detail }: { number: string; children: ReactNode; detail?: string }) {
  return <div className="section-label"><Reveal><span className="section-number">{number}</span>{children}</Reveal>{detail && <Reveal className="section-detail">{detail}</Reveal>}</div>;
}
