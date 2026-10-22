import { test, expect, type Page } from '@playwright/test';

// Static build only: /api and third-party calls are stubbed so runs are deterministic.
async function load(page: Page, width = 1280) {
  await page.setViewportSize({ width, height: 800 });
  await page.route(/api\.github\.com|open-meteo|lanyard|google\.com\/s2|cloudflareinsights/, (r) => r.abort());
  await page.route('**/api/status', (r) => r.fulfill({ json: { available: true, pill: 'Open to SDE & AI internships', building: 'Testing things' } }));
  await page.route('**/api/guestbook', (r) => r.fulfill({ json: { me: null, entries: [{ id: 1, login: 'x', avatar: '/avatar.jpg', message: '<img src=x onerror=alert(1)>', created_at: 0 }] } }));
  await page.goto('/');
}

test('first screen answers who, what, how to hire', async ({ page }) => {
  await load(page);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Dikshant Jangra');
  await expect(page.getByRole('link', { name: 'View resume' })).toBeInViewport();
  await expect(page.locator('#pill-text')).toHaveText('Open to SDE & AI internships');
  await expect(page.locator('#now-building')).toHaveText('Testing things');
  await expect(page.locator('#clock')).toHaveText(/Haryana · \d\d:\d\d IST/);
  const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
  expect(ld['@type']).toBe('Person');
});

test('no horizontal scroll on a 375px phone', async ({ page }) => {
  await load(page, 375);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('command palette filters and jumps', async ({ page }) => {
  await load(page);
  await page.keyboard.press('ControlOrMeta+k');
  await page.keyboard.type('what i');
  await expect(page.getByRole('option')).toHaveText(['What I work onjump']);
  await page.keyboard.press('Enter');
  await expect(page.locator('#palette')).not.toHaveAttribute('open');
  await expect(page.locator('#focus')).toBeInViewport();
});

test('terminal easter egg', async ({ page }) => {
  await load(page);
  await page.keyboard.press('`');
  await page.locator('#term-in').fill('whoami');
  await page.keyboard.press('Enter');
  await page.locator('#term-in').fill('cat chatter');
  await page.keyboard.press('Enter');
  await expect(page.locator('#term-out')).toContainText('Dikshant Jangra (DJ)');
  await expect(page.locator('#term-out')).toContainText('libimobiledevice');
});

test('guestbook renders notes as text, not HTML', async ({ page }) => {
  await load(page);
  await page.locator('#guestbook').scrollIntoViewIfNeeded();
  await expect(page.locator('#gb-list')).toContainText('<img src=x onerror=alert(1)>');
  await expect(page.locator('#gb-auth')).toContainText('Sign in with GitHub');
});

test('theme toggle persists and useless button works', async ({ page }) => {
  await load(page);
  await page.locator('#theme').click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.locator('#useless').click();
  await expect(page.locator('#useless')).toHaveText('Told you.');
});

test('generated files exist', async ({ request }) => {
  for (const p of ['/llms.txt', '/resume/', '/resume.pdf', '/og.png', '/sitemap.xml', '/robots.txt', '/favicon.svg']) expect((await request.get(p)).status(), p).toBe(200);
  expect(await (await request.get('/llms.txt')).text()).toContain('## Work');
});

for (const width of [375, 1280])
  test(`looks right at ${width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await load(page, width);
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(`home-${width}.png`, { fullPage: true, mask: [page.locator('#clock')] });
  });
