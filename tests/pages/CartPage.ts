import { expect, Page } from '@playwright/test';

// Cart selectors, separate from the catalogue and checkout selectors.
export const cartSelectors = {
  open: '.cart-widget',
  badge: '.cart-count',
  title: '[ko-id="cart-panel"] h2',
  mouseName: '[ko-id="cart-item-name-2"]',
  total: '[ko-id="cart-total"]',
  increaseMouse: '[ko-id="cart-increment-button-2"]',
  decreaseMouse: '[ko-id="cart-decrement-button-2"]',
  checkout: '[ko-id="checkout-button"]',
};

// Cart actions and checks.
export class CartPage {
  page: Page;

  // Save the browser page supplied by Playwright.
  constructor(page: Page) {
    this.page = page;
  }

  // Open the cart panel.
  async open() {
    await this.page.locator(cartSelectors.open).click();
    await expect(this.page.locator(cartSelectors.title)).toHaveText('Your Cart');
  }

  // Check the item name, item count and total.
  async checkMouse(name: string, quantity: string, total: string) {
    await expect(this.page.locator(cartSelectors.mouseName)).toContainText(name);
    await expect(this.page.locator(cartSelectors.badge)).toHaveText(quantity);
    await expect(this.page.locator(cartSelectors.total)).toContainText(total);
  }

  // Add one more mouse using the cart control.
  async increaseMouseQuantity() {
    await this.page.locator(cartSelectors.increaseMouse).click();
  }

  // Reduce the quantity; reducing one to zero removes the mouse.
  async decreaseMouseQuantity() {
    await this.page.locator(cartSelectors.decreaseMouse).click();
  }

  // An empty cart has no item, badge or checkout button.
  async checkEmpty() {
    await expect(this.page.locator(cartSelectors.mouseName)).toHaveCount(0);
    await expect(this.page.locator(cartSelectors.badge)).toHaveCount(0);
    await expect(this.page.locator(cartSelectors.checkout)).toHaveCount(0);
  }

  // Continue from the cart to checkout.
  async goToCheckout() {
    await this.page.locator(cartSelectors.checkout).click();
    await expect(this.page).toHaveURL(new URL('/checkout', this.page.url()).href);
  }
}
