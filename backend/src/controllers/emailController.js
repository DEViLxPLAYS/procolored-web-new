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
    const { firstName, lastName, email, message, country, productLink, orderNumber, rating, formType } = req.body;
    if (!firstName || !email || !message) {
      return res.status(400).json({ error: 'First name, email, and message are required.' });
    }

    // Friendly label for the form type
    const formLabel = formType || 'General Inquiry';

    const FROM = getFrom();
    const resp = await sendMail({
      from: FROM,
      to: getAdminTo(),
      replyTo: email,
      subject: `📩 [${formLabel}] Contact Form: ${firstName} ${lastName || ''}`.trim(),
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:32px auto;padding:0;background:#fff;border-radius:12px;border:1px solid #eee;overflow:hidden;">
          <!-- Header -->
          <div style="background:#E8302A;padding:20px 32px;display:flex;align-items:center;gap:12px;">
            <img src="https://i.postimg.cc/SKh71Rmm/logo.webp" alt="Procolored" style="height:36px;object-fit:contain;vertical-align:middle;" />
            <h2 style="color:#fff;margin:0;font-size:18px;font-weight:700;">New ${formLabel} Submission</h2>
          </div>

          <!-- Source badge -->
          <div style="background:#FEF3C7;border-left:4px solid #F59E0B;padding:12px 32px;font-size:13px;font-weight:600;color:#92400E;">
            📋 Form Source: <strong>${formLabel}</strong>
          </div>

          <!-- Details table -->
          <div style="padding:24px 32px;">
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr><td style="padding:8px 0;font-weight:700;width:160px;color:#555;">Name:</td><td style="color:#1a1a1a;">${firstName} ${lastName || ''}</td></tr>
              <tr><td style="padding:8px 0;font-weight:700;color:#555;">Email:</td><td><a href="mailto:${email}" style="color:#0066cc;">${email}</a></td></tr>
              <tr><td style="padding:8px 0;font-weight:700;color:#555;">Country:</td><td style="color:#1a1a1a;">${country || 'N/A'}</td></tr>
              ${productLink ? `<tr><td style="padding:8px 0;font-weight:700;color:#555;">Product Interested In:</td><td style="color:#1a1a1a;">${productLink}</td></tr>` : ''}
              ${orderNumber ? `<tr><td style="padding:8px 0;font-weight:700;color:#555;">Order Number:</td><td style="color:#1a1a1a;font-weight:700;">${orderNumber}</td></tr>` : ''}
              ${rating ? `<tr><td style="padding:8px 0;font-weight:700;color:#555;">Rating Given:</td><td style="color:#1a1a1a;">${'⭐'.repeat(parseInt(rating))} (${rating}/5)</td></tr>` : ''}
            </table>
            <hr style="margin:20px 0;border:none;border-top:1px solid #eee;"/>
            <div style="font-size:15px;color:#333;line-height:1.7;white-space:pre-wrap;">${message.replace(/\n/g, '<br/>')}</div>
          </div>

          <div style="padding:16px 32px;background:#f9f9f9;font-size:12px;color:#999;text-align:center;">
            Submitted via procolored-us.com — ${formLabel} Form
          </div>
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
