declare global {
  interface Window {
    __lenisScrollTo?: (top: number) => void;
  }
}

/**
 * Lenis-safe programmatic smooth scroll helper.
 * Prevents Lenis smoothWheel RAF from fighting native window.scrollTo({ behavior: 'smooth' }).
 */
export function smoothScrollTo(top: number) {
  if (typeof window === 'undefined') return;
  const clamped = Math.max(0, top);
  if (typeof window.__lenisScrollTo === 'function') {
    window.__lenisScrollTo(clamped);
    return;
  }
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: clamped, behavior: prefersReduced ? 'auto' : 'smooth' });
}
