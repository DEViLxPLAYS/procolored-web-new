const jwt = require('jsonwebtoken');
const { supabaseAdmin } = require('../config/supabase');

const authenticateAdmin = async (req, res, next) => {
  try {
    // Get token from httpOnly cookie or Authorization header
    const token = req.cookies.admin_token ||
      req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verify admin still exists and is active in database
    const { data: admin, error } = await supabaseAdmin
      .from('admin_users')
      .select('id, username, email, role, is_active, can_manage_keys')
      .eq('id', decoded.adminId)
      .eq('is_active', true)
      .single();

    if (error || !admin) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    req.admin = admin;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired. Please login again.' });
    }
    return res.status(500).json({ error: 'Authentication error' });
  }
};

const requireSuperAdmin = (req, res, next) => {
  if (req.admin?.role !== 'super_admin') {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  next();
};

module.exports = { authenticateAdmin, requireSuperAdmin };
