import { useEffect, useRef, useState } from 'react';
import { useMotionPreferences } from './MotionPreferences';

const POSTER = '/images/hero-video-poster.webp';
const chooseSource = () =>
  window.matchMedia('(max-width: 760px)').matches
    ? '/videos/hero-background-mobile.mp4'
    : '/videos/hero-background.mp4';

/** Silent background video: no visible controls or Pause-video tab in the header. */
export default function HeroBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { reduceMotion, motionReady } = useMotionPreferences();
  const [source, setSource] = useState<string>();
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [isTabVisible, setIsTabVisible] = useState(true);

  useEffect(() => {
    if (!motionReady || reduceMotion || source) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    if (!connection?.saveData) setSource(chooseSource());
  }, [motionReady, reduceMotion, source]);

  useEffect(() => {
    const onVisibility = () => setIsTabVisible(document.visibilityState === 'visible');
    onVisibility();
    document.addEventListener('visibilitychange', onVisibility);
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      threshold: 0,
      rootMargin: '80px 0px',
    });
    const section = videoRef.current?.closest('section');
    if (section) observer.observe(section);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      observer.disconnect();
    };
  }, []);

  const canPlay = motionReady && !reduceMotion && isInView && isTabVisible && !hasError;
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !source) return;
    if (!canPlay) {
      video.pause();
      return;
    }
    video.muted = true;
    void video.play().catch(() => {
      // A blocked autoplay falls back to the poster. No broken controls or errors.
    });
  }, [source, canPlay]);

  return (
    <div className="hero-video-background" aria-hidden="true">
      <img
        src={POSTER}
        alt=""
        width="1440"
        height="814"
        fetchPriority="high"
        className="hero-video-poster"
      />
      <video
        ref={videoRef}
        className={`hero-background-film ${isReady && !hasError ? 'video-ready' : ''}`}
        src={source}
        poster={POSTER}
        autoPlay={canPlay}
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        tabIndex={-1}
        onLoadedData={() => setIsReady(true)}
        onError={() => setHasError(true)}
      />
      <div className="hero-video-overlay" />
    </div>
  );
}
