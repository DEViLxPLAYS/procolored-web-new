const express = require('express');
const router = express.Router();
const { sendContactEmailHandler } = require('../controllers/emailController');
// Consider adding rate limiter for contact form here if needed:
// const { contactLimiter } = require('../middleware/rateLimit');

// ================================
// POST /api/contact
// ================================
// Use rate limiter if available like router.post('/', contactLimiter, sendContactEmailHandler);
router.post('/', sendContactEmailHandler);

module.exports = router;
