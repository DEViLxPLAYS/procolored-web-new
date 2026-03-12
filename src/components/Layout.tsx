import { useState, useRef } from 'react';
import { 
  Search, User, ShoppingCart, ChevronDown, Menu, X, 
  ChevronRight, MessageCircle, Headphones, Globe,
  Facebook, Twitter, Instagram, Youtube, Linkedin, 
  MapPin, Award, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Outlet, Link } from 'react-router-dom';

const productsDropdown = {
  categories: [
    { name: "Direct to Film Transfer (DTF) Printer", hasArrow: true },
    { name: "UV DTF Printer", hasArrow: false },
    { name: "UV Printer", hasArrow: false },
    { name: "DTG Printer", hasArrow: false },
    { name: "Equipment", hasArrow: false },
    { name: "Consumables", hasArrow: false },
    { name: "Parts & Accessory", hasArrow: false },
    { name: "What's New", hasArrow: false },
    { name: "Extended Warranty", hasArrow: false },
  ],
  series: [
    { name: "K Series", products: [
      { name: "Procolored K13 Lite", badge: "NEW ARRIVAL", image: "/images/product-k13-white.jpg" },
    ]},
    { name: "P Series", products: [
      { name: "Procolored P13", badge: "NEW ARRIVAL", image: "/images/product-p13.jpg" },
    ]},
    { name: "F Series", products: [
      { name: "Procolored F13 Pro", badge: null, image: "/images/product-f13-pro.jpg" },
      { name: "Procolored F13", badge: "BEST SELLER", image: "/images/product-f13-panda.jpg" },
      { name: "Procolored F8", badge: null, image: "/images/product-f8.jpg" },
    ]}
  ]
};

const supportLinks = [
  { name: "Showroom", path: "/showroom" },
  { name: "Repair", path: "/repair" },
  { name: "Warranty", path: "/warranty" }
];
const aboutUsLinks = ["Procolored Siphon Circulation", "Our Brand", "Contact US"];

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      <div className="w-full">
        <img 
          src="/images/top-banner.png" 
          alt="Announcement Banner"
          className="w-full object-cover min-h-[90px] md:min-h-[110px]"
          style={{ display: 'block' }}
        />
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
                  <button className={`flex items-center gap-1 text-[15px] font-medium text-black nav-link transition-colors ${activeDropdown === 'products' ? 'nav-link-active text-[#E85A24]' : ''}`}>
                    Products <ChevronDown className="w-4 h-4" />
                  </button>
                  {/* Indicator for hovered state matched with CSS if needed */}
                  {activeDropdown === 'products' && (
                    <div className="absolute top-full left-0 h-3 w-56" />
                  )}
                </div>

                <Link to="/" className="flex items-center gap-1 text-[15px] font-medium text-black nav-link">
                  <span className="text-yellow-500">🔔</span> F13 Appreciation Deals
                </Link>
                
                <div 
                  className="relative group"
                  onMouseEnter={() => handleDropdownEnter('support')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button className={`flex items-center gap-1 text-[15px] font-medium text-black nav-link transition-colors ${activeDropdown === 'support' ? 'nav-link-active text-[#E85A24]' : ''}`}>
                    Support <ChevronDown className="w-4 h-4" />
                  </button>
                  {activeDropdown === 'support' && (
                    <div 
                      className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl z-[9999] py-2 border border-gray-100 animate-slide-in"
                      style={{minWidth: '220px'}}
                      onMouseEnter={() => handleDropdownEnter('support')}
                      onMouseLeave={handleDropdownLeave}
                    >
                      {supportLinks.map((link, idx) => (
                        <Link key={idx} to={link.path} className="block px-5 py-2.5 text-sm text-black hover:text-[#E85A24] hover:bg-gray-50 transition-colors whitespace-nowrap">
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
                  <button className={`flex items-center gap-1 text-[15px] font-medium text-black nav-link transition-colors ${activeDropdown === 'about' ? 'nav-link-active text-[#E85A24]' : ''}`}>
                    About Us <ChevronDown className="w-4 h-4" />
                  </button>
                  {activeDropdown === 'about' && (
                    <div 
                      className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl z-[9999] py-2 border border-gray-100 animate-slide-in"
                      style={{minWidth: '240px'}}
                      onMouseEnter={() => handleDropdownEnter('about')}
                      onMouseLeave={handleDropdownLeave}
                    >
                      {aboutUsLinks.map((link, idx) => (
                        <a key={idx} href="#" className="block px-5 py-2.5 text-sm text-black hover:text-[#E85A24] hover:bg-gray-50 transition-colors whitespace-nowrap">
                          {link}
                        </a>
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
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-xs rounded-full flex items-center justify-center">0</span>
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
              <button className="p-2 rounded-full transition-colors relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-xs rounded-full flex items-center justify-center">0</span>
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
                  {productsDropdown.categories.map((cat, idx) => (
                    <a key={idx} href="#" className={`group flex items-center justify-between text-sm py-2 px-3 rounded transition-colors ${
                      idx === 0 ? 'text-[#E85A24] font-medium' : 'text-black hover:text-[#E85A24]'
                    }`}>
                      {/* Smooth hover highlight simulation */}
                      <span className="relative z-10">{cat.name}</span>
                      {cat.hasArrow && <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />}
                      <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 rounded transition-opacity pointer-events-none -z-0"></div>
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex-1 p-6">
                <div className="grid grid-cols-4 gap-6">
                  {productsDropdown.series.map((series, sIdx) => (
                    <div key={sIdx}>
                      <h4 className="text-sm font-semibold text-black mb-3 border-b pb-2">{series.name}</h4>
                      <div className="space-y-4">
                        {series.products.map((product, pIdx) => (
                          <Link key={pIdx} to={product.name.includes("F13") && !product.name.includes("Pro") ? "/f13" : "#"} className="block text-center group">
                            <div className="bg-gray-50 rounded-lg p-3 mb-2 group-hover:bg-gray-100 transition-colors group-hover:shadow-md">
                              <img src={product.image} alt={product.name} className="w-full h-24 object-contain group-hover:scale-105 transition-transform" />
                            </div>
                            {product.badge && (
                              <span className={`text-xs font-semibold uppercase tracking-wide ${
                                product.badge === 'BEST SELLER' ? 'text-[#E85A24]' : 'text-red-500'
                              }`}>
                                {product.badge === 'BEST SELLER' ? '🔥 ' : ''}{product.badge}
                              </span>
                            )}
                            <p className="text-xs text-black font-medium mt-1 group-hover:text-[#E85A24] transition-colors">{product.name}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-right border-t pt-3">
                  <Link to="/collections/all" className="inline-flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-full text-sm text-black hover:text-[#E85A24] hover:border-[#E85A24] transition-colors">
                    Collections <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Slide-in Menu */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-14 bg-white z-50 overflow-y-auto animate-slide-in flex flex-col">
            <nav className="flex flex-col px-4 pt-4 pb-8 flex-1">
              <a href="#" className="flex items-center justify-between py-4 border-b border-gray-100 text-base font-medium text-black">
                <span>Products</span><ChevronRight className="w-4 h-4 text-gray-400" />
              </a>
              <Link to="/" className="flex items-center py-4 border-b border-gray-100 text-base font-medium text-[#E85A24]">
                <span className="mr-2">🔔</span> F13 Appreciation Deals
              </Link>
              <a href="#" className="flex items-center justify-between py-4 border-b border-gray-100 text-base font-medium text-black">
                <span>Support</span><ChevronRight className="w-4 h-4 text-gray-400" />
              </a>
              <a href="#" className="flex items-center justify-between py-4 border-b border-gray-100 text-base font-medium text-black">
                <span>About Us</span><ChevronRight className="w-4 h-4 text-gray-400" />
              </a>

              <div className="flex items-center gap-5 mt-8 justify-center">
                <Facebook className="w-5 h-5 text-black" />
                <Globe className="w-5 h-5 text-black" />
                <Instagram className="w-5 h-5 text-black" />
                <Youtube className="w-5 h-5 text-black" />
                <Linkedin className="w-5 h-5 text-black" />
              </div>
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-600">
                <Globe className="w-4 h-4" /> United States
              </div>
            </nav>
          </div>
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
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Headphones className="w-4 h-4" />
                  <span>22/6 Customer Support</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>Local Engineers</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Shield className="w-4 h-4" />
                  <span>6-Month Print Head Warranty</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Award className="w-4 h-4" />
                  <span>Lifetime Customer Support</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-white">Get the latest on Procolored products, chance of free trials, and more.</h3>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter Your Email"
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
                />
                <Button className="bg-red-600 hover:bg-red-700 text-white font-bold">
                  SUBSCRIBE
                </Button>
              </div>
              <div className="flex gap-4 mt-4">
                <Facebook className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Instagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Youtube className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Originally 5 columns, now 4 columns because Programs is removed */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold mb-4 text-white">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">DTF Printers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">UV DTF Printers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">UV Printers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">DTG Printers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Equipments</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Consumables</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Parts & Accessory</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tshirt Printers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Resources</a></li>
                <li><Link to="/warranty" className="hover:text-white transition-colors">Warranty</Link></li>
                <li><Link to="/repair" className="hover:text-white transition-colors">Repair Appointment</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Join Our Group</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Procolored Siphon Circulation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Our Brand</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact US</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Contact Us</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="text-white font-medium">Before-sales:</li>
                <li><a href="mailto:test@procolored.com" className="hover:text-white">test@procolored.com</a></li>
                <li className="text-white font-medium mt-3">After-sales:</li>
                <li><a href="mailto:test@procolored.com" className="hover:text-white">test@procolored.com</a></li>
                <li className="mt-4 pt-2 border-t border-gray-800">
                  <a href="#" className="text-red-600 hover:underline font-medium">Need Help?</a>
                </li>
                <li>
                  <a href="#" className="text-red-600 hover:underline font-medium">Start Live Chat</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400 mb-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Shipping Policy</a>
            <a href="#" className="hover:text-white transition-colors">Refund Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Payment Methods</a>
            <a href="#" className="hover:text-white transition-colors">INTELLECTUAL PROPERTY RIGHTS</a>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Globe className="w-4 h-4" />
              <span>United States</span>
            </div>
            <div className="text-xs text-gray-500">
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

      <div className="fixed bottom-6 right-6 z-50">
        {showChat && (
          <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-2xl overflow-hidden animate-slide-in">
            <div className="bg-red-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Hi there 👋</p>
                  <p className="text-white/80 text-xs">We reply immediately</p>
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
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-600"
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
    </div>
  );
}
