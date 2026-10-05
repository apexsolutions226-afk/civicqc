import { SeverityLegend } from './InspectionScore';
import { useId, useState } from 'react';
import { ArrowRight, Check, CheckCheck, Crosshair, Maximize, ScanLine } from 'lucide-react';
import { inspectionCategories } from '../data';
import { Eyebrow, Reveal } from './UI';

function FloorPlan({ active }: { active: number }) {
  const id = useId().replace(/:/g, '');
  const zones = [
    [46, 44, 130, 116],
    [46, 44, 130, 116],
    [180, 165, 95, 125],
    [180, 44, 95, 116],
    [180, 44, 95, 116],
    [46, 165, 130, 125],
  ];
  const [x, y, w, h] = zones[active];
  return (
    <svg
      viewBox="0 0 320 340"
      className="floor-plan"
      role="img"
      aria-label={`Illustrative floor plan showing ${inspectionCategories[active].name.toLowerCase()} inspection areas`}
    >
      <defs>
        <pattern id={id} width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#dce7e5" strokeWidth=".65" />
        </pattern>
      </defs>
      <rect width="320" height="340" fill={`url(#${id})`} />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="#75d9cf"
        opacity=".21"
        className="floor-active-room"
      />
      <g fill="none" stroke="#617c7e" strokeWidth="3.3" strokeLinejoin="miter">
        <path d="M42 40h237v254H42zM177 40v63m0 40v151M42 162h93m41 0h103" />
        <path d="M177 93h102M229 93v69" strokeWidth="2.2" />
      </g>
      <g fill="none" stroke="#8aabaa" strokeWidth="1">
        <path d="M177 103a40 40 0 0 0-40 40h40M135 162a41 41 0 0 0 41 41v-41" />
        <path d="M86 294v-37a37 37 0 0 1 37 37" />
        <path d="M42 22h237M42 17v10M279 17v10M297 40v254M292 40h10M292 294h10" />
      </g>
      <g stroke="#f0f6f4" strokeWidth="7">
        <path d="M65 40h61M42 190v59M205 294h44M279 179v57" />
      </g>
      <g stroke="#749994" strokeWidth="1.2">
        <path d="M65 38h61M65 42h61M40 190v59M44 190v59M205 292h44M205 296h44M277 179v57M281 179v57" />
      </g>
      <g fill="none" stroke="#a7bfba" strokeWidth="1.2">
        <rect x="62" y="64" width="66" height="63" rx="2" />
        <path d="M62 85h66M95 64v21" />
        <rect x="197" y="53" width="63" height="22" rx="2" />
        <circle cx="249" cy="64" r="6" />
        <rect x="239" y="106" width="29" height="44" rx="3" />
        <rect x="67" y="196" width="70" height="23" rx="3" />
        <rect x="77" y="236" width="51" height="24" rx="3" />
      </g>
      <g fontFamily="Inter,sans-serif" fontSize="8" letterSpacing="1.1" fill="#728987">
        <text x="73" y="147">
          BEDROOM
        </text>
        <text x="193" y="86">
          KITCHEN
        </text>
        <text x="187" y="235">
          LIVING
        </text>
        <text x="62" y="282">
          DINING
        </text>
        <text x="235" y="132" transform="rotate(-90 235 132)">
          BATH
        </text>
        <text x="133" y="16">
          QC / PLAN
        </text>
      </g>
      <circle cx={x + w / 2} cy={y + h / 2} r="14" fill="#137c70" fillOpacity=".15" />
      <circle cx={x + w / 2} cy={y + h / 2} r="5" fill="#147f74" stroke="white" strokeWidth="2" />
      <path d="M26 320h35m-35-4v8m35-8v8" stroke="#6d8b86" />
      <text
        x="72"
        y="323"
        fontFamily="Inter,sans-serif"
        fontSize="8"
        fill="#728987"
        letterSpacing="1"
      >
        ILLUSTRATIVE PLAN · NOT TO SCALE
      </text>
    </svg>
  );
}

export default function InspectionChecklist() {
  const [active, setActive] = useState(0);
  const [item, setItem] = useState(0);
  const category = inspectionCategories[active];
  const onSelect = (index: number) => {
    setActive(index);
    setItem(0);
  };
  return (
    <section
      className="section checklist-section"
      id="checklist"
      aria-labelledby="checklist-heading"
    >
      <div className="container">
        <Reveal className="section-heading-row">
          <div>
            <Eyebrow>A CLOSER LOOK</Eyebrow>
            <h2 id="checklist-heading">What we inspect.</h2>
          </div>
          <p>
            Your home, examined beyond the surface.
            <br />
            Explore the key areas in our 100+ point inspection.
          </p>
        </Reveal>
        <div className="dashboard-severity-key">
          <span>Report classification framework · not live inspection results</span>
          <SeverityLegend compact />
        </div>
        <Reveal>
          <div className="inspection-dashboard">
            <div className="dashboard-toolbar">
              <div>
                <ScanLine size={18} />
                <span>
                  CivicQC <span className="toolbar-divider">/</span> INSPECTION SCOPE
                </span>
              </div>
              <span className="dashboard-status">
                <span className="status-dot" />
                SYSTEMATIC. DOCUMENTED.
              </span>
            </div>
            <div className="dashboard-body">
              <div
                className="dashboard-sidebar"
                role="tablist"
                aria-label="Inspection categories"
                aria-orientation="vertical"
              >
                <span className="dashboard-sidebar-label">INSPECTION CATEGORIES</span>
                {inspectionCategories.map((cat, index) => (
                  <button
                    key={cat.name}
                    type="button"
                    role="tab"
                    id={`category-${index}`}
                    aria-selected={active === index}
                    aria-controls={`panel-${index}`}
                    tabIndex={active === index ? 0 : -1}
                    className={`category-tab ${active === index ? 'selected' : ''}`}
                    onClick={() => onSelect(index)}
                    onKeyDown={(event) => {
                      if (
                        ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(
                          event.key,
                        )
                      ) {
                        event.preventDefault();
                        const next =
                          event.key === 'Home'
                            ? 0
                            : event.key === 'End'
                              ? 5
                              : (index +
                                  (['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : -1) +
                                  6) %
                                6;
                        onSelect(next);
                        document.getElementById(`category-${next}`)?.focus();
                      }
                    }}
                  >
                    <cat.icon size={18} />
                    <span>{cat.name}</span>
                    <ArrowRight size={14} />
                  </button>
                ))}
                <div className="sidebar-note">
                  <CheckCheck size={18} />
                  <span>
                    Every observation.
                    <br />
                    Clearly documented.
                  </span>
                </div>
              </div>
              <div
                className="dashboard-panel"
                role="tabpanel"
                id={`panel-${active}`}
                aria-labelledby={`category-${active}`}
              >
                <div className="dashboard-panel-heading">
                  <div>
                    <span className="mono dashboard-step">
                      SCOPE {String(active + 1).padStart(2, '0')} / 06
                    </span>
                    <h3>{category.name}</h3>
                  </div>
                  <span className="scope-count">05 focus areas</span>
                </div>
                <div className="dashboard-panel-content">
                  <div className="inspection-items">
                    {category.items.map(([title, description], index) => (
                      <div
                        key={title}
                        className={`inspection-item ${item === index ? 'active' : ''}`}
                      >
                        <button
                          type="button"
                          onClick={() => setItem(item === index ? -1 : index)}
                          aria-expanded={item === index}
                          aria-controls={`inspection-item-${active}-${index}`}
                        >
                          <span className="check-outline">
                            <Check size={12} />
                          </span>
                          {title}
                          <span className="item-plus">{item === index ? '−' : '+'}</span>
                        </button>
                        <div
                          className="inspection-item-description"
                          id={`inspection-item-${active}-${index}`}
                          hidden={item !== index}
                        >
                          {description}
                        </div>
                      </div>
                    ))}
                    <span className="inspection-help">
                      <Crosshair size={13} />
                      Select a check to see what we look for.
                    </span>
                  </div>
                  <div className="floor-plan-wrap">
                    <span className="plan-caption">
                      <Maximize size={12} />
                      PROPERTY OVERVIEW
                    </span>
                    <FloorPlan active={active} />
                  </div>
                </div>
              </div>
            </div>
            <div className="dashboard-footer">
              <span>
                <span className="status-dot" />
                Visual assessment · Functional checks · Photo documentation
              </span>
              <span>Scope subject to safe access & site readiness.</span>
            </div>
          </div>
        </Reveal>
        <p className="checklist-disclaimer">
          An overview of key inspection areas, not a structural certification. Concealed conditions
          and specialist tests require a separately agreed scope.
        </p>
      </div>
    </section>
  );
}
