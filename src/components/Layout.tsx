import { useState, useRef, useMemo, useEffect } from 'react';
import { 
  Search, User, ShoppingCart, ChevronDown, Menu, X, 
  ChevronRight, ChevronLeft, MessageCircle, Headphones, Globe,
  Facebook, Instagram, Youtube, 
  MapPin, Award, Shield
} from 'lucide-react';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const PinterestIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.195 0 7.451 2.991 7.451 6.985 0 4.168-2.627 7.524-6.275 7.524-1.226 0-2.38-.638-2.774-1.391 0 0-.606 2.311-.753 2.877-.272 1.05-.884 2.179-1.375 2.981 1.08.334 2.227.514 3.415.514 6.621 0 11.988-5.368 11.988-11.988 0-6.62-5.367-11.987-11.988-11.987z" />
  </svg>
);
import { Outlet, Link } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import CartDrawer from './CartDrawer';
import '../App.css';

const navbarCategories = [
  { id: 'dtf', name: "DTF Printer", path: "/collections/dtf-printer" },
  { id: 'uv-dtf', name: "UV DTF Printer", path: "/collections/uv-dtf-printer" },
  { id: 'uv', name: "UV Printer", path: "/collections/uv-printer" },
  { id: 'dtg', name: "DTG Printer", path: "/collections/dtg-printer" },
  { id: 'equipment', name: "Equipment", path: "/collections/equipment" },
  { id: 'consumables', name: "Consumables", path: "/collections/consumables" },
  { id: 'parts', name: "Parts & Accessory", path: "/collections/parts-accessory" },
  { id: 'whats-new', name: "What's New", path: "/collections/whats-new" },
  { id: 'warranty', name: "Extended Warranty", path: "/collections/extended-warranty" },
  { id: 'all', name: "View All", path: "/collections/all" },
];

const supportLinks = [
  { name: "Showroom", path: "/showroom" },
  { name: "Repair", path: "/repair" },
  { name: "Warranty", path: "/warranty" }
];
const aboutUsLinks = [
  { name: "Procolored Siphon Circulation", path: "/pages/procolored-siphon-circulation" },
  { name: "Our Brand", path: "/pages/our-brand" },
  { name: "Contact US", path: "/pages/contact-us" }
];

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function FooterNewsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) { setStatus('error'); return; }
    setStatus('loading');
    try {
      let country = '', city = '';
      try {
        const geo = await fetch(`${API_BASE}/api/analytics/geo`, { signal: AbortSignal.timeout(3000) });
        if (geo.ok) { const g = await geo.json(); country = g.country_name || ''; city = g.city || ''; }
      } catch (_) {}
      await fetch(`${API_BASE}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, country, city, source: 'footer' })
      });
      setStatus('success');
      setEmail('');
    } catch (_) {
      setStatus('success'); // silent — don't frustrate users
    }
  };

  return (
    <div>
      <h3 className="font-bold mb-4 text-white">Get the latest on Procolored products, chance of free trials, and more.</h3>
      {status === 'success' ? (
        <div className="flex items-center gap-2 py-2">
          <span className="text-green-400 text-lg">✅</span>
          <span className="text-white font-medium text-sm">Thanks! You're subscribed.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setStatus('idle'); }}
            placeholder="Enter Your Email"
            disabled={status === 'loading'}
            className={`flex-1 px-4 py-2 rounded-lg bg-gray-800 border text-white placeholder-gray-500 focus:outline-none focus:border-red-600 font-medium ${
              status === 'error' ? 'border-red-500' : 'border-gray-700'
            }`}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg disabled:opacity-70 transition-colors text-sm whitespace-nowrap"
          >
            {status === 'loading' ? '...' : 'SUBSCRIBE'}
          </button>
        </form>
      )}
      {status === 'error' && <p className="text-red-400 text-xs mt-1 font-medium">Please enter a valid email address</p>}
      <div className="flex gap-4 mt-4">
        <a href="https://www.facebook.com/Procolored" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white cursor-pointer transition-colors"><Facebook className="w-5 h-5" /></a>
        <a href="https://x.com/Procoloredprint" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white cursor-pointer transition-colors flex items-center justify-center bg-white rounded-full w-6 h-6 text-black"><XIcon className="w-3.5 h-3.5" /></a>
        <a href="https://www.instagram.com/procolored_printers" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white cursor-pointer transition-colors flex items-center justify-center bg-white rounded-full w-6 h-6 text-black"><Instagram className="w-4 h-4" /></a>
        <a href="https://www.youtube.com/c/Procoloredprofessionalprinter" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white cursor-pointer transition-colors flex items-center justify-center bg-white rounded-full w-6 h-6 text-black pb-0.5"><Youtube className="w-4 h-4" /></a>
        <a href="https://www.pinterest.com/procolored/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white cursor-pointer transition-colors flex items-center justify-center bg-white rounded-full w-6 h-6 text-black"><PinterestIcon className="w-3.5 h-3.5" /></a>
        <a href="https://www.tiktok.com/@procolored" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white cursor-pointer transition-colors flex items-center justify-center bg-white rounded-full w-6 h-6 text-black"><TikTokIcon className="w-3.5 h-3.5" /></a>
      </div>
    </div>
  );
}

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMobileMenu, setActiveMobileMenu] = useState<'main' | 'products' | 'support' | 'about'>('main');
  const [expandedProductCategory, setExpandedProductCategory] = useState<string | null>(null);
  
  const [showChat, setShowChat] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();
  const { currency, setCurrency, allCurrencies } = useCurrency();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState("DTF Printer");
  
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      // Reset menus when closed
      setTimeout(() => {
        setActiveMobileMenu('main');
        setExpandedProductCategory(null);
      }, 300);
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isMenuOpen]);

  const closeMenu = () => { setIsMenuOpen(false); };

  const rightColumnProducts = useMemo(() => {
    if (hoveredCategory === 'View All') {
      return products.slice(0, 4);
    }
    return products
      .filter(p => p.filters?.collection === hoveredCategory)
      .sort((a, b) => {
        if (a.badge === 'BEST SELLER' && b.badge !== 'BEST SELLER') return -1;
        if (b.badge === 'BEST SELLER' && a.badge !== 'BEST SELLER') return 1;
        return 0;
      })
      .slice(0, 4);
  }, [hoveredCategory]);

  const handleDropdownEnter = (dropdown: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(dropdown);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden w-full">
      <div className="w-full bg-[#f8f5f0] overflow-hidden flex justify-center">
        <img 
          src="https://i.postimg.cc/KYnYhPVW/MAKE-THIS-IMAGE-202603241555.jpg" 
          alt="Fan Appreciation Sale"
          className="w-full h-[55px] sm:h-[75px] md:h-[90px] lg:h-[110px] xl:h-[120px] object-cover object-center"
          style={{ display: 'block' }}
        />
      </div>

      {/* Top Utility Bar */}
      <div className="hidden lg:flex justify-end items-center max-w-7xl mx-auto px-4 py-2 border-b border-gray-100 gap-6">
        <div className="flex items-center gap-4">
          <a href="https://www.facebook.com/Procolored" target="_blank" rel="noreferrer" className="text-gray-800 hover:text-red-600 transition-colors">
            <Facebook className="w-[18px] h-[18px]" strokeWidth={2.5} />
          </a>
          <a href="https://x.com/Procoloredprint" target="_blank" rel="noreferrer" className="text-gray-800 hover:text-red-600 transition-colors">
            <XIcon className="w-[16px] h-[16px]" />
          </a>
          <a href="https://www.instagram.com/procolored_printers" target="_blank" rel="noreferrer" className="text-gray-800 hover:text-red-600 transition-colors">
            <Instagram className="w-[18px] h-[18px]" strokeWidth={2.5} />
          </a>
          <a href="https://www.youtube.com/c/Procoloredprofessionalprinter" target="_blank" rel="noreferrer" className="text-gray-800 hover:text-red-600 transition-colors">
            <Youtube className="w-[20px] h-[20px]" strokeWidth={2.5} />
          </a>
          <a href="https://www.pinterest.com/procolored/" target="_blank" rel="noreferrer" className="text-gray-800 hover:text-red-600 transition-colors">
            <PinterestIcon className="w-[18px] h-[18px]" />
          </a>
          <a href="https://www.tiktok.com/@procolored" target="_blank" rel="noreferrer" className="text-gray-800 hover:text-red-600 transition-colors">
            <TikTokIcon className="w-[17px] h-[17px]" />
          </a>
        </div>
        {/* Currency selector */}
        <div className="relative border-l border-gray-200 pl-6">
          <button
            onClick={() => setShowCurrencyPicker(p => !p)}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-800 hover:text-red-600 transition-colors"
          >
            <Globe className="w-4 h-4" />
            {currency.code} ({currency.symbol})
            <ChevronDown className="w-3 h-3" />
          </button>
          {showCurrencyPicker && (
            <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-[200] py-1 min-w-[160px]">
              {allCurrencies.map(c => (
                <button
                  key={c.code}
                  onClick={() => { setCurrency(c); setShowCurrencyPicker(false); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${currency.code === c.code ? 'text-[#E85A24] font-semibold' : 'text-gray-700'}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <header className="sticky top-0 z-[100] bg-white border-b border-gray-100 w-full" style={{position:'sticky', top:0}}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="hidden lg:flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center">
                <img 
                  src="https://i.postimg.cc/fTQtLtrH/procolored-logo-4k-transparent1.png" 
                  alt="Procolored"
                  className="h-14 w-auto object-contain"
                />
              </Link>
              
              <nav className="flex items-center gap-6">
                <div 
                  className="relative group"
                  onMouseEnter={() => handleDropdownEnter('products')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link to="/collections/all" className={`flex items-center gap-1 text-[15px] font-semibold text-black nav-link ${activeDropdown === 'products' ? 'nav-link-active' : ''}`}>
                    Products <ChevronDown className="w-4 h-4 ml-1" />
                  </Link>
                  {activeDropdown === 'products' && (
                    <div className="absolute top-full left-0 h-3 w-56" />
                  )}
                </div>

                <Link to="/f13" className="flex items-center gap-1 text-[15px] font-semibold text-black nav-link">
                  <span className="text-yellow-500">🔔</span> F13 Appreciation Deals
                </Link>
                
                <div 
                  className="relative group"
                  onMouseEnter={() => handleDropdownEnter('support')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button className={`flex items-center gap-1 text-[15px] font-semibold text-black nav-link ${activeDropdown === 'support' ? 'nav-link-active' : ''}`}>
                    Support <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                  {activeDropdown === 'support' && (
                    <div 
                      className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl z-[9999] py-2 border border-gray-100 animate-slide-in"
                      style={{minWidth: '220px'}}
                      onMouseEnter={() => handleDropdownEnter('support')}
                      onMouseLeave={handleDropdownLeave}
                    >
                      {supportLinks.map((link, idx) => (
                        <Link key={idx} to={link.path} className="block px-5 py-2.5 text-sm font-medium text-black hover:text-[#E85A24] hover:bg-gray-50 transition-colors whitespace-nowrap">
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div 
                  className="relative group"
                  onMouseEnter={() => handleDropdownEnter('about')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button className={`flex items-center gap-1 text-[15px] font-semibold text-black nav-link ${activeDropdown === 'about' ? 'nav-link-active' : ''}`}>
                    About Us <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                  {activeDropdown === 'about' && (
                    <div 
                      className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl z-[9999] py-2 border border-gray-100 animate-slide-in"
                      style={{minWidth: '240px'}}
                      onMouseEnter={() => handleDropdownEnter('about')}
                      onMouseLeave={handleDropdownLeave}
                    >
                      {aboutUsLinks.map((link, idx) => (
                        <Link key={idx} to={link.path} className="block px-5 py-2.5 text-sm font-medium text-black hover:text-[#E85A24] hover:bg-gray-50 transition-colors whitespace-nowrap">
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <User className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-xs rounded-full flex items-center justify-center">{cartCount}</span>
              </button>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between h-14" style={{position:'relative'}}>
            <button 
              className="p-2 rounded-full transition-colors w-10 h-10 flex items-center justify-center"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/" className="absolute left-1/2 -translate-x-1/2">
              <img 
                src="https://i.postimg.cc/fTQtLtrH/procolored-logo-4k-transparent1.png" 
                alt="Procolored"
                className="h-11 w-auto object-contain"
              />
            </Link>

            <div className="flex items-center gap-1">
              <button className="p-2 rounded-full transition-colors"><Search className="w-5 h-5" /></button>
              <button className="p-2 rounded-full transition-colors"><User className="w-5 h-5" /></button>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="p-2 rounded-full transition-colors relative"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-xs rounded-full flex items-center justify-center">{cartCount}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Products Dropdown Panel */}
        {activeDropdown === 'products' && (
          <div 
            className="absolute top-full left-0 right-0 bg-white shadow-xl z-[90] border-t border-gray-100 animate-slide-in"
            onMouseEnter={() => handleDropdownEnter('products')}
            onMouseLeave={handleDropdownLeave}
          >
            <div className="max-w-7xl mx-auto px-4 flex">
              <div className="w-64 py-6 pr-6 border-r border-gray-100">
                <div className="space-y-1">
                  {navbarCategories.map((cat, idx) => (
                    <Link 
                      key={idx} 
                      to={cat.path}
                      onMouseEnter={() => setHoveredCategory(cat.name)}
                      className={`group flex items-center justify-between text-[15px] font-medium py-2 px-3 rounded transition-colors ${
                        hoveredCategory === cat.name ? 'text-[#E85A24] bg-gray-50 font-bold' : 'text-black hover:text-[#E85A24] hover:bg-gray-50'
                      }`}
                    >
                      <span className="relative z-10">{cat.name}</span>
                      <ChevronRight className={`w-4 h-4 transition-transform ${hoveredCategory === cat.name ? 'text-[#E85A24]' : 'text-transparent group-hover:text-[#E85A24]'}`} />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex-1 p-6 relative flex flex-col">
                <div className="grid grid-cols-4 gap-6">
                  {rightColumnProducts.map((product, pIdx) => (
                    <Link key={pIdx} to={`/products/${product.id}`} className="block text-center group">
                      <div className="bg-gray-50 rounded-lg p-4 mb-3 group-hover:bg-gray-100 transition-colors h-36 flex items-center justify-center relative overflow-hidden">
                        <img src={product.image} alt={product.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                        {product.badge && (
                          <div className={`absolute top-2 left-2 px-1.5 py-0.5 text-[10px] uppercase font-bold text-white rounded-sm ${product.badge === 'NEW ARRIVAL' ? 'bg-[#98db51]' : 'bg-[#E85A24]'}`}>
                            {product.badge}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-black font-semibold mt-1 group-hover:text-[#E85A24] transition-colors line-clamp-2">{product.title}</p>
                    </Link>
                  ))}
                  {rightColumnProducts.length === 0 && (
                    <div className="col-span-4 text-center py-10 text-gray-500 text-sm">
                      No matching products to preview.
                    </div>
                  )}
                </div>
                <div className="mt-8 text-right flex-1 flex items-end justify-end">
                  <Link to="/collections/all" className="inline-flex items-center gap-1 text-[13px] font-bold text-black border border-gray-200 px-5 py-2.5 hover:bg-gray-50 transition-colors uppercase cursor-pointer">
                    View All <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Slide-in Menu — FIXED POSITION, never scrolls away */}
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="lg:hidden fixed inset-0 bg-black/40 z-[9998]"
              onClick={closeMenu}
            />
            {/* Drawer */}
            <div className="lg:hidden fixed top-0 left-0 w-full h-full bg-white z-[9999] flex flex-col overflow-hidden">
              {/* Sticky header with close button */}
              <div className="sticky top-0 z-10 bg-white border-b border-gray-100 flex items-center justify-between px-4 h-14 flex-shrink-0">
                <Link to="/" onClick={closeMenu}>
                  <img
                    src="https://i.postimg.cc/fTQtLtrH/procolored-logo-4k-transparent1.png"
                    alt="Procolored"
                    className="h-10 w-auto object-contain"
                  />
                </Link>
                <button
                  onClick={closeMenu}
                  className="w-11 h-11 flex items-center justify-center text-gray-700 hover:text-black transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Main Nav Wrapper for sliding */}
              <div className="flex-1 relative overflow-hidden">
                
                {/* --- MAIN LEVEL --- */}
                <div className={`absolute inset-0 bg-white transition-transform duration-300 ease-in-out overflow-y-auto px-4 pb-8 ${activeMobileMenu === 'main' ? 'translate-x-0' : '-translate-x-full'}`}>
                  
                  {/* Products */}
                  <div className="border-b border-gray-100">
                    <button
                      onClick={() => setActiveMobileMenu('products')}
                      className="w-full flex items-center justify-between py-4 text-[15px] font-medium text-black"
                    >
                      <span>Products</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  {/* F13 Deals */}
                  <Link
                    to="/f13"
                    onClick={closeMenu}
                    className="flex items-center py-4 border-b border-gray-100 text-[15px] font-medium text-black" // Text color changed from #E85A24 to match reference, bell kept
                  >
                    <span className="mr-2">🔔</span> F13 Appreciation Deals
                  </Link>

                  {/* Support */}
                  <div className="border-b border-gray-100">
                    <button
                      onClick={() => setActiveMobileMenu('support')}
                      className="w-full flex items-center justify-between py-4 text-[15px] font-medium text-black"
                    >
                      <span>Support</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  {/* About Us */}
                  <div className="border-b border-gray-100">
                    <button
                      onClick={() => setActiveMobileMenu('about')}
                      className="w-full flex items-center justify-between py-4 text-[15px] font-medium text-black"
                    >
                      <span>About Us</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  {/* Social Icons row */}
                  <div className="flex items-center gap-6 mt-8 justify-center">
                    <a href="https://www.facebook.com/Procolored" target="_blank" rel="noreferrer"><Facebook className="w-[18px] h-[18px] text-black" /></a>
                    <a href="https://x.com/Procoloredprint" target="_blank" rel="noreferrer"><XIcon className="w-4 h-4 text-black" /></a>
                    <a href="https://www.instagram.com/procolored_printers" target="_blank" rel="noreferrer"><Instagram className="w-[18px] h-[18px] text-black" /></a>
                    <a href="https://www.youtube.com/c/Procoloredprofessionalprinter" target="_blank" rel="noreferrer"><Youtube className="w-5 h-5 text-black" /></a>
                    <a href="https://www.pinterest.com/procolored/" target="_blank" rel="noreferrer"><PinterestIcon className="w-[18px] h-[18px] text-black" /></a>
                  </div>

                  {/* Region Selector */}
                  <div className="flex items-center justify-center gap-2 mt-6 text-sm text-black">
                    <Globe className="w-4 h-4" /> United States and others
                  </div>
                </div>

                {/* --- PRODUCTS SUBMENU --- */}
                <div className={`absolute inset-0 bg-white transition-transform duration-300 ease-in-out overflow-y-auto px-4 pb-8 ${activeMobileMenu === 'products' ? 'translate-x-0' : 'translate-x-full'}`}>
                  {/* Back button header */}
                  <button 
                    onClick={() => setActiveMobileMenu('main')}
                    className="flex items-center gap-2 py-4 text-[15px] font-medium text-black border-b border-gray-100 w-full text-left"
                  >
                    <ChevronLeft className="w-5 h-5" /> Products
                  </button>
                  
                  {/* Products List matching reference exactly */}
                  <div className="flex flex-col mt-2">
                    {[
                      { name: 'Direct to Film Transfer (DTF) Printer', path: '/collections/dtf-printer', hasSub: true },
                      { name: 'UV DTF Printer', path: '/collections/uv-dtf-printer', hasSub: true },
                      { name: 'UV Printer', path: '/collections/uv-printer', hasSub: true },
                      { name: 'DTG Printer', path: '/collections/dtg-printer', hasSub: true },
                      { name: 'Equipment', path: '/collections/equipment', hasSub: false },
                      { name: 'Consumables', path: '/collections/consumables', hasSub: false },
                      { name: 'Parts & Accessory', path: '/collections/parts-accessory', hasSub: false },
                      { name: 'What\'s New', path: '/collections/whats-new', hasSub: true },
                      { name: 'Extended Warranty', path: '/collections/extended-warranty', hasSub: true },
                    ].map(cat => (
                      <div key={cat.name}>
                        {cat.hasSub ? (
                          <>
                            <button
                              onClick={() => setExpandedProductCategory(p => p === cat.name ? null : cat.name)}
                              className="w-full flex items-center justify-between py-3 text-[14px] text-black"
                            >
                              <span>{cat.name}</span>
                              <ChevronDown className={`w-4 h-4 transition-transform ${expandedProductCategory === cat.name ? 'rotate-180' : ''}`} />
                            </button>
                            {expandedProductCategory === cat.name && (
                              <div className="pl-4 pb-2 flex flex-col gap-2">
                                <Link to={cat.path} onClick={closeMenu} className="text-[13px] text-gray-600 font-medium py-1">
                                  View All
                                </Link>
                                {/* We can add real subcategories here later if they exist, for now just View All */}
                              </div>
                            )}
                          </>
                        ) : (
                          <Link
                            to={cat.path}
                            onClick={closeMenu}
                            className="w-full flex items-center justify-between py-3 text-[14px] text-black"
                          >
                            <span>{cat.name}</span>
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* --- SUPPORT SUBMENU --- */}
                <div className={`absolute inset-0 bg-white transition-transform duration-300 ease-in-out overflow-y-auto px-4 pb-8 ${activeMobileMenu === 'support' ? 'translate-x-0' : 'translate-x-full'}`}>
                  {/* Back button header */}
                  <button 
                    onClick={() => setActiveMobileMenu('main')}
                    className="flex items-center gap-2 py-4 text-[15px] font-medium text-black border-b border-gray-100 w-full text-left"
                  >
                    <ChevronLeft className="w-5 h-5" /> Support
                  </button>
                  <div className="flex flex-col mt-2">
                    {supportLinks.map((link, idx) => (
                      <Link key={idx} to={link.path} onClick={closeMenu} className="w-full flex items-center justify-between py-3 text-[14px] text-black">
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* --- ABOUT US SUBMENU --- */}
                <div className={`absolute inset-0 bg-white transition-transform duration-300 ease-in-out overflow-y-auto px-4 pb-8 ${activeMobileMenu === 'about' ? 'translate-x-0' : 'translate-x-full'}`}>
                  {/* Back button header */}
                  <button 
                    onClick={() => setActiveMobileMenu('main')}
                    className="flex items-center gap-2 py-4 text-[15px] font-medium text-black border-b border-gray-100 w-full text-left"
                  >
                    <ChevronLeft className="w-5 h-5" /> About Us
                  </button>
                  <div className="flex flex-col mt-2">
                    {aboutUsLinks.map((link, idx) => (
                      <Link key={idx} to={link.path} onClick={closeMenu} className="w-full flex items-center justify-between py-3 text-[14px] text-black">
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </>
        )}
      </header>

      <main className="flex-1 w-full m-0 p-0">
        <Outlet />
      </main>

      <footer className="bg-[#1a1a1a] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold mb-4 text-white">Buy on the Procolored store</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
                  <Headphones className="w-4 h-4" />
                  <span>22/6 Customer Support</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>Local Engineers</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
                  <Shield className="w-4 h-4" />
                  <span>6-Month Print Head Warranty</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
                  <Award className="w-4 h-4" />
                  <span>Lifetime Customer Support</span>
                </div>
              </div>
            </div>
            <FooterNewsletter />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold mb-4 text-white">Product</h4>
              <ul className="space-y-2 text-sm font-medium text-gray-400">
                <li><Link to="/collections/dtf-printer" className="hover:text-white transition-colors">DTF Printers</Link></li>
                <li><Link to="/collections/uv-dtf-printer" className="hover:text-white transition-colors">UV DTF Printers</Link></li>
                <li><Link to="/collections/uv-printer" className="hover:text-white transition-colors">UV Printers</Link></li>
                <li><Link to="/collections/dtg-printer" className="hover:text-white transition-colors">DTG Printers</Link></li>
                <li><Link to="/collections/equipment" className="hover:text-white transition-colors">Equipments</Link></li>
                <li><Link to="/collections/consumables" className="hover:text-white transition-colors">Consumables</Link></li>
                <li><Link to="/collections/parts-accessory" className="hover:text-white transition-colors">Parts &amp; Accessory</Link></li>
                <li><Link to="/collections/dtg-printer" className="hover:text-white transition-colors">Tshirt Printers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Support</h4>
              <ul className="space-y-2 text-sm font-medium text-gray-400">
                <li><Link to="/warranty" className="hover:text-white transition-colors">Warranty</Link></li>
                <li><Link to="/repair" className="hover:text-white transition-colors">Repair Appointment</Link></li>
                <li><Link to="/showroom" className="hover:text-white transition-colors">Showroom</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-sm font-medium text-gray-400">
                <li><Link to="/pages/procolored-siphon-circulation" className="hover:text-white transition-colors">Procolored Siphon Circulation</Link></li>
                <li><Link to="/pages/our-brand" className="hover:text-white transition-colors">Our Brand</Link></li>
                <li><Link to="/pages/contact-us" className="hover:text-white transition-colors">Contact US</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Contact Us</h4>
              <ul className="space-y-2 text-sm font-medium text-gray-400">
                <li className="text-white font-bold">Before-sales:</li>
                <li><a href="mailto:support@procollored.com" className="hover:text-white">support@procollored.com</a></li>
                <li className="text-white font-bold mt-3">After-sales:</li>
                <li><a href="mailto:support@procollored.com" className="hover:text-white">support@procollored.com</a></li>
                <li className="mt-4 pt-2 border-t border-gray-800">
                  <a href="#" className="text-red-600 hover:text-red-500 font-bold">Need Help?</a>
                </li>
                <li>
                  <a href="#" className="text-red-600 hover:text-red-500 font-bold">Start Live Chat</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-center gap-4 text-xs font-medium text-gray-400 mb-4">
            <Link to="/pages/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/pages/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</Link>
            <Link to="/pages/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
            <Link to="/pages/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            <a href="#" className="hover:text-white transition-colors">Payment Methods</a>
            <a href="#" className="hover:text-white transition-colors">INTELLECTUAL PROPERTY RIGHTS</a>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
              <Globe className="w-4 h-4" />
              <span>United States</span>
            </div>
            <div className="text-xs font-medium text-gray-500">
              © 2026 Procolored. All rights reserved.
            </div>
            <div className="flex gap-2">
              <div className="w-10 h-6 bg-[#006FCF] rounded flex items-center justify-center">
                <span className="text-white text-[7px] font-bold">AMEX</span>
              </div>
              <div className="w-10 h-6 bg-black rounded flex items-center justify-center border border-gray-600">
                <span className="text-white text-[7px] font-medium"> Pay</span>
              </div>
              <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                <span className="text-[7px] font-medium">
                  <span className="text-[#4285F4]">G</span><span className="text-[#EA4335]">o</span><span className="text-[#FBBC05]">o</span><span className="text-[#4285F4]">g</span><span className="text-[#34A853]">l</span><span className="text-[#EA4335]">e</span>
                </span>
              </div>
              <div className="w-10 h-6 bg-white rounded flex items-center justify-center overflow-hidden">
                <div className="flex">
                  <div className="w-3 h-3 bg-[#EB001B] rounded-full"></div>
                  <div className="w-3 h-3 bg-[#F79E1B] rounded-full -ml-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {showChat && (
          <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-2xl overflow-hidden animate-slide-in">
            <div className="bg-red-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Hi there 👋</p>
                  <p className="text-white/80 text-xs font-medium">We reply immediately</p>
                </div>
              </div>
              <button onClick={() => setShowChat(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <input 
                type="text" 
                placeholder="Enter your message..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:border-red-600"
              />
            </div>
          </div>
        )}
        <button 
          onClick={() => setShowChat(!showChat)}
          className="w-14 h-14 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center shadow-lg transition-colors"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
      </div>
      <CartDrawer />
    </div>
  );
}
