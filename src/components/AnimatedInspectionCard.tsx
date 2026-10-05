import { useEffect, useId, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Clock3, Crosshair, ScanLine, ShieldCheck } from 'lucide-react';
import { useMotionPreferences } from './MotionPreferences';
import { SeverityLegend } from './InspectionScore';

export type InspectionCardVariant = 'pdi' | 'moisture' | 'quality';
export type InspectionItem = { label: string; detail: string };
export type AnimatedInspectionCardProps = {
  title?: string;
  description?: string;
  inspectionItems?: readonly (string | InspectionItem)[];
  badge?: string;
  reportTime?: string;
  ctaText?: string;
  ctaLink?: string;
  label?: string;
  variant?: InspectionCardVariant;
  className?: string;
  headingLevel?: 2 | 3;
};

const PRESETS: Record<
  InspectionCardVariant,
  { title: string; description: string; items: InspectionItem[] }
> = {
  pdi: {
    title: '100+ Point Property Inspection',
    description: 'Identify hidden construction defects before they become expensive problems.',
    items: [
      {
        label: 'Civil Quality',
        detail: 'Visible wall, ceiling and civil-work conditions, assessed systematically.',
      },
      {
        label: 'Flooring & Tiles',
        detail: 'Tile alignment, surface defects and indicators of hollow areas.',
      },
      {
        label: 'Electrical',
        detail: 'Accessible switches, sockets and functional points, where safe.',
      },
      {
        label: 'Plumbing',
        detail: 'Accessible fixtures, leakage, drainage and practical flow observations.',
      },
      {
        label: 'Moisture',
        detail: 'Professional moisture-meter observations and visible dampness indicators.',
      },
      {
        label: 'Finishing',
        detail: 'Paint, grouting, sealing and the workmanship details that matter.',
      },
    ],
  },
  moisture: {
    title: 'Advanced Moisture Detection',
    description: 'Look beyond fresh paint. Identify potential seepage and dampness concerns.',
    items: [
      {
        label: 'Moisture',
        detail: 'Indicative moisture readings, interpreted in the context of the surface.',
      },
      {
        label: 'Wall Surfaces',
        detail: 'Accessible walls checked for dampness, staining and visible deterioration.',
      },
      {
        label: 'Ceiling Areas',
        detail: 'Visible staining and moisture indicators at ceilings and junctions.',
      },
      {
        label: 'Window Joints',
        detail: 'Accessible window reveals and seals reviewed for potential moisture concerns.',
      },
      {
        label: 'Seepage Signs',
        detail: 'Problem areas documented; the exact cause may require further investigation.',
      },
      {
        label: 'Photo Records',
        detail: 'Clear photographs linked to locations and relevant observations.',
      },
    ],
  },
  quality: {
    title: 'Complete Property Quality Assessment',
    description: 'A systematic view of workmanship, functionality and your property’s condition.',
    items: [
      {
        label: 'Civil Quality',
        detail: 'Visible civil-work condition, surface defects and accessible junctions.',
      },
      {
        label: 'Workmanship',
        detail: 'Installation and finishing details reviewed against the agreed scope.',
      },
      {
        label: 'Fixtures',
        detail: 'Accessible fittings, alignment, fixing and basic functional condition.',
      },
      {
        label: 'Electrical',
        detail: 'Visible concerns and functional points assessed where safe and accessible.',
      },
      {
        label: 'Plumbing',
        detail: 'Accessible fixtures, connections and signs of leakage or drainage concerns.',
      },
      {
        label: 'Finishing',
        detail: 'A clear record of observed finishing defects and recommended next steps.',
      },
    ],
  },
};

/** Only this tiny text component re-renders during the one-time count-up. */
function InspectionMetric({
  value,
  suffix,
  start,
}: {
  value: number;
  suffix: string;
  start: boolean;
}) {
  const { reduceMotion, motionReady } = useMotionPreferences();
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    if (!start || !motionReady) return;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    let frame = 0;
    const startedAt = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / 1000, 1);
      setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, value, reduceMotion, motionReady]);
  return (
    <span className="aic-metric">
      <span aria-hidden="true" style={{ minWidth: `${String(value).length + suffix.length}ch` }}>
        {display}
        {suffix}
      </span>
    </span>
  );
}

function InspectionBadge({ children, report = false }: { children: string; report?: boolean }) {
  const Icon = report ? Clock3 : ShieldCheck;
  return (
    <span className={`aic-badge ${report ? 'aic-badge-report' : ''}`}>
      <Icon size={12} aria-hidden="true" />
      {children}
    </span>
  );
}

const POINTS = [
  [71, 48],
  [81, 137],
  [155, 140],
  [198, 56],
  [218, 108],
  [127, 88],
];

/** Original SVG scope diagram. No invented readings, scores or live-assessment claims. */
function InspectionScan({ active, variant }: { active: number; variant: InspectionCardVariant }) {
  const id = useId().replace(/:/g, '');
  return (
    <div className="aic-scan-window" aria-hidden="true">
      <div className="aic-plan-label">
        <Crosshair size={10} />
        PROPERTY OVERVIEW
      </div>
      <svg className="aic-plan" viewBox="0 0 270 208" fill="none">
        <defs>
          <linearGradient id={`scan-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#7ce0d1" stopOpacity="0" />
            <stop offset="1" stopColor="#7ce0d1" stopOpacity=".2" />
          </linearGradient>
          <clipPath id={`scope-${id}`}>
            <rect x="34" y="29" width="207" height="141" rx="1" />
          </clipPath>
        </defs>
        <g className="aic-plan-outline">
          <path d="M36 31H239V168H36V31Z" strokeWidth="1.7" />
          <path
            d="M134 31V72M134 101V168M36 110H104M134 110H166M199 110H239M182 31V78M182 96V110"
            strokeWidth="1.2"
          />
          <path
            d="M104 110v30a30 30 0 0 0 30-30M134 72h-29a29 29 0 0 0 29 29M182 78h-18a18 18 0 0 0 18 18M166 110v33a33 33 0 0 0 33-33"
            className="aic-door-arcs"
            strokeWidth=".7"
          />
          <path
            d="M55 46h46v41H55zM55 59h46M78 46v13M197 41h28v18h-28zM199 66h20v27h-20zM48 126h39v13H48zM58 147h34v10H58zM154 125h29v27h-29zM188 146h32v12h-32z"
            strokeWidth=".7"
            className="aic-plan-furniture"
          />
        </g>
        <g className="aic-plan-windows" strokeWidth="3">
          <path d="M59 31h42M157 31h13M239 63v25M239 132v23M83 168h29" />
        </g>
        <g className="aic-plan-windows" strokeWidth=".5">
          <path d="M59 26h42M157 26h13M244 63v25M244 132v23M83 173h29" />
        </g>
        <g className="aic-measure-lines" strokeWidth=".7">
          <path d="M36 184H239M36 181v6M239 181v6M134 181v6M22 31v137M19 31h6M19 168h6" />
        </g>
        <g clipPath={`url(#scope-${id})`}>
          <g className="aic-scan-band">
            <rect x="34" y="26" width="208" height="25" fill={`url(#scan-${id})`} />
            <path d="M34 51H242" stroke="#7ce0d1" strokeWidth="1" strokeOpacity=".68" />
          </g>
        </g>
        {POINTS.map(([x, y], index) => (
          <g
            key={index}
            className={`aic-marker ${active % 6 === index ? 'aic-marker-active' : ''} ${variant === 'moisture' && index === 4 ? 'aic-marker-amber' : ''}`}
            data-marker={index}
            transform={`translate(${x},${y})`}
          >
            <circle className="aic-marker-halo" r="12" />
            <circle className="aic-marker-ring" r="7" strokeWidth=".7" />
            <circle className="aic-marker-dot" r="2.7" />
          </g>
        ))}
        <g className="aic-register-marks" strokeWidth=".6">
          <path d="M7 17v-6h6M251 11h6v6M7 180v6h6M251 186h6v-6" />
        </g>
        <text x="78" y="201" className="aic-plan-scale">
          SCOPE VIEW · NOT TO SCALE
        </text>
      </svg>
    </div>
  );
}

/** Shared, editable React component used on the home, catalogue and service pages. */
export default function AnimatedInspectionCard({
  title,
  description,
  inspectionItems,
  badge = 'PROFESSIONAL ASSESSMENT',
  reportTime = 'REPORT WITHIN 24 HOURS',
  ctaText = 'Book Inspection',
  ctaLink = '/book-inspection',
  label = 'CIVICQC INSPECTION',
  variant = 'pdi',
  className = '',
  headingLevel = 3,
}: AnimatedInspectionCardProps) {
  const TitleTag = headingLevel === 2 ? 'h2' : 'h3';
  const preset = PRESETS[variant];
  const heading = title ?? preset.title;
  const items: InspectionItem[] = inspectionItems?.length
    ? inspectionItems.map((item) =>
        typeof item === 'string'
          ? (preset.items.find((entry) => entry.label === item) ?? {
              label: item,
              detail: `${item}, reviewed within the agreed inspection scope.`,
            })
          : item,
      )
    : preset.items;
  const [selected, setSelected] = useState(0);
  const [entered, setEntered] = useState(false);
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const { reduceMotion, motionReady } = useMotionPreferences();
  const root = useRef<HTMLElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const pointerRect = useRef<DOMRect | null>(null);
  const pointerFrame = useRef(0);
  const pointerPosition = useRef({ x: 0, y: 0 });
  const finePointer = useRef(false);
  const uid = useId().replace(/:/g, '');
  const active = Math.min(selected, items.length - 1);
  const activeItem = items[active];
  const numericTitle = heading.match(/^(\d+)(\+?)\s+(.+)$/);
  const motionEnabled = motionReady && !reduceMotion;
  const animationRunning = motionEnabled && inView && tabVisible;

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const updatePointer = () => {
      finePointer.current = query.matches;
    };
    updatePointer();
    query.addEventListener('change', updatePointer);
    const onVisibility = () => setTabVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVisibility);
    onVisibility();
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setEntered(true);
      },
      { threshold: 0.12 },
    );
    if (root.current) observer.observe(root.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(pointerFrame.current);
      query.removeEventListener('change', updatePointer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const followPointer = (event: PointerEvent<HTMLDivElement>) => {
    if (!motionEnabled || !finePointer.current || event.pointerType !== 'mouse') return;
    const rect = pointerRect.current;
    if (!rect) return;
    pointerPosition.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    if (pointerFrame.current) return;
    pointerFrame.current = requestAnimationFrame(() => {
      if (glow.current) {
        const { x, y } = pointerPosition.current;
        glow.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }
      pointerFrame.current = 0;
    });
  };

  return (
    <article
      ref={root}
      className={`animated-inspection-card ${className}`}
      aria-labelledby={`${uid}-title`}
      data-variant={variant}
      data-entered={entered}
      data-motion={motionEnabled ? 'full' : 'reduced'}
      data-running={animationRunning}
      data-active-area={activeItem.label}
    >
      <div
        className="aic-surface"
        onPointerEnter={(event) => {
          pointerRect.current = event.currentTarget.getBoundingClientRect();
          followPointer(event);
        }}
        onPointerMove={followPointer}
        onPointerLeave={() => {
          cancelAnimationFrame(pointerFrame.current);
          pointerFrame.current = 0;
          pointerRect.current = null;
        }}
      >
        <div className="aic-grid" aria-hidden="true" />
        <div ref={glow} className="aic-cursor-glow" aria-hidden="true" />
        <span className="aic-corner aic-corner-top" aria-hidden="true" />
        <span className="aic-corner aic-corner-bottom" aria-hidden="true" />
        <div className="aic-content">
          <div className="aic-topline">
            <span>
              <ScanLine size={17} strokeWidth={1.4} aria-hidden="true" />
              {label}
            </span>
            <span className="aic-top-meta">PRECISION BY DESIGN</span>
          </div>
          <TitleTag className="aic-title" id={`${uid}-title`} aria-label={heading}>
            {numericTitle ? (
              <>
                <InspectionMetric
                  value={Number(numericTitle[1])}
                  suffix={numericTitle[2]}
                  start={entered}
                />{' '}
                {numericTitle[3]}
              </>
            ) : (
              heading
            )}
          </TitleTag>
          <p className="aic-description">{description ?? preset.description}</p>
          <div className="aic-badges">
            {badge && <InspectionBadge>{badge}</InspectionBadge>}
            {reportTime && <InspectionBadge report>{reportTime}</InspectionBadge>}
          </div>
          <div className="aic-inspection-interface">
            <InspectionScan active={active} variant={variant} />
            <div className="aic-checklist">
              <span className="aic-checklist-label">AREAS WE REVIEW</span>
              <ul aria-label="Inspection focus areas">
                {items.map((item, index) => (
                  <li
                    key={item.label}
                    style={{ '--indicator-delay': `${280 + index * 85}ms` } as CSSProperties}
                  >
                    <button
                      type="button"
                      className="aic-indicator"
                      id={`${uid}-item-${index}`}
                      aria-pressed={active === index}
                      aria-controls={`${uid}-observation`}
                      aria-describedby={active === index ? `${uid}-observation` : undefined}
                      onClick={() => setSelected(index)}
                      onFocus={() => setSelected(index)}
                      onPointerEnter={(event) => {
                        if (event.pointerType === 'mouse') setSelected(index);
                      }}
                      onKeyDown={(event) => {
                        if (
                          ![
                            'ArrowDown',
                            'ArrowUp',
                            'ArrowRight',
                            'ArrowLeft',
                            'Home',
                            'End',
                          ].includes(event.key)
                        )
                          return;
                        event.preventDefault();
                        const next =
                          event.key === 'Home'
                            ? 0
                            : event.key === 'End'
                              ? items.length - 1
                              : (index +
                                  (['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : -1) +
                                  items.length) %
                                items.length;
                        setSelected(next);
                        document.getElementById(`${uid}-item-${next}`)?.focus();
                      }}
                    >
                      <span className="aic-check-icon">
                        <Check size={12} strokeWidth={1.6} aria-hidden="true" />
                      </span>
                      <span>{item.label}</span>
                      <span className="aic-item-dot" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="aic-observation" id={`${uid}-observation`}>
            <Crosshair size={14} aria-hidden="true" />
            <p>
              <strong>{activeItem.label}</strong>
              <span>{activeItem.detail}</span>
            </p>
          </div>
          <div className="aic-footnote">
            <span className="aic-footnote-dot" />
            Scope preview, not a live assessment.
          </div>
          <div className="aic-severity-key">
            <span>DEFECT CLASSIFICATION</span>
            <SeverityLegend compact />
          </div>
          <Link className="aic-cta" to={ctaLink}>
            <span>{ctaText}</span>
            <span className="aic-cta-arrow">
              <ArrowRight size={19} aria-hidden="true" />
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
