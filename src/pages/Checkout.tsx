import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const parsePrice = (priceStr: string) => {
  if (!priceStr) return 0;
  const normalized = priceStr.replace(/Rs\./i, '').replace(/PKR/i, '').replace(/,/g, '').trim();
  const num = parseFloat(normalized);
  return isNaN(num) ? 0 : num;
};

// ── Generate or retrieve a session ID ──────────────────────
function getSessionId(): string {
  let id = localStorage.getItem('procolored_session');
  if (!id) { id = `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`; localStorage.setItem('procolored_session', id); }
  return id;
}

export default function Checkout() {
  const { items, cartSubtotal, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Field refs for abandonment data capture
  const emailRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);

  // Track if order was completed so we don't double-fire abandonment
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

    const email = emailRef.current?.value || '';
    const firstName = firstNameRef.current?.value || '';
    const lastName = lastNameRef.current?.value || '';
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
        // sendBeacon works even when tab is closing
        navigator.sendBeacon(
          `${API_BASE}/api/checkout/abandon`,
          new Blob([JSON.stringify(payload)], { type: 'application/json' })
        );
      } else {
        await fetch(`${API_BASE}/api/checkout/abandon`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload), keepalive: true
        });
      }
    } catch (_) {}
  };

  useEffect(() => {
    if (items.length === 0) return;

    // 10-minute idle timer
    let idleTimer = setTimeout(() => fireAbandonment('idle_10min'), 10 * 60 * 1000);

    const resetIdle = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => fireAbandonment('idle_10min'), 10 * 60 * 1000);
    };
    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);

    // beforeunload — fires when tab closes or navigates away
    const handleBeforeUnload = () => { fireAbandonment('left_page'); };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Also fire on React navigation away from this route
      if (!orderCompletedRef.current) fireAbandonment('navigated_away');
    };
  }, [items]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (discountCode.trim().toUpperCase() === 'PROCOLORED5') setDiscountApplied(true);
    else alert('Invalid discount code.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    orderCompletedRef.current = true; // Mark completed so abandonment never fires
    setTimeout(() => {
      alert('Order Placed Successfully!');
      clearCart();
      navigate('/');
      setIsSubmitting(false);
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-gray-50">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/collections/all" className="bg-[#E85A24] text-white px-8 py-3 font-bold rounded hover:bg-[#d14b1b] transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 py-6 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/">
            <img src="https://i.postimg.cc/fTQtLtrH/procolored-logo-4k-transparent1.png" alt="Procolored" className="h-10 w-auto" />
          </Link>
          <Link to="/cart" className="text-gray-500 hover:text-black transition-colors font-medium">Return to cart</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto flex flex-col-reverse lg:flex-row min-h-screen">
        {/* Left Side: Form */}
        <div className="w-full lg:w-[55%] p-6 lg:p-12 lg:pr-16 lg:border-r border-gray-200">
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {/* Contact Information */}
              <section>
                <div className="flex justify-between items-end mb-4">
                  <h2 className="text-lg font-bold text-black">Contact</h2>
                  <p className="text-sm">Have an account? <Link to="#" className="text-[#E85A24] hover:underline">Log in</Link></p>
                </div>
                <input
                  ref={emailRef}
                  type="email"
                  required
                  placeholder="Email"
                  className="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#E85A24] focus:ring-1 focus:ring-[#E85A24]"
                />
                <div className="mt-3 flex items-center gap-2">
                  <input type="checkbox" id="news" className="w-4 h-4 rounded text-[#E85A24] focus:ring-[#E85A24]" defaultChecked />
                  <label htmlFor="news" className="text-sm text-gray-600">Email me with news and offers</label>
                </div>
              </section>

              {/* Delivery */}
              <section>
                <h2 className="text-lg font-bold text-black mb-4">Delivery</h2>
                <div className="space-y-4">
                  <div>
                    <select className="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#E85A24] focus:ring-1 focus:ring-[#E85A24] bg-white">
                      <option>United States</option>
                      <option>Pakistan</option>
                      <option>United Kingdom</option>
                      <option>Canada</option>
                      <option>Australia</option>
                    </select>
                  </div>
                  <div className="flex gap-4">
                    <input ref={firstNameRef} type="text" required placeholder="First name" className="w-1/2 border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#E85A24] focus:ring-1 focus:ring-[#E85A24]" />
                    <input ref={lastNameRef} type="text" required placeholder="Last name" className="w-1/2 border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#E85A24] focus:ring-1 focus:ring-[#E85A24]" />
                  </div>
                  <input type="text" required placeholder="Address" className="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#E85A24] focus:ring-1 focus:ring-[#E85A24]" />
                  <input type="text" placeholder="Apartment, suite, etc. (optional)" className="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#E85A24] focus:ring-1 focus:ring-[#E85A24]" />
                  <div className="flex gap-4">
                    <input type="text" required placeholder="City" className="w-1/3 border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#E85A24] focus:ring-1 focus:ring-[#E85A24]" />
                    <input type="text" required placeholder="State / Province" className="w-1/3 border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#E85A24] focus:ring-1 focus:ring-[#E85A24]" />
                    <input type="text" required placeholder="Postal code" className="w-1/3 border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#E85A24] focus:ring-1 focus:ring-[#E85A24]" />
                  </div>
                  <input type="tel" required placeholder="Phone" className="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#E85A24] focus:ring-1 focus:ring-[#E85A24]" />
                </div>
              </section>

              {/* Payment Section */}
              <section>
                <h2 className="text-lg font-bold text-black mb-1">Payment</h2>
                <p className="text-sm text-gray-500 mb-4">All transactions are secure and encrypted.</p>
                <div className="border border-[#E85A24] rounded bg-orange-50/10 overflow-hidden">
                  <div className="p-4 flex items-center justify-between border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full border-4 border-[#E85A24] bg-white flex items-center justify-center"></div>
                      <span className="font-semibold text-sm">Credit card</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-9 h-6 bg-white border border-gray-200 rounded text-[6px] font-bold text-[#14213d] flex items-center justify-center">VISA</div>
                      <div className="w-9 h-6 bg-white border border-gray-200 rounded flex items-center justify-center overflow-hidden">
                        <div className="flex"><div className="w-2.5 h-2.5 bg-[#EB001B] rounded-full"></div><div className="w-2.5 h-2.5 bg-[#F79E1B] rounded-full -ml-1"></div></div>
                      </div>
                      <div className="w-9 h-6 bg-[#006FCF] rounded flex items-center justify-center"><span className="text-white text-[5px] font-bold">AMEX</span></div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 space-y-4">
                    <input type="text" required placeholder="Card number" className="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#E85A24] focus:ring-1 focus:ring-[#E85A24]" />
                    <div className="flex gap-4">
                      <input type="text" required placeholder="Expiration date (MM / YY)" className="w-1/2 border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#E85A24] focus:ring-1 focus:ring-[#E85A24]" />
                      <input type="text" required placeholder="Security code" className="w-1/2 border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#E85A24] focus:ring-1 focus:ring-[#E85A24]" />
                    </div>
                    <input type="text" required placeholder="Name on card" className="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#E85A24] focus:ring-1 focus:ring-[#E85A24]" />
                  </div>
                </div>
              </section>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#E85A24] text-white text-lg font-bold rounded-lg hover:bg-[#d14b1b] transition-colors shadow-lg disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing...' : 'Pay now'}
              </button>
            </div>
          </form>

          <footer className="mt-12 pt-6 border-t border-gray-200 text-xs text-gray-500 font-medium flex gap-4">
            <Link to="#" className="hover:text-black">Refund policy</Link>
            <Link to="#" className="hover:text-black">Shipping policy</Link>
            <Link to="#" className="hover:text-black">Privacy policy</Link>
            <Link to="#" className="hover:text-black">Terms of service</Link>
          </footer>
        </div>

        {/* Right Side: Order Summary */}
        <div className="w-full lg:w-[45%] bg-gray-50 p-6 lg:p-12 lg:pl-16 relative">
          <div className="sticky top-6">
            <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-white border border-gray-200 rounded-lg flex items-center justify-center p-2">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-500 text-white text-xs font-bold rounded-full flex items-center justify-center opacity-90">{item.quantity}</span>
                  </div>
                  <div className="flex-1"><h4 className="text-sm font-semibold text-gray-800 line-clamp-2 pr-4">{item.name}</h4></div>
                  <div className="text-sm font-bold text-black whitespace-nowrap">
                    <span className="font-medium text-gray-900">{formatPriceLocal(parsePrice(item.price) * item.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
              <form onSubmit={handleApplyDiscount} className="flex gap-3">
                <input type="text" value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} placeholder="Discount code or gift card" className="flex-1 border border-gray-300 rounded p-3 text-sm focus:outline-none focus:border-[#E85A24] focus:ring-1 focus:ring-[#E85A24] bg-white" />
                <button type="submit" disabled={!discountCode.trim() || discountApplied} className="bg-gray-200 text-gray-600 px-6 py-3 font-bold rounded hover:bg-gray-300 transition-colors disabled:opacity-50 text-sm">Apply</button>
              </form>
              {discountApplied && <div className="flex items-center gap-2 mt-2"><span className="bg-gray-200 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">🎯 PROCOLORED5</span></div>}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
              <div className="flex justify-between items-center text-sm"><span className="text-gray-600 font-medium">Subtotal</span><span className="font-medium text-gray-900">{formatPriceLocal(cartSubtotal)}</span></div>
              {discountApplied && <div className="flex justify-between items-center text-sm font-medium"><span className="text-gray-600">Order discount <span className="text-xs text-gray-400 font-bold">↳ PROCOLORED5</span></span><span className="font-medium text-green-600">-{formatPriceLocal(discountAmount)}</span></div>}
              <div className="flex justify-between items-center text-sm"><span className="text-gray-600 font-medium">Shipping</span><span className="text-xs text-gray-500 font-medium">Free</span></div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-end">
                <span className="text-xl font-bold text-gray-900">{formatPriceLocal(total)}</span>
                <div className="flex items-center gap-2 text-2xl font-bold text-black">
                  <span className="text-xs font-normal text-gray-500 uppercase tracking-wider">PKR</span>
                  {formatPrice(total).replace(' PKR', '')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
