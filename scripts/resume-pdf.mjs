// Renders dist/resume/ to public/resume.pdf (committed; Cloudflare's build image has no Chromium) with headless Chromium, serving files straight from dist (no server).
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { chromium } from '@playwright/test';

const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg' };
const browser = await chromium.launch();
const page = await browser.newPage();
await page.route('**/*', async (route) => {
  const url = new URL(route.request().url());
  if (url.host !== 'local') return route.abort();
  const path = join('dist', url.pathname.endsWith('/') ? url.pathname + 'index.html' : url.pathname);
  try {
    route.fulfill({ body: await readFile(path), contentType: types[extname(path)] ?? 'application/octet-stream' });
  } catch {
    route.fulfill({ status: 404 });
  }
});
await page.goto('http://local/resume/');
await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: 'public/resume.pdf', format: 'A4', printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log('public/resume.pdf. Commit it.');
