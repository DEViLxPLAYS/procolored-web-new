const newOrderAdmin = ({
  orderNumber,
  customerName,
  customerEmail,
  customerPhone,
  items,
  subtotal,
  shippingCost,
  discountAmount,
  discountCode,
  totalAmount,
  currency,
  shippingAddress,
  paymentMethod,
  customerCountry,
  customerCity,
  customerIp,
  isDemoOrder,
  createdAt
}) => {
  const LOGO = 'https://i.postimg.cc/SKh71Rmm/logo.webp';
  const RED = '#E8302A';
  const DARK = '#1a1a1a';

  const itemsHTML = (items || []).map(item => `
    <tr style="border-bottom:1px solid #eeeeee;">
      <td style="padding:12px 8px; font-size:14px; color:${DARK}; font-weight:600;">
        ${item.name}
        ${item.variant ? `<br/><span style="font-size:12px; color:#888888; font-weight:400;">${item.variant}</span>` : ''}
      </td>
      <td align="center" style="padding:12px 8px; font-size:14px; color:#555555;">
        ${item.quantity || 1}
      </td>
      <td align="right" style="padding:12px 8px; font-size:14px; font-weight:700; color:${DARK};">
        ${currency === 'PKR' ? 'Rs.' : '$'}${parseFloat(item.price || 0).toLocaleString()}
      </td>
    </tr>
  `).join('');

  const shippingAddr = shippingAddress || {};
  const street = shippingAddr.street || shippingAddr.address || '';
  const city = shippingAddr.city || '';
  const state = shippingAddr.state || '';
  const postal = shippingAddr.postalCode || shippingAddr.postal || '';
  const country = shippingAddr.country || '';

  let dateStr = '';
  try {
    dateStr = new Date(createdAt || Date.now()).toLocaleString('en-US', {
      dateStyle: 'full', timeStyle: 'short'
    });
  } catch (e) {
    dateStr = new Date().toLocaleString();
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>🔔 New Order — ${orderNumber}</title>
</head>
<body style="margin:0; padding:0; background:#f4f4f4; 
             font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,
             Helvetica,Arial,sans-serif;">

  <div style="background:#f4f4f4; padding:40px 20px;">
    <div style="max-width:650px; margin:0 auto; background:#ffffff; 
                border-radius:12px; overflow:hidden; 
                box-shadow:0 4px 24px rgba(0,0,0,0.08);">

      <!-- HEADER -->
      <div style="background:${DARK}; padding:28px 40px; text-align:center;">
        <img src="${LOGO}" alt="Procolored" 
             style="height:40px; width:auto; display:block; margin:0 auto 16px;" />
        <span style="background:${isDemoOrder ? '#f59e0b' : '#22c55e'}; color:white; 
                     font-size:13px; font-weight:700; padding:6px 16px; 
                     border-radius:20px; text-transform:uppercase; letter-spacing:1px;">
          ${isDemoOrder ? '🧪 Demo Order' : '🔔 New Order Received'}
        </span>
      </div>

      <!-- ALERT BANNER -->
      <div style="background:${isDemoOrder ? '#fffbeb' : '#f0fdf4'}; 
                  padding:20px 40px; text-align:center; 
                  border-bottom:1px solid ${isDemoOrder ? '#fde68a' : '#bbf7d0'};">
        <div style="font-size:24px; font-weight:800; 
                    color:${isDemoOrder ? '#92400e' : '#166534'};">
          ${isDemoOrder ? '🧪 Demo Test Order' : '✅ You Have a New Order!'}
        </div>
        <div style="font-size:15px; color:${isDemoOrder ? '#92400e' : '#166534'}; 
                    margin-top:4px;">
          Order <strong>${orderNumber}</strong> &bull; ${dateStr}
        </div>
      </div>

      <!-- BODY -->
      <div style="padding:40px;">

        <!-- Quick Summary Row -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
          <tr>
            <td width="33%" style="text-align:center; padding:16px; background:#f8f8f8; border-radius:8px;">
              <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#999999;">Order Total</div>
              <div style="font-size:22px; font-weight:800; color:${RED}; margin-top:4px;">
                ${currency === 'PKR' ? 'Rs.' : '$'}${parseFloat(totalAmount || 0).toLocaleString()}
              </div>
              <div style="font-size:11px; color:#888888;">${currency || 'USD'}</div>
            </td>
            <td width="4%"></td>
            <td width="30%" style="text-align:center; padding:16px; background:#f8f8f8; border-radius:8px;">
              <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#999999;">Payment</div>
              <div style="font-size:16px; font-weight:700; color:#22c55e; margin-top:4px; text-transform:uppercase;">
                ${paymentMethod || 'Stripe'}
              </div>
              <div style="font-size:11px; color:#22c55e;">✓ Confirmed</div>
            </td>
            <td width="4%"></td>
            <td width="30%" style="text-align:center; padding:16px; background:#f8f8f8; border-radius:8px;">
              <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#999999;">Items</div>
              <div style="font-size:22px; font-weight:800; color:${DARK}; margin-top:4px;">
                ${(items || []).length}
              </div>
              <div style="font-size:11px; color:#888888;">
                product${(items || []).length !== 1 ? 's' : ''}
              </div>
            </td>
          </tr>
        </table>

        <!-- Customer Details -->
        <div style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#999999; margin-bottom:16px;">
          Customer Information
        </div>
        <table width="100%" cellpadding="0" cellspacing="0" 
               style="background:#f8f8f8; border-radius:8px; overflow:hidden; margin-bottom:28px;">
          <tr>
            <td style="padding:10px 20px; width:140px;">
              <span style="font-size:12px; font-weight:600; text-transform:uppercase; color:#888888;">Name</span>
            </td>
            <td style="padding:10px 20px;">
              <span style="font-size:15px; font-weight:600; color:${DARK};">${customerName}</span>
            </td>
          </tr>
          <tr style="border-top:1px solid #eeeeee;">
            <td style="padding:10px 20px;">
              <span style="font-size:12px; font-weight:600; text-transform:uppercase; color:#888888;">Email</span>
            </td>
            <td style="padding:10px 20px;">
              <a href="mailto:${customerEmail}" style="font-size:15px; color:${RED}; font-weight:600;">${customerEmail}</a>
            </td>
          </tr>
          ${customerPhone ? `
          <tr style="border-top:1px solid #eeeeee;">
            <td style="padding:10px 20px;">
              <span style="font-size:12px; font-weight:600; text-transform:uppercase; color:#888888;">Phone</span>
            </td>
            <td style="padding:10px 20px;">
              <span style="font-size:15px; color:${DARK};">${customerPhone}</span>
            </td>
          </tr>
          ` : ''}
          <tr style="border-top:1px solid #eeeeee;">
            <td style="padding:10px 20px;">
              <span style="font-size:12px; font-weight:600; text-transform:uppercase; color:#888888;">Location</span>
            </td>
            <td style="padding:10px 20px;">
              <span style="font-size:15px; color:${DARK};">${customerCity ? customerCity + ', ' : ''}${customerCountry || 'Unknown'}</span>
            </td>
          </tr>
          <tr style="border-top:1px solid #eeeeee;">
            <td style="padding:10px 20px;">
              <span style="font-size:12px; font-weight:600; text-transform:uppercase; color:#888888;">IP Address</span>
            </td>
            <td style="padding:10px 20px;">
              <span style="font-size:14px; color:#888888; font-family:monospace;">${customerIp || 'Unknown'}</span>
            </td>
          </tr>
        </table>

        <!-- Shipping Address -->
        <div style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#999999; margin-bottom:16px;">
          Shipping Address
        </div>
        <div style="background:#f8f8f8; border-radius:8px; padding:20px 24px; margin-bottom:28px; border-left:4px solid ${RED};">
          <div style="font-size:15px; color:${DARK}; line-height:1.8;">
            <strong>${customerName}</strong><br/>
            ${street}<br/>
            ${city}${state ? ', ' + state : ''} ${postal}<br/>
            <strong>${country}</strong>
          </div>
        </div>

        <!-- Order Items -->
        <div style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#999999; margin-bottom:16px;">
          Items Ordered
        </div>
        <table width="100%" cellpadding="0" cellspacing="0" 
               style="border:1px solid #eeeeee; border-radius:8px; overflow:hidden; margin-bottom:20px;">
          <thead>
            <tr style="background:#f8f8f8;">
              <th style="padding:12px 8px; text-align:left; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#888888;">Product</th>
              <th style="padding:12px 8px; text-align:center; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#888888;">Qty</th>
              <th style="padding:12px 8px; text-align:right; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#888888;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>

        <!-- Order Totals -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
          <tr>
            <td style="padding:6px 0; font-size:14px; color:#555555;">Subtotal</td>
            <td align="right" style="padding:6px 0; font-size:14px; color:#555555;">
              ${currency === 'PKR' ? 'Rs.' : '$'}${parseFloat(subtotal || 0).toLocaleString()}
            </td>
          </tr>
          <tr>
            <td style="padding:6px 0; font-size:14px; color:#555555;">Shipping</td>
            <td align="right" style="padding:6px 0; font-size:14px; font-weight:700; color:#22c55e;">
              ${parseFloat(shippingCost || 0) === 0 ? 'FREE' : 
                `${currency === 'PKR' ? 'Rs.' : '$'}${parseFloat(shippingCost).toLocaleString()}`}
            </td>
          </tr>
          <tr>
            <td style="padding:6px 0; font-size:14px; color:#555555;">Taxes</td>
            <td align="right" style="padding:6px 0; font-size:14px; font-weight:700; color:#22c55e;">FREE</td>
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
              <div style="height:2px; background:${DARK}; margin:10px 0;"></div>
            </td>
          </tr>
          <tr>
            <td style="font-size:18px; font-weight:800; color:${DARK};">TOTAL CHARGED</td>
            <td align="right" style="font-size:22px; font-weight:800; color:${RED};">
              ${currency === 'PKR' ? 'Rs.' : '$'}${parseFloat(totalAmount || 0).toLocaleString()} ${currency || 'USD'}
            </td>
          </tr>
        </table>

        <!-- Admin Action Button -->
        <div style="text-align:center; margin:32px 0;">
          <a href="https://procollored.com/AdminDashboard" 
             style="display:inline-block; background:${RED}; color:white; 
                    text-decoration:none; padding:16px 40px; border-radius:8px; 
                    font-size:16px; font-weight:700; letter-spacing:0.5px;">
            View in Admin Dashboard →
          </a>
        </div>

      </div>

      <!-- FOOTER -->
      <div style="background:#1a1a1a; padding:24px 40px; text-align:center;">
        <img src="${LOGO}" alt="Procolored" 
             style="height:28px; width:auto; margin-bottom:12px;" />
        <p style="font-size:12px; color:#666666;">
          This is an internal admin notification from Procolored Order System
        </p>
      </div>

    </div>
  </div>

</body>
</html>
  `;
};

module.exports = { newOrderAdmin };
