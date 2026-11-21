import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  Code2,
  Copy,
  ExternalLink,
  Search,
  Terminal,
  X,
} from 'lucide-react';
import { PROFILE_INFO, PROJECTS_DATA } from '../data/portfolioData';
import type { ProjectItem } from '../types';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onOpenTerminal: () => void;
  onSelectProject: (project: ProjectItem) => void;
}

export function CommandPalette({
  open,
  onClose,
  onOpenTerminal,
  onSelectProject,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setQuery('');
      return;
    }
    const timer = setTimeout(() => inputRef.current?.focus(), 40);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  const filteredProjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PROJECTS_DATA;
    return PROJECTS_DATA.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.technologies.some(t => t.toLowerCase().includes(q))
    );
  }, [query]);

  if (!open) return null;

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE_INFO.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };

  return (
    <div className="cmd-backdrop" role="dialog" aria-modal="true" aria-label="Quick search" onClick={onClose}>
      <div className="cmd-modal" onClick={e => e.stopPropagation()}>
        <div className="cmd-search-bar">
          <Search size={17} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Cari 12 projek atau tech stack (Laravel, MongoDB, React, Ollama)..."
          />
          <button type="button" className="cmd-close-btn" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div className="cmd-body">
          <div className="cmd-group">
            <span className="cmd-group-label">QUICK ACTIONS</span>
            <a
              className="cmd-row"
              href="https://cisspic.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
            >
              <ExternalLink size={15} />
              <span>Buka Live Studio — SNAPDAYS Photobooth (cisspic.vercel.app)</span>
              <ArrowUpRight size={14} />
            </a>
            <a
              className="cmd-row"
              href={PROFILE_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
            >
              <Code2 size={15} />
              <span>Buka Profil GitHub Publik (github.com/Meldi0)</span>
              <ArrowUpRight size={14} />
            </a>
            <button
              type="button"
              className="cmd-row"
              onClick={() => {
                onClose();
                onOpenTerminal();
              }}
            >
              <Terminal size={15} />
              <span>Buka Interactive Shell (eldi@popell:~$)</span>
              <kbd>SHELL</kbd>
            </button>
            <button type="button" className="cmd-row" onClick={copyEmail}>
              {copied ? <Check size={15} /> : <Copy size={15} />}
              <span>{copied ? 'Email disalin!' : `Salin Email (${PROFILE_INFO.email})`}</span>
              <kbd>COPY</kbd>
            </button>
          </div>

          <div className="cmd-group">
            <span className="cmd-group-label">PROJECTS ({filteredProjects.length})</span>
            {filteredProjects.map(project => (
              <button
                key={project.id}
                type="button"
                className="cmd-row cmd-project-row"
                onClick={() => {
                  onSelectProject(project);
                  onClose();
                }}
              >
                <span className="cmd-num">{project.number}</span>
                <span className="cmd-proj-meta">
                  <strong>{project.title}</strong>
                  <small>
                    {project.categoryLabel} · {project.attachments.length} lampiran ·{' '}
                    {project.technologies.slice(0, 3).join(', ')}
                  </small>
                </span>
                <ArrowUpRight size={14} />
              </button>
            ))}
            {filteredProjects.length === 0 && (
              <p className="cmd-empty">Tidak ada projek yang cocok dengan &ldquo;{query}&rdquo;.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
