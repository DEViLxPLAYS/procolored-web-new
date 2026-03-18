const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { newsletterLimiter } = require('../middleware/rateLimit');
const { body, validationResult } = require('express-validator');

// ================================
// POST /api/newsletter/subscribe
// ================================
router.post('/subscribe',
  newsletterLimiter,
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Valid email address required' });
    }

    try {
      const { email, country, city, source } = req.body;
      const discountCode = 'PROCOLORED5';
      const signupSource = source || 'popup';

      // Check if already subscribed
      const { data: existing } = await supabaseAdmin
        .from('newsletter_subscribers')
        .select('id, is_active')
        .eq('email', email)
        .single();

      if (existing) {
        if (existing.is_active) {
          return res.status(200).json({
            message: 'You are already subscribed!',
            discountCode
          });
        }
        // Reactivate if previously unsubscribed
        await supabaseAdmin
          .from('newsletter_subscribers')
          .update({ is_active: true, unsubscribed_at: null })
          .eq('id', existing.id);

        return res.status(200).json({
          message: 'Welcome back! You have been resubscribed.',
          discountCode
        });
      }

      // Insert new subscriber
      const { error } = await supabaseAdmin
        .from('newsletter_subscribers')
        .insert({
          email,
          country: country || null,
          city: city || null,
          ip_address: req.ip,
          source: signupSource,
          discount_code: discountCode
        });

      if (error) throw error;

      return res.status(201).json({
        message: 'Successfully subscribed!',
        discountCode
      });

    } catch (error) {
      console.error('Newsletter error:', error.message);
      return res.status(500).json({ error: 'Subscription failed. Please try again.' });
    }
  }
);

// ================================
// POST /api/newsletter/unsubscribe
// ================================
router.post('/unsubscribe',
  [body('email').isEmail().normalizeEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Valid email required' });
    }

    try {
      const { email } = req.body;
      await supabaseAdmin
        .from('newsletter_subscribers')
        .update({ is_active: false, unsubscribed_at: new Date() })
        .eq('email', email);

      return res.status(200).json({ message: 'Successfully unsubscribed.' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to unsubscribe' });
    }
  }
);

module.exports = router;
