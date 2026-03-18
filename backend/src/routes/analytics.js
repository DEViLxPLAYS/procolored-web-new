const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const rateLimit = require('express-rate-limit');

const analyticsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

// ================================
// POST /api/analytics/visit
// Track page visit
// ================================
router.post('/visit', analyticsLimiter, async (req, res) => {
  try {
    const {
      sessionId,
      country,
      countryName,
      city,
      currencyShown,
      deviceType,
      browser,
      pageVisited,
      referrer
    } = req.body;

    await supabaseAdmin
      .from('visitor_analytics')
      .insert({
        session_id: sessionId || null,
        ip_address: req.ip,
        country: country || null,
        country_name: countryName || null,
        city: city || null,
        currency_shown: currencyShown || 'PKR',
        device_type: deviceType || null,
        browser: browser || null,
        page_visited: pageVisited || '/',
        referrer: referrer || null
      });

    return res.status(200).json({ message: 'Recorded' });
  } catch (error) {
    // Silent fail — don't break the user experience
    return res.status(200).json({ message: 'OK' });
  }
});

// ================================
// GET /api/analytics/geo
// Backend proxy for IP geolocation — never call ipapi.co from frontend
// ================================
router.get('/geo', async (req, res) => {
  const fallback = { country_code: 'PK', currency: 'PKR', country_name: 'Pakistan', city: 'Unknown' };
  try {
    const clientIP =
      (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
      req.socket.remoteAddress ||
      req.ip;

    // Skip loopback IPs in development
    if (!clientIP || clientIP === '127.0.0.1' || clientIP === '::1' || clientIP.startsWith('192.168') || clientIP.startsWith('10.')) {
      return res.status(200).json(fallback);
    }

    const response = await fetch(`https://ipapi.co/${clientIP}/json/`, {
      headers: { 'User-Agent': 'procolored-backend/1.0' },
      signal: AbortSignal.timeout(4000)
    });

    if (!response.ok) return res.status(200).json(fallback);

    const data = await response.json();
    return res.status(200).json({
      country_code: data.country_code || 'PK',
      currency: data.currency || 'PKR',
      country_name: data.country_name || 'Pakistan',
      city: data.city || 'Unknown'
    });
  } catch (_) {
    return res.status(200).json(fallback);
  }
});

module.exports = router;
