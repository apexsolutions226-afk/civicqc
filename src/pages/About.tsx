import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  ClipboardCheck,
  Crosshair,
  Eye,
  HeartHandshake,
  Ruler,
  ShieldCheck,
} from 'lucide-react';
import { ButtonLink, Eyebrow, Reveal } from '../components/UI';
import { CTA, InspectionProcess } from '../components/HomeSections';
import { contactLink } from '../data';

export default function About() {
  const values = [
    {
      icon: Ruler,
      title: 'Quality',
      text: 'Look beyond a good first impression to the construction details that matter.',
    },
    {
      icon: Crosshair,
      title: 'Accuracy',
      text: 'Record what is observed, where it is observed and the context around it.',
    },
    {
      icon: Eye,
      title: 'Transparency',
      text: 'Be clear about our inspection scope, findings and the limits of an assessment.',
    },
    {
      icon: ClipboardCheck,
      title: 'Professional assessment',
      text: 'Bring structure and a construction-quality perspective to each inspection.',
    },
    {
      icon: HeartHandshake,
      title: 'Customer protection',
      text: 'Give property owners evidence they can use to make better-informed decisions.',
    },
  ];
  return (
    <>
      <section className="inner-hero about-hero blueprint-dark">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <ChevronRight size={13} />
            <span>About CivicQC</span>
          </div>
          <div className="about-hero-grid">
            <div>
              <Eyebrow light>PRECISION WITH A PURPOSE.</Eyebrow>
              <h1>
                Engineering quality.
                <br />
                <span>
                  Protecting your
                  <br />
                  investment.
                </span>
              </h1>
              <p>
                A home is more than a handover. It’s your savings, your plans and your next chapter.
                We help you look closer before you move forward.
              </p>
              <ButtonLink to={contactLink()}>Let’s talk about your property</ButtonLink>
            </div>
            <div className="about-photo">
              <img
                src="/images/inspection-hero.webp"
                alt="A property inspection professional methodically checking a wall for moisture"
                width="1448"
                height="1086"
                fetchPriority="high"
              />
              <div className="about-photo-card">
                <ShieldCheck size={30} strokeWidth={1.4} />
                <span>
                  Less uncertainty.<strong>More informed decisions.</strong>
                </span>
              </div>
              <span className="photo-index mono">CIVICQC / NAGPUR</span>
            </div>
          </div>
        </div>
      </section>
      <section className="section about-purpose">
        <div className="container about-purpose-grid">
          <Reveal>
            <Eyebrow>WHO WE ARE</Eyebrow>
            <h2>
              A professional eye.
              <br />A clearer perspective.
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="large-paragraph">
              CivicQC Consultants helps homebuyers and property owners identify construction
              defects, quality concerns and potential issues through systematic property inspections
              and professional reporting.
            </p>
            <p>
              Based in Nagpur, Maharashtra, our focus is simple: to make property quality easier to
              understand. From a pre-possession flat inspection to a focused moisture audit, we
              document accessible conditions and explain what needs attention.
            </p>
            <p>
              We believe trust comes from clear observations, useful evidence and an honest
              conversation about what an inspection can — and cannot — tell you.
            </p>
            <Link className="text-link" to="/services">
              Explore how we can help
              <ArrowUpRight size={17} />
            </Link>
          </Reveal>
        </div>
      </section>
      <section className="section values-section">
        <div className="container">
          <Reveal className="section-heading-row">
            <div>
              <Eyebrow>WHAT GUIDES OUR WORK</Eyebrow>
              <h2>Five values. One clear purpose.</h2>
            </div>
            <p>
              Protecting your investment starts
              <br />
              with the way we approach our work.
            </p>
          </Reveal>
          <div className="values-grid">
            {values.map((value, i) => (
              <Reveal key={value.title} delay={i * 45}>
                <article className="value-card">
                  <span className="mono">0{i + 1}</span>
                  <value.icon size={30} strokeWidth={1.3} />
                  <h3>{value.title}</h3>
                  <p>{value.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section about-commitment">
        <div className="container about-commitment-grid">
          <Reveal className="commitment-image">
            <img
              src="/images/apartment.webp"
              alt="An empty modern apartment before property handover"
              loading="lazy"
              width="1672"
              height="941"
            />
            <span>YOUR NEXT CHAPTER DESERVES A CLOSER LOOK.</span>
          </Reveal>
          <Reveal delay={80}>
            <Eyebrow>OUR COMMITMENT TO YOU</Eyebrow>
            <h2>
              Evidence over assumptions.
              <br />
              Clarity over promises.
            </h2>
            <p>
              Our role is to help you understand your property, not promise that any home is
              perfect.
            </p>
            <ul className="commitment-list">
              <li>
                <Check size={17} />
                <div>
                  <strong>An agreed scope, before we start.</strong>
                  <p>
                    Understand the inspection areas, access needs, fees and expected deliverables.
                  </p>
                </div>
              </li>
              <li>
                <Check size={17} />
                <div>
                  <strong>Findings you can follow.</strong>
                  <p>Location-specific observations, photographs and practical recommendations.</p>
                </div>
              </li>
              <li>
                <Check size={17} />
                <div>
                  <strong>Honest about the limits.</strong>
                  <p>
                    Concealed conditions, specialist testing and structural certification are not
                    automatically part of a visual inspection.
                  </p>
                </div>
              </li>
            </ul>
          </Reveal>
        </div>
      </section>
      <InspectionProcess />
      <CTA />
    </>
  );
}
