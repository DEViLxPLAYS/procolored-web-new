import { useState, useEffect, useRef, useCallback } from 'react';
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
  items: any[];
  shippingAddress: { street: string; apartment?: string; city: string; state?: string; postalCode: string; country: string };
  billingAddress: { street: string; apartment?: string; city: string; state?: string; postalCode: string; country: string };
  isDemoOrder?: boolean;
}

// ── Stripe Payment Form ──────────────────────────────────────────────────────
function StripePaymentForm({ isSubmitting, setIsSubmitting, onSuccess, validateForm }: {
  isSubmitting: boolean; setIsSubmitting: (v: boolean) => void;
  onSuccess: (txId: string) => void; validateForm: () => boolean;
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
        elements, redirect: 'if_required', confirmParams: { return_url: window.location.href },
      });
      if (error) throw new Error(error.message || 'Payment failed. Please check your card details.');
      if (paymentIntent?.status === 'succeeded') onSuccess(paymentIntent.id);
      else throw new Error('Payment was not completed. Please try again.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment failed. Please try again.');
    } finally { setIsSubmitting(false); }
  };

  return (
    <form onSubmit={handlePay}>
      <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #d1d5db', overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #f3f4f6', background: '#fafafa' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#555' }}>
            <Lock size={12} color="#5469d4" /> Stripe Secure Payment
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" style={{ height: 10, opacity: 0.5 }} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MC" style={{ height: 14, opacity: 0.5 }} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="Amex" style={{ height: 14, opacity: 0.5 }} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/1/16/Former_Unionpay_logo.svg" alt="UnionPay" style={{ height: 14, opacity: 0.5 }} />
          </div>
        </div>
        <div style={{ padding: '16px' }}>
          <PaymentElement options={{ layout: 'tabs', wallets: { applePay: 'never', googlePay: 'never' } }} />
        </div>
      </div>
      {errorMsg && (
        <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, color: '#dc2626', fontSize: 13, marginBottom: 14, display: 'flex', gap: 8 }}>
          <X size={14} style={{ flexShrink: 0, marginTop: 1 }} /> {errorMsg}
        </div>
      )}
      <button type="submit" disabled={isSubmitting || !stripe}
        style={{ width: '100%', background: '#1a1a1a', color: '#fff', border: 'none', padding: '15px', borderRadius: 6, fontSize: 15, fontWeight: 700, cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        {isSubmitting ? <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} /> Processing...</> : <><CreditCard size={16} /> Pay now</>}
      </button>
    </form>
  );
}

function DemoOrderButton({ isSubmitting, onSubmit }: { isSubmitting: boolean; onSubmit: () => void }) {
  return (
    <div>
      <div style={{ padding: '14px 16px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, marginBottom: 14, fontSize: 13, color: '#92400e', fontWeight: 500 }}>
        🧪 <strong>Demo Order</strong> — No payment required. This is a $1 test order.
      </div>
      <button onClick={onSubmit} disabled={isSubmitting}
        style={{ width: '100%', background: '#1a1a1a', color: '#fff', border: 'none', padding: 15, borderRadius: 6, fontSize: 15, fontWeight: 700, cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        {isSubmitting ? <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} /> Processing...</> : <><CheckCircle size={16} /> Place order</>}
      </button>
    </div>
  );
}

// ── Order Confirmation Screen (inline, Shopify-style) ────────────────────────
function OrderConfirmation({ data, onContinue }: { data: OrderSuccessData; onContinue: () => void }) {
  const fmtAddr = (a: any) => [a?.street, a?.apartment, [a?.city, a?.state, a?.postalCode].filter(Boolean).join(' '), a?.country].filter(Boolean).join(', ');
  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '0 24px 60px', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' }}>
      {/* Confirmation header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <CheckCircle size={26} color="#1a1a1a" />
        </div>
        <div>
          <div style={{ fontSize: 13, color: '#555', marginBottom: 2 }}>Confirmation #{data.orderNumber}</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, color: '#1a1a1a' }}>Thank you, {data.customerName.split(' ')[0]}!</h1>
        </div>
      </div>

      {/* Order confirmed box */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '20px 24px', marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: '#1a1a1a' }}>Your order is confirmed</h2>
        <p style={{ margin: '0 0 16px', fontSize: 14, color: '#555' }}>You'll receive a confirmation email soon</p>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#333', cursor: 'pointer' }}>
          <input type="checkbox" defaultChecked style={{ width: 14, height: 14 }} />
          Email me with news and offers
        </label>
      </div>

      {/* Order details */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '20px 24px', marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 20px', color: '#1a1a1a' }}>Order details</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>Contact information</div>
            <div style={{ fontSize: 14, color: '#555' }}>{data.customerEmail}</div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>Payment method</div>
            <div style={{ fontSize: 14, color: '#555', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#f3f4f6', borderRadius: 4, padding: '2px 8px', fontSize: 13 }}>
                💳 {data.paymentMethod}
              </span>
            </div>
            {data.totalAmount > 0 && (
              <div style={{ fontSize: 13, color: '#555', marginTop: 6 }}>${data.totalAmount.toFixed(2)} USD</div>
            )}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>Shipping address</div>
            <div style={{ fontSize: 14, color: '#555', lineHeight: 1.6 }}>
              {data.customerName}<br />
              {data.shippingAddress?.street}{data.shippingAddress?.apartment ? ', ' + data.shippingAddress.apartment : ''}<br />
              {[data.shippingAddress?.city, data.shippingAddress?.state, data.shippingAddress?.postalCode].filter(Boolean).join(' ')}<br />
              {data.shippingAddress?.country}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>Billing address</div>
            <div style={{ fontSize: 14, color: '#555', lineHeight: 1.6 }}>
              {data.customerName}<br />
              {data.billingAddress?.street}{data.billingAddress?.apartment ? ', ' + data.billingAddress.apartment : ''}<br />
              {[data.billingAddress?.city, data.billingAddress?.state, data.billingAddress?.postalCode].filter(Boolean).join(' ')}<br />
              {data.billingAddress?.country}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>Shipping method</div>
            <div style={{ fontSize: 14, color: '#555' }}>Standard Shipping (14–17 business days)</div>
          </div>
        </div>
      </div>

      {/* Need help + continue  */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24 }}>
        <div style={{ fontSize: 14, color: '#555' }}>
          Need help?{' '}
          <a href="mailto:support@procollored.com" style={{ color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>Contact us</a>
        </div>
        <button onClick={onContinue}
          style={{ background: '#1a1a1a', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: 6, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
          Continue shopping
        </button>
      </div>

      {/* Policy links */}
      <div style={{ display: 'flex', gap: 20, marginTop: 32, flexWrap: 'wrap' }}>
        {['Refund policy', 'Shipping', 'Privacy policy', 'Terms of service', 'Contact'].map(link => (
          <a key={link} href="#" style={{ fontSize: 12, color: '#888', textDecoration: 'underline' }}>{link}</a>
        ))}
      </div>
    </div>
  );
}

// ── Main Checkout ─────────────────────────────────────────────────────────────
export default function Checkout() {
  const { items, cartSubtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { currency, formatConverted } = useCurrency();

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
  const [country, setCountry] = useState('Pakistan');
  const [phone, setPhone] = useState('');

  // App state
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountError, setDiscountError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<OrderSuccessData | null>(null);

  // Stripe
  const [stripePublishableKey, setStripePublishableKey] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isFreeOrder, setIsFreeOrder] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);

  // Pricing
  const discountAmount = discountApplied ? cartSubtotal * 0.05 : 0;
  const total = cartSubtotal - discountAmount;
  const isDemoCart = items.some(i => i.id === DEMO_PRODUCT_ID) && total <= 1;

  // Abandonment refs
  const orderCompletedRef = useRef(false);
  const abandonmentFiredRef = useRef(false);
  const latestEmailRef = useRef('');
  const latestNameRef = useRef('');
  const latestCityRef = useRef('');
  const latestCountryRef = useRef('Pakistan');
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
    if (isDemoCart || total === 0) { setIsFreeOrder(true); setClientSecret(null); return; }
    if (total > 0 && stripePublishableKey && !clientSecret) {
      fetch(`${API_BASE}/api/stripe/create-payment-intent`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(total * 100), currency: 'usd' }),
      }).then(r => r.json()).then(d => {
        if (d.isFreeOrder) setIsFreeOrder(true);
        else if (d.clientSecret) { setClientSecret(d.clientSecret); setIsFreeOrder(false); }
        else setStripeError(d.error || 'Could not initialize payment.');
      }).catch(() => setStripeError('Network error. Could not initialize Stripe.'));
    }
  }, [total, stripePublishableKey, clientSecret, isDemoCart]);

  useEffect(() => {
    if (total > 0 && stripePublishableKey && !isDemoCart) setClientSecret(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discountApplied]);

  useEffect(() => {
    fetch('https://ipapi.co/json/').then(r => r.json())
      .then(d => { if (d?.country_name) setCountry(d.country_name); }).catch(() => {});
  }, []);

  const fireAbandonment = useCallback((stepName = 'checkout', force = false) => {
    if (orderCompletedRef.current) return;
    if (!force && abandonmentFiredRef.current) return;
    if (items.length === 0) return;
    abandonmentFiredRef.current = true;
    const payload = { sessionId: getSessionId(), customerEmail: latestEmailRef.current || null, customerName: latestNameRef.current || null, cartItems: items.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price })), cartTotal: cartSubtotal.toFixed(2), stepAbandoned: stepName, country: latestCountryRef.current, city: latestCityRef.current, deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop' };
    const jsonStr = JSON.stringify(payload);
    const url = `${API_BASE}/api/checkout/abandon`;
    fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: jsonStr, keepalive: true }).catch(() => { try { navigator.sendBeacon(url + '?_beacon=1', jsonStr); } catch (_) {} });
  }, [items, cartSubtotal]);

  useEffect(() => {
    if (items.length === 0) return;
    let idleTimer = setTimeout(() => fireAbandonment('idle_10min'), 600000);
    const resetIdle = () => { clearTimeout(idleTimer); idleTimer = setTimeout(() => fireAbandonment('idle_10min'), 600000); };
    window.addEventListener('mousemove', resetIdle); window.addEventListener('keydown', resetIdle);
    const onUnload = () => fireAbandonment('left_page');
    window.addEventListener('beforeunload', onUnload);
    return () => { clearTimeout(idleTimer); window.removeEventListener('mousemove', resetIdle); window.removeEventListener('keydown', resetIdle); window.removeEventListener('beforeunload', onUnload); if (!orderCompletedRef.current) fireAbandonment('navigated_away'); };
  }, [fireAbandonment]);

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault(); setDiscountError('');
    if (discountCode.trim().toUpperCase() === 'PROCOLORED5') { setDiscountApplied(true); }
    else { setDiscountError('Invalid discount code.'); }
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
    items: items.map(i => ({ id: i.id, name: i.name, price: convertPrice(i.price, currency.divisor), quantity: i.quantity, image: i.image })),
    subtotal: cartSubtotal, shippingCost: 0, discountAmount, discountCode: discountApplied ? 'PROCOLORED5' : null,
    totalAmount: isDemo ? 0 : total, currency: 'USD', country, city,
    paymentMethod: isDemo ? 'Demo (No Payment)' : 'Stripe', paymentStatus: 'paid', transactionId: txId,
  });

  const handleOrderComplete = async (txId: string) => {
    setIsSubmitting(true); orderCompletedRef.current = true;
    try {
      const res = await fetch(`${API_BASE}/api/checkout/order`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(buildPayload(txId, false)) });
      const data = await res.json();
      if (res.ok && data.orderNumber) {
        clearCart();
        setSuccessData({ orderNumber: data.orderNumber, customerName: `${firstName} ${lastName}`.trim(), customerEmail: email, totalAmount: total, paymentMethod: 'Stripe', items: items.map(i => ({ name: i.name, price: convertPrice(i.price, currency.divisor), quantity: i.quantity })), shippingAddress: buildShipping(), billingAddress: buildShipping(), isDemoOrder: false });
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
        setSuccessData({ orderNumber: data.orderNumber, customerName: `${firstName} ${lastName}`.trim(), customerEmail: email, totalAmount: 0, paymentMethod: 'Demo / Free', items: items.map(i => ({ name: i.name, price: 0, quantity: i.quantity })), shippingAddress: buildShipping(), billingAddress: buildShipping(), isDemoOrder: true });
      } else { alert(data.error || 'Failed to create demo order.'); orderCompletedRef.current = false; }
    } catch { alert('Network error.'); orderCompletedRef.current = false; }
    finally { setIsSubmitting(false); }
  };

  const allCountries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Belgium","Bolivia","Brazil","Bulgaria","Cambodia","Canada","Chile","China","Colombia","Croatia","Cuba","Cyprus","Czechia","Denmark","Ecuador","Egypt","Estonia","Ethiopia","Fiji","Finland","France","Germany","Ghana","Greece","Guatemala","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyzstan","Latvia","Lebanon","Libya","Lithuania","Luxembourg","Malaysia","Maldives","Malta","Mexico","Moldova","Monaco","Mongolia","Morocco","Myanmar","Nepal","Netherlands","New Zealand","Nicaragua","Nigeria","North Korea","Norway","Oman","Pakistan","Panama","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saudi Arabia","Senegal","Serbia","Singapore","Slovakia","Slovenia","Somalia","South Africa","South Korea","Spain","Sri Lanka","Sudan","Sweden","Switzerland","Syria","Tajikistan","Tanzania","Thailand","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"];

  // ── Shared input style (Shopify-like) ────────────────────────────────────
  const inp = {
    width: '100%', border: '1px solid #d1d5db', borderRadius: 6, padding: '11px 14px',
    fontSize: 14, outline: 'none', background: '#fff', boxSizing: 'border-box' as const,
    transition: 'border-color 0.15s',
  };

  const fmtAmt = (n: number) => `$${n.toFixed(2)}`;

  // ── Empty cart ────────────────────────────────────────────────────────────
  if (items.length === 0 && !successData) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Your cart is empty</h2>
        <p style={{ color: '#888', marginBottom: 24 }}>Add items to continue.</p>
        <Link to="/collections/all" style={{ background: '#1a1a1a', color: '#fff', padding: '12px 28px', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>Shop now</Link>
      </div>
    );
  }

  // ── Right panel — order summary (used both in form view & confirmation view)
  const RightPanel = () => (
    <div style={{ width: '100%', maxWidth: 480, padding: '40px 32px 40px 40px', background: '#fafafa', borderLeft: '1px solid #e5e7eb', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', boxSizing: 'border-box' }}>
      {/* Items */}
      <div style={{ marginBottom: 20 }}>
        {(successData ? successData.items : items).map((item: any, idx: number) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{ width: 64, height: 64, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 6 }}>
                {item.image && <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
              </div>
              <span style={{ position: 'absolute', top: -8, right: -8, width: 20, height: 20, background: '#333', color: '#fff', borderRadius: '50%', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.quantity || 1}
              </span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', lineHeight: 1.4, marginBottom: 2 }}>{item.name}</div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a', whiteSpace: 'nowrap' }}>
              {item.price ? fmtAmt(typeof item.price === 'number' ? item.price * (item.quantity || 1) : parseFloat(item.price) * (item.quantity || 1)) : 'FREE'}
            </div>
          </div>
        ))}
      </div>

      {/* Discount input — only show during form stage, not confirmation */}
      {!successData && !isDemoCart && (
        <div style={{ marginBottom: 20 }}>
          <form onSubmit={handleApplyDiscount} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Tag size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
              <input type="text" value={discountCode} onChange={e => { setDiscountCode(e.target.value); setDiscountError(''); }} placeholder="Discount code or gift card"
                style={{ ...inp, paddingLeft: 34 }} disabled={discountApplied} />
            </div>
            <button type="submit" disabled={!discountCode.trim() || discountApplied}
              style={{ padding: '11px 18px', border: '1px solid #d1d5db', borderRadius: 6, background: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', color: discountCode.trim() && !discountApplied ? '#1a1a1a' : '#999' }}>
              Apply
            </button>
          </form>
          {discountError && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{discountError}</div>}
          {discountApplied && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, fontSize: 13, color: '#166534' }}>
              <span>🏷️</span>
              <span style={{ fontWeight: 600 }}>PROCOLORED5</span>
              <span>— 5% off applied</span>
              <button onClick={() => { setDiscountApplied(false); setDiscountCode(''); }} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#166534', fontSize: 16, lineHeight: 1 }}>×</button>
            </div>
          )}
        </div>
      )}

      {/* Divider */}
      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16, marginBottom: 12 }}>
        {/* Subtotal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#555', marginBottom: 10 }}>
          <span>Subtotal</span>
          <span style={{ color: '#1a1a1a', fontWeight: 500 }}>{isDemoCart ? 'FREE' : fmtAmt(successData ? successData.totalAmount : cartSubtotal)}</span>
        </div>
        {/* Discount line */}
        {discountApplied && !isDemoCart && !successData && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#555', marginBottom: 10 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              Order discount <span style={{ fontSize: 12, color: '#166534', fontWeight: 600 }}>(PROCOLORED5)</span>
            </span>
            <span style={{ color: '#166534', fontWeight: 600 }}>−{fmtAmt(discountAmount)}</span>
          </div>
        )}
        {/* Shipping */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#555', marginBottom: 10 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            Shipping
            <span style={{ width: 14, height: 14, border: '1px solid #ccc', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#888', cursor: 'pointer', flexShrink: 0 }}>?</span>
          </span>
          <span style={{ fontWeight: 600, color: '#1a1a1a' }}>FREE</span>
        </div>
        {/* Estimated taxes */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#555', marginBottom: 16 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            Estimated taxes
            <span style={{ width: 14, height: 14, border: '1px solid #ccc', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#888', cursor: 'pointer', flexShrink: 0 }}>?</span>
          </span>
          <span style={{ fontWeight: 500, color: '#1a1a1a' }}>$0.00</span>
        </div>

        {/* Total */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e5e7eb', paddingTop: 14 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#1a1a1a' }}>Total</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 13, color: '#888' }}>USD</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a' }}>
              {isDemoCart ? '$0.00' : fmtAmt(successData ? successData.totalAmount : total)}
            </span>
          </div>
        </div>

        {/* Savings callout */}
        {discountApplied && !isDemoCart && !successData && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, fontSize: 13, color: '#166534' }}>
            🏷️ <strong>TOTAL SAVINGS {fmtAmt(discountAmount)}</strong>
          </div>
        )}
      </div>
    </div>
  );

  // ── SUCCESS VIEW ─────────────────────────────────────────────────────────
  if (successData) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        {/* Shopify-style minimal header */}
        <header style={{ borderBottom: '1px solid #e5e7eb', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <img src="https://i.postimg.cc/fTQtLtrH/procolored-logo-4k-transparent1.png" alt="Procolored" style={{ height: 32 }} />
          </Link>
          <Link to="/" style={{ fontSize: 13, color: '#555', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            Return to store <ChevronRight size={14} />
          </Link>
        </header>

        <div style={{ display: 'flex', minHeight: 'calc(100vh - 65px)' }}>
          {/* LEFT — confirmation content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '48px 48px 48px 64px' }}>
            <OrderConfirmation data={successData} onContinue={() => { setSuccessData(null); navigate('/'); }} />
          </div>
          {/* RIGHT — static order summary */}
          <RightPanel />
        </div>
      </div>
    );
  }

  // ── CHECKOUT FORM VIEW ───────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' }}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        input:focus,select:focus{border-color:#1a1a1a!important;outline:none;}
        input::placeholder{color:#aaa;}
      `}</style>

      {/* Shopify-style minimal header — NO navbar */}
      <header style={{ borderBottom: '1px solid #e5e7eb', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <img src="https://i.postimg.cc/fTQtLtrH/procolored-logo-4k-transparent1.png" alt="Procolored" style={{ height: 32 }} />
        </Link>
        <Link to="/" style={{ fontSize: 13, color: '#555', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          Return to store <ChevronRight size={14} />
        </Link>
      </header>

      {/* Main — left scrolls, right is sticky */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 65px)' }}>

        {/* LEFT — scrollable form */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '40px 48px 60px 64px', maxWidth: 620, boxSizing: 'border-box' }}>

          {/* ── Contact ── */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1a1a1a', marginBottom: 16, marginTop: 0 }}>Contact</h2>
            <div>
              <input ref={emailRef} id="checkout-email" type="email" placeholder="Email" value={email}
                onChange={e => { setEmail(e.target.value); if (emailError) setEmailError(validateEmail(e.target.value)); }}
                onBlur={e => setEmailError(validateEmail(e.target.value))}
                style={{ ...inp, borderColor: emailError ? '#dc2626' : '#d1d5db' }} />
              {emailError && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle size={12} />{emailError}</div>}
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, fontSize: 13, color: '#555', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: 14, height: 14 }} />
              Email me with news and exclusive offers
            </label>
          </section>

          <div style={{ borderTop: '1px solid #e5e7eb', marginBottom: 32 }} />

          {/* ── Delivery ── */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1a1a1a', marginBottom: 16, marginTop: 0 }}>Delivery</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Country */}
              <div>
                <label style={{ fontSize: 12, color: '#888', marginBottom: 4, display: 'block' }}>Country/Region</label>
                <select value={country} onChange={e => setCountry(e.target.value)} style={{ ...inp, cursor: 'pointer', color: '#1a1a1a' }}>
                  {allCountries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {/* First / Last */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <input id="checkout-first-name" type="text" placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} style={inp} />
                <input id="checkout-last-name" type="text" placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} style={inp} />
              </div>
              {/* Address */}
              <input id="checkout-address" type="text" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} style={inp} />
              {/* Apartment */}
              <input type="text" placeholder="Apartment, suite, etc. (optional)" value={apartment} onChange={e => setApartment(e.target.value)} style={inp} />
              {/* City / State / ZIP */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <input id="checkout-city" type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)} style={inp} />
                <input type="text" placeholder="State" value={stateVal} onChange={e => setStateVal(e.target.value)} style={inp} />
                <input id="checkout-postal" type="text" placeholder="ZIP code" value={postal} onChange={e => setPostal(e.target.value)} style={inp} />
              </div>
              {/* Phone */}
              <input type="tel" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} style={inp} />
            </div>
          </section>

          <div style={{ borderTop: '1px solid #e5e7eb', marginBottom: 32 }} />

          {/* ── Shipping method ── */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1a1a1a', marginBottom: 16, marginTop: 0 }}>Shipping method</h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '2px solid #1a1a1a', borderRadius: 6, padding: '14px 16px', background: '#f9fafb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>Free Shipping (14–17 business days)</span>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>FREE</span>
            </div>
          </section>

          <div style={{ borderTop: '1px solid #e5e7eb', marginBottom: 32 }} />

          {/* ── Payment ── */}
          <section style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Payment</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#555' }}>
                <ShieldCheck size={13} color="#22c55e" /> All transactions are secure and encrypted.
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 16, marginTop: 4 }}>All transactions are secure and encrypted.</p>

            {(isDemoCart || isFreeOrder) ? (
              <DemoOrderButton isSubmitting={isSubmitting} onSubmit={handleDemoOrder} />
            ) : stripeError ? (
              <div style={{ padding: 14, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: 13 }}>
                <strong>Payment Error:</strong> {stripeError}
              </div>
            ) : stripePublishableKey && clientSecret ? (
              <Elements stripe={loadStripe(stripePublishableKey)} options={{ clientSecret, appearance: { theme: 'stripe', variables: { colorPrimary: '#1a1a1a', borderRadius: '6px', fontFamily: 'Inter, system-ui, sans-serif' }, rules: { '.Input': { boxShadow: 'none', border: '1px solid #d1d5db' }, '.Input:focus': { border: '1px solid #1a1a1a', boxShadow: 'none' } } } }}>
                <StripePaymentForm isSubmitting={isSubmitting} setIsSubmitting={setIsSubmitting} onSuccess={handleOrderComplete} validateForm={validateForm} />
              </Elements>
            ) : (
              <div style={{ padding: 32, background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 24, height: 24, border: '2px solid #e5e7eb', borderTopColor: '#1a1a1a', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                <span style={{ fontSize: 13, color: '#888' }}>Loading payment...</span>
              </div>
            )}
          </section>

          {/* Footer links */}
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 20, display: 'flex', flexWrap: 'wrap', gap: '8px 20px' }}>
            {[['Refund policy','/pages/refund-policy'],['Shipping','/pages/shipping-policy'],['Privacy policy','/pages/privacy-policy'],['Terms of service','/pages/terms-of-service'],['Contact','/contact']].map(([label, href]) => (
              <Link key={label} to={href} style={{ fontSize: 12, color: '#888', textDecoration: 'underline' }}>{label}</Link>
            ))}
          </div>
        </div>

        {/* RIGHT — sticky order summary */}
        <RightPanel />
      </div>
    </div>
  );
}
