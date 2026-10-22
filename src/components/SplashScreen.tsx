import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
}

const EASING_APPLE = [0.22, 1, 0.36, 1] as const;

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const startTime = performance.now();
    const duration = 1550;

    let animId: number;
    const updateProgress = (now: number) => {
      const elapsed = now - startTime;
      const rawP = Math.min(elapsed / duration, 1);

      const easeP = rawP === 1 ? 1 : 1 - Math.pow(2, -10 * rawP);
      const current = Math.floor(easeP * 100);

      setProgress(current);

      if (rawP < 1) {
        animId = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        setTimeout(() => {
          setIsDone(true);
          setTimeout(() => {
            onComplete();
          }, 680);
        }, 160);
      }
    };

    animId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animId);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          id="splash-screen"
          initial={{ opacity: 1, y: 0 }}
          exit={{
            opacity: 0,
            scale: 1.02,
            transition: {
              duration: 0.65,
              ease: EASING_APPLE,
            },
          }}
          className="splash-clean-root"
          style={{ willChange: 'opacity, transform' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: EASING_APPLE }}
            className="splash-clean-center"
          >
            <span className="splash-clean-name">Muhamad Eldi</span>
            <span className="splash-clean-sub">aka AIBEL</span>

            <div className="splash-clean-bar-wrap" aria-hidden="true">
              <div className="splash-clean-bar-track">
                <div
                  className="splash-clean-bar-fill"
                  style={{ transform: `scaleX(${progress / 100})` }}
                />
              </div>
              <span className="splash-clean-pct">{progress}%</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


