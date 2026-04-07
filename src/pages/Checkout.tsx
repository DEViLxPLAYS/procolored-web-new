import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useCurrency, convertPrice } from '../context/CurrencyContext';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, X, CreditCard, Lock, ShieldCheck } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Live Stripe publishable key (safe on frontend)
const STRIPE_PK = 'pk_live_51TCQKWIXB0IPPK5N9scYtqgos5k2N7etZtTPgP5lO9cBVa4xA34KrqnzkVRPdwWAMuzv3gcuRJh7isn5JpUtY3kF00WCs32dcA';

function getSessionId(): string {
  let id = localStorage.getItem('procolored_session');
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('procolored_session', id);
  }
  return id;
}

// ── Order Success Popup ──────────────────────────────────────────────────────
function OrderSuccessPopup({ orderNumber, onClose }: { orderNumber: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 8000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Order Placed! 🎉</h2>
            <p className="text-gray-500 text-sm">Thank you for your purchase. We'll be in touch soon.</p>
          </div>
          <div className="bg-gray-50 rounded-xl px-6 py-3 border border-gray-100 w-full">
            <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Order Number</p>
            <p className="text-lg font-bold text-[#E85A24] font-mono">{orderNumber}</p>
          </div>
          <p className="text-xs text-gray-400">A confirmation email will be sent shortly.</p>
          <button onClick={onClose} className="w-full bg-[#E85A24] text-white font-bold py-3 rounded-xl hover:bg-[#d14b1b] transition-colors">
            Continue Shopping
          </button>
        </div>
      </div>
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
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Secure Card Payment</span>
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
        <span className="text-[11px] text-gray-400">256-bit SSL encryption. Your payment info is never stored on our servers.</span>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm flex items-start gap-2">
          <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
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
            Pay Now
          </>
        )}
      </button>
    </form>
  );
}

// ── Main Checkout Component ──────────────────────────────────────────────────
export default function Checkout() {
  const { items, cartSubtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { currency, formatConverted } = useCurrency();

  // ── Form fields ──
  const [email, setEmail] = useState('');
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
  const [successOrderNumber, setSuccessOrderNumber] = useState<string | null>(null);

  // ── Stripe states ──
  const [stripePublishableKey, setStripePublishableKey] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripeError, setStripeError] = useState<string | null>(null);

  // ── Pricing ──
  const discountAmount = discountApplied ? cartSubtotal * 0.05 : 0;
  const shippingCost = 0;
  const total = cartSubtotal - discountAmount + shippingCost;

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

  // ── Create PaymentIntent as soon as total is available ──
  useEffect(() => {
    if (total > 0 && stripePublishableKey && !clientSecret) {
      fetch(`${API_BASE}/api/stripe/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(total * 100), currency: 'usd' }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.clientSecret) setClientSecret(data.clientSecret);
          else setStripeError(data.error || 'Could not initialize payment.');
        })
        .catch(() => setStripeError('Network error. Could not initialize Stripe.'));
    }
  }, [total, stripePublishableKey, clientSecret]);

  // ── Re-create PaymentIntent when discount changes (total changes) ──
  useEffect(() => {
    if (total > 0 && stripePublishableKey) {
      setClientSecret(null); // reset so the effect above triggers again
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
  const fireAbandonment = (stepName = 'checkout', force = false) => {
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
  };

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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (discountCode.trim().toUpperCase() === 'PROCOLORED5') setDiscountApplied(true);
    else alert('Invalid discount code.');
  };

  // ── Validate before payment ──
  const validateForm = () => {
    if (!email) { emailRef.current?.focus(); alert('Please enter your email address.'); return false; }
    if (!firstName || !lastName) { alert('Please enter your first and last name.'); return false; }
    if (!address) { alert('Please enter your street address.'); return false; }
    if (!city) { alert('Please enter your city.'); return false; }
    if (!postal) { alert('Please enter your postal code.'); return false; }
    return true;
  };

  // ── Save order after Stripe success ──
  const handleOrderComplete = async (transactionId: string) => {
    setIsSubmitting(true);
    orderCompletedRef.current = true;

    const shippingAddress = { firstName, lastName, address, apartment, city, state: stateVal, postal, country };
    const orderPayload = {
      customerName: `${firstName} ${lastName}`.trim(),
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
      totalAmount: total,
      currency: 'USD',
      country,
      city,
      paymentMethod: 'Stripe',
      paymentStatus: 'paid',
      transactionId,
    };

    try {
      const res = await fetch(`${API_BASE}/api/checkout/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      const data = await res.json();
      if (res.ok && data.orderNumber) {
        clearCart();
        setSuccessOrderNumber(data.orderNumber);
      } else {
        alert(data.error || 'Order could not be saved. Contact support with your payment confirmation.');
        orderCompletedRef.current = false;
      }
    } catch {
      alert('Network error. Contact support with your payment confirmation.');
      orderCompletedRef.current = false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setSuccessOrderNumber(null);
    navigate('/');
  };

  const allCountries = [
    "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Côte d'Ivoire","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo (Congo-Brazzaville)","Costa Rica","Croatia","Cuba","Cyprus","Czechia","Democratic Republic of the Congo","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Holy See","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway","Oman","Pakistan","Palau","Palestine State","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"
  ];

  if (items.length === 0 && !successOrderNumber) {
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
      {successOrderNumber && (
        <OrderSuccessPopup orderNumber={successOrderNumber} onClose={handleSuccessClose} />
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
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={inputCls}
              />
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
                  <input type="text" required placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Last Name *</label>
                  <input type="text" required placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Street Address *</label>
                <input type="text" required placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Apartment, Suite, etc.</label>
                <input type="text" placeholder="Apartment, suite, etc. (optional)" value={apartment} onChange={e => setApartment(e.target.value)} className={inputCls} />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                <div>
                  <label className={labelCls}>City *</label>
                  <input type="text" required placeholder="City" value={city} onChange={e => setCity(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>State / Province</label>
                  <input type="text" placeholder="State / Province" value={stateVal} onChange={e => setStateVal(e.target.value)} className={inputCls} />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <label className={labelCls}>Postal Code *</label>
                  <input type="text" required placeholder="Postal code" value={postal} onChange={e => setPostal(e.target.value)} className={inputCls} />
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

            {stripeError ? (
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
                <span className="text-sm font-semibold text-gray-500">Loading Secure Payment...</span>
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
                  </div>
                  <span className="text-sm font-medium text-gray-900 whitespace-nowrap">{formatConverted(convertPrice(item.price, currency.divisor) * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Discount */}
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

            {/* Totals */}
            <div className="mt-8 pt-8 border-t border-gray-200 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-900">{formatConverted(cartSubtotal)}</span>
              </div>
              {discountApplied && (
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
                <span className="text-3xl font-light text-black tracking-tight">{formatConverted(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
