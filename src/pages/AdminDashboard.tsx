import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type { AdminUser } from './AdminShared';
import {
  C, fmtDate, fmtDateTime, genPassword, pwStrength,
  useToast, ToastContainer, Modal, inp, lbl,
  StatCard, Spinner,
  OrdersTab, NewsletterTab, AbandonmentsTab, PaymentGatewaysTab
} from './AdminShared';

// ── Country bar chart ──────────────────────────────────────
const CountryChart = ({ data }: { data: { country: string; count: number }[] }) => {
  if (!data.length) return <div style={{ color:C.muted, textAlign:'center', padding:20 }}>No visitor data yet</div>;
  const max = Math.max(...data.map(d => d.count));
  const colors = [C.red, C.orange, '#3B82F6', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#EC4899'];
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      {data.map((item, i) => (
        <div key={i} style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:110, fontSize:12, color:C.muted, textAlign:'right', flexShrink:0 }}>{item.country}</div>
          <div style={{ flex:1, height:10, background:C.surface, borderRadius:5, overflow:'hidden' }}>
            <div style={{ width:`${(item.count/max)*100}%`, height:'100%', background:colors[i%colors.length], borderRadius:5, transition:'width 0.6s ease' }} />
          </div>
          <div style={{ width:28, fontSize:12, color:C.muted, fontWeight:600 }}>{item.count}</div>
        </div>
      ))}
    </div>
  );
};

// ── Admin form (create + edit) ─────────────────────────────
const AdminFormModal = ({ initial, onClose, onSave, toast }: {
  initial?: AdminUser | null;
  onClose: () => void;
  onSave: (admin: AdminUser) => void;
  toast: (msg: string, type?: 'success'|'error') => void;
}) => {
  const isEdit = !!initial;
  const [form, setForm] = useState({ username: initial?.username||'', email: initial?.email||'', password: '', role: initial?.role||'admin', is_active: initial?.is_active ?? true });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const strength = pwStrength(form.password);

  const handleGen = () => { const p = genPassword(); setForm(f=>({...f, password:p})); setShowPw(true); };
  const handleCopy = () => { navigator.clipboard.writeText(form.password); setCopied(true); setTimeout(()=>setCopied(false), 2000); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.email) return toast('Username and email required', 'error');
    if (!isEdit && form.password.length < 12) return toast('Password must be at least 12 chars', 'error');
    setLoading(true);
    const payload: any = { username: form.username, email: form.email, role: form.role, is_active: form.is_active };
    if (form.password) payload.password = form.password;
    const d = isEdit
      ? await api.admin.updateAdmin(initial!.id, payload)
      : await api.admin.createAdmin({ ...payload, password: form.password });
    if (d.admin) { toast(isEdit ? 'Admin updated successfully' : 'Admin created successfully'); onSave(d.admin); onClose(); }
    else toast(d.error || 'Operation failed', 'error');
    setLoading(false);
  };

  return (
    <Modal title={isEdit ? `Edit Admin — ${initial?.username}` : 'Add New Admin'} onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div>
            <label style={lbl}>Username</label>
            <input style={inp} value={form.username} onChange={e=>setForm(f=>({...f,username:e.target.value.toLowerCase()}))} required placeholder="username" />
          </div>
          <div>
            <label style={lbl}>Email</label>
            <input type="email" style={inp} value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required placeholder="admin@email.com" />
          </div>
        </div>
        <div>
          <label style={lbl}>Password {isEdit && <span style={{ color:C.muted, fontWeight:400 }}>(leave blank to keep current)</span>}</label>
          <div style={{ display:'flex', gap:6 }}>
            <input type={showPw?'text':'password'} style={{ ...inp, flex:1 }} value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder={isEdit?'New password (optional)':'Min 12 chars'} required={!isEdit} minLength={isEdit?0:12} />
            <button type="button" onClick={()=>setShowPw(s=>!s)} style={{ border:`1px solid ${C.border}`, borderRadius:6, padding:'0 10px', cursor:'pointer', background:C.white, color:C.muted, fontSize:13 }}>{showPw?'🙈':'👁'}</button>
            <button type="button" onClick={handleCopy} disabled={!form.password} style={{ border:`1px solid ${C.border}`, borderRadius:6, padding:'0 10px', cursor:'pointer', background:C.white, color:C.muted, fontSize:13 }}>{copied?'✅':'📋'}</button>
            <button type="button" onClick={handleGen} style={{ background:C.orange, color:'#fff', border:'none', borderRadius:6, padding:'0 10px', cursor:'pointer', fontSize:12, fontWeight:600, whiteSpace:'nowrap' }}>⚡ Auto</button>
          </div>
          {form.password && (
            <div style={{ marginTop:6 }}>
              <div style={{ height:4, background:C.surface, borderRadius:2, overflow:'hidden' }}>
                <div style={{ width:`${strength.pct}%`, height:'100%', background:strength.color, borderRadius:2, transition:'width 0.3s ease' }} />
              </div>
              <div style={{ fontSize:11, color:strength.color, marginTop:3, fontWeight:600 }}>{strength.label} password</div>
            </div>
          )}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div>
            <label style={lbl}>Role</label>
            <select style={inp} value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
          {isEdit && (
            <div>
              <label style={lbl}>Status</label>
              <select style={inp} value={form.is_active?'active':'inactive'} onChange={e=>setForm(f=>({...f,is_active:e.target.value==='active'}))}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          )}
        </div>
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:4, paddingTop:12, borderTop:`1px solid ${C.border}` }}>
          <button type="button" onClick={onClose} style={{ border:`1px solid ${C.border}`, background:C.white, color:C.text, borderRadius:6, padding:'10px 20px', cursor:'pointer', fontWeight:500 }}>Cancel</button>
          <button type="submit" disabled={loading} style={{ background:C.red, color:'#fff', border:'none', borderRadius:6, padding:'10px 24px', cursor:'pointer', fontWeight:700, opacity:loading?0.7:1 }}>
            {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Admin'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// ── Confirm delete modal ───────────────────────────────────
const ConfirmDeleteModal = ({ admin, onClose, onConfirm, loading }: { admin: AdminUser; onClose:()=>void; onConfirm:()=>void; loading:boolean }) => (
  <Modal title="Confirm Delete Admin" onClose={onClose}>
    <div style={{ textAlign:'center', padding:'8px 0 20px' }}>
      <div style={{ fontSize:48, marginBottom:12 }}>⚠️</div>
      <p style={{ fontSize:15, color:C.text, marginBottom:4 }}>Are you sure you want to deactivate</p>
      <p style={{ fontSize:18, fontWeight:700, color:C.red, marginBottom:8 }}>@{admin.username}</p>
      <p style={{ fontSize:13, color:C.muted }}>This will prevent them from logging in. This action can be undone by editing the admin.</p>
    </div>
    <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
      <button onClick={onClose} style={{ border:`1px solid ${C.border}`, background:C.white, color:C.text, borderRadius:6, padding:'10px 24px', cursor:'pointer', fontWeight:500 }}>Cancel</button>
      <button onClick={onConfirm} disabled={loading} style={{ background:C.red, color:'#fff', border:'none', borderRadius:6, padding:'10px 24px', cursor:'pointer', fontWeight:700, opacity:loading?0.7:1 }}>
        {loading?'Deleting...':'Deactivate Admin'}
      </button>
    </div>
  </Modal>
);

// ── Reset password modal ───────────────────────────────────
const ResetPwModal = ({ admin, newPw, onClose }: { admin: AdminUser; newPw: string; onClose:()=>void }) => {
  const [copied, setCopied] = useState(false);
  return (
    <Modal title="New Password Generated" onClose={onClose}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:40, marginBottom:8 }}>🔐</div>
        <p style={{ color:C.muted, marginBottom:16 }}>New password for <strong>{admin.username}</strong> — shown once only:</p>
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:'14px 16px', fontFamily:'monospace', fontSize:18, letterSpacing:2, marginBottom:12, color:C.text }}>{newPw}</div>
        <button onClick={()=>{ navigator.clipboard.writeText(newPw); setCopied(true); }}
          style={{ background:copied?C.success:C.red, color:'#fff', border:'none', borderRadius:6, padding:'10px 24px', cursor:'pointer', fontWeight:700, width:'100%', marginBottom:8 }}>
          {copied?'✅ Copied!':'📋 Copy Password'}
        </button>
        <p style={{ fontSize:12, color:C.muted }}>Share this securely with the admin. It will not be shown again.</p>
      </div>
    </Modal>
  );
};

// ── Admins Tab (full CRUD) ─────────────────────────────────
const AdminsTab = ({ currentAdmin, toast }: { currentAdmin: AdminUser; toast:(msg:string,type?:'success'|'error')=>void }) => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<'create'|'edit'|'delete'|'resetpw'|null>(null);
  const [selected, setSelected] = useState<AdminUser|null>(null);
  const [newPw, setNewPw] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const d = await api.admin.admins();
    setAdmins(d.admins||[]);
    setLoading(false);
  }, []);

  useEffect(()=>{ load(); }, [load]);

  const handleDelete = async () => {
    if (!selected) return;
    setActionLoading(true);
    const d = await api.admin.deleteAdmin(selected.id);
    if (d.message) { toast('Admin deactivated'); await load(); setModal(null); }
    else toast(d.error||'Failed to delete', 'error');
    setActionLoading(false);
  };

  const handleToggleActive = async (a: AdminUser) => {
    const d = await api.admin.updateAdmin(a.id, { is_active: !a.is_active });
    if (d.admin) { toast(`Admin ${d.admin.is_active?'activated':'deactivated'}`); load(); }
    else toast(d.error||'Failed', 'error');
  };

  const handleResetPw = async (a: AdminUser) => {
    setSelected(a);
    setActionLoading(true);
    const d = await api.admin.resetAdminPassword(a.id);
    if (d.newPassword) { setNewPw(d.newPassword); setModal('resetpw'); }
    else toast(d.error||'Failed to reset password', 'error');
    setActionLoading(false);
  };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <h2 style={{ fontSize:20, fontWeight:700, color:C.text }}>Admin Management</h2>
        <button onClick={()=>{ setSelected(null); setModal('create'); }}
          style={{ background:C.red, color:'#fff', border:'none', borderRadius:6, padding:'10px 20px', cursor:'pointer', fontWeight:700, fontSize:14 }}>
          + Add New Admin
        </button>
      </div>

      {loading ? <Spinner /> : (
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14 }}>
            <thead><tr style={{ background:C.surface }}>
              {['Username','Email','Role','Status','Last Login','Created','Actions'].map(h=>(
                <th key={h} style={{ padding:'10px 12px', textAlign:'left', fontSize:12, fontWeight:700, color:C.muted, borderBottom:`1px solid ${C.border}`, whiteSpace:'nowrap' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {admins.map(a => (
                <tr key={a.id} style={{ borderBottom:`1px solid ${C.border}` }}>
                  <td style={{ padding:'10px 12px', fontWeight:600 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:8, height:8, borderRadius:'50%', background:a.is_active?C.success:'#D1D5DB', flexShrink:0 }} />
                      {a.username}
                      {a.id === currentAdmin.id && <span style={{ background:`${C.orange}20`, color:C.orange, fontSize:10, padding:'1px 6px', borderRadius:10, fontWeight:700 }}>YOU</span>}
                    </div>
                  </td>
                  <td style={{ padding:'10px 12px', color:C.muted, fontSize:13 }}>{a.email}</td>
                  <td style={{ padding:'10px 12px' }}>
                    <span style={{ background: a.role==='super_admin'?`${C.red}15`:`${C.orange}15`, color: a.role==='super_admin'?C.red:C.orange, borderRadius:20, padding:'3px 10px', fontSize:11, fontWeight:700 }}>
                      {a.role==='super_admin'?'Super Admin':'Admin'}
                    </span>
                  </td>
                  <td style={{ padding:'10px 12px' }}>
                    <button onClick={()=>handleToggleActive(a)} disabled={a.id===currentAdmin.id}
                      style={{ background:a.is_active?'#D1FAE5':'#FEE2E2', color:a.is_active?'#065F46':'#DC2626', border:'none', borderRadius:20, padding:'3px 10px', fontSize:11, fontWeight:700, cursor:a.id===currentAdmin.id?'not-allowed':'pointer' }}>
                      {a.is_active?'Active':'Inactive'}
                    </button>
                  </td>
                  <td style={{ padding:'10px 12px', color:C.muted, fontSize:12 }}>{fmtDateTime(a.last_login)}</td>
                  <td style={{ padding:'10px 12px', color:C.muted, fontSize:12 }}>{fmtDate(a.created_at)}</td>
                  <td style={{ padding:'10px 12px' }}>
                    <div style={{ display:'flex', gap:6 }}>
                      <button onClick={()=>{ setSelected(a); setModal('edit'); }}
                        style={{ background:'#DBEAFE', color:'#1D4ED8', border:'none', borderRadius:6, padding:'5px 10px', fontSize:12, cursor:'pointer', fontWeight:600 }}>Edit</button>
                      <button onClick={()=>handleResetPw(a)} disabled={actionLoading}
                        style={{ background:'#FEF3C7', color:'#D97706', border:'none', borderRadius:6, padding:'5px 10px', fontSize:12, cursor:'pointer', fontWeight:600 }}>Reset PW</button>
                      {a.id !== currentAdmin.id && (
                        <button onClick={()=>{ setSelected(a); setModal('delete'); }}
                          style={{ background:'#FEE2E2', color:C.red, border:'none', borderRadius:6, padding:'5px 10px', fontSize:12, cursor:'pointer', fontWeight:600 }}>Delete</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(modal==='create'||modal==='edit') && (
        <AdminFormModal initial={modal==='edit'?selected:null} onClose={()=>setModal(null)} onSave={()=>load()} toast={toast} />
      )}
      {modal==='delete' && selected && (
        <ConfirmDeleteModal admin={selected} onClose={()=>setModal(null)} onConfirm={handleDelete} loading={actionLoading} />
      )}
      {modal==='resetpw' && selected && newPw && (
        <ResetPwModal admin={selected} newPw={newPw} onClose={()=>setModal(null)} />
      )}
    </div>
  );
};

// ── Dashboard overview ─────────────────────────────────────
const DashboardOverview = ({ admin }: { admin: AdminUser }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin.dashboard().then(d => { setData(d); setLoading(false); });
  }, []);

  if (loading) return <Spinner />;
  if (!data || data.error) return <div style={{ color:C.muted, textAlign:'center', padding:40 }}>{data?.error || 'Failed to load dashboard'}</div>;

  const stats = data.stats || {};
  const recentOrders = data.recentOrders || [];
  const recentSubscribers = data.recentSubscribers || [];
  const visitorsByCountry = data.visitorsByCountry || [];

  return (
    <div>
      <h1 style={{ fontSize:22, fontWeight:800, color:C.text, marginBottom:20 }}>
        Good {new Date().getHours()<12?'morning':'afternoon'}, {admin.username} 👋
      </h1>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))', gap:16, marginBottom:24 }}>
        <StatCard icon="📧" label="Newsletter Subscribers" value={stats.totalNewsletterSubscribers || 0} accent={C.red} />
        <StatCard icon="📦" label="Total Orders" value={stats.totalOrders || 0} sub={`${stats.pendingOrders || 0} pending`} accent={C.orange} />
        <StatCard icon="💰" label="Total Revenue (USD)" value={`$${parseFloat(stats.totalRevenue||'0').toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}`} accent="#10B981" />
        <StatCard icon="🚪" label="Checkout Abandonments" value={stats.checkoutAbandonments || 0} accent="#8B5CF6" />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
        <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:10, padding:20 }}>
          <h3 style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:16 }}>🌍 Visitors by Country</h3>
          <CountryChart data={visitorsByCountry} />
        </div>
        <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:10, padding:20 }}>
          <h3 style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:16 }}>📧 Recent Subscribers</h3>
          {!recentSubscribers.length ? <div style={{ color:C.muted, textAlign:'center', padding:20 }}>No subscribers yet</div>
          : recentSubscribers.map((s: any, i: number) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:`1px solid ${C.border}` }}>
              <span style={{ fontSize:13, color:C.text }}>{s.email}</span>
              <span style={{ fontSize:11, color:C.muted }}>{s.country||'—'}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:10, padding:20 }}>
        <h3 style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:16 }}>📦 Recent Orders</h3>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14 }}>
            <thead><tr style={{ background:C.surface }}>
              {['Order #','Customer','Total','Status','Date'].map(h=>(
                <th key={h} style={{ padding:'8px 12px', textAlign:'left', fontSize:12, fontWeight:700, color:C.muted, borderBottom:`1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {!recentOrders.length ? <tr><td colSpan={5} style={{ textAlign:'center', padding:30, color:C.muted }}>No orders yet</td></tr>
              : recentOrders.map((o: any) => (
                <tr key={o.id} style={{ borderBottom:`1px solid ${C.border}` }}>
                  <td style={{ padding:'8px 12px' }}><code style={{ background:C.surface, padding:'2px 6px', borderRadius:4, fontSize:12 }}>{o.order_number}</code></td>
                  <td style={{ padding:'8px 12px', fontWeight:500 }}>{o.customer_name}</td>
                  <td style={{ padding:'8px 12px', fontWeight:700 }}>{o.currency} {parseFloat(o.total_amount||0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td style={{ padding:'8px 12px' }}>
                    <span style={{ background:'#FEF3C7', color:'#D97706', borderRadius:20, padding:'3px 10px', fontSize:11, fontWeight:700 }}>{o.status}</span>
                  </td>
                  <td style={{ padding:'8px 12px', color:C.muted, fontSize:12 }}>{fmtDate(o.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ── Login Screen ───────────────────────────────────────────
const LoginScreen = ({ onLogin }: { onLogin: (a: AdminUser) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    const d = await api.admin.login(username, password);
    if (d.admin) onLogin(d.admin);
    else setError(d.error || 'Login failed. Please check your credentials.');
    setLoading(false);
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:C.surface, padding:24 }}>
      <div style={{ background:C.white, borderRadius:14, padding:'48px 40px', width:'100%', maxWidth:420, boxShadow:'0 10px 40px rgba(0,0,0,0.1)', border:`1px solid ${C.border}` }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <img src="https://i.postimg.cc/Y9M7TqxR/logo.webp" alt="Procolored" style={{ height:48, objectFit:'contain', marginBottom:8 }} />
          <h1 style={{ fontSize:20, fontWeight:700, color:C.text, margin:'8px 0 4px' }}>Admin Panel</h1>
          <p style={{ color:C.muted, fontSize:13 }}>Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
          <div>
            <label style={lbl}>Username</label>
            <input id="admin-username" type="text" value={username} onChange={e=>setUsername(e.target.value)} style={inp} placeholder="Enter username" required autoComplete="username" />
          </div>
          <div>
            <label style={lbl}>Password</label>
            <input id="admin-password" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={inp} placeholder="Enter password" required autoComplete="current-password" />
          </div>
          {error && <div style={{ background:'#FEE2E2', color:C.red, borderRadius:8, padding:'10px 14px', fontSize:13, border:`1px solid ${C.red}30` }}>{error}</div>}
          <button id="admin-login-btn" type="submit" disabled={loading}
            style={{ background:C.red, color:'#fff', border:'none', borderRadius:8, padding:14, fontWeight:700, fontSize:15, cursor:'pointer', opacity:loading?0.7:1, transition:'all 0.2s' }}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>
        <p style={{ textAlign:'center', color:C.muted, fontSize:11, marginTop:24 }}>🔒 Protected with JWT + bcrypt</p>
      </div>
    </div>
  );
};

// ── MAIN DASHBOARD ─────────────────────────────────────────
const AdminDashboard = () => {
  const [admin, setAdmin] = useState<AdminUser|null>(null);
  const [checking, setChecking] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { toasts, toast } = useToast();

  useEffect(() => {
    const verifySession = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/admin/verify`, {
          credentials: 'include',
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          const d = await res.json();
          if (d.admin) setAdmin(d.admin);
        }
      } catch (_) {
        // Timeout, network error, or 401 — all fall through to login screen
      } finally {
        setChecking(false); // ALWAYS clears — no more infinite spinner
      }
    };
    verifySession();
  }, []);

  const handleLogout = async () => {
    await api.admin.logout();
    setAdmin(null); setActiveTab('dashboard');
  };

  if (checking) return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:C.surface }}>
      <div style={{ width:40, height:40, borderRadius:'50%', border:`3px solid ${C.border}`, borderTop:`3px solid ${C.red}`, animation:'spin 0.7s linear infinite' }} />
      <p style={{ color:C.muted, marginTop:16, fontSize:14 }}>Verifying session…</p>
    </div>
  );

  if (!admin) return <LoginScreen onLogin={setAdmin} />;

  const tabs = [
    { id:'dashboard', icon:'📊', label:'Overview' },
    { id:'orders',    icon:'📦', label:'Orders' },
    { id:'newsletter',icon:'📧', label:'Newsletter' },
    { id:'abandonments',icon:'🚪', label:'Abandonments' },
    ...(admin.role==='super_admin' || admin.can_manage_keys ? [{ id:'paymentGateways', icon:'💳', label:'Payment Gateways' }] : []),
    ...(admin.role==='super_admin'?[{ id:'admins', icon:'👥', label:'Admins' }]:[]),
  ];

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:C.surface, fontFamily:'Inter,system-ui,sans-serif' }}>
      <ToastContainer toasts={toasts} />

      {/* Sidebar */}
      <aside style={{ width:220, background:C.white, borderRight:`1px solid ${C.border}`, display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh', flexShrink:0 }}>
        <div style={{ padding:'20px 16px', borderBottom:`1px solid ${C.border}` }}>
          <img src="https://i.postimg.cc/Y9M7TqxR/logo.webp" alt="Procolored" style={{ height:36, objectFit:'contain' }} />
          <div style={{ fontSize:11, color:C.muted, marginTop:4, fontWeight:500 }}>Admin Dashboard</div>
        </div>
        <nav style={{ padding:'12px 8px', flex:1 }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
              style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'10px 12px', borderRadius:8, border:'none', background:'none', textAlign:'left', cursor:'pointer', fontSize:14, fontWeight: activeTab===tab.id ? 700 : 500, color: activeTab===tab.id ? C.red : C.text, borderLeft: activeTab===tab.id ? `3px solid ${C.red}` : '3px solid transparent', transition:'all 0.15s' }}>
              <span>{tab.icon}</span><span>{tab.label}</span>
            </button>
          ))}
        </nav>
        <div style={{ padding:'12px 16px', borderTop:`1px solid ${C.border}` }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:C.red, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:14, flexShrink:0 }}>
              {admin.username[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{admin.username}</div>
              <div style={{ fontSize:11, color:C.muted }}>{admin.role==='super_admin'?'Super Admin':'Admin'}</div>
            </div>
          </div>
          <button id="admin-logout-btn" onClick={handleLogout}
            style={{ width:'100%', background:'#FEE2E2', color:C.red, border:'none', borderRadius:6, padding:'8px', cursor:'pointer', fontSize:13, fontWeight:600 }}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex:1, padding:28, overflowY:'auto', maxWidth:'calc(100vw - 220px)' }}>
        {activeTab==='dashboard'    && <DashboardOverview admin={admin} />}
        {activeTab==='orders'       && <OrdersTab toast={toast} />}
        {activeTab==='newsletter'   && <NewsletterTab />}
        {activeTab==='abandonments' && <AbandonmentsTab />}
        {activeTab==='paymentGateways' && (admin.role==='super_admin' || admin.can_manage_keys) && <PaymentGatewaysTab admin={admin} toast={toast} />}
        {activeTab==='admins' && admin.role==='super_admin' && <AdminsTab currentAdmin={admin} toast={toast} />}
      </main>
    </div>
  );
};

export default AdminDashboard;
