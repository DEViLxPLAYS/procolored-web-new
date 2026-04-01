const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const api = {
  // Newsletter signup
  subscribeNewsletter: async (email: string, country?: string, city?: string, source: string = 'popup') => {
    const res = await fetch(`${API_BASE}/api/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, country, city, source })
    });
    return res.json();
  },

  // Contact form submission
  submitContactForm: async (data: object) => {
    const res = await fetch(`${API_BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Track checkout abandonment
  trackAbandonment: async (data: object) => {
    try {
      await fetch(`${API_BASE}/api/checkout/abandon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (_) {}
  },

  // Create order
  createOrder: async (orderData: object) => {
    const res = await fetch(`${API_BASE}/api/checkout/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return res.json();
  },

  // Track page visit
  trackVisit: async (data: object) => {
    try {
      await fetch(`${API_BASE}/api/analytics/visit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (_) {}
  },

  // ================================
  // Admin API calls
  // ================================
  admin: {
    login: async (username: string, password: string) => {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });
      return res.json();
    },

    logout: async () => {
      const res = await fetch(`${API_BASE}/api/admin/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      return res.json();
    },

    me: async () => {
      const res = await fetch(`${API_BASE}/api/admin/me`, {
        credentials: 'include'
      });
      return res.json();
    },

    dashboard: async () => {
      const res = await fetch(`${API_BASE}/api/admin/dashboard`, {
        credentials: 'include'
      });
      return res.json();
    },

    orders: async (page = 1, status = '') => {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (status) params.set('status', status);
      const res = await fetch(`${API_BASE}/api/admin/orders?${params}`, {
        credentials: 'include'
      });
      return res.json();
    },

    updateOrderStatus: async (id: string, status: string) => {
      const res = await fetch(`${API_BASE}/api/admin/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status })
      });
      return res.json();
    },

    newsletter: async (page = 1) => {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      const res = await fetch(`${API_BASE}/api/admin/newsletter?${params}`, {
        credentials: 'include'
      });
      return res.json();
    },

    abandonments: async (page = 1) => {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      const res = await fetch(`${API_BASE}/api/admin/abandonments?${params}`, {
        credentials: 'include'
      });
      return res.json();
    },

    createAdmin: async (data: { username: string; email: string; password: string; role: string }) => {
      const res = await fetch(`${API_BASE}/api/admin/create-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      return res.json();
    },

    admins: async () => {
      const res = await fetch(`${API_BASE}/api/admin/admins`, {
        credentials: 'include'
      });
      return res.json();
    },

    updateAdmin: async (id: string, data: object) => {
      const res = await fetch(`${API_BASE}/api/admin/admins/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      return res.json();
    },

    deleteAdmin: async (id: string) => {
      const res = await fetch(`${API_BASE}/api/admin/admins/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      return res.json();
    },

    resetAdminPassword: async (id: string) => {
      const res = await fetch(`${API_BASE}/api/admin/admins/${id}/reset-password`, {
        method: 'POST',
        credentials: 'include'
      });
      return res.json();
    },

    // ================================
    // Payment Gateway Keys
    // ================================
    paymentKeys: {
      list: async () => {
        const res = await fetch(`${API_BASE}/api/admin/payment-keys`, { credentials: 'include' });
        if (!res.ok) return { error: 'Failed to load keys' };
        return res.json();
      },
      add: async (data: { gateway: string; key_name: string; key_value: string; admin_password: string }) => {
        const res = await fetch(`${API_BASE}/api/admin/payment-keys`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(data)
        });
        return res.json();
      },
      reveal: async (id: string, admin_password: string) => {
        const res = await fetch(`${API_BASE}/api/admin/payment-keys/${id}/reveal`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ admin_password })
        });
        return res.json();
      },
      delete: async (id: string) => {
        const res = await fetch(`${API_BASE}/api/admin/payment-keys/${id}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        return res.json();
      }
    }
  }
};
