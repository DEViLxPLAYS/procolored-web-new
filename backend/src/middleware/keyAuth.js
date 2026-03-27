const { authenticateAdmin } = require('./auth');
const { supabaseAdmin } = require('../config/supabase');

const keyAuth = [
  authenticateAdmin,
  async (req, res, next) => {
    try {
      if (req.admin.role !== 'super_admin' && req.admin.can_manage_keys !== true) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Log the activity
      const logData = {
        admin_id: req.admin.id,
        action: `Requested ${req.method} ${req.originalUrl}`,
        ip_address: req.ip || req.connection.remoteAddress,
        created_at: new Date().toISOString()
      };

      await supabaseAdmin.from('admin_activity_logs').insert([logData]);

      next();
    } catch (err) {
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }
];

module.exports = keyAuth;
