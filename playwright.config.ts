import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';
import path from 'node:path';

// Load local credentials for runs from both the terminal and VS Code Testing.
const envFile = path.join(__dirname, '.env');
if (existsSync(envFile)) {
  process.loadEnvFile(envFile);
}

// Read the shop address and credentials from the environment.
const baseURL = process.env.BASE_URL ?? 'https://eshop-demo-766125429055.europe-central2.run.app/';
const username = process.env.SHOP_USERNAME;
const password = process.env.SHOP_PASSWORD;
if (Boolean(username) !== Boolean(password)) {
  throw new Error('Set both SHOP_USERNAME and SHOP_PASSWORD for shop authentication.');
}

// Run the suite in Chrome and create an HTML report.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: process.env.CI ? 1 : 2,
  timeout: 30_000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    // Page Objects use these settings for navigation and authentication.
    baseURL,
    testIdAttribute: 'ko-id',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  // Each test gets a fresh browser context through Playwright.
  projects: [{ name: 'chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' } }],
});
