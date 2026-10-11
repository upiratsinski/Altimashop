// Product fields supplied to the admin form.
export interface Product {
  name: string;
  category: string;
  price: string;
  stock: string;
  image: string;
  description: string;
}

// A fresh browser context keeps this test product separate from user data.
export const adminData = {
  product: {
    name: 'QA Test Product',
    category: 'Accessories',
    price: '10',
    stock: '3',
    image: 'Smartphone 1',
    description: 'Product created by a UI test.',
  },
  createdPrice: '$ 10.00',
  updatedPrice: '50',
  savedPrice: '$ 50.00',
  fileName: 'products.xlsx',
};
