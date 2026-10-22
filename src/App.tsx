import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { MotionConfig } from 'motion/react';
import { gsap, ScrollTrigger, useMotionSettings } from './lib/motion';
import { HeroScrollExperience } from './components/HeroScrollExperience';
import { Navigation } from './components/Navigation';
import { IdentitySection } from './components/IdentitySection';
import { MetricsSection } from './components/MetricsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ConstellationSection } from './components/ConstellationSection';
import { ContactSection } from './components/ContactSection';
import { SoundAmbience } from './components/SoundAmbience';
import { SplashScreen } from './components/SplashScreen';

export default function App() {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [splashComplete, setSplashComplete] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const { reduced, desktop } = useMotionSettings();
  useEffect(() => {
    if (reduced || !desktop) return;
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, syncTouch: false, anchors: { duration: 1.1 } });
    const tick = (time: number) => lenis.raf(time * 1000);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(tick);
    const onDialog = (event: Event) => (event as CustomEvent<boolean>).detail ? lenis.stop() : lenis.start();
    window.addEventListener('portfolio:dialog', onDialog);
    return () => { window.removeEventListener('portfolio:dialog', onDialog); gsap.ticker.remove(tick); lenis.destroy(); };
  }, [reduced, desktop]);
  useEffect(() => {
    if (!root.current) return;
    const light = ['#f5f4f0', '#161719', '#64666b', 'rgba(22,23,25,0.15)'];
    const dark = ['#08090b', '#f5f4f0', '#a2a5ad', 'rgba(245,244,240,0.17)'];
    const keys = ['--page-bg', '--page-text', '--page-muted', '--page-line'];
    let stops: { start: number; end: number; from: string[]; to: string[] }[] = [];
    const measure = () => {
      let previous = light;
      stops = Array.from(document.querySelectorAll<HTMLElement>('[data-tone]')).map(el => {
        const next = el.dataset.tone === 'dark' ? dark : light;
        const top = el.getBoundingClientRect().top + window.scrollY;
        const stop = { start: top - innerHeight * .85, end: top - innerHeight * .18, from: previous, to: next };
        previous = next;
        return stop;
      });
    };
    let lastColor = '';
    const luminance = (color: string) => gsap.utils.splitColor(color).slice(0, 3).map(channel => {
      const s = channel / 255; return s <= .04045 ? s / 12.92 : Math.pow((s + .055) / 1.055, 2.4);
    }).reduce((sum, channel, i) => sum + channel * [.2126, .7152, .0722][i], 0);
    const update = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, window.scrollY / maxScroll))})`;
      }
      let colors = light;
      for (const stop of stops) {
        if (scrollY < stop.start) break;
        const progress = reduced ? (scrollY >= stop.end ? 1 : 0) : gsap.utils.clamp(0, 1, (scrollY - stop.start) / (stop.end - stop.start));
        colors = stop.to.map((color, i) => gsap.utils.interpolate(stop.from[i], color, progress));
      }
      if (lastColor === colors[0]) return;
      lastColor = colors[0];
      const backgroundLuminance = luminance(colors[0]);
      const contrast = (color: string) => { const l = luminance(color); return (Math.max(l, backgroundLuminance) + .05) / (Math.min(l, backgroundLuminance) + .05); };
      const palette = backgroundLuminance > .179 ? light : dark;
      // Foreground colors never pass through an unreadable gray-on-gray midpoint.
      const readable = contrast(palette[1]) >= 4.5 ? palette[1] : backgroundLuminance > .179 ? '#000000' : '#ffffff';
      colors[1] = readable;
      colors[2] = contrast(palette[2]) >= 4.5 ? palette[2] : readable;
      colors[3] = palette[3];
      keys.forEach((key, i) => root.current?.style.setProperty(key, colors[i]));
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', colors[0]);
    };
    measure();
    const trigger = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: update, onRefresh: () => { measure(); update(); } });
    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh);
    update();
    return () => { trigger.kill(); window.removeEventListener('load', refresh); };
  }, [reduced]);
  return <MotionConfig reducedMotion="user" transition={{ duration: .9, ease: [.16, 1, .3, 1] }}>
    {!splashComplete && <SplashScreen onComplete={() => setSplashComplete(true)} />}
    <div ref={root} className="portfolio">
      <div className="scroll-progress-track" aria-hidden="true"><div ref={progressRef} className="scroll-progress-bar" /></div>
      <a className="skip-link" href="#identity">Skip to content</a>
      <Navigation />
      <main id="main-content">
        <HeroScrollExperience isAudioPlaying={isAudioPlaying} onToggleAudio={() => setIsAudioPlaying(v => !v)} />
        <IdentitySection /><MetricsSection /><ConstellationSection /><ProjectsSection />
        <ContactSection onBackToTop={() => { location.hash = 'hero'; }} />
      </main>
      <SoundAmbience isPlaying={isAudioPlaying} onToggle={() => setIsAudioPlaying(v => !v)} />
    </div>
  </MotionConfig>;
}
