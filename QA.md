# Quality assurance — complete services & pricing update

Verified against the production build on **04 October 2026**.

## Production results

- TypeScript and Vite production build succeed; all **26 public routes** plus the 404 page are pre-rendered.
- **170 automated checks passed; two mobile-only checks are intentionally skipped in the desktop project** (172 cases total).
- All public routes return their own H1 and page-specific HTML. The 26 page titles are distinct, with unique route canonical references.
- No runtime/hydration errors were found in the tested production routes and interactions.
- Automated axe-core WCAG 2 A/AA / WCAG 2.1 AA checks pass on all public pages, the report dialog, every guided-booking step and the mocked successful receipt screen at tested desktop/mobile viewports.
- Responsive sweep across all 26 pages at **320, 360, 390, 430, 768, 1024, 1200, 1440 and 1920px** found no page-wide horizontal overflow.
- The comparison table scrolls within its labelled region, without expanding the whole page. The mobile report preview no longer uses the decorative paper rotation that caused overflow.
- The expanded mobile navigation works at tablet widths including 1200px; links remain unnumbered.
- Legacy moisture/material/report paths return 301 redirects to their current routes. Unknown page URLs return 404 for HTML requests.

## Catalogue and prices

- Exactly 20 services, grouped as **3 / 3 / 7 / 4 / 3** across the five requested categories.
- Every requested base fee is checked against an explicit expected-price fixture.
- PDI prices: **₹3,999 / ₹4,999 / ₹6,499 / ₹7,999 onwards / ₹9,999 onwards**.
- The four primary packages, ten-row comparison, seven add-ons, catalogue filters/search and all service detail/booking links are covered.
- Laboratory-related quotes identify the CivicQC professional/coordination fee and exclude actual/applicable laboratory charges. No laboratory total is fabricated.
- Villa / Row House requests do not incorrectly inherit a lower apartment PDI fee. Custom-size PDI requests ask for a quotation instead of inventing a per-area formula.
- The guided service finder returns contextual recommendations and can be reset/reviewed.

## Booking and privacy

- All six stages, URL prefill, property/size choices, past-date rejection, contact/address validation, consent, review/edit and fee qualifications are covered.
- A processed Netlify form definition and accepted HTTP POST are mocked to test **Inspection Request Submitted**. The payload includes all declared fields and the additional-laboratory-charge caveat.
- A server failure is mocked to verify that no success or confirmed-appointment claim appears and entered details are retained.
- An unprocessed preview definition causes **no POST** and shows a clear, user-controlled WhatsApp handoff instead.
- No live Netlify account/inbox or actual email notification has been configured or verified here. Activation and a real owner-controlled smoke test are required; see `NETLIFY-FORMS.md`.
- Tests intercept form collection, WhatsApp launches and phone activation. They do not send real messages, place calls, create real enquiries or appointments, or take payments.
- No personal-data draft is placed in browser localStorage. Only the optional reduced-motion preference is remembered.

## Score, report and interaction consistency

- The score example is explicitly illustrative: **87 / 100 (Good), 108 / 120 points assessed, 14 fictional findings**.
- Counts match the shared data: **1 Critical, 4 Major, 6 Moderate, 3 Minor**.
- Severity definitions are consistent in the signature card, dashboard legend, sample findings, score UI, report modal and generated PDF.
- The report PDF contains six readable pages and all 14 example findings. Its sample status, fictional property/date, AI-generated illustrative photograph and inspection/score limitations are explicit.
- No structural certification, safety guarantee, universal concealed-defect detection claim or unapproved score-weighting formula is introduced.
- Shared card behavior, selection, keyboard interaction, text selection, hover/glow, off-screen pause and reduced motion are retained.
- The supplied silent background video remains. Its visible Pause-video tab remains removed; footer/device motion preferences still work.
- Existing checklist, FAQ, sample-report focus/download, quick WhatsApp enquiry, call/email destinations and sticky contact actions remain functional.

## Launch review

Set the actual public domain in `VITE_SITE_URL` and rebuild for absolute canonical/social URLs and a sitemap. Enable Netlify form detection, redeploy, configure owner notifications and verify a real request in the dashboard/inbox. Review business scope, published fees, report commitments and privacy/retention practices before public launch.

Automated testing and Chromium mobile emulation are not a guarantee of complete accessibility or compatibility with every browser/device. Real-device checks, a manual assistive-technology audit and live-hosting acceptance tests remain recommended.
