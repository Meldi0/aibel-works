import { useLayoutEffect, useRef, useState } from 'react';
import { Code2, Compass, Sparkles, Terminal, User } from 'lucide-react';
import { PROFILE_INFO } from '../data/portfolioData';
import { gsap, useMotionSettings } from '../lib/motion';
import { Reveal, SectionLabel } from './Reveal';

export function IdentitySection() {
  const root = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [personaLocked, setPersonaLocked] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);
  const { reduced, desktop } = useMotionSettings();

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      if (reduced) return;
      gsap.fromTo(
        '.portrait-mask',
        { clipPath: 'inset(100% 0 0 0)' },
        {
          clipPath: 'inset(0% 0 0 0)',
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'top 8%', scrub: 0.6 },
        }
      );
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: '.identity-reel', start: 'top 40%', end: 'bottom bottom', scrub: 0.7 },
      });
      timeline
        .fromTo(
          '.portrait-base, .portrait-trail-canvas',
          { scale: 1.12, filter: desktop ? 'grayscale(1)' : 'none' },
          { scale: 1, filter: 'grayscale(0)', ease: 'none', duration: 1 },
          0
        )
        .fromTo('.identity-depth-type', { xPercent: -5 }, { xPercent: 5, ease: 'none', duration: 1 }, 0);

      if (desktop) {
        timeline.fromTo('.portrait-light', { xPercent: -150 }, { xPercent: 150, ease: 'none', duration: 0.8 }, 0.15);
      }

      if (desktop && root.current) {
        const portraitX = gsap.quickTo('.portrait-parallax', 'x', { duration: 1.1, ease: 'premium' });
        const textX = gsap.quickTo('.identity-intro', 'x', { duration: 1.1, ease: 'premium' });
        const move = (event: PointerEvent) => {
          const x = event.clientX / innerWidth - 0.5;
          portraitX(x * 9);
          textX(x * -5);
        };
        const leave = () => {
          portraitX(0);
          textX(0);
        };
        root.current.addEventListener('pointermove', move);
        root.current.addEventListener('pointerleave', leave);
        return () => {
          root.current?.removeEventListener('pointermove', move);
          root.current?.removeEventListener('pointerleave', leave);
        };
      }
    }, root);
    return () => context.revert();
  }, [reduced, desktop]);

  // Silky-smooth spring-interpolated liquid brush reveal (short, subtle trail that fades quickly)
  useLayoutEffect(() => {
    const container = portraitRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const W = 800;
    const H = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = W;
    maskCanvas.height = H;
    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) return;

    const revealImg = new Image();
    revealImg.src = PROFILE_INFO.personaPortraitImage;

    let isInside = false;
    let targetX = W * 0.52;
    let targetY = H * 0.45;
    let smoothX = targetX;
    let smoothY = targetY;
    let prevSmoothX = targetX;
    let prevSmoothY = targetY;
    let smoothAngle = -0.2;
    let rafId = 0;
    let frameCount = 0;

    const stampSoftLiquidBrush = (x: number, y: number, angle: number, velocity: number) => {
      frameCount += 1;
      maskCtx.save();
      maskCtx.globalCompositeOperation = 'source-over';
      maskCtx.translate(x, y);
      maskCtx.rotate(angle);

      const stretch = Math.min(1.65, 1.15 + velocity * 0.018);

      // Soft feathered organic core
      maskCtx.save();
      maskCtx.scale(stretch, 0.82);
      const gCore = maskCtx.createRadialGradient(0, 0, 12, 0, 0, 105);
      gCore.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
      gCore.addColorStop(0.5, 'rgba(0, 0, 0, 0.28)');
      gCore.addColorStop(0.82, 'rgba(0, 0, 0, 0.08)');
      gCore.addColorStop(1, 'rgba(0, 0, 0, 0)');
      maskCtx.fillStyle = gCore;
      maskCtx.beginPath();
      maskCtx.arc(0, 0, 105, 0, Math.PI * 2);
      maskCtx.fill();
      maskCtx.restore();

      // Secondary gentle organic contour lobe so shape feels fluid, not a rigid circle
      const wobbleX = Math.sin(frameCount * 0.08) * 18;
      const wobbleY = Math.cos(frameCount * 0.06) * 16;
      maskCtx.save();
      maskCtx.translate(wobbleX, wobbleY);
      maskCtx.rotate(0.45);
      maskCtx.scale(1.28, 0.76);
      const gLobe = maskCtx.createRadialGradient(0, 0, 8, 0, 0, 82);
      gLobe.addColorStop(0, 'rgba(0, 0, 0, 0.38)');
      gLobe.addColorStop(0.6, 'rgba(0, 0, 0, 0.14)');
      gLobe.addColorStop(1, 'rgba(0, 0, 0, 0)');
      maskCtx.fillStyle = gLobe;
      maskCtx.beginPath();
      maskCtx.arc(0, 0, 82, 0, Math.PI * 2);
      maskCtx.fill();
      maskCtx.restore();

      maskCtx.restore();
    };

    const getCanvasCoords = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return { x: W / 2, y: H / 2 };
      const containerRatio = rect.width / rect.height;
      const imgRatio = W / H;
      let renderW = rect.width;
      let renderH = rect.height;
      let offsetX = 0;
      let offsetY = 0;

      if (containerRatio > imgRatio) {
        renderH = rect.width / imgRatio;
        offsetY = (rect.height - renderH) * 0.5;
      } else {
        renderW = rect.height * imgRatio;
        offsetX = (rect.width - renderW) * 0.58;
      }

      const x = ((clientX - rect.left - offsetX) / renderW) * W;
      const y = ((clientY - rect.top - offsetY) / renderH) * H;
      return { x, y };
    };

    const onPointerEnter = (e: PointerEvent) => {
      const { x, y } = getCanvasCoords(e.clientX, e.clientY);
      targetX = x;
      targetY = y;
      smoothX = x;
      smoothY = y;
      prevSmoothX = x;
      prevSmoothY = y;
      isInside = true;
    };

    const onPointerMove = (e: PointerEvent) => {
      const { x, y } = getCanvasCoords(e.clientX, e.clientY);
      if (!isInside) {
        smoothX = x;
        smoothY = y;
        prevSmoothX = x;
        prevSmoothY = y;
        isInside = true;
      }
      targetX = x;
      targetY = y;
    };

    const onPointerLeave = () => {
      isInside = false;
    };

    const renderLoop = () => {
      rafId = requestAnimationFrame(renderLoop);
      if (!revealImg.complete || revealImg.naturalWidth === 0) return;

      // Fast, clean fade-out so the trail does not stay too long ("jangan terlalu membekas")
      maskCtx.save();
      maskCtx.globalCompositeOperation = 'destination-out';
      maskCtx.fillStyle = isInside ? 'rgba(0, 0, 0, 0.085)' : 'rgba(0, 0, 0, 0.14)';
      maskCtx.fillRect(0, 0, W, H);
      maskCtx.restore();

      if (isInside) {
        // Silky-smooth spring interpolation toward cursor position
        smoothX += (targetX - smoothX) * 0.15;
        smoothY += (targetY - smoothY) * 0.15;

        const dx = smoothX - prevSmoothX;
        const dy = smoothY - prevSmoothY;
        const dist = Math.hypot(dx, dy);

        if (dist > 0.4) {
          const targetAngle = Math.atan2(dy, dx);
          smoothAngle += (targetAngle - smoothAngle) * 0.2;
        }

        const steps = Math.max(1, Math.ceil(dist / 6));
        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          const ix = prevSmoothX + dx * t;
          const iy = prevSmoothY + dy * t;
          stampSoftLiquidBrush(ix, iy, smoothAngle, dist);
        }

        prevSmoothX = smoothX;
        prevSmoothY = smoothY;
      }

      ctx.clearRect(0, 0, W, H);
      if (personaLocked) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(revealImg, 0, 0, W, H);
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(maskCanvas, 0, 0, W, H);
        ctx.globalCompositeOperation = 'source-in';
        ctx.drawImage(revealImg, 0, 0, W, H);
      }
    };

    rafId = requestAnimationFrame(renderLoop);
    container.addEventListener('pointerenter', onPointerEnter);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerleave', onPointerLeave);

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener('pointerenter', onPointerEnter);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [personaLocked]);

  return (
    <section ref={root} id="identity" data-tone="dark" className="identity-section">
      <div className="identity-reel">
        <div className="identity-sticky section-shell">
          <SectionLabel number="01" detail="Muhamad Eldi • aka AIBEL">About Me</SectionLabel>
          <span className="identity-depth-type" aria-hidden="true">AIBEL</span>
          <div className="identity-grid">
            <figure className="portrait-parallax">
              <div
                ref={portraitRef}
                onClick={() => setPersonaLocked(prev => !prev)}
                className="portrait-mask"
              >
                <img
                  className="portrait-image portrait-base"
                  src={PROFILE_INFO.portraitImage}
                  alt="Muhamad Eldi (aka AIBEL) — Full-Stack Developer • Creative Technologist • AI Explorer"
                  width="800"
                  height="600"
                  loading="eager"
                  decoding="async"
                />
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="portrait-image portrait-trail-canvas"
                  aria-hidden="true"
                />
                <div className="portrait-light" aria-hidden="true" />
                <figcaption className="portrait-caption">
                  <span>Muhamad Eldi · aka AIBEL</span>
                  <span>Bandung, ID · 2026</span>
                </figcaption>
              </div>
              <div className="portrait-meta">
                <span>Full-Stack Developer • Creative Technologist • AI Explorer</span>
                <span>Crafting digital experiences</span>
              </div>
            </figure>
            <div className="identity-intro">
              <p className="eyebrow"><Reveal><span className="icon-label"><Terminal size={13} /> Hey, I’m Eldi! • aka AIBEL</span></Reveal></p>
              <h2 className="display-heading identity-heading"><Reveal>Not your</Reveal><Reveal delay={0.08}>typical</Reveal><Reveal delay={0.16}><span className="muted">“Hello World”.</span></Reveal></h2>
              <p className="identity-lead"><Reveal delay={0.2}>I’m a student developer who loves turning ideas into real digital experiences.</Reveal><Reveal delay={0.28}>I enjoy building things, experimenting with technologies, and figuring out how to make something not just work, but actually feel good to use.</Reveal></p>
            </div>
          </div>
        </div>
      </div>
      <div className="identity-details section-shell">
        <div className="identity-biography">
          <p className="eyebrow"><Reveal>01 / About Me — Behind the scenes</Reveal></p>
          <div className="identity-narrative">
            <p className="identity-narrative-lead"><Reveal>Gue Muhamad Eldi, also known as AIBEL, seorang student developer yang suka banget ngulik teknologi, experimenting with ideas, dan membangun sesuatu dari nol.</Reveal></p>
            <p className="identity-narrative-body">
              My journey in programming is driven by curiosity. Gue nggak mau cuma tahu cara menggunakan teknologi, tapi juga pengen ngerti gimana semuanya bekerja behind the scenes — mulai dari frontend development, backend architecture, database systems, hingga AI integration.
            </p>
            <div className={`identity-narrative-extra ${showFullBio ? 'is-expanded' : ''}`}>
              <p className="identity-narrative-body">
                From web applications and backend systems to AI-powered tools, data dashboards, and creative experiments, I work with technologies including <strong>JavaScript, TypeScript, PHP, Laravel, React, Node.js, Python, MySQL, and MongoDB</strong>. Sometimes I build things to solve actual problems. Sometimes I build them simply because I think, <em>“What if I could make this?”</em>
              </p>
              <p className="identity-narrative-body">
                Whether I’m building a Laravel application, experimenting with React interfaces, integrating MongoDB with a local AI Agent, or developing an interactive web tool, I care about typography, layouts, micro-interactions, API structures, and performance.
              </p>
            </div>
            <button
              type="button"
              className="bio-expand-btn"
              onClick={() => setShowFullBio(prev => !prev)}
            >
              {showFullBio ? 'Ringkas cerita −' : 'Baca selengkapnya +'}
            </button>
          </div>
        </div>
        <div className="identity-facts">
          <div><span className="eyebrow icon-label"><User size={13} /> Developer Identity</span><h3>Muhamad Eldi (AIBEL)</h3><p>Full-Stack Developer • Creative Technologist • AI Explorer</p><p className="muted">Crafting digital experiences through code, creativity, and curiosity.</p></div>
          <div><span className="eyebrow icon-label"><Sparkles size={13} /> Education & Background</span><h3>Software Engineering (RPL)</h3><p>Vocational High School (SMK) in Software Engineering (Rekayasa Perangkat Lunak) — building web, backend, and AI systems from the ground up.</p></div>
          <div><span className="eyebrow icon-label"><Code2 size={13} /> Industry Experience (PKL)</span><h3>PT Pos Indonesia</h3><p>Operations Control Division (Pengendalian Operasi) — developing operational dashboards, local AI shipment agents, and enterprise data tools.</p></div>
          <div><span className="eyebrow icon-label"><Compass size={13} /> Core Philosophy</span><h3>Always Evolving</h3><p>I believe being versatile is valuable, but understanding the technologies I use is even more important. Not here to know everything. Here to keep figuring things out.</p></div>
        </div>
        <blockquote><Reveal>“My mindset? Keep learning. Keep building. Keep improving.”</Reveal></blockquote>
      </div>
    </section>
  );
}
