/**
 * Email Controller
 *
 * sendOrderEmailsHandler  — fires when an order is placed (demo or real)
 *   → Customer: Shopify-style order confirmation with full order details
 *   → Admin: Identical email (ditto copy) with same template
 *
 * sendContactEmailHandler — fires on contact/warranty form submissions
 * sendAbandonmentEmailHandler — fires on checkout abandonment
 * sendNewsletterEmailHandler — fires on newsletter signups
 */

const { sendMail } = require('../config/nodemailer');
const { buildOrderEmailHtml } = require('../templates/orderEmail');

// ── Helpers ───────────────────────────────────────────────────────────────────
const getFrom = () =>
  process.env.SMTP_FROM ||
  `"Procolored Store" <${process.env.SMTP_USER || 'support@procollored.com'}>`;

const getAdminTo = () =>
  process.env.NOTIFY_EMAIL ||
  process.env.ADMIN_EMAIL ||
  'Support@procollored.com';

// ─────────────────────────────────────────────────────────────────────────────
// ORDER EMAILS — called after every successful order (real or demo)
// ─────────────────────────────────────────────────────────────────────────────
const sendOrderEmailsHandler = async (orderData) => {
  const {
    customerEmail,
    customerName,
    orderNumber,
    items = [],
    subtotal = 0,
    totalAmount = 0,
    currency = 'USD',
    paymentMethod = 'Stripe',
    shippingAddress = {},
    billingAddress = {},
    customerCountry,
    customerCity,
    isDemoOrder = false,
  } = orderData;

  const FROM = getFrom();
  const ADMIN = getAdminTo();
  const results = { customerSent: false, adminSent: false, errors: [] };

  console.log(`[Email] Processing order emails for ${orderNumber} — customer: ${customerEmail}, admin: ${ADMIN}`);

  // Build the shared Shopify-style template data
  const templateData = {
    orderNumber,
    customerName: customerName || 'Valued Customer',
    customerEmail: customerEmail || '',
    items,
    subtotal: subtotal || totalAmount,
    totalAmount,
    currency,
    paymentMethod: isDemoOrder ? 'Demo / Test Order' : paymentMethod,
    shippingAddress,
    billingAddress: billingAddress && Object.keys(billingAddress).length > 0
      ? billingAddress
      : shippingAddress, // fall back to shipping if billing not provided
  };

  // Build HTML once — same for both customer and admin
  let html;
  try {
    html = buildOrderEmailHtml(templateData);
  } catch (tplErr) {
    console.error('[Email] Template build error:', tplErr.message);
    html = `<div style="font-family:sans-serif;padding:32px;">
      <h2>Order ${orderNumber} Confirmed</h2>
      <p>Hi ${customerName}, thank you for your order!</p>
      <p>Questions? <a href="mailto:support@procollored.com">support@procollored.com</a></p>
    </div>`;
  }

  const subjectCustomer = isDemoOrder
    ? `[Demo] Order ${orderNumber} confirmed — Procolored`
    : `Order ${orderNumber} confirmed — Procolored`;

  const subjectAdmin = isDemoOrder
    ? `🧪 Demo Order ${orderNumber} — ${customerEmail || 'no email'}`
    : `🔔 New Order ${orderNumber} — ${customerName} — $${parseFloat(totalAmount).toFixed(2)}`;

  // ── 1. Customer email ──────────────────────────────────────────────────────
  if (customerEmail) {
    const resp = await sendMail({ from: FROM, to: customerEmail, subject: subjectCustomer, html });
    if (resp.success) results.customerSent = true;
    else results.errors.push(`Customer email: ${resp.error}`);
  } else {
    console.warn('[Email] No customer email address — skipping customer email.');
  }

  // ── 2. Admin email (identical template) ───────────────────────────────────
  const adminResp = await sendMail({ from: FROM, to: ADMIN, subject: subjectAdmin, html });
  if (adminResp.success) results.adminSent = true;
  else results.errors.push(`Admin email: ${adminResp.error}`);

  console.log(`[Email] Results — customer: ${results.customerSent}, admin: ${results.adminSent}`, results.errors);
  return { success: results.customerSent || results.adminSent, ...results };
};



// ─────────────────────────────────────────────────────────────────────────────
// CONTACT / WARRANTY FORM
// ─────────────────────────────────────────────────────────────────────────────
const sendContactEmailHandler = async (req, res) => {
  try {
    const { firstName, lastName, email, message, country, productLink } = req.body;
    if (!firstName || !email || !message) {
      return res.status(400).json({ error: 'First name, email, and message are required.' });
    }

    const FROM = getFrom();
    const resp = await sendMail({
      from: FROM,
      to: getAdminTo(),
      replyTo: email,
      subject: `📩 Contact Form: ${firstName} ${lastName || ''}`.trim(),
      html: `
        <div style="font-family:sans-serif;max-width:580px;margin:32px auto;padding:32px;background:#fff;border-radius:12px;border:1px solid #eee;">
          <h2 style="color:#E8302A;">New Contact Form Submission</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;font-weight:700;width:120px;">Name:</td><td>${firstName} ${lastName || ''}</td></tr>
            <tr><td style="padding:8px 0;font-weight:700;">Email:</td><td><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px 0;font-weight:700;">Country:</td><td>${country || 'N/A'}</td></tr>
            ${productLink ? `<tr><td style="padding:8px 0;font-weight:700;">Product:</td><td><a href="${productLink}">${productLink}</a></td></tr>` : ''}
          </table>
          <hr style="margin:20px 0;border:none;border-top:1px solid #eee;"/>
          <div style="font-size:15px;color:#333;line-height:1.7;">${message.replace(/\n/g, '<br/>')}</div>
        </div>
      `,
    });

    if (resp.success) return res.status(200).json({ message: 'Message sent successfully.' });
    return res.status(500).json({ error: 'Could not send your message. Please try again.' });
  } catch (err) {
    console.error('[Email] sendContactEmailHandler error:', err.message);
    return res.status(500).json({ error: 'An unexpected error occurred.' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// CHECKOUT ABANDONMENT (fire-and-forget)
// ─────────────────────────────────────────────────────────────────────────────
const sendAbandonmentEmailHandler = async (abandonData) => {
  const { customerEmail, customerName, cartItems = [], cartTotal, stepAbandoned } = abandonData;
  try {
    const FROM = getFrom();
    await sendMail({
      from: FROM,
      to: getAdminTo(),
      subject: `⚠️ Abandoned Cart — $${parseFloat(cartTotal || 0).toFixed(2)} — ${customerName || customerEmail || 'Anonymous'} [${stepAbandoned || 'checkout'}]`,
      html: `
        <div style="font-family:sans-serif;max-width:540px;margin:32px auto;padding:32px;background:#fff;border-radius:12px;border:1px solid #eee;">
          <h2 style="color:#E8302A;margin-top:0;">⚠️ Abandoned Checkout</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:6px 0;font-weight:700;width:140px;">Customer:</td><td>${customerName || 'Unknown'}</td></tr>
            <tr><td style="padding:6px 0;font-weight:700;">Email:</td><td>${customerEmail || 'No email'}</td></tr>
            <tr><td style="padding:6px 0;font-weight:700;">Cart Total:</td><td><strong>$${parseFloat(cartTotal || 0).toFixed(2)}</strong></td></tr>
            <tr><td style="padding:6px 0;font-weight:700;">Step:</td><td>${stepAbandoned || 'unknown'}</td></tr>
            <tr><td style="padding:6px 0;font-weight:700;">Items:</td><td>${cartItems.length} item(s)</td></tr>
          </table>
          ${cartItems.length > 0 ? `
            <hr style="margin:16px 0;border:none;border-top:1px solid #eee;"/>
            <ul style="margin:0;padding-left:20px;color:#333;font-size:14px;">
              ${cartItems.map(i => `<li>${i.name} ×${i.quantity || 1}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      `,
    });
  } catch (err) {
    console.error('[Email] sendAbandonmentEmailHandler error:', err.message);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// NEWSLETTER (fire-and-forget)
// ─────────────────────────────────────────────────────────────────────────────
const sendNewsletterEmailHandler = async (newsData) => {
  if (!newsData || !newsData.subscriberEmail) return;
  try {
    const FROM = getFrom();
    await sendMail({
      from: FROM,
      to: getAdminTo(),
      subject: `📧 New Newsletter Subscriber: ${newsData.subscriberEmail}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:32px auto;padding:32px;background:#fff;border-radius:12px;border:1px solid #eee;">
          <h2 style="color:#E8302A;margin-top:0;">📧 New Subscriber</h2>
          <p><strong>Email:</strong> ${newsData.subscriberEmail}</p>
          <p style="font-size:12px;color:#888;">Source: Newsletter popup</p>
        </div>
      `,
    });
  } catch (err) {
    console.error('[Email] sendNewsletterEmailHandler error:', err.message);
  }
};

module.exports = {
  sendOrderEmailsHandler,
  sendContactEmailHandler,
  sendAbandonmentEmailHandler,
  sendNewsletterEmailHandler,
};
