import { useEffect, type RefObject } from 'react';

// Native modal semantics provide focus containment, Escape and an inert background.
export function useDialog(ref: RefObject<HTMLDialogElement | null>, onClose: () => void) {
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    window.dispatchEvent(new CustomEvent('portfolio:dialog', { detail: true }));
    const cancel = (event: Event) => { event.preventDefault(); onClose(); };
    dialog.addEventListener('cancel', cancel);
    return () => {
      dialog.removeEventListener('cancel', cancel); dialog.close(); document.body.style.overflow = overflow;
      window.dispatchEvent(new CustomEvent('portfolio:dialog', { detail: false }));
      previous?.focus({ preventScroll: true });
    };
  }, [ref, onClose]);
}
