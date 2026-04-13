import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { useCurrency, convertPrice } from '../context/CurrencyContext';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, CreditCard, Lock, ShieldCheck, AlertCircle, X, Tag, ChevronRight } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const STRIPE_PK = 'pk_live_51TCQKWIXB0IPPK5N9scYtqgos5k2N7etZtTPgP5lO9cBVa4xA34KrqnzkVRPdwWAMuzv3gcuRJh7isn5JpUtY3kF00WCs32dcA';
const DEMO_PRODUCT_ID = 'procolored-demo-order-test';

function getSessionId(): string {
  let id = localStorage.getItem('procolored_session');
  if (!id) { id = `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`; localStorage.setItem('procolored_session', id); }
  return id;
}

interface OrderSuccessData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  paymentMethod: string;
  cartItems: any[];
  shippingAddress: { street: string; apartment?: string; city: string; state?: string; postalCode: string; country: string };
  isDemoOrder?: boolean;
}

// ── Policy content for inline modals ───────────────────────────────────────
const POLICIES: Record<string, { title: string; content: string }> = {
  refund: {
    title: 'Refund Policy',
    content: `OVERVIEW\nProcolored offers a return/refund policy for manufacturing defects reported within 30 days of delivery.\n\nELIGIBLE RETURNS\n• Products with confirmed manufacturing defects\n• Items damaged in transit (must report within 48 hours of delivery)\n• Wrong items shipped\n\nNON-ELIGIBLE RETURNS\n• Damage caused by improper use or installation\n• Normal wear and tear\n• Products without original packaging\n\nPROCESS\nContact support@procollored.com with your order number and photos of the issue. Our team will respond within 24–48 business hours with instructions.\n\nREFUND TIMELINE\nApproved refunds are processed within 5–10 business days to the original payment method.`,
  },
  shipping: {
    title: 'Shipping Policy',
    content: `SHIPPING TIMES\nAll orders are processed within 1–3 business days. Estimated delivery is 14–17 business days worldwide.\n\nFREE SHIPPING\nAll Procolored products ship FREE worldwide with no minimum order value.\n\nTRACKING\nOnce your order ships, you'll receive a tracking number via email. Allow 24–48 hours for tracking to update.\n\nCUSTOMS & DUTIES\nInternational orders may be subject to customs fees or import duties depending on your country. These are the responsibility of the buyer.\n\nDELAYS\nShipping times may be affected by holidays, customs clearance, or carrier delays. Procolored is not responsible for delays caused by these factors.`,
  },
  privacy: {
    title: 'Privacy Policy',
    content: `OVERVIEW\nProcolored ("we", "us", "our") operates procolored-us.com. This policy explains how we collect, use, and protect your personal information.\n\nINFORMATION WE COLLECT\n• Contact information (name, email, phone)\n• Shipping and billing addresses\n• Payment information (processed securely by Stripe)\n• Device and browser information for analytics\n\nHOW WE USE IT\n• To process and fulfill your orders\n• To send order confirmations and shipping updates\n• To improve our products and services\n• To send marketing communications (with your consent)\n\nDATA SHARING\nWe do not sell your personal data. We share it only with service providers necessary to operate our business (payment processors, shipping carriers).\n\nYOUR RIGHTS\nYou may request access, correction, or deletion of your personal data by contacting support@procollored.com.`,
  },
  tos: {
    title: 'Terms of Service',
    content: `OVERVIEW\nBy visiting procolored-us.com and purchasing our products, you agree to be bound by these Terms of Service.\n\nUSE OF SITE\nYou may use this site for lawful purposes only. You agree not to use the site to transmit any harmful, offensive, or illegal content.\n\nPRODUCT INFORMATION\nWe reserve the right to modify product specifications, prices, and availability without notice. Product images are for illustration purposes.\n\nORDERS\nAll orders are subject to acceptance. We reserve the right to refuse or cancel any order at our discretion.\n\nPAYMENT\nAll prices are in USD. Payment is processed securely through Stripe. By placing an order, you confirm the payment information is accurate.\n\nINTELLECTUAL PROPERTY\nAll content on this site is owned by Procolored and may not be reproduced without written permission.\n\nLIMITATION OF LIABILITY\nProcolored is not liable for indirect, incidental, or consequential damages arising from the use of our products or services.`,
  },
  contact: {
    title: 'Contact Us',
    content: `CUSTOMER SUPPORT\nBefore-sales: support@procollored.com\nAfter-sales: support@procollored.com\n\nSUPPORT HOURS\nMonday – Friday: 9:00 AM – 6:00 PM (EST)\nWeekend: Limited support via email\n\nRESPONSE TIME\nWe aim to respond to all inquiries within 24–48 business hours.\n\nWARRANTY SUPPORT\nFor warranty claims and technical support, please include your order number and a description of the issue.`,
  },
};

// ── Policy Modal ─────────────────────────────────────────────────────────────
function PolicyModal({ policyKey, onClose }: { policyKey: string; onClose: () => void }) {
  const policy = POLICIES[policyKey];
  if (!policy) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 8, maxWidth: 560, width: '100%', maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#1a1a1a' }}>{policy.title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 4, display: 'flex', alignItems: 'center' }}>
            <X size={20} color="#666" />
          </button>
        </div>
        <div style={{ padding: '20px 24px', overflowY: 'auto', fontSize: 14, color: '#444', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
          {policy.content}
        </div>
      </div>
    </div>
  );
}

// ── Stripe Payment Form ───────────────────────────────────────────────────────
function StripePaymentForm({ isSubmitting, setIsSubmitting, onSuccess, validateForm, customerName, customerEmail }: {
  isSubmitting: boolean; setIsSubmitting: (v: boolean) => void;
  onSuccess: (txId: string) => void; validateForm: () => boolean;
  customerName?: string; customerEmail?: string;
}) {
  const stripe = useStripe(); const elements = useElements();
  const [errorMsg, setErrorMsg] = useState('');

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!stripe || !elements) return;
    setIsSubmitting(true); setErrorMsg('');
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements, redirect: 'if_required', confirmParams: {
          return_url: window.location.href,
          payment_method_data: { billing_details: { name: customerName || 'Customer', email: customerEmail || undefined } }
        },
      });
      if (error) throw new Error(error.message || 'Payment failed.');
      if (paymentIntent?.status === 'succeeded') onSuccess(paymentIntent.id);
      else throw new Error('Payment not completed. Try again.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment failed.');
    } finally { setIsSubmitting(false); }
  };

  return (
    <form onSubmit={handlePay}>
      <div style={{ border: '1px solid #d1d5db', borderRadius: 8, overflow: 'hidden', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #f3f4f6', background: '#fafafa' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#555' }}>
            <Lock size={12} color="#5469d4" /> All transactions are secure and encrypted.
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" style={{ height: 10, opacity: 0.6 }} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MC" style={{ height: 14, opacity: 0.6 }} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="Amex" style={{ height: 14, opacity: 0.6 }} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/1/16/Former_Unionpay_logo.svg" alt="UP" style={{ height: 14, opacity: 0.6 }} />
          </div>
        </div>
        <div style={{ padding: 16 }}>
          <PaymentElement options={{ layout: 'tabs', wallets: { applePay: 'never', googlePay: 'never' }, fields: { billingDetails: 'never' } }} />
        </div>
      </div>
      {errorMsg && (
        <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, color: '#dc2626', fontSize: 13, marginBottom: 12, display: 'flex', gap: 8 }}>
          <X size={13} style={{ flexShrink: 0, marginTop: 2 }} /> {errorMsg}
        </div>
      )}
      <button type="submit" disabled={isSubmitting || !stripe}
        style={{ width: '100%', background: '#1a1a1a', color: '#fff', border: 'none', padding: 15, borderRadius: 6, fontSize: 15, fontWeight: 700, cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        {isSubmitting
          ? <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />Processing...</>
          : <><CreditCard size={16} /> Pay now</>}
      </button>
    </form>
  );
}

function DemoOrderButton({ isSubmitting, onSubmit }: { isSubmitting: boolean; onSubmit: () => void }) {
  return (
    <div>
      <div style={{ padding: '12px 16px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, marginBottom: 12, fontSize: 13, color: '#92400e' }}>
        🧪 <strong>Demo Order</strong> — No payment required. This is a $0–$1 test order.
      </div>
      <button onClick={onSubmit} disabled={isSubmitting}
        style={{ width: '100%', background: '#1a1a1a', color: '#fff', border: 'none', padding: 15, borderRadius: 6, fontSize: 15, fontWeight: 700, cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        {isSubmitting
          ? <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />Processing...</>
          : <><CheckCircle size={16} /> Place order</>}
      </button>
    </div>
  );
}

// ── Order Confirmed Screen ────────────────────────────────────────────────────
function OrderConfirmation({
  data, cartItems, onContinue, openPolicy,
}: {
  data: OrderSuccessData;
  cartItems: any[];
  onContinue: () => void;
  openPolicy: (k: string) => void;
}) {
  const addr = data.shippingAddress;
  const addrLine = [addr?.street, addr?.apartment].filter(Boolean).join(', ');
  const addrLine2 = [addr?.city, addr?.state, addr?.postalCode].filter(Boolean).join(' ');

  return (
    <div style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif', maxWidth: 540 }}>
      {/* Confirmation header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 28 }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 4 }}>
          <CheckCircle size={24} color="#1a1a1a" />
        </div>
        <div>
          <div style={{ fontSize: 13, color: '#777', marginBottom: 4 }}>Confirmation #{data.orderNumber}</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, color: '#1a1a1a' }}>Thank you, {data.customerName.split(' ')[0]}!</h1>
        </div>
      </div>

      {/* Order confirmed banner */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '20px 24px', marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: '#1a1a1a' }}>Your order is confirmed</h2>
        <p style={{ margin: '0 0 16px', fontSize: 14, color: '#666' }}>You'll receive a confirmation email soon</p>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#333', cursor: 'pointer' }}>
          <input type="checkbox" defaultChecked style={{ width: 14, height: 14, cursor: 'pointer' }} />
          Email me with news and offers
        </label>
      </div>

      {/* Order details */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '20px 24px', marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 20px', color: '#1a1a1a' }}>Order details</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 32px' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>Contact information</div>
            <div style={{ fontSize: 14, color: '#555' }}>{data.customerEmail}</div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>Payment method</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#555' }}>
              <span style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 4, padding: '2px 10px', fontSize: 13, fontWeight: 600 }}>💳 {data.paymentMethod}</span>
            </div>
            {data.totalAmount > 0 && <div style={{ fontSize: 13, color: '#777', marginTop: 6 }}>${data.totalAmount.toFixed(2)} USD</div>}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>Shipping address</div>
            <div style={{ fontSize: 14, color: '#555', lineHeight: 1.7 }}>
              {data.customerName}<br />
              {addrLine && <>{addrLine}<br /></>}
              {addrLine2 && <>{addrLine2}<br /></>}
              {addr?.country}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>Billing address</div>
            <div style={{ fontSize: 14, color: '#555', lineHeight: 1.7 }}>
              {data.customerName}<br />
              {addrLine && <>{addrLine}<br /></>}
              {addrLine2 && <>{addrLine2}<br /></>}
              {addr?.country}
            </div>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>Shipping method</div>
            <div style={{ fontSize: 14, color: '#555' }}>Standard Shipping (14–17 business days)</div>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
        <div style={{ fontSize: 14, color: '#666' }}>
          Need help?{' '}
          <button onClick={() => openPolicy('contact')} style={{ background: 'none', border: 'none', color: '#1a1a1a', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>Contact us</button>
        </div>
        <button onClick={onContinue}
          style={{ background: '#1a1a1a', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: 6, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
          Continue shopping
        </button>
      </div>

      {/* Policy links */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 18px', borderTop: '1px solid #e5e7eb', paddingTop: 18 }}>
        {[['Refund policy','refund'],['Shipping','shipping'],['Privacy policy','privacy'],['Terms of service','tos'],['Contact','contact']].map(([label,key]) => (
          <button key={key} onClick={() => openPolicy(key)}
            style={{ background: 'none', border: 'none', padding: 0, fontSize: 12, color: '#888', textDecoration: 'underline', cursor: 'pointer' }}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Shell — TOP-LEVEL component (NOT nested inside Checkout) ──────────────────
// IMPORTANT: defining this outside Checkout prevents React from remounting it on
// every state change, which would cause all inputs to lose focus after each keystroke.
interface ShellProps {
  activePolicyKey: string | null;
  onClosePolicy: () => void;
  children: React.ReactNode;
}
function CheckoutShell({ activePolicyKey, onClosePolicy, children }: ShellProps) {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus, select:focus { border-color: #1a1a1a !important; outline: none; box-shadow: 0 0 0 3px rgba(0,0,0,0.06); }
        input::placeholder, select::placeholder { color: #aaa; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 3px; }
        @media (max-width: 768px) { .checkout-layout { flex-direction: column !important; } .checkout-right { width: 100% !important; height: auto !important; position: relative !important; border-left: none !important; border-top: 1px solid #e5e7eb !important; } .checkout-left { padding: 24px 20px 40px !important; } }
      `}</style>
      {activePolicyKey && <PolicyModal policyKey={activePolicyKey} onClose={onClosePolicy} />}
      <header style={{ borderBottom: '1px solid #e5e7eb', padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img src="https://i.postimg.cc/fTQtLtrH/procolored-logo-4k-transparent1.png" alt="Procolored" style={{ height: 30 }} />
        </Link>
        <Link to="/" style={{ fontSize: 13, color: '#555', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
          Return to store <ChevronRight size={13} />
        </Link>
      </header>
      {children}
    </div>
  );
}

// ── Right Order Summary Panel — TOP-LEVEL component (NOT nested inside Checkout) ──
// Same reason: must be outside Checkout to avoid remounting on every keystroke.
interface RightPanelProps {
  displayItems: any[];
  successData: OrderSuccessData | null;
  isDemoCart: boolean;
  fmtUSD: (n: number) => string;
  discountApplied: boolean;
  discountCode: string;
  setDiscountCode: (v: string) => void;
  discountError: string;
  setDiscountError: (v: string) => void;
  subtotalUSD: number;
  discountAmount: number;
  totalUSD: number;
  handleApplyDiscount: (e: React.FormEvent) => void;
  setDiscountApplied: (v: boolean) => void;
}
function CheckoutRightPanel({
  displayItems, successData, isDemoCart, fmtUSD, discountApplied, discountCode,
  setDiscountCode, discountError, setDiscountError, subtotalUSD, discountAmount,
  totalUSD, handleApplyDiscount, setDiscountApplied,
}: RightPanelProps) {
  const inp = { width: '100%', border: '1px solid #d1d5db', borderRadius: 6, padding: '12px 14px', fontSize: 14, outline: 'none', background: '#fff', boxSizing: 'border-box' as const, color: '#1a1a1a', fontFamily: 'inherit' };
  return (
    <div style={{
      width: '44%', minWidth: 320, maxWidth: 520, background: '#f5f5f5', borderLeft: '1px solid #e5e7eb',
      position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', padding: '40px 36px',
      boxSizing: 'border-box', flexShrink: 0,
    }}>
      {/* Items list */}
      <div style={{ marginBottom: 20 }}>
        {displayItems.map((item: any, idx: number) => {
          const price = item.priceUSD ?? 0;
          const qty = item.quantity ?? 1;
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 18 }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ width: 60, height: 60, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 6 }}>
                  {item.image && <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
                </div>
                <span style={{ position: 'absolute', top: -8, right: -8, width: 20, height: 20, background: '#888', color: '#fff', borderRadius: '50%', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {qty}
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', lineHeight: 1.4 }}>{item.name}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', whiteSpace: 'nowrap' }}>
                {price > 0 ? fmtUSD(price * qty) : 'FREE'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Discount input — only during checkout (not on confirmation) */}
      {!successData && !isDemoCart && (
        <div style={{ marginBottom: 16 }}>
          <form onSubmit={handleApplyDiscount} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Tag size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
              <input type="text" value={discountCode} onChange={e => { setDiscountCode(e.target.value); setDiscountError(''); }}
                placeholder="Discount code or gift card" disabled={discountApplied}
                style={{ ...inp, paddingLeft: 34, fontSize: 13 }} />
            </div>
            <button type="submit" disabled={!discountCode.trim() || discountApplied}
              style={{ padding: '12px 14px', border: '1px solid #d1d5db', borderRadius: 6, background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', color: discountCode.trim() && !discountApplied ? '#1a1a1a' : '#aaa' }}>
              Apply
            </button>
          </form>
          {discountError && <div style={{ fontSize: 12, color: '#dc2626' }}>{discountError}</div>}
          {discountApplied && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, fontSize: 13, color: '#166534' }}>
              🏷️ <strong>PROCOLORED5</strong> — 5% off applied
              <button onClick={() => { setDiscountApplied(false); setDiscountCode(''); }} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#166534', fontSize: 18, lineHeight: 1, padding: 0 }}>×</button>
            </div>
          )}
        </div>
      )}

      {/* Totals */}
      <div style={{ borderTop: '1px solid #d5d5d5', paddingTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#555', marginBottom: 10 }}>
          <span>Subtotal</span>
          <span style={{ color: '#1a1a1a', fontWeight: 500 }}>{isDemoCart ? 'FREE' : fmtUSD(subtotalUSD)}</span>
        </div>
        {discountApplied && !isDemoCart && !successData && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#555', marginBottom: 10 }}>
            <span>Order discount <span style={{ fontSize: 12, color: '#166534', fontWeight: 600 }}>(PROCOLORED5)</span></span>
            <span style={{ color: '#166534', fontWeight: 600 }}>−{fmtUSD(discountAmount)}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#555', marginBottom: 10 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            Shipping
            <span title="Free worldwide shipping" style={{ width: 14, height: 14, border: '1px solid #bbb', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#888', cursor: 'help', flexShrink: 0 }}>?</span>
          </span>
          <span style={{ fontWeight: 700, color: '#22c55e' }}>FREE</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#555', marginBottom: 18 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            Estimated taxes
            <span title="No taxes applied" style={{ width: 14, height: 14, border: '1px solid #bbb', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#888', cursor: 'help', flexShrink: 0 }}>?</span>
          </span>
          <span style={{ color: '#1a1a1a', fontWeight: 500 }}>$0.00</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #d5d5d5', paddingTop: 14 }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: '#1a1a1a' }}>Total</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 13, color: '#888' }}>USD</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a' }}>
              {isDemoCart ? '$0.00' : fmtUSD(successData ? successData.totalAmount : totalUSD)}
            </span>
          </div>
        </div>
        {discountApplied && !isDemoCart && !successData && (
          <div style={{ fontSize: 13, color: '#166534', marginTop: 10 }}>
            🏷️ <strong>TOTAL SAVINGS {fmtUSD(discountAmount)}</strong>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Checkout ─────────────────────────────────────────────────────────────
export default function Checkout() {
  const { items, cartSubtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { currency } = useCurrency();

  // Form fields
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [postal, setPostal] = useState('');
  const [country, setCountry] = useState('United States');
  const [phone, setPhone] = useState('');
  const [billingSame, setBillingSame] = useState(true);

  // App state
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountError, setDiscountError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<OrderSuccessData | null>(null);
  const [activePolicyKey, setActivePolicyKey] = useState<string | null>(null);

  // Stripe
  const [stripePublishableKey, setStripePublishableKey] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isFreeOrder, setIsFreeOrder] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);

  // Memoize stripePromise — only recreated when the publishable key changes.
  const stripePromise = useMemo(
    () => stripePublishableKey
      ? loadStripe(stripePublishableKey, { advancedFraudSignals: false } as any)
      : null,
    [stripePublishableKey]
  );

  // Pricing — always in USD
  const subtotalUSD = items.reduce((sum, item) => sum + (convertPrice(item.price, 278) * item.quantity), 0);
  const discountAmount = discountApplied ? subtotalUSD * 0.05 : 0;
  const totalUSD = subtotalUSD - discountAmount;
  const isDemoCart = items.some(i => i.id === DEMO_PRODUCT_ID) && totalUSD <= 1;

  const fmtUSD = (n: number) => `$${n.toFixed(2)}`;

  // Abandonment tracking refs
  const orderCompletedRef = useRef(false);
  const abandonmentFiredRef = useRef(false);
  const latestEmailRef = useRef('');
  const latestNameRef = useRef('');
  const latestCityRef = useRef('');
  const latestCountryRef = useRef('United States');
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => { latestEmailRef.current = email; }, [email]);
  useEffect(() => { latestNameRef.current = [firstName, lastName].filter(Boolean).join(' '); }, [firstName, lastName]);
  useEffect(() => { latestCityRef.current = city; }, [city]);
  useEffect(() => { latestCountryRef.current = country; }, [country]);

  useEffect(() => {
    fetch(`${API_BASE}/api/stripe/config`)
      .then(r => r.json()).then(d => setStripePublishableKey(d?.publishableKey || STRIPE_PK))
      .catch(() => setStripePublishableKey(STRIPE_PK));
  }, []);

  useEffect(() => {
    if (isDemoCart || totalUSD === 0) { setIsFreeOrder(true); setClientSecret(null); return; }
    if (totalUSD > 0 && stripePublishableKey && !clientSecret) {
      fetch(`${API_BASE}/api/stripe/create-payment-intent`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(totalUSD * 100), currency: 'usd' }),
      }).then(r => r.json()).then(d => {
        if (d.isFreeOrder) setIsFreeOrder(true);
        else if (d.clientSecret) { setClientSecret(d.clientSecret); setIsFreeOrder(false); }
        else setStripeError(d.error || 'Could not initialize payment.');
      }).catch(() => setStripeError('Network error. Could not initialize Stripe.'));
    }
  }, [totalUSD, stripePublishableKey, clientSecret, isDemoCart]);

  useEffect(() => {
    if (totalUSD > 0 && stripePublishableKey && !isDemoCart) setClientSecret(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discountApplied]);

  // Note: IP geolocation removed — caused CORS/403 errors on production.
  // Users can manually select their country from the dropdown.

  const fireAbandonment = useCallback((stepName = 'checkout') => {
    if (orderCompletedRef.current || abandonmentFiredRef.current || items.length === 0) return;
    abandonmentFiredRef.current = true;
    const payload = { sessionId: getSessionId(), customerEmail: latestEmailRef.current || null, customerName: latestNameRef.current || null, cartItems: items.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price })), cartTotal: subtotalUSD.toFixed(2), stepAbandoned: stepName, country: latestCountryRef.current, city: latestCityRef.current, deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop' };
    const jsonStr = JSON.stringify(payload);
    const url = `${API_BASE}/api/checkout/abandon`;
    fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: jsonStr, keepalive: true }).catch(() => { try { navigator.sendBeacon(url + '?_beacon=1', jsonStr); } catch (_) {} });
  }, [items, subtotalUSD]);

  useEffect(() => {
    if (items.length === 0) return;
    let t = setTimeout(() => fireAbandonment('idle_10min'), 600000);
    const reset = () => { clearTimeout(t); t = setTimeout(() => fireAbandonment('idle_10min'), 600000); };
    window.addEventListener('mousemove', reset); window.addEventListener('keydown', reset);
    const onUnload = () => fireAbandonment('left_page');
    window.addEventListener('beforeunload', onUnload);
    return () => { clearTimeout(t); window.removeEventListener('mousemove', reset); window.removeEventListener('keydown', reset); window.removeEventListener('beforeunload', onUnload); if (!orderCompletedRef.current) fireAbandonment('navigated_away'); };
  }, [fireAbandonment]);

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault(); setDiscountError('');
    if (discountCode.trim().toUpperCase() === 'PROCOLORED5') setDiscountApplied(true);
    else setDiscountError('Invalid discount code.');
  };

  const validateEmail = (v: string) => {
    if (!v) return 'Email address is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Please enter a valid email address';
    return '';
  };

  const validateForm = () => {
    const err = validateEmail(email);
    if (err) { setEmailError(err); emailRef.current?.focus(); emailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return false; }
    if (!firstName || !lastName) { alert('Please enter your first and last name.'); return false; }
    if (!address) { alert('Please enter your address.'); return false; }
    if (!city) { alert('Please enter your city.'); return false; }
    if (!postal) { alert('Please enter your postal code.'); return false; }
    return true;
  };

  const buildShipping = () => ({ street: address, apartment, city, state: stateVal, postalCode: postal, country });

  const buildPayload = (txId: string | null, isDemo = false) => ({
    customerName: `${firstName} ${lastName}`.trim() || 'Customer',
    customerEmail: email, customerPhone: phone || null,
    shippingAddress: buildShipping(), billingAddress: buildShipping(),
    items: items.map(i => ({ id: i.id, name: i.name, price: convertPrice(i.price, 278), quantity: i.quantity, image: i.image })),
    subtotal: subtotalUSD, shippingCost: 0, discountAmount, discountCode: discountApplied ? 'PROCOLORED5' : null,
    totalAmount: isDemo ? 0 : totalUSD, currency: 'USD', country, city,
    paymentMethod: isDemo ? 'Demo (No Payment)' : 'Stripe', paymentStatus: 'paid', transactionId: txId,
  });

  const handleOrderComplete = async (txId: string) => {
    setIsSubmitting(true); orderCompletedRef.current = true;
    try {
      const res = await fetch(`${API_BASE}/api/checkout/order`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(buildPayload(txId, false)) });
      const data = await res.json();
      if (res.ok && data.orderNumber) {
        clearCart();
        setSuccessData({ orderNumber: data.orderNumber, customerName: `${firstName} ${lastName}`.trim(), customerEmail: email, totalAmount: totalUSD, paymentMethod: 'Stripe', cartItems: items.map(i => ({ name: i.name, priceUSD: convertPrice(i.price, 278), quantity: i.quantity, image: i.image })), shippingAddress: buildShipping(), isDemoOrder: false });
      } else { alert(data.error || 'Order could not be saved.'); orderCompletedRef.current = false; }
    } catch { alert('Network error. Contact support.'); orderCompletedRef.current = false; }
    finally { setIsSubmitting(false); }
  };

  const handleDemoOrder = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true); orderCompletedRef.current = true;
    try {
      const res = await fetch(`${API_BASE}/api/checkout/demo-order`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customerName: `${firstName} ${lastName}`.trim() || 'Demo Customer', customerEmail: email, shippingAddress: buildShipping(), country, city }) });
      const data = await res.json();
      if (res.ok && data.orderNumber) {
        clearCart();
        setSuccessData({ orderNumber: data.orderNumber, customerName: `${firstName} ${lastName}`.trim(), customerEmail: email, totalAmount: 0, paymentMethod: 'Demo / Free', cartItems: items.map(i => ({ name: i.name, priceUSD: convertPrice(i.price, 278), quantity: i.quantity, image: i.image })), shippingAddress: buildShipping(), isDemoOrder: true });
      } else { alert(data.error || 'Failed to create demo order.'); orderCompletedRef.current = false; }
    } catch { alert('Network error.'); orderCompletedRef.current = false; }
    finally { setIsSubmitting(false); }
  };

  const allCountries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Belgium","Bolivia","Brazil","Bulgaria","Cambodia","Canada","Chile","China","Colombia","Croatia","Cuba","Cyprus","Czechia","Denmark","Ecuador","Egypt","Estonia","Ethiopia","Fiji","Finland","France","Germany","Ghana","Greece","Guatemala","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyzstan","Latvia","Lebanon","Libya","Lithuania","Luxembourg","Malaysia","Maldives","Malta","Mexico","Moldova","Monaco","Mongolia","Morocco","Myanmar","Nepal","Netherlands","New Zealand","Nicaragua","Nigeria","North Korea","Norway","Oman","Pakistan","Panama","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saudi Arabia","Senegal","Serbia","Singapore","Slovakia","Slovenia","Somalia","South Africa","South Korea","Spain","Sri Lanka","Sudan","Sweden","Switzerland","Syria","Tajikistan","Tanzania","Thailand","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"];

  const inp = { width: '100%', border: '1px solid #d1d5db', borderRadius: 6, padding: '12px 14px', fontSize: 14, outline: 'none', background: '#fff', boxSizing: 'border-box' as const, color: '#1a1a1a', fontFamily: 'inherit' };
  const openPolicy = (k: string) => setActivePolicyKey(k);

  // Items for right panel — use saved cartItems after success
  const displayItems = successData ? successData.cartItems : items.map(i => ({
    name: i.name, priceUSD: convertPrice(i.price, 278), quantity: i.quantity, image: i.image,
  }));

  // ── Empty cart ──────────────────────────────────────────────────────────────
  if (items.length === 0 && !successData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fff', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' }}>
        <header style={{ borderBottom: '1px solid #e5e7eb', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/"><img src="https://i.postimg.cc/fTQtLtrH/procolored-logo-4k-transparent1.png" alt="Procolored" style={{ height: 30 }} /></Link>
          <Link to="/" style={{ fontSize: 13, color: '#555', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>Return to store <ChevronRight size={13} /></Link>
        </header>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Your cart is empty</h2>
          <p style={{ color: '#888', marginBottom: 24 }}>Add items to continue.</p>
          <Link to="/collections/all" style={{ background: '#1a1a1a', color: '#fff', padding: '12px 28px', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>Shop now</Link>
        </div>
      </div>
    );
  }

  // ── ORDER CONFIRMATION VIEW ───────────────────────────────────────────────
  if (successData) {
    return (
      <CheckoutShell activePolicyKey={activePolicyKey} onClosePolicy={() => setActivePolicyKey(null)}>
        <div className="checkout-layout" style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
          <div className="checkout-left" style={{ flex: 1, overflowY: 'auto', padding: '52px 56px' }}>
            <OrderConfirmation data={successData} cartItems={successData.cartItems} onContinue={() => { setSuccessData(null); navigate('/'); }} openPolicy={openPolicy} />
          </div>
          <CheckoutRightPanel
            displayItems={displayItems} successData={successData} isDemoCart={isDemoCart}
            fmtUSD={fmtUSD} discountApplied={discountApplied} discountCode={discountCode}
            setDiscountCode={setDiscountCode} discountError={discountError} setDiscountError={setDiscountError}
            subtotalUSD={subtotalUSD} discountAmount={discountAmount} totalUSD={totalUSD}
            handleApplyDiscount={handleApplyDiscount} setDiscountApplied={setDiscountApplied}
          />
        </div>
      </CheckoutShell>
    );
  }

  // ── CHECKOUT FORM VIEW ─────────────────────────────────────────────────────
  return (
    <CheckoutShell activePolicyKey={activePolicyKey} onClosePolicy={() => setActivePolicyKey(null)}>
      <div className="checkout-layout" style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>

        {/* LEFT — scrollable form */}
        <div className="checkout-left" style={{ flex: 1, overflowY: 'auto', padding: '40px 56px 60px' }}>

          {/* Contact */}
          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1a1a1a', margin: '0 0 16px' }}>Contact</h2>
            <input ref={emailRef} id="checkout-email" type="email" placeholder="Email or mobile phone number" value={email}
              onChange={e => { setEmail(e.target.value); if (emailError) setEmailError(validateEmail(e.target.value)); }}
              onBlur={e => setEmailError(validateEmail(e.target.value))}
              style={{ ...inp, borderColor: emailError ? '#dc2626' : '#d1d5db', marginBottom: 4 }} />
            {emailError && <div style={{ fontSize: 12, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}><AlertCircle size={12} />{emailError}</div>}
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, fontSize: 13, color: '#555', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: 14, height: 14, cursor: 'pointer' }} />
              Email me with news and exclusive offers
            </label>
          </section>

          <div style={{ borderTop: '1px solid #e5e7eb', marginBottom: 36 }} />

          {/* Delivery */}
          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1a1a1a', margin: '0 0 16px' }}>Delivery</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#777', marginBottom: 4 }}>Country/Region</label>
                <select value={country} onChange={e => setCountry(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
                  {allCountries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <input id="checkout-first-name" type="text" placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} style={inp} />
                <input id="checkout-last-name" type="text" placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} style={inp} />
              </div>
              <input id="checkout-address" type="text" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} style={inp} />
              <input type="text" placeholder="Apartment, suite, etc. (optional)" value={apartment} onChange={e => setApartment(e.target.value)} style={inp} />
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 10 }}>
                <input id="checkout-city" type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)} style={inp} />
                <input type="text" placeholder="State" value={stateVal} onChange={e => setStateVal(e.target.value)} style={inp} />
                <input id="checkout-postal" type="text" placeholder="ZIP code" value={postal} onChange={e => setPostal(e.target.value)} style={inp} />
              </div>
              <input type="tel" placeholder="Phone (optional)" value={phone} onChange={e => setPhone(e.target.value)} style={inp} />
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#555', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ width: 14, height: 14 }} />
                Save this information for next time
              </label>
            </div>
          </section>

          <div style={{ borderTop: '1px solid #e5e7eb', marginBottom: 36 }} />

          {/* Shipping method */}
          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1a1a1a', margin: '0 0 16px' }}>Shipping method</h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '2px solid #1a1a1a', borderRadius: 8, padding: '14px 16px', background: '#f9fafb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff' }} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>Free Shipping (14–17 business days)</span>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>FREE</span>
            </div>
          </section>

          <div style={{ borderTop: '1px solid #e5e7eb', marginBottom: 36 }} />

          {/* Payment */}
          <section style={{ marginBottom: 36 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Payment</h2>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#666', marginLeft: 'auto' }}>
                <ShieldCheck size={13} color="#22c55e" /> All transactions are secure and encrypted.
              </span>
            </div>

            {(isDemoCart || isFreeOrder)
              ? <DemoOrderButton isSubmitting={isSubmitting} onSubmit={handleDemoOrder} />
              : stripeError
                ? <div style={{ padding: 14, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: 13 }}><strong>Payment Error:</strong> {stripeError}</div>
                : stripePublishableKey && clientSecret
                  ? <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe', variables: { colorPrimary: '#1a1a1a', borderRadius: '6px', fontFamily: 'inherit' }, rules: { '.Input': { boxShadow: 'none', border: '1px solid #d1d5db' }, '.Input:focus': { border: '1px solid #1a1a1a', boxShadow: 'none' } } } }}>
                      <StripePaymentForm isSubmitting={isSubmitting} setIsSubmitting={setIsSubmitting} onSuccess={handleOrderComplete} validateForm={validateForm} customerName={`${firstName} ${lastName}`.trim()} customerEmail={email} />
                    </Elements>
                  : <div style={{ padding: 32, background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 24, height: 24, border: '2px solid #e5e7eb', borderTopColor: '#1a1a1a', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                      <span style={{ fontSize: 13, color: '#888' }}>Loading payment...</span>
                    </div>
            }
          </section>

          <div style={{ borderTop: '1px solid #e5e7eb', marginBottom: 36 }} />

          {/* Billing address */}
          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1a1a1a', margin: '0 0 16px' }}>Billing address</h2>
            <div style={{ border: '1px solid #d1d5db', borderRadius: 8, overflow: 'hidden' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', cursor: 'pointer', background: billingSame ? '#f9fafb' : '#fff', borderBottom: billingSame ? 'none' : '1px solid #e5e7eb' }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: billingSame ? '6px solid #1a1a1a' : '2px solid #d1d5db', flexShrink: 0, transition: 'border 0.15s' }} onClick={() => setBillingSame(true)} />
                <span style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>Same as shipping address</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', cursor: 'pointer', background: !billingSame ? '#f9fafb' : '#fff' }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: !billingSame ? '6px solid #1a1a1a' : '2px solid #d1d5db', flexShrink: 0, transition: 'border 0.15s' }} onClick={() => setBillingSame(false)} />
                <span style={{ fontSize: 14, color: '#1a1a1a' }}>Use a different billing address</span>
              </label>
            </div>
          </section>

          {/* Policy links at bottom of left */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 18px', paddingTop: 8 }}>
            {[['Refund policy','refund'],['Shipping','shipping'],['Privacy policy','privacy'],['Terms of service','tos'],['Contact','contact']].map(([label, key]) => (
              <button key={key} onClick={() => openPolicy(key)}
                style={{ background: 'none', border: 'none', padding: 0, fontSize: 12, color: '#888', textDecoration: 'underline', cursor: 'pointer' }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT — static sticky panel */}
        <CheckoutRightPanel
          displayItems={displayItems} successData={successData} isDemoCart={isDemoCart}
          fmtUSD={fmtUSD} discountApplied={discountApplied} discountCode={discountCode}
          setDiscountCode={setDiscountCode} discountError={discountError} setDiscountError={setDiscountError}
          subtotalUSD={subtotalUSD} discountAmount={discountAmount} totalUSD={totalUSD}
          handleApplyDiscount={handleApplyDiscount} setDiscountApplied={setDiscountApplied}
        />
      </div>
    </CheckoutShell>
  );
}
