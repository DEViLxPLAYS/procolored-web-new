/**
 * Nodemailer transporter — lazy init so Railway env vars are
 * read at send time (not at module load time before dotenv runs).
 */
const nodemailer = require('nodemailer');

// ── Build a fresh transporter each call (cheap, ensures env vars are fresh) ──
function buildTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,      // SSL for 465, TLS for 587
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  });
}

/**
 * Send a single email.
 * Returns { success: true, messageId } or { success: false, error: string }
 */
const sendMail = async (mailOptions) => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn('[Email] SMTP credentials not set — skipping email send.');
    return { success: false, error: 'SMTP credentials missing' };
  }

  const transporter = buildTransporter();
  if (!transporter) {
    return { success: false, error: 'Could not build SMTP transporter' };
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email] ✅ Sent to ${mailOptions.to} — MessageID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Email] ❌ Failed to send to ${mailOptions.to}: ${error.message}`);
    return { success: false, error: error.message };
  }
};

module.exports = { sendMail };
