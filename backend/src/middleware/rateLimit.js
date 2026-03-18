const rateLimit = require('express-rate-limit');

// Strict limiter for admin login
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,                      // 5 attempts only
  message: { error: 'Too many login attempts. Account temporarily locked for 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

// Newsletter signup limiter
const newsletterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 3,                      // 3 signups per hour per IP
  message: { error: 'Too many signup attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Order creation limiter
const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 10,                     // 10 orders per hour per IP
  message: { error: 'Too many order attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Checkout tracking limiter
const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Too many requests.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  adminLoginLimiter,
  newsletterLimiter,
  orderLimiter,
  checkoutLimiter
};
