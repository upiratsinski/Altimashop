import { Page } from '@playwright/test';

// Keep authentication setup outside the test specification.
export async function prepareShopAccess(page: Page, baseURL: string | undefined) {
  const username = process.env.SHOP_USERNAME;
  const password = process.env.SHOP_PASSWORD;

  // No authentication is needed when credentials are absent.
  if (!username || !password || !baseURL) {
    return;
  }

  // Build the Basic Auth header from environment variables.
  const origin = new URL(baseURL).origin;
  const credentials = username + ':' + password;
  const authorization = 'Basic ' + Buffer.from(credentials).toString('base64');

  // Send credentials only to the shop origin.
  await page.route(origin + '/**', async route => {
    const headers = route.request().headers();
    headers.authorization = authorization;
    await route.continue({ headers: headers });
  });
}
