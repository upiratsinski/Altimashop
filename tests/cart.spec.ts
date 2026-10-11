import { test } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { CartPage } from './pages/CartPage';
import { shopData } from './data/shopData';
import { prepareShopAccess } from './support/shopAccess';

let home: HomePage;
let cart: CartPage;

// Start every test with one mouse in a fresh cart.
test.beforeEach(async ({ page, baseURL }) => {
  await prepareShopAccess(page, baseURL);
  home = new HomePage(page);
  cart = new CartPage(page);
  await home.open();
  await home.addMouse();
  await cart.open();
});

// Check the added item in both the catalogue and cart.
test('5. Adding a mouse shows one item and the correct total', async () => {
  await home.checkMouseQuantity(shopData.mouse.catalogueQuantity);
  await cart.checkMouse(shopData.mouse.name, shopData.mouse.quantity, shopData.mouse.total);
});

// Increasing and decreasing quantity must recalculate the total.
test('6. Changing cart quantity recalculates the total', async () => {
  await cart.increaseMouseQuantity();
  await cart.checkMouse(shopData.mouse.name, shopData.twoMice.quantity, shopData.twoMice.total);
  await cart.decreaseMouseQuantity();
  await cart.checkMouse(shopData.mouse.name, shopData.mouse.quantity, shopData.mouse.total);
});

// Removing the last item must also remove the checkout button.
test('7. Removing the last mouse empties the cart', async () => {
  await cart.decreaseMouseQuantity();
  await cart.checkEmpty();
});
