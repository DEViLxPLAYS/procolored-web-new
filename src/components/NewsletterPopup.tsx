import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { api } from '../services/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [discountCode, setDiscountCode] = useState('');

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('procolored_newsletter_shown');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => setIsOpen(true), 300);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') closePopup(); };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  const closePopup = () => {
    setIsOpen(false);
    localStorage.setItem('procolored_newsletter_shown', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) { setStatus('error'); return; }
    setStatus('loading');

    try {
      // Get geo data from backend proxy
      let country = '', city = '';
      try {
        const geo = await fetch(`${API_BASE}/api/analytics/geo`, { signal: AbortSignal.timeout(3000) });
        if (geo.ok) { const g = await geo.json(); country = g.country_name || ''; city = g.city || ''; }
      } catch (_) {}

      const data = await api.subscribeNewsletter(email, country, city, 'popup');
      setDiscountCode(data.discountCode || 'PROCOLORED5');
      setStatus('success');
      localStorage.setItem('procolored_newsletter_shown', 'true');
      setTimeout(() => setIsOpen(false), 4000);
    } catch (_) {
      // Show success even on network error to not frustrate user
      setDiscountCode('PROCOLORED5');
      setStatus('success');
      localStorage.setItem('procolored_newsletter_shown', 'true');
      setTimeout(() => setIsOpen(false), 4000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" onClick={closePopup} />

      {/* Popup Container */}
      <div className="relative w-full max-w-[min(800px,95vw)] max-h-[90vh] bg-[#dfdcd1] shadow-2xl flex flex-col md:flex-row rounded-sm overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Close Button */}
        <button
          onClick={closePopup}
          className="absolute top-3 right-3 z-20 w-11 h-11 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 transition-all shadow-sm"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side — Image */}
        <div className="w-full md:w-[42%] flex-shrink-0">
          <img
            src="https://d3k81ch9hvuctc.cloudfront.net/company/UZTJ3d/images/59a7cde3-e39f-4ac9-92d5-5e2f54c3379c.jpeg"
            alt="Procolored DTF Printers"
            className="w-full h-48 md:h-full object-cover"
            style={{ minHeight: '192px' }}
          />
        </div>

        {/* Right Side — Content */}
        <div className="flex-1 p-6 sm:p-8 md:p-10 flex flex-col justify-center text-center overflow-y-auto max-h-[90vh] md:max-h-none">
          {status === 'success' ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 py-4">
              <div className="text-4xl mb-3">🎉</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1f2937] leading-tight mb-4">
                You're in!
              </h2>
              <p className="text-[#4b5563] text-sm sm:text-base leading-relaxed mb-4">
                Thanks for signing up! Use your exclusive discount code at checkout:
              </p>
              <div className="bg-white border-2 border-dashed border-[#da291c] rounded-lg px-6 py-3 mb-2 inline-block mx-auto">
                <span className="text-xl font-bold tracking-widest text-[#da291c]">{discountCode}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Save 5% on your next order</p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl sm:text-[30px] md:text-[36px] font-bold text-[#1f2937] leading-tight mb-3 tracking-tight pr-8 md:pr-0">
                🎉 Add Your Email for a Chance to Win 5% Off!
              </h2>

              <p className="text-[#4b5563] text-sm sm:text-[15px] leading-relaxed mb-5">
                Enter your email below for a chance to win an exclusive 5% discount on your next order. New products, special offers, and DTF printing tips delivered straight to your inbox.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
                    placeholder="Enter your email to win a chance at 5% off"
                    className={`w-full px-4 py-3 bg-white border text-sm sm:text-base rounded-sm focus:outline-none focus:border-[#da291c] focus:ring-1 focus:ring-[#da291c] transition-colors ${status === 'error' ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    disabled={status === 'loading'}
                  />
                  {status === 'error' && (
                    <p className="absolute -bottom-5 left-0 text-red-500 text-[11px] font-medium">
                      Please enter a valid email address
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-[#da291c] hover:bg-[#c22116] text-white font-semibold text-sm sm:text-[15px] py-3 rounded-sm transition-colors duration-200 mt-2 shadow-sm disabled:opacity-70"
                >
                  {status === 'loading' ? 'Signing you up...' : 'ENTER TO WIN 5% OFF'}
                </button>
              </form>

              <p className="text-[11px] text-[#6b7280] mt-5 text-left leading-relaxed italic">
                By entering you agree to our <a href="/pages/privacy-policy" className="underline hover:text-gray-900">Privacy Policy</a>. Unsubscribe at any time.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
