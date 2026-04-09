import { useState, useEffect, useRef, useCallback } from 'react';
import { useCart } from '../context/CartContext';
import { useCurrency, convertPrice } from '../context/CurrencyContext';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, CreditCard, Lock, ShieldCheck, AlertCircle, X } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Live Stripe publishable key (safe on frontend)
const STRIPE_PK = 'pk_live_51TCQKWIXB0IPPK5N9scYtqgos5k2N7etZtTPgP5lO9cBVa4xA34KrqnzkVRPdwWAMuzv3gcuRJh7isn5JpUtY3kF00WCs32dcA';

// Demo product ID
const DEMO_PRODUCT_ID = 'procolored-demo-order-test';

function getSessionId(): string {
  let id = localStorage.getItem('procolored_session');
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('procolored_session', id);
  }
  return id;
}

// ── Beautiful Order Success Popup ────────────────────────────────────────────
interface OrderSuccessData {
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  currency: string;
  customerEmail: string;
  items: any[];
  isDemoOrder?: boolean;
}

function OrderSuccessPopup({ data, onClose }: { data: OrderSuccessData; onClose: () => void }) {
  useEffect(() => {
    // Lock body scroll while popup is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const currSymbol = data.currency === 'PKR' ? 'Rs.' : '$';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.3s ease',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          maxWidth: '520px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          animation: 'slideUp 0.35s ease',
        }}
      >
        {/* Green success header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            padding: '40px 32px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '36px',
            }}
          >
            ✅
          </div>
          <h2 style={{ color: 'white', fontSize: '26px', fontWeight: '800', margin: '0 0 8px' }}>
            {data.isDemoOrder ? 'Demo Order Created!' : 'Order Confirmed!'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '15px', margin: 0 }}>
            Thank you, {data.customerName}! 🎉
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '32px' }}>
          {/* Stripe / payment badge */}
          {!data.isDemoOrder && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                marginBottom: '20px',
                padding: '8px 16px',
                background: '#f0fdf4',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#166534',
                fontWeight: '600',
              }}
            >
              <ShieldCheck style={{ width: '15px', height: '15px' }} />
              Payment confirmed via Stripe
            </div>
          )}

          {/* Order number + total */}
          <div
            style={{
              background: '#f8f8f8',
              borderRadius: '8px',
              padding: '16px 20px',
              marginBottom: '20px',
              borderLeft: '4px solid #E8302A',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: '#999',
                  marginBottom: '4px',
                }}
              >
                Order Number
              </div>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: '800',
                  color: '#E8302A',
                  letterSpacing: '1px',
                }}
              >
                {data.orderNumber}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: '#999',
                  marginBottom: '4px',
                }}
              >
                Total {data.isDemoOrder ? '(Demo)' : 'Paid'}
              </div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a1a' }}>
                {data.isDemoOrder ? 'FREE' : `${currSymbol}${data.totalAmount.toLocaleString()} ${data.currency}`}
              </div>
            </div>
          </div>

          {/* Items summary */}
          {data.items.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: '#999',
                  marginBottom: '10px',
                }}
              >
                Items Ordered
              </div>
              {data.items.slice(0, 3).map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: '1px solid #f0f0f0',
                    fontSize: '14px',
                    color: '#333',
                  }}
                >
                  <span style={{ fontWeight: '600' }}>
                    {item.name} {item.quantity > 1 ? `×${item.quantity}` : ''}
                  </span>
                  <span style={{ color: '#666' }}>
                    {data.isDemoOrder ? 'FREE' : `${currSymbol}${parseFloat(item.price || 0).toLocaleString()}`}
                  </span>
                </div>
              ))}
              {data.items.length > 3 && (
                <div
                  style={{
                    fontSize: '13px',
                    color: '#888',
                    padding: '8px 0',
                    fontStyle: 'italic',
                  }}
                >
                  +{data.items.length - 3} more item{data.items.length - 3 !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          )}

          {/* Email confirmation note */}
          <div
            style={{
              background: '#f0fdf4',
              borderRadius: '8px',
              padding: '14px 16px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
            }}
          >
            <span style={{ fontSize: '18px', flexShrink: 0 }}>📧</span>
            <div style={{ fontSize: '13px', color: '#166534', lineHeight: '1.5' }}>
              A detailed confirmation email has been sent to{' '}
              <strong>{data.customerEmail}</strong>. Please check your inbox.
            </div>
          </div>

          {/* Delivery note */}
          {!data.isDemoOrder && (
            <div
              style={{
                background: '#fff8f0',
                borderRadius: '8px',
                padding: '14px 16px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span style={{ fontSize: '18px', flexShrink: 0 }}>🚚</span>
              <div style={{ fontSize: '13px', color: '#92400e', lineHeight: '1.5' }}>
                <strong>Estimated Delivery:</strong> 1-2 weeks after payment confirmation.
                <br />
                Our team will contact you with shipping details.
              </div>
            </div>
          )}

          {/* CTA Button — only way to close */}
          <button
            id="order-success-close-btn"
            onClick={onClose}
            style={{
              width: '100%',
              background: '#E8302A',
              color: 'white',
              border: 'none',
              padding: '16px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              letterSpacing: '0.5px',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => ((e.target as HTMLButtonElement).style.background = '#c72020')}
            onMouseOut={e => ((e.target as HTMLButtonElement).style.background = '#E8302A')}
          >
            Continue Shopping
          </button>

          <p style={{ textAlign: 'center', fontSize: '12px', color: '#999', marginTop: '12px' }}>
            Questions? Email us at{' '}
            <a href="mailto:support@procollored.com" style={{ color: '#E8302A', fontWeight: '600' }}>
              support@procollored.com
            </a>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { 
          from { transform: translateY(30px); opacity: 0; } 
          to { transform: translateY(0); opacity: 1; } 
        }
      `}</style>
    </div>
  );
}

// ── Stripe Payment Form ──────────────────────────────────────────────────────
function StripePaymentForm({
  isSubmitting,
  setIsSubmitting,
  onSuccess,
  validateForm,
}: {
  isSubmitting: boolean;
  setIsSubmitting: (v: boolean) => void;
  onSuccess: (txId: string) => void;
  validateForm: () => boolean;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMsg, setErrorMsg] = useState('');

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!stripe || !elements) return;

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
        confirmParams: { return_url: window.location.href },
      });

      if (error) throw new Error(error.message || 'Payment failed. Please check your card details.');
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      } else {
        throw new Error('Payment was not completed. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="space-y-5">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-[#6366F1]" />
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Stripe Secure Payment</span>
          </div>
          <div className="flex items-center gap-1.5">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-2.5 object-contain grayscale opacity-50" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-3.5 object-contain grayscale opacity-50" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="Amex" className="h-3.5 object-contain grayscale opacity-50" />
          </div>
        </div>
        {/* Stripe Payment Element */}
        <div className="p-5">
          <PaymentElement
            options={{
              layout: 'tabs',
              wallets: { applePay: 'never', googlePay: 'never' },
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 px-1">
        <ShieldCheck className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
        <span className="text-[11px] text-gray-400">256-bit SSL encryption via Stripe. Your payment info is never stored on our servers.</span>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm flex items-start gap-2">
          <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        id="stripe-pay-btn"
        disabled={isSubmitting || !stripe}
        className="w-full bg-[#6366F1] hover:bg-[#4F46E5] active:bg-[#4338CA] text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
      >
        {isSubmitting ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4" />
            Pay with Stripe
          </>
        )}
      </button>
    </form>
  );
}

// ── Demo Order Button (for $0 cart) ─────────────────────────────────────────
function DemoOrderButton({
  isSubmitting,
  onSubmit,
}: {
  isSubmitting: boolean;
  onSubmit: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
        <div className="text-lg mb-2">🧪</div>
        <div className="text-sm font-bold text-amber-800 mb-1">Demo Order — No Payment Required</div>
        <div className="text-xs text-amber-700">This is a $0 test order. No card will be charged.</div>
      </div>
      <button
        id="demo-order-btn"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Creating Demo Order...
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4" />
            Confirm Demo Order (Free)
          </>
        )}
      </button>
    </div>
  );
}

// ── Main Checkout Component ──────────────────────────────────────────────────
export default function Checkout() {
  const { items, cartSubtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { currency, formatConverted } = useCurrency();

  // ── Form fields ──
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

  // ── App states ──
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<OrderSuccessData | null>(null);

  // ── Stripe states ──
  const [stripePublishableKey, setStripePublishableKey] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isFreeOrder, setIsFreeOrder] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);

  // ── Pricing ──
  const discountAmount = discountApplied ? cartSubtotal * 0.05 : 0;
  const shippingCost = 0;
  const total = cartSubtotal - discountAmount + shippingCost;

  // ── Is demo product in cart? ──
  const isDemoCart = items.some(i => i.id === DEMO_PRODUCT_ID) && total === 0;

  // ── Refs for abandonment tracking ──
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

  // ── Fetch Stripe publishable key ──
  useEffect(() => {
    fetch(`${API_BASE}/api/stripe/config`)
      .then(res => res.json())
      .then(data => setStripePublishableKey((data && data.publishableKey) ? data.publishableKey : STRIPE_PK))
      .catch(() => setStripePublishableKey(STRIPE_PK));
  }, []);

  // ── Create PaymentIntent as soon as total is available (skip for free/demo) ──
  useEffect(() => {
    if (isDemoCart || total === 0) {
      setIsFreeOrder(true);
      setClientSecret(null);
      return;
    }

    if (total > 0 && stripePublishableKey && !clientSecret) {
      fetch(`${API_BASE}/api/stripe/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(total * 100), currency: 'usd' }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.isFreeOrder) {
            setIsFreeOrder(true);
          } else if (data.clientSecret) {
            setClientSecret(data.clientSecret);
            setIsFreeOrder(false);
          } else {
            setStripeError(data.error || 'Could not initialize payment.');
          }
        })
        .catch(() => setStripeError('Network error. Could not initialize Stripe.'));
    }
  }, [total, stripePublishableKey, clientSecret, isDemoCart]);

  // ── Re-create PaymentIntent when discount changes ──
  useEffect(() => {
    if (total > 0 && stripePublishableKey && !isDemoCart) {
      setClientSecret(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discountApplied]);

  // ── Auto-detect country from IP ──
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => { if (data?.country_name) setCountry(data.country_name); })
      .catch(() => {});
  }, []);

  // ── Abandonment tracker ──
  const fireAbandonment = useCallback((stepName = 'checkout', force = false) => {
    if (orderCompletedRef.current) return;
    if (!force && abandonmentFiredRef.current) return;
    if (items.length === 0) return;
    abandonmentFiredRef.current = true;
    const payload = {
      sessionId: getSessionId(),
      customerEmail: latestEmailRef.current || null,
      customerName: latestNameRef.current || null,
      cartItems: items.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price })),
      cartTotal: cartSubtotal.toFixed(2),
      stepAbandoned: stepName,
      country: latestCountryRef.current,
      city: latestCityRef.current,
      deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
    };
    const jsonStr = JSON.stringify(payload);
    const url = `${API_BASE}/api/checkout/abandon`;
    fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: jsonStr, keepalive: true })
      .catch(() => { try { navigator.sendBeacon(url + '?_beacon=1', jsonStr); } catch (_) {} });
  }, [items, cartSubtotal]);

  useEffect(() => {
    if (items.length === 0) return;
    const idleMs = 10 * 60 * 1000;
    let idleTimer = setTimeout(() => fireAbandonment('idle_10min'), idleMs);
    const resetIdle = () => { clearTimeout(idleTimer); idleTimer = setTimeout(() => fireAbandonment('idle_10min'), idleMs); };
    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    const handleBeforeUnload = () => fireAbandonment('left_page');
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (!orderCompletedRef.current) fireAbandonment('navigated_away');
    };
  }, [fireAbandonment]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (discountCode.trim().toUpperCase() === 'PROCOLORED5') setDiscountApplied(true);
    else alert('Invalid discount code.');
  };

  // ── Email validation ──
  const validateEmail = (val: string) => {
    if (!val) return 'Please enter a valid email address to receive your order confirmation';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) return 'Please enter a valid email address to receive your order confirmation';
    return '';
  };

  // ── Validate full form before payment ──
  const validateForm = () => {
    const emailErr = validateEmail(email);
    if (emailErr) {
      setEmailError(emailErr);
      emailRef.current?.focus();
      emailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    if (!firstName || !lastName) { alert('Please enter your first and last name.'); return false; }
    if (!address) { alert('Please enter your street address.'); return false; }
    if (!city) { alert('Please enter your city.'); return false; }
    if (!postal) { alert('Please enter your postal code.'); return false; }
    return true;
  };

  // ── Build order payload ──
  const buildOrderPayload = (transactionId: string | null, isDemoOrder = false) => {
    const shippingAddress = { street: address, apartment, city, state: stateVal, postalCode: postal, country };
    return {
      customerName: `${firstName} ${lastName}`.trim() || 'Demo Customer',
      customerEmail: email,
      customerPhone: phone || null,
      shippingAddress,
      billingAddress: shippingAddress,
      items: items.map(i => ({
        id: i.id,
        name: i.name,
        price: convertPrice(i.price, currency.divisor),
        quantity: i.quantity,
        image: i.image,
      })),
      subtotal: cartSubtotal,
      shippingCost: 0,
      discountAmount,
      discountCode: discountApplied ? 'PROCOLORED5' : null,
      totalAmount: isDemoOrder ? 0 : total,
      currency: 'USD',
      country,
      city,
      paymentMethod: isDemoOrder ? 'Demo (No Payment)' : 'Stripe',
      paymentStatus: 'paid',
      transactionId,
    };
  };

  // ── Save order after Stripe success ──
  const handleOrderComplete = async (transactionId: string) => {
    setIsSubmitting(true);
    orderCompletedRef.current = true;

    try {
      const res = await fetch(`${API_BASE}/api/checkout/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildOrderPayload(transactionId, false)),
      });
      const data = await res.json();
      if (res.ok && data.orderNumber) {
        clearCart();
        setSuccessData({
          orderNumber: data.orderNumber,
          customerName: `${firstName} ${lastName}`.trim() || 'Customer',
          totalAmount: total,
          currency: 'USD',
          customerEmail: email,
          items: items.map(i => ({ name: i.name, price: convertPrice(i.price, currency.divisor), quantity: i.quantity })),
          isDemoOrder: false,
        });
      } else {
        alert(data.error || 'Order could not be saved. Contact support with your payment confirmation.');
        orderCompletedRef.current = false;
      }
    } catch {
      alert('Network error. Contact support with your Stripe payment confirmation.');
      orderCompletedRef.current = false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Handle Demo / $0 Order ──
  const handleDemoOrder = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    orderCompletedRef.current = true;

    try {
      const res = await fetch(`${API_BASE}/api/checkout/demo-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: `${firstName} ${lastName}`.trim() || 'Demo Customer',
          customerEmail: email,
          shippingAddress: { street: address, apartment, city, state: stateVal, postalCode: postal, country },
          country,
          city,
        }),
      });
      const data = await res.json();
      if (res.ok && data.orderNumber) {
        clearCart();
        setSuccessData({
          orderNumber: data.orderNumber,
          customerName: `${firstName} ${lastName}`.trim() || 'Demo Customer',
          totalAmount: 0,
          currency: 'USD',
          customerEmail: email,
          items: items.map(i => ({ name: i.name, price: 0, quantity: i.quantity })),
          isDemoOrder: true,
        });
      } else {
        alert(data.error || 'Failed to create demo order.');
        orderCompletedRef.current = false;
      }
    } catch {
      alert('Network error. Please try again.');
      orderCompletedRef.current = false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setSuccessData(null);
    navigate('/');
  };

  const allCountries = [
    "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Côte d'Ivoire","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo (Congo-Brazzaville)","Costa Rica","Croatia","Cuba","Cyprus","Czechia","Democratic Republic of the Congo","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Holy See","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway","Oman","Pakistan","Palau","Palestine State","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"
  ];

  if (items.length === 0 && !successData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-[#fafafa]">
        <h2 className="text-2xl font-bold mb-4 text-black text-center">Your bag is empty.</h2>
        <p className="mb-8 text-sm text-gray-500 text-center max-w-sm">Add items to your cart and come back to checkout.</p>
        <Link to="/collections/all" className="bg-black text-white px-8 py-3.5 text-sm font-bold uppercase tracking-widest rounded hover:bg-gray-800 transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const inputCls = "w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black bg-transparent transition-colors placeholder-gray-400";
  const labelCls = "block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 mt-4";

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans selection:bg-black selection:text-white">
      {/* Order Success Popup — only way to dismiss is clicking "Continue Shopping" */}
      {successData && (
        <OrderSuccessPopup data={successData} onClose={handleSuccessClose} />
      )}

      {/* Header */}
      <header className="py-6 px-4 md:px-8 bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/">
            <img src="https://i.postimg.cc/fTQtLtrH/procolored-logo-4k-transparent1.png" alt="Procolored" className="h-7 w-auto" />
          </Link>
          <Link to="/" className="text-black hover:text-gray-500 transition-colors text-xs font-semibold uppercase tracking-widest">Return to Store</Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row min-h-screen">
        {/* Left Side — single scrollable form */}
        <div className="w-full lg:w-[60%] p-6 lg:p-16 lg:pr-24 bg-white">

          {/* ── Contact Information ── */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-black mb-8">Contact Information</h2>
            <div>
              <label className={labelCls}>Email Address *</label>
              <input
                ref={emailRef}
                id="checkout-email"
                type="email"
                required
                placeholder="Email address (required for order confirmation)"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(validateEmail(e.target.value));
                }}
                onBlur={e => setEmailError(validateEmail(e.target.value))}
                className={inputCls + (emailError ? ' border-red-500 focus:border-red-500' : '')}
              />
              {emailError && (
                <div className="flex items-center gap-1.5 mt-2 text-red-600 text-xs">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {emailError}
                </div>
              )}
            </div>
            <div className="mt-6 flex items-center gap-3">
              <input type="checkbox" id="news" className="w-4 h-4 rounded border-gray-300 accent-black cursor-pointer" defaultChecked />
              <label htmlFor="news" className="text-sm text-gray-600 cursor-pointer">Keep me up to date on news and exclusive offers</label>
            </div>
          </section>

          {/* ── Delivery Address ── */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-black mb-8">Delivery Address</h2>
            <div className="space-y-2">
              <div>
                <label className={labelCls}>Country / Region *</label>
                <select value={country} onChange={e => setCountry(e.target.value)} className={inputCls + " cursor-pointer"}>
                  {allCountries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-6 pt-2">
                <div>
                  <label className={labelCls}>First Name *</label>
                  <input id="checkout-first-name" type="text" required placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Last Name *</label>
                  <input id="checkout-last-name" type="text" required placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Street Address *</label>
                <input id="checkout-address" type="text" required placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Apartment, Suite, etc.</label>
                <input type="text" placeholder="Apartment, suite, etc. (optional)" value={apartment} onChange={e => setApartment(e.target.value)} className={inputCls} />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                <div>
                  <label className={labelCls}>City *</label>
                  <input id="checkout-city" type="text" required placeholder="City" value={city} onChange={e => setCity(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>State / Province</label>
                  <input type="text" placeholder="State / Province" value={stateVal} onChange={e => setStateVal(e.target.value)} className={inputCls} />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <label className={labelCls}>Postal Code *</label>
                  <input id="checkout-postal" type="text" required placeholder="Postal code" value={postal} onChange={e => setPostal(e.target.value)} className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Phone Number</label>
                <input type="tel" placeholder="Phone (optional)" value={phone} onChange={e => setPhone(e.target.value)} className={inputCls} />
              </div>
            </div>
          </section>

          {/* ── Payment ── */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-black">Payment</h2>
              <div className="flex items-center gap-1.5 text-[11px] text-green-600 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Secure & Encrypted
              </div>
            </div>

            {/* Demo / $0 order — no Stripe needed */}
            {(isDemoCart || isFreeOrder) ? (
              <DemoOrderButton isSubmitting={isSubmitting} onSubmit={handleDemoOrder} />
            ) : stripeError ? (
              <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl">
                <strong>Payment Error:</strong> {stripeError}
              </div>
            ) : stripePublishableKey && clientSecret ? (
              <Elements
                stripe={loadStripe(stripePublishableKey)}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#6366F1',
                      borderRadius: '8px',
                      fontFamily: 'Inter, system-ui, sans-serif',
                      spacingUnit: '4px',
                    },
                    rules: {
                      '.Input': { boxShadow: 'none', border: '1px solid #e5e7eb' },
                      '.Input:focus': { border: '1px solid #6366F1', boxShadow: '0 0 0 3px rgba(99,102,241,0.1)' },
                    },
                  },
                }}
              >
                <StripePaymentForm
                  isSubmitting={isSubmitting}
                  setIsSubmitting={setIsSubmitting}
                  onSuccess={handleOrderComplete}
                  validateForm={validateForm}
                />
              </Elements>
            ) : (
              <div className="p-12 border border-gray-200 bg-gray-50 rounded-xl flex items-center justify-center flex-col gap-3">
                <span className="w-7 h-7 border-2 border-gray-300 border-t-[#6366F1] rounded-full animate-spin"></span>
                <span className="text-sm font-semibold text-gray-500">Loading Stripe Secure Payment...</span>
              </div>
            )}
          </section>

          <footer className="mt-8 pt-8 border-t border-gray-200 flex flex-wrap gap-6">
            <Link to="/pages/refund-policy" className="text-xs font-semibold text-gray-500 hover:text-black uppercase tracking-wider transition-colors">Refund policy</Link>
            <Link to="/pages/shipping-policy" className="text-xs font-semibold text-gray-500 hover:text-black uppercase tracking-wider transition-colors">Shipping policy</Link>
            <Link to="/pages/privacy-policy" className="text-xs font-semibold text-gray-500 hover:text-black uppercase tracking-wider transition-colors">Privacy policy</Link>
            <Link to="/pages/terms-of-service" className="text-xs font-semibold text-gray-500 hover:text-black uppercase tracking-wider transition-colors">Terms of service</Link>
          </footer>
        </div>

        {/* Right Side: Order Summary */}
        <div className="w-full lg:w-[40%] bg-[#fafafa] p-6 lg:p-16 lg:pl-16 border-l border-gray-100">
          <div className="sticky top-24">
            <h3 className="text-2xl font-semibold text-black mb-8">Order Summary</h3>
            <div className="space-y-6 max-h-[45vh] overflow-y-auto pr-2 hide-scrollbar">
              {items.map(item => (
                <div key={item.id} className="flex items-start gap-5">
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 bg-white border border-gray-200 rounded-lg flex items-center justify-center p-2 shadow-sm">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-gray-500/90 backdrop-blur text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm">{item.quantity}</span>
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <h4 className="text-sm font-medium text-gray-900 leading-snug">{item.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                    {item.id === DEMO_PRODUCT_ID && (
                      <span className="inline-block mt-1 text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase tracking-wide">
                        TEST — $0
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                    {item.id === DEMO_PRODUCT_ID ? 'FREE' : formatConverted(convertPrice(item.price, currency.divisor) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Discount */}
            {!isDemoCart && (
              <div className="mt-10 pt-8 border-t border-gray-200">
                <form onSubmit={handleApplyDiscount} className="flex gap-3">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={e => setDiscountCode(e.target.value)}
                    placeholder="Gift card or discount code"
                    className="flex-1 border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-black bg-white transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!discountCode.trim() || discountApplied}
                    className="bg-gray-200 text-black px-6 py-3 font-semibold rounded hover:bg-gray-300 transition-colors disabled:opacity-50 text-sm whitespace-nowrap"
                  >
                    Apply
                  </button>
                </form>
                {discountApplied && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="bg-green-50 text-green-700 px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 border border-green-200">
                      <CheckCircle className="w-3 h-3" /> PROCOLORED5 applied — 5% off
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Totals */}
            <div className="mt-8 pt-8 border-t border-gray-200 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-900">{isDemoCart ? 'FREE' : formatConverted(cartSubtotal)}</span>
              </div>
              {discountApplied && !isDemoCart && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Discount <span className="text-xs text-green-600 font-bold ml-1">(PROCOLORED5)</span></span>
                  <span className="font-medium text-green-600">-{formatConverted(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="text-gray-500">Calculated logically</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-end">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-3xl font-light text-black tracking-tight">
                  {isDemoCart ? <span className="text-amber-500 font-bold text-2xl">$0.00 FREE</span> : formatConverted(total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
