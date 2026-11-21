import { useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { MotionConfig } from 'motion/react';
import { PROJECTS_DATA } from './data/portfolioData';
import type { ProjectItem } from './types';
import { GlassCursorHalo } from './components/KineticText';
import { LivingGlassBackdrop } from './components/LivingGlassBackdrop';
import { Navigation } from './components/Navigation';
import { EditorialHero } from './components/EditorialHero';
import { SwissHighlightDeck } from './components/SwissHighlightDeck';
import { ProjectsArchive } from './components/ProjectsArchive';
import { LampiranVaultSection } from './components/LampiranVaultSection';
import { EditorialResumeSection } from './components/EditorialResumeSection';
import { ContactSection } from './components/ContactSection';
import { ProjectDossierModal } from './components/ProjectDossierModal';
import { CommandPalette } from './components/CommandPalette';
import { TerminalDrawer } from './components/TerminalDrawer';
import { SoundAmbience } from './components/SoundAmbience';
import { initVisitorTracker } from './lib/visitorTracker';
import { useMotionSettings } from './lib/motion';
import { smoothScrollTo } from './lib/smoothScroll';

export default function App() {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<{
    project: ProjectItem;
    attIdx: number;
  } | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const { reduced, desktop } = useMotionSettings();

  useEffect(() => {
    initVisitorTracker();
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

    if (reduced || !desktop) {
      return () => window.removeEventListener('scroll', onScroll);
    }

    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, syncTouch: false });
    window.__lenisScrollTo = (top: number) => {
      lenis.scrollTo(top, { duration: 1.05 });
    };
    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      onScroll();
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const onDialog = (event: Event) => {
      const isOpen = (event as CustomEvent<boolean>).detail;
      if (isOpen) lenis.stop();
      else lenis.start();
    };
    window.addEventListener('portfolio:dialog', onDialog);

    return () => {
      delete window.__lenisScrollTo;
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('portfolio:dialog', onDialog);
      lenis.destroy();
    };
  }, [reduced, desktop]);

  const handleSelectProject = useCallback((project: ProjectItem, attIdx = 0) => {
    setSelectedProject({ project, attIdx });
  }, []);

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}>
      <div className="studio-gallery-app">
        <GlassCursorHalo />

        <div className="scroll-progress-track" aria-hidden="true">
          <div ref={progressRef} className="scroll-progress-bar" />
        </div>

        <a className="skip-link" href="#highlights">
          Skip to Highlights
        </a>

        <Navigation
          onOpenCommand={() => setCommandOpen(true)}
          onOpenTerminal={() => setTerminalOpen(true)}
          isAudioPlaying={isAudioPlaying}
          onToggleAudio={() => setIsAudioPlaying(v => !v)}
          projectCount={PROJECTS_DATA.length}
        />

        <main id="main-content" className="studio-main-layer">
          {/* ACT I: DARK TITANIUM LIQUID GLASS KEYNOTE HERO */}
          <EditorialHero onSelectProject={handleSelectProject} />

          {/* ACT II: CLEAN STUDIO TITANIUM CURVED SWISS WHEEL */}
          <SwissHighlightDeck onSelectProject={handleSelectProject} />

          {/* ACT III: PURE PORCELAIN GALLERY (12 WORKS + 26 SCREENS) */}
          <div className="light-gallery-band">
            <ProjectsArchive onSelectProject={handleSelectProject} />
            <LampiranVaultSection onSelectProject={handleSelectProject} />
          </div>

          {/* ACT IV: DARK SPACE TITANIUM LIQUID GLASS FINALE (PROCESS + CONTACT) */}
          <div className="dark-finale-band">
            <LivingGlassBackdrop variant="finale" />
            <div className="dark-finale-inner">
              <EditorialResumeSection onOpenTerminal={() => setTerminalOpen(true)} />
              <ContactSection
                onBackToTop={() => {
                  smoothScrollTo(0);
                }}
              />
            </div>
          </div>
        </main>

        <ProjectDossierModal
          project={selectedProject?.project ?? null}
          initialAttachmentIndex={selectedProject?.attIdx ?? 0}
          onClose={() => setSelectedProject(null)}
          onSelectProject={handleSelectProject}
        />

        <CommandPalette
          open={commandOpen}
          onClose={() => setCommandOpen(false)}
          onOpenTerminal={() => setTerminalOpen(true)}
          onSelectProject={p => handleSelectProject(p, 0)}
        />

        <TerminalDrawer open={terminalOpen} onClose={() => setTerminalOpen(false)} />

        <SoundAmbience isPlaying={isAudioPlaying} onToggle={() => setIsAudioPlaying(v => !v)} />
      </div>
    </MotionConfig>
  );
}
