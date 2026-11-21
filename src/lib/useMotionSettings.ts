import { useEffect, useState } from 'react';

export function useMotionSettings() {
  const [settings, setSettings] = useState(() => ({
    reduced: typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false,
    desktop:
      typeof window !== 'undefined'
        ? window.matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine)').matches
        : true,
  }));

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = window.matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine)');
    const update = () => setSettings({ reduced: motion.matches, desktop: desktop.matches });
    motion.addEventListener('change', update);
    desktop.addEventListener('change', update);
    return () => {
      motion.removeEventListener('change', update);
      desktop.removeEventListener('change', update);
    };
  }, []);

  return settings;
}
