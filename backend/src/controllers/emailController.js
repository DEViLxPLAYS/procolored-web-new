/**
 * Email Controller
 *
 * sendOrderEmailsHandler  — fires when an order is placed (demo or real)
 *   → Customer: Warm branded "Thank You" confirmation (orderConfirmationCustomer.js)
 *   → Admin:    Detailed order alert with full item breakdown (newOrderAdmin.js)
 *
 * sendContactEmailHandler — fires on contact/warranty form submissions
 * sendAbandonmentEmailHandler — fires on checkout abandonment
 * sendNewsletterEmailHandler — fires on newsletter signups
 */

const { sendMail } = require('../config/nodemailer');
const { orderConfirmationCustomer } = require('../templates/orderConfirmationCustomer');
const { newOrderAdmin } = require('../templates/newOrderAdmin');

// ── Helpers ───────────────────────────────────────────────────────────────────
const getFrom = () =>
  process.env.SMTP_FROM ||
  `"Procolored Store" <${process.env.SMTP_USER || 'support@procolored-us.com'}>`;

const getAdminTo = () =>
  process.env.NOTIFY_EMAIL ||
  process.env.ADMIN_EMAIL ||
  'support@procolored-us.com';

// ─────────────────────────────────────────────────────────────────────────────
// ORDER EMAILS — called after every successful order (real or demo)
// ─────────────────────────────────────────────────────────────────────────────
const sendOrderEmailsHandler = async (orderData) => {
  const {
    customerEmail,
    customerName,
    orderNumber,
    customerPhone,
    items = [],
    subtotal = 0,
    shippingCost = 0,
    discountAmount = 0,
    discountCode = null,
    totalAmount = 0,
    currency = 'USD',
    paymentMethod = 'PayPal',
    shippingAddress = {},
    billingAddress = {},
    customerCountry,
    customerCity,
    customerIp,
    isDemoOrder = false,
    createdAt,
  } = orderData;

  const FROM = getFrom();
  const ADMIN = getAdminTo();
  const results = { customerSent: false, adminSent: false, errors: [] };

  console.log(`[Email] Processing order emails for ${orderNumber} — customer: ${customerEmail}, admin: ${ADMIN}`);

  // ── 1. Customer email — warm branded "Thank You" ───────────────────────────
  if (customerEmail) {
    try {
      const customerHtml = orderConfirmationCustomer({
        customerName: customerName || 'Valued Customer',
        orderNumber,
        isDemoOrder,
      });

      const subjectCustomer = isDemoOrder
        ? `[Demo] Order ${orderNumber} confirmed — Procolored`
        : `Order ${orderNumber} confirmed — Thank you, ${(customerName || '').split(' ')[0] || 'Valued Customer'}!`;

      const resp = await sendMail({ from: FROM, to: customerEmail, subject: subjectCustomer, html: customerHtml });
      if (resp.success) results.customerSent = true;
      else results.errors.push(`Customer email: ${resp.error}`);
    } catch (err) {
      console.error('[Email] Customer template error:', err.message);
      results.errors.push(`Customer template error: ${err.message}`);
    }
  } else {
    console.warn('[Email] No customer email address — skipping customer email.');
  }

  // ── 2. Admin email — detailed new order alert ─────────────────────────────
  try {
    const adminHtml = newOrderAdmin({
      orderNumber,
      customerName: customerName || 'Valued Customer',
      customerEmail: customerEmail || '',
      customerPhone: customerPhone || null,
      items,
      subtotal,
      shippingCost,
      discountAmount,
      discountCode,
      totalAmount,
      currency,
      shippingAddress,
      paymentMethod: isDemoOrder ? 'Demo / Test Order' : paymentMethod,
      customerCountry: customerCountry || null,
      customerCity: customerCity || null,
      customerIp: customerIp || null,
      isDemoOrder,
      createdAt: createdAt || new Date().toISOString(),
    });

    const subjectAdmin = isDemoOrder
      ? `🧪 Demo Order ${orderNumber} — ${customerEmail || 'no email'}`
      : `🔔 New Order Received — ${orderNumber} — ${customerName} — $${parseFloat(totalAmount).toFixed(2)} USD`;

    const adminResp = await sendMail({ from: FROM, to: ADMIN, subject: subjectAdmin, html: adminHtml });
    if (adminResp.success) results.adminSent = true;
    else results.errors.push(`Admin email: ${adminResp.error}`);
  } catch (err) {
    console.error('[Email] Admin template error:', err.message);
    results.errors.push(`Admin template error: ${err.message}`);
  }

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
