import { useEffect, useId, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  ClipboardCheck,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { EMAIL, PHONE, CALL_LINK, propertyTypes, services, whatsappLink } from '../data';
import { Eyebrow, Reveal, WhatsAppIcon } from './UI';

type Enquiry = {
  name: string;
  phone: string;
  email: string;
  property: string;
  location: string;
  date: string;
  service: string;
  message: string;
};
type Errors = Partial<Record<keyof Enquiry, string>>;
const emptyForm: Enquiry = {
  name: '',
  phone: '',
  email: '',
  property: '',
  location: '',
  date: '',
  service: '',
  message: '',
};
const todayInIndia = () =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

function Field({
  label,
  id,
  required,
  error,
  children,
  className = '',
}: {
  label: string;
  id: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`form-field ${error ? 'field-invalid' : ''} ${className}`}>
      <label htmlFor={id}>
        {label}
        {required ? (
          <span className="required-mark"> *</span>
        ) : (
          <span className="optional-mark"> (optional)</span>
        )}
      </label>
      {children}
      {error && (
        <span className="field-error" id={`${id}-error`}>
          {error}
        </span>
      )}
    </div>
  );
}
export default function ContactForm({ formOnly = false }: { formOnly?: boolean }) {
  const FormHeading = formOnly ? 'h2' : 'h3';
  const [search] = useSearchParams();
  const [form, setForm] = useState<Enquiry>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [ready, setReady] = useState(false);
  const [today, setToday] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const confirmation = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/:/g, '');
  useEffect(() => {
    setToday(todayInIndia());
  }, []);
  useEffect(() => {
    const service = search.get('service');
    const property = search.get('property');
    setForm((old) => ({
      ...old,
      ...(service && services.some((s) => s.short === service) ? { service } : {}),
      ...(property && propertyTypes.includes(property) ? { property } : {}),
    }));
    if (service || property) {
      setReady(false);
      setErrors({});
    }
  }, [search]);
  useEffect(() => {
    if (ready) confirmation.current?.focus();
  }, [ready]);
  const update = (key: keyof Enquiry, value: string) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  };
  const fieldProps = (key: keyof Enquiry) => ({
    id: `${uid}-${key}`,
    name: key,
    value: form[key],
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      update(key, event.target.value),
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `${uid}-${key}-error` : undefined,
  });
  const text = `Hello CivicQC Consultants, I would like to request an inspection.\n\nName: ${form.name.trim()}\nPhone: ${form.phone.trim()}${form.email.trim() ? `\nEmail: ${form.email.trim()}` : ''}\nProperty type: ${form.property}\nProperty location: ${form.location.trim()}\nService: ${form.service}${form.date ? `\nPreferred date: ${form.date}` : '\nPreferred date: To be discussed'}${form.message.trim() ? `\n\nMessage: ${form.message.trim()}` : ''}\n\nPlease confirm availability, inspection scope and fees.`;
  const validate = (): Errors => {
    const next: Errors = {};
    if (form.name.trim().length < 2) next.name = 'Please enter your full name.';
    const digits = form.phone.replace(/[\s()+.-]/g, '');
    if (!/^\d{10,15}$/.test(digits)) next.phone = 'Enter a valid phone number (10–15 digits).';
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = 'Please enter a valid email address.';
    if (!propertyTypes.includes(form.property)) next.property = 'Please select your property type.';
    if (form.location.trim().length < 3)
      next.location = 'Please enter the locality or property address.';
    if (form.date && form.date < todayInIndia()) next.date = 'Choose today or a future date.';
    if (
      !services.some((service) => service.short === form.service) &&
      form.service !== 'Help me choose'
    )
      next.service = 'Please choose a service, or select “Help me choose”.';
    return next;
  };
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    const keys = Object.keys(next) as (keyof Enquiry)[];
    if (keys.length) {
      requestAnimationFrame(() =>
        formRef.current?.querySelector<HTMLElement>(`[name="${keys[0]}"]`)?.focus(),
      );
      return;
    }
    setReady(true);
    window.open(whatsappLink(text), '_blank', 'noopener,noreferrer');
  };
  return (
    <section
      className={`section contact-section ${formOnly ? 'booking-form-section' : ''}`}
      id="contact"
    >
      <div className="container contact-grid">
        {!formOnly && (
          <Reveal className="contact-intro">
            <Eyebrow>LET’S LOOK CLOSER.</Eyebrow>
            <h2>
              Let’s inspect
              <br />
              your property.
            </h2>
            <p>
              A conversation today can save a costly surprise tomorrow. Tell us a little about your
              property and we’ll take it from there.
            </p>
            <div className="contact-details">
              <a href={CALL_LINK}>
                <span className="contact-icon">
                  <Phone size={21} strokeWidth={1.5} />
                </span>
                <span>
                  <small>CALL OR WHATSAPP</small>
                  <strong>{PHONE}</strong>
                </span>
                <ArrowUpRight size={19} />
              </a>
              <a href={`mailto:${EMAIL}`}>
                <span className="contact-icon">
                  <Mail size={21} strokeWidth={1.5} />
                </span>
                <span>
                  <small>EMAIL OUR TEAM</small>
                  <strong className="contact-email">{EMAIL}</strong>
                </span>
                <ArrowUpRight size={19} />
              </a>
              <div>
                <span className="contact-icon">
                  <MapPin size={21} strokeWidth={1.5} />
                </span>
                <span>
                  <small>BASED IN</small>
                  <strong>Nagpur, Maharashtra</strong>
                </span>
              </div>
            </div>
            <div className="nagpur-card">
              <div className="nagpur-map" aria-hidden="true">
                <div className="map-road road-1" />
                <div className="map-road road-2" />
                <div className="map-road road-3" />
                <div className="map-road road-4" />
                <span className="map-location">
                  <MapPin size={22} />
                </span>
              </div>
              <div className="nagpur-caption">
                <span className="status-dot" />
                <div>
                  <strong>Local expertise. A closer connection.</strong>
                  <span>Serving Nagpur & nearby areas.</span>
                </div>
              </div>
            </div>
          </Reveal>
        )}
        <Reveal className="contact-form-card" delay={100}>
          {ready ? (
            <div
              ref={confirmation}
              tabIndex={-1}
              className="enquiry-confirmation"
              aria-live="polite"
            >
              <span className="confirmation-icon">
                <ClipboardCheck size={35} strokeWidth={1.4} />
              </span>
              <Eyebrow>YOUR NEXT STEP</Eyebrow>
              <FormHeading>Your enquiry is ready to send.</FormHeading>
              <p>
                Continue in WhatsApp to send your details to CivicQC. If it didn’t open, use the
                button below.
              </p>
              <dl>
                <div>
                  <dt>Property</dt>
                  <dd>
                    {form.property} · {form.location}
                  </dd>
                </div>
                <div>
                  <dt>Service</dt>
                  <dd>{form.service}</dd>
                </div>
                <div>
                  <dt>Preferred date</dt>
                  <dd>{form.date || 'To be discussed'}</dd>
                </div>
              </dl>
              <a
                href={whatsappLink(text)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-dark"
              >
                <WhatsAppIcon width={18} height={18} />
                Continue on WhatsApp
                <ArrowUpRight size={17} />
              </a>
              <a
                href={`mailto:${EMAIL}?subject=${encodeURIComponent('Property inspection enquiry — ' + form.name.trim())}&body=${encodeURIComponent(text)}`}
                className="text-link"
              >
                Prefer email? Send your enquiry
                <Mail size={16} />
              </a>
              <p className="confirmation-note">
                <ShieldCheck size={16} />
                Your booking is confirmed only after our team agrees the scope, fees and
                availability with you. No enquiry has been stored on this website.
              </p>
              <button type="button" className="edit-enquiry" onClick={() => setReady(false)}>
                Edit enquiry details
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={onSubmit} noValidate>
              <div className="form-heading">
                <FormHeading>Start with a free consultation.</FormHeading>
                <span>No commitment. Just clarity.</span>
              </div>
              <p className="form-required-note">Fields marked * are required.</p>
              <div className="form-grid">
                <Field label="Full name" id={`${uid}-name`} error={errors.name} required>
                  <input
                    {...fieldProps('name')}
                    type="text"
                    placeholder="Your full name"
                    autoComplete="name"
                    maxLength={100}
                    required
                  />
                </Field>
                <Field label="Phone number" id={`${uid}-phone`} error={errors.phone} required>
                  <input
                    {...fieldProps('phone')}
                    type="tel"
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                    maxLength={24}
                    required
                  />
                </Field>
                <Field label="Email address" id={`${uid}-email`} error={errors.email}>
                  <input
                    {...fieldProps('email')}
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    maxLength={254}
                  />
                </Field>
                <Field
                  label="Property type"
                  id={`${uid}-property`}
                  error={errors.property}
                  required
                >
                  <div className="select-wrap">
                    <select {...fieldProps('property')} required>
                      <option value="" disabled>
                        Select property type
                      </option>
                      {propertyTypes.map((type) => (
                        <option key={type}>{type}</option>
                      ))}
                    </select>
                    <ChevronDown size={15} />
                  </div>
                </Field>
                <Field
                  label="Property location"
                  id={`${uid}-location`}
                  error={errors.location}
                  required
                >
                  <input
                    {...fieldProps('location')}
                    type="text"
                    placeholder="Locality / area in Nagpur"
                    autoComplete="street-address"
                    maxLength={250}
                    required
                  />
                </Field>
                <Field label="Preferred inspection date" id={`${uid}-date`} error={errors.date}>
                  <input
                    {...fieldProps('date')}
                    type="date"
                    min={today}
                    aria-label="Preferred inspection date (optional)"
                  />
                </Field>
                <Field
                  label="Service required"
                  id={`${uid}-service`}
                  error={errors.service}
                  required
                  className="field-full"
                >
                  <div className="select-wrap">
                    <select {...fieldProps('service')} required>
                      <option value="" disabled>
                        What can we help you with?
                      </option>
                      {services.map((service) => (
                        <option key={service.id}>{service.short}</option>
                      ))}
                      <option>Help me choose</option>
                    </select>
                    <ChevronDown size={15} />
                  </div>
                </Field>
                <Field
                  label="Anything we should know?"
                  id={`${uid}-message`}
                  className="field-full"
                >
                  <textarea
                    {...fieldProps('message')}
                    placeholder="Property size, possession timeline or any specific concerns…"
                    rows={3}
                    maxLength={2000}
                  />
                </Field>
              </div>
              {Object.values(errors).some(Boolean) && (
                <p className="form-error-summary" role="alert">
                  Please check the highlighted fields before continuing.
                </p>
              )}
              <button type="submit" className="btn btn-dark form-submit">
                Request Inspection
                <ArrowUpRight size={19} />
              </button>
              <p className="form-handoff">
                <WhatsAppIcon width={13} height={13} />
                <span>
                  Opens WhatsApp with your enquiry. You choose when to send.
                  <br />
                  Availability, scope and fees are confirmed before booking.
                </span>
              </p>
              <div className="form-privacy">
                <Check size={13} />
                No payment required. Your details aren’t stored on this website.
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
