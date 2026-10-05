import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Accessibility } from 'lucide-react';

const STORAGE_KEY = 'civicqc-reduced-motion';
const MotionContext = createContext({
  reduceMotion: false,
  systemReduced: false,
  motionReady: false,
  toggleMotion: () => {},
});

/** One motion preference for video, cards, counters and reveal effects. */
export function MotionPreferencesProvider({ children }: { children: ReactNode }) {
  const [systemReduced, setSystemReduced] = useState(false);
  const [manualReduced, setManualReduced] = useState(false);
  const [motionReady, setMotionReady] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setSystemReduced(media.matches);
    update();
    try {
      setManualReduced(localStorage.getItem(STORAGE_KEY) === 'true');
    } catch {
      // Privacy mode can disable storage; the current-session control still works.
    }
    setMotionReady(true);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const reduceMotion = systemReduced || manualReduced;
  useEffect(() => {
    if (!motionReady) return;
    document.documentElement.dataset.motion = reduceMotion ? 'reduced' : 'full';
    return () => {
      delete document.documentElement.dataset.motion;
    };
  }, [reduceMotion, motionReady]);

  const toggleMotion = useCallback(() => {
    if (systemReduced) return;
    const next = !manualReduced;
    setManualReduced(next);
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      /* Session-only fallback. */
    }
  }, [manualReduced, systemReduced]);

  const value = useMemo(
    () => ({ reduceMotion, systemReduced, motionReady, toggleMotion }),
    [reduceMotion, systemReduced, motionReady, toggleMotion],
  );
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export const useMotionPreferences = () => useContext(MotionContext);

/** Kept in the footer, not as an overlay/tab on the hero video. */
export function MotionPreferenceControl() {
  const { reduceMotion, systemReduced, motionReady, toggleMotion } = useMotionPreferences();
  if (systemReduced) {
    return (
      <span className="motion-preference-note">
        <Accessibility size={13} aria-hidden="true" />
        Reduced motion · device setting
      </span>
    );
  }
  return (
    <button
      type="button"
      className="motion-preference-button"
      onClick={toggleMotion}
      disabled={!motionReady}
      aria-pressed={reduceMotion}
      aria-label={reduceMotion ? 'Enable website motion' : 'Reduce website motion'}
    >
      <Accessibility size={13} aria-hidden="true" />
      {reduceMotion ? 'Enable motion' : 'Reduce motion'}
    </button>
  );
}
