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
  const visible = useInView(ref, { once: false, amount: 0.16, margin: '0px 0px -6% 0px' });

  // If children is a plain string with multiple words, animate word-by-word with a creative 3D stagger
  if (typeof children === 'string' && !reduced && children.includes(' ')) {
    const words = children.split(' ');
    return (
      <span ref={ref} className={`reveal-word-group ${className}`}>
        {words.map((word, idx) => (
          <span key={idx} className="reveal-word-mask">
            <motion.span
              className="reveal-word-inner"
              initial={{ y: '118%', rotateZ: 3.5, opacity: 0, filter: 'blur(6px)' }}
              animate={
                visible
                  ? { y: '0%', rotateZ: 0, opacity: 1, filter: 'blur(0px)' }
                  : { y: '118%', rotateZ: 3.5, opacity: 0, filter: 'blur(6px)' }
              }
              transition={{
                duration: 0.78,
                ease: EASE,
                delay: delay + Math.min(idx * 0.028, 0.42),
              }}
            >
              {word}
            </motion.span>
            {idx < words.length - 1 ? '\u00A0' : ''}
          </span>
        ))}
      </span>
    );
  }

  return (
    <span ref={ref} className={`reveal-mask ${className}`}>
      <motion.span
        className="reveal-content"
        initial={reduced ? false : { y: '115%', rotateZ: 2.5, opacity: 0, filter: 'blur(7px)' }}
        animate={
          visible || reduced
            ? { y: '0%', rotateZ: 0, opacity: 1, filter: 'blur(0px)' }
            : { y: '115%', rotateZ: 2.5, opacity: 0, filter: 'blur(7px)' }
        }
        transition={{ duration: 0.88, ease: EASE, delay: reduced ? 0 : delay }}
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
  const visible = useInView(ref, { once: false, amount: 0.2 });

  return (
    <div ref={ref} className={`section-label ${visible ? 'is-inview' : ''}`}>
      <Reveal>
        <span className="section-number">
          <span className="section-number-dot" aria-hidden="true" />
          {number}
        </span>
        {children}
      </Reveal>
      {detail && <Reveal className="section-detail" delay={0.08}>{detail}</Reveal>}
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
  const visible = useInView(ref, { once: false, amount: 0.12, margin: '0px 0px -4% 0px' });

  return (
    <motion.article
      ref={ref}
      onClick={onClick}
      className={className}
      initial={reduced ? false : { opacity: 0, y: 34, scale: 0.965, filter: 'blur(5px)' }}
      animate={
        visible || reduced
          ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
          : { opacity: 0, y: 34, scale: 0.965, filter: 'blur(5px)' }
      }
      transition={{
        duration: 0.78,
        ease: EASE,
        delay: reduced ? 0 : (index % 3) * 0.08,
      }}
    >
      {children}
    </motion.article>
  );
}
