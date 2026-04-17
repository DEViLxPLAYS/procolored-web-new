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
    // fall through to .env
  }

  // ── .env fallback ──────────────────────────────────────────────────────────
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!publishableKey || !secretKey) {
    throw new Error('Stripe credentials not configured.');
  }
  return { publishableKey, secretKey };
}

// ── Helper: read stripe_ui_enabled from DB ─────────────────────────────────
async function getStripeUiEnabled() {
  try {
    const { data } = await supabaseAdmin
      .from('payment_gateway_keys')
      .select('encrypted_value, iv')
      .eq('gateway', 'stripe')
      .eq('key_name', 'stripe_ui_enabled')
      .eq('is_active', true)
      .single();

    if (data) {
      return decrypt(data.encrypted_value, data.iv) === 'true';
    }
  } catch (_) {}
  // Default: enabled if stripe keys exist in env
  return !!(process.env.STRIPE_PUBLISHABLE_KEY && process.env.STRIPE_SECRET_KEY);
}

// GET /api/stripe/config — returns publishable key + ui visibility to frontend
router.get('/config', async (req, res) => {
  try {
    const [{ publishableKey }, uiEnabled] = await Promise.all([
      getStripeKeys(),
      getStripeUiEnabled(),
    ]);
    res.json({ publishableKey, uiEnabled });
  } catch (err) {
    // Even if keys fail, still return uiEnabled so frontend can handle gracefully
    const uiEnabled = await getStripeUiEnabled().catch(() => false);
    res.status(500).json({ error: err.message || 'Stripe not configured', uiEnabled });
  }
});

// POST /api/stripe/create-payment-intent
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

    const { secretKey } = await getStripeKeys();
    const stripe = new Stripe(secretKey, { apiVersion: '2023-10-16' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountNum,
      currency: currency.toLowerCase(),
      payment_method_types: ['card'],
    });

    res.json({ clientSecret: paymentIntent.client_secret, isFreeOrder: false });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to create payment intent' });
  }
});

module.exports = router;
