import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create('premium', '0.16, 1, 0.3, 1');
export { gsap, ScrollTrigger };
export const EASE = [.16, 1, .3, 1] as const;
export function useMotionSettings() {
  const [settings, setSettings] = useState(() => ({ reduced: matchMedia('(prefers-reduced-motion: reduce)').matches, desktop: matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine)').matches }));
  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine)');
    const update = () => setSettings({ reduced: motion.matches, desktop: desktop.matches });
    motion.addEventListener('change', update); desktop.addEventListener('change', update);
    return () => { motion.removeEventListener('change', update); desktop.removeEventListener('change', update); };
  }, []);
  return settings;
}
