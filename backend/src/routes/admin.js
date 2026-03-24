const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabaseAdmin } = require('../config/supabase');
const { authenticateAdmin, requireSuperAdmin } = require('../middleware/auth');
const { adminLoginLimiter } = require('../middleware/rateLimit');

// ================================
// POST /api/admin/login
// ================================
router.post('/login', adminLoginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Find admin by username
    const { data: admin, error } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('username', username.toLowerCase().trim())
      .eq('is_active', true)
      .single();

    // Generic error — never reveal if user exists
    if (error || !admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if account is locked
    if (admin.locked_until && new Date(admin.locked_until) > new Date()) {
      return res.status(423).json({
        error: 'Account temporarily locked. Try again later.'
      });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, admin.password_hash);

    if (!passwordMatch) {
      // Increment login attempts
      const attempts = (admin.login_attempts || 0) + 1;
      const lockUntil = attempts >= 5
        ? new Date(Date.now() + 15 * 60 * 1000)
        : null;

      await supabaseAdmin
        .from('admin_users')
        .update({
          login_attempts: attempts,
          locked_until: lockUntil,
          updated_at: new Date()
        })
        .eq('id', admin.id);

      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Reset login attempts on success
    await supabaseAdmin
      .from('admin_users')
      .update({
        login_attempts: 0,
        locked_until: null,
        last_login: new Date(),
        updated_at: new Date()
      })
      .eq('id', admin.id);

    // Generate JWT
    const token = jwt.sign(
      {
        adminId: admin.id,
        username: admin.username,
        role: admin.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: parseInt(process.env.ADMIN_SESSION_EXPIRES) || 28800000
    });


    // Log admin activity
    await supabaseAdmin
      .from('admin_activity_logs')
      .insert({
        admin_id: admin.id,
        admin_username: admin.username,
        action: 'LOGIN',
        ip_address: req.ip,
        details: { success: true }
      });

    return res.status(200).json({
      message: 'Login successful',
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ error: 'Login failed' });
  }
});

// ================================
// POST /api/admin/logout
// ================================
router.post('/logout', authenticateAdmin, async (req, res) => {
  try {
    await supabaseAdmin
      .from('admin_activity_logs')
      .insert({
        admin_id: req.admin.id,
        admin_username: req.admin.username,
        action: 'LOGOUT',
        ip_address: req.ip
      });
  } catch (_) {}

  res.clearCookie('admin_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none'
  });

  return res.status(200).json({ message: 'Logged out successfully' });
});

// ================================
// GET /api/admin/me
// Validate session
// ================================
router.get('/me', authenticateAdmin, (req, res) => {
  return res.status(200).json({ admin: req.admin });
});

// ================================
// GET /api/admin/dashboard
// Returns all dashboard stats
// ================================
router.get('/dashboard', authenticateAdmin, async (req, res) => {
  try {
    const [
      newsletterResult,
      ordersResult,
      pendingOrdersResult,
      abandonmentsResult,
      recentOrdersResult,
      countryStatsResult,
      recentNewsletterResult,
      recentAbandonmentsResult
    ] = await Promise.all([
      supabaseAdmin
        .from('newsletter_subscribers')
        .select('id', { count: 'exact' })
        .eq('is_active', true),

      supabaseAdmin
        .from('orders')
        .select('id, total_amount, currency, status', { count: 'exact' }),

      supabaseAdmin
        .from('orders')
        .select('*', { count: 'exact' })
        .eq('status', 'pending'),

      supabaseAdmin
        .from('checkout_abandonments')
        .select('id', { count: 'exact' })
        .eq('recovered', false),

      supabaseAdmin
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10),

      supabaseAdmin
        .from('visitor_analytics')
        .select('country, country_name')
        .limit(1000),

      supabaseAdmin
        .from('newsletter_subscribers')
        .select('email, country, source, subscribed_at, discount_code, discount_used')
        .order('subscribed_at', { ascending: false })
        .limit(10),

      supabaseAdmin
        .from('checkout_abandonments')
        .select('*')
        .order('abandoned_at', { ascending: false })
        .limit(10)
    ]);

    // Calculate total revenue
    const totalRevenue = ordersResult.data
      ?.filter(o => o.status !== 'cancelled' && o.status !== 'refunded')
      .reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0) || 0;

    // Country breakdown
    const countryBreakdown = {};
    countryStatsResult.data?.forEach(v => {
      const key = v.country_name || v.country || 'Unknown';
      countryBreakdown[key] = (countryBreakdown[key] || 0) + 1;
    });

    return res.status(200).json({
      stats: {
        totalNewsletterSubscribers: newsletterResult.count || 0,
        totalOrders: ordersResult.count || 0,
        pendingOrders: pendingOrdersResult.count || 0,
        checkoutAbandonments: abandonmentsResult.count || 0,
        totalRevenue: totalRevenue.toFixed(2),
      },
      recentOrders: recentOrdersResult.data || [],
      recentSubscribers: recentNewsletterResult.data || [],
      recentAbandonments: recentAbandonmentsResult.data || [],
      visitorsByCountry: Object.entries(countryBreakdown)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([country, count]) => ({ country, count }))
    });

  } catch (error) {
    console.error('Dashboard error:', error.message);
    return res.status(500).json({ error: 'Failed to load dashboard data' });
  }
});

// ================================
// GET /api/admin/orders
// ================================
router.get('/orders', authenticateAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = supabaseAdmin
      .from('orders')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (status) query = query.eq('status', status);

    const { data, count, error } = await query;
    if (error) throw error;

    return res.status(200).json({
      orders: data,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit))
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// ================================
// PATCH /api/admin/orders/:id/status
// ================================
router.patch('/orders/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ status, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    await supabaseAdmin
      .from('admin_activity_logs')
      .insert({
        admin_id: req.admin.id,
        admin_username: req.admin.username,
        action: 'UPDATE_ORDER_STATUS',
        resource: 'orders',
        resource_id: id,
        details: { new_status: status },
        ip_address: req.ip
      });

    return res.status(200).json({ order: data });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update order' });
  }
});

// ================================
// GET /api/admin/newsletter
// ================================
router.get('/newsletter', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { data, count, error } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('*', { count: 'exact' })
      .order('subscribed_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (error) throw error;

    return res.status(200).json({
      subscribers: data,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit))
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

// ================================
// GET /api/admin/abandonments
// ================================
router.get('/abandonments', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { data, count, error } = await supabaseAdmin
      .from('checkout_abandonments')
      .select('*', { count: 'exact' })
      .order('abandoned_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (error) throw error;

    return res.status(200).json({
      abandonments: data,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit))
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch abandonments' });
  }
});

// ================================
// GET /api/admin/analytics
// ================================
router.get('/analytics', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { data, count, error } = await supabaseAdmin
      .from('visitor_analytics')
      .select('*', { count: 'exact' })
      .order('visited_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (error) throw error;

    return res.status(200).json({
      visitors: data,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit))
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// ================================
// POST /api/admin/create-admin
// super_admin only
// ================================
router.post('/create-admin', authenticateAdmin, requireSuperAdmin, async (req, res) => {
  try {
    const { username, email, password, role = 'admin' } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }

    if (password.length < 12) {
      return res.status(400).json({ error: 'Password must be at least 12 characters' });
    }

    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .insert({
        username: username.toLowerCase().trim(),
        email: email.toLowerCase().trim(),
        password_hash,
        role
      })
      .select('id, username, email, role')
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Username or email already exists' });
      }
      throw error;
    }

    await supabaseAdmin
      .from('admin_activity_logs')
      .insert({
        admin_id: req.admin.id,
        admin_username: req.admin.username,
        action: 'CREATE_ADMIN',
        resource: 'admin_users',
        resource_id: data.id,
        details: { new_admin_username: username },
        ip_address: req.ip
      });

    return res.status(201).json({
      message: 'Admin created successfully',
      admin: data
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create admin' });
  }
});

// ================================
// GET /api/admin/admins
// List all admins (super_admin only)
// ================================
router.get('/admins', authenticateAdmin, requireSuperAdmin, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .select('id, username, email, role, is_active, last_login, created_at, login_attempts')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({ admins: data });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch admins' });
  }
});

// ================================
// PATCH /api/admin/admins/:id
// Update admin (super_admin only)
// ================================
router.patch('/admins/:id', authenticateAdmin, requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role, is_active, password } = req.body;

    const updates = { updated_at: new Date() };
    if (username) updates.username = username.toLowerCase().trim();
    if (email) updates.email = email.toLowerCase().trim();
    if (role && ['admin', 'super_admin'].includes(role)) updates.role = role;
    if (typeof is_active === 'boolean') updates.is_active = is_active;
    if (password) {
      if (password.length < 12) {
        return res.status(400).json({ error: 'Password must be at least 12 characters' });
      }
      updates.password_hash = await bcrypt.hash(password, 12);
    }

    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .update(updates)
      .eq('id', id)
      .select('id, username, email, role, is_active, last_login, created_at')
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Username or email already exists' });
      }
      throw error;
    }

    await supabaseAdmin.from('admin_activity_logs').insert({
      admin_id: req.admin.id,
      admin_username: req.admin.username,
      action: 'UPDATE_ADMIN',
      resource: 'admin_users',
      resource_id: id,
      details: { fields_updated: Object.keys(updates).filter(k => k !== 'updated_at') },
      ip_address: req.ip
    });

    return res.status(200).json({ admin: data });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update admin' });
  }
});

// ================================
// DELETE /api/admin/admins/:id
// Soft delete admin (super_admin only)
// Cannot delete self or last super_admin
// ================================
router.delete('/admins/:id', authenticateAdmin, requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Cannot delete yourself
    if (id === req.admin.id) {
      return res.status(400).json({ error: 'You cannot delete your own account' });
    }

    // Check if target is a super_admin — ensure at least one remains
    const { data: targetAdmin } = await supabaseAdmin
      .from('admin_users')
      .select('role')
      .eq('id', id)
      .single();

    if (targetAdmin?.role === 'super_admin') {
      const { count } = await supabaseAdmin
        .from('admin_users')
        .select('id', { count: 'exact' })
        .eq('role', 'super_admin')
        .eq('is_active', true);

      if (count <= 1) {
        return res.status(400).json({ error: 'Cannot delete the last super admin account' });
      }
    }

    // Soft delete — set is_active = false
    const { error } = await supabaseAdmin
      .from('admin_users')
      .update({ is_active: false, updated_at: new Date() })
      .eq('id', id);

    if (error) throw error;

    await supabaseAdmin.from('admin_activity_logs').insert({
      admin_id: req.admin.id,
      admin_username: req.admin.username,
      action: 'DELETE_ADMIN',
      resource: 'admin_users',
      resource_id: id,
      ip_address: req.ip
    });

    return res.status(200).json({ message: 'Admin deactivated successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete admin' });
  }
});

// ================================
// POST /api/admin/admins/:id/reset-password
// Generate new random password (super_admin only)
// ================================
router.post('/admins/:id/reset-password', authenticateAdmin, requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Generate a strong random password
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let newPassword = '';
    for (let i = 0; i < 16; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const password_hash = await bcrypt.hash(newPassword, 12);

    const { error } = await supabaseAdmin
      .from('admin_users')
      .update({ password_hash, login_attempts: 0, locked_until: null, updated_at: new Date() })
      .eq('id', id);

    if (error) throw error;

    await supabaseAdmin.from('admin_activity_logs').insert({
      admin_id: req.admin.id,
      admin_username: req.admin.username,
      action: 'RESET_ADMIN_PASSWORD',
      resource: 'admin_users',
      resource_id: id,
      ip_address: req.ip
    });

    // Return plaintext password ONCE — never stored
    return res.status(200).json({ newPassword, message: 'Password reset. Show to admin once only.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to reset password' });
  }
});

// ================================
// GET /api/admin/dashboard
// Stats overview for dashboard cards
// ================================
router.get('/dashboard', authenticateAdmin, async (req, res) => {
  try {
    const [
      { count: totalOrders },
      { count: totalSubscribers },
      { count: checkoutAbandonments },
      { data: revenueData }
    ] = await Promise.all([
      supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('newsletter_subscribers').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabaseAdmin.from('checkout_abandonments').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('orders').select('total_amount').eq('payment_status', 'paid')
    ]);

    const totalRevenue = (revenueData || []).reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
    const { data: recentOrders } = await supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false }).limit(5);
    const { data: recentSubscribers } = await supabaseAdmin.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false }).limit(5);

    return res.status(200).json({
      stats: {
        totalOrders: totalOrders || 0,
        totalNewsletterSubscribers: totalSubscribers || 0,
        checkoutAbandonments: checkoutAbandonments || 0,
        totalRevenue: totalRevenue.toFixed(2),
      },
      recentOrders: recentOrders || [],
      recentSubscribers: recentSubscribers || [],
      visitorsByCountry: []
    });
  } catch (error) {
    console.error('Dashboard error:', error.message);
    return res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

// ================================
// GET /api/admin/orders
// List orders with pagination
// ================================
router.get('/orders', authenticateAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status || '';
    const offset = (page - 1) * limit;

    let query = supabaseAdmin.from('orders').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(offset, offset + limit - 1);
    if (status) query = query.eq('status', status);

    const { data: orders, count, error } = await query;
    if (error) throw error;

    return res.status(200).json({ orders: orders || [], total: count || 0, page, totalPages: Math.ceil((count || 0) / limit) });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// ================================
// PATCH /api/admin/orders/:id/status
// Update order status
// ================================
router.patch('/orders/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const valid = ['pending','confirmed','processing','shipped','delivered','cancelled','refunded'];
    if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });

    const { data: order, error } = await supabaseAdmin.from('orders').update({ status, updated_at: new Date() }).eq('id', id).select().single();
    if (error) throw error;
    return res.status(200).json({ order });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update order status' });
  }
});

// ================================
// GET /api/admin/newsletter
// List newsletter subscribers with pagination
// ================================
router.get('/newsletter', authenticateAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { data: subscribers, count, error } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('*', { count: 'exact' })
      .order('subscribed_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return res.status(200).json({ subscribers: subscribers || [], total: count || 0, page, totalPages: Math.ceil((count || 0) / limit) });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

// ================================
// GET /api/admin/abandonments
// List checkout abandonments with pagination
// ================================
router.get('/abandonments', authenticateAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { data: abandonments, count, error } = await supabaseAdmin
      .from('checkout_abandonments')
      .select('*', { count: 'exact' })
      .order('abandoned_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return res.status(200).json({ abandonments: abandonments || [], total: count || 0, page, totalPages: Math.ceil((count || 0) / limit) });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch abandonments' });
  }
});

// ================================
// GET /api/admin/verify
// Lightweight session check — used by dashboard on load
// ================================
router.get('/verify', authenticateAdmin, (req, res) => {
  return res.status(200).json({
    valid: true,
    admin: {
      id: req.admin.id,
      username: req.admin.username,
      email: req.admin.email,
      role: req.admin.role
    }
  });
});

module.exports = router;
