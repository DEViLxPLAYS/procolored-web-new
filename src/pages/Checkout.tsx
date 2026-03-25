import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, X } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const parsePrice = (priceStr: string) => {
  if (!priceStr) return 0;
  const normalized = priceStr.replace(/Rs\./i, '').replace(/PKR/i, '').replace(/,/g, '').trim();
  const num = parseFloat(normalized);
  return isNaN(num) ? 0 : num;
};

function getSessionId(): string {
  let id = localStorage.getItem('procolored_session');
  if (!id) { id = `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`; localStorage.setItem('procolored_session', id); }
  return id;
}

// ── Order Success Popup ─────────────────────────────────────
function OrderSuccessPopup({ orderNumber, onClose }: { orderNumber: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 8000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-bounce-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Order Placed! 🎉</h2>
            <p className="text-gray-500 text-sm">Thank you for your order. We'll be in touch soon.</p>
          </div>
          <div className="bg-gray-50 rounded-xl px-6 py-3 border border-gray-100 w-full">
            <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Order Number</p>
            <p className="text-lg font-bold text-[#E85A24] font-mono">{orderNumber}</p>
          </div>
          <p className="text-xs text-gray-400">A confirmation will be with you shortly. This popup closes automatically.</p>
          <button
            onClick={onClose}
            className="w-full bg-[#E85A24] text-white font-bold py-3 rounded-xl hover:bg-[#d14b1b] transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Checkout() {
  const { items, cartSubtotal, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  // Form fields
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postal, setPostal] = useState('');
  const [country, setCountry] = useState('Pakistan');
  const [phone, setPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');

  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successOrderNumber, setSuccessOrderNumber] = useState<string | null>(null);

  const emailRef = useRef<HTMLInputElement>(null);
  const orderCompletedRef = useRef(false);
  const abandonmentFiredRef = useRef(false);

  const formatPriceLocal = (val: number) => formatPrice(val);
  const discountAmount = discountApplied ? cartSubtotal * 0.05 : 0;
  const shippingCost = 0;
  const total = cartSubtotal - discountAmount + shippingCost;

  // ── Abandonment tracker ───────────────────────────────────
  const fireAbandonment = async (step = 'checkout') => {
    if (orderCompletedRef.current || abandonmentFiredRef.current || items.length === 0) return;
    abandonmentFiredRef.current = true;
    const name = [firstName, lastName].filter(Boolean).join(' ');
    const payload = {
      sessionId: getSessionId(),
      email: email || undefined,
      customerName: name || undefined,
      cartItems: items.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price })),
      cartTotal: cartSubtotal.toFixed(2),
      stepAbandoned: step,
      deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
    };
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(`${API_BASE}/api/checkout/abandon`, new Blob([JSON.stringify(payload)], { type: 'application/json' }));
      } else {
        await fetch(`${API_BASE}/api/checkout/abandon`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), keepalive: true });
      }
    } catch (_) {}
  };

  useEffect(() => {
    if (items.length === 0) return;
    let idleTimer = setTimeout(() => fireAbandonment('idle_10min'), 10 * 60 * 1000);
    const resetIdle = () => { clearTimeout(idleTimer); idleTimer = setTimeout(() => fireAbandonment('idle_10min'), 10 * 60 * 1000); };
    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    const handleBeforeUnload = () => { fireAbandonment('left_page'); };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (!orderCompletedRef.current) fireAbandonment('navigated_away');
    };
  }, [items]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (discountCode.trim().toUpperCase() === 'PROCOLORED5') setDiscountApplied(true);
    else alert('Invalid discount code.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    orderCompletedRef.current = true;

    const shippingAddress = {
      firstName, lastName,
      address, apartment,
      city, state, postal, country,
    };

    const orderPayload = {
      customerName: `${firstName} ${lastName}`.trim(),
      customerEmail: email,
      customerPhone: phone || null,
      shippingAddress,
      items: items.map(i => ({
        id: i.id,
        name: i.name,
        price: parsePrice(i.price),
        quantity: i.quantity,
        image: i.image,
      })),
      subtotal: cartSubtotal,
      shippingCost: 0,
      discountAmount,
      discountCode: discountApplied ? 'PROCOLORED5' : null,
      totalAmount: total,
      currency: 'PKR',
      country,
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
        alert(data.error || 'Something went wrong. Please try again.');
        orderCompletedRef.current = false;
      }
    } catch {
      alert('Network error. Please check your connection and try again.');
      orderCompletedRef.current = false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setSuccessOrderNumber(null);
    navigate('/');
  };

  if (items.length === 0 && !successOrderNumber) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-gray-50">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/collections/all" className="bg-[#E85A24] text-white px-8 py-3 font-bold rounded hover:bg-[#d14b1b] transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const inputCls = "w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#E85A24] focus:ring-1 focus:ring-[#E85A24] bg-white transition-colors placeholder-gray-400";

  return (
    <div className="min-h-screen bg-white">
      {/* Order Success Popup */}
      {successOrderNumber && (
        <OrderSuccessPopup orderNumber={successOrderNumber} onClose={handleSuccessClose} />
      )}

      {/* Header */}
      <header className="border-b border-gray-100 py-5 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/">
            <img src="https://i.postimg.cc/fTQtLtrH/procolored-logo-4k-transparent1.png" alt="Procolored" className="h-10 w-auto" />
          </Link>
          <Link to="/" className="text-gray-400 hover:text-black transition-colors text-sm font-medium">← Back to store</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto flex flex-col-reverse lg:flex-row min-h-screen">
        {/* Left Side: Form */}
        <div className="w-full lg:w-[55%] p-6 lg:p-12 lg:pr-16 lg:border-r border-gray-100">
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">

              {/* Contact */}
              <section>
                <h2 className="text-base font-bold text-gray-900 mb-4 uppercase tracking-wide">Contact</h2>
                <input
                  ref={emailRef}
                  type="email"
                  required
                  placeholder="Email address *"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={inputCls}
                />
                <div className="mt-3 flex items-center gap-2">
                  <input type="checkbox" id="news" className="w-4 h-4 rounded accent-[#E85A24]" defaultChecked />
                  <label htmlFor="news" className="text-sm text-gray-500">Email me with news and offers</label>
                </div>
              </section>

              {/* Delivery */}
              <section>
                <h2 className="text-base font-bold text-gray-900 mb-4 uppercase tracking-wide">Delivery</h2>
                <div className="space-y-3">
                  <select
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className={inputCls}
                  >
                    <option>Pakistan</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Canada</option>
                    <option>Australia</option>
                  </select>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" required placeholder="First name *" value={firstName} onChange={e => setFirstName(e.target.value)} className={inputCls} />
                    <input type="text" required placeholder="Last name *" value={lastName} onChange={e => setLastName(e.target.value)} className={inputCls} />
                  </div>
                  <input type="text" required placeholder="Address *" value={address} onChange={e => setAddress(e.target.value)} className={inputCls} />
                  <input type="text" placeholder="Apartment, suite, etc. (optional)" value={apartment} onChange={e => setApartment(e.target.value)} className={inputCls} />
                  <div className="grid grid-cols-3 gap-3">
                    <input type="text" required placeholder="City *" value={city} onChange={e => setCity(e.target.value)} className={inputCls} />
                    <input type="text" required placeholder="State / Province *" value={state} onChange={e => setState(e.target.value)} className={inputCls} />
                    <input type="text" required placeholder="Postal code *" value={postal} onChange={e => setPostal(e.target.value)} className={inputCls} />
                  </div>
                  <input
                    type="tel"
                    placeholder="Phone (optional)"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className={inputCls}
                  />
                </div>
              </section>

              {/* Payment */}
              <section>
                <h2 className="text-base font-bold text-gray-900 mb-1 uppercase tracking-wide">Payment</h2>
                <p className="text-xs text-gray-400 mb-4">All transactions are secure and encrypted.</p>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="p-4 flex items-center justify-between bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full border-4 border-[#E85A24] bg-white"></div>
                      <span className="font-semibold text-sm text-gray-800">Credit card</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-9 h-6 bg-white border border-gray-200 rounded text-[6px] font-bold text-[#14213d] flex items-center justify-center">VISA</div>
                      <div className="w-9 h-6 bg-white border border-gray-200 rounded flex items-center justify-center overflow-hidden">
                        <div className="flex"><div className="w-2.5 h-2.5 bg-[#EB001B] rounded-full"></div><div className="w-2.5 h-2.5 bg-[#F79E1B] rounded-full -ml-1"></div></div>
                      </div>
                      <div className="w-9 h-6 bg-[#006FCF] rounded flex items-center justify-center"><span className="text-white text-[5px] font-bold">AMEX</span></div>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <input type="text" required placeholder="Card number" value={cardNumber} onChange={e => setCardNumber(e.target.value)} className={inputCls} />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" required placeholder="MM / YY" value={expiry} onChange={e => setExpiry(e.target.value)} className={inputCls} />
                      <input type="text" required placeholder="Security code" value={cvv} onChange={e => setCvv(e.target.value)} className={inputCls} />
                    </div>
                    <input type="text" required placeholder="Name on card" value={nameOnCard} onChange={e => setNameOnCard(e.target.value)} className={inputCls} />
                  </div>
                </div>
              </section>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#E85A24] text-white text-base font-bold rounded-xl hover:bg-[#d14b1b] transition-colors shadow-md disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                    Processing...
                  </span>
                ) : 'Pay now'}
              </button>
            </div>
          </form>

          <footer className="mt-12 pt-6 border-t border-gray-100 text-xs text-gray-400 font-medium flex flex-wrap gap-4">
            <Link to="/pages/refund-policy" className="hover:text-black transition-colors">Refund policy</Link>
            <Link to="/pages/shipping-policy" className="hover:text-black transition-colors">Shipping policy</Link>
            <Link to="/pages/privacy-policy" className="hover:text-black transition-colors">Privacy policy</Link>
            <Link to="/pages/terms-of-service" className="hover:text-black transition-colors">Terms of service</Link>
          </footer>
        </div>

        {/* Right Side: Order Summary */}
        <div className="w-full lg:w-[45%] bg-gray-50 p-6 lg:p-12 lg:pl-16">
          <div className="sticky top-6">
            <h3 className="text-base font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200 uppercase tracking-wide">Order Summary</h3>
            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-1">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 bg-white border border-gray-200 rounded-xl flex items-center justify-center p-2 shadow-sm">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-600 text-white text-xs font-bold rounded-full flex items-center justify-center">{item.quantity}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-800 line-clamp-2">{item.name}</h4>
                  </div>
                  <div className="text-sm font-bold text-gray-900 whitespace-nowrap flex-shrink-0">
                    {formatPriceLocal(parsePrice(item.price) * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
              <form onSubmit={handleApplyDiscount} className="flex gap-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={e => setDiscountCode(e.target.value)}
                  placeholder="Discount code"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#E85A24] focus:ring-1 focus:ring-[#E85A24] bg-white"
                />
                <button
                  type="submit"
                  disabled={!discountCode.trim() || discountApplied}
                  className="bg-gray-200 text-gray-700 px-4 py-2.5 font-bold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 text-sm whitespace-nowrap"
                >
                  Apply
                </button>
              </form>
              {discountApplied && (
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">✓ PROCOLORED5 applied</span>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 space-y-2.5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-900">{formatPriceLocal(cartSubtotal)}</span>
              </div>
              {discountApplied && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Discount <span className="text-xs text-green-600 font-bold">(PROCOLORED5)</span></span>
                  <span className="font-medium text-green-600">-{formatPriceLocal(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="text-green-600 font-semibold text-xs">Free</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-gray-900">Total</span>
                <div className="text-right">
                  <span className="text-xs text-gray-400 uppercase tracking-wide mr-1">PKR</span>
                  <span className="text-2xl font-bold text-gray-900">{formatPrice(total).replace('Rs.', '').replace('PKR', '').trim()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
