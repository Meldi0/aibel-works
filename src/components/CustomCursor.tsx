import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isClicking, setIsClicking] = useState<boolean>(false);
  const [cursorLabel, setCursorLabel] = useState<string>('');

  useEffect(() => {
    const isTouchOrSmall =
      window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 900;
    if (isTouchOrSmall) return;

    document.body.classList.add('has-custom-cursor');

    let mouseX = -100;
    let mouseY = -100;
    let dotX = -100;
    let dotY = -100;
    let ringX = -100;
    let ringY = -100;
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 900) {
        if (visibleRef.current) {
          visibleRef.current = false;
          setIsVisible(false);
        }
        return;
      }

      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!visibleRef.current) {
        dotX = mouseX;
        dotY = mouseY;
        ringX = mouseX;
        ringY = mouseY;
        visibleRef.current = true;
        setIsVisible(true);
      }

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cardEl = target.closest<HTMLElement>('.what-i-do-card, .experience-card');
      if (cardEl) {
        const rect = cardEl.getBoundingClientRect();
        cardEl.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
        cardEl.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
      }

      if (target.closest('.portrait-mask')) {
        setCursorLabel('REVEAL');
        setIsHovered(true);
        return;
      }
      if (target.closest('.project-visual')) {
        setCursorLabel('VIEW CASE');
        setIsHovered(true);
        return;
      }
      if (target.closest('.playground-particle-canvas')) {
        setCursorLabel('PULSE');
        setIsHovered(true);
        return;
      }

      setCursorLabel('');
      const isInteractive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.getAttribute('role') === 'button' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[data-cursor]');

      setIsHovered(!!isInteractive);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => {
      visibleRef.current = false;
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      animId = requestAnimationFrame(render);

      dotX += (mouseX - dotX) * 0.55;
      dotY += (mouseY - dotY) * 0.55;

      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      }
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
    };

    render();

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRingRef}
        className={`custom-cursor-layer spatial-cursor-ring ${isVisible ? 'is-visible' : ''} ${
          isHovered ? 'is-hovered' : ''
        } ${isClicking ? 'is-clicking' : ''} ${cursorLabel ? 'has-label' : ''}`}
      >
        {cursorLabel && <span className="spatial-cursor-text">{cursorLabel}</span>}
      </div>
      <div
        ref={cursorDotRef}
        className={`custom-cursor-layer spatial-cursor-dot ${isVisible ? 'is-visible' : ''} ${
          isHovered ? 'is-hovered' : ''
        }`}
      />
    </>
  );
};
