import { useState, useEffect, useRef } from 'react';
import { 
  Search, User, ShoppingCart, ChevronDown, Menu, X, 
  ChevronLeft, ChevronRight, Play, MessageCircle, 
  Headphones, BookOpen, CreditCard, Globe,
  Facebook, Twitter, Instagram, Youtube, Linkedin, 
  MapPin, Award, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import './App.css';

// Types
interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  originalPrice?: string;
  image: string;
  badge?: string;
  badgeColor?: string;
}

interface CraftItem {
  name: string;
  image: string;
}

interface Testimonial {
  name: string;
  description: string;
  image: string;
  videoId?: string;
}

interface Review {
  source: string;
  logo: string;
  quote: string;
}

// Hero slides - 8 images only, no text
const heroSlides = [
  { id: 1, image: "/images/slide-1.webp" },
  { id: 2, image: "/images/slide-2.webp" },
  { id: 3, image: "/images/slide-3.webp" },
  { id: 4, image: "/images/slide-4.webp" },
  { id: 5, image: "/images/slide-5.webp" },
  { id: 6, image: "/images/slide-6.webp" },
  { id: 7, image: "/images/slide-7.webp" },
  { id: 8, image: "/images/slide-8.webp" }
];

const stats = [
  { value: "140+", label: "Global Reach" },
  { value: "30K+", label: "Customer Base" },
  { value: "50+", label: "Service Centers" },
  { value: "45%", label: "R&D Personnel" },
  { value: "300+", label: "Authorized Patents" },
  { value: "10+", label: "Worldwide Logistics" }
];

const popularProducts: Product[] = [
  {
    id: "1",
    name: "Procolored K13 Lite DTF Printer 13\" A3 & Oven Premium - Pink",
    subtitle: "",
    price: "Rs.798,000.00 PKR",
    originalPrice: "Rs.1,140,200.00 PKR",
    image: "/images/product-k13-pink.jpg",
    badge: "Save Rs.342,200",
    badgeColor: "bg-red-500"
  },
  {
    id: "2",
    name: "Procolored K13 Lite DTF Printer 13\" A3 & Oven Premium - White",
    subtitle: "",
    price: "Rs.798,000.00 PKR",
    originalPrice: "Rs.1,140,200.00 PKR",
    image: "/images/product-k13-white.jpg",
    badge: "Save Rs.342,200",
    badgeColor: "bg-red-500"
  },
  {
    id: "3",
    name: "Procolored F13 Panda DTF Printer 13\" A3 L1800 & Oven",
    subtitle: "",
    price: "Rs.855,000.00 PKR",
    originalPrice: "Rs.997,000.00 PKR",
    image: "/images/product-f13-panda.jpg",
    badge: "BEST SELLER",
    badgeColor: "bg-orange-500"
  },
  {
    id: "4",
    name: "Procolored P13 DTF Printer 13\" A3 XP600 & Oven",
    subtitle: "",
    price: "Rs.1,140,100.00 PKR",
    originalPrice: "Rs.1,311,200.00 PKR",
    image: "/images/product-p13.jpg",
    badge: "NEW ARRIVAL",
    badgeColor: "bg-green-500"
  },
  {
    id: "5",
    name: "Procolored VF13 Pro DTF Printer 13\" A3+",
    subtitle: "",
    price: "Rs.1,967,000.00 PKR",
    image: "/images/product-vf13.jpg",
    badge: "NEW ARRIVAL",
    badgeColor: "bg-green-500"
  }
];

const categoryTabs = [
  {
    id: "personal",
    label: "Personal Studio",
    products: [
      { id: "p1", name: "Procolored K13 Lite", subtitle: "User-friendly", image: "/images/product-k13-white.jpg" },
      { id: "p2", name: "Procolored P13", subtitle: "High-Performance Print Head", image: "/images/product-p13.jpg" },
      { id: "p3", name: "Procolored F13", subtitle: "High-quality and Easy-to-use", image: "/images/product-f13-panda.jpg" }
    ]
  },
  {
    id: "hobbyist",
    label: "Hobbyist Use",
    products: [
      { id: "h1", name: "Procolored K13 Lite", subtitle: "Best Value Starter Printer", image: "/images/product-k13-pink.jpg" },
      { id: "h2", name: "Procolored F8", subtitle: "Affordable Entry-level Model", image: "/images/product-f8.jpg" },
      { id: "h3", name: "Procolored F13", subtitle: "Designed for Creative Makers", image: "/images/product-f13-panda.jpg" }
    ]
  },
  {
    id: "factory",
    label: "Small-scale Factory",
    products: [
      { id: "f1", name: "Procolored P13", subtitle: "Stable Printing Speed", image: "/images/product-p13.jpg" },
      { id: "f2", name: "Procolored F13 Pro", subtitle: "Perfect for Growing Businesses", image: "/images/product-f13-pro.jpg" },
      { id: "f3", name: "Procolored VF13 Pro", subtitle: "Versatile Applications", image: "/images/product-vf13-pro.jpg" }
    ]
  }
];

const categoryItems = [
  { name: "UV DTF Printer", image: "/images/cat-uv-dtf.jpg", link: "#" },
  { name: "UV Printer", image: "/images/cat-uv.jpg", link: "#" },
  { name: "DTG Printer", image: "/images/cat-dtg.jpg", link: "#" },
  { name: "Equipment", image: "/images/cat-equipment.jpg", link: "#" },
  { name: "Consumables", image: "/images/cat-consumables.jpg", link: "#" },
  { name: "Parts & Accessory", image: "/images/cat-parts.jpg", link: "#" }
];

const craftItemsRow1: CraftItem[] = [
  { name: "Apron", image: "/images/craft-apron.jpg" },
  { name: "Metal Signs", image: "/images/craft-metal-signs.jpg" },
  { name: "Thermos", image: "/images/craft-thermos.jpg" },
  { name: "Fabric Posters", image: "/images/craft-posters.jpg" },
  { name: "Jeans", image: "/images/craft-tshirts.jpg" },
  { name: "Candle Mold", image: "/images/craft-mugs.jpg" },
  { name: "Hoodie", image: "/images/craft-hoodie.jpg" },
  { name: "Baby Clothes", image: "/images/craft-baby-clothes.jpg" },
  { name: "Flashcards", image: "/images/craft-posters.jpg" }
];

const craftItemsRow2: CraftItem[] = [
  { name: "Polo Shirt", image: "/images/craft-tshirts.jpg" },
  { name: "T-shirts", image: "/images/craft-tshirts.jpg" },
  { name: "Caps", image: "/images/craft-caps.jpg" },
  { name: "Phone Cases", image: "/images/craft-phone-cases.jpg" },
  { name: "Coffee Mugs", image: "/images/craft-mugs.jpg" },
  { name: "Bags", image: "/images/craft-bags.jpg" },
  { name: "School Bags", image: "/images/craft-backpacks.jpg" },
  { name: "Keychains", image: "/images/craft-keychains.jpg" }
];

const testimonials: Testimonial[] = [
  {
    name: "Alyssa Boan",
    description: "Alyssa Boan is from Indiana and she is running a business of shirt designing. She focused on creating new things and exploring the unknown.",
    image: "/images/testimonial-alyssa.jpg",
    videoId: "fUQd-CC7k1o"
  },
  {
    name: "David DeGraaf",
    description: "David runs Ash Wood Shop, specializing in custom DTF printing. He chose Procolored's compact F13 DTF printer for its flexibility, low waste, and ease of use.",
    image: "/images/testimonial-david.jpg",
    videoId: "mg3oWlQT4T0"
  },
  {
    name: "Mr. Kyle",
    description: "Mr. Kyle is the owner of Lexi-Lium Design in New York. His business has been successfully using Procolored printers since 2022, starting with the dual-head DTF Pro printer.",
    image: "/images/testimonial-david.jpg",
    videoId: "vTufzbJaIOo"
  },
  {
    name: "Laura Trevino",
    description: "She enjoys painting, photography and T-shirt designing. Laura continously seeks to exceed customer expectations through the artistry of clothing.",
    image: "/images/testimonial-roxana.jpg",
    videoId: "dlp96Zw6rjw"
  },
  {
    name: "Roxana Travieso",
    description: "Roxana Travieso is a creative YouTuber and social media content creator known for her DIY, crafting, and printing-related videos.",
    image: "/images/testimonial-roxana.jpg",
    videoId: "wNamqcXECFc"
  }
];


const features = [
  {
    icon: Headphones,
    title: "Customer Support",
    description: "The tech support team and in-person customer service will provide instant and attentive assistance"
  },
  {
    icon: BookOpen,
    title: "Product Training",
    description: "Tutorials and Training are designed to equip you with the knowledge and skills necessary"
  },
  {
    icon: CreditCard,
    title: "Pay with Ease",
    description: "Secure payment systems accept major credit/debit cards and offer flexible financing plans"
  },
  {
    icon: Shield,
    title: "Warranty",
    description: "12-month warranty for most machine components assures every satisfying purchase and experience"
  }
];

const mediaReviews: Review[] = [
  {
    source: "Geeky Gadgets",
    logo: "Geeky Gadgets",
    quote: "Whether you are looking to create custom clothing for yourself, involve the family in a creative project, or explore the beginnings of a small T-shirt printing business, this setup delivers a complete and well thought out workflow. It feels capable, reliable, and surprisingly approachable."
  },
  {
    source: "techradar",
    logo: "techradar",
    quote: "Printing from PC to textiles via transfer film is simplified by this dedicated DTF printer. It can print large eye-catching graphics onto any kind of cloth with an efficiency that will interest both hobbyists and established print shops."
  },
  {
    source: "CNET",
    logo: "CNET",
    quote: "It works very well to make small batches of products, so using the Panda F8 to print unique clothing items for your Etsy store is better than using a Cricut or sublimation printer, especially for shirts that are not white."
  }
];

// Products dropdown data
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

const supportLinks = ["Resource & Download", "Warranty", "Showroom", "Repair Appointment", "Model Comparison", "Color Channels"];
const aboutUsLinks = ["Procolored Siphon Circulation", "Our Brand", "Contact US"];

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategoryTab, setActiveCategoryTab] = useState("personal");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [productScrollPosition, setProductScrollPosition] = useState(0);
  const [testimonialScrollPosition, setTestimonialScrollPosition] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  
  // Dropdown states
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-advance hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const scrollProducts = (direction: 'left' | 'right') => {
    const container = document.getElementById('products-container');
    if (container) {
      const scrollAmount = 320;
      const newPosition = direction === 'left' 
        ? Math.max(0, productScrollPosition - scrollAmount)
        : Math.min(container.scrollWidth - container.clientWidth, productScrollPosition + scrollAmount);
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setProductScrollPosition(newPosition);
    }
  };

  const scrollTestimonials = (direction: 'left' | 'right') => {
    const container = document.getElementById('testimonials-container');
    if (container) {
      const scrollAmount = 400;
      const newPosition = direction === 'left'
        ? Math.max(0, testimonialScrollPosition - scrollAmount)
        : Math.min(container.scrollWidth - container.clientWidth, testimonialScrollPosition + scrollAmount);
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setTestimonialScrollPosition(newPosition);
    }
  };

  const handleDropdownEnter = (dropdown: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(dropdown);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden w-full">
      {/* Top Announcement Banner */}
      <div className="w-full">
        <img 
          src="/images/top-banner.png" 
          alt="Announcement Banner"
          className="w-full object-cover min-h-[90px] md:min-h-[110px]"
          style={{ display: 'block' }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-[100] bg-white border-b border-gray-100 w-full" style={{position:'sticky', top:0}}>
        <div className="max-w-7xl mx-auto px-4">
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between h-16">
            {/* Logo + Desktop Nav */}
            <div className="flex items-center gap-8">
              <a href="#" className="flex items-center">
                <img 
                  src="https://i.postimg.cc/fTQtLtrH/procolored-logo-4k-transparent1.png" 
                  alt="Procolored"
                  className="h-14 w-auto object-contain"
                />
              </a>
              
              {/* Desktop Navigation */}
              <nav className="flex items-center gap-6">
                {/* Products Trigger ΓÇö panel is rendered at header level below */}
                <div 
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter('products')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button className={`flex items-center gap-1 text-[15px] font-medium text-black nav-link ${activeDropdown === 'products' ? 'nav-link-active text-[#E85A24]' : ''}`}>
                    Products <ChevronDown className="w-4 h-4" />
                  </button>
                  {/* Invisible bridge strip keeps hover alive when moving to panel */}
                  {activeDropdown === 'products' && (
                    <div className="absolute top-full left-0 h-3 w-56" />
                  )}
                </div>

                <a href="#" className="flex items-center gap-1 text-[15px] font-medium text-black nav-link">
                  <span className="text-yellow-500">≡ƒöö</span> F13 Appreciation Deals
                </a>
                <a href="#" className="text-[15px] font-medium text-black nav-link">Procolored Programs</a>
                
                {/* Support Dropdown */}
                <div 
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter('support')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button className={`flex items-center gap-1 text-[15px] font-medium text-black nav-link ${activeDropdown === 'support' ? 'nav-link-active text-[#E85A24]' : ''}`}>
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
                        <a key={idx} href="#" className="block px-5 py-2.5 text-sm text-black hover:text-[#E85A24] hover:bg-gray-50 transition-colors whitespace-nowrap">
                          {link}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* About Us Dropdown */}
                <div 
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter('about')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button className={`flex items-center gap-1 text-[15px] font-medium text-black nav-link ${activeDropdown === 'about' ? 'nav-link-active text-[#E85A24]' : ''}`}>
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

            {/* Desktop Right Actions */}
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

          {/* Mobile Header - hamburger left | Logo center | icons right */}
          <div className="lg:hidden flex items-center justify-between h-14" style={{position:'relative'}}>
            {/* Left: X (close) or hamburger */}
            <button 
              className="p-2 rounded-full transition-colors w-10 h-10 flex items-center justify-center"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Center: Logo */}
            <a href="#" className="absolute left-1/2 -translate-x-1/2">
              <img 
                src="https://i.postimg.cc/fTQtLtrH/procolored-logo-4k-transparent1.png" 
                alt="Procolored"
                className="h-11 w-auto object-contain"
              />
            </a>

            {/* Right: search + user + cart */}
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-full transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full transition-colors">
                <User className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full transition-colors relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-xs rounded-full flex items-center justify-center">0</span>
              </button>
            </div>
          </div>
        </div>

        {/* Products Mega Dropdown ΓÇö direct child of header, sits below navbar */}
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
                    <a key={idx} href="#" className={`flex items-center justify-between text-sm py-2 px-3 rounded transition-colors ${
                      idx === 0 ? 'text-[#E85A24] font-medium' : 'text-black hover:text-[#E85A24]'
                    }`}>
                      <span>{cat.name}</span>
                      {cat.hasArrow && <ChevronRight className="w-3 h-3" />}
                    </a>
                  ))}
                </div>
                <a href="#" className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-full text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-700 transition-colors">
                  <span>≡ƒôè</span> Machine Comparison
                </a>
              </div>
              <div className="flex-1 p-6">
                <div className="grid grid-cols-4 gap-6">
                  {productsDropdown.series.map((series, sIdx) => (
                    <div key={sIdx}>
                      <h4 className="text-sm font-semibold text-black mb-3 border-b pb-2">{series.name}</h4>
                      <div className="space-y-4">
                        {series.products.map((product, pIdx) => (
                          <a key={pIdx} href="#" className="block text-center group">
                            <div className="bg-gray-50 rounded-lg p-3 mb-2 group-hover:bg-gray-100 transition-colors">
                              <img src={product.image} alt={product.name} className="w-full h-24 object-contain" />
                            </div>
                            {product.badge && (
                              <span className={`text-xs font-semibold uppercase tracking-wide ${
                                product.badge === 'BEST SELLER' ? 'text-[#E85A24]' : 'text-red-500'
                              }`}>
                                {product.badge === 'BEST SELLER' ? '≡ƒöÑ ' : ''}{product.badge}
                              </span>
                            )}
                            <p className="text-xs text-black font-medium mt-1 group-hover:text-[#E85A24] transition-colors">{product.name}</p>
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-right border-t pt-3">
                  <a href="#" className="inline-flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-full text-sm text-black hover:text-[#E85A24] hover:border-[#E85A24] transition-colors">
                    View all <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Slide-in Menu */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-14 bg-white z-50 overflow-y-auto animate-slide-in">
            <nav className="flex flex-col px-4 pt-4 pb-8">
              <a href="#" className="flex items-center justify-between py-4 border-b border-gray-100 text-base font-medium text-black">
                <span>Products</span><ChevronRight className="w-4 h-4 text-gray-400" />
              </a>
              <a href="#" className="flex items-center py-4 border-b border-gray-100 text-base font-medium" style={{color:'#E85A24'}}>
                <span className="mr-2">≡ƒöö</span> F13 Appreciation Deals
              </a>
              <a href="#" className="flex items-center py-4 border-b border-gray-100 text-base font-medium text-black">
                Procolored Programs
              </a>
              <a href="#" className="flex items-center justify-between py-4 border-b border-gray-100 text-base font-medium text-black">
                <span>Support</span><ChevronRight className="w-4 h-4 text-gray-400" />
              </a>
              <a href="#" className="flex items-center justify-between py-4 border-b border-gray-100 text-base font-medium text-black">
                <span>About Us</span><ChevronRight className="w-4 h-4 text-gray-400" />
              </a>
              <a href="#" className="flex items-center py-4 border-b border-gray-100 text-base font-medium text-black">
                <span className="mr-2 w-6 h-6 bg-red-600 rounded flex items-center justify-center text-white text-xs">≡ƒôè</span>
                Machine Comparison
              </a>

              {/* Social Icons */}
              <div className="flex items-center gap-5 mt-8 justify-center">
                <Facebook className="w-5 h-5 text-black" />
                <Globe className="w-5 h-5 text-black" />
                <Instagram className="w-5 h-5 text-black" />
                <Youtube className="w-5 h-5 text-black" />
                <Linkedin className="w-5 h-5 text-black" />
                <Globe className="w-5 h-5 text-black" />
              </div>
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-600">
                <Globe className="w-4 h-4" /> United States
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Carousel - Images Only */}
      <section className="relative w-full overflow-hidden" style={{height:'clamp(220px, 45vw, 600px)'}}>
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <img 
              src={slide.image} 
              alt={`Slide ${slide.id}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        
        {/* Carousel Navigation */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
        
        {/* Carousel Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'bg-white w-6' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section with No.1 Image */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10 px-2">
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
              <span className="text-xl sm:text-2xl md:text-3xl font-bold text-black whitespace-nowrap">Global</span>
              <img 
                src="/images/feature-icon.png" 
                alt="No.1"
                className="h-20 sm:h-24 md:h-32 lg:h-36 w-auto object-contain flex-shrink-0"
              />
              <span className="text-xl sm:text-2xl md:text-3xl font-bold text-black whitespace-nowrap">Desktop DTF Printer Brand</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-black mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Most Popular Products */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-black">Most Popular</h2>
            <a href="#" className="text-sm text-red-600 hover:underline flex items-center gap-1 font-medium">
              View All <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          
          <div className="relative overflow-hidden">
            <div 
              id="products-container"
              className="flex gap-4 overflow-x-auto hide-scrollbar scroll-smooth pb-4"
              style={{WebkitOverflowScrolling:'touch'}}
            >
              {popularProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="flex-shrink-0 bg-white rounded-lg overflow-hidden shadow-card hover:shadow-hover transition-shadow"
                  style={{width:'clamp(220px, 75vw, 280px)'}}
                >
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {product.badge && (
                      <Badge className={`absolute top-3 left-3 ${product.badgeColor} text-white`}>
                        {product.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-sm mb-2 line-clamp-2 text-black">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-red-600 font-bold">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-gray-400 text-sm line-through">{product.originalPrice}</span>
                      )}
                    </div>
                    <button className="w-full btn-buy-outline py-2 rounded text-sm font-medium">
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Scroll Buttons */}
            <button 
              onClick={() => scrollProducts('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scrollProducts('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Shop By Category */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-8">Shop By Category</h2>
          
          {/* Tabs - scrollable on mobile */}
          <div className="flex gap-4 mb-8 overflow-x-auto hide-scrollbar pb-1" style={{WebkitOverflowScrolling:'touch'}}>
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategoryTab(tab.id)}
                className={`px-5 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap ${
                  activeCategoryTab === tab.id 
                    ? 'bg-black text-white rounded-sm' 
                    : 'text-black hover:text-[#E85A24]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categoryTabs.find(t => t.id === activeCategoryTab)?.products.map((product) => (
              <div key={product.id} className="text-center">
                <h3 className="font-bold text-lg mb-1 text-black">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 font-medium">{product.subtitle}</p>
                <div className="bg-gray-50 rounded-lg p-6 mb-4">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-contain"
                  />
                </div>
                <div className="flex gap-3 justify-center">
                  <button className="flex-1 max-w-[120px] text-sm font-medium text-black hover:text-[#E85A24] transition-colors py-2">
                    Learn More
                  </button>
                  <button className="flex-1 max-w-[120px] bg-[#E85A24] hover:bg-[#d44e1e] text-white text-sm font-medium py-2 px-4 rounded transition-colors duration-200">
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Icons with Images */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {categoryItems.map((cat, index) => (
              <a 
                key={index} 
                href={cat.link}
                className="flex flex-col items-center gap-3 group"
              >
                <div className="w-20 h-20 bg-white rounded-lg shadow-sm flex items-center justify-center group-hover:shadow-md transition-shadow overflow-hidden">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-center">
                  <span className="text-sm font-bold text-black block">{cat.name}</span>
                  <span className="text-xs text-red-600 font-medium">Buy Now &gt;</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* What You Can Craft - Continuous Scrolling Marquee */}
      <section className="py-12 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-black text-center">
            What You Can Craft with<br />Procolored Printers
          </h2>
        </div>
        
        {/* Row 1 - Scrolls Left */}
        <div className="relative mb-4">
          <div className="marquee-container">
            <div className="marquee-row-1">
              {[...craftItemsRow1, ...craftItemsRow1, ...craftItemsRow1].map((item, index) => (
                <div key={index} className="flex-shrink-0 w-[200px] mx-2">
                  <div className="relative overflow-hidden rounded-lg">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-[200px] object-cover"
                    />
                  </div>
                  <p className="text-center text-sm font-bold text-black mt-2">{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Row 2 - Scrolls Right */}
        <div className="relative">
          <div className="marquee-container">
            <div className="marquee-row-2">
              {[...craftItemsRow2, ...craftItemsRow2, ...craftItemsRow2].map((item, index) => (
                <div key={index} className="flex-shrink-0 w-[200px] mx-2">
                  <div className="relative overflow-hidden rounded-lg">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-[200px] object-cover"
                    />
                  </div>
                  <p className="text-center text-sm font-bold text-black mt-2">{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-black">
              Check Out What Our<br />Customers Are Saying
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={() => scrollTestimonials('left')}
                className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => scrollTestimonials('right')}
                className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div 
            id="testimonials-container"
            className="flex gap-5 overflow-x-auto hide-scrollbar scroll-smooth pb-4"
            style={{WebkitOverflowScrolling:'touch'}}
          >
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="flex-shrink-0 bg-white rounded-xl overflow-hidden shadow-card"
                style={{width:'clamp(280px, 75vw, 320px)'}}
              >
                {/* Video / Thumbnail area */}
                <div className="relative" style={{paddingBottom:'56.25%', height:0}}>
                  {testimonial.videoId && playingVideo === testimonial.videoId ? (
                    <iframe
                      className="absolute inset-0 w-full h-full rounded-t-xl"
                      src={`https://www.youtube.com/embed/${testimonial.videoId}?autoplay=1&rel=0&modestbranding=1`}
                      title={testimonial.name}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <button
                      className="absolute inset-0 w-full h-full group"
                      onClick={() => testimonial.videoId && setPlayingVideo(testimonial.videoId)}
                      aria-label={`Play ${testimonial.name}'s video`}
                    >
                      {/* YouTube thumbnail */}
                      <img
                        src={testimonial.videoId
                          ? `https://img.youtube.com/vi/${testimonial.videoId}/hqdefault.jpg`
                          : testimonial.image
                        }
                        alt={testimonial.name}
                        className="w-full h-full object-cover absolute inset-0"
                      />
                      {/* Dark overlay on hover */}
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                      {/* Play button circle ΓÇö matches reference exactly */}
                      {testimonial.videoId && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 bg-white/85 hover:bg-white group-hover:scale-110 transition-transform rounded-full flex items-center justify-center shadow-md">
                            <Play className="w-6 h-6 text-gray-700 ml-1" fill="currentColor" />
                          </div>
                        </div>
                      )}
                    </button>
                  )}
                </div>
                {/* Text */}
                <div className="p-4">
                  <h3 className="font-bold text-base mb-1.5 text-black">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{testimonial.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Procolored */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-black text-center mb-10">
            Why Procolored Is Right for You
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-red-600 text-white rounded-xl p-6 text-center"
              >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-white/90">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Reviews */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative">
            {/* Review Content */}
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-red-600 mb-4">
                {mediaReviews[reviewIndex].logo}
              </h3>
              <p className="text-black text-lg leading-relaxed max-w-2xl mx-auto font-medium">
                "{mediaReviews[reviewIndex].quote}"
              </p>
            </div>
            
            {/* Navigation */}
            <div className="flex justify-between items-center absolute top-1/2 -translate-y-1/2 w-full px-4">
              <button 
                onClick={() => setReviewIndex((prev) => (prev - 1 + mediaReviews.length) % mediaReviews.length)}
                className="w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setReviewIndex((prev) => (prev + 1) % mediaReviews.length)}
                className="w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            {/* Logos */}
            <div className="flex justify-center gap-8 mt-8 pt-8 border-t border-gray-200">
              {mediaReviews.map((review, index) => (
                <button
                  key={index}
                  onClick={() => setReviewIndex(index)}
                  className={`text-sm font-bold transition-colors ${
                    index === reviewIndex ? 'text-red-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {review.logo}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-white">
        {/* Footer Top */}
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
        
        {/* Footer Links */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
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
              <h4 className="font-bold mb-4 text-white">Program</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Affiliate</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Share & Earn Program</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Freelance Engineer Signup</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Distributor Sign Up</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Education Discount</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Procolored Loyalty Program</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Procolored Instructor Program</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Resources</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Warranty</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Repair Appointment</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Model Comparison</a></li>
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
                <li>Sales@procolored.com</li>
                <li className="text-white font-medium mt-3">After-sales:</li>
                <li>Support@procolored.com</li>
                <li className="text-white font-medium mt-3">Phone Service:</li>
                <li>Monday to Sunday 9:00AM - 5:00PM (PT)</li>
                <li className="text-white font-medium mt-3">Call:</li>
                <li>+1 877 717 1666</li>
                <li className="mt-3">
                  <a href="#" className="text-red-600 hover:underline font-medium">Need Help?</a>
                </li>
                <li>
                  <a href="#" className="text-red-600 hover:underline font-medium">Start Live Chat</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom */}
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
              ┬⌐ 2026 Procolored. All rights reserved.
            </div>
            {/* Payment Icons */}
            <div className="flex gap-2">
              {/* Amex */}
              <div className="w-10 h-6 bg-[#006FCF] rounded flex items-center justify-center">
                <span className="text-white text-[7px] font-bold">AMEX</span>
              </div>
              {/* Apple Pay */}
              <div className="w-10 h-6 bg-black rounded flex items-center justify-center border border-gray-600">
                <span className="text-white text-[7px] font-medium">∩ú┐ Pay</span>
              </div>
              {/* Google Pay */}
              <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                <span className="text-[7px] font-medium">
                  <span className="text-[#4285F4]">G</span>
                  <span className="text-[#EA4335]">o</span>
                  <span className="text-[#FBBC05]">o</span>
                  <span className="text-[#4285F4]">g</span>
                  <span className="text-[#34A853]">l</span>
                  <span className="text-[#EA4335]">e</span>
                </span>
              </div>
              {/* Mastercard */}
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
                  <p className="text-white font-medium text-sm">Hi there ≡ƒæï</p>
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

export default App;
