import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import {
  services,
  serviceCategories,
  pdiRates,
  pricingPackages,
  estimateFee,
} from '../src/content/catalog';
import { reportExample } from '../src/content/inspection';

const date = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
const rawForm = fs.readFileSync('public/netlify-booking-form.html', 'utf8');
const processedForm = rawForm
  .replace('data-netlify="true"', '')
  .replace(
    '</form>',
    '<input type="hidden" name="form-name" value="civicqc-inspection-request" /></form>',
  );
async function mockNetlify(page: Page, status = 200) {
  await page.route('**/netlify-booking-form.html', (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: processedForm }),
  );
  const posts: URLSearchParams[] = [];
  await page.route('**/', async (route) => {
    if (route.request().method() !== 'POST') return route.continue();
    posts.push(new URLSearchParams(route.request().postData() || ''));
    await route.fulfill({
      status,
      contentType: 'text/html',
      body: status === 200 ? '<p>Form received</p>' : '<p>Unable to receive form</p>',
    });
  });
  return posts;
}
async function completeWizard(
  page: Page,
  service = 'pre-delivery-inspection',
  size = '2 BHK',
  audit = false,
) {
  await page.goto(
    `/book-inspection?service=${service}&property=Apartment&size=${encodeURIComponent(size)}`,
  );
  await expect(page.locator('[name="service"]')).toHaveValue(service);
  const next = () => page.getByRole('button', { name: 'Continue', exact: true }).click();
  const check = async () => {
    if (!audit) return;
    const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(r.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) }))).toEqual(
      [],
    );
  };
  await check();
  await next();
  await check();
  await next();
  await check();
  await next();
  await page.locator('[name="date"]').fill(date);
  await check();
  await next();
  await page.locator('[name="name"]').fill('Test Homeowner');
  await page.locator('[name="phone"]').fill('+91 98765 43210');
  await page.locator('[name="email"]').fill('test@example.com');
  await page.locator('[name="location"]').fill('Dharampeth, Nagpur');
  await page.locator('[name="address"]').fill('Illustrative test property address, Nagpur');
  await page
    .locator('[name="requirements"]')
    .fill('Test enquiry only; please confirm the scope and fees.');
  await page.locator('[name="consent"]').check();
  await check();
  await next();
  await check();
  await expect(page.getByRole('heading', { name: 'Confirm Request', exact: true })).toBeVisible();
}

test('catalogue contains all 20 requested services with exact published base fees', async () => {
  expect(serviceCategories).toHaveLength(5);
  expect(services).toHaveLength(20);
  const expected: Record<string, number> = {
    'basic-home-inspection': 2999,
    'pre-delivery-inspection': 3999,
    'villa-row-house-inspection': 9999,
    'seepage-inspection': 1499,
    'moisture-audit': 2499,
    'advanced-moisture-investigation': 4999,
    'material-assessment': 1499,
    'concrete-testing': 999,
    'concrete-ndt-testing': 2499,
    'steel-testing': 1499,
    'cement-testing': 999,
    'aggregate-testing': 1499,
    'material-testing-package': 7999,
    'property-quality-audit': 3999,
    'comprehensive-property-audit': 6999,
    'technical-consultation': 1499,
    'technical-consultation-session': 999,
    'technical-report': 1499,
    'builder-snag-list': 999,
    're-inspection': 1499,
  };
  expect(Object.fromEntries(services.map((s) => [s.id, s.amount]))).toEqual(expected);
  expect(pdiRates.map((rate) => rate.amount)).toEqual([3999, 4999, 6499, 7999, 9999]);
  expect(pricingPackages.map((plan) => plan.amount)).toEqual([2999, 4999, 6499, 9999]);
  expect(
    serviceCategories.map((cat) => services.filter((s) => s.categoryId === cat.id).length),
  ).toEqual([3, 3, 7, 4, 3]);
});

test('fees never invent lab totals or apply apartment prices to villa requests', async () => {
  const pdi = services.find((s) => s.id === 'pre-delivery-inspection')!;
  expect(estimateFee(pdi, 'Apartment', '2 BHK').amount).toBe(4999);
  expect(estimateFee(pdi, 'Apartment', '3 BHK').amount).toBe(6499);
  expect(estimateFee(pdi, 'Villa', '1 BHK').amount).toBe(9999);
  expect(estimateFee(pdi, 'Row House', '2 BHK').qualifier).toBe('onwards');
  expect(estimateFee(pdi, 'Other', 'Custom').amount).toBeNull();
  for (const id of [
    'concrete-testing',
    'steel-testing',
    'cement-testing',
    'aggregate-testing',
    'material-testing-package',
  ]) {
    const e = estimateFee(
      services.find((s) => s.id === id)!,
      'Other',
      'Custom',
    );
    expect(e.labAdditional).toBe(true);
    expect(e.explanation).toContain('additional');
  }
  expect(reportExample.findings).toHaveLength(14);
  expect(
    reportExample.severities.map(
      (level) => reportExample.findings.filter((f) => f.severity === level.id).length,
    ),
  ).toEqual([1, 4, 6, 3]);
});

test('catalogue search, category filters and every details/booking link are functional', async ({
  page,
}) => {
  await page.goto('/services#service-catalogue');
  await expect(page.locator('.portfolio-card')).toHaveCount(20);
  for (const service of services) {
    const card = page.locator(`.portfolio-card[data-service-id="${service.id}"]`);
    await expect(card.getByRole('link', { name: 'View Details', exact: true })).toHaveAttribute(
      'href',
      service.path,
    );
    await expect(card.getByRole('link', { name: 'Book Now', exact: true })).toHaveAttribute(
      'href',
      new RegExp(`service=${service.id}`),
    );
  }
  await page
    .getByRole('group', { name: 'Filter service categories' })
    .getByRole('button', { name: 'Civil & Material Testing', exact: true })
    .click();
  await expect(page.locator('.portfolio-card')).toHaveCount(7);
  await expect(page.locator('[data-service-id="concrete-testing"]')).toContainText(
    '+ actual laboratory charges',
  );
  await page.getByRole('searchbox', { name: 'Search services' }).fill('cement');
  await expect(page.locator('.portfolio-card')).toHaveCount(2);
  await page.getByRole('searchbox', { name: 'Search services' }).fill('nonexistentxyz');
  await expect(page.getByRole('heading', { name: 'No matching services yet.' })).toBeVisible();
  await page.getByRole('button', { name: 'Show all services', exact: true }).click();
  await expect(page.locator('.portfolio-card')).toHaveCount(20);
});

test('pricing packages, comparison and add-ons are available with accurate prefill', async ({
  page,
}) => {
  await page.goto('/pricing');
  await expect(page.locator('.pricing-package')).toHaveCount(4);
  await expect(page.locator('.pricing-package-popular')).toContainText('₹4,999');
  await expect(
    page.getByRole('region', { name: 'Inspection package comparison' }).locator('tbody tr'),
  ).toHaveCount(10);
  await expect(page.locator('.addons-grid article')).toHaveCount(7);
  await page.getByRole('link', { name: 'Choose Professional', exact: true }).click();
  await expect(page.locator('[name="service"]')).toHaveValue('pre-delivery-inspection');
  await expect(page.locator('.booking-summary-price')).toContainText('₹6,499');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByRole('radio', { name: 'Apartment', exact: true })).toBeChecked();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByRole('radio', { name: '3 BHK', exact: true })).toBeChecked();
});

test('guided finder recommends a contextual service and resets cleanly', async ({ page }) => {
  await page.goto('/services#find-inspection');
  const finder = page.locator('.inspection-finder');
  await finder.getByRole('button', { name: /Already seeing dampness/ }).click();
  await finder
    .getByRole('button', { name: 'Moisture-meter readings & mapping', exact: true })
    .click();
  await expect(finder.locator('.finder-result')).toContainText('Moisture Meter Audit');
  await expect(finder.locator('.finder-result')).toContainText('₹2,499');
  await expect(finder.getByRole('link', { name: 'Book Inspection', exact: true })).toHaveAttribute(
    'href',
    /service=moisture-audit/,
  );
  await finder.getByRole('button', { name: 'Review choices', exact: true }).click();
  await finder.getByRole('button', { name: 'Change concern', exact: true }).click();
  await finder.getByRole('button', { name: /Builder has fixed/ }).click();
  await finder
    .getByRole('button', { name: 'Verify items in my earlier report', exact: true })
    .click();
  await expect(finder.locator('.finder-result')).toContainText('Re-Inspection');
});

test('score demo is explicitly illustrative and all four severity filters are consistent', async ({
  page,
}) => {
  await page.goto('/');
  const score = page.locator('.score-section').first();
  await expect(score).toContainText('ILLUSTRATIVE EXAMPLE');
  await expect(score).toContainText('87');
  await expect(score).toContainText('108');
  await expect(score).toContainText('120');
  await expect(score).toContainText('not a structural stability certificate');
  await score.getByRole('button', { name: /Explore the 14 illustrative findings/ }).click();
  await expect(score.locator('.score-finding-grid article')).toHaveCount(14);
  for (const [name, count] of [
    ['Critical', 1],
    ['Major', 4],
    ['Moderate', 6],
    ['Minor', 3],
  ] as const) {
    await score.locator('.score-filters').getByRole('button', { name, exact: true }).click();
    await expect(score.locator('.score-finding-grid article')).toHaveCount(count);
  }
});

test('guided booking validates each stage and never submits unprocessed preview forms', async ({
  page,
}) => {
  let posts = 0;
  page.on('request', (r) => {
    if (r.method() === 'POST') posts++;
  });
  await page.goto('/book-inspection');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.locator('[name="service"]')).toHaveAttribute('aria-invalid', 'true');
  await completeWizard(page);
  await expect(page.locator('.review-estimate')).toContainText('₹4,999');
  await page.getByRole('button', { name: 'Prepare WhatsApp Request', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Your request is ready for WhatsApp.', exact: true }),
  ).toBeVisible();
  await expect(page.locator('.booking-result')).toContainText(
    'Nothing has been submitted or stored here',
  );
  await expect(
    page.getByRole('link', { name: 'Continue on WhatsApp', exact: true }),
  ).toHaveAttribute('href', /^https:\/\/wa.me\/918275363060\?text=/);
  await expect(
    page.getByRole('heading', { name: 'Inspection Request Submitted', exact: true }),
  ).toHaveCount(0);
  expect(posts).toBe(0);
});

test('Netlify success is shown only after an accepted POST and keeps appointment/fee caveats', async ({
  page,
}) => {
  const posts = await mockNetlify(page);
  await completeWizard(page, 'concrete-testing', 'Custom', true);
  await expect(page.locator('.review-estimate')).toContainText('₹999');
  await expect(page.locator('.review-estimate')).toContainText('laboratory charges are additional');
  await page.getByRole('button', { name: 'Submit Inspection Request', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Inspection Request Submitted', exact: true }),
  ).toBeVisible();
  await expect(page.locator('.booking-result')).toContainText(
    'Our team will contact you to confirm availability and final scope.',
  );
  await expect(page.locator('.booking-result')).toContainText('not an appointment confirmation');
  expect(posts).toHaveLength(1);
  expect(posts[0].get('form-name')).toBe('civicqc-inspection-request');
  expect(posts[0].get('service_id')).toBe('concrete-testing');
  expect(posts[0].get('estimated_professional_fee_inr')).toBe('999');
  expect(posts[0].get('laboratory_charges')).toContain('Additional');
  expect(posts[0].get('property_address')).toContain('Illustrative test property');
  expect(posts[0].get('consent')).toContain('Agreed');
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(result.violations.map((v) => v.id)).toEqual([]);
});

test('failed server receipt preserves the request and offers an honest fallback, not success', async ({
  page,
}) => {
  const posts = await mockNetlify(page, 500);
  await completeWizard(page);
  await page.getByRole('button', { name: 'Submit Inspection Request', exact: true }).click();
  await expect(page.locator('.booking-submit-error')).toContainText('could not confirm');
  await expect(
    page.getByRole('heading', { name: 'Inspection Request Submitted', exact: true }),
  ).toHaveCount(0);
  await expect(page.locator('.booking-review')).toContainText('Test Homeowner');
  await expect(page.locator('.booking-submit-error a')).toHaveAttribute(
    'href',
    /^https:\/\/wa.me\/918275363060\?text=/,
  );
  expect(posts).toHaveLength(1);
});

test('invalid date, phone and missing consent are blocked without losing earlier choices', async ({
  page,
}) => {
  await page.goto('/book-inspection?service=pre-delivery-inspection&property=Apartment&size=4+BHK');
  const next = () => page.getByRole('button', { name: 'Continue', exact: true }).click();
  await next();
  await next();
  await next();
  await page.locator('[name="date"]').fill('2020-01-01');
  await next();
  await expect(page.locator('[name="date"]')).toHaveAttribute('aria-invalid', 'true');
  await page.locator('[name="date"]').fill(date);
  await next();
  await page.locator('[name="phone"]').fill('123');
  await next();
  await expect(page.locator('[name="phone"]')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('[name="consent"]')).toHaveAttribute('aria-invalid', 'true');
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await expect(page.locator('[name="date"]')).toHaveValue(date);
  await expect(page.locator('.booking-summary-price')).toContainText('₹7,999');
});

test('home and pricing stay inside the actual viewport, with comparison scrolling contained', async ({
  page,
}) => {
  for (const route of ['/', '/pricing']) {
    await page.goto(route);
    await page.waitForLoadState('networkidle');
    for (const width of [320, 360, 390, 430, 768]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate((expected) => document.documentElement.scrollWidth <= expected, width),
      ).toBe(true);
    }
  }
  await page.setViewportSize({ width: 360, height: 900 });
  const table = page.getByRole('region', { name: 'Inspection package comparison' });
  expect(await table.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
  await table.evaluate((element) => {
    element.scrollLeft = element.scrollWidth;
  });
  expect(await table.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
});
