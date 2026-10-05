import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowUpRight,
  Building2,
  CalendarCheck2,
  Camera,
  Check,
  CheckCheck,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Crosshair,
  Droplets,
  FileCheck2,
  FileText,
  Globe2,
  House,
  KeyRound,
  Layers3,
  ListChecks,
  MapPin,
  Minus,
  Plus,
  Ruler,
  ScanLine,
  ShieldCheck,
  SquareDashed,
  Target,
  Wallet,
  Warehouse,
  Zap,
} from 'lucide-react';
import { faqs, contactLink, bookingLink } from '../data';
import { ButtonLink, Counter, Eyebrow, Reveal, TextLink, WhatsAppButton, CallButton } from './UI';
import { ReportDocument, useSampleReport } from './SampleReport';
import HeroBackground from './HeroBackground';
import AnimatedInspectionCard from './AnimatedInspectionCard';
import { ServiceCategoryGrid } from './ServiceUI';

export function Hero() {
  return (
    <section className="hero hero-video-section" aria-labelledby="hero-heading">
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="hero-eyebrow">
            <span className="status-dot" />
            YOUR INDEPENDENT PROPERTY QUALITY PARTNER.
          </div>
          <h1 id="hero-heading">
            Inspect before
            <br />
            <span>you invest.</span>
          </h1>
          <p className="hero-description">
            Professional inspection, clear reporting and actionable recommendations — helping
            homebuyers and property owners make informed decisions. Construction quality and
            property inspection in Nagpur, Maharashtra.
          </p>
          <div className="hero-actions hero-contact-actions">
            <ButtonLink to={bookingLink()}>Book an Inspection</ButtonLink>
            <WhatsAppButton />
            <CallButton />
          </div>
          <div className="hero-trust">
            <ShieldCheck size={17} />
            <span>
              Professional Property Inspection<span className="trust-separator">|</span>
              <span className="hero-location">Nagpur, Maharashtra</span>
            </span>
          </div>
        </div>
        <div className="hero-visual hero-video-assurance">
          <div className="hero-inspection-card">
            <div className="inspection-card-icon">
              <ClipboardCheck size={25} strokeWidth={1.5} />
            </div>
            <div>
              <strong>
                <Counter end={100} suffix="+" /> Point PDI
              </strong>
              <span>Every detail. Documented.</span>
            </div>
            <span className="card-check">
              <Check size={11} />
            </span>
          </div>
          <div className="hero-report-card">
            <Clock3 size={24} strokeWidth={1.5} />
            <div>
              <span>PDI report</span>
              <strong>
                Within <Counter end={24} /> hours
              </strong>
            </div>
            <ArrowUpRight size={17} />
          </div>
        </div>
      </div>
      <div className="container hero-bottomline">
        <span>
          <span className="tiny-cross">+</span>INSPECTION, NOT ASSUMPTION.
        </span>
        <a href="#services">
          Explore our expertise
          <ArrowDown size={14} />
        </a>
      </div>
      <HeroBackground />
    </section>
  );
}

export function TrustBar() {
  const items = [
    [ListChecks, '100+ Point Inspection'],
    [ShieldCheck, 'Professional Assessment'],
    [Camera, 'Photo-Based Reports'],
    [Clock3, '24-Hour PDI Reports'],
    [MapPin, 'Nagpur & Nearby Areas'],
  ] as const;
  return (
    <div className="trust-bar">
      <div className="container trust-grid">
        {items.map(([Icon, title]) => (
          <div className="trust-item" key={title}>
            <Icon size={21} strokeWidth={1.5} />
            <span>{title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProblemSection() {
  const problems = [
    {
      icon: Droplets,
      title: 'Seepage & dampness',
      body: 'Hidden moisture can damage walls, paint and interiors.',
    },
    {
      icon: GridIcon,
      title: 'Hollow tiles',
      body: 'Poorly installed tiles can crack, loosen or become a costly repair.',
    },
    {
      icon: Zap,
      title: 'Faulty electrical work',
      body: 'Electrical defects can create safety risks and unexpected repair costs.',
    },
    {
      icon: Ruler,
      title: 'Poor civil work',
      body: 'Improper finishing and construction defects can affect long-term durability.',
    },
    {
      icon: ScanLine,
      title: 'Hidden defects',
      body: 'Some issues need more than a quick look. They need a professional eye.',
    },
  ];
  return (
    <section className="section problem-section" id="the-difference">
      <div className="container problem-grid">
        <Reveal className="problem-intro">
          <Eyebrow>WHAT YOU DON’T SEE MATTERS.</Eyebrow>
          <h2>
            Small construction defects can become{' '}
            <span className="muted-heading">big expenses.</span>
          </h2>
          <p>
            A beautiful finish doesn’t always mean a well-built home. Small construction defects can
            become big expenses. Know what’s beneath the surface before it becomes your
            responsibility.
          </p>
          <TextLink to={contactLink()}>Inspect before you invest.</TextLink>
          <div className="problem-photo">
            <img
              src="/images/moisture-detail.webp"
              alt="A moisture meter checking a damp area beside an apartment window"
              width="1448"
              height="1086"
              loading="lazy"
            />
            <span className="problem-photo-label">
              <Crosshair size={15} />
              THE DETAILS MAKE THE DIFFERENCE.
            </span>
          </div>
        </Reveal>
        <Reveal className="problem-list" delay={100}>
          {problems.map((problem, i) => (
            <div className="problem-row" key={problem.title}>
              <span className={`problem-icon ${i === 2 ? 'warning-icon' : ''}`}>
                <problem.icon size={23} strokeWidth={1.4} />
              </span>
              <div>
                <h3>{problem.title}</h3>
                <p>{problem.body}</p>
              </div>
              <span className="problem-index mono">0{i + 1}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
function GridIcon({ size = 24, strokeWidth = 1.5 }: { size?: number; strokeWidth?: number }) {
  return <SquareDashed size={size} strokeWidth={strokeWidth} />;
}

export function Services() {
  return (
    <section className="section services-section" id="services">
      <div className="container">
        <div className="services-highlight">
          <Reveal className="services-highlight-copy">
            <Eyebrow>01 / OUR EXPERTISE</Eyebrow>
            <h2>Professional inspection &amp; quality assessment.</h2>
            <p className="services-highlight-lead">
              Know the condition of your property before you take possession.
            </p>
            <p>
              From the finish you can see to the concerns you might miss, get a systematic
              assessment and a clear plan for what needs attention.
            </p>
            <ul className="services-highlight-proofs">
              <li>
                <ScanLine size={20} strokeWidth={1.4} />
                <span>
                  Systematic checks.<small>A scope that fits your property.</small>
                </span>
              </li>
              <li>
                <Camera size={20} strokeWidth={1.4} />
                <span>
                  Visual evidence.<small>Findings documented with photographs.</small>
                </span>
              </li>
              <li>
                <FileCheck2 size={20} strokeWidth={1.4} />
                <span>
                  Clear next steps.<small>Practical recommendations, not guesswork.</small>
                </span>
              </li>
            </ul>
          </Reveal>
          <AnimatedInspectionCard
            className="services-highlight-card"
            ctaLink={bookingLink('pre-delivery-inspection')}
          />
          <div className="services-highlight-actions">
            <ButtonLink to="/services" variant="dark">
              Explore all services
            </ButtonLink>
            <TextLink to={bookingLink()}>Free initial consultation</TextLink>
          </div>
        </div>
        <div className="services-catalog-caption">
          <span />
          FOCUSED EXPERTISE FOR YOUR PROPERTY.
        </div>
        <ServiceCategoryGrid />
        <div className="services-footnote">
          <ShieldCheck size={16} />
          <span>A clear scope. A professional assessment. No unnecessary surprises.</span>
        </div>
      </div>
    </section>
  );
}

export function InspectionProcess() {
  const steps = [
    {
      icon: CalendarCheck2,
      title: 'Book inspection',
      description: 'Tell us about your property. We’ll agree the scope and schedule your visit.',
    },
    {
      icon: ScanLine,
      title: 'Professional inspection',
      description: 'A systematic assessment of the key areas of your property.',
    },
    {
      icon: Camera,
      title: 'Defects documented',
      description: 'Issues recorded with photographs and detailed observations.',
    },
    {
      icon: FileCheck2,
      title: 'Get your report',
      description:
        'Clear findings and practical recommendations. PDI reports within 24 hours; specialist timelines are agreed separately.',
    },
  ];
  return (
    <section className="section process-section" id="process">
      <div className="container">
        <Reveal className="section-heading-row">
          <div>
            <Eyebrow>02 / HOW IT WORKS</Eyebrow>
            <h2>Clarity. In four simple steps.</h2>
          </div>
          <TextLink to={contactLink()}>Let’s get started</TextLink>
        </Reveal>
        <div className="process-grid">
          {steps.map((step, i) => (
            <Reveal key={step.title} className="process-step" delay={i * 90}>
              <div className="process-step-line">
                <span className="process-num mono">0{i + 1}</span>
                <div className="process-connector" />
                <step.icon size={24} strokeWidth={1.4} />
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyCivicQC() {
  const benefits = [
    {
      icon: ListChecks,
      title: '100+ inspection points',
      body: 'A systematic inspection. Not just a quick visual check.',
    },
    {
      icon: Ruler,
      title: 'Engineering-focused approach',
      body: 'Professional construction-quality assessment at every step.',
    },
    {
      icon: Droplets,
      title: 'Accurate moisture detection',
      body: 'Professional moisture meters to identify potential problem areas.',
    },
    {
      icon: Camera,
      title: 'Photo documentation',
      body: 'Clear photographic evidence of the defects we observe.',
    },
    {
      icon: Target,
      title: 'Actionable recommendations',
      body: 'Understand what needs attention, and what to do next.',
    },
    {
      icon: Clock3,
      title: 'Fast, clear reporting',
      body: 'PDI and villa reports within 24 hours of the completed inspection. Other timelines are agreed by scope.',
    },
  ];
  return (
    <section className="section why-section blueprint-dark" id="why-civicqc">
      <div className="container why-grid">
        <Reveal className="why-intro">
          <Eyebrow light>THE CIVICQC DIFFERENCE</Eyebrow>
          <h2>
            Why smart homebuyers choose <span>CivicQC.</span>
          </h2>
          <p>Because your biggest investment deserves a closer look.</p>
          <div className="why-signoff">
            <ShieldCheck size={33} strokeWidth={1.2} />
            <span>
              Built on precision.
              <br />
              <strong>Focused on you.</strong>
            </span>
          </div>
        </Reveal>
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <Reveal key={benefit.title} delay={index * 45}>
              <article className="benefit-card">
                <benefit.icon size={24} strokeWidth={1.4} />
                <h3>{benefit.title}</h3>
                <p>{benefit.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ReportPreview() {
  const openReport = useSampleReport();
  return (
    <section className="section report-section" id="report">
      <div className="container report-grid">
        <Reveal className="report-visual">
          <div className="report-visual-grid" />
          <span className="report-visual-label">
            <FileText size={13} />
            FROM OBSERVATION TO ACTION.
          </span>
          <button
            type="button"
            className="report-preview-button"
            onClick={openReport}
            aria-label="Open illustrative CivicQC inspection report"
          >
            <div className="report-page-under" />
            <ReportDocument />
          </button>
          <div className="report-clear-card">
            <CheckCheck size={24} />
            <span>
              Clear priorities.<strong>Know what to fix first.</strong>
            </span>
          </div>
        </Reveal>
        <Reveal className="report-copy" delay={100}>
          <Eyebrow>03 / THE DOCUMENT THAT MATTERS</Eyebrow>
          <h2>A report you can actually understand.</h2>
          <p className="report-lead">
            Clear findings. Visual evidence.
            <br />
            Practical recommendations.
          </p>
          <p>
            No confusing jargon or vague observations. Get a structured record of your property’s
            condition, ready for a meaningful discussion with your builder.
          </p>
          <ul className="report-features">
            <li>
              <span>
                <Camera size={19} />
              </span>
              <div>
                <strong>See the issue, not just a description.</strong>
                <p>Photographs linked to each documented finding.</p>
              </div>
            </li>
            <li>
              <span>
                <Layers3 size={19} />
              </span>
              <div>
                <strong>Know what needs attention first.</strong>
                <p>Severity indicators that help prioritise rectification.</p>
              </div>
            </li>
            <li>
              <span>
                <ClipboardCheck size={19} />
              </span>
              <div>
                <strong>Move forward with a clear plan.</strong>
                <p>Practical recommendations, not unanswered questions.</p>
              </div>
            </li>
          </ul>
          <button type="button" className="btn btn-dark" onClick={openReport}>
            Request Sample Report
            <ArrowUpRight size={18} />
          </button>
          <span className="report-caption">View an illustrative report. No details required.</span>
        </Reveal>
      </div>
    </section>
  );
}

export function PossessionBanner() {
  return (
    <section className="possession-section">
      <div className="container">
        <Reveal>
          <div className="possession-banner">
            <img
              src="/images/apartment.webp"
              alt="A newly finished modern apartment ready for a pre-possession inspection"
              width="1672"
              height="941"
              loading="lazy"
            />
            <div className="possession-overlay" />
            <div className="possession-content">
              <Eyebrow light>BEFORE THE KEYS. BEFORE THE COMMITMENT.</Eyebrow>
              <h2>
                Your home is a major investment.
                <br />
                Inspect it before you accept it.
              </h2>
              <p>
                After possession, getting construction defects rectified can become more difficult.
                Identify issues early and approach your builder with documented findings.
              </p>
              <ButtonLink to={bookingLink('Pre-Delivery Inspection')}>
                Book Pre-Possession Inspection
              </ButtonLink>
            </div>
            <span className="possession-corner">
              <KeyRound size={22} strokeWidth={1.2} />
              YOUR HOME. YOUR PEACE OF MIND.
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function TargetCustomers() {
  const customers = [
    { icon: Building2, name: 'New flat buyers', property: 'Flat / Apartment' },
    { icon: House, name: 'New homeowners', property: 'Independent House' },
    { icon: Warehouse, name: 'Villa buyers', property: 'Villa' },
    { icon: Wallet, name: 'Property investors', property: undefined },
    { icon: Globe2, name: 'NRIs purchasing property', property: undefined },
    { icon: Droplets, name: 'Homeowners facing seepage', service: 'Seepage & Moisture Audit' },
    { icon: KeyRound, name: 'Buyers before possession', service: 'Pre-Delivery Inspection' },
    { icon: Building2, name: 'Commercial property owners', property: 'Commercial Property' },
  ];
  return (
    <section className="section customers-section">
      <div className="container">
        <Reveal className="centered-heading">
          <Eyebrow>FOR EVERY PROPERTY. FOR EVERY NEXT CHAPTER.</Eyebrow>
          <h2>Who should get a property inspection?</h2>
          <p>If your property matters to you, its quality should too.</p>
        </Reveal>
        <div className="customers-grid">
          {customers.map((customer, i) => (
            <Reveal key={customer.name} delay={i * 30}>
              <Link className="customer-card" to={contactLink(customer.service, customer.property)}>
                <customer.icon size={23} strokeWidth={1.4} />
                <span>{customer.name}</span>
                <ChevronRight size={15} />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="section faq-section" id="faq">
      <div className="container faq-grid">
        <Reveal className="faq-intro">
          <Eyebrow>GOOD QUESTIONS. CLEAR ANSWERS.</Eyebrow>
          <h2>
            A little clarity,
            <br />
            before we begin.
          </h2>
          <p>Everything you need to know about getting your property inspected.</p>
          <div className="faq-help">
            <span className="faq-help-icon">
              <FileCheck2 size={25} strokeWidth={1.4} />
            </span>
            <h3>Have something else in mind?</h3>
            <p>Let’s talk about your property and how we can help.</p>
            <TextLink to={contactLink()}>Ask us a question</TextLink>
          </div>
        </Reveal>
        <Reveal className="faq-list" delay={80}>
          {faqs.map((faq, index) => (
            <article key={faq.q} className={`faq-item ${open === index ? 'faq-open' : ''}`}>
              <h3>
                <button
                  type="button"
                  id={`faq-question-${index}`}
                  aria-expanded={open === index}
                  aria-controls={`faq-answer-${index}`}
                  onClick={() => setOpen(open === index ? null : index)}
                >
                  <span className="faq-number mono">{String(index + 1).padStart(2, '0')}</span>
                  <span>{faq.q}</span>
                  {open === index ? <Minus size={19} /> : <Plus size={19} />}
                </button>
              </h3>
              <div
                id={`faq-answer-${index}`}
                role="region"
                aria-labelledby={`faq-question-${index}`}
                className="faq-answer"
                hidden={open !== index}
              >
                <p>{faq.a}</p>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function CTA() {
  return (
    <section className="final-cta">
      <div className="container">
        <Reveal className="cta-inner">
          <div className="cta-copy">
            <span className="consultation-pill">
              <span className="status-dot" />
              FREE INITIAL CONSULTATION
            </span>
            <h2>
              Before you take possession,
              <br />
              know what you’re taking home.
            </h2>
            <p>
              Get your property professionally inspected. Identify potential defects
              <br className="desktop-break" /> before they become expensive problems.
            </p>
          </div>
          <div className="cta-actions cta-contact-actions">
            <ButtonLink to={bookingLink()} variant="dark">
              Book an Inspection
            </ButtonLink>
            <WhatsAppButton full dark />
            <CallButton dark />
            <span>
              <ShieldCheck size={14} />A better-informed decision starts here.
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
