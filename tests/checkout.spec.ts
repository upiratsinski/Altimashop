import { test } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { checkoutData } from './data/checkoutData';
import { prepareShopAccess } from './support/shopAccess';

let home: HomePage;
let cart: CartPage;
let checkout: CheckoutPage;

// Open checkout through the cart and fill valid customer details.
test.beforeEach(async ({ page, baseURL }) => {
  await prepareShopAccess(page, baseURL);
  home = new HomePage(page);
  cart = new CartPage(page);
  checkout = new CheckoutPage(page);
  await home.open();
  await home.addMouse();
  await cart.open();
  await cart.goToCheckout();
  await checkout.checkOpen();
  await checkout.fillCustomer(checkoutData.customer);
  await checkout.selectMethods(checkoutData.pickup, checkoutData.payment);
});

// Submit a valid demo order and verify confirmation and the empty cart.
test('8. Valid checkout confirms the order and clears the cart', async () => {
  await checkout.checkTotal(checkoutData.total);
  await checkout.placeOrder();
  await checkout.checkConfirmation(checkoutData.confirmation, checkoutData.thankYou, checkoutData.address, checkoutData.total);
  await home.open();
  await cart.open();
  await cart.checkEmpty();
});

// Invalid email must show an error and prevent payment.
test('9. Invalid email blocks checkout', async () => {
  await checkout.setEmail(checkoutData.invalidEmail);
  await checkout.checkEmailError(checkoutData.emailError);
});

// Letters are not a valid Czech phone number.
test('10. Invalid phone number blocks checkout', async () => {
  await checkout.setPhone(checkoutData.invalidPhone);
  await checkout.checkPhoneError(checkoutData.phoneError);
});

// Known application bug: City is marked required but Pay stays enabled.
test('11. Empty required city blocks checkout', async () => {
  await checkout.setCity(checkoutData.emptyCity);
  await checkout.checkPaymentBlocked();
});

// Free delivery must remove the previously charged home delivery fee.
test('12. FREESHIP8 removes the home delivery charge', async () => {
  await checkout.selectMethods(checkoutData.homeDelivery, checkoutData.payment);
  await checkout.checkDeliveryFee(checkoutData.deliveryFee);
  await checkout.checkTotal(checkoutData.totalWithDelivery);
  await checkout.applyOffer(checkoutData.freeShippingCode);
  await checkout.checkFreeDelivery(checkoutData.freeShippingMessage, checkoutData.total);
});
