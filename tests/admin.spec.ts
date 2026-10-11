import { test } from '@playwright/test';
import { AdminPage } from './pages/AdminPage';
import { HomePage } from './pages/HomePage';
import { adminData } from './data/adminData';
import { prepareShopAccess } from './support/shopAccess';

let admin: AdminPage;
let home: HomePage;

// Every test starts with the default products in its own browser context.
test.beforeEach(async ({ page, baseURL }) => {
  await prepareShopAccess(page, baseURL);
  admin = new AdminPage(page);
  home = new HomePage(page);
  await admin.open();
});

// Create and delete a product; check both admin and shop after each action.
test('13. Added and deleted products are reflected in admin and shop', async () => {
  await admin.addProduct(adminData.product);
  await admin.checkProduct(adminData.product.name, adminData.createdPrice, adminData.product.stock);
  await home.open();
  await home.checkProductVisible(adminData.product.name);
  await admin.open();
  await admin.removeProduct(adminData.product.name);
  await admin.checkProductRemoved(adminData.product.name);
  await home.open();
  await home.checkProductRemoved(adminData.product.name);
});

// Known application bug: the saved price is increased by 10.
test('14. Editing a product saves exactly the entered price', async () => {
  await admin.addProduct(adminData.product);
  await admin.updatePrice(adminData.product.name, adminData.updatedPrice);
  await admin.checkPrice(adminData.product.name, adminData.savedPrice);
});

// Check download completion, file name and XLSX container signature.
test('15. Admin exports a non-empty products.xlsx file', async () => {
  await admin.downloadProducts(adminData.fileName);
});
