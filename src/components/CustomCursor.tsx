import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isClicking, setIsClicking] = useState<boolean>(false);

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

      ringX += (mouseX - ringX) * 0.24;
      ringY += (mouseY - ringY) * 0.24;

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
        id="custom-spatial-cursor-ring"
        className={`custom-cursor-layer fixed top-0 left-0 pointer-events-none z-99 mix-blend-difference transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ willChange: 'transform' }}
      >
        <div
          className={`rounded-full border border-[#f5f4f0] transition-all duration-300 ease-out ${
            isHovered
              ? 'w-11 h-11 bg-[#f5f4f0]/15 border-[#f5f4f0] scale-110'
              : isClicking
              ? 'w-6 h-6 border-[#f5f4f0] bg-[#f5f4f0]/25 scale-90'
              : 'w-7 h-7 opacity-60'
          }`}
        />
      </div>

      <div
        ref={cursorDotRef}
        id="custom-spatial-cursor-dot"
        className={`custom-cursor-layer fixed top-0 left-0 pointer-events-none z-100 mix-blend-difference transition-opacity duration-200 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ willChange: 'transform' }}
      >
        <div
          className={`rounded-full bg-[#f5f4f0] transition-all duration-200 ${
            isClicking ? 'w-2.5 h-2.5 scale-125' : isHovered ? 'w-1.5 h-1.5' : 'w-2 h-2'
          }`}
        />
      </div>
    </>
  );
};
