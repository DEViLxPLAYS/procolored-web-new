const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const Stripe = require('stripe');
const { supabaseAdmin } = require('../config/supabase');
const { decrypt } = require('../utils/encryption');

const stripeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Too many payment requests, please try again later.' }
});
router.use(stripeLimiter);

// ── Helper: load Stripe config from Supabase DB, fall back to .env ────────────
async function getStripeKeys() {
  try {
    const { data, error } = await supabaseAdmin
      .from('payment_gateway_keys')
      .select('key_name, encrypted_value, iv')
      .eq('gateway', 'stripe')
      .eq('is_active', true);

    if (!error && data && data.length > 0) {
      let mode = 'live';
      const modeObj = data.find(k => k.key_name === 'stripe_mode');
      if (modeObj) {
        mode = decrypt(modeObj.encrypted_value, modeObj.iv) === 'test' ? 'test' : 'live';
      }

      const pkObj = data.find(k => k.key_name === `stripe_${mode}_client_id`);
      const skObj = data.find(k => k.key_name === `stripe_${mode}_secret_key`);

      if (pkObj && skObj) {
        return {
          publishableKey: decrypt(pkObj.encrypted_value, pkObj.iv),
          secretKey: decrypt(skObj.encrypted_value, skObj.iv),
        };
      }
    }
  } catch (_) {
    // Fall through to .env fallback
  }

  // ── .env fallback ─────────────────────────────────────────────────────────
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!publishableKey || !secretKey || secretKey === 'add_when_ready') {
    throw new Error('Stripe credentials not configured. Add them in the Admin → Payment Gateways panel.');
  }

  return { publishableKey, secretKey };
}

// GET /api/stripe/config — returns public publishable key to frontend
router.get('/config', async (req, res) => {
  try {
    const { publishableKey } = await getStripeKeys();
    res.json({ publishableKey });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Stripe not configured' });
  }
});

// POST /api/stripe/create-payment-intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    if (!amount || isNaN(amount) || amount < 50) {
      return res.status(400).json({ error: 'Invalid amount (minimum 50 cents)' });
    }

    const { secretKey } = await getStripeKeys();
    const stripe = new Stripe(secretKey, { apiVersion: '2023-10-16' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
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
