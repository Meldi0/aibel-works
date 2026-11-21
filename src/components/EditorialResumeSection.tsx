import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { Code2, Compass, Layers, Rocket, Search, Terminal } from 'lucide-react';
import { HOW_I_BUILD } from '../data/portfolioData';
import { AppleScrollRevealText, SplitHeadline } from './KineticText';

interface EditorialResumeSectionProps {
  onOpenTerminal: () => void;
}

const EDUCATION_ITEMS = [
  {
    title: 'SMK Wiraswasta Kota Cimahi',
    sub: 'Rekayasa Perangkat Lunak (Software Engineering)',
    period: '2024 – 2026',
  },
  {
    title: 'PT Pos Indonesia — Operations Control (PKL)',
    sub: 'Graha Pos Indonesia · Bagian Pengendalian Operasi, Bandung',
    period: 'Jul – Nov 2026',
  },
  {
    title: 'POPELL Independent Creative & AI Lab',
    sub: 'Full-Stack Web, Local AI Agents (Ollama) & Interactive UI',
    period: 'Ongoing',
  },
];

const SKILL_BADGES = [
  'REACT 19',
  'TYPESCRIPT',
  'LARAVEL 12',
  'PHP PDO',
  'NODE.JS',
  'MYSQL 3NF',
  'MONGODB',
  'TAILWIND CSS',
  'OLLAMA AI',
  'UBUNTU SERVER',
  'WEBRTC / CANVAS',
  'ROBLOX LUAU',
];

const WORK_PROCESS = [
  {
    no: '01',
    title: 'DISCOVER',
    desc: 'Memahami alur operasional nyata, struktur data, dan masalah inti pengguna.',
    Icon: Search,
  },
  {
    no: '02',
    title: 'IDEATE',
    desc: 'Merancang arsitektur database 3NF, alur API, dan kerangka fitur yang presisi.',
    Icon: Compass,
  },
  {
    no: '03',
    title: 'DESIGN',
    desc: 'Meracik sistem visual, tipografi bersih, dan interaksi yang terasa hidup.',
    Icon: Layers,
  },
  {
    no: '04',
    title: 'DEVELOP',
    desc: 'Membangun full-stack cepat dan modular dengan React, TypeScript, Laravel & Node.',
    Icon: Code2,
  },
  {
    no: '05',
    title: 'DELIVER',
    desc: 'Pengujian RBAC, optimasi performa, dokumentasi lengkap, hingga deploy produksi.',
    Icon: Rocket,
  },
];

export function EditorialResumeSection({ onOpenTerminal }: EditorialResumeSectionProps) {
  const processRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: processRef,
    offset: ['start 82%', 'end 52%'],
  });
  const spineScaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.4,
  });

  return (
    <section id="process" className="resume-studio-section section-container">
      {/* GIANT APPLE SCROLL-SCRUBBED MANIFESTO STATEMENT ("WAHH" Moment #5!) */}
      <div className="finale-manifesto-block">
        <span className="section-kicker">04 / PHILOSOPHY &amp; CRAFT</span>
        <AppleScrollRevealText
          className="finale-manifesto-text"
          text="Kode yang baik bukan cuma soal jalan tanpa error — tapi soal seberapa rapi arsitekturnya, seberapa ringan dipakai, dan seberapa nyata dampaknya di lapangan."
        />
      </div>

      <div className="section-ledger-head">
        <div>
          <SplitHeadline
            as="h2"
            text="How I"
            accentText="Build."
            className="section-mega-heading"
          />
        </div>
        <AppleScrollRevealText
          className="section-lead-note"
          text="Fondasi rekayasa perangkat lunak dari ruang kelas RPL hingga sistem operasional nyata di PT Pos Indonesia, dipadukan dengan proses kerja yang rapi dari riset sampai deploy."
        />
      </div>

      <motion.div
        className="resume-3col-grid"
        initial={{ opacity: 0, y: 26, filter: 'blur(6px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: false, amount: 0.12 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="resume-col-edu">
          <h3 className="resume-col-heading">Background &amp; Stack</h3>

          <span className="resume-sub-kicker">EDUCATION &amp; EXPERIENCE</span>
          <div className="edu-list">
            {EDUCATION_ITEMS.map((item, idx) => (
              <motion.div
                key={item.title}
                className="edu-row"
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
              >
                <div>
                  <strong>{item.title}</strong>
                  <small>{item.sub}</small>
                </div>
                <span className="edu-period">{item.period}</span>
              </motion.div>
            ))}
          </div>

          <span className="resume-sub-kicker" style={{ marginTop: '28px' }}>
            SKILLS &amp; TOOLKIT
          </span>
          <div className="skills-pill-matrix">
            {SKILL_BADGES.map(skill => (
              <span key={skill} className="studio-skill-pill">
                {skill}
              </span>
            ))}
          </div>

          <motion.button
            type="button"
            className="resume-shell-trigger"
            onClick={onOpenTerminal}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.985 }}
          >
            <Terminal size={14} />
            <span>Interactive Shell · eldi@popell</span>
          </motion.button>
        </div>

        <div className="resume-col-process" ref={processRef}>
          <h3 className="resume-col-heading">Work Process</h3>
          <div className="process-timeline">
            <span className="process-spine-track" aria-hidden="true" />
            <motion.span
              className="process-spine-fill"
              style={{ scaleY: spineScaleY }}
              aria-hidden="true"
            />
            {WORK_PROCESS.map((step, idx) => {
              const Icon = step.Icon;
              return (
                <motion.div
                  key={step.no}
                  className="process-step"
                  initial={{ opacity: 0, x: -16, filter: 'blur(4px)' }}
                  whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  viewport={{ once: false, amount: 0.25 }}
                  transition={{ duration: 0.55, delay: idx * 0.07, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="process-num">{step.no}</span>
                  <div className="process-node">
                    <Icon size={15} />
                  </div>
                  <div className="process-copy">
                    <strong>{step.title}</strong>
                    <p>{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <aside className="resume-quote-panel">
          <div className="quote-top-mark" aria-hidden="true">&ldquo;</div>
          <blockquote className="quote-body">
            Good engineering is not just how it works, but how unforgettable it feels.
          </blockquote>
          <div className="quote-signature">Muhamad Eldi</div>
          <div className="quote-footer">
            <span>
              LET&apos;S CREATE
              <br />
              SOMETHING GREAT
              <br />
              TOGETHER.
            </span>
            <span className="quote-monogram">2026</span>
          </div>
        </aside>
      </motion.div>

      <div className="mindset-4col-strip">
        {HOW_I_BUILD.map((item, idx) => (
          <motion.div
            key={item.no}
            className="mindset-cell"
            initial={{ opacity: 0, y: 22, filter: 'blur(5px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: idx * 0.07 }}
          >
            <span className="mindset-no">{item.no}</span>
            <h4>{item.title}</h4>
            <p>{item.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
