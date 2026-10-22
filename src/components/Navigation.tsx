import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Magnetic } from './Magnetic';
export function Navigation() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const update = () => ref.current?.classList.toggle('is-scrolled', scrollY > innerHeight * .65);
    update(); window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); ref.current?.querySelector<HTMLButtonElement>('.menu-toggle')?.focus(); } };
    window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close);
  }, [open]);
  return <header ref={ref} className={`site-nav ${open ? 'menu-open' : ''}`}>
    <a className="wordmark" href="#hero" aria-label="Muhamad Eldi (AIBEL) — back to top" onClick={() => setOpen(false)}>AIBEL<span>Eldi</span></a>
    <span className="nav-signature">Muhamad Eldi · aka AIBEL<span>Full-Stack Developer • Creative Technologist • AI Explorer</span></span>
    <nav aria-label="Main navigation" id="main-navigation" className={open ? 'nav-links is-open' : 'nav-links'}>
      <a href="#identity" onClick={() => setOpen(false)}>About Me</a>
      <a href="#what-i-do" onClick={() => setOpen(false)}>What I Do</a>
      <a href="#stack" onClick={() => setOpen(false)}>Tech Stack</a>
      <a href="#projects" onClick={() => setOpen(false)}>Projects</a>
      <a href="#experience" onClick={() => setOpen(false)}>Experience</a>
      <Magnetic href="#contact" className="nav-contact" onClick={() => setOpen(false)}>Let’s connect <ArrowUpRight size={15} /></Magnetic>
    </nav>
    <button className="menu-toggle icon-button" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(v => !v)}>{open ? <X size={21} /> : <Menu size={21} />}</button>
  </header>;
}
