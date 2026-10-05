import { Building2, Droplets, Layers3, ClipboardCheck, FileCheck2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import serviceData from './services.json' with { type: 'json' };
import categoryData from './categories.json' with { type: 'json' };

export type PriceMode = 'from' | 'onwards' | 'pdi' | 'plus-lab' | 'from-plus-lab' | 'session';
export type CategoryId =
  | 'home-property'
  | 'moisture-seepage'
  | 'civil-material'
  | 'property-consultancy'
  | 'reports-followup';
export type Service = {
  id: string;
  name: string;
  short: string;
  categoryId: CategoryId;
  icon: LucideIcon;
  path: string;
  number: string;
  amount: number;
  priceMode: PriceMode;
  description: string;
  why: string;
  scope: string[];
  checks: string[];
  deliverables: string[];
  receives: string[];
  suitable: string[];
  cta: string;
  faq: { q: string; a: string }[];
  note: string;
  duration: string;
  reportTime: string;
  scoreIncluded: boolean;
  popular?: boolean;
  variant: 'pdi' | 'moisture' | 'quality';
  cardTitle: string;
  cardItems: string[];
  highlights: string[];
  exampleIds: string[];
  seoTitle: string;
  seoDescription: string;
};
const icons: Record<string, LucideIcon> = {
  Building2,
  Droplets,
  Layers3,
  ClipboardCheck,
  FileCheck2,
};
export const serviceCategories = categoryData.map((category) => ({
  ...category,
  id: category.id as CategoryId,
  icon: icons[category.icon],
}));
export const services: Service[] = serviceData.map((service, index) => ({
  ...service,
  categoryId: service.categoryId as CategoryId,
  priceMode: service.priceMode as PriceMode,
  variant: service.variant as Service['variant'],
  icon: icons[service.icon],
  path: `/services/${service.id}`,
  number: String(index + 1).padStart(2, '0'),
  checks: service.scope,
  receives: service.deliverables,
}));
export const money = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;
export const hasLabCharges = (service: Service) =>
  ['plus-lab', 'from-plus-lab'].includes(service.priceMode);
export const priceLabel = (service: Service) => {
  const amount = money(service.amount);
  switch (service.priceMode) {
    case 'plus-lab':
      return `${amount} + actual laboratory charges`;
    case 'from-plus-lab':
      return `Starting from ${amount} + applicable laboratory charges`;
    case 'onwards':
      return `${amount} onwards`;
    case 'session':
      return `${amount} / session`;
    default:
      return `Starting from ${amount}`;
  }
};
export const pdiRates = [
  {
    size: '1 BHK',
    amount: services.find((service) => service.id === 'pre-delivery-inspection')!.amount,
    onwards: false,
  },
  { size: '2 BHK', amount: 4999, onwards: false },
  { size: '3 BHK', amount: 6499, onwards: false },
  { size: '4 BHK', amount: 7999, onwards: true },
  { size: 'Villa / Row House', amount: 9999, onwards: true },
];
export const propertySizes = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', 'Villa', 'Custom'];
export const bookingPropertyTypes = [
  'Apartment',
  'Flat',
  'Villa',
  'Row House',
  'Independent House',
  'Commercial Property',
  'Other',
];
const legacyIds: Record<string, string> = {
  'material-concrete-testing': 'material-assessment',
  'inspection-report': 'technical-report',
  'Seepage & Moisture Audit': 'moisture-audit',
  'Material & Concrete Testing': 'material-assessment',
  'Detailed Inspection Report': 'technical-report',
  'Detailed Property Audit Report': 'technical-report',
};
export function findService(value?: string | null) {
  if (!value) return undefined;
  const key = legacyIds[value] || value;
  return services.find(
    (service) => service.id === key || service.name === key || service.short === key,
  );
}
export type FeeEstimate = {
  amount: number | null;
  qualifier: string;
  explanation: string;
  labAdditional: boolean;
};
export function estimateFee(service: Service, propertyType = '', size = ''): FeeEstimate {
  if (service.id === 'pre-delivery-inspection') {
    const villa = ['Villa', 'Row House'].includes(propertyType) || size === 'Villa';
    if (!villa && ['Custom', ''].includes(size))
      return {
        amount: null,
        qualifier: 'Custom quotation',
        explanation:
          'Select a BHK size for a published estimate. Custom properties require a quotation; PDI rates start at ₹3,999.',
        labAdditional: false,
      };
    const rate = pdiRates.find((rate) => rate.size === (villa ? 'Villa / Row House' : size));
    return {
      amount: rate?.amount ?? null,
      qualifier: rate?.onwards ? 'onwards' : 'indicative fee',
      explanation: villa
        ? 'Villa / Row House starting rate. Final scope and fees are confirmed by CivicQC.'
        : `${size} PDI rate. Final scope, location and availability are confirmed by CivicQC.`,
      labAdditional: false,
    };
  }
  return {
    amount: service.amount,
    qualifier:
      service.priceMode === 'session'
        ? '/ session'
        : service.priceMode === 'plus-lab'
          ? 'professional fee'
          : 'onwards',
    explanation: hasLabCharges(service)
      ? 'CivicQC professional/coordination fee only. Actual or applicable laboratory charges are additional and quoted separately.'
      : 'An indicative starting fee, not a final quotation. Property size, location, scope and specialist requirements may affect the final price.',
    labAdditional: hasLabCharges(service),
  };
}
export const pricingPackages = [
  {
    tier: 'Starter',
    amount: services.find((service) => service.id === 'basic-home-inspection')!.amount,
    name: 'Basic Home Inspection',
    service: 'basic-home-inspection',
    size: '',
    popular: false,
    features: ['Visual & functional checks', 'Photo observations', 'Basic digital report'],
  },
  {
    tier: 'Standard',
    amount: pdiRates[1].amount,
    name: '100+ Point PDI — 2 BHK',
    service: 'pre-delivery-inspection',
    size: '2 BHK',
    popular: true,
    features: [
      '100+ inspection points',
      'Inspection Score & severity',
      'PDF report within 24 hours',
    ],
  },
  {
    tier: 'Professional',
    amount: pdiRates[2].amount,
    name: '100+ Point PDI — 3 BHK',
    service: 'pre-delivery-inspection',
    size: '3 BHK',
    popular: false,
    features: ['100+ inspection points', 'Moisture screening', 'PDF report within 24 hours'],
  },
  {
    tier: 'Premium',
    amount: services.find((service) => service.id === 'villa-row-house-inspection')!.amount,
    name: 'Villa / Large Property',
    service: 'villa-row-house-inspection',
    size: 'Villa',
    popular: false,
    features: [
      'Internal & external scope',
      'Advanced moisture assessment',
      'Detailed report & Inspection Score',
    ],
  },
];
export const addOnIds = [
  'moisture-audit',
  're-inspection',
  'technical-consultation-session',
  'builder-snag-list',
  'advanced-moisture-investigation',
  'concrete-ndt-testing',
  'technical-report',
];
export const comparisonRows = [
  ['Civil Inspection', '✓', '✓', '✓', '✓'],
  ['Flooring & Tiles', '✓', '✓', '✓', '✓'],
  ['Electrical', 'Basic', '✓', '✓', '✓'],
  ['Plumbing', 'Basic', '✓', '✓', '✓'],
  ['Moisture Screening', 'Basic', '✓', '✓', 'Advanced'],
  ['100+ Points', '—', '✓', '✓', '✓'],
  ['Photo Report', '✓', '✓', '✓', '✓'],
  ['Inspection Score', '—', '✓', '✓', '✓'],
  ['Detailed Recommendations', '✓', '✓', '✓', '✓'],
  ['24-Hour Report', '—', '✓', '✓', '✓'],
];
export const INSPECTION_DISCLAIMER =
  'CivicQC inspection services are intended to identify observable and instrument-assisted construction, workmanship, moisture, finishing and functional concerns within the defined inspection scope. An inspection does not guarantee the absence of concealed defects and should not be represented as a structural stability certificate or absolute safety certification unless a separately qualified service is specifically provided. Specialized laboratory testing and engineering assessments may be subject to separate scope and charges.';
export const SCORE_DISCLAIMER =
  'The CivicQC Inspection Score is an indicative assessment based on the inspected components and defined inspection criteria. It is not a structural stability certificate, safety guarantee, or guarantee against concealed defects.';
export const PRICING_NOTE =
  'Final pricing may vary depending on property size, location, inspection scope and specialized testing requirements.';
