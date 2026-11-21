import { lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { MotionConfig } from 'motion/react';
import { PROJECTS_DATA } from './data/portfolioData';
import type { ProjectItem } from './types';
import { GlassCursorHalo } from './components/KineticText';
import { Navigation } from './components/Navigation';
import { EditorialHero } from './components/EditorialHero';
import { useMotionSettings } from './lib/useMotionSettings';
import { smoothScrollTo } from './lib/smoothScroll';

const SwissHighlightDeck = lazy(() =>
  import('./components/SwissHighlightDeck').then(m => ({ default: m.SwissHighlightDeck })),
);
const ProjectsArchive = lazy(() =>
  import('./components/ProjectsArchive').then(m => ({ default: m.ProjectsArchive })),
);
const LampiranVaultSection = lazy(() =>
  import('./components/LampiranVaultSection').then(m => ({ default: m.LampiranVaultSection })),
);
const EditorialResumeSection = lazy(() =>
  import('./components/EditorialResumeSection').then(m => ({ default: m.EditorialResumeSection })),
);
const ContactSection = lazy(() =>
  import('./components/ContactSection').then(m => ({ default: m.ContactSection })),
);
const LivingGlassBackdrop = lazy(() =>
  import('./components/LivingGlassBackdrop').then(m => ({ default: m.LivingGlassBackdrop })),
);
const ProjectDossierModal = lazy(() =>
  import('./components/ProjectDossierModal').then(m => ({ default: m.ProjectDossierModal })),
);
const CommandPalette = lazy(() =>
  import('./components/CommandPalette').then(m => ({ default: m.CommandPalette })),
);
const TerminalDrawer = lazy(() =>
  import('./components/TerminalDrawer').then(m => ({ default: m.TerminalDrawer })),
);
const SoundAmbience = lazy(() =>
  import('./components/SoundAmbience').then(m => ({ default: m.SoundAmbience })),
);

function DeferredSection({
  ready,
  fallback,
  children,
}: {
  ready: boolean;
  fallback: ReactNode;
  children: ReactNode;
}) {
  if (!ready) return <>{fallback}</>;
  return <Suspense fallback={fallback}>{children}</Suspense>;
}

export default function App() {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [sectionsReady, setSectionsReady] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<{
    project: ProjectItem;
    attIdx: number;
  } | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const { reduced, desktop } = useMotionSettings();

  const ensureReady = useCallback(() => {
    setSectionsReady(true);
  }, []);

  // Mount below-the-fold sections immediately on first scroll / pointer / key interaction (or if URL has a #hash)
  useEffect(() => {
    if (window.location.hash && window.location.hash !== '#hero') {
      setSectionsReady(true);
      return;
    }
    const activate = () => setSectionsReady(true);
    window.addEventListener('scroll', activate, { once: true, passive: true });
    window.addEventListener('wheel', activate, { once: true, passive: true });
    window.addEventListener('touchstart', activate, { once: true, passive: true });
    window.addEventListener('pointerdown', activate, { once: true, passive: true });
    window.addEventListener('keydown', activate, { once: true, passive: true });
    return () => {
      window.removeEventListener('scroll', activate);
      window.removeEventListener('wheel', activate);
      window.removeEventListener('touchstart', activate);
      window.removeEventListener('pointerdown', activate);
      window.removeEventListener('keydown', activate);
    };
  }, []);

  // Trigger visitor radar cleanly on first user interaction or after initial load settles (zero Lighthouse overhead)
  useEffect(() => {
    let triggered = false;
    const runTracker = () => {
      if (triggered) return;
      triggered = true;
      import('./lib/visitorTracker')
        .then(m => m.initVisitorTracker())
        .catch(() => {});
    };
    const onInteract = () => runTracker();
    window.addEventListener('pointerdown', onInteract, { once: true, passive: true });
    window.addEventListener('scroll', onInteract, { once: true, passive: true });
    const fallbackTimer = window.setTimeout(runTracker, 4200);
    return () => {
      window.clearTimeout(fallbackTimer);
      window.removeEventListener('pointerdown', onInteract);
      window.removeEventListener('scroll', onInteract);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen(v => !v);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!progressRef.current) return;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      progressRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, window.scrollY / max))})`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (reduced || !desktop || !sectionsReady) {
      return () => window.removeEventListener('scroll', onScroll);
    }

    let cancelled = false;
    let rafId = 0;
    let lenisInstance: {
      raf: (t: number) => void;
      scrollTo: (top: number, opts?: { duration?: number }) => void;
      stop: () => void;
      start: () => void;
      destroy: () => void;
    } | null = null;

    const onDialog = (event: Event) => {
      const isOpen = (event as CustomEvent<boolean>).detail;
      if (!lenisInstance) return;
      if (isOpen) lenisInstance.stop();
      else lenisInstance.start();
    };
    window.addEventListener('portfolio:dialog', onDialog);

    import('lenis')
      .then(({ default: Lenis }) => {
        if (cancelled) return;
        const lenis = new Lenis({ duration: 1.05, smoothWheel: true, syncTouch: false });
        lenisInstance = lenis;
        window.__lenisScrollTo = (top: number) => {
          lenis.scrollTo(top, { duration: 1.05 });
        };
        const raf = (time: number) => {
          if (cancelled) return;
          lenis.raf(time);
          onScroll();
          rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      delete window.__lenisScrollTo;
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('portfolio:dialog', onDialog);
      lenisInstance?.destroy();
    };
  }, [reduced, desktop, sectionsReady]);

  const handleSelectProject = useCallback((project: ProjectItem, attIdx = 0) => {
    setSectionsReady(true);
    setSelectedProject({ project, attIdx });
  }, []);

  const handleToggleAudio = useCallback(() => {
    setSectionsReady(true);
    setIsAudioPlaying(v => !v);
  }, []);

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}>
      <div className="studio-gallery-app">
        {desktop && <GlassCursorHalo />}

        <div className="scroll-progress-track" aria-hidden="true">
          <div ref={progressRef} className="scroll-progress-bar" />
        </div>

        <a className="skip-link" href="#highlights" onClick={ensureReady}>
          Skip to Highlights
        </a>

        <Navigation
          onOpenCommand={() => setCommandOpen(true)}
          onOpenTerminal={() => setTerminalOpen(true)}
          isAudioPlaying={isAudioPlaying}
          onToggleAudio={handleToggleAudio}
          projectCount={PROJECTS_DATA.length}
          onEnsureReady={ensureReady}
        />

        <main id="main-content" className="studio-main-layer">
          {/* ACT I: DARK TITANIUM LIQUID GLASS KEYNOTE HERO (Instant above-the-fold chunk) */}
          <EditorialHero onSelectProject={handleSelectProject} />

          {/* ACT II: CLEAN STUDIO TITANIUM CURVED SWISS WHEEL */}
          <DeferredSection
            ready={sectionsReady}
            fallback={<section id="highlights" style={{ minHeight: desktop ? '400vh' : '90vh', background: '#eceef3' }} />}
          >
            <SwissHighlightDeck onSelectProject={handleSelectProject} />
          </DeferredSection>

          {/* ACT III: PURE PORCELAIN GALLERY (12 WORKS + 26 SCREENS) */}
          <div className="light-gallery-band">
            <DeferredSection
              ready={sectionsReady}
              fallback={<section id="projects" style={{ minHeight: '100vh' }} />}
            >
              <ProjectsArchive onSelectProject={handleSelectProject} />
            </DeferredSection>
            <DeferredSection
              ready={sectionsReady}
              fallback={<section id="lampiran" style={{ minHeight: '90vh' }} />}
            >
              <LampiranVaultSection onSelectProject={handleSelectProject} />
            </DeferredSection>
          </div>

          {/* ACT IV: DARK SPACE TITANIUM LIQUID GLASS FINALE (PROCESS + CONTACT) */}
          <div className="dark-finale-band">
            <DeferredSection ready={sectionsReady} fallback={null}>
              <LivingGlassBackdrop variant="finale" />
            </DeferredSection>
            <div className="dark-finale-inner">
              <DeferredSection
                ready={sectionsReady}
                fallback={<section id="process" style={{ minHeight: '80vh' }} />}
              >
                <EditorialResumeSection onOpenTerminal={() => setTerminalOpen(true)} />
              </DeferredSection>
              <DeferredSection
                ready={sectionsReady}
                fallback={<section id="contact" style={{ minHeight: '80vh' }} />}
              >
                <ContactSection
                  onBackToTop={() => {
                    smoothScrollTo(0);
                  }}
                />
              </DeferredSection>
            </div>
          </div>
        </main>

        {selectedProject && (
          <Suspense fallback={null}>
            <ProjectDossierModal
              project={selectedProject.project}
              initialAttachmentIndex={selectedProject.attIdx}
              onClose={() => setSelectedProject(null)}
              onSelectProject={handleSelectProject}
            />
          </Suspense>
        )}

        {commandOpen && (
          <Suspense fallback={null}>
            <CommandPalette
              open={commandOpen}
              onClose={() => setCommandOpen(false)}
              onOpenTerminal={() => setTerminalOpen(true)}
              onSelectProject={p => handleSelectProject(p, 0)}
            />
          </Suspense>
        )}

        {terminalOpen && (
          <Suspense fallback={null}>
            <TerminalDrawer open={terminalOpen} onClose={() => setTerminalOpen(false)} />
          </Suspense>
        )}

        {(sectionsReady || isAudioPlaying) && (
          <Suspense fallback={null}>
            <SoundAmbience isPlaying={isAudioPlaying} onToggle={handleToggleAudio} />
          </Suspense>
        )}
      </div>
    </MotionConfig>
  );
}
