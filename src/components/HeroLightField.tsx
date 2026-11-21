import { useEffect, useRef } from 'react';

interface HeroLightFieldProps {
  scrollProgressRef: React.MutableRefObject<number>;
}

/**
 * Ultra-Lightweight Apple Keynote Optical Titanium Horizon (Pure 2D Canvas, ~3KB, 0 WebGL overhead)
 * - Sweeping luminous crescent light-arc + gentle volumetric sapphire/silver rays + drifting micro-dust.
 * - Reacts smoothly to pointer movement AND expands like a studio spotlight as you scroll from Phase 1 -> Phase 2.
 * - Automatically pauses requestAnimationFrame via IntersectionObserver when scrolled offscreen for near-zero CPU!
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
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

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

    // Subtle floating optical starlight motes
    const motes = Array.from({ length: 52 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.65 + Math.random() * 1.35,
      vy: 0.00012 + Math.random() * 0.00028,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.16 + Math.random() * 0.42,
    }));

    let targetMX = 0;
    let targetMY = 0;
    let smoothMX = 0;
    let smoothMY = 0;
    let time = 0;
    let rafId = 0;
    let isVisible = true;

    const onPointerMove = (e: PointerEvent) => {
      targetMX = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      targetMY = (e.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
    };

    const draw = () => {
      if (!isVisible) return;
      if (!prefersReduced) {
        rafId = requestAnimationFrame(draw);
      }

      time += 0.012;
      const sp = scrollProgressRef.current;
      smoothMX += (targetMX - smoothMX) * 0.055;
      smoothMY += (targetMY - smoothMY) * 0.055;

      ctx.clearRect(0, 0, width, height);

      // 1. Deep Ambient Top-Center Optical Spotlight (expands softly as Phase 2 rises)
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

      // 2. Silky Feathered Volumetric Light Curtains (Zero hard straight-edge lines!)
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.filter = 'blur(34px)';
      const beamCount = 3;
      for (let i = 0; i < beamCount; i++) {
        const offsetNorm = i - 1; // -1, 0, 1
        const sway = Math.sin(time * 0.42 + i * 1.7) * width * 0.045;
        const originX = cx + offsetNorm * width * 0.16 + sway;
        const originY = crestY - height * 0.14;
        const spreadX = originX + offsetNorm * width * 0.34 - smoothMX * width * 0.07;
        const beamW = width * (i === 1 ? 0.22 : 0.18);

        const beamGrad = ctx.createLinearGradient(originX, originY, spreadX, height * 0.88);
        const peakAlpha = (i === 1 ? 0.055 : 0.036) * (1 - sp * 0.22);
        beamGrad.addColorStop(0, `rgba(190, 222, 255, ${(peakAlpha * 1.4).toFixed(4)})`);
        beamGrad.addColorStop(0.45, `rgba(88, 152, 255, ${peakAlpha.toFixed(4)})`);
        beamGrad.addColorStop(1, 'rgba(6, 8, 14, 0)');

        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(originX - beamW * 0.3, originY);
        ctx.lineTo(originX + beamW * 0.3, originY);
        ctx.lineTo(spreadX + beamW, height);
        ctx.lineTo(spreadX - beamW, height);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // 3. Razor-Fine Luminous Titanium Eclipse Horizon Arc (Crowning cleanly above eyebrow!)
      const arcRadius = Math.max(width * 0.82, 760) * (1 + sp * 0.22);
      const arcCenterY = height * (0.76 - sp * 0.28) + arcRadius - height * 0.56 + smoothMY * 16;
      const arcCenterX = width * 0.5 + smoothMX * 28;

      ctx.save();
      // Soft atmospheric bloom along the upper rim of the eclipse arc
      ctx.beginPath();
      ctx.arc(arcCenterX, arcCenterY, arcRadius, Math.PI * 1.18, Math.PI * 1.82);
      const rimGlowGrad = ctx.createLinearGradient(width * 0.12, 0, width * 0.88, 0);
      rimGlowGrad.addColorStop(0, 'rgba(96, 165, 250, 0)');
      rimGlowGrad.addColorStop(0.28, 'rgba(96, 165, 250, 0.22)');
      rimGlowGrad.addColorStop(0.5, 'rgba(218, 236, 255, 0.42)');
      rimGlowGrad.addColorStop(0.72, 'rgba(96, 165, 250, 0.22)');
      rimGlowGrad.addColorStop(1, 'rgba(96, 165, 250, 0)');
      ctx.strokeStyle = rimGlowGrad;
      ctx.lineWidth = 22;
      ctx.filter = 'blur(14px)';
      ctx.stroke();

      // Crisp 1.25px machined titanium hairline arc
      ctx.filter = 'none';
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

      // 5. Subtle Interactive Cursor Specular Reflection Pool
      const pointerGlow = ctx.createRadialGradient(
        width * (0.5 + smoothMX * 0.42),
        height * (0.5 + smoothMY * 0.42),
        0,
        width * (0.5 + smoothMX * 0.42),
        height * (0.5 + smoothMY * 0.42),
        320,
      );
      pointerGlow.addColorStop(0, 'rgba(111, 174, 255, 0.095)');
      pointerGlow.addColorStop(1, 'rgba(6, 8, 14, 0)');
      ctx.fillStyle = pointerGlow;
      ctx.fillRect(0, 0, width, height);
    };

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries[0]?.isIntersecting ?? true;
        if (visible && !isVisible) {
          isVisible = true;
          rafId = requestAnimationFrame(draw);
        } else if (!visible && isVisible) {
          isVisible = false;
          cancelAnimationFrame(rafId);
        }
      },
      { threshold: 0.01 },
    );
    observer.observe(canvas);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('resize', resize, { passive: true });
    draw();

    return () => {
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
