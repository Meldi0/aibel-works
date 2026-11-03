import { useEffect, useRef, useState } from 'react';
import { AudioLines, Orbit, Sparkles, Type, Wand2, Zap } from 'lucide-react';
import { Reveal, SectionLabel } from './Reveal';

type PlaygroundTab = 'particles' | 'typography' | 'synth';

interface FontPreset {
  id: string;
  label: string;
  fontFamily: string;
  accent: string;
  stroke: boolean;
  italic: boolean;
}

const FONT_PRESETS: FontPreset[] = [
  {
    id: 'editorial',
    label: 'Kinetic Display',
    fontFamily: "'Syne', 'Plus Jakarta Sans', sans-serif",
    accent: '#9cb7db',
    stroke: false,
    italic: false,
  },
  {
    id: 'outline',
    label: 'Wireframe Blueprint',
    fontFamily: "'Syne', 'Plus Jakarta Sans', sans-serif",
    accent: '#60a5fa',
    stroke: true,
    italic: false,
  },
  {
    id: 'script',
    label: 'Handcrafted Studio',
    fontFamily: "'Caveat', cursive",
    accent: '#f59e0b',
    stroke: false,
    italic: true,
  },
  {
    id: 'cyber',
    label: 'Chromatic Pulse',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    accent: '#c084fc',
    stroke: false,
    italic: false,
  },
];

const SYNTH_CHORDS = [
  { id: 'cmaj9', name: 'Dream Glass', noteLabel: 'C Maj9', freqs: [261.63, 329.63, 392.0, 493.88, 587.33], color: '#60a5fa' },
  { id: 'fmin11', name: 'Midnight Tokio', noteLabel: 'F Min9', freqs: [174.61, 207.65, 261.63, 311.13, 392.0], color: '#a78bfa' },
  { id: 'amaj9', name: 'Horizon Glow', noteLabel: 'A Maj9', freqs: [220.0, 277.18, 329.63, 415.3, 493.88], color: '#34d399' },
  { id: 'emin11', name: 'Deep Cosmos', noteLabel: 'E Min11', freqs: [164.81, 196.0, 246.94, 293.66, 392.0], color: '#f472b6' },
];

export function CreativePlaygroundSection() {
  const [activeTab, setActiveTab] = useState<PlaygroundTab>('particles');

  // --- MODE 1: Interactive Particle Gravity Field ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gravityMode, setGravityMode] = useState<'attract' | 'repel' | 'vortex'>('attract');
  const [pulseCount, setPulseCount] = useState(0);

  // --- MODE 2: Kinetic Typography Lab (GlyphLab Live) ---
  const [customText, setCustomText] = useState('POPELL CREATIVE');
  const [presetIndex, setPresetIndex] = useState(0);
  const [waveAmp, setWaveAmp] = useState(18);
  const [waveSpeed, setWaveSpeed] = useState(1.4);
  const [hoveredChar, setHoveredChar] = useState<number | null>(null);
  const [tick, setTick] = useState(0);

  // --- MODE 3: WebAudio Harmonic Synth & Oscilloscope ---
  const synthCanvasRef = useRef<HTMLCanvasElement>(null);
  const [activeChord, setActiveChord] = useState<string>('cmaj9');
  const audioEnergyRef = useRef(0.18);
  const activeColorRef = useRef('#60a5fa');

  // Particle Canvas Loop
  useEffect(() => {
    if (activeTab !== 'particles') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let width = (canvas.width = canvas.offsetWidth || 800);
    let height = (canvas.height = canvas.offsetHeight || 380);

    const count = width < 640 ? 48 : 85;
    const particles = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      r: 1.8 + (i % 3) * 1.1,
      hue: 205 + (i % 4) * 18,
    }));

    const pointer = { x: width / 2, y: height / 2, active: false };
    const ripples: { x: number; y: number; r: number; alpha: number }[] = [];

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 800;
      height = canvas.height = canvas.offsetHeight || 380;
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };

    const onPointerDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const rx = e.clientX - rect.left;
      const ry = e.clientY - rect.top;
      pointer.x = rx;
      pointer.y = ry;
      pointer.active = true;
      ripples.push({ x: rx, y: ry, r: 8, alpha: 0.9 });
      setPulseCount(c => c + 1);

      for (const p of particles) {
        const dx = p.x - rx;
        const dy = p.y - ry;
        const dist = Math.max(12, Math.hypot(dx, dy));
        if (dist < 220) {
          const force = (220 - dist) / 28;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('resize', onResize);

    const render = () => {
      raf = requestAnimationFrame(render);
      ctx.fillStyle = 'rgba(10, 13, 20, 0.28)';
      ctx.fillRect(0, 0, width, height);

      // Draw expanding shockwave ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += 4.8;
        rp.alpha *= 0.94;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(156, 183, 219, ${rp.alpha})`;
        ctx.lineWidth = 1.6;
        ctx.stroke();
        if (rp.alpha < 0.03) ripples.splice(i, 1);
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (pointer.active) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const dist = Math.max(18, Math.hypot(dx, dy));
          if (dist < 220) {
            const strength = (220 - dist) / 220;
            if (gravityMode === 'attract') {
              p.vx += (dx / dist) * strength * 0.38;
              p.vy += (dy / dist) * strength * 0.38;
            } else if (gravityMode === 'repel') {
              p.vx -= (dx / dist) * strength * 0.55;
              p.vy -= (dy / dist) * strength * 0.55;
            } else {
              // Vortex orbital spin
              p.vx += (-dy / dist) * strength * 0.48 + (dx / dist) * strength * 0.08;
              p.vy += (dx / dist) * strength * 0.48 + (dy / dist) * strength * 0.08;
            }
          }
        }

        p.vx *= 0.965;
        p.vy *= 0.965;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > width) { p.x = width; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > height) { p.y = height; p.vy *= -1; }

        // Connect nearby nodes
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 9500) {
            const alpha = (1 - d2 / 9500) * 0.32;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(156, 183, 219, ${alpha})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 78%, 76%, 0.92)`;
        ctx.fill();
      }
    };

    raf = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', onResize);
    };
  }, [activeTab, gravityMode]);

  // Kinetic Typography Animation Loop
  useEffect(() => {
    if (activeTab !== 'typography') return;
    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      setTick((now - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [activeTab]);

  // Harmonic Synth Oscilloscope Loop
  useEffect(() => {
    if (activeTab !== 'synth') return;
    const canvas = synthCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let phase = 0;
    const renderWave = () => {
      raf = requestAnimationFrame(renderWave);
      const w = (canvas.width = canvas.offsetWidth || 760);
      const h = (canvas.height = canvas.offsetHeight || 220);
      ctx.clearRect(0, 0, w, h);

      audioEnergyRef.current = Math.max(0.14, audioEnergyRef.current * 0.965);
      phase += 0.065;

      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        const amp = h * 0.34 * audioEnergyRef.current * (1 - layer * 0.25);
        for (let x = 0; x <= w; x += 4) {
          const norm = x / w;
          const envelope = Math.sin(norm * Math.PI);
          const y =
            h / 2 +
            Math.sin(norm * 12 + phase * (1 + layer * 0.35)) * amp * envelope +
            Math.cos(norm * 23 - phase * 0.8) * (amp * 0.35) * envelope;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = layer === 0 ? activeColorRef.current : 'rgba(156, 183, 219, 0.28)';
        ctx.lineWidth = layer === 0 ? 2.6 : 1.2;
        ctx.stroke();
      }
    };
    raf = requestAnimationFrame(renderWave);
    return () => cancelAnimationFrame(raf);
  }, [activeTab]);

  const playHarmonicChord = (chord: typeof SYNTH_CHORDS[number]) => {
    setActiveChord(chord.id);
    activeColorRef.current = chord.color;
    audioEnergyRef.current = 1.0;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.001, now);
      master.gain.linearRampToValueAtTime(0.12, now + 0.06);
      master.gain.exponentialRampToValueAtTime(0.0008, now + 1.85);
      master.connect(ctx.destination);

      chord.freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, now);
        osc.connect(master);
        osc.start(now + idx * 0.025);
        osc.stop(now + 1.9);
      });
      setTimeout(() => {
        void ctx.close().catch(() => {});
      }, 2100);
    } catch {
      // Visual wave still animates if audio is blocked
    }
  };

  const preset = FONT_PRESETS[presetIndex];
  const displayChars = (customText.trim() || 'POPELL').slice(0, 22).split('');

  return (
    <section id="playground" data-tone="dark" className="playground-section section-shell">
      <SectionLabel number="02.5" detail="Don't just read about creativity — interact with it">
        POPELL Interactive Creative Lab
      </SectionLabel>

      <div className="section-heading-row">
        <h2 className="display-heading">
          <Reveal>Built to feel</Reveal>
          <Reveal delay={0.08}>
            <span className="muted">alive.</span>
          </Reveal>
        </h2>
        <p>
          <Reveal>
            Because claiming to be a Creative Technologist means the website itself should be an interactive playground. Try touching, dragging, typing, or triggering sound right here.
          </Reveal>
        </p>
      </div>

      <div className="playground-stage-card">
        <div className="playground-toolbar">
          <div className="playground-tabs" role="tablist" aria-label="Interactive creative modes">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'particles'}
              className={`playground-tab-btn ${activeTab === 'particles' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('particles')}
            >
              <Orbit size={14} />
              <span>01 · Spatial Gravity Field</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'typography'}
              className={`playground-tab-btn ${activeTab === 'typography' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('typography')}
            >
              <Type size={14} />
              <span>02 · Kinetic GlyphLab</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'synth'}
              className={`playground-tab-btn ${activeTab === 'synth' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('synth')}
            >
              <AudioLines size={14} />
              <span>03 · Harmonic Audio Synth</span>
            </button>
          </div>

          <span className="playground-live-pill">
            <Sparkles size={12} /> POPELL INTERACTIVE ENGINE · 60 FPS
          </span>
        </div>

        {activeTab === 'particles' && (
          <div className="playground-Canvas-wrap">
            <canvas ref={canvasRef} className="playground-particle-canvas" />
            <div className="playground-hud-overlay">
              <div className="playground-hud-controls">
                <button
                  type="button"
                  className={`hud-chip ${gravityMode === 'attract' ? 'is-active' : ''}`}
                  onClick={() => setGravityMode('attract')}
                >
                  Magnet Attract
                </button>
                <button
                  type="button"
                  className={`hud-chip ${gravityMode === 'repel' ? 'is-active' : ''}`}
                  onClick={() => setGravityMode('repel')}
                >
                  Force Repel
                </button>
                <button
                  type="button"
                  className={`hud-chip ${gravityMode === 'vortex' ? 'is-active' : ''}`}
                  onClick={() => setGravityMode('vortex')}
                >
                  Orbital Vortex
                </button>
              </div>
              <p className="playground-hud-hint">
                <Zap size={12} /> Geser kursor / jari Anda di kanvas atau klik untuk memicu gelombang kejut ({pulseCount} pulses)
              </p>
            </div>
          </div>
        )}

        {activeTab === 'typography' && (
          <div className="playground-typo-stage">
            <div className="playground-typo-controls">
              <div className="typo-input-group">
                <label htmlFor="glyphlab-live-input">Ketik Teks Anda</label>
                <input
                  id="glyphlab-live-input"
                  type="text"
                  maxLength={22}
                  value={customText}
                  onChange={e => setCustomText(e.target.value)}
                  placeholder="POPELL CREATIVE"
                />
              </div>

              <div className="typo-preset-pills">
                {FONT_PRESETS.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`hud-chip ${presetIndex === idx ? 'is-active' : ''}`}
                    onClick={() => setPresetIndex(idx)}
                  >
                    <Wand2 size={12} /> {item.label}
                  </button>
                ))}
              </div>

              <div className="typo-sliders">
                <label>
                  <span>Wave Amplitude</span>
                  <input
                    type="range"
                    min={0}
                    max={36}
                    value={waveAmp}
                    onChange={e => setWaveAmp(Number(e.target.value))}
                  />
                </label>
                <label>
                  <span>Kinetic Speed</span>
                  <input
                    type="range"
                    min={0.4}
                    max={3.5}
                    step={0.1}
                    value={waveSpeed}
                    onChange={e => setWaveSpeed(Number(e.target.value))}
                  />
                </label>
              </div>
            </div>

            <div className="playground-typo-canvas" aria-label={customText}>
              <div className="kinetic-word-line">
                {displayChars.map((ch, idx) => {
                  const offsetY = Math.sin(tick * waveSpeed * 2.4 + idx * 0.55) * waveAmp;
                  const rot = Math.cos(tick * waveSpeed * 2 + idx * 0.45) * (waveAmp * 0.35);
                  const isHover = hoveredChar === idx;
                  return (
                    <span
                      key={idx}
                      onMouseEnter={() => setHoveredChar(idx)}
                      onMouseLeave={() => setHoveredChar(null)}
                      onClick={() => setHoveredChar(idx)}
                      className="kinetic-char"
                      style={{
                        fontFamily: preset.fontFamily,
                        fontStyle: preset.italic ? 'italic' : 'normal',
                        color: preset.stroke ? 'transparent' : isHover ? preset.accent : '#f5f4f0',
                        WebkitTextStroke: preset.stroke ? `1.6px ${preset.accent}` : undefined,
                        textShadow: isHover ? `0 0 28px ${preset.accent}` : undefined,
                        transform: `translate3d(0, ${isHover ? -22 : offsetY}px, 0) rotate(${isHover ? -8 : rot}deg) scale(${isHover ? 1.22 : 1})`,
                      }}
                    >
                      {ch === ' ' ? '\u00A0' : ch}
                    </span>
                  );
                })}
              </div>
              <p className="playground-hud-hint">
                Sentuh atau arahkan kursor ke setiap huruf untuk merasakan respons elastis real-time
              </p>
            </div>
          </div>
        )}

        {activeTab === 'synth' && (
          <div className="playground-synth-stage">
            <div className="synth-chord-grid">
              {SYNTH_CHORDS.map(chord => (
                <button
                  key={chord.id}
                  type="button"
                  className={`synth-pad-btn ${activeChord === chord.id ? 'is-active' : ''}`}
                  onClick={() => playHarmonicChord(chord)}
                  style={{ '--chord-accent': chord.color } as React.CSSProperties}
                >
                  <span className="synth-pad-note">{chord.noteLabel}</span>
                  <strong>{chord.name}</strong>
                  <small>Tap to trigger WebAudio chord</small>
                </button>
              ))}
            </div>
            <div className="synth-wave-box">
              <canvas ref={synthCanvasRef} className="synth-wave-canvas" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
