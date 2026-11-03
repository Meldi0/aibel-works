import { useRef, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { EASE } from '../lib/motion';

export function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true, amount: 0.15 });

  return (
    <span ref={ref} className={`reveal-mask ${className}`}>
      <motion.span
        className="reveal-content"
        initial={reduced ? false : { y: '108%', opacity: 0 }}
        animate={visible || reduced ? { y: 0, opacity: 1 } : undefined}
        transition={{ duration: 0.85, ease: EASE, delay: reduced ? 0 : delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function SectionLabel({
  number,
  children,
  detail,
}: {
  number: string;
  children: ReactNode;
  detail?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div ref={ref} className={`section-label ${visible ? 'is-inview' : ''}`}>
      <Reveal>
        <span className="section-number">
          <span className="section-number-dot" aria-hidden="true" />
          {number}
        </span>
        {children}
      </Reveal>
      {detail && (
        <Reveal className="section-detail" delay={0.06}>
          {detail}
        </Reveal>
      )}
      <span className="section-label-beam" aria-hidden="true" />
    </div>
  );
}

export function StaggerCard({
  children,
  className = '',
  index = 0,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  index?: number;
  onClick?: () => void;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { once: true, amount: 0.12 });

  return (
    <motion.article
      ref={ref}
      onClick={onClick}
      className={className}
      initial={reduced ? false : { opacity: 0, y: 26 }}
      animate={visible || reduced ? { opacity: 1, y: 0 } : undefined}
      transition={{
        duration: 0.72,
        ease: EASE,
        delay: reduced ? 0 : (index % 3) * 0.06,
      }}
    >
      {children}
    </motion.article>
  );
}
