/**
 * Test Order Email Script
 * Fires a real Panda order through the backend email system without PayPal payment.
 * Sends order confirmation to BOTH the customer email AND admin email.
 * 
 * Usage: node test-order-email.js [customerEmail]
 * Example: node test-order-email.js customer@example.com
 */

require('dotenv').config();

const { sendOrderEmailsHandler } = require('./src/controllers/emailController');

const customerEmail = process.argv[2] || 'theemadkhan123@gmail.com'; // Pass email as argument or set default

const testOrderData = {
  orderNumber: `PRO-TEST-${Date.now().toString(36).toUpperCase()}`,
  customerName: 'Test Customer',
  customerEmail,
  customerPhone: '+1-555-0100',
  items: [
    {
      id: 'f8-panda-dtf-printer',
      name: 'F8 Panda DTF Printer',
      price: 1499.00,
      quantity: 1,
      image: 'https://i.postimg.cc/fTQtLtrH/procolored-logo-4k-transparent1.png'
    }
  ],
  subtotal: 1499.00,
  shippingCost: 0,
  discountAmount: 0,
  discountCode: null,
  totalAmount: 1499.00,
  currency: 'USD',
  paymentMethod: 'PayPal',
  paymentStatus: 'paid',
  shippingAddress: {
    street: '123 Test Street',
    apartment: 'Apt 4B',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'United States'
  },
  billingAddress: {
    street: '123 Test Street',
    apartment: 'Apt 4B',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'United States'
  },
  customerCountry: 'United States',
  customerCity: 'New York',
  isDemoOrder: false
};

const ADMIN_EMAIL = process.env.NOTIFY_EMAIL || process.env.ADMIN_EMAIL || 'Support@procollored.com';

console.log('\n========================================');
console.log('   PROCOLORED — Test Order Email');
console.log('========================================');
console.log(`Order #      : ${testOrderData.orderNumber}`);
console.log(`Product      : F8 Panda DTF Printer`);
console.log(`Total        : $${testOrderData.totalAmount.toFixed(2)} USD`);
console.log(`Payment      : PayPal`);
console.log(`Customer     : ${testOrderData.customerName} <${customerEmail}>`);
console.log(`Admin        : ${ADMIN_EMAIL}`);
console.log('----------------------------------------');
console.log('Sending emails...\n');

sendOrderEmailsHandler(testOrderData)
  .then((result) => {
    console.log('\n========================================');
    if (result.customerSent) {
      console.log(`✅ Customer email sent → ${customerEmail}`);
    } else {
      console.log(`❌ Customer email FAILED → ${customerEmail}`);
    }
    if (result.adminSent) {
      console.log(`✅ Admin email sent    → ${ADMIN_EMAIL}`);
    } else {
      console.log(`❌ Admin email FAILED  → ${ADMIN_EMAIL}`);
    }
    if (result.errors && result.errors.length > 0) {
      console.log('\nErrors:');
      result.errors.forEach(e => console.log(' ⚠', e));
    }
    console.log('========================================\n');
    process.exit(result.customerSent || result.adminSent ? 0 : 1);
  })
  .catch((err) => {
    console.error('❌ Fatal error:', err.message);
    process.exit(1);
  });
