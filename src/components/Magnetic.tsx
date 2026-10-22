import { useRef, type ReactNode, type PointerEvent, type MouseEventHandler } from 'react';
import { gsap, useMotionSettings } from '../lib/motion';
type Props = { children: ReactNode; className?: string; href?: string; target?: string; rel?: string; onClick?: MouseEventHandler<HTMLElement>; type?: 'button' | 'submit' | 'reset'; disabled?: boolean; 'aria-label'?: string; 'aria-pressed'?: boolean };
export function Magnetic({ children, className = '', href, ...props }: Props) {
  const ref = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
  const { desktop, reduced } = useMotionSettings();
  const move = (event: PointerEvent<HTMLElement>) => {
    if (!desktop || reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = event.clientX - rect.left, y = event.clientY - rect.top;
    ref.current.style.setProperty('--pointer-x', `${x}px`); ref.current.style.setProperty('--pointer-y', `${y}px`);
    gsap.to(ref.current, { x: (x - rect.width / 2) * .08, y: (y - rect.height / 2) * .12, duration: .7, ease: 'premium', overwrite: true });
  };
  const leave = () => { if (ref.current) gsap.to(ref.current, { x: 0, y: 0, duration: .9, ease: 'premium', overwrite: true }); };
  const shared = { ref, className: `magnetic ${className}`, onPointerMove: move, onPointerLeave: leave };
  const contents = <><span className="hover-fill" aria-hidden="true" /><span className="button-content">{children}</span></>;
  return href ? <a {...props} {...shared} href={href}>{contents}</a> : <button type="button" {...props} {...shared}>{contents}</button>;
}
