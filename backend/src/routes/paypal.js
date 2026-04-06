const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { supabaseAdmin } = require('../config/supabase');
const { decrypt } = require('../utils/encryption');

const PAYPAL_API = {
  sandbox: 'https://api-m.sandbox.paypal.com',
  live: 'https://api-m.paypal.com'
};

const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Too many payment requests, please try again later.' }
});
router.use(checkoutLimiter);

// ── Helper: load PayPal config from Supabase DB, fall back to .env ────────────
async function getPayPalConfig() {
  try {
    const { data, error } = await supabaseAdmin
      .from('payment_gateway_keys')
      .select('key_name, encrypted_value, iv')
      .eq('gateway', 'paypal')
      .eq('is_active', true);

    if (!error && data && data.length > 0) {
      let mode = 'live';
      let clientId = '';
      let secretKey = '';

      const modeObj = data.find(k => k.key_name === 'paypal_mode');
      if (modeObj) {
        mode = decrypt(modeObj.encrypted_value, modeObj.iv) === 'sandbox' ? 'sandbox' : 'live';
      }

      const idObj = data.find(k => k.key_name === `paypal_${mode}_client_id`);
      const secObj = data.find(k => k.key_name === `paypal_${mode}_secret_key`);

      if (idObj && secObj) {
        clientId = decrypt(idObj.encrypted_value, idObj.iv);
        secretKey = decrypt(secObj.encrypted_value, secObj.iv);
        return { mode, clientId, secretKey, baseUrl: PAYPAL_API[mode] };
      }
    }
  } catch (_) {
    // Fall through to .env fallback
  }

  // ── .env fallback (keeps working even if DB has no keys yet) ──────────────
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secretKey = process.env.PAYPAL_SECRET_KEY;
  const mode = (process.env.PAYPAL_MODE || 'live').trim() === 'sandbox' ? 'sandbox' : 'live';

  if (!clientId || !secretKey) {
    throw new Error('PayPal credentials not configured. Add them in the Admin → Payment Gateways panel.');
  }

  return { mode, clientId, secretKey, baseUrl: PAYPAL_API[mode] };
}

async function generateAccessToken() {
  const { clientId, secretKey, baseUrl } = await getPayPalConfig();
  const auth = Buffer.from(`${clientId}:${secretKey}`).toString('base64');

  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: { Authorization: `Basic ${auth}` },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error_description || 'Failed to generate PayPal token');
  return data.access_token;
}

// GET /api/paypal/config
router.get('/config', async (req, res) => {
  try {
    const { clientId, mode } = await getPayPalConfig();
    res.json({ clientId, mode });
  } catch (err) {
    res.status(500).json({ error: err.message || 'PayPal is not configured' });
  }
});

// POST /api/paypal/create-order
router.post('/create-order', async (req, res) => {
  try {
    const { cartTotal, currency = 'USD' } = req.body;
    if (!cartTotal || isNaN(cartTotal)) {
      return res.status(400).json({ error: 'Invalid cart total' });
    }

    const { baseUrl } = await getPayPalConfig();
    const accessToken = await generateAccessToken();

    const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: { currency_code: currency, value: parseFloat(cartTotal).toFixed(2) }
        }],
      }),
    });

    const data = await response.json();
    if (response.ok) res.json({ id: data.id });
    else res.status(500).json({ error: data.message || 'Failed to create PayPal order' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'PayPal order creation failed' });
  }
});

// POST /api/paypal/capture-order
router.post('/capture-order', async (req, res) => {
  try {
    const { orderID } = req.body;
    if (!orderID) return res.status(400).json({ error: 'Missing orderID' });

    const { baseUrl } = await getPayPalConfig();
    const accessToken = await generateAccessToken();

    const response = await fetch(`${baseUrl}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    });

    const data = await response.json();
    if (response.ok) res.json({ success: true, capture: data });
    else res.status(500).json({ error: data.message || 'Failed to capture PayPal order' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'PayPal capture failed' });
  }
});

module.exports = router;
