/**
 * Nodemailer transporter with dual-port fallback.
 * 
 * Railway often blocks port 465 (SSL SMTP).
 * This config tries 465 first, then auto-falls back to 587 (TLS).
 */
const nodemailer = require('nodemailer');

const SMTP_HOST = () => process.env.SMTP_HOST || 'smtp.hostinger.com';
const SMTP_USER = () => process.env.SMTP_USER || 'support@procollored.com';
const SMTP_PASS = () => process.env.SMTP_PASS;
const SMTP_PORT = () => parseInt(process.env.SMTP_PORT || '465', 10);

function buildTransporter(port) {
  const secure = port === 465;
  return nodemailer.createTransport({
    host: SMTP_HOST(),
    port,
    secure,
    auth: { user: SMTP_USER(), pass: SMTP_PASS() },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 20000,
    greetingTimeout: 15000,
    socketTimeout: 30000,
  });
}

/**
 * Try sending on primary port, then fallback port if it fails.
 * Returns { success, messageId?, error? }
 */
const sendMail = async (mailOptions) => {
  const pass = SMTP_PASS();
  const user = SMTP_USER();

  if (!pass) {
    console.warn('[Email] SMTP_PASS not set — cannot send.');
    return { success: false, error: 'SMTP_PASS missing in environment' };
  }

  const fromLabel = process.env.SMTP_FROM || `Procolored Store <${user}>`;
  const primaryPort = SMTP_PORT();
  const fallbackPort = primaryPort === 465 ? 587 : 465;

  const options = {
    from: mailOptions.from || fromLabel,
    to: mailOptions.to,
    subject: mailOptions.subject,
    html: mailOptions.html,
    replyTo: mailOptions.replyTo || user,
  };

  // ── Try primary port ──────────────────────────────────────────────────────
  try {
    const t = buildTransporter(primaryPort);
    const info = await t.sendMail(options);
    console.log(`[Email] ✅ Sent (port ${primaryPort}) to ${options.to} — MsgID: ${info.messageId}`);
    return { success: true, messageId: info.messageId, port: primaryPort };
  } catch (err1) {
    console.error(`[Email] ❌ Port ${primaryPort} failed: ${err1.message} (code: ${err1.code})`);

    // ── Fallback to other port ────────────────────────────────────────────
    console.log(`[Email] 🔄 Retrying on port ${fallbackPort}...`);
    try {
      const t2 = buildTransporter(fallbackPort);
      const info2 = await t2.sendMail(options);
      console.log(`[Email] ✅ Sent (port ${fallbackPort} fallback) to ${options.to} — MsgID: ${info2.messageId}`);
      return { success: true, messageId: info2.messageId, port: fallbackPort };
    } catch (err2) {
      console.error(`[Email] ❌ Port ${fallbackPort} also failed: ${err2.message} (code: ${err2.code})`);
      console.error('[Email] Both ports failed. Check Railway SMTP firewall settings.');
      return {
        success: false,
        error: `Port ${primaryPort}: ${err1.message} | Port ${fallbackPort}: ${err2.message}`,
        code465: err1.code,
        code587: err2.code,
      };
    }
  }
};

module.exports = { sendMail };
