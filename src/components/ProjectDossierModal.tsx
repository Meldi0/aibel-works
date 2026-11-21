import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  Cpu,
  ExternalLink,
  Layers,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { PROJECTS_DATA } from '../data/portfolioData';
import type { ProjectItem } from '../types';

interface ProjectDossierModalProps {
  project: ProjectItem | null;
  initialAttachmentIndex?: number;
  onClose: () => void;
  onSelectProject?: (project: ProjectItem, attIdx?: number) => void;
}

type ChapterTab = 'overview' | 'engineering' | 'impact';

/**
 * Immersive 2-Pane Dark Space Titanium Apple Keynote Case Study Studio
 * - Left Pane (Pinned Cinema Media Stage): Full-height interactive gallery where UI screenshots &
 *   uncropped diagrams stay visible while you explore the story, with crossfade, pills, zoom & raw view.
 * - Right Pane (Interactive Tabbed Story Deck): Hero metrics, 3-tab chapter switcher (Overview /
 *   Engineering / Highlights & Stack), public links, and instant Prev/Next Project navigation!
 */
export function ProjectDossierModal({
  project,
  initialAttachmentIndex = 0,
  onClose,
  onSelectProject,
}: ProjectDossierModalProps) {
  const [attIdx, setAttIdx] = useState(initialAttachmentIndex);
  const [zoomed, setZoomed] = useState(false);
  const [activeTab, setActiveTab] = useState<ChapterTab>('overview');

  useEffect(() => {
    setAttIdx(initialAttachmentIndex);
    setZoomed(false);
    setActiveTab('overview');
  }, [project, initialAttachmentIndex]);

  useEffect(() => {
    if (!project) return;
    window.dispatchEvent(new CustomEvent('portfolio:dialog', { detail: true }));
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (zoomed) setZoomed(false);
        else onClose();
      } else if (e.key === 'ArrowRight' && project.attachments.length > 1) {
        setAttIdx(i => (i + 1) % project.attachments.length);
      } else if (e.key === 'ArrowLeft' && project.attachments.length > 1) {
        setAttIdx(i => (i - 1 + project.attachments.length) % project.attachments.length);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      window.dispatchEvent(new CustomEvent('portfolio:dialog', { detail: false }));
    };
  }, [project, zoomed, onClose]);

  const totalAtt = project?.attachments.length ?? 0;
  const activeAtt = project ? (project.attachments[attIdx] ?? project.attachments[0]) : null;
  const projectIndex = project ? PROJECTS_DATA.findIndex(p => p.id === project.id) : -1;
  const prevProject =
    projectIndex >= 0 ? PROJECTS_DATA[(projectIndex - 1 + PROJECTS_DATA.length) % PROJECTS_DATA.length] : null;
  const nextProject =
    projectIndex >= 0 ? PROJECTS_DATA[(projectIndex + 1) % PROJECTS_DATA.length] : null;

  const isDiagram = activeAtt?.kind === 'diagram';
  const isPortrait = activeAtt?.kind === 'mobile' || project?.aspect === 'portrait';

  const chapterTabs: { id: ChapterTab; label: string; Icon: typeof Layers }[] = [
    { id: 'overview', label: 'Overview', Icon: Sparkles },
    { id: 'engineering', label: 'Architecture', Icon: Cpu },
    { id: 'impact', label: 'Impact & Stack', Icon: Layers },
  ];

  return (
    <AnimatePresence>
      {project && activeAtt && (
        <motion.div
          key="dossier-backdrop"
          className="studio-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dossier-title"
          data-lenis-prevent
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24 }}
        >
          <motion.div
            key={project.id}
            className={`studio-case-shell cat-${project.category} ${zoomed ? 'is-zoomed-mode' : ''}`}
            onClick={e => e.stopPropagation()}
            initial={{ opacity: 0, y: 28, scale: 0.96, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 18, scale: 0.97, filter: 'blur(4px)' }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          >
            {/* LEFT PANE: PINNED CINEMA MEDIA STAGE */}
            <div className="case-media-pane">
              <div className="case-media-topbar">
                <div className="case-badge-cluster">
                  <span className="case-num-pill">{project.number}</span>
                  <span className="case-code-mono">{project.code}</span>
                  <span className="case-status-dot">{project.status}</span>
                </div>

                <div className="case-media-tools">
                  <a
                    href={activeAtt.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="case-tool-pill"
                    title="Buka gambar resolusi penuh di tab baru"
                  >
                    <ExternalLink size={13} />
                    <span>Asli</span>
                  </a>
                  <button
                    type="button"
                    className="case-tool-pill"
                    onClick={() => setZoomed(z => !z)}
                    aria-label={zoomed ? 'Perkecil tampilan' : 'Perbesar layar penuh'}
                  >
                    {zoomed ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                    <span>{zoomed ? 'Split' : 'Zoom'}</span>
                  </button>
                  <button
                    type="button"
                    className="case-tool-pill case-mobile-close-btn"
                    onClick={onClose}
                    aria-label="Tutup case study"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              <div className={`case-cinema-viewport ${isDiagram ? 'is-diagram' : ''} ${isPortrait ? 'is-portrait' : ''}`}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeAtt.src}
                    src={activeAtt.src}
                    alt={activeAtt.caption}
                    initial={{ opacity: 0, scale: 0.975, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 1.015 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  />
                </AnimatePresence>

                {totalAtt > 1 && (
                  <>
                    <button
                      type="button"
                      className="case-stage-arrow is-prev"
                      onClick={() => setAttIdx(i => (i - 1 + totalAtt) % totalAtt)}
                      aria-label="Lampiran sebelumnya"
                    >
                      <ChevronLeft size={19} />
                    </button>
                    <button
                      type="button"
                      className="case-stage-arrow is-next"
                      onClick={() => setAttIdx(i => (i + 1) % totalAtt)}
                      aria-label="Lampiran berikutnya"
                    >
                      <ChevronRight size={19} />
                    </button>
                  </>
                )}
              </div>

              <div className="case-media-footer">
                <p className="case-active-caption">
                  <strong>
                    {String(attIdx + 1).padStart(2, '0')}/{String(totalAtt).padStart(2, '0')}
                  </strong>{' '}
                  — {activeAtt.caption}
                </p>

                {totalAtt > 1 && (
                  <div className="case-thumb-rail" role="group" aria-label="Pilih tangkapan layar">
                    {project.attachments.map((att, idx) => (
                      <button
                        key={att.src}
                        type="button"
                        aria-pressed={idx === attIdx}
                        className={`case-thumb-chip ${idx === attIdx ? 'is-active' : ''}`}
                        onClick={() => setAttIdx(idx)}
                      >
                        <img src={att.src} alt={att.label} />
                        <span>{att.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT PANE: INTERACTIVE TABBED EDITORIAL STORY DECK */}
            <div className="case-story-pane">
              <div className="case-story-topbar">
                <span className="case-client-mono">
                  {project.client} · {project.year}
                </span>
                <button type="button" className="case-close-btn" onClick={onClose} aria-label="Tutup case study">
                  <X size={15} />
                  <span>ESC</span>
                </button>
              </div>

              <div className="case-story-scroll" data-lenis-prevent>
                <div className="case-hero-copy">
                  <span className="case-role-eyebrow">{project.role}</span>
                  <h2 id="dossier-title">{project.title}</h2>
                  <p className="case-subtitle-mono">{project.subtitle}</p>
                </div>

                {/* 2x2 BORDERLESS FROSTED KPI MATRIX */}
                <div className="case-kpi-grid">
                  {project.fullCaseStudy.metrics.map(m => (
                    <div className="case-kpi-tile" key={m.label}>
                      <strong>{m.value}</strong>
                      <span>{m.label}</span>
                    </div>
                  ))}
                </div>

                {/* INTERACTIVE 3-TAB CHAPTER SWITCHER */}
                <div className="case-chapter-tabs" role="group" aria-label="Bagian studi kasus">
                  {chapterTabs.map(({ id, label, Icon }) => {
                    const isAct = activeTab === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        aria-pressed={isAct}
                        className={`case-tab-btn ${isAct ? 'is-active' : ''}`}
                        onClick={() => setActiveTab(id)}
                      >
                        {isAct && (
                          <motion.span
                            layoutId="case-tab-active-bg"
                            className="case-tab-pill-bg"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}
                        <Icon size={13} />
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* ANIMATED CHAPTER CONTENT */}
                <AnimatePresence mode="wait">
                  {activeTab === 'overview' && (
                    <motion.div
                      key="tab-overview"
                      className="case-tab-panel"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22 }}
                    >
                      <div className="case-story-block">
                        <h3>01 / SYSTEM OVERVIEW</h3>
                        <p>{project.fullCaseStudy.overview}</p>
                      </div>
                      <div className="case-story-block">
                        <h3>02 / CORE CONTEXT</h3>
                        <p>{project.description}</p>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'engineering' && (
                    <motion.div
                      key="tab-engineering"
                      className="case-tab-panel"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22 }}
                    >
                      <div className="case-story-block">
                        <h3>01 / CHALLENGE &amp; BOTTLENECK</h3>
                        <p>{project.fullCaseStudy.challenge}</p>
                      </div>
                      <div className="case-story-block">
                        <h3>02 / ARCHITECTURE &amp; SOLUTION</h3>
                        <p>{project.fullCaseStudy.architectureSolution}</p>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'impact' && (
                    <motion.div
                      key="tab-impact"
                      className="case-tab-panel"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22 }}
                    >
                      <div className="case-story-block">
                        <h3>KEY DELIVERABLES</h3>
                        <ul className="case-impact-list">
                          {project.fullCaseStudy.keyAchievements.map(item => (
                            <li key={item}>
                              <CheckCircle2 size={15} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="case-story-block">
                        <h3>TECH STACK</h3>
                        <div className="case-stack-wrap">
                          {project.technologies.map(t => (
                            <span key={t} className="case-stack-pill">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {project.category === 'posind' && (
                        <p className="case-privacy-badge">
                          <ShieldCheck size={14} />
                          <span>
                            Kode sumber &amp; berkas internal PT Pos Indonesia dijaga privat demi keamanan operasional.
                          </span>
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* STICKY BOTTOM STUDIO ACTION & PREV/NEXT PROJECT DOCK */}
              <div className="case-bottom-dock">
                <div className="case-external-links">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="case-cta-white"
                    >
                      <ExternalLink size={14} />
                      <span>Live App</span>
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={project.liveUrl ? 'case-cta-subtle' : 'case-cta-white'}
                    >
                      <Code2 size={14} />
                      <span>GitHub</span>
                      <ArrowUpRight size={13} />
                    </a>
                  )}
                </div>

                {onSelectProject && prevProject && nextProject && (
                  <div className="case-project-stepper" aria-label="Pindah ke proyek lain">
                    <button
                      type="button"
                      onClick={() => onSelectProject(prevProject, 0)}
                      title={`Sebelumnya: ${prevProject.title}`}
                    >
                      <ArrowLeft size={14} />
                      <span>{prevProject.number}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectProject(nextProject, 0)}
                      title={`Berikutnya: ${nextProject.title}`}
                    >
                      <span>{nextProject.number}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
