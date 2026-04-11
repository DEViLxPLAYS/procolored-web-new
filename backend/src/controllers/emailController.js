/**
 * Email Controller
 * 
 * sendOrderEmailsHandler  — fires when an order is placed (demo or real)
 *   → Customer receives: simple "thank you for ordering" email
 *   → Admin receives: detailed order notification
 *
 * sendContactEmailHandler — fires on contact/warranty form submissions
 * sendAbandonmentEmailHandler — fires on checkout abandonment
 * sendNewsletterEmailHandler — fires on newsletter signups
 */

const { sendMail } = require('../config/nodemailer');
const { orderConfirmationCustomer } = require('../templates/orderConfirmationCustomer');

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
    totalAmount = 0,
    currency = 'USD',
    paymentMethod = 'Stripe',
    shippingAddress = {},
    customerCountry,
    customerCity,
    customerIp,
    isDemoOrder = false,
  } = orderData;

  const FROM = getFrom();
  const ADMIN = getAdminTo();
  const results = { customerSent: false, adminSent: false, errors: [] };

  console.log(`[Email] Processing order emails for ${orderNumber} — customer: ${customerEmail}, admin: ${ADMIN}`);

  // ── 1. Customer — simple thank you email ───────────────────────────────────
  if (customerEmail) {
    let html;
    try {
      html = orderConfirmationCustomer({
        customerName: customerName || 'Valued Customer',
        orderNumber,
        isDemoOrder,
      });
    } catch (tplErr) {
      console.error('[Email] Customer template error:', tplErr.message);
      // Fallback: ultra simple plain HTML
      html = `
        <div style="font-family:sans-serif;max-width:500px;margin:32px auto;padding:32px;background:#fff;border-radius:12px;border:1px solid #eee;">
          <h2 style="color:#E8302A;">Thank you for your order at Procolored!</h2>
          <p>Hi ${customerName || 'there'}, we've received your order <strong>${orderNumber}</strong>.</p>
          <p>Our team will contact you shortly with shipping details.</p>
          <p style="color:#666;font-size:13px;">Questions? <a href="mailto:support@procollored.com" style="color:#E8302A;">support@procollored.com</a></p>
        </div>
      `;
    }

    const resp = await sendMail({
      from: FROM,
      to: customerEmail,
      subject: isDemoOrder
        ? `[Demo] You've placed an order on Procolored! 🎉`
        : `You've placed an order on Procolored — Thank you! 🎉`,
      html,
    });

    if (resp.success) results.customerSent = true;
    else results.errors.push(`Customer email: ${resp.error}`);
  } else {
    console.warn('[Email] No customer email address — skipping customer email.');
  }

  // ── 2. Admin — detailed order notification ────────────────────────────────
  const addrParts = [
    shippingAddress.street || shippingAddress.address || '',
    shippingAddress.city || customerCity || '',
    shippingAddress.state || '',
    shippingAddress.postalCode || shippingAddress.postal || '',
    shippingAddress.country || customerCountry || '',
  ].filter(Boolean);
  const fullAddr = addrParts.join(', ') || 'Not provided';

  const itemRows = items.map(i =>
    `<tr>
      <td style="padding:10px 8px;font-size:14px;color:#1a1a1a;border-bottom:1px solid #f0f0f0;">${i.name || 'Item'}</td>
      <td style="padding:10px 8px;font-size:14px;color:#555;border-bottom:1px solid #f0f0f0;text-align:center;">${i.quantity || 1}</td>
      <td style="padding:10px 8px;font-size:14px;font-weight:700;color:#1a1a1a;border-bottom:1px solid #f0f0f0;text-align:right;">
        ${isDemoOrder ? 'FREE' : `$${parseFloat(i.price || 0).toFixed(2)}`}
      </td>
    </tr>`
  ).join('');

  const adminHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f2f2f2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:620px;margin:32px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:#111111;padding:28px;text-align:center;">
      <img src="https://i.postimg.cc/Y9M7TqxR/logo.webp" alt="Procolored" style="height:38px;width:auto;display:block;margin:0 auto 14px;"/>
      <span style="background:${isDemoOrder ? '#f59e0b' : '#22c55e'};color:white;font-size:12px;font-weight:700;padding:5px 14px;border-radius:20px;letter-spacing:1px;">
        ${isDemoOrder ? '🧪 DEMO ORDER' : '🔔 NEW ORDER'}
      </span>
    </div>

    <!-- Alert bar -->
    <div style="background:${isDemoOrder ? '#fffbeb' : '#f0fdf4'};padding:18px 32px;text-align:center;border-bottom:1px solid ${isDemoOrder ? '#fde68a' : '#bbf7d0'};">
      <div style="font-size:20px;font-weight:800;color:${isDemoOrder ? '#92400e' : '#166534'};">
        ${isDemoOrder ? '🧪 Demo Test Order Received' : '✅ New Order Received!'}
      </div>
      <div style="font-size:13px;color:#555555;margin-top:4px;">
        Order <strong>${orderNumber}</strong> &bull; ${new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
      </div>
    </div>

    <!-- Summary boxes -->
    <div style="padding:28px 32px 0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="31%" style="background:#f8f8f8;border-radius:8px;padding:16px;text-align:center;">
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#999;">Order Total</div>
            <div style="font-size:22px;font-weight:800;color:#E8302A;margin-top:4px;">
              ${isDemoOrder ? 'FREE' : `$${parseFloat(totalAmount).toFixed(2)}`}
            </div>
            <div style="font-size:11px;color:#888;">${currency}</div>
          </td>
          <td width="4%"></td>
          <td width="31%" style="background:#f8f8f8;border-radius:8px;padding:16px;text-align:center;">
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#999;">Payment</div>
            <div style="font-size:15px;font-weight:700;color:#22c55e;margin-top:4px;">✓ ${paymentMethod}</div>
          </td>
          <td width="4%"></td>
          <td width="31%" style="background:#f8f8f8;border-radius:8px;padding:16px;text-align:center;">
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#999;">Items</div>
            <div style="font-size:22px;font-weight:800;color:#1a1a1a;margin-top:4px;">${items.length}</div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Customer Info -->
    <div style="padding:24px 32px 0;">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#999;margin-bottom:12px;">Customer Details</div>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f8;border-radius:8px;overflow:hidden;">
        <tr>
          <td style="padding:10px 18px;font-size:12px;font-weight:700;color:#888;text-transform:uppercase;width:100px;">Name</td>
          <td style="padding:10px 18px;font-size:15px;color:#1a1a1a;font-weight:600;">${customerName || 'Unknown'}</td>
        </tr>
        <tr style="border-top:1px solid #eeeeee;">
          <td style="padding:10px 18px;font-size:12px;font-weight:700;color:#888;text-transform:uppercase;">Email</td>
          <td style="padding:10px 18px;"><a href="mailto:${customerEmail}" style="font-size:15px;color:#E8302A;font-weight:600;">${customerEmail || 'N/A'}</a></td>
        </tr>
        <tr style="border-top:1px solid #eeeeee;">
          <td style="padding:10px 18px;font-size:12px;font-weight:700;color:#888;text-transform:uppercase;">Address</td>
          <td style="padding:10px 18px;font-size:14px;color:#1a1a1a;">${fullAddr}</td>
        </tr>
        <tr style="border-top:1px solid #eeeeee;">
          <td style="padding:10px 18px;font-size:12px;font-weight:700;color:#888;text-transform:uppercase;">IP</td>
          <td style="padding:10px 18px;font-size:13px;color:#888;font-family:monospace;">${customerIp || 'Unknown'}</td>
        </tr>
      </table>
    </div>

    <!-- Items -->
    <div style="padding:24px 32px 0;">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#999;margin-bottom:12px;">Items Ordered</div>
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eeeeee;border-radius:8px;overflow:hidden;">
        <thead>
          <tr style="background:#f8f8f8;">
            <th style="padding:10px 8px;font-size:11px;font-weight:700;text-transform:uppercase;color:#888;text-align:left;">Product</th>
            <th style="padding:10px 8px;font-size:11px;font-weight:700;text-transform:uppercase;color:#888;text-align:center;">Qty</th>
            <th style="padding:10px 8px;font-size:11px;font-weight:700;text-transform:uppercase;color:#888;text-align:right;">Price</th>
          </tr>
        </thead>
        <tbody>${itemRows || `<tr><td colspan="3" style="padding:16px;text-align:center;color:#888;">No items</td></tr>`}</tbody>
      </table>
    </div>

    <!-- Action -->
    <div style="padding:28px 32px;text-align:center;">
      <a href="https://procolored-us.com/AdminDashboard"
         style="display:inline-block;background:#E8302A;color:white;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:15px;font-weight:700;">
        Open Admin Dashboard →
      </a>
    </div>

    <!-- Footer -->
    <div style="background:#111111;padding:20px 32px;text-align:center;">
      <p style="font-size:11px;color:#666666;margin:0;">Internal notification — Procolored Order System</p>
    </div>

  </div>
</body>
</html>`;

  const adminResp = await sendMail({
    from: FROM,
    to: ADMIN,
    subject: isDemoOrder
      ? `🧪 Demo Order ${orderNumber} — ${customerEmail || 'no email'}`
      : `🔔 New Order ${orderNumber} — ${customerName} — $${parseFloat(totalAmount).toFixed(2)}`,
    html: adminHtml,
  });

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
