import { expect, Page } from '@playwright/test';

// Home page selectors. Use homeSelectors.name in the methods below.
export const homeSelectors = {
  title: '.shop-title',
  cards: '.product-card',
  names: '.product-card h3',
  prices: '.product-card .price',
  accessories: '[ko-id="category-item-accessories"]',
  all: '[ko-id="category-item-all"]',
  sort: '[ko-id="sort-select"]',
  mouseCard: '[ko-id="product-card-2"]',
  mouseLink: '[ko-id="product-link-2"]',
  mouseImage: 'img[alt="Wireless Mouse"]',
  headings: 'h1, h2, h3',
  addMouse: '[ko-id="add-to-cart-2"]',
  mouseQuantity: '[ko-id="product-card-2"] [ko-id="cart-quantity-display-2"]',
};

// Catalogue actions and checks.
export class HomePage {
  page: Page;

  // Save the browser page supplied by Playwright.
  constructor(page: Page) {
    this.page = page;
  }

  // Open the catalogue and wait for its products.
  async open() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(this.page.locator(homeSelectors.mouseCard)).toBeVisible();
  }

  // Check the title and number of products.
  async checkCatalogue(title: string, count: number) {
    await expect(this.page.locator(homeSelectors.title)).toHaveText(title);
    await expect(this.page.locator(homeSelectors.cards)).toHaveCount(count);
  }

  // Filter the catalogue to Accessories.
  async selectAccessories() {
    await this.page.locator(homeSelectors.accessories).click();
  }

  // Check every visible product name.
  async checkProductNames(names: string[]) {
    await expect(this.page.locator(homeSelectors.names)).toHaveText(names);
  }

  // Remove the category filter.
  async selectAllProducts() {
    await this.page.locator(homeSelectors.all).click();
  }

  // Select the supplied sorting option.
  async sortProducts(option: string) {
    await this.page.locator(homeSelectors.sort).selectOption(option);
  }

  // Check the complete price order.
  async checkPrices(prices: string[]) {
    await expect(this.page.locator(homeSelectors.prices)).toHaveText(prices);
  }

  // Open Wireless Mouse details.
  async openMouseDetails() {
    await this.page.locator(homeSelectors.mouseLink).click();
  }

  // Check the detail page address, heading and image.
  async checkMouseDetails(name: string, path: string) {
    await expect(this.page).toHaveURL(new URL(path, this.page.url()).href);
    await expect(this.page.locator(homeSelectors.headings).filter({ hasText: name })).toHaveText(name);
    await expect(this.page.locator(homeSelectors.mouseImage)).toBeVisible();
  }

  // Add one mouse from its catalogue card.
  async addMouse() {
    await this.page.locator(homeSelectors.addMouse).click();
  }

  // Check the quantity shown on the catalogue card.
  async checkMouseQuantity(quantity: string) {
    await expect(this.page.locator(homeSelectors.mouseQuantity)).toHaveText(quantity);
  }

  // Check that an admin-created product also appears in the shop.
  async checkProductVisible(name: string) {
    await expect(this.page.locator(homeSelectors.names).filter({ hasText: name })).toBeVisible();
  }

  // Check that a deleted product is absent from the shop.
  async checkProductRemoved(name: string) {
    await expect(this.page.locator(homeSelectors.names).filter({ hasText: name })).toHaveCount(0);
  }
}
