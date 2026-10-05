import { useEffect, useRef, useState } from 'react';
import type { ReactNode, SVGProps } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Phone } from 'lucide-react';
import { whatsappLink, PHONE, CALL_LINK } from '../data';
import { useMotionPreferences } from './MotionPreferences';

export function BrandMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 48" fill="none" aria-hidden="true" className={className}>
      <path
        d="M22 2 40 9v16c0 9-10 17-18 21C14 42 4 34 4 25V9L22 2Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M12 27V15h8v7m4-8v-4h8v12" stroke="currentColor" strokeWidth="2" />
      <path d="m13 29 7 7 14-15" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}
export function Logo({ light = true, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <Link
      to="/"
      aria-label="CivicQC Consultants home"
      className={`brand ${light ? 'brand-light' : 'brand-dark'} ${compact ? 'brand-compact' : ''}`}
    >
      <BrandMark className="brand-mark" />
      <span className="brand-type">
        Civic<span className="brand-qc">QC</span>
        <span className="brand-subtitle">CONSULTANTS</span>
      </span>
    </Link>
  );
}
export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.52 3.48A11.87 11.87 0 0 0 12.04 0C5.47 0 .13 5.34.13 11.91c0 2.1.55 4.15 1.6 5.97L.04 24l6.27-1.65a11.9 11.9 0 0 0 5.72 1.46h.01c6.56 0 11.9-5.34 11.91-11.91a11.83 11.83 0 0 0-3.43-8.42ZM12.04 21.8a9.9 9.9 0 0 1-5.05-1.38l-.36-.22-3.72.98.99-3.63-.24-.38a9.87 9.87 0 0 1-1.52-5.26c0-5.46 4.44-9.9 9.9-9.9a9.84 9.84 0 0 1 7 2.9 9.84 9.84 0 0 1 2.9 7c-.01 5.46-4.45 9.89-9.9 9.89Zm5.43-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.18.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.75-1.65-2.05-.18-.3-.02-.46.13-.6l.44-.53c.15-.17.2-.3.3-.49.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.21-.25-.59-.5-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.48 0 1.46 1.06 2.87 1.21 3.07.15.2 2.1 3.21 5.09 4.5.71.3 1.26.48 1.69.62.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z" />
    </svg>
  );
}
export function ButtonLink({
  to,
  children,
  variant = 'primary',
  className = '',
  arrow = true,
  onClick,
}: {
  to: string;
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'dark' | 'light-outline';
  className?: string;
  arrow?: boolean;
  onClick?: () => void;
}) {
  const classes = `btn btn-${variant} ${className}`;
  const content = (
    <>
      {children}
      {arrow && <ArrowUpRight size={18} aria-hidden="true" />}
    </>
  );
  return to.startsWith('http') || to.startsWith('tel:') || to.startsWith('mailto:') ? (
    <a
      className={classes}
      href={to}
      onClick={onClick}
      {...(to.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {content}
    </a>
  ) : (
    <Link className={classes} to={to} onClick={onClick}>
      {content}
    </Link>
  );
}
/** Native click-to-call: opens the visitor's dialer, without a third-party calling service. */
export function CallButton({
  dark = false,
  className = '',
}: {
  dark?: boolean;
  className?: string;
}) {
  return (
    <a
      href={CALL_LINK}
      className={`btn ${dark ? 'btn-outline' : 'btn-light-outline'} call-button ${className}`}
      aria-label={`Call Now: CivicQC Consultants at ${PHONE}`}
    >
      <Phone size={18} strokeWidth={1.6} aria-hidden="true" />
      <span>Call Now</span>
    </a>
  );
}

export function WhatsAppButton({
  full = false,
  dark = false,
  text,
}: {
  full?: boolean;
  dark?: boolean;
  text?: string;
}) {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn ${dark ? 'btn-outline' : 'btn-light-outline'}`}
    >
      <WhatsAppIcon width={18} height={18} />
      {text || (full ? 'WhatsApp +91 8275363060' : 'WhatsApp Us')}
    </a>
  );
}
export function TextLink({
  to,
  children,
  className = '',
}: {
  to: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link to={to} className={`text-link ${className}`}>
      {children}
      <ArrowRight size={17} aria-hidden="true" />
    </Link>
  );
}
export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <div className={`eyebrow ${light ? 'eyebrow-light' : ''}`}>
      <span className="eyebrow-line" />
      {children}
    </div>
  );
}
export function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduceMotion, motionReady } = useMotionPreferences();
  useEffect(() => {
    const node = ref.current;
    if (!node || !motionReady) return;
    if (reduceMotion) {
      node.classList.remove('reveal-ready');
      node.classList.add('reveal-visible');
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('reveal-visible');
          observer.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    node.classList.add('reveal-ready');
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion, motionReady]);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
export function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [value, setValue] = useState(end);
  const ref = useRef<HTMLSpanElement>(null);
  const { reduceMotion, motionReady } = useMotionPreferences();
  useEffect(() => {
    if (!motionReady) return;
    if (reduceMotion) {
      setValue(end);
      return;
    }
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / 900, 1);
        setValue(Math.round(end * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [end, reduceMotion, motionReady]);
  return (
    <span ref={ref}>
      <span aria-hidden="true">
        {value}
        {suffix}
      </span>
      <span className="sr-only">
        {end}
        {suffix}
      </span>
    </span>
  );
}
