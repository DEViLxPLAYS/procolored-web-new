const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const Stripe = require('stripe');


const stripeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Too many payment requests, please try again later.' }
});
router.use(stripeLimiter);

// ── Helper: load Stripe config from .env ──────────────────────────────────────
function getStripeKeys() {
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!publishableKey || !secretKey) {
    throw new Error('Stripe credentials not configured in .env (STRIPE_PUBLISHABLE_KEY / STRIPE_SECRET_KEY).');
  }

  return { publishableKey, secretKey };
}



// GET /api/stripe/config — returns public publishable key to frontend
router.get('/config', async (req, res) => {
  try {
    const { publishableKey } = getStripeKeys();
    res.json({ publishableKey });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Stripe not configured' });
  }
});

// POST /api/stripe/create-payment-intent
// Handles $0 amounts by skipping Stripe and returning a demo-intent marker
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    const amountNum = Math.round(Number(amount) || 0);

    // $0 orders — no Stripe needed
    if (amountNum === 0) {
      return res.json({ 
        clientSecret: null,
        isFreeOrder: true,
        message: 'No payment required for $0 orders'
      });
    }

    if (isNaN(amountNum) || amountNum < 50) {
      return res.status(400).json({ error: 'Invalid amount (minimum 50 cents)' });
    }

    const { secretKey } = getStripeKeys();
    const stripe = new Stripe(secretKey, { apiVersion: '2023-10-16' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountNum,
      currency: currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret, isFreeOrder: false });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to create payment intent' });
  }
});

module.exports = router;
