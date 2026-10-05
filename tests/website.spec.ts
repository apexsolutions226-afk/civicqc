import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { publicPagePaths } from '../src/routes';
import { faqs } from '../src/data';

for (const route of publicPagePaths) {
  test(`${route} loads without errors, broken imagery or overflow`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(route);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page).toHaveTitle(/CivicQC/);
    expect(await page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
    ).toBe(true);
    const brokenImages = await page
      .locator('img')
      .evaluateAll((images) =>
        images
          .filter((image) => image.complete && image.naturalWidth === 0)
          .map((image) => image.src),
      );
    expect(brokenImages).toEqual([]);
    expect(errors).toEqual([]);
    const json = await page.locator('script[type="application/ld+json"]').textContent();
    expect(JSON.parse(json || '[]')[0].telephone).toBe('+918275363060');
  });

  test(`${route} has no automated WCAG A/AA violations`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState('networkidle');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(
      results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
    ).toEqual([]);
  });
}

test('inspection dashboard supports all six categories, details and keyboard input', async ({
  page,
}) => {
  await page.goto('/#checklist');
  const categories = [
    'Civil & Structural',
    'Doors & Windows',
    'Electrical',
    'Plumbing',
    'Kitchen & Bathrooms',
    'General Finishing',
  ];
  for (const category of categories) {
    const tab = page.getByRole('tab', { name: category, exact: true });
    await tab.click();
    await expect(tab).toHaveAttribute('aria-selected', 'true');
    await expect(
      page.getByRole('tabpanel').getByRole('heading', { name: category, exact: true }),
    ).toBeVisible();
    await expect(page.getByRole('tabpanel').locator('.inspection-item')).toHaveCount(5);
  }
  await page.getByRole('tab', { name: 'Electrical', exact: true }).click();
  await page.getByRole('button', { name: 'Sockets', exact: false }).click();
  await expect(
    page.getByText('Accessible socket condition and functional checks where safe.', {
      exact: true,
    }),
  ).toBeVisible();
  await page.getByRole('tab', { name: 'Electrical', exact: true }).focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('tab', { name: 'Plumbing', exact: true })).toBeFocused();
  await expect(page.getByRole('tab', { name: 'Plumbing', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
});

test('FAQ opens and closes each answer independently', async ({ page }) => {
  await page.goto('/#faq');
  await expect(page.locator('.faq-answer:visible')).toHaveCount(1);
  await page.locator('#faq-question-0').click();
  await expect(page.locator('.faq-answer:visible')).toHaveCount(0);
  for (let i = 0; i < faqs.length; i++) {
    await page.locator(`#faq-question-${i}`).click();
    await expect(page.locator(`#faq-answer-${i}`)).toBeVisible();
    await expect(page.locator('.faq-answer:visible')).toHaveCount(1);
  }
});

test('sample report opens, downloads a real PDF and restores focus', async ({ page }) => {
  await page.goto('/#report');
  const trigger = page.getByRole('button', { name: 'Request Sample Report', exact: true });
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog')).toContainText('Demonstration only.');
  const pdf = await page.request.get('/CivicQC-Sample-Inspection-Report.pdf');
  expect(pdf.ok()).toBe(true);
  expect((await pdf.body()).subarray(0, 4).toString()).toBe('%PDF');
  await expect(page.getByRole('link', { name: 'Download sample PDF' })).toHaveAttribute(
    'download',
    '',
  );
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('invalid enquiry is blocked with accessible field-level feedback', async ({ page }) => {
  await page.goto('/#contact');
  await page.getByRole('button', { name: 'Request Inspection', exact: true }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.locator('[name="name"]')).toBeFocused();
  await expect(page.locator('.field-error')).toHaveCount(5);
  await page.locator('[name="name"]').fill('Test Homeowner');
  await page.locator('[name="phone"]').fill('123');
  await page.locator('[name="email"]').fill('invalid-email');
  await page.locator('[name="property"]').selectOption('Flat / Apartment');
  await page.locator('[name="location"]').fill('Dharampeth, Nagpur');
  await page.locator('[name="service"]').selectOption('Pre-Delivery Inspection');
  await page.locator('[name="date"]').fill('2020-01-01');
  await page.getByRole('button', { name: 'Request Inspection', exact: true }).click();
  await expect(page.locator('[name="phone"]')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('[name="email"]')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('[name="date"]')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('.enquiry-confirmation')).toHaveCount(0);
});

test('homepage quick enquiry retains an honest WhatsApp handoff', async ({ page }) => {
  await page.goto('/#contact');
  await page.locator('[name="service"]').selectOption('Pre-Delivery Inspection');
  await page.locator('[name="name"]').fill('Test Homeowner');
  await page.locator('[name="phone"]').fill('+91 98765 43210');
  await page.locator('[name="email"]').fill('test@example.com');
  await page.locator('[name="property"]').selectOption('Flat / Apartment');
  await page.locator('[name="location"]').fill('Dharampeth, Nagpur');
  await page.evaluate(() => {
    window.open = (() => null) as typeof window.open;
  });
  await page.getByRole('button', { name: 'Request Inspection', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Your enquiry is ready to send.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Continue on WhatsApp' })).toHaveAttribute(
    'href',
    /^https:\/\/wa.me\/918275363060\?text=/,
  );
  await expect(page.getByRole('link', { name: /Prefer email/ })).toHaveAttribute(
    'href',
    /^mailto:civicqc\.consultants@gmail\.com\?/,
  );
  await page.getByRole('button', { name: 'Edit enquiry details' }).click();
  await expect(page.locator('[name="name"]')).toHaveValue('Test Homeowner');
});

test('property audience link prefills property type', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Villa buyers', exact: true }).click();
  await expect(page.locator('[name="property"]')).toHaveValue('Villa');
});

test('WhatsApp and contact destinations are correct', async ({ page }) => {
  await page.goto('/');
  const links = await page
    .locator('a[href*="wa.me"]')
    .evaluateAll((anchors) => anchors.map((a) => (a as HTMLAnchorElement).href));
  expect(links.length).toBeGreaterThan(3);
  expect(links.every((url) => url.startsWith('https://wa.me/918275363060?text='))).toBe(true);
  expect(await page.locator('a[href="tel:+918275363060"]').count()).toBeGreaterThan(0);
  expect(
    await page.locator('a[href="mailto:civicqc.consultants@gmail.com"]').count(),
  ).toBeGreaterThan(0);
});

test('sticky booking CTA opens the guided booking route', async ({ page }) => {
  await page.goto('/');
  await page.locator('.nav-book').click();
  await expect(page).toHaveURL(/\/book-inspection$/);
  await expect(page.getByRole('heading', { name: 'Select Service', exact: true })).toBeVisible();
  await page.locator('[name="service"]').selectOption('pre-delivery-inspection');
  await page.locator('.nav-book').click();
  await expect(page.locator('[name="service"]')).toHaveValue('pre-delivery-inspection');
});

test('mobile navigation opens, closes, follows routes and handles Escape', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile-only navigation');
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Open navigation menu', exact: true });
  await toggle.click();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
  await expect(page.locator('#mobile-menu > a')).toHaveText([
    'Home',
    'About',
    'Services',
    'Inspection Process',
    'Inspection Checklist',
    'Pricing',
    'Sample Report',
    'FAQ',
    'Contact',
  ]);
  await expect(page.locator('#mobile-menu > a > .mono')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toHaveCount(0);
  await toggle.click();
  await page
    .getByRole('navigation', { name: 'Mobile navigation' })
    .getByRole('link', { name: /About/ })
    .click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toHaveCount(0);
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
});

test('sample report is keyboard-scrollable and passes automated accessibility checks', async ({
  page,
}) => {
  await page.goto('/#report');
  await page.getByRole('button', { name: 'Request Sample Report', exact: true }).click();
  const region = page.getByRole('region', { name: 'Sample inspection report content' });
  await region.focus();
  await expect(region).toBeFocused();
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(
    results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
  ).toEqual([]);
});

test('hero shows a static poster without downloading video for reduced motion', async ({
  page,
}) => {
  const videoRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('/videos/')) videoRequests.push(request.url());
  });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const video = page.locator('.hero-background-film');
  await expect(page.locator('.hero-video-poster')).toBeVisible();
  expect(await video.getAttribute('src')).toBeNull();
  expect(await video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  await expect(page.locator('.hero-video-toggle, .hero-video-control-row')).toHaveCount(0);
  expect(await video.evaluate((element: HTMLVideoElement) => element.controls)).toBe(false);
  expect(videoRequests).toEqual([]);
});

test.describe('Hero background playback', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('provided video autoplays silently, loops, pauses and resumes', async ({
    page,
  }, testInfo) => {
    await page.goto('/');
    const video = page.locator('.hero-background-film');
    await page.waitForFunction(() => {
      const video = document.querySelector<HTMLVideoElement>('.hero-background-film');
      return video && video.readyState >= 2 && !video.paused && video.currentTime > 0.1;
    });
    await expect(video).toHaveAttribute(
      'src',
      testInfo.project.name === 'mobile'
        ? '/videos/hero-background-mobile.mp4'
        : '/videos/hero-background.mp4',
    );
    expect(
      await video.evaluate((element: HTMLVideoElement) => ({
        muted: element.muted,
        loop: element.loop,
        inline: element.playsInline,
      })),
    ).toEqual({ muted: true, loop: true, inline: true });
    await expect(page.locator('.hero-video-toggle, .hero-video-control-row')).toHaveCount(0);
    await page.getByRole('button', { name: 'Reduce website motion', exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
    await page.locator('.hero-video-section').scrollIntoViewIfNeeded();
    expect(await video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
    await page.getByRole('button', { name: 'Enable website motion', exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'full');
    await page.locator('.hero-video-section').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => {
      const video = document.querySelector<HTMLVideoElement>('.hero-background-film');
      return video && !video.paused;
    });
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.waitForFunction(
      () => document.querySelector<HTMLVideoElement>('.hero-background-film')?.paused,
    );
    await page.locator('.hero-video-section').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => {
      const video = document.querySelector<HTMLVideoElement>('.hero-background-film');
      return video && !video.paused;
    });
  });
});
