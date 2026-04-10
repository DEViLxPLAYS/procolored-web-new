/**
 * Email sender — supports BOTH:
 *   1. Resend API (preferred for Railway — uses HTTPS, not SMTP)
 *   2. Nodemailer SMTP fallback (for local dev)
 * 
 * Set RESEND_API_KEY in Railway env vars to use Resend.
 * Falls back to SMTP if RESEND_API_KEY is not set.
 * 
 * Get a FREE Resend API key at: https://resend.com (free: 3000 emails/month)
 */
const nodemailer = require('nodemailer');

// ── Resend sender (HTTPS API — works on Railway no SMTP port issues) ──────────
async function sendViaResend(options) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null; // Not configured, fall through to SMTP

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: options.from || `Procolored Store <${process.env.SMTP_USER || 'support@procollored.com'}>`,
        to: [options.to],
        subject: options.subject,
        html: options.html,
        reply_to: options.replyTo || process.env.SMTP_USER,
      }),
    });

    const data = await response.json();

    if (response.ok && data.id) {
      console.log(`[Email] ✅ Resend: sent to ${options.to} — ID: ${data.id}`);
      return { success: true, messageId: data.id, provider: 'resend' };
    } else {
      console.error('[Email] Resend error:', JSON.stringify(data));
      return { success: false, error: JSON.stringify(data), provider: 'resend' };
    }
  } catch (err) {
    console.error('[Email] Resend fetch error:', err.message);
    return { success: false, error: err.message, provider: 'resend' };
  }
}

// ── SMTP sender via Nodemailer (fallback, with dual-port) ─────────────────────
async function sendViaSmtp(options) {
  const pass = process.env.SMTP_PASS;
  const user = process.env.SMTP_USER || 'support@procollored.com';
  const host = process.env.SMTP_HOST || 'smtp.hostinger.com';

  if (!pass) {
    console.warn('[Email] SMTP_PASS not set — cannot send via SMTP.');
    return { success: false, error: 'SMTP_PASS missing', provider: 'smtp' };
  }

  const fromLabel = process.env.SMTP_FROM || `Procolored Store <${user}>`;

  const mailOptions = {
    from: options.from || fromLabel,
    to: options.to,
    subject: options.subject,
    html: options.html,
    replyTo: options.replyTo || user,
  };

  // Try port 465 first, then 587
  for (const port of [465, 587]) {
    const secure = port === 465;
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 15000,
      greetingTimeout: 12000,
      socketTimeout: 20000,
    });

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`[Email] ✅ SMTP port ${port}: sent to ${options.to} — MsgID: ${info.messageId}`);
      return { success: true, messageId: info.messageId, provider: `smtp-${port}` };
    } catch (err) {
      console.error(`[Email] ❌ SMTP port ${port} failed: ${err.message} (code: ${err.code})`);
    }
  }

  return { success: false, error: 'Both SMTP ports (465, 587) failed', provider: 'smtp' };
}

// ── Main sendMail — tries Resend first, then SMTP ────────────────────────────
const sendMail = async (mailOptions) => {
  // 1. Try Resend if API key is set (preferred on Railway)
  if (process.env.RESEND_API_KEY) {
    const result = await sendViaResend(mailOptions);
    if (result) return result;
  }

  // 2. Fall back to SMTP (works locally, may fail on Railway)
  return sendViaSmtp(mailOptions);
};

module.exports = { sendMail };
