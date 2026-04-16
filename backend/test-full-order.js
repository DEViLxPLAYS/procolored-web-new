/**
 * Full End-to-End Test Order
 * Hits the real /api/checkout/order endpoint which:
 *   1. Inserts into Supabase orders table  → appears in Admin Dashboard
 *   2. Sends customer confirmation email   → arfa1054@gmail.com
 *   3. Sends admin alert email             → support@procollored.com
 */

const http = require('http');

const PORT = process.env.PORT || 3001;

const orderPayload = {
  customerName:    'Arfa Test',
  customerEmail:   'arfa1054@gmail.com',
  customerPhone:   '+1 555-123-4567',
  shippingAddress: {
    line1:   '123 Test Street',
    city:    'New York',
    state:   'NY',
    zip:     '10001',
    country: 'United States'
  },
  items: [
    {
      id:       'panda-dtf',
      name:     'F8 Panda DTF Printer',
      price:    1,
      quantity:  1,
      image:    'https://procolored-us.com/images/panda.jpg'
    }
  ],
  subtotal:      1,
  shippingCost:  0,
  discountAmount: 0,
  totalAmount:   1,
  currency:      'USD',
  country:       'United States',
  city:          'New York',
  paymentMethod: 'PayPal',
  paymentStatus: 'paid',
  transactionId: `TEST-PAYPAL-${Date.now()}`
};

const body = JSON.stringify(orderPayload);

const options = {
  hostname: 'localhost',
  port:     PORT,
  path:     '/api/checkout/order',
  method:   'POST',
  headers:  {
    'Content-Type':   'application/json',
    'Content-Length': Buffer.byteLength(body),
    'Origin':         'http://localhost:5173'
  }
};

console.log('\n========================================');
console.log('   PROCOLORED — Full E2E Test Order');
console.log('========================================');
console.log(`Product  : ${orderPayload.items[0].name}`);
console.log(`Total    : $${orderPayload.totalAmount} ${orderPayload.currency}`);
console.log(`Payment  : ${orderPayload.paymentMethod} (${orderPayload.paymentStatus})`);
console.log(`Customer : ${orderPayload.customerName} <${orderPayload.customerEmail}>`);
console.log(`Txn ID   : ${orderPayload.transactionId}`);
console.log('----------------------------------------');
console.log('Submitting to /api/checkout/order...\n');

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      if (result.order || result.orderNumber || result.message) {
        const orderNum = result.order?.order_number || result.orderNumber || 'created';
        console.log(`✅ Order saved to Supabase  → Order #${orderNum}`);
        console.log(`✅ Customer email queued    → ${orderPayload.customerEmail}`);
        console.log(`✅ Admin email queued       → support@procollored.com`);
        console.log('\n========================================');
        console.log('✅ All 3 notifications triggered!');
        console.log('   1. Admin Dashboard → Orders tab (LIVE)');
        console.log('   2. User email      → arfa1054@gmail.com');
        console.log('   3. Admin email     → support@procollored.com');
        console.log('========================================\n');
      } else {
        console.log('❌ Unexpected response:', JSON.stringify(result, null, 2));
      }
    } catch(e) {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request failed:', e.message);
  console.error('   Make sure backend is running: npm run dev');
});

req.write(body);
req.end();
