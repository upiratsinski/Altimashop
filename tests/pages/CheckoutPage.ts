import { expect, Page } from '@playwright/test';
import { Customer } from '../data/checkoutData';

// Checkout form, summary and confirmation selectors.
export const checkoutSelectors = {
  title: '[ko-id="checkout-title"]',
  firstName: '[ko-id="firstName-input"]',
  lastName: '[ko-id="lastName-input"]',
  street: '[ko-id="street-input"]',
  city: '[ko-id="city-input"]',
  zipCode: '[ko-id="zipCode-input"]',
  email: '[ko-id="email-input"]',
  country: '[ko-id="countryCode-select"]',
  phone: '[ko-id="phoneNumber-input"]',
  delivery: '[ko-id="deliveryMethod-select"]',
  payment: '[ko-id="paymentMethod-select"]',
  offer: '[ko-id="specialOfferCode-input"]',
  offerMessage: '[ko-id="offer-message"]',
  emailError: '[ko-id="email-invalid-error"]',
  phoneError: '[ko-id="phoneNumber-pattern-error"]',
  deliveryFee: '[ko-id="deliveryFee-value"]',
  total: '[ko-id="total-value"]',
  pay: '[ko-id="pay-button"]',
  confirmation: '[ko-id="order-confirmation-title"]',
  thankYou: '[ko-id="order-confirmation-message"]',
  address: '[ko-id="order-delivery-address"]',
  orderTotal: '[ko-id="order-total-value"]',
};

// Checkout actions and checks.
export class CheckoutPage {
  page: Page;

  // Save the browser page supplied by Playwright.
  constructor(page: Page) {
    this.page = page;
  }

  // Check that navigation from the cart opened checkout.
  async checkOpen() {
    await expect(this.page.locator(checkoutSelectors.title)).toHaveText('Checkout');
  }

  // Fill all required customer fields with the supplied data.
  async fillCustomer(customer: Customer) {
    await this.page.locator(checkoutSelectors.firstName).fill(customer.firstName);
    await this.page.locator(checkoutSelectors.lastName).fill(customer.lastName);
    await this.page.locator(checkoutSelectors.street).fill(customer.street);
    await this.page.locator(checkoutSelectors.city).fill(customer.city);
    await this.page.locator(checkoutSelectors.zipCode).fill(customer.zipCode);
    await this.page.locator(checkoutSelectors.email).fill(customer.email);
    await this.page.locator(checkoutSelectors.country).selectOption(customer.country);
    await this.page.locator(checkoutSelectors.phone).fill(customer.phone);
  }

  // Choose the delivery and payment options.
  async selectMethods(delivery: string, payment: string) {
    await this.page.locator(checkoutSelectors.delivery).selectOption(delivery);
    await this.page.locator(checkoutSelectors.payment).selectOption(payment);
  }

  // Check the final amount before placing the order.
  async checkTotal(total: string) {
    await expect(this.page.locator(checkoutSelectors.total)).toHaveText(total);
  }

  // Submit the demo order.
  async placeOrder() {
    await this.page.locator(checkoutSelectors.pay).click();
  }

  // Check the confirmation, customer address and charged total.
  async checkConfirmation(title: string, message: string, address: string, total: string) {
    await expect(this.page.locator(checkoutSelectors.confirmation)).toHaveText(title);
    await expect(this.page.locator(checkoutSelectors.thankYou)).toHaveText(message);
    await expect(this.page.locator(checkoutSelectors.address)).toHaveText(address);
    await expect(this.page.locator(checkoutSelectors.orderTotal)).toHaveText(total);
  }

  // Change email and leave the field to trigger validation.
  async setEmail(value: string) {
    await this.page.locator(checkoutSelectors.email).fill(value);
    await this.page.locator(checkoutSelectors.email).blur();
  }

  // Check email validation and blocked submission.
  async checkEmailError(message: string) {
    await expect(this.page.locator(checkoutSelectors.emailError)).toHaveText(message);
    await this.checkPaymentBlocked();
  }

  // Change the phone number and trigger validation.
  async setPhone(value: string) {
    await this.page.locator(checkoutSelectors.phone).fill(value);
    await this.page.locator(checkoutSelectors.phone).blur();
  }

  // Check phone validation and blocked submission.
  async checkPhoneError(message: string) {
    await expect(this.page.locator(checkoutSelectors.phoneError)).toHaveText(message);
    await this.checkPaymentBlocked();
  }

  // Clear or replace the required city.
  async setCity(value: string) {
    await this.page.locator(checkoutSelectors.city).fill(value);
    await this.page.locator(checkoutSelectors.city).blur();
  }

  // Invalid required fields must disable Pay.
  async checkPaymentBlocked() {
    await expect(this.page.locator(checkoutSelectors.pay)).toBeDisabled();
  }

  // Enter a discount code.
  async applyOffer(code: string) {
    await this.page.locator(checkoutSelectors.offer).fill(code);
  }

  // Check the original delivery fee before applying free delivery.
  async checkDeliveryFee(fee: string) {
    await expect(this.page.locator(checkoutSelectors.deliveryFee)).toContainText(fee);
  }

  // Check the accepted code and the total without the delivery fee.
  async checkFreeDelivery(message: string, total: string) {
    await expect(this.page.locator(checkoutSelectors.offerMessage)).toHaveText(message);
    await this.checkTotal(total);
  }
}
