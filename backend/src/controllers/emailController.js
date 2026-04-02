const { sendMail } = require('../config/nodemailer');
const { 
  customerOrderReceiptTemplate, 
  adminNewOrderAlertTemplate, 
  warrantyContactFormTemplate,
  abandonedCheckoutTemplate,
  newsletterTemplate
} = require('../services/emailTemplates');

const NOTIFY_TO = process.env.NOTIFY_EMAIL || 'Support@procollored.com';
const FROM_EMAIL = process.env.SMTP_FROM || `"Procolored Store" <${process.env.SMTP_USER}>`;

/**
 * Triggered on successful checkout.
 * Sends receipt to customer AND alert to admin.
 * Returns a Promise resolving to { success: boolean, ... }
 */
const sendOrderEmailsHandler = async (orderData) => {
  const { customerEmail, customerName, orderNumber } = orderData;
  const results = { customerSent: false, adminSent: false, errors: [] };

  try {
    // 1. Send Customer Receipt
    if (customerEmail) {
      const custHtml = customerOrderReceiptTemplate(orderData);
      const custResp = await sendMail({
        from: FROM_EMAIL,
        to: customerEmail,
        subject: `Order Confirmation #${orderNumber} — Procolored`,
        html: custHtml
      });
      if (custResp.success) results.customerSent = true;
      else results.errors.push(`Customer email failed: ${custResp.error}`);
    }

    // 2. Send Admin Alert
    const adminHtml = adminNewOrderAlertTemplate(orderData);
    const adminResp = await sendMail({
      from: FROM_EMAIL,
      to: NOTIFY_TO,
      subject: `🚨 New Order #${orderNumber} from ${customerName}`,
      html: adminHtml
    });
    if (adminResp.success) results.adminSent = true;
    else results.errors.push(`Admin email failed: ${adminResp.error}`);

    return { 
      success: results.customerSent || results.adminSent, 
      ...results 
    };
  } catch (error) {
    console.error('[Email Controller] Error in sendOrderEmailsHandler:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Triggered from the frontend Contact/Warranty form.
 * Designed to be used directly as an Express route handler (req, res).
 */
const sendContactEmailHandler = async (req, res) => {
  try {
    const { firstName, lastName, email, message, country, productLink } = req.body;

    if (!firstName || !email || !message) {
      return res.status(400).json({ error: 'First name, email, and message are required.' });
    }

    const html = warrantyContactFormTemplate({
      firstName, lastName, email, message, country, productLink
    });

    const response = await sendMail({
      from: FROM_EMAIL,
      to: NOTIFY_TO,
      replyTo: email, // This allows the admin to hit "Reply" and email the customer directly
      subject: `📩 New Website Contact from ${firstName} ${lastName || ''}`.trim(),
      html
    });

    if (response.success) {
      return res.status(200).json({ message: 'Message sent successfully.' });
    } else {
      return res.status(500).json({ error: 'Failed to send message via SMTP.' });
    }
  } catch (error) {
    console.error('[Email Controller] Error in sendContactEmailHandler:', error);
    return res.status(500).json({ error: 'An unexpected error occurred.' });
  }
};

/**
 * Triggered on checkout abandonment.
 * Fire-and-forget internal logic.
 */
const sendAbandonmentEmailHandler = async (abandonData) => {
  // Always notify admin — even if no email/name captured yet (card failed, anonymous exit, etc.)
  // We still have cart items + country + device info which is valuable

  try {
    const html = abandonedCheckoutTemplate(abandonData);
    const customerLabel = abandonData.customerName || abandonData.customerEmail || '🕵️ Anonymous Visitor';
    const stepLabel = abandonData.stepAbandoned || 'checkout';
    await sendMail({
      from: FROM_EMAIL,
      to: NOTIFY_TO,
      subject: `⚠️ Abandoned Cart — $${parseFloat(abandonData.cartTotal || 0).toFixed(2)} — ${customerLabel} [${stepLabel}]`,
      html
    });
  } catch (error) {
    console.error('[Email Controller] Error in sendAbandonmentEmailHandler:', error);
  }
};

/**
 * Triggered on newsletter subscription.
 * Fire-and-forget internal logic.
 */
const sendNewsletterEmailHandler = async (newsData) => {
  if (!newsData.subscriberEmail) return;

  try {
    const html = newsletterTemplate(newsData);
    await sendMail({
      from: FROM_EMAIL,
      to: NOTIFY_TO,
      subject: `📧 New Subscriber: ${newsData.subscriberEmail}`,
      html
    });
  } catch (error) {
    console.error('[Email Controller] Error in sendNewsletterEmailHandler:', error);
  }
};

module.exports = {
  sendOrderEmailsHandler,
  sendContactEmailHandler,
  sendAbandonmentEmailHandler,
  sendNewsletterEmailHandler
};
