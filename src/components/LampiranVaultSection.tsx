import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type PanInfo,
} from 'motion/react';
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Maximize2,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { PROJECTS_DATA } from '../data/portfolioData';
import type { ProjectItem } from '../types';
import { smoothScrollTo } from '../lib/smoothScroll';
import { SplitHeadline } from './KineticText';

interface LampiranVaultSectionProps {
  onSelectProject: (project: ProjectItem, attIdx: number) => void;
}

interface GalleryFrame {
  id: string;
  src: string;
  label: string;
  caption: string;
  kind: 'ui' | 'diagram' | 'mobile';
  project: ProjectItem;
  attIdx: number;
}

/**
 * Pure GPU MotionValue 3D Coverflow Slide (0 React re-renders during scroll!)
 * Glides smoothly through 3D perspective as the user simply scrolls down/up.
 */
function CoverflowScrollCard({
  frame,
  index,
  smoothFloatIdx,
  isFocused,
  onClick,
}: {
  frame: GalleryFrame;
  index: number;
  smoothFloatIdx: MotionValue<number>;
  isFocused: boolean;
  onClick: () => void;
}) {
  const x = useTransform(smoothFloatIdx, cur => `${(index - cur) * 68}%`);
  const rotateY = useTransform(smoothFloatIdx, cur => {
    const delta = index - cur;
    return Math.max(-32, Math.min(32, -delta * 24));
  });
  const scale = useTransform(smoothFloatIdx, cur => {
    const abs = Math.abs(index - cur);
    return Math.max(0.72, 1 - Math.min(abs, 1.8) * 0.16);
  });
  // Keep focal & adjacent cards 100% opaque (zero ghost bleed-through!) and fade cleanly only on far wings
  const opacity = useTransform(smoothFloatIdx, cur => {
    const abs = Math.abs(index - cur);
    if (abs <= 1.15) return 1;
    if (abs >= 1.95) return 0;
    return Math.max(0, 1 - (abs - 1.15) / 0.8);
  });
  const filter = useTransform(smoothFloatIdx, cur => {
    const abs = Math.min(1.5, Math.abs(index - cur));
    return `brightness(${(1 - abs * 0.08).toFixed(3)})`;
  });
  const zIndex = useTransform(smoothFloatIdx, cur => Math.round(40 - Math.abs(index - cur) * 10));
  const pointerEvents = useTransform(opacity, o => (o < 0.15 ? 'none' : 'auto'));

  return (
    <motion.button
      type="button"
      data-cursor={isFocused ? 'ZOOM' : 'FOCUS'}
      className={`coverflow-card ${isFocused ? 'is-center' : ''} ${frame.kind === 'diagram' ? 'is-diagram' : ''} ${frame.kind === 'mobile' ? 'is-mobile' : ''}`}
      style={{
        x,
        rotateY,
        scale,
        opacity,
        filter,
        zIndex,
        pointerEvents,
        transformPerspective: 1300,
      }}
      onClick={onClick}
      aria-label={isFocused ? `Perbesar ${frame.label}` : `Fokus ke ${frame.label}`}
    >
      <img src={frame.src} alt={frame.caption} draggable={false} decoding="async" width={720} height={450} />
      {isFocused && (
        <span className="coverflow-zoom-pill">
          <Maximize2 size={12} /> Layar Penuh
        </span>
      )}
    </motion.button>
  );
}

/**
 * Sticky Scroll-Driven Continuous 3D Coverflow Stage
 * - Scroll naturally down/up to glide seamlessly across all 26 UI screens & diagrams (no tedious clicking!).
 * - Pure GPU MotionValue interpolation (velvety 60fps with zero React re-renders per scroll frame).
 * - Click any side card or macOS-style scrubber tick to jump cleanly via Lenis, or click center card for Lightbox.
 */
export function LampiranVaultSection({ onSelectProject }: LampiranVaultSectionProps) {
  const runwayRef = useRef<HTMLElement>(null);
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'posind' | 'diagram' | 'personal'>('all');
  const [activeIdx, setActiveIdx] = useState(0);
  const [hoveredTick, setHoveredTick] = useState<number | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 980px)').matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 980px)');
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const allFrames: GalleryFrame[] = useMemo(() => {
    const list: GalleryFrame[] = [];
    for (const proj of PROJECTS_DATA) {
      proj.attachments.forEach((att, idx) => {
        list.push({
          id: `${proj.id}-${idx}`,
          src: att.src,
          label: att.label,
          caption: att.caption,
          kind: att.kind ?? 'ui',
          project: proj,
          attIdx: idx,
        });
      });
    }
    return list;
  }, []);

  const filteredFrames = useMemo(() => {
    if (galleryFilter === 'all') return allFrames;
    if (galleryFilter === 'posind') return allFrames.filter(f => f.project.category === 'posind');
    if (galleryFilter === 'diagram') return allFrames.filter(f => f.kind === 'diagram');
    return allFrames.filter(f => f.project.category !== 'posind' && f.kind !== 'diagram');
  }, [allFrames, galleryFilter]);

  const maxIdx = Math.max(0, filteredFrames.length - 1);

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ['start start', 'end end'],
  });

  // Velvety Apple spring inertia matching #highlights
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 25,
    mass: 0.6,
  });

  const smoothFloatIdx = useTransform(smoothProgress, v => Math.max(0, Math.min(maxIdx, v * maxIdx)));

  useEffect(() => {
    if (isMobile) return;
    const unsub = smoothFloatIdx.on('change', v => {
      const next = Math.max(0, Math.min(maxIdx, Math.round(v)));
      setActiveIdx(prev => (prev === next ? prev : next));
    });
    return () => unsub();
  }, [smoothFloatIdx, maxIdx, isMobile]);

  const safeIdx = Math.min(activeIdx, maxIdx);
  const activeFrame = filteredFrames[safeIdx] ?? allFrames[0];
  const activeLightbox = lightboxIdx !== null ? filteredFrames[lightboxIdx] : null;

  useEffect(() => {
    if (lightboxIdx === null) return;
    window.dispatchEvent(new CustomEvent('portfolio:dialog', { detail: true }));
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIdx(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIdx(i => (i === null ? 0 : (i + 1) % filteredFrames.length));
      } else if (e.key === 'ArrowLeft') {
        setLightboxIdx(i => (i === null ? 0 : (i - 1 + filteredFrames.length) % filteredFrames.length));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      window.dispatchEvent(new CustomEvent('portfolio:dialog', { detail: false }));
    };
  }, [lightboxIdx, filteredFrames.length]);

  const scrollToFrame = (targetIdx: number) => {
    const clamped = Math.max(0, Math.min(maxIdx, targetIdx));
    if (isMobile || maxIdx === 0) {
      setActiveIdx(clamped);
      return;
    }
    if (!runwayRef.current) return;
    const top = runwayRef.current.offsetTop;
    const travel = Math.max(1, runwayRef.current.offsetHeight - window.innerHeight);
    smoothScrollTo(top + (clamped / maxIdx) * travel);
  };

  const handleMobileDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!isMobile || !filteredFrames.length) return;
    if (info.offset.x < -44 || info.velocity.x < -280) {
      setActiveIdx((safeIdx + 1) % filteredFrames.length);
    } else if (info.offset.x > 44 || info.velocity.x > 280) {
      setActiveIdx((safeIdx - 1 + filteredFrames.length) % filteredFrames.length);
    }
  };

  const tabs = [
    { id: 'all', label: `Semua (${allFrames.length})` },
    { id: 'posind', label: 'PT Pos Indonesia' },
    { id: 'diagram', label: 'Diagram & Alur' },
    { id: 'personal', label: 'Creative & Mobile' },
  ] as const;

  // Dynamic runway height so scroll pace per screen feels silky & natural for every filter tab
  const runwayHeightVh = isMobile ? undefined : Math.max(210, Math.min(480, 115 + filteredFrames.length * 14));

  // Mount only frames within +/- 2 of activeIdx on desktop (fade cleanly from 0 opacity, super lightweight!)
  const mountedIndices = useMemo(() => {
    const indices: number[] = [];
    const start = Math.max(0, safeIdx - 2);
    const end = Math.min(maxIdx, safeIdx + 2);
    for (let i = start; i <= end; i++) {
      indices.push(i);
    }
    return indices;
  }, [safeIdx, maxIdx]);

  return (
    <section
      id="lampiran"
      ref={runwayRef}
      className={`vault-section vault-scroll-runway ${isMobile ? 'is-mobile' : ''}`}
      style={runwayHeightVh ? { height: `${runwayHeightVh}vh` } : undefined}
    >
      <div className="vault-sticky-stage">
        <div className="vault-stage-inner">
          {/* COMPACT TOP HEADER + FILTER PILLS */}
          <div className="coverflow-sticky-head">
            <div className="coverflow-title-row">
              <div>
                <span className="section-kicker">03 / SCROLL-DRIVEN 3D ARCHIVE</span>
                <SplitHeadline
                  as="h2"
                  text="Visual"
                  accentText="Screens."
                  className="coverflow-compact-heading"
                />
              </div>
              <div className="coverflow-head-right">
                <span className="vault-privacy-pill">
                  <ShieldCheck size={13} />{' '}
                  {isMobile
                    ? `Geser kiri / kanan untuk jelajahi ${filteredFrames.length} layar`
                    : `Scroll turun / naik untuk menggeser semua ${filteredFrames.length} layar`}
                </span>
                <div className="coverflow-filter-row">
                  <div className="filter-pill-group" role="group" aria-label="Filter galeri lampiran">
                    {tabs.map(tab => {
                      const isActive = galleryFilter === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          aria-pressed={isActive}
                          className={`filter-pill ${isActive ? 'is-active' : ''}`}
                          onClick={() => {
                            setGalleryFilter(tab.id);
                            setActiveIdx(0);
                            setLightboxIdx(null);
                            if (!isMobile && runwayRef.current) {
                              smoothScrollTo(runwayRef.current.offsetTop);
                            }
                          }}
                        >
                          {isActive && (
                            <motion.span
                              layoutId="gallery-filter-pill"
                              className="filter-pill-bg"
                              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                            />
                          )}
                          <span className="filter-pill-label">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  <span className="coverflow-counter-mono">
                    <strong>{String(safeIdx + 1).padStart(2, '0')}</strong> /{' '}
                    {String(filteredFrames.length).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CONTINUOUS GPU SCROLL-DRIVEN 3D COVERFLOW ARENA (NO TEDIOUS LEFT/RIGHT CLICKING!) */}
          <div className="coverflow-arena">
            {isMobile ? (
              <motion.div
                className="coverflow-track is-mobile-swipe"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.16}
                onDragEnd={handleMobileDragEnd}
              >
                {[-1, 0, 1].map(offset => {
                  const n = filteredFrames.length;
                  if (n === 0) return null;
                  if (offset !== 0 && n < 2) return null;
                  const idx = (safeIdx + offset + n) % n;
                  if (offset === 1 && n === 2 && idx === (safeIdx - 1 + n) % n) return null;
                  const frame = filteredFrames[idx];
                  const isCenter = offset === 0;
                  return (
                    <motion.button
                      key={`${frame.id}-${offset}`}
                      type="button"
                      className={`coverflow-card ${isCenter ? 'is-center' : ''} ${frame.kind === 'diagram' ? 'is-diagram' : ''} ${frame.kind === 'mobile' ? 'is-mobile' : ''}`}
                      initial={false}
                      animate={{
                        x: `${offset * 78}%`,
                        scale: isCenter ? 1 : 0.84,
                        rotateY: offset === 0 ? 0 : offset > 0 ? -24 : 24,
                        opacity: isCenter ? 1 : 0.88,
                        zIndex: isCenter ? 30 : 15,
                      }}
                      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                      style={{ transformPerspective: 1100 }}
                      onClick={() => {
                        if (isCenter) setLightboxIdx(idx);
                        else setActiveIdx(idx);
                      }}
                    >
                      <img src={frame.src} alt={frame.caption} draggable={false} decoding="async" width={720} height={450} />
                      {isCenter && (
                        <span className="coverflow-zoom-pill is-always-touch">
                          <Maximize2 size={12} /> Zoom
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
            ) : (
              <div className="coverflow-track is-scroll-driven">
                {mountedIndices.map(idx => {
                  const frame = filteredFrames[idx];
                  if (!frame) return null;
                  const isFocused = idx === safeIdx;
                  return (
                    <CoverflowScrollCard
                      key={frame.id}
                      frame={frame}
                      index={idx}
                      smoothFloatIdx={smoothFloatIdx}
                      isFocused={isFocused}
                      onClick={() => {
                        const currentFloat = smoothFloatIdx.get();
                        if (Math.abs(idx - currentFloat) < 0.35) {
                          setLightboxIdx(idx);
                        } else {
                          scrollToFrame(idx);
                        }
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* MINIMALIST CAPTION DECK + LIVE INTERACTIVE SCRUBBER DOCK */}
          {activeFrame && (
            <div className="coverflow-bottom-deck">
              <div className="coverflow-caption-deck">
                <motion.div
                  key={activeFrame.id}
                  className="coverflow-caption-copy"
                  initial={{ opacity: 0.45, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="coverflow-proj-kicker">
                    {activeFrame.project.number} · {activeFrame.project.title}
                  </span>
                  <h3>{activeFrame.label}</h3>
                  <p>{activeFrame.caption}</p>
                </motion.div>

                <div className="coverflow-caption-actions">
                  <button
                    type="button"
                    className="coverflow-btn-secondary"
                    onClick={() => setLightboxIdx(safeIdx)}
                  >
                    <Maximize2 size={13} />
                    <span>Zoom</span>
                  </button>
                  <button
                    type="button"
                    className="exhibition-case-btn"
                    onClick={() => onSelectProject(activeFrame.project, activeFrame.attIdx)}
                  >
                    <span>Buka Case Study</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>

              <div
                className="coverflow-scrubber-dock"
                onMouseLeave={() => setHoveredTick(null)}
                role="group"
                aria-label="Lompat cepat ke layar"
              >
                {filteredFrames.map((f, idx) => {
                  const isAct = idx === safeIdx;
                  const dist = hoveredTick !== null ? Math.abs(hoveredTick - idx) : 99;
                  const liftScale = isAct ? 1.55 : dist === 0 ? 1.7 : dist === 1 ? 1.28 : 1;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      aria-pressed={isAct}
                      className={`coverflow-tick ${isAct ? 'is-active' : ''}`}
                      onMouseEnter={() => setHoveredTick(idx)}
                      onClick={() => scrollToFrame(idx)}
                      aria-label={`${idx + 1}. ${f.label} — ${f.project.title}`}
                      title={`${String(idx + 1).padStart(2, '0')} · ${f.label} (${f.project.title})`}
                    >
                      <span
                        className="coverflow-tick-bar"
                        style={{ transform: `scaleY(${liftScale})` }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FULL-SCREEN LIGHTBOX */}
      <AnimatePresence>
        {activeLightbox && lightboxIdx !== null && (
          <motion.div
            className="lightbox-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label={activeLightbox.caption}
            data-lenis-prevent
            onClick={() => setLightboxIdx(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="lightbox-card"
              onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            >
              <div className="lightbox-top">
                <span>
                  <Sparkles size={13} className="crimson-icon" /> {String(lightboxIdx + 1).padStart(2, '0')}/
                  {String(filteredFrames.length).padStart(2, '0')} · {activeLightbox.project.title}
                </span>
                <button
                  type="button"
                  className="dossier-close-btn"
                  onClick={() => setLightboxIdx(null)}
                  aria-label="Tutup pratinjau"
                >
                  <X size={15} /> ESC
                </button>
              </div>

              <div className="lightbox-img-stage">
                <img src={activeLightbox.src} alt={activeLightbox.caption} />
                <button
                  type="button"
                  className="stage-nav stage-prev"
                  onClick={() =>
                    setLightboxIdx((lightboxIdx - 1 + filteredFrames.length) % filteredFrames.length)
                  }
                  aria-label="Gambar sebelumnya"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  className="stage-nav stage-next"
                  onClick={() => setLightboxIdx((lightboxIdx + 1) % filteredFrames.length)}
                  aria-label="Gambar berikutnya"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className="lightbox-bottom">
                <p>{activeLightbox.caption}</p>
                <div className="lightbox-actions">
                  <a href={activeLightbox.src} target="_blank" rel="noopener noreferrer" className="mini-action-link">
                    Gambar Asli <ExternalLink size={12} />
                  </a>
                  <button
                    type="button"
                    className="mini-action-primary"
                    onClick={() => {
                      const p = activeLightbox.project;
                      const aIdx = activeLightbox.attIdx;
                      setLightboxIdx(null);
                      onSelectProject(p, aIdx);
                    }}
                  >
                    Lihat Case Study <ArrowUpRight size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
