#!/usr/bin/env node
/**
 * Procolored Backend Health & Config Test
 * Run: node backend/test-config.js
 * 
 * Tests:
 *   1. Supabase connection (read orders table)
 *   2. SMTP / Email (sends test email to admin)
 *   3. Stripe configuration
 *   4. Environment variables completeness
 */

require('dotenv').config({ path: __dirname + '/.env' });
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

const COLORS = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

const pass = (msg) => console.log(`  ${COLORS.green}✅ PASS${COLORS.reset} ${msg}`);
const fail = (msg) => console.log(`  ${COLORS.red}❌ FAIL${COLORS.reset} ${msg}`);
const warn = (msg) => console.log(`  ${COLORS.yellow}⚠️  WARN${COLORS.reset} ${msg}`);
const info = (msg) => console.log(`  ${COLORS.blue}ℹ️  INFO${COLORS.reset} ${msg}`);
const section = (title) => console.log(`\n${COLORS.bold}─── ${title} ${'─'.repeat(50 - title.length)}${COLORS.reset}`);

async function main() {
  console.log(`\n${COLORS.bold}${COLORS.blue}Procolored Backend Config & Health Test${COLORS.reset}`);
  console.log(`Time: ${new Date().toISOString()}\n`);
  let allPassed = true;

  // ── 1. Environment Variables ────────────────────────────────────────────────
  section('Environment Variables');

  const required = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'SMTP_HOST',
    'SMTP_USER',
    'SMTP_PASS',
    'NOTIFY_EMAIL',
    'STRIPE_SECRET_KEY',
    'STRIPE_PUBLISHABLE_KEY',
  ];

  for (const key of required) {
    const val = process.env[key];
    if (!val || val === 'add_when_ready') {
      fail(`${key} is missing or placeholder`);
      allPassed = false;
    } else {
      const preview = key.includes('KEY') || key.includes('PASS') || key.includes('SECRET')
        ? val.substring(0, 8) + '...' 
        : val;
      pass(`${key} = ${preview}`);
    }
  }

  // Optional but recommended
  const optional = ['ADMIN_EMAIL', 'SMTP_FROM', 'SMTP_PORT', 'PAYPAL_CLIENT_ID'];
  for (const key of optional) {
    if (!process.env[key]) warn(`${key} not set (optional)`);
    else info(`${key} = ${process.env[key]}`);
  }

  // ── 2. Supabase Connection ──────────────────────────────────────────────────
  section('Supabase Connection');

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Test orders table
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('id, order_number, customer_email, status, created_at')
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) throw new Error(error.message);
    pass(`orders table accessible — ${data.length} recent records`);
    if (data.length > 0) {
      data.forEach(o => {
        info(`  Order: ${o.order_number} | ${o.customer_email} | ${o.status}`);
      });
    }
  } catch (err) {
    fail(`orders table: ${err.message}`);
    allPassed = false;
  }

  // Test checkout_abandonments table
  try {
    const { count, error } = await supabase
      .from('checkout_abandonments')
      .select('*', { count: 'exact', head: true });
    if (error) throw new Error(error.message);
    pass(`checkout_abandonments table accessible — ${count} records`);
  } catch (err) {
    warn(`checkout_abandonments table: ${err.message} (run the SQL migration if missing)`);
  }

  // ── 3. SMTP / Email ─────────────────────────────────────────────────────────
  section('SMTP Email System');

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = process.env.SMTP_USER;
  const pass_smtp = process.env.SMTP_PASS;
  const adminEmail = process.env.NOTIFY_EMAIL || process.env.ADMIN_EMAIL;

  if (!host || !user || !pass_smtp) {
    fail('SMTP credentials missing — emails will NOT send');
    allPassed = false;
  } else {
    info(`Host: ${host}:${port} (${port === 465 ? 'SSL' : 'TLS'})`);
    info(`From: ${user}`);
    info(`Admin recipient: ${adminEmail}`);

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass: pass_smtp },
      tls: { rejectUnauthorized: false },
    });

    // Verify SMTP connection
    try {
      await transporter.verify();
      pass('SMTP server connection verified ✓');
    } catch (err) {
      fail(`SMTP verify failed: ${err.message}`);
      allPassed = false;
    }

    // Send a real test email
    const FROM_LABEL = process.env.SMTP_FROM || `"Procolored Store" <${user}>`;
    try {
      const result = await transporter.sendMail({
        from: FROM_LABEL,
        to: adminEmail,
        subject: `🧪 Procolored Email System Test — ${new Date().toLocaleString()}`,
        html: `
          <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:32px;background:#fff;border-radius:12px;border:1px solid #eee;">
            <div style="text-align:center;margin-bottom:24px;">
              <img src="https://i.postimg.cc/Y9M7TqxR/logo.webp" style="height:40px;" alt="Procolored"/>
            </div>
            <h2 style="color:#E8302A;text-align:center;">✅ Email System Working!</h2>
            <p style="color:#444;text-align:center;font-size:15px;">
              This is a test email from the Procolored backend.<br/>
              If you received this, your SMTP configuration is correct.
            </p>
            <div style="background:#f8f8f8;border-radius:8px;padding:16px;margin:20px 0;">
              <div style="font-size:13px;color:#666;line-height:1.8;">
                <strong>SMTP Host:</strong> ${host}:${port}<br/>
                <strong>From:</strong> ${user}<br/>
                <strong>Time:</strong> ${new Date().toISOString()}<br/>
                <strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}
              </div>
            </div>
            <p style="font-size:12px;color:#999;text-align:center;margin-top:24px;">
              Procolored Order System — Config Test
            </p>
          </div>
        `,
      });
      pass(`Test email SENT → ${adminEmail} (MessageID: ${result.messageId})`);
    } catch (err) {
      fail(`Test email failed to send: ${err.message}`);
      allPassed = false;
    }
  }

  // ── 4. Stripe ───────────────────────────────────────────────────────────────
  section('Stripe Configuration');

  const sk = process.env.STRIPE_SECRET_KEY;
  const pk = process.env.STRIPE_PUBLISHABLE_KEY;

  if (!sk || sk === 'add_when_ready') {
    fail('STRIPE_SECRET_KEY not set');
    allPassed = false;
  } else if (sk.startsWith('sk_live_')) {
    pass(`STRIPE_SECRET_KEY: LIVE mode (${sk.substring(0, 12)}...)`);
  } else if (sk.startsWith('sk_test_')) {
    warn(`STRIPE_SECRET_KEY: TEST mode (safe for development only)`);
  } else {
    fail('STRIPE_SECRET_KEY format is unexpected');
    allPassed = false;
  }

  if (!pk || pk === 'add_when_ready') {
    fail('STRIPE_PUBLISHABLE_KEY not set');
    allPassed = false;
  } else if (pk.startsWith('pk_live_')) {
    pass(`STRIPE_PUBLISHABLE_KEY: LIVE mode (${pk.substring(0, 12)}...)`);
  } else if (pk.startsWith('pk_test_')) {
    warn(`STRIPE_PUBLISHABLE_KEY: TEST mode`);
  }

  // Test Stripe API connection
  try {
    const Stripe = require('stripe');
    const stripe = new Stripe(sk, { apiVersion: '2023-10-16' });
    const balance = await stripe.balance.retrieve();
    pass(`Stripe API connected — Available: ${balance.available.map(b => `${(b.amount/100).toFixed(2)} ${b.currency.toUpperCase()}`).join(', ')}`);
  } catch (err) {
    fail(`Stripe API call failed: ${err.message}`);
    allPassed = false;
  }

  // ── Summary ─────────────────────────────────────────────────────────────────
  section('Summary');
  if (allPassed) {
    console.log(`\n  ${COLORS.green}${COLORS.bold}🎉 All critical checks passed! System is ready.${COLORS.reset}\n`);
  } else {
    console.log(`\n  ${COLORS.red}${COLORS.bold}⚠️  Some checks failed. Review the output above.${COLORS.reset}\n`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
