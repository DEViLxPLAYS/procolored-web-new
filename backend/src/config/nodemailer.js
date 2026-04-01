const nodemailer = require('nodemailer');
require('dotenv').config();

// Export the transporter setup so it can be reused across the application
const host = process.env.SMTP_HOST;
const port = parseInt(process.env.SMTP_PORT || '465', 10);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465, // true for 465 (SSL), false for 587 (TLS)
  auth: {
    user,
    pass
  },
  tls: { rejectUnauthorized: false } // Prevents self-signed cert issues 
});

// Helper wrapper to send email with robust try/catch
const sendMail = async (mailOptions) => {
  if (!host || !user || !pass) {
    console.warn('[Email System] SMTP credentials missing in .env. Email skipped.');
    return { success: false, error: 'SMTP credentials missing' };
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email System] Message sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[Email System] Sending failed:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { transporter, sendMail };
