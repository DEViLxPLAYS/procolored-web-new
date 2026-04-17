const express = require('express');
const bcrypt = require('bcryptjs');
const { supabaseAdmin } = require('../config/supabase');
const { encrypt, decrypt } = require('../utils/encryption');
const keyAuth = require('../middleware/keyAuth');

const router = express.Router();

// Apply auth middleware
router.use(keyAuth);

// ── Helper: verify admin password ─────────────────────────────────────────────
async function verifyAdminPassword(adminId, password, ip) {
  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .select('password_hash')
    .eq('id', adminId)
    .single();

  if (error || !data) return false;

  const isMatch = await bcrypt.compare(password, data.password_hash);
  if (!isMatch) {
    await supabaseAdmin.from('admin_activity_logs').insert([{
      admin_id: adminId,
      action: 'Failed payment key action: Invalid password',
      ip_address: ip,
      created_at: new Date().toISOString()
    }]);
  }
  return isMatch;
}

// ── Helper: upsert ui_enabled key for a gateway ───────────────────────────────
async function setGatewayUiEnabled(gateway, enabled, adminId) {
  const keyName = `${gateway}_ui_enabled`;
  const value = enabled ? 'true' : 'false';
  const { encryptedValue, iv } = encrypt(value);

  // Delete any existing ui_enabled key first
  await supabaseAdmin
    .from('payment_gateway_keys')
    .update({ is_active: false })
    .eq('gateway', gateway)
    .eq('key_name', keyName);

  // Insert fresh
  await supabaseAdmin.from('payment_gateway_keys').insert([{
    gateway,
    key_name: keyName,
    encrypted_value: encryptedValue,
    iv,
    updated_by: adminId || null,
  }]);
}

// ── Helper: check if any non-toggle keys exist for gateway ────────────────────
async function hasActiveKeysForGateway(gateway) {
  const { data } = await supabaseAdmin
    .from('payment_gateway_keys')
    .select('id')
    .eq('gateway', gateway)
    .eq('is_active', true)
    .not('key_name', 'like', '%_ui_enabled');

  return data && data.length > 0;
}

// GET /api/admin/payment-keys
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('payment_gateway_keys')
      .select('id, gateway, key_name, updated_at, updated_by')
      .eq('is_active', true);

    if (error) return res.status(500).json({ error: 'Something went wrong' });
    res.json(data);
  } catch (err) {
    console.error('[payment-keys GET] Error:', err.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// POST /api/admin/payment-keys
router.post('/', async (req, res) => {
  try {
    const { gateway, key_name, key_value, admin_password } = req.body;

    const valid = await verifyAdminPassword(req.admin.id, admin_password, req.ip || req.connection.remoteAddress);
    if (!valid) return res.status(401).json({ error: 'Invalid password' });

    // ── Auto-delete old key with same gateway + key_name ─────────────────────
    await supabaseAdmin
      .from('payment_gateway_keys')
      .update({ is_active: false })
      .eq('gateway', gateway)
      .eq('key_name', key_name);

    // ── Encrypt and insert new key ────────────────────────────────────────────
    const { encryptedValue, iv } = encrypt(key_value);
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
      console.error('[payment-keys POST] Insert error:', insertError.message);
      return res.status(500).json({ error: 'Something went wrong' });
    }

    // ── Auto-enable UI for this gateway ──────────────────────────────────────
    await setGatewayUiEnabled(gateway, true, req.admin.id);

    await supabaseAdmin.from('admin_activity_logs').insert([{
      admin_id: req.admin.id,
      action: `Added payment key: ${gateway}/${key_name}`,
      ip_address: req.ip || req.connection.remoteAddress,
      created_at: new Date().toISOString()
    }]);

    res.json({ success: true });
  } catch (err) {
    console.error('[payment-keys POST] Error:', err.message, err.stack);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// POST /api/admin/payment-keys/toggle-ui  ← must come BEFORE /:id routes
router.post('/toggle-ui', async (req, res) => {
  try {
    const { gateway, enabled, admin_password } = req.body;

    if (!gateway || typeof enabled !== 'boolean') {
      return res.status(400).json({ error: 'gateway and enabled (boolean) are required' });
    }

    const valid = await verifyAdminPassword(req.admin.id, admin_password, req.ip || req.connection.remoteAddress);
    if (!valid) return res.status(401).json({ error: 'Invalid password' });

    // Check gateway has at least one real key before enabling
    if (enabled) {
      const hasKeys = await hasActiveKeysForGateway(gateway);
      if (!hasKeys) {
        return res.status(400).json({ error: `No active keys found for ${gateway}. Add keys first.` });
      }
    }

    await setGatewayUiEnabled(gateway, enabled, req.admin.id);

    await supabaseAdmin.from('admin_activity_logs').insert([{
      admin_id: req.admin.id,
      action: `Toggled ${gateway} UI: ${enabled ? 'ON' : 'OFF'}`,
      ip_address: req.ip || req.connection.remoteAddress,
      created_at: new Date().toISOString()
    }]);

    res.json({ success: true });
  } catch (err) {
    console.error('[payment-keys toggle-ui] Error:', err.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// POST /api/admin/payment-keys/:id/reveal
router.post('/:id/reveal', async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_password } = req.body;

    const valid = await verifyAdminPassword(req.admin.id, admin_password, req.ip || req.connection.remoteAddress);
    if (!valid) return res.status(401).json({ error: 'Invalid password' });

    const { data: keyData, error: keyError } = await supabaseAdmin
      .from('payment_gateway_keys')
      .select('encrypted_value, iv')
      .eq('id', id)
      .single();

    if (keyError || !keyData) return res.status(500).json({ error: 'Something went wrong' });

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

    // First, get the gateway of the key being deleted
    const { data: keyInfo } = await supabaseAdmin
      .from('payment_gateway_keys')
      .select('gateway, key_name')
      .eq('id', id)
      .single();

    // Deactivate the key
    const { error: updateError } = await supabaseAdmin
      .from('payment_gateway_keys')
      .update({ is_active: false })
      .eq('id', id);

    if (updateError) return res.status(500).json({ error: 'Something went wrong' });

    // ── Cascade: if no real keys remain, also disable UI toggle ──────────────
    if (keyInfo && !keyInfo.key_name.endsWith('_ui_enabled')) {
      const hasKeys = await hasActiveKeysForGateway(keyInfo.gateway);
      if (!hasKeys) {
        await supabaseAdmin
          .from('payment_gateway_keys')
          .update({ is_active: false })
          .eq('gateway', keyInfo.gateway)
          .eq('key_name', `${keyInfo.gateway}_ui_enabled`);
      }
    }

    await supabaseAdmin.from('admin_activity_logs').insert([{
      admin_id: req.admin.id,
      action: `Deleted payment key id: ${id}`,
      ip_address: req.ip || req.connection.remoteAddress,
      created_at: new Date().toISOString()
    }]);

    res.json({ success: true });
  } catch (err) {
    console.error('[payment-keys DELETE] Error:', err.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
