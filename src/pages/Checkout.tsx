import { useState, useEffect, useRef, useCallback } from 'react';
import { useCart } from '../context/CartContext';
import { useCurrency, convertPrice } from '../context/CurrencyContext';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ShieldCheck, AlertCircle, X, Tag, ChevronRight } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function getSessionId(): string {
  let id = localStorage.getItem('procolored_session');
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('procolored_session', id);
  }
  return id;
}

interface OrderSuccessData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  paymentMethod: string;
  cartItems: any[];
  shippingAddress: {
    street: string;
    apartment?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };

}

// ── Policy content ────────────────────────────────────────────────────────────
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

// ── Policy Modal ──────────────────────────────────────────────────────────────
function PolicyModal({ policyKey, onClose }: { policyKey: string; onClose: () => void }) {
  const policy = POLICIES[policyKey];
  if (!policy) return null;
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 8, maxWidth: 560, width: '100%', maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
        onClick={e => e.stopPropagation()}
      >
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
function StripePaymentForm({
  totalUSD,
  validateForm,
  handleOrderComplete,
  setIsSubmitting,
}: {
  totalUSD: number;
  validateForm: () => boolean;
  handleOrderComplete: (txId: string, meth: string) => Promise<void>;
  setIsSubmitting: (b: boolean) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !stripe || !elements) return;

    setProcessing(true);
    setIsSubmitting(true);
    setError('');

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || 'An error occurred.');
      setProcessing(false);
      setIsSubmitting(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (confirmError) {
      setError(confirmError.message || 'Payment failed. Please try again.');
      setProcessing(false);
      setIsSubmitting(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      await handleOrderComplete(paymentIntent.id, 'Credit Card (Stripe)');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <PaymentElement options={{ layout: 'tabs' }} />
      {error && <div style={{ color: '#dc2626', fontSize: 13, marginTop: 12 }}>{error}</div>}
      <button
        type="submit"
        disabled={!stripe || processing}
        style={{
          width: '100%', background: '#1a1a1a', color: '#fff', border: 'none',
          padding: 15, borderRadius: 6, fontSize: 15, fontWeight: 700,
          cursor: !stripe || processing ? 'not-allowed' : 'pointer', marginTop: 20,
        }}
      >
        {processing ? 'Processing...' : `Pay $${totalUSD.toFixed(2)}`}
      </button>
    </form>
  );
}


// ── Order Confirmation ────────────────────────────────────────────────────────
function OrderConfirmation({
  data, onContinue, openPolicy,
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
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 28 }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 4 }}>
          <CheckCircle size={24} color="#1a1a1a" />
        </div>
        <div>
          <div style={{ fontSize: 13, color: '#777', marginBottom: 4 }}>Confirmation #{data.orderNumber}</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, color: '#1a1a1a' }}>Thank you, {data.customerName.split(' ')[0]}!</h1>
        </div>
      </div>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '20px 24px', marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: '#1a1a1a' }}>Your order is confirmed</h2>
        <p style={{ margin: '0 0 16px', fontSize: 14, color: '#666' }}>You'll receive a confirmation email soon</p>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#333', cursor: 'pointer' }}>
          <input type="checkbox" defaultChecked style={{ width: 14, height: 14, cursor: 'pointer' }} />
          Email me with news and offers
        </label>
      </div>

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

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
        <div style={{ fontSize: 14, color: '#666' }}>
          Need help?{' '}
          <button onClick={() => openPolicy('contact')} style={{ background: 'none', border: 'none', color: '#1a1a1a', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>Contact us</button>
        </div>
        <button onClick={onContinue} style={{ background: '#1a1a1a', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: 6, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
          Continue shopping
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 18px', borderTop: '1px solid #e5e7eb', paddingTop: 18 }}>
        {[['Refund policy', 'refund'], ['Shipping', 'shipping'], ['Privacy policy', 'privacy'], ['Terms of service', 'tos'], ['Contact', 'contact']].map(([label, key]) => (
          <button key={key} onClick={() => openPolicy(key)} style={{ background: 'none', border: 'none', padding: 0, fontSize: 12, color: '#888', textDecoration: 'underline', cursor: 'pointer' }}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Shell ─────────────────────────────────────────────────────────────────────
function CheckoutShell({ activePolicyKey, onClosePolicy, children }: { activePolicyKey: string | null; onClosePolicy: () => void; children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus, select:focus { border-color: #1a1a1a !important; outline: none; box-shadow: 0 0 0 3px rgba(0,0,0,0.06); }
        input::placeholder, select::placeholder { color: #aaa; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 3px; }
        @media (max-width: 768px) {
          .checkout-layout { flex-direction: column-reverse !important; }
          .checkout-right { width: 100% !important; height: auto !important; position: relative !important; border-left: none !important; border-top: none !important; border-bottom: 8px solid #f0f0f0 !important; padding: 24px 20px 10px !important; }
          .checkout-left { padding: 30px 20px 40px !important; }
          
          .checkout-header { height: 60px !important; padding: 0 20px !important; }
          .checkout-logo { height: 38px !important; }
          .checkout-return { font-size: 13px !important; }
          .checkout-return svg { width: 14px; height: 14px; }
        }
      `}</style>
      {activePolicyKey && <PolicyModal policyKey={activePolicyKey} onClose={onClosePolicy} />}
      <header className="checkout-header" style={{ borderBottom: '1px solid #e5e7eb', padding: '0 40px', height: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img className="checkout-logo" src="https://i.postimg.cc/fTQtLtrH/procolored-logo-4k-transparent1.png" alt="Procolored" style={{ height: 70, transition: 'height 0.2s' }} />
        </Link>
        <Link to="/" className="checkout-return" style={{ fontSize: 16, color: '#555', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700, transition: 'font-size 0.2s' }}>
          Return to store <ChevronRight size={16} />
        </Link>
      </header>
      {children}
    </div>
  );
}

// ── Right Panel ───────────────────────────────────────────────────────────────
function CheckoutRightPanel({
  displayItems, successData, fmtUSD, discountApplied, discountCode,
  setDiscountCode, discountError, setDiscountError, subtotalUSD, discountAmount,
  totalUSD, handleApplyDiscount, setDiscountApplied,
}: {
  displayItems: any[];
  successData: OrderSuccessData | null;
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
}) {
  const inp = { width: '100%', border: '1px solid #d1d5db', borderRadius: 6, padding: '12px 14px', fontSize: 14, outline: 'none', background: '#fff', boxSizing: 'border-box' as const, color: '#1a1a1a', fontFamily: 'inherit' };

  return (
    <div className="checkout-right" style={{ width: '44%', minWidth: 320, maxWidth: 520, background: '#f5f5f5', borderLeft: '1px solid #e5e7eb', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', padding: '40px 36px', boxSizing: 'border-box', flexShrink: 0 }}>
      {/* Items */}
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

      {/* Discount */}
      {!successData && (
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
          <span style={{ color: '#1a1a1a', fontWeight: 500 }}>{fmtUSD(subtotalUSD)}</span>
        </div>
        {discountApplied && !successData && (
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
          <span style={{ fontWeight: 700, color: '#22c55e' }}>FREE</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #d5d5d5', paddingTop: 14 }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: '#1a1a1a' }}>Total</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 13, color: '#888' }}>USD</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a' }}>
              {fmtUSD(successData ? successData.totalAmount : totalUSD)}
            </span>
          </div>
        </div>
        {discountApplied && !successData && (
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
  const [billFirstName, setBillFirstName] = useState('');
  const [billLastName, setBillLastName] = useState('');
  const [billAddress, setBillAddress] = useState('');
  const [billApartment, setBillApartment] = useState('');
  const [billCity, setBillCity] = useState('');
  const [billState, setBillState] = useState('');
  const [billPostal, setBillPostal] = useState('');
  const [billCountry, setBillCountry] = useState('United States');

  // App state
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountError, setDiscountError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<OrderSuccessData | null>(null);
  const [activePolicyKey, setActivePolicyKey] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'stripe'>('paypal');

  // Stripe state
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripeError, setStripeError] = useState<string | null>(null);

  // PayPal state
  const [paypalClientId, setPaypalClientId] = useState<string | null>(null);
  const [paypalError, setPaypalError] = useState<string | null>(null);
  const [paypalLoading, setPaypalLoading] = useState(true);

  // Refs
  const emailRef = useRef<HTMLInputElement>(null);
  const paymentSectionRef = useRef<HTMLDivElement>(null);
  const orderCompletedRef = useRef(false);
  const abandonmentFiredRef = useRef(false);
  const latestEmailRef = useRef('');
  const latestNameRef = useRef('');
  const latestCityRef = useRef('');
  const latestCountryRef = useRef('');

  // Pricing
  const subtotalUSD = items.reduce((sum, i) => sum + convertPrice(i.price, 278) * i.quantity, 0);
  const discountAmount = discountApplied ? subtotalUSD * 0.05 : 0;
  const totalUSD = subtotalUSD - discountAmount;

  const fmtUSD = (n: number) => `$${n.toFixed(2)}`;

  // Sync latest refs
  useEffect(() => { latestEmailRef.current = email; }, [email]);
  useEffect(() => { latestNameRef.current = [firstName, lastName].filter(Boolean).join(' '); }, [firstName, lastName]);
  useEffect(() => { latestCityRef.current = city; }, [city]);
  useEffect(() => { latestCountryRef.current = country; }, [country]);

  // Load Stripe config
  useEffect(() => {
    fetch(`${API_BASE}/api/stripe/config`)
      .then(res => res.json())
      .then(data => {
        if (data.publishableKey) setStripePromise(loadStripe(data.publishableKey));
      })
      .catch(console.error);
  }, []);

  // Create Stripe Payment Intent when total or method changes
  useEffect(() => {
    if (totalUSD > 0 && paymentMethod === 'stripe' && stripePromise) {
      setClientSecret(null);
      setStripeError(null);
      fetch(`${API_BASE}/api/stripe/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(totalUSD * 100), currency: 'usd' }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.clientSecret) setClientSecret(data.clientSecret);
          else if (data.error) setStripeError(data.error);
        })
        .catch(() => setStripeError('Could not initialize secure payment connection.'));
    }
  }, [totalUSD, paymentMethod, stripePromise]);

  // Load PayPal config
  useEffect(() => {
    fetch(`${API_BASE}/api/paypal/config`)
      .then(r => r.json())
      .then(d => {
        if (d.clientId) setPaypalClientId(d.clientId);
        else setPaypalError('PayPal is not configured yet. Contact support.');
      })
      .catch(() => setPaypalError('Could not load payment options. Check your connection.'))
      .finally(() => setPaypalLoading(false));
  }, []);

  // Abandonment tracking
  const fireAbandonment = useCallback((stepName = 'checkout') => {
    if (orderCompletedRef.current || abandonmentFiredRef.current || items.length === 0) return;
    abandonmentFiredRef.current = true;
    const payload = {
      sessionId: getSessionId(),
      customerEmail: latestEmailRef.current || null,
      customerName: latestNameRef.current || null,
      cartItems: items.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price })),
      cartTotal: subtotalUSD.toFixed(2),
      stepAbandoned: stepName,
      country: latestCountryRef.current,
      city: latestCityRef.current,
      deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
    };
    const jsonStr = JSON.stringify(payload);
    const url = `${API_BASE}/api/checkout/abandon`;
    fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: jsonStr, keepalive: true })
      .catch(() => { try { navigator.sendBeacon(url + '?_beacon=1', jsonStr); } catch (_) { } });
  }, [items, subtotalUSD]);

  useEffect(() => {
    if (items.length === 0) return;
    let t = setTimeout(() => fireAbandonment('idle_10min'), 600000);
    const reset = () => { clearTimeout(t); t = setTimeout(() => fireAbandonment('idle_10min'), 600000); };
    window.addEventListener('mousemove', reset);
    window.addEventListener('keydown', reset);
    const onUnload = () => fireAbandonment('left_page');
    window.addEventListener('beforeunload', onUnload);
    return () => {
      clearTimeout(t);
      window.removeEventListener('mousemove', reset);
      window.removeEventListener('keydown', reset);
      window.removeEventListener('beforeunload', onUnload);
      if (!orderCompletedRef.current) fireAbandonment('navigated_away');
    };
  }, [fireAbandonment]);

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    setDiscountError('');
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
    if (err) {
      setEmailError(err);
      emailRef.current?.focus();
      emailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    if (!firstName || !lastName) { setFormError('Kindly fill in your first and last name to continue.'); paymentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return false; }
    if (!address) { setFormError('Kindly fill in your street address to continue.'); paymentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return false; }
    if (!city) { setFormError('Kindly fill in your city to continue.'); paymentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return false; }
    if (!postal) { setFormError('Kindly fill in your postal / ZIP code to continue.'); paymentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return false; }
    if (!country) { setFormError('Kindly select your country to continue.'); paymentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return false; }
    setFormError(null);
    return true;
  };

  const buildShipping = () => ({ street: address, apartment, city, state: stateVal, postalCode: postal, country });
  const buildBilling = () => billingSame
    ? buildShipping()
    : { street: billAddress, apartment: billApartment, city: billCity, state: billState, postalCode: billPostal, country: billCountry };

  const buildPayload = (txId: string | null, method = 'PayPal') => ({
    customerName: `${firstName} ${lastName}`.trim() || 'Customer',
    customerEmail: email,
    customerPhone: phone || null,
    shippingAddress: buildShipping(),
    billingAddress: buildBilling(),
    billingName: billingSame ? `${firstName} ${lastName}`.trim() : `${billFirstName} ${billLastName}`.trim(),
    items: items.map(i => ({ id: i.id, name: i.name, price: convertPrice(i.price, 278), quantity: i.quantity, image: i.image })),
    subtotal: subtotalUSD,
    shippingCost: 0,
    discountAmount,
    discountCode: discountApplied ? 'PROCOLORED5' : null,
    totalAmount: totalUSD,
    currency: 'USD',
    country,
    city,
    paymentMethod: method,
    paymentStatus: 'paid',
    transactionId: txId,
  });

  const handleOrderComplete = async (txId: string, method = 'PayPal') => {
    setIsSubmitting(true);
    orderCompletedRef.current = true;
    try {
      const res = await fetch(`${API_BASE}/api/checkout/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload(txId, method)),
      });
      const data = await res.json();
      if (res.ok && data.orderNumber) {
        clearCart();
        setSuccessData({
          orderNumber: data.orderNumber,
          customerName: `${firstName} ${lastName}`.trim(),
          customerEmail: email,
          totalAmount: totalUSD,
          paymentMethod: method,
          cartItems: items.map(i => ({ name: i.name, priceUSD: convertPrice(i.price, 278), quantity: i.quantity, image: i.image })),
          shippingAddress: buildShipping(),
        });
      } else {
        alert(data.error || 'Order could not be saved.');
        orderCompletedRef.current = false;
      }
    } catch {
      alert('Network error. Contact support.');
      orderCompletedRef.current = false;
    } finally {
      setIsSubmitting(false);
    }
  };



  const allCountries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany',
    'France', 'Italy', 'Spain', 'Netherlands', 'Sweden', 'Norway', 'Denmark',
    'Japan', 'South Korea', 'Singapore', 'India', 'Pakistan', 'UAE',
    'Saudi Arabia', 'Brazil', 'Mexico', 'South Africa', 'New Zealand',
  ];

  const inp = { width: '100%', border: '1px solid #d1d5db', borderRadius: 6, padding: '12px 14px', fontSize: 14, outline: 'none', background: '#fff', boxSizing: 'border-box' as const, color: '#1a1a1a', fontFamily: 'inherit' };
  const openPolicy = (k: string) => setActivePolicyKey(k);

  const displayItems = successData
    ? successData.cartItems
    : items.map(i => ({ name: i.name, priceUSD: convertPrice(i.price, 278), quantity: i.quantity, image: i.image }));

  // ── Empty cart ──────────────────────────────────────────────────────────────
  if (items.length === 0 && !successData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fff', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' }}>
        <header style={{ borderBottom: '1px solid #e5e7eb', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/"><img src="https://i.postimg.cc/fTQtLtrH/procolored-logo-4k-transparent1.png" alt="Procolored" style={{ height: 70 }} /></Link>
          <Link to="/" style={{ fontSize: 16, color: '#555', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>Return to store <ChevronRight size={16} /></Link>
        </header>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Your cart is empty</h2>
          <p style={{ color: '#888', marginBottom: 24 }}>Add items to continue.</p>
          <Link to="/collections/all" style={{ background: '#1a1a1a', color: '#fff', padding: '12px 28px', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>Shop now</Link>
        </div>
      </div>
    );
  }

  // ── Order Confirmation ──────────────────────────────────────────────────────
  if (successData) {
    return (
      <CheckoutShell activePolicyKey={activePolicyKey} onClosePolicy={() => setActivePolicyKey(null)}>
        <div className="checkout-layout" style={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}>
          <div className="checkout-left" style={{ flex: 1, overflowY: 'auto', padding: '52px 56px' }}>
            <OrderConfirmation
              data={successData}
              cartItems={successData.cartItems}
              onContinue={() => { setSuccessData(null); navigate('/'); }}
              openPolicy={openPolicy}
            />
          </div>
          <CheckoutRightPanel
            displayItems={displayItems} successData={successData}
            fmtUSD={fmtUSD} discountApplied={discountApplied} discountCode={discountCode}
            setDiscountCode={setDiscountCode} discountError={discountError} setDiscountError={setDiscountError}
            subtotalUSD={subtotalUSD} discountAmount={discountAmount} totalUSD={totalUSD}
            handleApplyDiscount={handleApplyDiscount} setDiscountApplied={setDiscountApplied}
          />
        </div>
      </CheckoutShell>
    );
  }

  // ── Checkout Form ───────────────────────────────────────────────────────────
  return (
    <CheckoutShell activePolicyKey={activePolicyKey} onClosePolicy={() => setActivePolicyKey(null)}>
      <div className="checkout-layout" style={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}>

        {/* LEFT */}
        <div className="checkout-left" style={{ flex: 1, overflowY: 'auto', padding: '40px 56px 60px' }}>

          {/* Contact */}
          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1a1a1a', margin: '0 0 16px' }}>Contact</h2>
            <input ref={emailRef} type="email" placeholder="Email or mobile phone number" value={email}
              onChange={e => { setEmail(e.target.value); if (emailError) setEmailError(validateEmail(e.target.value)); }}
              onBlur={e => setEmailError(validateEmail(e.target.value))}
              style={{ ...inp, borderColor: emailError ? '#dc2626' : '#d1d5db', marginBottom: 4 }} />
            {emailError && (
              <div style={{ fontSize: 12, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                <AlertCircle size={12} />{emailError}
              </div>
            )}
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
                <input type="text" placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} style={inp} />
                <input type="text" placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} style={inp} />
              </div>
              <input type="text" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} style={inp} />
              <input type="text" placeholder="Apartment, suite, etc. (optional)" value={apartment} onChange={e => setApartment(e.target.value)} style={inp} />
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 10 }}>
                <input type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)} style={inp} />
                <input type="text" placeholder="State" value={stateVal} onChange={e => setStateVal(e.target.value)} style={inp} />
                <input type="text" placeholder="ZIP code" value={postal} onChange={e => setPostal(e.target.value)} style={inp} />
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
          <section ref={paymentSectionRef} style={{ marginBottom: 36 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Payment</h2>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#666', marginLeft: 'auto' }}>
                <ShieldCheck size={13} color="#22c55e" /> All transactions are secure and encrypted.
              </span>
            </div>

            <div style={{ border: '1px solid #d1d5db', borderRadius: 8, overflow: 'hidden' }}>

                {/* ── Stripe / Credit Card option ── */}
                <div
                  onClick={() => setPaymentMethod('stripe')}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', cursor: 'pointer', background: paymentMethod === 'stripe' ? '#f9fafb' : '#fff', borderBottom: '1px solid #e5e7eb' }}
                >
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: paymentMethod === 'stripe' ? '6px solid #1a1a1a' : '2px solid #d1d5db', flexShrink: 0, transition: 'border 0.15s' }} />
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>Credit / Debit Card</span>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                    {['VISA', 'MC', 'AMEX'].map(card => (
                      <span key={card} style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 3, padding: '2px 6px', fontSize: 10, fontWeight: 700, color: '#555' }}>{card}</span>
                    ))}
                  </div>
                </div>

                {paymentMethod === 'stripe' && (
                  <div style={{ padding: 20, background: '#fafafa', borderBottom: '1px solid #e5e7eb' }}>
                    {stripeError ? (
                      <div style={{ padding: 14, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: 13 }}>
                        <strong>Payment Error:</strong> {stripeError}
                      </div>
                    ) : !stripePromise || !clientSecret ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 20, color: '#888', fontSize: 13 }}>
                        <span style={{ width: 20, height: 20, border: '2px solid #e5e7eb', borderTopColor: '#635bff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                        Loading secure payment form...
                      </div>
                    ) : (
                      <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                        <div style={{ marginBottom: 14 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#555', marginBottom: 14 }}>
                            <ShieldCheck size={13} color="#635bff" /> Secured by Stripe — bank-level encryption
                          </div>
                          {formError && (
                            <div style={{ marginBottom: 14, padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, fontSize: 13, color: '#dc2626', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                              <span style={{ fontSize: 16, lineHeight: 1 }}>⚠️</span>
                              <span><strong>Please fill in all required details:</strong><br />{formError}</span>
                            </div>
                          )}
                        </div>
                        <StripePaymentForm
                          totalUSD={totalUSD}
                          validateForm={validateForm}
                          handleOrderComplete={handleOrderComplete}
                          setIsSubmitting={setIsSubmitting}
                        />
                      </Elements>
                    )}
                  </div>
                )}


                {/* ── PayPal option ── */}
                <div
                  onClick={() => setPaymentMethod('paypal')}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', cursor: 'pointer', background: paymentMethod === 'paypal' ? '#f9fafb' : '#fff', borderBottom: paymentMethod === 'paypal' ? '1px solid #e5e7eb' : 'none' }}
                >
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: paymentMethod === 'paypal' ? '6px solid #1a1a1a' : '2px solid #d1d5db', flexShrink: 0, transition: 'border 0.15s' }} />
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>PayPal</span>
                  <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg" alt="PayPal" style={{ height: 20, marginLeft: 'auto', objectFit: 'contain' }} />
                </div>

                {paymentMethod === 'paypal' && (
                <div style={{ padding: 16, background: '#fafafa' }}>
                  {paypalLoading ? (
                    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 24, height: 24, border: '2px solid #e5e7eb', borderTopColor: '#003087', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                      <span style={{ fontSize: 13, color: '#888' }}>Loading PayPal...</span>
                    </div>
                  ) : paypalError ? (
                    <div style={{ padding: 14, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: 13 }}>
                      <strong>PayPal Unavailable:</strong> {paypalError}
                      <br />
                      <button
                        onClick={() => { setPaypalError(null); setPaypalLoading(true); fetch(`${API_BASE}/api/paypal/config`).then(r => r.json()).then(d => { if (d.clientId) setPaypalClientId(d.clientId); else setPaypalError('PayPal is not configured. Contact support.'); }).catch(() => setPaypalError('Could not connect to payment server.')).finally(() => setPaypalLoading(false)); }}
                        style={{ marginTop: 8, background: 'none', border: '1px solid #dc2626', color: '#dc2626', borderRadius: 4, padding: '4px 12px', fontSize: 12, cursor: 'pointer' }}
                      >
                        Retry
                      </button>
                    </div>
                  ) : paypalClientId ? (
                    <PayPalScriptProvider options={{ clientId: paypalClientId, currency: 'USD', intent: 'capture' }}>
                      <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, background: '#fff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#555', marginBottom: 14 }}>
                          <ShieldCheck size={13} color="#009cde" /> Secured by PayPal — pay safely with any card or PayPal balance
                        </div>
                        {formError && (
                          <div style={{ marginBottom: 14, padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, fontSize: 13, color: '#dc2626', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                            <span style={{ fontSize: 16, lineHeight: 1 }}>⚠️</span>
                            <span><strong>Please fill in all required details:</strong><br />{formError}</span>
                          </div>
                        )}
                        <PayPalButtons
                          style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal', height: 48 }}
                          disabled={isSubmitting}
                          createOrder={async () => {
                            if (!validateForm()) throw new Error('form_invalid');
                            const res = await fetch(`${API_BASE}/api/paypal/create-order`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ cartTotal: totalUSD.toFixed(2), currency: 'USD' }),
                            });
                            const data = await res.json();
                            if (!data.id) throw new Error(data.error || 'Could not create PayPal order.');
                            return data.id;
                          }}
                          onApprove={async (data) => {
                            setIsSubmitting(true);
                            try {
                              const res = await fetch(`${API_BASE}/api/paypal/capture-order`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ orderID: data.orderID }),
                              });
                              const capture = await res.json();
                              if (capture.success) {
                                await handleOrderComplete(data.orderID, 'PayPal');
                              } else {
                                alert(capture.error || 'Payment capture failed. Contact support.');
                                setIsSubmitting(false);
                              }
                            } catch {
                              alert('Network error during payment capture. Contact support.');
                              setIsSubmitting(false);
                            }
                          }}
                          onError={(err: any) => {
                            console.error('PayPal error:', err);
                            if (err?.message === 'form_invalid') return;
                            // Don't set permanent error — just log it; user can retry clicking PayPal button
                          }}
                          onCancel={() => setIsSubmitting(false)}
                        />
                      </div>
                    </PayPalScriptProvider>
                  ) : null}
                </div>
                )}

            </div>

          </section>

          <div style={{ borderTop: '1px solid #e5e7eb', marginBottom: 36 }} />

          {/* Billing address */}
          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1a1a1a', margin: '0 0 16px' }}>Billing address</h2>
            <div style={{ border: '1px solid #d1d5db', borderRadius: 8, overflow: 'hidden' }}>
              <div onClick={() => setBillingSame(true)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', cursor: 'pointer', background: billingSame ? '#f9fafb' : '#fff', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: billingSame ? '6px solid #1a1a1a' : '2px solid #d1d5db', flexShrink: 0, transition: 'border 0.15s' }} />
                <span style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>Same as shipping address</span>
              </div>
              <div onClick={() => setBillingSame(false)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', cursor: 'pointer', background: !billingSame ? '#f9fafb' : '#fff' }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: !billingSame ? '6px solid #1a1a1a' : '2px solid #d1d5db', flexShrink: 0, transition: 'border 0.15s' }} />
                <span style={{ fontSize: 14, color: '#1a1a1a' }}>Use a different billing address</span>
              </div>
            </div>

            {!billingSame && (
              <div style={{ border: '1px solid #d1d5db', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 10, background: '#fafafa' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#777', marginBottom: 4 }}>Country/Region</label>
                  <select value={billCountry} onChange={e => setBillCountry(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
                    {allCountries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <input type="text" placeholder="First name" value={billFirstName} onChange={e => setBillFirstName(e.target.value)} style={inp} />
                  <input type="text" placeholder="Last name" value={billLastName} onChange={e => setBillLastName(e.target.value)} style={inp} />
                </div>
                <input type="text" placeholder="Address" value={billAddress} onChange={e => setBillAddress(e.target.value)} style={inp} />
                <input type="text" placeholder="Apartment, suite, etc. (optional)" value={billApartment} onChange={e => setBillApartment(e.target.value)} style={inp} />
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 10 }}>
                  <input type="text" placeholder="City" value={billCity} onChange={e => setBillCity(e.target.value)} style={inp} />
                  <input type="text" placeholder="State" value={billState} onChange={e => setBillState(e.target.value)} style={inp} />
                  <input type="text" placeholder="ZIP code" value={billPostal} onChange={e => setBillPostal(e.target.value)} style={inp} />
                </div>
              </div>
            )}
          </section>

          {/* Policy links */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 18px', paddingTop: 8 }}>
            {[['Refund policy', 'refund'], ['Shipping', 'shipping'], ['Privacy policy', 'privacy'], ['Terms of service', 'tos'], ['Contact', 'contact']].map(([label, key]) => (
              <button key={key} onClick={() => openPolicy(key)} style={{ background: 'none', border: 'none', padding: 0, fontSize: 12, color: '#888', textDecoration: 'underline', cursor: 'pointer' }}>
                {label}
              </button>
            ))}
          </div>

        </div>

        {/* RIGHT */}
        <CheckoutRightPanel
          displayItems={displayItems} successData={successData}
          fmtUSD={fmtUSD} discountApplied={discountApplied} discountCode={discountCode}
          setDiscountCode={setDiscountCode} discountError={discountError} setDiscountError={setDiscountError}
          subtotalUSD={subtotalUSD} discountAmount={discountAmount} totalUSD={totalUSD}
          handleApplyDiscount={handleApplyDiscount} setDiscountApplied={setDiscountApplied}
        />

      </div>
    </CheckoutShell>
  );
}