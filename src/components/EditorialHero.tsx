import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowDown, ArrowUpRight, Layers, Sparkles } from 'lucide-react';
import { PROFILE_INFO, PROJECTS_DATA } from '../data/portfolioData';
import type { ProjectItem } from '../types';
import { HeroLightField } from './HeroLightField';
import { KineticCounter } from './KineticText';
import { smoothScrollTo } from '../lib/smoothScroll';

interface EditorialHeroProps {
  onSelectProject?: (project: ProjectItem, attIdx?: number) => void;
}

/**
 * 2-Phase Apple Keynote Dark-to-Light Studio Curtain Hero
 * - Phase 1 (y = 0): Deep Space Titanium (#06080E) + Optical Titanium Horizon + Colossal Split-Curtain Headline.
 * - Phase 2 (Scroll Down): Luminous architectural Studio Gallery curtain (#ECEEF3) expands smoothly
 *   out of the dark horizon, showcasing Eldi's REAL ORIGINAL PHOTO by default with interactive cursor
 *   effects: 3D magnetic pointer tilt + live optical light sheen + silky Liquid Brush Reveal to AIBEL Art!
 */
export function EditorialHero({ onSelectProject }: EditorialHeroProps) {
  const runwayRef = useRef<HTMLElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollProgressRef = useRef(0);
  const [artLocked, setArtLocked] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 980px)').matches : false,
  );
  const [phase2Active, setPhase2Active] = useState(false);

  // Silky 3D magnetic cursor tilt for the portrait frame
  const tiltXRaw = useMotionValue(0);
  const tiltYRaw = useMotionValue(0);
  const tiltRotateX = useSpring(tiltXRaw, { stiffness: 180, damping: 22, mass: 0.4 });
  const tiltRotateY = useSpring(tiltYRaw, { stiffness: 180, damping: 22, mass: 0.4 });

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 980px)');
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // On mobile/tablet stacked hero, still morph top bar Dark -> Light smoothly when Phase 2 Curtain enters top!
  useEffect(() => {
    if (!isMobile) return;
    const onScrollMobile = () => {
      const el = curtainRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const isLight = rect.top <= 96;
      setPhase2Active(prev => {
        if (prev === isLight) return prev;
        if (runwayRef.current) {
          runwayRef.current.dataset.navTone = isLight ? 'light' : 'dark';
        }
        window.dispatchEvent(new CustomEvent('portfolio:heroTone', { detail: isLight ? 'light' : 'dark' }));
        return isLight;
      });
    };
    onScrollMobile();
    window.addEventListener('scroll', onScrollMobile, { passive: true });
    return () => window.removeEventListener('scroll', onScrollMobile);
  }, [isMobile]);

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ['start start', 'end end'],
  });
  const p = useSpring(scrollYProgress, { stiffness: 96, damping: 25, mass: 0.5 });

  useEffect(() => {
    if (isMobile) return;
    const unsub = p.on('change', v => {
      scrollProgressRef.current = v;
      const isLightCurtain = v > 0.36;
      setPhase2Active(prev => {
        if (prev === isLightCurtain) return prev;
        if (runwayRef.current) {
          runwayRef.current.dataset.navTone = isLightCurtain ? 'light' : 'dark';
        }
        window.dispatchEvent(new CustomEvent('portfolio:heroTone', { detail: isLightCurtain ? 'light' : 'dark' }));
        return isLightCurtain;
      });
    });
    return () => unsub();
  }, [p, isMobile]);

  // Phase 1: Colossal headline curtains part horizontally left & right like theater doors!
  const lineTopX = useTransform(p, [0, 0.42], ['0vw', '-20vw']);
  const lineBottomX = useTransform(p, [0, 0.42], ['0vw', '20vw']);
  const phase1Opacity = useTransform(p, [0.05, 0.32], [1, 0]);
  const phase1Scale = useTransform(p, [0, 0.42], [1, 1.1]);
  const introCueOpacity = useTransform(p, [0, 0.22], [1, 0]);

  // Phase 2: Luminous Architectural Studio Curtain expands smoothly via clip-path aperture!
  const curtainClip = useTransform(
    p,
    [0.2, 0.64],
    ['inset(100% 10% 0% 10% round 42px)', 'inset(0% 0% 0% 0% round 0px)'],
  );
  const curtainOpacity = useTransform(p, [0.18, 0.34], [0, 1]);
  const ghostTopX = useTransform(p, [0.28, 1], ['8%', '-10%']);
  const ghostBotX = useTransform(p, [0.28, 1], ['-10%', '8%']);
  const artScale = useTransform(p, [0.28, 0.72], [0.9, 1]);
  const artY = useTransform(p, [0.28, 0.72], [48, 0]);
  const specBarY = useTransform(p, [0.44, 0.74], [24, 0]);
  const specBarOpacity = useTransform(p, [0.44, 0.72], [0, 1]);

  // Silky Interactive Cursor Effects:
  // Base = Eldi's REAL ORIGINAL PHOTO | Cursor Brush Reveal = AIBEL Art + 3D Magnetic Tilt + Specular Glare!
  useEffect(() => {
    const container = portraitRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const W = 960;
    const H = 640;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = W;
    maskCanvas.height = H;
    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) return;

    const revealImg = new Image();
    revealImg.decoding = 'async';
    let revealLoaded = false;
    const ensureRevealLoaded = () => {
      if (revealLoaded) return;
      revealLoaded = true;
      revealImg.src = PROFILE_INFO.personaPortraitImage;
    };

    let isInside = false;
    let isVisible = false;
    let idleFrames = 0;
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

      maskCtx.save();
      maskCtx.scale(stretch, 0.84);
      const gCore = maskCtx.createRadialGradient(0, 0, 14, 0, 0, 118);
      gCore.addColorStop(0, 'rgba(0, 0, 0, 0.58)');
      gCore.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
      gCore.addColorStop(0.82, 'rgba(0, 0, 0, 0.08)');
      gCore.addColorStop(1, 'rgba(0, 0, 0, 0)');
      maskCtx.fillStyle = gCore;
      maskCtx.beginPath();
      maskCtx.arc(0, 0, 118, 0, Math.PI * 2);
      maskCtx.fill();
      maskCtx.restore();

      const wobbleX = Math.sin(frameCount * 0.08) * 20;
      const wobbleY = Math.cos(frameCount * 0.06) * 18;
      maskCtx.save();
      maskCtx.translate(wobbleX, wobbleY);
      maskCtx.rotate(0.45);
      maskCtx.scale(1.28, 0.78);
      const gLobe = maskCtx.createRadialGradient(0, 0, 10, 0, 0, 92);
      gLobe.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
      gLobe.addColorStop(0.6, 'rgba(0, 0, 0, 0.14)');
      gLobe.addColorStop(1, 'rgba(0, 0, 0, 0)');
      maskCtx.fillStyle = gLobe;
      maskCtx.beginPath();
      maskCtx.arc(0, 0, 92, 0, Math.PI * 2);
      maskCtx.fill();
      maskCtx.restore();

      maskCtx.restore();
    };

    const getCanvasCoords = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return { x: W / 2, y: H / 2, nx: 0.5, ny: 0.5 };
      const nx = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const ny = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
      return { x: nx * W, y: ny * H, nx, ny };
    };

    const kickLoop = () => {
      idleFrames = 0;
      if (!rafId && isVisible) {
        rafId = requestAnimationFrame(renderLoop);
      }
    };

    const updateTiltAndGlare = (nx: number, ny: number) => {
      container.style.setProperty('--px', `${(nx * 100).toFixed(1)}%`);
      container.style.setProperty('--py', `${(ny * 100).toFixed(1)}%`);
      tiltXRaw.set((0.5 - ny) * 8);
      tiltYRaw.set((nx - 0.5) * 10);
    };

    const onPointerEnter = (e: PointerEvent) => {
      ensureRevealLoaded();
      const { x, y, nx, ny } = getCanvasCoords(e.clientX, e.clientY);
      targetX = x;
      targetY = y;
      smoothX = x;
      smoothY = y;
      prevSmoothX = x;
      prevSmoothY = y;
      isInside = true;
      updateTiltAndGlare(nx, ny);
      kickLoop();
    };

    const onPointerMove = (e: PointerEvent) => {
      ensureRevealLoaded();
      const { x, y, nx, ny } = getCanvasCoords(e.clientX, e.clientY);
      if (!isInside) {
        smoothX = x;
        smoothY = y;
        prevSmoothX = x;
        prevSmoothY = y;
        isInside = true;
      }
      targetX = x;
      targetY = y;
      updateTiltAndGlare(nx, ny);
      kickLoop();
    };

    const onPointerLeave = () => {
      isInside = false;
      tiltXRaw.set(0);
      tiltYRaw.set(0);
      kickLoop();
    };

    const drawCoverImage = (img: HTMLImageElement) => {
      const imgRatio = img.naturalWidth / Math.max(1, img.naturalHeight);
      const canvasRatio = W / H;
      let sw = img.naturalWidth;
      let sh = img.naturalHeight;
      let sx = 0;
      let sy = 0;
      if (imgRatio > canvasRatio) {
        sw = img.naturalHeight * canvasRatio;
        sx = (img.naturalWidth - sw) * 0.5;
      } else {
        sh = img.naturalWidth / canvasRatio;
        sy = (img.naturalHeight - sh) * 0.24;
      }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
    };

    const renderLoop = () => {
      rafId = 0;
      if (!isVisible) return;

      if (!revealImg.complete || revealImg.naturalWidth === 0) {
        rafId = requestAnimationFrame(renderLoop);
        return;
      }

      if (artLocked) {
        ctx.clearRect(0, 0, W, H);
        ctx.globalCompositeOperation = 'source-over';
        drawCoverImage(revealImg);
        return;
      }

      maskCtx.save();
      maskCtx.globalCompositeOperation = 'destination-out';
      maskCtx.fillStyle = isInside ? 'rgba(0, 0, 0, 0.08)' : 'rgba(0, 0, 0, 0.14)';
      maskCtx.fillRect(0, 0, W, H);
      maskCtx.restore();

      if (isInside) {
        idleFrames = 0;
        smoothX += (targetX - smoothX) * 0.16;
        smoothY += (targetY - smoothY) * 0.16;

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
      } else {
        idleFrames += 1;
      }

      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(maskCanvas, 0, 0, W, H);
      ctx.globalCompositeOperation = 'source-in';
      drawCoverImage(revealImg);

      if (isInside || idleFrames < 55) {
        rafId = requestAnimationFrame(renderLoop);
      } else {
        maskCtx.clearRect(0, 0, W, H);
        ctx.clearRect(0, 0, W, H);
      }
    };

    const observer = new IntersectionObserver(
      entries => {
        isVisible = entries[0]?.isIntersecting ?? false;
        if (isVisible && (artLocked || isInside)) {
          ensureRevealLoaded();
          kickLoop();
        } else if (!isVisible && rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      { threshold: 0.01 },
    );
    observer.observe(container);

    revealImg.addEventListener('load', kickLoop);
    if (artLocked) {
      ensureRevealLoaded();
      kickLoop();
    }
    container.addEventListener('pointerdown', onPointerEnter);
    container.addEventListener('pointerenter', onPointerEnter);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerLeave);
    container.addEventListener('pointerleave', onPointerLeave);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      revealImg.removeEventListener('load', kickLoop);
      container.removeEventListener('pointerdown', onPointerEnter);
      container.removeEventListener('pointerenter', onPointerEnter);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerLeave);
      container.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [artLocked, tiltXRaw, tiltYRaw]);

  const flagshipProject = PROJECTS_DATA[0];

  const scrollToIdentityPhase = () => {
    if (isMobile && curtainRef.current) {
      const top = curtainRef.current.getBoundingClientRect().top + window.scrollY - 64;
      smoothScrollTo(top);
      return;
    }
    if (!runwayRef.current) return;
    const targetY = runwayRef.current.offsetTop + (runwayRef.current.offsetHeight - window.innerHeight) * 0.85;
    smoothScrollTo(targetY);
  };

  const scrollToSectionId = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const top = el.getBoundingClientRect().top + window.scrollY;
    smoothScrollTo(top);
  };

  return (
    <section
      id="hero"
      ref={runwayRef}
      data-nav-tone={phase2Active ? 'light' : 'dark'}
      className={`keynote-hero-runway ${isMobile ? 'is-mobile' : ''}`}
    >
      <div className="keynote-hero-sticky">
        {/* PHASE 1 BACKGROUND: ULTRA-LIGHTWEIGHT INTERACTIVE OPTICAL TITANIUM HORIZON */}
        <HeroLightField scrollProgressRef={scrollProgressRef} />

        {/* PHASE 1 WRAPPER (Full-height sleek mobile/tablet opening!) */}
        <div className="keynote-phase1-shell">
          {/* PHASE 1 (y = 0): BORDERLESS COLOSSAL SPLIT-CURTAIN TYPOGRAPHY */}
          <motion.div
            key={isMobile ? 'p1-m' : 'p1-d'}
            className="keynote-phase-1"
            style={
              isMobile
                ? undefined
                : {
                    opacity: phase1Opacity,
                    scale: phase1Scale,
                  }
            }
          >
            <motion.span
              className="keynote-eyebrow-naked"
              initial={{ y: 8 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              MUHAMAD ELDI (POPELL) &nbsp;·&nbsp; FULL-STACK &amp; CREATIVE TECHNOLOGIST
            </motion.span>

            <motion.h1
              className="keynote-colossal-title"
              initial={{ y: 12 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.span className="kct-line" style={isMobile ? undefined : { x: lineTopX }}>
                CRAFTING <em className="font-serif-italic kct-ice">Living</em>
              </motion.span>
              <motion.span className="kct-line" style={isMobile ? undefined : { x: lineBottomX }}>
                SYSTEMS.
              </motion.span>
            </motion.h1>

            <motion.p
              className="keynote-sub-whisper"
              initial={{ y: 10 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              Sistem logistik nasional PT Pos Indonesia, aplikasi web full-stack, interaksi visual yang ringan, hingga
              Local AI (Ollama + MongoDB).
            </motion.p>
          </motion.div>

          {/* PHASE 1 NAKED BORDERLESS BOTTOM BAR */}
          <motion.div
            key={isMobile ? 'bar-m' : 'bar-d'}
            className={`keynote-bottom-bar ${!isMobile && phase2Active ? 'is-passthrough' : ''}`}
            style={isMobile ? undefined : { opacity: introCueOpacity }}
            initial={{ y: 8 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="keynote-hint-mono">BANDUNG, ID · EDITION 2026</span>

            <button type="button" className="keynote-scroll-naked" onClick={scrollToIdentityPhase}>
              <span>Scroll to enter studio</span>
              <ArrowDown size={14} />
            </button>

            <a href="#projects" className="cinema-text-cta" onClick={e => scrollToSectionId(e, 'projects')}>
              Explore 12 Works <ArrowUpRight size={14} />
            </a>
          </motion.div>
        </div>

        {/* PHASE 2 (Scroll Down): LUMINOUS STUDIO CURTAIN — REAL ORIGINAL PHOTO + CURSOR BRUSH & 3D TILT! */}
        <motion.div
          key={isMobile ? 'curtain-m' : 'curtain-d'}
          ref={curtainRef}
          className={`studio-curtain-stage ${isMobile || phase2Active ? 'is-interactive' : ''}`}
          style={
            isMobile
              ? undefined
              : {
                  clipPath: curtainClip,
                  opacity: curtainOpacity,
                }
          }
        >
          {/* GIANT KINETIC DRIFTING BACKGROUND WATERMARK TYPE */}
          <div className="curtain-watermark-layer" aria-hidden="true">
            <motion.span className="curtain-wm-line" style={isMobile ? undefined : { x: ghostTopX }}>
              MUHAMAD ELDI — FULL-STACK
            </motion.span>
            <motion.span className="curtain-wm-line is-italic" style={isMobile ? undefined : { x: ghostBotX }}>
              POPELL STUDIO · BANDUNG
            </motion.span>
          </div>

          <div className="curtain-inner-frame">
            {/* TOP MINIMAL STUDIO KICKER BAR */}
            <div className="curtain-top-strip">
              <span className="curtain-mono-tag">00 / STUDIO PROFILE · BANDUNG, ID</span>
              <span className="curtain-mono-note">
                <Sparkles size={11} />{' '}
                {isMobile ? 'Sentuh atau geser foto · Liquid Mono Brush' : 'Gerakkan kursor di foto · Liquid Mono Brush & 3D Tilt'}
              </span>
            </div>

            {/* CENTERPIECE: ELDI'S REAL ORIGINAL PHOTO WITH MAGNETIC 3D TILT + LIQUID BRUSH REVEAL */}
            <motion.div
              className="curtain-art-center"
              style={isMobile ? undefined : { scale: artScale, y: artY }}
            >
              <motion.div
                ref={portraitRef}
                className="curtain-portrait-canvas is-real-photo"
                data-cursor={artLocked ? 'COLOR' : 'MONO'}
                style={
                  isMobile
                    ? undefined
                    : {
                        rotateX: tiltRotateX,
                        rotateY: tiltRotateY,
                        transformPerspective: 1100,
                      }
                }
                onClick={() => setArtLocked(prev => !prev)}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setArtLocked(prev => !prev);
                  }
                }}
                aria-label="Gerakkan kursor atau klik foto untuk efek Liquid Brush ke versi Editorial Mono"
              >
                <img
                  src={PROFILE_INFO.portraitImage}
                  alt="Muhamad Eldi (POPELL) — Foto Asli"
                  className="hero-portrait-img is-real-framing"
                  width={960}
                  height={540}
                  loading="eager"
                  decoding="async"
                />
                <canvas
                  ref={canvasRef}
                  width={960}
                  height={640}
                  className="hero-portrait-canvas"
                  aria-hidden="true"
                />
                <span className="portrait-cursor-sheen" aria-hidden="true" />
              </motion.div>
            </motion.div>

            {/* BOTTOM EDGE-TO-EDGE ARCHITECTURAL SPEC BAR */}
            <motion.div
              className="curtain-spec-bar"
              style={isMobile ? undefined : { y: specBarY, opacity: specBarOpacity }}
            >
              <div className="spec-col-identity">
                <strong>Muhamad Eldi (POPELL)</strong>
                <span>SMK Wiraswasta Cimahi · Ex-PKL PT Pos Indonesia Ops Control</span>
              </div>

              <div className="spec-col-metrics">
                <div>
                  <b>
                    <KineticCounter target={12} suffix="+" trigger={isMobile || phase2Active} />
                  </b>
                  <small>Systems</small>
                </div>
                <div>
                  <b>
                    <KineticCounter target={26} trigger={isMobile || phase2Active} />
                  </b>
                  <small>Screens</small>
                </div>
                <div>
                  <b>
                    <KineticCounter target={83.7} decimals={1} suffix="K" trigger={isMobile || phase2Active} />
                  </b>
                  <small>Wilayah</small>
                </div>
              </div>

              <div className="spec-col-controls">
                <div className="curtain-layer-switch" role="group" aria-label="Mode tampilan foto">
                  <button
                    type="button"
                    aria-pressed={!artLocked}
                    className={!artLocked ? 'is-active' : ''}
                    onClick={() => setArtLocked(false)}
                  >
                    Studio
                  </button>
                  <span aria-hidden="true">/</span>
                  <button
                    type="button"
                    aria-pressed={artLocked}
                    className={artLocked ? 'is-active' : ''}
                    onClick={() => setArtLocked(true)}
                  >
                    Mono
                  </button>
                </div>

                {onSelectProject && (
                  <button
                    type="button"
                    className="curtain-flagship-link"
                    onClick={() => onSelectProject(flagshipProject, 0)}
                  >
                    <Layers size={13} />
                    <span>Flagship #01</span>
                    <ArrowUpRight size={13} />
                  </button>
                )}

                <a
                  href="#highlights"
                  className="curtain-next-pill"
                  onClick={e => scrollToSectionId(e, 'highlights')}
                >
                  <span>Highlights</span>
                  <ArrowDown size={14} />
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
