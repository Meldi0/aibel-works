import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type PanInfo,
} from 'motion/react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, ExternalLink } from 'lucide-react';
import { PROFILE_INFO, PROJECTS_DATA } from '../data/portfolioData';
import type { ProjectItem } from '../types';
import { smoothScrollTo } from '../lib/smoothScroll';
import { SplitHeadline } from './KineticText';

interface SwissHighlightDeckProps {
  onSelectProject: (project: ProjectItem, attIdx?: number) => void;
}

interface CurvedSlideSpec {
  id: string;
  projectId: string;
  slideCode: string;
  navLabel: string;
  theme: 'red' | 'black' | 'white';
  auraClass: string;
  bleedNum?: string;
}

/**
 * Pure GPU MotionValue Curved Wheel Card (0 React re-renders during scroll!)
 * Continuous C-infinity math eliminates any snapping/jitter between cards.
 */
function SwissWheelCard({
  index,
  total,
  theme,
  smoothProgress,
  isFocused,
  isMobile,
  onClick,
  children,
}: {
  index: number;
  total: number;
  theme: 'red' | 'black' | 'white';
  smoothProgress: MotionValue<number>;
  isFocused: boolean;
  isMobile: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  const maxIdx = Math.max(1, total - 1);

  const y = useTransform(smoothProgress, p => {
    const offset = index - p * maxIdx;
    const edgeBias = (1 - p) * -40 + p * 22;
    return offset * 314 + edgeBias;
  });

  const x = useTransform(smoothProgress, p => {
    const offset = index - p * maxIdx;
    return -(offset * offset) * 34;
  });

  const rotate = useTransform(smoothProgress, p => {
    const offset = index - p * maxIdx;
    return offset * 9.5 - 2.6 * (1 - p);
  });

  const scale = useTransform(smoothProgress, p => {
    const absOff = Math.abs(index - p * maxIdx);
    return Math.max(0.82, 1 - absOff * 0.075);
  });

  const opacity = useTransform(smoothProgress, p => {
    const absOff = Math.abs(index - p * maxIdx);
    return Math.max(0, 1 - Math.max(0, absOff - 0.85) * 0.56);
  });

  const zIndex = useTransform(smoothProgress, p => {
    const absOff = Math.abs(index - p * maxIdx);
    return Math.round(40 - absOff * 10);
  });

  const pointerEvents = useTransform(opacity, o => (o < 0.14 ? 'none' : 'auto'));

  return (
    <motion.article
      data-cursor={isFocused ? 'OPEN' : 'FOCUS'}
      className={`swiss-card swiss-${theme} wheel-arc-card ${isFocused ? 'is-focused' : ''}`}
      style={
        isMobile
          ? undefined
          : {
              x,
              y,
              rotate,
              scale,
              opacity,
              zIndex,
              pointerEvents,
            }
      }
      onClick={onClick}
    >
      {children}
    </motion.article>
  );
}

const SLIDES: CurvedSlideSpec[] = [
  {
    id: 'slide-tarif',
    projectId: 'ipos5-tarif-wilayah',
    slideCode: '01 · METRICS & TARIFF',
    navLabel: 'iPOS5 Tarif & 83K Wilayah',
    theme: 'red',
    auraClass: 'aura-coral',
    bleedNum: '01',
  },
  {
    id: 'slide-prisma',
    projectId: 'prisma-pos-helpdesk',
    slideCode: '2.4 · PROCESS & HELPDESK',
    navLabel: 'PRISMA POS (Ubuntu)',
    theme: 'black',
    auraClass: 'aura-sapphire',
  },
  {
    id: 'slide-ipos5',
    projectId: 'ipos5-delivery-suite',
    slideCode: '2.2 · OPPORTUNITY & SUITE',
    navLabel: 'iPOS5 + MongoDB Simulator',
    theme: 'white',
    auraClass: 'aura-ice',
  },
  {
    id: 'slide-metrics',
    projectId: 'regional-performance-dashboard',
    slideCode: '4.1 · NATIONAL TELEMETRY',
    navLabel: 'Regional Q1 & War Room',
    theme: 'black',
    auraClass: 'aura-iris',
  },
  {
    id: 'slide-snap',
    projectId: 'cisspic-photo-studio',
    slideCode: '05 · CREATIVE STUDIO',
    navLabel: 'SNAPDAYS Photobooth Live',
    theme: 'red',
    auraClass: 'aura-coral',
    bleedNum: '05',
  },
];

export function SwissHighlightDeck({ onSelectProject }: SwissHighlightDeckProps) {
  const runwayRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [swipeDir, setSwipeDir] = useState(1);
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

  // Velvety GPU-accelerated spring for liquid-smooth card gliding (zero React frame churn!)
  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ['start start', 'end end'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 68,
    damping: 24,
    mass: 0.65,
  });

  // Kinetic Swiss orbital dial rotation tied directly to scroll!
  const dialRotate = useTransform(smoothProgress, [0, 1], [-18, 78]);
  const innerRingRotate = useTransform(smoothProgress, [0, 1], [32, -48]);
  const railProgressScaleX = useTransform(smoothProgress, [0, 1], [0.06, 1]);

  useEffect(() => {
    if (isMobile) return;
    const unsub = smoothProgress.on('change', v => {
      const next = Math.max(0, Math.min(SLIDES.length - 1, Math.round(v * (SLIDES.length - 1))));
      setActiveIdx(prev => (prev === next ? prev : next));
    });
    return () => unsub();
  }, [smoothProgress, isMobile]);

  const activeAura = SLIDES[activeIdx]?.auraClass ?? 'aura-coral';

  const scrollToSlide = (targetIdx: number) => {
    if (isMobile) {
      setSwipeDir(targetIdx >= activeIdx ? 1 : -1);
      setActiveIdx(((targetIdx % SLIDES.length) + SLIDES.length) % SLIDES.length);
      return;
    }
    const clamped = Math.max(0, Math.min(SLIDES.length - 1, targetIdx));
    if (!runwayRef.current) return;
    const top = runwayRef.current.offsetTop;
    const travel = runwayRef.current.offsetHeight - window.innerHeight;
    const targetY = top + (clamped / (SLIDES.length - 1)) * travel;
    smoothScrollTo(targetY);
  };

  const byId = (id: string) => PROJECTS_DATA.find(p => p.id === id) ?? PROJECTS_DATA[0];
  const pTarif = byId('ipos5-tarif-wilayah');
  const pPrisma = byId('prisma-pos-helpdesk');
  const pIpos5 = byId('ipos5-delivery-suite');
  const pRegional = byId('regional-performance-dashboard');
  const pWarRoom = byId('war-room-control-tower');
  const pSnapdays = byId('cisspic-photo-studio');

  const activeProject = byId(SLIDES[activeIdx].projectId);

  const handleCardClick = (idx: number, proj: ProjectItem) => {
    const currentFloat = isMobile ? activeIdx : smoothProgress.get() * (SLIDES.length - 1);
    if (Math.abs(idx - currentFloat) > 0.35) {
      scrollToSlide(idx);
    } else {
      onSelectProject(proj, 0);
    }
  };

  const handleMobileSwipe = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!isMobile) return;
    if (info.offset.x < -46 || info.velocity.x < -300) {
      setSwipeDir(1);
      setActiveIdx(i => (i + 1) % SLIDES.length);
    } else if (info.offset.x > 46 || info.velocity.x > 300) {
      setSwipeDir(-1);
      setActiveIdx(i => (i - 1 + SLIDES.length) % SLIDES.length);
    }
  };

  const renderCardInner = (idx: number) => {
    if (idx === 0) {
      return (
        <>
          <span className="swiss-bleed-num" aria-hidden="true">01</span>
          <div className="swiss-card-meta">
            <span>1.1 · FLAGSHIP LARAVEL 12</span>
            <span>PT POS INDONESIA · NOV 2026</span>
          </div>
          <div className="swiss-red-grid">
            <div className="swiss-red-copy">
              <span className="swiss-label-tag">METRICS &amp; TARIFF ENGINE</span>
              <h3>iPOS5 PENGELOLAAN TARIF &amp; WILAYAH</h3>
              <p>
                Kalkulator tarif resmi PT Pos Indonesia dengan dataset penuh <strong>Kepmendagri 2025</strong>,
                auto-fill 4 tingkat wilayah, dan pencatatan produksi real-time.
              </p>
              <div className="swiss-red-kpis">
                <div><strong>83.762</strong><span>DESA/KEL</span></div>
                <div><strong>8.352</strong><span>KANTOR</span></div>
                <div><strong>9.002</strong><span>TARIF</span></div>
              </div>
              <span className="swiss-cta-inline">Klik untuk detail lengkap <ArrowUpRight size={14} /></span>
            </div>
            <div className="swiss-frame-shot">
              <img src={pTarif.image} alt={pTarif.title} loading="lazy" decoding="async" width={640} height={400} />
            </div>
          </div>
        </>
      );
    }

    if (idx === 1) {
      return (
        <>
          <div className="swiss-card-meta">
            <span>2.4 · ENTERPRISE HELPDESK SYSTEM</span>
            <span>DEPLOYED ON UBUNTU SERVER</span>
          </div>
          <div className="swiss-black-layout">
            <div className="swiss-process-col">
              <div className="swiss-section-tag">
                <span>2.4</span>
                <strong>PRISMA POS (POSO)</strong>
              </div>
              <div className="swiss-hairline-list">
                <div className="swiss-hl-row">
                  <span className="hl-idx">1</span>
                  <strong className="hl-title">TICKETING &amp; KANBAN</strong>
                  <small>Portal kendala KCU/KC/KCP, chat terpadu, &amp; Lightbox lampiran.</small>
                </div>
                <div className="swiss-hl-row">
                  <span className="hl-idx">2</span>
                  <strong className="hl-title">SLA &amp; MFA OTP</strong>
                  <small>Alert SLA real-time, Telegram Bot Gateway, &amp; 3 peran RBAC.</small>
                </div>
                <div className="swiss-hl-row">
                  <span className="hl-idx">3</span>
                  <strong className="hl-title">UBUNTU DEPLOY</strong>
                  <small>Dynamic DB Switcher (Online/Offline) &amp; server lokal internal.</small>
                </div>
              </div>
            </div>
            <div className="swiss-black-visual">
              <div className="swiss-frame-shot">
                <img src={pPrisma.image} alt={pPrisma.title} loading="lazy" decoding="async" width={640} height={400} />
              </div>
              <span className="swiss-cta-inline">Klik untuk 4 Lampiran PRISMA POS <ArrowUpRight size={14} /></span>
            </div>
          </div>
        </>
      );
    }

    if (idx === 2) {
      return (
        <>
          <div className="swiss-card-meta">
            <span>2.2 · FLAGSHIP LOGISTICS SUITE</span>
            <span>KCU CIMAHI 40511 &amp; SPP BANDUNG</span>
          </div>
          <div className="swiss-white-layout">
            <div className="swiss-white-copy">
              <div className="swiss-section-tag is-dark">
                <span>2.2</span>
                <strong>iPOS5 DELIVERY &amp; SIMULATOR</strong>
              </div>
              <div className="swiss-white-rows">
                <div className="swiss-w-row">
                  <span className="w-num">1</span>
                  <div>
                    <strong>GAP</strong>
                    <p>Status kiriman lintas 5 kategori layanan &amp; filter harian tersebar tanpa simulator armada.</p>
                  </div>
                </div>
                <div className="swiss-w-row">
                  <span className="w-num">2</span>
                  <div>
                    <strong>SHIFT</strong>
                    <p>
                      Membangun iPOS5 Redesign (Milk Run, Filter Per Day),{' '}
                      <b className="inline-b">MongoDB Live Simulator</b>, &amp; Master Kantor GeoJSON.
                    </p>
                  </div>
                </div>
              </div>
              <span className="swiss-cta-inline is-dark">Klik untuk 4 Lampiran iPOS5 <ArrowUpRight size={14} /></span>
            </div>
            <div className="swiss-white-visual-stack">
              <div className="swiss-frame-shot is-compact">
                <img src={pIpos5.image} alt={pIpos5.title} loading="lazy" decoding="async" width={640} height={400} />
              </div>
              <div className="swiss-mini-plate">
                <img
                  src="./lampiran/ipos5-simulator-mongo.webp"
                  alt="MongoDB Live Simulator"
                  loading="lazy"
                  decoding="async"
                  width={320}
                  height={200}
                />
                <span>MongoDB Live Cluster Simulator</span>
              </div>
            </div>
          </div>
        </>
      );
    }

    if (idx === 3) {
      return (
        <>
          <div className="swiss-card-meta">
            <span>4.1 · NATIONAL TELEMETRY &amp; WAR ROOM</span>
            <span>REGIONAL Q1 2026 &amp; CONTROL TOWER</span>
          </div>
          <div className="swiss-metrics-layout">
            <div className="swiss-portrait-inset">
              <img
                src={PROFILE_INFO.portraitImage}
                alt="Muhamad Eldi — Operations Control"
                loading="lazy"
                decoding="async"
                width={320}
                height={420}
              />
              <span className="inset-tag">ELDI // OPS CONTROL</span>
            </div>
            <div className="swiss-metrics-data">
              <div className="swiss-kpi-strip">
                <div><strong>14.36M</strong><span>Q1 SHIPMENTS</span></div>
                <div><strong>94.8%</strong><span>ON-TIME RATE</span></div>
                <div><strong>18</strong><span>NOPEN HUBS</span></div>
              </div>
              <div className="swiss-block-viz" aria-hidden="true">
                <span className="viz-label">PKH / EC3</span>
                <div className="viz-bars">
                  <span className="bar-red" style={{ width: '56%' }} />
                  <span className="bar-white" style={{ width: '28%' }} />
                  <span className="bar-dim" style={{ width: '16%' }} />
                </div>
              </div>
              <div className="swiss-region-table">
                <div><span>REGIONAL 1 · MEDAN</span><b>2.03M</b></div>
                <div><span>REGIONAL 2 · JAKARTA</span><b>3.12M</b></div>
                <div><span>REGIONAL 3 · BANDUNG</span><b>1.18M</b></div>
                <div><span>WAR ROOM · BANDUNG–CIMAHI</span><b>613.3K KG</b></div>
              </div>
              <div className="swiss-dual-ctas">
                <button
                  type="button"
                  className="swiss-chip-btn"
                  onClick={e => {
                    e.stopPropagation();
                    onSelectProject(pRegional, 0);
                  }}
                >
                  Regional Dashboard <ArrowUpRight size={13} />
                </button>
                <button
                  type="button"
                  className="swiss-chip-btn is-red"
                  onClick={e => {
                    e.stopPropagation();
                    onSelectProject(pWarRoom, 0);
                  }}
                >
                  War Room Tower <ArrowUpRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <span className="swiss-bleed-num" aria-hidden="true">05</span>
        <div className="swiss-card-meta">
          <span>5.0 · CREATIVE WEB STUDIO (LIVE)</span>
          <span>WEBRTC + CANVAS · VERCEL</span>
        </div>
        <div className="swiss-red-grid">
          <div className="swiss-red-copy">
            <span className="swiss-label-tag">PERSONAL CREATIVE STUDIO</span>
            <h3>SNAPDAYS (CISSPIC) — PHOTOBOOTH</h3>
            <p>
              Studio photobooth web interaktif dengan kamera WebRTC, 4-Cut photo strip composer, themed frames, stiker,
              dan mode ala Live Photo 100% on-device.
            </p>
            <div className="swiss-dual-ctas">
              <a
                href="https://cisspic.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="swiss-chip-btn is-white"
                onClick={e => e.stopPropagation()}
              >
                cisspic.vercel.app <ExternalLink size={13} />
              </a>
              <span className="swiss-cta-inline">Detail Case Study <ArrowUpRight size={14} /></span>
            </div>
          </div>
          <div className="swiss-frame-shot">
            <img src={pSnapdays.image} alt={pSnapdays.title} loading="lazy" decoding="async" width={640} height={400} />
          </div>
        </div>
      </>
    );
  };

  return (
    <section
      id="highlights"
      ref={runwayRef}
      className={`wheel-runway ${activeAura} ${isMobile ? 'is-mobile' : ''}`}
    >
      <div className="wheel-sticky-stage">
        {/* Reactive Chromatic Liquid Glass Stage Aura (morphs hue per active card!) */}
        <div className="wheel-ambient-aura" aria-hidden="true" />

        {/* Live Scroll-Driven Rotating Swiss Orbital Dial SVG */}
        {!isMobile && (
          <div className="wheel-orbital-backdrop" aria-hidden="true">
            <motion.svg
              className="wheel-orbital-svg"
              viewBox="0 0 800 800"
              style={{ rotate: dialRotate }}
            >
              <circle cx="400" cy="400" r="350" fill="none" stroke="rgba(17,18,22,0.08)" strokeWidth="1" strokeDasharray="4 10" />
              <circle cx="400" cy="400" r="285" fill="none" stroke="rgba(224,58,34,0.14)" strokeWidth="1" />
              {Array.from({ length: 36 }).map((_, i) => {
                const angle = (i * 10 * Math.PI) / 180;
                const r1 = i % 3 === 0 ? 334 : 342;
                const r2 = 350;
                return (
                  <line
                    key={i}
                    x1={400 + Math.cos(angle) * r1}
                    y1={400 + Math.sin(angle) * r1}
                    x2={400 + Math.cos(angle) * r2}
                    y2={400 + Math.sin(angle) * r2}
                    stroke={i % 6 === 0 ? 'rgba(224,58,34,0.45)' : 'rgba(17,18,22,0.14)'}
                    strokeWidth={i % 6 === 0 ? '1.6' : '1'}
                  />
                );
              })}
            </motion.svg>
            <motion.svg
              className="wheel-orbital-inner"
              viewBox="0 0 600 600"
              style={{ rotate: innerRingRotate }}
            >
              <circle cx="300" cy="300" r="220" fill="none" stroke="rgba(17,18,22,0.06)" strokeWidth="1" strokeDasharray="18 14" />
            </motion.svg>
          </div>
        )}

        <div className="wheel-layout">
          {/* LEFT RAIL: Clean Borderless Editorial Rail (Zero Chunky Box!) */}
          <div className="wheel-rail">
            <div>
              <span className="swiss-kicker">01 / SCROLL-DRIVEN DECK</span>
              <SplitHeadline
                as="h2"
                text="Flagship"
                accentText="Highlights."
                breakBeforeAccent
                className="swiss-title"
              />
              <p className="wheel-rail-sub">
                {isMobile ? (
                  <>
                    <strong>Geser kartu ke kiri/kanan</strong> atau pilih tab di bawah. Ketuk kartu untuk membuka studi
                    kasus &amp; lampiran lengkapnya.
                  </>
                ) : (
                  <>
                    Scroll ke bawah atau ke atas untuk <strong>menggulir kartu melengkung</strong> di kanan. Klik kartu
                    yang sedang fokus untuk membuka studi kasus &amp; lampirannya.
                  </>
                )}
              </p>
            </div>

            {/* Live Scroll-Synced Hairline Progress Track */}
            <div className="wheel-progress-track" aria-hidden="true">
              <motion.div
                className="wheel-progress-fill"
                style={{ scaleX: isMobile ? (activeIdx + 1) / SLIDES.length : railProgressScaleX }}
              />
            </div>

            {/* Interactive 5-Slide Arc Index Dial with Frosted Active Indicator */}
            <div className="wheel-index-list" role="group" aria-label="Pilih highlight projek">
              {SLIDES.map((s, idx) => {
                const isAct = activeIdx === idx;
                return (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={isAct}
                    className={`wheel-index-btn ${isAct ? 'is-active' : ''}`}
                    onClick={() => scrollToSlide(idx)}
                  >
                    {isAct && (
                      <motion.span
                        layoutId="wheel-active-bg"
                        className="wheel-index-active-bg"
                        transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                      />
                    )}
                    <span className="wheel-idx-num">0{idx + 1}</span>
                    <span className="wheel-idx-name">{s.navLabel}</span>
                    {isAct && <span className="wheel-active-dot" />}
                  </button>
                );
              })}
            </div>

            {/* Active Slide Quick Action & Controls */}
            <div className="wheel-rail-footer">
              <div className="wheel-arrows-row">
                <div className="wheel-arrows">
                  <button
                    type="button"
                    onClick={() => scrollToSlide(activeIdx - 1)}
                    disabled={!isMobile && activeIdx === 0}
                    aria-label="Slide sebelumnya"
                  >
                    {isMobile ? <ArrowLeft size={16} /> : <ArrowUp size={16} />}
                  </button>
                  <span className="wheel-counter">
                    0{activeIdx + 1} / 0{SLIDES.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => scrollToSlide(activeIdx + 1)}
                    disabled={!isMobile && activeIdx === SLIDES.length - 1}
                    aria-label="Slide berikutnya"
                  >
                    {isMobile ? <ArrowRight size={16} /> : <ArrowDown size={16} />}
                  </button>
                </div>
                <span className="wheel-active-client">{activeProject.year}</span>
              </div>
              <button
                type="button"
                className="wheel-open-dossier-btn"
                onClick={() => onSelectProject(activeProject, 0)}
              >
                <span>Penjelasan &amp; Lampiran</span>
                <ArrowUpRight size={15} />
              </button>
            </div>
          </div>

          {/* RIGHT STAGE: SILKY GPU-DRIVEN CURVED WHEEL (DESKTOP) / TOUCH-SWIPE DECK (MOBILE & TABLET) */}
          <div className="wheel-arc-viewport">
            {isMobile ? (
              <div className="wheel-mobile-swipe-wrap">
                <AnimatePresence mode="wait">
                  <motion.article
                    key={SLIDES[activeIdx].id}
                    className={`swiss-card swiss-${SLIDES[activeIdx].theme} wheel-arc-card is-focused is-mobile-swipe`}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.18}
                    onDragEnd={handleMobileSwipe}
                    initial={{ opacity: 0, x: swipeDir > 0 ? 34 : -34, scale: 0.96 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: swipeDir > 0 ? -34 : 34, scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                    onClick={() => onSelectProject(activeProject, 0)}
                  >
                    {renderCardInner(activeIdx)}
                  </motion.article>
                </AnimatePresence>
                <span className="wheel-mobile-swipe-hint">← Geser kartu · Ketuk untuk buka Case Study →</span>
              </div>
            ) : (
              SLIDES.map((slide, idx) => {
                const proj = byId(slide.projectId);
                return (
                  <SwissWheelCard
                    key={slide.id}
                    index={idx}
                    total={SLIDES.length}
                    theme={slide.theme}
                    smoothProgress={smoothProgress}
                    isFocused={idx === activeIdx}
                    isMobile={isMobile}
                    onClick={() => handleCardClick(idx, proj)}
                  >
                    {renderCardInner(idx)}
                  </SwissWheelCard>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
