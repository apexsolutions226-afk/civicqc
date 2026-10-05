import { Building2, Droplets, DoorOpen, PlugZap, Bath, Paintbrush } from 'lucide-react';

export const PHONE = '+91 8275363060';
export const CALL_LINK = `tel:${PHONE.replace(/[^+\d]/g, '')}`;
export const EMAIL = 'civicqc.consultants@gmail.com';
export const WHATSAPP = 'https://wa.me/918275363060';
export const whatsappLink = (
  text = 'Hello CivicQC Consultants, I would like to know more about a property inspection in Nagpur.',
) => `${WHATSAPP}?text=${encodeURIComponent(text)}`;
const enquiryLink = (
  path: string,
  service?: string,
  property?: string,
  hash = '',
  size?: string,
) => {
  const query = new URLSearchParams();
  if (service) query.set('service', service);
  if (property) query.set('property', property);
  if (size) query.set('size', size);
  return `${path}${query.size ? `?${query.toString()}` : ''}${hash}`;
};
export const contactLink = (service?: string, property?: string) =>
  enquiryLink('/', service, property, '#contact');
export const bookingLink = (service?: string, property?: string, size?: string) =>
  enquiryLink('/book-inspection', service, property, '', size);

export { services, type Service } from './content/catalog';

export const faqs = [
  {
    q: 'Are laboratory charges included in the displayed testing fee?',
    a: 'Concrete, steel/rebar, cement and aggregate testing show the CivicQC professional/coordination fee plus actual laboratory charges. The material testing package may also require additional laboratory charges. Methods, samples, laboratory requirements and final costs are agreed before work begins.',
  },
  {
    q: 'Is the CivicQC Inspection Score a safety certificate?',
    a: 'No. It is an indicative assessment of inspected components and defined criteria, not a structural stability certificate, safety guarantee or guarantee against concealed defects. A Critical finding needs prompt professional attention even when the overall score is Good.',
  },

  {
    q: 'What is a Pre-Delivery Inspection?',
    a: 'A Pre-Delivery Inspection (PDI) is a systematic assessment of a newly completed property before you take possession. It documents visible construction defects, finishing concerns and functional issues so you can discuss them with your builder.',
  },
  {
    q: 'What does the 100+ point inspection include?',
    a: 'It covers civil work, walls, ceilings, flooring, doors, windows, accessible electrical points, plumbing, fixtures and general finishing. The final scope depends on your property, site readiness and access.',
  },
  {
    q: 'When should I get my home inspected?',
    a: 'Ideally, book when the builder says your property is ready for handover, before you sign the final acceptance or move in. Utilities should be available so functional checks can be carried out where safe.',
  },
  {
    q: 'Can you detect seepage and moisture?',
    a: 'Yes. We use professional moisture detection equipment and visual assessment to identify potential dampness and seepage concerns. Pinpointing the exact source may require additional investigation.',
  },
  {
    q: 'Do you inspect electrical and plumbing points?',
    a: 'Yes. Accessible switches, sockets, fixtures, taps, drainage and other functional points are assessed where utilities and safe access are available. This does not replace specialist electrical certification or concealed-system testing.',
  },
  {
    q: 'Will I receive photographs in the report?',
    a: 'Yes. Observed defects are documented with photographs, their location, clear observations and recommendations to help you understand and discuss the findings.',
  },
  {
    q: 'How quickly will I receive the inspection report?',
    a: 'PDI and Villa / Row House inspection reports are delivered within 24 hours of the completed site inspection. Basic audits, standalone reports and specialist testing have scope-specific timelines confirmed in advance; external laboratory results are separate.',
  },
  {
    q: 'Do you provide inspection services in Nagpur?',
    a: 'Yes. CivicQC Consultants serves Nagpur and nearby areas. Share your property location with us so we can confirm availability, travel arrangements and the inspection scope.',
  },
  {
    q: 'Can I use the report while discussing defects with my builder?',
    a: 'Yes. The report gives you organised observations and photographic evidence to support rectification discussions. It is not a legal opinion, and rectification remains subject to your agreement with the builder.',
  },
  {
    q: 'How can I book an inspection?',
    a: 'Call or WhatsApp +91 8275363060, email civicqc.consultants@gmail.com, or complete the enquiry form. We will discuss your property, confirm scope and fees, and agree an inspection date with you.',
  },
];

export const inspectionCategories = [
  {
    name: 'Civil & Structural',
    icon: Building2,
    code: 'CIV',
    items: [
      ['Walls', 'Visible cracks, surface evenness, alignment and signs of dampness.'],
      ['Ceilings', 'Visible cracks, surface finish, staining and junctions.'],
      ['Flooring', 'Tile alignment, lippage, cracks and indicators of hollow areas.'],
      ['Plaster', 'Surface consistency, visible cracking and finish quality.'],
      ['Finishing', 'Edges, junctions and accessible civil-work details.'],
    ],
  },
  {
    name: 'Doors & Windows',
    icon: DoorOpen,
    code: 'D&W',
    items: [
      ['Frames', 'Visible condition, fixing and frame-to-wall junctions.'],
      ['Alignment', 'Opening, closing and visible alignment of shutters.'],
      ['Locks', 'Operation of accessible locks, latches and handles.'],
      ['Glass', 'Visible scratches, cracks and glazing condition.'],
      ['Sealing', 'Visible gaps, weather seals and sealant continuity.'],
    ],
  },
  {
    name: 'Electrical',
    icon: PlugZap,
    code: 'ELE',
    items: [
      ['Switches', 'Accessible switch condition, fixing and basic operation.'],
      ['Sockets', 'Accessible socket condition and functional checks where safe.'],
      ['DB', 'Visible distribution-board condition and labelling, where accessible.'],
      ['Safety checks', 'Visible electrical concerns for specialist attention.'],
      ['Functional points', 'Operation of available points, subject to power and safe access.'],
    ],
  },
  {
    name: 'Plumbing',
    icon: Droplets,
    code: 'PLB',
    items: [
      ['Taps', 'Accessible tap operation, fixing and visible leakage.'],
      ['Fixtures', 'Visible fixing, connections and condition of fixtures.'],
      ['Drainage', 'Accessible drainage function and signs of pooling.'],
      ['Leakage', 'Visible leakage at accessible pipework and connections.'],
      ['Water pressure', 'Practical flow and pressure observations where water is available.'],
    ],
  },
  {
    name: 'Kitchen & Bathrooms',
    icon: Bath,
    code: 'K&B',
    items: [
      ['Tiles', 'Tile condition, alignment, grouting and visible defects.'],
      ['Fixtures', 'Accessible fixture installation and basic operation.'],
      ['Countertop', 'Surface condition, edges, joints and visible fixing.'],
      [
        'Waterproofing indicators',
        'Visible dampness and moisture indicators; not a concealed membrane test.',
      ],
      ['Drainage', 'Visible floor slope indicators, pooling and accessible drainage.'],
    ],
  },
  {
    name: 'General Finishing',
    icon: Paintbrush,
    code: 'FIN',
    items: [
      ['Paint', 'Coverage, patchiness, peeling and visible surface quality.'],
      ['Grouting', 'Visible gaps, cracks and grout consistency.'],
      ['Silicone', 'Sealant continuity and visible condition at joints.'],
      ['Fittings', 'Visible fixing, alignment and condition of accessible fittings.'],
      ['Workmanship', 'A systematic review of finishing details and junctions.'],
    ],
  },
];
export const homeServiceIds = [
  'pre-delivery-inspection',
  'moisture-audit',
  'material-assessment',
  'technical-report',
];
export const propertyTypes = [
  'Flat / Apartment',
  'Independent House',
  'Villa',
  'Commercial Property',
  'Other',
];
