import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import {
  ArrowUpRight,
  Code2,
  ExternalLink,
  Images,
  LayoutGrid,
  List,
} from 'lucide-react';
import { PROJECTS_DATA } from '../data/portfolioData';
import type { ProjectCategory, ProjectItem } from '../types';
import { AppleScrollRevealText, LiquidGlassSurface, SplitHeadline } from './KineticText';

interface ProjectsArchiveProps {
  onSelectProject: (project: ProjectItem, initialAttachmentIdx?: number) => void;
}

const CATEGORIES: { id: 'all' | ProjectCategory; label: string }[] = [
  { id: 'all', label: 'Semua' },
  { id: 'posind', label: 'PT Pos Indonesia' },
  { id: 'ai', label: 'AI & R&D' },
  { id: 'creative', label: 'Creative & SaaS' },
  { id: 'mobile-school', label: 'Mobile & School' },
];

export function ProjectsArchive({ onSelectProject }: ProjectsArchiveProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<'all' | ProjectCategory>('all');
  const [viewMode, setViewMode] = useState<'gallery' | 'matrix'>('gallery');
  const [activeSlideByProject, setActiveSlideByProject] = useState<Record<string, number>>({});
  const [hoveredMatrixProject, setHoveredMatrixProject] = useState<ProjectItem>(PROJECTS_DATA[0]);
  const [isDesktop3Col, setIsDesktop3Col] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1121px)');
    const sync = () => setIsDesktop3Col(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // Differential 3-column scroll-parallax depth (center column glides slightly faster like an editorial showcase!)
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ['start end', 'end start'],
  });
  const colCenterY = useTransform(scrollYProgress, [0, 1], [28, -36]);
  const colOuterY = useTransform(scrollYProgress, [0, 1], [-10, 16]);

  const filtered = useMemo(() => {
    if (filter === 'all') return PROJECTS_DATA;
    return PROJECTS_DATA.filter(p => p.category === filter);
  }, [filter]);

  const countFor = (cat: 'all' | ProjectCategory) =>
    cat === 'all' ? PROJECTS_DATA.length : PROJECTS_DATA.filter(p => p.category === cat).length;

  return (
    <section id="projects" className="archive-section section-container">
      <div className="section-ledger-head">
        <div>
          <motion.span
            className="section-kicker"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.55 }}
          >
            02 / SELECTED ARCHIVE
          </motion.span>
          <SplitHeadline
            as="h2"
            text="Selected"
            accentText="Works."
            className="section-mega-heading"
          />
        </div>
        <AppleScrollRevealText
          className="section-lead-note"
          text="Tampilan bersih tanpa kotak tebal—klik proyek mana pun untuk membuka studi kasus arsitektur, metrik dampak, dan semua lampiran tangkapan layarnya."
        />
      </div>

      {/* Minimal Frameless Filter Tabs & View Switcher */}
      <motion.div
        className="archive-controls"
        initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <div className="filter-pill-group" role="group" aria-label="Filter projek">
          {CATEGORIES.map(cat => {
            const isActive = filter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                aria-pressed={isActive}
                className={`filter-pill ${isActive ? 'is-active' : ''}`}
                onClick={() => setFilter(cat.id)}
              >
                {isActive && (
                  <motion.span
                    layoutId="projects-filter-pill"
                    className="filter-pill-bg"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="filter-pill-label">{cat.label}</span>
                <em className="filter-pill-count">{countFor(cat.id)}</em>
              </button>
            );
          })}
        </div>

        <div className="view-mode-switch" role="group" aria-label="Ubah mode tampilan">
          <button
            type="button"
            className={`view-btn ${viewMode === 'gallery' ? 'is-active' : ''}`}
            onClick={() => setViewMode('gallery')}
            aria-pressed={viewMode === 'gallery'}
          >
            <LayoutGrid size={14} /> Gallery
          </button>
          <button
            type="button"
            className={`view-btn ${viewMode === 'matrix' ? 'is-active' : ''}`}
            onClick={() => setViewMode('matrix')}
            aria-pressed={viewMode === 'matrix'}
          >
            <List size={14} /> Index
          </button>
        </div>
      </motion.div>

      {/* VIEW 1: FRAMELESS DIFFERENTIAL SCROLL-PARALLAX GALLERY */}
      {viewMode === 'gallery' ? (
        <div ref={gridRef}>
          <motion.div layout className="clean-gallery-grid">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, idx) => {
                const slideIdx = activeSlideByProject[project.id] ?? 0;
                const currentAttachment = project.attachments[slideIdx] ?? project.attachments[0];
                const hasMulti = project.attachments.length > 1;
                const useParallax = isDesktop3Col && filtered.length >= 3;
                const isCenterCol = idx % 3 === 1 && useParallax;

                return (
                  <motion.article
                    layout
                    key={project.id}
                    className="clean-tile"
                    style={isCenterCol ? { y: colCenterY } : useParallax ? { y: colOuterY } : undefined}
                    initial={{ opacity: 0, y: 36, scale: 0.96, filter: 'blur(6px)' }}
                    whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ duration: 0.65, delay: (idx % 3) * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="clean-media-wrap">
                      <button
                        type="button"
                        data-cursor="VIEW"
                        className={`clean-media-btn ${project.aspect === 'portrait' ? 'is-portrait' : ''} ${currentAttachment.kind === 'diagram' ? 'is-diagram' : ''}`}
                        onClick={() => onSelectProject(project, slideIdx)}
                        aria-label={`Lihat detail ${project.title}`}
                      >
                        <img
                          key={currentAttachment.src}
                          src={currentAttachment.src}
                          alt={currentAttachment.caption}
                          loading="lazy"
                          decoding="async"
                          width={640}
                          height={400}
                        />
                        <span className="clean-media-gleam" aria-hidden="true" />
                        <div className="clean-media-scrim" aria-hidden="true" />
                        <span className="clean-float-pill">
                          Lihat Detail · {project.attachments.length} Lampiran <ArrowUpRight size={13} />
                        </span>
                      </button>

                      {hasMulti && (
                        <div className="clean-dots-row" aria-label="Ganti pratinjau screenshot">
                          {project.attachments.map((att, sIdx) => (
                            <button
                              key={att.src}
                              type="button"
                              className={`clean-dot ${slideIdx === sIdx ? 'is-active' : ''}`}
                              onClick={() =>
                                setActiveSlideByProject(prev => ({
                                  ...prev,
                                  [project.id]: sIdx,
                                }))
                              }
                              aria-label={`Pratinjau ${att.label}`}
                              title={att.label}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="clean-caption">
                      <div className="clean-caption-top">
                        <span className="clean-num">{project.number}</span>
                        <div className="clean-title-group">
                          <h3>
                            <button
                              type="button"
                              className="clean-title-btn"
                              onClick={() => onSelectProject(project, slideIdx)}
                            >
                              {project.title}
                            </button>
                          </h3>
                          <p className="clean-meta-line">
                            {project.categoryLabel} · {project.technologies.slice(0, 3).join(' · ')}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="clean-arrow-btn"
                          onClick={() => onSelectProject(project, slideIdx)}
                          aria-label={`Buka ${project.title}`}
                        >
                          <ArrowUpRight size={17} />
                        </button>
                      </div>

                      <p className="clean-summary">{project.description}</p>

                      <div className="clean-subtle-links">
                        <span>{project.year}</span>
                        <div className="clean-link-group">
                          {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="is-live">
                              Live Demo <ExternalLink size={11} />
                            </a>
                          )}
                          {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                              <Code2 size={11} /> GitHub
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      ) : (
        <div className="matrix-split-layout">
          <div className="matrix-table-wrap">
            {filtered.map((project, idx) => {
              const isActive = hoveredMatrixProject?.id === project.id;
              return (
                <motion.div
                  key={project.id}
                  data-cursor="OPEN"
                  className={`matrix-row ${isActive ? 'is-active' : ''}`}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: idx * 0.03 }}
                  onMouseEnter={() => setHoveredMatrixProject(project)}
                  onFocus={() => setHoveredMatrixProject(project)}
                  onClick={() => onSelectProject(project, 0)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectProject(project, 0);
                    }
                  }}
                >
                  <span className="matrix-no">{project.number}</span>
                  <div className="matrix-title-col">
                    <strong>{project.title}</strong>
                    <small>{project.client} · {project.year}</small>
                  </div>
                  <div className="matrix-stack-col">{project.technologies.slice(0, 3).join(' · ')}</div>
                  <span className="matrix-att-badge">
                    <Images size={12} /> {project.attachments.length}
                  </span>
                  <span className="matrix-go">
                    <ArrowUpRight size={15} />
                  </span>
                </motion.div>
              );
            })}
          </div>

          <LiquidGlassSurface className="matrix-preview-plate">
            {hoveredMatrixProject && (
              <>
                <div
                  className={`matrix-preview-img ${hoveredMatrixProject.aspect === 'portrait' ? 'is-portrait' : ''} ${hoveredMatrixProject.attachments[0]?.kind === 'diagram' ? 'is-diagram' : ''}`}
                  onClick={() => onSelectProject(hoveredMatrixProject, 0)}
                >
                  <img src={hoveredMatrixProject.image} alt={hoveredMatrixProject.title} loading="lazy" decoding="async" width={640} height={400} />
                </div>
                <h3 className="matrix-preview-title">{hoveredMatrixProject.title}</h3>
                <p>{hoveredMatrixProject.description}</p>
                <button
                  type="button"
                  className="hero-btn-obsidian"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => onSelectProject(hoveredMatrixProject, 0)}
                >
                  <span>Buka Case Study &amp; {hoveredMatrixProject.attachments.length} Lampiran</span>
                  <ArrowUpRight size={15} />
                </button>
              </>
            )}
          </LiquidGlassSurface>
        </div>
      )}
    </section>
  );
}
