import { test, expect } from '@playwright/test';

const placements = [
  { route: '/', title: '100+ Point Property Inspection', variant: 'pdi', service: null },
  { route: '/services', title: '100+ Point Property Inspection', variant: 'pdi', service: null },
  {
    route: '/services/pre-delivery-inspection',
    title: '100+ Point Property Inspection',
    variant: 'pdi',
    service: 'pre-delivery-inspection',
  },
  {
    route: '/services/moisture-audit',
    title: 'Advanced Moisture Detection',
    variant: 'moisture',
    service: 'moisture-audit',
  },
  {
    route: '/services/property-quality-audit',
    title: 'Property Quality Assessment',
    variant: 'quality',
    service: 'property-quality-audit',
  },
];

for (const placement of placements) {
  test(`signature card and booking CTA work on ${placement.route}`, async ({ page }) => {
    await page.goto(placement.route);
    const card = page.locator('.animated-inspection-card');
    await expect(card).toHaveCount(1);
    await expect(card).toHaveAttribute('data-variant', placement.variant);
    await expect(card.getByRole('heading', { name: placement.title, exact: true })).toBeVisible();
    await expect(card).toContainText('PROFESSIONAL ASSESSMENT');
    await expect(card.locator('.aic-badge-report')).toBeVisible();
    await expect(card.locator('.aic-indicator')).toHaveCount(6);
    // This is real HTML and SVG, not a screenshot or embedded animation.
    await expect(card.locator('img, video, canvas, iframe')).toHaveCount(0);
    await card.locator('.aic-cta').click();
    await expect(page).toHaveURL(/\/book-inspection(?:\?|$)/);
    await expect(page.locator('[name="service"]')).toBeVisible();
    if (placement.service)
      await expect(page.locator('[name="service"]')).toHaveValue(placement.service);
    await expect(page.getByRole('button', { name: 'Continue', exact: true })).toBeVisible();
  });
}

test('inspection indicators respond to pointer, touch and keyboard without changing card height', async ({
  page,
}) => {
  await page.goto('/#services');
  const card = page.locator('.animated-inspection-card');
  const labels = [
    'Civil Quality',
    'Flooring & Tiles',
    'Electrical',
    'Plumbing',
    'Moisture',
    'Finishing',
  ];
  const heights: number[] = [];
  for (const label of labels) {
    await card.getByRole('button', { name: label, exact: true }).click();
    await expect(card).toHaveAttribute('data-active-area', label);
    await expect(card.locator('.aic-observation strong')).toHaveText(label);
    await expect(card.locator('.aic-indicator[aria-pressed="true"]')).toHaveCount(1);
    heights.push((await card.boundingBox())!.height);
  }
  expect(Math.max(...heights) - Math.min(...heights)).toBeLessThanOrEqual(1);
  await card.getByRole('button', { name: 'Moisture', exact: true }).focus();
  await page.keyboard.press('ArrowDown');
  await expect(card.getByRole('button', { name: 'Finishing', exact: true })).toBeFocused();
  await page.keyboard.press('Home');
  await expect(card.getByRole('button', { name: 'Civil Quality', exact: true })).toBeFocused();
  await expect(card.locator('.aic-marker-active')).toHaveAttribute('data-marker', '0');
});

test('reduced motion keeps the card static and its text selectable', async ({ page }) => {
  await page.goto('/#services');
  const card = page.locator('.animated-inspection-card');
  await expect(card).toHaveAttribute('data-motion', 'reduced');
  await expect(card.locator('.aic-scan-band')).toHaveCSS('animation-name', 'none');
  await expect(card.locator('.aic-grid')).toHaveCSS('animation-name', 'none');
  await expect(card.locator('.aic-cursor-glow')).toHaveCSS('display', 'none');
  const selectedText = await card.locator('.aic-title').evaluate((element) => {
    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    const text = selection?.toString();
    selection?.removeAllRanges();
    return text;
  });
  expect(selectedText?.replace(/\s+/g, ' ').trim()).toBe('100+ Point Property Inspection');
});

test('mobile service order is copy, card, then actions without horizontal overflow', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile layout assertion');
  for (const width of [360, 390, 430]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/#services');
    const copy = (await page.locator('.services-highlight-copy').boundingBox())!;
    const card = (await page.locator('.services-highlight-card').boundingBox())!;
    const actions = (await page.locator('.services-highlight-actions').boundingBox())!;
    expect(copy.y + copy.height).toBeLessThanOrEqual(card.y);
    expect(card.y + card.height).toBeLessThanOrEqual(actions.y + 1);
    expect(card.x).toBeGreaterThanOrEqual(0);
    expect(card.x + card.width).toBeLessThanOrEqual(width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await expect(page.locator('.aic-cursor-glow')).toHaveCSS('display', 'none');
  }
});

test.describe('Full motion behavior', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('scan, hover and motion preference work without a Pause video tab', async ({
    page,
  }, testInfo) => {
    await page.goto('/#services');
    // Let hydration, fonts and the initial hash navigation settle before test-driven scrolling.
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);
    const card = page.locator('.animated-inspection-card');
    await expect(card).toHaveAttribute('data-motion', 'full');
    await card.scrollIntoViewIfNeeded();
    await expect(card).toBeInViewport({ ratio: 0.5 });
    await expect(card).toHaveAttribute('data-running', 'true');
    await expect(card.locator('.aic-scan-band')).toHaveCSS('animation-play-state', 'running');
    await expect(card.locator('.aic-scan-band')).toHaveCSS('animation-name', 'aic-scan');
    await expect(card.locator('.aic-title')).toHaveText('100+ Point Property Inspection');
    if (testInfo.project.name === 'desktop') {
      const surface = card.locator('.aic-surface');
      await surface.hover({ position: { x: 40, y: 70 } });
      await expect(card.locator('.aic-cursor-glow')).toHaveCSS('opacity', '1');
      await expect
        .poll(async () =>
          card.locator('.aic-cursor-glow').evaluate((element) => element.style.transform),
        )
        .toContain('translate3d');
      await expect
        .poll(async () =>
          surface.evaluate((element) => new DOMMatrix(getComputedStyle(element).transform).m42),
        )
        .toBeLessThan(-3);
    } else {
      await expect(card.locator('.aic-cursor-glow')).toHaveCSS('display', 'none');
    }
    await expect(page.locator('.hero-video-toggle, .hero-video-control-row')).toHaveCount(0);
    await page.getByRole('button', { name: 'Reduce website motion', exact: true }).click();
    await expect(card).toHaveAttribute('data-motion', 'reduced');
    await expect(card.locator('.aic-scan-band')).toHaveCSS('animation-name', 'none');
    await page.reload();
    await expect(card).toHaveAttribute('data-motion', 'reduced');
    expect(await page.locator('.hero-background-film').getAttribute('src')).toBeNull();
  });
});
