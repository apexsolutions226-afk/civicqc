import { bookingPropertyTypes, propertySizes, findService } from '../content/catalog';
import type { FeeEstimate } from '../content/catalog';

export type BookingDraft = {
  service: string;
  property: string;
  size: string;
  area: string;
  date: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  address: string;
  requirements: string;
  consent: boolean;
  bot: string;
};
export type BookingErrors = Partial<Record<keyof BookingDraft, string>>;
export const emptyBooking: BookingDraft = {
  service: '',
  property: '',
  size: '',
  area: '',
  date: '',
  name: '',
  phone: '',
  email: '',
  location: '',
  address: '',
  requirements: '',
  consent: false,
  bot: '',
};
export const todayInIndia = () =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
export function validateBooking(draft: BookingDraft, step?: number): BookingErrors {
  const errors: BookingErrors = {};
  const check = (value: number) => step === undefined || step === value;
  if (check(0) && !findService(draft.service))
    errors.service = 'Choose the service you would like to discuss.';
  if (check(1) && !bookingPropertyTypes.includes(draft.property))
    errors.property = 'Select a property type.';
  if (check(2) && !propertySizes.includes(draft.size))
    errors.size = 'Select a property size, or choose Custom.';
  if (
    check(2) &&
    draft.area &&
    (!/^\d+(\.\d{1,2})?$/.test(draft.area) ||
      Number(draft.area) <= 0 ||
      Number(draft.area) > 10000000)
  )
    errors.area = 'Enter a valid approximate area in square feet.';
  if (check(3)) {
    const date = new Date(`${draft.date}T00:00:00Z`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(draft.date) ||
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== draft.date
    )
      errors.date = 'Choose a valid preferred date.';
    else if (draft.date < todayInIndia()) errors.date = 'Choose today or a future date.';
  }
  if (check(4)) {
    if (draft.name.trim().length < 2 || draft.name.length > 100)
      errors.name = 'Enter your full name (2–100 characters).';
    if (!/^\d{10,15}$/.test(draft.phone.replace(/[\s()+.\-]/g, '')))
      errors.phone = 'Enter a valid phone number with 10–15 digits.';
    if (
      draft.email &&
      (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim()) || draft.email.length > 254)
    )
      errors.email = 'Enter a valid email address, or leave this optional field blank.';
    if (draft.location.trim().length < 3 || draft.location.length > 120)
      errors.location = 'Enter the property locality and city.';
    if (draft.address.trim().length < 6 || draft.address.length > 500)
      errors.address = 'Enter a usable property address (6–500 characters).';
    if (draft.requirements.length > 2000)
      errors.requirements = 'Keep additional requirements within 2,000 characters.';
    if (!draft.consent)
      errors.consent = 'Please agree to the use of these details for your inspection request.';
  }
  return errors;
}
export const BOOKING_FORM_NAME = 'civicqc-inspection-request';

/** Netlify strips its detection attribute and injects form-name after processing a static form.
 * This probe prevents a Vite/static preview's HTML fallback from being mistaken for a receipt. */
export async function netlifyFormsAvailable(): Promise<boolean> {
  try {
    const response = await fetch('/netlify-booking-form.html', {
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return false;
    const document = new DOMParser().parseFromString(await response.text(), 'text/html');
    const form = document.querySelector<HTMLFormElement>(`form[name="${BOOKING_FORM_NAME}"]`);
    return (
      !!form &&
      !form.hasAttribute('data-netlify') &&
      !form.hasAttribute('netlify') &&
      form.querySelector<HTMLInputElement>('input[name="form-name"]')?.value === BOOKING_FORM_NAME
    );
  } catch {
    return false;
  }
}
export function bookingPayload(draft: BookingDraft, estimate: FeeEstimate, reference: string) {
  const service = findService(draft.service)!;
  return new URLSearchParams({
    'form-name': BOOKING_FORM_NAME,
    'bot-field': draft.bot,
    request_reference: reference,
    service_id: service.id,
    service: service.name,
    property_type: draft.property,
    property_size: draft.size,
    approximate_area_sqft: draft.area,
    preferred_date: draft.date,
    name: draft.name.trim(),
    phone: draft.phone.trim(),
    email: draft.email.trim(),
    location: draft.location.trim(),
    property_address: draft.address.trim(),
    additional_requirements: draft.requirements.trim(),
    estimated_professional_fee_inr:
      estimate.amount === null ? 'Custom quotation required' : String(estimate.amount),
    estimate_basis: `${estimate.qualifier}. ${estimate.explanation}`,
    laboratory_charges: estimate.labAdditional
      ? 'Additional actual/applicable laboratory charges; not included in displayed professional fee.'
      : 'Specialist tests are separate unless agreed.',
    consent: draft.consent
      ? 'Agreed: CivicQC may use these details to review and respond to this inspection request.'
      : 'Not agreed',
  });
}
export async function submitBooking(
  draft: BookingDraft,
  estimate: FeeEstimate,
  reference: string,
): Promise<'submitted' | 'unavailable'> {
  if (Object.keys(validateBooking(draft)).length)
    throw new Error('Please review the required fields.');
  if (draft.bot)
    throw new Error(
      'We could not validate this request. Please try again or contact CivicQC directly.',
    );
  if (!(await netlifyFormsAvailable())) return 'unavailable';
  const response = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: bookingPayload(draft, estimate, reference).toString(),
    signal: AbortSignal.timeout(25000),
  });
  if (!response.ok)
    throw new Error(
      'We could not confirm that your request was received. Your details are still here. Please retry or use WhatsApp.',
    );
  return 'submitted';
}
export function bookingMessage(draft: BookingDraft, estimate: FeeEstimate, reference: string) {
  const service = findService(draft.service);
  return `Hello CivicQC Consultants, I would like to request an inspection.\n\nReference: ${reference}\nService: ${service?.name || draft.service}\nProperty type: ${draft.property}\nProperty size: ${draft.size}${draft.area ? ` (${draft.area} sq ft approximate)` : ''}\nPreferred date: ${draft.date}\nName: ${draft.name.trim()}\nPhone: ${draft.phone.trim()}${draft.email ? `\nEmail: ${draft.email.trim()}` : ''}\nLocation: ${draft.location.trim()}\nProperty address: ${draft.address.trim()}${draft.requirements ? `\nAdditional requirements: ${draft.requirements.trim()}` : ''}\n\nEstimated professional fee: ${estimate.amount === null ? 'Custom quotation required' : `INR ${estimate.amount} ${estimate.qualifier}`}\n${estimate.explanation}\n\nPlease confirm availability, final scope and fees. This is an enquiry, not a confirmed appointment.`;
}
