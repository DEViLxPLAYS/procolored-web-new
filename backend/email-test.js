/**
 * DIRECT EMAIL TEST — run with: node backend/email-test.js
 * 
 * Tests EXACTLY the emails the order system sends:
 *  1. Customer "thank you for ordering" email
 *  2. Admin new order notification
 */

require('dotenv').config({ path: __dirname + '/.env' });
const nodemailer = require('nodemailer');

// ─── Config ──────────────────────────────────────────────────────────────────
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.hostinger.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465', 10);
const SMTP_USER = process.env.SMTP_USER || 'support@procollored.com';
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || `"Procolored Store" <${SMTP_USER}>`;
const ADMIN_EMAIL = process.env.NOTIFY_EMAIL || process.env.ADMIN_EMAIL || SMTP_USER;

// Test recipient — defaults to arfa1054@gmail.com for testing
const TEST_CUSTOMER_EMAIL = process.argv[2] || 'arfa1054@gmail.com';

console.log('\n📧 Procolored Email Direct Test');
console.log('================================');
console.log(`SMTP:     ${SMTP_HOST}:${SMTP_PORT} (${SMTP_PORT === 465 ? 'SSL' : 'TLS'})`);
console.log(`From:     ${SMTP_FROM}`);
console.log(`Admin:    ${ADMIN_EMAIL}`);
console.log(`Customer: ${TEST_CUSTOMER_EMAIL}`);
console.log('================================\n');

if (!SMTP_PASS) {
  console.error('❌ SMTP_PASS is not set in .env — cannot send email.');
  process.exit(1);
}

// ─── Transporter ─────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
  tls: { rejectUnauthorized: false },
  debug: true,
  logger: true
});

// ─── Customer Email (simple "thank you" as requested) ────────────────────────
const customerEmail = {
  from: SMTP_FROM,
  to: TEST_CUSTOMER_EMAIL,
  subject: `Thank you for your order at Procolored! 🎉`,
  html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:580px;margin:32px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background:#1a1a1a;padding:32px;text-align:center;">
      <img src="https://i.postimg.cc/SKh71Rmm/logo.webp" alt="Procolored" style="height:44px;width:auto;"/>
    </div>
    
    <!-- Body -->
    <div style="padding:40px 32px;">
      <h1 style="font-size:24px;font-weight:700;color:#1a1a1a;margin:0 0 12px;">
        Thank you for ordering! 🎉
      </h1>
      <p style="font-size:15px;color:#555555;line-height:1.7;margin:0 0 24px;">
        We've received your order and it's being processed. 
        Our team will get in touch with you shortly with shipping details.
      </p>
      
      <!-- Info box -->
      <div style="background:#f8f8f8;border-radius:8px;padding:20px 24px;margin-bottom:24px;border-left:4px solid #E8302A;">
        <p style="font-size:14px;color:#666666;margin:0 0 8px;"><strong style="color:#1a1a1a;">Order Number:</strong> PRO-TEST-${Date.now()}</p>
        <p style="font-size:14px;color:#666666;margin:0 0 8px;"><strong style="color:#1a1a1a;">Estimated Delivery:</strong> 1–2 weeks after payment confirmation</p>
        <p style="font-size:14px;color:#666666;margin:0;"><strong style="color:#1a1a1a;">Support:</strong> <a href="mailto:support@procollored.com" style="color:#E8302A;">support@procollored.com</a></p>
      </div>
      
      <!-- Delivery note -->
      <div style="background:#f0fdf4;border-radius:8px;padding:16px 20px;margin-bottom:32px;">
        <p style="font-size:14px;color:#166534;margin:0;">
          🚚 <strong>Shipping will be delivered in 14–17 business days</strong> after payment is confirmed.
        </p>
      </div>
      
      <a href="https://procollored.com" style="display:inline-block;background:#E8302A;color:white;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:15px;font-weight:700;">
        Continue Shopping →
      </a>
    </div>
    
    <!-- Footer -->
    <div style="background:#1a1a1a;padding:24px 32px;text-align:center;">
      <p style="font-size:12px;color:#888888;margin:0;">
        © ${new Date().getFullYear()} Procolored — Global No.1 Desktop DTF Printer Brand<br/>
        <a href="mailto:support@procollored.com" style="color:#666666;">support@procollored.com</a>
      </p>
    </div>
  </div>
</body>
</html>
  `
};

// ─── Admin Email ──────────────────────────────────────────────────────────────
const adminEmail = {
  from: SMTP_FROM,
  to: ADMIN_EMAIL,
  subject: `🔔 TEST — New Order Received — ${TEST_CUSTOMER_EMAIL}`,
  html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background:#1a1a1a;padding:28px;text-align:center;">
      <img src="https://i.postimg.cc/SKh71Rmm/logo.webp" alt="Procolored" style="height:36px;width:auto;margin-bottom:12px;"/>
      <br/>
      <span style="background:#22c55e;color:white;font-size:12px;font-weight:700;padding:5px 14px;border-radius:20px;letter-spacing:1px;">🔔 NEW ORDER</span>
    </div>
    
    <!-- Alert -->
    <div style="background:#f0fdf4;padding:20px 32px;border-bottom:1px solid #bbf7d0;text-align:center;">
      <div style="font-size:22px;font-weight:800;color:#166534;">✅ New Order Received!</div>
      <div style="font-size:14px;color:#166534;margin-top:4px;">TEST Email — ${new Date().toLocaleString()}</div>
    </div>
    
    <!-- Content -->
    <div style="padding:32px;">
      <table width="100%" style="border-collapse:collapse;margin-bottom:24px;">
        <tr><td style="padding:8px 0;font-size:14px;color:#555;width:140px;"><strong>Customer:</strong></td><td style="font-size:14px;color:#1a1a1a;">Test Customer</td></tr>
        <tr><td style="padding:8px 0;font-size:14px;color:#555;"><strong>Email:</strong></td><td style="font-size:14px;"><a href="mailto:${TEST_CUSTOMER_EMAIL}" style="color:#E8302A;">${TEST_CUSTOMER_EMAIL}</a></td></tr>
        <tr><td style="padding:8px 0;font-size:14px;color:#555;"><strong>Order #:</strong></td><td style="font-size:14px;color:#E8302A;font-weight:700;">PRO-TEST-${Date.now()}</td></tr>
        <tr><td style="padding:8px 0;font-size:14px;color:#555;"><strong>Total:</strong></td><td style="font-size:18px;font-weight:800;color:#1a1a1a;">$0.00 USD (Test)</td></tr>
        <tr><td style="padding:8px 0;font-size:14px;color:#555;"><strong>Payment:</strong></td><td style="font-size:14px;color:#22c55e;font-weight:700;">Demo / Test</td></tr>
      </table>
      
      <a href="https://procolored-us.com/AdminDashboard" style="display:inline-block;background:#E8302A;color:white;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:15px;font-weight:700;">
        View in Admin Dashboard →
      </a>
    </div>
    
    <!-- Footer -->
    <div style="background:#1a1a1a;padding:20px 32px;text-align:center;">
      <p style="font-size:11px;color:#666666;margin:0;">Internal admin notification — Procolored Order System</p>
    </div>
  </div>
</body>
</html>
  `
};

// ─── Send both emails ─────────────────────────────────────────────────────────
async function run() {
  console.log('🔌 Connecting to SMTP server...');
  
  try {
    await transporter.verify();
    console.log('✅ SMTP connection verified!\n');
  } catch (err) {
    console.error('❌ SMTP connection FAILED:', err.message);
    console.error('\nCheck your .env credentials and make sure:');
    console.error('  - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS are all correct');
    console.error('  - Port 465 uses SSL (secure:true), port 587 uses TLS');
    process.exit(1);
  }

  // Send customer email
  console.log(`📤 Sending customer email to: ${TEST_CUSTOMER_EMAIL}`);
  try {
    const info = await transporter.sendMail(customerEmail);
    console.log(`✅ Customer email SENT! MessageID: ${info.messageId}`);
  } catch (err) {
    console.error(`❌ Customer email FAILED: ${err.message}`);
  }

  // Send admin email
  console.log(`\n📤 Sending admin email to: ${ADMIN_EMAIL}`);
  try {
    const info = await transporter.sendMail(adminEmail);
    console.log(`✅ Admin email SENT! MessageID: ${info.messageId}`);
  } catch (err) {
    console.error(`❌ Admin email FAILED: ${err.message}`);
  }

  console.log('\n✅ Done! Check both inboxes.');
  console.log(`   Customer: ${TEST_CUSTOMER_EMAIL}`);
  console.log(`   Admin:    ${ADMIN_EMAIL}\n`);
}

run().catch(console.error);
