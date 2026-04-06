const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const Stripe = require('stripe');

// Rate limiting
const stripeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Too many payment requests, please try again later.' }
});
router.use(stripeLimiter);

function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey || secretKey === 'add_when_ready') {
    throw new Error('Stripe secret key not configured');
  }
  return new Stripe(secretKey, { apiVersion: '2023-10-16' });
}

// GET /api/stripe/config — returns public publishable key to frontend
router.get('/config', (req, res) => {
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
  if (!publishableKey || publishableKey === 'add_when_ready') {
    return res.status(500).json({ error: 'Stripe not configured' });
  }
  res.json({ publishableKey });
});

// POST /api/stripe/create-payment-intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    if (!amount || isNaN(amount) || amount < 50) {
      return res.status(400).json({ error: 'Invalid amount (minimum 50 cents)' });
    }

    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // already in cents from frontend
      currency: currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to create payment intent' });
  }
});

module.exports = router;
