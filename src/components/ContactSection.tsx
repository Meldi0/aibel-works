import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import {
  AlertCircle,
  ArrowUp,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  Eye,
  Loader2,
  LocateFixed,
  Mail,
  MapPin,
  Send,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { PROFILE_INFO } from '../data/portfolioData';
import { Reveal, SectionLabel } from './Reveal';
import { Magnetic } from './Magnetic';
import { buildModernHtmlEmail, GOOGLE_APPS_SCRIPT_SNIPPET } from '../lib/emailTemplate';

const FORMSUBMIT_AJAX_URL = `https://formsubmit.co/ajax/${PROFILE_INFO.email}`;
const STORAGE_KEY_GAS_URL = 'aibel_custom_gmail_webhook_url';
const STORAGE_KEY_LAST_SENT = 'aibel_contact_last_sent_ts';
const RATE_LIMIT_MS = 30_000;
const GAS_WEBHOOK_REGEX = /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]{20,}\/exec$/;
const EMAIL_REGEX = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/;

function sanitizeSingleLine(raw: string, maxLen: number): string {
  return raw.replace(/[\r\n\0\t]+/g, ' ').trim().slice(0, maxLen);
}

function isValidGasWebhookUrl(url: string): boolean {
  return GAS_WEBHOOK_REGEX.test(url.trim());
}

function buildGmailComposeUrl(subject: string, body: string) {
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: PROFILE_INFO.email,
    su: subject,
    body,
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

export function ContactSection({ onBackToTop }: { onBackToTop: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [senderLocation, setSenderLocation] = useState('');
  const [detectingLoc, setDetectingLoc] = useState(false);
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [statusNote, setStatusNote] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [gasUrl, setGasUrl] = useState<string>(() => {
    try {
      const envUrl = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_GMAIL_WEBHOOK_URL;
      const candidate = envUrl || localStorage.getItem(STORAGE_KEY_GAS_URL) || '';
      return isValidGasWebhookUrl(candidate) ? candidate.trim() : '';
    } catch {
      return '';
    }
  });
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const timezone = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Jakarta';
    } catch {
      return 'Asia/Jakarta';
    }
  }, []);

  const detectVisitorLocation = () => {
    setDetectingLoc(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    fetch('https://ipwho.is/', {
      signal: controller.signal,
      referrerPolicy: 'no-referrer',
      credentials: 'omit',
    })
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data && data.success && typeof data.city === 'string') {
          const locString = [data.city, data.region, data.country]
            .filter((part): part is string => typeof part === 'string' && part.length > 0)
            .map(part => sanitizeSingleLine(part, 40))
            .join(', ');
          if (locString) setSenderLocation(locString.slice(0, 100));
        }
      })
      .catch(() => {
        // Silent fallback
      })
      .finally(() => {
        clearTimeout(timeoutId);
        setDetectingLoc(false);
      });
  };

  useEffect(() => {
    detectVisitorLocation();
    return () => clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('portfolio:dialog', { detail: showTemplateModal }));
    if (!showTemplateModal) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowTemplateModal(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
      window.dispatchEvent(new CustomEvent('portfolio:dialog', { detail: false }));
    };
  }, [showTemplateModal]);

  const saveGasUrl = (val: string) => {
    const trimmed = val.trim();
    setGasUrl(val);
    try {
      if (isValidGasWebhookUrl(trimmed)) {
        localStorage.setItem(STORAGE_KEY_GAS_URL, trimmed);
      } else {
        localStorage.removeItem(STORAGE_KEY_GAS_URL);
      }
    } catch {
      // Ignore storage error
    }
  };

  const cleanName = sanitizeSingleLine(name, 80) || 'Muhamad Eldi';
  const cleanEmail = sanitizeSingleLine(email, 120) || 'nugrahaeldi123@gmail.com';
  const cleanLocation = sanitizeSingleLine(senderLocation, 100) || 'Bandung, West Java, Indonesia';
  const cleanMessage = message.replace(/\0/g, '').trim().slice(0, 2000);

  const timestamp = new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date());

  const composedSubject = `Pesan Portofolio dari ${cleanName} (${cleanEmail}) — ${cleanLocation}`;

  const composedBody = [
    `Nama Pengirim   : ${cleanName}`,
    `Gmail Pengirim  : ${cleanEmail}`,
    `Lokasi Pengirim : ${cleanLocation} (${timezone})`,
    `----------------------------------------`,
    ``,
    cleanMessage,
  ].join('\n');

  const htmlEmailString = useMemo(
    () =>
      buildModernHtmlEmail({
        name: cleanName,
        email: cleanEmail,
        location: cleanLocation,
        timezone,
        timestamp,
        message:
          cleanMessage ||
          'Halo Eldi, saya tertarik berdiskusi mengenai pembuatan aplikasi web dan kolaborasi proyek baru.',
        recipientEmail: PROFILE_INFO.email,
      }),
    [cleanName, cleanEmail, cleanLocation, timezone, timestamp, cleanMessage]
  );

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'sending') return;

    // 1. Anti-Bot Honeypot Trap
    if (honeypot.trim().length > 0) {
      setStatus('sent');
      setStatusNote(`Pesan Anda telah masuk langsung ke inbox Gmail ${PROFILE_INFO.email}.`);
      return;
    }

    // 2. Strict Email & Message Validation
    if (!EMAIL_REGEX.test(cleanEmail)) {
      setStatus('error');
      setStatusNote('Format alamat email tidak valid. Gunakan format email yang benar.');
      return;
    }
    if (cleanMessage.length < 3) {
      setStatus('error');
      setStatusNote('Isi pesan terlalu pendek. Tuliskan pesan Anda secara jelas.');
      return;
    }

    // 3. Client-Side Rate Limit / Cooldown (30s anti-flood protection)
    try {
      const lastSent = Number(sessionStorage.getItem(STORAGE_KEY_LAST_SENT) || '0');
      const elapsed = Date.now() - lastSent;
      if (lastSent > 0 && elapsed < RATE_LIMIT_MS) {
        const waitSec = Math.ceil((RATE_LIMIT_MS - elapsed) / 1000);
        setStatus('error');
        setStatusNote(`Proteksi anti-spam aktif. Mohon tunggu ${waitSec} detik sebelum mengirim pesan lagi.`);
        return;
      }
    } catch {
      // Ignore storage access errors
    }

    setStatus('sending');
    setStatusNote('');

    const activeWebhook = gasUrl.trim();

    try {
      // 4. If Validated Google Apps Script Webhook is connected, send Custom HTML Email
      if (isValidGasWebhookUrl(activeWebhook)) {
        await fetch(activeWebhook, {
          method: 'POST',
          mode: 'no-cors',
          referrerPolicy: 'no-referrer',
          credentials: 'omit',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify({
            _honey: honeypot,
            subject: composedSubject,
            name: cleanName,
            email: cleanEmail,
            location: `${cleanLocation} (${timezone})`,
            timestamp,
            message: cleanMessage,
          }),
        });
        try {
          sessionStorage.setItem(STORAGE_KEY_LAST_SENT, String(Date.now()));
        } catch {
          // Ignore
        }
        setStatus('sent');
        setStatusNote(
          `Pesan dengan desain Custom Modern HTML telah dikirim langsung ke inbox ${PROFILE_INFO.email}.`
        );
        return;
      }

      // 5. Fallback: FormSubmit AJAX with 'table' template & anti-bot honeypot
      const response = await fetch(FORMSUBMIT_AJAX_URL, {
        method: 'POST',
        referrerPolicy: 'origin',
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _honey: honeypot,
          _subject: composedSubject,
          _replyto: cleanEmail,
          _template: 'table',
          _captcha: 'false',
          'Nama Pengirim': cleanName,
          'Gmail Pengirim': cleanEmail,
          'Lokasi Pengirim': `${cleanLocation} (${timezone})`,
          'Waktu Pengiriman': timestamp,
          'Isi Pesan': cleanMessage,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && (data.success === 'true' || data.success === true)) {
        try {
          sessionStorage.setItem(STORAGE_KEY_LAST_SENT, String(Date.now()));
        } catch {
          // Ignore
        }
        setStatus('sent');
        setStatusNote(`Pesan Anda telah masuk langsung ke inbox Gmail ${PROFILE_INFO.email}.`);
      } else {
        setStatus('error');
        setStatusNote(data.message || 'Gagal mengirim pesan otomatis. Silakan coba lagi.');
      }
    } catch {
      setStatus('error');
      setStatusNote('Koneksi terputus. Membuka Gmail Web secara langsung...');
      window.open(buildGmailComposeUrl(composedSubject, composedBody), '_blank', 'noopener,noreferrer');
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE_INFO.email);
      setCopyStatus('Email copied');
    } catch {
      setCopyStatus('Select the email address to copy it.');
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopyStatus(''), 3000);
  };

  const copyAppsScript = async () => {
    try {
      await navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_SNIPPET);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 3000);
    } catch {
      // Ignore
    }
  };

  return (
    <section id="contact" data-tone="light" className="contact-section section-shell">
      <SectionLabel number="10" detail="Muhamad Eldi • AIBEL">Let’s Connect</SectionLabel>
      <h2 className="display-heading contact-heading">
        <Reveal>Got an idea?</Reveal>
        <Reveal delay={0.1}>
          <span className="muted">Let’s build something cool.</span>
        </Reveal>
      </h2>

      <div className="contact-main">
        {/* LEFT COLUMN: Clean Classic Narrative & Contact Details */}
        <div className="contact-copy">
          <p className="contact-lead">
            <Reveal>
              I’m always interested in creative ideas, interesting technologies, and opportunities to learn through real projects.
            </Reveal>
          </p>
          <p className="contact-body">
            Whether it’s a web application, an AI-powered system, a data-driven dashboard, or something completely unexpected, I enjoy exploring how ideas can become real digital experiences.
          </p>
          <p className="contact-body">
            I’m open to collaborations, development opportunities, and meaningful projects that challenge me to grow. <strong>Let’s create something worth building.</strong>
          </p>
          <div className="contact-cta-group">
            <p className="availability icon-label">
              <Sparkles size={14} /> <em>Still learning. Still shipping. Still curious.</em>
            </p>
          </div>

          <div className="contact-details" style={{ marginTop: '42px' }}>
            <div>
              <span className="eyebrow icon-label">
                <User size={13} /> Developer Identity
              </span>
              <p>Muhamad Eldi • aka AIBEL</p>
              <small>Full-Stack Developer • Creative Technologist • AI Explorer</small>
            </div>
            <div>
              <span className="eyebrow icon-label">
                <MapPin size={13} /> Location
              </span>
              <p>{PROFILE_INFO.location}</p>
              <small>{PROFILE_INFO.coordinates}</small>
            </div>
            <div>
              <span className="eyebrow icon-label">
                <Mail size={13} /> Direct Gmail Inbox
              </span>
              <div className="email-row">
                <a href={buildGmailComposeUrl(composedSubject, composedBody)} target="_blank" rel="noopener noreferrer">
                  {PROFILE_INFO.email}
                </a>
                <button className="icon-button" onClick={copy} aria-label="Copy email address">
                  {copyStatus === 'Email copied' ? <Check size={17} /> : <Copy size={17} />}
                </button>
              </div>
              <span className="copy-status" role="status">
                {copyStatus}
              </span>
            </div>
            <div>
              <span className="eyebrow icon-label">
                <Code2 size={13} /> GitHub repository
              </span>
              <a className="text-link" href={PROFILE_INFO.github} target="_blank" rel="noopener noreferrer">
                github.com/Meldi0 <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Simple, Clean Direct Form */}
        <div className="dispatch-console-card">
          <div className="console-top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
            <div className="console-title-group">
              <span className="eyebrow icon-label">
                <Mail size={13} /> Direct Message to {PROFILE_INFO.email}
              </span>
              <h3>Kirim Pesan ke Gmail</h3>
            </div>
            <button
              type="button"
              className="locate-mini-btn"
              onClick={() => setShowTemplateModal(true)}
              style={{ padding: '6px 12px', fontSize: '11.5px', cursor: 'pointer' }}
            >
              <Eye size={13} />
              <span>{gasUrl.trim() ? 'Custom HTML Aktif' : 'Desain Email Gmail'}</span>
            </button>
          </div>

          {status === 'sent' ? (
            <div className="dispatch-receipt" role="status">
              <div className="receipt-badge">
                <CheckCircle2 size={26} />
              </div>
              <h4>Pesan Berhasil Terkirim</h4>
              <p className="receipt-note">{statusNote}</p>

              <div className="receipt-summary">
                <div>
                  <span>Nama Pengirim</span>
                  <strong>{cleanName}</strong>
                </div>
                <div>
                  <span>Gmail Pengirim</span>
                  <strong>{cleanEmail}</strong>
                </div>
                <div>
                  <span>Lokasi Pengirim</span>
                  <strong>{cleanLocation}</strong>
                </div>
                <div>
                  <span>Tujuan</span>
                  <strong>{PROFILE_INFO.email}</strong>
                </div>
              </div>

              <div className="console-actions">
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => {
                    setStatus('idle');
                    setMessage('');
                  }}
                >
                  Kirim Pesan Lagi <Send size={16} />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="console-form" noValidate={false}>
              {/* Anti-Bot Honeypot Trap (hidden from real users) */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: '-9999px',
                  width: '1px',
                  height: '1px',
                  overflow: 'hidden',
                  opacity: 0,
                  pointerEvents: 'none',
                }}
              >
                <label htmlFor="website-url-trap">Website</label>
                <input
                  id="website-url-trap"
                  name="_honey"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={e => setHoneypot(e.target.value)}
                />
              </div>

              <div className="console-row-2col">
                <div className="console-input-wrap">
                  <label htmlFor="sender-name">
                    <User size={13} /> Nama Pengirim
                  </label>
                  <input
                    id="sender-name"
                    name="name"
                    autoComplete="name"
                    maxLength={80}
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Nama Anda"
                  />
                </div>

                <div className="console-input-wrap">
                  <div className="label-with-action">
                    <label htmlFor="sender-location">
                      <MapPin size={13} /> Lokasi Anda
                    </label>
                    <button
                      type="button"
                      className="locate-mini-btn"
                      onClick={detectVisitorLocation}
                      title="Deteksi lokasi otomatis"
                    >
                      <LocateFixed size={12} />
                      <span>{detectingLoc ? 'Mendeteksi...' : 'Auto-Lokasi'}</span>
                    </button>
                  </div>
                  <input
                    id="sender-location"
                    name="location"
                    maxLength={100}
                    value={senderLocation}
                    onChange={e => setSenderLocation(e.target.value)}
                    placeholder="Contoh: Bandung, Indonesia"
                  />
                </div>
              </div>

              <div className="console-input-wrap">
                <label htmlFor="sender-email">
                  <Mail size={13} /> Alamat Gmail / Email Pengirim
                </label>
                <input
                  id="sender-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={120}
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="nama@gmail.com"
                />
              </div>

              <div className="console-input-wrap">
                <label htmlFor="sender-message">Isi Pesan</label>
                <textarea
                  id="sender-message"
                  name="message"
                  rows={5}
                  maxLength={2000}
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Tulis pesan Anda secara spesifik di sini..."
                />
              </div>

              <div className="console-actions">
                <Magnetic type="submit" className="primary-button console-submit-btn">
                  {status === 'sending' ? (
                    <>
                      Mengirim ke Gmail... <Loader2 size={18} className="spin-icon" />
                    </>
                  ) : (
                    <>
                      Kirim Pesan ke Gmail <Send size={17} />
                    </>
                  )}
                </Magnetic>
              </div>

              <p className="security-shield-note">
                <ShieldCheck size={13} /> Dilindungi Anti-Spam Honeypot, Rate Limit 30s &amp; Sanitasi HTML
              </p>

              {status === 'error' && (
                <p className="form-status is-error" role="status">
                  <AlertCircle size={15} /> {statusNote}
                </p>
              )}
            </form>
          )}
        </div>
      </div>

      <footer className="site-footer">
        <span>© 2026 Muhamad Eldi. Built with curiosity, creativity, and a lot of iterations.</span>
        <button onClick={onBackToTop} className="text-link">
          Back to top <ArrowUp size={16} />
        </button>
      </footer>

      {showTemplateModal && (
        <div
          className="email-template-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Preview Desain Email Modern di Gmail"
          data-lenis-prevent
          onClick={e => {
            if (e.target === e.currentTarget) setShowTemplateModal(false);
          }}
        >
          <div
            className="email-template-modal"
            data-lenis-prevent
            onWheel={e => e.stopPropagation()}
            onTouchMove={e => e.stopPropagation()}
          >
            <div className="email-template-modal-header">
              <div>
                <span className="eyebrow icon-label">
                  <Sparkles size={13} /> Custom HTML Email Engine
                </span>
                <h3>Preview Tampilan Pesan di Dalam Gmail Anda</h3>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={() => setShowTemplateModal(false)}
                aria-label="Tutup preview"
              >
                <X size={20} />
              </button>
            </div>

            <div className="email-template-modal-body" data-lenis-prevent>
              <div className="email-setup-banner">
                <p>
                  <strong>Kenapa tadi di Gmail tampilannya abu-abu jadul?</strong> Karena layanan gratis <em>FormSubmit</em> mengunci tampilan bawaan mereka dan melarang pengiriman desain HTML kustom. Agar email yang masuk ke <strong>{PROFILE_INFO.email}</strong> tampil modern persis seperti kartu di bawah ini (tanpa nama FormSubmit), hubungkan <strong>Google Apps Script</strong> akun Gmail Anda (cukup 20 detik, gratis &amp; tanpa password):
                </p>
                <ol className="email-setup-steps">
                  <li>
                    Buka{' '}
                    <a href="https://script.new" target="_blank" rel="noopener noreferrer">
                      script.new <ArrowUpRight size={13} />
                    </a>{' '}
                    di browser Anda, hapus isi awalnya, lalu tempel kode pendek ini:{' '}
                    <button type="button" className="locate-mini-btn" onClick={copyAppsScript}>
                      {copiedScript ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copiedScript ? 'Kode Disalin!' : 'Salin Kode Script (10 Baris)'}</span>
                    </button>
                  </li>
                  <li>
                    Klik tombol biru <strong>Deploy &rarr; New deployment</strong> di kanan atas, pilih jenis <strong>Web app</strong>, ubah <em>Who has access</em> menjadi <strong>Anyone</strong>, lalu klik <strong>Deploy</strong>.
                  </li>
                  <li>Salin <strong>Web app URL</strong> (`https://script.google.com/macros/s/.../exec`) lalu tempel di bawah ini:</li>
                </ol>
                <div className="gas-url-input-row">
                  <input
                    type="url"
                    value={gasUrl}
                    onChange={e => saveGasUrl(e.target.value)}
                    placeholder="Tempel https://script.google.com/macros/s/.../exec di sini"
                  />
                  {isValidGasWebhookUrl(gasUrl) && (
                    <span className="gas-active-badge">
                      <CheckCircle2 size={14} /> Terhubung
                    </span>
                  )}
                </div>
              </div>

              <div className="email-live-render-frame">
                <iframe
                  title="Preview Email Modern di Gmail"
                  sandbox=""
                  srcDoc={htmlEmailString}
                  className="email-sandbox-iframe"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


