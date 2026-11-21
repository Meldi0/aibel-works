import { useEffect, useRef } from 'react';

interface HeroLightFieldProps {
  scrollProgressRef: React.MutableRefObject<number>;
}

/**
 * Ultra-Lightweight Apple Keynote Optical Titanium Horizon (Pure 2D Canvas, 0 WebGL, 0 ctx.filter blur!)
 * - Uses native GPU-friendly soft radial/linear gradients & multi-pass strokes instead of expensive ctx.filter blurs.
 * - Draws frame 1 immediately, throttles gently on mobile viewports, and auto-pauses when offscreen via IntersectionObserver.
 */
export function HeroLightField({ scrollProgressRef }: HeroLightFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = canvas.parentElement?.clientWidth || window.innerWidth;
    let height = canvas.parentElement?.clientHeight || window.innerHeight;
    let isCompact = width < 980;
    let dpr = Math.min(window.devicePixelRatio || 1, isCompact ? 1.25 : 1.75);

    const resize = () => {
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      isCompact = width < 980;
      dpr = Math.min(window.devicePixelRatio || 1, isCompact ? 1.25 : 1.75);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const moteCount = isCompact ? 28 : 44;
    const motes = Array.from({ length: moteCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.65 + Math.random() * 1.25,
      vy: 0.00012 + Math.random() * 0.00024,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.16 + Math.random() * 0.38,
    }));

    let targetMX = 0;
    let targetMY = 0;
    let smoothMX = 0;
    let smoothMY = 0;
    let time = 0;
    let rafId = 0;
    let startTimer = 0;
    let lastTick = 0;
    let isVisible = true;

    const onPointerMove = (e: PointerEvent) => {
      targetMX = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      targetMY = (e.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
    };

    const renderFrame = () => {
      const sp = scrollProgressRef.current;
      smoothMX += (targetMX - smoothMX) * 0.06;
      smoothMY += (targetMY - smoothMY) * 0.06;

      ctx.clearRect(0, 0, width, height);

      // 1. Deep Ambient Top-Center Optical Spotlight (native radial gradient — 0ms blur cost)
      const cx = width * (0.5 + smoothMX * 0.065);
      const crestY = height * (0.18 - sp * 0.09 + smoothMY * 0.025);
      const haloR = Math.max(width, height) * (0.66 + sp * 0.22);

      const topGlow = ctx.createRadialGradient(cx, crestY, 12, cx, crestY + height * 0.14, haloR);
      topGlow.addColorStop(0, 'rgba(146, 198, 255, 0.24)');
      topGlow.addColorStop(0.24, 'rgba(59, 130, 246, 0.13)');
      topGlow.addColorStop(0.55, 'rgba(20, 36, 78, 0.075)');
      topGlow.addColorStop(1, 'rgba(6, 8, 14, 0)');
      ctx.fillStyle = topGlow;
      ctx.fillRect(0, 0, width, height);

      // 2. Silky Feathered Volumetric Aurora Ellipses (Zero ctx.filter — pure radial falloff!)
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 3; i++) {
        const offsetNorm = i - 1;
        const sway = Math.sin(time * 0.42 + i * 1.7) * width * 0.045;
        const bx = cx + offsetNorm * width * 0.2 + sway - smoothMX * width * 0.04;
        const by = height * (0.44 + i * 0.04);
        const rx = width * (i === 1 ? 0.34 : 0.28);
        const ry = height * 0.52;
        const peakAlpha = (i === 1 ? 0.068 : 0.042) * (1 - sp * 0.22);

        ctx.save();
        ctx.translate(bx, by);
        ctx.scale(1, ry / Math.max(1, rx));
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
        g.addColorStop(0, `rgba(176, 214, 255, ${(peakAlpha * 1.35).toFixed(4)})`);
        g.addColorStop(0.45, `rgba(88, 152, 255, ${peakAlpha.toFixed(4)})`);
        g.addColorStop(1, 'rgba(6, 8, 14, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0, 0, rx, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();

      // 3. Razor-Fine Luminous Titanium Eclipse Horizon Arc (Multi-pass soft bloom, zero ctx.filter!)
      const arcRadius = Math.max(width * 0.82, 760) * (1 + sp * 0.22);
      const arcCenterY = height * (0.76 - sp * 0.28) + arcRadius - height * 0.56 + smoothMY * 16;
      const arcCenterX = width * 0.5 + smoothMX * 28;

      ctx.save();
      const rimGlowGrad = ctx.createLinearGradient(width * 0.12, 0, width * 0.88, 0);
      rimGlowGrad.addColorStop(0, 'rgba(96, 165, 250, 0)');
      rimGlowGrad.addColorStop(0.28, 'rgba(96, 165, 250, 0.14)');
      rimGlowGrad.addColorStop(0.5, 'rgba(218, 236, 255, 0.28)');
      rimGlowGrad.addColorStop(0.72, 'rgba(96, 165, 250, 0.14)');
      rimGlowGrad.addColorStop(1, 'rgba(96, 165, 250, 0)');

      // Three layered soft strokes replicate Gaussian bloom at ~50x the speed
      for (const [lw, alpha] of [
        [34, 0.24],
        [16, 0.42],
        [6, 0.72],
      ] as const) {
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(arcCenterX, arcCenterY, arcRadius, Math.PI * 1.18, Math.PI * 1.82);
        ctx.strokeStyle = rimGlowGrad;
        ctx.lineWidth = lw;
        ctx.stroke();
      }

      // Crisp 1.35px machined titanium hairline arc
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(arcCenterX, arcCenterY, arcRadius, Math.PI * 1.16, Math.PI * 1.84);
      const sharpRimGrad = ctx.createLinearGradient(width * 0.14, 0, width * 0.86, 0);
      sharpRimGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      sharpRimGrad.addColorStop(0.32, 'rgba(138, 192, 255, 0.48)');
      sharpRimGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.92)');
      sharpRimGrad.addColorStop(0.68, 'rgba(138, 192, 255, 0.48)');
      sharpRimGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.strokeStyle = sharpRimGrad;
      ctx.lineWidth = 1.35;
      ctx.stroke();

      // Secondary delicate inner parallel horizon trace
      ctx.beginPath();
      ctx.arc(arcCenterX, arcCenterY + 26, arcRadius * 0.985, Math.PI * 1.22, Math.PI * 1.78);
      ctx.strokeStyle = 'rgba(138, 192, 255, 0.14)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // 4. Delicate Micro-Starlight Dust Motes Drifting Upward
      ctx.save();
      for (const m of motes) {
        if (!prefersReduced) {
          m.y -= m.vy;
          if (m.y < -0.02) {
            m.y = 1.02;
            m.x = Math.random();
          }
        }
        const px = m.x * width - smoothMX * 18 * m.r;
        const py = m.y * height - smoothMY * 12 * m.r - sp * 45 * m.r;
        const twinkle = 0.65 + 0.35 * Math.sin(time * 1.4 + m.phase);
        ctx.fillStyle = `rgba(210, 228, 255, ${(m.alpha * twinkle).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(px, py, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 5. Subtle Interactive Cursor Specular Reflection Pool (desktop only)
      if (!isCompact) {
        const px = width * (0.5 + smoothMX * 0.42);
        const py = height * (0.5 + smoothMY * 0.42);
        const pointerGlow = ctx.createRadialGradient(px, py, 0, px, py, 300);
        pointerGlow.addColorStop(0, 'rgba(111, 174, 255, 0.09)');
        pointerGlow.addColorStop(1, 'rgba(6, 8, 14, 0)');
        ctx.fillStyle = pointerGlow;
        ctx.fillRect(0, 0, width, height);
      }
    };

    const draw = (now: number) => {
      if (!isVisible) return;
      rafId = requestAnimationFrame(draw);
      const minInterval = isCompact ? 34 : 16;
      if (now - lastTick < minInterval) return;
      lastTick = now;
      time += isCompact ? 0.018 : 0.012;
      renderFrame();
    };

    // Draw frame 1 immediately for instant crisp visual, then start ambient loop after initial paint settles
    renderFrame();
    if (!prefersReduced) {
      startTimer = window.setTimeout(() => {
        if (isVisible) rafId = requestAnimationFrame(draw);
      }, 280);
    }

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries[0]?.isIntersecting ?? true;
        if (visible && !isVisible) {
          isVisible = true;
          if (!prefersReduced) rafId = requestAnimationFrame(draw);
        } else if (!visible && isVisible) {
          isVisible = false;
          cancelAnimationFrame(rafId);
        }
      },
      { threshold: 0.01 },
    );
    observer.observe(canvas);

    if (!isCompact) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
    }
    window.addEventListener('resize', resize, { passive: true });

    return () => {
      window.clearTimeout(startTimer);
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', resize);
    };
  }, [scrollProgressRef]);

  return (
    <div className="hero-lightfield-mount" aria-hidden="true">
      <canvas ref={canvasRef} className="hero-lightfield-canvas" />
      <div className="titanium-grain-layer" />
    </div>
  );
}
