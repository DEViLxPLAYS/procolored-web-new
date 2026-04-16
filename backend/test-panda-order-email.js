/**
 * Test Panda Doll order email using REAL templates (new logo + FREE taxes)
 * Tries port 465, then 587, then using STARTTLS
 * Run: node backend/test-panda-order-email.js
 */

require('dotenv').config({ path: __dirname + '/.env' });
const nodemailer = require('nodemailer');
const { buildOrderEmailHtml } = require('./src/templates/orderEmail');
const { newOrderAdmin } = require('./src/templates/newOrderAdmin');
const { orderConfirmationCustomer } = require('./src/templates/orderConfirmationCustomer');

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.hostinger.com';
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || `"Procolored Store" <${SMTP_USER}>`;
const ADMIN_EMAIL = process.env.NOTIFY_EMAIL || process.env.ADMIN_EMAIL || SMTP_USER;
const CUSTOMER_EMAIL = 'arfa1054@gmail.com';

const ORDER_NUMBER = 'PRO-TESTPANDA-' + Date.now().toString().slice(-6);

console.log('\n📧 Panda Order Email Test (Real Templates)');
console.log('==========================================');
console.log(`From:     ${SMTP_FROM}`);
console.log(`Customer: ${CUSTOMER_EMAIL}`);
console.log(`Admin:    ${ADMIN_EMAIL}`);
console.log(`Order #:  ${ORDER_NUMBER}`);
console.log('==========================================\n');

// ─── Fake Panda Doll order data ──────────────────────────────────────
const orderData = {
  orderNumber: ORDER_NUMBER,
  customerName: 'Arfa Test',
  customerEmail: CUSTOMER_EMAIL,
  customerPhone: null,
  items: [
    {
      name: 'Procolored Panda Doll — Procolored Panda Doll',
      price: 1.00,
      quantity: 1,
      image: 'https://procolored-us.com/images/panda-doll.png',
    }
  ],
  subtotal: 1.00,
  shippingCost: 0,
  discountAmount: 0,
  discountCode: null,
  totalAmount: 1.00,
  currency: 'USD',
  paymentMethod: 'PayPal',
  shippingAddress: {
    street: '123 Test Street',
    apartment: 'Apt 4B',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'United States',
  },
  billingAddress: {
    street: '123 Test Street',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'United States',
  },
  customerCountry: 'United States',
  customerCity: 'New York',
  customerIp: '0.0.0.0',
  isDemoOrder: false,
  createdAt: new Date().toISOString(),
};

// ─── Try multiple port configs ──────────────────────────────────────
async function createTransporter() {
  const configs = [
    { port: 465, secure: true,  label: 'SSL 465' },
    { port: 587, secure: false, label: 'TLS 587' },
    { port: 25,  secure: false, label: 'Plain 25' },
  ];

  for (const cfg of configs) {
    console.log(`🔌 Trying ${SMTP_HOST}:${cfg.port} (${cfg.label})...`);
    const t = nodemailer.createTransport({
      host: SMTP_HOST,
      port: cfg.port,
      secure: cfg.secure,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 8000,
      socketTimeout: 8000,
    });
    try {
      await t.verify();
      console.log(`✅ Connected on port ${cfg.port}!\n`);
      return t;
    } catch (e) {
      console.log(`   ❌ ${e.message}`);
    }
  }
  return null;
}

async function run() {
  const transporter = await createTransporter();

  if (!transporter) {
    console.error('\n❌ All SMTP ports failed.');
    console.error('The backend server on your VPS can reach SMTP but your local machine cannot.');
    console.error('\n👉 Copy backend/test-panda-order-email.js to your VPS and run it there:');
    console.error('   ssh root@<your-vps-ip>');
    console.error('   cd /var/www/procolored/backend');
    console.error('   node test-panda-order-email.js\n');
    process.exit(1);
  }

  // 1) Shopify-style customer order email
  console.log(`📤 Sending order summary → ${CUSTOMER_EMAIL}`);
  try {
    await transporter.sendMail({
      from: SMTP_FROM,
      to: CUSTOMER_EMAIL,
      subject: `Your Procolored order #${ORDER_NUMBER} is confirmed! 🎉`,
      html: buildOrderEmailHtml(orderData),
    });
    console.log('✅ Order summary email SENT!\n');
  } catch (err) {
    console.error('❌ Failed:', err.message, '\n');
  }

  // 2) Customer thank-you confirmation email
  console.log(`📤 Sending thank-you email → ${CUSTOMER_EMAIL}`);
  try {
    await transporter.sendMail({
      from: SMTP_FROM,
      to: CUSTOMER_EMAIL,
      subject: `Thank you for your Procolored order! 🎉`,
      html: orderConfirmationCustomer({ customerName: 'Arfa Test', orderNumber: ORDER_NUMBER, isDemoOrder: false }),
    });
    console.log('✅ Thank-you email SENT!\n');
  } catch (err) {
    console.error('❌ Failed:', err.message, '\n');
  }

  // 3) Admin notification
  console.log(`📤 Sending admin notification → ${ADMIN_EMAIL}`);
  try {
    await transporter.sendMail({
      from: SMTP_FROM,
      to: ADMIN_EMAIL,
      subject: `🔔 New Order — ${ORDER_NUMBER} — Arfa Test ($1.00 USD)`,
      html: newOrderAdmin({ ...orderData, orderNumber: ORDER_NUMBER }),
    });
    console.log('✅ Admin email SENT!\n');
  } catch (err) {
    console.error('❌ Failed:', err.message, '\n');
  }

  console.log('=== ALL DONE ===');
  console.log(`📬 Customer (${CUSTOMER_EMAIL}) — check inbox`);
  console.log(`📬 Admin    (${ADMIN_EMAIL}) — check inbox`);
  console.log('\nNew logo + FREE taxes should appear in both.\n');
}

run().catch(console.error);
