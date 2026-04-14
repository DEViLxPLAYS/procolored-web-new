const { authenticateAdmin } = require('./auth');
const { supabaseAdmin } = require('../config/supabase');

const keyAuth = [
  authenticateAdmin,
  (req, res, next) => {
    // Only super_admin or admins with can_manage_keys=true can proceed
    if (req.admin.role !== 'super_admin' && req.admin.can_manage_keys !== true) {
      return res.status(403).json({ error: 'Access denied: insufficient permissions' });
    }

    // Fire-and-forget activity log — NEVER block or crash on log failure
    supabaseAdmin.from('admin_activity_logs').insert([{
      admin_id: req.admin.id,
      admin_username: req.admin.username,
      action: `${req.method} ${req.originalUrl}`,
      ip_address: req.ip || (req.connection && req.connection.remoteAddress),
      created_at: new Date().toISOString()
    }]).then(() => {}).catch(err => {
      console.error('[keyAuth] Activity log insert failed (non-fatal):', err.message);
    });

    next();
  }
];

module.exports = keyAuth;
