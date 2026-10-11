// Expected values for a fresh shop. No credentials are stored here.
export const shopData = {
  title: 'Demo Shop',
  productCount: 15,
  priceSort: 'price-asc',

  // Expected Accessories products.
  accessories: [
    'Wireless Mouse',
    'Gaming Keyboard RGB',
    'Wireless Charger Pad',
  ],

  // Complete expected price order, from low to high.
  ascendingPrices: [
    '20.00,-',
    '25.00,-',
    '30.00,-',
    '40.00,-',
    '50.00,-',
    '60.00,-',
    '80.00,-',
    '90.00,-',
    '90.00,-',
    '120.00,-',
    '130.00,-',
    '150.00,-',
    '300.00,-',
    '500.00,-',
    '700.00,-',
  ],

  // Expected state with one mouse.
  mouse: {
    name: 'Wireless Mouse',
    path: '/product/2',
    catalogueQuantity: 'In cart: 1',
    quantity: '1',
    total: '30.00',
  },

  // Expected state after increasing to two mice.
  twoMice: {
    quantity: '2',
    total: '60.00',
  },
};
