import { test } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { shopData } from './data/shopData';
import { prepareShopAccess } from './support/shopAccess';

let home: HomePage;

// Authenticate and open a fresh catalogue before every test.
test.beforeEach(async ({ page, baseURL }) => {
  await prepareShopAccess(page, baseURL);
  home = new HomePage(page);
  await home.open();
});

// Check that the home page loads the full catalogue.
test('1. Home page shows the shop title and all products', async () => {
  await home.checkCatalogue(shopData.title, shopData.productCount);
});

// Filter by category, then return to all products.
test('2. Accessories filter shows only accessory products', async () => {
  await home.selectAccessories();
  await home.checkProductNames(shopData.accessories);
  await home.selectAllProducts();
  await home.checkCatalogue(shopData.title, shopData.productCount);
});

// Compare every displayed price with the expected order.
test('3. Price sorting orders all products from low to high', async () => {
  await home.sortProducts(shopData.priceSort);
  await home.checkPrices(shopData.ascendingPrices);
});

// Open product details through the catalogue link.
test('4. Wireless Mouse link opens its matching details', async () => {
  await home.openMouseDetails();
  await home.checkMouseDetails(shopData.mouse.name, shopData.mouse.path);
});
