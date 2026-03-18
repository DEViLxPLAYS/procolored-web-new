const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth');
const { supabaseAdmin } = require('../config/supabase');

// Public orders routes (for order confirmation lookup)
// GET /api/orders/:orderNumber - look up order by order number (for confirmation page)
router.get('/:orderNumber', async (req, res) => {
  try {
    const { orderNumber } = req.params;

    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('order_number, customer_name, customer_email, status, payment_status, total_amount, currency, created_at')
      .eq('order_number', orderNumber)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Return limited data only — no sensitive info
    return res.status(200).json({ order: data });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch order' });
  }
});

module.exports = router;
