const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { checkoutLimiter, orderLimiter } = require('../middleware/rateLimit');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { sendOrderEmailsHandler, sendAbandonmentEmailHandler } = require('../controllers/emailController');

// ================================
// POST /api/checkout/abandon
// Track checkout abandonment
// Accepts: application/json OR text/plain (sendBeacon CORS bypass fallback)
// ================================
router.post('/abandon', checkoutLimiter, async (req, res) => {
  try {
    // Handle sendBeacon fallback: body arrives as text/plain, parse it manually
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (_) { body = {}; }
    }
    if (!body || typeof body !== 'object') body = {};

    const {
      sessionId,
      customerEmail,
      customerName,
      cartItems,
      cartTotal,
      currency,
      stepAbandoned,
      country,
      city,
      deviceType
    } = body;

    // Always record to DB (even with no email — anonymous cart abandonment is still valuable)
    const { error: dbError } = await supabaseAdmin
      .from('checkout_abandonments')
      .insert({
        session_id: sessionId || uuidv4(),
        customer_email: customerEmail || null,
        customer_name: customerName || null,
        cart_items: cartItems || [],
        cart_total: parseFloat(cartTotal) || 0,
        currency: currency || 'USD',
        step_abandoned: stepAbandoned || 'unknown',
        customer_ip: req.ip,
        customer_country: country || null,
        customer_city: city || null,
        device_type: deviceType || null,
        user_agent: req.headers['user-agent'] || null
      });

    if (dbError) console.error('[Abandon] DB insert error:', dbError.message);

    // Fire email notification (non-blocking) — always fires, even for anonymous
    sendAbandonmentEmailHandler({
      customerEmail,
      customerName,
      cartItems,
      cartTotal,
      stepAbandoned
    });

    return res.status(200).json({ message: 'Recorded' });
  } catch (error) {
    console.error('Abandonment error:', error.message);
    return res.status(200).json({ message: 'OK' }); // Silent fail to not break UX
  }
});


// ================================
// POST /api/checkout/order
// Create new order (Stripe payment confirmed)
// ================================
router.post('/order',
  orderLimiter,
  [
    body('customerName').trim().notEmpty().withMessage('Name required'),
    body('customerEmail').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('shippingAddress').notEmpty().withMessage('Shipping address required'),
    body('items').isArray({ min: 1 }).withMessage('Cart must have items'),
    body('totalAmount').isNumeric().withMessage('Total amount required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        billingAddress,
        items,
        subtotal,
        shippingCost,
        discountAmount,
        discountCode,
        totalAmount,
        currency,
        country,
        city,
        paymentMethod,
        paymentStatus,   // 'paid' for confirmed payment, 'unpaid' otherwise
        transactionId
      } = req.body;

      // Generate order number
      const orderNumber = `PRO-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

      const { data: order, error } = await supabaseAdmin
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone || null,
          shipping_address: shippingAddress,
          billing_address: billingAddress || shippingAddress,
          items,
          subtotal: subtotal || totalAmount,
          shipping_cost: shippingCost || 0,
          discount_amount: discountAmount || 0,
          discount_code: discountCode || null,
          total_amount: totalAmount,
          currency: currency || 'USD',
          status: paymentStatus === 'paid' ? 'confirmed' : 'pending',
          payment_status: paymentStatus === 'paid' ? 'paid' : 'unpaid',
          payment_method: paymentMethod || 'Stripe',
          notes: transactionId ? `Stripe Transaction ID: ${transactionId}` : null,
          customer_ip: req.ip,
          customer_country: country ? (country === 'United States' ? 'USA' : country === 'United Kingdom' ? 'UK' : country === 'New Zealand' ? 'NZ' : country === 'South Africa' ? 'RSA' : country === 'Saudi Arabia' ? 'KSA' : country.substring(0, 10)) : null,
          customer_city: city ? city.substring(0, 50) : null
        })
        .select()
        .single();

      if (error) throw error;

      // Fire BOTH order confirmation emails (non-blocking)
      // Customer gets beautiful branded receipt, admin gets detailed alert
      sendOrderEmailsHandler({
        orderNumber: order.order_number,
        customerName,
        customerEmail,
        customerPhone: customerPhone || null,
        items,
        subtotal: subtotal || totalAmount,
        shippingCost: shippingCost || 0,
        discountAmount: discountAmount || 0,
        discountCode: discountCode || null,
        totalAmount,
        currency: currency || 'USD',
        shippingAddress,
        paymentMethod: paymentMethod || 'Stripe',
        customerCountry: country || null,
        customerCity: city || null,
        customerIp: req.ip,
        isDemoOrder: false
      });

      return res.status(201).json({
        message: 'Order created successfully',
        orderId: order.id,
        orderNumber: order.order_number
      });

    } catch (error) {
      console.error('Order error:', error.message);
      return res.status(500).json({ error: `Failed to create order: ${error.message}` });
    }
  }
);


// ================================
// POST /api/checkout/demo-order
// Create $0 demo order — no payment required
// Fires both customer and admin emails for testing
// ================================
router.post('/demo-order', orderLimiter, async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      shippingAddress,
      country,
      city
    } = req.body;

    if (!customerEmail) {
      return res.status(400).json({ error: 'Email is required to create a demo order.' });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const orderNumber = `PRO-DEMO-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const demoItems = [{ name: 'Procolored Demo Order (Testing Only)', quantity: 1, price: 0 }];

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: customerName || 'Demo Customer',
        customer_email: customerEmail,
        shipping_address: shippingAddress || {},
        items: demoItems,
        subtotal: 0,
        shipping_cost: 0,
        discount_amount: 0,
        total_amount: 0,
        currency: 'USD',
        status: 'confirmed',
        payment_status: 'paid',
        payment_method: 'Demo (No Payment)',
        customer_ip: req.ip,
        customer_country: country || null,
        customer_city: city || null,
        notes: 'Demo order — testing only — $0'
      })
      .select()
      .single();

    if (error) throw error;

    // Fire both emails for demo order — non-blocking, errors don't fail the order
    sendOrderEmailsHandler({
      orderNumber,
      customerName: customerName || 'Demo Customer',
      customerEmail,
      customerPhone: null,
      items: demoItems,
      subtotal: 0,
      shippingCost: 0,
      discountAmount: 0,
      discountCode: null,
      totalAmount: 0,
      currency: 'USD',
      shippingAddress: shippingAddress || {},
      paymentMethod: 'Demo (No Payment)',
      customerCountry: country || null,
      customerCity: city || null,
      customerIp: req.ip,
      isDemoOrder: true
    });

    return res.status(201).json({
      success: true,
      orderNumber,
      orderId: order.id,
      isDemoOrder: true
    });

  } catch (error) {
    console.error('Demo order error:', error.message);
    return res.status(500).json({ error: 'Failed to create demo order' });
  }
});

module.exports = router;
