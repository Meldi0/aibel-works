import { useRef, type ReactNode, type PointerEvent, type MouseEventHandler } from 'react';
import { useMotionSettings } from '../lib/useMotionSettings';

type Props = {
  children: ReactNode;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  'aria-label'?: string;
  'aria-pressed'?: boolean;
};

export function Magnetic({ children, className = '', href, ...props }: Props) {
  const ref = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
  const { desktop, reduced } = useMotionSettings();

  const move = (event: PointerEvent<HTMLElement>) => {
    if (!desktop || reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    ref.current.style.setProperty('--pointer-x', `${x}px`);
    ref.current.style.setProperty('--pointer-y', `${y}px`);
    ref.current.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
    ref.current.style.transform = `translate3d(${((x - rect.width / 2) * 0.08).toFixed(2)}px, ${((y - rect.height / 2) * 0.12).toFixed(2)}px, 0)`;
  };

  const leave = () => {
    if (!ref.current) return;
    ref.current.style.transition = 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
    ref.current.style.transform = 'translate3d(0, 0, 0)';
  };

  const shared = { ref, className: `magnetic ${className}`, onPointerMove: move, onPointerLeave: leave };
  const contents = (
    <>
      <span className="hover-fill" aria-hidden="true" />
      <span className="button-content">{children}</span>
    </>
  );
  return href ? (
    <a {...props} {...shared} href={href}>
      {contents}
    </a>
  ) : (
    <button type="button" {...props} {...shared}>
      {contents}
    </button>
  );
}
