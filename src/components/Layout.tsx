import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, X, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { Logo, WhatsAppIcon, ButtonLink } from './UI';
import { MotionPreferenceControl } from './MotionPreferences';
import { INSPECTION_DISCLAIMER } from '../content/catalog';
import { PHONE, EMAIL, CALL_LINK, whatsappLink, bookingLink } from '../data';

const navigation = [
  { to: '/', text: 'Home' },
  { to: '/about', text: 'About' },
  { to: '/services', text: 'Services' },
  { to: '/#process', text: 'Inspection Process' },
  { to: '/#checklist', text: 'Inspection Checklist' },
  { to: '/pricing', text: 'Pricing' },
  { to: '/#report', text: 'Sample Report' },
  { to: '/#faq', text: 'FAQ' },
  { to: '/#contact', text: 'Contact' },
];
export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [activeHash, setActiveHash] = useState('');
  useEffect(() => {
    setActiveHash(location.hash);
  }, [location.hash]);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  useEffect(() => {
    setOpen(false);
  }, [location]);
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (event.key === 'Tab') {
        const links = menuRef.current?.querySelectorAll<HTMLElement>('a, button');
        const last = links?.[links.length - 1];
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          toggleRef.current?.focus();
        }
        if (event.shiftKey && document.activeElement === toggleRef.current) {
          event.preventDefault();
          last?.focus();
        }
      }
    };
    const onResize = () => {
      if (window.innerWidth > 1240) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    menuRef.current?.querySelector<HTMLElement>('a')?.focus();
    return () => {
      document.body.style.overflow = original;
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);
  return (
    <header className="site-header">
      <div className="container nav-inner">
        <Logo />
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item) =>
            item.to.includes('#') ? (
              <Link
                key={item.text}
                to={item.to}
                className={activeHash === item.to.slice(1) ? 'active' : ''}
              >
                {item.text}
              </Link>
            ) : (
              <NavLink
                key={item.text}
                to={item.to}
                end={item.to !== '/services'}
                className={({ isActive }) =>
                  isActive && (item.to !== '/' || !activeHash) ? 'active' : ''
                }
              >
                {item.text}
              </NavLink>
            ),
          )}
        </nav>
        <a
          className="nav-whatsapp"
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp for Inspection"
        >
          <WhatsAppIcon width={18} height={18} />
          <span>WhatsApp</span>
        </a>
        <ButtonLink to={bookingLink()} className="nav-book">
          Book Inspection
        </ButtonLink>
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen(!open)}
          className="menu-toggle"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav ref={menuRef} id="mobile-menu" className="mobile-menu" aria-label="Mobile navigation">
          <div className="mobile-menu-label">A CLOSER LOOK. A CLEARER DECISION.</div>
          {navigation.map((item) => (
            <Link to={item.to} key={item.text} onClick={() => setOpen(false)}>
              {item.text}
              <ArrowUpRight size={22} />
            </Link>
          ))}
          <div className="mobile-menu-contact">
            <a href={CALL_LINK}>
              <Phone size={18} />
              {PHONE}
            </a>
            <p>Professional property inspection in Nagpur.</p>
          </div>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  const links = [
    ['Home', '/'],
    ['About', '/about'],
    ['Services', '/services'],
    ['Pricing', '/pricing'],
    ['Sample Report', '/#report'],
    ['Privacy', '/privacy'],
    ['PDI', '/services/pre-delivery-inspection'],
    ['Moisture Audit', '/services/moisture-audit'],
    ['Civil & Material Testing', '/services#civil-material'],
    ['Inspection Process', '/#process'],
    ['FAQ', '/#faq'],
    ['Contact', '/#contact'],
  ];
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo />
            <p>
              Construction Quality &<br />
              Property Inspection
            </p>
            <span className="footer-tagline">Your independent property quality partner.</span>
          </div>
          <div className="footer-nav">
            <span className="footer-title">Explore CivicQC</span>
            <div className="footer-links">
              {links.map(([label, to]) => (
                <Link to={to} key={label}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="footer-contact">
            <span className="footer-title">Let’s talk about your property</span>
            <a href={CALL_LINK}>
              <Phone size={16} />
              {PHONE}
            </a>
            <a href={`mailto:${EMAIL}`}>
              <Mail size={16} />
              <span>{EMAIL}</span>
            </a>
            <span>
              <MapPin size={16} />
              Nagpur, Maharashtra
            </span>
            <a
              className="footer-wa"
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
            >
              Start a conversation
              <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
        <details className="footer-inspection-disclaimer">
          <summary>Inspection Disclaimer</summary>
          <p>{INSPECTION_DISCLAIMER}</p>
        </details>
        <div className="footer-bottom">
          <span>© 2026 CivicQC Consultants. All Rights Reserved.</span>
          <div className="footer-meta">
            <MotionPreferenceControl />
            <span>
              <span className="status-dot" />
              Quality is in the details.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function ContactActions() {
  return (
    <>
      <a
        className="floating-call"
        href={CALL_LINK}
        aria-label={`Call Now: CivicQC Consultants at ${PHONE}`}
      >
        <span className="floating-tooltip">Call {PHONE}</span>
        <Phone size={22} strokeWidth={1.7} aria-hidden="true" />
      </a>
      <a
        className="floating-whatsapp"
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with CivicQC Consultants on WhatsApp"
      >
        <span className="floating-tooltip">Let’s talk about your home</span>
        <WhatsAppIcon width={25} height={25} />
      </a>
      <div className="mobile-bottom-cta mobile-contact-actions">
        <Link to={bookingLink()} aria-label="Book an Inspection">
          <span>Book Inspection</span>
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <a
          className="mobile-quick-call"
          href={CALL_LINK}
          aria-label={`Call Now: CivicQC Consultants at ${PHONE}`}
        >
          <Phone size={17} strokeWidth={1.6} aria-hidden="true" />
          <span>Call Now</span>
        </a>
        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon width={20} height={20} />
          WhatsApp
        </a>
      </div>
    </>
  );
}

export function ScrollManager() {
  const { pathname, hash, search, key } = useLocation();
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (hash) {
        document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({
          behavior:
            document.documentElement.dataset.motion === 'reduced' ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
              ? 'instant'
              : 'smooth',
          block: 'start',
        });
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash, search, key]);
  return null;
}
