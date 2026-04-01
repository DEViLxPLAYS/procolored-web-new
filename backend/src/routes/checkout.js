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
// ================================
router.post('/abandon', checkoutLimiter, async (req, res) => {
  try {
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
    } = req.body;

    await supabaseAdmin
      .from('checkout_abandonments')
      .insert({
        session_id: sessionId || uuidv4(),
        customer_email: customerEmail || null,
        customer_name: customerName || null,
        cart_items: cartItems || [],
        cart_total: cartTotal || 0,
        currency: currency || 'USD',
        step_abandoned: stepAbandoned || 'unknown',
        customer_ip: req.ip,
        customer_country: country || null,
        customer_city: city || null,
        device_type: deviceType || null,
        user_agent: req.headers['user-agent'] || null
      });

    // Fire email notification (non-blocking)
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
// Create new order
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
        paymentStatus,   // 'paid' for PayPal confirmed, 'unpaid' otherwise
        transactionId
      } = req.body;

      // Generate order number
      const orderNumber = `PRO-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

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
          payment_method: paymentMethod || 'Credit Card',
          transaction_id: transactionId || null,
          customer_ip: req.ip,
          customer_country: country ? (country === 'United States' ? 'USA' : country === 'United Kingdom' ? 'UK' : country === 'New Zealand' ? 'NZ' : country === 'South Africa' ? 'RSA' : country === 'Saudi Arabia' ? 'KSA' : country.substring(0, 10)) : null,
          customer_city: city ? city.substring(0, 50) : null
        })
        .select()
        .single();

      if (error) throw error;

      // Fire order confirmation email (non-blocking) - this handles BOTH customer receipt and admin alert
      sendOrderEmailsHandler({
        orderNumber: order.order_number,
        customerName,
        customerEmail,
        items,
        totalAmount,
        currency: currency || 'USD',
        shippingAddress
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

module.exports = router;
