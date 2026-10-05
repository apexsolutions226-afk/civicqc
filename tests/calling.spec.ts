import { test, expect } from '@playwright/test';
import { publicPagePaths } from '../src/routes';

const destination = 'tel:+918275363060';

test('Call Now uses the correct native dialer link and supports keyboard activation', async ({
  page,
}) => {
  await page.goto('/');
  const heroCall = page.locator('.hero-contact-actions .call-button');
  await expect(heroCall).toBeVisible();
  await expect(heroCall).toHaveAccessibleName(/Call Now.*CivicQC.*8275363060/);
  await expect(heroCall).toHaveAttribute('href', destination);
  await expect(page.locator('.cta-contact-actions .call-button')).toHaveAttribute(
    'href',
    destination,
  );
  const links = await page
    .locator('a[href^="tel:"]')
    .evaluateAll((elements) => elements.map((element) => element.getAttribute('href')));
  expect(links.length).toBeGreaterThanOrEqual(5);
  expect(links.every((link) => link === destination)).toBe(true);
  // Check the native link activation without placing a real call or opening an external app.
  await page.evaluate(() => {
    document.addEventListener('click', (event) => {
      const link = (event.target as Element).closest('a[href^="tel:"]');
      if (link) {
        event.preventDefault();
        document.documentElement.dataset.testDialled = link.getAttribute('href') || '';
      }
    });
  });
  await heroCall.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('data-test-dialled', destination);
  await expect(page).toHaveURL(/\/$/);
});

test('persistent calling is available on every route with usable mobile quick actions', async ({
  page,
}, testInfo) => {
  const mobile = testInfo.project.name === 'mobile';
  for (const route of publicPagePaths) {
    await page.goto(route);
    const call = page.locator(mobile ? '.mobile-quick-call' : '.floating-call');
    await expect(call).toBeVisible();
    await expect(call).toHaveAttribute('href', destination);
    const box = (await call.boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
  if (mobile) {
    for (const width of [320, 360, 390, 430, 760]) {
      await page.setViewportSize({ width, height: 900 });
      const bar = page.locator('.mobile-contact-actions');
      await expect(bar.locator('a')).toHaveCount(3);
      await expect(
        bar.getByRole('link', { name: 'Book an Inspection', exact: true }),
      ).toHaveAttribute('href', '/book-inspection');
      await expect(bar.getByRole('link', { name: 'WhatsApp', exact: true })).toHaveAttribute(
        'href',
        /^https:\/\/wa.me\/918275363060\?/,
      );
      for (const link of await bar.locator('a').all()) {
        const box = (await link.boundingBox())!;
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(width);
        expect(await link.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(
          true,
        );
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }
  }
});
