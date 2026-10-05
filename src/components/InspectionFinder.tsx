import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Droplets,
  Layers3,
  ClipboardCheck,
  RefreshCcw,
  Check,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { services, priceLabel } from '../content/catalog';
import { bookingLink } from '../data';
import { ButtonLink, Eyebrow } from './UI';

const concerns = [
  {
    id: 'new',
    icon: Building2,
    q: 'Are you buying a new home?',
    hint: 'Pre-delivery inspection before possession.',
    options: [
      ['Flat / apartment', 'pre-delivery-inspection'],
      ['Villa / row house', 'villa-row-house-inspection'],
    ],
  },
  {
    id: 'damp',
    icon: Droplets,
    q: 'Already seeing dampness / seepage?',
    hint: 'Choose a moisture or seepage assessment.',
    options: [
      ['A first visual seepage review', 'seepage-inspection'],
      ['Moisture-meter readings & mapping', 'moisture-audit'],
      ['A more advanced / thermal scope', 'advanced-moisture-investigation'],
    ],
  },
  {
    id: 'resale',
    icon: ClipboardCheck,
    q: 'Buying an old / resale property?',
    hint: 'Review accessible property condition.',
    options: [
      ['A basic condition audit', 'property-quality-audit'],
      ['A detailed audit with Inspection Score', 'comprehensive-property-audit'],
    ],
  },
  {
    id: 'materials',
    icon: Layers3,
    q: 'Concerned about concrete / material quality?',
    hint: 'Material assessment or an agreed testing scope.',
    options: [
      ['Initial visual material assessment', 'material-assessment'],
      ['Concrete laboratory testing', 'concrete-testing'],
      ['Applicable non-destructive tests', 'concrete-ndt-testing'],
      ['Several types of material tests', 'material-testing-package'],
    ],
  },
  {
    id: 'followup',
    icon: RefreshCcw,
    q: 'Builder has fixed previously reported defects?',
    hint: 'Verify rectification with a follow-up review.',
    options: [
      ['Verify items in my earlier report', 're-inspection'],
      ['I need a fresh condition assessment', 'property-quality-audit'],
    ],
  },
];
export default function InspectionFinder() {
  const [concern, setConcern] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const chosen = concerns.find((item) => item.id === concern);
  const service = services.find((service) => service.id === result);
  return (
    <section className="section inspection-finder" id="find-inspection">
      <div className="container finder-grid">
        <div className="finder-copy">
          <Eyebrow>LET’S FIND THE RIGHT STARTING POINT</Eyebrow>
          <h2>
            Not Sure Which
            <br />
            Inspection You Need?
          </h2>
          <p>
            Answer a few questions. We’ll point you toward a suitable service—then confirm the right
            scope together.
          </p>
          <div className="finder-step-label">
            <span className={!concern ? 'current' : ''}>01 Concern</span>
            <span className={concern && !result ? 'current' : ''}>02 Scope</span>
            <span className={result ? 'current' : ''}>03 Recommendation</span>
          </div>
        </div>
        <div className="finder-panel">
          {!chosen ? (
            <>
              <h3>What would you like a closer look at?</h3>
              <div className="finder-options">
                {concerns.map((item) => (
                  <button key={item.id} type="button" onClick={() => setConcern(item.id)}>
                    <item.icon size={20} strokeWidth={1.4} />
                    <span>
                      <strong>{item.q}</strong>
                      <small>{item.hint}</small>
                    </span>
                    <ArrowRight size={16} />
                  </button>
                ))}
              </div>
            </>
          ) : !service ? (
            <>
              <button className="finder-back" type="button" onClick={() => setConcern('')}>
                <ArrowLeft size={14} />
                Change concern
              </button>
              <h3>{chosen.q}</h3>
              <p>Which scope sounds closest to what you need?</p>
              <div className="finder-options">
                {chosen.options.map(([label, id]) => (
                  <button key={id} type="button" onClick={() => setResult(id)}>
                    <Check size={17} />
                    <span>{label}</span>
                    <ArrowRight size={16} />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="finder-result" aria-live="polite">
              <button className="finder-back" type="button" onClick={() => setResult('')}>
                <ArrowLeft size={14} />
                Review choices
              </button>
              <span className="finder-result-label">YOUR RECOMMENDED STARTING POINT</span>
              <service.icon size={35} strokeWidth={1.3} />
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <strong className="finder-result-price">{priceLabel(service)}</strong>
              <div className="finder-result-actions">
                <ButtonLink to={bookingLink(service.id)} variant="dark">
                  Book Inspection
                </ButtonLink>
                <Link className="text-link" to={service.path}>
                  View service details
                  <ArrowRight size={15} />
                </Link>
              </div>
              <small>
                This is guidance, not a diagnosis. Final service suitability and scope are confirmed
                by CivicQC.
              </small>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
