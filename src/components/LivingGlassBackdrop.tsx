import { useEffect, useRef } from 'react';

/**
 * Luminous Titanium & Ice-Sapphire Silk Wave Canvas
 * Renders 60fps sculptural metallic light ribbons across Deep Space Titanium (#090B10),
 * bending smoothly toward cursor movement and scroll position — Apple iPhone Pro aesthetic.
 */
export function LivingGlassBackdrop({ variant = 'hero' }: { variant?: 'hero' | 'finale' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = canvas.parentElement?.clientWidth || window.innerWidth;
    let height = canvas.parentElement?.clientHeight || window.innerHeight;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let mouseX = width * 0.5;
    let mouseY = height * 0.45;
    let smoothX = mouseX;
    let smoothY = mouseY;
    let scrollY = window.scrollY;
    let smoothScroll = scrollY;
    let rafId = 0;
    let time = 0;
    let isVisible = true;

    const onPointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    const onScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    const ribbons = [
      {
        yBase: 0.24,
        amp: 62,
        freq: 0.0021,
        speed: 0.42,
        phase: 0.2,
        stroke: 'rgba(148, 192, 255, 0.26)',
        width: 1.25,
        fillTop: 'rgba(79, 139, 255, 0.12)',
      },
      {
        yBase: 0.36,
        amp: 78,
        freq: 0.0017,
        speed: 0.34,
        phase: 1.6,
        stroke: 'rgba(255, 255, 255, 0.16)',
        width: 1.0,
        fillTop: 'rgba(200, 214, 240, 0.065)',
      },
      {
        yBase: 0.5,
        amp: 68,
        freq: 0.0023,
        speed: 0.46,
        phase: 2.8,
        stroke: 'rgba(116, 178, 255, 0.34)',
        width: 1.35,
        fillTop: 'rgba(56, 132, 255, 0.09)',
      },
      {
        yBase: 0.62,
        amp: 82,
        freq: 0.0016,
        speed: 0.3,
        phase: 4.1,
        stroke: 'rgba(255, 255, 255, 0.13)',
        width: 1.0,
        fillTop: 'rgba(140, 165, 215, 0.055)',
      },
      {
        yBase: 0.76,
        amp: 58,
        freq: 0.002,
        speed: 0.38,
        phase: 5.3,
        stroke: 'rgba(130, 176, 255, 0.2)',
        width: 1.1,
        fillTop: null,
      },
    ];

    const renderFrame = () => {
      if (!isVisible) return;
      if (!prefersReduced) {
        rafId = requestAnimationFrame(renderFrame);
      }
      time += 0.011;
      smoothX += (mouseX - smoothX) * 0.065;
      smoothY += (mouseY - smoothY) * 0.065;
      smoothScroll += (scrollY - smoothScroll) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // Brushed Titanium + Glacial Sapphire studio light pool following cursor gently
      const poolX = smoothX * 0.45 + width * 0.275;
      const poolY = variant === 'hero' ? height * 0.44 : height * 0.28;
      const aura = ctx.createRadialGradient(poolX, poolY, 24, width * 0.5, poolY, Math.max(width, height) * 0.72);
      aura.addColorStop(0, 'rgba(79, 139, 255, 0.18)');
      aura.addColorStop(0.38, 'rgba(148, 178, 232, 0.075)');
      aura.addColorStop(0.74, 'rgba(17, 22, 34, 0.04)');
      aura.addColorStop(1, 'rgba(9, 11, 16, 0)');
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, width, height);

      // Secondary subtle warm silver edge light top-right
      const rim = ctx.createRadialGradient(width * 0.84, height * 0.12, 10, width * 0.84, height * 0.12, width * 0.45);
      rim.addColorStop(0, 'rgba(218, 228, 255, 0.1)');
      rim.addColorStop(1, 'rgba(9, 11, 16, 0)');
      ctx.fillStyle = rim;
      ctx.fillRect(0, 0, width, height);

      const scrollShift = smoothScroll * 0.0009;
      const mxRatio = smoothX / Math.max(1, width);
      const myRatio = smoothY / Math.max(1, height);

      for (const r of ribbons) {
        const baseY = height * r.yBase + Math.sin(scrollShift + r.phase) * 34;
        const step = Math.max(24, Math.floor(width / 48));

        ctx.beginPath();
        for (let x = -40; x <= width + 60; x += step) {
          const nx = x / Math.max(1, width);
          const distToMouse = Math.abs(nx - mxRatio);
          const cursorInfluence = Math.max(0, 1 - distToMouse * 2.3);
          const cursorPull = (myRatio - r.yBase) * 90 * cursorInfluence * cursorInfluence;

          const wave1 = Math.sin(x * r.freq + time * r.speed + r.phase + scrollShift * 1.4) * r.amp;
          const wave2 = Math.cos(x * r.freq * 0.55 - time * r.speed * 0.72 + r.phase) * (r.amp * 0.44);
          const y = baseY + wave1 + wave2 + cursorPull;

          if (x === -40) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.strokeStyle = r.stroke;
        ctx.lineWidth = r.width;
        ctx.stroke();

        if (r.fillTop) {
          ctx.lineTo(width + 60, height + 40);
          ctx.lineTo(-40, height + 40);
          ctx.closePath();
          const grad = ctx.createLinearGradient(0, baseY - r.amp, 0, baseY + 210);
          grad.addColorStop(0, r.fillTop);
          grad.addColorStop(1, 'rgba(9, 11, 16, 0)');
          ctx.fillStyle = grad;
          ctx.fill();
        }
      }
    };

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries[0]?.isIntersecting ?? true;
        if (visible && !isVisible) {
          isVisible = true;
          rafId = requestAnimationFrame(renderFrame);
        } else if (!visible && isVisible) {
          isVisible = false;
          cancelAnimationFrame(rafId);
        }
      },
      { threshold: 0.01 },
    );
    observer.observe(canvas);

    renderFrame();

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, [variant]);

  return (
    <div className="titanium-silk-layer" aria-hidden="true">
      <canvas ref={canvasRef} className="silk-wave-canvas" />
      <div className="titanium-grain-layer" />
    </div>
  );
}
