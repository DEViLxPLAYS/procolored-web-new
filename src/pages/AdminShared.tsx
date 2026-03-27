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
export interface ToastItem { id: number; msg: string; type: 'success'|'error'; }

// ── Utility ───────────────────────────────────────────────
export const fmtDate = (d?: string) => d ? new Date(d).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }) : '—';
export const fmtDateTime = (d?: string) => d ? new Date(d).toLocaleString('en-US', { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' }) : '—';

export const genPassword = () => {
  const up='ABCDEFGHIJKLMNOPQRSTUVWXYZ', lo='abcdefghijklmnopqrstuvwxyz', di='0123456789', sy='!@#$%^&*';
  const all = up+lo+di+sy;
  let p = up[Math.floor(Math.random()*26)] + lo[Math.floor(Math.random()*26)] + di[Math.floor(Math.random()*10)] + sy[Math.floor(Math.random()*8)];
  for (let i=4; i<16; i++) p += all[Math.floor(Math.random()*all.length)];
  return p.split('').sort(()=>Math.random()-0.5).join('');
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
  const add = useCallback((msg: string, type: 'success'|'error' = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);
  return { toasts, toast: add };
};

export const ToastContainer = ({ toasts }: { toasts: ToastItem[] }) => (
  <div style={{ position:'fixed', top:20, right:20, zIndex:9999, display:'flex', flexDirection:'column', gap:8 }}>
    {toasts.map(t => (
      <div key={t.id} style={{ background: t.type==='success' ? C.success : C.danger, color:'#fff', padding:'12px 18px', borderRadius:8, fontSize:14, fontWeight:500, boxShadow:'0 4px 16px rgba(0,0,0,0.15)', minWidth:260, animation:'slideIn 0.3s ease' }}>
        {t.type==='success' ? '✅ ' : '❌ '}{t.msg}
      </div>
    ))}
  </div>
);

// ── Modal Shell ───────────────────────────────────────────
export const Modal = ({ title, onClose, children }: { title:string; onClose:()=>void; children:React.ReactNode }) => (
  <div onClick={e => { if ((e.target as HTMLElement).classList.contains('modal-overlay')) onClose(); }}
    className="modal-overlay"
    style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
    <div style={{ background:C.white, borderRadius:12, width:'100%', maxWidth:520, boxShadow:'0 20px 60px rgba(0,0,0,0.2)', overflow:'hidden' }}>
      <div style={{ background:C.red, color:'#fff', padding:'16px 24px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontWeight:700, fontSize:16 }}>{title}</span>
        <button onClick={onClose} style={{ background:'none', border:'none', color:'#fff', fontSize:20, cursor:'pointer', lineHeight:1 }}>×</button>
      </div>
      <div style={{ padding:24 }}>{children}</div>
    </div>
  </div>
);

// ── Shared input style ─────────────────────────────────────
export const inp: React.CSSProperties = { width:'100%', border:`1px solid ${C.border}`, borderRadius:6, padding:'10px 12px', fontSize:14, color:C.text, outline:'none', boxSizing:'border-box', fontFamily:'inherit' };
export const lbl: React.CSSProperties = { display:'block', marginBottom:6, fontSize:13, fontWeight:600, color:C.text };

// ── Status badge colors ────────────────────────────────────
const ORDER_STATUS_COLOR: Record<string,{bg:string;color:string}> = {
  pending:   { bg:'#FEF3C7', color:'#D97706' },
  confirmed: { bg:'#DBEAFE', color:'#1D4ED8' },
  processing:{ bg:'#EDE9FE', color:'#7C3AED' },
  shipped:   { bg:'#CFFAFE', color:'#0E7490' },
  delivered: { bg:'#D1FAE5', color:'#065F46' },
  cancelled: { bg:'#FEE2E2', color:'#DC2626' },
  refunded:  { bg:'#F3F4F6', color:'#374151' },
};

// ── Stat Card ─────────────────────────────────────────────
export const StatCard = ({ icon, label, value, sub, accent }: { icon:string; label:string; value:string|number; sub?:string; accent:string }) => (
  <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:10, padding:20, borderTop:`3px solid ${accent}` }}>
    <div style={{ fontSize:28, marginBottom:6 }}>{icon}</div>
    <div style={{ fontSize:28, fontWeight:800, color:C.text }}>{value}</div>
    <div style={{ fontSize:13, color:C.muted, marginTop:2 }}>{label}</div>
    {sub && <div style={{ fontSize:12, color:accent, marginTop:4, fontWeight:600 }}>{sub}</div>}
  </div>
);

// ── Pagination ────────────────────────────────────────────
export const Pagination = ({ page, totalPages, onPage }: { page:number; totalPages:number; onPage:(p:number)=>void }) => (
  <div style={{ display:'flex', alignItems:'center', gap:12, justifyContent:'center', marginTop:16, paddingTop:16, borderTop:`1px solid ${C.border}` }}>
    <button disabled={page<=1} onClick={()=>onPage(page-1)} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:6, padding:'6px 14px', cursor:page<=1?'not-allowed':'pointer', color:C.text, fontSize:13, opacity:page<=1?0.5:1 }}>← Prev</button>
    <span style={{ fontSize:13, color:C.muted }}>Page {page} of {totalPages||1}</span>
    <button disabled={page>=totalPages} onClick={()=>onPage(page+1)} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:6, padding:'6px 14px', cursor:page>=totalPages?'not-allowed':'pointer', color:C.text, fontSize:13, opacity:page>=totalPages?0.5:1 }}>Next →</button>
  </div>
);

// ── Spinner ────────────────────────────────────────────────
export const Spinner = () => (
  <div style={{ textAlign:'center', padding:40, color:C.muted }}>
    <div style={{ width:36, height:36, border:`3px solid ${C.border}`, borderTop:`3px solid ${C.red}`, borderRadius:'50%', animation:'spin 0.7s linear infinite', margin:'0 auto 12px' }} />
    Loading...
  </div>
);

// ── Live indicator dot ─────────────────────────────────────
const LiveDot = () => (
  <span title="Live — updates every 5 seconds" style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, color:C.success, fontWeight:600, marginLeft:8 }}>
    <span style={{ width:7, height:7, borderRadius:'50%', background:C.success, display:'inline-block', animation:'pulse 1.5s ease-in-out infinite' }} />
    LIVE
  </span>
);

// ── Orders section ─────────────────────────────────────────
export const OrdersTab = ({ toast }: { toast:(msg:string,type?:'success'|'error')=>void }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<string|null>(null);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string|null>(null);
  const prevTotalRef = useRef<number>(0);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    const d = await api.admin.orders(page, statusFilter);
    const incoming: any[] = d.orders || [];
    setOrders(prev => {
      const prevIds = new Set(prev.map((o:any) => o.id));
      const fresh = incoming.filter(o => !prevIds.has(o.id));
      if (fresh.length > 0) {
        const ids = new Set(fresh.map((o:any) => o.id));
        setNewIds(ids);
        setTimeout(() => setNewIds(new Set()), 4000);
        if (prevTotalRef.current > 0) toast(`📦 New order placed!`);
      }
      return incoming;
    });
    setTotal(d.total||0); setTotalPages(d.totalPages||1);
    prevTotalRef.current = d.total || 0;
    if (!silent) setLoading(false);
  }, [page, statusFilter, toast]);

  useEffect(()=>{ load(); }, [load]);
  useLivePoll(() => load(true)); // 5s background refresh

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    const d = await api.admin.updateOrderStatus(id, status);
    if (d.order) { toast('Order status updated'); load(true); }
    else toast(d.error||'Failed to update', 'error');
    setUpdating(null);
  };

  const statuses = ['pending','confirmed','processing','shipped','delivered','cancelled','refunded'];

  const fmtAddr = (addr: any) => {
    if (!addr) return '—';
    if (typeof addr === 'string') return addr;
    const { firstName='', lastName='', address='', apartment='', city='', state='', postal='', country='' } = addr;
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
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <h2 style={{ fontSize:20, fontWeight:700, color:C.text }}>Orders <span style={{ background:`${C.red}15`, color:C.red, borderRadius:20, padding:'2px 10px', fontSize:13 }}>{total}</span><LiveDot /></h2>
        <select value={statusFilter} onChange={e=>{setStatusFilter(e.target.value);setPage(1);}} style={{ ...inp, width:'auto', padding:'8px 14px' }}>
          <option value=''>All Statuses</option>
          {statuses.map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
        </select>
      </div>
      {loading ? <Spinner /> : (
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14 }}>
            <thead><tr style={{ background:C.surface }}>
              {['Order #','Customer','Email','Items','Total','Status','Payment','Date','Update',''].map(h=>(
                <th key={h} style={{ padding:'10px 12px', textAlign:'left', fontSize:12, fontWeight:700, color:C.muted, whiteSpace:'nowrap', borderBottom:`1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {!orders.length ? <tr><td colSpan={10} style={{ textAlign:'center', padding:40, color:C.muted }}>No orders found</td></tr>
              : orders.map(o=>(
                <React.Fragment key={o.id}>
                  <tr style={{ borderBottom:`1px solid ${C.border}`, background: newIds.has(o.id) ? '#D1FAE5' : 'transparent', transition:'background 1s ease' }}>
                    <td style={{ padding:'10px 12px' }}><code style={{ background:C.surface, padding:'2px 6px', borderRadius:4, fontSize:12 }}>{o.order_number}</code></td>
                    <td style={{ padding:'10px 12px', fontWeight:500 }}>{o.customer_name}</td>
                    <td style={{ padding:'10px 12px', color:C.muted, fontSize:12 }}>{o.customer_email}</td>
                    <td style={{ padding:'10px 12px', color:C.muted }}>{Array.isArray(o.items)?o.items.length:0}</td>
                    <td style={{ padding:'10px 12px', fontWeight:700 }}>{o.currency} {parseFloat(o.total_amount||0).toLocaleString()}</td>
                    <td style={{ padding:'10px 12px' }}>
                      <span style={{ background:(ORDER_STATUS_COLOR[o.status]||{bg:C.surface}).bg, color:(ORDER_STATUS_COLOR[o.status]||{color:C.muted}).color, borderRadius:20, padding:'3px 10px', fontSize:11, fontWeight:700 }}>{o.status}</span>
                    </td>
                    <td style={{ padding:'10px 12px' }}>
                      <span style={{ background: o.payment_status==='paid'?'#D1FAE5':o.payment_status==='failed'?'#FEE2E2':'#FEF3C7', color: o.payment_status==='paid'?'#065F46':o.payment_status==='failed'?'#DC2626':'#D97706', borderRadius:20, padding:'3px 10px', fontSize:11, fontWeight:700 }}>{o.payment_status}</span>
                    </td>
                    <td style={{ padding:'10px 12px', color:C.muted, fontSize:12 }}>{fmtDate(o.created_at)}</td>
                    <td style={{ padding:'10px 12px' }}>
                      <select value={o.status} disabled={updating===o.id} onChange={e=>updateStatus(o.id,e.target.value)}
                        style={{ border:`1px solid ${C.border}`, borderRadius:6, padding:'4px 8px', fontSize:12, cursor:'pointer', color:C.text, background:C.white }}>
                        {statuses.map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                      </select>
                    </td>
                    <td style={{ padding:'10px 12px' }}>
                      <button
                        onClick={() => setExpandedId(expandedId === o.id ? null : o.id)}
                        style={{ background: expandedId===o.id ? C.red : '#DBEAFE', color: expandedId===o.id ? '#fff' : '#1D4ED8', border:'none', borderRadius:6, padding:'5px 10px', fontSize:12, cursor:'pointer', fontWeight:600, whiteSpace:'nowrap' }}
                      >{expandedId===o.id ? '▲ Hide' : '▼ View'}</button>
                    </td>
                  </tr>
                  {expandedId === o.id && (
                    <tr style={{ background:'#F8FAFF' }}>
                      <td colSpan={10} style={{ padding:'16px 20px', borderBottom:`1px solid ${C.border}` }}>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
                          <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:10, padding:16 }}>
                            <div style={{ fontSize:12, fontWeight:700, color:C.muted, marginBottom:10, textTransform:'uppercase', letterSpacing:1 }}>📦 Shipping Address</div>
                            {o.shipping_address ? (
                              <pre style={{ fontFamily:'inherit', fontSize:13, color:C.text, whiteSpace:'pre-wrap', margin:0, lineHeight:1.7 }}>
                                {fmtAddr(o.shipping_address)}
                              </pre>
                            ) : <span style={{ color:C.muted, fontSize:13 }}>No address on file</span>}
                            {o.customer_phone && <div style={{ marginTop:8, fontSize:13, color:C.muted }}>📞 {o.customer_phone}</div>}
                          </div>
                          <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:10, padding:16 }}>
                            <div style={{ fontSize:12, fontWeight:700, color:C.muted, marginBottom:10, textTransform:'uppercase', letterSpacing:1 }}>🛍 Products Ordered</div>
                            {Array.isArray(o.items) && o.items.length > 0 ? (
                              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                                {o.items.map((item:any, idx:number) => (
                                  <div key={idx} style={{ display:'flex', alignItems:'center', gap:12, padding:'8px 0', borderBottom:`1px solid ${C.border}` }}>
                                    {item.image && <img src={item.image} alt={item.name} style={{ width:40, height:40, objectFit:'contain', borderRadius:6, border:`1px solid ${C.border}`, background:C.surface }} />}
                                    <div style={{ flex:1, minWidth:0 }}>
                                      <div style={{ fontSize:13, fontWeight:600, color:C.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.name}</div>
                                      <div style={{ fontSize:12, color:C.muted }}>Qty: {item.quantity}</div>
                                    </div>
                                    <div style={{ fontSize:13, fontWeight:700, color:C.text, whiteSpace:'nowrap' }}>
                                      {(parseFloat(item.price||0) * (item.quantity||1)).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                    </div>
                                  </div>
                                ))}
                                <div style={{ display:'flex', justifyContent:'space-between', paddingTop:8, fontWeight:700, fontSize:14 }}>
                                  <span style={{ color:C.muted }}>Total</span>
                                  <span style={{ color:C.text }}>{o.currency||'USD'} {parseFloat(o.total_amount||0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                </div>
                              </div>
                            ) : <span style={{ color:C.muted, fontSize:13 }}>No items recorded</span>}
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
      const prevEmails = new Set(prev.map((s:any) => s.email));
      const fresh = incoming.filter(s => !prevEmails.has(s.email));
      if (fresh.length > 0) {
        const ids = new Set(fresh.map((s:any) => s.email));
        setNewIds(ids);
        setTimeout(() => setNewIds(new Set()), 4000);
      }
      return incoming;
    });
    setTotal(d.total||0); setTotalPages(d.totalPages||1);
    prevTotalRef.current = d.total || 0;
    if (!silent) setLoading(false);
  }, [page]);

  useEffect(()=>{ load(); }, [load]);
  useLivePoll(() => load(true)); // 5s background refresh

  return (
    <div>
      <h2 style={{ fontSize:20, fontWeight:700, color:C.text, marginBottom:20 }}>Newsletter Subscribers <span style={{ background:`${C.red}15`, color:C.red, borderRadius:20, padding:'2px 10px', fontSize:13 }}>{total}</span><LiveDot /></h2>
      {loading ? <Spinner /> : (
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14 }}>
            <thead><tr style={{ background:C.surface }}>
              {['Email','Country','Source','Subscribed','Discount','Used'].map(h=>(
                <th key={h} style={{ padding:'10px 12px', textAlign:'left', fontSize:12, fontWeight:700, color:C.muted, borderBottom:`1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {!subscribers.length ? <tr><td colSpan={6} style={{ textAlign:'center', padding:40, color:C.muted }}>No subscribers yet</td></tr>
              : subscribers.map((s,i)=>(
                <tr key={i} style={{ borderBottom:`1px solid ${C.border}`, background: newIds.has(s.email) ? '#D1FAE5' : 'transparent', transition:'background 1s ease' }}>
                  <td style={{ padding:'10px 12px', fontWeight:500 }}>{s.email}</td>
                  <td style={{ padding:'10px 12px', color:C.muted }}>{s.country||'—'}</td>
                  <td style={{ padding:'10px 12px' }}>
                    <span style={{ background: s.source==='footer' ? `${C.orange}20` : `${C.red}15`, color: s.source==='footer' ? C.orange : C.red, borderRadius:20, padding:'2px 10px', fontSize:11, fontWeight:700 }}>
                      {s.source === 'footer' ? '🔗 Footer' : '🎉 Popup'}
                    </span>
                  </td>
                  <td style={{ padding:'10px 12px', color:C.muted, fontSize:12 }}>{fmtDate(s.subscribed_at)}</td>
                  <td style={{ padding:'10px 12px' }}>{s.discount_code?<code style={{ background:C.surface, padding:'2px 6px', borderRadius:4, fontSize:12 }}>{s.discount_code}</code>:'—'}</td>
                  <td style={{ padding:'10px 12px' }}><span style={{ background: s.discount_used?'#D1FAE5':'#FEF3C7', color: s.discount_used?'#065F46':'#D97706', borderRadius:20, padding:'3px 8px', fontSize:11, fontWeight:700 }}>{s.discount_used?'Used':'Unused'}</span></td>
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

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    const d = await api.admin.abandonments(page);
    const incoming: any[] = d.abandonments || [];
    setItems(prev => {
      const prevIds = new Set(prev.map((a:any) => a.id));
      const fresh = incoming.filter(a => !prevIds.has(a.id));
      if (fresh.length > 0) {
        const ids = new Set(fresh.map((a:any) => a.id));
        setNewIds(ids);
        setTimeout(() => setNewIds(new Set()), 4000);
      }
      return incoming;
    });
    setTotal(d.total||0); setTotalPages(d.totalPages||1);
    if (!silent) setLoading(false);
  }, [page]);

  useEffect(()=>{ load(); }, [load]);
  useLivePoll(() => load(true)); // 5s background refresh

  return (
    <div>
      <h2 style={{ fontSize:20, fontWeight:700, color:C.text, marginBottom:20 }}>Checkout Abandonments <span style={{ background:`${C.red}15`, color:C.red, borderRadius:20, padding:'2px 10px', fontSize:13 }}>{total}</span><LiveDot /></h2>
      {loading ? <Spinner /> : (
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14 }}>
            <thead><tr style={{ background:C.surface }}>
              {['Email','Name','Cart Items','Cart Total','Step','Country','Device','Date'].map(h=>(
                <th key={h} style={{ padding:'10px 12px', textAlign:'left', fontSize:12, fontWeight:700, color:C.muted, borderBottom:`1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {!items.length ? <tr><td colSpan={8} style={{ textAlign:'center', padding:40, color:C.muted }}>No abandonments recorded</td></tr>
              : items.map((a,i)=>(
                <tr key={i} style={{ borderBottom:`1px solid ${C.border}`, background: newIds.has(a.id) ? '#FEF3C7' : 'transparent', transition:'background 1s ease' }}>
                  <td style={{ padding:'10px 12px' }}>{a.customer_email||'—'}</td>
                  <td style={{ padding:'10px 12px' }}>{a.customer_name||'—'}</td>
                  <td style={{ padding:'10px 12px', color:C.muted }}>{Array.isArray(a.cart_items)?a.cart_items.length:0} item(s)</td>
                  <td style={{ padding:'10px 12px', fontWeight:600 }}>{a.cart_total?`$${parseFloat(a.cart_total).toLocaleString('en-US', { minimumFractionDigits: 2 })} ${a.currency||'USD'}`:'—'}</td>
                  <td style={{ padding:'10px 12px' }}><span style={{ background:C.surface, color:C.muted, borderRadius:20, padding:'2px 8px', fontSize:11 }}>{a.step_abandoned||'checkout'}</span></td>
                  <td style={{ padding:'10px 12px', color:C.muted }}>{a.customer_country||'—'}</td>
                  <td style={{ padding:'10px 12px', color:C.muted }}>{a.device_type||'—'}</td>
                  <td style={{ padding:'10px 12px', color:C.muted, fontSize:12 }}>{fmtDate(a.abandoned_at)}</td>
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
export const PaymentGatewaysTab = ({ admin, toast }: { admin: AdminUser; toast: (msg: string, type?: 'success'|'error') => void }) => {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<'add'|'reveal'|'delete'|null>(null);
  const [selectedKey, setSelectedKey] = useState<any|null>(null);
  const [gatewayFilter, setGatewayFilter] = useState('');
  
  // Add state
  const [keyName, setKeyName] = useState('publishable_key');
  const [keyValue, setKeyValue] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  
  // Reveal state
  const [revealedValue, setRevealedValue] = useState<string|null>(null);
  const [countdown, setCountdown] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    const d = await api.admin.paymentKeys.list();
    if (!d.error) setKeys(d);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Handle countdown
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

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const d = await api.admin.paymentKeys.add({ gateway: gatewayFilter, key_name: keyName, key_value: keyValue, admin_password: adminPassword });
    if (d.success) {
      toast('Key added successfully');
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
      toast('Key deleted successfully');
      setModal(null);
      load();
    } else {
      toast(d.error || 'Failed to delete key', 'error');
    }
    setLoading(false);
  };

  const stripeKeys = keys.filter(k => k.gateway === 'stripe');
  const paypalKeys = keys.filter(k => k.gateway === 'paypal');

  const GatewayCard = ({ name, data, icon, color }: { name: string, data: any[], icon: string, color: string }) => (
    <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:10, padding:20, flex:1 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <h3 style={{ fontSize:16, fontWeight:700, color:C.text, display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:20 }}>{icon}</span> {name}
        </h3>
        <button onClick={() => { setGatewayFilter(name.toLowerCase()); setModal('add'); }} style={{ background:color, color:'#fff', border:'none', borderRadius:6, padding:'6px 14px', cursor:'pointer', fontWeight:600, fontSize:13 }}>
          + Add Key
        </button>
      </div>
      
      {data.length === 0 ? (
        <div style={{ color:C.muted, textAlign:'center', padding:30, background:C.surface, borderRadius:8, fontSize:13 }}>No {name} keys configured</div>
      ) : (
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${C.border}` }}>
              <th style={{ padding:8, textAlign:'left', color:C.muted }}>Key Name</th>
              <th style={{ padding:8, textAlign:'left', color:C.muted }}>Value</th>
              <th style={{ padding:8, textAlign:'left', color:C.muted }}>Saved</th>
              <th style={{ padding:8, textAlign:'right', color:C.muted }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(k => (
              <tr key={k.id} style={{ borderBottom:`1px solid ${C.border}` }}>
                <td style={{ padding:'10px 8px', fontWeight:600, color:C.text }}>{k.key_name}</td>
                <td style={{ padding:'10px 8px', color:C.muted, fontFamily:'monospace' }}>sk_live_••••••••••••••••</td>
                <td style={{ padding:'10px 8px', color:C.muted, fontSize:11 }}>{fmtDate(k.updated_at)}</td>
                <td style={{ padding:'10px 8px', textAlign:'right' }}>
                  <div style={{ display:'flex', gap:6, justifyContent:'flex-end' }}>
                    <button onClick={() => { setSelectedKey(k); setModal('reveal'); }} style={{ background:'#DBEAFE', color:'#1D4ED8', border:'none', borderRadius:6, padding:'4px 8px', cursor:'pointer', fontSize:12, fontWeight:600 }}>👁 Reveal</button>
                    {admin.role === 'super_admin' && (
                      <button onClick={() => { setSelectedKey(k); setModal('delete'); }} style={{ background:'#FEE2E2', color:C.red, border:'none', borderRadius:6, padding:'4px 8px', cursor:'pointer', fontSize:12, fontWeight:600 }}>Trash</button>
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
      <h2 style={{ fontSize:20, fontWeight:700, color:C.text, marginBottom:20 }}>Payment Gateways</h2>
      {loading && keys.length === 0 ? <Spinner /> : (
        <div style={{ display:'flex', gap:20, flexDirection:'row', flexWrap:'wrap' }}>
          <GatewayCard name="Stripe" data={stripeKeys} icon="💳" color="#6366F1" />
          <GatewayCard name="PayPal" data={paypalKeys} icon="🅿️" color="#0079C1" />
        </div>
      )}

      {modal === 'add' && (
        <Modal title={`Add New ${gatewayFilter === 'stripe' ? 'Stripe' : 'PayPal'} Key`} onClose={() => setModal(null)}>
          <div style={{ background:'#FEE2E2', color:C.red, padding:12, borderRadius:6, fontSize:13, fontWeight:600, marginBottom:16, border:`1px solid ${C.red}30` }}>
            ⚠️ Changing live keys will immediately affect payments
          </div>
          <form onSubmit={handleAddSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div>
              <label style={lbl}>Key Name</label>
              <select style={inp} value={keyName} onChange={e=>setKeyName(e.target.value)}>
                <option value="publishable_key">Publishable Key</option>
                <option value="secret_key">Secret Key</option>
                <option value="webhook_secret">Webhook Secret</option>
              </select>
            </div>
            <div>
              <label style={lbl}>Key Value</label>
              <input type="password" style={inp} value={keyValue} onChange={e=>setKeyValue(e.target.value)} required placeholder="sk_live_..." />
            </div>
            <div style={{ marginTop:8, paddingTop:12, borderTop:`1px solid ${C.border}` }}>
              <label style={lbl}>Your Admin Password <span style={{color:C.muted,fontWeight:400}}>(to confirm)</span></label>
              <input type="password" style={inp} value={adminPassword} onChange={e=>setAdminPassword(e.target.value)} required />
            </div>
            <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:8 }}>
              <button type="button" onClick={()=>setModal(null)} style={{ border:`1px solid ${C.border}`, background:C.white, color:C.text, borderRadius:6, padding:'10px 20px', cursor:'pointer', fontWeight:500 }}>Cancel</button>
              <button type="submit" disabled={loading} style={{ background:C.red, color:'#fff', border:'none', borderRadius:6, padding:'10px 24px', cursor:'pointer', fontWeight:700, opacity:loading?0.7:1 }}>
                {loading ? 'Saving...' : 'Save Encrypted Key'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'reveal' && selectedKey && (
        <Modal title={`Reveal ${selectedKey.key_name}`} onClose={() => { setModal(null); setRevealedValue(null); }}>
          {!revealedValue ? (
            <form onSubmit={handleRevealSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <p style={{ fontSize:14, color:C.text }}>To view this sensitive key, please enter your admin password.</p>
              <div>
                <label style={lbl}>Your Admin Password</label>
                <input type="password" style={inp} value={adminPassword} onChange={e=>setAdminPassword(e.target.value)} required autoFocus />
              </div>
              <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:8 }}>
                <button type="button" onClick={()=>setModal(null)} style={{ border:`1px solid ${C.border}`, background:C.white, color:C.text, borderRadius:6, padding:'10px 20px', cursor:'pointer', fontWeight:500 }}>Cancel</button>
                <button type="submit" disabled={loading} style={{ background:'#1D4ED8', color:'#fff', border:'none', borderRadius:6, padding:'10px 24px', cursor:'pointer', fontWeight:700, opacity:loading?0.7:1 }}>
                  {loading ? 'Verifying...' : 'Show Key'}
                </button>
              </div>
            </form>
          ) : (
            <div style={{ textAlign:'center' }}>
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:'16px', fontFamily:'monospace', fontSize:14, wordBreak:'break-all', color:C.text, marginBottom:16 }}>
                {revealedValue}
              </div>
              <button onClick={() => { navigator.clipboard.writeText(revealedValue); toast('Copied to clipboard'); }} style={{ background:C.success, color:'#fff', border:'none', borderRadius:6, padding:'10px 20px', cursor:'pointer', fontWeight:700, width:'100%', marginBottom:16 }}>
                📋 Copy Key
              </button>
              <p style={{ fontSize:13, color:C.danger, fontWeight:600 }}>Hiding automatically in {countdown} seconds...</p>
            </div>
          )}
        </Modal>
      )}

      {modal === 'delete' && selectedKey && (
        <Modal title="Confirm Delete" onClose={() => setModal(null)}>
          <div style={{ textAlign:'center', padding:'8px 0 20px' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🗑️</div>
            <p style={{ fontSize:15, color:C.text, marginBottom:8 }}>Are you sure you want to delete this key?</p>
            <p style={{ fontSize:13, color:C.muted }}>Gateway: {selectedKey.gateway} <br/> Name: {selectedKey.key_name}</p>
          </div>
          <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
            <button onClick={() => setModal(null)} style={{ border:`1px solid ${C.border}`, background:C.white, color:C.text, borderRadius:6, padding:'10px 24px', cursor:'pointer', fontWeight:500 }}>Cancel</button>
            <button onClick={handleDelete} disabled={loading} style={{ background:C.red, color:'#fff', border:'none', borderRadius:6, padding:'10px 24px', cursor:'pointer', fontWeight:700, opacity:loading?0.7:1 }}>
              {loading ? 'Deleting...' : 'Delete Key'}
            </button>
          </div>
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
