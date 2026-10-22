import { useEffect } from 'react';
import { VolumeX } from 'lucide-react';
export function SoundAmbience({ isPlaying, onToggle }: { isPlaying: boolean; onToggle: () => void; showFloatingButton?: boolean }) {
  useEffect(() => {
    if (!isPlaying) return;
    let context: AudioContext | undefined;
    try {
      context = new AudioContext();
      void context.resume().catch(() => {});
      const gain = context.createGain(); gain.gain.setValueAtTime(0, context.currentTime); gain.gain.setTargetAtTime(.022, context.currentTime, 1);
      gain.connect(context.destination);
      const oscillators = [55, 110.5].map(frequency => { const oscillator = context!.createOscillator(); oscillator.frequency.value = frequency; oscillator.connect(gain); oscillator.start(); return oscillator; });
      return () => { const ctx = context!; gain.gain.setTargetAtTime(0, ctx.currentTime, .04); oscillators.forEach(oscillator => oscillator.stop(ctx.currentTime + .2)); setTimeout(() => { void ctx.close().catch(() => {}); }, 250); };
    } catch { if (context) void context.close(); }
  }, [isPlaying]);
  return isPlaying ? <button className="ambient-float" aria-label="Mute ambient sound" onClick={onToggle}><VolumeX size={16} /> Mute</button> : null;
}
