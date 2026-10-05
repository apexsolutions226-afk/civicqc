import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode, ChangeEvent, FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Info,
  LoaderCircle,
  ShieldCheck,
} from 'lucide-react';
import {
  services,
  serviceCategories,
  bookingPropertyTypes,
  propertySizes,
  findService,
  estimateFee,
  money,
} from '../content/catalog';
import type { FeeEstimate } from '../content/catalog';
import { PHONE, CALL_LINK, whatsappLink } from '../data';
import { Eyebrow, WhatsAppIcon } from '../components/UI';
import {
  emptyBooking,
  todayInIndia,
  validateBooking,
  netlifyFormsAvailable,
  submitBooking,
  bookingMessage,
  BOOKING_FORM_NAME,
} from '../lib/booking';
import type { BookingDraft, BookingErrors } from '../lib/booking';

const steps = [
  'Select Service',
  'Property Type',
  'Property Size',
  'Preferred Date',
  'Customer Details',
  'Confirm Request',
];
function WizardField({
  id,
  label,
  error,
  optional,
  children,
  wide = false,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={`wizard-field ${wide ? 'wizard-field-wide' : ''}`}>
      <label htmlFor={id}>
        {label}
        <span>{optional ? ' (optional)' : ' *'}</span>
      </label>
      {children}
      {error && (
        <p className="wizard-field-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

export default function BookInspection() {
  const [params] = useSearchParams();
  const [draft, setDraft] = useState<BookingDraft>({ ...emptyBooking });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [available, setAvailable] = useState<boolean | null>(null);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<'submitted' | 'unavailable' | null>(null);
  const [submitError, setSubmitError] = useState('');
  const [reference, setReference] = useState('');
  const [today, setToday] = useState('');
  const uid = useId().replace(/:/g, '');
  const stepTitle = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const changedStep = useRef(false);
  useEffect(() => {
    setToday(todayInIndia());
    let active = true;
    void netlifyFormsAvailable().then((value) => {
      if (active) setAvailable(value);
    });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    const selected = findService(params.get('service'));
    const rawProperty = params.get('property');
    const property = rawProperty === 'Flat / Apartment' ? 'Apartment' : rawProperty;
    const size = params.get('size');
    setDraft((old) => ({
      ...old,
      ...(selected ? { service: selected.id } : {}),
      ...(property && bookingPropertyTypes.includes(property) ? { property } : {}),
      ...(size && propertySizes.includes(size) ? { size } : {}),
    }));
    setStep(0);
    setResult(null);
    setErrors({});
    setSubmitError('');
  }, [params]);
  useEffect(() => {
    if (changedStep.current) stepTitle.current?.focus();
    changedStep.current = true;
  }, [step]);
  useEffect(() => {
    if (result) resultRef.current?.focus();
  }, [result]);
  const service = findService(draft.service);
  const estimate: FeeEstimate = service
    ? estimateFee(service, draft.property, draft.size)
    : {
        amount: null,
        qualifier: 'Select a service',
        explanation: 'Choose a service and property details to see an indicative professional fee.',
        labAdditional: false,
      };
  const update = <K extends keyof BookingDraft>(key: K, value: BookingDraft[K]) => {
    setDraft((old) => ({ ...old, [key]: value }));
    setErrors((old) => ({ ...old, [key]: undefined }));
    setSubmitError('');
  };
  const inputProps = (key: Exclude<keyof BookingDraft, 'consent'>) => ({
    id: `${uid}-${key}`,
    name: key,
    value: draft[key],
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      update(key, event.target.value),
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `${uid}-${key}-error` : undefined,
  });
  const validateCurrent = () => {
    const next = validateBooking(draft, step);
    setErrors(next);
    if (Object.keys(next).length) {
      requestAnimationFrame(() =>
        formRef.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"], [data-group-invalid="true"] input')
          ?.focus(),
      );
      return false;
    }
    return true;
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    if (step < 5) {
      if (validateCurrent()) setStep(step + 1);
      return;
    }
    const next = validateBooking(draft);
    if (Object.keys(next).length) {
      setErrors(next);
      setStep(
        next.service ? 0 : next.property ? 1 : next.size || next.area ? 2 : next.date ? 3 : 4,
      );
      return;
    }
    const ref =
      reference ||
      `CQC-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    setReference(ref);
    setPending(true);
    setSubmitError('');
    try {
      const received = await submitBooking(draft, estimate, ref);
      setResult(received);
    } catch (error) {
      setSubmitError(
        error instanceof Error && error.name !== 'TimeoutError'
          ? error.message
          : 'We could not confirm that your request was received. Your details are still here. Retry or use WhatsApp.',
      );
    } finally {
      setPending(false);
    }
  };
  const whatsapp = whatsappLink(bookingMessage(draft, estimate, reference || 'Website enquiry'));
  const reviewRow = (label: string, value: string, editStep: number) => (
    <div>
      <dt>{label}</dt>
      <dd>
        {value || 'Not provided'}
        <button
          type="button"
          onClick={() => setStep(editStep)}
          disabled={pending}
          aria-label={`Edit ${label.toLowerCase()}`}
        >
          Edit
        </button>
      </dd>
    </div>
  );
  return (
    <>
      <section className="inner-hero booking-flow-hero blueprint-dark">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <ChevronRight size={13} />
            <span>Book inspection</span>
          </div>
          <Eyebrow light>YOUR INDEPENDENT PROPERTY QUALITY PARTNER</Eyebrow>
          <h1>
            Book your inspection.
            <br />
            <span>Start with a clearer scope.</span>
          </h1>
          <p>
            A few details. An indicative fee. A request for our team to review—not an automatically
            confirmed appointment.
          </p>
          {available === false && (
            <span className="booking-flow-mode">
              <Info size={14} />
              Online collection is not active here. This version offers a WhatsApp handoff without
              claiming your request has been submitted.
            </span>
          )}
        </div>
      </section>
      <section className="section booking-flow-section">
        <div className="container booking-flow-layout">
          <div className="booking-flow-main">
            {!result ? (
              <>
                <nav className="booking-stepper" aria-label="Booking progress">
                  <ol>
                    {steps.map((label, index) => (
                      <li
                        key={label}
                        className={
                          index === step ? 'step-current' : index < step ? 'step-done' : ''
                        }
                      >
                        <button
                          type="button"
                          onClick={() => {
                            if (index < step) {
                              setErrors({});
                              setStep(index);
                            }
                          }}
                          disabled={index >= step || pending}
                          aria-current={index === step ? 'step' : undefined}
                        >
                          <span>{index < step ? <Check size={13} /> : index + 1}</span>
                          <small>{label}</small>
                        </button>
                      </li>
                    ))}
                  </ol>
                </nav>
                <form
                  ref={formRef}
                  className="booking-wizard"
                  name={BOOKING_FORM_NAME}
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <input type="hidden" name="form-name" value={BOOKING_FORM_NAME} />
                  <p className="booking-honeypot" aria-hidden="true">
                    <label>
                      Leave this field empty
                      <input
                        name="bot-field"
                        tabIndex={-1}
                        autoComplete="off"
                        value={draft.bot}
                        onChange={(event) => update('bot', event.target.value)}
                      />
                    </label>
                  </p>
                  <div className="wizard-heading">
                    <span>STEP {String(step + 1).padStart(2, '0')} / 06</span>
                    <h2 ref={stepTitle} tabIndex={-1}>
                      {steps[step]}
                    </h2>
                    <p>
                      {
                        [
                          'Choose a focused service. You can review your selection before sending.',
                          'Tell us what kind of property needs a closer look.',
                          'Size helps us show the relevant published fee, where available.',
                          'Choose a preferred date. Availability will be confirmed by our team.',
                          'Your details are used to review and respond to this inspection request.',
                          'Review the scope and estimate before sending your request.',
                        ][step]
                      }
                    </p>
                  </div>
                  {!!Object.keys(errors).filter((key) => errors[key as keyof BookingDraft])
                    .length && (
                    <div className="wizard-error-summary" role="alert">
                      Please review the highlighted fields before continuing.
                    </div>
                  )}
                  {step === 0 && (
                    <>
                      <WizardField
                        id={`${uid}-service`}
                        label="Inspection service"
                        error={errors.service}
                      >
                        <select {...inputProps('service')} required>
                          <option value="">Select a service</option>
                          {serviceCategories.map((category) => (
                            <optgroup label={category.name} key={category.id}>
                              {services
                                .filter((service) => service.categoryId === category.id)
                                .map((service) => (
                                  <option value={service.id} key={service.id}>
                                    {service.name}
                                  </option>
                                ))}
                            </optgroup>
                          ))}
                        </select>
                      </WizardField>
                      {service && (
                        <div className="wizard-selected-service">
                          <service.icon size={26} strokeWidth={1.4} />
                          <div>
                            <h3>{service.name}</h3>
                            <p>{service.description}</p>
                            <Link to={service.path}>
                              View the complete scope
                              <ArrowRight size={14} />
                            </Link>
                          </div>
                        </div>
                      )}
                      <Link to="/services#find-inspection" className="wizard-help-link">
                        Not sure? Find My Inspection
                        <ArrowRight size={15} />
                      </Link>
                    </>
                  )}
                  {step === 1 && (
                    <fieldset className="wizard-radio-group" data-group-invalid={!!errors.property}>
                      <legend className="sr-only">Property type</legend>
                      <div className="wizard-choice-grid">
                        {bookingPropertyTypes.map((value) => (
                          <label
                            key={value}
                            className={draft.property === value ? 'choice-selected' : ''}
                          >
                            <input
                              type="radio"
                              name="property"
                              value={value}
                              checked={draft.property === value}
                              onChange={() => {
                                update('property', value);
                                if (['Villa', 'Row House'].includes(value)) update('size', 'Villa');
                              }}
                              aria-describedby={
                                errors.property ? `${uid}-property-error` : undefined
                              }
                            />
                            <Building2 size={21} strokeWidth={1.3} />
                            <span>{value}</span>
                            <Check size={14} className="choice-check" />
                          </label>
                        ))}
                      </div>
                      {errors.property && (
                        <p className="wizard-field-error" id={`${uid}-property-error`}>
                          {errors.property}
                        </p>
                      )}
                    </fieldset>
                  )}
                  {step === 2 && (
                    <>
                      <fieldset className="wizard-radio-group" data-group-invalid={!!errors.size}>
                        <legend className="sr-only">Property size</legend>
                        <div className="wizard-choice-grid size-choice-grid">
                          {propertySizes.map((value) => (
                            <label
                              key={value}
                              className={draft.size === value ? 'choice-selected' : ''}
                            >
                              <input
                                type="radio"
                                name="size"
                                value={value}
                                checked={draft.size === value}
                                onChange={() => update('size', value)}
                                aria-describedby={errors.size ? `${uid}-size-error` : undefined}
                              />
                              <span>{value}</span>
                              <Check size={14} className="choice-check" />
                            </label>
                          ))}
                        </div>
                        {errors.size && (
                          <p className="wizard-field-error" id={`${uid}-size-error`}>
                            {errors.size}
                          </p>
                        )}
                      </fieldset>
                      {draft.size === 'Custom' && (
                        <WizardField
                          id={`${uid}-area`}
                          label="Approximate built-up area (sq ft)"
                          error={errors.area}
                          optional
                        >
                          <input
                            {...inputProps('area')}
                            type="text"
                            inputMode="decimal"
                            placeholder="For example, 1800"
                            maxLength={12}
                          />
                        </WizardField>
                      )}
                      <p className="wizard-inline-note">
                        <Info size={15} />
                        For material tests or a non-residential scope, select Custom and describe
                        the requirements in Step 5. No sample quantity or lab cost is assumed.
                      </p>
                    </>
                  )}
                  {step === 3 && (
                    <>
                      <WizardField
                        id={`${uid}-date`}
                        label="Preferred inspection / consultation date"
                        error={errors.date}
                      >
                        <input
                          {...inputProps('date')}
                          type="date"
                          min={today || undefined}
                          required
                        />
                      </WizardField>
                      <div className="wizard-date-note">
                        <Clock3 size={21} />
                        <div>
                          <h3>A preference, not a confirmed slot.</h3>
                          <p>
                            Our team will contact you to confirm availability, property readiness,
                            access and the appropriate schedule.
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                  {step === 4 && (
                    <div className="wizard-customer-fields">
                      <WizardField id={`${uid}-name`} label="Full name" error={errors.name}>
                        <input
                          {...inputProps('name')}
                          autoComplete="name"
                          maxLength={100}
                          required
                        />
                      </WizardField>
                      <WizardField id={`${uid}-phone`} label="Phone number" error={errors.phone}>
                        <input
                          {...inputProps('phone')}
                          type="tel"
                          autoComplete="tel"
                          placeholder="+91"
                          maxLength={24}
                          required
                        />
                      </WizardField>
                      <WizardField
                        id={`${uid}-email`}
                        label="Email address"
                        error={errors.email}
                        optional
                      >
                        <input
                          {...inputProps('email')}
                          type="email"
                          autoComplete="email"
                          maxLength={254}
                        />
                      </WizardField>
                      <WizardField
                        id={`${uid}-location`}
                        label="Locality / city"
                        error={errors.location}
                      >
                        <input
                          {...inputProps('location')}
                          autoComplete="address-level2"
                          placeholder="For example, Dharampeth, Nagpur"
                          maxLength={120}
                          required
                        />
                      </WizardField>
                      <WizardField
                        id={`${uid}-address`}
                        label="Property address"
                        error={errors.address}
                        wide
                      >
                        <textarea
                          {...inputProps('address')}
                          autoComplete="street-address"
                          rows={3}
                          maxLength={500}
                          required
                        />
                      </WizardField>
                      <WizardField
                        id={`${uid}-requirements`}
                        label="Additional requirements"
                        error={errors.requirements}
                        optional
                        wide
                      >
                        <textarea
                          {...inputProps('requirements')}
                          rows={4}
                          maxLength={2000}
                          placeholder="Tell us about your concerns, test requirements, access or a previous inspection. Please do not include identity documents or payment information."
                        />
                      </WizardField>
                      <div className="wizard-consent">
                        <label>
                          <input
                            type="checkbox"
                            name="consent"
                            checked={draft.consent}
                            onChange={(event) => update('consent', event.target.checked)}
                            aria-invalid={errors.consent ? true : undefined}
                            aria-describedby={errors.consent ? `${uid}-consent-error` : undefined}
                          />
                          <span>
                            I agree that CivicQC may use these contact and property details to
                            review my request and contact me about the inspection.
                          </span>
                        </label>
                        <Link to="/privacy" target="_blank" rel="noopener noreferrer">
                          Read the privacy notice
                          <ArrowRight size={13} />
                        </Link>
                        {errors.consent && (
                          <p className="wizard-field-error" id={`${uid}-consent-error`}>
                            {errors.consent}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {step === 5 && (
                    <>
                      <dl className="booking-review">
                        {reviewRow('Service', service?.name || '', 0)}
                        {reviewRow('Property type', draft.property, 1)}
                        {reviewRow(
                          'Property size',
                          `${draft.size}${draft.area ? ` · approx. ${draft.area} sq ft` : ''}`,
                          2,
                        )}
                        {reviewRow('Preferred date', draft.date, 3)}
                        {reviewRow('Customer', `${draft.name} · ${draft.phone}`, 4)}
                        {reviewRow('Email', draft.email, 4)}
                        {reviewRow('Location', draft.location, 4)}
                        {reviewRow('Property address', draft.address, 4)}
                        {reviewRow('Additional requirements', draft.requirements, 4)}
                      </dl>
                      <div className="review-estimate">
                        <span>ESTIMATED CIVICQC PROFESSIONAL FEE</span>
                        <strong>
                          {estimate.amount === null
                            ? estimate.qualifier
                            : `${money(estimate.amount)} ${estimate.qualifier}`}
                        </strong>
                        <p>{estimate.explanation}</p>
                        {estimate.labAdditional && (
                          <b>
                            Actual / applicable laboratory charges are additional, not included
                            above.
                          </b>
                        )}
                      </div>
                      <p className="request-not-confirmed">
                        <ShieldCheck size={17} />
                        Submitting a request does not confirm an appointment. Final scope, fees and
                        availability are agreed by CivicQC.
                      </p>
                      {available === false && (
                        <div className="booking-preview-note">
                          <Info size={18} />
                          <p>
                            <strong>Online form collection is not active here.</strong> No request
                            has been submitted or stored here. You can prepare the same details for
                            WhatsApp. Netlify collection becomes available after form detection is
                            enabled and the site is redeployed.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                  {submitError && (
                    <div className="booking-submit-error" role="alert">
                      <p>{submitError}</p>
                      <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                        Send these details on WhatsApp
                        <ArrowRight size={15} />
                      </a>
                    </div>
                  )}
                  <div className="wizard-navigation">
                    {step > 0 && (
                      <button
                        type="button"
                        className="wizard-back"
                        disabled={pending}
                        onClick={() => {
                          setErrors({});
                          setStep(step - 1);
                        }}
                      >
                        <ArrowLeft size={16} />
                        Back
                      </button>
                    )}
                    <button className="btn btn-dark" type="submit" disabled={pending}>
                      {pending ? (
                        <>
                          <LoaderCircle size={17} className="submission-spinner" />
                          Sending request…
                        </>
                      ) : step === 5 ? (
                        available === false ? (
                          <>
                            Prepare WhatsApp Request
                            <ArrowRight size={17} />
                          </>
                        ) : (
                          <>
                            Submit Inspection Request
                            <ArrowRight size={17} />
                          </>
                        )
                      ) : (
                        <>
                          Continue
                          <ArrowRight size={17} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div
                className={`booking-result ${result === 'submitted' ? 'booking-success' : 'booking-ready'}`}
                ref={resultRef}
                tabIndex={-1}
              >
                <span className="booking-result-icon">
                  {result === 'submitted' ? (
                    <CheckCircle2 size={35} strokeWidth={1.3} />
                  ) : (
                    <WhatsAppIcon width={33} height={33} />
                  )}
                </span>
                <Eyebrow>
                  {result === 'submitted' ? 'REQUEST RECEIVED' : 'NOT SUBMITTED YET'}
                </Eyebrow>
                <h2>
                  {result === 'submitted'
                    ? 'Inspection Request Submitted'
                    : 'Your request is ready for WhatsApp.'}
                </h2>
                <p>
                  {result === 'submitted'
                    ? 'Our team will contact you to confirm availability and final scope.'
                    : 'Online collection is unavailable on this version of the website. Open WhatsApp and press Send to deliver your details to CivicQC. Nothing has been submitted or stored here.'}
                </p>
                <dl className="booking-result-summary">
                  <div>
                    <dt>Request reference</dt>
                    <dd>{reference}</dd>
                  </div>
                  <div>
                    <dt>Service</dt>
                    <dd>{service?.name}</dd>
                  </div>
                  <div>
                    <dt>Preferred date</dt>
                    <dd>{draft.date}</dd>
                  </div>
                </dl>
                {result === 'unavailable' && (
                  <a
                    className="btn btn-dark"
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsAppIcon width={18} height={18} />
                    Continue on WhatsApp
                    <ArrowRight size={17} />
                  </a>
                )}
                <p className="booking-result-note">
                  This is not an appointment confirmation or final quotation. No payment has been
                  taken.{' '}
                  {estimate.labAdditional &&
                    'Laboratory charges are additional to the displayed professional fee.'}
                </p>
                {result === 'unavailable' ? (
                  <button type="button" className="wizard-back" onClick={() => setResult(null)}>
                    <ArrowLeft size={15} />
                    Edit request
                  </button>
                ) : (
                  <Link className="text-link" to="/services">
                    Explore inspection services
                    <ArrowRight size={15} />
                  </Link>
                )}
              </div>
            )}
          </div>
          <aside className="booking-summary">
            <span className="booking-summary-label">YOUR INSPECTION REQUEST</span>
            <div className="booking-summary-icon">
              {service ? (
                <service.icon size={28} strokeWidth={1.3} />
              ) : (
                <ShieldCheck size={28} strokeWidth={1.3} />
              )}
            </div>
            <h2>{service?.name || 'A scope that fits your property.'}</h2>
            <div className="booking-summary-price">
              <span>INDICATIVE PROFESSIONAL FEE</span>
              <strong>
                {estimate.amount === null ? estimate.qualifier : money(estimate.amount)}
              </strong>
              {estimate.amount !== null && <small>{estimate.qualifier}</small>}
            </div>
            <p>{estimate.explanation}</p>
            {estimate.labAdditional && (
              <div className="booking-lab-note">+ Actual / applicable laboratory charges</div>
            )}
            <ul>
              <li>
                <Check size={14} />
                No payment required to enquire
              </li>
              <li>
                <Check size={14} />
                Final scope confirmed by our team
              </li>
              <li>
                <Check size={14} />
                No automatic appointment confirmation
              </li>
            </ul>
            <div className="booking-summary-contact">
              <span>Prefer to speak to us?</span>
              <a href={CALL_LINK}>
                {PHONE}
                <ArrowRight size={14} />
              </a>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon width={16} height={16} />
                WhatsApp for Inspection
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
