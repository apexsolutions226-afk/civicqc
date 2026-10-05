import { ArrowUpRight, FileCheck2, Info } from 'lucide-react';
import type { Service } from '../data';
import { bookingLink } from '../data';
import { serviceLandingPages, servicePageLink } from '../routes';
import { ButtonLink, Reveal, TextLink } from './UI';
import { useSampleReport } from './SampleReport';

/** The catalogue and focused service pages share the same scope and deliverables. */
export default function ServiceDeliverables({
  service,
  showDetailLink = false,
}: {
  service: Service;
  showDetailLink?: boolean;
}) {
  const openReport = useSampleReport();
  return (
    <Reveal className="service-delivery" delay={80}>
      <div className="service-delivery-header">
        <FileCheck2 size={23} strokeWidth={1.4} />
        <span>YOUR DELIVERABLES</span>
        <span className="mono">{service.number}</span>
      </div>
      <h3>What you receive.</h3>
      <ul>
        {service.receives.map((item, index) => (
          <li key={item}>
            <span className="delivery-number mono">0{index + 1}</span>
            {item}
          </li>
        ))}
      </ul>
      {service.id === 'inspection-report' ? (
        <button type="button" className="btn btn-dark" onClick={openReport}>
          View Sample Report
          <ArrowUpRight size={18} />
        </button>
      ) : (
        <ButtonLink to={bookingLink(service.short)} variant="dark">
          {service.id === 'pre-delivery-inspection'
            ? 'Book a PDI inspection'
            : service.id === 'moisture-audit'
              ? 'Book a moisture audit'
              : 'Discuss your requirements'}
        </ButtonLink>
      )}
      {showDetailLink && serviceLandingPages.some((page) => page.serviceId === service.id) && (
        <TextLink to={servicePageLink(service.id)} className="service-detail-link">
          Explore this inspection
        </TextLink>
      )}
      <div className="service-scope-note">
        <Info size={16} />
        <p>{service.note}</p>
      </div>
    </Reveal>
  );
}
