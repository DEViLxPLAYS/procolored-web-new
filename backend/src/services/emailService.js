const nodemailer = require('nodemailer');

// ─── Transport (configured via env vars) ───────────────────────────────────
// Supports Gmail, Outlook/Office365, cPanel/Hosting (SMTP), or any SMTP provider.
// See .env.example for all variables needed.
let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '465');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn('[Email] SMTP not configured — emails will not be sent. Set SMTP_HOST, SMTP_USER, SMTP_PASS in .env');
    return null;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for 587
    auth: { user, pass },
    tls: { rejectUnauthorized: false }
  });

  return transporter;
}

const FROM = process.env.SMTP_FROM || `"Procolored" <${process.env.SMTP_USER}>`;
const NOTIFY_TO = process.env.NOTIFY_EMAIL || 'Support@procollored.com';

// ─── Helpers ────────────────────────────────────────────────────────────────
async function sendMail(options) {
  const t = getTransporter();
  if (!t) return; // silent skip if not configured
  try {
    await t.sendMail({ from: FROM, ...options });
  } catch (err) {
    console.error('[Email] Failed to send:', err.message);
  }
}

// ─── 1. New Order Placed ────────────────────────────────────────────────────
async function sendNewOrderEmail({ orderNumber, customerName, customerEmail, items, totalAmount, currency, shippingAddress }) {
  const itemsHtml = (items || []).map(i =>
    `<tr>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0">${i.name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center">${i.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right">$${parseFloat(i.price || 0).toFixed(2)}</td>
    </tr>`
  ).join('');

  const addr = shippingAddress || {};
  const addrStr = [addr.address, addr.apartment, addr.city, addr.state, addr.postal, addr.country].filter(Boolean).join(', ');

  const html = `
  <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
    <div style="background:#E85A24;padding:24px 32px">
      <h1 style="color:#fff;margin:0;font-size:22px">🛒 New Order Received</h1>
    </div>
    <div style="padding:32px">
      <p style="color:#374151;margin:0 0 16px">A new order has been placed on Procolored.</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        <tr><td style="padding:6px 0;color:#6b7280;width:40%">Order Number</td><td style="padding:6px 0;font-weight:700;color:#111">${orderNumber}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280">Customer</td><td style="padding:6px 0;font-weight:600;color:#111">${customerName}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280">Email</td><td style="padding:6px 0;color:#111">${customerEmail}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280">Ship To</td><td style="padding:6px 0;color:#111">${addrStr}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280">Total</td><td style="padding:6px 0;font-weight:700;color:#E85A24;font-size:18px">$${parseFloat(totalAmount || 0).toFixed(2)} ${currency || 'USD'}</td></tr>
      </table>
      <h3 style="margin:0 0 12px;color:#111;font-size:15px">Order Items</h3>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <thead><tr style="background:#fafafa">
          <th style="padding:8px 12px;text-align:left;color:#6b7280;font-weight:600">Product</th>
          <th style="padding:8px 12px;text-align:center;color:#6b7280;font-weight:600">Qty</th>
          <th style="padding:8px 12px;text-align:right;color:#6b7280;font-weight:600">Price</th>
        </tr></thead>
        <tbody>${itemsHtml}</tbody>
      </table>
    </div>
    <div style="background:#fafafa;padding:16px 32px;text-align:center;color:#9ca3af;font-size:12px">
      Procolored Admin Notification — Do not reply to this email
    </div>
  </div>`;

  await sendMail({
    to: NOTIFY_TO,
    subject: `🛒 New Order #${orderNumber} — $${parseFloat(totalAmount || 0).toFixed(2)} from ${customerName}`,
    html
  });
}

// ─── 2. Checkout Abandonment ─────────────────────────────────────────────────
async function sendAbandonmentEmail({ customerEmail, customerName, cartItems, cartTotal, stepAbandoned }) {
  if (!customerEmail) return; // no email = nothing to send

  const itemsHtml = (cartItems || []).map(i =>
    `<li style="margin-bottom:6px;color:#374151">${i.name} × ${i.quantity} — $${parseFloat(i.price || 0).toFixed(2)}</li>`
  ).join('');

  const stepLabel = {
    paypal_cancelled: 'Cancelled PayPal payment',
    paypal_error: 'PayPal error during payment',
    paypal_capture_failed: 'PayPal payment failed to capture',
    left_page: 'Closed or left checkout page',
    navigated_away: 'Navigated away from checkout',
    idle_10min: 'Inactive for 10+ minutes on checkout'
  }[stepAbandoned] || stepAbandoned;

  const html = `
  <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
    <div style="background:#f59e0b;padding:24px 32px">
      <h1 style="color:#fff;margin:0;font-size:22px">⚠️ Checkout Abandoned</h1>
    </div>
    <div style="padding:32px">
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        <tr><td style="padding:6px 0;color:#6b7280;width:40%">Customer</td><td style="padding:6px 0;font-weight:600;color:#111">${customerName || 'Unknown'}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280">Email</td><td style="padding:6px 0;color:#111">${customerEmail}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280">Cart Value</td><td style="padding:6px 0;font-weight:700;color:#E85A24">$${parseFloat(cartTotal || 0).toFixed(2)} USD</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280">Abandoned At</td><td style="padding:6px 0;color:#111">${stepLabel}</td></tr>
      </table>
      <h3 style="margin:0 0 12px;color:#111;font-size:15px">Items in Cart</h3>
      <ul style="padding-left:20px;margin:0">${itemsHtml || '<li style="color:#9ca3af">No item data</li>'}</ul>
    </div>
    <div style="background:#fafafa;padding:16px 32px;text-align:center;color:#9ca3af;font-size:12px">
      Procolored Admin Notification — Do not reply to this email
    </div>
  </div>`;

  await sendMail({
    to: NOTIFY_TO,
    subject: `⚠️ Abandoned Checkout — $${parseFloat(cartTotal || 0).toFixed(2)} — ${customerName || customerEmail}`,
    html
  });
}

// ─── 3. Newsletter Subscription ──────────────────────────────────────────────
async function sendNewsletterNotificationEmail({ subscriberEmail, country, discountCode }) {
  const html = `
  <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
    <div style="background:#6366f1;padding:24px 32px">
      <h1 style="color:#fff;margin:0;font-size:22px">📧 New Newsletter Subscriber</h1>
    </div>
    <div style="padding:32px">
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:6px 0;color:#6b7280;width:40%">Email</td><td style="padding:6px 0;font-weight:600;color:#111">${subscriberEmail}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280">Country</td><td style="padding:6px 0;color:#111">${country || 'Unknown'}</td></tr>
        ${discountCode ? `<tr><td style="padding:6px 0;color:#6b7280">Discount Code</td><td style="padding:6px 0;font-family:monospace;color:#6366f1;font-weight:700">${discountCode}</td></tr>` : ''}
      </table>
    </div>
    <div style="background:#fafafa;padding:16px 32px;text-align:center;color:#9ca3af;font-size:12px">
      Procolored Admin Notification — Do not reply to this email
    </div>
  </div>`;

  await sendMail({
    to: NOTIFY_TO,
    subject: `📧 New Subscriber: ${subscriberEmail}`,
    html
  });
}

module.exports = { sendNewOrderEmail, sendAbandonmentEmail, sendNewsletterNotificationEmail };
