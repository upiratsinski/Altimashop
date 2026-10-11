// Customer fields used by the checkout Page Object.
export interface Customer {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  zipCode: string;
  email: string;
  country: string;
  phone: string;
}

// Example customer and expected checkout results. No real personal data.
export const checkoutData = {
  customer: {
    firstName: 'John',
    lastName: 'Doe',
    street: 'Baker',
    city: 'London',
    zipCode: '11000',
    email: 'john@example.com',
    country: 'CZ',
    phone: '638778253',
  },
  payment: 'cash',
  pickup: 'branch',
  homeDelivery: 'home',
  invalidEmail: 'john',
  emailError: 'Please enter a valid email.',
  invalidPhone: 'abcdef',
  phoneError: 'Please enter a valid phone number.',
  emptyCity: '',
  freeShippingCode: 'FREESHIP8',
  freeShippingMessage: 'Free Delivery Applied!',
  deliveryFee: '15.00',
  totalWithDelivery: '$ 45.00',
  total: '$ 30.00',
  confirmation: 'Order Confirmed!',
  thankYou: 'Thank you for your order, John Doe!',
  address: 'Baker, London, 11000',
};
