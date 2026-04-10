/**
 * Customer "Thank You For Ordering" Email Template
 * Simple, warm, branded — just confirms the order was received.
 * Does NOT show order details — just a thank you + order number.
 */
const orderConfirmationCustomer = ({
  customerName,
  orderNumber,
  isDemoOrder
}) => {
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Thank you for your order — Procolored</title>
</head>
<body style="margin:0;padding:0;background:#f2f2f2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:580px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <!-- HEADER -->
    <div style="background:#111111;padding:32px;text-align:center;">
      <img src="https://i.postimg.cc/Y9M7TqxR/logo.webp" alt="Procolored" style="height:44px;width:auto;display:block;margin:0 auto;"/>
    </div>

    <!-- GREEN BANNER -->
    <div style="background:#22c55e;padding:24px 32px;text-align:center;">
      <div style="font-size:36px;margin-bottom:6px;">🎉</div>
      <h1 style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">
        ${isDemoOrder ? 'Demo Order Placed!' : 'Thank You For Your Order!'}
      </h1>
    </div>

    <!-- BODY -->
    <div style="padding:40px 32px;">

      <p style="font-size:16px;color:#333333;line-height:1.7;margin:0 0 24px;">
        Hi <strong>${customerName || 'there'}</strong>,<br/><br/>
        We've received your order on <strong>Procolored</strong> and it's being processed.
        Our team will be in touch with you shortly with shipping and delivery details.
      </p>

      <!-- Order number box -->
      <div style="background:#f7f7f7;border-left:4px solid #E8302A;border-radius:8px;padding:18px 22px;margin-bottom:24px;">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#999999;margin-bottom:6px;">
          Your Order Reference
        </div>
        <div style="font-size:22px;font-weight:800;color:#E8302A;letter-spacing:1px;">
          ${orderNumber}
        </div>
        <div style="font-size:12px;color:#888888;margin-top:4px;">Keep this for your records</div>
      </div>

      <!-- Shipping note -->
      <div style="background:#f0fdf4;border-radius:8px;padding:16px 20px;margin-bottom:28px;display:flex;align-items:flex-start;gap:12px;">
        <span style="font-size:22px;flex-shrink:0;">🚚</span>
        <div>
          <div style="font-size:14px;font-weight:700;color:#166534;margin-bottom:3px;">Estimated Delivery</div>
          <div style="font-size:13px;color:#166534;line-height:1.5;">
            ${isDemoOrder
              ? 'This is a demo order — no product will be shipped.'
              : 'Shipping will be delivered in <strong>14–17 business days</strong> after payment confirmation.'}
          </div>
        </div>
      </div>

      <!-- What happens next -->
      <h2 style="font-size:15px;font-weight:700;color:#111111;margin:0 0 12px;">What happens next?</h2>
      <ol style="padding-left:20px;color:#555555;font-size:14px;line-height:2;margin:0 0 28px;">
        <li>Our team reviews your order</li>
        <li>We'll contact you to confirm shipping address &amp; payment details</li>
        <li>Your order ships within 3–5 business days</li>
        <li>Track your shipment via the details we'll email you</li>
      </ol>

      <!-- CTA -->
      <div style="text-align:center;margin:20px 0 8px;">
        <a href="https://procollored.com"
           style="display:inline-block;background:#E8302A;color:#ffffff;text-decoration:none;padding:15px 40px;border-radius:8px;font-size:15px;font-weight:700;letter-spacing:0.3px;">
          Continue Shopping →
        </a>
      </div>

    </div>

    <!-- SUPPORT BAR -->
    <div style="background:#f7f7f7;border-top:1px solid #eeeeee;padding:20px 32px;text-align:center;">
      <p style="font-size:13px;color:#666666;margin:0;">
        Questions? We're here to help —
        <a href="mailto:support@procollored.com" style="color:#E8302A;font-weight:600;text-decoration:none;">
          support@procollored.com
        </a>
      </p>
    </div>

    <!-- FOOTER -->
    <div style="background:#111111;padding:22px 32px;text-align:center;">
      <p style="font-size:11px;color:#666666;margin:0;line-height:1.8;">
        © ${year} Procolored — Global No.1 Desktop DTF Printer Brand<br/>
        <a href="https://procollored.com" style="color:#555555;text-decoration:none;">procollored.com</a>
      </p>
    </div>

  </div>
</body>
</html>`;
};

module.exports = { orderConfirmationCustomer };
