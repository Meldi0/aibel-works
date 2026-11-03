import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef<boolean>(false);
  const hoveredRef = useRef<boolean>(false);
  const labelRef = useRef<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
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
    let animId = 0;
    let activeUntil = 0;

    const render = (now: number) => {
      animId = 0;
      dotX += (mouseX - dotX) * 0.58;
      dotY += (mouseY - dotY) * 0.58;

      ringX += (mouseX - ringX) * 0.25;
      ringY += (mouseY - ringY) * 0.25;

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      }
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }

      if (now < activeUntil) {
        animId = requestAnimationFrame(render);
      }
    };

    const wake = () => {
      activeUntil = performance.now() + 450;
      if (!animId) {
        animId = requestAnimationFrame(render);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
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

      wake();

      const target = e.target as HTMLElement | null;
      if (!target) return;

      let nextLabel = '';
      let nextHover = false;

      if (target.closest('.portrait-mask')) {
        nextLabel = 'REVEAL';
        nextHover = true;
      } else if (target.closest('.project-visual')) {
        nextLabel = 'VIEW CASE';
        nextHover = true;
      } else {
        nextHover = Boolean(
          target.tagName === 'A' ||
            target.tagName === 'BUTTON' ||
            target.getAttribute('role') === 'button' ||
            target.closest('button') ||
            target.closest('a')
        );
      }

      if (hoveredRef.current !== nextHover) {
        hoveredRef.current = nextHover;
        setIsHovered(nextHover);
      }
      if (labelRef.current !== nextLabel) {
        labelRef.current = nextLabel;
        setCursorLabel(nextLabel);
      }
    };

    const handleMouseLeave = () => {
      visibleRef.current = false;
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', handleMouseMove);
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
        } ${cursorLabel ? 'has-label' : ''}`}
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
