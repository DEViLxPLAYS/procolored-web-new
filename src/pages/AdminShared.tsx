import React, { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';

// ── Brand colors ──────────────────────────────────────────
const C = {
  red: '#E8272A',
  orange: '#F5A623',
  white: '#FFFFFF',
  surface: '#F7F7F7',
  border: '#E5E7EB',
  text: '#1A1A1A',
  muted: '#6B7280',
  success: '#10B981',
  danger: '#E8272A',
};

// ── Types ─────────────────────────────────────────────────
export interface AdminUser { id: string; username: string; email: string; role: string; is_active: boolean; can_manage_keys?: boolean; last_login?: string; created_at: string; login_attempts?: number; }
export interface ToastItem { id: number; msg: string; type: 'success' | 'error'; }

// ── Utility ───────────────────────────────────────────────
export const fmtDate = (d?: string) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';
export const fmtDateTime = (d?: string) => d ? new Date(d).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

export const genPassword = () => {
  const up = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', lo = 'abcdefghijklmnopqrstuvwxyz', di = '0123456789', sy = '!@#$%^&*';
  const all = up + lo + di + sy;
  let p = up[Math.floor(Math.random() * 26)] + lo[Math.floor(Math.random() * 26)] + di[Math.floor(Math.random() * 10)] + sy[Math.floor(Math.random() * 8)];
  for (let i = 4; i < 16; i++) p += all[Math.floor(Math.random() * all.length)];
  return p.split('').sort(() => Math.random() - 0.5).join('');
};

export const pwStrength = (p: string): { label: string; color: string; pct: number } => {
  let s = 0;
  if (p.length >= 8) s++; if (p.length >= 12) s++;
  if (/[A-Z]/.test(p)) s++; if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++;
  if (s <= 2) return { label: 'Weak', color: C.danger, pct: 33 };
  if (s <= 3) return { label: 'Medium', color: C.orange, pct: 66 };
  return { label: 'Strong', color: C.success, pct: 100 };
};

// ── 5-second live polling hook ─────────────────────────────
export function useLivePoll(fn: () => Promise<void>, intervalMs = 5000) {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  useEffect(() => {
    const id = setInterval(() => { fnRef.current(); }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
}

// ── Toast System ──────────────────────────────────────────
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const add = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);
  return { toasts, toast: add };
};

export const ToastContainer = ({ toasts }: { toasts: ToastItem[] }) => (
  <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
    {toasts.map(t => (
      <div key={t.id} style={{ background: t.type === 'success' ? C.success : C.danger, color: '#fff', padding: '12px 18px', borderRadius: 8, fontSize: 14, fontWeight: 500, boxShadow: '0 4px 16px rgba(0,0,0,0.15)', minWidth: 260, animation: 'slideIn 0.3s ease' }}>
        {t.type === 'success' ? '✅ ' : '❌ '}{t.msg}
      </div>
    ))}
  </div>
);

// ── Modal Shell ───────────────────────────────────────────
export const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
  <div onClick={e => { if ((e.target as HTMLElement).classList.contains('modal-overlay')) onClose(); }}
    className="modal-overlay"
    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
    <div style={{ background: C.white, borderRadius: 12, width: '100%', maxWidth: 520, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
      <div style={{ background: C.red, color: '#fff', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: 16 }}>{title}</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>×</button>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  </div>
);

// ── Shared input style ─────────────────────────────────────
export const inp: React.CSSProperties = { width: '100%', border: `1px solid ${C.border}`, borderRadius: 6, padding: '10px 12px', fontSize: 14, color: C.text, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
export const lbl: React.CSSProperties = { display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: C.text };

// ── Status badge colors ────────────────────────────────────
const ORDER_STATUS_COLOR: Record<string, { bg: string; color: string }> = {
  pending: { bg: '#FEF3C7', color: '#D97706' },
  confirmed: { bg: '#DBEAFE', color: '#1D4ED8' },
  processing: { bg: '#EDE9FE', color: '#7C3AED' },
  shipped: { bg: '#CFFAFE', color: '#0E7490' },
  delivered: { bg: '#D1FAE5', color: '#065F46' },
  cancelled: { bg: '#FEE2E2', color: '#DC2626' },
  refunded: { bg: '#F3F4F6', color: '#374151' },
};

// ── Stat Card ─────────────────────────────────────────────
export const StatCard = ({ icon, label, value, sub, accent }: { icon: string; label: string; value: string | number; sub?: string; accent: string }) => (
  <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20, borderTop: `3px solid ${accent}` }}>
    <div style={{ fontSize: 28, marginBottom: 6 }}>{icon}</div>
    <div style={{ fontSize: 28, fontWeight: 800, color: C.text }}>{value}</div>
    <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{label}</div>
    {sub && <div style={{ fontSize: 12, color: accent, marginTop: 4, fontWeight: 600 }}>{sub}</div>}
  </div>
);

// ── Pagination ────────────────────────────────────────────
export const Pagination = ({ page, totalPages, onPage }: { page: number; totalPages: number; onPage: (p: number) => void }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
    <button disabled={page <= 1} onClick={() => onPage(page - 1)} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 6, padding: '6px 14px', cursor: page <= 1 ? 'not-allowed' : 'pointer', color: C.text, fontSize: 13, opacity: page <= 1 ? 0.5 : 1 }}>← Prev</button>
    <span style={{ fontSize: 13, color: C.muted }}>Page {page} of {totalPages || 1}</span>
    <button disabled={page >= totalPages} onClick={() => onPage(page + 1)} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 6, padding: '6px 14px', cursor: page >= totalPages ? 'not-allowed' : 'pointer', color: C.text, fontSize: 13, opacity: page >= totalPages ? 0.5 : 1 }}>Next →</button>
  </div>
);

// ── Spinner ────────────────────────────────────────────────
export const Spinner = () => (
  <div style={{ textAlign: 'center', padding: 40, color: C.muted }}>
    <div style={{ width: 36, height: 36, border: `3px solid ${C.border}`, borderTop: `3px solid ${C.red}`, borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 12px' }} />
    Loading...
  </div>
);

// ── Live indicator dot ─────────────────────────────────────
const LiveDot = () => (
  <span title="Live — updates every 5 seconds" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: C.success, fontWeight: 600, marginLeft: 8 }}>
    <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.success, display: 'inline-block', animation: 'pulse 1.5s ease-in-out infinite' }} />
    LIVE
  </span>
);

// ── Orders section ─────────────────────────────────────────
// ── Invoice Modal ─────────────────────────────────────────
const InvoiceModal = ({ order, onClose }: { order: any; onClose: () => void }) => {
  const addr = (a: any) => {
    if (!a) return 'N/A';
    if (typeof a === 'string') return a;
    const { street = a.address || '', apartment = '', city = '', state = '', postalCode = a.postal || '', country = '' } = a;
    return [street, apartment, [city, state, postalCode].filter(Boolean).join(', '), country].filter(Boolean).join('\n');
  };

  const items: any[] = Array.isArray(order.items) ? order.items : [];
  const subtotal = items.reduce((s: number, i: any) => s + parseFloat(i.price || 0) * (i.quantity || 1), 0);
  const discount = parseFloat(order.discount_amount || 0);
  const total = parseFloat(order.total_amount || 0);

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 680, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}
      >
        {/* Invoice content */}
        <div id="invoice-print-area" style={{ padding: '40px 48px', fontFamily: 'Inter,system-ui,sans-serif' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36 }}>
            <div>
              <img src="https://i.postimg.cc/SKh71Rmm/logo.webp" alt="Procolored" style={{ height: 44, objectFit: 'contain', marginBottom: 8 }} />
              <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.6 }}>procolored-us.com<br />support@procollored.com</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: '#1a1a1a', letterSpacing: -1 }}>INVOICE</div>
              <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
                <strong style={{ color: '#1a1a1a' }}>#{order.order_number}</strong>
              </div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{fmtDate(order.created_at)}</div>
              <div style={{ marginTop: 8 }}>
                <span style={{ background: order.payment_status === 'paid' ? '#D1FAE5' : '#FEF3C7', color: order.payment_status === 'paid' ? '#065F46' : '#D97706', borderRadius: 20, padding: '3px 12px', fontSize: 11, fontWeight: 700 }}>
                  {(order.payment_status || 'PENDING').toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Bill To / Ship To */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Bill To</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>{order.customer_name}</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>{order.customer_email}</div>
              {order.customer_phone && <div style={{ fontSize: 13, color: '#6b7280' }}>{order.customer_phone}</div>}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Ship To</div>
              <pre style={{ fontFamily: 'inherit', fontSize: 13, color: '#1a1a1a', margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{addr(order.shipping_address)}</pre>
            </div>
          </div>

          {/* Payment Info */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Payment Method</div>
            <div style={{ fontSize: 13, color: '#1a1a1a' }}>{order.payment_method || 'N/A'}</div>
          </div>

          {/* Items table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                {['Product', 'Qty', 'Unit Price', 'Total'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: h === 'Product' ? 'left' : 'right', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.length ? items.map((item: any, i: number) => (
                <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px 12px', fontSize: 13, color: '#1a1a1a', fontWeight: 500 }}>{item.name}</td>
                  <td style={{ padding: '12px 12px', fontSize: 13, color: '#6b7280', textAlign: 'right' }}>{item.quantity || 1}</td>
                  <td style={{ padding: '12px 12px', fontSize: 13, color: '#6b7280', textAlign: 'right' }}>${parseFloat(item.price || 0).toFixed(2)}</td>
                  <td style={{ padding: '12px 12px', fontSize: 13, fontWeight: 700, color: '#1a1a1a', textAlign: 'right' }}>${(parseFloat(item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
                </tr>
              )) : (
                <tr><td colSpan={4} style={{ padding: 16, textAlign: 'center', color: '#6b7280' }}>No items</td></tr>
              )}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: 260 }}>
              {[
                { label: 'Subtotal', val: `$${subtotal.toFixed(2)}` },
                { label: 'Shipping', val: 'FREE', green: true },
                ...(discount > 0 ? [{ label: `Discount${order.discount_code ? ` (${order.discount_code})` : ''}`, val: `-$${discount.toFixed(2)}`, red: true }] : []),
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13, color: '#6b7280' }}>
                  <span>{row.label}</span>
                  <span style={{ fontWeight: 600, color: (row as any).green ? '#10b981' : (row as any).red ? '#dc2626' : '#1a1a1a' }}>{row.val}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', borderTop: '2px solid #1a1a1a', fontSize: 16, fontWeight: 800, color: '#1a1a1a', marginTop: 6 }}>
                <span>Total</span>
                <span>{order.currency || 'USD'} {total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid #e5e7eb', textAlign: 'center', fontSize: 12, color: '#6b7280', lineHeight: 1.8 }}>
            Thank you for your order! Questions? Contact us at <strong>support@procollored.com</strong>
          </div>
        </div>

        {/* Modal actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '16px 48px 24px', borderTop: '1px solid #e5e7eb' }}>
          <button onClick={onClose} style={{ border: `1px solid ${C.border}`, background: '#fff', color: C.text, borderRadius: 6, padding: '10px 20px', cursor: 'pointer', fontWeight: 500 }}>Close</button>
          <button
            onClick={() => {
              const w = window.open('', '_blank', 'width=800,height=900');
              if (!w) return;
              const area = document.getElementById('invoice-print-area');
              w.document.write(`<html><head><title>Invoice #${order.order_number}</title><style>body{font-family:Inter,system-ui,sans-serif;margin:0;padding:32px}table{border-collapse:collapse;width:100%}th,td{padding:10px 12px}@media print{button{display:none}}</style></head><body>${area?.innerHTML || ''}<script>window.print();window.onafterprint=()=>window.close();</script></body></html>`);
              w.document.close();
            }}
            style={{ background: C.red, color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', cursor: 'pointer', fontWeight: 700 }}
          >🖨 Print / Save PDF</button>
        </div>
      </div>
    </div>
  );
};

export const OrdersTab = ({ toast }: { toast: (msg: string, type?: 'success' | 'error') => void }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<any>(null);
  const prevTotalRef = useRef<number>(0);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    const d = await api.admin.orders(page, statusFilter);
    const incoming: any[] = d.orders || [];
    setOrders(prev => {
      const prevIds = new Set(prev.map((o: any) => o.id));
      const fresh = incoming.filter(o => !prevIds.has(o.id));
      if (fresh.length > 0) {
        const ids = new Set(fresh.map((o: any) => o.id));
        setNewIds(ids);
        setTimeout(() => setNewIds(new Set()), 4000);
        if (prevTotalRef.current > 0) toast(`📦 New order placed!`);
      }
      return incoming;
    });
    setTotal(d.total || 0); setTotalPages(d.totalPages || 1);
    prevTotalRef.current = d.total || 0;
    if (!silent) setLoading(false);
  }, [page, statusFilter, toast]);

  useEffect(() => { load(); }, [load]);
  useLivePoll(() => load(true)); // 5s background refresh

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    const d = await api.admin.updateOrderStatus(id, status);
    if (d.order) { toast('Order status updated'); load(true); }
    else toast(d.error || 'Failed to update', 'error');
    setUpdating(null);
  };

  const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

  const fmtAddr = (addr: any) => {
    if (!addr) return '—';
    if (typeof addr === 'string') return addr;
    const { firstName = '', lastName = '', address = '', apartment = '', city = '', state = '', postal = '', country = '' } = addr;
    const parts = [
      [firstName, lastName].filter(Boolean).join(' '),
      [address, apartment].filter(Boolean).join(', '),
      [city, state, postal].filter(Boolean).join(', '),
      country,
    ].filter(Boolean);
    return parts.join('\n');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text }}>Orders <span style={{ background: `${C.red}15`, color: C.red, borderRadius: 20, padding: '2px 10px', fontSize: 13 }}>{total}</span><LiveDot /></h2>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} style={{ ...inp, width: 'auto', padding: '8px 14px' }}>
          <option value=''>All Statuses</option>
          {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>
      {loading ? <Spinner /> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead><tr style={{ background: C.surface }}>
              {['Order #', 'Customer', 'Email', 'Items', 'Total', 'Status', 'Payment', 'Date', 'Update', ''].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap', borderBottom: `1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {!orders.length ? <tr><td colSpan={10} style={{ textAlign: 'center', padding: 40, color: C.muted }}>No orders found</td></tr>
                : orders.map(o => (
                  <React.Fragment key={o.id}>
                    <tr style={{ borderBottom: `1px solid ${C.border}`, background: newIds.has(o.id) ? '#D1FAE5' : 'transparent', transition: 'background 1s ease' }}>
                      <td style={{ padding: '10px 12px' }}><code style={{ background: C.surface, padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>{o.order_number}</code></td>
                      <td style={{ padding: '10px 12px', fontWeight: 500 }}>{o.customer_name}</td>
                      <td style={{ padding: '10px 12px', color: C.muted, fontSize: 12 }}>{o.customer_email}</td>
                      <td style={{ padding: '10px 12px', color: C.muted }}>{Array.isArray(o.items) ? o.items.length : 0}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 700 }}>{o.currency} {parseFloat(o.total_amount || 0).toLocaleString()}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ background: (ORDER_STATUS_COLOR[o.status] || { bg: C.surface }).bg, color: (ORDER_STATUS_COLOR[o.status] || { color: C.muted }).color, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>{o.status}</span>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ background: o.payment_status === 'paid' ? '#D1FAE5' : o.payment_status === 'failed' ? '#FEE2E2' : '#FEF3C7', color: o.payment_status === 'paid' ? '#065F46' : o.payment_status === 'failed' ? '#DC2626' : '#D97706', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>{o.payment_status}</span>
                      </td>
                      <td style={{ padding: '10px 12px', color: C.muted, fontSize: 12 }}>{fmtDate(o.created_at)}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <select value={o.status} disabled={updating === o.id} onChange={e => updateStatus(o.id, e.target.value)}
                          style={{ border: `1px solid ${C.border}`, borderRadius: 6, padding: '4px 8px', fontSize: 12, cursor: 'pointer', color: C.text, background: C.white }}>
                          {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => setExpandedId(expandedId === o.id ? null : o.id)}
                          style={{ background: expandedId === o.id ? C.red : '#DBEAFE', color: expandedId === o.id ? '#fff' : '#1D4ED8', border: 'none', borderRadius: 6, padding: '5px 10px', fontSize: 12, cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}
                        >{expandedId === o.id ? '▲ Hide' : '▼ View'}</button>
                        <button
                          onClick={() => setInvoiceOrder(o)}
                          style={{ background: '#FEF3C7', color: '#92400E', border: 'none', borderRadius: 6, padding: '5px 10px', fontSize: 12, cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}
                        >🖨 Invoice</button>
                        </div>
                      </td>
                    </tr>
                    {expandedId === o.id && (
                      <tr style={{ background: '#F8FAFF' }}>
                        <td colSpan={10} style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
                              <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>📦 Shipping Address</div>
                              {o.shipping_address ? (
                                <pre style={{ fontFamily: 'inherit', fontSize: 13, color: C.text, whiteSpace: 'pre-wrap', margin: 0, lineHeight: 1.7 }}>
                                  {fmtAddr(o.shipping_address)}
                                </pre>
                              ) : <span style={{ color: C.muted, fontSize: 13 }}>No address on file</span>}
                              {o.customer_phone && <div style={{ marginTop: 8, fontSize: 13, color: C.muted }}>📞 {o.customer_phone}</div>}
                            </div>
                            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
                              <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>🛍 Products Ordered</div>
                              {Array.isArray(o.items) && o.items.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                  {o.items.map((item: any, idx: number) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
                                      {item.image && <img src={item.image} alt={item.name} style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 6, border: `1px solid ${C.border}`, background: C.surface }} />}
                                      <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                                        <div style={{ fontSize: 12, color: C.muted }}>Qty: {item.quantity}</div>
                                      </div>
                                      <div style={{ fontSize: 13, fontWeight: 700, color: C.text, whiteSpace: 'nowrap' }}>
                                        {(parseFloat(item.price || 0) * (item.quantity || 1)).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                      </div>
                                    </div>
                                  ))}
                                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, fontWeight: 700, fontSize: 14 }}>
                                    <span style={{ color: C.muted }}>Total</span>
                                    <span style={{ color: C.text }}>{o.currency || 'USD'} {parseFloat(o.total_amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                  </div>
                                </div>
                              ) : <span style={{ color: C.muted, fontSize: 13 }}>No items recorded</span>}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} totalPages={totalPages} onPage={setPage} />
      {invoiceOrder && <InvoiceModal order={invoiceOrder} onClose={() => setInvoiceOrder(null)} />}
    </div>
  );
};

// ── Newsletter Tab ─────────────────────────────────────────
export const NewsletterTab = () => {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const prevTotalRef = useRef<number>(0);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    const d = await api.admin.newsletter(page);
    const incoming: any[] = d.subscribers || [];
    setSubscribers(prev => {
      const prevEmails = new Set(prev.map((s: any) => s.email));
      const fresh = incoming.filter(s => !prevEmails.has(s.email));
      if (fresh.length > 0) {
        const ids = new Set(fresh.map((s: any) => s.email));
        setNewIds(ids);
        setTimeout(() => setNewIds(new Set()), 4000);
      }
      return incoming;
    });
    setTotal(d.total || 0); setTotalPages(d.totalPages || 1);
    prevTotalRef.current = d.total || 0;
    if (!silent) setLoading(false);
  }, [page]);

  useEffect(() => { load(); }, [load]);
  useLivePoll(() => load(true)); // 5s background refresh

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 20 }}>Newsletter Subscribers <span style={{ background: `${C.red}15`, color: C.red, borderRadius: 20, padding: '2px 10px', fontSize: 13 }}>{total}</span><LiveDot /></h2>
      {loading ? <Spinner /> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead><tr style={{ background: C.surface }}>
              {['Email', 'Country', 'Source', 'Subscribed', 'Discount', 'Used'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: C.muted, borderBottom: `1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {!subscribers.length ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: C.muted }}>No subscribers yet</td></tr>
                : subscribers.map((s, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, background: newIds.has(s.email) ? '#D1FAE5' : 'transparent', transition: 'background 1s ease' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 500 }}>{s.email}</td>
                    <td style={{ padding: '10px 12px', color: C.muted }}>{s.country || '—'}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ background: s.source === 'footer' ? `${C.orange}20` : `${C.red}15`, color: s.source === 'footer' ? C.orange : C.red, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>
                        {s.source === 'footer' ? '🔗 Footer' : '🎉 Popup'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', color: C.muted, fontSize: 12 }}>{fmtDate(s.subscribed_at)}</td>
                    <td style={{ padding: '10px 12px' }}>{s.discount_code ? <code style={{ background: C.surface, padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>{s.discount_code}</code> : '—'}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: s.discount_used ? '#D1FAE5' : '#FEF3C7', color: s.discount_used ? '#065F46' : '#D97706', borderRadius: 20, padding: '3px 8px', fontSize: 11, fontWeight: 700 }}>{s.discount_used ? 'Used' : 'Unused'}</span></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} totalPages={totalPages} onPage={setPage} />
    </div>
  );
};

// ── Abandonments Tab ──────────────────────────────────────
export const AbandonmentsTab = () => {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    const d = await api.admin.abandonments(page);
    const incoming: any[] = d.abandonments || [];
    setItems(prev => {
      const prevIds = new Set(prev.map((a: any) => a.id));
      const fresh = incoming.filter(a => !prevIds.has(a.id));
      if (fresh.length > 0) {
        const ids = new Set(fresh.map((a: any) => a.id));
        setNewIds(ids);
        setTimeout(() => setNewIds(new Set()), 4000);
      }
      return incoming;
    });
    setTotal(d.total || 0); setTotalPages(d.totalPages || 1);
    if (!silent) setLoading(false);
  }, [page]);

  useEffect(() => { load(); }, [load]);
  useLivePoll(() => load(true)); // 5s background refresh

  const allSelected = items.length > 0 && items.every(a => selected.has(a.id));
  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(items.map(a => a.id)));
  };
  const toggleOne = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleDeleteSelected = async () => {
    if (!selected.size) return;
    if (!window.confirm(`Delete ${selected.size} abandonment(s)? This cannot be undone.`)) return;
    setDeleting(true);
    const d = await (api.admin as any).deleteAbandonments(Array.from(selected));
    if (d.message) {
      toast(`Deleted ${selected.size} abandonment(s)`);
      setSelected(new Set());
      load();
    } else {
      toast(d.error || 'Delete failed', 'error');
    }
    setDeleting(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text }}>
          Checkout Abandonments <span style={{ background: `${C.red}15`, color: C.red, borderRadius: 20, padding: '2px 10px', fontSize: 13 }}>{total}</span><LiveDot />
        </h2>
        {selected.size > 0 && (
          <button
            onClick={handleDeleteSelected}
            disabled={deleting}
            style={{ background: C.red, color: '#fff', border: 'none', borderRadius: 6, padding: '9px 18px', cursor: 'pointer', fontWeight: 700, fontSize: 13, opacity: deleting ? 0.7 : 1 }}
          >
            {deleting ? 'Deleting...' : `🗑 Delete Selected (${selected.size})`}
          </button>
        )}
      </div>
      {loading ? <Spinner /> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead><tr style={{ background: C.surface }}>
              <th style={{ padding: '10px 12px', width: 40, borderBottom: `1px solid ${C.border}` }}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  style={{ width: 15, height: 15, cursor: 'pointer', accentColor: C.red }}
                  title={allSelected ? 'Deselect all' : 'Select all'}
                />
              </th>
              {['Email', 'Name', 'Cart Items', 'Cart Total', 'Step', 'Country', 'Device', 'Date'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: C.muted, borderBottom: `1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {!items.length ? <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: C.muted }}>No abandonments recorded</td></tr>
                : items.map((a, i) => (
                  <tr
                    key={i}
                    style={{ borderBottom: `1px solid ${C.border}`, background: selected.has(a.id) ? '#FEE2E2' : newIds.has(a.id) ? '#FEF3C7' : 'transparent', transition: 'background 0.2s ease' }}
                  >
                    <td style={{ padding: '10px 12px' }}>
                      <input
                        type="checkbox"
                        checked={selected.has(a.id)}
                        onChange={() => toggleOne(a.id)}
                        style={{ width: 15, height: 15, cursor: 'pointer', accentColor: C.red }}
                      />
                    </td>
                    <td style={{ padding: '10px 12px' }}>{a.customer_email || '—'}</td>
                    <td style={{ padding: '10px 12px' }}>{a.customer_name || '—'}</td>
                    <td style={{ padding: '10px 12px', color: C.muted }}>{Array.isArray(a.cart_items) ? a.cart_items.length : 0} item(s)</td>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>{a.cart_total ? `$${parseFloat(a.cart_total).toLocaleString('en-US', { minimumFractionDigits: 2 })} ${a.currency || 'USD'}` : '—'}</td>
                    <td style={{ padding: '10px 12px' }}><span style={{ background: C.surface, color: C.muted, borderRadius: 20, padding: '2px 8px', fontSize: 11 }}>{a.step_abandoned || 'checkout'}</span></td>
                    <td style={{ padding: '10px 12px', color: C.muted }}>{a.customer_country || '—'}</td>
                    <td style={{ padding: '10px 12px', color: C.muted }}>{a.device_type || '—'}</td>
                    <td style={{ padding: '10px 12px', color: C.muted, fontSize: 12 }}>{fmtDate(a.abandoned_at)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} totalPages={totalPages} onPage={setPage} />
    </div>
  );
};

// ── Payment Gateways Tab ────────────────────────────────────
export const PaymentGatewaysTab = ({ admin, toast }: { admin: AdminUser; toast: (msg: string, type?: 'success' | 'error') => void }) => {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<'add' | 'reveal' | 'delete' | 'toggle' | null>(null);
  const [selectedKey, setSelectedKey] = useState<any | null>(null);
  const [gatewayFilter, setGatewayFilter] = useState('');

  // Add state
  const [keyName, setKeyName] = useState('stripe_live_client_id');
  const [keyValue, setKeyValue] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Reveal state
  const [revealedValue, setRevealedValue] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  // Toggle state
  const [pendingToggle, setPendingToggle] = useState<{ gateway: string; enabled: boolean } | null>(null);
  // Optimistic UI: track locally what we *think* the current state is
  const [optimisticUi, setOptimisticUi] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const d = await api.admin.paymentKeys.list();
    if (!d.error) setKeys(d);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    let t: any;
    if (countdown > 0) {
      t = setInterval(() => setCountdown(c => c - 1), 1000);
    } else if (countdown === 0 && revealedValue) {
      setRevealedValue(null);
      setModal(null);
    }
    return () => clearInterval(t);
  }, [countdown, revealedValue]);

  // ── Derived UI state ─────────────────────────────────────────────────────
  const stripeKeys = keys.filter(k => k.gateway === 'stripe' && !k.key_name.endsWith('_ui_enabled'));
  const paypalKeys = keys.filter(k => k.gateway === 'paypal' && !k.key_name.endsWith('_ui_enabled'));
  const stripeUiEnabled = !!keys.find(k => k.gateway === 'stripe' && k.key_name === 'stripe_ui_enabled');
  const paypalUiEnabled = !!keys.find(k => k.gateway === 'paypal' && k.key_name === 'paypal_ui_enabled');

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const d = await api.admin.paymentKeys.add({ gateway: gatewayFilter, key_name: keyName, key_value: keyValue, admin_password: adminPassword });
    if (d.success) {
      toast('Key saved — checkout UI automatically enabled for this gateway');
      setModal(null); setKeyValue(''); setAdminPassword('');
      load();
    } else {
      toast(d.error || 'Failed to add key', 'error');
    }
    setLoading(false);
  };

  const handleRevealSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const d = await api.admin.paymentKeys.reveal(selectedKey.id, adminPassword);
    if (d.key_value) {
      setRevealedValue(d.key_value);
      setCountdown(30);
      setAdminPassword('');
    } else {
      toast(d.error || 'Failed to verify password', 'error');
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    const d = await api.admin.paymentKeys.delete(selectedKey.id);
    if (d.success) {
      toast('Key deleted. If no keys remain, checkout UI was automatically hidden.');
      setModal(null);
      load();
    } else {
      toast(d.error || 'Failed to delete key', 'error');
    }
    setLoading(false);
  };

  const handleToggleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingToggle) return;
    setLoading(true);
    const d = await api.admin.paymentKeys.toggleUi({
      gateway: pendingToggle.gateway,
      enabled: pendingToggle.enabled,
      admin_password: adminPassword,
    });
    if (d.success) {
      toast(`${pendingToggle.gateway} checkout ${pendingToggle.enabled ? 'enabled ✅' : 'hidden 🚫'}`);
      // Lock in the optimistic state
      setOptimisticUi(prev => ({ ...prev, [pendingToggle.gateway]: pendingToggle.enabled }));
      setModal(null); setAdminPassword(''); setPendingToggle(null);
      load();
    } else {
      // Revert optimistic update on failure
      setOptimisticUi(prev => ({ ...prev, [pendingToggle.gateway]: !pendingToggle.enabled }));
      toast(d.error || 'Failed to update', 'error');
      setModal(null); setAdminPassword(''); setPendingToggle(null);
    }
    setLoading(false);
  };

  // ── Toggle Switch ────────────────────────────────────────────────────────
  const ToggleSwitch = ({ gateway, enabled, hasKeys }: { gateway: string; enabled: boolean; hasKeys: boolean }) => {
    // Use optimistic state if we have it, otherwise use server state
    const displayEnabled = gateway in optimisticUi ? optimisticUi[gateway] : enabled;
    const handleClick = () => {
      if (!hasKeys) {
        toast(`Add ${gateway} API keys first before toggling visibility.`, 'error');
        return;
      }
      const next = !displayEnabled;
      // Flip optimistically
      setOptimisticUi(prev => ({ ...prev, [gateway]: next }));
      setPendingToggle({ gateway, enabled: next });
      setAdminPassword('');
      setModal('toggle');
    };
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>Show on Checkout</span>
        <button
          onClick={handleClick}
          title={!hasKeys ? 'Add keys first to enable' : (displayEnabled ? 'Click to hide from checkout' : 'Click to show on checkout')}
          style={{
            position: 'relative',
            width: 46,
            height: 26,
            borderRadius: 13,
            border: 'none',
            background: !hasKeys ? '#D1D5DB' : displayEnabled ? '#10B981' : '#D1D5DB',
            cursor: 'pointer',
            transition: 'background 0.3s ease',
            padding: 0,
            flexShrink: 0,
            outline: 'none',
            boxShadow: displayEnabled && hasKeys ? '0 0 0 3px rgba(16,185,129,0.25)' : 'none',
          }}
        >
          <span style={{
            position: 'absolute',
            top: 4,
            left: displayEnabled ? 24 : 4,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: '#fff',
            transition: 'left 0.25s cubic-bezier(0.4,0,0.2,1)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
          }} />
        </button>
        <span style={{ fontSize: 11, fontWeight: 700, color: !hasKeys ? C.muted : displayEnabled ? '#10B981' : C.muted, transition: 'color 0.3s ease' }}>
          {!hasKeys ? 'No keys' : displayEnabled ? 'ON' : 'OFF'}
        </span>
      </div>
    );
  };

  const GatewayCard = ({ name, data, icon, color, uiOn }: { name: string; data: any[]; icon: string; color: string; uiOn: boolean }) => (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20, flex: 1, minWidth: 300 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>{icon}</span> {name}
        </h3>
        <button onClick={() => { setGatewayFilter(name.toLowerCase()); setKeyName(name.toLowerCase() === 'stripe' ? 'stripe_live_client_id' : 'paypal_live_client_id'); setModal('add'); }}
          style={{ background: color, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
          + Add Key
        </button>
      </div>

      {/* Visibility Toggle Row */}
      <div style={{ marginBottom: 16, padding: '10px 12px', background: C.surface, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>Checkout Page Visibility</span>
        <ToggleSwitch gateway={name.toLowerCase()} enabled={uiOn} hasKeys={data.length > 0} />
      </div>

      {data.length === 0 ? (
        <div style={{ color: C.muted, textAlign: 'center', padding: 30, background: C.surface, borderRadius: 8, fontSize: 13 }}>No {name} keys configured</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              <th style={{ padding: 8, textAlign: 'left', color: C.muted }}>Key Name</th>
              <th style={{ padding: 8, textAlign: 'left', color: C.muted }}>Value</th>
              <th style={{ padding: 8, textAlign: 'left', color: C.muted }}>Saved</th>
              <th style={{ padding: 8, textAlign: 'right', color: C.muted }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(k => (
              <tr key={k.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: '10px 8px', fontWeight: 600, color: C.text }}>{k.key_name}</td>
                <td style={{ padding: '10px 8px', color: C.muted, fontFamily: 'monospace' }}>••••••••••••••••</td>
                <td style={{ padding: '10px 8px', color: C.muted, fontSize: 11 }}>{fmtDate(k.updated_at)}</td>
                <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    <button onClick={() => { setSelectedKey(k); setModal('reveal'); }} style={{ background: '#DBEAFE', color: '#1D4ED8', border: 'none', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>👁 Reveal</button>
                    {admin.role === 'super_admin' && (
                      <button onClick={() => { setSelectedKey(k); setModal('delete'); }} style={{ background: '#FEE2E2', color: C.red, border: 'none', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>🗑 Delete</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 20 }}>Payment Gateways</h2>
      {loading && keys.length === 0 ? <Spinner /> : (
        <div style={{ display: 'flex', gap: 20, flexDirection: 'row', flexWrap: 'wrap' }}>
          <GatewayCard name="Stripe" data={stripeKeys} icon="💳" color="#6366F1" uiOn={stripeUiEnabled} />
          <GatewayCard name="PayPal" data={paypalKeys} icon="🅿️" color="#0079C1" uiOn={paypalUiEnabled} />
        </div>
      )}

      {/* Add Key Modal */}
      {modal === 'add' && (
        <Modal title={`Add New ${gatewayFilter === 'stripe' ? 'Stripe' : 'PayPal'} Key`} onClose={() => setModal(null)}>
          <div style={{ background: '#FEE2E2', color: C.red, padding: 12, borderRadius: 6, fontSize: 13, fontWeight: 600, marginBottom: 16, border: `1px solid ${C.red}30` }}>
            ⚠️ Changing live keys will immediately affect payments. Adding a key with the same name replaces the old one.
          </div>
          <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={lbl}>Key Name</label>
              <select style={inp} value={keyName} onChange={e => setKeyName(e.target.value)}>
                {gatewayFilter === 'paypal' ? (
                  <>
                    <option value="paypal_sandbox_client_id">Sandbox Client ID</option>
                    <option value="paypal_sandbox_secret_key">Sandbox Secret Key</option>
                    <option value="paypal_live_client_id">Live Client ID</option>
                    <option value="paypal_live_secret_key">Live Secret Key</option>
                    <option value="paypal_mode">Active Mode ('sandbox' or 'live')</option>
                  </>
                ) : (
                  <>
                    <option value="stripe_live_client_id">Live Publishable Key</option>
                    <option value="stripe_live_secret_key">Live Secret Key</option>
                    <option value="stripe_test_client_id">Test Publishable Key</option>
                    <option value="stripe_test_secret_key">Test Secret Key</option>
                    <option value="stripe_webhook_secret">Webhook Secret</option>
                    <option value="stripe_mode">Active Mode ('test' or 'live')</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label style={lbl}>Key Value</label>
              <input
                type={(keyName === 'paypal_mode' || keyName === 'stripe_mode') ? 'text' : 'password'}
                style={inp} value={keyValue} onChange={e => setKeyValue(e.target.value)} required
                placeholder={keyName === 'paypal_mode' ? '"sandbox" or "live"' : keyName === 'stripe_mode' ? '"test" or "live"' : 'Paste key value...'}
              />
            </div>
            <div style={{ marginTop: 8, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
              <label style={lbl}>Your Admin Password <span style={{ color: C.muted, fontWeight: 400 }}>(to confirm)</span></label>
              <input type="password" style={inp} value={adminPassword} onChange={e => setAdminPassword(e.target.value)} required />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <button type="button" onClick={() => setModal(null)} style={{ border: `1px solid ${C.border}`, background: C.white, color: C.text, borderRadius: 6, padding: '10px 20px', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
              <button type="submit" disabled={loading} style={{ background: C.red, color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', cursor: 'pointer', fontWeight: 700, opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Saving...' : 'Save Encrypted Key'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Reveal Modal */}
      {modal === 'reveal' && selectedKey && (
        <Modal title={`Reveal ${selectedKey.key_name}`} onClose={() => { setModal(null); setRevealedValue(null); }}>
          {!revealedValue ? (
            <form onSubmit={handleRevealSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ fontSize: 14, color: C.text }}>To view this sensitive key, please enter your admin password.</p>
              <div>
                <label style={lbl}>Your Admin Password</label>
                <input type="password" style={inp} value={adminPassword} onChange={e => setAdminPassword(e.target.value)} required autoFocus />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" onClick={() => setModal(null)} style={{ border: `1px solid ${C.border}`, background: C.white, color: C.text, borderRadius: 6, padding: '10px 20px', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                <button type="submit" disabled={loading} style={{ background: '#1D4ED8', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', cursor: 'pointer', fontWeight: 700, opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Verifying...' : 'Show Key'}
                </button>
              </div>
            </form>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: '16px', fontFamily: 'monospace', fontSize: 14, wordBreak: 'break-all', color: C.text, marginBottom: 16 }}>{revealedValue}</div>
              <button onClick={() => { navigator.clipboard.writeText(revealedValue); toast('Copied to clipboard'); }} style={{ background: C.success, color: '#fff', border: 'none', borderRadius: 6, padding: '10px 20px', cursor: 'pointer', fontWeight: 700, width: '100%', marginBottom: 16 }}>📋 Copy Key</button>
              <p style={{ fontSize: 13, color: C.danger, fontWeight: 600 }}>Hiding automatically in {countdown} seconds...</p>
            </div>
          )}
        </Modal>
      )}

      {/* Delete Modal */}
      {modal === 'delete' && selectedKey && (
        <Modal title="Confirm Delete" onClose={() => setModal(null)}>
          <div style={{ textAlign: 'center', padding: '8px 0 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🗑️</div>
            <p style={{ fontSize: 15, color: C.text, marginBottom: 8 }}>Are you sure you want to delete this key?</p>
            <p style={{ fontSize: 13, color: C.muted }}>Gateway: {selectedKey.gateway} — {selectedKey.key_name}</p>
            <p style={{ fontSize: 12, color: C.orange, marginTop: 8, fontWeight: 600 }}>⚠️ If this is the last key for this gateway, the checkout UI will be automatically hidden.</p>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button onClick={() => setModal(null)} style={{ border: `1px solid ${C.border}`, background: C.white, color: C.text, borderRadius: 6, padding: '10px 24px', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
            <button onClick={handleDelete} disabled={loading} style={{ background: C.red, color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', cursor: 'pointer', fontWeight: 700, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Deleting...' : 'Delete Key'}
            </button>
          </div>
        </Modal>
      )}

      {/* Toggle UI Modal */}
      {modal === 'toggle' && pendingToggle && (
        <Modal
          title={`${pendingToggle.enabled ? '✅ Enable' : '🚫 Disable'} ${pendingToggle.gateway.charAt(0).toUpperCase() + pendingToggle.gateway.slice(1)} on Checkout`}
          onClose={() => {
            // Revert optimistic update when modal is cancelled
            setOptimisticUi(prev => ({ ...prev, [pendingToggle.gateway]: !pendingToggle.enabled }));
            setModal(null); setPendingToggle(null);
          }}
        >
          <div style={{ background: pendingToggle.enabled ? '#D1FAE5' : '#FEF3C7', color: pendingToggle.enabled ? '#065F46' : '#D97706', padding: 12, borderRadius: 6, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
            {pendingToggle.enabled
              ? `✅ This will make ${pendingToggle.gateway} visible on the checkout page.`
              : `⚠️ This will hide ${pendingToggle.gateway} from the checkout page. Customers won't be able to pay with it.`}
          </div>
          <form onSubmit={handleToggleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={lbl}>Your Admin Password <span style={{ color: C.muted, fontWeight: 400 }}>(required to confirm)</span></label>
              <input type="password" style={inp} value={adminPassword} onChange={e => setAdminPassword(e.target.value)} required autoFocus placeholder="Enter admin password..." />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <button
                type="button"
                onClick={() => {
                  setOptimisticUi(prev => ({ ...prev, [pendingToggle.gateway]: !pendingToggle.enabled }));
                  setModal(null); setPendingToggle(null);
                }}
                style={{ border: `1px solid ${C.border}`, background: C.white, color: C.text, borderRadius: 6, padding: '10px 20px', cursor: 'pointer', fontWeight: 500 }}
              >Cancel</button>
              <button type="submit" disabled={loading} style={{ background: pendingToggle.enabled ? C.success : C.red, color: '#fff', border: 'none', borderRadius: 6, padding: '10px 24px', cursor: 'pointer', fontWeight: 700, opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Saving...' : pendingToggle.enabled ? '✅ Confirm Enable' : '🚫 Confirm Disable'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};





// inject global styles
const _style = document.createElement('style');

_style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  * { font-family: 'Inter', system-ui, sans-serif; box-sizing: border-box; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes slideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
  .modal-overlay { animation: fadeIn 0.2s ease; }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  input:focus, select:focus, textarea:focus { border-color: #E8272A !important; box-shadow: 0 0 0 3px rgba(232,39,42,0.1); }
`;
document.head.appendChild(_style);

export { C };
export default {};
