import { useEffect, useState, type FormEvent } from 'react';
import { Send, Terminal, X } from 'lucide-react';
import { PROFILE_INFO, PROJECTS_DATA } from '../data/portfolioData';

interface TerminalDrawerProps {
  open: boolean;
  onClose: () => void;
}

interface TermLine {
  type: 'cmd' | 'out' | 'accent';
  text: string;
}

const PRESETS = ['whoami', 'pkl', 'ls projects', 'stack', 'contact', 'help'];

export function TerminalDrawer({ open, onClose }: TerminalDrawerProps) {
  const [input, setInput] = useState('');
  const [lines, setLines] = useState<TermLine[]>([
    { type: 'accent', text: 'POPELL STUDIO SHELL v4.0 — Muhamad Eldi · Bandung (WIB)' },
    { type: 'out', text: 'Klik tombol preset atau ketik: whoami, pkl, ls projects, stack, contact, clear' },
  ]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const runCmd = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    if (cmd === 'clear') {
      setLines([{ type: 'accent', text: 'Shell dibersihkan. Ketik "help" untuk daftar perintah.' }]);
      return;
    }

    const next: TermLine[] = [{ type: 'cmd', text: `eldi@popell:~$ ${raw.trim()}` }];
    if (cmd === 'help') {
      next.push(
        { type: 'out', text: '  whoami       — Identitas Muhamad Eldi (POPELL)' },
        { type: 'out', text: '  pkl          — Ringkasan PKL PT Pos Indonesia (Jul–Nov 2026)' },
        { type: 'out', text: '  ls projects  — Semua 12 aplikasi & sistem yang dibangun' },
        { type: 'out', text: '  stack        — Teknologi utama (Frontend, Backend, DB, AI)' },
        { type: 'out', text: '  contact      — Email & sosial media publik' },
        { type: 'out', text: '  clear        — Bersihkan layar' }
      );
    } else if (cmd === 'whoami') {
      next.push(
        { type: 'accent', text: `${PROFILE_INFO.fullLabel} — ${PROFILE_INFO.title}` },
        { type: 'out', text: `Sekolah : ${PROFILE_INFO.school}` },
        { type: 'out', text: `Lokasi  : ${PROFILE_INFO.location}` }
      );
    } else if (cmd === 'pkl') {
      next.push(
        { type: 'accent', text: 'PT POS INDONESIA (PERSERO) — GRAHA POS INDONESIA, BANDUNG' },
        { type: 'out', text: 'Divisi  : Operations Control (Pengendalian Operasi) · 01 Jul – 10 Nov 2026' },
        { type: 'out', text: 'Karya   : Tarif Kepmendagri 83.762 Wilayah, PRISMA POS Ubuntu, iPOS5 + MongoDB Simulator,' },
        { type: 'out', text: '          War Room Control Tower, Regional Q1, Top 20 BI, Mobile Kurir DRS & Local AI Agent.' }
      );
    } else if (cmd === 'ls projects' || cmd === 'ls') {
      PROJECTS_DATA.forEach(p => {
        next.push({ type: 'out', text: `  [${p.number}] ${p.title} (${p.year}) — ${p.attachments.length} lampiran` });
      });
    } else if (cmd === 'stack') {
      next.push(
        { type: 'out', text: '  Frontend : React 19, TypeScript, Vite, Tailwind CSS, Alpine.js, Motion' },
        { type: 'out', text: '  Backend  : Laravel 12, PHP PDO, Node.js, Express, Ubuntu Local Server' },
        { type: 'out', text: '  Database : MySQL 3NF, MongoDB, GeoJSON, Dataset Kepmendagri 2025' },
        { type: 'out', text: '  AI & Lab : Ollama Local LLMs, Python AI Agents, WebRTC, Canvas, Roblox Luau' }
      );
    } else if (cmd === 'contact') {
      next.push(
        { type: 'out', text: `  Email     : ${PROFILE_INFO.email}` },
        { type: 'out', text: `  GitHub    : ${PROFILE_INFO.github}` },
        { type: 'out', text: `  Live App  : https://cisspic.vercel.app` },
        { type: 'out', text: `  Instagram : ${PROFILE_INFO.instagramHandle} · TikTok: ${PROFILE_INFO.tiktokHandle}` }
      );
    } else {
      next.push({ type: 'out', text: `Perintah tidak dikenal: "${raw.trim()}". Ketik "help".` });
    }
    setLines(prev => [...prev.slice(-28), ...next]);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    runCmd(input);
    setInput('');
  };

  return (
    <div className="cmd-backdrop" role="dialog" aria-modal="true" aria-label="Interactive Shell" onClick={onClose}>
      <div className="studio-term-modal" onClick={e => e.stopPropagation()}>
        <div className="studio-term-head">
          <div className="term-head-left">
            <span className="term-dots" aria-hidden="true">
              <i className="td-red" />
              <i className="td-amber" />
              <i className="td-green" />
            </span>
            <Terminal size={13} className="crimson-icon" />
            <span>eldi@popell-studio:~</span>
          </div>
          <button type="button" className="term-close-btn" onClick={onClose}>
            <X size={14} /> ESC
          </button>
        </div>

        <div className="term-presets">
          {PRESETS.map(p => (
            <button key={p} type="button" onClick={() => runCmd(p)}>
              $ {p}
            </button>
          ))}
        </div>

        <div className="term-output" role="log" aria-live="polite">
          {lines.map((line, i) => (
            <div key={i} className={`term-line is-${line.type}`}>
              {line.text}
            </div>
          ))}
        </div>

        <form className="term-input-row" onSubmit={onSubmit}>
          <span className="term-prompt">eldi@popell:~$</span>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="ketik perintah (pkl, ls projects, stack, contact)..."
            autoFocus
          />
          <button type="submit" aria-label="Run command">
            <Send size={13} />
          </button>
        </form>
      </div>
    </div>
  );
}
