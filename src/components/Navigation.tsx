import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Command, Menu, Terminal, Volume2, VolumeX, X } from 'lucide-react';
import { smoothScrollTo } from '../lib/smoothScroll';

interface NavigationProps {
  onOpenCommand: () => void;
  onOpenTerminal: () => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  projectCount: number;
  onEnsureReady?: () => void;
}

const NAV_LINKS = [
  { id: 'hero', href: '#hero', label: 'Index', tone: 'dark' as const },
  { id: 'highlights', href: '#highlights', label: 'Highlights', tone: 'light' as const },
  { id: 'projects', href: '#projects', label: 'Works', tone: 'light' as const },
  { id: 'lampiran', href: '#lampiran', label: 'Screens', tone: 'light' as const },
  { id: 'process', href: '#process', label: 'Process', tone: 'dark' as const },
  { id: 'contact', href: '#contact', label: 'Contact', tone: 'dark' as const },
];

function formatClock(): string {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date());
  } catch {
    return '20:15';
  }
}

export function Navigation({
  onOpenCommand,
  onOpenTerminal,
  isAudioPlaying,
  onToggleAudio,
  projectCount,
  onEnsureReady,
}: NavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState('hero');
  const [heroTone, setHeroTone] = useState<'dark' | 'light'>('dark');
  const [clock, setClock] = useState(formatClock);

  useEffect(() => {
    const id = setInterval(() => setClock(formatClock()), 15000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const updateActive = () => {
      const marker = window.scrollY + 86;
      let current = 'hero';
      for (const link of NAV_LINKS) {
        const sec = document.getElementById(link.id);
        if (!sec) continue;
        const rectTop = sec.getBoundingClientRect().top + window.scrollY;
        if (rectTop <= marker) {
          current = link.id;
        }
      }
      setActiveId(current);
      const heroEl = document.getElementById('hero');
      if (heroEl) {
        setHeroTone(heroEl.dataset.navTone === 'light' ? 'light' : 'dark');
      }
    };

    const onToneChange = (e: Event) => {
      const next = (e as CustomEvent<'dark' | 'light'>).detail;
      if (next === 'light' || next === 'dark') setHeroTone(next);
    };

    updateActive();
    window.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('portfolio:heroTone', onToneChange);
    return () => {
      window.removeEventListener('scroll', updateActive);
      window.removeEventListener('portfolio:heroTone', onToneChange);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const activeTone =
    activeId === 'hero'
      ? heroTone
      : (NAV_LINKS.find(l => l.id === activeId)?.tone ?? 'dark');

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMenuOpen(false);
    onEnsureReady?.();
    if (id === 'hero') {
      smoothScrollTo(0);
    } else {
      const jump = () => {
        const target = document.getElementById(id);
        if (!target) return;
        const y = target.getBoundingClientRect().top + window.scrollY;
        smoothScrollTo(y);
      };
      jump();
      window.setTimeout(jump, 450);
    }
    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <header className={`island-header is-${activeTone}-nav`}>
      {/* LEFT: Naked Editorial Wordmark */}
      <a href="#hero" className="island-brand" onClick={e => scrollToSection(e, 'hero')}>
        <span className="island-brand-dot" aria-hidden="true" />
        <span className="island-brand-name">MUHAMAD ELDI</span>
        <span className="island-brand-slash">/</span>
        <span className="island-brand-alias">POPELL</span>
      </a>

      {/* CENTER: Adaptive Apple Dynamic-Island Frosted Glass Dock (Morphs Dark <-> Light!) */}
      <nav className="island-dock" aria-label="Primary navigation">
        {NAV_LINKS.map(link => {
          const isActive = activeId === link.id;
          return (
            <a
              key={link.href}
              href={link.href}
              onClick={e => scrollToSection(e, link.id)}
              className={`island-link ${isActive ? 'is-active' : ''}`}
            >
              {isActive && (
                <motion.span
                  layoutId="island-active-pill"
                  className="island-active-pill"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              <span className="island-link-label">{link.label}</span>
              {link.href === '#projects' && <sup className="island-count">{projectCount}</sup>}
            </a>
          );
        })}

        <span className="island-divider" aria-hidden="true" />

        <button
          type="button"
          className="island-tool-btn"
          onClick={onOpenTerminal}
          title="Interactive Shell (eldi@popell:~$)"
          aria-label="Open Shell"
        >
          <Terminal size={13} />
        </button>

        <button
          type="button"
          className="island-tool-btn is-kbd"
          onClick={onOpenCommand}
          title="Quick Search (Ctrl+K)"
          aria-label="Search (Ctrl+K)"
        >
          <Command size={12} />
          <span>K</span>
        </button>

        <button
          type="button"
          className="island-tool-btn"
          onClick={onToggleAudio}
          aria-pressed={isAudioPlaying}
          aria-label={`Ambient sound ${isAudioPlaying ? 'on' : 'off'}`}
        >
          {isAudioPlaying ? <Volume2 size={13} /> : <VolumeX size={13} />}
        </button>
      </nav>

      {/* RIGHT: Naked Minimal Location + Mobile Quick Actions & Burger */}
      <div className="island-right">
        <a href="#contact" onClick={e => scrollToSection(e, 'contact')} className="island-status-link">
          <span className="avail-dot" aria-hidden="true" />
          <span>BDG · {clock} WIB</span>
        </a>

        <button
          type="button"
          className="island-mobile-quick"
          onClick={onOpenCommand}
          aria-label="Quick Search"
          title="Quick Search"
        >
          <Command size={15} />
        </button>

        <button
          type="button"
          className="island-burger"
          onClick={() => setMenuOpen(v => !v)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="mobile-drawer-backdrop"
              className="mobile-drawer-scrim"
              aria-hidden="true"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              key="mobile-drawer-panel"
              className="studio-mobile-drawer"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
            <div className="mobile-drawer-links">
              {NAV_LINKS.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`studio-mobile-link ${activeId === link.id ? 'is-active' : ''}`}
                  onClick={e => scrollToSection(e, link.id)}
                >
                  <span>{link.label}</span>
                  {link.href === '#projects' && <em className="studio-link-badge">{projectCount}</em>}
                </a>
              ))}
            </div>

            <div className="mobile-drawer-tools">
              <button
                type="button"
                className="mobile-tool-pill"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenTerminal();
                }}
              >
                <Terminal size={14} />
                <span>Shell</span>
              </button>
              <button
                type="button"
                className="mobile-tool-pill"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenCommand();
                }}
              >
                <Command size={14} />
                <span>Search</span>
              </button>
              <button
                type="button"
                className={`mobile-tool-pill ${isAudioPlaying ? 'is-on' : ''}`}
                onClick={onToggleAudio}
                aria-pressed={isAudioPlaying}
              >
                {isAudioPlaying ? <Volume2 size={14} /> : <VolumeX size={14} />}
                <span>{isAudioPlaying ? 'Sound On' : 'Sound'}</span>
              </button>
            </div>

            <div className="mobile-drawer-meta">
              <span className="avail-dot" aria-hidden="true" />
              <span>Bandung, ID · {clock} WIB · Available</span>
            </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
