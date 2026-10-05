# CivicQC Consultants

A custom React 19 + TypeScript + Tailwind CSS 4 website for **CivicQC Consultants, Nagpur, Maharashtra**.

**Your Independent Property Quality Partner.**  
**Inspect Before You Invest.**

## Run locally

Node.js 22 is configured for hosting. Node 20.19+ or a compatible current LTS also supports this Vite project.

```sh
npm ci
npm run dev
```

The server binds to `0.0.0.0:5173`. Fonts, images, the supplied background video, icons and PDF are local; there are no CDN/animation-library dependencies.

## What is included

- **20 individual services across five categories**, with editable descriptions, prices, scope, suitable customers, deliverables, timing notes, sample findings and FAQs.
- `/services`: searchable/filterable service catalogue, PDI highlight and a guided **Find My Inspection** recommendation flow.
- `/pricing`: Starter / Standard / Professional / Premium packages, all five PDI size rates, service comparison, seven add-ons and a separate laboratory-fee explanation.
- `/book-inspection`: accessible six-step flow—service, property type, property size, preferred date, customer details and review/confirmation.
- **Netlify Forms integration**, real response-based success, preserved-data failure handling and an honest WhatsApp fallback when online collection is not active.
- One reusable `AnimatedInspectionCard` on Home, the main catalogue and every service page. PDI, moisture, audit, testing and consultation copy comes from props/presets.
- The **CivicQC Inspection Score example**: 87/100, Good, 108/120 points assessed and 14 fictional findings (1 Critical, 4 Major, 6 Moderate, 3 Minor).
- The same four severity levels in cards, examples, dashboard legend, report UI and the **six-page illustrative sample PDF**.
- Home, About, Pricing, Services, twenty service details, Booking and Privacy: **26 public routes**, each pre-rendered for direct loading and SEO, plus a true 404 page.
- Nine main navigation links without numeric prefixes, header WhatsApp, sticky mobile Book / Call Now / WhatsApp and desktop contact actions.
- Original brand SVGs, local variable fonts, subtle reveal/counter effects, responsive layouts and reduced-motion support.

## All service routes

### Home & Property Inspection

- `/services/basic-home-inspection` — from ₹2,999
- `/services/pre-delivery-inspection` — 1 BHK ₹3,999; 2 BHK ₹4,999; 3 BHK ₹6,499; 4 BHK ₹7,999 onwards; Villa / Row House ₹9,999 onwards
- `/services/villa-row-house-inspection` — from ₹9,999

### Moisture & Seepage Inspection

- `/services/seepage-inspection` — ₹1,499 onwards
- `/services/moisture-audit` — ₹2,499 onwards
- `/services/advanced-moisture-investigation` — ₹4,999 onwards

### Civil & Material Testing

- `/services/material-assessment` — ₹1,499 onwards
- `/services/concrete-testing` — ₹999 professional fee + actual laboratory charges
- `/services/concrete-ndt-testing` — ₹2,499 onwards; scope-dependent
- `/services/steel-testing` — ₹1,499 professional fee + actual laboratory charges
- `/services/cement-testing` — ₹999 professional fee + actual laboratory charges
- `/services/aggregate-testing` — ₹1,499 professional fee + actual laboratory charges
- `/services/material-testing-package` — from ₹7,999 + applicable laboratory charges

### Property Audit & Technical Consultancy

- `/services/property-quality-audit` — ₹3,999 onwards
- `/services/comprehensive-property-audit` — ₹6,999 onwards
- `/services/technical-consultation` — ₹1,499 onwards
- `/services/technical-consultation-session` — ₹999 / session

### Reports & Follow-up Services

- `/services/technical-report` — ₹1,499 onwards
- `/services/builder-snag-list` — ₹999 onwards
- `/services/re-inspection` — ₹1,499 onwards

Old moisture/material/report URLs redirect to the corresponding current pages. No company credentials, testimonials, awards, client counts or certifications have been invented.

## Booking delivery — important

**The main booking flow uses Netlify Forms only when an actually processed form definition is detected.** Read **[NETLIFY-FORMS.md](NETLIFY-FORMS.md)** before launching.

- Enable form detection in the site owner's Netlify project and redeploy.
- Verify `civicqc-inspection-request` appears in Forms.
- Configure the owner's email notification and test a real submission after deployment.
- Only an accepted POST produces **Inspection Request Submitted**. This is a request, not an automatically confirmed appointment or final quotation.
- The local preview, or a deployment without activated form collection, does **not** pretend to submit. It prepares an explicitly labelled WhatsApp handoff; the visitor chooses to send it.
- Failed/uncertain responses retain the entered details for retry or WhatsApp.
- The homepage's separate quick-enquiry form remains a transparent WhatsApp handoff.

No payment processing or automatic appointment scheduling is implemented. Service suitability, availability and final fees are confirmed by CivicQC. Laboratory charges are never treated as known fixed totals. Personal enquiry data are not stored as browser drafts; only the optional motion preference is remembered locally.

## Pricing and content editing

| File                                                                   | Purpose                                                                                         |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `src/content/services.json`                                            | Single editable catalogue for the twenty services: fees, scope, deliverables, FAQs and metadata |
| `src/content/categories.json`                                          | Five category names, descriptions and icons                                                     |
| `src/content/catalog.ts`                                               | Typed catalogue, fee formatting/estimation, PDI rates, packages, comparison and disclaimers     |
| `src/content/report-example.json`                                      | Shared illustrative score, rating bands, severity definitions and all fourteen findings         |
| `src/content/inspection.ts`                                            | Typed report data and clearly illustrative testing-scope examples                               |
| `src/routes.ts`                                                        | Public routes and legacy URL redirects                                                          |
| `src/pages/ServiceDetailPage.tsx`                                      | One shared template for all service pages                                                       |
| `src/components/ServiceUI.tsx`                                         | Category/service cards, fee displays, disclaimer and service CTA                                |
| `src/components/InspectionFinder.tsx`                                  | Two-question recommendation flow                                                                |
| `src/components/InspectionScore.tsx`                                   | Score dashboard, severity badges/definitions and example filters                                |
| `src/pages/BookInspection.tsx`                                         | Six-step booking interface                                                                      |
| `src/lib/booking.ts`                                                   | Validation, fee-qualified request payload, Netlify availability/POST and WhatsApp fallback      |
| `public/netlify-booking-form.html`                                     | Complete static field definition required by the hosting integration                            |
| `src/components/AnimatedInspectionCard.tsx`                            | Signature component; see [ANIMATED-CARD.md](ANIMATED-CARD.md)                                   |
| `src/components/Layout.tsx`                                            | Header, footer, contact actions and scroll management                                           |
| `src/data.ts`                                                          | Contact information, WhatsApp/booking links, homepage FAQ and checklist topics                  |
| `src/portfolio.css`                                                    | Catalogue, pricing, score, service-detail and booking design                                    |
| `src/styles.css`, `src/inspection-card.css`, `src/contact-actions.css` | Existing design system, signature motion and contact action styling                             |
| `src/seo.tsx`, `scripts/prerender.tsx`                                 | Metadata, structured data and static page generation                                            |

Published fees and scope were supplied by the user. No unsupported inspection-duration figures or score-weighting formula are invented. Custom PDI sizes request a quotation rather than calculating an arbitrary per-square-foot fee. A score is indicative, not a structural stability certificate or safety guarantee. A Critical finding still requires prompt attention even when an example overall score is Good.

## Production deployment and SEO

1. Copy `.env.example` to `.env`.
2. Set `VITE_SITE_URL` to the actual public HTTPS origin, without a trailing slash.
3. Run:

```sh
npm run build
npm run preview
```

Deploy the **contents of `dist/`**, not the source folder. The build generates route-specific HTML, `_redirects`, a 404 page and the local assets. With a configured domain it generates absolute canonical/social URLs, `sitemap.xml` and its `robots.txt` entry. Until the final domain is supplied, static canonical references are relative and the client resolves its current origin—no company domain is invented.

The included `netlify.toml` configures Node 22, build/publish settings and security/cache headers for repository builds. Other static hosts need equivalent routing and do not automatically provide Netlify Forms; the WhatsApp fallback remains available. The preview server is not permanent public hosting.

## Imagery, report and motion

The supplied architectural background video remains silent, inline and looping with local desktop/mobile encodes (~548 KB / ~154 KB), a WebP poster and off-screen/hidden-tab pause behavior. **There is no visible Pause-video tab in the header.** Motion can be reduced through device settings or the discreet footer control. Data-saving mode avoids the video download.

The three original property/inspection photographs are AI-generated illustrative assets, not proof of CivicQC staff or client work. The sample report's property, date, findings, score and photograph are explicitly fictional/illustrative. The original logo, technical diagrams and digital scope interfaces are editable SVG/React work.

The six-page PDF is already included. To regenerate it after editing report example data:

```sh
python -m pip install reportlab pillow
python scripts/create-sample-report.py
```

The optional brand/social-image generator also uses `fonttools` and `brotli`; it delegates report generation to the current JSON-driven PDF script. Inter and Space Grotesk are self-hosted variable fonts, with their SIL Open Font Licenses included.

## Tests

Run a dev or production preview, then:

```sh
npx playwright install --with-deps chromium
npm test -- --workers=2
```

Tests cover all 26 pages, route metadata, hydration/runtime errors, automated WCAG A/AA checks, the catalogue, every published base fee, PDI estimates, fee/laboratory separation, comparison/prefill, finder, score/severity consistency, all booking stages, consent/date/contact validation, mocked Netlify success/failure, honest preview fallback, report/PDF, checklist/FAQ, navigation, calls/WhatsApp, reduced motion and video behavior.

Phone/WhatsApp launches and form POSTs are intercepted in tests. No real calls, messages or client enquiries are created. Automated checks do not replace real-device, assistive-technology or live-hosting acceptance testing. See `QA.md` for the current results.
