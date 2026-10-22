import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  // ponytail: baselines are per-OS; CI writes missing linux ones and uploads them as an artifact — commit them once.
  updateSnapshots: 'missing',
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01 } },
  use: { baseURL: 'http://127.0.0.1:4321', ...devices['Desktop Chrome'] },
  webServer: { command: 'python3 -m http.server 4321 --bind 127.0.0.1 -d dist', url: 'http://127.0.0.1:4321', reuseExistingServer: !process.env.CI, stderr: 'ignore' },
});
