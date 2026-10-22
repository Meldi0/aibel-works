import { useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, X } from 'lucide-react';
import type { ProjectItem } from '../types';
import { useDialog } from '../lib/useDialog';
import { EASE } from '../lib/motion';

export function ProjectModal({ project, onClose }: { project: ProjectItem; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const reduced = useReducedMotion();
  useDialog(ref, onClose);
  return <motion.dialog ref={ref} className="project-dialog" aria-labelledby="case-study-title" data-lenis-prevent initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .7 }} onClick={event => { if (event.target === ref.current) onClose(); }}>
    <div className="project-dialog-surface">
      <div className="dialog-toolbar"><span className="eyebrow">Project {project.number} / {project.year}</span><button className="icon-button" onClick={onClose} aria-label="Close case study" autoFocus><X size={22} /></button></div>
      <motion.div layoutId={reduced ? undefined : `visual-${project.id}`} className={`dialog-image ${project.aspect === 'portrait' ? 'is-portrait' : ''}`} transition={{ duration: .85, ease: EASE }}><img src={project.image} alt={project.title} /><span>{project.metrics}</span></motion.div>
      <div className="dialog-content"><p className="eyebrow">{project.role}</p><motion.h2 id="case-study-title" layoutId={reduced ? undefined : `title-${project.id}`} transition={{ duration: .85, ease: EASE }}>{project.title}</motion.h2><p className="project-subtitle">{project.subtitle}</p>
        <div className="case-metrics">{project.fullCaseStudy.metrics.map(metric => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div>
        <div className="case-study-grid"><div className="case-narrative">
          <section><h3>01 / System overview</h3><p>{project.fullCaseStudy.overview}</p></section>
          <section><h3>02 / Bottleneck & challenge</h3><p>{project.fullCaseStudy.challenge}</p></section>
          <section><h3>03 / Architectural implementation</h3><p>{project.fullCaseStudy.architectureSolution}</p></section>
          <section><h3>04 / Key production achievements</h3><ul>{project.fullCaseStudy.keyAchievements.map(achievement => <li key={achievement}>{achievement}</li>)}</ul></section>
        </div><aside className="case-sidebar"><h3>Technology stack</h3><div className="tech-tags">{project.technologies.map(tech => <span key={tech}>{tech}</span>)}</div>
          {project.githubUrl && <a className="text-link" href={project.githubUrl} target="_blank" rel="noopener noreferrer">View source repository <ArrowUpRight size={16} /></a>}
          {project.liveUrl && <a className="text-link" href={project.liveUrl} target="_blank" rel="noopener noreferrer">Explore live environment <ArrowUpRight size={16} /></a>}
          <p className="case-seal">Muhamad Eldi • aka AIBEL<br />Software Engineering (SMK RPL) • Full-Stack & AI Developer<br />PT Pos Indonesia · Operations Control · Bandung</p>
        </aside></div>
      </div>
    </div>
  </motion.dialog>;
}
