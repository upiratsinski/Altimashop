import { expect, Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { Product } from '../data/adminData';

// Admin page, product card and form selectors.
export const adminSelectors = {
  title: '[ko-id="admin-title"]',
  add: '[ko-id="add-product-button"]',
  cards: '.product-card',
  priceOnCard: '[ko-id^="product-info-price-"]',
  stockOnCard: '[ko-id^="product-info-stock-"]',
  edit: '[ko-id^="edit-button-"]',
  remove: '[ko-id^="remove-button-"]',
  name: '[ko-id="name-input"]',
  category: '[ko-id="category-select"]',
  price: '[ko-id="price-input"]',
  stock: '[ko-id="stock-input"]',
  image: '[ko-id="imageUrl-select"]',
  description: '[ko-id="description-textarea"]',
  save: '[ko-id="save-button"]',
  export: '[ko-id="export-button"]',
};

// Admin actions and checks.
export class AdminPage {
  page: Page;

  // Save the browser page supplied by Playwright.
  constructor(page: Page) {
    this.page = page;
  }

  // Open the admin panel.
  async open() {
    await this.page.goto('/admin', { waitUntil: 'domcontentloaded' });
    await expect(this.page.locator(adminSelectors.title)).toHaveText('Admin Panel');
  }

  // Add a product through the visible form.
  async addProduct(product: Product) {
    await this.page.locator(adminSelectors.add).click();
    await this.page.locator(adminSelectors.name).fill(product.name);
    await this.page.locator(adminSelectors.category).selectOption({ label: product.category });
    await this.page.locator(adminSelectors.price).fill(product.price);
    await this.page.locator(adminSelectors.stock).fill(product.stock);
    await this.page.locator(adminSelectors.image).selectOption({ label: product.image });
    await this.page.locator(adminSelectors.description).fill(product.description);
    await this.page.locator(adminSelectors.save).click();
  }

  // Check the created product, including price and stock.
  async checkProduct(name: string, price: string, stock: string) {
    const card = this.page.locator(adminSelectors.cards).filter({ hasText: name });
    await expect(card).toBeVisible();
    await expect(card.locator(adminSelectors.priceOnCard)).toContainText(price);
    await expect(card.locator(adminSelectors.stockOnCard)).toHaveText('Stock: ' + stock);
  }

  // Accept the deletion dialog for this product only.
  async removeProduct(name: string) {
    const card = this.page.locator(adminSelectors.cards).filter({ hasText: name });
    this.page.once('dialog', dialog => dialog.accept());
    await card.locator(adminSelectors.remove).click();
  }

  // Check that the product disappeared from the admin list.
  async checkProductRemoved(name: string) {
    await expect(this.page.locator(adminSelectors.cards).filter({ hasText: name })).toHaveCount(0);
  }

  // Edit only the product price.
  async updatePrice(name: string, price: string) {
    const card = this.page.locator(adminSelectors.cards).filter({ hasText: name });
    await card.locator(adminSelectors.edit).click();
    await this.page.locator(adminSelectors.price).fill(price);
    await this.page.locator(adminSelectors.save).click();
  }

  // The saved price must match the entered price, without an extra surcharge.
  async checkPrice(name: string, price: string) {
    const card = this.page.locator(adminSelectors.cards).filter({ hasText: name });
    await expect(card.locator(adminSelectors.priceOnCard)).toContainText(price);
  }

  // Export and verify the download name and non-empty XLSX ZIP container.
  async downloadProducts(fileName: string) {
    const downloadReady = this.page.waitForEvent('download');
    await this.page.locator(adminSelectors.export).click();
    const download = await downloadReady;
    expect(download.suggestedFilename()).toBe(fileName);
    expect(await download.failure()).toBeNull();
    const filePath = await download.path();
    if (!filePath) throw new Error('The exported file was not saved.');
    const file = await readFile(filePath);
    expect(file.length).toBeGreaterThan(100);
    expect(file.subarray(0, 4).toString('hex')).toBe('504b0304');
  }
}
