/**
 * Shopify-style order email template.
 * Used for BOTH customer and admin emails (ditto copy as requested).
 *
 * @param {object} order - order data
 * @param {string} order.orderNumber
 * @param {string} order.customerName
 * @param {string} order.customerEmail
 * @param {Array}  order.items
 * @param {number} order.subtotal
 * @param {number} order.totalAmount
 * @param {string} order.paymentMethod
 * @param {object} order.shippingAddress
 * @param {object} order.billingAddress
 */
function buildOrderEmailHtml(order) {
  const {
    orderNumber = 'N/A',
    customerName = 'Customer',
    customerEmail = '',
    items = [],
    subtotal = 0,
    totalAmount = 0,
    paymentMethod = 'PayPal',
    shippingAddress = {},
    billingAddress = {},
  } = order;

  const fmt = (amount) => {
    const val = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
    return `$${val.toFixed(2)}`;
  };

  const fmtAddr = (addr) => {
    if (!addr || typeof addr !== 'object') return 'N/A';
    const parts = [
      addr.name || addr.customerName || '',
      addr.street || addr.line1 || '',
      addr.apartment ? addr.apartment : '',
      [addr.city, addr.state, addr.postalCode].filter(Boolean).join(' '),
      addr.country || '',
    ].filter(Boolean);
    return parts.join('<br/>');
  };

  const itemsHtml = items.map(item => {
    const price = parseFloat(item.price || 0).toFixed(2);
    return `
      <tr>
        <td style="padding:16px 0;border-bottom:1px solid #e5e5e5;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="60" style="vertical-align:top;padding-right:16px;">
                ${item.image
                  ? `<img src="${item.image}" alt="${item.name}" width="60" height="60" style="object-fit:contain;border:1px solid #e5e5e5;border-radius:4px;"/>`
                  : `<div style="width:60px;height:60px;background:#f5f5f5;border:1px solid #e5e5e5;border-radius:4px;"></div>`
                }
              </td>
              <td style="vertical-align:top;">
                <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#1a1a1a;">${item.name}</p>
                <p style="margin:0;font-size:14px;color:#555;">Qty: ${item.quantity || 1}</p>
              </td>
              <td style="vertical-align:top;text-align:right;white-space:nowrap;">
                <p style="margin:0;font-size:14px;font-weight:600;color:#1a1a1a;">$${price}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `;
  }).join('');

  const subDollars = parseFloat(subtotal || 0).toFixed(2);
  const totalDollars = parseFloat(totalAmount || 0).toFixed(2);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Order ${orderNumber} confirmed</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid #e5e5e5;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <img src="https://i.postimg.cc/SKh71Rmm/logo.webp" alt="Procolored" height="36" style="display:block;"/>
                  </td>
                  <td align="right" style="font-size:13px;color:#888;font-weight:500;">
                    ORDER #${orderNumber}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Intro -->
          <tr>
            <td style="padding:32px 40px 24px;">
              <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#1a1a1a;">Thank you for your purchase!</h1>
              <p style="margin:0;font-size:15px;color:#555;line-height:1.6;">
                Hi ${customerName}, we're getting your order ready to be shipped. We will notify you when it has been sent.
              </p>
            </td>
          </tr>

          <!-- Buttons -->
          <tr>
            <td style="padding:0 40px 32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <a href="https://procolored-us.com" style="display:inline-block;background:#1a73e8;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:4px;font-size:14px;font-weight:600;">
                      View your order
                    </a>
                  </td>
                  <td style="padding-left:16px;">
                    <a href="https://procolored-us.com/collections/all" style="font-size:14px;color:#1a73e8;text-decoration:none;">
                      or Visit our store
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Order Summary -->
          <tr>
            <td style="padding:0 40px 8px;">
              <h2 style="margin:0 0 16px;font-size:18px;font-weight:700;color:#1a1a1a;border-top:2px solid #e5e5e5;padding-top:24px;">Order summary</h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${itemsHtml}
              </table>
            </td>
          </tr>

          <!-- Totals -->
          <tr>
            <td style="padding:8px 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#555;">Subtotal</td>
                  <td style="padding:6px 0;font-size:14px;color:#1a1a1a;text-align:right;font-weight:500;">$${subDollars}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#555;">Shipping</td>
                  <td style="padding:6px 0;font-size:14px;color:#22c55e;text-align:right;font-weight:700;">FREE</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#555;">Taxes</td>
                  <td style="padding:6px 0;font-size:14px;color:#22c55e;text-align:right;font-weight:700;">FREE</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding:8px 0;">
                    <div style="border-top:1px solid #e5e5e5;"></div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:16px;font-weight:600;color:#1a1a1a;">Total</td>
                  <td style="padding:8px 0;font-size:20px;font-weight:800;color:#1a1a1a;text-align:right;">$${totalDollars} USD</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Customer Information -->
          <tr>
            <td style="padding:0 40px 32px;border-top:2px solid #e5e5e5;">
              <h2 style="margin:24px 0 20px;font-size:18px;font-weight:700;color:#1a1a1a;">Customer information</h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="vertical-align:top;padding-right:16px;">
                    <p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#1a1a1a;">Shipping address</p>
                    <p style="margin:0;font-size:14px;color:#555;line-height:1.7;">${fmtAddr({ ...shippingAddress, name: customerName })}</p>
                  </td>
                  <td width="50%" style="vertical-align:top;">
                    <p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#1a1a1a;">Billing address</p>
                    <p style="margin:0;font-size:14px;color:#555;line-height:1.7;">${fmtAddr({ ...billingAddress, name: customerName })}</p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
                <tr>
                  <td width="50%" style="vertical-align:top;padding-right:16px;">
                    <p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#1a1a1a;">Payment</p>
                    <p style="margin:0;font-size:14px;color:#555;">${paymentMethod}</p>
                  </td>
                  <td width="50%" style="vertical-align:top;">
                    <p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#1a1a1a;">Shipping method</p>
                    <p style="margin:0;font-size:14px;color:#555;">Standard Shipping (14–17 business days)</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #e5e5e5;text-align:center;">
              <p style="margin:0;font-size:13px;color:#888;line-height:1.6;">
                If you have any questions, reply to this email or contact us at
                <a href="mailto:support@procollored.com" style="color:#1a73e8;text-decoration:none;">support@procollored.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

module.exports = { buildOrderEmailHtml };
