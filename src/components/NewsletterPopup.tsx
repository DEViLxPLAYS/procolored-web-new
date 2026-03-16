import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');

  useEffect(() => {
    // Check if user has already seen the popup
    const hasSeenPopup = localStorage.getItem('procolored_newsletter_shown');
    
    if (!hasSeenPopup) {
      // Small delay for smooth entrance
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);

  // Handle Escape key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePopup();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  const closePopup = () => {
    setIsOpen(false);
    localStorage.setItem('procolored_newsletter_shown', 'true');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setStatus('error');
      return;
    }

    setStatus('success');
    localStorage.setItem('procolored_newsletter_shown', 'true');
    
    // Auto close after 3 seconds on success
    setTimeout(() => {
      setIsOpen(false);
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Dark overlay backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 shadow-none"
        onClick={closePopup}
      />
      
      {/* Popup Container */}
      <div 
        className="relative w-full max-w-[800px] bg-[#dfdcd1] shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in duration-300 rounded-sm overflow-hidden"
      >
        {/* Close Button */}
        <button 
          onClick={closePopup}
          className="absolute top-4 right-4 z-20 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 transition-all shadow-sm"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side — Image */}
        <div className="w-full md:w-[45%] h-[300px] md:h-auto">
          <img 
            src="https://d3k81ch9hvuctc.cloudfront.net/company/UZTJ3d/images/59a7cde3-e39f-4ac9-92d5-5e2f54c3379c.jpeg" 
            alt="Procolored DTF Printers" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side — Content */}
        <div className="w-full md:w-[55%] p-8 md:p-12 flex flex-col justify-center text-center">
          {status === 'success' ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-4xl mb-4">🎉</div>
              <h2 className="text-[32px] font-bold text-[#1f2937] leading-[1.1] mb-4">
                You're In!
              </h2>
              <p className="text-[#4b5563] text-base leading-relaxed mb-6">
                Your 10% discount code is: <br/>
                <strong className="text-xl text-[#da291c] tracking-wide mt-2 block">PROCOLORED10</strong>
              </p>
              <p className="text-sm text-gray-500">Check your inbox for more details!</p>
            </div>
          ) : (
            <>
              <h2 className="text-[36px] md:text-[42px] font-bold text-[#1f2937] leading-[1.1] mb-4 tracking-tight">
                Welcome to<br/>Procolored
              </h2>
              
              <p className="text-[#4b5563] text-[15px] leading-relaxed mb-6 font-medium px-4 md:px-0">
                Subscribe to get early access to new product launches, exclusive deals, printing inspiration, and more.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full relative">
                <div className="relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setStatus('idle');
                    }}
                    placeholder="Email" 
                    className={`w-full px-4 py-3 bg-white border ${status === 'error' ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-sm text-base focus:outline-none focus:border-[#da291c] focus:ring-1 focus:ring-[#da291c] transition-colors`}
                  />
                  {status === 'error' && (
                    <p className="absolute -bottom-5 left-0 text-red-500 text-[11px] font-medium">
                      Please enter a valid email address
                    </p>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-[#da291c] hover:bg-[#c22116] text-white font-medium text-[15px] py-3 rounded-sm transition-colors duration-200 mt-1 shadow-sm"
                >
                  Continue
                </button>
              </form>

              <p className="text-[11px] text-[#6b7280] mt-6 text-left leading-relaxed italic pr-2">
                * By subscribing, you agree to receive marketing emails from us. You can unsubscribe at any time. <a href="/privacy-policy" className="underline hover:text-gray-900">Privacy Policy</a> & <a href="/terms-of-service" className="underline hover:text-gray-900">Terms</a>.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
