# AnimatedInspectionCard

The CivicQC signature inspection interface is a real, reusable React component. It uses selectable HTML text, an original inline SVG scope drawing and CSS animations. It is not a static image, video, canvas or third-party animation embed.

No animated-card reference attachment was available with this update. The design was therefore created from the supplied written specification and the existing CivicQC visual identity, rather than claiming an exact match to an unseen reference.

## Files

- `src/components/AnimatedInspectionCard.tsx` — typed React component, including small `InspectionMetric`, `InspectionBadge` and `InspectionScan` supporting components.
- `src/inspection-card.css` — card-specific styling, motion, responsive container queries and placement styles.
- `src/components/MotionPreferences.tsx` — shared motion preference and a discreet footer accessibility control.
- `src/routes.ts` — central page registry used by React routing, static generation and the production preview.

The `.tsx` extension keeps the component consistent with this project's TypeScript/React source. JSX content and copy remain directly editable.

## Placement

| Route                                              | Card variant |
| -------------------------------------------------- | ------------ |
| `/` → Professional Inspection & Quality Assessment | PDI          |
| `/services`                                        | PDI          |
| `/services/pre-delivery-inspection`                | PDI          |
| `/services/moisture-audit`                         | Moisture     |
| `/services/property-quality-audit`                 | Quality      |

The home page, master catalogue and all twenty service detail pages import the same component (22 placements). Additional service pages use catalogue-driven titles, scope indicators and report/fee badges; laboratory services do not inherit an unconditional 24-hour report promise. The focused service pages also share `ServiceDetailPage` and `ServiceUI`; the existing service data is not duplicated.

## Usage

The default card includes the exact supplied heading, description, six inspection areas, assessment/report badges and `/book-inspection` CTA:

```tsx
import AnimatedInspectionCard from './components/AnimatedInspectionCard';

<AnimatedInspectionCard />;
```

Use a preset with the appropriate booking context:

```tsx
import { bookingLink } from './data';

<AnimatedInspectionCard
  variant="moisture"
  headingLevel={2}
  ctaLink={bookingLink('moisture-audit')}
/>;
```

Or override individual props:

```tsx
<AnimatedInspectionCard
  variant="quality"
  title="Complete Property Quality Assessment"
  description="A systematic review of accessible property conditions."
  inspectionItems={[
    { label: 'Workmanship', detail: 'Review visible installation and finishing details.' },
    { label: 'Plumbing', detail: 'Review accessible fixtures and visible leakage concerns.' },
    { label: 'Finishing', detail: 'Document paint, grouting and sealing concerns.' },
  ]}
  badge="PROFESSIONAL ASSESSMENT"
  reportTime="REPORT WITHIN 24 HOURS"
  ctaText="Book Inspection"
  ctaLink="/book-inspection"
/>
```

### Props

| Prop              | Purpose                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------- |
| `variant`         | `pdi`, `moisture` or `quality`; selects editable content defaults and subtle visual accents |
| `title`           | Main heading; a leading numeric value can animate once into view                            |
| `description`     | Supporting text                                                                             |
| `inspectionItems` | Array of strings or `{ label, detail }` objects                                             |
| `badge`           | Primary badge text                                                                          |
| `reportTime`      | Secondary badge text                                                                        |
| `ctaText`         | CTA label                                                                                   |
| `ctaLink`         | Internal destination; defaults to `/book-inspection`                                        |
| `label`           | Top label; defaults to `CIVICQC INSPECTION`                                                 |
| `headingLevel`    | `2` or `3`, to fit the page's heading hierarchy; defaults to `3`                            |
| `className`       | Optional layout class on the outer article                                                  |

## Interaction and performance

- IntersectionObserver triggers a one-time entrance/count animation and pauses continuous decoration off-screen.
- The scan and very slow grid drift use CSS transforms; inspection halos use opacity/transform.
- Only the small metric subcomponent updates during count-up.
- Cursor glow uses one queued requestAnimationFrame and changes only a decorative layer's transform, not React state on every pointer movement.
- Inspection areas can be selected by mouse, touch or keyboard. Arrow keys, Home and End also work.
- Text selection and native link behavior are preserved.
- Cursor-follow effects are disabled for touch/coarse-pointer devices and reduced motion.
- Reduced motion disables scans, drift, pulses and count animation. System settings are always respected. The footer control can additionally reduce motion for the whole website; only that non-personal preference is remembered in localStorage.
- The diagram is clearly labelled as a scope preview, not an actual property assessment. There are no fabricated live readings, inspection scores or certifications.

## Header video

The visible **Pause video / Play video tab has been removed** from the header. The supplied silent, looping background video remains, with its poster fallback and off-screen/inactive-tab pause behavior. The site-wide motion option is in the footer, not over the header content.

## Booking

`/book-inspection` is a real page using the shared validated enquiry form. Service variants prefill the relevant service through query parameters. The six-step flow submits to Netlify Forms when processed form detection is active, or explicitly offers WhatsApp when it is unavailable. Only a successful server response shows “Inspection Request Submitted”. The website does not automatically confirm appointments. See `NETLIFY-FORMS.md` for owner-side activation and notification configuration.

## Severity consistency

The signature card includes a compact Critical / Major / Moderate / Minor classification key, sourced from the same definitions used by the score dashboard and report. This key describes the framework; it does not claim those defects were found at a visitor’s property.
