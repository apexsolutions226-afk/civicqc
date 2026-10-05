import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check, Info, Sparkles, ShieldCheck } from 'lucide-react';
import {
  services,
  serviceCategories,
  money,
  hasLabCharges,
  INSPECTION_DISCLAIMER,
} from '../content/catalog';
import type { Service } from '../content/catalog';
import { bookingLink, whatsappLink } from '../data';
import { ButtonLink, CallButton, Eyebrow, WhatsAppIcon } from './UI';

export function ServicePrice({
  service,
  compact = false,
}: {
  service: Service;
  compact?: boolean;
}) {
  const lab = hasLabCharges(service);
  return (
    <div className={`service-price ${compact ? 'service-price-compact' : ''}`}>
      <span className="service-price-label">
        {lab
          ? 'CIVICQC PROFESSIONAL / COORDINATION FEE'
          : service.priceMode === 'session'
            ? 'CONSULTATION FEE'
            : ['from', 'pdi'].includes(service.priceMode)
              ? 'STARTING FROM'
              : 'STARTING PRICE'}
      </span>
      <div>
        <strong>{money(service.amount)}</strong>
        <span>
          {service.priceMode === 'session'
            ? '/ session'
            : service.priceMode === 'plus-lab'
              ? ''
              : service.priceMode === 'from' || service.priceMode === 'pdi'
                ? ''
                : 'onwards'}
        </span>
      </div>
      {lab && (
        <p className="lab-charge-note">
          + {service.priceMode === 'from-plus-lab' ? 'applicable' : 'actual'} laboratory charges
        </p>
      )}
    </div>
  );
}

export function ServiceCard({ service }: { service: Service }) {
  const category = serviceCategories.find((category) => category.id === service.categoryId)!;
  return (
    <article
      className={`portfolio-card ${service.popular ? 'portfolio-card-featured' : ''}`}
      data-service-id={service.id}
      id={service.id}
    >
      <div className="portfolio-card-top">
        <span className="portfolio-icon">
          <service.icon size={25} strokeWidth={1.35} />
        </span>
        <span className="portfolio-category">{category.short}</span>
        {service.popular && (
          <span className="popular-flag">
            <Sparkles size={10} />
            MOST POPULAR
          </span>
        )}
      </div>
      <h3>
        <Link to={service.path}>{service.name}</Link>
      </h3>
      <p className="portfolio-card-description">{service.description}</p>
      <ServicePrice service={service} compact />
      <ul className="portfolio-highlights">
        {service.highlights.map((item) => (
          <li key={item}>
            <Check size={13} aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
      <div className="portfolio-card-actions">
        <Link to={service.path}>
          View Details
          <ArrowRight size={15} />
        </Link>
        <Link className="portfolio-book" to={bookingLink(service.id)}>
          Book Now
          <ArrowUpRight size={15} />
        </Link>
      </div>
    </article>
  );
}

export function ServiceCategoryGrid() {
  return (
    <div className="home-category-grid">
      {serviceCategories.map((category) => (
        <Link className="home-category-card" key={category.id} to={`/services#${category.id}`}>
          <div>
            <category.icon size={26} strokeWidth={1.3} />
            <span className="mono">{category.number}</span>
          </div>
          <h3>{category.name}</h3>
          <p>{category.description}</p>
          <span className="home-category-bottom">
            <span>
              {services.filter((service) => service.categoryId === category.id).length} focused
              services
            </span>
            <ArrowUpRight size={18} />
          </span>
        </Link>
      ))}
      <Link to="/services#find-inspection" className="home-category-card category-guide">
        <span className="guide-mark">
          <ShieldCheck size={27} strokeWidth={1.3} />
        </span>
        <h3>
          Not sure where
          <br />
          to start?
        </h3>
        <p>A few simple questions. An informed starting point for your inspection.</p>
        <span className="home-category-bottom">
          Find My Inspection
          <ArrowRight size={18} />
        </span>
      </Link>
    </div>
  );
}

export function InspectionDisclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <aside className={`inspection-disclaimer ${compact ? 'disclaimer-compact' : ''}`}>
      <Info size={19} aria-hidden="true" />
      <div>
        <h2>Inspection Disclaimer</h2>
        <p>{INSPECTION_DISCLAIMER}</p>
      </div>
    </aside>
  );
}

export function ServiceFinalCTA({ service }: { service: Service }) {
  return (
    <section className="service-close blueprint-dark">
      <div className="container service-close-inner">
        <div>
          <Eyebrow light>INSPECT BEFORE YOU INVEST.</Eyebrow>
          <h2>
            Don’t wait until defects
            <br />
            become expensive.
          </h2>
          <p>Book a Professional Inspection Today.</p>
        </div>
        <div className="service-close-actions">
          <ButtonLink to={bookingLink(service.id)}>Book This Service</ButtonLink>
          <a
            className="btn btn-light-outline"
            href={whatsappLink(
              `Hello CivicQC Consultants, I would like to discuss ${service.name} in Nagpur. Please confirm scope, availability and final fees.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon width={17} height={17} />
            WhatsApp for Inspection
          </a>
          <CallButton />
        </div>
      </div>
    </section>
  );
}
