// Beautiful, mobile-responsive HTML templates for Procolored Emails
// Primary Brand Color: #E85A24

const headerStyles = `
  background-color: #E85A24;
  padding: 24px 32px;
  text-align: center;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
`;

const bodyStyles = `
  background-color: #ffffff;
  padding: 32px;
  border-left: 1px solid #e5e7eb;
  border-right: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
`;

const containerStyles = `
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  color: #374151;
  background-color: #f9fafb;
  padding: 20px;
`;

/**
 * 1. Customer Order Receipt
 */
const customerOrderReceiptTemplate = (orderData) => {
  const { orderNumber, customerName, items, totalAmount, currency, shippingAddress } = orderData;
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const itemsHtml = (items || []).map(i => `
    <tr>
      <td style="padding: 12px 8px; border-bottom: 1px solid #f3f4f6;">
        <span style="font-weight: 500; color: #111827;">${i.name}</span>
      </td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #f3f4f6; text-align: center;">${i.quantity}</td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #f3f4f6; text-align: right; color: #111827;">
        $${parseFloat(i.price || 0).toFixed(2)}
      </td>
    </tr>
  `).join('');

  const addr = shippingAddress || {};
  const addrStr = [addr.address, addr.apartment, addr.city, addr.state, addr.postal, addr.country].filter(Boolean).join(', ');

  return `
    <div style="${containerStyles}">
      <div style="${headerStyles}">
        <!-- Replace this div with an <img> tag pointing to an S3 url to show the actual logo -->
        <h2 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: 1px;">PROCOLORED</h2>
      </div>
      <div style="${bodyStyles}">
        <h1 style="color: #111827; font-size: 22px; margin-top: 0; margin-bottom: 16px;">Thank you for your order!</h1>
        <p style="margin-bottom: 24px;">Hi ${customerName},</p>
        <p style="margin-bottom: 32px;">We're getting your order ready to be shipped. We will notify you when it has been sent.</p>
        
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 32px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding-bottom: 8px; color: #6b7280; width: 40%;">Order Number:</td>
              <td style="padding-bottom: 8px; font-weight: 700; color: #111827; text-align: right;">${orderNumber}</td>
            </tr>
            <tr>
              <td style="color: #6b7280;">Order Date:</td>
              <td style="color: #111827; text-align: right;">${dateStr}</td>
            </tr>
          </table>
        </div>

        <h3 style="color: #111827; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; margin-bottom: 16px;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
          <thead>
            <tr>
              <th style="padding: 8px; text-align: left; color: #6b7280; border-bottom: 2px solid #e5e7eb;">Item</th>
              <th style="padding: 8px; text-align: center; color: #6b7280; border-bottom: 2px solid #e5e7eb;">Qty</th>
              <th style="padding: 8px; text-align: right; color: #6b7280; border-bottom: 2px solid #e5e7eb;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 16px 8px 8px 8px; text-align: right; font-weight: 500; color: #6b7280;">Total:</td>
              <td style="padding: 16px 8px 8px 8px; text-align: right; font-weight: 700; color: #E85A24; font-size: 18px;">
                $${parseFloat(totalAmount || 0).toFixed(2)} ${currency || 'USD'}
              </td>
            </tr>
          </tfoot>
        </table>

        <h3 style="color: #111827; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; margin-bottom: 16px;">Shipping Details</h3>
        <p style="font-size: 14px; line-height: 1.5; color: #4b5563;">${addrStr}</p>
        
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 32px 0;">
        <p style="font-size: 13px; color: #9ca3af; text-align: center; margin: 0;">If you have any questions, reply to this email or contact us at Support@procollored.com</p>
      </div>
    </div>
  `;
};

/**
 * 2. Admin New Order Alert
 */
const adminNewOrderAlertTemplate = (orderData) => {
  const { orderNumber, customerName, customerEmail, totalAmount, currency, items } = orderData;
  const itemCount = (items || []).reduce((sum, item) => sum + (item.quantity || 1), 0);

  return `
    <div style="${containerStyles}">
      <div style="${headerStyles}; background-color: #111827;">
        <h2 style="color: #ffffff; margin: 0; font-size: 22px;">🚨 New Order Received</h2>
      </div>
      <div style="${bodyStyles}">
        <p style="font-size: 16px; font-weight: 600; color: #111827; margin-top: 0;">A new order needs fulfillment.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 24px; font-size: 14px;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; width: 35%;">Order ID:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: 700; color: #E85A24;">${orderNumber}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Value:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: 700;">$${parseFloat(totalAmount || 0).toFixed(2)} ${currency || 'USD'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Customer:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600;">${customerName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Email:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
              <a href="mailto:${customerEmail}" style="color: #3b82f6;">${customerEmail}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Total Items:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">${itemCount} units</td>
          </tr>
        </table>
        
        <div style="margin-top: 32px; text-align: center;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin" style="display: inline-block; background-color: #E85A24; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 14px;">View in Admin Dashboard</a>
        </div>
      </div>
    </div>
  `;
};

/**
 * 3. Warranty / Contact Form Alert
 */
const warrantyContactFormTemplate = (contactData) => {
  const { firstName, lastName, country, email, productLink, message } = contactData;
  const fullName = [firstName, lastName].filter(Boolean).join(' ');

  return `
    <div style="${containerStyles}">
      <div style="${headerStyles}; background-color: #4b5563;">
        <h2 style="color: #ffffff; margin: 0; font-size: 22px;">📩 New Warranty/Contact Submission</h2>
      </div>
      <div style="${bodyStyles}">
        <p style="margin-top: 0; color: #111827;">You received a new message from the website contact/warranty form.</p>
        
        <div style="background-color: #f9fafb; border-left: 4px solid #E85A24; padding: 16px; margin: 24px 0; border-radius: 0 4px 4px 0;">
          <h4 style="margin: 0 0 12px 0; color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Message Content</h4>
          <p style="margin: 0; color: #111827; font-size: 15px; white-space: pre-wrap; font-style: italic;">"${message}"</p>
        </div>

        <h3 style="color: #111827; font-size: 16px; margin-bottom: 12px;">Sender Details</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; width: 30%;">Name:</td>
            <td style="padding: 8px 0; font-weight: 600; color: #111827;">${fullName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Email:</td>
            <td style="padding: 8px 0;">
              <a href="mailto:${email}" style="color: #3b82f6;">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Country:</td>
            <td style="padding: 8px 0; color: #111827;">${country || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">Product/Link:</td>
            <td style="padding: 8px 0; color: #111827;">
              ${productLink ? `<a href="${productLink}" style="color: #E85A24;" target="_blank">${productLink}</a>` : 'Not provided'}
            </td>
          </tr>
        </table>
        
        <p style="font-size: 13px; color: #9ca3af; text-align: center; margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
          You can reply directly to this email to reach the customer.
        </p>
      </div>
    </div>
  `;
};

/**
 * 4. Checkout Abandonment
 */
const abandonedCheckoutTemplate = (abandonData) => {
  const { customerEmail, customerName, cartItems, cartTotal, stepAbandoned } = abandonData;
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

  return `
    <div style="${containerStyles}">
      <div style="${headerStyles}; background-color: #f59e0b;">
        <h2 style="color: #ffffff; margin: 0; font-size: 22px;">⚠️ Checkout Abandoned</h2>
      </div>
      <div style="${bodyStyles}">
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:14px;">
          <tr><td style="padding:6px 0;color:#6b7280;width:35%">Customer:</td><td style="padding:6px 0;font-weight:600;color:#111827">${customerName || 'Unknown'}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Email:</td><td style="padding:6px 0;color:#111827">${customerEmail}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Cart Value:</td><td style="padding:6px 0;font-weight:700;color:#E85A24">$${parseFloat(cartTotal || 0).toFixed(2)} USD</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Abandoned At:</td><td style="padding:6px 0;color:#111827">${stepLabel}</td></tr>
        </table>
        <h3 style="margin:0 0 12px;color:#111827;font-size:15px">Items in Cart</h3>
        <ul style="padding-left:20px;margin:0;font-size:14px;">${itemsHtml || '<li style="color:#9ca3af">No item data</li>'}</ul>
      </div>
    </div>
  `;
};

/**
 * 5. Newsletter Subscription
 */
const newsletterTemplate = (newsData) => {
  const { subscriberEmail, country, discountCode } = newsData;

  return `
    <div style="${containerStyles}">
      <div style="${headerStyles}; background-color: #6366f1;">
        <h2 style="color: #ffffff; margin: 0; font-size: 22px;">📧 New Newsletter Subscriber</h2>
      </div>
      <div style="${bodyStyles}">
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:6px 0;color:#6b7280;width:35%">Email:</td><td style="padding:6px 0;font-weight:600;color:#111827">${subscriberEmail}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Country:</td><td style="padding:6px 0;color:#111827">${country || 'Unknown'}</td></tr>
          ${discountCode ? `<tr><td style="padding:6px 0;color:#6b7280">Discount Code:</td><td style="padding:6px 0;font-family:monospace;color:#6366f1;font-weight:700">${discountCode}</td></tr>` : ''}
        </table>
      </div>
    </div>
  `;
};


module.exports = {
  customerOrderReceiptTemplate,
  adminNewOrderAlertTemplate,
  warrantyContactFormTemplate,
  abandonedCheckoutTemplate,
  newsletterTemplate
};
