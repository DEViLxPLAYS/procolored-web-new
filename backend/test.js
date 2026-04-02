require('dotenv').config();
const { sendMail } = require('./src/config/nodemailer');

const run = async () => {
  console.log("Testing Hostinger SMTP...");
  const result = await sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.NOTIFY_EMAIL,
    subject: 'Test Email Validation',
    html: '<h1>If you see this, Hostinger SMTP is working!</h1>'
  });
  console.log("Result:", result);
};

run();
