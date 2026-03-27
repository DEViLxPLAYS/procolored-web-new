const express = require('express');
const bcrypt = require('bcryptjs');
const { supabaseAdmin } = require('../config/supabase');
const { encrypt, decrypt } = require('../utils/encryption');
const keyAuth = require('../middleware/keyAuth');

const router = express.Router();

// Apply auth middleare
router.use(keyAuth);

// GET /api/admin/payment-keys
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('payment_gateway_keys')
      .select('id, gateway, key_name, updated_at, updated_by')
      .eq('is_active', true);

    if (error) {
      return res.status(500).json({ error: 'Something went wrong' });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// POST /api/admin/payment-keys
router.post('/', async (req, res) => {
  try {
    const { gateway, key_name, key_value, admin_password } = req.body;

    // Verify admin_password against current admin's hashed password
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('admin_users')
      .select('password_hash')
      .eq('id', req.admin.id)
      .single();

    if (adminError || !adminData) {
      return res.status(500).json({ error: 'Something went wrong' });
    }

    const isMatch = await bcrypt.compare(admin_password, adminData.password_hash);
    if (!isMatch) {
      await supabaseAdmin.from('admin_activity_logs').insert([{
        admin_id: req.admin.id,
        action: 'Failed payment key creation: Invalid password',
        ip_address: req.ip || req.connection.remoteAddress,
        created_at: new Date().toISOString()
      }]);
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Encrypt key
    const { encryptedValue, iv } = encrypt(key_value);

    // Save
    const { error: insertError } = await supabaseAdmin
      .from('payment_gateway_keys')
      .insert([{
        gateway,
        key_name,
        encrypted_value: encryptedValue,
        iv,
        updated_by: req.admin.id
      }]);

    if (insertError) {
      return res.status(500).json({ error: 'Something went wrong' });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// POST /api/admin/payment-keys/:id/reveal
router.post('/:id/reveal', async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_password } = req.body;

    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('admin_users')
      .select('password_hash')
      .eq('id', req.admin.id)
      .single();

    if (adminError || !adminData) {
      return res.status(500).json({ error: 'Something went wrong' });
    }

    const isMatch = await bcrypt.compare(admin_password, adminData.password_hash);
    if (!isMatch) {
      await supabaseAdmin.from('admin_activity_logs').insert([{
        admin_id: req.admin.id,
        action: `Failed key reveal for id ${id}: Invalid password`,
        ip_address: req.ip || req.connection.remoteAddress,
        created_at: new Date().toISOString()
      }]);
      return res.status(401).json({ error: 'Invalid password' });
    }

    const { data: keyData, error: keyError } = await supabaseAdmin
      .from('payment_gateway_keys')
      .select('encrypted_value, iv')
      .eq('id', id)
      .single();

    if (keyError || !keyData) {
      return res.status(500).json({ error: 'Something went wrong' });
    }

    const decryptedKey = decrypt(keyData.encrypted_value, keyData.iv);

    await supabaseAdmin.from('admin_activity_logs').insert([{
      admin_id: req.admin.id,
      action: `Revealed payment key id: ${id}`,
      ip_address: req.ip || req.connection.remoteAddress,
      created_at: new Date().toISOString()
    }]);

    res.json({ key_value: decryptedKey });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// DELETE /api/admin/payment-keys/:id
router.delete('/:id', async (req, res) => {
  try {
    if (req.admin.role !== 'super_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { id } = req.params;

    const { error: updateError } = await supabaseAdmin
      .from('payment_gateway_keys')
      .update({ is_active: false })
      .eq('id', id);

    if (updateError) {
      return res.status(500).json({ error: 'Something went wrong' });
    }

    await supabaseAdmin.from('admin_activity_logs').insert([{
      admin_id: req.admin.id,
      action: `Deleted payment key id: ${id}`,
      ip_address: req.ip || req.connection.remoteAddress,
      created_at: new Date().toISOString()
    }]);

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
