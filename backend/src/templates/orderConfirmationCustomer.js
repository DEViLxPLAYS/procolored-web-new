const orderConfirmationCustomer = ({
  customerName,
  orderNumber,
  items,
  subtotal,
  shippingCost,
  discountAmount,
  discountCode,
  totalAmount,
  currency,
  shippingAddress,
  estimatedDelivery,
  isDemoOrder
}) => {
  const LOGO = 'https://i.postimg.cc/Y9M7TqxR/logo.webp';
  const RED = '#E8302A';
  const DARK = '#1a1a1a';

  const itemsHTML = (items || []).map(item => `
    <tr>
      <td style="padding: 14px 0; border-bottom: 1px solid #f0f0f0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <div style="font-size:15px; font-weight:600; color:${DARK}; margin-bottom:4px;">
                ${item.name}
              </div>
              <div style="font-size:13px; color:#888888;">
                Qty: ${item.quantity || 1}
                ${item.variant ? ` &bull; ${item.variant}` : ''}
              </div>
            </td>
            <td align="right" style="font-size:15px; font-weight:700; 
                color:${DARK}; white-space:nowrap; padding-left:16px;">
              ${currency === 'PKR' ? 'Rs.' : '$'}${
                parseFloat(item.price || 0).toLocaleString()
              }
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('');

  const addressHTML = shippingAddress ? `
    ${shippingAddress.street || shippingAddress.address || ''}<br/>
    ${shippingAddress.city || ''}${shippingAddress.state ? ', ' + shippingAddress.state : ''} 
    ${shippingAddress.postalCode || shippingAddress.postal || ''}<br/>
    ${shippingAddress.country || ''}
  ` : 'Address not provided';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Confirmation — Procolored</title>
</head>
<body style="margin:0; padding:0; background:#f4f4f4; 
             font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,
             Helvetica,Arial,sans-serif;">

  <div style="background:#f4f4f4; padding:40px 20px;">
    <div style="max-width:600px; margin:0 auto; background:#ffffff; 
                border-radius:12px; overflow:hidden; 
                box-shadow:0 4px 24px rgba(0,0,0,0.08);">

      <!-- HEADER -->
      <div style="background:${DARK}; padding:32px 40px; text-align:center;">
        <img src="${LOGO}" alt="Procolored" 
             style="height:48px; width:auto; display:block; margin:0 auto;" />
        <div style="margin-top:16px;">
          <span style="background:${RED}; color:white; font-size:12px; 
                       font-weight:700; padding:5px 14px; border-radius:20px; 
                       text-transform:uppercase; letter-spacing:1px;">
            ${isDemoOrder ? 'Demo Order' : 'Order Confirmed'}
          </span>
        </div>
      </div>

      <!-- BODY -->
      <div style="padding:40px;">

        <!-- Greeting -->
        <h1 style="font-size:26px; font-weight:700; color:${DARK}; 
                   margin-bottom:8px;">
          Thank you, ${customerName}! 🎉
        </h1>
        <p style="font-size:15px; color:#666666; line-height:1.6; margin-bottom:32px;">
          ${isDemoOrder 
            ? 'This is a demo order confirmation. No payment was charged.'
            : `Your order has been confirmed and is being prepared. 
               We'll send you a shipping notification once your order is on its way.`
          }
        </p>

        <!-- Order Number Box -->
        <div style="background:#f8f8f8; border-radius:8px; padding:20px 24px; 
                    margin-bottom:24px; border-left:4px solid ${RED};">
          <div style="font-size:11px; font-weight:700; text-transform:uppercase; 
                      letter-spacing:1px; color:#999999; margin-bottom:6px;">
            Order Number
          </div>
          <div style="font-size:22px; font-weight:700; color:${RED}; 
                      letter-spacing:1px;">
            ${orderNumber}
          </div>
        </div>

        <!-- Delivery Estimate -->
        <div style="background:#f0fdf4; border-radius:8px; padding:16px 20px; 
                    margin-bottom:32px;">
          <span style="font-size:20px; margin-right:12px;">🚚</span>
          <div style="display:inline-block; vertical-align:top; margin-top:2px;">
            <div style="font-size:13px; font-weight:700; color:#166534;">
              Estimated Delivery
            </div>
            <div style="font-size:14px; color:#166534;">
              ${estimatedDelivery || '1-2 weeks after payment confirmation'}
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div style="height:1px; background:#eeeeee; margin-bottom:28px;"></div>

        <!-- Order Items -->
        <div style="font-size:12px; font-weight:700; text-transform:uppercase; 
                    letter-spacing:1px; color:#999999; margin-bottom:16px;">
          Your Items
        </div>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${itemsHTML}
        </table>

        <!-- Order Totals -->
        <div style="margin-top:20px; border-top:1px solid #eeeeee; 
                    padding-top:16px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:6px 0; font-size:14px; color:#555555;">Subtotal</td>
              <td align="right" style="padding:6px 0; font-size:14px; color:#555555;">
                ${currency === 'PKR' ? 'Rs.' : '$'}${parseFloat(subtotal || 0).toLocaleString()}
              </td>
            </tr>
            <tr>
              <td style="padding:6px 0; font-size:14px; color:#555555;">Shipping</td>
              <td align="right" style="padding:6px 0; font-size:14px; color:#555555;">
                ${parseFloat(shippingCost || 0) === 0 
                  ? '<span style="color:#22c55e; font-weight:600;">FREE</span>' 
                  : `${currency === 'PKR' ? 'Rs.' : '$'}${parseFloat(shippingCost).toLocaleString()}`
                }
              </td>
            </tr>
            ${discountAmount && parseFloat(discountAmount) > 0 ? `
            <tr>
              <td style="padding:6px 0; font-size:14px; color:#22c55e;">
                Discount ${discountCode ? `(${discountCode})` : ''}
              </td>
              <td align="right" style="padding:6px 0; font-size:14px; color:#22c55e; font-weight:600;">
                -${currency === 'PKR' ? 'Rs.' : '$'}${parseFloat(discountAmount).toLocaleString()}
              </td>
            </tr>
            ` : ''}
            <tr>
              <td colspan="2">
                <div style="height:2px; background:${DARK}; margin:12px 0;"></div>
              </td>
            </tr>
            <tr>
              <td style="font-size:18px; font-weight:700; color:${DARK};">Total</td>
              <td align="right" style="font-size:22px; font-weight:700; color:${RED};">
                ${currency === 'PKR' ? 'Rs.' : '$'}${parseFloat(totalAmount || 0).toLocaleString()}
                <span style="font-size:14px; color:#888888; font-weight:400;">
                  ${currency}
                </span>
              </td>
            </tr>
          </table>
        </div>

        <!-- Divider -->
        <div style="height:1px; background:#eeeeee; margin:28px 0;"></div>

        <!-- Shipping Address -->
        <div style="font-size:12px; font-weight:700; text-transform:uppercase; 
                    letter-spacing:1px; color:#999999; margin-bottom:12px;">
          Shipping To
        </div>
        <div style="font-size:15px; color:${DARK}; line-height:1.8;">
          <strong>${customerName}</strong><br/>
          ${addressHTML}
        </div>

        <!-- Divider -->
        <div style="height:1px; background:#eeeeee; margin:28px 0;"></div>

        <!-- CTA Button -->
        <div style="text-align:center; margin:32px 0;">
          <a href="https://procollored.com" 
             style="display:inline-block; background:${RED}; color:white; 
                    text-decoration:none; padding:16px 40px; border-radius:8px; 
                    font-size:16px; font-weight:700; letter-spacing:0.5px;">
            Continue Shopping
          </a>
        </div>

        <!-- Support Box -->
        <div style="background:#fff8f8; border:1px solid #fde8e8; border-radius:8px; 
                    padding:20px 24px; text-align:center; margin-top:8px;">
          <div style="font-size:20px; margin-bottom:8px;">💬</div>
          <div style="font-size:14px; font-weight:700; color:${DARK}; margin-bottom:4px;">
            Need Help?
          </div>
          <div style="font-size:13px; color:#666666;">
            Contact us at 
            <a href="mailto:support@procollored.com" 
               style="color:${RED}; font-weight:600;">
              support@procollored.com
            </a>
          </div>
        </div>

      </div>

      <!-- FOOTER -->
      <div style="background:#1a1a1a; padding:28px 40px; text-align:center;">
        <img src="${LOGO}" alt="Procolored" 
             style="height:32px; width:auto; margin-bottom:16px;" />
        <p style="font-size:12px; color:#888888; margin-bottom:8px;">
          Global No.1 Desktop DTF Printer Brand
        </p>
        <p style="font-size:12px; color:#666666; line-height:1.8;">
          <a href="https://procollored.com" style="color:#888888;">Website</a>
          &nbsp;&bull;&nbsp;
          <a href="mailto:support@procollored.com" style="color:#888888;">
            support@procollored.com
          </a>
        </p>
        <p style="font-size:11px; color:#555555; margin-top:12px;">
          You received this email because you placed an order at Procolored.
        </p>
      </div>

    </div>
  </div>

</body>
</html>
  `;
};

module.exports = { orderConfirmationCustomer };
